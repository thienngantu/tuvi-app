import type { PalaceVN } from "../../ziwei/algorithm-vn";

export interface VanHanSummary {
  dvRotation: Record<number, string>;
  lnRotation: Record<number, string>;
  currentDaiVan?: {
    palaceIndex: number;
    branchIndex: number;
    stemBranch: string;
    range: [number, number];
  };
}

const PALACE_ORDER = [
  "Mệnh","Phụ Mẫu","Phúc Đức","Điền Trạch",
  "Quan Lộc","Nô Bộc","Thiên Di","Tật Ách",
  "Tài Bạch","Tử Tức","Phu Thê","Huynh Đệ",
];

export function getVanHanForYear(
  birthYear: number,
  gender: "male" | "female",
  menhBranchIndex: number,
  cucSo: number,
  palaces: PalaceVN[],
  namXem: number
): VanHanSummary {
  const age = namXem - birthYear;

  // Tính Đại Vận hiện tại
  const dvIndex = Math.floor((age - 1) / 10);

  // Tìm cung Đại Vận
  const currentDV = palaces.find(p =>
    p.decadalRange &&
    age >= p.decadalRange[0] &&
    age <= p.decadalRange[1]
  );

  const dvBranchIndex = currentDV?.branchIndex ?? menhBranchIndex;

  // Tạo bảng xoay cung Đại Vận
  const dvRotation: Record<number, string> = {};
  for (let i = 0; i < 12; i++) {
    const bi = (dvBranchIndex + i) % 12;
    dvRotation[bi] = `ĐV.${PALACE_ORDER[i]}`;
  }

  // Chi năm xem → cung Lưu Niên
  const yearBranch = (namXem - 4) % 12;
  const lnBranchIndex = ((yearBranch % 12) + 12) % 12;

  // Tạo bảng xoay cung Lưu Niên
  const lnRotation: Record<number, string> = {};
  for (let i = 0; i < 12; i++) {
    const bi = (lnBranchIndex + i) % 12;
    lnRotation[bi] = `LN.${PALACE_ORDER[i]}`;
  }

  return {
    dvRotation,
    lnRotation,
    currentDaiVan: currentDV ? {
      palaceIndex: currentDV.index,
      branchIndex: dvBranchIndex,
      stemBranch: currentDV.decadalStemBranch ?? "",
      range: currentDV.decadalRange!,
    } : undefined,
  };
}

export function calculateNguyetHan(
  palaces: PalaceVN[],
  lnRotation: Record<number, string>
): Record<number, number> {
  const result: Record<number, number> = {};
  for (const palace of palaces) {
    const label = lnRotation[palace.branchIndex];
    if (label) {
      // Tháng 1 = LN.Mệnh, tháng 2 = LN.Phụ Mẫu...
      const idx = PALACE_ORDER.findIndex(n => label.includes(n));
      if (idx >= 0) result[palace.branchIndex] = idx + 1;
    }
  }
  return result;
}

export default { getVanHanForYear, calculateNguyetHan };