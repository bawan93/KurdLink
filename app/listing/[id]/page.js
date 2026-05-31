'use client'
import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import LangDropdown from '../../components/LangDropdown
'

const FONT = "'Plus Jakarta Sans', 'Sora', sans-serif"
const ORANGE = 'linear-gradient(135deg, #FF6B35, #FF8C61)'
const NAVY = '#1A2B5F'

function getSupabase() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

const TYPE_META = {
  list_service: { icon: '🎯', color: '#FF006E', label: { en: 'Service', ku: 'خزمەتگوزاری', fa: 'خدمت', ar: 'خدمة' } },
  hire_staff:   { icon: '👥', color: '#06D6A0', label: { en: 'Job', ku: 'کار', fa: 'شغل', ar: 'وظيفة' } },
  sell_car:     { icon: '🚗', color: '#00B4D8', label: { en: 'Car for Sale', ku: 'ئۆتۆمبێل بۆ فرۆشتن', fa: 'ماشین برای فروش', ar: 'سيارة للبيع' } },
  sell_business:{ icon: '💼', color: '#FFB703', label: { en: 'Business for Sale', ku: 'بیزنس بۆ فرۆشتن', fa: 'کسب‌وکار برای فروش', ar: 'عمل تجاري للبيع' } },
}

const TX = {
  en: { back: '← Back', sold: 'THIS ITEM HAS BEEN SOLD', filled: 'POSITION FILLED', soldBox: 'This item has been sold', filledBox: 'This position has been filled', ref: 'Listed for reference only — no longer available', notFound: 'Listing not found', goHome: 'Go Home', call: 'Call', whatsapp: 'WhatsApp', make: 'Make', model: 'Model', year: 'Year', mileage: 'Mileage', condition: 'Condition', location: 'Location', description: 'Description', seller: 'Seller', bizName: 'Business Name', askingPrice: 'Asking Price', about: 'About the Business', jobTitle: 'Job Title', salary: 'Salary / Rate', jobDesc: 'Job Description', postedBy: 'Posted by', name: 'Name', business: 'Business / Practice', service: 'Service', experience: 'Experience', address: 'Address', website: 'Website', miles: 'miles', years: 'years exp' },
  ku: { back: '→ گەڕانەوە', sold: 'ئەم بابەتە فرۆشراوە', filled: 'پۆستەکە پڕکراوە', soldBox: 'ئەم بابەتە فرۆشراوە', filledBox: 'ئەم پۆستە پڕکراوە', ref: 'تەنها بۆ تێڕوانین بەردەستە', notFound: 'لیستەکە نەدۆزرایەوە', goHome: 'بڕۆ بۆ ماڵەوە', call: 'پەیوەندی', whatsapp: 'واتساپ', make: 'مارکا', model: 'مۆدێل', year: 'ساڵ', mileage: 'میلیج', condition: 'حاڵەت', location: 'شوێن', description: 'وەسف', seller: 'فرۆشیار', bizName: 'ناوی بیزنس', askingPrice: 'نرخی داواکراو', about: 'دەربارەی بیزنس', jobTitle: 'ناوی کار', salary: 'مووچە', jobDesc: 'وەسفی کار', postedBy: 'بڵاوکراوەتەوە لەلایەن', name: 'ناو', business: 'بیزنس', service: 'خزمەتگوزاری', experience: 'ئەزموون', address: 'ناونیشان', website: 'ماڵپەڕ', miles: 'میل', years: 'ساڵ ئەزموون' },
  fa: { back: '→ بازگشت', sold: 'این کالا فروخته شده', filled: 'موقعیت پر شده', soldBox: 'این کالا فروخته شده', filledBox: 'این موقعیت پر شده', ref: 'فقط برای مرجع — دیگر موجود نیست', notFound: 'آگهی پیدا نشد', goHome: 'برو خانه', call: 'تماس', whatsapp: 'واتساپ', make: 'برند', model: 'مدل', year: 'سال', mileage: 'کارکرد', condition: 'وضعیت', location: 'محل', description: 'توضیحات', seller: 'فروشنده', bizName: 'نام کسب‌وکار', askingPrice: 'قیمت درخواستی', about: 'درباره کسب‌وکار', jobTitle: 'عنوان شغل', salary: 'حقوق', jobDesc: 'شرح شغل', postedBy: 'ارسال شده توسط', name: 'نام', business: 'شرکت', service: 'خدمت', experience: 'تجربه', address: 'آدرس', website: 'وب‌سایت', miles: 'مایل', years: 'سال تجربه' },
  ar: { back: '→ رجوع', sold: 'تم بيع هذا العنصر', filled: 'تم شغل الوظيفة', soldBox: 'تم بيع هذا العنصر', filledBox: 'تم شغل هذه الوظيفة', ref: 'للإشارة فقط — لم يعد متاحاً', notFound: 'لم يُعثر على الإعلان', goHome: 'الرئيسية', call: 'اتصال', whatsapp: 'واتساب', make: 'الماركة', model: 'الموديل', year: 'السنة', mileage: 'الأميال', condition: 'الحالة', location: 'الموقع', description: 'الوصف', seller: 'البائع', bizName: 'اسم العمل', askingPrice: 'السعر المطلوب', about: 'عن العمل التجاري', jobTitle: 'المسمى الوظيفي', salary: 'الراتب', jobDesc: 'وصف الوظيفة', postedBy: 'نُشر بواسطة', name: 'الاسم', business: 'الشركة', service: 'الخدمة', experience: 'الخبرة', address: 'العنوان', website: 'الموقع الإلكتروني', miles: 'ميل', years: 'سنوات خبرة' },
}

function Field({ label, value }) {
  if (!value) return null
  return (
    <div style={{ paddingBottom: 14, marginBottom: 14, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: 0.5, margin: '0 0 4px' }}>{label}</p>
      <p style={{ fontSize: 15, color: '#1a1a1a', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>{value}</p>
    </div>
  )
}

export default function ListingDetail({ params }) {
  const { id } = use(params)
  const router = useRouter()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [lang, setLang] = useState('en')
  
  const t = TX[lang] || TX.en

  useEffect(() => {
    const saved = localStorage.getItem('kurdlink_lang')
    if (saved) setLang(saved)
    if (id) fetchListing(id)
  }, [id])

  const fetchListing = async (listingId) => {
    try {
      const { data, error } = await getSupabase().from('listings').select('*').eq('id', listingId).maybeSingle()
      if (error) console.error(error)
      setListing(data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  if (loading) return <div style={{ minHeight: '100vh', background: '#f7f7f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT }}><p style={{ color: '#aaa' }}>Loading…</p></div>

  if (!listing) return (
    <div style={{ minHeight: '100vh', background: '#f7f7f5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, padding: 20, textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>😕</div>
      <p style={{ fontSize: 16, fontWeight: 700, color: '#444' }}>{t.notFound}</p>
      <button onClick={() => router.push('/home')} style={{ marginTop: 16, background: ORANGE, border: 'none', borderRadius: 12, padding: '12px 24px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>{t.goHome}</button>
    </div>
  )

  const d = listing.data || {}
  const meta = TYPE_META[listing.type] || { icon: '📋', color: '#888', label: { en: 'Listing', ku: 'لیست', fa: 'آگهی', ar: 'إعلان' } }
  const images = d.imageUrls || []
  const isSold = listing.status === 'sold'
  const isFilled = listing.status === 'filled'

  const getTitle = () => {
    if (listing.type === 'list_service') return d.fullName
    if (listing.type === 'hire_staff') return d.jobTitle
    if (listing.type === 'sell_car') return `${d.make} ${d.model}`
    if (listing.type === 'sell_business') return d.businessName
    return 'Listing'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f5', fontFamily: FONT, direction: 'ltr', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ background: NAVY, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 20 }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', fontSize: 15, cursor: 'pointer', fontFamily: FONT, fontWeight: 600 }}>{t.back}</button>
        <div style={{ fontSize: 16, fontWeight: 900, background: ORANGE, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>KurdLink</div>
        <LangDropdown lang={lang} onChange={setLang} />
      </div>

      {/* SOLD/FILLED banner — no image */}
      {(isSold || isFilled) && images.length === 0 && (
        <div style={{ background: isSold ? '#EF4444' : '#22C55E', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>{isSold ? '🚫' : '✅'}</span>
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 16, letterSpacing: 1 }}>{isSold ? t.sold : t.filled}</span>
        </div>
      )}

      {/* Image gallery */}
      {images.length > 0 && (
        <div style={{ background: '#000', position: 'relative' }}>
          <img src={images[activeImage]} alt={getTitle()} style={{ width: '100%', height: 280, objectFit: 'cover', display: 'block', filter: isSold || isFilled ? 'brightness(0.45)' : 'none' }} />
          {(isSold || isFilled) && (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <div style={{ background: isSold ? '#EF4444' : '#22C55E', color: '#fff', fontWeight: 900, fontSize: 28, padding: '12px 32px', borderRadius: 14, letterSpacing: 3, boxShadow: '0 6px 24px rgba(0,0,0,0.4)' }}>
                {isSold ? 'SOLD' : 'FILLED'}
              </div>
            </div>
          )}
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: 6, padding: '10px 16px', background: '#111', overflowX: 'auto', scrollbarWidth: 'none' }}>
              {images.map((img, i) => (
                <img key={i} src={img} alt={`photo ${i + 1}`} onClick={() => setActiveImage(i)} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8, cursor: 'pointer', border: activeImage === i ? '2px solid #FF6B35' : '2px solid transparent', flexShrink: 0, opacity: activeImage === i ? 1 : 0.6 }} />
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px 16px', boxSizing: 'border-box' }}>
        {(isSold || isFilled) && (
          <div style={{ background: isSold ? '#FEF2F2' : '#F0FDF4', border: `1.5px solid ${isSold ? '#FECACA' : '#BBF7D0'}`, borderRadius: 14, padding: '14px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 24 }}>{isSold ? '🚫' : '✅'}</span>
            <div>
              <p style={{ fontWeight: 800, fontSize: 15, color: isSold ? '#991B1B' : '#166534', margin: '0 0 3px' }}>{isSold ? t.soldBox : t.filledBox}</p>
              <p style={{ fontSize: 13, color: '#666', margin: 0 }}>{t.ref}</p>
            </div>
          </div>
        )}

        {/* Type + title */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 16 }}>{meta.icon}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: meta.color, textTransform: 'uppercase', letterSpacing: 0.5 }}>{meta.label[lang] || meta.label.en}</span>
            {d.city && <span style={{ fontSize: 12, color: '#aaa', marginLeft: 'auto' }}>📍 {d.city} {d.postcode}</span>}
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: NAVY, margin: '0 0 8px', lineHeight: 1.2 }}>{getTitle()}</h1>
          {listing.type === 'sell_car' && d.price && <div style={{ fontSize: 22, fontWeight: 800, color: isSold ? '#aaa' : '#FF6B35', textDecoration: isSold ? 'line-through' : 'none' }}>£{Number(d.price).toLocaleString()}</div>}
          {listing.type === 'sell_business' && d.askingPrice && <div style={{ fontSize: 22, fontWeight: 800, color: isSold ? '#aaa' : '#FF6B35', textDecoration: isSold ? 'line-through' : 'none' }}>£{Number(d.askingPrice).toLocaleString()}</div>}
          {listing.type === 'hire_staff' && d.salary && <div style={{ fontSize: 16, fontWeight: 700, color: '#FF6B35' }}>💰 {d.salary}</div>}
          {listing.type === 'list_service' && d.category && <div style={{ display: 'inline-block', background: 'rgba(255,0,110,0.08)', color: '#FF006E', fontSize: 13, fontWeight: 700, padding: '4px 12px', borderRadius: 20 }}>{d.category}</div>}
        </div>

        {/* Fields */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px', marginBottom: 16, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          {listing.type === 'sell_car' && <>
            <Field label={t.make} value={d.make} />
            <Field label={t.model} value={d.model} />
            <Field label={t.year} value={d.year} />
            <Field label={t.mileage} value={d.mileage ? `${Number(d.mileage).toLocaleString()} ${t.miles}` : null} />
            <Field label={t.condition} value={d.condition} />
            <Field label={t.location} value={d.city ? `${d.city}${d.postcode ? `, ${d.postcode}` : ''}` : null} />
            <Field label={t.description} value={d.description} />
            {d.name && <Field label={t.seller} value={d.name} />}
          </>}
          {listing.type === 'sell_business' && <>
            <Field label={t.bizName} value={d.businessName} />
            <Field label={t.askingPrice} value={d.askingPrice ? `£${Number(d.askingPrice).toLocaleString()}` : null} />
            <Field label={t.location} value={d.city ? `${d.city}${d.postcode ? `, ${d.postcode}` : ''}` : null} />
            <Field label={t.about} value={d.description} />
            {d.name && <Field label={t.seller} value={d.name} />}
          </>}
          {listing.type === 'hire_staff' && <>
            <Field label={t.jobTitle} value={d.jobTitle} />
            <Field label={t.salary} value={d.salary} />
            <Field label={t.location} value={d.city ? `${d.city}${d.postcode ? `, ${d.postcode}` : ''}` : null} />
            <Field label={t.jobDesc} value={d.description} />
            {d.companyName && <Field label={t.business} value={d.companyName} />}
          </>}
          {listing.type === 'list_service' && <>
            <Field label={t.name} value={d.fullName} />
            <Field label={t.business} value={d.businessName} />
            <Field label={t.service} value={d.category} />
            <Field label={t.experience} value={d.experience ? `${d.experience} ${t.years}` : null} />
            <Field label={t.location} value={d.city ? `${d.city}${d.postcode ? `, ${d.postcode}` : ''}` : null} />
            <Field label={t.address} value={d.address} />
            <Field label={t.description} value={d.description} />
            <Field label={t.website} value={d.website} />
          </>}
        </div>
      </div>

      {/* Contact buttons */}
      {!isSold && !isFilled && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid rgba(0,0,0,0.08)', padding: '12px 16px', display: 'flex', gap: 10, zIndex: 30 }}>
          {(d.phone || d.applyPhone) && (
            <a href={`tel:${d.phone || d.applyPhone}`} style={{ flex: 1, background: ORANGE, borderRadius: 14, padding: '14px', color: '#fff', fontWeight: 700, fontSize: 15, textAlign: 'center', textDecoration: 'none', display: 'block' }}>📞 {t.call}</a>
          )}
          {d.whatsapp && (
            <a href={`https://wa.me/${d.whatsapp.replace(/\D/g, '')}`} target="_blank" style={{ flex: 1, background: '#25D366', borderRadius: 14, padding: '14px', color: '#fff', fontWeight: 700, fontSize: 15, textAlign: 'center', textDecoration: 'none', display: 'block' }}>💬 {t.whatsapp}</a>
          )}
        </div>
      )}

      {(isSold || isFilled) && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: isSold ? '#FEF2F2' : '#F0FDF4', borderTop: `1px solid ${isSold ? '#FECACA' : '#BBF7D0'}`, padding: '14px 20px', textAlign: 'center', zIndex: 30 }}>
          <p style={{ margin: 0, fontWeight: 700, color: isSold ? '#991B1B' : '#166534', fontSize: 14 }}>
            {isSold ? `🚫 ${t.soldBox}` : `✅ ${t.filledBox}`}
          </p>
        </div>
      )}
    </div>
  )
}