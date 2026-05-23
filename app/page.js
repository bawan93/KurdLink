'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const FONT = "'Plus Jakarta Sans', 'Sora', sans-serif"
const ORANGE = 'linear-gradient(135deg, #FF6B35, #FF8C61)'
const NAVY = '#1A2B5F'

const TX = {
  en: {
    tagline: 'Connecting Kurdish communities across the UK',
    sub: 'Find trusted professionals, discover local businesses, explore job opportunities — all in one place built for our community.',
    browse: 'Browse Now',
  },
  ku: {
    tagline: 'پەیوەندیکردنی کۆمەڵگای کورد لە سەرانسەری UK',
    sub: 'پیشەوەری متمانەپێکراو بدۆزەوە، بیزنسی ناوخۆ کتاب بکە، دەرفەتی کار بگەڕێ — هەموو لەک شوێنەوە بۆ کۆمەڵگەکەمان.',
    browse: 'ئێستا بگەڕێ',
  }
}

export default function Welcome() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const [pressed, setPressed] = useState(false)
  const [visible, setVisible] = useState(false)
  const t = TX[lang]
  const isRtl = lang === 'ku'

  useEffect(() => {
    setTimeout(() => setVisible(true), 50)
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      minHeight: '100dvh',
      background: `linear-gradient(160deg, ${NAVY} 0%, #0a1628 100%)`,
      fontFamily: FONT,
      direction: isRtl ? 'rtl' : 'ltr',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Decorative blobs */}
      <div style={{ position: 'absolute', top: '-10%', right: '-15%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.12), transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '5%', left: '-10%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,180,216,0.08), transparent 70%)', pointerEvents: 'none' }} />

      {/* Language toggle */}
      <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.08)', padding: '5px 6px', borderRadius: 20 }}>
          {['en', 'ku'].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{
              padding: '6px 14px',
              background: lang === l ? '#fff' : 'transparent',
              color: lang === l ? NAVY : 'rgba(255,255,255,0.7)',
              border: 'none', borderRadius: 16, fontWeight: 700, fontSize: 12,
              cursor: 'pointer', fontFamily: FONT,
            }}>
              {l === 'en' ? 'EN' : 'KU'}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px 32px 80px',
        textAlign: 'center',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'all 0.7s ease',
      }}>

        {/* Globe */}
        <div style={{ fontSize: 72, marginBottom: 24, lineHeight: 1 }}>🌍</div>

        {/* Logo */}
        <div style={{
          fontSize: 44,
          fontWeight: 900,
          background: ORANGE,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: -1,
          marginBottom: 20,
        }}>
          KurdLink
        </div>

        {/* Tagline */}
        <p style={{
          fontSize: 18,
          fontWeight: 700,
          color: '#fff',
          margin: '0 0 14px',
          lineHeight: 1.4,
          maxWidth: 300,
        }}>
          {t.tagline}
        </p>

        {/* Description */}
        <p style={{
          fontSize: 14,
          color: 'rgba(255,255,255,0.55)',
          margin: '0 0 52px',
          lineHeight: 1.7,
          maxWidth: 300,
        }}>
          {t.sub}
        </p>

        {/* Browse Now button */}
        <button
          onPointerDown={() => setPressed(true)}
          onPointerUp={() => setPressed(false)}
          onPointerLeave={() => setPressed(false)}
          onClick={() => router.push('/home')}
          style={{
            width: '100%',
            maxWidth: 340,
            padding: '17px',
            background: ORANGE,
            border: 'none',
            borderRadius: 16,
            fontSize: 17,
            fontWeight: 800,
            color: '#fff',
            cursor: 'pointer',
            fontFamily: FONT,
            boxShadow: '0 8px 28px rgba(255,107,53,0.45)',
            transform: pressed ? 'scale(0.97)' : 'scale(1)',
            transition: 'all 0.15s',
            letterSpacing: 0.2,
          }}
        >
          {t.browse} →
        </button>
      </div>

      {/* Bottom */}
      <div style={{
        textAlign: 'center',
        padding: '0 20px 32px',
        fontSize: 11,
        color: 'rgba(255,255,255,0.2)',
        fontWeight: 600,
        letterSpacing: 0.5,
      }}>
        BUILT FOR THE KURDISH COMMUNITY · UK
      </div>
    </div>
  )
}