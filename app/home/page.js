'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import LangDropdown from '@/components/LangDropdown'

const FONT = "'Plus Jakarta Sans', 'Sora', sans-serif"
const ORANGE = 'linear-gradient(135deg, #FF6B35, #FF8C61)'
const NAVY = '#1A2B5F'

function getSupabase() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

const TABS = [
  { id: 'all',           label: { en: 'All',       ku: 'هەموو',        fa: 'همه',      ar: 'الكل'     } },
  { id: 'list_service',  label: { en: 'Services',   ku: 'خزمەتگوزاری', fa: 'خدمات',    ar: 'الخدمات'  } },
  { id: 'hire_staff',    label: { en: 'Jobs',       ku: 'کار',          fa: 'مشاغل',    ar: 'الوظائف'  } },
  { id: 'sell_car',      label: { en: 'Cars',       ku: 'ئۆتۆمبێل',    fa: 'ماشین‌ها', ar: 'السيارات' } },
  { id: 'sell_business', label: { en: 'Businesses', ku: 'بیزنس',        fa: 'الأعمال',  ar: 'الأعمال'  } },
]

const TYPE_META = {
  list_service:  { icon: '🎯', color: '#FF006E', label: { en: 'Service',  ku: 'خزمەتگوزاری', fa: 'خدمت',       ar: 'خدمة'       } },
  hire_staff:    { icon: '👥', color: '#06D6A0', label: { en: 'Job',      ku: 'کار',          fa: 'شغل',        ar: 'وظيفة'      } },
  sell_car:      { icon: '🚗', color: '#00B4D8', label: { en: 'Car',      ku: 'ئۆتۆمبێل',    fa: 'ماشین',      ar: 'سيارة'      } },
  sell_business: { icon: '💼', color: '#FFB703', label: { en: 'Business', ku: 'بیزنس',        fa: 'کسب‌وکار',   ar: 'عمل تجاري' } },
}

const TX = {
  en: { noListings: 'No listings yet', noListingsSub: 'Be the first to post something', postSomething: '+ Post Something', loading: 'Loading…', guide: 'Your Guide', guideSub: 'Everything you need, step by step', call: 'Call', home: 'Home', post: 'Post', account: 'Account', sold: 'SOLD', filled: 'FILLED' },
  ku: { noListings: 'هێشتا هیچ لیستێک نییە', noListingsSub: 'یەکەمین بە و شتێک پۆست بکە', postSomething: '+ شتێک پۆست بکە', loading: 'چاوەڕوانبە…', guide: 'ڕێنماکەت', guideSub: 'هەموو ئەوەی پێویستتە، هەنگاو بە هەنگاو', call: 'پەیوەندی', home: 'سەرەکی', post: 'پۆست', account: 'ئەکاونت', sold: 'فرۆشراوە', filled: 'پڕکراوە' },
  fa: { noListings: 'هنوز آگهی‌ای نیست', noListingsSub: 'اولین نفر باش و چیزی پست کن', postSomething: '+ ثبت آگهی', loading: 'در حال بارگذاری…', guide: 'راهنمای تو', guideSub: 'هر آنچه نیاز داری، قدم به قدم', call: 'تماس', home: 'خانه', post: 'پست', account: 'حساب', sold: 'فروخته شد', filled: 'پر شد' },
  ar: { noListings: 'لا توجد إعلانات بعد', noListingsSub: 'كن أول من ينشر شيئاً', postSomething: '+ نشر إعلان', loading: 'جاري التحميل…', guide: 'دليلك', guideSub: 'كل ما تحتاجه خطوة بخطوة', call: 'اتصال', home: 'الرئيسية', post: 'نشر', account: 'حسابي', sold: 'مُباع', filled: 'مكتمل' },
}

function getTitle(type, data) {
  if (type === 'list_service') return data.fullName
  if (type === 'hire_staff') return data.jobTitle
  if (type === 'sell_car') return `${data.make} ${data.model}`
  if (type === 'sell_business') return data.businessName
  return 'Listing'
}

function getSubtitle(type, data) {
  if (type === 'list_service') return data.category
  if (type === 'hire_staff') return data.salary ? `💰 ${data.salary}` : ''
  if (type === 'sell_car') return `${data.year} · ${Number(data.mileage).toLocaleString()} mi · ${data.condition}`
  if (type === 'sell_business') return `£${Number(data.askingPrice).toLocaleString()}`
  return ''
}

export default function Home() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const [activeTab, setActiveTab] = useState('all')
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeNav, setActiveNav] = useState('home')
  const t = TX[lang] || TX.en

  useEffect(() => {
    const saved = localStorage.getItem('kurdlink_lang')
    if (saved) setLang(saved)
  }, [])

  useEffect(() => {
    fetchListings()
  }, [activeTab])

  const fetchListings = async () => {
    setLoading(true)
    const supabase = getSupabase()
    let query = supabase.from('listings').select('*').in('status', ['approved', 'sold', 'filled']).order('created_at', { ascending: false })
    if (activeTab !== 'all') query = query.eq('type', activeTab)
    const { data } = await query
    setListings(data || [])
    setLoading(false)
  }

  const NAV_ITEMS = [
    { id: 'home',    icon: '🏠', action: () => setActiveNav('home') },
    { id: 'post',    icon: '➕', action: () => { setActiveNav('post'); router.push('/post') } },
    { id: 'account', icon: '👤', action: () => { setActiveNav('account'); router.push('/account') } },
  ]

  // direction is ALWAYS ltr — layout never flips, only text content translates
  return (
    <div style={{ minHeight: '100vh', minHeight: '100dvh', background: '#f7f7f5', fontFamily: FONT, direction: 'ltr', paddingBottom: 80 }}>

      {/* Header — always LTR */}
      <div style={{ background: NAVY, position: 'sticky', top: 0, zIndex: 20, direction: 'ltr' }}>
        <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 900, background: ORANGE, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>KurdLink</div>
          <LangDropdown lang={lang} onChange={setLang} />
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', overflowX: 'auto', padding: '0 16px 0', scrollbarWidth: 'none', direction: 'ltr' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: '8px 16px',
              background: activeTab === tab.id ? 'rgba(255,255,255,0.15)' : 'transparent',
              border: 'none', borderRadius: 20,
              color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.55)',
              fontWeight: activeTab === tab.id ? 700 : 600, fontSize: 13,
              cursor: 'pointer', fontFamily: FONT, whiteSpace: 'nowrap', flexShrink: 0,
              borderBottom: activeTab === tab.id ? '2px solid #FF6B35' : '2px solid transparent',
              transition: 'all 0.2s',
            }}>
              {tab.label[lang] || tab.label.en}
            </button>
          ))}
        </div>

        {/* Guide Banner */}
        <div style={{ padding: '10px 16px 14px', direction: 'ltr' }}>
          <button onClick={() => router.push('/journey')} style={{
            width: '100%', padding: '11px 18px',
            background: 'linear-gradient(135deg, #FF6B35, #FF8C61)',
            border: 'none', borderRadius: 14, color: '#fff',
            fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: FONT,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            boxShadow: '0 4px 16px rgba(255,107,53,0.35)', boxSizing: 'border-box',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>🗺️</span>
              <span>
                <span style={{ display: 'block', fontSize: 14, fontWeight: 900 }}>{t.guide}</span>
                <span style={{ display: 'block', fontSize: 11, fontWeight: 500, opacity: 0.85 }}>{t.guideSub}</span>
              </span>
            </span>
            <span style={{ fontSize: 18, opacity: 0.9 }}>›</span>
          </button>
        </div>
      </div>

      {/* Listings */}
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '16px 16px 20px', boxSizing: 'border-box' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
            <p style={{ color: '#aaa', fontSize: 14 }}>{t.loading}</p>
          </div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#444', margin: '0 0 6px' }}>{t.noListings}</p>
            <p style={{ fontSize: 13, color: '#aaa', margin: '0 0 24px' }}>{t.noListingsSub}</p>
            <button onClick={() => router.push('/post')} style={{ background: ORANGE, border: 'none', borderRadius: 12, padding: '12px 24px', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: FONT }}>
              {t.postSomething}
            </button>
          </div>
        ) : (
          listings.map(listing => {
            const d = listing.data || {}
            const meta = TYPE_META[listing.type]
            const img = d.imageUrls?.[0]
            const title = getTitle(listing.type, d)
            const subtitle = getSubtitle(listing.type, d)
            const isSold = listing.status === 'sold'
            const isFilled = listing.status === 'filled'

            return (
              <div key={listing.id} onClick={() => router.push(`/listing/${listing.id}`)} style={{ background: '#fff', borderRadius: 16, marginBottom: 12, cursor: 'pointer', border: '1.5px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                <div style={{ position: 'relative' }}>
                  {img
                    ? <img src={img} alt={title} style={{ width: '100%', height: 180, objectFit: 'cover', filter: isSold || isFilled ? 'brightness(0.5)' : 'none' }} />
                    : (isSold || isFilled) && (
                      <div style={{ background: isSold ? '#EF4444' : '#22C55E', padding: '10px', textAlign: 'center', color: '#fff', fontWeight: 900, fontSize: 16, letterSpacing: 2 }}>
                        {isSold ? t.sold : t.filled}
                      </div>
                    )
                  }
                  {isSold && img && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#EF4444', color: '#fff', fontWeight: 900, fontSize: 22, padding: '8px 24px', borderRadius: 10, letterSpacing: 2, boxShadow: '0 4px 16px rgba(0,0,0,0.3)', whiteSpace: 'nowrap' }}>
                      {t.sold}
                    </div>
                  )}
                  {isFilled && img && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#22C55E', color: '#fff', fontWeight: 900, fontSize: 22, padding: '8px 24px', borderRadius: 10, letterSpacing: 2, boxShadow: '0 4px 16px rgba(0,0,0,0.3)', whiteSpace: 'nowrap' }}>
                      {t.filled}
                    </div>
                  )}
                </div>

                {/* Type band */}
                <div style={{ background: meta.color, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 20 }}>{meta.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: 1 }}>{meta.label[lang] || meta.label.en}</span>
                  {d.city && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginLeft: 'auto' }}>📍 {d.city}</span>}
                </div>

                <div style={{ padding: '14px 16px' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: NAVY, margin: '0 0 4px', lineHeight: 1.2 }}>{title}</h3>
                  {subtitle && <p style={{ fontSize: 13, fontWeight: 600, color: '#FF6B35', margin: '0 0 8px' }}>{subtitle}</p>}
                  {d.description && (
                    <p style={{ fontSize: 13, color: '#777', margin: '0 0 12px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {d.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: 8 }}>
                    {(d.phone || d.applyPhone) && (
                      <a href={`tel:${d.phone || d.applyPhone}`} onClick={e => e.stopPropagation()} style={{ flex: 1, background: ORANGE, borderRadius: 10, padding: '9px', color: '#fff', fontWeight: 700, fontSize: 13, textAlign: 'center', textDecoration: 'none', display: 'block' }}>
                        📞 {t.call}
                      </a>
                    )}
                    {d.whatsapp && (
                      <a href={`https://wa.me/${d.whatsapp.replace(/\D/g, '')}`} onClick={e => e.stopPropagation()} target="_blank" style={{ flex: 1, background: '#25D366', borderRadius: 10, padding: '9px', color: '#fff', fontWeight: 700, fontSize: 13, textAlign: 'center', textDecoration: 'none', display: 'block' }}>
                        💬 WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid rgba(0,0,0,0.08)', display: 'flex', zIndex: 50, paddingBottom: 'env(safe-area-inset-bottom)', boxShadow: '0 -4px 20px rgba(0,0,0,0.06)', direction: 'ltr' }}>
        {NAV_ITEMS.map(item => (
          <button key={item.id} onClick={item.action} style={{ flex: 1, padding: '10px 0 8px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, fontFamily: FONT }}>
            {item.id === 'post' ? (
              <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #FF6B35, #FF8C61)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginTop: -20, boxShadow: '0 4px 16px rgba(255,107,53,0.5)' }}>➕</div>
            ) : (
              <span style={{ fontSize: 20 }}>{item.icon}</span>
            )}
            <span style={{ fontSize: 10, fontWeight: 700, color: activeNav === item.id ? '#FF6B35' : '#aaa', marginTop: item.id === 'post' ? 2 : 0 }}>
              {t[item.id]}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}