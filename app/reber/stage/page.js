'use client'
import { useState, useEffect } from 'react'

const INDIGO = '#4F46E5'
const INDIGO_LIGHT = '#818CF8'
const FONT = "'Nunito', 'Plus Jakarta Sans', sans-serif"
const BG = '#F5F4FF'
const SOFT = '#EDE9FE'

const STAGES = [
  { id: 'arrived',  emoji: '🛬', color: '#3B82F6', label: { en: 'Just Arrived',  ku: 'تازە گەیشتووم',   fa: 'تازه رسیدم',   ar: 'وصلت للتو'    } },
  { id: 'waiting',  emoji: '⏳', color: '#F59E0B', label: { en: 'Waiting',       ku: 'چاوەڕوانم',       fa: 'در انتظارم',   ar: 'في الانتظار'  } },
  { id: 'granted',  emoji: '✅', color: '#10B981', label: { en: 'Status Granted', ku: 'مافم درا',        fa: 'تأیید شد',     ar: 'مُنح الوضع'   } },
  { id: 'refused',  emoji: '❌', color: '#EF4444', label: { en: 'Refused',        ku: 'ڕەتکرایەوە',     fa: 'رد شد',        ar: 'رُفض'         } },
  { id: 'settled',  emoji: '🏡', color: '#8B5CF6', label: { en: 'Settled',        ku: 'جێگیرکراوە',     fa: 'مستقر شدم',    ar: 'استقررت'      } },
  { id: 'citizen',  emoji: '🇬🇧', color: '#F59E0B', label: { en: 'Citizen Path',  ku: 'ڕێگای هاووڵاتی', fa: 'مسیر شهروندی', ar: 'مسار المواطنة'} },
]

const TX = {
  en: { title: 'My Stage', sub: 'Where are you in your journey?' },
  ku: { title: 'قۆناغەکەم', sub: 'لە کوێیت لە گەشتەکەتدا؟' },
  fa: { title: 'مرحله من', sub: 'در کجای سفرت هستی؟' },
  ar: { title: 'مرحلتي', sub: 'أين أنت في رحلتك؟' },
}

export default function MyStage() {
  const [lang, setLang] = useState('en')
  const [activeStage, setActiveStage] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('komek_lang')
    if (saved && TX[saved]) setLang(saved)
    const handler = (e) => setLang(e.detail)
    window.addEventListener('langchange', handler)
    return () => window.removeEventListener('langchange', handler)
  }, [])

  const t = TX[lang] || TX.en
  const isRtl = lang === 'ku' || lang === 'fa' || lang === 'ar'
  const stage = activeStage ? STAGES.find(s => s.id === activeStage) : null

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: FONT, direction: isRtl ? 'rtl' : 'ltr', paddingBottom: 80 }}>

      {!activeStage && (
        <div style={{ padding: '24px 16px' }}>
          <p style={{ fontSize: 16, fontWeight: 800, color: INDIGO, marginBottom: 20, textAlign: 'center' }}>{t.sub}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 500, margin: '0 auto' }}>
            {STAGES.map(stage => (
              <button key={stage.id} onClick={() => setActiveStage(stage.id)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 8, padding: '20px 12px', background: '#fff',
                border: `2px solid ${stage.color}30`, borderRadius: 18, cursor: 'pointer', fontFamily: FONT,
                boxShadow: `0 4px 16px ${stage.color}15`, transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <span style={{ fontSize: 32 }}>{stage.emoji}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: stage.color, textAlign: 'center', lineHeight: 1.3 }}>
                  {stage.label[lang] || stage.label.en}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeStage && stage && (
        <div style={{ padding: '16px 16px 32px' }}>
          <button onClick={() => setActiveStage(null)} style={{
            background: 'none', border: 'none', color: INDIGO, fontSize: 14, fontWeight: 700,
            cursor: 'pointer', fontFamily: FONT, marginBottom: 16, padding: 0,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {isRtl ? '→' : '←'} {t.title}
          </button>
          <div style={{ background: `linear-gradient(135deg, ${stage.color} 0%, ${stage.color}CC 100%)`, borderRadius: 20, padding: '20px', marginBottom: 20 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{stage.emoji}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>{stage.label[lang] || stage.label.en}</div>
          </div>
          <p style={{ fontSize: 14, color: '#9CA3AF', textAlign: 'center', padding: '40px 20px', fontWeight: 500 }}>
            Content coming soon...
          </p>
        </div>
      )}
    </div>
  )
}