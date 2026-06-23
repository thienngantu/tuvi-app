// src/lib/tuvi-engine/ziwei/phi-hoa.ts
// ====================================================================
// PHI HÓA CAN CUNG — Calculator thuần (Tầng 1)
//
// Input:  12 cung đã an sao (palaces) + bảng tra Tứ Hóa (SIHUA_BY_STEM)
// Output: Mảng mũi tên Phi Hóa (cung nguồn → cung đích qua sao bị biến)
//
// Nguyên lý: Mỗi cung có 1 Thiên Can. Tra bảng Tứ Hóa theo Can đó
// → xác định 4 sao nhận Lộc/Quyền/Khoa/Kỵ → tìm 4 sao đó đang ngồi
// ở cung nào trên lá số → tạo mũi tên từ cung nguồn đến cung đích.
//
// Nếu sao đích nằm CÙNG cung nguồn → "Tự Hóa" (rất quan trọng trong
// luận giải: tự hóa Lộc = lộc đi ra, tự hóa Kỵ = kẹt tại chỗ).
//
// KHÔNG chứa logic luận giải — phần đó thuộc knowledge/tu-hoa/
// ====================================================================

import type { PalaceVN, StarVN } from "./algorithm-vn";
import { STEM_NAMES_VN, SIHUA_BY_STEM, STAR_NAMES_VN } from "./constants-vn";

// ---- Types ----------------------------------------------------------

export type HoaType = "Lộc" | "Quyền" | "Khoa" | "Kỵ";

export interface PhiHoaArrow {
  /** Index cung nguồn (0-11, theo thứ tự palaces) */
  fromPalaceIndex: number;
  /** Tên cung nguồn (VN) */
  fromPalaceName: string;
  /** Can cung nguồn (VN) */
  fromStem: string;

  /** Index cung đích — nơi sao bị biến đang ngồi */
  toPalaceIndex: number;
  /** Tên cung đích (VN) */
  toPalaceName: string;

  /** Loại Hóa */
  hoaType: HoaType;

  /** Tên sao bị biến (VN), vd "Thiên Lương" */
  starName: string;

  /** Tự Hóa = sao đích nằm cùng cung nguồn */
  isTuHoa: boolean;
}

export interface PhiHoaResult {
  /** Toàn bộ mũi tên (12 cung × 4 hóa = tối đa 48, thực tế có thể < 48 nếu sao không tìm thấy) */
  arrows: PhiHoaArrow[];

  /** Nhóm theo index cung nguồn — tiện cho UI và luận giải */
  byFromPalace: Record<number, PhiHoaArrow[]>;

  /** Nhóm theo index cung đích — tiện cho câu hỏi "cung này nhận gì?" */
  byToPalace: Record<number, PhiHoaArrow[]>;

  /** Danh sách cung có Tự Hóa (rất quan trọng trong luận giải) */
  tuHoaList: PhiHoaArrow[];

  /** Sao không tìm thấy trên lá số (debug) */
  missingStars: Array<{ stem: string; hoaType: HoaType; starNameVN: string }>;
}

// ---- Helpers --------------------------------------------------------

const HOA_KEYS: Array<{ key: keyof (typeof SIHUA_BY_STEM)[0]; label: HoaType }> = [
  { key: "loc", label: "Lộc" },
  { key: "quyen", label: "Quyền" },
  { key: "khoa", label: "Khoa" },
  { key: "ky", label: "Kỵ" },
];

/** Chuyển tên Can VN ("Giáp") → index (0). Trả -1 nếu không khớp. */
function stemToIndex(stemVN: string): number {
  const idx = STEM_NAMES_VN.indexOf(stemVN);
  return idx;
}

/** Tìm cung chứa sao có tên VN cho trước. Quét majorStars trước (14 chính tinh),
 *  rồi minorStars (phụ tinh có Tứ Hóa: Văn Xương, Văn Khúc, Tả Phù, Hữu Bật...),
 *  cuối cùng adjectiveStars. Trả index cung hoặc -1. */
function findStarPalace(palaces: PalaceVN[], starNameVN: string): number {
  for (let i = 0; i < palaces.length; i++) {
    const p = palaces[i]!;
    const allStars: StarVN[] = [...p.majorStars, ...p.minorStars, ...p.adjectiveStars];
    if (allStars.some((s) => s.name === starNameVN)) {
      return i;
    }
  }
  return -1;
}

// ---- Calculator chính -----------------------------------------------

/**
 * Tính Phi Hóa Can Cung cho toàn bộ 12 cung.
 *
 * @param palaces - Mảng 12 cung đã an sao đầy đủ (output của generateChartVN)
 * @returns PhiHoaResult với mũi tên, nhóm theo cung, và danh sách tự hóa
 *
 * @example
 * ```ts
 * const chart = generateChartVN(birthInfo, 2026);
 * const phiHoa = calculatePhiHoa(chart.palaces);
 *
 * // Mệnh Cung phi Hóa gì?
 * const menhArrows = phiHoa.byFromPalace[chart.mingGongIndex];
 *
 * // Cung Tài Bạch nhận Hóa gì?
 * const taiBachIdx = chart.palaces.findIndex(p => p.name === "Tài Bạch Cung");
 * const taiBachReceived = phiHoa.byToPalace[taiBachIdx];
 *
 * // Có tự hóa không?
 * phiHoa.tuHoaList.forEach(a => console.log(`${a.fromPalaceName} tự hóa ${a.hoaType}`));
 * ```
 */
export function calculatePhiHoa(palaces: PalaceVN[]): PhiHoaResult {
  const arrows: PhiHoaArrow[] = [];
  const missingStars: PhiHoaResult["missingStars"] = [];

  for (let i = 0; i < palaces.length; i++) {
    const palace = palaces[i]!;
    const stemIdx = stemToIndex(palace.stem);

    // Nếu Can cung không hợp lệ (không nên xảy ra), bỏ qua
    if (stemIdx < 0 || stemIdx > 9) continue;

    const sihuaSet = SIHUA_BY_STEM[stemIdx];
    if (!sihuaSet) continue;

    for (const { key, label } of HOA_KEYS) {
      const starNameCN = sihuaSet[key];
      const starNameVN = STAR_NAMES_VN[starNameCN] ?? starNameCN;

      const targetIdx = findStarPalace(palaces, starNameVN);

      if (targetIdx === -1) {
        // Sao tồn tại trong bảng tra nhưng không có trên lá số
        // (có thể bị blacklist hoặc thuộc trường phái khác)
        missingStars.push({ stem: palace.stem, hoaType: label, starNameVN });
        continue;
      }

      const targetPalace = palaces[targetIdx]!;

      arrows.push({
        fromPalaceIndex: i,
        fromPalaceName: palace.name,
        fromStem: palace.stem,
        toPalaceIndex: targetIdx,
        toPalaceName: targetPalace.name,
        hoaType: label,
        starName: starNameVN,
        isTuHoa: targetIdx === i,
      });
    }
  }

  // Nhóm theo cung nguồn
  const byFromPalace: Record<number, PhiHoaArrow[]> = {};
  for (let i = 0; i < 12; i++) byFromPalace[i] = [];
  for (const a of arrows) byFromPalace[a.fromPalaceIndex]!.push(a);

  // Nhóm theo cung đích
  const byToPalace: Record<number, PhiHoaArrow[]> = {};
  for (let i = 0; i < 12; i++) byToPalace[i] = [];
  for (const a of arrows) byToPalace[a.toPalaceIndex]!.push(a);

  // Danh sách tự hóa
  const tuHoaList = arrows.filter((a) => a.isTuHoa);

  return { arrows, byFromPalace, byToPalace, tuHoaList, missingStars };
}
