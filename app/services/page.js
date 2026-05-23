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

export default function Services() {
  const router = useRouter()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [lang, setLang] = useState('en')
  const isRtl = lang === 'ku'

  const T = {
    en: { title: 'Find Services', subtitle: 'Trusted Kurdish professionals across the UK', empty: 'No services listed yet', emptyDesc: 'Check back soon or list your service', listService: 'List My Service', call: 'Call', whatsapp: 'WhatsApp', email: 'Email', years: 'yrs exp', website: 'Website' },
    ku: { title: 'خزمەتگوزاری بدۆزەوە', subtitle: 'پیشەوەری کوردی متمانەپێکراو لە سەرانسەری UK', empty: 'هێشتا هیچ خزمەتگوزارییەک لیست نەکراوە', emptyDesc: 'دواتر سەردان بکەرەوە یان خزمەتگوزاریەکەت لیست بکە', listService: 'خزمەتگوزاریەکەم لیست بکە', call: 'پەیوەندی', whatsapp: 'واتساپ', email: 'ئیمەیڵ', years: 'ساڵ ئەزموون', website: 'ماڵپەڕ' }
  }
  const t = T[lang]

  useEffect(() => { fetchServices() }, [])

  const fetchServices = async () => {
    const supabase = getSupabase()
    const { data } = await supabase
      .from('listings')
      .select('*')
      .eq('type', 'list_service')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
    setListings(data || [])
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f5', fontFamily: FONT, direction: isRtl ? 'rtl' : 'ltr', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ background: NAVY, padding: '16px 20px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 15, cursor: 'pointer', fontFamily: FONT, fontWeight: 600 }}>← Back</button>
          <div style={{ fontSize: 18, fontWeight: 800, background: ORANGE, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>KurdLink</div>
          <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.1)', padding: '4px 6px', borderRadius: 20 }}>
            {['en', 'ku'].map(l => (<button key={l} onClick={() => setLang(l)} style={{ padding: '5px 12px', background: lang === l ? '#fff' : 'transparent', color: lang === l ? NAVY : 'rgba(255,255,255,0.7)', border: 'none', borderRadius: 16, fontWeight: 700, fontSize: 11, cursor: 'pointer', fontFamily: FONT }}>{l === 'en' ? 'EN' : 'KU'}</button>))}
          </div>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: '8px 0 2px' }}>🔍 {t.title}</h1>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', margin: 0 }}>{t.subtitle}</p>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '16px 16px 20px', boxSizing: 'border-box' }}>
        <button onClick={() => router.push('/listings/list-service')} style={{ width: '100%', background: ORANGE, border: 'none', borderRadius: 14, padding: '14px', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: FONT, marginBottom: 16, boxShadow: '0 4px 16px rgba(255,107,53,0.3)' }}>
          + {t.listService}
        </button>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#aaa', fontSize: 14 }}>Loading…</div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#444', margin: '0 0 6px' }}>{t.empty}</p>
            <p style={{ fontSize: 13, color: '#aaa', margin: 0 }}>{t.emptyDesc}</p>
          </div>
        ) : (
          listings.map(listing => {
            const d = listing.data || {}
            const img = d.imageUrls?.[0]
            return (
              <div key={listing.id} style={{ background: '#fff', borderRadius: 16, padding: '16px', marginBottom: 12, border: '1.5px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  {/* Avatar or logo */}
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: img ? 'transparent' : `linear-gradient(135deg, ${NAVY}, #2a4a8f)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                    {img ? <img src={img} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 22, color: '#fff' }}>🎯</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: NAVY, margin: '0 0 2px', lineHeight: 1.2 }}>{d.fullName}</h3>
                    {d.businessName && <p style={{ fontSize: 13, color: '#666', margin: '0 0 2px' }}>{d.businessName}</p>}
                    <span style={{ display: 'inline-block', background: 'rgba(255,107,53,0.1)', color: '#FF6B35', fontSize: 12, fontWeight: 700, padding: '2px 10px', borderRadius: 20 }}>{d.category}</span>
                  </div>
                  {d.experience && (
                    <div style={{ textAlign: 'center', flexShrink: 0 }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: NAVY }}>{d.experience}</div>
                      <div style={{ fontSize: 10, color: '#888', fontWeight: 600 }}>{t.years}</div>
                    </div>
                  )}
                </div>

                {d.city && <p style={{ fontSize: 12, color: '#888', margin: '0 0 8px' }}>📍 {d.city} {d.postcode}</p>}
                {d.description && <p style={{ fontSize: 13, color: '#666', margin: '0 0 14px', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{d.description}</p>}

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {d.phone && <a href={`tel:${d.phone}`} style={{ flex: 1, minWidth: 80, background: ORANGE, borderRadius: 10, padding: '10px 8px', color: '#fff', fontWeight: 700, fontSize: 12, textAlign: 'center', textDecoration: 'none', display: 'block' }}>📞 {t.call}</a>}
                  {d.whatsapp && <a href={`https://wa.me/${d.whatsapp.replace(/\D/g,'')}`} target="_blank" style={{ flex: 1, minWidth: 80, background: '#25D366', borderRadius: 10, padding: '10px 8px', color: '#fff', fontWeight: 700, fontSize: 12, textAlign: 'center', textDecoration: 'none', display: 'block' }}>💬 {t.whatsapp}</a>}
                  {d.email && <a href={`mailto:${d.email}`} style={{ flex: 1, minWidth: 80, background: 'rgba(26,43,95,0.08)', borderRadius: 10, padding: '10px 8px', color: NAVY, fontWeight: 700, fontSize: 12, textAlign: 'center', textDecoration: 'none', display: 'block' }}>✉️ {t.email}</a>}
                  {d.website && <a href={d.website.startsWith('http') ? d.website : `https://${d.website}`} target="_blank" style={{ flex: 1, minWidth: 80, background: 'rgba(26,43,95,0.08)', borderRadius: 10, padding: '10px 8px', color: NAVY, fontWeight: 700, fontSize: 12, textAlign: 'center', textDecoration: 'none', display: 'block' }}>🌐 {t.website}</a>}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}