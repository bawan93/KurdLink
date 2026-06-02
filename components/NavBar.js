'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const INDIGO = '#4F46E5'
const INDIGO_LIGHT = '#818CF8'
const MINT = '#34D399'
const SOFT = '#EDE9FE'
const FONT = "'Nunito', 'Plus Jakarta Sans', sans-serif"

const TABS = [
  { id: 'list_service', label: { en: 'Services', ku: 'خزمەتگوزاری', fa: 'خدمات', ar: 'الخدمات' } },
  { id: 'hire_staff',   label: { en: 'Jobs',     ku: 'کار',         fa: 'مشاغل', ar: 'الوظائف' } },
]

const GUIDE_LABELS = { en: 'Guide', ku: 'ڕێبەر', fa: 'راهنما', ar: 'الدليل' }

const GUIDE_ITEMS = {
  en: [
    { label: 'New to the UK',          sub: 'Step by step guide for new arrivals', icon: '✈️', route: '/reber/new-to-uk' },
    { label: 'Info & Help',            sub: 'Health, rights, money & more',        icon: '📋', route: '/reber/info'       },
    { label: 'Ask a Question',         sub: 'Get answers from the community',      icon: '❓', route: '/reber/ask'        },
    { label: 'Understand Your Letter', sub: 'Explain any UK official letter',      icon: '📄', route: '/journey/document-explainer' },
  ],
  ku: [
    { label: 'تازە گەیشتوویت بە UK',  sub: 'ڕێنمای هەنگاو بە هەنگاو بۆ تازەگەیشتووان', icon: '✈️', route: '/reber/new-to-uk' },
    { label: 'زانیاری و یارمەتی',     sub: 'تەندروستی، ماف، پارە و زیاتر',             icon: '📋', route: '/reber/info'       },
    { label: 'پرسیار بکە',             sub: 'وەڵام لە کۆمیونیتی وەربگرە',               icon: '❓', route: '/reber/ask'        },
    { label: 'نامەکەت شیبکە',          sub: 'هەر نامەی فەرمی UK ڕوونبکەرەوە',           icon: '📄', route: '/journey/document-explainer' },
  ],
  fa: [
    { label: 'تازه رسیدی به UK',       sub: 'راهنمای گام به گام برای تازه‌واردها',      icon: '✈️', route: '/reber/new-to-uk' },
    { label: 'اطلاعات و کمک',          sub: 'سلامت، حقوق، پول و بیشتر',                icon: '📋', route: '/reber/info'       },
    { label: 'سوال بپرس',              sub: 'از جامعه پاسخ بگیر',                       icon: '❓', route: '/reber/ask'        },
    { label: 'نامه‌ات را بفهم',         sub: 'هر نامه رسمی UK را توضیح بده',            icon: '📄', route: '/journey/document-explainer' },
  ],
  ar: [
    { label: 'وصلت للتو إلى UK',       sub: 'دليل خطوة بخطوة للوافدين الجدد',           icon: '✈️', route: '/reber/new-to-uk' },
    { label: 'معلومات ومساعدة',         sub: 'الصحة والحقوق والمال وأكثر',               icon: '📋', route: '/reber/info'       },
    { label: 'اطرح سؤالاً',             sub: 'احصل على إجابات من المجتمع',               icon: '❓', route: '/reber/ask'        },
    { label: 'افهم رسالتك',             sub: 'اشرح أي رسالة رسمية بريطانية',            icon: '📄', route: '/journey/document-explainer' },
  ],
}

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
  const [showGuide, setShowGuide] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const guideRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem('komek_lang')
    if (saved) setLang(saved)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (guideRef.current && !guideRef.current.contains(e.target)) setShowGuide(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (pathname === '/') return null

  const isGuideActive = pathname?.startsWith('/reber') || pathname?.startsWith('/journey')
  const guideItems = GUIDE_ITEMS[lang] || GUIDE_ITEMS.en

  return (
    <div style={{ background: '#fff', position: 'sticky', top: 0, zIndex: 200, direction: 'ltr', borderBottom: '1px solid #EDE9FE', boxShadow: '0 2px 16px rgba(79,70,229,0.08)' }}>

      <div style={{ padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div onClick={() => router.push('/home')} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <SproutLogo size={34} />
          <span style={{ fontSize: 20, fontWeight: 900, color: INDIGO, fontFamily: FONT, letterSpacing: -0.5 }}>Komek</span>
        </div>
        <LangSelector lang={lang} onChange={(l) => { setLang(l); localStorage.setItem('komek_lang', l); window.dispatchEvent(new CustomEvent('langchange', { detail: l })) }} />
      </div>

      <div style={{ display: 'flex', padding: '0 12px', direction: 'ltr', gap: 4 }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => {
            setActiveTab(tab.id)
            setShowGuide(false)
            window.dispatchEvent(new CustomEvent('tabchange', { detail: tab.id }))
            router.push('/home')
          }} style={{
            flex: 1, padding: '10px 8px',
            background: activeTab === tab.id && !isGuideActive ? SOFT : 'transparent',
            border: 'none',
            color: activeTab === tab.id && !isGuideActive ? INDIGO : '#9CA3AF',
            fontWeight: activeTab === tab.id && !isGuideActive ? 800 : 600,
            fontSize: 13, cursor: 'pointer', fontFamily: FONT, whiteSpace: 'nowrap',
            borderBottom: activeTab === tab.id && !isGuideActive ? `2px solid ${INDIGO}` : '2px solid transparent',
            borderRadius: '8px 8px 0 0', transition: 'all 0.2s',
          }}>
            {tab.label[lang] || tab.label.en}
          </button>
        ))}

        <div style={{ width: 1, height: 20, background: '#EDE9FE', margin: 'auto 4px', flexShrink: 0 }} />

        <div ref={guideRef} style={{ position: 'relative', flex: 1 }}>
          <button onClick={() => setShowGuide(o => !o)} style={{
            width: '100%', padding: '10px 8px',
            background: isGuideActive || showGuide ? SOFT : 'transparent',
            border: 'none',
            color: isGuideActive || showGuide ? INDIGO : '#9CA3AF',
            fontWeight: isGuideActive || showGuide ? 800 : 600,
            fontSize: 13, cursor: 'pointer', fontFamily: FONT, whiteSpace: 'nowrap',
            borderBottom: isGuideActive || showGuide ? `2px solid ${MINT}` : '2px solid transparent',
            borderRadius: '8px 8px 0 0', transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
          }}>
            🧭 {GUIDE_LABELS[lang] || GUIDE_LABELS.en}
            <span style={{ fontSize: 8, opacity: 0.6 }}>{showGuide ? '▲' : '▼'}</span>
          </button>

          {showGuide && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              background: '#fff', borderRadius: 20, overflow: 'hidden',
              boxShadow: '0 8px 40px rgba(79,70,229,0.15)', zIndex: 300, minWidth: 260,
              border: '1px solid #EDE9FE',
            }}>
              <div style={{ background: `linear-gradient(135deg, ${INDIGO}, ${INDIGO_LIGHT})`, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 22 }}>🤝</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: '#fff', fontFamily: FONT }}>🧭 {GUIDE_LABELS[lang]}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2, fontFamily: FONT }}>Your guide to life in the UK</div>
                </div>
              </div>
              {guideItems.map((item, i) => (
                <button key={i} onClick={() => { setShowGuide(false); router.push(item.route) }} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 18px', background: '#fff', border: 'none',
                  borderBottom: i < guideItems.length - 1 ? '1px solid #F5F4FF' : 'none',
                  cursor: 'pointer', textAlign: 'left', fontFamily: FONT,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#F5F4FF'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: SOFT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: INDIGO }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{item.sub}</div>
                  </div>
                  <span style={{ fontSize: 16, color: '#C4B5FD' }}>›</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function LangSelector({ lang, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const LANGS = [
    { id: 'en', flag: '🇬🇧', name: 'EN', full: 'English' },
    { id: 'ku', flag: null,   name: 'کوردی', full: 'Kurdish' },
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