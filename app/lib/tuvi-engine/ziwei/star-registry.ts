// src/lib/tuvi-engine/ziwei/star-registry.ts
// ====================================================================
// STAR REGISTRY — NGUỒN SỰ THẬT DUY NHẤT về thuộc tính bản thể tinh diệu
// Tầng 0 (DATA) của kiến trúc Engine. KHÔNG chứa logic luận giải, KHÔNG chứa CSS.
//
// Mô hình Song Hành (Primary / Secondary WuXing):
//   hanh + amDuong     = Ngũ hành CHÍNH → dùng cho sinh khắc, tính điểm, màu UI
//   doiHanh + doiAmDuong = Ngũ hành ĐỚI/PHỤ → dùng cho luận giải sâu (AI context)
//   Ví dụ: Tham Lang chính khí Dương Mộc nhưng đới Âm Thủy (đào hoa ẩn)
//
// Quy ước phanLoai (quyết định cột hiển thị trên lá số):
//   "chinh" = 14 chính tinh (khu vực riêng trên cùng của cung)
//   "cat"   = cát tinh, phò tá, giải tinh  → CỘT TRÁI
//   "sat"   = sát tinh, hung tinh, bại tinh → CỘT PHẢI
//   "trung" = trung tính / vòng sao / án ngữ → CỘT TRÁI (sau cát tinh)
//
// Phiên bản: V2.0 — Đã duyệt chuyên môn bởi chủ dự án (14/06/2026)
// Mọi điểm REVIEW cũ đã được quyết định. KHÔNG tự ý đổi giá trị bằng AI.
// ====================================================================

export type NguHanh = "Kim" | "Mộc" | "Thủy" | "Hỏa" | "Thổ";
export type AmDuong = "Dương" | "Âm";
export type PhanLoaiSao = "chinh" | "cat" | "sat" | "trung";

export interface IStarMeta {
  hanh: NguHanh;
  amDuong: AmDuong;
  phanLoai: PhanLoaiSao;
  doiHanh?: NguHanh; // Ngũ hành đới/phụ (optional)
  doiAmDuong?: AmDuong; // Âm Dương của hành đới (optional)
  gioiTinh?: "nam" | "nu"; // Giới tính sao (Bắc Phái)
}

export const NGA_CUNG = new Set(["Mệnh", "Tài Bạch", "Quan Lộc", "Điền Trạch", "Tật Ách", "Phúc Đức"]);
export const THA_CUNG = new Set(["Phụ Mẫu", "Huynh Đệ", "Phu Thê", "Tử Tức", "Nô Bộc", "Thiên Di"]);

export const STAR_REGISTRY: Record<string, IStarMeta> = {
  // ==========================================
  // 14 CHÍNH TINH (đã duyệt 14/06/2026)
  // ==========================================
  "Tử Vi": { hanh: "Thổ", amDuong: "Âm", phanLoai: "chinh", gioiTinh: "nu" },
  "Thiên Cơ": { hanh: "Mộc", amDuong: "Âm", phanLoai: "chinh", gioiTinh: "nam" },
  "Thái Dương": { hanh: "Hỏa", amDuong: "Dương", phanLoai: "chinh", gioiTinh: "nam" },
  "Vũ Khúc": { hanh: "Kim", amDuong: "Âm", phanLoai: "chinh", gioiTinh: "nu" },
  "Thiên Đồng": { hanh: "Thủy", amDuong: "Dương", phanLoai: "chinh", gioiTinh: "nam" },
  "Liêm Trinh": { hanh: "Hỏa", amDuong: "Âm", phanLoai: "chinh", doiHanh: "Mộc", doiAmDuong: "Âm" },
  "Thiên Phủ": { hanh: "Thổ", amDuong: "Dương", phanLoai: "chinh", gioiTinh: "nam" },
  "Thái Âm": { hanh: "Thủy", amDuong: "Âm", phanLoai: "chinh", gioiTinh: "nu" },
  "Tham Lang": { hanh: "Mộc", amDuong: "Dương", phanLoai: "chinh", doiHanh: "Thủy", doiAmDuong: "Âm", gioiTinh: "nam" },
  "Cự Môn": { hanh: "Thủy", amDuong: "Âm", phanLoai: "chinh", gioiTinh: "nu" },
  "Thiên Tướng": { hanh: "Thủy", amDuong: "Dương", phanLoai: "chinh" },
  "Thiên Lương": { hanh: "Thổ", amDuong: "Dương", phanLoai: "chinh", gioiTinh: "nam" },
  "Thất Sát": { hanh: "Kim", amDuong: "Âm", phanLoai: "chinh", doiHanh: "Hỏa", doiAmDuong: "Dương", gioiTinh: "nam" },
  "Phá Quân": { hanh: "Thủy", amDuong: "Âm", phanLoai: "chinh", gioiTinh: "nu" },

  // ==========================================
  // CÁT TINH — PHÒ TÁ / VĂN TINH / QUÝ TINH (CỘT TRÁI)
  // ==========================================
  "Lộc Tồn": { hanh: "Thổ", amDuong: "Âm", phanLoai: "cat", doiHanh: "Kim", doiAmDuong: "Âm" },
  "Tả Phù": { hanh: "Thổ", amDuong: "Dương", phanLoai: "cat", gioiTinh: "nam" },
  "Hữu Bật": { hanh: "Thủy", amDuong: "Âm", phanLoai: "cat", gioiTinh: "nu" },
  "Văn Xương": { hanh: "Kim", amDuong: "Âm", phanLoai: "cat", gioiTinh: "nam" },
  "Văn Khúc": { hanh: "Thủy", amDuong: "Âm", phanLoai: "cat", gioiTinh: "nu" },
  "Thiên Khôi": { hanh: "Hỏa", amDuong: "Dương", phanLoai: "cat" },
  "Thiên Việt": { hanh: "Hỏa", amDuong: "Âm", phanLoai: "cat" },
  "Thiên Mã": { hanh: "Hỏa", amDuong: "Dương", phanLoai: "cat" },
  "Hóa Lộc": { hanh: "Mộc", amDuong: "Âm", phanLoai: "cat" },
  "Hóa Quyền": { hanh: "Mộc", amDuong: "Âm", phanLoai: "cat" },
  "Hóa Khoa": { hanh: "Thủy", amDuong: "Dương", phanLoai: "cat" },

  // Hỷ tinh / đài các / quý nhân
  "Hồng Loan": { hanh: "Thủy", amDuong: "Âm", phanLoai: "cat" },
  "Thiên Hỷ": { hanh: "Thủy", amDuong: "Dương", phanLoai: "cat" },
  "Thiên Hỹ": { hanh: "Thủy", amDuong: "Dương", phanLoai: "cat" },
  "Tam Thai": { hanh: "Thủy", amDuong: "Dương", phanLoai: "cat" },
  "Bát Tọa": { hanh: "Mộc", amDuong: "Âm", phanLoai: "cat" },
  "Long Trì": { hanh: "Thủy", amDuong: "Dương", phanLoai: "cat" },
  "Phượng Các": { hanh: "Thổ", amDuong: "Âm", phanLoai: "cat" },
  "Ân Quang": { hanh: "Mộc", amDuong: "Dương", phanLoai: "cat" },
  "Thiên Quý": { hanh: "Thổ", amDuong: "Dương", phanLoai: "cat" },
  "Thai Phụ": { hanh: "Kim", amDuong: "Dương", phanLoai: "cat" },
  "Phong Cáo": { hanh: "Thổ", amDuong: "Âm", phanLoai: "cat" },
  "Thiên Quan": { hanh: "Hỏa", amDuong: "Dương", phanLoai: "cat" },
  "Thiên Phúc": { hanh: "Thổ", amDuong: "Dương", phanLoai: "cat" },
  "Thiên Trù": { hanh: "Thổ", amDuong: "Dương", phanLoai: "cat" },
  "Thiên Tài": { hanh: "Thổ", amDuong: "Dương", phanLoai: "cat" },
  "Thiên Thọ": { hanh: "Thổ", amDuong: "Dương", phanLoai: "cat" },
  "Thiên Y": { hanh: "Thủy", amDuong: "Âm", phanLoai: "cat" },
  "Quốc Ấn": { hanh: "Thổ", amDuong: "Dương", phanLoai: "cat" },
  "Đường Phù": { hanh: "Mộc", amDuong: "Dương", phanLoai: "cat" },
  "LN Văn Tinh": { hanh: "Kim", amDuong: "Âm", phanLoai: "cat" },

  // Giải tinh / đức tinh
  "Giải Thần": { hanh: "Mộc", amDuong: "Dương", phanLoai: "cat" },
  "Thiên Giải": { hanh: "Hỏa", amDuong: "Dương", phanLoai: "cat" },
  "Địa Giải": { hanh: "Thổ", amDuong: "Dương", phanLoai: "cat" },
  "Niên Giải": { hanh: "Hỏa", amDuong: "Dương", phanLoai: "cat" },
  "Thiên Đức": { hanh: "Hỏa", amDuong: "Dương", phanLoai: "cat" },
  "Nguyệt Đức": { hanh: "Hỏa", amDuong: "Âm", phanLoai: "cat" },
  "Long Đức": { hanh: "Thủy", amDuong: "Âm", phanLoai: "cat" },
  "Phúc Đức": { hanh: "Thổ", amDuong: "Dương", phanLoai: "cat" },

  // Vòng Bác Sĩ — nhóm cát
  "Bác Sĩ": { hanh: "Thủy", amDuong: "Dương", phanLoai: "cat" },
  "Thanh Long": { hanh: "Thủy", amDuong: "Dương", phanLoai: "cat" },
  "Hỷ Thần": { hanh: "Hỏa", amDuong: "Dương", phanLoai: "cat" },
  "Tấu Thư": { hanh: "Kim", amDuong: "Âm", phanLoai: "cat" },

  // ==========================================
  // SÁT TINH — HUNG / BẠI TINH (CỘT PHẢI)
  // ==========================================
  // Lục sát
  "Kình Dương": { hanh: "Kim", amDuong: "Dương", phanLoai: "sat" },
  "Đà La": { hanh: "Kim", amDuong: "Âm", phanLoai: "sat" },
  "Hỏa Tinh": { hanh: "Hỏa", amDuong: "Dương", phanLoai: "sat" },
  "Linh Tinh": { hanh: "Hỏa", amDuong: "Âm", phanLoai: "sat" },
  "Địa Không": { hanh: "Hỏa", amDuong: "Dương", phanLoai: "sat" },
  "Địa Kiếp": { hanh: "Hỏa", amDuong: "Âm", phanLoai: "sat" },

  "Hóa Kỵ": { hanh: "Thủy", amDuong: "Âm", phanLoai: "sat" },
  "Hóa Kị": { hanh: "Thủy", amDuong: "Âm", phanLoai: "sat" },
  "Thiên Hình": { hanh: "Kim", amDuong: "Dương", phanLoai: "sat" },
  "Thiên Diêu": { hanh: "Thủy", amDuong: "Âm", phanLoai: "sat" },
  "Thiên Khốc": { hanh: "Thủy", amDuong: "Dương", phanLoai: "sat" },
  "Thiên Hư": { hanh: "Thủy", amDuong: "Âm", phanLoai: "sat" },
  "Thiên Không": { hanh: "Hỏa", amDuong: "Dương", phanLoai: "sat" },
  "Âm Sát": { hanh: "Hỏa", amDuong: "Âm", phanLoai: "sat" },
  "Cô Thần": { hanh: "Thổ", amDuong: "Dương", phanLoai: "sat" },
  "Quả Tú": { hanh: "Thổ", amDuong: "Âm", phanLoai: "sat" },
  "Kiếp Sát": { hanh: "Hỏa", amDuong: "Dương", phanLoai: "sat" },
  "Phá Toái": { hanh: "Hỏa", amDuong: "Âm", phanLoai: "sat" },
  "Lưu Hà": { hanh: "Thủy", amDuong: "Âm", phanLoai: "sat" },
  "Thiên Thương": { hanh: "Thủy", amDuong: "Dương", phanLoai: "sat" },
  "Thiên Sứ": { hanh: "Thủy", amDuong: "Âm", phanLoai: "sat" },

  // Vòng Thái Tuế — nhóm hung
  "Tang Môn": { hanh: "Mộc", amDuong: "Dương", phanLoai: "sat" },
  "Bạch Hổ": { hanh: "Kim", amDuong: "Âm", phanLoai: "sat" },
  "Điếu Khách": { hanh: "Hỏa", amDuong: "Dương", phanLoai: "sat" },
  "Quan Phù": { hanh: "Hỏa", amDuong: "Dương", phanLoai: "sat" },
  "Tuế Phá": { hanh: "Hỏa", amDuong: "Dương", phanLoai: "sat" },
  "Tử Phù": { hanh: "Kim", amDuong: "Âm", phanLoai: "sat" },

  // Vòng Bác Sĩ — nhóm hung/bại
  "Quan Phủ": { hanh: "Hỏa", amDuong: "Dương", phanLoai: "sat" },
  "Đại Hao": { hanh: "Hỏa", amDuong: "Dương", phanLoai: "sat" },
  "Tiểu Hao": { hanh: "Hỏa", amDuong: "Âm", phanLoai: "sat" },
  "Bệnh Phù": { hanh: "Thổ", amDuong: "Âm", phanLoai: "sat" },
  "Phục Binh": { hanh: "Hỏa", amDuong: "Âm", phanLoai: "sat" },
  "Phi Liêm": { hanh: "Hỏa", amDuong: "Dương", phanLoai: "sat" },

  // Thiên La / Địa Võng — ĐÃ CHUYỂN SANG SÁT (14/06/2026)
  "Thiên La": { hanh: "Thổ", amDuong: "Dương", phanLoai: "sat" },
  "Địa Võng": { hanh: "Thổ", amDuong: "Âm", phanLoai: "sat" },

  // Tiệt Lộ / Không Vong
  "Tiệt Lộ": { hanh: "Hỏa", amDuong: "Dương", phanLoai: "sat" },
  "Triệt Lộ": { hanh: "Hỏa", amDuong: "Dương", phanLoai: "sat" },
  "Không Vong": { hanh: "Hỏa", amDuong: "Âm", phanLoai: "sat" },

  // ==========================================
  // TRUNG TÍNH — VÒNG SAO / ÁN NGỮ / ĐÀO HOA
  // ==========================================
  "Thái Tuế": { hanh: "Hỏa", amDuong: "Dương", phanLoai: "trung" },
  "Thiếu Dương": { hanh: "Hỏa", amDuong: "Dương", phanLoai: "trung" },
  "Thiếu Âm": { hanh: "Thủy", amDuong: "Âm", phanLoai: "trung" },
  "Trực Phù": { hanh: "Hỏa", amDuong: "Âm", phanLoai: "trung" },
  "Tướng Quân": { hanh: "Mộc", amDuong: "Dương", phanLoai: "trung" },
  "Lực Sĩ": { hanh: "Hỏa", amDuong: "Dương", phanLoai: "trung" },
  "Hoa Cái": { hanh: "Kim", amDuong: "Dương", phanLoai: "trung" },
  "Đẩu Quân": { hanh: "Hỏa", amDuong: "Dương", phanLoai: "trung" },
  "Đào Hoa": { hanh: "Mộc", amDuong: "Âm", phanLoai: "trung" },
  Tuần: { hanh: "Hỏa", amDuong: "Dương", phanLoai: "trung", doiHanh: "Mộc", doiAmDuong: "Dương" },
  Triệt: { hanh: "Kim", amDuong: "Dương", phanLoai: "trung", doiHanh: "Thủy", doiAmDuong: "Dương" },
  "Thiên Sát": { hanh: "Hỏa", amDuong: "Dương", phanLoai: "trung" },

  // Vòng Tràng Sinh
  "Tràng Sinh": { hanh: "Thủy", amDuong: "Dương", phanLoai: "trung" },
  "Mộc Dục": { hanh: "Thủy", amDuong: "Âm", phanLoai: "trung" },
  "Quan Đới": { hanh: "Kim", amDuong: "Dương", phanLoai: "trung" },
  "Lâm Quan": { hanh: "Kim", amDuong: "Âm", phanLoai: "trung" },
  "Đế Vượng": { hanh: "Kim", amDuong: "Dương", phanLoai: "trung" },
  Suy: { hanh: "Thủy", amDuong: "Âm", phanLoai: "trung" },
  Bệnh: { hanh: "Hỏa", amDuong: "Âm", phanLoai: "trung" },
  Tử: { hanh: "Hỏa", amDuong: "Dương", phanLoai: "trung" },
  Mộ: { hanh: "Thổ", amDuong: "Âm", phanLoai: "trung" },
  Tuyệt: { hanh: "Thổ", amDuong: "Dương", phanLoai: "trung" },
  Thai: { hanh: "Thổ", amDuong: "Âm", phanLoai: "trung" },
  Dưỡng: { hanh: "Thổ", amDuong: "Dương", phanLoai: "trung" },
};

// ====================================================================
// NGŨ HÀNH 12 CUNG VỊ ĐỊA CHI (cố định)
// ====================================================================

export const PALACE_ELEMENT_MAP: Record<string, NguHanh> = {
  Tý: "Thủy",
  Hợi: "Thủy",
  Dần: "Mộc",
  Mão: "Mộc",
  Tỵ: "Hỏa",
  Ngọ: "Hỏa",
  Thân: "Kim",
  Dậu: "Kim",
  Sửu: "Thổ",
  Mùi: "Thổ",
  Thìn: "Thổ",
  Tuất: "Thổ",
};

const NGU_HANH_SINH: Record<NguHanh, NguHanh> = {
  Kim: "Thủy",
  Thủy: "Mộc",
  Mộc: "Hỏa",
  Hỏa: "Thổ",
  Thổ: "Kim",
};

const NGU_HANH_KHAC: Record<NguHanh, NguHanh> = {
  Kim: "Mộc",
  Mộc: "Thổ",
  Thổ: "Thủy",
  Thủy: "Hỏa",
  Hỏa: "Kim",
};

// ====================================================================
// HÀM TRA CỨU
// ====================================================================

/**
 * Loại bỏ tiền tố sao lưu / nhãn vận để đưa về tên gốc trước khi tra cứu.
 * LƯU Ý: "LN Văn Tinh", "Niên Giải", "Lưu Hà" là TÊN SAO THẬT — không strip.
 */
export function cleanStarName(starName: string): string {
  let n = starName;
  if (n.startsWith("L.")) n = n.substring(2);
  else if (n.startsWith("ĐV.")) n = n.substring(3);
  else if (n.startsWith("LN.")) n = n.substring(3);
  else if (n.startsWith("Lưu ")) n = n.substring(4);
  else if (n.startsWith("Vận ")) n = n.substring(4);
  if (n.includes(" (")) n = n.split(" (")[0] || n;
  return n.trim();
}

/** Tra thuộc tính bản thể: ưu tiên KHỚP TÊN GỐC trước, chỉ strip tiền tố khi trượt. */
export function getStarMeta(starName: string): IStarMeta | null {
  return STAR_REGISTRY[starName.trim()] ?? STAR_REGISTRY[cleanStarName(starName)] ?? null;
}

/**
 * TOÁN TỬ HỆ SỐ NGŨ HÀNH — dùng PRIMARY hành để tính sinh khắc.
 * Secondary (đới) KHÔNG ảnh hưởng điểm số — chỉ phục vụ luận giải AI.
 * Sinh/đồng hành: ×1.2 · Khắc: ×0.8 · Điều biến bản mệnh: ×1.1 / ×0.9
 */
export function getNguHanhCoefficient(starName: string, palaceBranch: string, bonMenhElement?: string): number {
  const meta = getStarMeta(starName);
  const palaceElement = PALACE_ELEMENT_MAP[palaceBranch];
  if (!meta || !palaceElement) return 1.0;

  const starElement = meta.hanh;
  let coeff = 1.0;

  if (starElement === palaceElement) {
    coeff = 1.2;
  } else if (NGU_HANH_SINH[starElement] === palaceElement || NGU_HANH_SINH[palaceElement] === starElement) {
    coeff = 1.2;
  } else if (NGU_HANH_KHAC[starElement] === palaceElement || NGU_HANH_KHAC[palaceElement] === starElement) {
    coeff = 0.8;
  }

  const bm = bonMenhElement as NguHanh | undefined;
  if (bm && NGU_HANH_SINH[bm] !== undefined) {
    if (starElement === bm || NGU_HANH_SINH[starElement] === bm) {
      coeff *= 1.1;
    } else if (NGU_HANH_KHAC[starElement] === bm || NGU_HANH_KHAC[bm] === starElement) {
      coeff *= 0.9;
    }
  }

  return parseFloat(coeff.toFixed(2));
}

// ====================================================================
// BACKWARD-COMPAT — cho knowledge/data/ngu-hanh.ts re-export
// ====================================================================

export interface IStarElement {
  element: NguHanh;
  gender: AmDuong;
}

export const STAR_ELEMENT_MAP: Record<string, IStarElement> = Object.fromEntries(
  Object.entries(STAR_REGISTRY).map(([name, m]) => [name, { element: m.hanh, gender: m.amDuong }]),
);

export const cleanStarNameForWuxing = cleanStarName;
