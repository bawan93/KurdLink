"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LangDropdown from "../../../components/LangDropdown";

const NAVY = "#1A2B5F";
const GREEN = "#1DB87A";

const UI = {
  ku: {
    title: "نامەکەت شیبکە",
    subtitle: "هەر نامەیەکی فەرمیت لە UK بنێرە — ئێمە بە کوردی ڕوونت دەکەینەوە",
    pasteTab: "دەقی نامەکە بنووسە",
    uploadTab: "وێنە بنێرە / کامێرا",
    placeholder: "دەقی نامەکەت لێرە بنووسە...\n\nبۆ نموونە: 'Dear Sir/Madam, We are writing to inform you...'",
    submitBtn: "نامەکە شی بکەرەوە",
    loading: "نامەکەت دەخوێنرێتەوە...",
    loadingSub: "باشی ١٠-٢٠ چرکە دەخایەنێت",
    ready: "ڕوونکردنەوەکە ئامادەیە",
    copy: "کۆپی بکە",
    copied: "✓ کۆپی کرا",
    reset: "← نامەیەکی دیکە شی بکەرەوە",
    disclaimer: "گرنگ: ئەمە شیکارییەکی AI یە. بۆ بڕیارە یاساییەکان، هەموو کاتێک قسەی پیشەیی مەکە.",
    usageLabel: "بەکارهێنانی بەخۆڕایی ماوە",
    dropText: "وێنەی نامەکە بنێرە",
    dropSub: "کلیک بکە بۆ هەڵبژاردن",
    orCamera: "یان",
    cameraBtn: "📷 وێنە بکە",
    formats: "JPG، PNG، PDF قبووڵ دەکرێت",
    errorEmpty: "تکایە دەقی نامەکەت بنووسە.",
    errorFile: "تکایە وێنەیەک بنێرە.",
    errorUsage: "بەکارهێنانی بەخۆڕاییت تەواوبوو. دووبارە ٢٤ کاتژمێر دواتر هەوڵبدەرەوە.",
    errorGeneral: "هەڵەیەک ڕوویدا. تکایە دووبارە هەوڵبدەرەوە.",
    chips: ["هەر نامەیەک"],
    labels: {
      letterType: "📋 جۆری نامە",
      summary: "📖 مانای نامەکە",
      deadlines: "📅 بەروار و ماوەکان",
      whatToDo: "✅ چی دەکەیت",
      important: "⚠️ گرنگ",
    },
    apiLang: "sorani",
  },
  en: {
    title: "Understand Your Letter",
    subtitle: "Paste or photograph any official UK letter — we'll explain it clearly",
    pasteTab: "Paste Text",
    uploadTab: "Upload / Take Photo",
    placeholder: "Paste the text from your letter here...\n\nFor example: 'Dear Sir/Madam, We are writing to inform you that your Universal Credit claim...'",
    submitBtn: "Explain This Letter",
    loading: "Reading your letter...",
    loadingSub: "This usually takes 10–20 seconds",
    ready: "Explanation Ready",
    copy: "Copy",
    copied: "✓ Copied",
    reset: "← Explain Another Letter",
    disclaimer: "Important: This is an AI explanation. For legal decisions, always speak with a qualified professional.",
    usageLabel: "Free uses remaining",
    dropText: "Upload a photo of your letter",
    dropSub: "Click to browse files",
    orCamera: "or",
    cameraBtn: "📷 Take Photo",
    formats: "JPG, PNG, PDF accepted",
    errorEmpty: "Please paste the text from your letter first.",
    errorFile: "Please upload a photo of your letter.",
    errorUsage: "You've used all 10 free uses. Come back in 24 hours.",
    errorGeneral: "Something went wrong. Please try again.",
    chips: ["Any Official Letter"],
    labels: {
      letterType: "📋 Letter Type",
      summary: "📖 What This Letter Means",
      deadlines: "📅 Important Dates & Deadlines",
      whatToDo: "✅ What You Should Do",
      important: "⚠️ Important Warning",
    },
    apiLang: "english",
  },
  fa: {
    title: "نامه‌ات را بفهم",
    subtitle: "هر نامه رسمی از UK را بفرست — ما به فارسی توضیح می‌دهیم",
    pasteTab: "متن نامه را paste کن",
    uploadTab: "آپلود / عکس بگیر",
    placeholder: "متن نامه‌ات را اینجا paste کن...",
    submitBtn: "نامه را توضیح بده",
    loading: "نامه‌ات در حال خواندن است...",
    loadingSub: "معمولاً ۱۰-۲۰ ثانیه طول می‌کشد",
    ready: "توضیح آماده است",
    copy: "کپی کن",
    copied: "✓ کپی شد",
    reset: "← نامه دیگری توضیح بده",
    disclaimer: "مهم: این توضیح AI است. برای تصمیمات حقوقی، همیشه با متخصص صحبت کن.",
    usageLabel: "استفاده رایگان باقی‌مانده",
    dropText: "عکس نامه را آپلود کن",
    dropSub: "کلیک کن برای مرور",
    orCamera: "یا",
    cameraBtn: "📷 عکس بگیر",
    formats: "JPG، PNG، PDF قبول می‌شود",
    errorEmpty: "لطفاً ابتدا متن نامه را paste کن.",
    errorFile: "لطفاً یک عکس آپلود کن.",
    errorUsage: "۱۰ استفاده رایگان تمام شد. ۲۴ ساعت دیگر برگرد.",
    errorGeneral: "مشکلی پیش آمد. دوباره امتحان کن.",
    chips: ["هر نامه رسمی"],
    labels: {
      letterType: "📋 نوع نامه",
      summary: "📖 معنای نامه",
      deadlines: "📅 تاریخ‌ها و مهلت‌ها",
      whatToDo: "✅ چه باید بکنی",
      important: "⚠️ مهم",
    },
    apiLang: "farsi",
  },
  ar: {
    title: "افهم رسالتك",
    subtitle: "أرسل أي رسالة رسمية من UK — سنشرحها بالعربية",
    pasteTab: "الصق نص الرسالة",
    uploadTab: "ارفع / التقط صورة",
    placeholder: "الصق نص رسالتك هنا...",
    submitBtn: "اشرح هذه الرسالة",
    loading: "جاري قراءة رسالتك...",
    loadingSub: "عادةً يستغرق ١٠-٢٠ ثانية",
    ready: "الشرح جاهز",
    copy: "انسخ",
    copied: "✓ تم النسخ",
    reset: "← اشرح رسالة أخرى",
    disclaimer: "مهم: هذا شرح بالذكاء الاصطناعي. للقرارات القانونية، تحدث مع متخصص.",
    usageLabel: "الاستخدامات المجانية المتبقية",
    dropText: "ارفع صورة الرسالة",
    dropSub: "انقر للتصفح",
    orCamera: "أو",
    cameraBtn: "📷 التقط صورة",
    formats: "JPG، PNG، PDF مقبولة",
    errorEmpty: "يرجى لصق نص رسالتك أولاً.",
    errorFile: "يرجى رفع صورة للرسالة.",
    errorUsage: "استنفدت 10 استخدامات مجانية. عد بعد 24 ساعة.",
    errorGeneral: "حدث خطأ. يرجى المحاولة مرة أخرى.",
    chips: ["أي رسالة رسمية"],
    labels: {
      letterType: "📋 نوع الرسالة",
      summary: "📖 معنى الرسالة",
      deadlines: "📅 التواريخ والمواعيد",
      whatToDo: "✅ ماذا يجب أن تفعل",
      important: "⚠️ تحذير مهم",
    },
    apiLang: "arabic",
  },
};

function ResultBlock({ color, bg, label, text, isRtl }) {
  return (
    <div style={{ background: bg, borderRadius: 14, padding: "14px 16px", border: `1px solid ${color}25`, marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color, textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 14, lineHeight: 1.75, color: "#1a2b5f", direction: isRtl ? "rtl" : "ltr", fontFamily: isRtl ? "'Noto Sans Arabic', sans-serif" : "inherit" }}>
        {text}
      </div>
    </div>
  );
}

export default function DocumentExplainerPage() {
  const router = useRouter();
  const [lang, setLang] = useState("ku");
  const [inputMode, setInputMode] = useState("paste");
  const [letterText, setLetterText] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedFileData, setUploadedFileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [usesLeft, setUsesLeft] = useState(10);
  const [copied, setCopied] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('kurdlink_lang');
    if (saved && UI[saved]) setLang(saved);

    const storedReset = localStorage.getItem('kurdlink_explainer_reset');
    const storedUses = localStorage.getItem('kurdlink_explainer_uses');
    if (storedReset && storedUses) {
      const resetAt = parseInt(storedReset);
      if (Date.now() < resetAt) {
        setUsesLeft(parseInt(storedUses));
      } else {
        localStorage.removeItem('kurdlink_explainer_reset');
        localStorage.removeItem('kurdlink_explainer_uses');
        setUsesLeft(10);
      }
    }
  }, []);

  const ui = UI[lang];
  const isRtl = lang === "ku" || lang === "fa" || lang === "ar";

  const handleLangChange = (newLang) => {
    setLang(newLang);
    setResult(null);
    setError("");
  };

  const handleFile = (file) => {
    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result.split(',')[1];
      const mediaType = file.type || 'image/jpeg';
      setUploadedFileData({ base64, mediaType });
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadedFileData(null);
    const input = document.getElementById("file-input");
    if (input) input.value = "";
    const cam = document.getElementById("camera-input");
    if (cam) cam.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const submit = async () => {
    setError("");
    if (inputMode === "paste" && !letterText.trim()) { setError(ui.errorEmpty); return; }
    if (inputMode === "upload" && !uploadedFile) { setError(ui.errorFile); return; }
    if (usesLeft <= 0) { setError(ui.errorUsage); return; }

    setLoading(true);
    setResult(null);

    try {
      const body = { language: ui.apiLang, inputMode };
      if (inputMode === "paste") {
        body.letterContent = letterText;
      } else {
        body.imageData = uploadedFileData.base64;
        body.mediaType = ['image/jpeg','image/png','image/gif','image/webp'].includes(uploadedFileData.mediaType)
          ? uploadedFileData.mediaType
          : 'image/jpeg';
      }

      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setResult(data);

      setUsesLeft(u => {
        const newVal = Math.max(0, u - 1);
        if (!localStorage.getItem('kurdlink_explainer_reset')) {
          localStorage.setItem('kurdlink_explainer_reset', String(Date.now() + 86400000));
        }
        localStorage.setItem('kurdlink_explainer_uses', String(newVal));
        return newVal;
      });

    } catch {
      setError(ui.errorGeneral);
    } finally {
      setLoading(false);
    }
  };

  const copyResult = () => {
    if (!result) return;
    const text = [result.letterType, result.summary, result.deadlines, result.whatToDo, result.important].filter(Boolean).join("\n\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const reset = () => {
    setResult(null);
    setError("");
    setLetterText("");
    removeFile();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4FF", fontFamily: "'Plus Jakarta Sans', sans-serif", direction: isRtl ? "rtl" : "ltr" }}>

      <div style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #2D4A9E 100%)`, padding: "16px 16px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.12)", border: "none", borderRadius: 10, width: 36, height: 36, color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {isRtl ? "→" : "←"}
            </button>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>📄 {ui.title}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>KurdLink</div>
            </div>
          </div>
          <LangDropdown lang={lang} onChange={handleLangChange} />
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.5, marginBottom: 12 }}>{ui.subtitle}</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {ui.chips.map(chip => (
            <div key={chip} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 20, padding: "4px 10px", fontSize: 11, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{chip}</div>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 16px 40px", maxWidth: 600, margin: "0 auto" }}>
        <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 4px 32px rgba(0,0,0,0.08)", overflow: "hidden" }}>

          <div style={{ display: "flex", borderBottom: "1px solid #f0f0f0" }}>
            {["paste", "upload"].map(mode => (
              <button key={mode} onClick={() => setInputMode(mode)}
                style={{ flex: 1, padding: "14px 16px", border: "none", borderBottom: inputMode === mode ? `2px solid ${GREEN}` : "2px solid transparent", background: inputMode === mode ? "#f0fdf9" : "#fff", color: inputMode === mode ? "#17a066" : "#888", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
                {mode === "paste" ? `✏️ ${ui.pasteTab}` : `📷 ${ui.uploadTab}`}
              </button>
            ))}
          </div>

          <div style={{ padding: "20px 16px 0" }}>
            {inputMode === "paste" && (
              <textarea
                value={letterText}
                onChange={e => setLetterText(e.target.value)}
                placeholder={ui.placeholder}
                rows={7}
                style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: 14, fontSize: 14, lineHeight: 1.6, color: "#0f1923", fontFamily: "inherit", resize: "vertical", outline: "none", direction: "ltr", boxSizing: "border-box" }}
              />
            )}

            {inputMode === "upload" && (
              <>
                {!uploadedFile ? (
                  <div>
                    <div
                      onDragOver={e => { e.preventDefault(); setDragging(true); }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById("file-input").click()}
                      style={{ border: `2px dashed ${dragging ? GREEN : "#e2e8f0"}`, borderRadius: 14, padding: "28px 20px", textAlign: "center", cursor: "pointer", background: dragging ? "#f0fdf9" : "#fafafa", marginBottom: 12 }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>🖼️</div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#1a2b5f", marginBottom: 4 }}>{ui.dropText}</div>
                      <div style={{ fontSize: 12, color: "#aaa" }}>{ui.dropSub}</div>
                      <div style={{ fontSize: 11, color: "#ccc", marginTop: 4 }}>{ui.formats}</div>
                      <input id="file-input" type="file" accept="image/jpeg,image/png,image/gif,image/webp,.pdf" style={{ display: "none" }}
                        onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
                      <span style={{ fontSize: 12, color: "#aaa", fontWeight: 600 }}>{ui.orCamera}</span>
                      <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
                    </div>

                    <button onClick={() => document.getElementById("camera-input").click()}
                      style={{ width: "100%", padding: "13px", border: `1.5px solid ${GREEN}`, borderRadius: 14, background: "#f0fdf9", color: "#17a066", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                      {ui.cameraBtn}
                    </button>
                    <input id="camera-input" type="file" accept="image/*" capture="environment" style={{ display: "none" }}
                      onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />
                  </div>
                ) : (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", background: "#f0fdf9", border: "1.5px solid rgba(29,184,122,0.3)", borderRadius: 12 }}>
                      <span style={{ fontSize: 22 }}>📄</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#17a066", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{uploadedFile.name}</span>
                      <button onClick={removeFile} style={{ width: 26, height: 26, borderRadius: "50%", border: "none", background: "rgba(29,184,122,0.15)", color: "#17a066", cursor: "pointer", fontWeight: 700 }}>✕</button>
                    </div>
                    {uploadedFile.type && uploadedFile.type.startsWith('image/') && uploadedFileData && (
                      <img src={`data:${uploadedFile.type};base64,${uploadedFileData.base64}`} alt="preview"
                        style={{ width: "100%", borderRadius: 12, marginTop: 10, maxHeight: 200, objectFit: "cover" }} />
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {error && (
            <div style={{ margin: "12px 16px 0", padding: "12px 14px", background: "#fff1f2", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, fontSize: 13, color: "#dc2626", fontWeight: 500 }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ padding: "16px 16px 0" }}>
            <button onClick={submit} disabled={loading}
              style={{ width: "100%", padding: 15, background: loading ? "#a0d9bc" : `linear-gradient(135deg, ${GREEN}, #0fa86a)`, color: "#fff", fontSize: 15, fontWeight: 800, border: "none", borderRadius: 14, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: loading ? "none" : "0 4px 20px rgba(29,184,122,0.3)" }}>
              {loading ? <span>{ui.loading}</span> : <><span>✨</span><span>{ui.submitBtn}</span></>}
            </button>
          </div>

          {loading && <div style={{ textAlign: "center", padding: "10px 16px 0", fontSize: 12, color: "#aaa" }}>{ui.loadingSub}</div>}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderTop: "1px solid #f5f5f5", marginTop: 16 }}>
            <span style={{ fontSize: 12, color: "#aaa", fontWeight: 500 }}>{ui.usageLabel}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ display: "flex", gap: 3 }}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: i < usesLeft ? GREEN : "#e2e8f0" }} />
                ))}
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#555" }}>{usesLeft} / 10</span>
              <span style={{ fontSize: 11, color: "#bbb" }}>· resets in 24h</span>
            </div>
          </div>

          {result && (
            <div style={{ borderTop: "1px solid #f0f0f0", padding: "20px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f0fdf9", border: "1px solid rgba(29,184,122,0.25)", borderRadius: 10, padding: "8px 12px" }}>
                  <div style={{ width: 8, height: 8, background: GREEN, borderRadius: "50%" }} />
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#17a066", textTransform: "uppercase", letterSpacing: 0.5 }}>{ui.ready}</span>
                </div>
                <button onClick={copyResult} style={{ padding: "7px 12px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12, fontWeight: 600, color: "#555", cursor: "pointer", fontFamily: "inherit" }}>
                  {copied ? ui.copied : ui.copy}
                </button>
              </div>

              <ResultBlock color={GREEN} bg="#f0fdf9" label={ui.labels.letterType} text={result.letterType} isRtl={isRtl} />
              <ResultBlock color="#0369a1" bg="#f0f9ff" label={ui.labels.summary} text={result.summary} isRtl={isRtl} />
              {result.deadlines && <ResultBlock color="#dc2626" bg="#fff1f2" label={ui.labels.deadlines} text={result.deadlines} isRtl={isRtl} />}
              <ResultBlock color="#b45309" bg="#fffbeb" label={ui.labels.whatToDo} text={result.whatToDo} isRtl={isRtl} />
              {result.important && <ResultBlock color="#dc2626" bg="#fff1f2" label={ui.labels.important} text={result.important} isRtl={isRtl} />}

              <div style={{ marginTop: 4, padding: "12px 14px", background: "#fafafa", border: "1px solid #eee", borderRadius: 12, display: "flex", gap: 10 }}>
                <span>⚠️</span>
                <span style={{ fontSize: 12, color: "#999", lineHeight: 1.6 }}>{ui.disclaimer}</span>
              </div>

              <button onClick={reset} style={{ marginTop: 14, width: "100%", padding: 12, background: "transparent", border: "1.5px solid #e2e8f0", borderRadius: 12, fontSize: 13, fontWeight: 700, color: "#666", cursor: "pointer", fontFamily: "inherit" }}>
                {ui.reset}
              </button>
            </div>
          )}
        </div>

        <div style={{ background: NAVY, borderRadius: 16, padding: "16px 20px", marginTop: 16, display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
          {[["🔒", "Never stored"], ["⚡", "Results in seconds"], ["🌍", "4 languages"]].map(([icon, text]) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
              <span>{icon}</span><span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}