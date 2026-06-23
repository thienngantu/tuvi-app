// src/lib/tuvi-engine/ziwei/dung-than-v2.ts
// ====================================================================
// DỤNG THẦN BẮC PHÁI (TỨ HÓA V2) — Calculator thuần (Tầng 1)
//
// Input:  12 cung đã an sao (palaces) + Phi Hóa (phiHoa) + gender + chủ đề
// Output: Cung Thể, Dụng Thần chính/phụ (sao + khí + vị trí), Tự Hóa, Cát Hung
//
// Nguyên lý Dụng Thần Bắc Phái (V2):
//   1. Xác định cung Thể (thay đổi theo chủ đề hỏi).
//   2. Dụng Thần chính bản mệnh luôn là Tứ Hóa năm sinh, phân theo giới tính sao:
//      - Nam giới chọn Nam tinh (Cơ, Dương, Đồng, Phủ, Tham, Lương, Sát, Xương, Phụ).
//      - Nữ giới chọn Nữ tinh (Tử, Vũ, Phá, Âm, Cự, Khúc, Bật).
//      - Liêm Trinh: Hóa Lộc là Nam nhân, Hóa Kỵ là Nữ nhân.
//   3. Xét Tự Hóa tại cung Thể:
//      - Ly tâm (tự hóa tại cung): phát tán, giải tỏa, rò rỉ khí.
//      - Hướng tâm (đối cung phi sang): cơ hội/biến động từ bên ngoài.
//   4. Đánh giá Cát Hung dựa vào Ngã Cung vs Tha Cung, Lộc/Kỵ và Tự Hóa.
// ====================================================================

import type { PalaceVN, StarVN } from "./algorithm-vn";
import type { PhiHoaResult, PhiHoaArrow } from "./phi-hoa";
import { NGA_CUNG, STAR_REGISTRY, type NguHanh } from "./star-registry";

// ---- Types ----------------------------------------------------------

export interface DungThanV2Star {
  saoName: string;
  khoaKhi: "Lộc" | "Quyền" | "Khoa" | "Kỵ";
  cungName: string;
  cungIndex: number;
  laNgaCung: boolean;
  source?: string;
}

export interface DungThanV2Result {
  /** Cung Thể (Reference Palace) được chọn theo chủ đề */
  thePalaceName: string;
  thePalaceIndex: number;

  /** Dụng thần chính (Bản mệnh): Sao + Khí (Tứ Hóa) + Vị trí cung */
  dungThanChinh: DungThanV2Star;

  /** Danh sách Dụng thần phụ: các sao/khí liên đới */
  dungThanPhu: DungThanV2Star[];

  /** Các thông số về Tự Hóa tại cung Thể */
  tuHoaTaiThe: {
    coLyTam: boolean;
    coHuongTam: boolean;
    chiTiet: string[];
  };

  /** Cát hung nhận định tổng quan */
  catHung: {
    trangThai: "Cát" | "Hung" | "Bình" | "Phức tạp";
    lyDo: string;
  };

  /** Khuyến nghị cải mệnh theo ngũ hành của sao Dụng Thần chính */
  caiMenh?: CaiMenhRecommendation;

  /** Luận đoán chi tiết */
  luanDoan: string;
}

// ---- Constants ------------------------------------------------------

const THEME_TO_PALACE_NAME: Record<string, string> = {
  ban_menh: "Mệnh Cung",
  hon_nhan: "Phu Thê Cung",
  su_nghiep: "Quan Lộc Cung",
  tai_van: "Tài Bạch Cung",
  suc_khoe: "Tật Ách Cung",
  dien_trach: "Điền Trạch Cung",
  tu_tuc: "Tử Tức Cung",
  phu_mau: "Phụ Mẫu Cung",
  huynh_de: "Huynh Đệ Cung",
  no_boc: "Nô Bộc Cung",
  thien_di: "Thiên Di Cung",
  phuc_duc: "Phúc Đức Cung",
};

const THEME_LABELS: Record<string, string> = {
  ban_menh: "Bản mệnh / Tổng quan",
  hon_nhan: "Hôn nhân / Tình cảm",
  su_nghiep: "Sự nghiệp / Công danh",
  tai_van: "Tài vận / Tiền bạc",
  suc_khoe: "Sức khỏe / Tai ách",
  dien_trach: "Điền trạch / Nhà đất",
  tu_tuc: "Tử tức / Con cái",
  phu_mau: "Phụ mẫu / Cha mẹ",
  huynh_de: "Huynh đệ / Anh em",
  no_boc: "Nô bộc / Bạn bè / Đối tác",
  thien_di: "Thiên di / Xuất hành",
  phuc_duc: "Phúc đức / Tâm linh",
};

// ---- Helpers --------------------------------------------------------

function cleanPalaceName(name: string): string {
  return name.replace(/ Cung$/, "").trim();
}

function getStarGender(starName: string, sihuaType?: "Lộc" | "Quyền" | "Khoa" | "Kỵ"): "nam" | "nu" | null {
  if (starName === "Liêm Trinh") {
    if (sihuaType === "Lộc") return "nam";
    if (sihuaType === "Kỵ") return "nu";
    return "nu"; // Default
  }
  const meta = STAR_REGISTRY[starName];
  return meta?.gioiTinh ?? null;
}

function mapSihuaName(sihuaStr?: string): "Lộc" | "Quyền" | "Khoa" | "Kỵ" | null {
  if (!sihuaStr) return null;
  if (sihuaStr.includes("Lộc")) return "Lộc";
  if (sihuaStr.includes("Quyền")) return "Quyền";
  if (sihuaStr.includes("Khoa")) return "Khoa";
  if (sihuaStr.includes("Kỵ")) return "Kỵ";
  return null;
}

function extractBirthSihuaStars(palaces: PalaceVN[]): DungThanV2Star[] {
  const list: DungThanV2Star[] = [];
  for (let i = 0; i < palaces.length; i++) {
    const p = palaces[i]!;
    const allStars = [...p.majorStars, ...p.minorStars, ...p.adjectiveStars];
    for (const s of allStars) {
      const khoaKhi = mapSihuaName(s.sihua);
      if (khoaKhi) {
        list.push({
          saoName: s.name,
          khoaKhi,
          cungName: p.name,
          cungIndex: i,
          laNgaCung: NGA_CUNG.has(cleanPalaceName(p.name)),
        });
      }
    }
  }
  return list;
}

// ---- Bảng khuyến nghị cải mệnh theo hành ----------------------------

export interface CaiMenhRecommendation {
  mauSac: string[];
  huong: string;
  ngheNghiep: string[];
  thucPham: string[];
  soMayMan: number[];
  vatPhamPhongThuy: string[];
}

const CAI_MENH_DATA: Record<NguHanh, CaiMenhRecommendation> = {
  Kim: {
    mauSac: ["Trắng", "Bạc", "Xám nhạt", "Ánh kim"],
    huong: "Tây",
    ngheNghiep: ["Ngân hàng", "Tài chính", "Kim hoàn", "Cơ khí", "Công nghệ cao", "Luật sư"],
    thucPham: ["Thực phẩm màu trắng", "Củ cải", "Nấm", "Hành tây", "Phổi/phế (bổ Kim)"],
    soMayMan: [4, 9, 14, 49],
    vatPhamPhongThuy: ["Chuông gió kim loại", "Tượng đồng", "Đồng hồ kim loại", "Trang sức vàng/bạc"],
  },
  Mộc: {
    mauSac: ["Xanh lá", "Xanh ngọc", "Lục bảo"],
    huong: "Đông",
    ngheNghiep: ["Giáo dục", "Y tế", "Nông nghiệp", "Thời trang", "Xuất bản", "Thiết kế"],
    thucPham: ["Rau xanh", "Trái cây tươi", "Đậu xanh", "Trà xanh", "Gan (bổ Mộc)"],
    soMayMan: [3, 8, 13, 38],
    vatPhamPhongThuy: ["Cây xanh trong nhà", "Tranh phong cảnh", "Đồ gỗ tự nhiên", "Sách"],
  },
  Thủy: {
    mauSac: ["Đen", "Xanh dương đậm", "Tím than"],
    huong: "Bắc",
    ngheNghiep: ["Thương mại", "Vận tải", "Du lịch", "Truyền thông", "Logistics", "Hải sản"],
    thucPham: ["Hải sản", "Đậu đen", "Mè đen", "Nước dừa", "Thận (bổ Thủy)"],
    soMayMan: [1, 6, 16, 61],
    vatPhamPhongThuy: ["Bể cá", "Đài phun nước mini", "Tranh sông nước", "Đá obsidian"],
  },
  Hỏa: {
    mauSac: ["Đỏ", "Cam", "Hồng", "Tím"],
    huong: "Nam",
    ngheNghiep: ["Năng lượng", "Ẩm thực", "Giải trí", "Marketing", "Điện tử", "Thẩm mỹ"],
    thucPham: ["Ớt", "Gừng", "Nghệ", "Cà chua", "Tim (bổ Hỏa)", "Thực phẩm nóng"],
    soMayMan: [2, 7, 27, 72],
    vatPhamPhongThuy: ["Đèn pha lê", "Nến thơm", "Tranh mặt trời", "Đá ruby/garnet"],
  },
  Thổ: {
    mauSac: ["Vàng", "Nâu", "Be", "Cam đất"],
    huong: "Trung tâm (hoặc Đông Bắc / Tây Nam)",
    ngheNghiep: ["Bất động sản", "Xây dựng", "Nông nghiệp", "Khai khoáng", "Bảo hiểm", "Kế toán"],
    thucPham: ["Ngũ cốc", "Khoai lang", "Bí đỏ", "Mật ong", "Dạ dày/tỳ (bổ Thổ)"],
    soMayMan: [5, 10, 15, 50],
    vatPhamPhongThuy: ["Đá thạch anh vàng", "Gốm sứ", "Tượng đất nung", "Tinh thể citrine"],
  },
};

// ---- Calculator chính -----------------------------------------------

/**
 * Tính toán Dụng Thần Bắc Phái (V2) theo từng chủ đề hỏi.
 *
 * @param palaces - Mảng 12 cung đã an sao đầy đủ
 * @param phiHoa - Kết quả Phi Hóa Can Cung
 * @param gender - Giới tính đương số ("male" | "female")
 * @param chuDe - Chủ đề cần xem ("ban_menh" | "hon_nhan" | "su_nghiep" | ...)
 */
export function calculateDungThanV2(
  palaces: PalaceVN[],
  phiHoa: PhiHoaResult,
  gender: "male" | "female",
  chuDe: string = "ban_menh",
): DungThanV2Result {
  // 1. Xác định cung Thể
  const targetPalaceName = THEME_TO_PALACE_NAME[chuDe] ?? "Mệnh Cung";
  let thePalaceIndex = palaces.findIndex((p) => p.name === targetPalaceName);
  if (thePalaceIndex === -1) {
    thePalaceIndex = palaces.findIndex((p) => p.name.startsWith(targetPalaceName.replace(" Cung", ""))) ?? 0;
  }
  const thePalace = palaces[thePalaceIndex]!;

  // 2. Tìm tất cả các sao có Tứ Hóa năm sinh (Niên Hóa)
  const birthSihuaStars = extractBirthSihuaStars(palaces);

  // 3. Phân lọc Dụng Thần chính theo giới tính
  const targetGender = gender === "male" ? "nam" : "nu";
  const matchingCandidates = birthSihuaStars.filter((s) => {
    const starG = getStarGender(s.saoName, s.khoaKhi);
    return starG === targetGender;
  });

  // Thứ tự ưu tiên chọn Dụng Thần chính của bản thân: Kỵ (D) > Lộc (A) > Quyền (B) > Khoa (C)
  const priorityMap = { Kỵ: 4, Lộc: 3, Quyền: 2, Khoa: 1 };
  matchingCandidates.sort((a, b) => priorityMap[b.khoaKhi] - priorityMap[a.khoaKhi]);

  const primary: DungThanV2Star =
    matchingCandidates.length > 0
      ? matchingCandidates[0]!
      : (birthSihuaStars.find((s) => s.khoaKhi === "Kỵ") ??
        birthSihuaStars[0] ?? {
          saoName: "Tham Lang",
          khoaKhi: "Kỵ",
          cungName: "Mệnh Cung",
          cungIndex: 0,
          laNgaCung: true,
        });

  // 4. Xác định Dụng Thần Phụ
  const secondaries: DungThanV2Star[] = [];

  // (a) Các sao Niên Hóa trùng giới tính còn lại
  for (let idx = 1; idx < matchingCandidates.length; idx++) {
    const s = matchingCandidates[idx]!;
    secondaries.push({
      ...s,
      source: "Tứ Hóa năm sinh (Đồng giới tính)",
    });
  }

  // (b) Tự Hóa tại cung Thể
  const tuHoaTaiTheList = phiHoa.tuHoaList.filter((a) => a.fromPalaceIndex === thePalaceIndex);
  for (const a of tuHoaTaiTheList) {
    if (a.starName !== primary.saoName) {
      secondaries.push({
        saoName: a.starName,
        khoaKhi: a.hoaType,
        cungName: a.fromPalaceName,
        cungIndex: a.fromPalaceIndex,
        laNgaCung: NGA_CUNG.has(cleanPalaceName(a.fromPalaceName)),
        source: "Tự Hóa Ly Tâm tại cung Thể",
      });
    }
  }

  // (c) Tự Hóa tại cung Mệnh (nếu khác cung Thể)
  const menhIndex = palaces.findIndex((p) => cleanPalaceName(p.name) === "Mệnh");
  if (menhIndex !== -1 && menhIndex !== thePalaceIndex) {
    const tuHoaTaiMenh = phiHoa.tuHoaList.filter((a) => a.fromPalaceIndex === menhIndex);
    for (const a of tuHoaTaiMenh) {
      secondaries.push({
        saoName: a.starName,
        khoaKhi: a.hoaType,
        cungName: a.fromPalaceName,
        cungIndex: a.fromPalaceIndex,
        laNgaCung: true,
        source: "Tự Hóa Ly Tâm tại Mệnh Cung",
      });
    }
  }

  // (d) Phi Hóa từ Lai Nhân Cung vào cung Thể
  const laiNhanPalace = palaces.find((p) => p.isOriginalPalace);
  if (laiNhanPalace) {
    const laiNhanArrows = phiHoa.byFromPalace[laiNhanPalace.index] ?? [];
    const toTheArrows = laiNhanArrows.filter((a) => a.toPalaceIndex === thePalaceIndex);
    for (const a of toTheArrows) {
      if (!secondaries.some((s) => s.saoName === a.starName && s.khoaKhi === a.hoaType)) {
        secondaries.push({
          saoName: a.starName,
          khoaKhi: a.hoaType,
          cungName: a.toPalaceName,
          cungIndex: a.toPalaceIndex,
          laNgaCung: NGA_CUNG.has(cleanPalaceName(a.toPalaceName)),
          source: "Phi Hóa từ Lai Nhân Cung vào cung Thể",
        });
      }
    }
  }

  // (e) Tượng người phối ngẫu/đối tác cho chủ đề Hôn nhân (sao nghịch giới tính tại Phu Thê)
  if (chuDe === "hon_nhan") {
    const partnerGender = targetGender === "nam" ? "nu" : "nam";
    const phuThePalace = palaces[thePalaceIndex];
    if (phuThePalace) {
      const ptStars = [...phuThePalace.majorStars, ...phuThePalace.minorStars, ...phuThePalace.adjectiveStars];
      for (const s of ptStars) {
        const starG = getStarGender(s.name, (s.sihua ? mapSihuaName(s.sihua) : undefined) ?? undefined);
        if (starG === partnerGender) {
          secondaries.push({
            saoName: s.name,
            khoaKhi: s.sihua ? mapSihuaName(s.sihua)! : "Lộc",
            cungName: phuThePalace.name,
            cungIndex: thePalaceIndex,
            laNgaCung: NGA_CUNG.has(cleanPalaceName(phuThePalace.name)),
            source: `Tượng người phối ngẫu (${partnerGender === "nam" ? "Nam tinh" : "Nữ tinh"}) tại Phu Thê`,
          });
        }
      }
    }
  }

  // 5. Khảo sát Tự Hóa tại cung Thể
  const oppositeIndex = (thePalaceIndex + 6) % 12;
  const huongTamArrows = phiHoa.arrows.filter(
    (a) => a.fromPalaceIndex === oppositeIndex && a.toPalaceIndex === thePalaceIndex,
  );

  const coLyTam = tuHoaTaiTheList.length > 0;
  const coHuongTam = huongTamArrows.length > 0;

  const chiTietTuHoa: string[] = [];
  for (const a of tuHoaTaiTheList) {
    chiTietTuHoa.push(`${a.fromPalaceName} tự hóa Ly Tâm ${a.hoaType} qua sao ${a.starName}`);
  }
  for (const a of huongTamArrows) {
    chiTietTuHoa.push(
      `Nhận khí Hướng Tâm ${a.hoaType} từ cung đối ${a.fromPalaceName} chiếu sang qua sao ${a.starName}`,
    );
  }

  // 6. Đánh giá Cát Hung
  let trangThai: "Cát" | "Hung" | "Bình" | "Phức tạp" = "Bình";
  let lyDo = "";

  const inNgaCung = primary.laNgaCung;
  const lyTamKyp = tuHoaTaiTheList.some((a) => a.hoaType === "Kỵ");
  const lyTamLoc = tuHoaTaiTheList.some((a) => a.hoaType === "Lộc");

  if (inNgaCung) {
    trangThai = "Cát";
    lyDo = `Dụng Thần chính (${primary.saoName} Hóa ${primary.khoaKhi}) tọa tại Ngã Cung (${primary.cungName}), dòng khí tốt được thu về giữ vững cho bản thân đương số.`;
    if (lyTamLoc) {
      trangThai = "Phức tạp";
      lyDo += ` Tuy nhiên cung Thể có Tự Hóa Ly Tâm Lộc gây hiện tượng rò rỉ, phân tán phúc đức hoặc tài lộc tốt.`;
    }
  } else {
    trangThai = "Bình";
    lyDo = `Dụng Thần chính (${primary.saoName} Hóa ${primary.khoaKhi}) tọa tại Tha Cung (${primary.cungName}), cát hung chịu ảnh hưởng nhiều từ bên ngoài và cách đối xử đối đãi xã hội.`;
  }

  if (chuDe === "suc_khoe" && lyTamKyp) {
    trangThai = "Cát";
    lyDo += ` Tuyến Tật Ách có Ly Tâm Tự Hóa Kỵ đại diện cho tượng "bộc phát giải tỏa" bệnh tật, xua tan ám khí xấu tích tụ lâu ngày.`;
  } else if (lyTamKyp && chuDe !== "suc_khoe") {
    trangThai = "Phức tạp";
    lyDo += ` Xuất hiện Tự Hóa Ly Tâm Kỵ tại cung Thể biểu thị áp lực biến động bất ngờ, dễ dẫn đến gián đoạn, hao hụt.`;
  }

  if (coHuongTam) {
    trangThai = (trangThai as string) === "Hung" ? "Phức tạp" : "Cát";
    lyDo += ` Cung đối xung chiếu đưa dòng khí Hướng Tâm vào cung Thể mang lại nhân duyên, quý nhân hỗ trợ hoặc cơ hội từ bên ngoài.`;
  }

  // 7. Tạo bài Luận đoán mẫu Tiếng Việt
  const chuDeLabel = THEME_LABELS[chuDe] ?? chuDe;
  const ngaCungLabel = primary.laNgaCung ? "Ngã Cung" : "Tha Cung";

  let luanDoan = `### Luận đoán Dụng Thần Bắc Phái cho chủ đề: ${chuDeLabel}\n\n`;
  luanDoan += `- **Cung Thể phân tích:** ${thePalace.name} (${thePalace.stemBranch})\n`;
  luanDoan += `- **Dụng Thần bản mệnh chính:** ${primary.saoName} Hóa ${primary.khoaKhi} (cư cung ${primary.cungName} - ${ngaCungLabel})\n`;

  if (secondaries.length > 0) {
    luanDoan += `- **Dụng Thần phụ hỗ trợ:**\n`;
    for (const s of secondaries) {
      luanDoan += `  + ${s.saoName} Hóa ${s.khoaKhi} (tại ${s.cungName}) - *Nguồn gốc: ${s.source}*\n`;
    }
  } else {
    luanDoan += `- **Dụng Thần phụ:** Không phát hiện thêm biến động phụ tinh đáng kể.\n`;
  }

  luanDoan += `\n**1. Phân tích Dòng Khí và Tự Hóa tại cung Thể:**\n`;
  if (chiTietTuHoa.length > 0) {
    for (const ct of chiTietTuHoa) {
      luanDoan += `- ${ct}\n`;
    }
  } else {
    luanDoan += `- Cung Thể ổn định, không ghi nhận các hiện tượng Tự Hóa Ly Tâm hay Hướng Tâm đáng kể. Dòng khí chảy theo chu trình phẳng lặng.\n`;
  }

  luanDoan += `\n**2. Kết luận Cát Hung & Lời khuyên Hành động:**\n`;
  luanDoan += `Trạng thái: **${trangThai.toUpperCase()}**\n`;
  luanDoan += `${lyDo}\n\n`;

  if (trangThai === "Cát") {
    luanDoan += `*Lời khuyên:* Tận dụng tối đa Dụng Thần đóng tại Ngã Cung để mở rộng và củng cố thành quả. Mọi nỗ lực tự thân đều mang lại kết quả tốt.`;
  } else if (trangThai === "Phức tạp" || (trangThai as string) === "Hung") {
    luanDoan += `*Lời khuyên:* Cần bình tĩnh trước những biến động bất ngờ (đặc biệt khi có Tự Hóa Ly Tâm). Hãy tìm sự cân bằng qua việc bồi bổ thêm ngũ hành bổ trợ và hợp tác khôn ngoan với những cung vị đắc địa.`;
  } else {
    luanDoan += `*Lời khuyên:* Nên thiết lập mối liên hệ hài hòa với bên ngoài vì Dụng Thần nằm ở Tha Cung. Hợp tác, lắng nghe và chia sẻ lợi ích sẽ mang lại bình an.`;
  }

  const dungThanHanh = STAR_REGISTRY[primary.saoName]?.hanh;

  return {
    thePalaceName: thePalace.name,
    thePalaceIndex,
    dungThanChinh: primary,
    dungThanPhu: secondaries,
    tuHoaTaiThe: {
      coLyTam,
      coHuongTam,
      chiTiet: chiTietTuHoa,
    },
    catHung: {
      trangThai,
      lyDo,
    },
    caiMenh: dungThanHanh ? CAI_MENH_DATA[dungThanHanh] : undefined,
    luanDoan,
  };
}
