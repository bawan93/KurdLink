'use client'
import { useState, useEffect } from "react"

const FONT = "'Nunito', 'Plus Jakarta Sans', sans-serif"
const INDIGO = '#4F46E5'
const INDIGO_LIGHT = '#818CF8'
const MINT = '#34D399'
const SOFT = '#EDE9FE'
const BG = '#F5F4FF'

const LANGUAGES = [
  { id: 'en', flag: '🇬🇧', name: 'English', nameEn: 'English', isKurdish: false },
  { id: 'ku', flag: null,   name: 'کوردی',   nameEn: 'Kurdish', isKurdish: true  },
  { id: 'fa', flag: '🇮🇷', name: 'فارسی',  nameEn: 'Farsi',   isKurdish: false },
  { id: 'ar', flag: '🇮🇶', name: 'عربي',   nameEn: 'Arabic',  isKurdish: false },
]

function SproutLogo({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <linearGradient id="wbg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={INDIGO} />
          <stop offset="100%" stopColor={INDIGO_LIGHT} />
        </linearGradient>
        <linearGradient id="wleaf" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#6EE7B7" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="url(#wbg)" />
      <ellipse cx="50" cy="76" rx="30" ry="10" fill="rgba(255,255,255,0.2)" />
      <path d="M 42 76 Q 36 84 32 90" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.35" />
      <path d="M 50 76 L 50 90" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.35" />
      <path d="M 58 76 Q 64 84 68 90" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.35" />
      <path d="M 50 76 L 50 45" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M 50 60 Q 26 55 22 34 Q 44 28 52 56 Z" fill="url(#wleaf)" />
      <path d="M 50 50 Q 72 44 76 23 Q 56 17 48 46 Z" fill="url(#wleaf)" opacity="0.85" />
      <ellipse cx="50" cy="40" rx="6" ry="9" fill={MINT} />
      <ellipse cx="50" cy="37" rx="3" ry="4" fill="white" opacity="0.8" />
    </svg>
  )
}

function KurdFlag({ size = 20 }) {
  const w = size * 1.5
  return (
    <svg width={w} height={size} viewBox="0 0 90 60" style={{ borderRadius: 4, display: 'block' }}>
      <rect width="90" height="20" fill="#E30A17" />
      <rect y="20" width="90" height="20" fill="#FFFFFF" />
      <rect y="40" width="90" height="20" fill="#009C3B" />
      <circle cx="45" cy="30" r="9" fill="#F7C200" />
      {Array.from({ length: 21 }).map((_, i) => {
        const angle = (i * 360 / 21) * Math.PI / 180
        return <line key={i} x1={45 + Math.cos(angle) * 9} y1={30 + Math.sin(angle) * 9} x2={45 + Math.cos(angle) * 14} y2={30 + Math.sin(angle) * 14} stroke="#F7C200" strokeWidth="1.5" />
      })}
      <circle cx="45" cy="30" r="5" fill="#E30A17" />
    </svg>
  )
}

export default function WelcomePreview() {
  const [lang, setLang] = useState('en')
  const [pressed, setPressed] = useState(false)
  const [visible, setVisible] = useState(false)
  const isRtl = lang === 'ku' || lang === 'fa' || lang === 'ar'

  const TX = {
    en: { tagline: 'Your helping hand in the UK', sub: 'Find jobs, get guidance, understand your letters — all in one place, all in your language.', browse: "Let's Go", choose: 'Choose your language' },
    ku: { tagline: 'دەستگیرەکەت لە UK', sub: 'کار بدۆزەرەوە، ڕێنمایی وەربگرە، نامەکانت تێبگە — هەموو لەک شوێنەوە.', browse: 'با بچینە', choose: 'زمانەکەت هەڵبژێرە' },
    fa: { tagline: 'دست یاری‌ات در بریتانیا', sub: 'کار پیدا کن، راهنمایی بگیر، نامه‌هایت را بفهم.', browse: 'بریم', choose: 'زبانت را انتخاب کن' },
    ar: { tagline: 'يد العون في بريطانيا', sub: 'ابحث عن عمل، احصل على توجيه، افهم رسائلك.', browse: 'هيا نبدأ', choose: 'اختر لغتك للبدء' },
  }
  const t = TX[lang]

  useEffect(() => { setTimeout(() => setVisible(true), 60) }, [])

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: FONT, direction: 'ltr', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

      <div style={{ position: 'absolute', top: -100, right: -80, width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.18), transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -60, left: -60, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,211,153,0.15), transparent 70%)', pointerEvents: 'none' }} />

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        alignItems: 'center', padding: '48px 28px 24px', textAlign: 'center',
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'all 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
      }}>

        {/* Handshake hero */}
        <div style={{ fontSize: 64, lineHeight: 1, marginBottom: 20 }}>🤝</div>

        {/* Sprout + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <SproutLogo size={56} />
          <span style={{ fontSize: 48, fontWeight: 900, color: INDIGO, letterSpacing: -1.5, lineHeight: 1 }}>Komek</span>
        </div>

        {/* Tagline */}
        <div style={{ fontSize: 16, fontWeight: 700, color: INDIGO_LIGHT, marginBottom: 12, direction: isRtl ? 'rtl' : 'ltr' }}>
          {t.tagline}
        </div>

        {/* Description */}
        <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 28px', lineHeight: 1.7, maxWidth: 300, fontWeight: 500, direction: isRtl ? 'rtl' : 'ltr' }}>
          {t.sub}
        </p>

        {/* Pills */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['🧭 Guidance', '💼 Jobs', '🎯 Services', '📄 Letters'].map(pill => (
            <div key={pill} style={{ background: SOFT, borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 700, color: INDIGO }}>{pill}</div>
          ))}
        </div>

        {/* Language label */}
        <p style={{ fontSize: 11, fontWeight: 800, color: '#9CA3AF', letterSpacing: 1.5, textTransform: 'uppercase', margin: '0 0 14px' }}>{t.choose}</p>

        {/* Language grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%', maxWidth: 320, marginBottom: 28, direction: 'ltr' }}>
          {LANGUAGES.map((l) => {
            const isSelected = lang === l.id
            return (
              <button key={l.id} onClick={() => setLang(l.id)} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '13px 14px',
                background: isSelected ? SOFT : '#fff',
                border: isSelected ? `2px solid ${INDIGO}` : '2px solid #E5E7EB',
                borderRadius: 16, cursor: 'pointer', fontFamily: FONT, transition: 'all 0.2s',
                boxShadow: isSelected ? '0 4px 20px rgba(79,70,229,0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
                transform: isSelected ? 'scale(1.02)' : 'scale(1)', textAlign: 'left',
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: isSelected ? 'rgba(79,70,229,0.1)' : '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {l.isKurdish ? <KurdFlag size={20} /> : <span style={{ fontSize: 22 }}>{l.flag}</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: isSelected ? INDIGO : '#1A1A2E' }}>{l.name}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>{l.nameEn}</div>
                </div>
                {isSelected && <div style={{ width: 20, height: 20, borderRadius: '50%', background: INDIGO, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', fontWeight: 900, flexShrink: 0 }}>✓</div>}
              </button>
            )
          })}
        </div>

        {/* CTA */}
        <button
          onPointerDown={() => setPressed(true)}
          onPointerUp={() => setPressed(false)}
          onPointerLeave={() => setPressed(false)}
          style={{
            width: '100%', maxWidth: 320, padding: '17px',
            background: `linear-gradient(135deg, ${INDIGO}, ${INDIGO_LIGHT})`,
            border: 'none', borderRadius: 18, fontSize: 17, fontWeight: 900, color: '#fff',
            cursor: 'pointer', fontFamily: FONT,
            boxShadow: pressed ? '0 4px 16px rgba(79,70,229,0.3)' : '0 10px 32px rgba(79,70,229,0.35)',
            transform: pressed ? 'scale(0.97)' : 'scale(1)', transition: 'all 0.15s',
            direction: isRtl ? 'rtl' : 'ltr',
          }}
        >
          {t.browse} →
        </button>
      </div>

      <div style={{ textAlign: 'center', padding: '0 20px 28px', fontSize: 11, color: '#C4B5FD', fontWeight: 700, letterSpacing: 0.8 }}>
        KOMEK · FOR THE KURDISH COMMUNITY · UK
      </div>
    </div>
  )
}