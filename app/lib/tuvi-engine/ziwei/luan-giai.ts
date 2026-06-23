// src/lib/tuvi-engine/ziwei/luan-giai.ts
// Luận giải Tử Vi rule-based theo Nam phái (Vân Đằng Thái Thứ Lang & Nguyễn Phát Lộc).
// Sinh văn bản luận cho 12 cung dựa trên: chính tinh tại cung + độ sáng + Tứ Hóa nhập cung.
// Không dùng AI — đảm bảo nhất quán, miễn phí token. AI Panel vẫn dùng cho tổng luận.

import type { NormalizedChart, NormalizedCung } from "./normalize-vn";
import { THAI_TUE_RING_META_VN, SAT_TINH_META_VN, LOC_TON_POSITION_VN, TRUC_XUONG_SONG_VN } from "./constants-vn";

// ---- 1. Ý nghĩa CHÍNH TINH tại từng loại cung ---------------------------

type CungKind =
  | "Mệnh"
  | "Phụ Mẫu"
  | "Phúc Đức"
  | "Điền Trạch"
  | "Quan Lộc"
  | "Nô Bộc"
  | "Thiên Di"
  | "Tật Ách"
  | "Tài Bạch"
  | "Tử Tức"
  | "Phu Thê"
  | "Huynh Đệ";

function cungKindOf(ten: string): CungKind | null {
  const t = ten.replace(" Cung", "").trim() as CungKind;
  return t || null;
}

// Bảng nghĩa cô đọng — mỗi sao × mỗi cung. Lấy lõi từ "Tử Vi Hàm Số" (Nam phái).
const STAR_MEAN: Record<string, Partial<Record<CungKind, string>>> = {
  "Tử Vi": {
    Mệnh: "Đế tinh chủ tôn quý, uy nghi, có chí lãnh đạo. Cần Tả Hữu Khôi Việt hội hợp mới phát huy; đơn thủ dễ cô độc, kiêu ngạo.",
    "Quan Lộc": "Sự nghiệp lớn, có địa vị quản lý, hợp công danh chính trị – quản trị.",
    "Tài Bạch": "Tiền tài dư dả, cách kiếm tiền cao quý nhưng không giỏi tiểu tiết.",
    "Phu Thê": "Phối ngẫu có chí khí, mạnh mẽ; dễ áp đảo bản thân nếu Mệnh nhược.",
    "Phúc Đức": "Hưởng thụ thanh cao, tinh thần đề cao, trọng thể diện.",
    "Điền Trạch": "Nhà cửa khang trang, dễ có bất động sản giá trị.",
  },
  "Thiên Cơ": {
    Mệnh: "Thông minh, mưu lược, thiện biến hóa, hợp tham mưu – nghiên cứu. Tâm tính bất an, hay thay đổi.",
    "Huynh Đệ": "Anh em ít nhưng thân thiết, có người tài trí.",
    "Phu Thê": "Vợ chồng thông minh, hợp tinh thần; nhưng dễ đổi ý, ly hợp bất thường.",
    "Quan Lộc": "Nghề liên quan trí óc, kế hoạch, công nghệ, vận tải, môi giới.",
    "Thiên Di": "Đi xa có lợi, năng động, gặp quý nhân nơi tha hương.",
  },
  "Thái Dương": {
    Mệnh: "Quang minh chính đại, hào sảng, hiếu danh. Miếu Vượng tại Mão–Tỵ–Ngọ thì hiển đạt; Hãm tại Tuất–Hợi–Tý lao tâm vô ích.",
    "Phụ Mẫu": "Cha có uy, hữu duyên với cha; Hãm thì cha sớm khắc.",
    "Quan Lộc": "Sự nghiệp công khai, hợp chính giới, giáo dục, truyền thông.",
    "Phu Thê": "Nam mệnh: vợ hiền đảm; Nữ mệnh: chồng nóng nhưng quang minh.",
  },
  "Vũ Khúc": {
    Mệnh: "Tài tinh, cương nghị, quyết đoán, hợp võ nghiệp – tài chính. Nữ mệnh dễ cô khắc nếu không có cát tinh giải.",
    "Tài Bạch": "Chính tài tinh — kiếm tiền bằng thực lực, hợp ngân hàng – kim loại – cơ khí.",
    "Phu Thê": "Hôn nhân muộn lợi, sớm dễ khắc; phối ngẫu cương trực.",
    "Quan Lộc": "Hợp tài chính, quân đội, kỹ thuật cơ khí.",
  },
  "Thiên Đồng": {
    Mệnh: "Phúc tinh, ôn hoà, hưởng thụ, hợp đời sống an nhàn. Thiếu xung kích nếu không gặp sát tinh kích phát.",
    "Phúc Đức": "Hưởng phúc, tâm an, sống lâu.",
    "Tử Tức": "Con cái hiếu thuận, đông con.",
    "Thiên Di": "Ra ngoài được người giúp, sinh hoạt dễ chịu.",
  },
  "Liêm Trinh": {
    Mệnh: "Thứ đào hoa kiêm tù tinh — cương nhu lẫn lộn, đa tài đa nghệ nhưng dễ thị phi, tù tụng.",
    "Quan Lộc": "Hợp công nghệ, pháp lý, quân cảnh; gặp Sát tinh dễ kiện tụng.",
    "Phu Thê": "Cảm tình phức tạp, dễ có chuyện ngoài hôn nhân nếu hội Đào Hồng.",
    "Tật Ách": "Đề phòng bệnh huyết – tim mạch; gặp Sát Kỵ càng nặng.",
  },
  "Thiên Phủ": {
    Mệnh: "Khố tinh — bảo thủ, ổn trọng, có tài quản lý, biết giữ của.",
    "Tài Bạch": "Tài lộc bền vững, biết tích lũy, hợp nghề lưu trữ – kế toán – địa ốc.",
    "Điền Trạch": "Có nhà cửa ruộng vườn, gia trạch ổn định.",
    "Phu Thê": "Phối ngẫu hiền thục, gia đình êm ấm.",
  },
  "Thái Âm": {
    Mệnh: "Phú tinh, ôn nhu, thanh tú; Miếu tại Dậu–Tuất–Hợi–Tý thì phú quý; Hãm tại Mão–Thìn–Tỵ–Ngọ thì lao tâm.",
    "Phụ Mẫu": "Hữu duyên với mẹ; Hãm thì khắc mẫu.",
    "Điền Trạch": "Có bất động sản, nhà cửa đẹp.",
    "Phu Thê": "Nam mệnh: vợ đẹp dịu dàng; Nữ mệnh: phu quân nho nhã.",
  },
  "Tham Lang": {
    Mệnh: "Đào hoa kiêm dục vọng — đa tài đa nghệ, ham vui, hợp giao tế, nghệ thuật, kinh doanh.",
    "Phu Thê": "Tình cảm sôi nổi, dễ đa tình; cần tinh thần kiềm chế.",
    "Tài Bạch": "Tài lộc lên xuống, hợp đầu cơ, ngành giải trí – ăn uống.",
    "Phúc Đức": "Ham hưởng thụ, đam mê tửu sắc nếu hội Đào Hồng Hỉ.",
  },
  "Cự Môn": {
    Mệnh: "Ám tinh — khẩu tài, hùng biện, nhưng đa nghi, dễ thị phi miệng tiếng.",
    "Huynh Đệ": "Anh em bất hoà, dễ có khẩu thiệt.",
    "Phu Thê": "Vợ chồng cãi vã, hôn nhân muộn mới hợp.",
    "Quan Lộc": "Hợp nghề dùng miệng: luật sư, giáo viên, MC, truyền thông, ngoại giao.",
    "Nô Bộc": "Bạn bè thị phi, dễ bị phản bội bởi khẩu thiệt.",
  },
  "Thiên Tướng": {
    Mệnh: "Ấn tinh — trung hậu, công bằng, hợp tham mưu, phụ tá, hành chính.",
    "Quan Lộc": "Phó tướng đắc lực, hợp pháp lý – nhân sự – tư vấn.",
    "Phu Thê": "Phối ngẫu trung trinh, gia đình hòa thuận.",
  },
  "Thiên Lương": {
    Mệnh: "Ấm tinh — nhân hậu, chính trực, có khả năng giải nguy; hợp y dược, giáo dục, tư pháp.",
    "Phụ Mẫu": "Cha mẹ thọ, hữu duyên trưởng bối.",
    "Tật Ách": "Bệnh tật có người cứu giải, gặp dữ hoá lành.",
    "Phúc Đức": "Sống lâu, hưởng phúc, tinh thần thanh cao.",
  },
  "Thất Sát": {
    Mệnh: "Tướng tinh — uy mãnh, độc lập, quyết đoán; hợp võ nghiệp, doanh nhân khai phá.",
    "Quan Lộc": "Sự nghiệp khai sáng, hợp quân đội – công an – doanh nghiệp tự lập.",
    "Phu Thê": "Hôn nhân muộn lợi, sớm khắc; phối ngẫu mạnh mẽ.",
    "Tật Ách": "Đề phòng tai nạn ngoại thương, phẫu thuật.",
  },
  "Phá Quân": {
    Mệnh: "Hao tinh — khai sáng, phá cũ lập mới, nhưng tổn hao nhiều; hợp công nghiệp nặng, cải cách.",
    "Phu Thê": "Hôn nhân nhiều biến động, dễ tái hôn.",
    "Tài Bạch": "Tiền tài tụ tán bất thường, hợp đầu tư mạo hiểm.",
    "Huynh Đệ": "Anh em ly tán, ít trợ lực.",
  },
};

// Tính đa nghĩa của độ sáng → hệ số biểu cảm
function tonModifier(doSang?: string): string {
  if (!doSang) return "";
  if (["Miếu", "Vượng"].includes(doSang)) return " (đắc cách, phát huy tối đa)";
  if (doSang === "Đắc" || doSang === "Lợi") return " (đắc địa, thuận lợi)";
  if (doSang === "Bình") return " (bình hoà)";
  if (doSang === "Hãm") return " (hãm địa, giảm lực, dễ phản tác dụng)";
  return "";
}

// ---- 2. Ý nghĩa TỨ HÓA khi nhập cung -----------------------------------

const SIHUA_AT_CUNG: Record<string, Partial<Record<CungKind, string>>> = {
  "Hóa Lộc": {
    Mệnh: "Bản thân may mắn, có lộc trời cho, dễ thành đạt.",
    "Tài Bạch": "Tài lộc dồi dào, kiếm tiền thuận lợi.",
    "Quan Lộc": "Sự nghiệp hanh thông, thăng tiến.",
    "Phu Thê": "Hôn nhân đem lại tài lộc, phối ngẫu giúp đỡ.",
    "Phúc Đức": "Hưởng phúc, tâm an, sống thoải mái.",
    "Điền Trạch": "Tăng bất động sản, gia trạch hưng vượng.",
  },
  "Hóa Quyền": {
    Mệnh: "Có quyền uy, khả năng chỉ huy, khẳng định bản thân.",
    "Quan Lộc": "Nắm thực quyền, thăng chức, làm chủ.",
    "Tài Bạch": "Chủ động trong tài chính, kiểm soát tiền bạc.",
    "Phu Thê": "Phối ngẫu có quyền, hoặc bản thân áp đảo trong hôn nhân.",
    "Nô Bộc": "Có nhân viên/bộ hạ đắc lực.",
  },
  "Hóa Khoa": {
    Mệnh: "Có tiếng tăm, học vấn, gặp quý nhân.",
    "Quan Lộc": "Thăng tiến nhờ danh tiếng, hợp khoa cử, học thuật.",
    "Phụ Mẫu": "Cha mẹ có học, gia đình trọng giáo dục.",
    "Phúc Đức": "Tinh thần thanh cao, tu dưỡng tốt.",
    "Tử Tức": "Con cái học giỏi, thành đạt về khoa bảng.",
  },
  "Hóa Kỵ": {
    Mệnh: "Bản thân nhiều trắc trở, đa đoan, cần cẩn trọng.",
    "Tài Bạch": "Tiền bạc dễ hao tổn, vướng kiện tụng tài chính.",
    "Quan Lộc": "Sự nghiệp gặp trở ngại, thị phi nơi công sở.",
    "Phu Thê": "Hôn nhân trắc trở, dễ xung khắc.",
    "Tật Ách": "Sức khỏe kém, bệnh mãn tính.",
    "Huynh Đệ": "Bất hoà với anh em.",
    "Nô Bộc": "Bị bạn bè/cấp dưới phản bội.",
    "Điền Trạch": "Hao tổn bất động sản, tranh chấp nhà đất.",
    "Phụ Mẫu": "Khắc cha mẹ hoặc xa cách.",
    "Tử Tức": "Con cái khó nuôi hoặc xung khắc.",
    "Thiên Di": "Đi xa bất lợi, dễ gặp tai ương.",
    "Phúc Đức": "Tinh thần bất an, lo nghĩ nhiều.",
  },
};

// ---- 3. Cách cục đặc biệt ----------------------------------------------

interface Cachcuc {
  ten: string;
  detail: string;
}

function detectCachCuc(chart: NormalizedChart): Cachcuc[] {
  const out: Cachcuc[] = [];
  const menh = chart.cung[chart.menhCung.ten];
  if (!menh) return out;
  const allMenhStars = new Set(menh.saoChinhTinh.map((s) => s.ten));

  // Tử Phủ Vũ Tướng
  const tpvt = ["Tử Vi", "Thiên Phủ", "Vũ Khúc", "Thiên Tướng"];
  const tpvtCount = tpvt.filter((s) =>
    Object.values(chart.cung).some(
      (c) => [chart.menhCung.ten].includes(c.ten) && c.saoChinhTinh.some((x) => x.ten === s),
    ),
  ).length;
  if (allMenhStars.has("Tử Vi") || allMenhStars.has("Thiên Phủ")) {
    out.push({
      ten: "Cách Tử Phủ Vũ Tướng",
      detail:
        "Mệnh có Tử Vi hoặc Thiên Phủ — chủ ôn hoà, quản trị, hợp con đường công danh ổn định, làm quản lý hoặc chuyên môn cao.",
    });
  }
  // Sát Phá Tham
  if (["Thất Sát", "Phá Quân", "Tham Lang"].some((s) => allMenhStars.has(s))) {
    out.push({
      ten: "Cách Sát Phá Tham",
      detail:
        "Mệnh có một trong Thất Sát – Phá Quân – Tham Lang — chủ biến động, khai sáng, hợp khởi nghiệp, võ nghiệp, ngành mạo hiểm. Cuộc đời nhiều thăng trầm.",
    });
  }
  // Cơ Nguyệt Đồng Lương
  if (["Thiên Cơ", "Thái Âm", "Thiên Đồng", "Thiên Lương"].some((s) => allMenhStars.has(s))) {
    out.push({
      ten: "Cách Cơ Nguyệt Đồng Lương",
      detail:
        "Mệnh hội một trong Cơ – Nguyệt – Đồng – Lương — chủ trí thức, ôn hoà, hợp công chức, giáo dục, y tế, nghiên cứu. Sự nghiệp ổn định.",
    });
  }
  // Cự Nhật
  if (allMenhStars.has("Cự Môn") && allMenhStars.has("Thái Dương")) {
    out.push({
      ten: "Cách Cự Nhật đồng cung",
      detail:
        "Cự Môn + Thái Dương — khẩu tài xuất chúng, hợp ngoại giao, truyền thông, luật pháp. Cự được Dương hoá giải bớt thị phi.",
    });
  }
  // Vô chính diệu
  if (menh.saoChinhTinh.length === 0) {
    out.push({
      ten: "Mệnh Vô Chính Diệu",
      detail:
        "Không có chính tinh ở Mệnh — phải mượn sao cung Thiên Di (xung chiếu) để luận. Người Vô Chính Diệu thường thông minh, đa năng, nhưng cuộc đời cần tự lập, hợp ly hương lập nghiệp.",
    });
  }
  // Tứ Hóa nhập Mệnh
  for (const star of menh.saoChinhTinh) {
    if (star.tuHoa) {
      out.push({
        ten: `${star.tuHoa} tại Mệnh`,
        detail: `${star.ten} ${star.tuHoa} thủ Mệnh — ${SIHUA_AT_CUNG[star.tuHoa]?.["Mệnh"] ?? ""}`,
      });
    }
  }
  return out;
}

// ---- 4. API chính -------------------------------------------------------

export interface CungLuanGiai {
  tenCung: string;
  canChi: string;
  chinhTinhText: string; // luận chính tinh
  sihuaText: string; // luận Tứ Hóa nhập cung (nếu có)
  tongLuan: string; // 1-2 câu chốt
}

export interface FullLuanGiai {
  cungs: CungLuanGiai[];
  cachCuc: Cachcuc[];
  tongQuan: string;
}

function luanMotCung(cung: NormalizedCung): CungLuanGiai {
  const kind = cungKindOf(cung.ten);
  let chinhTinhText = "";
  let sihuaText = "";

  if (cung.saoChinhTinh.length === 0) {
    chinhTinhText =
      "Vô chính diệu — cung này cần mượn sao cung xung chiếu để luận, hoặc dựa vào phụ tinh và Tứ Hóa tại cung.";
  } else {
    const parts: string[] = [];
    for (const s of cung.saoChinhTinh) {
      const base = kind ? STAR_MEAN[s.ten]?.[kind] : null;
      const text = base ?? `${s.ten} tại cung ${kind ?? cung.ten} — ảnh hưởng đặc thù theo sách.`;
      parts.push(`• ${s.ten}${tonModifier(s.doSang)}: ${text}`);
    }
    chinhTinhText = parts.join("\n");
  }

  // Tứ Hóa nhập cung
  const sihuaParts: string[] = [];
  for (const s of [...cung.saoChinhTinh, ...cung.saoPhuTinh]) {
    if (s.tuHoa && kind) {
      const meaning = SIHUA_AT_CUNG[s.tuHoa]?.[kind];
      if (meaning) sihuaParts.push(`• ${s.ten} ${s.tuHoa}: ${meaning}`);
      else sihuaParts.push(`• ${s.ten} ${s.tuHoa} tại cung ${kind}.`);
    }
  }
  sihuaText = sihuaParts.join("\n");

  // Tổng luận ngắn
  const chinh = cung.saoChinhTinh.map((s) => s.ten).join(" + ") || "Vô chính diệu";
  const phuCount = cung.saoPhuTinh.length;
  const sat = cung.saoPhuTinh.filter((s) =>
    ["Kình Dương", "Đà La", "Hỏa Tinh", "Linh Tinh", "Địa Không", "Địa Kiếp"].includes(s.ten),
  ).length;
  const cat = cung.saoPhuTinh.filter((s) =>
    ["Tả Phụ", "Hữu Bật", "Văn Xương", "Văn Khúc", "Thiên Khôi", "Thiên Việt", "Lộc Tồn"].includes(s.ten),
  ).length;
  let tongLuan = `Cung ${kind} thủ ${chinh}.`;
  if (cat > sat) tongLuan += ` Cát tinh (${cat}) áp đảo sát tinh (${sat}) — cung tốt, phát huy ưu thế.`;
  else if (sat > cat)
    tongLuan += ` Sát tinh (${sat}) áp đảo cát tinh (${cat}) — cung này có nhiều thách thức, cần cẩn trọng.`;
  else tongLuan += ` Cát–Sát cân bằng (${cat}/${sat}), cần thực tế và nỗ lực.`;
  if (phuCount === 0) tongLuan += " (Không có phụ tinh trợ lực rõ rệt.)";

  return {
    tenCung: cung.ten,
    canChi: cung.canChi,
    chinhTinhText,
    sihuaText,
    tongLuan,
  };
}

export function luanGiaiToanBo(chart: NormalizedChart): FullLuanGiai {
  const cungs: CungLuanGiai[] = chart.cungOrder.map((ten) => luanMotCung(chart.cung[ten]!));
  const cachCuc = detectCachCuc(chart);
  const menh = chart.cung[chart.menhCung.ten]!;
  const chinhMenh = menh.saoChinhTinh.map((s) => s.ten).join(", ") || "Vô chính diệu";

  const tongQuan =
    `Mệnh an tại ${menh.diaChi} (${menh.canChi}), thủ bởi: ${chinhMenh}. ` +
    `Cục số: ${chart.cucSo}. Mệnh chủ ${chart.menhChu}, Thân chủ ${chart.thanChu}. ` +
    `Tứ Hóa năm sinh: Lộc–${chart.tuHoa.hóaLộc}, Quyền–${chart.tuHoa.hóaQuyền}, ` +
    `Khoa–${chart.tuHoa.hóaKhoa}, Kỵ–${chart.tuHoa.hóaKỵ}. ` +
    (cachCuc.length > 0
      ? `Phát hiện ${cachCuc.length} cách cục đáng chú ý — xem chi tiết bên dưới.`
      : "Lá số không rơi vào cách cục đặc biệt — luận theo từng cung.");

  return { cungs, cachCuc, tongQuan };
}

export default { luanGiaiToanBo };
// ============================================================
// KNOWLEDGE PACKAGE: Nam Phái - Thầy Lê Quang Lăng
// Quy tắc luận đoán Vòng Thái Tuế + Lưu Thái Tuế
// ============================================================

// --- KIỂU DỮ LIỆU BỔ SUNG ---

export interface LuanDoanThaiTue {
  loai: "tinh_cach" | "tai_loc" | "han_nam" | "nhan_tuong" | "tuong_tac";
  ten: string;
  dieuKien: string;
  ketLuan: string;
  nguon: string; // trường phái / tài liệu
}

export interface KiemTraCheGiai {
  satTinhTen: string;
  biBatBoi: string[];
  ketQua: "bi_che" | "khong_bi_che" | "giam_nhe";
  luanVan: string;
}

// --- QUY TẮC 1: VỊ TRÍ LỘC TỒN THEO THIÊN CAN ---
// Ràng buộc: Lộc Tồn xác định → Bác Sĩ đồng cung 100%
export function getLocTonPosition(canNamSinh: string): {
  cungLocTon: string;
  cungBacSi: string; // luôn bằng cungLocTon
} {
  const cung = LOC_TON_POSITION_VN[canNamSinh];
  if (!cung) throw new Error(`Thiên can không hợp lệ: ${canNamSinh}`);
  return { cungLocTon: cung, cungBacSi: cung };
}

// --- QUY TẮC 2: NHẬN DIỆN "ĐẮC TAM HỢP" VÒNG ---
// Hệ thống quét bộ ba tam hợp để tìm sao chủ lực của từng vòng Thiên-Địa-Nhân
export function checkDacTamHopVong(
  cungMenhBranchIndex: number, // 0=Tý, 1=Sửu,...,11=Hợi
  mapSaoTheoVi: Record<string, string[]>, // cung → danh sách sao
): {
  dacVong: ("Thiên" | "Địa" | "Nhân")[];
  chiTiet: string;
} {
  // Bộ tam hợp: [0,4,8]=Tý-Thìn-Thân, [1,5,9]=Sửu-Tỵ-Dậu, [2,6,10]=Dần-Ngọ-Tuất, [3,7,11]=Mão-Mùi-Hợi
  const BRANCH_NAMES = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
  const tamHopIdx = [cungMenhBranchIndex, (cungMenhBranchIndex + 4) % 12, (cungMenhBranchIndex + 8) % 12];
  const tamHopChi = tamHopIdx.map((i) => BRANCH_NAMES[i]);

  const dacVong: ("Thiên" | "Địa" | "Nhân")[] = [];
  let chiTiet = `Tam hợp Mệnh: ${tamHopChi.join(" - ")}. `;

  // Kiểm tra Thái Tuế (Nhân) có trong tam hợp không
  const hasThaiTue = tamHopChi.some((c) => (mapSaoTheoVi[c] || []).includes("Thái Tuế"));
  if (hasThaiTue) {
    dacVong.push("Nhân");
    chiTiet += "Đắc vòng Nhân (Thái Tuế lọt tam hợp). ";
  }

  // Kiểm tra Lộc Tồn (Địa) có trong tam hợp không
  const hasLocTon = tamHopChi.some((c) => (mapSaoTheoVi[c] || []).includes("Lộc Tồn"));
  if (hasLocTon) {
    dacVong.push("Địa");
    chiTiet += "Đắc vòng Địa (Lộc Tồn lọt tam hợp). ";
  }

  return { dacVong, chiTiet };
}

// --- QUY TẮC 3: THÁI TUẾ + HOA CÁI TẠI MỆNH (TỨ MỘ) ---
// Điều kiện: Chi năm sinh thuộc Tứ mộ (Thìn, Tuất, Sửu, Mùi)
export function checkThaiTueHoaCaiMenh(chiNamSinh: string, saoTaiMenh: string[]): LuanDoanThaiTue | null {
  const TU_MO = ["Thìn", "Tuất", "Sửu", "Mùi"];
  if (!TU_MO.includes(chiNamSinh)) return null;

  const hasThaiTue = saoTaiMenh.includes("Thái Tuế");
  const hasHoaCai = saoTaiMenh.includes("Hoa Cái");
  if (!hasThaiTue || !hasHoaCai) return null;

  return {
    loai: "tinh_cach",
    ten: "Thái Tuế - Hoa Cái đồng cung Mệnh (Tứ mộ)",
    dieuKien: `Chi năm sinh ${chiNamSinh} thuộc Tứ mộ, Thái Tuế và Hoa Cái đồng cung tại Mệnh`,
    ketLuan:
      'Thuộc tính bảo thủ, lầm lỳ, bướng bỉnh của Thái Tuế bị nhân cấp số nhân với độ lì lợm của Hoa Cái. Kích hoạt trạng thái "vô địch về ngang, ngang tàn bạo, ngang như cua". Đây là người cực kỳ khó thay đổi quan điểm, ý chí sắt đá nhưng thiếu linh hoạt.',
    nguon: "Nam Phái - Thầy Lê Quang Lăng, Bài giảng Vòng Thái Tuế",
  };
}

/**
 * QUY TẮC 4: LUẬN HẠN NĂM QUA LƯU THÁI TUẾ
 * Lưu Thái Tuế = Chi năm xem → nhập cung tương ứng trên lá số gốc
 *
 * @param chiNamXem - Địa chi của năm xem (0-11: 0=Tý, 1=Sửu, ..., 11=Hợi)
 * @param namXem - Năm xem (dương lịch) — dùng để tính các sao lưu khác nếu cần
 * @param tenCungNhap - tên cung (Mệnh, Quan Lộc, Tài Bạch,...)
 * @param saoTaiCung - danh sách sao tại cung
 */
export function luanHanLuuThaiTue(
  chiNamXem: string,
  namXem: number, // ← THÊM PARAMETER NÀY
  tenCungNhap: string,
  saoTaiCung: string[],
): LuanDoanThaiTue {
  // Phân loại cat/hung theo sao đồng cung
  const CAT_TINH = [
    "Tả Phụ",
    "Hữu Bật",
    "Văn Xương",
    "Văn Khúc",
    "Thiên Khôi",
    "Thiên Việt",
    "Long Đức",
    "Phúc Đức",
    "Thiếu Dương",
    "Thiếu Âm",
    "Tử Phù",
    "Thiên Lương",
    "Thiên Phúc",
    "Thiên Quan",
  ];
  const HUNG_TINH = [
    "Kình Dương",
    "Đà La",
    "Hỏa Tinh",
    "Linh Tinh",
    "Địa Không",
    "Địa Kiếp",
    "Tang Môn",
    "Điếu Khách",
    "Quan Phù",
    "Tuế Phá",
    "Trực Phù",
    "Bạch Hổ",
    "Kiếp Sát",
  ];

  const catCount = saoTaiCung.filter((s) => CAT_TINH.includes(s)).length;
  const hungCount = saoTaiCung.filter((s) => HUNG_TINH.includes(s)).length;

  // Luận theo cung bị nhập
  const CUNG_LUAN: Record<string, string> = {
    "Huynh Đệ": "Gia đình có biến động (bố mẹ sinh thêm em, anh em đi xa hoặc di chuyển, thay đổi chỗ ở).",
    "Quan Lộc":
      "Thay đổi môi trường làm việc, nhận nhiệm vụ mới, có biến động về sự nghiệp. Nếu gặp hung tinh: nhẹ thì kỷ luật, nặng thì cách chức.",
    "Tài Bạch": "Biến động về tiền bạc, thu chi. Nếu gặp hung tinh: mất tiền, tranh chấp tài sản.",
    "Phu Thê": "Biến động trong quan hệ hôn nhân, tình cảm. Dễ xảy ra bất đồng quan điểm với bạn đời.",
    "Tử Tức": "Biến động liên quan đến con cái hoặc cấp dưới. Có thể có tin vui hoặc lo lắng về con.",
    "Điền Trạch": "Biến động về nhà cửa, bất động sản, di chuyển chỗ ở.",
    "Thiên Di": "Năm có nhiều di chuyển, đi lại, xa nhà. Biến động lớn về môi trường sống.",
    "Nô Bộc": "Biến động trong quan hệ bạn bè, đồng nghiệp, cấp dưới. Dễ có xích mích.",
    "Phúc Đức": "Biến động về tâm linh, sức khỏe ẩn, tổ tiên. Nên chú ý việc cúng bái, mồ mả.",
    "Phụ Mẫu": "Biến động liên quan đến cha mẹ, người trên hoặc văn thư, pháp lý.",
    Mệnh: "Năm bản thân chịu nhiều biến động nhất. Thay đổi lớn về nhân sinh quan, sức khỏe, ngoại hình.",
    Thân: "Năm biến động về sức khỏe thực thể và công việc cụ thể đang làm.",
  };

  const cungLuan = CUNG_LUAN[tenCungNhap] || `Biến động tại cung ${tenCungNhap}.`;
  const bienDong =
    catCount > hungCount
      ? "thuận lợi, tốt lên"
      : hungCount > catCount
        ? "tiêu cực, gây xích mích và tranh chấp nặng"
        : "trung tính, cần theo dõi";

  return {
    loai: "han_nam",
    ten: `Lưu Thái Tuế năm ${chiNamXem} nhập cung ${tenCungNhap}`,
    dieuKien: `Lưu Thái Tuế (Chi ${chiNamXem}) trùng phùng tại cung ${tenCungNhap} nguyên cục`,
    ketLuan: `${cungLuan} Xu hướng biến chuyển: ${bienDong} (có ${catCount} cát tinh, ${hungCount} hung tinh đồng cung). Đương số cần kiềm chế cảm xúc và lời nói — Lưu Thái Tuế đi đến đâu rất dễ kích hoạt tranh chấp, bất đồng quan điểm tại phương diện đó.`,
    nguon: "Nam Phái - Thầy Lê Quang Lăng, Bài giảng Vòng Thái Tuế Bài 2-3-5",
  };
}

// --- QUY TẮC 5: CHẾ GIẢI KIẾP SÁT ---
export function checkCheGiaiKiepSat(saoTaiCung: string[]): KiemTraCheGiai {
  const CHE_GIAI_STARS = ["Quang Quý", "Thiên Quan", "Thiên Phúc", "Tuần", "Triệt", "Long Trì", "Phượng Các"];
  const biBatBoi = saoTaiCung.filter((s) => CHE_GIAI_STARS.includes(s));
  const hasKiepSat = saoTaiCung.includes("Kiếp Sát");

  if (!hasKiepSat) {
    return { satTinhTen: "Kiếp Sát", biBatBoi: [], ketQua: "khong_bi_che", luanVan: "Không có Kiếp Sát tại cung này." };
  }

  if (biBatBoi.length > 0) {
    return {
      satTinhTen: "Kiếp Sát",
      biBatBoi,
      ketQua: "bi_che",
      luanVan: `Kiếp Sát tuy có mặt nhưng bị chế ngự bởi ${biBatBoi.join(", ")}. Tai ách phẫu thuật, máu lạnh được giảm trừ xuống mức không đáng ngại. Đương số có thể trải qua thủ thuật nhỏ hoặc khám chữa bệnh thông thường, không nguy hiểm tính mạng.`,
    };
  }

  return {
    satTinhTen: "Kiếp Sát",
    biBatBoi: [],
    ketQua: "khong_bi_che",
    luanVan:
      "Kiếp Sát tọa thủ không có sao chế giải. Cần đề phòng tai ách về máu me, phẫu thuật, đại phẫu. Nên tránh dao kéo không cần thiết trong hạn này.",
  };
}

// --- QUY TẮC 6: CHẾ GIẢI ĐỊA KHÔNG / ĐỊA KIẾP ---
export function checkCheGiaiKhongKiep(saoTaiCung: string[]): KiemTraCheGiai[] {
  const results: KiemTraCheGiai[] = [];
  const CHE_GIAI_STARS = ["Hoa Cái", "Thiên Quan", "Thiên Phúc", "Tam Minh", "Long Trì", "Phượng Các"];

  for (const satTinh of ["Địa Không", "Địa Kiếp"] as const) {
    if (!saoTaiCung.includes(satTinh)) continue;
    const biBatBoi = saoTaiCung.filter((s) => CHE_GIAI_STARS.includes(s));
    const meta = SAT_TINH_META_VN[satTinh];

    if (biBatBoi.length > 0) {
      results.push({
        satTinhTen: satTinh,
        biBatBoi,
        ketQua: "giam_nhe",
        luanVan: `${satTinh} được áp chế bởi ${biBatBoi.join(", ")}. Thay đổi tư duy và kiến thức giúp giảm bớt ${satTinh === "Địa Không" ? "sự bùng nổ bộc phát, ngôn từ quá khích" : "dã tâm ngầm và thủ đoạn nguy hiểm"}. Hung tính giảm đáng kể.`,
      });
    } else {
      results.push({
        satTinhTen: satTinh,
        biBatBoi: [],
        ketQua: "khong_bi_che",
        luanVan:
          satTinh === "Địa Không"
            ? "Địa Không không bị chế. Đương số dễ có tính bộc phát, nói to hơn làm, hay dọa nạt mà không có thực chất. Cần kiểm soát lời nói."
            : "Địa Kiếp không bị chế. NGUY HIỂM: dã tâm ngầm, thủ đoạn nham hiểm có thể phát tác. Nếu ở cung Mệnh: đây là người khó lường, mỉm cười nhưng tính toán bên trong.",
      });
    }
  }

  return results;
}

// --- CÁC MẪU VĂN BẢN LUẬN ĐOÁN (EXPLAIN TEMPLATES) ---

export const GIAI_NGHIA_TEMPLATES_THAI_TUE = {
  // Mẫu 1: Thái Tuế thủ Mệnh/Quan
  thaiTueThuMenhQuan: (cungTen: string) =>
    `
Đương số có sao Thái Tuế tọa thủ tại cung ${cungTen}. Xét về nhân sinh quan, đây là mẫu người ưa lý luận, thích khám phá, có tư duy sắc bén, hành văn khúc chiết và lời nói vô cùng nặng ký, có sức thuyết phục cao. Tuy nhiên, nhược điểm cốt lõi là bản tính khá bảo thủ, lầm lỳ, bướng bỉnh và lòng tự ái cực kỳ cao, luôn đòi hỏi sự tôn trọng, cung kính từ người khác. Rất phù hợp định hướng vào các ngành nghề nghiêm khắc, dùng ngôn từ làm vũ khí như Luật sư, Kiểm sát, Pháp chế, Sư phạm hoặc Chính trị.
`.trim(),

  // Mẫu 2: Tam hợp Thái Tuế - Bạch Hổ - Quan Phù (tài lộc)
  tamHopThaiTueBachHoQuanPhu: () =>
    `
Lá số có cung Mệnh nằm trong tam hợp thế vững Thái Tuế - Bạch Hổ - Quan Phù. Về phương diện kinh tế, đương số là người kiếm tiền giỏi và có tư duy quản lý tài chính vô cùng thông minh, chặt chẽ, chi tiêu thực tế theo hướng "ăn chắc mặc bền". Cách cục này không mang tính chất kiếm tiền bùng nổ, ồ ạt kiểu may rủi (vốn thuộc về Không Kiếp, Linh Hỏa hay Sát Phá Tham). Đặc biệt lưu ý: Nếu Thái Tuế nhập riêng về cung Tài Bạch, đương số có xu hướng chi tiêu vô cùng bủn xỉn, tính toán quá mức và quá chặt chẽ.
`.trim(),

  // Mẫu 3: Luận hạn Lưu Thái Tuế
  luuThaiTueBienDong: (chiNam: string, tenCung: string) =>
    `
Vào năm hạn, Lưu Thái Tuế chính thức trùng phùng và nhập vào cung ${tenCung} nguyên cục trên lá số. Đây sẽ là vùng tâm điểm gánh chịu những biến chuyển, dịch chuyển hoặc thay đổi lớn nhất trong năm liên quan đến cung vị này. Đương số cần đặc biệt kiềm chế cảm xúc và lời nói, bởi Lưu Thái Tuế đi đến đâu rất dễ kích hoạt các cuộc tranh chấp, bất đồng quan điểm hoặc xích mích tại phương diện đó. Tính chất biến động cát hay hung sẽ do hệ thống các sao đồng cung tại đây quyết định.
`.trim(),

  // Mẫu 4: Thái Tuế vs Tuế Phá — nhân tướng
  nhanTuongThaiTueTuePha: (coThaiTue: boolean) =>
    coThaiTue
      ? `Xét về nhân tướng học ngoại hình theo vòng Nhân: Đương số có sao Thái Tuế thủ Mệnh, thông thường sở hữu cấu trúc hàm răng khá đều, kín và đẹp — biểu hiện của bản tính xây dựng, kiên định và có chiều sâu nội tâm.`
      : `Xét về nhân tướng học ngoại hình theo vòng Nhân: Đương số có sao Tuế Phá tọa thủ Mệnh (thế đối xung nghịch cảnh với Thái Tuế), thường có cấu trúc răng khá xấu hoặc lộ, đi kèm với tâm lý thích phản kháng, hay nói ngược hoặc đi ngược lại với xu thế chung của đám đông.`,
} as const;
