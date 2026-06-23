// src/lib/tuvi-engine/ziwei/explain.ts
// Module GIẢI THÍCH TỪNG BƯỚC AN SAO — minh bạch logic, không phải hộp đen.
// Đầu vào: ZiweiChartVN đã sinh bởi engine; đầu ra: chuỗi các "bước" với
// tiêu đề, lý do, kết quả — để người dùng đối chiếu với "An Sao Tử Vi" của
// cụ Vân Đằng Thái Thứ Lang.

import type { ZiweiChartVN } from "./algorithm-vn";

export interface ExplainStep {
  id: string;
  title: string;
  detail: string;
  result: string;
}

export function explainAnSao(chart: ZiweiChartVN): ExplainStep[] {
  const steps: ExplainStep[] = [];

  // 1. Đổi lịch dương → âm + Bát Tự
  steps.push({
    id: "1-lich",
    title: "1. Đổi lịch dương sang âm lịch & lập Tứ Trụ",
    detail:
      "Dùng thuật toán Jean Meeus (Hồ Ngọc Đức) đổi ngày dương sang âm theo múi giờ +7. " +
      "Từ năm/tháng/ngày/giờ âm xác định Bát Tự (Tứ Trụ) gồm 4 cặp Can–Chi của năm, tháng, ngày, giờ.",
    result: `${chart.solarDate} (Dương) → ${chart.lunarDateVN}. Bát Tự: ${chart.chineseDateVN}.`,
  });

  // 2. An 12 cung theo địa chi
  const menhCung = chart.palaces[chart.mingGongIndex];
  steps.push({
    id: "2-12cung",
    title: "2. An 12 cung trên 12 địa chi",
    detail:
      "12 cung Tử Vi (Mệnh, Phụ Mẫu, Phúc Đức, Điền Trạch, Quan Lộc, Nô Bộc, " +
      "Thiên Di, Tật Ách, Tài Bạch, Tử Tức, Phu Thê, Huynh Đệ) được an ngược chiều kim đồng hồ " +
      "quanh 12 địa chi. Vị trí Mệnh Cung được xác định từ tháng sinh âm và giờ sinh theo công thức cổ.",
    result: `Mệnh Cung an tại địa chi ${menhCung?.branch ?? "?"} (Can ${menhCung?.stem ?? "?"}).`,
  });

  // 3. Định Cục số (Ngũ Hành Cục)
  steps.push({
    id: "3-cuc",
    title: "3. Định Cục Số (Ngũ Hành Cục)",
    detail:
      "Cục Số được suy từ Can năm sinh (nạp âm) và địa chi của cung Mệnh. Cục Số quyết định " +
      "vị trí an sao Tử Vi (sao chủ tinh). Có 5 cục: Thủy Nhị Cục, Mộc Tam Cục, Kim Tứ Cục, " +
      "Thổ Ngũ Cục, Hỏa Lục Cục — số đi kèm cho biết cứ mấy ngày tăng 1 độ Tử Vi.",
    result: `Cục: ${chart.fiveElementsClass}.`,
  });

  // 4. An sao Tử Vi và 14 chính tinh
  const chinhTinhAtMenh = menhCung?.majorStars.map(s => s.name).join(", ") || "Vô chính diệu";
  steps.push({
    id: "4-tuvi",
    title: "4. An sao Tử Vi & 14 Chính Tinh",
    detail:
      "Từ ngày sinh âm và Cục Số, dùng bảng tra để định vị trí sao Tử Vi. Sau khi an Tử Vi, " +
      "5 sao thuộc chòm Tử Vi (Thiên Cơ, Thái Dương, Vũ Khúc, Thiên Đồng, Liêm Trinh) và " +
      "8 sao thuộc chòm Thiên Phủ (Thái Âm, Tham Lang, Cự Môn, Thiên Tướng, Thiên Lương, " +
      "Thất Sát, Phá Quân) được an theo công thức cố định, đối xứng qua trục Dần–Thân.",
    result: `Chính tinh tại Mệnh: ${chinhTinhAtMenh}.`,
  });

  // 5. An phụ tinh
  const phuTinhAtMenh = menhCung?.minorStars.map(s => s.name).join(", ") || "—";
  steps.push({
    id: "5-phu",
    title: "5. An các phụ tinh (Lục Cát, Lục Sát, Tả Hữu, Xương Khúc…)",
    detail:
      "Sáu Cát tinh (Tả Phụ, Hữu Bật, Văn Xương, Văn Khúc, Thiên Khôi, Thiên Việt) " +
      "an theo tháng sinh và giờ sinh. Sáu Sát tinh (Kình Dương, Đà La, Hỏa Tinh, " +
      "Linh Tinh, Địa Không, Địa Kiếp) an theo Can năm và giờ sinh. Lộc Tồn, Thiên Mã " +
      "an theo Can năm và Chi năm tương ứng.",
    result: `Phụ tinh tại Mệnh: ${phuTinhAtMenh}.`,
  });

  // 6. An Tứ Hóa theo Can năm
  steps.push({
    id: "6-tuhoa",
    title: "6. An Tứ Hóa theo Can năm sinh",
    detail:
      "Mỗi Thiên Can hóa 4 sao chính tinh thành Hóa Lộc (phúc khí), Hóa Quyền (quyền uy), " +
      "Hóa Khoa (danh tiếng), Hóa Kỵ (trở ngại). Tứ Hóa giáng vào cung nào sẽ chi phối " +
      "tính chất của cung đó.",
    result: `Lộc–${chart.sihua.loc}, Quyền–${chart.sihua.quyen}, Khoa–${chart.sihua.khoa}, Kỵ–${chart.sihua.ky}.`,
  });

  // 7. Mệnh Chủ – Thân Chủ
  steps.push({
    id: "7-menh-than",
    title: "7. Định Mệnh Chủ & Thân Chủ",
    detail:
      "Mệnh Chủ là sao chủ về Mệnh, xác định theo địa chi cung Mệnh. Thân Chủ là sao chủ về " +
      "Thân, xác định theo địa chi năm sinh. Hai sao này định hướng tính cách chung cả đời.",
    result: `Mệnh Chủ: ${chart.soul} · Thân Chủ: ${chart.body}.`,
  });

  // 8. Đại hạn
  const firstDecadal = chart.decadals[0];
  steps.push({
    id: "8-daihan",
    title: "8. Khởi Đại Hạn (10 năm/cung)",
    detail:
      "Đại Hạn đầu tiên khởi tại Mệnh Cung, chiều thuận hay nghịch tuỳ Âm/Dương của Nam/Nữ " +
      "(Dương Nam – Âm Nữ đi thuận; Âm Nam – Dương Nữ đi nghịch). Mỗi cung quản 10 năm.",
    result: firstDecadal
      ? `Đại Hạn 1: ${firstDecadal.range[0]}–${firstDecadal.range[1]} tuổi tại ${firstDecadal.palace}.`
      : "—",
  });

  return steps;
}

export default { explainAnSao };
