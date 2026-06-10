'use client'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const INDIGO = '#4F46E5'
const INDIGO_LIGHT = '#818CF8'
const FONT = "'Nunito', 'Plus Jakarta Sans', sans-serif"

const TX = {
  en: { home: 'Komek', post: 'Post', account: 'Account' },
  ku: { home: 'کۆمەک', post: 'بڵاوکردنەوە', account: 'ئەکاونت' },
  fa: { home: 'کومک', post: 'ارسال', account: 'حساب' },
  ar: { home: 'كومك', post: 'نشر', account: 'حسابي' },
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
  const isHome = pathname === '/home'
  const isAccount = pathname === '/account'

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#fff', borderTop: '1px solid #EDE9FE',
      display: 'flex', zIndex: 500,
      paddingBottom: 'env(safe-area-inset-bottom)',
      boxShadow: '0 -4px 24px rgba(79,70,229,0.08)',
      direction: 'ltr',
    }}>
      {/* Komek / Home */}
      <button onClick={() => router.push('/home')} style={{ flex: 1, padding: '10px 0 8px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, fontFamily: FONT }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: isHome ? '#EDE9FE' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
          <svg width="18" height="18" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="bnsbg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isHome ? INDIGO : '#9CA3AF'} />
                <stop offset="100%" stopColor={isHome ? INDIGO_LIGHT : '#9CA3AF'} />
              </linearGradient>
              <linearGradient id="bnsl" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={isHome ? '#059669' : '#9CA3AF'} />
                <stop offset="100%" stopColor={isHome ? '#6EE7B7' : '#9CA3AF'} />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="url(#bnsbg)" />
            <path d="M 50 76 L 50 45" stroke="white" strokeWidth="7" strokeLinecap="round" fill="none" />
            <path d="M 50 60 Q 26 55 22 34 Q 44 28 52 56 Z" fill="url(#bnsl)" />
            <path d="M 50 50 Q 72 44 76 23 Q 56 17 48 46 Z" fill="url(#bnsl)" opacity="0.85" />
          </svg>
        </div>
        <span style={{ fontSize: 10, fontWeight: 800, color: isHome ? INDIGO : '#9CA3AF' }}>{t.home}</span>
      </button>

      {/* Post */}
      <button onClick={() => router.push('/post')} style={{ flex: 1, padding: '10px 0 8px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, fontFamily: FONT }}>
        <div style={{ width: 48, height: 48, background: `linear-gradient(135deg, ${INDIGO}, ${INDIGO_LIGHT})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: -22, boxShadow: '0 4px 20px rgba(79,70,229,0.45)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
        <span style={{ fontSize: 10, fontWeight: 800, color: '#9CA3AF', marginTop: 2 }}>{t.post}</span>
      </button>

      {/* Account */}
      <button onClick={() => router.push('/account')} style={{ flex: 1, padding: '10px 0 8px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, fontFamily: FONT }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: isAccount ? '#EDE9FE' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke={isAccount ? INDIGO : '#9CA3AF'} strokeWidth="2" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={isAccount ? INDIGO : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <span style={{ fontSize: 10, fontWeight: 800, color: isAccount ? INDIGO : '#9CA3AF' }}>{t.account}</span>
      </button>
    </div>
  )
}