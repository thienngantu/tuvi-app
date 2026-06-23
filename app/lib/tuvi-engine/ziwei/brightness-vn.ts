// Bảng độ sáng 14 chính tinh theo phái Nam (Nguyễn Phát Lộc – "Tử Vi Hàm Số").
// Hệ 4 mức: Miếu / Vượng / Đắc / Hãm. Trích từ trang 16 của "TU_VI_HAM_SO.pdf".
// Dùng để override độ sáng từ iztro (vốn dùng Bắc phái 7 mức).

export const BRIGHTNESS_VN_NAMPHAI: Record<string, Record<string, string>> = {
  'Tử Vi':      { 'Tý':'Đắc',   'Sửu':'Đắc',   'Dần':'Miếu',  'Mão':'Hãm',   'Thìn':'Vượng','Tỵ':'Miếu',  'Ngọ':'Miếu',  'Mùi':'Đắc',   'Thân':'Miếu', 'Dậu':'Vượng', 'Tuất':'Vượng','Hợi':'Vượng' },
  'Thiên Cơ':   { 'Tý':'Đắc',   'Sửu':'Đắc',   'Dần':'Hãm',   'Mão':'Miếu',  'Thìn':'Miếu', 'Tỵ':'Vượng', 'Ngọ':'Đắc',   'Mùi':'Đắc',   'Thân':'Vượng','Dậu':'Vượng', 'Tuất':'Hãm',  'Hợi':'Hãm'   },
  'Thái Dương': { 'Tý':'Hãm',   'Sửu':'Đắc',   'Dần':'Vượng', 'Mão':'Vượng', 'Thìn':'Vượng','Tỵ':'Miếu',  'Ngọ':'Miếu',  'Mùi':'Miếu',  'Thân':'Đắc',  'Dậu':'Hãm',   'Tuất':'Hãm',  'Hợi':'Hãm'   },
  'Vũ Khúc':    { 'Tý':'Vượng', 'Sửu':'Miếu',  'Dần':'Vượng', 'Mão':'Đắc',   'Thìn':'Miếu', 'Tỵ':'Hãm',   'Ngọ':'Vượng', 'Mùi':'Đắc',   'Thân':'Đắc',  'Dậu':'Miếu',  'Tuất':'Miếu', 'Hợi':'Hãm'   },
  'Thiên Đồng': { 'Tý':'Vượng', 'Sửu':'Hãm',   'Dần':'Miếu',  'Mão':'Đắc',   'Thìn':'Hãm',  'Tỵ':'Hãm',   'Ngọ':'Hãm',   'Mùi':'Hãm',   'Thân':'Miếu', 'Dậu':'Hãm',   'Tuất':'Hãm',  'Hợi':'Đắc'   },
  'Liêm Trinh': { 'Tý':'Vượng', 'Sửu':'Đắc',   'Dần':'Vượng', 'Mão':'Hãm',   'Thìn':'Miếu', 'Tỵ':'Hãm',   'Ngọ':'Vượng', 'Mùi':'Đắc',   'Thân':'Vượng','Dậu':'Hãm',   'Tuất':'Miếu', 'Hợi':'Hãm'   },
  'Thiên Phủ':  { 'Tý':'Đắc',   'Sửu':'Miếu',  'Dần':'Miếu',  'Mão':'Vượng', 'Thìn':'Vượng','Tỵ':'Hãm',   'Ngọ':'Đắc',   'Mùi':'Đắc',   'Thân':'Miếu', 'Dậu':'Miếu',  'Tuất':'Đắc',  'Hợi':'Vượng' },
  'Thái Âm':    { 'Tý':'Vượng', 'Sửu':'Đắc',   'Dần':'Hãm',   'Mão':'Hãm',   'Thìn':'Hãm',  'Tỵ':'Hãm',   'Ngọ':'Hãm',   'Mùi':'Hãm',   'Thân':'Vượng','Dậu':'Miếu',  'Tuất':'Miếu', 'Hợi':'Miếu'  },
  'Tham Lang':  { 'Tý':'Hãm',   'Sửu':'Đắc',   'Dần':'Đắc',   'Mão':'Hãm',   'Thìn':'Vượng','Tỵ':'Hãm',   'Ngọ':'Hãm',   'Mùi':'Đắc',   'Thân':'Hãm',  'Dậu':'Vượng', 'Tuất':'Vượng','Hợi':'Hãm'   },
  'Cự Môn':     { 'Tý':'Vượng', 'Sửu':'Hãm',   'Dần':'Vượng', 'Mão':'Miếu',  'Thìn':'Hãm',  'Tỵ':'Hãm',   'Ngọ':'Đắc',   'Mùi':'Hãm',   'Thân':'Vượng','Dậu':'Đắc',   'Tuất':'Hãm',  'Hợi':'Vượng' },
  'Thiên Tướng':{ 'Tý':'Vượng', 'Sửu':'Đắc',   'Dần':'Miếu',  'Mão':'Vượng', 'Thìn':'Vượng','Tỵ':'Đắc',   'Ngọ':'Vượng', 'Mùi':'Đắc',   'Thân':'Đắc',  'Dậu':'Vượng', 'Tuất':'Hãm',  'Hợi':'Vượng' },
  'Thiên Lương':{ 'Tý':'Vượng', 'Sửu':'Miếu',  'Dần':'Vượng', 'Mão':'Vượng', 'Thìn':'Miếu', 'Tỵ':'Hãm',   'Ngọ':'Miếu',  'Mùi':'Đắc',   'Thân':'Vượng','Dậu':'Hãm',   'Tuất':'Vượng','Hợi':'Hãm'   },
  'Thất Sát':   { 'Tý':'Vượng', 'Sửu':'Đắc',   'Dần':'Miếu',  'Mão':'Hãm',   'Thìn':'Hãm',  'Tỵ':'Vượng', 'Ngọ':'Miếu',  'Mùi':'Đắc',   'Thân':'Miếu', 'Dậu':'Hãm',   'Tuất':'Hãm',  'Hợi':'Hãm'   },
  'Phá Quân':   { 'Tý':'Miếu',  'Sửu':'Vượng', 'Dần':'Hãm',   'Mão':'Vượng', 'Thìn':'Vượng','Tỵ':'Hãm',   'Ngọ':'Miếu',  'Mùi':'Vượng', 'Thân':'Hãm',  'Dậu':'Hãm',   'Tuất':'Đắc',  'Hợi':'Hãm'   },
};

/** Trả độ sáng Nam phái cho 14 chính tinh. Trả undefined nếu không phải chính tinh. */
export function getBrightnessNamPhai(starNameVN: string, branchVN: string): string | undefined {
  return BRIGHTNESS_VN_NAMPHAI[starNameVN]?.[branchVN];
}
