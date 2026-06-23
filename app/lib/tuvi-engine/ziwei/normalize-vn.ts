// src/lib/tuvi-engine/ziwei/normalize-vn.ts
// Chuẩn hoá ZiweiChartVN → cấu trúc phẳng cho UI / AI tiêu thụ.

import type { ZiweiChartVN, StarVN, PalaceVN } from "./algorithm-vn";
import { GENDER_VN } from "./constants-vn";

export interface NormalizedStar {
  ten: string;
  doSang?: string;  // Miếu / Vượng / ...
  tuHoa?: string;   // Hóa Lộc / Quyền / Khoa / Kỵ
  hanh?: string;
  phanLoai?: string;
  doiHanh?: string;
  doiAmDuong?: string;
}

export interface NormalizedCung {
  ten: string;
  canChi: string;
  diaChi: string;       // "Dần", "Mão"...
  branchIndex: number;  // 0..11
  laMenh: boolean;
  laThan: boolean;
  laLaiNhan: boolean;   // Lai Nhân Cung (chứa Can năm sinh)
  saoChinhTinh: NormalizedStar[];
  saoPhuTinh: NormalizedStar[];
  saoLeTinh: NormalizedStar[];
  truongSinh?: string;
  daiHan?: { tuoiBatDau: number; tuoiKetThuc: number; canChi: string };
  // Backward-compat (string arrays) cho ChartResult.tsx hiện tại
  saoChinhTinhStr: string[];
  saoPhuTinhStr: string[];
  sihua: string[];
}

export interface NormalizedChart {
  hoTen: string;
  ngaySinhDuong: string;
  ngaySinhAm: string;
  baTu: string;             // Bát Tự
  conGiap: string;
  gioiTinh: string;
  gioSinh: string;          // "Giờ Thân (15:00–17:00)"
  muiGio: number;

  menhChu: string;          // Sao chủ Mệnh
  thanChu: string;          // Sao chủ Thân
  cucSo: string;            // VD "Mộc Tam Cục"

  tuHoa: {
    hóaLộc: string;
    hóaQuyền: string;
    hóaKhoa: string;
    hóaKỵ: string;
  };

  cung: Record<string, NormalizedCung>;
  cungOrder: string[];      // thứ tự tên cung theo iztro (Mệnh đầu tiên)

  menhCung: {
    ten: string;
    canChi: string;
    cucSo: string;
  };

  daiHan: Array<{
    tuoiBatDau: number;
    tuoiKetThuc: number;
    cung: string;
    canChi: string;
  }>;

  thoiGianTao: string;
}

function fmtStar(s: StarVN): NormalizedStar {
  const out: NormalizedStar = { ten: s.name };
  if (s.brightness) out.doSang = s.brightness;
  if (s.sihua) out.tuHoa = s.sihua;
  if (s.hanh) out.hanh = s.hanh;
  if (s.phanLoai) out.phanLoai = s.phanLoai;
  if (s.doiHanh) out.doiHanh = s.doiHanh;
  if (s.doiAmDuong) out.doiAmDuong = s.doiAmDuong;
  return out;
}

function fmtStarStr(s: StarVN): string {
  let t = s.name;
  if (s.brightness) t += ` (${s.brightness})`;
  if (s.sihua) t += ` [${s.sihua}]`;
  return t;
}

function normalizePalace(p: PalaceVN): NormalizedCung {
  const chinh = p.majorStars.map(fmtStar);
  const phu = p.minorStars.map(fmtStar);
  const le = p.adjectiveStars.map(fmtStar);
  const sihua: string[] = [];
  for (const s of [...p.majorStars, ...p.minorStars, ...p.adjectiveStars]) {
    if (s.sihua) sihua.push(`${s.name} ${s.sihua}`);
  }
  return {
    ten: p.name,
    canChi: p.stemBranch,
    diaChi: p.branch,
    branchIndex: p.branchIndex,
    laMenh: p.nameCN === "命宫" || p.nameCN === "命",
    laThan: p.isBodyPalace,
    laLaiNhan: p.isOriginalPalace,
    saoChinhTinh: chinh,
    saoPhuTinh: phu,
    saoLeTinh: le,
    truongSinh: p.changsheng12,
    daiHan: p.decadalRange
      ? { tuoiBatDau: p.decadalRange[0], tuoiKetThuc: p.decadalRange[1], canChi: p.decadalStemBranch ?? "" }
      : undefined,
    saoChinhTinhStr: p.majorStars.map(fmtStarStr),
    saoPhuTinhStr: [...p.minorStars, ...p.adjectiveStars].map(fmtStarStr),
    sihua,
  };
}

export function normalizeChartVN(chart: ZiweiChartVN): NormalizedChart {
  const cung: Record<string, NormalizedCung> = {};
  const cungOrder: string[] = [];
  for (const p of chart.palaces) {
    const n = normalizePalace(p);
    cung[p.name] = n;
    cungOrder.push(p.name);
  }
  const menh = chart.palaces[chart.mingGongIndex];

  return {
    hoTen: chart.birthInfo.name ?? "",
    ngaySinhDuong: chart.solarDate,
    ngaySinhAm: chart.lunarDateVN,
    baTu: chart.chineseDateVN,
    conGiap: chart.zodiac,
    gioiTinh: GENDER_VN[chart.birthInfo.gender] ?? chart.birthInfo.gender,
    gioSinh: `${chart.shichenName} (${chart.timeRange})`,
    muiGio: chart.birthInfo.timeZone ?? 7,

    menhChu: chart.soul,
    thanChu: chart.body,
    cucSo: chart.fiveElementsClass,

    tuHoa: {
      hóaLộc: chart.sihua.loc,
      hóaQuyền: chart.sihua.quyen,
      hóaKhoa: chart.sihua.khoa,
      hóaKỵ: chart.sihua.ky,
    },

    cung,
    cungOrder,

    menhCung: {
      ten: menh?.name ?? "Mệnh Cung",
      canChi: menh?.stemBranch ?? "",
      cucSo: chart.fiveElementsClass,
    },

    daiHan: chart.decadals.map(d => ({
      tuoiBatDau: d.range[0],
      tuoiKetThuc: d.range[1],
      cung: d.palace,
      canChi: d.stemBranch,
    })),

    thoiGianTao: chart.generatedAt,
  };
}

export default { normalizeChartVN };
