'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '../lib/supabase'

const INDIGO = '#4F46E5'
const INDIGO_DARK = '#1C1A4F'
const INDIGO_LIGHT = '#818CF8'
const MINT = '#34D399'
const SOFT = '#EDE9FE'
const BG = '#F5F4FF'
const FONT = "'Nunito', sans-serif"

const supabase = createClient()

const TX = {
  en: {
    heroEyebrow: 'Welcome to Komek',
    heroTitle: 'Your guide to life in the UK',
    stats: [
      { label: 'Letters explained', color: MINT },
      { label: 'Jobs & services', color: INDIGO_LIGHT },
      { label: 'Questions answered', color: '#F59E0B' },
    ],
    quickTitle: 'Quick actions',
    quick: [
      { icon: '📄', title: 'Explain a letter', sub: 'Upload or type', route: '/journey/document-explainer' },
      { icon: '🔍', title: 'Find work', sub: 'Jobs near you', route: '/find' },
      { icon: '❓', title: 'Ask community', sub: 'Get answers', route: '/reber/ask' },
      { icon: '➕', title: 'Post a listing', sub: 'Job or service', route: '/post' },
    ],
    guidesTitle: 'ڕێنوێنی',
    guides: [
      { badge: 'ASYLUM', badgeStyle: 'asylum', title: 'New to the UK', sub: 'First steps guide', route: '/reber/new-to-uk' },
      { badge: 'LEAVE TO REMAIN', badgeStyle: 'leave', title: 'Leave to Remain', sub: '42-day window', route: '/reber/leave-to-remain' },
      { badge: 'CITIZENSHIP', badgeStyle: 'citizen', title: 'Citizenship', sub: '£1,709 fee', route: '/reber/citizenship' },
    ],
    listingsTitle: 'Latest listings',
    seeAll: 'See all →',
    noListings: 'No listings yet',
    job: 'JOB',
    service: 'SERVICE',
    ago: 'ago',
  },
  ku: {
    heroEyebrow: 'بەخێربێیت بۆ کۆمەک',
    heroTitle: 'ڕێنوێنەکەت بۆ ژیان لە UK',
    stats: [
      { label: 'نامەی ڕوونکراوە', color: MINT },
      { label: 'کار و خزمەتگوزاریەکان', color: INDIGO_LIGHT },
      { label: 'پرسیارە وەڵامدراوەکان', color: '#F59E0B' },
    ],
    quickTitle: 'کارە خێراکان',
    quick: [
      { icon: '📄', title: 'نامە ڕوون بکەرەوە', sub: 'وێنە ئەپلۆد یان نووسین', route: '/journey/document-explainer' },
      { icon: '🔍', title: 'کار بدۆزەرەوە', sub: 'کارەکان لە نزیکەکەت', route: '/find' },
      { icon: '❓', title: 'پرسیار بکە', sub: 'وەڵام وەربگرە', route: '/reber/ask' },
      { icon: '➕', title: 'بڵاوکردنەوە', sub: 'کار یان خزمەتگوزاری', route: '/post' },
    ],
    guidesTitle: 'ڕێنوێنی',
    guides: [
      { badge: 'ASYLUM', badgeStyle: 'asylum', title: 'تازە گەیشتووە بە UK', sub: 'ڕێنوێنەی یەکەم هەنگاوەکان', route: '/reber/new-to-uk' },
      { badge: 'LEAVE TO REMAIN', badgeStyle: 'leave', title: 'Leave to Remain', sub: 'پەنجەرەی ٤٢ ڕۆژ', route: '/reber/leave-to-remain' },
      { badge: 'CITIZENSHIP', badgeStyle: 'citizen', title: 'هاووڵاتیبوون', sub: 'تێچووی £١٬٧٠٩', route: '/reber/citizenship' },
    ],
    listingsTitle: 'کارە نوێکان',
    seeAll: '← هەموو ببینە',
    noListings: 'هێشتا هیچ لیستێک نییە',
    job: 'کار',
    service: 'خزمەتگوزاری',
    ago: 'لەمەوبەر',
  },
  fa: {
    heroEyebrow: 'به کومک خوش آمدی',
    heroTitle: 'راهنمای زندگی در بریتانیا',
    stats: [
      { label: 'نامه توضیح داده شده', color: MINT },
      { label: 'شغل و خدمات', color: INDIGO_LIGHT },
      { label: 'سوال پاسخ داده شده', color: '#F59E0B' },
    ],
    quickTitle: 'اقدامات سریع',
    quick: [
      { icon: '📄', title: 'توضیح نامه', sub: 'آپلود یا تایپ', route: '/journey/document-explainer' },
      { icon: '🔍', title: 'پیدا کردن کار', sub: 'مشاغل نزدیک شما', route: '/find' },
      { icon: '❓', title: 'از جامعه بپرس', sub: 'پاسخ بگیر', route: '/reber/ask' },
      { icon: '➕', title: 'ارسال آگهی', sub: 'شغل یا خدمت', route: '/post' },
    ],
    guidesTitle: 'ڕێنوێنی',
    guides: [
      { badge: 'ASYLUM', badgeStyle: 'asylum', title: 'تازه رسیدی', sub: 'راهنمای اول', route: '/reber/new-to-uk' },
      { badge: 'LEAVE TO REMAIN', badgeStyle: 'leave', title: 'اجازه اقامت', sub: 'پنجره ۴۲ روزه', route: '/reber/leave-to-remain' },
      { badge: 'CITIZENSHIP', badgeStyle: 'citizen', title: 'شهروندی', sub: 'هزینه £۱٬۷۰۹', route: '/reber/citizenship' },
    ],
    listingsTitle: 'آخرین آگهی‌ها',
    seeAll: '← همه را ببین',
    noListings: 'هنوز آگهی‌ای نیست',
    job: 'شغل',
    service: 'خدمت',
    ago: 'پیش',
  },
  ar: {
    heroEyebrow: 'مرحباً بك في كومك',
    heroTitle: 'دليلك للحياة في المملكة المتحدة',
    stats: [
      { label: 'رسالة تم شرحها', color: MINT },
      { label: 'الوظائف والخدمات', color: INDIGO_LIGHT },
      { label: 'الأسئلة التي تمت إجابتها', color: '#F59E0B' },
    ],
    quickTitle: 'إجراءات سريعة',
    quick: [
      { icon: '📄', title: 'شرح رسالة', sub: 'رفع أو كتابة', route: '/journey/document-explainer' },
      { icon: '🔍', title: 'البحث عن عمل', sub: 'وظائف قريبة', route: '/find' },
      { icon: '❓', title: 'اسأل المجتمع', sub: 'احصل على إجابات', route: '/reber/ask' },
      { icon: '➕', title: 'نشر إعلان', sub: 'وظيفة أو خدمة', route: '/post' },
    ],
    guidesTitle: 'ڕێنوێنی',
    guides: [
      { badge: 'ASYLUM', badgeStyle: 'asylum', title: 'وصلت للتو', sub: 'دليل الخطوات الأولى', route: '/reber/new-to-uk' },
      { badge: 'LEAVE TO REMAIN', badgeStyle: 'leave', title: 'الإذن بالبقاء', sub: 'نافذة ٤٢ يوماً', route: '/reber/leave-to-remain' },
      { badge: 'CITIZENSHIP', badgeStyle: 'citizen', title: 'الجنسية', sub: 'رسوم £١٬٧٠٩', route: '/reber/citizenship' },
    ],
    listingsTitle: 'أحدث الإعلانات',
    seeAll: '← عرض الكل',
    noListings: 'لا توجد إعلانات بعد',
    job: 'وظيفة',
    service: 'خدمة',
    ago: 'مضت',
  },
}

const BADGE_STYLES = {
  asylum:  { background: '#FEF3C7', color: '#D97706' },
  leave:   { background: '#EDE9FE', color: '#4F46E5' },
  citizen: { background: '#D1FAE5', color: '#059669' },
}

const QUICK_COLORS = ['#EDE9FE', '#D1FAE5', '#FEF3C7', '#FCE7F3']
const LISTING_ICONS = { hire_staff: '💼', list_service: '🛠️' }

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  return `${Math.floor(diff / 86400)}d`
}

function AnimatedCounter({ value, color }) {
  const [display, setDisplay] = useState(0)
  const prevValue = useRef(0)

  useEffect(() => {
    const target = value
    const start = prevValue.current
    prevValue.current = target
    if (target === 0) { setDisplay(0); return }
    let current = start
    const duration = 1500
    const steps = duration / 16
    const increment = (target - start) / steps
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setDisplay(target)
        clearInterval(timer)
      } else {
        setDisplay(Math.floor(current))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [value])

  return (
    <span style={{ fontSize: 28, fontWeight: 900, color, lineHeight: 1 }}>
      {display.toLocaleString()}
    </span>
  )
}

export default function HomePage() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const [statValues, setStatValues] = useState([0, 0, 0])
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('komek_lang')
    if (saved && TX[saved]) setLang(saved)
    const handler = (e) => { if (TX[e.detail]) setLang(e.detail) }
    window.addEventListener('langchange', handler)
    fetchAll()
    return () => window.removeEventListener('langchange', handler)
  }, [])

  async function fetchAll() {
    setLoading(true)
    const [
      { count: explained },
      { count: listingCount },
      { count: answered },
      { data: latestListings },
    ] = await Promise.all([
      supabase.from('explainer_usage').select('*', { count: 'exact', head: true }),
      supabase.from('listings').select('*', { count: 'exact', head: true }).in('type', ['hire_staff', 'list_service']).in('status', ['approved', 'filled']),
      supabase.from('questions').select('*', { count: 'exact', head: true }).eq('status', 'answered'),
      supabase.from('listings').select('id, type, data, status, created_at').in('type', ['hire_staff', 'list_service']).in('status', ['approved', 'filled']).neq('paused', true).order('created_at', { ascending: false }).limit(3),
    ])
    setStatValues([explained || 0, listingCount || 0, answered || 0])
    setListings(latestListings || [])
    setLoading(false)
  }

  const t = TX[lang] || TX.en
  const isRtl = ['ku', 'fa', 'ar'].includes(lang)
  const ta = isRtl ? 'right' : 'left'

  return (
    <div style={{ fontFamily: FONT, background: BG, minHeight: '100vh', paddingBottom: 90, direction: 'ltr' }}>

      {/* HERO */}
      <div style={{
        background: `linear-gradient(135deg, ${INDIGO_DARK} 0%, #2D2A7A 65%, ${INDIGO} 100%)`,
        padding: '32px 20px 24px', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -50, right: -50, width: 160, height: 160, borderRadius: '50%', background: 'rgba(52,211,153,0.07)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -30, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(129,140,248,0.08)', pointerEvents: 'none' }} />

        <p style={{ fontSize: 13, fontWeight: 800, color: INDIGO_LIGHT, letterSpacing: 1, textTransform: 'uppercase', margin: '0 0 10px', position: 'relative' }}>
          {t.heroEyebrow}
        </p>
        <h1 style={{ fontSize: 30, fontWeight: 900, color: '#fff', margin: '0 0 24px', lineHeight: 1.25, position: 'relative' }}>
          {t.heroTitle}
        </h1>

        {/* STATS */}
        <div style={{
          display: 'flex', alignItems: 'stretch',
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 16, overflow: 'hidden', position: 'relative',
        }}>
          {t.stats.map((s, i) => (
            <div key={i} style={{
              flex: 1, padding: '14px 8px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.1)' : 'none',
            }}>
              <AnimatedCounter value={statValues[i]} color={s.color} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 700, textAlign: 'center', lineHeight: 1.3, padding: '0 4px' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 16px' }}>

        {/* QUICK ACTIONS */}
        <div style={{ padding: '20px 0 0' }}>
          <p style={{ fontSize: 13, fontWeight: 800, color: INDIGO_LIGHT, letterSpacing: 1, textTransform: 'uppercase', margin: '0 0 12px', textAlign: ta }}>
            {t.quickTitle}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {t.quick.map((q, i) => (
              <div key={i} onClick={() => router.push(q.route)} style={{
                background: '#fff', borderRadius: 18, padding: '16px 14px',
                border: `1px solid ${SOFT}`, boxShadow: '0 2px 10px rgba(79,70,229,0.07)',
                cursor: 'pointer', textAlign: ta,
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12, background: QUICK_COLORS[i],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, marginBottom: 10,
                  marginLeft: isRtl ? 'auto' : 0, marginRight: isRtl ? 0 : 'auto',
                }}>
                  {q.icon}
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: INDIGO_DARK, marginBottom: 2 }}>{q.title}</div>
                <div style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600 }}>{q.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* GUIDE CARDS */}
        <div style={{ padding: '20px 0 0' }}>
          <p style={{ fontSize: 13, fontWeight: 800, color: INDIGO_LIGHT, letterSpacing: 1, textTransform: 'uppercase', margin: '0 0 12px', textAlign: ta }}>
            {t.guidesTitle}
          </p>
          <div style={{
            display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 6,
            scrollbarWidth: 'none',
            flexDirection: isRtl ? 'row-reverse' : 'row',
            marginLeft: -16, marginRight: -16, paddingLeft: 16, paddingRight: 16,
          }}>
            {t.guides.map((g, i) => (
              <div key={i} onClick={() => router.push(g.route)} style={{
                minWidth: 160, background: '#fff', borderRadius: 18,
                border: `1px solid ${SOFT}`, boxShadow: '0 2px 10px rgba(79,70,229,0.07)',
                overflow: 'hidden', flexShrink: 0, cursor: 'pointer',
              }}>
                <div style={{ padding: '14px 14px 10px', textAlign: ta }}>
                  <span style={{
                    display: 'inline-block', fontSize: 11, fontWeight: 800,
                    padding: '3px 8px', borderRadius: 20, marginBottom: 8,
                    direction: 'ltr', ...BADGE_STYLES[g.badgeStyle],
                  }}>
                    {g.badge}
                  </span>
                  <div style={{ fontSize: 15, fontWeight: 800, color: INDIGO_DARK, lineHeight: 1.3 }}>{g.title}</div>
                </div>
                <div style={{ padding: '8px 14px 12px', borderTop: `1px solid ${BG}`, textAlign: ta }}>
                  <div style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600 }}>{g.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LATEST LISTINGS */}
        <div style={{ padding: '20px 0 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: isRtl ? 'row-reverse' : 'row', marginBottom: 12 }}>
            <p style={{ fontSize: 13, fontWeight: 800, color: INDIGO_LIGHT, letterSpacing: 1, textTransform: 'uppercase', margin: 0 }}>
              {t.listingsTitle}
            </p>
            <span onClick={() => router.push('/find')} style={{ fontSize: 14, fontWeight: 700, color: INDIGO, cursor: 'pointer' }}>
              {t.seeAll}
            </span>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
              <div style={{ width: 24, height: 24, border: `2px solid ${SOFT}`, borderTopColor: INDIGO, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            </div>
          ) : listings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0', fontSize: 15, color: '#94A3B8', fontWeight: 600 }}>
              {t.noListings}
            </div>
          ) : listings.map((l, i) => {
            const d = l.data || {}
            const title = l.type === 'hire_staff' ? d.jobTitle : d.serviceName
            const location = d.location || ''
            const isJob = l.type === 'hire_staff'
            return (
              <div key={l.id} onClick={() => router.push('/find')} style={{
                background: '#fff', borderRadius: 18, border: `1px solid ${SOFT}`,
                boxShadow: '0 2px 10px rgba(79,70,229,0.07)',
                padding: '14px 16px', marginBottom: 10,
                display: 'flex', gap: 12, alignItems: 'flex-start',
                flexDirection: isRtl ? 'row-reverse' : 'row', cursor: 'pointer',
              }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: SOFT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                  {LISTING_ICONS[l.type]}
                </div>
                <div style={{ flex: 1, textAlign: ta }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: INDIGO_DARK, marginBottom: 3 }}>{title}</div>
                  <div style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600 }}>
                    {location}{location ? ' · ' : ''}{timeAgo(l.created_at)} {t.ago}
                  </div>
                  <span style={{
                    display: 'inline-block', fontSize: 12, fontWeight: 700,
                    padding: '2px 8px', borderRadius: 20, marginTop: 6,
                    background: isJob ? SOFT : '#D1FAE5',
                    color: isJob ? INDIGO : '#059669',
                  }}>
                    {isJob ? t.job : t.service}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}