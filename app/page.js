'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const FONT = "'Plus Jakarta Sans', 'Sora', sans-serif"
const ORANGE = 'linear-gradient(135deg, #FF6B35, #FF8C61)'
const NAVY = '#1A2B5F'

const TX = {
  en: {
    dir: 'ltr',
    welcome: 'Welcome to KurdLink',
    tagline: 'Your trusted Kurdish community platform',
    question: 'What would you like to do?',
    options: [
      { icon: '🔍', title: 'Find Services', desc: 'Discover trusted Kurdish professionals near you', route: '/search' },
      { icon: '💼', title: 'Sell Your Business', desc: 'Find a buyer quickly and securely', route: '/listings/sell-business' },
      { icon: '🚗', title: 'Sell Your Car', desc: 'List your car and connect with buyers', route: '/listings/sell-car' },
      { icon: '👥', title: 'Hire Staff', desc: 'Post a job and find the right talent', route: '/listings/hire-staff' },
      { icon: '🎯', title: 'List My Service', desc: 'Build your verified professional profile', route: '/listings/list-service' },
    ],
    alreadyHave: 'Already have an account?',
    signIn: 'Sign In',
  },
  ku: {
    dir: 'rtl',
    welcome: 'بەخێربێیت بۆ KurdLink',
    tagline: 'پلاتفۆرمی کۆمەڵگای کوردیت',
    question: 'چیت دەیهوێت بکەی؟',
    options: [
      { icon: '🔍', title: 'بدۆزەوە خزمەتگوزاری', desc: 'پیشەوەری کوردی متمانەپێکراو نزیکت بدۆزەوە', route: '/search' },
      { icon: '💼', title: 'بیزنسەکەت بفرۆشە', desc: 'بە خێرایی و پارێزراوی کڕیار بدۆزەوە', route: '/listings/sell-business' },
      { icon: '🚗', title: 'ئۆتۆمبێلەکەت بفرۆشە', desc: 'ئۆتۆمبێلەکەت لیست بکە و کڕیار بدۆزەوە', route: '/listings/sell-car' },
      { icon: '👥', title: 'کارمەند بگرە', desc: 'کار پۆست بکە و ئەو بەتوانا بدۆزەوە', route: '/listings/hire-staff' },
      { icon: '🎯', title: 'خزمەتگوزاریەکەم لیست بکە', desc: 'پڕۆفایلی پیشەیی سەلماندراوت بنیاد بنێ', route: '/listings/list-service' },
    ],
    alreadyHave: 'حسابی هەیت؟',
    signIn: 'چوونەژوورەوە',
  }
}

export default function LandingChoice() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const [pressed, setPressed] = useState(null)
  const t = TX[lang]
  const isRtl = t.dir === 'rtl'

  return (
    <div style={{
      minHeight: '100vh',
      minHeight: '100dvh',
      background: `linear-gradient(160deg, ${NAVY} 0%, #0f2240 100%)`,
      fontFamily: FONT,
      direction: t.dir,
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden',
    }}>

      {/* ── HEADER ── */}
      <div style={{
        padding: '14px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}>
        <div style={{
          fontSize: 22,
          fontWeight: 800,
          background: ORANGE,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          KurdLink
        </div>

        {/* Lang toggle */}
        <div style={{
          display: 'flex',
          gap: 4,
          background: 'rgba(255,255,255,0.08)',
          padding: '5px 6px',
          borderRadius: 20,
        }}>
          {['en', 'ku'].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{
              padding: '6px 14px',
              background: lang === l ? '#fff' : 'transparent',
              color: lang === l ? NAVY : 'rgba(255,255,255,0.7)',
              border: 'none',
              borderRadius: 16,
              fontWeight: 700,
              fontSize: 12,
              cursor: 'pointer',
              fontFamily: FONT,
              transition: 'all 0.2s',
            }}>
              {l === 'en' ? 'EN' : 'KU'}
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{
        flex: 1,
        padding: '32px 20px 40px',
        maxWidth: 480,
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🌍</div>
          <h1 style={{
            fontSize: 26,
            fontWeight: 800,
            color: '#fff',
            margin: '0 0 8px',
            lineHeight: 1.2,
          }}>
            {t.welcome}
          </h1>
          <p style={{
            fontSize: 14,
            color: 'rgba(255,255,255,0.6)',
            margin: 0,
            fontWeight: 500,
          }}>
            {t.tagline}
          </p>
        </div>

        {/* Question */}
        <p style={{
          fontSize: 15,
          fontWeight: 700,
          color: 'rgba(255,255,255,0.9)',
          textAlign: 'center',
          margin: '0 0 16px',
        }}>
          {t.question}
        </p>

        {/* ── OPTION CARDS ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {t.options.map((opt, i) => (
            <button
              key={i}
              onPointerDown={() => setPressed(i)}
              onPointerUp={() => setPressed(null)}
              onPointerLeave={() => setPressed(null)}
              onClick={() => router.push(opt.route)}
              style={{
                background: pressed === i ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.07)',
                border: '1.5px solid rgba(255,255,255,0.12)',
                borderRadius: 16,
                padding: '16px 18px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: isRtl ? 'row-reverse' : 'row',
                alignItems: 'center',
                gap: 14,
                width: '100%',
                transform: pressed === i ? 'scale(0.98)' : 'scale(1)',
                transition: 'all 0.15s ease',
                boxSizing: 'border-box',
              }}
            >
              {/* Icon box */}
              <div style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                background: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                flexShrink: 0,
              }}>
                {opt.icon}
              </div>

              {/* Text */}
              <div style={{ flex: 1, textAlign: isRtl ? 'right' : 'left' }}>
                <p style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#fff',
                  margin: '0 0 3px',
                  lineHeight: 1.2,
                }}>
                  {opt.title}
                </p>
                <p style={{
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.55)',
                  margin: 0,
                  lineHeight: 1.4,
                }}>
                  {opt.desc}
                </p>
              </div>

              {/* Arrow */}
              <span style={{
                color: 'rgba(255,255,255,0.3)',
                fontSize: 20,
                flexShrink: 0,
                transform: isRtl ? 'rotate(180deg)' : 'none',
              }}>›</span>
            </button>
          ))}
        </div>

        {/* ── SIGN IN ── */}
        <div style={{
          textAlign: 'center',
          marginTop: 32,
          paddingTop: 24,
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}>
          <p style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.55)',
            margin: '0 0 12px',
          }}>
            {t.alreadyHave}
          </p>
          <button
            onClick={() => router.push('/auth')}
            style={{
              background: ORANGE,
              border: 'none',
              borderRadius: 14,
              padding: '14px 0',
              color: '#fff',
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer',
              fontFamily: FONT,
              width: '100%',
              maxWidth: 320,
              boxShadow: '0 4px 16px rgba(255,107,53,0.35)',
              transition: 'all 0.2s',
            }}
          >
            {t.signIn}
          </button>
        </div>
      </div>
    </div>
  )
} 