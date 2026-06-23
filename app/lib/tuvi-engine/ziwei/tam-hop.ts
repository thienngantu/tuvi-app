// src/lib/tuvi-engine/ziwei/tam-hop.ts
// Tiện ích Tam Phương Tứ Chính cho luận Nam phái.
// Nam phái BẮT BUỘC xét 4 cung khi luận 1 cung:
//   - Cung chính (toạ thủ)
//   - Cung xung chiếu (đối diện, +6 mod 12)
//   - 2 cung tam hợp (±4 mod 12)
// Nhị hợp = bảng cố định (Tý-Sửu, Dần-Hợi, Mão-Tuất, Thìn-Dậu, Tỵ-Thân, Ngọ-Mùi)

import type { NormalizedChart, NormalizedCung, NormalizedStar } from "./normalize-vn";

export function getXungChieu(branchIdx: number): number {
  return (branchIdx + 6) % 12;
}

export function getTamHop(branchIdx: number): [number, number] {
  return [(branchIdx + 4) % 12, (branchIdx + 8) % 12];
}

const NHI_HOP: Record<number, number> = {
  0: 1, 1: 0, 2: 11, 11: 2, 3: 10, 10: 3, 4: 9, 9: 4, 5: 8, 8: 5, 6: 7, 7: 6,
};
export function getNhiHop(branchIdx: number): number {
  return NHI_HOP[branchIdx]!;
}

export interface Influence {
  taiCung: NormalizedStar[];   // sao ngay tại cung
  xungChieu: NormalizedStar[]; // sao xung đối
  tamHop: NormalizedStar[];    // sao tại 2 cung tam hợp
  nhiHop: NormalizedStar[];    // sao tại cung nhị hợp
}

function findByBranch(chart: NormalizedChart, idx: number): NormalizedCung | undefined {
  return Object.values(chart.cung).find(c => c.branchIndex === idx);
}

/** Gom toàn bộ sao ảnh hưởng tới 1 cung theo nguyên tắc Tam Phương Tứ Chính. */
export function gatherInfluence(chart: NormalizedChart, branchIdx: number): Influence {
  const main = findByBranch(chart, branchIdx);
  const xung = findByBranch(chart, getXungChieu(branchIdx));
  const [t1, t2] = getTamHop(branchIdx);
  const tamHop1 = findByBranch(chart, t1);
  const tamHop2 = findByBranch(chart, t2);
  const nhi = findByBranch(chart, getNhiHop(branchIdx));

  const allStars = (c?: NormalizedCung) =>
    c ? [...c.saoChinhTinh, ...c.saoPhuTinh] : [];

  return {
    taiCung: allStars(main),
    xungChieu: allStars(xung),
    tamHop: [...allStars(tamHop1), ...allStars(tamHop2)],
    nhiHop: allStars(nhi),
  };
}

export default { getXungChieu, getTamHop, getNhiHop, gatherInfluence };
