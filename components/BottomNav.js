'use client'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const INDIGO = '#4F46E5'
const INDIGO_LIGHT = '#818CF8'
const MINT = '#34D399'
const SOFT = '#EDE9FE'
const FONT = "'Nunito', 'Plus Jakarta Sans', sans-serif"

const TX = {
  en: { letters: 'Letters', ask: 'Ask', guide: 'Guide', services: 'Services' },
  ku: { letters: 'نامەکان', ask: 'پرسیار', guide: 'ڕێبەر', services: 'خزمەتگوزاری' },
  fa: { letters: 'نامه‌ها', ask: 'سوال', guide: 'راهنما', services: 'خدمات' },
  ar: { letters: 'الرسائل', ask: 'سؤال', guide: 'الدليل', services: 'الخدمات' },
}

export default function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()
  const [lang, setLang] = useState('en')

  useEffect(() => {
    const saved = localStorage.getItem('komek_lang')
    if (saved) setLang(saved)
    const handler = (e) => setLang(e.detail)
    window.addEventListener('langchange', handler)
    return () => window.removeEventListener('langchange', handler)
  }, [])

  if (pathname === '/') return null

  const t = TX[lang] || TX.en

  const isLetters = pathname?.startsWith('/journey')
  const isAsk = pathname === '/reber/ask'
  const isGuide = pathname?.startsWith('/reber') && !isAsk
  const isServices = pathname === '/home' || pathname?.startsWith('/listing') || pathname?.startsWith('/services') || pathname?.startsWith('/post')

  const tabs = [
    {
      id: 'letters',
      label: t.letters,
      active: isLetters,
      color: MINT,
      icon: (active) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="18" height="14" rx="2" stroke={active ? MINT : '#9CA3AF'} strokeWidth="2" />
          <path d="M3 9l9 5 9-5" stroke={active ? MINT : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      onPress: () => router.push('/journey/document-explainer'),
    },
    {
      id: 'ask',
      label: t.ask,
      active: isAsk,
      color: '#F59E0B',
      icon: (active) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke={active ? '#F59E0B' : '#9CA3AF'} strokeWidth="2" />
          <path d="M9.5 9.5a2.5 2.5 0 015 .5c0 2-2.5 2.5-2.5 4" stroke={active ? '#F59E0B' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="17.5" r="0.75" fill={active ? '#F59E0B' : '#9CA3AF'} />
        </svg>
      ),
      onPress: () => router.push('/reber/ask'),
    },
    {
      id: 'guide',
      label: t.guide,
      active: isGuide,
      color: INDIGO,
      icon: (active) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M4 19V6a2 2 0 012-2h12a2 2 0 012 2v13" stroke={active ? INDIGO : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" />
          <path d="M4 19a2 2 0 002 2h12a2 2 0 002-2" stroke={active ? INDIGO : '#9CA3AF'} strokeWidth="2" />
          <path d="M9 8h6M9 12h6M9 16h4" stroke={active ? INDIGO : '#9CA3AF'} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      onPress: () => router.push('/reber/coming-to-uk'),
    },
    {
      id: 'services',
      label: t.services,
      active: isServices,
      color: '#059669',
      icon: (active) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="8" height="8" rx="2" stroke={active ? '#059669' : '#9CA3AF'} strokeWidth="2" />
          <rect x="13" y="3" width="8" height="8" rx="2" stroke={active ? '#059669' : '#9CA3AF'} strokeWidth="2" />
          <rect x="3" y="13" width="8" height="8" rx="2" stroke={active ? '#059669' : '#9CA3AF'} strokeWidth="2" />
          <rect x="13" y="13" width="8" height="8" rx="2" stroke={active ? '#059669' : '#9CA3AF'} strokeWidth="2" />
        </svg>
      ),
      onPress: () => router.push('/home'),
    },
  ]

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#fff',
      borderTop: '1px solid #EDE9FE',
      display: 'flex',
      zIndex: 500,
      paddingBottom: 'env(safe-area-inset-bottom)',
      boxShadow: '0 -4px 24px rgba(79,70,229,0.08)',
      direction: 'ltr',
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={tab.onPress}
          style={{
            flex: 1, padding: '10px 0 8px', background: 'none', border: 'none',
            cursor: 'pointer', display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 3, fontFamily: FONT,
          }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: tab.active ? `${tab.color}18` : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}>
            {tab.icon(tab.active)}
          </div>
          <span style={{
            fontSize: 10, fontWeight: 800,
            color: tab.active ? tab.color : '#9CA3AF',
          }}>
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  )
}