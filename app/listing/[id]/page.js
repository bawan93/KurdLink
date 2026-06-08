'use client'
import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase'

const INDIGO = '#4F46E5'
const INDIGO_DARK = '#1C1A4F'
const INDIGO_LIGHT = '#818CF8'
const MINT = '#34D399'
const SOFT = '#EDE9FE'
const BG = '#F5F4FF'
const FONT = "Nunito, sans-serif"


const TYPE_META = {
  list_service: { icon: '🎯', color: INDIGO, label: { en: 'Service', ku: 'خزمەتگوزاری', fa: 'خدمت', ar: 'خدمة' } },
  hire_staff:   { icon: '👥', color: INDIGO, label: { en: 'Job', ku: 'کار', fa: 'شغل', ar: 'وظيفة' } },
}

const TX = {
  en: { back: '← Back', filled: 'POSITION FILLED', filledBox: 'This position has been filled', ref: 'Listed for reference only — no longer available', notFound: 'Listing not found', goHome: 'Go Home', call: 'Call', whatsapp: 'WhatsApp', location: 'Location', description: 'Description', jobTitle: 'Job Title', salary: 'Salary / Rate', jobDesc: 'Job Description', name: 'Name', business: 'Business', service: 'Service', experience: 'Experience', address: 'Address', website: 'Website', years: 'years exp', contact: 'Contact' },
  ku: { back: '→ گەڕانەوە', filled: 'پۆستەکە پڕکراوە', filledBox: 'ئەم پۆستە پڕکراوە', ref: 'تەنها بۆ تێڕوانین بەردەستە', notFound: 'لیستەکە نەدۆزرایەوە', goHome: 'بڕۆ بۆ ماڵەوە', call: 'پەیوەندی', whatsapp: 'واتساپ', location: 'شوێن', description: 'وەسف', jobTitle: 'ناوی کار', salary: 'مووچە', jobDesc: 'وەسفی کار', name: 'ناو', business: 'بیزنس', service: 'خزمەتگوزاری', experience: 'ئەزموون', address: 'ناونیشان', website: 'ماڵپەڕ', years: 'ساڵ ئەزموون', contact: 'پەیوەندی' },
  fa: { back: '→ بازگشت', filled: 'موقعیت پر شده', filledBox: 'این موقعیت پر شده', ref: 'فقط برای مرجع — دیگر موجود نیست', notFound: 'آگهی پیدا نشد', goHome: 'برو خانه', call: 'تماس', whatsapp: 'واتساپ', location: 'محل', description: 'توضیحات', jobTitle: 'عنوان شغل', salary: 'حقوق', jobDesc: 'شرح شغل', name: 'نام', business: 'شرکت', service: 'خدمت', experience: 'تجربه', address: 'آدرس', website: 'وب‌سایت', years: 'سال تجربه', contact: 'تماس' },
  ar: { back: '→ رجوع', filled: 'تم شغل الوظيفة', filledBox: 'تم شغل هذه الوظيفة', ref: 'للإشارة فقط — لم يعد متاحاً', notFound: 'لم يُعثر على الإعلان', goHome: 'الرئيسية', call: 'اتصال', whatsapp: 'واتساب', location: 'الموقع', description: 'الوصف', jobTitle: 'المسمى الوظيفي', salary: 'الراتب', jobDesc: 'وصف الوظيفة', name: 'الاسم', business: 'الشركة', service: 'الخدمة', experience: 'الخبرة', address: 'العنوان', website: 'الموقع الإلكتروني', years: 'سنوات خبرة', contact: 'تواصل' },
}

function Field({ label, value }) {
  if (!value) return null
  return (
    <div style={{ paddingBottom: 14, marginBottom: 14, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: 0.5, margin: '0 0 4px' }}>{label}</p>
      <p style={{ fontSize: 15, color: INDIGO_DARK, margin: 0, lineHeight: 1.5, fontWeight: 500 }}>{value}</p>
    </div>
  )
}


export default function ListingDetail({ params }) {
  const { id } = use(params)
  const router = useRouter()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lang, setLang] = useState('en')
  const t = TX[lang] || TX.en

  useEffect(() => {
    const saved = localStorage.getItem('komek_lang')
    if (saved) setLang(saved)
    const handler = (e) => setLang(e.detail)
    window.addEventListener('langchange', handler)
    if (id) fetchListing(id)
    return () => window.removeEventListener('langchange', handler)
  }, [id])

  const fetchListing = async (listingId) => {
    try {
      const { data, error } = await createClient().from('listings').select('*').eq('id', listingId).maybeSingle()
      if (error) console.error(error)
      setListing(data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT }}>
      <p style={{ color: '#aaa' }}>Loading…</p>
    </div>
  )

  if (!listing) return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, padding: 20, textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>😕</div>
      <p style={{ fontSize: 16, fontWeight: 700, color: '#444' }}>{t.notFound}</p>
      <button onClick={() => router.push('/home')} style={{ marginTop: 16, background: INDIGO, border: 'none', borderRadius: 12, padding: '12px 24px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>{t.goHome}</button>
    </div>
  )

  const d = listing.data || {}
  const meta = TYPE_META[listing.type] || { icon: '📋', color: INDIGO, label: { en: 'Listing', ku: 'لیست', fa: 'آگهی', ar: 'إعلان' } }
  const isFilled = listing.status === 'filled'

  const getTitle = () => {
    if (listing.type === 'list_service') return d.serviceName || d.fullName
    if (listing.type === 'hire_staff') return d.jobTitle
    return 'Listing'
  }

  const contactValue = d.contact || d.phone || d.applyPhone || d.email
  const isPhone = contactValue && /^[\d\s\+\-\(\)]+$/.test(contactValue)

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: FONT, direction: 'ltr', paddingBottom: 100 }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${INDIGO_DARK} 0%, #2D2A7A 100%)`, padding: '20px 16px 40px' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 14, cursor: 'pointer', fontFamily: FONT, fontWeight: 600, padding: 0, marginBottom: 20, display: 'block' }}>{t.back}</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 16 }}>{meta.icon}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: INDIGO_LIGHT, textTransform: 'uppercase', letterSpacing: 0.5 }}>{meta.label[lang] || meta.label.en}</span>
        </div>
        <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 900, margin: '0 0 8px', lineHeight: 1.2 }}>{getTitle()}</h1>
        {listing.type === 'hire_staff' && d.salary && (
          <div style={{ fontSize: 15, fontWeight: 700, color: MINT }}>💰 {d.salary}</div>
        )}
        {listing.type === 'list_service' && d.price && (
          <div style={{ fontSize: 15, fontWeight: 700, color: MINT }}>💰 {d.price}</div>
        )}
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 16px', marginTop: -20 }}>
        {/* Filled banner */}
        {isFilled && (
          <div style={{ background: '#F0FDF4', border: '1.5px solid #BBF7D0', borderRadius: 14, padding: '14px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 24 }}>✅</span>
            <div>
              <p style={{ fontWeight: 800, fontSize: 15, color: '#166534', margin: '0 0 3px' }}>{t.filledBox}</p>
              <p style={{ fontSize: 13, color: '#666', margin: 0 }}>{t.ref}</p>
            </div>
          </div>
        )}

        {/* Details card */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 20, marginBottom: 16, boxShadow: '0 4px 24px rgba(79,70,229,0.08)', border: '1px solid rgba(79,70,229,0.06)' }}>
          {listing.type === 'hire_staff' && <>
            <Field label={t.jobTitle} value={d.jobTitle} />
            <Field label={t.salary} value={d.salary} />
            <Field label={t.location} value={d.location} />
            <Field label={t.jobDesc} value={d.description} />
            {d.companyName && <Field label={t.business} value={d.companyName} />}
          </>}
          {listing.type === 'list_service' && <>
            <Field label={t.name} value={d.fullName} />
            <Field label={t.service} value={d.serviceName || d.category} />
            <Field label={t.experience} value={d.experience ? `${d.experience} ${t.years}` : null} />
            <Field label={t.location} value={d.location} />
            <Field label={t.address} value={d.address} />
            <Field label={t.description} value={d.description} />
            <Field label={t.website} value={d.website} />
          </>}
        </div>
      </div>

      {/* Contact button */}
      {!isFilled && contactValue && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #EDE9FE', padding: '12px 16px', zIndex: 30 }}>
          <a
            href={isPhone ? `tel:${contactValue}` : `mailto:${contactValue}`}
            style={{ display: 'block', width: '100%', background: INDIGO, borderRadius: 14, padding: '15px', color: '#fff', fontWeight: 800, fontSize: 16, textAlign: 'center', textDecoration: 'none', fontFamily: FONT, boxSizing: 'border-box' }}
          >
            {isPhone ? `📞 ${t.call}` : `✉️ ${t.contact}`}
          </a>
        </div>
      )}

      {isFilled && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#F0FDF4', borderTop: '1px solid #BBF7D0', padding: '14px 20px', textAlign: 'center', zIndex: 30 }}>
          <p style={{ margin: 0, fontWeight: 700, color: '#166534', fontSize: 14 }}>✅ {t.filledBox}</p>
        </div>
      )}
    </div>
  )
}