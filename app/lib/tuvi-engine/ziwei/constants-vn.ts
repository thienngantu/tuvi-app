// lib/ziwei/constants-vn.ts
// Lookup tables: Chinese → Vietnamese for Ziwei Doushu

export const STEM_NAMES_VN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
export const BRANCH_NAMES_VN = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
export const WUXING_NAMES_VN: Record<string, string> = { 金: "Kim", 木: "Mộc", 水: "Thủy", 火: "Hỏa", 土: "Thổ" };

export const STAR_NAMES_VN: Record<string, string> = {
  // 14 Chính tinh
  紫微: "Tử Vi",
  天机: "Thiên Cơ",
  太阳: "Thái Dương",
  武曲: "Vũ Khúc",
  天同: "Thiên Đồng",
  廉贞: "Liêm Trinh",
  天府: "Thiên Phủ",
  太阴: "Thái Âm",
  贪狼: "Tham Lang",
  巨门: "Cự Môn",
  天相: "Thiên Tướng",
  天梁: "Thiên Lương",
  七杀: "Thất Sát",
  破军: "Phá Quân",
  // Phụ tinh
  左辅: "Tả Phụ",
  右弼: "Hữu Bật",
  文昌: "Văn Xương",
  文曲: "Văn Khúc",
  天魁: "Thiên Khôi",
  天钺: "Thiên Việt",
  禄存: "Lộc Tồn",
  天马: "Thiên Mã",
  擎羊: "Kình Dương",
  陀罗: "Đà La",
  火星: "Hỏa Tinh",
  铃星: "Linh Tinh",
  地空: "Địa Không",
  地劫: "Địa Kiếp",
  天空: "Thiên Không",
  红鸾: "Hồng Loan",
  天喜: "Thiên Hỷ",
  天姚: "Thiên Diêu",
  咸池: "Đào Hoa",
  天刑: "Thiên Hình",
  天哭: "Thiên Khốc",
  天虚: "Thiên Hư",
  龙池: "Long Trì",
  凤阁: "Phượng Các",
  台辅: "Thai Phụ",
  封诰: "Phong Cáo",
  三台: "Tam Thai",
  八座: "Bát Tọa",
  恩光: "Ân Quang",
  天贵: "Thiên Quý",
  天官: "Thiên Quan",
  天福: "Thiên Phúc",
  天才: "Thiên Tài",
  天寿: "Thiên Thọ",
  破碎: "Phá Toái",
  天使: "Thiên Sứ",
  天伤: "Thiên Thương",
  旬空: "Tuần Không",
  截空: "Tiệt Không",
  // Sao lẻ bổ sung (Nam phái)
  解神: "Giải Thần",
  截路: "Tiệt Lộ",
  空亡: "Không Vong",
  月德: "Nguyệt Đức",
  天德: "Thiên Đức",
  天月: "Thiên Nguyệt",
  天厨: "Thiên Trù",
  华盖: "Hoa Cái",
  天巫: "Thiên Vu",
  孤辰: "Cô Thần",
  寡宿: "Quả Tú",
  蜚廉: "Phi Liêm",
  阴煞: "Âm Sát",
  年解: "Niên Giải",
  化禄: "Hóa Lộc",
  化权: "Hóa Quyền",
  化科: "Hóa Khoa",
  化忌: "Hóa Kỵ",

  // ============================================================
  // BỔ SUNG: Vòng Bác Sĩ (boshi12) — 12 sao vòng Lộc Tồn
  // ============================================================
  博士: "Bác Sĩ",
  力士: "Lực Sĩ",
  青龙: "Thanh Long",
  小耗: "Tiểu Hao",
  将军: "Tướng Quân",
  奏书: "Tấu Thư",
  飞廉: "Phi Liêm",
  喜神: "Hỷ Thần",
  病符: "Bệnh Phù",
  大耗: "Đại Hao",
  伏兵: "Phục Binh",
  官府: "Quan Phủ",

  // ============================================================
  // BỔ SUNG: Vòng Thái Tuế (suiqian12) — 12 sao
  // ============================================================
  岁建: "Thái Tuế",
  晦气: "Hối Khí",
  丧门: "Tang Môn",
  贯索: "Quán Sách",
  官符: "Quan Phù",
  // 小耗 → Tiểu Hao (đã khai báo ở vòng Bác Sĩ)
  // 大耗 → Đại Hao (đã khai báo ở vòng Bác Sĩ)
  龙德: "Long Đức",
  白虎: "Bạch Hổ",
  // 天德 → Thiên Đức (đã khai báo ở phần sao lẻ)
  吊客: "Điếu Khách",
  // 病符 → Bệnh Phù (đã khai báo ở vòng Bác Sĩ)

  // ============================================================
  // BỔ SUNG: Vòng Tướng Quân (jiangqian12) — 12 sao
  // ============================================================
  将星: "Tướng Tinh",
  攀鞍: "Phan An",
  岁驿: "Tuế Dịch",
  息神: "Tức Thần",
  // 华盖 → Hoa Cái (đã khai báo ở phần sao lẻ)
  劫煞: "Kiếp Sát",
  灾煞: "Tai Sát",
  天煞: "Thiên Sát",
  指背: "Chỉ Bối",
  // 咸池 → Hàm Trì (đã khai báo ở phần phụ tinh)
  月煞: "Nguyệt Sát",
  亡神: "Vong Thần",
};

// Vòng Trường Sinh 12 sao (Bắc phái 长生十二神 → Nam phái Việt)
export const CHANGSHENG_VN: Record<string, string> = {
  长生: "Trường Sinh",
  沐浴: "Mộc Dục",
  冠带: "Quan Đới",
  临官: "Lâm Quan",
  帝旺: "Đế Vượng",
  衰: "Suy",
  病: "Bệnh",
  死: "Tử",
  墓: "Mộ",
  绝: "Tuyệt",
  胎: "Thai",
  养: "Dưỡng",
};

export function getChangshengVN(name?: string): string | undefined {
  if (!name) return undefined;
  return CHANGSHENG_VN[name] ?? name;
}

// ============================================================
// BỔ SUNG: Vòng Bác Sĩ (boshi12) mapping CN → VN
// ============================================================
export const BOSHI12_VN: Record<string, string> = {
  博士: "Bác Sĩ",
  力士: "Lực Sĩ",
  青龙: "Thanh Long",
  小耗: "Tiểu Hao",
  将军: "Tướng Quân",
  奏书: "Tấu Thư",
  飞廉: "Phi Liêm",
  喜神: "Hỷ Thần",
  病符: "Bệnh Phù",
  大耗: "Đại Hao",
  伏兵: "Phục Binh",
  官府: "Quan Phủ",
};

export function getBoshi12VN(name?: string): string | undefined {
  if (!name) return undefined;
  return BOSHI12_VN[name] ?? STAR_NAMES_VN[name] ?? name;
}

// ============================================================
// BỔ SUNG: Vòng Thái Tuế (suiqian12) mapping CN → VN
// ============================================================
export const SUIQIAN12_VN: Record<string, string> = {
  岁建: "Thái Tuế",
  晦气: "Hối Khí",
  丧门: "Tang Môn",
  贯索: "Quán Sách",
  官符: "Quan Phù",
  小耗: "Tiểu Hao",
  大耗: "Đại Hao",
  龙德: "Long Đức",
  白虎: "Bạch Hổ",
  天德: "Thiên Đức",
  吊客: "Điếu Khách",
  病符: "Bệnh Phù",
};

export function getSuiqian12VN(name?: string): string | undefined {
  if (!name) return undefined;
  return SUIQIAN12_VN[name] ?? STAR_NAMES_VN[name] ?? name;
}

// ============================================================
// BỔ SUNG: Vòng Tướng Quân (jiangqian12) mapping CN → VN
// ============================================================
export const JIANGQIAN12_VN: Record<string, string> = {
  将星: "Tướng Tinh",
  攀鞍: "Phan An",
  岁驿: "Tuế Dịch",
  息神: "Tức Thần",
  华盖: "Hoa Cái",
  劫煞: "Kiếp Sát",
  灾煞: "Tai Sát",
  天煞: "Thiên Sát",
  指背: "Chỉ Bối",
  咸池: "Đào Hoa",
  月煞: "Nguyệt Sát",
  亡神: "Vong Thần",
};

export function getJiangqian12VN(name?: string): string | undefined {
  if (!name) return undefined;
  return JIANGQIAN12_VN[name] ?? STAR_NAMES_VN[name] ?? name;
}

// ============================================================
// BỔ SUNG: Ngũ hành 14 chính tinh
// ============================================================
export const MAJOR_STAR_WUXING: Record<string, string> = {
  "Tử Vi": "Thổ",
  "Thiên Cơ": "Mộc",
  "Thái Dương": "Hỏa",
  "Vũ Khúc": "Kim",
  "Thiên Đồng": "Thủy",
  "Liêm Trinh": "Hỏa",
  "Thiên Phủ": "Thổ",
  "Thái Âm": "Thủy",
  "Tham Lang": "Mộc",
  "Cự Môn": "Thổ",
  "Thiên Tướng": "Thủy",
  "Thiên Lương": "Thổ",
  "Thất Sát": "Kim",
  "Phá Quân": "Thủy",
};

export const PALACE_NAMES_VN: Record<string, string> = {
  // Có hậu tố 宫
  命宫: "Mệnh Cung",
  身宫: "Thân Cung",
  兄弟宫: "Huynh Đệ Cung",
  夫妻宫: "Phu Thê Cung",
  子女宫: "Tử Tức Cung",
  财帛宫: "Tài Bạch Cung",
  疾厄宫: "Tật Ách Cung",
  迁移宫: "Thiên Di Cung",
  交友宫: "Nô Bộc Cung",
  仆役宫: "Nô Bộc Cung",
  官禄宫: "Quan Lộc Cung",
  田宅宫: "Điền Trạch Cung",
  福德宫: "Phúc Đức Cung",
  父母宫: "Phụ Mẫu Cung",
  // iztro thực tế trả tên KHÔNG có 宫
  命: "Mệnh Cung",
  身: "Thân Cung",
  兄弟: "Huynh Đệ Cung",
  夫妻: "Phu Thê Cung",
  子女: "Tử Tức Cung",
  财帛: "Tài Bạch Cung",
  疾厄: "Tật Ách Cung",
  迁移: "Thiên Di Cung",
  交友: "Nô Bộc Cung",
  仆役: "Nô Bộc Cung",
  官禄: "Quan Lộc Cung",
  田宅: "Điền Trạch Cung",
  福德: "Phúc Đức Cung",
  父母: "Phụ Mẫu Cung",
};

export const SIHUA_NAMES_VN: Record<string, string> = {
  禄: "Hóa Lộc",
  权: "Hóa Quyền",
  科: "Hóa Khoa",
  忌: "Hóa Kỵ",
};

export const BRIGHTNESS_NAMES_VN: Record<string, string> = {
  庙: "Miếu",
  旺: "Vượng",
  得: "Đắc",
  利: "Lợi",
  平: "Bình",
  不: "Bất",
  陷: "Hãm",
};

// Tứ Hóa theo Thiên Can (yearStem index 0-9)
export const SIHUA_BY_STEM: Record<number, { loc: string; quyen: string; khoa: string; ky: string }> = {
  0: { loc: "廉贞", quyen: "破军", khoa: "武曲", ky: "太阳" }, // Giáp
  1: { loc: "天机", quyen: "天梁", khoa: "紫微", ky: "太阴" }, // Ất
  2: { loc: "天同", quyen: "天机", khoa: "文昌", ky: "廉贞" }, // Bính
  3: { loc: "太阴", quyen: "天同", khoa: "天机", ky: "巨门" }, // Đinh
  4: { loc: "贪狼", quyen: "太阴", khoa: "右弼", ky: "天机" }, // Mậu
  5: { loc: "武曲", quyen: "贪狼", khoa: "天梁", ky: "文曲" }, // Kỷ
  6: { loc: "太阳", quyen: "武曲", khoa: "太阴", ky: "天同" }, // Canh
  7: { loc: "巨门", quyen: "太阳", khoa: "文曲", ky: "文昌" }, // Tân
  8: { loc: "天梁", quyen: "紫微", khoa: "左辅", ky: "武曲" }, // Nhâm
  9: { loc: "破军", quyen: "巨门", khoa: "太阴", ky: "贪狼" }, // Quý
};

export const GENDER_VN: Record<string, string> = { male: "Nam", female: "Nữ", 男: "Nam", 女: "Nữ" };

export function getStarNameVN(chineseName: string): string {
  return STAR_NAMES_VN[chineseName] ?? chineseName;
}

export function getPalaceNameVN(chineseName: string): string {
  return PALACE_NAMES_VN[chineseName] ?? chineseName;
}

export function getSihuaForStem(stemIndex: number) {
  return SIHUA_BY_STEM[stemIndex] ?? SIHUA_BY_STEM[0];
}

export function getCanChiName(stem: number, branch: number): string {
  return `${STEM_NAMES_VN[stem] ?? "?"} ${BRANCH_NAMES_VN[branch] ?? "?"}`;
}

export default {
  STAR_NAMES_VN,
  PALACE_NAMES_VN,
  SIHUA_NAMES_VN,
  BRIGHTNESS_NAMES_VN,
  SIHUA_BY_STEM,
  getStarNameVN,
  getPalaceNameVN,
  getSihuaForStem,
  getCanChiName,
};

// ============================================================
// KNOWLEDGE PACKAGE: Nam Phái - Thầy Lê Quang Lăng
// Nguồn: Vòng Thái Tuế - Thiên Địa Nhân trong Tử Vi Nam Phái
// ============================================================

// Bộ ba trục xương sống Thiên - Địa - Nhân
export const TRUC_XUONG_SONG_VN = {
  "Vòng Tràng Sinh": {
    yeutoTam: "Thiên" as const,
    yNghia: "Thời điểm, khí vận do trời ban, tạo hóa. Quyết định thành bại, thọ yểu và chiều sâu cốt lõi lá số.",
    phanLoai: "Phụ tinh — KHÔNG phải bàng tinh hay bét tinh",
  },
  "Vòng Lộc Tồn": {
    yeutoTam: "Địa" as const,
    yNghia: "Môi trường xung quanh, đất đai, nhà cửa, phong thổ, mồ mả tổ tiên, đỉnh cao vật chất và giáo dục.",
    phanLoai: "Phụ tinh — KHÔNG phải bàng tinh hay bét tinh",
  },
  "Vòng Thái Tuế": {
    yeutoTam: "Nhân" as const,
    yNghia: "Con người làm gốc, nhân sinh quan, bản lĩnh ứng xử của đương số.",
    phanLoai: "Phụ tinh — KHÔNG phải bàng tinh hay bét tinh",
  },
} as const;

// Vị trí an Lộc Tồn theo Thiên can năm sinh (đầy đủ 10 can)
export const LOC_TON_POSITION_VN: Record<string, string> = {
  Giáp: "Dần",
  Ất: "Mão",
  Bính: "Tỵ",
  Mậu: "Tỵ",
  Đinh: "Ngọ",
  Kỷ: "Ngọ",
  Canh: "Thân",
  Tân: "Dậu",
  Nhâm: "Hợi",
  Quý: "Tý",
};

// Ràng buộc cứng: Bác Sĩ LUÔN đồng cung với Lộc Tồn (100%)
export const BAC_SI_DONG_CUNG_LOC_TON = true;

// Ý nghĩa 12 sao Vòng Thái Tuế (yếu tố Nhân)
export const THAI_TUE_RING_META_VN: Record<
  string,
  {
    yNghiaGoc: string;
    tinhChat: "cat" | "hung" | "trung";
    diDanh?: string;
  }
> = {
  "Thái Tuế": {
    tinhChat: "trung",
    yNghiaGoc:
      "Chủ về tư duy lý luận sắc bén, lập luận hành văn khúc chiết, kiên trì, bền bỉ mang thiên hướng xây dựng. Nhược điểm: bảo thủ, lầm lỳ, bướng bỉnh, lòng tự ái cao, trọng thị (thích được tôn kính). Người thủ Mệnh thường có hàm răng đều, kín và đẹp.",
    diDanh: "Sao lý luận, sao kiên trì",
  },
  "Thiếu Dương": {
    tinhChat: "cat",
    yNghiaGoc: "Phụ tinh vòng Nhân. Chủ về sinh khí, sự phát triển, tươi mới sau giai đoạn bão táp.",
  },
  "Tang Môn": {
    tinhChat: "hung",
    yNghiaGoc: "Chủ về tang ma, mất mát, chia ly, buồn bã, sầu thương.",
    diDanh: "Sao tang sự",
  },
  "Thiếu Âm": {
    tinhChat: "cat",
    yNghiaGoc: "Phụ tinh vòng Nhân. Chủ về sự êm dịu, nội tâm sâu sắc, ẩn nhẫn.",
  },
  "Quan Phù": {
    tinhChat: "hung",
    yNghiaGoc:
      'Chủ về sự ghi nhớ sâu sắc, nhớ rất lâu. Nếu bị xúc phạm: mang tâm lý oán thù dai dẳng, tích tụ nhiều năm sau để tìm cách trả thù ("quá thủ", "thủ rất lâu"). Trong cấu cục tam hợp Thái Tuế - Bạch Hổ - Quan Phù lại chủ tài chính thông minh.',
    diDanh: "Sao thù dai, sao quá thủ",
  },
  "Tử Phù": {
    tinhChat: "cat",
    yNghiaGoc: "Phụ tinh vòng Nhân. Chủ về sự che chở, bảo vệ từ bề trên, quý nhân âm thầm phù trợ.",
  },
  "Tuế Phá": {
    tinhChat: "hung",
    yNghiaGoc:
      "Nằm ở vị trí đối xung với Thái Tuế. Mang bản tính phản kháng, nghịch cảnh, chống đối, đi ngược xu hướng xây dựng. Người có sao này thủ Mệnh thường có cấu trúc răng xấu, thích nói ngược hoặc đi ngược xu thế chung.",
    diDanh: "Sao phản kháng, sao nghịch",
  },
  "Long Đức": {
    tinhChat: "cat",
    yNghiaGoc: "Phụ tinh vòng Nhân. Chủ về ân huệ, may mắn từ quý nhân, long mạch tốt.",
  },
  "Bạch Hổ": {
    tinhChat: "hung",
    yNghiaGoc:
      "Chủ về máu me, thương tích, tang sự. Tuy nhiên trong tam hợp thế vững Thái Tuế - Bạch Hổ - Quan Phù lại chủ người kiếm tiền giỏi, quản lý tài chính chặt chẽ, chi tiêu ăn chắc mặc bền.",
    diDanh: "Sao máu me, sao tang",
  },
  "Phúc Đức": {
    tinhChat: "cat",
    yNghiaGoc: "Phụ tinh vòng Nhân. Chủ về phúc lộc ẩn tàng, hưởng thụ an nhàn, tích đức từ tiền kiếp.",
  },
  "Điếu Khách": {
    tinhChat: "hung",
    yNghiaGoc: "Chủ về tang khách, việc hiếu, mất mát, chia cắt. Đồng cung với Tang Môn tạo thế tang sự nặng.",
    diDanh: "Sao tang khách",
  },
  "Trực Phù": {
    tinhChat: "hung",
    yNghiaGoc: "Phụ tinh vòng Nhân. Chủ về sự xung đột trực diện, đối mặt gay gắt, đụng chạm trực tiếp.",
  },
};

// Phân loại bản chất hung sát tinh đặc thù (Nam Phái)
export const SAT_TINH_META_VN: Record<
  string,
  {
    loai: "hung_nhe" | "hung_nang" | "sat_tinh" | "che_sat";
    banChat: string;
    bietDanh: string;
    cheGiaiBy: string[];
  }
> = {
  "Địa Không": {
    loai: "hung_nhe",
    banChat:
      'Chủ về sự bộc phát bùng nổ đột ngột rồi tan vỡ ("thổi bò", "nổ lên"). Thể hiện ra ngoài bằng ngôn từ, lời nói sướng mồm, dọa ma ("chỉ kê mồm thôi"). Bản chất nhẹ nhàng hơn Địa Kiếp.',
    bietDanh: "Nổ miệng, thổi bò, dọa ma",
    cheGiaiBy: ["Hoa Cái", "Thiên Quan", "Thiên Phúc", "Tam Minh", "Long Trì", "Phượng Các", "Tuần", "Triệt"],
  },
  "Địa Kiếp": {
    loai: "hung_nang",
    banChat:
      "Chủ về dã tâm ngầm, mưu đồ thủ đoạn nguy hiểm, dìm xuống tận cùng. Khi xảy ra va chạm: nham hiểm mỉm cười, âm thầm lên kế hoạch trả thù, hành động bằng tay chân bạo lực thay vì chỉ nói suông. Nguy hiểm hơn Địa Không nhiều.",
    bietDanh: "Dã tâm ngầm, thủ đoạn hiểm",
    cheGiaiBy: ["Hoa Cái", "Thiên Quan", "Thiên Phúc", "Tam Minh", "các bộ sao học thức, trí tuệ"],
  },
  "Kiếp Sát": {
    loai: "sat_tinh",
    banChat:
      "Hung sát tinh nhỏ chủ về máu lạnh, tai ách phẫu thuật, mổ phanh bụng (đại phẫu). Hung tính dễ bị chế ngự nếu gặp bộ sao trí tuệ hoặc giải sát.",
    bietDanh: "Sao đại phẫu, mổ phanh bụng",
    cheGiaiBy: ["Tam Minh (Quang Quý)", "Thiên Quan", "Thiên Phúc", "Tuần", "Triệt", "Long Trì", "Phượng Các"],
  },
  "Hoa Cái": {
    loai: "che_sat",
    banChat:
      "Tiểu vũ tinh chủ về sự điệu đà, diễm lệ, thích làm đẹp, thích trưng diện tạo sự khác biệt, cái tôi cực kỳ lớn và bản tính vô cùng lì lợm. Đồng thời là một trong các sao có tác dụng chế sát Không Kiếp và áp chế dã tâm.",
    bietDanh: "Sao điệu, cái tôi lớn, lì lợm",
    cheGiaiBy: [],
  },
};
// ============================================================
// KNOWLEDGE PACKAGE: Ngũ Hành Nạp Âm 60 Hoa Giáp
// Nguồn: tuvi.cohoc.net
// Dùng để tra cứu bản mệnh, tính toán cục và an sao Trường Sinh
// ============================================================

export const NAP_AM_60_HOA_GIAP: Record<string, string> = {
  // Chu kỳ 1 (Tiểu Thành & Đại Thành)
  "Giáp Tý": "Hải Trung Kim",
  "Ất Sửu": "Hải Trung Kim",
  "Bính Dần": "Lư Trung Hỏa",
  "Đinh Mão": "Lư Trung Hỏa",
  "Mậu Thìn": "Đại Lâm Mộc",
  "Kỷ Tỵ": "Đại Lâm Mộc",
  "Canh Ngọ": "Lộ Bàng Thổ",
  "Tân Mùi": "Lộ Bàng Thổ",
  "Nhâm Thân": "Kiếm Phong Kim",
  "Quý Dậu": "Kiếm Phong Kim",
  "Giáp Tuất": "Sơn Đầu Hỏa",
  "Ất Hợi": "Sơn Đầu Hỏa",
  "Bính Tý": "Giang Hạ Thủy",
  "Đinh Sửu": "Giang Hạ Thủy",
  "Mậu Dần": "Thành Đầu Thổ",
  "Kỷ Mão": "Thành Đầu Thổ",
  "Canh Thìn": "Bạch Lạp Kim",
  "Tân Tỵ": "Bạch Lạp Kim",
  "Nhâm Ngọ": "Dương Liễu Mộc",
  "Quý Mùi": "Dương Liễu Mộc",
  "Giáp Thân": "Tuyền Trung Thủy",
  "Ất Dậu": "Tuyền Trung Thủy",
  "Bính Tuất": "Ốc Thượng Thổ",
  "Đinh Hợi": "Ốc Thượng Thổ",
  "Mậu Tý": "Tích Lịch Hỏa",
  "Kỷ Sửu": "Tích Lịch Hỏa",
  "Canh Dần": "Tùng Bách Mộc",
  "Tân Mão": "Tùng Bách Mộc",
  "Nhâm Thìn": "Trường Lưu Thủy",
  "Quý Tỵ": "Trường Lưu Thủy",

  // Chu kỳ 2
  "Giáp Ngọ": "Sa Trung Kim",
  "Ất Mùi": "Sa Trung Kim",
  "Bính Thân": "Sơn Hạ Hỏa",
  "Đinh Dậu": "Sơn Hạ Hỏa",
  "Mậu Tuất": "Bình Địa Mộc",
  "Kỷ Hợi": "Bình Địa Mộc",
  "Canh Tý": "Bích Thượng Thổ",
  "Tân Sửu": "Bích Thượng Thổ",
  "Nhâm Dần": "Kim Bạch Kim",
  "Quý Mão": "Kim Bạch Kim",
  "Giáp Thìn": "Phú Đăng Hỏa",
  "Ất Tỵ": "Phú Đăng Hỏa",
  "Bính Ngọ": "Thiên Hà Thủy",
  "Đinh Mùi": "Thiên Hà Thủy",
  "Mậu Thân": "Đại Dịch Thổ",
  "Kỷ Dậu": "Đại Dịch Thổ", // Đại Dịch Thổ = Đại Trạch Thổ
  "Canh Tuất": "Thoa Xuyến Kim",
  "Tân Hợi": "Thoa Xuyến Kim",
  "Nhâm Tý": "Tang Đố Mộc",
  "Quý Sửu": "Tang Đố Mộc",
  "Giáp Dần": "Đại Khê Thủy",
  "Ất Mão": "Đại Khê Thủy",
  "Bính Thìn": "Sa Trung Thổ",
  "Đinh Tỵ": "Sa Trung Thổ",
  "Mậu Ngọ": "Thiên Thượng Hỏa",
  "Kỷ Mùi": "Thiên Thượng Hỏa",
  "Canh Thân": "Thạch Lựu Mộc",
  "Tân Dậu": "Thạch Lựu Mộc",
  "Nhâm Tuất": "Đại Hải Thủy",
  "Quý Hợi": "Đại Hải Thủy",
};

/**
 * Hàm tra cứu hành và loại của Nạp Âm
 * @param canChi Chuỗi "Giáp Tý", "Bính Dần"...
 * @returns Object chứa tên Mệnh và Ngũ hành gốc (Kim, Mộc, Thủy, Hỏa, Thổ)
 */
export function getNapAm(canChi: string): { full: string; hanh: string } | null {
  const full = NAP_AM_60_HOA_GIAP[canChi];
  if (!full) return null;

  // Trích xuất chữ cuối cùng để lấy Ngũ hành (VD: "Hải Trung Kim" -> "Kim")
  const parts = full.split(" ");
  const hanh = parts[parts.length - 1];

  return { full, hanh };
}
// ============================================================
// KNOWLEDGE PACKAGE: Nhị Hợp, Lục Hại, Giáp Cung
// Nguồn: Quy tắc tương tác các cung trong Tử Vi
// ============================================================

// 1. Bảng Nhị Hợp (Tính chất 1 chiều: Cung A nhị hợp vào Cung B)
// Cung đối xứng qua trục dọc. Chiều ngược lại sẽ yếu hơn.
export const NHI_HOP_VN: Record<string, string> = {
  Sửu: "Tý",
  Hợi: "Dần",
  Mão: "Tuất",
  Dậu: "Thìn",
  Tỵ: "Thân",
  Mùi: "Ngọ",
};

// 2. Bảng Lục Hại (Tính chất 2 chiều)
// Cung đối xứng qua trục ngang, thường khắc chế, làm hại lẫn nhau.
export const LUC_HAI_VN: Record<string, string> = {
  Tý: "Mùi",
  Mùi: "Tý",
  Sửu: "Ngọ",
  Ngọ: "Sửu",
  Dần: "Tỵ",
  Tỵ: "Dần",
  Mão: "Thìn",
  Thìn: "Mão",
  Thân: "Hợi",
  Hợi: "Thân",
  Dậu: "Tuất",
  Tuất: "Dậu",
};

// 3. Hàm tính Lân Cung (Giáp Cung)
// Trả về mảng chứa 2 cung kề cạnh (Cung trước và Cung sau)
export function getGiapCung(currentIndex: number): { truoc: number; sau: number } {
  // currentIndex là vị trí cung hiện tại (0 -> 11 tương ứng Tý -> Hợi)
  const truoc = (currentIndex - 1 + 12) % 12;
  const sau = (currentIndex + 1) % 12;
  return { truoc, sau };
}
// ============================================================
// KNOWLEDGE PACKAGE: Cân Xương Tính Số (Cân Lượng)
// Đơn vị tính: 1.2 tương đương 1 lượng 2 chỉ
// ============================================================

// 1. Cân lượng theo Năm sinh (60 Hoa Giáp)
export const CAN_LUONG_NAM: Record<string, number> = {
  "Giáp Tý": 1.2,
  "Bính Tý": 1.6,
  "Mậu Tý": 1.5,
  "Canh Tý": 0.7,
  "Nhâm Tý": 0.5,
  "Ất Sửu": 0.9,
  "Đinh Sửu": 0.8,
  "Kỷ Sửu": 0.8,
  "Tân Sửu": 0.7,
  "Quý Sửu": 0.5,
  "Bính Dần": 0.6,
  "Mậu Dần": 0.8,
  "Canh Dần": 0.9,
  "Nhâm Dần": 0.9,
  "Giáp Dần": 1.2,
  "Đinh Mão": 0.7,
  "Kỷ Mão": 1.9,
  "Tân Mão": 1.2,
  "Quý Mão": 1.2,
  "Ất Mão": 0.8,
  "Mậu Thìn": 1.2,
  "Canh Thìn": 1.2,
  "Nhâm Thìn": 1.0,
  "Giáp Thìn": 0.8,
  "Bính Thìn": 0.8,
  "Kỷ Tỵ": 0.5,
  "Tân Tỵ": 0.6,
  "Quý Tỵ": 0.7,
  "Ất Tỵ": 0.7,
  "Đinh Tỵ": 0.6,
  "Canh Ngọ": 0.9,
  "Nhâm Ngọ": 0.8,
  "Giáp Ngọ": 1.5,
  "Bính Ngọ": 1.3,
  "Mậu Ngọ": 1.9,
  "Tân Mùi": 0.8,
  "Quý Mùi": 0.7,
  "Ất Mùi": 0.6,
  "Đinh Mùi": 0.5,
  "Kỷ Mùi": 0.6,
  "Nhâm Thân": 0.7,
  "Giáp Thân": 0.5,
  "Bính Thân": 0.5,
  "Mậu Thân": 1.4,
  "Canh Thân": 0.8,
  "Quý Dậu": 0.8,
  "Ất Dậu": 1.5,
  "Đinh Dậu": 1.4,
  "Kỷ Dậu": 0.5,
  "Tân Dậu": 1.6,
  "Giáp Tuất": 0.5,
  "Bính Tuất": 0.6,
  "Mậu Tuất": 1.4,
  "Canh Tuất": 0.9,
  "Nhâm Tuất": 1.0,
  "Ất Hợi": 0.9,
  "Đinh Hợi": 1.6,
  "Kỷ Hợi": 0.9,
  "Tân Hợi": 1.7,
  "Quý Hợi": 0.7,
};

// 2. Cân lượng theo Tháng sinh (Âm Lịch)
// index từ 1 đến 12 tương ứng tháng 1 đến tháng 12
export const CAN_LUONG_THANG: Record<number, number> = {
  1: 0.6,
  2: 0.7,
  3: 1.8,
  4: 0.9,
  5: 0.5,
  6: 1.6,
  7: 0.9,
  8: 1.5,
  9: 1.8,
  10: 1.8,
  11: 0.9,
  12: 0.5,
};

// 3. Cân lượng theo Ngày sinh (Âm Lịch)
// index từ 1 đến 30
export const CAN_LUONG_NGAY: Record<number, number> = {
  1: 0.5,
  2: 1.0,
  3: 0.8,
  4: 1.5,
  5: 1.6,
  6: 1.5,
  7: 0.8,
  8: 1.6,
  9: 0.8,
  10: 1.6,
  11: 0.9,
  12: 1.7,
  13: 0.8,
  14: 1.7,
  15: 1.0,
  16: 0.8,
  17: 0.9,
  18: 1.8,
  19: 0.5,
  20: 1.5,
  21: 1.0,
  22: 0.9,
  23: 0.8,
  24: 0.9,
  25: 1.5,
  26: 1.8,
  27: 0.7,
  28: 0.8,
  29: 1.6,
  30: 0.6,
};

// 4. Cân lượng theo Giờ sinh
// Từ Tý đến Hợi
export const CAN_LUONG_GIO: Record<string, number> = {
  Tý: 1.6,
  Sửu: 0.6,
  Dần: 0.7,
  Mão: 1.0,
  Thìn: 0.9,
  Tỵ: 1.6,
  Ngọ: 1.0,
  Mùi: 0.8,
  Thân: 0.8,
  Dậu: 0.9,
  Tuất: 0.6,
  Hợi: 0.6,
};

// Hàm tính tổng cân lượng
export function calculateCanLuong(
  namChi: string,
  thang: number,
  ngay: number,
  gioChi: string,
): { luong: number; chi: number; total: number } {
  const tNam = CAN_LUONG_NAM[namChi] || 0;
  const tThang = CAN_LUONG_THANG[thang] || 0;
  const tNgay = CAN_LUONG_NGAY[ngay] || 0;
  const tGio = CAN_LUONG_GIO[gioChi] || 0;

  // Tránh lỗi làm tròn số thập phân của JavaScript (vd: 0.1 + 0.2 = 0.30000004)
  // Nhân 10 để cộng số nguyên, sau đó chia lại
  const totalChi = Math.round(tNam * 10) + Math.round(tThang * 10) + Math.round(tNgay * 10) + Math.round(tGio * 10);

  const luong = Math.floor(totalChi / 10);
  const chi = totalChi % 10;

  return { luong, chi, total: totalChi / 10 };
}
// ============================================================
// KNOWLEDGE PACKAGE: Tính chất 14 Chính Tinh & Phụ Tinh (Ngũ Hành, Hợp/Kỵ)
// Nguồn: Tổng hợp hệ thống sao Tử Vi
// ============================================================

export interface StarProperties {
  nguHanh: string;
  phanLoai: "Chính tinh" | "Phụ tá diệu" | "Sát tinh" | "Tứ Hóa";
  hop: string;
  ky: string;
  tinhChat: string;
}

export const STAR_PROPERTIES_VN: Record<string, StarProperties> = {
  // --- 14 CHÍNH TINH ---
  "Tử Vi": {
    nguHanh: "Âm Thổ",
    phanLoai: "Chính tinh",
    hop: "Các sao cát, hợp nhất là hai sao Thiên Phủ, Thiên Tướng. Hợp ở ba cung Sửu, Ngọ, Mùi.",
    ky: "Các sao hung, kỵ nhất hai sao Tham Lang, Phá Quân. Kỵ ở hai cung Thìn, Tuất.",
    tinhChat: "Sao chủ về quan lộc, sáng thì chủ về độ lượng, tối chủ về dễ nhiễm xấu.",
  },
  "Thiên Cơ": {
    nguHanh: "Âm Mộc",
    phanLoai: "Chính tinh",
    hop: "Các sao cát, ưa ở các cung Tý, Mão, Ngọ, Thìn, Dậu, Dần.",
    ky: "Các sao hung, kỵ nhất là hai sao Cự Môn. Không hợp ở cung Sửu, Mùi.",
    tinhChat: "Chủ về sự khéo léo, nếu sáng sủa chủ về trí tuệ, tối chủ về mơ tưởng.",
  },
  "Thái Dương": {
    nguHanh: "Dương Hỏa",
    phanLoai: "Chính tinh",
    hop: "Các sao cát, đặc biệt là Thái Âm, thích ở cung Mão, Thìn, Tỵ, Ngọ.",
    ky: "Các sao hung, kị nhất là sao Cự Môn. Không hợp ở cung Dậu, Tuất, Hợi, Tý.",
    tinhChat: "Sao chủ về quan lộc. Nếu Thái Dương sáng sủa chủ về có nghị lực, sức mạnh. Tối chủ về đào hoa.",
  },
  "Vũ Khúc": {
    nguHanh: "Âm Kim",
    phanLoai: "Chính tinh",
    hop: "Các sao cát, hợp nhất với Thiên Phủ, Thiên Tướng, Văn Xương, Văn Khúc. Ưu đóng ở cung Thân, Tuất, Sửu, Mùi.",
    ky: "Các sao hung, kỵ nhất là Phá Quân, Hỏa Tinh, Linh Tinh. Kỵ đóng các cung Tỵ, Hợi.",
    tinhChat: "Chủ về tiền tài. Cát chủ về là người quyết đoán. Hung chủ về hay suy nghĩ nông cạn.",
  },
  "Thiên Đồng": {
    nguHanh: "Dương Thủy",
    phanLoai: "Chính tinh",
    hop: "Các sao cát, hợp ở các cung Thân, Dần, Tỵ, Hợi.",
    ky: "Kỵ ở các cung Ngọ, Mùi, Sửu.",
    tinhChat: "Sao chủ về phúc đức, nếu cát chủ về được hưởng phúc, hung chủ nhu nhược.",
  },
  "Liêm Trinh": {
    nguHanh: "Âm Mộc, Hỏa",
    phanLoai: "Chính tinh",
    hop: "Các sao cát, phù hợp nhất với Thiên Phủ và Thiên Tướng, thích đóng tại Dần, Thân.",
    ky: "Các sao hung, kị nhất là gặp Tham Lang, Phá Quân. Không hợp ở các cung Tý, Ngọ, Mão, Dậu hay Tỵ, Hợi.",
    tinhChat: "Bản chất là một sao đào hoa, cát thì phong nhã, hung thì rất tàn ác.",
  },
  "Thiên Phủ": {
    nguHanh: "Dương Thổ",
    phanLoai: "Chính tinh",
    hop: "Các sao cát, hợp nhất với Tử Vi, Tả Phụ, Hữu Bật. Ở 12 cung đều tốt, nhất là ở hai cung Dần, Thân.",
    ky: "Các sao hung, nhất là không vong. Kỵ Cung Dậu.",
    tinhChat: "Có đức, có tài, là chủ điền trạch và tài bạch. Đẹp thì có tài năng, xấu thì phải lùi về sau.",
  },
  "Thái Âm": {
    nguHanh: "Âm Thủy",
    phanLoai: "Chính tinh",
    hop: "Sao Thái Dương, các cung Dậu, Tuất, Hợi, Tý.",
    ky: "Cung Mão, Thìn, Tỵ, Ngọ.",
    tinhChat: "Chủ phúc. Tốt đẹp thì chính trực, xấu thì âm mưu.",
  },
  "Tham Lang": {
    nguHanh: "Dương Mộc",
    phanLoai: "Chính tinh",
    hop: "Các sao cát, Cung Thìn, Tuất, Sửu, Mùi.",
    ky: "Hình, Không. Các sao hung, nhất là Liêm Trinh, Mộc Dục. Cung Tý, Ngọ, Mão, Dậu, Tỵ, Hợi.",
    tinhChat: "Đào hoa, chủ họa phúc. Tốt thì chủ về thực tế, hung chủ về đa dục.",
  },
  "Cự Môn": {
    nguHanh: "Âm Thổ",
    phanLoai: "Chính tinh",
    hop: "Sao Lộc, Cung Tý, Ngọ, Mão, Dậu, Dần, Thân, Tỵ, Hợi.",
    ky: "Kình Dương, Đà La. Cung Thìn, Tuất, Sửu, Mùi.",
    tinhChat: "Thị phi. Cát chủ về tỉ mỉ, cẩn thận. Hung thì hay do dự.",
  },
  "Thiên Tướng": {
    nguHanh: "Dương Thủy",
    phanLoai: "Chính tinh",
    hop: "Tử Vi, Cung Tý, Ngọ, Dần, Thân, Thìn, Tuất, Sửu, Mùi.",
    ky: "Hỏa Tinh, Linh Tinh (không kỵ các sao hung khác). Cung Mão, Dậu.",
    tinhChat: "Quan lộc. Chủ về giúp người, xấu thì trông rỗng.",
  },
  "Thiên Lương": {
    nguHanh: "Dương Thổ",
    phanLoai: "Chính tinh",
    hop: "Các sao cát, Cung Tý, Ngọ, Mão, Dậu, Thìn, Tuất, Sửu, Mùi.",
    ky: "Các sao hung, Kình Dương, Đà La. Cung Thân, Dần, Tỵ, Hợi.",
    tinhChat: "Chủ về thọ, hóa giải được tai ương. Cát chủ tinh tế, sáng suốt. Hung chủ chuyên chế.",
  },
  "Thất Sát": {
    nguHanh: "Âm Kim, Hỏa",
    phanLoai: "Chính tinh",
    hop: "Tử Vi, Các cung Tý, Ngọ, Mão, Dậu, Dần, Thân, Tỵ, Hợi, Sửu, Mùi.",
    ky: "Các sao hung, Cung Thìn, Tuất.",
    tinhChat: "Chủ về quyền uy. Xấu thì chủ về gay go, kịch liệt.",
  },
  "Phá Quân": {
    nguHanh: "Âm Thủy",
    phanLoai: "Chính tinh",
    hop: "Tử Vi, Cung Thìn, Tuất, Sửu, Mùi, Tỵ, Hợi.",
    ky: "Cung Tý, Ngọ, Mão, Dậu.",
    tinhChat: "Chủ họa phúc. Tốt thì cương nghị, xấu thì hao tán.",
  },

  // --- PHỤ TÁ DIỆU ---
  "Văn Xương": {
    nguHanh: "Dương Kim",
    phanLoai: "Phụ tá diệu",
    hop: "Cung Thìn, Tỵ, Dậu, Sửu.",
    ky: "Cung Dần, Ngọ, Tuất.",
    tinhChat: "Giỏi văn. Cát chủ về cao thượng, thanh nhã. Hung chủ thích son phấn, trang điểm.",
  },
  "Văn Khúc": {
    nguHanh: "Âm Thủy",
    phanLoai: "Phụ tá diệu",
    hop: "Cung Thìn, Tỵ, Dậu, Sửu.",
    ky: "Cung Dần, Ngọ, Tuất.",
    tinhChat: "Giỏi biện luận. Cát thì giỏi về nói năng, hung chủ giỏi che giấu, ngụy biện.",
  },
  "Tả Phụ": {
    nguHanh: "Dương Thổ",
    phanLoai: "Phụ tá diệu",
    hop: "Các sao cát. Tất cả các cung đều cát, trừ Mão, Dậu.",
    ky: "Mão, Dậu.",
    tinhChat: "Trợ lực, thi hành mệnh lệnh. Cát chủ về giúp người, hung chủ xâm phạm.",
  },
  "Hữu Bật": {
    nguHanh: "Âm Thủy",
    phanLoai: "Phụ tá diệu",
    hop: "Các sao cát. Tất cả các cung đều cát, trừ Mão, Dậu.",
    ky: "Mão, Dậu.",
    tinhChat: "Trợ lực, quản mệnh lệnh. Hung chủ giành giật.",
  },
  "Thiên Khôi": {
    nguHanh: "Dương Hỏa",
    phanLoai: "Phụ tá diệu",
    hop: "Các sao cát, các cung đều đẹp.",
    ky: "Các sao hung.",
    tinhChat: "Tài danh. Cát chủ được trợ giúp, hung thì gặp trở ngại.",
  },
  "Thiên Việt": {
    nguHanh: "Âm Hỏa",
    phanLoai: "Phụ tá diệu",
    hop: "Các sao cát, người sinh vào ban đêm.",
    ky: "Các sao hung.",
    tinhChat: "Cát chủ về được giúp đỡ, hung thì phiền não.",
  },
  "Lộc Tồn": {
    nguHanh: "Âm Thổ",
    phanLoai: "Phụ tá diệu",
    hop: "Hợp Thiên Mã, ở cung Tý, Ngọ, Mão, Dậu, Dần, Thân, Tỵ, Hợi.",
    ky: "Không Vong, cung Tử Mộ.",
    tinhChat: "Chủ tài lộc, tốt đẹp chủ về tài lộc, hung chủ bệnh tật.",
  },
  "Thiên Mã": {
    nguHanh: "Dương Hỏa",
    phanLoai: "Phụ tá diệu",
    hop: "Các sao cát, nhất là Lộc Tồn và cung sinh vượng.",
    ky: "Các sao hung, nhất là Không Vong và ở cung Bệnh, Tử, Tuyệt.",
    tinhChat: "Chủ di chuyển, quản lộc, những sự biến đổi.",
  },

  // --- SÁT TINH ---
  "Địa Không": {
    nguHanh: "Âm Hỏa",
    phanLoai: "Sát tinh",
    hop: "Hợp với các sao hành Kim, Hỏa.",
    ky: "Kỵ các sao hung, trừ Hỏa Linh.",
    tinhChat: "Tai họa, sáng thì chủ về độ lượng.",
  },
  "Địa Kiếp": {
    nguHanh: "Dương Hỏa",
    phanLoai: "Sát tinh",
    hop: "Hợp ở các cung Thìn, Tuất.",
    ky: "Các sao hung.",
    tinhChat: "Phá tán, thất bại.",
  },
  "Kình Dương": {
    nguHanh: "Dương Kim",
    phanLoai: "Sát tinh",
    hop: "Các sao cát, ở các cung Tứ Mộ (Thìn, Tuất, Sửu, Mùi).",
    ky: "Các sao hung và ở cung Tý, Ngọ, Mão, Dậu.",
    tinhChat: "Hình thương. Tốt đẹp thì quyền uy.",
  },
  "Đà La": {
    nguHanh: "Âm Kim",
    phanLoai: "Sát tinh",
    hop: "Các sao cát, hợp ở các cung Thìn, Tuất, Sửu, Mùi.",
    ky: "Kỵ ở Dần, Thân, Tỵ, Hợi.",
    tinhChat: "Trì hoãn, kéo dài. Tốt đẹp chủ về ngầm quyền lực, hung thì ngầm chịu chèn ép.",
  },
  "Hỏa Tinh": {
    nguHanh: "Dương Hỏa",
    phanLoai: "Sát tinh",
    hop: "Các sao cát, người sinh năm Dần, Mão, Tỵ, Ngọ, Tuất.",
    ky: "Các sao hung, ở các cung Thân, Tý, Thìn.",
    tinhChat: "Nóng tính, cát chủ về tài năng, hung thì gặp nhiều tai họa.",
  },
  "Linh Tinh": {
    nguHanh: "Âm Hỏa",
    phanLoai: "Sát tinh",
    hop: "Các sao cát, người sinh năm Dần, Mão, Tỵ, Ngọ, Tuất.",
    ky: "Các sao hung, ở các cung Thân, Tý, Thìn.",
    tinhChat: "Nóng tính, cứng cỏi. Cát chủ ngầm phát phúc, hung thì dễ bị xâm hại.",
  },

  // --- TỨ HÓA ---
  "Hóa Lộc": {
    nguHanh: "Âm Thổ",
    phanLoai: "Tứ Hóa",
    hop: "Các sao cát, ưa nhất là Lộc Tồn, Thiên Mã, hợp ở cung Dần Thân.",
    ky: "Địa Không, Địa Kiếp (không kỵ các sao hung). Không hợp ở các cung Tý, Ngọ, Mão, Dậu.",
    tinhChat: "Chủ tài lộc, tiền của.",
  },
  "Hóa Quyền": {
    nguHanh: "Âm Mộc",
    phanLoai: "Tứ Hóa",
    hop: "Các sao cát, hợp nhất với Cự Môn, Vũ Khúc, ở cung Sửu.",
    ky: "Không kỵ sao hung, ở ngoài ba cung Sửu, Mão, Tuất thì ngại Tứ Sát.",
    tinhChat: "Chủ quyền thế, địa vị.",
  },
  "Hóa Khoa": {
    nguHanh: "Dương Thủy",
    phanLoai: "Tứ Hóa",
    hop: "Thiên Khôi, Thiên Việt, ba cung Sửu, Ngọ, Thân.",
    ky: "Không Kiếp và Nhật Nguyệt hãm.",
    tinhChat: "Chủ về thanh danh, thi cử, phước lành.",
  },
  "Hóa Kỵ": {
    nguHanh: "Dương Thủy",
    phanLoai: "Tứ Hóa",
    hop: "Ưa mệnh thủy cục, người sinh năm Thân, Tý, Thìn. Hợp ở các cung Tý, Sửu.",
    ky: "Các sao hung. Kỵ mệnh hỏa cục và người sinh năm Dần, Ngọ, Tuất.",
    tinhChat: "Chủ đố kỵ, thị phi, sự thầm lặng.",
  },
};
