'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const INDIGO = '#4F46E5'
const INDIGO_LIGHT = '#818CF8'
const MINT = '#34D399'
const SOFT = '#EDE9FE'
const FONT = "'Nunito', 'Plus Jakarta Sans', sans-serif"

const TABS = [
  {
    id: 'guide',
    icon: '🧭',
    label: { en: 'Guide', ku: 'ڕێبەر', fa: 'راهنما', ar: 'الدليل' },
    route: '/reber/coming-to-uk',
    match: (p) => p?.startsWith('/reber') && p !== '/reber/ask',
  },
  {
    id: 'letters',
    icon: '📄',
label: { en: 'Letters', ku: 'شیکاری نامە', fa: 'نامه‌ها', ar: 'الرسائل' },
    route: '/journey/document-explainer',
    match: (p) => p?.startsWith('/journey'),
  },
  {
    id: 'ask',
    icon: '❓',
    label: { en: 'Ask', ku: 'پرسیار بکە', fa: 'سوال', ar: 'اسأل' },
    route: '/reber/ask',
    match: (p) => p === '/reber/ask',
  },
  {
    id: 'find',
    icon: '🔍',
    label: { en: 'Find', ku: 'بدۆزەرەوە', fa: 'جستجو', ar: 'ابحث' },
    route: '/find',
    match: (p) => p?.startsWith('/find'),
  },
]

function SproutLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <linearGradient id="nbg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={INDIGO} />
          <stop offset="100%" stopColor={INDIGO_LIGHT} />
        </linearGradient>
        <linearGradient id="nleaf" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#6EE7B7" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="url(#nbg)" />
      <ellipse cx="50" cy="76" rx="30" ry="10" fill="rgba(255,255,255,0.2)" />
      <path d="M 42 76 Q 36 84 32 90" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.35" />
      <path d="M 50 76 L 50 90" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.35" />
      <path d="M 58 76 Q 64 84 68 90" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.35" />
      <path d="M 50 76 L 50 45" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M 50 60 Q 26 55 22 34 Q 44 28 52 56 Z" fill="url(#nleaf)" />
      <path d="M 50 50 Q 72 44 76 23 Q 56 17 48 46 Z" fill="url(#nleaf)" opacity="0.85" />
      <ellipse cx="50" cy="40" rx="6" ry="9" fill={MINT} />
      <ellipse cx="50" cy="37" rx="3" ry="4" fill="white" opacity="0.8" />
    </svg>
  )
}

export default function NavBar() {
  const router = useRouter()
  const pathname = usePathname()
  const [lang, setLang] = useState('en')

  useEffect(() => {
    const saved = localStorage.getItem('komek_lang')
    if (saved) setLang(saved)
  }, [])

  if (pathname === '/') return null

  return (
    <div style={{
      background: '#fff', position: 'sticky', top: 0, zIndex: 200,
      direction: 'ltr', borderBottom: '1px solid #EDE9FE',
      boxShadow: '0 2px 16px rgba(79,70,229,0.08)',
    }}>
      {/* Top row — logo + lang */}
      <div style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div onClick={() => router.push('/home')} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <SproutLogo size={32} />
          <span style={{ fontSize: 19, fontWeight: 900, color: INDIGO, fontFamily: FONT, letterSpacing: -0.5 }}>Komek</span>
        </div>
        <LangSelector lang={lang} onChange={(l) => {
          setLang(l)
          localStorage.setItem('komek_lang', l)
          window.dispatchEvent(new CustomEvent('langchange', { detail: l }))
        }} />
      </div>

      {/* Tab row */}
      <div style={{ display: 'flex', padding: '0 8px', direction: 'ltr' }}>
        {TABS.map(tab => {
          const active = tab.match(pathname)
          const label = tab.label[lang] || tab.label.en
          return (
            <button
              key={tab.id}
              onClick={() => router.push(tab.route)}
              style={{
                flex: 1, padding: '9px 4px',
                background: active ? SOFT : 'transparent',
                border: 'none',
                color: active ? INDIGO : '#9CA3AF',
                fontWeight: active ? 800 : 600,
                fontSize: 12, cursor: 'pointer', fontFamily: FONT,
                borderBottom: active ? `2px solid ${INDIGO}` : '2px solid transparent',
                borderRadius: '8px 8px 0 0', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontSize: 14 }}>{tab.icon}</span>
              <span>{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function LangSelector({ lang, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const LANGS = [
    { id: 'en', flag: '🇬🇧', name: 'EN', full: 'English' },
    { id: 'ku', flag: null, name: 'کوردی', full: 'Kurdish' },
    { id: 'fa', flag: '🇮🇷', name: 'فارسی', full: 'Farsi' },
    { id: 'ar', flag: '🇮🇶', name: 'عربي', full: 'Arabic' },
  ]
  const current = LANGS.find(l => l.id === lang) || LANGS[0]

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative', userSelect: 'none' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px',
        background: SOFT, border: `1.5px solid #C4B5FD`,
        borderRadius: 20, color: INDIGO, fontWeight: 800, fontSize: 12,
        cursor: 'pointer', fontFamily: FONT,
      }}>
        {current.id === 'ku' ? <KurdFlag size={14} /> : <span style={{ fontSize: 14 }}>{current.flag}</span>}
        <span>{current.name}</span>
        <span style={{ fontSize: 9, opacity: 0.6 }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 32px rgba(79,70,229,0.15)', zIndex: 400, minWidth: 160, border: '1px solid #EDE9FE' }}>
          {LANGS.map(l => (
            <button key={l.id} onClick={() => { onChange(l.id); setOpen(false) }} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px',
              background: lang === l.id ? SOFT : '#fff', border: 'none',
              borderBottom: '1px solid #F5F4FF', cursor: 'pointer', textAlign: 'left', fontFamily: FONT,
            }}>
              {l.id === 'ku' ? <KurdFlag size={20} /> : <span style={{ fontSize: 20, flexShrink: 0 }}>{l.flag}</span>}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: lang === l.id ? INDIGO : '#1a1a1a' }}>{l.name}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>{l.full}</div>
              </div>
              {lang === l.id && <span style={{ color: MINT, fontSize: 14, fontWeight: 900 }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function KurdFlag({ size = 22 }) {
  const w = size * 1.5
  return (
    <svg width={w} height={size} viewBox="0 0 90 60" style={{ borderRadius: 3, display: 'block', flexShrink: 0 }}>
      <rect width="90" height="20" fill="#E30A17" />
      <rect y="20" width="90" height="20" fill="#FFFFFF" />
      <rect y="40" width="90" height="20" fill="#009C3B" />
      <circle cx="45" cy="30" r="9" fill="#F7C200" />
      {Array.from({ length: 21 }).map((_, i) => {
        const angle = (i * 360 / 21) * Math.PI / 180
        const x1 = 45 + Math.cos(angle) * 9
        const y1 = 30 + Math.sin(angle) * 9
        const x2 = 45 + Math.cos(angle) * 14
        const y2 = 30 + Math.sin(angle) * 14
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#F7C200" strokeWidth="1.5" />
      })}
      <circle cx="45" cy="30" r="5" fill="#E30A17" />
    </svg>
  )
}