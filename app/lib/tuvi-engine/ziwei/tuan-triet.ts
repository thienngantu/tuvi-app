// src/lib/tuvi-engine/ziwei/tuan-triet.ts
// Tuần Trung Không Vong & Triệt Lộ Không Vong — 2 sao đặc trưng Nam phái Việt.
// Bắc phái (iztro) KHÔNG có 2 sao này. Đây là khác biệt mấu chốt.
//
// TUẦN: theo Tuần Giáp của Can-Chi năm sinh. Mỗi Tuần Giáp (10 năm) bỏ trống 2 Chi.
// TRIỆT: theo Can năm sinh, đóng cố định tại 2 Chi.
//
// Quy ước Stem: 0=Giáp 1=Ất 2=Bính 3=Đinh 4=Mậu 5=Kỷ 6=Canh 7=Tân 8=Nhâm 9=Quý
// Quy ước Branch: 0=Tý 1=Sửu 2=Dần 3=Mão 4=Thìn 5=Tỵ 6=Ngọ 7=Mùi 8=Thân 9=Dậu 10=Tuất 11=Hợi

/** Trả về 2 chi (branchIndex) mà Tuần đóng. */
export function placeTuan(yearStem: number, yearBranch: number): [number, number] {
  // xun index: 0=Giáp Tý, 1=Giáp Tuất, ... 5=Giáp Dần
  const xun = (((yearStem - yearBranch + 12) % 12) / 2) | 0;
  // Missing branches per xun: (10-2*xun, 11-2*xun)
  const a = (10 - 2 * xun + 12) % 12;
  const b = (11 - 2 * xun + 12) % 12;
  return [a, b];
}

/** Trả về 2 chi mà Triệt đóng theo Can năm. */
export function placeTriet(yearStem: number): [number, number] {
  // Giáp/Kỷ (0,5): Thân-Dậu (8,9)
  // Ất/Canh (1,6): Ngọ-Mùi (6,7)
  // Bính/Tân (2,7): Thìn-Tỵ (4,5)
  // Đinh/Nhâm (3,8): Dần-Mão (2,3)
  // Mậu/Quý (4,9): Tý-Sửu (0,1)
  const table: Record<number, [number, number]> = {
    0: [8, 9], 5: [8, 9],
    1: [6, 7], 6: [6, 7],
    2: [4, 5], 7: [4, 5],
    3: [2, 3], 8: [2, 3],
    4: [0, 1], 9: [0, 1],
  };
  return table[yearStem]!;
}

export default { placeTuan, placeTriet };
