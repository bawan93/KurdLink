'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import TX from '@/lib/translations'

const INDIGO = '#4F46E5'
const INDIGO_DARK = '#1C1A4F'
const SOFT = '#EDE9FE'
const BG = '#F5F4FF'
const FONT = "'Nunito', sans-serif"

const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export default function PostPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [lang, setLang] = useState('en')
  const isRTL = ['ku', 'fa', 'ar'].includes(lang)
  const t = (TX[lang] || TX.en).post

  useEffect(() => {
    const saved = localStorage.getItem('komek_lang')
    if (saved) setLang(saved)
    const handler = (e) => setLang(e.detail)
    window.addEventListener('langchange', handler)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace('/account?reason=post')
      else setChecking(false)
    })
    return () => window.removeEventListener('langchange', handler)
  }, [])

  const options = [
    { icon: '👥', title: t.hireStaff, desc: t.hireStaffDesc, route: '/listing/hire-staff' },
    { icon: '🛠️', title: t.listService, desc: t.listServiceDesc, route: '/listing/list-service' },
  ]

  if (checking) return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 36, height: 36, border: `3px solid ${SOFT}`, borderTopColor: INDIGO, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: FONT, direction: isRTL ? 'rtl' : 'ltr', paddingBottom: 80 }}>
      <div style={{ background: `linear-gradient(135deg, ${INDIGO_DARK} 0%, #2D2A7A 100%)`, padding: '40px 20px 56px', textAlign: 'center' }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>➕</div>
        <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 900, margin: '0 0 8px' }}>{t.heroTitle}</h1>
        <p style={{ color: '#818CF8', fontSize: 14, fontWeight: 500, margin: 0 }}>{t.heroSub}</p>
      </div>
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 16px', marginTop: -24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {options.map(opt => (
            <button key={opt.route} onClick={() => router.push(opt.route)}
              style={{ background: '#fff', border: `1.5px solid ${SOFT}`, borderRadius: 20, padding: '20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', textAlign: isRTL ? 'right' : 'left', fontFamily: FONT, boxShadow: '0 2px 12px rgba(79,70,229,0.08)', transition: 'all 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = INDIGO; e.currentTarget.style.background = SOFT }}
              onMouseOut={e => { e.currentTarget.style.borderColor = SOFT; e.currentTarget.style.background = '#fff' }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: SOFT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>{opt.icon}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 800, fontSize: 16, color: INDIGO_DARK, margin: '0 0 4px' }}>{opt.title}</p>
                <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>{opt.desc}</p>
              </div>
              <span style={{ color: INDIGO, fontSize: 20, opacity: 0.4 }}>→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}