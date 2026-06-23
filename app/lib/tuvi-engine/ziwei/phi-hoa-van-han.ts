// src/lib/tuvi-engine/ziwei/phi-hoa-van-han.ts
// ====================================================================
// PHI HÓA VẬN HẠN ĐA TẦNG — BẮC PHÁI TỨ HÓA
//
// Triển khai đầy đủ 4 Module theo đặc tả Tứ Hóa Phái:
//   L0 = Tiên Thiên (lá số gốc, cố định)
//   L1 = Đại Vận (10 năm)
//   L2 = Lưu Niên (1 năm) → Tứ Hóa bay vào L0
//   L3 = Lưu Nguyệt (1 tháng) → Tứ Hóa bay vào L1
//
// QUY TẮC CÁCH BÀN (quan trọng nhất):
//   L3 phi → KHÔNG tác động L2, nhảy cóc vào L1
//   L2 phi → KHÔNG tác động L1, nhảy cóc vào L0
//
// ⭐ CẬP NHẬT: Mũi tên L3 nay map cung đích sang VAI TRÒ trong Đại Vận
//    (vd: cung gốc "Tài Bạch" → vai trò "Quan Lộc của Đại Vận")
// ====================================================================

import { SIHUA_BY_STEM, STEM_NAMES_VN, STAR_NAMES_VN } from "./constants-vn";
import type { PalaceVN } from "./algorithm-vn";
import type { PhiHoaArrow, PhiHoaResult } from "./phi-hoa";

// ---- Helpers --------------------------------------------------------

/** Chi năm → index (Tý=0, Sửu=1, ..., Hợi=11) */
const BRANCH_INDEX: Record<string, number> = {
  Tý: 0,
  Sửu: 1,
  Dần: 2,
  Mão: 3,
  Thìn: 4,
  Tỵ: 5,
  Ngọ: 6,
  Mùi: 7,
  Thân: 8,
  Dậu: 9,
  Tuất: 10,
  Hợi: 11,
};

/** Chi → tên VN */
const BRANCH_NAMES = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

/**
 * Thứ tự 12 cung chức năng theo offset THUẬN branchIndex từ Mệnh.
 * Cung chức năng thứ k nằm tại branchIndex = (Mệnh + k) % 12.
 * → Đảo lại: cung tại branchIndex B có vai trò = (B − Mệnh + 12) % 12.
 * Dùng chung cho: findDauQuan (Thuật Toán 2) và map vai trò Đại Vận.
 */
const CUNG_CHUC_NANG_ORDER = [
  "Mệnh",
  "Phụ Mẫu",
  "Phúc Đức",
  "Điền Trạch",
  "Quan Lộc",
  "Nô Bộc",
  "Thiên Di",
  "Tật Ách",
  "Tài Bạch",
  "Tử Tức",
  "Phu Thê",
  "Huynh Đệ",
];

/**
 * Tính VAI TRÒ của một cung (theo branchIndex) khi nhìn từ tầng Đại Vận.
 * @param toBranchIndex branchIndex của cung đích
 * @param daiHanBranchIndex branchIndex của cung Mệnh Đại Vận
 * @returns Tên vai trò trong Đại Vận (vd: "Quan Lộc", "Tài Bạch"...)
 */
function getVaiTroDaiVan(toBranchIndex: number, daiHanBranchIndex: number): string {
  if (toBranchIndex < 0 || daiHanBranchIndex < 0) return "?";
  const offset = (toBranchIndex - daiHanBranchIndex + 12) % 12;
  return CUNG_CHUC_NANG_ORDER[offset] ?? "?";
}

/**
 * Lấy Can từ chuỗi Can Chi VN (VD: "Ất Mão" → "Ất", "Nhâm Tuất" → "Nhâm")
 */
function extractStem(stemBranch: string): string {
  return stemBranch.trim().split(/\s+/)[0] ?? "";
}

/**
 * Ngũ Hổ Độn — tính Can Tháng 1 (Dần tháng) từ Can năm
 * Công thức: (2 * n + 1) % 10, n = index Can năm (Giáp=1...Quý=10)
 * Trả về index 0-9 (Giáp=0...Quý=9)
 */
function getNguHoDunThang1StemIndex(yearStemVN: string): number {
  const stemOrder = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
  const n = stemOrder.indexOf(yearStemVN) + 1; // Giáp=1...Quý=10
  if (n === 0) return 0;
  const result = (2 * n + 1) % 10;
  return result === 0 ? 9 : result - 1; // chuyển về 0-based
}

/**
 * Tính Can của tháng thứ M (1-12) dựa trên Can năm
 * Tháng 1 = Dần tháng, công thức Ngũ Hổ Độn
 */
function getMonthStem(yearStemVN: string, monthNumber: number): string {
  const stemOrder = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
  const thang1Idx = getNguHoDunThang1StemIndex(yearStemVN);
  const monthStemIdx = (thang1Idx + monthNumber - 1) % 10;
  return stemOrder[monthStemIdx] ?? "Giáp";
}

/**
 * Tính Phi Hóa từ 1 Can cung — wrapper nội bộ không dùng toàn bộ 12 cung
 * Chỉ dùng Can của cung cụ thể → tra SIHUA_BY_STEM → bắn mũi tên
 */
function phiHoaFromStem(
  stemVN: string,
  fromPalaceIndex: number,
  fromPalaceName: string,
  palaces: PalaceVN[],
): PhiHoaArrow[] {
  const stemIdx = STEM_NAMES_VN.indexOf(stemVN);
  if (stemIdx < 0) return [];

  const sihua = SIHUA_BY_STEM[stemIdx];
  if (!sihua) return [];

  const hoaKeys: Array<{ key: keyof typeof sihua; label: "Lộc" | "Quyền" | "Khoa" | "Kỵ" }> = [
    { key: "loc", label: "Lộc" },
    { key: "quyen", label: "Quyền" },
    { key: "khoa", label: "Khoa" },
    { key: "ky", label: "Kỵ" },
  ];

  const arrows: PhiHoaArrow[] = [];

  for (const { key, label } of hoaKeys) {
    const starNameCN = sihua[key];
    const starNameVN = STAR_NAMES_VN[starNameCN] ?? starNameCN;

    let targetIdx = -1;
    for (let i = 0; i < palaces.length; i++) {
      const p = palaces[i]!;
      // Tứ hóa chỉ tác động lên 18 Chính Tinh/Phụ Tinh cốt lõi
      const all = [...(p.majorStars || []), ...(p.minorStars || [])];
      if (all.some((s) => s.name === starNameVN)) {
        targetIdx = i;
        break;
      }
    }
    if (targetIdx < 0) continue;

    const targetPalace = palaces[targetIdx]!;
    arrows.push({
      fromPalaceIndex,
      fromPalaceName,
      fromStem: stemVN,
      toPalaceIndex: targetIdx,
      toPalaceName: targetPalace.name,
      hoaType: label,
      starName: starNameVN,
      isTuHoa: targetIdx === fromPalaceIndex,
    });
  }
  return arrows;
}

// ---- Types ----------------------------------------------------------

export interface PhiHoaLuuNienResult {
  /** Can thực tế của năm (nguồn khách quan — kết quả thực tế) */
  canThucTe: string;
  /** Phi Hóa từ Can thực tế → bay vào L0 (lá số gốc) */
  phiHoaThucTe: PhiHoaArrow[];

  /** Cung Lưu Niên (cung Mão/Tý/... khớp chi năm) */
  luuNienPalace: { name: string; index: number; branchIndex: number; stemBranch: string };
  /** Can của cung Lưu Niên trên lá số gốc (nguồn chủ quan — nhiệm vụ, mong muốn) */
  canCung: string;
  /** Phi Hóa từ Can cung Lưu Niên → bay vào L0 */
  phiHoaCung: PhiHoaArrow[];
}

/** Mũi tên Lưu Nguyệt kèm vai trò cung đích trong Đại Vận (L1) */
export interface LuuNguyetArrow {
  starName: string;
  hoaType: "Lộc" | "Quyền" | "Khoa" | "Kỵ";
  /** Tên cung đích theo lá số GỐC (L0) */
  toPalaceL0: string;
  /** VAI TRÒ cung đích khi nhìn từ Đại Vận (L1) — vd "Quan Lộc" */
  toPalaceDaiVan: string;
  toBranchIndex: number;
  isTuHoa: boolean;
}

export interface PhiHoaLuuNguyetResult {
  thang: number;
  canThang: string;
  /** Đẩu Quân (cung tháng 1) — index trong palaces */
  dauQuanPalaceIndex: number;
  dauQuanPalaceName: string;
  /** Phi Hóa tháng (raw, cung đích theo L0) */
  phiHoaArrows: PhiHoaArrow[];
  /** ⭐ Phi Hóa tháng kèm vai trò cung đích trong Đại Vận (Cách Bàn L3→L1) */
  arrowsDaiVan: LuuNguyetArrow[];
  /** Cung đích diễn giải theo tầng L1 (Đại Vận) */
  targetLayer: "L1_DaiVan";
}

export interface CachBanAnalysis {
  /** L2 → L0: Kỵ Lưu Niên rơi vào cung gốc nào */
  l2_ky_vao_l0: PhiHoaArrow[];
  /** L2 → L0: Lộc Lưu Niên rơi vào cung gốc nào */
  l2_loc_vao_l0: PhiHoaArrow[];
  /** L3 → L1: Kỵ Lưu Nguyệt rơi vào cung ĐV nào (kèm vai trò Đại Vận) */
  l3_ky_vao_l1: LuuNguyetArrow[];
  /** L3 → L1: Lộc Lưu Nguyệt rơi vào cung ĐV nào (kèm vai trò Đại Vận) */
  l3_loc_vao_l1: LuuNguyetArrow[];
  /** Tam Kỵ / Tứ Kỵ hội tụ: cùng 1 cung gốc nhận Kỵ từ L0 + L1 + L2 + L3 */
  tamKyHoi: Array<{ palaceName: string; sources: string[] }>;
}

// ====================================================================
// MODULE 2: PHI HÓA LƯU NIÊN (L2)
// ====================================================================

/**
 * Tính Phi Hóa Lưu Niên từ 2 nguồn Can theo Bắc Phái.
 *
 * @param palaces Mảng 12 cung gốc (L0)
 * @param namXem Năm xem (dương lịch)
 * @param yearStemBranch Can Chi năm xem VN (VD: "Nhâm Ngọ")
 */
export function calculatePhiHoaLuuNien(
  palaces: PalaceVN[],
  namXem: number,
  yearStemBranch: string,
): PhiHoaLuuNienResult | null {
  // 1. Xác định chi năm → tìm cung Lưu Niên
  const yearBranchActual = yearStemBranch.trim().split(/\s+/)[1] ?? "";
  const luuNienBI = BRANCH_INDEX[yearBranchActual] ?? -1;

  if (luuNienBI < 0) return null;

  const luuNienPalaceIdx = palaces.findIndex((p) => p.branchIndex === luuNienBI);
  if (luuNienPalaceIdx < 0) return null;

  const luuNienPalace = palaces[luuNienPalaceIdx]!;

  // 2. Can thực tế của năm (nguồn 1 — khách quan)
  const canThucTe = yearStemBranch.trim().split(/\s+/)[0] ?? "";

  // 3. Can cung Lưu Niên trên lá số gốc (nguồn 2 — chủ quan)
  const canCung = extractStem(luuNienPalace.stemBranch ?? "");

  // 4. Phi Hóa từ Can thực tế → L0
  const phiHoaThucTe = phiHoaFromStem(canThucTe, luuNienPalaceIdx, luuNienPalace.name, palaces);

  // 5. Phi Hóa từ Can cung → L0
  const phiHoaCung = phiHoaFromStem(canCung, luuNienPalaceIdx, luuNienPalace.name, palaces);

  return {
    canThucTe,
    phiHoaThucTe,
    luuNienPalace: {
      name: luuNienPalace.name,
      index: luuNienPalaceIdx,
      branchIndex: luuNienBI,
      stemBranch: luuNienPalace.stemBranch ?? "",
    },
    canCung,
    phiHoaCung,
  };
}

// ====================================================================
// MODULE 3: PHI HÓA LƯU NGUYỆT (L3) — Quy tắc Cách Bàn
// ====================================================================

/**
 * Tính Đẩu Quân (cung Tháng 1) theo Thuật Toán 2 của Bắc Phái:
 * 1. Tìm cung Dần trên L0 → chức năng cung đó là gì (VD: Tử Tức)
 * 2. Lấy cung Lưu Niên làm Mệnh, đếm thuận đến chức năng đó
 * 3. Vị trí đó = Tháng 1 (Đẩu Quân)
 *
 * @param palaces L0 palaces
 * @param luuNienBI BranchIndex cung Lưu Niên
 */
function findDauQuan(palaces: PalaceVN[], luuNienBI: number): number {
  // Cung tại Dần (branchIndex = 2) trên L0
  const cungTaiDan = palaces.find((p) => p.branchIndex === 2);
  if (!cungTaiDan) return luuNienBI; // fallback

  // Tên cung đó (VD: "Tử Tức Cung" → "Tử Tức")
  const tenCungDan = cungTaiDan.name.replace(/\s*Cung\s*$/i, "").trim();

  // Vị trí của tenCungDan trong thứ tự 12 cung chức năng
  const orderIdx = CUNG_CHUC_NANG_ORDER.findIndex(
    (c) => tenCungDan.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(tenCungDan.toLowerCase()),
  );
  if (orderIdx < 0) return luuNienBI;

  // Đếm thuận orderIdx bước từ cung Lưu Niên → đó là Đẩu Quân
  return (luuNienBI + orderIdx) % 12;
}

/**
 * Tính Phi Hóa Lưu Nguyệt cho tháng M.
 * ⚡ CÁCH BÀN: Phi Hóa L3 → tác động L1 (Đại Vận), KHÔNG phải L0.
 * Cung đích được map sang VAI TRÒ trong Đại Vận qua daiHanBranchIndex.
 *
 * @param palaces L0 palaces
 * @param yearStemBranch Can Chi năm xem
 * @param monthNumber Tháng âm lịch (1-12)
 * @param daiHanBranchIndex BranchIndex cung Mệnh Đại Vận (để map sang L1)
 */
export function calculatePhiHoaLuuNguyet(
  palaces: PalaceVN[],
  yearStemBranch: string,
  monthNumber: number,
  daiHanBranchIndex: number,
): PhiHoaLuuNguyetResult {
  const yearBranchActual = yearStemBranch.trim().split(/\s+/)[1] ?? "";
  const luuNienBI = BRANCH_INDEX[yearBranchActual] ?? 0;
  const yearStem = yearStemBranch.trim().split(/\s+/)[0] ?? "Giáp";

  // 1. Tìm Đẩu Quân (cung Tháng 1)
  const dauQuanBI = findDauQuan(palaces, luuNienBI);

  // 2. Cung của tháng M (đếm thuận từ Đẩu Quân)
  const thangBI = (dauQuanBI + monthNumber - 1) % 12;
  const thangPalace = palaces.find((p) => p.branchIndex === thangBI);
  const thangPalaceIdx = palaces.findIndex((p) => p.branchIndex === thangBI);

  // 3. Can tháng M theo Ngũ Hổ Độn
  const canThang = getMonthStem(yearStem, monthNumber);

  // 4. Phi Hóa từ Can tháng → tìm sao trên lá số (vị trí sao bất biến giữa các tầng)
  const arrows = phiHoaFromStem(
    canThang,
    thangPalaceIdx >= 0 ? thangPalaceIdx : 0,
    thangPalace?.name ?? BRANCH_NAMES[thangBI] ?? "",
    palaces,
  );

  // 5. ⭐ MAP cung đích sang VAI TRÒ trong Đại Vận (Cách Bàn L3→L1)
  const arrowsDaiVan: LuuNguyetArrow[] = arrows.map((a) => {
    const toBI = palaces[a.toPalaceIndex]?.branchIndex ?? -1;
    return {
      starName: a.starName,
      hoaType: a.hoaType,
      toPalaceL0: a.toPalaceName,
      toPalaceDaiVan: getVaiTroDaiVan(toBI, daiHanBranchIndex),
      toBranchIndex: toBI,
      isTuHoa: a.isTuHoa,
    };
  });

  return {
    thang: monthNumber,
    canThang,
    dauQuanPalaceIndex: palaces.findIndex((p) => p.branchIndex === dauQuanBI),
    dauQuanPalaceName: palaces.find((p) => p.branchIndex === dauQuanBI)?.name ?? "",
    phiHoaArrows: arrows,
    arrowsDaiVan,
    targetLayer: "L1_DaiVan",
  };
}

// ====================================================================
// MODULE 4: PHÂN TÍCH CÁCH BÀN — Cross-layer
// ====================================================================

/**
 * Phân tích tương tác xuyên tầng (Cách Bàn).
 * Gộp Phi Hóa từ L0, L1, L2, L3 và phát hiện Tam Kỵ/Tứ Kỵ hội tụ.
 *
 * @param phiHoaL0 Phi Hóa từ lá số gốc
 * @param daiHanStemBranch Can Chi cung Đại Hạn (VD: "Mậu Tý")
 * @param palaces L0 palaces (để lấy tên)
 * @param phiHoaLuuNien Kết quả từ calculatePhiHoaLuuNien
 * @param phiHoaLuuNguyet Kết quả từ calculatePhiHoaLuuNguyet (optional)
 */
export function analyzeCachBan(
  phiHoaL0: PhiHoaResult,
  daiHanStemBranch: string,
  palaces: PalaceVN[],
  phiHoaLuuNien: PhiHoaLuuNienResult | null,
  phiHoaLuuNguyet?: PhiHoaLuuNguyetResult,
): CachBanAnalysis {
  // Phi Hóa L1 (ĐH) — Can ĐH phi vào L0
  const canDH = extractStem(daiHanStemBranch);
  const dhPalaceIdx = palaces.findIndex(
    (p) => (p.stemBranch ?? "").startsWith(canDH) || (p.stemBranch ?? "") === daiHanStemBranch,
  );
  const l1Arrows = phiHoaFromStem(
    canDH,
    dhPalaceIdx >= 0 ? dhPalaceIdx : 0,
    dhPalaceIdx >= 0 ? palaces[dhPalaceIdx]!.name : "",
    palaces,
  );

  // L2 → L0: Kỵ/Lộc Lưu Niên
  const l2Arrows = [...(phiHoaLuuNien?.phiHoaThucTe ?? []), ...(phiHoaLuuNien?.phiHoaCung ?? [])];
  const l2KyVaoL0 = l2Arrows.filter((a) => a.hoaType === "Kỵ");
  const l2LocVaoL0 = l2Arrows.filter((a) => a.hoaType === "Lộc");

  // L3 → L1: Kỵ/Lộc Lưu Nguyệt (Cách Bàn — cung đích kèm vai trò Đại Vận)
  const l3ArrowsDV = phiHoaLuuNguyet?.arrowsDaiVan ?? [];
  const l3KyVaoL1 = l3ArrowsDV.filter((a) => a.hoaType === "Kỵ");
  const l3LocVaoL1 = l3ArrowsDV.filter((a) => a.hoaType === "Lộc");

  // Phát hiện Tam Kỵ/Tứ Kỵ hội tụ cùng cung vật lý (L0 index)
  const tamKyHoi: CachBanAnalysis["tamKyHoi"] = [];
  const l0KyArrows = phiHoaL0.arrows.filter((a) => a.hoaType === "Kỵ");
  const l1KyArrows = l1Arrows.filter((a) => a.hoaType === "Kỵ");

  // Tập hợp tất cả cung nhận Kỵ từ L0, L1, L2 và L3
  const kyByPalace: Record<number, string[]> = {};

  for (const a of l0KyArrows) {
    (kyByPalace[a.toPalaceIndex] ??= []).push("L0 (Gốc)");
  }
  for (const a of l1KyArrows) {
    (kyByPalace[a.toPalaceIndex] ??= []).push(`L1 ĐH (${canDH})`);
  }
  for (const a of l2KyVaoL0) {
    (kyByPalace[a.toPalaceIndex] ??= []).push(`L2 LN (${phiHoaLuuNien?.canThucTe ?? ""})`);
  }

  for (const [idx, sources] of Object.entries(kyByPalace)) {
    if (sources.length >= 2) {
      const palace = palaces[Number(idx)];
      tamKyHoi.push({
        palaceName: palace?.name ?? `Cung ${idx}`,
        sources,
      });
    }
  }

  return {
    l2_ky_vao_l0: l2KyVaoL0,
    l2_loc_vao_l0: l2LocVaoL0,
    l3_ky_vao_l1: l3KyVaoL1,
    l3_loc_vao_l1: l3LocVaoL1,
    tamKyHoi,
  };
}

// ====================================================================
// FORMAT CHO AI CONTEXT
// ====================================================================

/**
 * Format toàn bộ phân tích Vận Hạn đa tầng cho AI context.
 */
export function formatVanHanDaTangForAI(
  phiHoaLN: PhiHoaLuuNienResult | null,
  cachBan: CachBanAnalysis,
  namXem: number,
  tenDaiHan: string,
  thangXem?: number,
): string {
  const lines: string[] = [];

  lines.push("\n## PHI HÓA VẬN HẠN ĐA TẦNG (Bắc Phái Tứ Hóa)");
  lines.push(`> Năm xem: ${namXem} | Đại Hạn: ${tenDaiHan}`);
  lines.push("> QUY TẮC CÁCH BÀN: L2 (Lưu Niên) → tác động L0 (Gốc). L3 (Lưu Nguyệt) → tác động L1 (Đại Vận).");

  // L2: Phi Hóa Lưu Niên
  if (phiHoaLN) {
    lines.push(`\n### L2 — LƯU NIÊN (Cung ${phiHoaLN.luuNienPalace.name})`);
    lines.push(`- Cung Lưu Niên: ${phiHoaLN.luuNienPalace.name} (${phiHoaLN.luuNienPalace.stemBranch})`);
    lines.push(`- **Nguồn 1 — Can thực tế ${phiHoaLN.canThucTe}** (kết quả khách quan năm ${namXem}):`);
    for (const a of phiHoaLN.phiHoaThucTe) {
      const tuHoa = a.isTuHoa ? " ⚠️ TỰ HÓA" : "";
      lines.push(`  · ${a.starName} Hóa ${a.hoaType} → ${a.toPalaceName}${tuHoa}`);
    }
    lines.push(`- **Nguồn 2 — Can cung ${phiHoaLN.canCung}** (nhiệm vụ/mong muốn chủ quan):`);
    for (const a of phiHoaLN.phiHoaCung) {
      const tuHoa = a.isTuHoa ? " ⚠️ TỰ HÓA" : "";
      lines.push(`  · ${a.starName} Hóa ${a.hoaType} → ${a.toPalaceName}${tuHoa}`);
    }
  }

  // Cách Bàn analysis
  lines.push("\n### PHÂN TÍCH CÁCH BÀN (Cross-layer)");

  if (cachBan.l2_ky_vao_l0.length > 0) {
    lines.push("**Kỵ L2 bay vào L0 (nguy hiểm thực tế):**");
    for (const a of cachBan.l2_ky_vao_l0) {
      lines.push(`  · ${a.starName} Hóa Kỵ → ${a.toPalaceName} (L0 gốc)`);
    }
  }
  if (cachBan.l2_loc_vao_l0.length > 0) {
    lines.push("**Lộc L2 bay vào L0 (lợi ích thực tế):**");
    for (const a of cachBan.l2_loc_vao_l0) {
      lines.push(`  · ${a.starName} Hóa Lộc → ${a.toPalaceName} (L0 gốc)`);
    }
  }

  // L3 — hiển thị theo VAI TRÒ Đại Vận (Cách Bàn), kèm cung gốc để đối chiếu
  if (thangXem && cachBan.l3_ky_vao_l1.length > 0) {
    lines.push(`**Kỵ L3 Tháng ${thangXem} bay vào L1 — đọc theo vai trò ĐẠI VẬN:**`);
    for (const a of cachBan.l3_ky_vao_l1) {
      const tuHoa = a.isTuHoa ? " ⚠️ TỰ HÓA" : "";
      lines.push(`  · ${a.starName} Hóa Kỵ → **${a.toPalaceDaiVan} của Đại Vận** (cung gốc: ${a.toPalaceL0})${tuHoa}`);
    }
  }
  if (thangXem && cachBan.l3_loc_vao_l1.length > 0) {
    lines.push(`**Lộc L3 Tháng ${thangXem} bay vào L1 — đọc theo vai trò ĐẠI VẬN:**`);
    for (const a of cachBan.l3_loc_vao_l1) {
      const tuHoa = a.isTuHoa ? " ⚠️ TỰ HÓA" : "";
      lines.push(`  · ${a.starName} Hóa Lộc → **${a.toPalaceDaiVan} của Đại Vận** (cung gốc: ${a.toPalaceL0})${tuHoa}`);
    }
  }

  // Tam Kỵ / Tứ Kỵ cảnh báo
  if (cachBan.tamKyHoi.length > 0) {
    lines.push("\n⚠️ **TAM KỴ / TỨ KỴ HỘI TỤ — CẢNH BÁO BIẾN CỐ LỚN:**");
    for (const tk of cachBan.tamKyHoi) {
      lines.push(`  · Cung **${tk.palaceName}** nhận Kỵ từ: ${tk.sources.join(" + ")}`);
    }
    lines.push("  → Đây là dấu hiệu sự kiện MẠNH tại cung/lĩnh vực này. AI phải đề cập và cảnh báo.");
  } else {
    lines.push("✅ Không phát hiện Tam Kỵ/Tứ Kỵ hội tụ trong giai đoạn này.");
  }

  lines.push(
    "\n> AI: Khi luận vận năm/tháng, PHẢI phân tách rõ: (1) Nguồn Can thực tế = sự kiện khách quan, (2) Nguồn Can cung = mong muốn chủ quan, (3) Cách Bàn = lực xuyên tầng. ĐẶC BIỆT: mũi tên Lưu Nguyệt (L3) đọc theo VAI TRÒ ĐẠI VẬN, không phải tên cung gốc — vd 'Kỵ vào Quan Lộc của Đại Vận' nghĩa là sự nghiệp trong 10 năm này bị ảnh hưởng trong tháng đó.",
  );

  return lines.join("\n");
}

// ====================================================================
// MODULE 5: QUÉT 12 THÁNG LƯU NGUYỆT (để so sánh tháng tốt/xấu)
// ====================================================================

export interface ThangSummary {
  thang: number;
  canThang: string;
  canChiThang: string;
  locVao: string[];
  quyenVao: string[];
  khoaVao: string[];
  kyVao: string[];
  tuHoa: boolean;
}

/**
 * Quét cả 12 tháng Lưu Nguyệt trong năm xem.
 * Mỗi tháng: Lộc/Quyền/Khoa/Kỵ bay vào vai trò cung nào của Đại Vận.
 */
export function calculatePhiHoaLuuNguyet12Thang(
  palaces: PalaceVN[],
  yearStemBranch: string,
  daiHanBranchIndex: number,
): ThangSummary[] {
  const result: ThangSummary[] = [];
  for (let m = 1; m <= 12; m++) {
    const r = calculatePhiHoaLuuNguyet(palaces, yearStemBranch, m, daiHanBranchIndex);
    const pick = (hoa: string) =>
      r.arrowsDaiVan.filter((a) => a.hoaType === hoa).map((a) => `${a.starName}→${a.toPalaceDaiVan}`);
    const chiThangName = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"][(m + 1) % 12];
    result.push({
      thang: m,
      canThang: r.canThang,
      canChiThang: `${r.canThang} ${chiThangName}`,
      locVao: pick("Lộc"),
      quyenVao: pick("Quyền"),
      khoaVao: pick("Khoa"),
      kyVao: pick("Kỵ"),
      tuHoa: r.arrowsDaiVan.some((a) => a.isTuHoa),
    });
  }
  return result;
}

/** Format bảng 12 tháng cho AI để so sánh tháng tốt/xấu */
export function format12ThangForAI(thangList: ThangSummary[]): string {
  const lines: string[] = ["\n### TRỌNG ĐIỂM LƯU NGUYỆT — QUÉT 12 THÁNG (L3 → L1 Đại Vận)"];
  lines.push("> Mỗi tháng: Tứ Hóa bay vào vai trò cung nào của ĐẠI VẬN. So sánh để tìm tháng cát/hung.");
  for (const t of thangList) {
    const segs: string[] = [];
    if (t.locVao.length) segs.push(`Lộc: ${t.locVao.join(", ")}`);
    if (t.quyenVao.length) segs.push(`Quyền: ${t.quyenVao.join(", ")}`);
    if (t.khoaVao.length) segs.push(`Khoa: ${t.khoaVao.join(", ")}`);
    if (t.kyVao.length) segs.push(`Kỵ: ${t.kyVao.join(", ")}`);
    const th = t.tuHoa ? " ⚠️Tự Hóa" : "";
    lines.push(`- **Tháng ${t.thang}** (${t.canChiThang}): ${segs.join(" · ") || "(không có Tứ Hóa nổi bật)"}${th}`);
  }
  lines.push(
    "> AI: Dựa bảng trên, chỉ ra 2-3 tháng TỐT nhất (tụ Lộc/Quyền/Khoa vào cung Mệnh/Tài/Quan/Điền của Đại Vận) và 2-3 tháng XẤU nhất (tụ Kỵ hoặc Tự Hóa Kỵ). Giải thích theo vai trò cung Đại Vận bị tác động.",
  );
  return lines.join("\n");
}

// ====================================================================
// MODULE 6: BẢNG XOAY CUNG (ép AI không tự tính nhẩm)
// ====================================================================

/**
 * Xuất 2 bảng tra cứu xoay cung Đại Hạn / Lưu Niên về cung Tiên Thiên (L0).
 * Mỗi chức năng (Mệnh, Tài, Quan...) của ĐH/LN sẽ map sang tên cung gốc.
 */
export function formatBangXoayCung(
  palaces: PalaceVN[],
  daiHanBranchIndex: number,
  luuNienBranchIndex: number,
): string {
  const byBI = new Map<number, PalaceVN>();
  for (const p of palaces) byBI.set(p.branchIndex, p);

  const build = (baseBI: number, suffix: string): string[] => {
    const out: string[] = [];
    for (let k = 0; k < CUNG_CHUC_NANG_ORDER.length; k++) {
      const role = CUNG_CHUC_NANG_ORDER[k];
      const targetBI = (baseBI + k + 12) % 12;
      const goc = byBI.get(targetBI);
      const gocName = goc?.name ?? "?";
      out.push(`- ${role} ${suffix} = ${gocName}`);
    }
    return out;
  };

  const lines: string[] = [];
  lines.push("## BẢNG XOAY CUNG ĐẠI HẠN");
  lines.push(...build(daiHanBranchIndex, "ĐH"));
  lines.push("");
  lines.push("## BẢNG XOAY CUNG LƯU NIÊN");
  lines.push(...build(luuNienBranchIndex, "LN"));
  lines.push("");
  lines.push(
    "> LỆNH TỐI CAO CHO AI KHI LUẬN GIẢI: PHẢI tra cứu trực tiếp 2 bảng trên khi muốn biết \"Cung X của Đại Hạn / Lưu Niên\" nằm ở ô nào. TUYỆT ĐỐI KHÔNG tự đếm ngón tay, tự dịch chuyển hay tự tính nhẩm để tránh ảo giác.",
  );
  return lines.join("\n");
}
