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

const TYPE_META = {
  list_service: { icon: '🎯', color: '#FF006E', label: { en: 'Service', ku: 'خزمەتگوزاری' } },
  hire_staff: { icon: '👥', color: '#06D6A0', label: { en: 'Job', ku: 'کار' } },
  sell_car: { icon: '🚗', color: '#00B4D8', label: { en: 'Car for Sale', ku: 'ئۆتۆمبێل بۆ فرۆشتن' } },
  sell_business: { icon: '💼', color: '#FFB703', label: { en: 'Business for Sale', ku: 'بیزنس بۆ فرۆشتن' } },
}

function getTitle(type, data) {
  if (type === 'list_service') return data.fullName
  if (type === 'hire_staff') return data.jobTitle
  if (type === 'sell_car') return `${data.make} ${data.model}`
  if (type === 'sell_business') return data.businessName
  return 'Listing'
}

export default function ListingDetail({ params }) {
  const router = useRouter()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [lang, setLang] = useState('en')
  const isRtl = lang === 'ku'

  useEffect(() => {
    if (params?.id) fetchListing(params.id)
  }, [params?.id])

  const fetchListing = async (id) => {
    try {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      setListing(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f7f7f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT }}>
      <div style={{ color: '#aaa', fontSize: 14 }}>Loading…</div>
    </div>
  )

  if (!listing) return (
    <div style={{ minHeight: '100vh', background: '#f7f7f5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, padding: 20, textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>😕</div>
      <p style={{ fontSize: 16, fontWeight: 700, color: '#444' }}>Listing not found</p>
      <button onClick={() => router.push('/home')} style={{ marginTop: 16, background: ORANGE, border: 'none', borderRadius: 12, padding: '12px 24px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>Go Home</button>
    </div>
  )

  const d = listing.data || {}
  const meta = TYPE_META[listing.type] || { icon: '📋', color: '#888', label: { en: 'Listing', ku: 'لیست' } }
  const images = d.imageUrls || []
  const title = getTitle(listing.type, d)

  const Field = ({ label, value }) => value ? (
    <div style={{ paddingBottom: 14, marginBottom: 14, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: 0.5, margin: '0 0 4px' }}>{label}</p>
      <p style={{ fontSize: 15, color: '#1a1a1a', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>{value}</p>
    </div>
  ) : null

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f5', fontFamily: FONT, direction: isRtl ? 'rtl' : 'ltr', paddingBottom: 100 }}>

      {/* Header */}
      <div style={{ background: NAVY, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 20 }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', fontSize: 15, cursor: 'pointer', fontFamily: FONT, fontWeight: 600 }}>← Back</button>
        <div style={{ fontSize: 16, fontWeight: 900, background: ORANGE, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>KurdLink</div>
        <div style={{ display: 'flex', gap: 3, background: 'rgba(255,255,255,0.1)', padding: '4px 5px', borderRadius: 16 }}>
          {['en', 'ku'].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ padding: '5px 10px', background: lang === l ? '#fff' : 'transparent', color: lang === l ? NAVY : 'rgba(255,255,255,0.7)', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 11, cursor: 'pointer', fontFamily: FONT }}>
              {l === 'en' ? 'EN' : 'KU'}
            </button>
          ))}
        </div>
      </div>

      {/* Image Gallery */}
      {images.length > 0 && (
        <div style={{ background: '#000' }}>
          <img src={images[activeImage]} alt={title} style={{ width: '100%', height: 280, objectFit: 'cover', opacity: 0.95, display: 'block' }} />
          {images.length > 1 && (
            <>
              <div style={{ position: 'absolute', marginTop: -40, right: 12, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 20, fontFamily: FONT }}>
                {activeImage + 1} / {images.length}
              </div>
              <div style={{ display: 'flex', gap: 6, padding: '10px 16px', background: '#111', overflowX: 'auto', scrollbarWidth: 'none' }}>
                {images.map((img, i) => (
                  <img key={i} src={img} alt={`photo ${i + 1}`} onClick={() => setActiveImage(i)} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8, cursor: 'pointer', border: activeImage === i ? '2px solid #FF6B35' : '2px solid transparent', flexShrink: 0, opacity: activeImage === i ? 1 : 0.6 }} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Main Content */}
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px 16px', boxSizing: 'border-box' }}>

        {/* Type + Title */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 16 }}>{meta.icon}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: meta.color, textTransform: 'uppercase', letterSpacing: 0.5 }}>{meta.label[lang]}</span>
            {d.city && <span style={{ fontSize: 12, color: '#aaa', marginLeft: 'auto' }}>📍 {d.city} {d.postcode}</span>}
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: NAVY, margin: '0 0 8px', lineHeight: 1.2 }}>{title}</h1>

          {listing.type === 'sell_car' && d.price && <div style={{ fontSize: 22, fontWeight: 800, color: '#FF6B35' }}>£{Number(d.price).toLocaleString()}</div>}
          {listing.type === 'sell_business' && d.askingPrice && <div style={{ fontSize: 22, fontWeight: 800, color: '#FF6B35' }}>£{Number(d.askingPrice).toLocaleString()}</div>}
          {listing.type === 'hire_staff' && d.salary && <div style={{ fontSize: 16, fontWeight: 700, color: '#FF6B35' }}>💰 {d.salary}</div>}
          {listing.type === 'list_service' && d.category && <div style={{ display: 'inline-block', background: 'rgba(255,0,110,0.08)', color: '#FF006E', fontSize: 13, fontWeight: 700, padding: '4px 12px', borderRadius: 20 }}>{d.category}</div>}
        </div>

        {/* Details */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px', marginBottom: 16, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          {listing.type === 'sell_car' && <>
            <Field label="Make" value={d.make} />
            <Field label="Model" value={d.model} />
            <Field label="Year" value={d.year} />
            <Field label="Mileage" value={d.mileage ? `${Number(d.mileage).toLocaleString()} miles` : null} />
            <Field label="Condition" value={d.condition} />
            <Field label="Location" value={d.city ? `${d.city}${d.postcode ? `, ${d.postcode}` : ''}` : null} />
            <Field label="Description" value={d.description} />
            <Field label="Seller" value={d.name} />
          </>}
          {listing.type === 'sell_business' && <>
            <Field label="Business Name" value={d.businessName} />
            <Field label="Asking Price" value={d.askingPrice ? `£${Number(d.askingPrice).toLocaleString()}` : null} />
            <Field label="Location" value={d.city ? `${d.city}${d.postcode ? `, ${d.postcode}` : ''}` : null} />
            <Field label="About the Business" value={d.description} />
            <Field label="Contact Name" value={d.name} />
          </>}
          {listing.type === 'hire_staff' && <>
            <Field label="Job Title" value={d.jobTitle} />
            <Field label="Salary / Rate" value={d.salary} />
            <Field label="Location" value={d.city ? `${d.city}${d.postcode ? `, ${d.postcode}` : ''}` : null} />
            <Field label="Job Description" value={d.description} />
            <Field label="Posted by" value={d.name} />
          </>}
          {listing.type === 'list_service' && <>
            <Field label="Name" value={d.fullName} />
            <Field label="Business / Practice" value={d.businessName} />
            <Field label="Service" value={d.category} />
            <Field label="Experience" value={d.experience ? `${d.experience} years` : null} />
            <Field label="Location" value={d.city ? `${d.city}${d.postcode ? `, ${d.postcode}` : ''}` : null} />
            <Field label="Address" value={d.address} />
            <Field label="About" value={d.description} />
            <Field label="Website" value={d.website} />
          </>}
        </div>
      </div>

      {/* Fixed Contact Bar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid rgba(0,0,0,0.08)', padding: '12px 16px', display: 'flex', gap: 10, zIndex: 30, boxSizing: 'border-box' }}>
        {(d.phone || d.applyPhone) && (
          <a href={`tel:${d.phone || d.applyPhone}`} style={{ flex: 1, background: ORANGE, borderRadius: 14, padding: '14px', color: '#fff', fontWeight: 700, fontSize: 15, textAlign: 'center', textDecoration: 'none', display: 'block', boxShadow: '0 4px 12px rgba(255,107,53,0.3)' }}>📞 Call</a>
        )}
        {d.whatsapp && (
          <a href={`https://wa.me/${d.whatsapp.replace(/\D/g, '')}`} target="_blank" style={{ flex: 1, background: '#25D366', borderRadius: 14, padding: '14px', color: '#fff', fontWeight: 700, fontSize: 15, textAlign: 'center', textDecoration: 'none', display: 'block' }}>💬 WhatsApp</a>
        )}
        {(d.email || d.applyEmail || d.contactEmail) && (
          <a href={`mailto:${d.email || d.applyEmail || d.contactEmail}`} style={{ flex: 1, background: 'rgba(26,43,95,0.08)', borderRadius: 14, padding: '14px', color: NAVY, fontWeight: 700, fontSize: 15, textAlign: 'center', textDecoration: 'none', display: 'block' }}>✉️ Email</a>
        )}
      </div>
    </div>
  )
}