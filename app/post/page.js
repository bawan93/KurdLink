'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const FONT = "'Plus Jakarta Sans', 'Sora', sans-serif"
const ORANGE = 'linear-gradient(135deg, #FF6B35, #FF8C61)'
const NAVY = '#1A2B5F'

const OPTIONS = [
  { id: 'list-service', icon: '🎯', color: '#FF006E', bg: 'rgba(255,0,110,0.08)', en: 'List My Service', ku: 'خزمەتگوزاریەکەم لیست بکە', descEn: 'Advertise your profession or business service', descKu: 'پیشەیەکەت یان خزمەتگوزاریەکەت ڕێکلام بکە' },
  { id: 'sell-business', icon: '💼', color: '#FFB703', bg: 'rgba(255,183,3,0.08)', en: 'Sell Your Business', ku: 'بیزنسەکەت بفرۆشە', descEn: 'Find a buyer for your business quickly', descKu: 'بە خێرایی کڕیار بۆ بیزنسەکەت بدۆزەوە' },
  { id: 'sell-car', icon: '🚗', color: '#00B4D8', bg: 'rgba(0,180,216,0.08)', en: 'Sell Your Car', ku: 'ئۆتۆمبێلەکەت بفرۆشە', descEn: 'List your car and connect with buyers', descKu: 'ئۆتۆمبێلەکەت لیست بکە و کڕیار بدۆزەوە' },
  { id: 'hire-staff', icon: '👥', color: '#06D6A0', bg: 'rgba(6,214,160,0.08)', en: 'Hire Staff', ku: 'کارمەند بگرە', descEn: 'Post a job and find the right talent', descKu: 'کار پۆست بکە و ئەو بەتوانا بدۆزەوە' },
]

export default function Post() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const [pressed, setPressed] = useState(null)
  const isRtl = lang === 'ku'

  return (
    <div style={{ minHeight: '100vh', minHeight: '100dvh', background: '#f7f7f5', fontFamily: FONT, direction: isRtl ? 'rtl' : 'ltr', paddingBottom: 40 }}>

      {/* Header */}
      <div style={{ background: NAVY, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 15, cursor: 'pointer', fontFamily: FONT, fontWeight: 600 }}>← {lang === 'en' ? 'Back' : 'گەڕانەوە'}</button>
        <div style={{ fontSize: 18, fontWeight: 900, background: ORANGE, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>KurdLink</div>
        <div style={{ display: 'flex', gap: 3, background: 'rgba(255,255,255,0.15)', padding: '4px 5px', borderRadius: 16 }}>
          {['en', 'ku'].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ padding: '5px 10px', background: lang === l ? '#fff' : 'transparent', color: lang === l ? NAVY : 'rgba(255,255,255,0.7)', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 11, cursor: 'pointer', fontFamily: FONT }}>
              {l === 'en' ? 'EN' : 'KU'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '24px 20px', boxSizing: 'border-box' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: NAVY, margin: '0 0 6px' }}>
            {lang === 'en' ? 'What would you like to post?' : 'چیت دەیهوێت پۆست بکەی؟'}
          </h1>
          <p style={{ fontSize: 14, color: '#888', margin: 0, lineHeight: 1.5 }}>
            {lang === 'en' ? 'Select a category and fill in the details — no account needed.' : 'پۆلێک هەڵبژێرە و زانیاریەکان پڕ بکەوە — ئەکاونت پێویست نییە.'}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {OPTIONS.map(opt => (
            <button
              key={opt.id}
              onPointerDown={() => setPressed(opt.id)}
              onPointerUp={() => setPressed(null)}
              onPointerLeave={() => setPressed(null)}
              onClick={() => router.push(`/listings/${opt.id}`)}
              style={{
                background: '#fff',
                border: `1.5px solid ${pressed === opt.id ? opt.color : 'rgba(0,0,0,0.07)'}`,
                borderRadius: 16,
                padding: '16px 18px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: isRtl ? 'row-reverse' : 'row',
                alignItems: 'center',
                gap: 14,
                textAlign: isRtl ? 'right' : 'left',
                transform: pressed === opt.id ? 'scale(0.98)' : 'scale(1)',
                transition: 'all 0.15s',
                boxShadow: pressed === opt.id ? `0 4px 16px ${opt.color}30` : '0 2px 8px rgba(0,0,0,0.04)',
                boxSizing: 'border-box',
                width: '100%',
              }}
            >
              <div style={{ width: 50, height: 50, borderRadius: 14, background: opt.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                {opt.icon}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 800, color: NAVY, margin: '0 0 3px' }}>{lang === 'en' ? opt.en : opt.ku}</p>
                <p style={{ fontSize: 12, color: '#888', margin: 0, lineHeight: 1.4 }}>{lang === 'en' ? opt.descEn : opt.descKu}</p>
              </div>
              <span style={{ color: 'rgba(0,0,0,0.2)', fontSize: 20, flexShrink: 0 }}>›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}