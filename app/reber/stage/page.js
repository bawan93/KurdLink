'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LangDropdown from '../../../components/LangDropdown'

const NAVY = '#1A2B5F'
const ORANGE = '#FF6B35'
const FONT = "'Plus Jakarta Sans', 'Sora', sans-serif"

const STAGES = [
  { id: 'arrived',  emoji: '🛬', color: '#3B82F6', label: { en: 'Just Arrived',  ku: 'تازە گەیشتووم',   fa: 'تازه رسیدم',   ar: 'وصلت للتو'    } },
  { id: 'waiting',  emoji: '⏳', color: '#F59E0B', label: { en: 'Waiting',       ku: 'چاوەڕوانم',       fa: 'در انتظارم',   ar: 'في الانتظار'  } },
  { id: 'granted',  emoji: '✅', color: '#10B981', label: { en: 'Status Granted', ku: 'مافم درا',        fa: 'تأیید شد',     ar: 'مُنح الوضع'   } },
  { id: 'refused',  emoji: '❌', color: '#EF4444', label: { en: 'Refused',        ku: 'ڕەتکرایەوە',     fa: 'رد شد',        ar: 'رُفض'         } },
  { id: 'settled',  emoji: '🏡', color: '#8B5CF6', label: { en: 'Settled',        ku: 'جێگیرکراوە',     fa: 'مستقر شدم',    ar: 'استقررت'      } },
  { id: 'citizen',  emoji: '🇬🇧', color: '#F59E0B', label: { en: 'Citizen Path',  ku: 'ڕێگای هاووڵاتی', fa: 'مسیر شهروندی', ar: 'مسار المواطنة'} },
]

const TX = {
  en: { title: 'My Stage', sub: 'Where are you in your journey?', back: '← Back' },
  ku: { title: 'قۆناغەکەم', sub: 'لە کوێیت لە گەشتەکەتدا؟', back: '→ گەڕانەوە' },
  fa: { title: 'مرحله من', sub: 'در کجای سفرت هستی؟', back: '→ بازگشت' },
  ar: { title: 'مرحلتي', sub: 'أين أنت في رحلتك؟', back: '→ رجوع' },
}

export default function MyStage() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const [activeStage, setActiveStage] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('kurdlink_lang')
    if (saved && TX[saved]) setLang(saved)
  }, [])

  const t = TX[lang] || TX.en
  const isRtl = lang === 'ku' || lang === 'fa' || lang === 'ar'
  const stage = activeStage ? STAGES.find(s => s.id === activeStage) : null

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF', fontFamily: FONT, direction: isRtl ? 'rtl' : 'ltr' }}>
      <div style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #2D4A9E 100%)`, padding: '16px 16px 20px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => activeStage ? setActiveStage(null) : router.push('/home')}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 22, cursor: 'pointer', padding: 0 }}>
              {isRtl ? '→' : '←'}
            </button>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>📍 {t.title}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>KurdLink</div>
            </div>
          </div>
          <LangDropdown lang={lang} onChange={(l) => { setLang(l); localStorage.setItem('kurdlink_lang', l) }} />
        </div>
      </div>

      {!activeStage && (
        <div style={{ padding: '24px 16px' }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginBottom: 20, textAlign: 'center' }}>{t.sub}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 500, margin: '0 auto' }}>
            {STAGES.map(stage => (
              <button key={stage.id} onClick={() => setActiveStage(stage.id)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 8, padding: '20px 12px', background: '#fff',
                border: `2px solid ${stage.color}30`, borderRadius: 18, cursor: 'pointer', fontFamily: FONT,
                boxShadow: `0 4px 16px ${stage.color}15`, transition: 'all 0.2s',
              }}>
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
          <div style={{ background: `linear-gradient(135deg, ${stage.color} 0%, ${stage.color}CC 100%)`, borderRadius: 20, padding: '20px', marginBottom: 20 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{stage.emoji}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>{stage.label[lang] || stage.label.en}</div>
          </div>
          <p style={{ fontSize: 14, color: '#666', textAlign: 'center', padding: '40px 20px' }}>
            Content coming soon...
          </p>
        </div>
      )}
    </div>
  )
}