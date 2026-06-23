// src/lib/tuvi-engine/ziwei/luu-sao.ts
// ====================================================================
// Module tính & gắn Sao Lưu động theo năm xem - BẢN CHUẨN HÓA V30
// ====================================================================

import type { PalaceVN, StarVN } from "./algorithm-vn";
import { STAR_NAMES_VN } from "./constants-vn";

// ---- Bảng mapping sao Lưu CN → VN (Đã sửa đổi chuẩn hóa tiền tố) ----

const LUU_STAR_NAMES_VN: Record<string, string> = {
  // 1. Sao Lưu niên (yearly) -> Ép chặt tiền tố "L."
  流禄: "L.Lộc Tồn",
  流羊: "L.Kình Dương",
  流陀: "L.Đà La",
  流昌: "L.Văn Xương",
  流曲: "L.Văn Khúc",
  流魁: "L.Thiên Khôi",
  流钺: "L.Thiên Việt",
  流马: "L.Thiên Mã",
  流鸾: "L.Hồng Loan",
  流喜: "L.Thiên Hỷ",
  年解: "L.Niên Giải",

  // 2. Sao Đại Hạn (decadal) -> Chuyển đổi từ "Vận" sang "ĐV." chuẩn chỉnh
  运禄: "ĐV.Lộc Tồn",
  运羊: "ĐV.Kình Dương",
  运陀: "ĐV.Đà La",
  运昌: "ĐV.Văn Xương",
  运曲: "ĐV.Văn Khúc",
  运魁: "ĐV.Thiên Khôi",
  运钺: "ĐV.Thiên Việt",
  运马: "ĐV.Thiên Mã",
  运鸾: "ĐV.Hồng Loan",
  运喜: "ĐV.Thiên Hỷ",

  // 3. Vòng Thái Tuế (suiqian12) — Lưu niên -> Giữ tiền tố "L."
  岁建: "L.Thái Tuế",
  晦气: "L.Hối Khí",
  丧门: "L.Tang Môn",
  贯索: "L.Quán Sách",
  官符: "L.Quan Phù",
  小耗: "L.Tiểu Hao",
  大耗: "L.Đại Hao",
  龙德: "L.Long Đức",
  白虎: "L.Bạch Hổ",
  天德: "L.Thiên Đức",
  吊客: "L.Điếu Khách",
  病符: "L.Bệnh Phù",
};

/** Dịch tên sao Lưu CN → VN. Nếu không có trong bảng thì dùng bảng sao gốc. */
function vnLuuStar(cn: string): string {
  return LUU_STAR_NAMES_VN[cn] ?? STAR_NAMES_VN[cn] ?? cn;
}

/** Helper tạo date string giữa năm (1/7) để truyền vào horoscope() */
function midYearDateStr(year: number): string {
  return `${year}-07-01`;
}

// ---- Interface cho kết quả sao Lưu ------------------------------------

export interface LuuStarResult {
  yearlyStars: StarVN[][];
  yearlySuiqian: StarVN[][];
  yearlyMutagen: [string, string, string, string];
  decadalStars: StarVN[][];
  decadalMutagen: [string, string, string, string];
  yearlyPalaceNames: string[];
  age: number;
}

// ---- Hàm chính: Lấy toàn bộ sao Lưu từ iztro horoscope ---------------

export function extractLuuStarsFromHoroscope(astrolabe: any, namXem: number): LuuStarResult {
  const dateStr = midYearDateStr(namXem);
  const horo = astrolabe.horoscope(dateStr);

  // 1. Sao Lưu niên cơ bản (Yearly Stars)
  const yearlyStars: StarVN[][] = [];
  const rawYearlyStars = horo.yearly?.stars ?? [];
  for (let i = 0; i < 12; i++) {
    const palaceStars = rawYearlyStars[i] ?? [];
    yearlyStars.push(
      palaceStars.map(
        (s: any) =>
          ({
            name: vnLuuStar(s.name),
            nameCN: s.name,
            type: "luu",
            scope: "yearly",
            isLuuNien: true,
            isLuuDaiVan: false,
          }) as StarVN,
      ),
    );
  }

  // 2. Vòng Thái Tuế Lưu niên (Suiqian12)
  const yearlySuiqian: StarVN[][] = [];
  const rawSuiqian = horo.yearly?.yearlyDecStar?.suiqian12 ?? [];
  for (let i = 0; i < 12; i++) {
    const suiqianName = rawSuiqian[i];
    if (suiqianName) {
      yearlySuiqian.push([
        {
          name: vnLuuStar(suiqianName),
          nameCN: suiqianName,
          type: "suiqian",
          scope: "yearly",
          isLuuNien: true,
          isLuuDaiVan: false,
        } as StarVN,
      ]);
    } else {
      yearlySuiqian.push([]);
    }
  }

  // 3. Tứ Hóa Lưu niên
  const rawYearlyMutagen = horo.yearly?.mutagen ?? [];
  const yearlyMutagen: [string, string, string, string] = [
    rawYearlyMutagen[0] ?? "",
    rawYearlyMutagen[1] ?? "",
    rawYearlyMutagen[2] ?? "",
    rawYearlyMutagen[3] ?? "",
  ];

  // 4. Sao Đại Hạn (Decadal Stars)
  const decadalStars: StarVN[][] = [];
  const rawDecadalStars = horo.decadal?.stars ?? [];
  for (let i = 0; i < 12; i++) {
    const palaceStars = rawDecadalStars[i] ?? [];
    decadalStars.push(
      palaceStars.map(
        (s: any) =>
          ({
            name: vnLuuStar(s.name),
            nameCN: s.name,
            type: "luu",
            scope: "decadal",
            isLuuNien: false,
            isLuuDaiVan: true,
          }) as StarVN,
      ),
    );
  }

  // 5. Tứ Hóa Đại Hạn
  const rawDecadalMutagen = horo.decadal?.mutagen ?? [];
  const decadalMutagen: [string, string, string, string] = [
    rawDecadalMutagen[0] ?? "",
    rawDecadalMutagen[1] ?? "",
    rawDecadalMutagen[2] ?? "",
    rawDecadalMutagen[3] ?? "",
  ];

  const yearlyPalaceNames = horo.yearly?.palaceNames ?? [];
  const age = horo.age?.nominalAge ?? 0;

  return {
    yearlyStars,
    yearlySuiqian,
    yearlyMutagen,
    decadalStars,
    decadalMutagen,
    yearlyPalaceNames,
    age,
  };
}

// ---- Hàm gắn sao Lưu vào palaces VN ----------------------------------

export interface VanHanRotationInput {
  dvRotation?: Record<number, string>;
  lnRotation?: Record<number, string>;
}

export function placeLuuStars(
  palaces: PalaceVN[],
  luuResult: LuuStarResult,
  vanHanSummary?: VanHanRotationInput,
): void {
  const { yearlyStars, yearlySuiqian, yearlyMutagen, decadalStars, decadalMutagen } = luuResult;

  for (let i = 0; i < palaces.length && i < 12; i++) {
    const palace = palaces[i]!;

    // Gắn sao Lưu niên cơ bản
    for (const star of yearlyStars[i] ?? []) {
      palace.minorStars.push(star);
    }

    // Gắn Vòng Thái Tuế Lưu niên
    for (const star of yearlySuiqian[i] ?? []) {
      palace.adjectiveStars.push(star);
    }

    // Gắn sao Đại Hạn
    for (const star of decadalStars[i] ?? []) {
      palace.minorStars.push(star);
    }
  }

  // Gắn Tứ Hóa Lưu niên (Tiền tố L.Hóa...)
  applyLuuSihua(palaces, yearlyMutagen, "yearly");

  // Gắn Tứ Hóa Đại Hạn (Tiền tố ĐV.Hóa...)
  applyLuuSihua(palaces, decadalMutagen, "decadal");

  // Nạp nhãn xoay cung (ĐV.* và LN.*) lên từng palace theo branchIndex
  if (vanHanSummary) {
    const dv = vanHanSummary.dvRotation ?? {};
    const ln = vanHanSummary.lnRotation ?? {};
    for (const palace of palaces) {
      const dvLabel = dv[palace.branchIndex];
      const lnLabel = ln[palace.branchIndex];
      if (dvLabel) palace.daiVanPalaceName = dvLabel.startsWith("ĐV") ? dvLabel : `ĐV.${dvLabel}`;
      if (lnLabel) palace.luuNienPalaceName = lnLabel.startsWith("LN") ? lnLabel : `LN.${lnLabel}`;
    }
  }
}

/**
 * Gắn Tứ Hóa Lưu (niên hoặc hạn) lên các sao trên lá số.
 * KHÔNG ghi đè .sihua trên chính tinh — luôn push entry độc lập vào minorStars
 * với cờ isLuuNien / isLuuDaiVan, để layer hiển thị tự render dạng tách biệt.
 */
function applyLuuSihua(
  palaces: PalaceVN[],
  mutagen: [string, string, string, string],
  scope: "yearly" | "decadal",
): void {
  const prefix = scope === "yearly" ? "L." : "ĐV.";
  const labels = [`${prefix}Hóa Lộc`, `${prefix}Hóa Quyền`, `${prefix}Hóa Khoa`, `${prefix}Hóa Kỵ`];
  const labelsCN = [
    scope === "yearly" ? "流禄" : "运禄",
    scope === "yearly" ? "流权" : "运权",
    scope === "yearly" ? "流科" : "运科",
    scope === "yearly" ? "流忌" : "运忌",
  ];

  for (let h = 0; h < 4; h++) {
    const targetStarCN = mutagen[h];
    if (!targetStarCN) continue;

    for (const palace of palaces) {
      const allStars = [...palace.majorStars, ...palace.minorStars];
      const hit = allStars.find((s) => s.nameCN === targetStarCN);
      if (!hit) continue;

      // Luôn tạo entry độc lập, KHÔNG ghi đè star.sihua cố định
      palace.minorStars.push({
        name: `${labels[h]} (${STAR_NAMES_VN[targetStarCN] ?? targetStarCN})`,
        nameCN: labelsCN[h]!,
        type: "sihua-luu",
        scope,
        isLuuNien: scope === "yearly",
        isLuuDaiVan: scope === "decadal",
        sihua: labels[h],
        sihuaCN: labelsCN[h],
      });
      break;
    }
  }
}


// ---- Hàm tiện ích: Xóa sao Lưu cũ ----------------------------------

export function clearLuuStars(palaces: PalaceVN[]): void {
  for (const palace of palaces) {
    // Xóa sao Lưu trong minorStars
    palace.minorStars = palace.minorStars.filter((s) => {
      const isLuu =
        s.name.startsWith("L.") ||
        s.name.startsWith("Lưu") ||
        s.name.startsWith("Vận") ||
        s.name.startsWith("ĐV.") ||
        s.name.startsWith("Niên") ||
        s.type === "sihua-luu" ||
        s.isLuuNien === true ||
        s.isLuuDaiVan === true ||
        (s as any).scope === "yearly" ||
        (s as any).scope === "decadal";
      return !isLuu;
    });

    // Xóa sao Lưu trong adjectiveStars
    palace.adjectiveStars = palace.adjectiveStars.filter((s) => {
      const isLuu =
        s.name.startsWith("L.") ||
        s.name.startsWith("Lưu") ||
        s.name.startsWith("ĐV.") ||
        s.type === "suiqian" ||
        s.isLuuNien === true ||
        (s as any).scope === "yearly";
      return !isLuu;
    });

    // Xóa sihua Lưu trên các sao gốc
    for (const star of [...palace.majorStars, ...palace.minorStars]) {
      if (
        star.sihua?.startsWith("Lưu") ||
        star.sihua?.startsWith("Vận") ||
        star.sihua?.startsWith("L.") ||
        star.sihua?.startsWith("ĐV.")
      ) {
        star.sihua = "";
        star.sihuaCN = "";
      }
    }
  }
}

export default {
  extractLuuStarsFromHoroscope,
  placeLuuStars,
  clearLuuStars,
};
