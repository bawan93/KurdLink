'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

function getSupabase() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

const FONT = "'Nunito', 'Plus Jakarta Sans', sans-serif"
const INDIGO = '#4F46E5'
const INDIGO_LIGHT = '#818CF8'
const INDIGO_DARK = '#1C1A4F'
const MINT = '#34D399'
const SOFT = '#EDE9FE'
const BG = '#F5F4FF'

const TX = {
  en: {
    heroLabel: 'FREE · AI POWERED',
    heroTitle: 'Got a letter from the Home Office?',
    heroSub: 'Upload any UK official letter and understand it instantly — in your language.',
    heroCta: 'Explain My Letter',
    usesLeft: 'free uses left today',
    guideTitle: 'Your Journey Guide',
    guideSub: 'Step by step from arrival to citizenship',
    stages: [
      { label: 'New to UK', color: INDIGO, route: '/reber/new-to-uk', icon: '✈️' },
      { label: 'Leave to Remain', color: '#059669', route: '/reber/leave-to-remain', icon: '✅' },
      { label: 'Citizenship', color: '#7C3AED', route: '/reber/citizenship', icon: '🇬🇧' },
    ],
    askTitle: 'Ask the Community',
    askSub: 'Real questions from people like you',
    askCta: 'Ask a Question',
    servicesTitle: 'Services & Jobs',
    servicesSub: 'Find Kurdish businesses and job opportunities',
    noListings: 'No listings yet',
    loading: 'Loading…',
    call: 'Call',
  },
  ku: {
    heroLabel: 'بەخۆڕایی · AI',
    heroTitle: 'نامەیەکت لە ئۆفیسی ناوخۆ هەیە؟',
    heroSub: 'هەر نامەیەکی فەرمیی UK بار بکە و فەوری تێبگە — بە زمانی خۆت.',
    heroCta: 'نامەکەم شیبکە',
    usesLeft: 'بەکارهێنانی بەخۆڕایی ئەمڕۆ ماون',
    guideTitle: 'ڕێنمای گەشتەکەت',
    guideSub: 'هەنگاو بە هەنگاو لە گەیشتن تا هاووڵاتیی',
    stages: [
      { label: 'تازە گەیشتوویت', color: INDIGO, route: '/reber/new-to-uk', icon: '✈️' },
      { label: 'مۆڵەتی مانەوە', color: '#059669', route: '/reber/leave-to-remain', icon: '✅' },
      { label: 'هاووڵاتیی', color: '#7C3AED', route: '/reber/citizenship', icon: '🇬🇧' },
    ],
    askTitle: 'پرسیار لە کۆمیونیتی',
    askSub: 'پرسیارە راستەقینەکان لە کەسانی وەک تۆ',
    askCta: 'پرسیار بکە',
    servicesTitle: 'خزمەتگوزاری و کار',
    servicesSub: 'کارو بارێکی کوردی و دەرفەتی کار بدۆزەرەوە',
    noListings: 'هێشتا هیچ لیستێک نییە',
    loading: 'چاوەڕوانبە…',
    call: 'پەیوەندی',
  },
  fa: {
    heroLabel: 'رایگان · هوش مصنوعی',
    heroTitle: 'نامه‌ای از Home Office داری؟',
    heroSub: 'هر نامه رسمی UK را آپلود کن و فوری بفهم — به زبان خودت.',
    heroCta: 'نامه‌ام را توضیح بده',
    usesLeft: 'استفاده رایگان امروز باقی مانده',
    guideTitle: 'راهنمای سفر تو',
    guideSub: 'گام به گام از ورود تا شهروندی',
    stages: [
      { label: 'تازه رسیدی', color: INDIGO, route: '/reber/new-to-uk', icon: '✈️' },
      { label: 'اجازه اقامت', color: '#059669', route: '/reber/leave-to-remain', icon: '✅' },
      { label: 'شهروندی', color: '#7C3AED', route: '/reber/citizenship', icon: '🇬🇧' },
    ],
    askTitle: 'از جامعه بپرس',
    askSub: 'سوالات واقعی از افرادی مثل تو',
    askCta: 'سوال بپرس',
    servicesTitle: 'خدمات و مشاغل',
    servicesSub: 'کسب‌وکارهای کردی و فرصت‌های شغلی',
    noListings: 'هنوز آگهی‌ای نیست',
    loading: 'در حال بارگذاری…',
    call: 'تماس',
  },
  ar: {
    heroLabel: 'مجاني · ذكاء اصطناعي',
    heroTitle: 'لديك رسالة من وزارة الداخلية؟',
    heroSub: 'ارفع أي رسالة رسمية بريطانية وافهمها فوراً — بلغتك.',
    heroCta: 'اشرح رسالتي',
    usesLeft: 'استخدامات مجانية متبقية اليوم',
    guideTitle: 'دليل رحلتك',
    guideSub: 'خطوة بخطوة من الوصول إلى الجنسية',
    stages: [
      { label: 'وصلت للتو', color: INDIGO, route: '/reber/new-to-uk', icon: '✈️' },
      { label: 'الإذن بالبقاء', color: '#059669', route: '/reber/leave-to-remain', icon: '✅' },
      { label: 'الجنسية', color: '#7C3AED', route: '/reber/citizenship', icon: '🇬🇧' },
    ],
    askTitle: 'اسأل المجتمع',
    askSub: 'أسئلة حقيقية من أشخاص مثلك',
    askCta: 'اطرح سؤالاً',
    servicesTitle: 'الخدمات والوظائف',
    servicesSub: 'اعثر على أعمال كردية وفرص عمل',
    noListings: 'لا توجد إعلانات بعد',
    loading: 'جاري التحميل…',
    call: 'اتصال',
  },
}

function SectionHeader({ label, sub, cta, onCta, ctaColor }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
      <div>
        <div style={{ fontSize: 17, fontWeight: 900, color: INDIGO_DARK, letterSpacing: -0.3 }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500, marginTop: 2 }}>{sub}</div>}
      </div>
      {cta && (
        <button onClick={onCta} style={{ fontSize: 12, fontWeight: 800, color: ctaColor || INDIGO, background: SOFT, border: 'none', borderRadius: 20, padding: '6px 14px', cursor: 'pointer', fontFamily: FONT, whiteSpace: 'nowrap' }}>
          {cta} →
        </button>
      )}
    </div>
  )
}

export default function Home() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [usesLeft, setUsesLeft] = useState(10)
  const t = TX[lang] || TX.en
  const isRtl = lang === 'ku' || lang === 'fa' || lang === 'ar'

  useEffect(() => {
    const saved = localStorage.getItem('komek_lang')
    if (saved && TX[saved]) setLang(saved)
    const handler = (e) => { if (TX[e.detail]) setLang(e.detail) }
    window.addEventListener('langchange', handler)

    // Check document explainer uses left
    const key = 'doc_explainer_uses'
    const dateKey = 'doc_explainer_date'
    const today = new Date().toDateString()
    const savedDate = localStorage.getItem(dateKey)
    if (savedDate !== today) {
      localStorage.setItem(dateKey, today)
      localStorage.setItem(key, '10')
      setUsesLeft(10)
    } else {
      const uses = parseInt(localStorage.getItem(key) || '10')
      setUsesLeft(uses)
    }

    return () => window.removeEventListener('langchange', handler)
  }, [])

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    setLoading(true)
    try {
      const supabase = getSupabase()
      const { data } = await supabase
        .from('listings')
        .select('*')
        .in('type', ['list_service', 'hire_staff'])
        .in('status', ['approved', 'sold', 'filled'])
        .order('created_at', { ascending: false })
        .limit(4)
      setListings(data || [])
    } catch (e) {
      setListings([])
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', minHeight: '100dvh', background: BG, fontFamily: FONT, direction: isRtl ? 'rtl' : 'ltr', paddingBottom: 90 }}>

      {/* ── DOCUMENT EXPLAINER HERO ── */}
      <div style={{ background: `linear-gradient(135deg, ${INDIGO_DARK} 0%, #2D2B6B 100%)`, padding: '28px 20px 32px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>

          {/* Label */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 20, padding: '4px 12px', marginBottom: 16 }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: MINT, letterSpacing: 1.5 }}>{t.heroLabel}</span>
          </div>

          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#fff', margin: '0 0 10px', lineHeight: 1.25, letterSpacing: -0.5 }}>{t.heroTitle}</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', margin: '0 0 22px', lineHeight: 1.65, fontWeight: 500 }}>{t.heroSub}</p>

          {/* CTA button */}
          <button
            onClick={() => router.push('/journey/document-explainer')}
            style={{
              width: '100%', padding: '16px', borderRadius: 16,
              background: `linear-gradient(135deg, ${MINT}, #059669)`,
              border: 'none', fontSize: 16, fontWeight: 900, color: '#fff',
              cursor: 'pointer', fontFamily: FONT,
              boxShadow: '0 8px 28px rgba(52,211,153,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}
          >
            <span style={{ fontSize: 20 }}>📄</span>
            {t.heroCta}
          </button>

          {/* Uses left indicator */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12 }}>
            <div style={{ display: 'flex', gap: 3 }}>
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} style={{ width: 18, height: 4, borderRadius: 2, background: i < usesLeft ? MINT : 'rgba(255,255,255,0.15)', transition: 'background 0.3s' }} />
              ))}
            </div>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{usesLeft} {t.usesLeft}</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px 20px 0' }}>

        {/* ── JOURNEY GUIDE SECTION ── */}
        <SectionHeader
          label={t.guideTitle}
          sub={t.guideSub}
          cta="View all"
          onCta={() => router.push('/reber/coming-to-uk')}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 28 }}>
          {t.stages.map((stage, i) => (
            <button
              key={i}
              onClick={() => router.push(stage.route)}
              style={{
                background: '#fff', borderRadius: 16, padding: '16px 10px',
                border: `1.5px solid ${stage.color}20`, cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                fontFamily: FONT, boxShadow: `0 4px 16px ${stage.color}10`,
                transition: 'all 0.15s',
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 14, background: `${stage.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                {stage.icon}
              </div>
              <div style={{ fontSize: 11, fontWeight: 800, color: stage.color, textAlign: 'center', lineHeight: 1.3 }}>{stage.label}</div>
            </button>
          ))}
        </div>

        {/* ── ASK A QUESTION ── */}
        <SectionHeader
          label={t.askTitle}
          sub={t.askSub}
        />

        <button
          onClick={() => router.push('/reber/ask')}
          style={{
            width: '100%', background: '#fff', borderRadius: 16, padding: '16px 18px',
            border: `1.5px solid ${SOFT}`, cursor: 'pointer', fontFamily: FONT,
            display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28,
            boxShadow: '0 2px 12px rgba(79,70,229,0.06)',
            textAlign: isRtl ? 'right' : 'left',
          }}
        >
          <div style={{ width: 46, height: 46, borderRadius: 14, background: SOFT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>❓</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: INDIGO }}>{t.askCta}</div>
            <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2, fontWeight: 500 }}>{t.askSub}</div>
          </div>
          <span style={{ fontSize: 20, color: '#C4B5FD', flexShrink: 0 }}>{isRtl ? '←' : '→'}</span>
        </button>

        {/* ── SERVICES & JOBS ── */}
        <SectionHeader
          label={t.servicesTitle}
          sub={t.servicesSub}
          cta="View all"
          onCta={() => router.push('/services')}
        />

        {loading ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#9CA3AF', fontSize: 13, fontWeight: 600 }}>
            🌱 {t.loading}
          </div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🤝</div>
            <div style={{ fontSize: 14, color: '#9CA3AF', fontWeight: 600 }}>{t.noListings}</div>
          </div>
        ) : (
          listings.map(listing => {
            const d = listing.data || {}
            const isService = listing.type === 'list_service'
            const title = isService ? d.fullName : d.jobTitle
            const sub = isService ? d.category : d.salary ? `💰 ${d.salary}` : ''
            const color = isService ? INDIGO : '#059669'
            const icon = isService ? '🎯' : '💼'

            return (
              <div
                key={listing.id}
                onClick={() => router.push(`/listing/${listing.id}`)}
                style={{
                  background: '#fff', borderRadius: 16, marginBottom: 10,
                  cursor: 'pointer', border: '1.5px solid #EDE9FE',
                  boxShadow: '0 2px 12px rgba(79,70,229,0.05)', overflow: 'hidden',
                }}
              >
                <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                    {icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: INDIGO_DARK, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
                    {sub && <div style={{ fontSize: 12, color, fontWeight: 700, marginTop: 2 }}>{sub}</div>}
                    {d.city && <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>📍 {d.city}</div>}
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    {(d.phone || d.applyPhone) && (
                      <a href={`tel:${d.phone || d.applyPhone}`} onClick={e => e.stopPropagation()} style={{
                        background: `linear-gradient(135deg, ${INDIGO}, ${INDIGO_LIGHT})`,
                        borderRadius: 10, padding: '7px 12px', color: '#fff',
                        fontWeight: 700, fontSize: 12, textDecoration: 'none',
                      }}>
                        📞
                      </a>
                    )}
                    {d.whatsapp && (
                      <a href={`https://wa.me/${d.whatsapp.replace(/\D/g, '')}`} onClick={e => e.stopPropagation()} target="_blank" style={{
                        background: '#25D366', borderRadius: 10, padding: '7px 12px',
                        color: '#fff', fontWeight: 700, fontSize: 12, textDecoration: 'none',
                      }}>
                        💬
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}