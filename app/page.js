'use client'
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

const INDIGO = "#4F46E5"
const INDIGO_DARK = "#1C1A4F"
const INDIGO_LIGHT = "#818CF8"
const MINT = "#34D399"
const KURD_RED = "#E30A17"
const KURD_GREEN = "#009C3B"
const KURD_YELLOW = "#F7C200"

const taglines = [
  { text: "Your rights · Your language · Your community", dir: "ltr" },
  { text: "مافەکانت · زمانەکەت · کۆمەڵگاکەت", dir: "rtl" },
  { text: "حقوقت · زبانت · جامعه‌ات", dir: "rtl" },
  { text: "حقوقك · لغتك · مجتمعك", dir: "rtl" },
]

const LANGS = [
  { id: "en", flag: "🇬🇧", name: "EN" },
  { id: "ku", flag: null, name: "کوردی" },
  { id: "fa", flag: "🇮🇷", name: "فارسی" },
  { id: "ar", flag: "🇮🇶", name: "عربي" },
]

const startLabel = { en: "Get Started", ku: "دەست پێ بکە", fa: "شروع کن", ar: "ابدأ الآن" }

function KurdFlag({ size = 18 }) {
  const w = size * 1.5
  return (
    <svg width={w} height={size} viewBox="0 0 90 60" style={{ borderRadius: 2, display: "block" }}>
      <rect width="90" height="20" fill="#E30A17" />
      <rect y="20" width="90" height="20" fill="#FFFFFF" />
      <rect y="40" width="90" height="20" fill="#009C3B" />
      <circle cx="45" cy="30" r="9" fill="#F7C200" />
      {Array.from({ length: 21 }).map((_, i) => {
        const a = (i * 360 / 21) * Math.PI / 180
        return <line key={i} x1={45+Math.cos(a)*9} y1={30+Math.sin(a)*9} x2={45+Math.cos(a)*14} y2={30+Math.sin(a)*14} stroke="#F7C200" strokeWidth="1.5" />
      })}
      <circle cx="45" cy="30" r="5" fill="#E30A17" />
    </svg>
  )
}

function SproutLogo({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <linearGradient id="sbg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={INDIGO} /><stop offset="100%" stopColor={INDIGO_LIGHT} />
        </linearGradient>
        <linearGradient id="sl" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#059669" /><stop offset="100%" stopColor="#6EE7B7" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="url(#sbg)" />
      <path d="M 50 76 L 50 45" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M 50 60 Q 26 55 22 34 Q 44 28 52 56 Z" fill="url(#sl)" />
      <path d="M 50 50 Q 72 44 76 23 Q 56 17 48 46 Z" fill="url(#sl)" opacity="0.85" />
      <ellipse cx="50" cy="40" rx="6" ry="9" fill={MINT} />
      <ellipse cx="50" cy="37" rx="3" ry="4" fill="white" opacity="0.8" />
    </svg>
  )
}

function LangSelector({ lang, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = LANGS.find(l => l.id === lang) || LANGS[0]
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: "flex", alignItems: "center", gap: 5, padding: "7px 13px",
        background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 20, color: "white", fontWeight: 800, fontSize: 12,
        cursor: "pointer", fontFamily: "Nunito, sans-serif",
      }}>
        {current.id === "ku" ? <KurdFlag size={12} /> : <span style={{ fontSize: 14 }}>{current.flag}</span>}
        <span>{current.name}</span>
        <span style={{ fontSize: 8, opacity: 0.4 }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", right: 0,
          background: "#0d0b24", borderRadius: 16, overflow: "hidden",
          boxShadow: "0 16px 48px rgba(0,0,0,0.6)", zIndex: 100,
          minWidth: 150, border: "1px solid rgba(255,255,255,0.08)",
        }}>
          {LANGS.map(l => (
            <button key={l.id} onMouseDown={(e) => { e.preventDefault(); onChange(l.id); setOpen(false) }} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "11px 16px", background: lang === l.id ? "rgba(79,70,229,0.3)" : "transparent",
              border: "none", borderBottom: "1px solid rgba(255,255,255,0.05)",
              cursor: "pointer", fontFamily: "Nunito, sans-serif", color: "white",
            }}>
              {l.id === "ku" ? <KurdFlag size={15} /> : <span style={{ fontSize: 18 }}>{l.flag}</span>}
              <span style={{ fontSize: 13, fontWeight: 700 }}>{l.name}</span>
              {lang === l.id && <span style={{ color: MINT, marginLeft: "auto" }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function HomePage() {
  const router = useRouter()
  const [tagIdx, setTagIdx] = useState(0)
  const [tagVisible, setTagVisible] = useState(true)
  const [lang, setLang] = useState("en")
  const isRTL = ["ku", "fa", "ar"].includes(lang)

  useEffect(() => {
    const saved = localStorage.getItem("komek_lang")
    if (saved) setLang(saved)
    const handler = (e) => setLang(e.detail)
    window.addEventListener("langchange", handler)

    const interval = setInterval(() => {
      setTagVisible(false)
      setTimeout(() => { setTagIdx(i => (i + 1) % taglines.length); setTagVisible(true) }, 400)
    }, 3000)

    return () => {
      window.removeEventListener("langchange", handler)
      clearInterval(interval)
    }
  }, [])

  function handleLangChange(l) {
    setLang(l)
    try {
      localStorage.setItem("komek_lang", l)
      window.dispatchEvent(new CustomEvent("langchange", { detail: l }))
    } catch(e) {}
  }

  const currentTag = taglines[tagIdx]

  return (
    <div style={{
      height: "100vh", maxWidth: 390, margin: "0 auto",
      background: "#050412",
      fontFamily: "Nunito, sans-serif",
      display: "flex", flexDirection: "column",
      overflow: "hidden", position: "relative",
      direction: isRTL ? "rtl" : "ltr",
    }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.03); }
        }
      `}</style>

      {/* Background glow */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 70% 55% at 50% 52%, rgba(79,70,229,0.22) 0%, rgba(28,26,79,0.35) 45%, transparent 75%)",
        pointerEvents: "none",
      }} />

      {/* Red glow top left */}
      <div style={{
        position: "absolute", top: -80, left: -60,
        width: 260, height: 260, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(227,10,23,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Green glow bottom right */}
      <div style={{
        position: "absolute", bottom: -60, right: -40,
        width: 220, height: 220, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,156,59,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Kurdish flag vertical edges */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: `linear-gradient(to bottom, ${KURD_RED}, transparent, ${KURD_GREEN})`, opacity: 0.5, pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 3, background: `linear-gradient(to bottom, ${KURD_GREEN}, transparent, ${KURD_RED})`, opacity: 0.5, pointerEvents: "none" }} />

      {/* Stars */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 390 844">
        {[[30,60],[80,30],[140,80],[200,20],[260,55],[320,35],[360,75],[15,140],[100,160],[170,110],[240,150],[300,120],[350,160],[50,220],[150,240],[280,200],[340,230]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r={i%4===0?1.4:0.8} fill="white" opacity={0.08+((i*11)%9)*0.04} />
        ))}
      </svg>

      {/* Nav */}
      <div style={{ padding: "52px 24px 0", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 10, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SproutLogo size={38} />
          <span style={{ fontSize: 22, fontWeight: 900, color: "white", letterSpacing: -0.5 }}>Komek</span>
        </div>
        <LangSelector lang={lang} onChange={handleLangChange} />
      </div>

      {/* Centre content */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        position: "relative", zIndex: 10, padding: "0 24px",
      }}>
        {/* Pulsing Kurdish sun */}
        <div style={{ animation: "pulse 1s ease-in-out infinite", marginBottom: 36 }}>
          <svg width="180" height="180" viewBox="0 0 180 180">
            <defs>
              <radialGradient id="sg2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={KURD_YELLOW} />
                <stop offset="100%" stopColor="#F59E0B" />
              </radialGradient>
              <filter id="sunblur"><feGaussianBlur stdDeviation="6" /></filter>
            </defs>
            <circle cx="90" cy="90" r="70" fill={KURD_YELLOW} opacity="0.12" filter="url(#sunblur)" />
            {Array.from({ length: 21 }).map((_, i) => {
              const a = (i * 360 / 21) * Math.PI / 180
              return <line key={i}
                x1={90 + Math.cos(a) * 38} y1={90 + Math.sin(a) * 38}
                x2={90 + Math.cos(a) * 62} y2={90 + Math.sin(a) * 62}
                stroke={KURD_YELLOW} strokeWidth="3.5" strokeLinecap="round" opacity="0.95" />
            })}
            <circle cx="90" cy="90" r="38" fill="url(#sg2)" />
            <circle cx="90" cy="90" r="17" fill={KURD_RED} />
            <ellipse cx="78" cy="78" rx="12" ry="8" fill="white" opacity="0.14" />
          </svg>
        </div>

        {/* Tagline */}
        <div style={{
          textAlign: "center",
          opacity: tagVisible ? 1 : 0,
          transition: "opacity 0.4s ease",
          minHeight: 80,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <p style={{
            fontSize: 26, fontWeight: 900, color: "white",
            lineHeight: 1.25, textAlign: "center",
            direction: currentTag.dir,
            letterSpacing: currentTag.dir === "ltr" ? -0.5 : 0,
            textShadow: "0 2px 24px rgba(79,70,229,0.4)",
          }}>
            {currentTag.text}
          </p>
        </div>

        {/* Dots */}
        <div style={{ display: "flex", gap: 6, marginTop: 20 }}>
          {taglines.map((_, i) => (
            <div key={i} style={{
              width: i === tagIdx ? 20 : 6, height: 6, borderRadius: 3,
              background: i === tagIdx ? KURD_YELLOW : "rgba(255,255,255,0.15)",
              transition: "all 0.4s ease",
            }} />
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push("/home")}
          style={{
            marginTop: 36,
            background: `linear-gradient(135deg, ${MINT} 0%, #059669 100%)`,
            borderRadius: 28, padding: "16px 48px",
            fontSize: 16, fontWeight: 900, color: "white",
            border: "none", cursor: "pointer",
            boxShadow: "0 8px 32px rgba(52,211,153,0.35)",
            letterSpacing: 0.3, fontFamily: "Nunito, sans-serif",
          }}>{startLabel[lang]} →</button>

        {/* Languages */}
        <p style={{ marginTop: 14, fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 600, textAlign: "center" }}>
          English · کوردی · فارسی · عربي
        </p>
      </div>

      <div style={{ height: 24, flexShrink: 0 }} />
    </div>
  )
}