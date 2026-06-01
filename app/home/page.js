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
const MINT = '#34D399'
const SOFT = '#EDE9FE'
const BG = '#F5F4FF'

const TYPE_META = {
  list_service: { icon: '🎯', color: INDIGO,       label: { en: 'Service', ku: 'خزمەتگوزاری', fa: 'خدمت', ar: 'خدمة'  } },
  hire_staff:   { icon: '💼', color: '#059669',     label: { en: 'Job',     ku: 'کار',         fa: 'شغل',  ar: 'وظيفة' } },
}

const TX = {
  en: { noListings: 'No listings yet', noListingsSub: 'Be the first to post something', postSomething: '+ Post Something', loading: 'Loading…', call: 'Call', sold: 'SOLD', filled: 'FILLED' },
  ku: { noListings: 'هێشتا هیچ لیستێک نییە', noListingsSub: 'یەکەمین بە و شتێک پۆست بکە', postSomething: '+ شتێک پۆست بکە', loading: 'چاوەڕوانبە…', call: 'پەیوەندی', sold: 'فرۆشراوە', filled: 'پڕکراوە' },
  fa: { noListings: 'هنوز آگهی‌ای نیست', noListingsSub: 'اولین نفر باش و چیزی پست کن', postSomething: '+ ثبت آگهی', loading: 'در حال بارگذاری…', call: 'تماس', sold: 'فروخته شد', filled: 'پر شد' },
  ar: { noListings: 'لا توجد إعلانات بعد', noListingsSub: 'كن أول من ينشر شيئاً', postSomething: '+ نشر إعلان', loading: 'جاري التحميل…', call: 'اتصال', sold: 'مُباع', filled: 'مكتمل' },
}

function getTitle(type, data) {
  if (type === 'list_service') return data.fullName
  if (type === 'hire_staff') return data.jobTitle
  return 'Listing'
}

function getSubtitle(type, data) {
  if (type === 'list_service') return data.category
  if (type === 'hire_staff') return data.salary ? `💰 ${data.salary}` : ''
  return ''
}

export default function Home() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const [activeTab, setActiveTab] = useState('all')
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const t = TX[lang] || TX.en
  const isRtl = lang === 'ku' || lang === 'fa' || lang === 'ar'

  useEffect(() => {
    const saved = localStorage.getItem('komek_lang')
    if (saved) setLang(saved)
    const handler = (e) => setLang(e.detail)
    window.addEventListener('langchange', handler)
    return () => window.removeEventListener('langchange', handler)
  }, [])

  useEffect(() => {
    const handler = (e) => setActiveTab(e.detail)
    window.addEventListener('tabchange', handler)
    return () => window.removeEventListener('tabchange', handler)
  }, [])

  useEffect(() => {
    fetchListings()
  }, [activeTab])

  const fetchListings = async () => {
    setLoading(true)
    const supabase = getSupabase()
    let query = supabase
      .from('listings')
      .select('*')
      .in('type', ['list_service', 'hire_staff'])
      .in('status', ['approved', 'sold', 'filled'])
      .order('created_at', { ascending: false })
    if (activeTab !== 'all') query = query.eq('type', activeTab)
    const { data } = await query
    setListings(data || [])
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', minHeight: '100dvh', background: BG, fontFamily: FONT, direction: isRtl ? 'rtl' : 'ltr', paddingBottom: 80 }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '16px 16px 20px', boxSizing: 'border-box' }}>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🌱</div>
            <p style={{ color: '#9CA3AF', fontSize: 14, fontWeight: 600 }}>{t.loading}</p>
          </div>

        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🤝</div>
            <p style={{ fontSize: 18, fontWeight: 900, color: INDIGO, margin: '0 0 8px' }}>{t.noListings}</p>
            <p style={{ fontSize: 14, color: '#9CA3AF', margin: '0 0 28px', fontWeight: 500 }}>{t.noListingsSub}</p>
            <button onClick={() => router.push('/post')} style={{
              background: `linear-gradient(135deg, ${INDIGO}, ${INDIGO_LIGHT})`,
              border: 'none', borderRadius: 14, padding: '14px 28px',
              color: '#fff', fontWeight: 800, fontSize: 14,
              cursor: 'pointer', fontFamily: FONT,
              boxShadow: '0 8px 24px rgba(79,70,229,0.3)',
            }}>
              {t.postSomething}
            </button>
          </div>

        ) : (
          listings.map(listing => {
            const d = listing.data || {}
            const meta = TYPE_META[listing.type]
            if (!meta) return null
            const img = d.imageUrls?.[0]
            const title = getTitle(listing.type, d)
            const subtitle = getSubtitle(listing.type, d)
            const isSold = listing.status === 'sold'
            const isFilled = listing.status === 'filled'

            return (
              <div
                key={listing.id}
                onClick={() => router.push(`/listing/${listing.id}`)}
                style={{
                  background: '#fff', borderRadius: 20, marginBottom: 14,
                  cursor: 'pointer', border: '1.5px solid #EDE9FE',
                  boxShadow: '0 2px 16px rgba(79,70,229,0.06)', overflow: 'hidden',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(79,70,229,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(79,70,229,0.06)' }}
              >
                {/* Image */}
                {img && (
                  <div style={{ position: 'relative' }}>
                    <img src={img} alt={title} style={{ width: '100%', height: 180, objectFit: 'cover', filter: isSold || isFilled ? 'brightness(0.5)' : 'none' }} />
                    {isSold && (
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#EF4444', color: '#fff', fontWeight: 900, fontSize: 20, padding: '8px 24px', borderRadius: 10, letterSpacing: 2, boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>{t.sold}</div>
                    )}
                    {isFilled && (
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#059669', color: '#fff', fontWeight: 900, fontSize: 20, padding: '8px 24px', borderRadius: 10, letterSpacing: 2, boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>{t.filled}</div>
                    )}
                  </div>
                )}

                {/* Type badge */}
                <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #F5F4FF' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: `${meta.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                    {meta.icon}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 800, color: meta.color, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    {meta.label[lang] || meta.label.en}
                  </span>
                  {d.city && (
                    <span style={{ fontSize: 12, color: '#9CA3AF', marginLeft: 'auto', fontWeight: 600 }}>📍 {d.city}</span>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '12px 16px 14px' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 900, color: INDIGO, margin: '0 0 4px', lineHeight: 1.3 }}>{title}</h3>
                  {subtitle && (
                    <p style={{ fontSize: 13, fontWeight: 700, color: MINT, margin: '0 0 8px' }}>{subtitle}</p>
                  )}
                  {d.description && (
                    <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 12px', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontWeight: 500 }}>
                      {d.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: 8 }}>
                    {(d.phone || d.applyPhone) && (
                      <a href={`tel:${d.phone || d.applyPhone}`} onClick={e => e.stopPropagation()} style={{
                        flex: 1, background: `linear-gradient(135deg, ${INDIGO}, ${INDIGO_LIGHT})`,
                        borderRadius: 12, padding: '10px', color: '#fff', fontWeight: 700,
                        fontSize: 13, textAlign: 'center', textDecoration: 'none', display: 'block',
                        boxShadow: '0 4px 12px rgba(79,70,229,0.25)',
                      }}>
                        📞 {t.call}
                      </a>
                    )}
                    {d.whatsapp && (
                      <a href={`https://wa.me/${d.whatsapp.replace(/\D/g, '')}`} onClick={e => e.stopPropagation()} target="_blank" style={{
                        flex: 1, background: '#25D366', borderRadius: 12, padding: '10px',
                        color: '#fff', fontWeight: 700, fontSize: 13, textAlign: 'center',
                        textDecoration: 'none', display: 'block',
                        boxShadow: '0 4px 12px rgba(37,211,102,0.25)',
                      }}>
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
    </div>
  )
}