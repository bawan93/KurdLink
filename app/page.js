'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const FONT = "'Plus Jakarta Sans', 'Sora', sans-serif"
const ORANGE = 'linear-gradient(135deg, #FF6B35, #FF8C61)'
const NAVY = '#1A2B5F'

const TX = {
  en: {
    tagline: 'Your trusted Kurdish community platform across the UK',
    sub: 'Find services, jobs, cars and businesses — all in one place',
    browse: 'Browse Now',
    signIn: 'Sign In',
    post: 'Post or List',
  },
  ku: {
    tagline: 'پلاتفۆرمی کۆمەڵگای کوردی متمانەپێکراو لە سەرانسەری UK',
    sub: 'خزمەتگوزاری، کار، ئۆتۆمبێل و بیزنس بدۆزەوە — هەموو لەک شوێنەوە',
    browse: 'ئێستا بگەڕێ',
    signIn: 'چوونەژوورەوە',
    post: 'پۆست یان لیست بکە',
  }
}

export default function Welcome() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const [pressed, setPressed] = useState(null)
  const [visible, setVisible] = useState(false)
  const t = TX[lang]
  const isRtl = lang === 'ku'

  useEffect(() => {
    // Fade in on mount
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
      <div style={{ position: 'absolute', top: '-10%', right: '-15%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.15), transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', left: '-10%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,180,216,0.1), transparent 70%)', pointerEvents: 'none' }} />

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
        padding: '20px 32px 60px',
        textAlign: 'center',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s ease',
      }}>

        {/* Logo */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🌍</div>
          <div style={{
            fontSize: 40,
            fontWeight: 900,
            background: ORANGE,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: -1,
            marginBottom: 16,
          }}>
            KurdLink
          </div>
          <p style={{
            fontSize: 16,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.85)',
            margin: '0 0 10px',
            lineHeight: 1.5,
            maxWidth: 300,
          }}>
            {t.tagline}
          </p>
          <p style={{
            fontSize: 14,
            color: 'rgba(255,255,255,0.5)',
            margin: 0,
            lineHeight: 1.6,
            maxWidth: 280,
          }}>
            {t.sub}
          </p>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex',
          gap: 24,
          marginBottom: 48,
          padding: '16px 24px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 20,
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          {[
            { num: '🔍', label: 'Services' },
            { num: '💼', label: 'Businesses' },
            { num: '🚗', label: 'Cars' },
            { num: '👥', label: 'Jobs' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20 }}>{s.num}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onPointerDown={() => setPressed('browse')}
            onPointerUp={() => setPressed(null)}
            onPointerLeave={() => setPressed(null)}
            onClick={() => router.push('/home')}
            style={{
              width: '100%',
              padding: '16px',
              background: ORANGE,
              border: 'none',
              borderRadius: 16,
              fontSize: 17,
              fontWeight: 800,
              color: '#fff',
              cursor: 'pointer',
              fontFamily: FONT,
              boxShadow: '0 6px 24px rgba(255,107,53,0.4)',
              transform: pressed === 'browse' ? 'scale(0.97)' : 'scale(1)',
              transition: 'all 0.15s',
            }}
          >
            {t.browse} →
          </button>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => router.push('/auth')}
              style={{
                flex: 1,
                padding: '13px',
                background: 'rgba(255,255,255,0.08)',
                border: '1.5px solid rgba(255,255,255,0.15)',
                borderRadius: 14,
                fontSize: 14,
                fontWeight: 700,
                color: '#fff',
                cursor: 'pointer',
                fontFamily: FONT,
              }}
            >
              {t.signIn}
            </button>
            <button
              onClick={() => router.push('/post')}
              style={{
                flex: 1,
                padding: '13px',
                background: 'rgba(255,255,255,0.08)',
                border: '1.5px solid rgba(255,255,255,0.15)',
                borderRadius: 14,
                fontSize: 14,
                fontWeight: 700,
                color: '#fff',
                cursor: 'pointer',
                fontFamily: FONT,
              }}
            >
              + {t.post}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom tagline */}
      <div style={{
        textAlign: 'center',
        padding: '0 20px 32px',
        fontSize: 11,
        color: 'rgba(255,255,255,0.25)',
        fontWeight: 600,
      }}>
        Trusted by the Kurdish community across the UK
      </div>
    </div>
  )
}