/**
 * lib/lunar/lunar-vn.ts
 * Lunar Calendar Converter for Vietnam (GMT+7)
 * Port from lasotuvi/Lich_HND.py (Ho Ngoc Duc, 2006)
 * Based on: "Astronomical Algorithms" by Jean Meeus (1998)
 */

export function jdFromDate(day: number, month: number, year: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  let jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  if (jd < 2299161) {
    jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
  }
  return jd;
}

export function jdToDate(jd: number): [number, number, number] {
  let a: number, b: number, c: number;
  if (jd > 2299160) {
    a = jd + 32044;
    b = Math.floor((4 * a + 3) / 146097);
    c = a - Math.floor((b * 146097) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = b * 100 + d - 4800 + Math.floor(m / 10);
  return [day, month, year];
}

export function NewMoon(k: number): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = Math.PI / 180;
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 -= 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
  C1 -= 0.0004 * Math.sin(dr * 3 * Mpr);
  C1 += 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
  C1 -= 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
  C1 -= 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
  C1 += 0.001 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
  let deltat: number;
  if (T < -11) {
    deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
  } else {
    deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
  }
  return Jd1 + C1 - deltat;
}

export function SunLongitude(jdn: number): number {
  const T = (jdn - 2451545.0) / 36525;
  const T2 = T * T;
  const dr = Math.PI / 180;
  const M = 357.52910918 + 35999.05029094 * T;
  const C = (1.91412633 - 0.004817 * T - 0.000014 * T2) * Math.sin(M * dr)
    + (0.019993 - 0.000101 * T) * Math.sin(2 * M * dr)
    + 0.00029 * Math.sin(3 * M * dr);
  const lambda = 280.46646 + 36000.76983 * T + 0.0003032 * T2 + C;
  return lambda - Math.floor(lambda / 360) * 360;
}

export interface LunarDateVN {
  year: number;
  month: number;
  day: number;
  isLeapMonth: boolean;
  yearStem: number;
  yearBranch: number;
  yearName?: string;
}

// Epoch: JD of Jan 1, 1900 (same as NewMoon base)
const LUNAR_EPOCH = 2415021.076998695;

function _getNewMoonDay(k: number, tz: number): number {
  return Math.floor(NewMoon(k) + 0.5 + tz / 24);
}

// Find JD of the 11th lunar month start (contains winter solstice) for a given year
function _getLunarMonth11(yyyy: number, tz: number): number {
  const off = jdFromDate(31, 12, yyyy) - LUNAR_EPOCH;
  const k = Math.floor(off / 29.530588853);
  const nm = _getNewMoonDay(k, tz);
  // Winter solstice: sun longitude >= 270°
  return SunLongitude(nm) >= 270 ? _getNewMoonDay(k - 1, tz) : nm;
}

// Find offset of leap month in a lunar year starting at a11
function _getLeapMonthOffset(a11: number, tz: number): number {
  const k = Math.floor((a11 - LUNAR_EPOCH) / 29.530588853 + 0.5);
  let i = 1;
  let last = Math.floor(SunLongitude(_getNewMoonDay(k + 1, tz)) / 30);
  let arc: number;
  do {
    i++;
    arc = Math.floor(SunLongitude(_getNewMoonDay(k + i, tz)) / 30);
  } while (arc !== last && i < 14);
  return i - 1;
}

export function getLunarDate(year: number, month: number, day: number, timeZone: number = 7): LunarDateVN {
  const dayNumber = jdFromDate(day, month, year);

  // k = index of new moon relative to Jan 1900 epoch
  let k = Math.floor((dayNumber - LUNAR_EPOCH) / 29.530588853);

  // Find start of current lunar month (new moon day in local TZ)
  let monthStart = _getNewMoonDay(k + 1, timeZone);
  if (monthStart > dayNumber) {
    monthStart = _getNewMoonDay(k, timeZone);
  } else {
    k += 1;
  }

  const lunarDay = dayNumber - monthStart + 1;

  // Find 11th lunar month (winter solstice month) for this and adjacent years
  const a11 = _getLunarMonth11(year, timeZone);
  let lunarYear: number;
  let yearStart: number;
  let yearEnd: number;

  if (a11 >= monthStart) {
    lunarYear = year;
    yearStart = _getLunarMonth11(year - 1, timeZone);
    yearEnd = a11;
  } else {
    lunarYear = year + 1;
    yearStart = a11;
    yearEnd = _getLunarMonth11(year + 1, timeZone);
  }

  // Count lunar months from yearStart
  const diff = Math.floor((monthStart - yearStart) / 29);
  let lunarMonth = diff + 11;
  let isLeapMonth = false;

  // Leap year has 13 months
  if (yearEnd - yearStart > 365) {
    const leapOff = _getLeapMonthOffset(yearStart, timeZone);
    if (diff >= leapOff) {
      lunarMonth = diff + 10;
      if (diff === leapOff) isLeapMonth = true;
    }
  }

  if (lunarMonth > 12) lunarMonth -= 12;
  if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;

  const yearStem = (lunarYear - 4 + 10) % 10;
  const yearBranch = (lunarYear - 4 + 12) % 12;
  const stemNames = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
  const branchNames = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
  return {
    year: lunarYear,
    month: isLeapMonth ? -lunarMonth : lunarMonth,
    day: lunarDay,
    isLeapMonth,
    yearStem,
    yearBranch,
    yearName: `${stemNames[yearStem]} ${branchNames[yearBranch]}`,
  };
}

export function getYearName(yearStem: number, yearBranch: number): string {
  const stemNames = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
  const branchNames = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
  return `${stemNames[yearStem]} ${branchNames[yearBranch]}`;
}

export function formatLunarDate(lunar: LunarDateVN): string {
  const monthStr = lunar.isLeapMonth ? `Tháng Nhuận ${Math.abs(lunar.month)}` : `Tháng ${lunar.month}`;
  return `Năm ${lunar.yearName}, ${monthStr}, Ngày ${lunar.day}`;
}

export function isValidLunarDate(lunar: LunarDateVN): boolean {
  if (lunar.year < 1 || lunar.year > 9999) return false;
  if (lunar.month === 0 || Math.abs(lunar.month) > 12) return false;
  if (lunar.day < 1 || lunar.day > 30) return false;
  return true;
}

export const LunarCalendar = { jdFromDate, jdToDate, NewMoon, SunLongitude, getLunarDate, getYearName, formatLunarDate, isValidLunarDate };
export default LunarCalendar;
