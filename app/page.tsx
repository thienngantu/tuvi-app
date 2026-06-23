"use client";
import { useState } from "react";

const GIO_SINH = [
  { label: "Tý (23:00–01:00)", value: 0 },
  { label: "Sửu (01:00–03:00)", value: 1 },
  { label: "Dần (03:00–05:00)", value: 2 },
  { label: "Mão (05:00–07:00)", value: 3 },
  { label: "Thìn (07:00–09:00)", value: 4 },
  { label: "Tỵ (09:00–11:00)", value: 5 },
  { label: "Ngọ (11:00–13:00)", value: 6 },
  { label: "Mùi (13:00–15:00)", value: 7 },
  { label: "Thân (15:00–17:00)", value: 8 },
  { label: "Dậu (17:00–19:00)", value: 9 },
  { label: "Tuất (19:00–21:00)", value: 10 },
  { label: "Hợi (21:00–23:00)", value: 11 },
];

const GRID_BY_BRANCH: Record<number, [number, number]> = {
  5: [0,0], 6: [0,1], 7: [0,2], 8: [0,3],
  4: [1,0],                     9: [1,3],
  3: [2,0],                    10: [2,3],
  2: [3,0], 1: [3,1], 0: [3,2],11: [3,3],
};

function hanhColor(hanh?: string): string {
  if (hanh === "Hỏa") return "#cc0000";
  if (hanh === "Mộc") return "#006400";
  if (hanh === "Kim") return "#888";
  if (hanh === "Thủy") return "#00008B";
  if (hanh === "Thổ") return "#B8860B";
  return "#333";
}

function isCat(star: any): boolean { return star.phanLoai === "cat"; }
function isTuan(star: any): boolean { return star.name === "Tuần" || star.nameCN === "旬"; }
function isTriet(star: any): boolean { return star.name === "Triệt" || star.nameCN === "截"; }
function isTuanTriet(star: any): boolean { return isTuan(star) || isTriet(star); }
// Danh sách sao ẩn khỏi lá số
const HIDDEN_STARS = new Set([
  "Không Vong",
  "空亡", // tên CN
]);

function isHidden(star: any): boolean {
  return HIDDEN_STARS.has(star.name) || HIDDEN_STARS.has(star.nameCN);
}

function StarLabel({ star }: { star: any }) {
  if (isTuan(star)) return (
    <div style={{ display:"inline-block", background:"#8B0000", color:"#fff", fontWeight:"bold", fontSize:10, padding:"1px 6px", borderRadius:3, marginTop:2 }}>Tuần</div>
  );
  if (isTriet(star)) return (
    <div style={{ display:"inline-block", background:"#fff", color:"#4A235A", fontWeight:"bold", fontSize:10, padding:"1px 6px", borderRadius:3, border:"1px solid #4A235A", marginTop:2 }}>Triệt</div>
  );
  return <div style={{ ...styles.sao, color: hanhColor(star.hanh) }}>{star.name}</div>;
}

export default function Home() {
  const [form, setForm] = useState({
    day: 15, month: 3, year: 1985,
    timeIndex: 4, gender: "male",
    namXem: new Date().getFullYear(),
    calendarType: "solar" as "solar" | "lunar",
    isLeapMonth: false,
  });
  const [chart, setChart] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function lapLaSo() {
    setLoading(true); setError("");
    try {
      const params = new URLSearchParams({
        year: String(form.year),
        month: String(form.month),
        day: String(form.day),
        timeIndex: String(form.timeIndex),
        gender: form.gender,
        namXem: String(form.namXem),
        calendarType: form.calendarType,
        isLeapMonth: String(form.isLeapMonth),
      });
      const res = await fetch(`/api/lapla?${params}`);
      const json = await res.json();
      if (json.success) setChart(json.data);
      else setError("Lỗi: " + json.error);
    } catch { setError("Không kết nối được API."); }
    setLoading(false);
  }

  const byBranch: Record<number, any> = {};
  if (chart?.palaces) for (const p of chart.palaces) byBranch[p.branchIndex] = p;

  function Palace({ palace }: { palace: any }) {
    if (!palace) return <div style={styles.cung} />;
    const isMenh = palace.nameCN === "命宫" || palace.nameCN === "命";
    const isThan = palace.isBodyPalace;
    const allMinor = [...(palace.minorStars ?? []), ...(palace.adjectiveStars ?? [])];
    const normalStars = allMinor.filter((s: any) => !isTuanTriet(s) && s.name !== "Không Vong"));
    const tuanTrietStars = allMinor.filter((s: any) => isTuanTriet(s));
    const catStars = normalStars.filter(isCat);
    const hungStars = normalStars.filter((s: any) => !isCat(s));

    return (
      <div style={{ ...styles.cung, ...(isMenh ? styles.cungMenh : {}) }}>
        <div style={styles.cungHeader}>
          <span style={styles.canChi}>{palace.stemBranch}</span>
          <span style={styles.daiHan}>{palace.decadalRange ? `${palace.decadalRange[0]}` : ""}</span>
        </div>
        <div style={styles.cungName}>
          {palace.name.replace(" Cung", "")}
          {isMenh && <span style={styles.badge}>MỆNH</span>}
          {isThan && !isMenh && <span style={styles.badge}>THÂN</span>}
        </div>
        {(palace.majorStars ?? []).map((s: any, i: number) => (
          <div key={i} style={{ ...styles.chinhTinh, color: hanhColor(s.hanh) }}>
            {s.name}{s.brightness ? `(${s.brightness[0]})` : ""}
          </div>
        ))}
        <hr style={styles.hr} />
        <div style={styles.saoCols}>
          <div style={styles.colCat}>
            <div style={styles.colLabel}>Cát ◀</div>
            {catStars.map((s: any, i: number) => (
              <div key={i} style={{ ...styles.sao, color: hanhColor(s.hanh) }}>{s.name}</div>
            ))}
          </div>
          <div style={styles.colHung}>
            <div style={styles.colLabel}>▶ Hung</div>
            {hungStars.map((s: any, i: number) => (
              <div key={i} style={{ ...styles.sao, color: hanhColor(s.hanh) }}>{s.name}</div>
            ))}
            {tuanTrietStars.map((s: any, i: number) => (
              <StarLabel key={`tt-${i}`} star={s} />
            ))}
          </div>
        </div>
        {palace.changsheng12 && <div style={styles.truongSinh}>{palace.changsheng12}</div>}
      </div>
    );
  }

  const isLunar = form.calendarType === "lunar";

  return (
    <div style={styles.wrap}>
      <div style={styles.titleBar}>
        TỬ VI PHONG THỦY TRIẾT HỌC PHÁI - THIÊN NGÂN TỬ · LÁ SỐ TỬ VI
      </div>

      {/* FORM NHẬP */}
      <div style={styles.formWrap}>

        {/* DÒNG 1: Chọn loại lịch */}
        <div style={styles.calRow}>
          <span style={styles.label}>Loại lịch:</span>
          <label style={styles.radioLabel}>
            <input type="radio" name="cal" value="solar"
              checked={form.calendarType === "solar"}
              onChange={() => setForm({ ...form, calendarType: "solar", isLeapMonth: false })}
              style={{ marginRight: 4 }}
            />
            <span style={{
              ...styles.calBadge,
              background: !isLunar ? "#8B6914" : "#e8d5a3",
              color: !isLunar ? "#fff" : "#8B4513",
            }}>☀️ Dương lịch</span>
          </label>
          <label style={styles.radioLabel}>
            <input type="radio" name="cal" value="lunar"
              checked={form.calendarType === "lunar"}
              onChange={() => setForm({ ...form, calendarType: "lunar" })}
              style={{ marginRight: 4 }}
            />
            <span style={{
              ...styles.calBadge,
              background: isLunar ? "#8B6914" : "#e8d5a3",
              color: isLunar ? "#fff" : "#8B4513",
            }}>🌙 Âm lịch</span>
          </label>
          {/* Tháng nhuận — chỉ hiện khi chọn âm lịch */}
          {isLunar && (
            <label style={{ ...styles.radioLabel, marginLeft: 8 }}>
              <input type="checkbox"
                checked={form.isLeapMonth}
                onChange={e => setForm({ ...form, isLeapMonth: e.target.checked })}
                style={{ marginRight: 4 }}
              />
              <span style={{
                ...styles.calBadge,
                background: form.isLeapMonth ? "#c0392b" : "#e8d5a3",
                color: form.isLeapMonth ? "#fff" : "#8B4513",
              }}>Tháng nhuận</span>
            </label>
          )}
        </div>

        {/* DÒNG 2: Ngày tháng năm + giờ + giới tính + năm xem */}
        <div style={styles.formBar}>
          <div style={styles.fieldGroup}>
            <span style={styles.fieldLabel}>{isLunar ? "Ngày ÂL:" : "Ngày DL:"}</span>
            <input style={styles.inp} type="number" value={form.day} min={1} max={30}
              onChange={e => setForm({ ...form, day: +e.target.value })} />
          </div>
          <div style={styles.fieldGroup}>
            <span style={styles.fieldLabel}>{isLunar ? "Tháng ÂL:" : "Tháng DL:"}</span>
            <input style={styles.inp} type="number" value={form.month} min={1} max={12}
              onChange={e => setForm({ ...form, month: +e.target.value })} />
          </div>
          <div style={styles.fieldGroup}>
            <span style={styles.fieldLabel}>Năm:</span>
            <input style={{ ...styles.inp, width: 68 }} type="number" value={form.year}
              onChange={e => setForm({ ...form, year: +e.target.value })} />
          </div>
          <div style={styles.fieldGroup}>
            <span style={styles.fieldLabel}>Giờ sinh:</span>
            <select style={styles.sel} value={form.timeIndex}
              onChange={e => setForm({ ...form, timeIndex: +e.target.value })}>
              {GIO_SINH.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
          </div>
          <div style={styles.fieldGroup}>
            <span style={styles.fieldLabel}>Giới tính:</span>
            <select style={styles.sel} value={form.gender}
              onChange={e => setForm({ ...form, gender: e.target.value })}>
              <option value="male">Nam ♂</option>
              <option value="female">Nữ ♀</option>
            </select>
          </div>
          <div style={styles.fieldGroup}>
            <span style={styles.fieldLabel}>Năm xem:</span>
            <input style={{ ...styles.inp, width: 68 }} type="number" value={form.namXem}
              onChange={e => setForm({ ...form, namXem: +e.target.value })} />
          </div>
          <button style={styles.btn} onClick={lapLaSo} disabled={loading}>
            {loading ? "Đang tính..." : "✦ LẬP LÁ SỐ"}
          </button>
        </div>

        {/* Gợi ý nhỏ */}
        <div style={styles.hint}>
          {isLunar
            ? "🌙 Nhập ngày tháng theo âm lịch. Nếu sinh tháng nhuận hãy tích vào ô Tháng nhuận."
            : "☀️ Nhập ngày tháng theo dương lịch thông thường."}
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {chart && (
        <>
          <div style={styles.grid}>
            {Object.entries(GRID_BY_BRANCH).map(([branchStr, [row, col]]) => {
              const branch = Number(branchStr);
              return (
                <div key={branch} style={{ gridRow: row + 1, gridColumn: col + 1 }}>
                  <Palace palace={byBranch[branch]} />
                </div>
              );
            })}
            <div style={styles.center}>
              <div style={styles.centerTitle}>✦ THIÊN NGÂN TỬ ✦</div>
              <table style={{ fontSize: 10, borderCollapse: "collapse", width: "100%" }}>
                <tbody>
                  <tr><td style={styles.lb}>Năm sinh:</td><td style={styles.vl}>{chart.solarDate}</td></tr>
                  <tr><td style={styles.lb}>Âm lịch:</td><td style={styles.vl}>{chart.lunarDateVN}</td></tr>
                  <tr><td style={styles.lb}>Bát Tự:</td><td style={styles.vl}>{chart.chineseDateVN}</td></tr>
                  <tr><td style={styles.lb}>Giờ sinh:</td><td style={styles.vl}>{chart.shichenName} ({chart.timeRange})</td></tr>
                  <tr><td style={styles.lb}>Giới tính:</td><td style={styles.vl}>{form.gender === "male" ? "♂ Nam" : "♀ Nữ"}</td></tr>
                  <tr><td style={styles.lb}>Âm Dương:</td><td style={styles.vl}>{chart.tinhChat}</td></tr>
                  <tr><td style={styles.lb}>Năm xem:</td><td style={styles.vl}>{form.namXem}</td></tr>
                  <tr><td style={styles.lb}>Mệnh:</td><td style={{ ...styles.vl, fontWeight: "bold" }}>{chart.napAm}</td></tr>
                  <tr><td style={styles.lb}>Cục:</td><td style={styles.vl}>{chart.fiveElementsClass}</td></tr>
                  <tr><td style={styles.lb}>Mệnh chủ:</td><td style={styles.vl}>{chart.soul}</td></tr>
                  <tr><td style={styles.lb}>Thân chủ:</td><td style={styles.vl}>{chart.body}</td></tr>
                  <tr><td style={styles.lb}>Tứ Hóa:</td><td style={styles.vl}>Lộc: {chart.sihua?.loc} · Kỵ: {chart.sihua?.ky}</td></tr>
                  <tr><td colSpan={2} style={{ color: "#cc0000", fontSize: 10, fontWeight: "bold", paddingTop: 4 }}>{chart.cucMenhQuanHe}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style={styles.legend}>
            {(["Hỏa","Mộc","Kim","Thủy","Thổ"] as const).map(h => (
              <span key={h} style={{ fontSize: 10, fontWeight: "bold", color: hanhColor(h) }}>● {h}</span>
            ))}
            <span style={{ fontSize: 10, color: "#fff", background: "#8B0000", padding: "1px 8px", borderRadius: 3, fontWeight: "bold" }}>Tuần</span>
            <span style={{ fontSize: 10, color: "#4A235A", background: "#fff", border: "1px solid #4A235A", padding: "1px 8px", borderRadius: 3, fontWeight: "bold" }}>Triệt</span>
            <span style={{ fontSize: 10, color: "#555" }}>◀ Cát tinh · Hung sát tinh ▶</span>
          </div>
        </>
      )}

      <div style={{ textAlign: "center", fontSize: 9, color: "#888", padding: 4 }}>
        Tử Vi Phong Thủy Triết Học Phái · Thiên Ngân Tử
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { background: "#f5e6c8", border: "2px solid #8B6914", padding: 4, borderRadius: 4, fontFamily: "Arial,sans-serif", maxWidth: "100%" },
  titleBar: { textAlign: "center", background: "#8B6914", color: "#fff", padding: 6, fontSize: 13, fontWeight: "bold", marginBottom: 4, borderRadius: 2 },
  formWrap: { background: "#f0e4c0", border: "1px solid #8B6914", borderRadius: 4, padding: "8px 10px", marginBottom: 4 },
  calRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 8, flexWrap: "wrap" },
  radioLabel: { display: "flex", alignItems: "center", cursor: "pointer" },
  calBadge: { padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: "bold", cursor: "pointer", transition: "all .2s" },
  formBar: { display: "flex", gap: 8, alignItems: "flex-end", flexWrap: "wrap" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: 2 },
  fieldLabel: { fontSize: 10, color: "#8B4513", fontWeight: "bold" },
  label: { fontSize: 10, color: "#8B4513", fontWeight: "bold" },
  hint: { fontSize: 10, color: "#8B4513", marginTop: 6, fontStyle: "italic", opacity: 0.8 },
  inp: { fontSize: 10, padding: "4px 6px", border: "1px solid #8B6914", borderRadius: 3, background: "#fff", color: "#333", width: 52, outline: "none" },
  sel: { fontSize: 10, padding: "4px 6px", border: "1px solid #8B6914", borderRadius: 3, background: "#fff", color: "#333", outline: "none" },
  btn: { background: "#8B6914", color: "#fff", border: "none", padding: "6px 14px", borderRadius: 3, fontSize: 11, fontWeight: "bold", cursor: "pointer", alignSelf: "flex-end" },
  error: { color: "#cc0000", fontSize: 11, textAlign: "center", padding: 4 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gridTemplateRows: "auto auto auto auto", gap: 2 },
  cung: { background: "#f9f0d8", border: "1px solid #8B6914", padding: 4, minHeight: 150, display: "flex", flexDirection: "column", height: "100%" },
  cungMenh: { border: "2px solid #D4AF37" },
  cungHeader: { display: "flex", justifyContent: "space-between", marginBottom: 2 },
  canChi: { fontSize: 9, color: "#555" },
  daiHan: { fontSize: 9, color: "#555" },
  cungName: { fontSize: 11, fontWeight: "bold", color: "#8B4513", textAlign: "center", marginBottom: 1 },
  badge: { fontSize: 9, background: "#8B6914", color: "#fff", padding: "1px 4px", borderRadius: 2, marginLeft: 2 },
  chinhTinh: { fontSize: 11, fontWeight: "bold", textAlign: "center", marginBottom: 1 },
  hr: { border: "none", borderTop: "1px solid #c9a84c", margin: "2px 0" },
  saoCols: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginTop: 3, flex: 1 },
  colCat: { borderRight: "1px dashed #ccc", paddingRight: 3 },
  colHung: { paddingLeft: 3 },
  colLabel: { fontSize: 8, color: "#aaa", marginBottom: 1 },
  sao: { fontSize: 9, display: "block", lineHeight: 1.7 },
  truongSinh: { fontSize: 9, color: "#888", textAlign: "center", marginTop: "auto", paddingTop: 4, borderTop: "1px dashed #c9a84c" },
  center: { gridColumn: "2 / 4", gridRow: "2 / 4", background: "#f0e4c0", border: "1px solid #8B6914", padding: 8, display: "flex", flexDirection: "column", justifyContent: "center" },
  centerTitle: { textAlign: "center", fontSize: 12, fontWeight: "bold", color: "#8B4513", marginBottom: 6, borderBottom: "1px solid #8B6914", paddingBottom: 4 },
  lb: { color: "#8B4513", fontWeight: "bold", fontSize: 10, paddingRight: 4 },
  vl: { color: "#0047AB", fontSize: 10 },
  legend: { display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", alignItems: "center", marginTop: 4, padding: 4, background: "#f0e4c0", borderTop: "1px solid #8B6914" },
};
