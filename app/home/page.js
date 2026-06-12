'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

const INDIGO = '#4F46E5'
const INDIGO_DARK = '#1C1A4F'
const INDIGO_LIGHT = '#818CF8'
const MINT = '#34D399'
const SOFT = '#EDE9FE'
const BG = '#F5F4FF'
const FONT = "'Nunito', sans-serif"

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

function Badge({ text }) {
  return (
    <span style={{
      display: 'inline-block',
      background: INDIGO,
      color: '#fff',
      fontSize: 10,
      fontWeight: 800,
      borderRadius: 6,
      padding: '1px 6px',
      margin: '0 2px',
      letterSpacing: 0.3,
      verticalAlign: 'middle',
      fontFamily: "'Nunito', sans-serif",
    }}>{text}</span>
  )
}

const TX = {
  en: {
    heroSub: 'Built for Kurdish, Farsi and Arabic speaking people in the UK',
    tagline: 'Free. Always.',
    peopleHelped: 'People helped',
    jobsServices: 'Jobs & services',
    questionsAnswered: 'Questions answered',
    featuresTitle: 'Everything Komek does for you — free, always',
    features: [
      { icon: '📄', title: 'Understand Any Letter', desc: 'Got a letter from the Home Office, HMRC, the council or your landlord? Take a photo or paste the text and our AI explains it in your language in seconds.', cta: 'Try it free', route: '/journey/document-explainer' },
      { icon: '🧭', title: 'Your Guide to Life in the UK', desc: 'Step by step guidance from the moment you arrive — asylum process, Leave to Remain, path to British citizenship. In Kurdish, Farsi and Arabic.', cta: 'Open guide', route: '/reber/coming-to-uk' },
      { icon: '❓', title: 'Ask a Question', desc: 'Ask anything about life in the UK. Our team answers personally — no bots, no automated replies.', cta: 'Ask now', route: '/reber/ask' },
      { icon: '🔍', title: 'Find Jobs and Services', desc: 'Browse jobs and services posted by Kurdish businesses and individuals across the UK — drivers, mechanics, solicitors, accountants and more.', cta: 'Browse', route: '/find' },
      { icon: '📝', title: 'Post a Job or Service', desc: 'Are you a business or self-employed? List your service or job vacancy — free, visible to thousands of Kurdish people across the UK.', cta: 'Post now', route: '/post' },
    ],
    footer: 'Komek is free for everyone. Always.',
    community: 'Community Questions',
    jobsServicesCard: 'Latest Jobs & Services',
    noQuestions: 'No questions yet',
    noListings: 'No listings yet',
    answered: 'Answered',
    pending: 'Pending',
    helpful: 'helpful',
  },
  ku: {
    heroSub: 'کۆمەک وەک دەستی یارمەتی دروست کراوە',
    tagline: 'لە خزمەتی ئێوەی بەڕێزدا',
    peopleHelped: 'کەسی یارمەتی دراو',
    jobsServices: 'کار و خزمەتگوزاریەکان',
    questionsAnswered: 'پرسیارە وەڵامدراوەکان',
    featuresTitle: 'کۆمەک بێ بەرامبەر یارمەتیت دەدات',
    features: [
      { icon: '📄', title: 'ڕوونکردنەوەی نامە', descJsx: true, cta: 'تاقی بکەرەوە', route: '/journey/document-explainer' },
      { icon: '🧭', title: 'ژیان لە بەریتانیا', desc: 'ڕێنمایی هەنگاو بە هەنگاو لە ساتەوەختی گەیشتنتەوە — پرۆسەی پەنابەری، مۆڵەت بۆ مانەوە، ڕێگا بۆ ڕەگەزنامەی بەریتانیا. بە کوردی و فارسی و عەرەبی.', cta: 'ڕێنمایی بکەرەوە', route: '/reber/coming-to-uk' },
      { icon: '❓', title: 'پرسیارێک بکە', desc: 'هەر شتێک دەربارەی ژیانی بەریتانیا بپرسە. تیمەکەمان لە ماوەی ٢٤ کاتژمێردا بە شێوەیەکی شەخسی وەڵام دەداتەوە.', cta: 'ئێستا پرسیار بکە', route: '/reber/ask' },
      { icon: '🔍', title: 'هەلی کار و خزمەتگوزاری بدۆزەرەوە', desc: 'گەڕان بەدوای ئەو هەلی کار و خزمەتگوزارییانەی کە لەلایەن بازرگان و کەسانی کورد لە سەرانسەری بەریتانیادا بڵاوکراونەتەوە — شۆفێر، میکانیک، پارێزەر، ژمێریار و زۆر شتی تر.', cta: 'گەڕان', route: '/find' },
      { icon: '📝', title: 'هەلی کار یان خزمەتگوزاری پۆست بکە', desc: 'خزمەتگوزاری یان شوێنی بەتاڵی کارەکەت بنووسە — بەخۆڕاییە، و هەزاران کەسی کورد لە سەرانسەری بەریتانیا دەتوانن بیبینن.', cta: 'ئێستا پۆست بکە', route: '/post' },
    ],
    footer: 'کۆمەک بۆ یارمەتیدانی ئێوە',
    community: 'پرسیارەکانی کۆمەڵگە',
    jobsServicesCard: 'دوایین کار و خزمەتگوزاریەکان',
    noQuestions: 'هێشتا هیچ پرسیارێک نییە',
    noListings: 'هێشتا هیچ لیستێک نییە',
    answered: 'وەڵام دراوە',
    pending: 'چاوەڕوانە',
    helpful: 'بەسوودە',
  },
  fa: {
    heroSub: 'ساخته شده برای کردها، فارسی‌زبانان و عرب‌های ساکن بریتانیا',
    tagline: 'رایگان. همیشه.',
    peopleHelped: 'نفر کمک شده',
    jobsServices: 'شغل و خدمات',
    questionsAnswered: 'سوال پاسخ داده شده',
    featuresTitle: 'همه کارهایی که کومک برایت انجام می‌دهد — رایگان، همیشه',
    features: [
      { icon: '📄', title: 'هر نامه‌ای را بفهم', desc: 'نامه‌ای از Home Office، HMRC، شورا یا صاحبخانه داری؟ عکس بگیر یا متن را بچسبان، هوش مصنوعی ما در چند ثانیه به زبانت توضیح می‌دهد.', cta: 'رایگان امتحان کن', route: '/journey/document-explainer' },
      { icon: '🧭', title: 'راهنمای زندگی در بریتانیا', desc: 'راهنمای گام به گام از لحظه ورود — فرآیند پناهندگی، اجازه اقامت، مسیر شهروندی بریتانیا. به کردی، فارسی و عربی.', cta: 'باز کردن راهنما', route: '/reber/coming-to-uk' },
      { icon: '❓', title: 'سوال بپرس', desc: 'هر چیزی درباره زندگی در بریتانیا بپرس. تیم ما شخصاً پاسخ می‌دهد — نه ربات، نه پاسخ خودکار.', cta: 'الان بپرس', route: '/reber/ask' },
      { icon: '🔍', title: 'شغل و خدمات پیدا کن', desc: 'شغل و خدمات ارائه شده توسط کسب‌وکارها و افراد کرد در سراسر بریتانیا را مرور کن — راننده، مکانیک، وکیل، حسابدار و بیشتر.', cta: 'مرور کن', route: '/find' },
      { icon: '📝', title: 'شغل یا خدمت ارسال کن', desc: 'کسب‌وکار داری یا خوداشتغال هستی؟ خدمت یا آگهی شغلی‌ات را ثبت کن — رایگان، قابل مشاهده برای هزاران کرد در سراسر بریتانیا.', cta: 'الان ارسال کن', route: '/post' },
    ],
    footer: 'کومک برای همه رایگان است. همیشه.',
    community: 'سوالات جامعه',
    jobsServicesCard: 'آخرین شغل و خدمات',
    noQuestions: 'هنوز سوالی نیست',
    noListings: 'هنوز آگهی‌ای نیست',
    answered: 'پاسخ داده شده',
    pending: 'در انتظار',
    helpful: 'مفید',
  },
  ar: {
    heroSub: 'مبني للكرد والفارسيين والعرب المقيمين في المملكة المتحدة',
    tagline: 'مجاني. دائماً.',
    peopleHelped: 'شخص تمت مساعدته',
    jobsServices: 'الوظائف والخدمات',
    questionsAnswered: 'الأسئلة التي تمت إجابتها',
    featuresTitle: 'كل ما تفعله كومك من أجلك — مجاناً، دائماً',
    features: [
      { icon: '📄', title: 'افهم أي رسالة', desc: 'هل لديك رسالة من وزارة الداخلية أو HMRC أو المجلس أو المالك؟ التقط صورة أو الصق النص وسيشرحها الذكاء الاصطناعي بلغتك في ثوانٍ.', cta: 'جرّبه مجاناً', route: '/journey/document-explainer' },
      { icon: '🧭', title: 'دليلك للحياة في بريطانيا', desc: 'إرشادات خطوة بخطوة منذ لحظة وصولك — إجراءات اللجوء، الإذن بالبقاء، مسار الجنسية البريطانية. بالكردية والفارسية والعربية.', cta: 'افتح الدليل', route: '/reber/coming-to-uk' },
      { icon: '❓', title: 'اطرح سؤالاً', desc: 'اسأل أي شيء عن الحياة في المملكة المتحدة. فريقنا يجيب شخصياً — لا روبوتات، لا ردود آلية.', cta: 'اسأل الآن', route: '/reber/ask' },
      { icon: '🔍', title: 'ابحث عن وظائف وخدمات', desc: 'تصفح الوظائف والخدمات التي ينشرها الأعمال والأفراد الكرد في جميع أنحاء المملكة المتحدة — سائقون، ميكانيكيون، محامون، محاسبون والمزيد.', cta: 'تصفح', route: '/find' },
      { icon: '📝', title: 'انشر وظيفة أو خدمة', desc: 'هل لديك عمل تجاري أو تعمل لحسابك؟ أدرج خدمتك أو وظيفتك الشاغرة — مجاناً، مرئية لآلاف الكرد في جميع أنحاء المملكة المتحدة.', cta: 'انشر الآن', route: '/post' },
    ],
    footer: 'كومك مجاني للجميع. دائماً.',
    community: 'أسئلة المجتمع',
    jobsServicesCard: 'أحدث الوظائف والخدمات',
    noQuestions: 'لا توجد أسئلة بعد',
    noListings: 'لا توجد إعلانات بعد',
    answered: 'تمت الإجابة',
    pending: 'في الانتظار',
    helpful: 'مفيد',
  },
}

function Counter({ target, duration = 1500, suffix = '' }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (target === 0) { setCount(0); return }
    setCount(0)
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target])
  return <span>{count.toLocaleString()}{suffix}</span>
}

function SproutLogo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <linearGradient id="sbg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={INDIGO} /><stop offset="100%" stopColor={INDIGO_LIGHT} />
        </linearGradient>
        <linearGradient id="sl" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#059669" /><stop offset="100%" stopColor="#6EE7B7" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="url(#sbg)" />
      <path d="M 50 76 L 50 45" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M 50 60 Q 26 55 22 34 Q 44 28 52 56 Z" fill="url(#sl)" />
      <path d="M 50 50 Q 72 44 76 23 Q 56 17 48 46 Z" fill="url(#sl)" opacity="0.85" />
      <ellipse cx="50" cy="40" rx="6" ry="9" fill={MINT} />
      <ellipse cx="50" cy="37" rx="3" ry="4" fill="white" opacity="0.8" />
    </svg>
  )
}

function KuLetterDesc() {
  return (
    <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 12px', lineHeight: 1.9, textAlign: 'right' }}>
      لە هۆم ئۆفیس یان ئەنجومەن یان <Badge text="HMRC" /> واتا حوکمەت یان خاوەن خانوەکەت نامەیەکت بۆ هاتووە دەتەوێ لێی تێبگەیت ؟ وێنەی بگرە یاخود دەقەکە بنوسەوە و بینێرە لە ڕێگەی <Badge text="AI" /> بە زمانی خۆت بۆت ڕوون دەکرێتەوە .
    </p>
  )
}

export default function HomePage() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const [stats, setStats] = useState({ explained: 0, listings: 0, questionsAnswered: 0 })
  const [questions, setQuestions] = useState([])
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('komek_lang')
    if (saved && TX[saved]) setLang(saved)
    const handler = (e) => { if (TX[e.detail]) setLang(e.detail) }
    window.addEventListener('langchange', handler)
    fetchAll()
    const onFocus = () => fetchAll()
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') fetchAll()
    })
    return () => {
      window.removeEventListener('langchange', handler)
      window.removeEventListener('focus', onFocus)
    }
  }, [])

  async function fetchAll() {
    setLoading(true)
    const { count: explainCount } = await supabase.from('explainer_usage').select('*', { count: 'exact', head: true })
    const { count: listingCount } = await supabase.from('listings').select('*', { count: 'exact', head: true }).in('type', ['hire_staff', 'list_service']).in('status', ['approved', 'filled'])
    const { count: answeredCount } = await supabase.from('questions').select('*', { count: 'exact', head: true }).eq('status', 'answered')
    const { data: topQuestions } = await supabase.from('questions').select('id, question, status, upvotes').order('upvotes', { ascending: false }).limit(2)
    const { data: latestListings } = await supabase.from('listings').select('id, type, data, status').in('type', ['hire_staff', 'list_service']).in('status', ['approved', 'filled']).order('created_at', { ascending: false }).limit(3)
    setStats({ explained: explainCount || 0, listings: listingCount || 0, questionsAnswered: answeredCount || 0 })
    setQuestions(topQuestions || [])
    setListings(latestListings || [])
    setLoading(false)
  }

  const t = TX[lang] || TX.en
  const isRtl = ['ku', 'fa', 'ar'].includes(lang)
  const ta = isRtl ? 'right' : 'left'
  const listingColors = [MINT, INDIGO_LIGHT, '#F59E0B']

  return (
    <div style={{ fontFamily: FONT, background: BG, minHeight: '100vh', paddingBottom: 90, direction: 'ltr' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* HERO */}
      <div style={{ background: `linear-gradient(135deg, ${INDIGO_DARK} 0%, #2d2b6b 60%, #3730a3 100%)`, padding: '48px 24px 40px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(79,70,229,0.15)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(52,211,153,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 14 }}>
            <SproutLogo size={48} />
            <span style={{ fontSize: 36, fontWeight: 900, color: '#fff', letterSpacing: -1 }}>Komek</span>
          </div>
          <p style={{ color: '#a5b4fc', fontSize: 14, margin: '0 0 20px', lineHeight: 1.6, maxWidth: 320, marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}>{t.heroSub}</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${MINT}22`, border: `1px solid ${MINT}44`, borderRadius: 20, padding: '6px 16px', marginBottom: 24 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: MINT }} />
            <span style={{ fontSize: 13, fontWeight: 800, color: MINT }}>{t.tagline}</span>
          </div>

          {/* STATS — 3 cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, maxWidth: 360, margin: '0 auto' }}>
            {[
              { value: stats.explained, suffix: '+', label: t.peopleHelped, color: MINT },
              { value: stats.listings, suffix: '', label: t.jobsServices, color: INDIGO_LIGHT },
              { value: stats.questionsAnswered, suffix: '', label: t.questionsAnswered, color: '#F59E0B' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: '12px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: s.color, lineHeight: 1 }}>
                  {loading ? '—' : <Counter target={s.value} suffix={s.suffix} />}
                </div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.55)', fontWeight: 600, marginTop: 5, lineHeight: 1.3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ padding: '24px 16px 0', maxWidth: 520, margin: '0 auto' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#6b7280', textAlign: ta, margin: '0 0 20px', lineHeight: 1.5 }}>{t.featuresTitle}</p>

        {t.features.map((f, i) => (
          <div key={i}
            onClick={() => router.push(f.route)}
            style={{ background: '#fff', borderRadius: 20, marginBottom: 14, padding: '20px', border: `1px solid ${SOFT}`, boxShadow: '0 2px 12px rgba(79,70,229,0.06)', cursor: 'pointer', display: 'flex', flexDirection: isRtl ? 'row-reverse' : 'row', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: SOFT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{f.icon}</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 15, fontWeight: 900, color: INDIGO_DARK, margin: '0 0 6px', textAlign: ta }}>{f.title}</h3>
              {f.descJsx && lang === 'ku'
                ? <KuLetterDesc />
                : <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 12px', lineHeight: 1.6, textAlign: ta }}>{f.desc}</p>
              }
              <div style={{ display: 'flex', justifyContent: isRtl ? 'flex-end' : 'flex-start' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: INDIGO, borderRadius: 10, padding: '7px 14px' }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>{f.cta} {isRtl ? '←' : '→'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* COMMUNITY + LISTINGS CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          {/* Questions */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '14px', boxShadow: '0 2px 16px rgba(79,70,229,0.07)' }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: INDIGO_DARK, marginBottom: 10, textAlign: ta }}>{t.community}</div>
            {loading ? (
              <div style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 20, height: 20, border: `2px solid ${SOFT}`, borderTopColor: INDIGO, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              </div>
            ) : questions.length === 0 ? (
              <div style={{ fontSize: 9, color: '#9CA3AF', fontWeight: 600, textAlign: 'center', padding: '10px 0' }}>{t.noQuestions}</div>
            ) : questions.map((q, i) => (
              <div key={q.id} style={{ background: BG, borderRadius: 8, padding: '7px 8px', marginBottom: i < questions.length - 1 ? 6 : 0 }}>
                <div style={{ fontSize: 8, color: INDIGO_DARK, fontWeight: 700, lineHeight: 1.35, marginBottom: 3, textAlign: ta }}>{q.question.length > 45 ? q.question.slice(0, 45) + '…' : q.question}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: isRtl ? 'flex-end' : 'flex-start' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: q.status === 'answered' ? MINT : '#F59E0B' }} />
                  <span style={{ fontSize: 7, color: '#9CA3AF', fontWeight: 600 }}>{q.upvotes || 0} {t.helpful}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Listings */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '14px', boxShadow: '0 2px 16px rgba(79,70,229,0.07)' }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: INDIGO_DARK, marginBottom: 10, textAlign: ta }}>{t.jobsServicesCard}</div>
            {loading ? (
              <div style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 20, height: 20, border: `2px solid ${SOFT}`, borderTopColor: INDIGO, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              </div>
            ) : listings.length === 0 ? (
              <div style={{ fontSize: 9, color: '#9CA3AF', fontWeight: 600, textAlign: 'center', padding: '10px 0' }}>{t.noListings}</div>
            ) : listings.map((l, i) => {
              const d = l.data || {}
              const title = l.type === 'hire_staff' ? d.jobTitle : d.serviceName
              const detail = l.type === 'hire_staff' ? (d.salary || d.location || '') : (d.price || d.location || '')
              return (
                <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: i < listings.length - 1 ? 8 : 0, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                  <div style={{ width: 3, height: 28, borderRadius: 2, background: listingColors[i % listingColors.length], flexShrink: 0 }} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 9, fontWeight: 900, color: INDIGO_DARK, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: ta }}>{title}</div>
                    <div style={{ fontSize: 8, color: '#9CA3AF', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: ta }}>{detail}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* FOOTER LINE */}
        <div style={{ textAlign: ta, padding: '8px 0 16px' }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: INDIGO_LIGHT }}>{t.footer}</span>
        </div>
      </div>
    </div>
  )
}