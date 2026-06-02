'use client'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const INDIGO = '#4F46E5'
const INDIGO_LIGHT = '#818CF8'
const FONT = "'Nunito', 'Plus Jakarta Sans', sans-serif"

const TX = {
  en: { home: 'Home', post: 'Post', account: 'Account' },
  ku: { home: 'سەرەکی', post: 'پۆست', account: 'ئەکاونت' },
  fa: { home: 'خانه', post: 'پست', account: 'حساب' },
  ar: { home: 'الرئيسية', post: 'نشر', account: 'حسابي' },
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
      {/* Home */}
      <button onClick={() => router.push('/home')} style={{ flex: 1, padding: '10px 0 8px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, fontFamily: FONT }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: isHome ? '#EDE9FE' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M3 9.5L12 3L21 9.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" stroke={isHome ? INDIGO : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 21V12h6v9" stroke={isHome ? INDIGO : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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