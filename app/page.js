'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const FONT = "'Plus Jakarta Sans', 'Sora', sans-serif"
const ORANGE = 'linear-gradient(135deg, #FF6B35, #FF8C61)'
const NAVY = '#1A2B5F'

const TX = {
  en: { dir: 'ltr', welcome: 'Welcome to KurdLink', tagline: 'Your trusted Kurdish community platform across the UK', browse: 'Browse Listings', browseDesc: 'Find services, jobs, cars and businesses', post: 'Post or List', postDesc: 'Sell, hire or advertise your service', alreadyHave: 'Already have an account?', signIn: 'Sign In' },
  ku: { dir: 'rtl', welcome: 'بەخێربێیت بۆ KurdLink', tagline: 'پلاتفۆرمی کۆمەڵگای کوردی متمانەپێکراو لە سەرانسەری UK', browse: 'بگەڕێ لە لیستەکان', browseDesc: 'خزمەتگوزاری، کار، ئۆتۆمبێل و بیزنس بدۆزەوە', post: 'پۆست یان لیست بکە', postDesc: 'بفرۆشە، کارمەند بگرە یان خزمەتگوزاریەکەت ڕێکلام بکە', alreadyHave: 'ئەکاونتی هەیت؟', signIn: 'چوونەژوورەوە' }
}

export default function Landing() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const [pressed, setPressed] = useState(null)
  const t = TX[lang]
  const isRtl = t.dir === 'rtl'

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #1A2B5F 0%, #0f2240 100%)', fontFamily: FONT, direction: t.dir, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, zIndex: 10, backdropFilter: 'blur(12px)' }}>
        <div style={{ fontSize: 22, fontWeight: 800, background: ORANGE, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>KurdLink</div>
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.08)', padding: '5px 6px', borderRadius: 20 }}>
          {['en', 'ku'].map(l => (<button key={l} onClick={() => setLang(l)} style={{ padding: '6px 14px', background: lang === l ? '#fff' : 'transparent', color: lang === l ? '#1A2B5F' : 'rgba(255,255,255,0.7)', border: 'none', borderRadius: 16, fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: FONT }}>{l === 'en' ? 'EN' : 'KU'}</button>))}
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 24px', maxWidth: 480, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🌍</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', margin: '0 0 12px', lineHeight: 1.2 }}>{t.welcome}</h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.6 }}>{t.tagline}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <button onPointerDown={() => setPressed('browse')} onPointerUp={() => setPressed(null)} onPointerLeave={() => setPressed(null)} onClick={() => router.push('/home')} style={{ width: '100%', background: ORANGE, border: 'none', borderRadius: 18, padding: '20px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, transform: pressed === 'browse' ? 'scale(0.98)' : 'scale(1)', transition: 'all 0.15s', boxShadow: '0 6px 24px rgba(255,107,53,0.4)', boxSizing: 'border-box' }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>🔍</div>
            <div style={{ textAlign: 'left', flex: 1 }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 3 }}>{t.browse}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{t.browseDesc}</div>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 22 }}>›</span>
          </button>
          <button onPointerDown={() => setPressed('post')} onPointerUp={() => setPressed(null)} onPointerLeave={() => setPressed(null)} onClick={() => router.push('/post')} style={{ width: '100%', background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: 18, padding: '20px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, transform: pressed === 'post' ? 'scale(0.98)' : 'scale(1)', transition: 'all 0.15s', boxSizing: 'border-box' }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>✏️</div>
            <div style={{ textAlign: 'left', flex: 1 }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 3 }}>{t.post}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{t.postDesc}</div>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 22 }}>›</span>
          </button>
        </div>
        <div style={{ textAlign: 'center', marginTop: 36, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>{t.alreadyHave} </span>
          <span onClick={() => router.push('/auth')} style={{ fontSize: 14, fontWeight: 700, color: '#FF6B35', cursor: 'pointer' }}>{t.signIn}</span>
        </div>
      </div>
    </div>
  )
}
