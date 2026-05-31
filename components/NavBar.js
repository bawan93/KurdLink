'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const NAVY = '#1A2B5F'
const ORANGE = '#FF6B35'
const FONT = "'Plus Jakarta Sans', 'Sora', sans-serif"

const TABS = [
  { id: 'list_service',  label: { en: 'Services',   ku: 'خزمەتگوزاری', fa: 'خدمات',    ar: 'الخدمات'  } },
  { id: 'hire_staff',    label: { en: 'Jobs',        ku: 'کار',          fa: 'مشاغل',    ar: 'الوظائف'  } },
  { id: 'sell_car',      label: { en: 'Cars',        ku: 'ئۆتۆمبێل',    fa: 'ماشین‌ها', ar: 'السيارات' } },
  { id: 'sell_business', label: { en: 'Businesses',  ku: 'بیزنس',        fa: 'الأعمال',  ar: 'الأعمال'  } },
]

const GUIDE_LABELS = { en: 'Guide', ku: 'ڕێبەر', fa: 'راهنما', ar: 'الدليل' }

const GUIDE_ITEMS = {
  en: [
    { label: 'My Stage',               sub: 'Track your asylum journey',       icon: '📍', route: '/reber/stage' },
    { label: 'Info & Help',            sub: 'Health, rights, money & more',    icon: '📋', route: '/reber/info'  },
    { label: 'Ask a Question',         sub: 'Get answers from the community',  icon: '❓', route: '/reber/ask'   },
    { label: 'Understand Your Letter', sub: 'Explain any UK official letter',  icon: '📄', route: '/journey/document-explainer' },
  ],
  ku: [
    { label: 'قۆناغەکەم',             sub: 'گەشتی ئامادەیییەکەت شوێن بکەوە', icon: '📍', route: '/reber/stage' },
    { label: 'زانیاری و یارمەتی',     sub: 'تەندروستی، ماف، پارە و زیاتر',   icon: '📋', route: '/reber/info'  },
    { label: 'پرسیار بکە',             sub: 'وەڵام لە کۆمیونیتی وەربگرە',     icon: '❓', route: '/reber/ask'   },
    { label: 'نامەکەت شیبکە',          sub: 'هەر نامەی فەرمی UK ڕوونبکەرەوە', icon: '📄', route: '/journey/document-explainer' },
  ],
  fa: [
    { label: 'مرحله من',              sub: 'سفر پناهندگی‌ات را دنبال کن',    icon: '📍', route: '/reber/stage' },
    { label: 'اطلاعات و کمک',         sub: 'سلامت، حقوق، پول و بیشتر',       icon: '📋', route: '/reber/info'  },
    { label: 'سوال بپرس',             sub: 'از جامعه پاسخ بگیر',              icon: '❓', route: '/reber/ask'   },
    { label: 'نامه‌ات را بفهم',        sub: 'هر نامه رسمی UK را توضیح بده',   icon: '📄', route: '/journey/document-explainer' },
  ],
  ar: [
    { label: 'مرحلتي',               sub: 'تتبع رحلة اللجوء',                icon: '📍', route: '/reber/stage' },
    { label: 'معلومات ومساعدة',       sub: 'الصحة والحقوق والمال وأكثر',      icon: '📋', route: '/reber/info'  },
    { label: 'اطرح سؤالاً',           sub: 'احصل على إجابات من المجتمع',      icon: '❓', route: '/reber/ask'   },
    { label: 'افهم رسالتك',           sub: 'اشرح أي رسالة رسمية بريطانية',   icon: '📄', route: '/journey/document-explainer' },
  ],
}

export default function NavBar() {
  const router = useRouter()
  const pathname = usePathname()
  const [lang, setLang] = useState('en')
  const [showGuide, setShowGuide] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const guideRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem('kurdlink_lang')
    if (saved) setLang(saved)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (guideRef.current && !guideRef.current.contains(e.target)) setShowGuide(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Only hide on the welcome/browse page
  if (pathname === '/') return null

  const isGuideActive = pathname?.startsWith('/reber') || pathname?.startsWith('/journey')
  const guideItems = GUIDE_ITEMS[lang] || GUIDE_ITEMS.en

  return (
    <div style={{ background: NAVY, position: 'sticky', top: 0, zIndex: 200, direction: 'ltr' }}>
      {/* Top bar */}
      <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div onClick={() => router.push('/home')} style={{ fontSize: 20, fontWeight: 900, background: `linear-gradient(135deg, ${ORANGE}, #FF8C61)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer' }}>
          KurdLink
        </div>
        <LangSelector lang={lang} onChange={(l) => { setLang(l); localStorage.setItem('kurdlink_lang', l); window.dispatchEvent(new CustomEvent('langchange', { detail: l })) }} />
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', padding: '0 8px', direction: 'ltr' }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => {
            setActiveTab(tab.id)
            setShowGuide(false)
            window.dispatchEvent(new CustomEvent('tabchange', { detail: tab.id }))
            router.push('/home')
          }} style={{
            flex: 1, padding: '8px 4px',
            background: activeTab === tab.id && !isGuideActive ? 'rgba(255,255,255,0.15)' : 'transparent',
            border: 'none',
            color: activeTab === tab.id && !isGuideActive ? '#fff' : 'rgba(255,255,255,0.55)',
            fontWeight: activeTab === tab.id && !isGuideActive ? 700 : 600, fontSize: 12,
            cursor: 'pointer', fontFamily: FONT, whiteSpace: 'nowrap',
            borderBottom: activeTab === tab.id && !isGuideActive ? '2px solid #FF6B35' : '2px solid transparent',
            transition: 'all 0.2s',
          }}>
            {tab.label[lang] || tab.label.en}
          </button>
        ))}

        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.2)', margin: 'auto 4px', flexShrink: 0 }} />

        {/* Guide button */}
        <div ref={guideRef} style={{ position: 'relative', flex: 1 }}>
          <button onClick={() => setShowGuide(o => !o)} style={{
            width: '100%', padding: '8px 4px',
            background: isGuideActive || showGuide ? 'rgba(255,107,53,0.3)' : 'transparent',
            border: 'none', color: '#FF8C61', fontWeight: 800, fontSize: 12,
            cursor: 'pointer', fontFamily: FONT, whiteSpace: 'nowrap',
            borderBottom: isGuideActive || showGuide ? '2px solid #FF6B35' : '2px solid transparent',
            transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3,
          }}>
            🧭 {GUIDE_LABELS[lang] || GUIDE_LABELS.en} <span style={{ fontSize: 8, opacity: 0.7 }}>{showGuide ? '▲' : '▼'}</span>
          </button>

          {showGuide && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 10px)', right: 0,
              background: '#fff', borderRadius: 16, overflow: 'hidden',
              boxShadow: '0 8px 40px rgba(0,0,0,0.18)', zIndex: 300, minWidth: 240,
              border: '1px solid rgba(0,0,0,0.08)',
            }}>
              <div style={{ background: `linear-gradient(135deg, ${NAVY}, #2D4A9E)`, padding: '14px 16px' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>🧭 {GUIDE_LABELS[lang]}</div>
              </div>
              {guideItems.map((item, i) => (
                <button key={i} onClick={() => { setShowGuide(false); router.push(item.route) }} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 16px', background: '#fff', border: 'none',
                  borderBottom: i < guideItems.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer', textAlign: 'left', fontFamily: FONT,
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: '#f0f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{item.sub}</div>
                  </div>
                  <span style={{ fontSize: 16, color: '#ddd' }}>›</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div style={{ height: 10 }} />
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
        display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px',
        background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)',
        borderRadius: 20, color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: FONT,
      }}>
        {current.id === 'ku' ? <KurdFlag size={16} /> : <span style={{ fontSize: 16 }}>{current.flag}</span>}
        <span>{current.name}</span>
        <span style={{ fontSize: 9, opacity: 0.7 }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', zIndex: 400, minWidth: 160, border: '1px solid rgba(0,0,0,0.08)' }}>
          {LANGS.map(l => (
            <button key={l.id} onClick={() => { onChange(l.id); setOpen(false) }} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px',
              background: lang === l.id ? '#FFF4F0' : '#fff', border: 'none',
              borderBottom: '1px solid rgba(0,0,0,0.05)', cursor: 'pointer', textAlign: 'left', fontFamily: FONT,
            }}>
              {l.id === 'ku' ? <KurdFlag size={22} /> : <span style={{ fontSize: 22, flexShrink: 0 }}>{l.flag}</span>}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: lang === l.id ? ORANGE : '#1a1a1a' }}>{l.name}</div>
                <div style={{ fontSize: 11, color: '#aaa' }}>{l.full}</div>
              </div>
              {lang === l.id && <span style={{ color: ORANGE, fontSize: 14 }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function KurdFlag({ size = 22 }) {
  const w = size * 1.5
  const h = size
  return (
    <svg width={w} height={h} viewBox="0 0 90 60" style={{ borderRadius: 3, display: 'block', flexShrink: 0 }}>
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