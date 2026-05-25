'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

const FONT = "'Plus Jakarta Sans', 'Sora', sans-serif"
const ORANGE = 'linear-gradient(135deg, #FF6B35, #FF8C61)'
const NAVY = '#1A2B5F'

function getSupabase() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

const TABS = [
  { id: 'all', label: { en: 'All', ku: 'هەموو' } },
  { id: 'list_service', label: { en: 'Services', ku: 'خزمەتگوزاری' } },
  { id: 'hire_staff', label: { en: 'Jobs', ku: 'کار' } },
  { id: 'sell_car', label: { en: 'Cars', ku: 'ئۆتۆمبێل' } },
  { id: 'sell_business', label: { en: 'Businesses', ku: 'بیزنس' } },
]

const TYPE_META = {
  list_service: { icon: '🎯', color: '#FF006E', label: { en: 'Service', ku: 'خزمەتگوزاری' } },
  hire_staff: { icon: '👥', color: '#06D6A0', label: { en: 'Job', ku: 'کار' } },
  sell_car: { icon: '🚗', color: '#00B4D8', label: { en: 'Car', ku: 'ئۆتۆمبێل' } },
  sell_business: { icon: '💼', color: '#FFB703', label: { en: 'Business', ku: 'بیزنس' } },
}

function getTitle(type, data) {
  if (type === 'list_service') return data.fullName
  if (type === 'hire_staff') return data.jobTitle
  if (type === 'sell_car') return `${data.make} ${data.model}`
  if (type === 'sell_business') return data.businessName
  return 'Listing'
}

function getSubtitle(type, data, lang) {
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
  const isRtl = lang === 'ku'

  useEffect(() => {
    fetchListings()
  }, [activeTab])

  const fetchListings = async () => {
    setLoading(true)
    const supabase = getSupabase()
    let query = supabase.from('listings').select('*').eq('status', 'approved').order('created_at', { ascending: false })
    if (activeTab !== 'all') query = query.eq('type', activeTab)
    const { data } = await query
    setListings(data || [])
    setLoading(false)
  }

  const NAV_ITEMS = [
    { id: 'home', icon: '🏠', label: { en: 'Home', ku: 'سەرەکی' }, action: () => { setActiveNav('home') } },
    { id: 'post', icon: '➕', label: { en: 'Post', ku: 'پۆست' }, action: () => { setActiveNav('post'); router.push('/post') } },
    { id: 'account', icon: '👤', label: { en: 'Account', ku: 'ئەکاونت' }, action: () => { setActiveNav('account'); router.push('/account') } },
  ]

  return (
    <div style={{ minHeight: '100vh', minHeight: '100dvh', background: '#f7f7f5', fontFamily: FONT, direction: isRtl ? 'rtl' : 'ltr', paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ background: NAVY, position: 'sticky', top: 0, zIndex: 20 }}>
        <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 900, background: ORANGE, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>KurdLink</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 3, background: 'rgba(255,255,255,0.08)', padding: '4px 5px', borderRadius: 16 }}>
              {['en', 'ku'].map(l => (
                <button key={l} onClick={() => setLang(l)} style={{ padding: '5px 10px', background: lang === l ? '#fff' : 'transparent', color: lang === l ? NAVY : 'rgba(255,255,255,0.7)', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 11, cursor: 'pointer', fontFamily: FONT }}>
                  {l === 'en' ? 'EN' : 'KU'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 0, overflowX: 'auto', padding: '0 16px 12px', scrollbarWidth: 'none' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: '8px 16px',
              background: activeTab === tab.id ? 'rgba(255,255,255,0.15)' : 'transparent',
              border: 'none',
              borderRadius: 20,
              color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.55)',
              fontWeight: activeTab === tab.id ? 700 : 600,
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: FONT,
              whiteSpace: 'nowrap',
              flexShrink: 0,
              borderBottom: activeTab === tab.id ? '2px solid #FF6B35' : '2px solid transparent',
              transition: 'all 0.2s',
            }}>
              {tab.label[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '16px 16px 20px', boxSizing: 'border-box' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
            <p style={{ color: '#aaa', fontSize: 14 }}>Loading…</p>
          </div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#444', margin: '0 0 6px' }}>
              {lang === 'en' ? 'No listings yet' : 'هێشتا هیچ لیستێک نییە'}
            </p>
            <p style={{ fontSize: 13, color: '#aaa', margin: '0 0 24px' }}>
              {lang === 'en' ? 'Be the first to post something' : 'یەکەمین بە و شتێک پۆست بکە'}
            </p>
            <button onClick={() => router.push('/post')} style={{ background: ORANGE, border: 'none', borderRadius: 12, padding: '12px 24px', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: FONT }}>
              + {lang === 'en' ? 'Post Something' : 'شتێک پۆست بکە'}
            </button>
          </div>
        ) : (
          listings.map(listing => {
            const d = listing.data || {}
            const meta = TYPE_META[listing.type]
            const img = d.imageUrls?.[0]
            const title = getTitle(listing.type, d)
            const subtitle = getSubtitle(listing.type, d, lang)

            return (
              <div key={listing.id} onClick={() => router.push(`/listing/${listing.id}`)} style={{ background: "#fff", borderRadius: 16, marginBottom: 12, cursor: "pointer", border: '1.5px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                {img && <img src={img} alt={title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />}
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <span style={{ fontSize: 14 }}>{meta.icon}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: meta.color, textTransform: 'uppercase', letterSpacing: 0.5 }}>{meta.label[lang]}</span>
                    {d.city && <span style={{ fontSize: 11, color: '#aaa', marginLeft: 'auto' }}>📍 {d.city}</span>}
                  </div>
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
                        📞 {lang === 'en' ? 'Call' : 'پەیوەندی'}
                      </a>
                    )}
                    {(d.email || d.applyEmail) && (
                      <a href={`mailto:${d.email || d.applyEmail}`} onClick={e => e.stopPropagation()} style={{ flex: 1, background: 'rgba(26,43,95,0.07)', borderRadius: 10, padding: '9px', color: NAVY, fontWeight: 700, fontSize: 13, textAlign: 'center', textDecoration: 'none', display: 'block' }}>
                        ✉️ {lang === 'en' ? 'Email' : 'ئیمەیڵ'}
                      </a>
                    )}
                    {d.whatsapp && (
                      <a href={`https://wa.me/${d.whatsapp.replace(/\D/g,'')}`} onClick={e => e.stopPropagation()} target="_blank" style={{ flex: 1, background: '#25D366', borderRadius: 10, padding: '9px', color: '#fff', fontWeight: 700, fontSize: 13, textAlign: 'center', textDecoration: 'none', display: 'block' }}>
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

      {/* Bottom Navigation */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#fff',
        borderTop: '1px solid rgba(0,0,0,0.08)',
        display: 'flex',
        zIndex: 50,
        paddingBottom: 'env(safe-area-inset-bottom)',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
      }}>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={item.action}
            style={{
              flex: 1,
              padding: '10px 0 8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              fontFamily: FONT,
            }}
          >
            {item.id === 'post' ? (
              <div style={{
                width: 44,
                height: 44,
                background: 'linear-gradient(135deg, #FF6B35, #FF8C61)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                marginTop: -20,
                boxShadow: '0 4px 16px rgba(255,107,53,0.5)',
              }}>
                ➕
              </div>
            ) : (
              <span style={{ fontSize: 20 }}>{item.icon}</span>
            )}
            <span style={{
              fontSize: 10,
              fontWeight: 700,
              color: activeNav === item.id ? '#FF6B35' : '#aaa',
              marginTop: item.id === 'post' ? 2 : 0,
            }}>
              {item.label[lang]}
            </span>
          </button>
        ))}
      </div>

    </div>
  )
}