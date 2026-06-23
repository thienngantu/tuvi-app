// src/lib/tuvi-engine/ziwei/algorithm-vn.ts
// Engine an sao Tử Vi — wrap thư viện iztro (đã giải đầy đủ thuật toán an sao
// theo cổ pháp Trung Hoa) rồi dịch toàn bộ tên sao / tên cung / Tứ Hóa / độ
// sáng sao sang tiếng Việt theo bảng constants-vn.ts.
// Đồng thời bổ sung hệ thống Sao Lưu động theo năm xem hạn dùng iztro horoscope().

import { astro } from "iztro";
import {
  STAR_NAMES_VN,
  PALACE_NAMES_VN,
  BRIGHTNESS_NAMES_VN,
  SIHUA_NAMES_VN,
  STEM_NAMES_VN,
  BRANCH_NAMES_VN,
  getChangshengVN,
  getNapAm,
} from "./constants-vn";
import { getBrightnessNamPhai } from "./brightness-vn";
import { placeTuan, placeTriet } from "./tuan-triet";
// ✅ MỚI: Import từ luu-sao.ts thay vì luan-giai.ts
import { extractLuuStarsFromHoroscope, placeLuuStars } from "./luu-sao";
import { getVanHanForYear, calculateNguyetHan } from "../engines/nam-phai/van-han";
import { getStarMeta } from "./star-registry";
import { calculatePhiHoa, type PhiHoaResult } from "./phi-hoa";
import { calculateDungThanV2, type DungThanV2Result } from "./dung-than-v2";

export type TuViSchool = "nam" | "bac";

export interface BirthInfo {
  year: number;
  month: number;
  day: number;
  /** Chỉ số canh giờ 0..11 (0 = Tý, 1 = Sửu, ... 11 = Hợi). */
  timeIndex: number;
  gender: "male" | "female";
  name?: string;
  /** Loại ngày người dùng nhập: mặc định là dương lịch. */
  calendarType?: "solar" | "lunar";
  /** Chỉ dùng khi calendarType = lunar. */
  isLeapMonth?: boolean;
  /** Múi giờ (mặc định 7 = Việt Nam). Hiện iztro tự xử lý theo Bắc Kinh, giữ field để mở rộng. */
  timeZone?: number;
  /** Trường phái an sao. Mặc định "nam" (Việt Nam Nam phái). */
  school?: TuViSchool;
}

// ============================================================
// Nam phái: bộ lọc + bảng tra
// ============================================================

/** Các sao Bắc phái thừa không dùng trong Nam phái (xoá khỏi lá số). */
export const BAC_PHAI_BLACKLIST: ReadonlySet<string> = new Set([
  "Vong Thần",
  "Tướng Tinh",
  "Phan An",
  "Phàn Ân",
  "Tức Thần",
  "Chỉ Bối",
  "Thiên Nguyệt",
  "Hồi Khí",
  "Hối Khí",
  "Tuế Dịch",
  "Tai Sát",
  "Thiên Sát",
  "Nguyệt Sát",
  "Quán Sách",

  "Phi Liêm (Vòng)",
]);

/** Vòng Thái Tuế 12 sao Nam phái, theo thứ tự thuận chiều từ cung có địa chi = chi năm sinh. */
const THAI_TUE_RING_NAM: readonly string[] = [
  "Thái Tuế",
  "Thiếu Dương",
  "Tang Môn",
  "Thiếu Âm",
  "Quan Phù",
  "Tử Phù",
  "Tuế Phá",
  "Long Đức",
  "Bạch Hổ",
  "Phúc Đức",
  "Điếu Khách",
  "Trực Phù",
];

/** Các sao thuộc vòng Thái Tuế Nam phái — dùng để dedupe & xoá bản cũ. */
const THAI_TUE_RING_NAMES: ReadonlySet<string> = new Set(THAI_TUE_RING_NAM);

/** Các sao Lộc Tồn satellite hay bị lặp sai vị trí — chỉ giữ bản từ vòng Bác Sĩ (boshi). */
const LOC_TON_DUP_NAMES: ReadonlySet<string> = new Set(["Tiểu Hao", "Đại Hao", "Bệnh Phù", "Phi Liêm"]);

export interface StarVN {
  name: string;
  nameCN: string;
  type: string;
  brightness?: string; // Miếu / Vượng / Đắc / Lợi / Bình / Hãm
  brightnessCN?: string;
  sihua?: string; // Hóa Lộc / Quyền / Khoa / Kỵ
  sihuaCN?: string;
  scope?: "yearly" | "decadal" | string;
  isLuuNien?: boolean;
  isLuuDaiVan?: boolean;
  // Bản thể tinh diệu (bơm từ star-registry trong generateChartVN)
  hanh?: string;
  amDuong?: string;
  phanLoai?: string;
  doiHanh?: string;
  doiAmDuong?: string;
}

export interface PalaceVN {
  index: number;
  name: string; // VN
  nameCN: string;
  stem: string; // Can (VN)
  branch: string; // Chi (VN)
  branchIndex: number; // 0 = Tý ... 11 = Hợi
  stemBranch: string; // "Canh Dần"
  isBodyPalace: boolean; // Thân Cung
  isOriginalPalace: boolean; // Lai Nhân Cung (cung chứa Can năm)
  majorStars: StarVN[]; // Chính tinh
  minorStars: StarVN[]; // Phụ tinh (sáu cát + sáu sát + Tứ Hóa + Sao Lưu…)
  adjectiveStars: StarVN[]; // Lẻ tinh (hoa thần, đào hoa, văn tinh phụ…)
  changsheng12?: string; // Vòng Trường Sinh tại cung
  decadalRange?: [number, number]; // Đại Hạn
  decadalStemBranch?: string;
  ages?: number[]; // Tiểu Hạn (tuổi)
  daiVanPalaceName?: string; // Nhãn xoay cung Đại Vận, vd "ĐV.Mệnh"
  luuNienPalaceName?: string; // Nhãn xoay cung Lưu Niên, vd "LN.Tài Bạch"
  nguyetHanThang?: number; // Tháng Nguyệt Hạn 1..12 rơi vào cung này
}

export interface DecadalVN {
  range: [number, number];
  palace: string; // tên cung VN
  stemBranch: string;
}

export interface ZiweiChartVN {
  birthInfo: BirthInfo;
  namXem: number; // Năm xem tiểu hạn / lưu niên
  solarDate: string;
  lunarDate: string; // VD: "一九九一年九月十七" → "Năm Tân Mùi, tháng 9, ngày 17"
  lunarDateVN: string;
  chineseDate: string; // Bát Tự: "辛未 戊戌 丁卯 戊申"
  chineseDateVN: string; // "Tân Mùi · Mậu Tuất · Đinh Mão · Mậu Thân"
  timeRange: string; // "15:00~17:00"
  shichenName: string; // "Giờ Thân"
  zodiac: string; // Con giáp VN
  soul: string; // Mệnh Chủ (VN)
  body: string; // Thân Chủ (VN)
  fiveElementsClass: string; // Cục Số VN, vd "Mộc Tam Cục"
  palaces: PalaceVN[]; // luôn 12 cung, index theo iztro
  mingGongIndex: number; // index của Mệnh Cung trong palaces
  thanCungIndex: number; // index của Thân Cung
  sihua: { loc: string; quyen: string; khoa: string; ky: string };
  decadals: DecadalVN[];
  napAm: string; // VD: "Đại Hải Thủy"
  tinhChat: string; // VD: "Dương Nam (Thuận Lý)"
  cucMenhQuanHe: string; // VD: "Kim sinh Thủy — Cục sinh Mệnh (Thuận)"
  generatedAt: string;
  phiHoa?: PhiHoaResult;
  dungThanV2?: DungThanV2Result;
}

// ---- Dịch CN→VN ----------------------------------------------------------

const CN_STEM_TO_INDEX: Record<string, number> = {
  甲: 0,
  乙: 1,
  丙: 2,
  丁: 3,
  戊: 4,
  己: 5,
  庚: 6,
  辛: 7,
  壬: 8,
  癸: 9,
};

const CN_BRANCH_TO_INDEX: Record<string, number> = {
  子: 0,
  丑: 1,
  寅: 2,
  卯: 3,
  辰: 4,
  巳: 5,
  午: 6,
  未: 7,
  申: 8,
  酉: 9,
  戌: 10,
  亥: 11,
};

function vnStem(cn: string): string {
  const i = CN_STEM_TO_INDEX[cn];
  return i !== undefined ? STEM_NAMES_VN[i] : cn;
}

function vnBranch(cn: string): string {
  const i = CN_BRANCH_TO_INDEX[cn];
  return i !== undefined ? BRANCH_NAMES_VN[i] : cn;
}

function vnBranchIndex(cn: string): number {
  return CN_BRANCH_TO_INDEX[cn] ?? -1;
}

function vnStar(cn: string): string {
  return STAR_NAMES_VN[cn] ?? cn;
}

function vnBrightness(cn: string): string {
  if (!cn) return "";
  return BRIGHTNESS_NAMES_VN[cn] ?? cn;
}

function vnSihua(cn: string): string {
  if (!cn) return "";
  return SIHUA_NAMES_VN[cn] ?? cn;
}

function vnGanZhi(cn: string): string {
  if (cn.length !== 2) return cn;
  return `${vnStem(cn[0]!)} ${vnBranch(cn[1]!)}`;
}

const ZODIAC_VN: Record<string, string> = {
  鼠: "Tý (Chuột)",
  牛: "Sửu (Trâu)",
  虎: "Dần (Hổ)",
  兔: "Mão (Mèo)",
  龙: "Thìn (Rồng)",
  蛇: "Tỵ (Rắn)",
  马: "Ngọ (Ngựa)",
  羊: "Mùi (Dê)",
  猴: "Thân (Khỉ)",
  鸡: "Dậu (Gà)",
  狗: "Tuất (Chó)",
  猪: "Hợi (Lợn)",
};

const FIVE_EL_VN: Record<string, string> = {
  水二局: "Thủy Nhị Cục",
  木三局: "Mộc Tam Cục",
  金四局: "Kim Tứ Cục",
  土五局: "Thổ Ngũ Cục",
  火六局: "Hỏa Lục Cục",
};

const SHICHEN_NAMES = [
  "Giờ Tý",
  "Giờ Sửu",
  "Giờ Dần",
  "Giờ Mão",
  "Giờ Thìn",
  "Giờ Tỵ",
  "Giờ Ngọ",
  "Giờ Mùi",
  "Giờ Thân",
  "Giờ Dậu",
  "Giờ Tuất",
  "Giờ Hợi",
];

interface IztroStar {
  name: string;
  type: string;
  brightness?: string;
  mutagen?: string;
}

function translateStar(s: IztroStar): StarVN {
  return {
    name: vnStar(s.name),
    nameCN: s.name,
    type: s.type,
    brightness: vnBrightness(s.brightness ?? ""),
    brightnessCN: s.brightness ?? "",
    sihua: vnSihua(s.mutagen ?? ""),
    sihuaCN: s.mutagen ?? "",
  };
}

function parseChineseNumber(s: string): number {
  const d: Record<string, number> = {
    一: 1,
    二: 2,
    三: 3,
    四: 4,
    五: 5,
    六: 6,
    七: 7,
    八: 8,
    九: 9,
    〇: 0,
    零: 0,
  };

  if (!s) return 0;

  // ✅ FIX: Ký tự Hán cổ 廿 (niàn = 20) và 卅 (sà = 30)
  // iztro dùng: 廿一=21, 廿二=22...廿九=29, 卅=30, 卅一=31
  if (s.startsWith("廿")) {
    return 20 + (s.length > 1 ? (d[s[1]!] ?? 0) : 0);
  }
  if (s.startsWith("卅")) {
    return 30 + (s.length > 1 ? (d[s[1]!] ?? 0) : 0);
  }

  // Năm 4 chữ số: 一九八五 → 1985
  if (s.length === 4 && [...s].every((c) => d[c] !== undefined)) {
    return Number([...s].map((c) => d[c]).join(""));
  }

  // Có chữ 十
  const idx = s.indexOf("十");
  if (idx === -1) {
    return [...s].reduce((acc, c) => acc * 10 + (d[c] ?? 0), 0);
  }

  const tens = idx === 0 ? 1 : (d[s[idx - 1]!] ?? 0);
  const ones = idx === s.length - 1 ? 0 : (d[s[idx + 1]!] ?? 0);
  return tens * 10 + ones;
}

function translateLunar(lunarCN: string): string {
  const m = lunarCN.match(/^(.+?)年(闰?)(.+?)月(.+?)$/);

  if (!m) return lunarCN;

  const year = parseChineseNumber(m[1]!);
  const isLeap = m[2] === "闰";
  const month = parseChineseNumber(m[3]!);
  const day = parseChineseNumber(m[4]!);

  return `Năm ${year}, tháng ${isLeap ? "nhuận " : ""}${month}, ngày ${day}`;
}

function translateBaTu(chineseDate: string): string {
  return chineseDate.split(/\s+/).filter(Boolean).map(vnGanZhi).join(" · ");
}

function extractSihuaFromPalaces(palaces: PalaceVN[]): ZiweiChartVN["sihua"] {
  const out = { loc: "—", quyen: "—", khoa: "—", ky: "—" };

  for (const p of palaces) {
    for (const star of [...p.majorStars, ...p.minorStars, ...p.adjectiveStars]) {
      if (star.sihuaCN === "禄") out.loc = star.name;
      else if (star.sihuaCN === "权") out.quyen = star.name;
      else if (star.sihuaCN === "科") out.khoa = star.name;
      else if (star.sihuaCN === "忌") out.ky = star.name;
    }
  }

  return out;
}

// -------------------------------------------------------------------------

const GENDER_CN: Record<BirthInfo["gender"], "男" | "女"> = {
  male: "男",
  female: "女",
};

export function generateChartVN(birthInfo: BirthInfo, namXem: number = new Date().getFullYear()): ZiweiChartVN {
  const { year, month, day, timeIndex, gender, calendarType = "solar", isLeapMonth = false } = birthInfo;

  const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const idx = Math.max(0, Math.min(11, timeIndex));

  const astrolabe =
    calendarType === "lunar"
      ? astro.byLunar(dateStr, idx, GENDER_CN[gender], isLeapMonth, true, "zh-CN")
      : astro.bySolar(dateStr, idx, GENDER_CN[gender], true, "zh-CN");

  const palaces: PalaceVN[] = astrolabe.palaces.map((p, i) => ({
    index: i,
    name: PALACE_NAMES_VN[p.name] ?? p.name,
    nameCN: p.name,
    stem: vnStem(p.heavenlyStem),
    branch: vnBranch(p.earthlyBranch),
    branchIndex: vnBranchIndex(p.earthlyBranch),
    stemBranch: `${vnStem(p.heavenlyStem)} ${vnBranch(p.earthlyBranch)}`,
    isBodyPalace: !!p.isBodyPalace,
    isOriginalPalace: !!p.isOriginalPalace,
    majorStars: (p.majorStars ?? []).map(translateStar),
    minorStars: (p.minorStars ?? []).map(translateStar),
    adjectiveStars: (p.adjectiveStars ?? []).map(translateStar),
    changsheng12: getChangshengVN(p.changsheng12 ?? undefined),
    decadalRange: p.decadal ? [p.decadal.range[0], p.decadal.range[1]] : undefined,
    decadalStemBranch: p.decadal ? `${vnGanZhi(`${p.decadal.heavenlyStem}${p.decadal.earthlyBranch}`)}` : undefined,
    ages: p.ages ?? [],
  }));

  // ================================================================
  // ✅ MỚI: GẮN 3 VÒNG PHỤ TINH TỪ IZTRO VÀO ADJECTIVE STARS
  // Vòng Bác Sĩ (boshi12), Vòng Thái Tuế gốc (suiqian12),
  // Vòng Tướng Quân (jiangqian12)
  // ================================================================

  for (let i = 0; i < palaces.length; i++) {
    const iztroP = astrolabe.palaces[i];
    const p = palaces[i];
    const existingCN = new Set(p.adjectiveStars.map((s) => s.nameCN));

    // Vòng Bác Sĩ (12 sao: Bác Sĩ, Lực Sĩ, Thanh Long, Tiểu Hao, Tướng Quân...)
    if (iztroP.boshi12 && !existingCN.has(iztroP.boshi12)) {
      p.adjectiveStars.push({ name: vnStar(iztroP.boshi12), nameCN: iztroP.boshi12, type: "boshi" });
    }

    // Vòng Thái Tuế gốc (12 sao: Thái Tuế, Tang Môn, Bạch Hổ, Quan Phù...)
    if (iztroP.suiqian12 && !existingCN.has(iztroP.suiqian12)) {
      p.adjectiveStars.push({ name: vnStar(iztroP.suiqian12), nameCN: iztroP.suiqian12, type: "suiqian" });
    }

    // Vòng Tướng Quân (12 sao: Tướng Tinh, Hoa Cái, Kiếp Sát...)
    if (iztroP.jiangqian12 && !existingCN.has(iztroP.jiangqian12)) {
      p.adjectiveStars.push({ name: vnStar(iztroP.jiangqian12), nameCN: iztroP.jiangqian12, type: "jiangqian" });
    }
  }

  // ================================================================
  // ✅ AN 9 SAO THIẾU + OVERRIDE 3 SAO IZTRO AN SAI VỊ TRÍ
  // Đặt SAU 3 vòng, TRƯỚC brightness override (thuộc nhóm an sao gốc)
  // Dùng chung cả 2 phái. Verified vs tuvi.vn
  // ================================================================

  {
    const _gz9 = astrolabe.chineseDate.split(/\s+/)[0] ?? "";
    if (_gz9.length === 2) {
      const _yCan9 = CN_STEM_TO_INDEX[_gz9[0]!] ?? 0;
      const _yChi9 = CN_BRANCH_TO_INDEX[_gz9[1]!] ?? 0;
      // CRITICAL: Dùng tháng/ngày ÂM LỊCH (từ astrolabe.lunarDate),
      // KHÔNG dùng birthInfo.month/day (dương lịch)
      const _lunarMatch = astrolabe.lunarDate.match(/^(.+?)年(闰?)(.+?)月(.+?)$/);
      const _thangAL = _lunarMatch ? parseChineseNumber(_lunarMatch[3]!) : birthInfo.month;
      const _ngayAL = _lunarMatch ? parseChineseNumber(_lunarMatch[4]!) : birthInfo.day;
      const _gioIdx = idx;

      // --- Bảng tra cố định ---

      // Đường Phù (Can năm sinh)
      const _DUONG_PHU = [7, 8, 10, 11, 10, 11, 1, 2, 4, 5];
      // Quốc Ấn (Can năm sinh)
      const _QUOC_AN = [10, 11, 1, 2, 1, 2, 4, 5, 7, 8];
      // Lưu Hà (Can năm sinh)
      const _LUU_HA = [9, 10, 7, 4, 5, 6, 8, 3, 11, 2];
      // LN Văn Tinh (Can năm sinh) — BẢNG TRA, KHÔNG dùng Lộc Tồn+2
      // Giáp→Tỵ, Ất→Ngọ, Bính/Mậu→Thân, Đinh/Kỷ→Dậu, Canh→Hợi, Tân→Tý, Nhâm→Dần, Quý→Mão
      const _LN_VAN_TINH = [5, 6, 8, 9, 8, 9, 11, 0, 2, 3];

      // Đào Hoa (Chi năm sinh → Tam Hợp)
      const _DAO_HOA: Record<number, number> = {
        2: 3,
        6: 3,
        10: 3, // Dần,Ngọ,Tuất → Mão
        8: 9,
        0: 9,
        4: 9, // Thân,Tý,Thìn → Dậu
        5: 6,
        9: 6,
        1: 6, // Tỵ,Dậu,Sửu → Ngọ
        11: 0,
        3: 0,
        7: 0, // Hợi,Mão,Mùi → Tý
      };

      // Giải Thần: Tuất(10) = năm Tý, NGHỊCH đến chi năm sinh
      const _giaiThan = (10 - _yChi9 + 12) % 12;

      // Thiên Quý: Thìn(4) = giờ Tý, thuận đến giờ sinh → vị trí Văn Khúc
      //   tại đó đặt ngày 1, NGHỊCH đến ngày sinh, rồi tiến 1 ô
      const _thienQuyStep1 = (4 + _gioIdx) % 12;
      const _thienQuy = (_thienQuyStep1 - (_ngayAL - 1) + 120) % 12;
      // Tiến 1 ô
      const _thienQuyFinal = (_thienQuy + 1) % 12;

      // Thiên Y: Sửu(1) = tháng 1, THUẬN đến tháng sinh
      const _thienY = (1 + _thangAL - 1) % 12;

      // Thiên Giải: Thân(8) = tháng 1, THUẬN đến tháng sinh
      const _thienGiai = (8 + _thangAL - 1) % 12;

      // Địa Giải: Mùi(7) = tháng 1, THUẬN đến tháng sinh
      const _diaGiai = (7 + _thangAL - 1) % 12;

      // Đẩu Quân: chi năm sinh NGHỊCH tháng sinh, THUẬN giờ sinh
      const _dauQuan = (((_yChi9 - (_thangAL - 1) + 12) % 12) + _gioIdx) % 12;

      const _allNewStars = [
        { bi: _DAO_HOA[_yChi9] ?? 0, name: "Đào Hoa" },
        { bi: _thienY, name: "Thiên Y" },
        { bi: _thienGiai, name: "Thiên Giải" },
        { bi: _diaGiai, name: "Địa Giải" },
        { bi: _LUU_HA[_yCan9]!, name: "Lưu Hà" },
        { bi: _LN_VAN_TINH[_yCan9]!, name: "LN Văn Tinh" },
        { bi: _DUONG_PHU[_yCan9]!, name: "Đường Phù" },
        { bi: _QUOC_AN[_yCan9]!, name: "Quốc Ấn" },
        { bi: _dauQuan, name: "Đẩu Quân" },
        { bi: _giaiThan, name: "Giải Thần" },
        { bi: _thienQuyFinal, name: "Thiên Quý" },
      ];

      // Xóa phiên bản iztro sai (Giải Thần, Thiên Quý) rồi an lại đúng vị trí
      const _overrideNames = new Set(["Giải Thần", "Thiên Quý"]);
      for (const p of palaces) {
        p.adjectiveStars = p.adjectiveStars.filter((s) => !_overrideNames.has(s.name));
      }

      for (const ns of _allNewStars) {
        const p = palaces.find((x) => x.branchIndex === ns.bi);
        if (p && !p.adjectiveStars.some((s) => s.name === ns.name)) {
          p.adjectiveStars.push({ name: ns.name, nameCN: "", type: "nam_extra" });
        }
      }
    }
  }

  // ================================================================
  // ✅ OVERRIDE HỎA TINH + LINH TINH THEO NAM PHÁI
  // iztro có thể an sai hướng chạy so với chuẩn VN
  // ================================================================
  {
    const _yearGzHL = astrolabe.chineseDate.split(/\s+/)[0] ?? "";
    if (_yearGzHL.length === 2) {
      const _yCanIdxHL = CN_STEM_TO_INDEX[_yearGzHL[0]!] ?? 0;
      const _yChiIdxHL = CN_BRANCH_TO_INDEX[_yearGzHL[1]!] ?? 0;
      const _gioIdxHL = idx;

      const HOA_START: Record<number, number> = {
        2: 1, 6: 1, 10: 1,
        8: 2, 0: 2, 4: 2,
        5: 3, 9: 3, 1: 3,
        11: 9, 3: 9, 7: 9,
      };

      const LINH_START: Record<number, number> = {
        2: 3, 6: 3, 10: 3,
        8: 10, 0: 10, 4: 10,
        5: 10, 9: 10, 1: 10,
        11: 10, 3: 10, 7: 10,
      };

      const hoaBase = HOA_START[_yChiIdxHL] ?? 1;
      const linhBase = LINH_START[_yChiIdxHL] ?? 3;

      const _isDuongCanHL = _yCanIdxHL % 2 === 0;
      const _isMaleHL = gender === "male";
      const duongNamAmNu = (_isDuongCanHL && _isMaleHL) || (!_isDuongCanHL && !_isMaleHL);

      let hoaFinal: number;
      let linhFinal: number;

      if (duongNamAmNu) {
        hoaFinal = (hoaBase + _gioIdxHL) % 12;
        linhFinal = (linhBase - _gioIdxHL + 120) % 12;
      } else {
        hoaFinal = (hoaBase - _gioIdxHL + 120) % 12;
        linhFinal = (linhBase + _gioIdxHL) % 12;
      }

      for (const p of palaces) {
        p.minorStars = p.minorStars.filter(
          (s) => s.name !== "Hỏa Tinh" && s.name !== "Linh Tinh"
        );
      }

      const pHoa = palaces.find((x) => x.branchIndex === hoaFinal);
      if (pHoa) {
        pHoa.minorStars.push({ name: "Hỏa Tinh", nameCN: "火星", type: "lucsat" });
      }

      const pLinh = palaces.find((x) => x.branchIndex === linhFinal);
      if (pLinh) {
        pLinh.minorStars.push({ name: "Linh Tinh", nameCN: "铃星", type: "lucsat" });
      }
    }
  }

  // Override độ sáng 14 chính tinh theo Nam phái
  for (const p of palaces) {
    for (const star of p.majorStars) {
      const nam = getBrightnessNamPhai(star.name, p.branch);
      if (nam) star.brightness = nam;
    }
  }

  // An Tuần Không & Triệt Không (Đặc trưng Nam phái)
  const yearGz = astrolabe.chineseDate.split(/\s+/)[0] ?? "";
  if (yearGz.length === 2) {
    const yStem = CN_STEM_TO_INDEX[yearGz[0]!] ?? 0;
    const yBranch = CN_BRANCH_TO_INDEX[yearGz[1]!] ?? 0;

    const [t1, t2] = placeTuan(yStem, yBranch);
    const [r1, r2] = placeTriet(yStem);

    for (const p of palaces) {
      if (p.branchIndex === t1 || p.branchIndex === t2) {
        p.adjectiveStars.push({ name: "Tuần", nameCN: "旬", type: "neutral" });
      }

      if (p.branchIndex === r1 || p.branchIndex === r2) {
        p.adjectiveStars.push({ name: "Triệt", nameCN: "截", type: "neutral" });
      }
    }
  }

  // ================================================================
  // ✅ NAM PHÁI OVERRIDE (mặc định)
  // - Filter blacklist sao Bắc phái rác
  // - Xoá vòng Thái Tuế cũ (type=suiqian) + dedupe sao Lộc Tồn lặp
  // - Ghi đè vòng Thái Tuế Nam phái (12 sao, khởi tại chi năm sinh)
  // - Hardcode Thiên La (Thìn) + Địa Võng (Tuất)
  // ================================================================
  const school: TuViSchool = birthInfo.school ?? "nam";

  if (school === "nam") {
    // 1) Bỏ vòng Thái Tuế cũ (suiqian) — sẽ thay bằng Nam phái
    for (const p of palaces) {
      p.adjectiveStars = p.adjectiveStars.filter((s) => s.type !== "suiqian");
    }

    // 2) Lọc blacklist (toàn bộ 3 nhóm sao)
    const filterBL = (s: StarVN) => !BAC_PHAI_BLACKLIST.has(s.name);
    for (const p of palaces) {
      p.minorStars = p.minorStars.filter(filterBL);
      p.adjectiveStars = p.adjectiveStars.filter(filterBL);
    }

    // 3) Dedupe sao Lộc Tồn lặp (Tiểu Hao, Đại Hao, Bệnh Phù, Phi Liêm)
    //    — ƯU TIÊN giữ bản từ vòng Bác Sĩ (type='boshi'), xoá bản 蜚廉/小耗/大耗/病符 lẻ
    //    do iztro phát ra song song. Nếu không tồn tại bản boshi (hiếm) thì giữ bản đầu tiên.
    {
      // Bước 1: xác định tên nào đã có bản boshi
      const hasBoshi = new Set<string>();
      for (const p of palaces) {
        for (const s of p.adjectiveStars) {
          if (LOC_TON_DUP_NAMES.has(s.name) && s.type === "boshi") hasBoshi.add(s.name);
        }
      }
      // Bước 2: xoá các bản không phải boshi nếu đã có bản boshi
      for (const p of palaces) {
        p.adjectiveStars = p.adjectiveStars.filter((s) => {
          if (!LOC_TON_DUP_NAMES.has(s.name)) return true;
          if (hasBoshi.has(s.name)) return s.type === "boshi";
          return true;
        });
        // Cùng quy tắc cho minorStars (蜚廉 có thể nằm trong minorStars)
        p.minorStars = p.minorStars.filter((s) => {
          if (!LOC_TON_DUP_NAMES.has(s.name)) return true;
          if (hasBoshi.has(s.name)) return false;
          return true;
        });
      }
      // Bước 3: dedupe cùng tên nếu vẫn lặp (an toàn)
      const seenDup = new Set<string>();
      for (const p of palaces) {
        p.adjectiveStars = p.adjectiveStars.filter((s) => {
          if (!LOC_TON_DUP_NAMES.has(s.name)) return true;
          const key = s.name;
          if (seenDup.has(key)) return false;
          seenDup.add(key);
          return true;
        });
      }
    }

    // 4) Ghi đè vòng Thái Tuế Nam phái 12 sao
    //    Khởi tại cung có chi == chi năm sinh, đi thuận chiều (theo branchIndex tăng dần mod 12).
    const yBranchForRing = (() => {
      const gz = astrolabe.chineseDate.split(/\s+/)[0] ?? "";
      return gz.length === 2 ? (CN_BRANCH_TO_INDEX[gz[1]!] ?? 0) : 0;
    })();
    // Xoá nếu trùng tên (đảm bảo idempotent với các sao cùng tên còn sót)
    for (const p of palaces) {
      p.adjectiveStars = p.adjectiveStars.filter((s) => !THAI_TUE_RING_NAMES.has(s.name));
    }
    for (let i = 0; i < 12; i++) {
      const branch = (yBranchForRing + i) % 12;
      const p = palaces.find((x) => x.branchIndex === branch);
      if (p) {
        p.adjectiveStars.push({
          name: THAI_TUE_RING_NAM[i]!,
          nameCN: "",
          type: "nam_thaitue",
        });
      }
    }

    // 5) Hardcode Thiên La (Thìn=4) + Địa Võng (Tuất=10)
    for (const p of palaces) {
      if (p.branchIndex === 4 && !p.adjectiveStars.some((s) => s.name === "Thiên La")) {
        p.adjectiveStars.push({ name: "Thiên La", nameCN: "天罗", type: "nam_fixed" });
      }
      if (p.branchIndex === 10 && !p.adjectiveStars.some((s) => s.name === "Địa Võng")) {
        p.adjectiveStars.push({ name: "Địa Võng", nameCN: "地网", type: "nam_fixed" });
      }
    }
  }

  // ================================================================
  // ✅ MỚI: AN SAO LƯU ĐỘNG DÙNG IZTRO HOROSCOPE()
  // Thay thế toàn bộ 10 hàm calculateLuuXxx() sai từ luan-giai.ts
  // bằng extractLuuStarsFromHoroscope() + placeLuuStars() từ luu-sao.ts
  // ================================================================

  try {
    const luuResult = extractLuuStarsFromHoroscope(astrolabe, namXem);
    // Tính vanHanSummary để có dvRotation/lnRotation xoay tên cung
    let vanHanSummary;
    try {
      const _menhIdxTmp = palaces.findIndex((p) => p.nameCN === "命宫" || p.nameCN === "命");
      const _menhBI = palaces[_menhIdxTmp]?.branchIndex ?? 0;
      vanHanSummary = getVanHanForYear(birthInfo.year, gender, _menhBI, 4, palaces, namXem);
    } catch (e) {
      console.warn("[algorithm-vn] Không tính được vanHanSummary cho xoay cung:", e);
    }
    placeLuuStars(palaces, luuResult, vanHanSummary);

    // Gắn Nguyệt Hạn (tháng 1..12) lên từng cung theo năm xem
    if (vanHanSummary?.lnRotation) {
      try {
        const thangArr = calculateNguyetHan(palaces, vanHanSummary.lnRotation);
        for (const p of palaces) {
          const t = thangArr[p.branchIndex];
          if (t && t > 0) p.nguyetHanThang = t;
        }
      } catch (e) {
        console.warn("[algorithm-vn] Không tính được Nguyệt Hạn:", e);
      }
    }
  } catch (err) {
    console.warn("[algorithm-vn] Lỗi khi tính sao Lưu:", err);
    // Nếu lỗi, lá số gốc vẫn hiển thị bình thường, chỉ thiếu sao Lưu
  }

  // ================================================================

  const mingGongIndex = palaces.findIndex((p) => p.nameCN === "命宫" || p.nameCN === "命");
  const thanCungIndex = palaces.findIndex((p) => p.isBodyPalace);

  const decadals: DecadalVN[] = palaces
    .filter((p) => p.decadalRange)
    .map((p) => ({
      range: p.decadalRange!,
      palace: p.name,
      stemBranch: p.decadalStemBranch ?? "",
    }))
    .sort((a, b) => a.range[0] - b.range[0]);

  // ================================================================
  // ✅ MỚI: Tính Nạp Âm + Tính Chất + Cục vs Mệnh Ngũ Hành
  // ================================================================
  const _canIdx = CN_STEM_TO_INDEX[yearGz[0]!] ?? 0;
  const _chiIdx = CN_BRANCH_TO_INDEX[yearGz[1]!] ?? 0;

  // 1. Nạp Âm — getNapAm nhận chuỗi Can Chi tiếng Việt
  const _canChiVN = `${STEM_NAMES_VN[_canIdx]} ${BRANCH_NAMES_VN[_chiIdx]}`;
  const _napAmObj = getNapAm(_canChiVN);
  const _napAmFull = _napAmObj?.full ?? "";
  const _napAmHanh = _napAmObj?.hanh ?? "";

  // 2. Tính Chất + Âm Dương Thuận/Nghịch Lý
  // Thuận Lý = polarity Can năm sinh (Dương/Âm) trùng polarity địa chi Mệnh Cung
  // Nghịch Lý = ngược lại. VD: Nhâm Tuất Dương Nam, Mệnh tại Mão (Âm chi) → Nghịch Lý
  const _isDuong = _canIdx % 2 === 0;
  const _isMale = gender === "male";
  const _menhBranchIdx = palaces[mingGongIndex]?.branchIndex ?? 0;
  const _menhIsDuong = _menhBranchIdx % 2 === 0;
  const _thuanLy = _isDuong === _menhIsDuong;
  const _tinhChatLabel = _isDuong ? (_isMale ? "Dương Nam" : "Dương Nữ") : _isMale ? "Âm Nam" : "Âm Nữ";
  const _tinhChatFull = `${_tinhChatLabel} (Âm Dương ${_thuanLy ? "Thuận" : "Nghịch"} Lý)`;

  // 3. Cục vs Mệnh Ngũ Hành
  const _cucElement = (() => {
    const cls = FIVE_EL_VN[astrolabe.fiveElementsClass] ?? astrolabe.fiveElementsClass;
    if (cls.startsWith("Thủy")) return "Thủy";
    if (cls.startsWith("Mộc")) return "Mộc";
    if (cls.startsWith("Kim")) return "Kim";
    if (cls.startsWith("Thổ")) return "Thổ";
    if (cls.startsWith("Hỏa")) return "Hỏa";
    return "";
  })();
  const _menhElement = _napAmHanh;

  const _sinhKhac = (() => {
    if (!_cucElement || !_menhElement) return "";
    const sinh: Record<string, string> = { Kim: "Thủy", Thủy: "Mộc", Mộc: "Hỏa", Hỏa: "Thổ", Thổ: "Kim" };
    const khac: Record<string, string> = { Kim: "Mộc", Mộc: "Thổ", Thổ: "Thủy", Thủy: "Hỏa", Hỏa: "Kim" };
    if (_cucElement === _menhElement) return `${_cucElement} đồng hành — Bình hòa`;
    if (sinh[_cucElement] === _menhElement) return `${_cucElement} sinh ${_menhElement} — Cục sinh Mệnh (Thuận)`;
    if (sinh[_menhElement] === _cucElement) return `${_menhElement} sinh ${_cucElement} — Mệnh sinh Cục (Tiết khí)`;
    if (khac[_cucElement] === _menhElement) return `${_cucElement} khắc ${_menhElement} — Cục khắc Mệnh (Bất lợi)`;
    if (khac[_menhElement] === _cucElement) return `${_menhElement} khắc ${_cucElement} — Mệnh khắc Cục (Nỗ lực)`;
    return `${_cucElement} vs ${_menhElement}`;
  })();

  // Bơm thuộc tính bản thể (hành / âm dương / phân loại) từ star-registry
  for (const palace of palaces) {
    for (const star of [...palace.majorStars, ...palace.minorStars, ...palace.adjectiveStars]) {
      const meta = getStarMeta(star.name);
      if (meta) {
        star.hanh = meta.hanh;
        star.amDuong = meta.amDuong;
        star.phanLoai = meta.phanLoai;
        if (meta.doiHanh) star.doiHanh = meta.doiHanh;
        if (meta.doiAmDuong) star.doiAmDuong = meta.doiAmDuong;
      }
    }
  }

  const phiHoaResult = calculatePhiHoa(palaces);

  return {
    birthInfo,
    namXem,
    solarDate: astrolabe.solarDate,
    lunarDate: astrolabe.lunarDate,
    lunarDateVN: translateLunar(astrolabe.lunarDate),
    chineseDate: astrolabe.chineseDate,
    chineseDateVN: translateBaTu(astrolabe.chineseDate),
    timeRange: astrolabe.timeRange,
    shichenName: SHICHEN_NAMES[idx] ?? "Giờ ?",
    zodiac: ZODIAC_VN[astrolabe.zodiac] ?? astrolabe.zodiac,
    soul: vnStar(astrolabe.soul),
    body: vnStar(astrolabe.body),
    fiveElementsClass: FIVE_EL_VN[astrolabe.fiveElementsClass] ?? astrolabe.fiveElementsClass,
    palaces,
    mingGongIndex,
    thanCungIndex,
    sihua: extractSihuaFromPalaces(palaces),
    decadals,
    napAm: _napAmFull,
    tinhChat: _tinhChatFull,
    cucMenhQuanHe: _sinhKhac,
    generatedAt: new Date().toISOString(),
    phiHoa: phiHoaResult,
    dungThanV2: calculateDungThanV2(palaces, phiHoaResult, gender, "ban_menh"),
  };
}

export default { generateChartVN };
