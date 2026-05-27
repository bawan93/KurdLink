'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const FONT = "'Plus Jakarta Sans', 'Sora', sans-serif"
const ORANGE = 'linear-gradient(135deg, #FF6B35, #FF8C61)'
const NAVY = '#1A2B5F'

const LANGUAGES = [
  {
    id: 'ku',
    flag: '🏴',
    flagEmoji: '🟡🔴🟢',
    name: 'کوردی',
    nameEn: 'Kurdish',
    dir: 'rtl',
    customFlag: true,
  },
  {
    id: 'en',
    flag: '🇬🇧',
    name: 'English',
    nameEn: 'English',
    dir: 'ltr',
    customFlag: false,
  },
  {
    id: 'fa',
    flag: '🇮🇷',
    name: 'فارسی',
    nameEn: 'Farsi',
    dir: 'rtl',
    customFlag: false,
  },
  {
    id: 'ar',
    flag: '🇮🇶',
    name: 'عربي',
    nameEn: 'Arabic',
    dir: 'rtl',
    customFlag: false,
  },
]

const TX = {
  en: {
    tagline: 'Connecting Kurdish communities across the UK',
    sub: 'Find trusted professionals, discover local businesses, explore job opportunities — all in one place.',
    browse: 'Browse Now',
    choose: 'Choose your language',
  },
  ku: {
    tagline: 'پەیوەندیکردنی کۆمەڵگای کورد لە سەرانسەری UK',
    sub: 'پیشەوەری متمانەپێکراو بدۆزەوە، بیزنسی ناوخۆ کتاب بکە، دەرفەتی کار بگەڕێ — هەموو لەک شوێنەوە.',
    browse: 'ئێستا بگەڕێ',
    choose: 'زمانەکەت هەڵبژێرە',
  },
  fa: {
    tagline: 'اتصال جوامع کردی در سراسر بریتانیا',
    sub: 'متخصصان مورد اعتماد را بیابید، کسب‌وکارهای محلی را کشف کنید، فرصت‌های شغلی را بررسی کنید.',
    browse: 'مرور کنید',
    choose: 'زبان خود را انتخاب کنید',
  },
  ar: {
    tagline: 'ربط المجتمعات الكردية في جميع أنحاء المملكة المتحدة',
    sub: 'ابحث عن محترفين موثوقين، اكتشف الأعمال المحلية، واستكشف فرص العمل — كل شيء في مكان واحد.',
    browse: 'تصفح الآن',
    choose: 'اختر لغتك',
  },
}

// Kurdish flag SVG as inline component (sun with rays — simplified)
function KurdishFlag({ size = 48 }) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 90 60" style={{ borderRadius: 4, display: 'block' }}>
      <rect width="90" height="20" fill="#FF0000" />
      <rect y="20" width="90" height="20" fill="#FFFFFF" />
      <rect y="40" width="90" height="20" fill="#009900" />
      <circle cx="45" cy="30" r="10" fill="#FF9800" />
      {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map((_, i) => {
        const angle = (i * 360 / 21) * Math.PI / 180
        const x1 = 45 + Math.cos(angle) * 10
        const y1 = 30 + Math.sin(angle) * 10
        const x2 = 45 + Math.cos(angle) * 14
        const y2 = 30 + Math.sin(angle) * 14
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FF9800" strokeWidth="1.2" />
      })}
    </svg>
  )
}

export default function Welcome() {
  const router = useRouter()
  const [lang, setLang] = useState('ku')
  const [pressed, setPressed] = useState(false)
  const [visible, setVisible] = useState(false)
  const t = TX[lang]
  const isRtl = lang !== 'en'

  useEffect(() => {
    // Load saved lang if exists
    const saved = localStorage.getItem('kurdlink_lang')
    if (saved && TX[saved]) setLang(saved)
    setTimeout(() => setVisible(true), 50)
  }, [])

  const handleSelectLang = (id) => {
    setLang(id)
    localStorage.setItem('kurdlink_lang', id)
  }

  const handleBrowse = () => {
    localStorage.setItem('kurdlink_lang', lang)
    router.push('/home')
  }

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

      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 32px 20px',
        textAlign: 'center',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'all 0.7s ease',
      }}>

        {/* Globe */}
        <div style={{ fontSize: 64, marginBottom: 16, lineHeight: 1 }}>🌍</div>

        {/* Logo */}
        <div style={{
          fontSize: 44,
          fontWeight: 900,
          background: ORANGE,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: -1,
          marginBottom: 16,
        }}>
          KurdLink
        </div>

        {/* Tagline */}
        <p style={{
          fontSize: 17,
          fontWeight: 700,
          color: '#fff',
          margin: '0 0 10px',
          lineHeight: 1.4,
          maxWidth: 300,
          transition: 'all 0.3s',
        }}>
          {t.tagline}
        </p>

        {/* Description */}
        <p style={{
          fontSize: 13,
          color: 'rgba(255,255,255,0.5)',
          margin: '0 0 36px',
          lineHeight: 1.7,
          maxWidth: 300,
          transition: 'all 0.3s',
        }}>
          {t.sub}
        </p>

        {/* Language selector label */}
        <p style={{
          fontSize: 12,
          fontWeight: 700,
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: 1,
          textTransform: 'uppercase',
          margin: '0 0 16px',
        }}>
          {t.choose}
        </p>

        {/* Language options — diagonal layout */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          width: '100%',
          maxWidth: 340,
          marginBottom: 32,
        }}>
          {LANGUAGES.map((l, i) => {
            const isSelected = lang === l.id
            const offsets = ['0px', '20px', '40px', '60px']
            return (
              <button
                key={l.id}
                onClick={() => handleSelectLang(l.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '12px 16px',
                  background: isSelected
                    ? 'rgba(255,107,53,0.18)'
                    : 'rgba(255,255,255,0.05)',
                  border: isSelected
                    ? '1.5px solid rgba(255,107,53,0.6)'
                    : '1.5px solid rgba(255,255,255,0.08)',
                  borderRadius: 14,
                  cursor: 'pointer',
                  fontFamily: FONT,
                  marginLeft: offsets[i],
                  transition: 'all 0.2s',
                  textAlign: 'left',
                  boxShadow: isSelected ? '0 4px 20px rgba(255,107,53,0.2)' : 'none',
                }}
              >
                {/* Flag */}
                <div style={{ flexShrink: 0, lineHeight: 1 }}>
                  {l.id === 'ku'
                    ? <KurdishFlag size={40} />
                    : <span style={{ fontSize: 32, lineHeight: 1 }}>{l.flag}</span>
                  }
                </div>

                {/* Language name */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: isSelected ? '#FF8C61' : '#fff',
                    direction: l.dir,
                  }}>
                    {l.name}
                  </div>
                  <div style={{
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.4)',
                    fontWeight: 600,
                    marginTop: 1,
                    direction: 'ltr',
                  }}>
                    {l.nameEn}
                  </div>
                </div>

                {/* Selected indicator */}
                <div style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  border: isSelected ? 'none' : '1.5px solid rgba(255,255,255,0.2)',
                  background: isSelected ? 'linear-gradient(135deg, #FF6B35, #FF8C61)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                }}>
                  {isSelected && <span style={{ fontSize: 11, color: '#fff' }}>✓</span>}
                </div>
              </button>
            )
          })}
        </div>

        {/* Browse Now button */}
        <button
          onPointerDown={() => setPressed(true)}
          onPointerUp={() => setPressed(false)}
          onPointerLeave={() => setPressed(false)}
          onClick={handleBrowse}
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
        padding: '0 20px 28px',
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