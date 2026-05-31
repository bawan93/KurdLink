'use client'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const ORANGE = '#FF6B35'
const FONT = "'Plus Jakarta Sans', 'Sora', sans-serif"

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
    const saved = localStorage.getItem('kurdlink_lang')
    if (saved) setLang(saved)
    const handler = (e) => setLang(e.detail)
    window.addEventListener('langchange', handler)
    return () => window.removeEventListener('langchange', handler)
  }, [])

  // Only hide on the welcome/browse page
  if (pathname === '/') return null

  const t = TX[lang] || TX.en
  const isHome = pathname === '/home'
  const isPost = pathname === '/post'
  const isAccount = pathname === '/account'

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid rgba(0,0,0,0.08)', display: 'flex', zIndex: 500, paddingBottom: 'env(safe-area-inset-bottom)', boxShadow: '0 -4px 20px rgba(0,0,0,0.06)', direction: 'ltr' }}>
      <button onClick={() => router.push('/home')} style={{ flex: 1, padding: '10px 0 8px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, fontFamily: FONT }}>
        <span style={{ fontSize: 20 }}>🏠</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: isHome ? ORANGE : '#aaa' }}>{t.home}</span>
      </button>

      <button onClick={() => router.push('/post')} style={{ flex: 1, padding: '10px 0 8px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, fontFamily: FONT }}>
        <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #FF6B35, #FF8C61)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginTop: -20, boxShadow: '0 4px 16px rgba(255,107,53,0.5)' }}>➕</div>
        <span style={{ fontSize: 10, fontWeight: 700, color: isPost ? ORANGE : '#aaa', marginTop: 2 }}>{t.post}</span>
      </button>

      <button onClick={() => router.push('/account')} style={{ flex: 1, padding: '10px 0 8px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, fontFamily: FONT }}>
        <span style={{ fontSize: 20 }}>👤</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: isAccount ? ORANGE : '#aaa' }}>{t.account}</span>
      </button>
    </div>
  )
}