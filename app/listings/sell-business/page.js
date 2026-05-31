'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
'

const FONT = "'Plus Jakarta Sans', 'Sora', sans-serif"
const ORANGE = 'linear-gradient(135deg, #FF6B35, #FF8C61)'
const NAVY = '#1A2B5F'

function getSupabase() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

const TX = {
  en: { title: 'Sell Your Business', subtitle: "Fill in the details and we'll review within 24 hours", businessName: 'Business Name', businessNamePh: 'e.g. Ahmad & Co Grocers', city: 'City', cityPh: 'e.g. Leeds', postcode: 'Postcode', postcodePh: 'e.g. LS1 4AP', askingPrice: 'Asking Price (£)', askingPricePh: 'e.g. 50000', description: 'About the Business', descriptionPh: "Describe the business, why you're selling, what's included…", phone: 'Phone Number', phonePh: '+44 7700 900000', whatsapp: 'WhatsApp (optional)', whatsappPh: '+44 7700 900000', images: 'Business Photos (up to 10)', imagesDesc: 'Upload up to 10 photos', submit: 'Submit for Review', submitting: 'Submitting…', back: '← Back', successTitle: 'Submitted! 🎉', successMsg: 'Your business listing is under review. Track its status in your Account page.', backHome: 'View My Listings', errFill: 'Please fill in all required fields' },
  ku: { title: 'بیزنسەکەت بفرۆشە', subtitle: 'زانیاریەکان پڕ بکەوە، ئێمەش لە ٢٤ کاتژمێردا پێداچوونەوەی دەکەین', businessName: 'ناوی بیزنس', businessNamePh: 'وەک: دوکانی ئەحمەد', city: 'شار', cityPh: 'وەک: لیدز', postcode: 'پۆستکۆد', postcodePh: 'وەک: LS1 4AP', askingPrice: 'نرخی داواکراو (£)', askingPricePh: 'وەک: ٥٠٠٠٠', description: 'دەربارەی بیزنس', descriptionPh: 'بیزنسەکە وەسف بکە…', phone: 'ژمارەی تەلەفۆن', phonePh: '+44 7700 900000', whatsapp: 'واتساپ (ئارەزوومەندانە)', whatsappPh: '+44 7700 900000', images: 'وێنەی بیزنس (تا ١٠)', imagesDesc: 'تا ١٠ وێنە بار بکە', submit: 'بنێرە بۆ پێداچوونەوە', submitting: 'دەنێردرێت…', back: '→ گەڕانەوە', successTitle: '!دانرا 🎉', successMsg: 'بیزنسەکەت تەماشا دەکرێت.', backHome: 'لیستەکانم ببینە', errFill: 'تکایە هەموو خانەکان پڕ بکەوە' },
  fa: { title: 'کسب‌وکارت را بفروش', subtitle: 'جزئیات را پر کن، ما ظرف ۲۴ ساعت بررسی می‌کنیم', businessName: 'نام کسب‌وکار', businessNamePh: 'مثلاً فروشگاه احمد', city: 'شهر', cityPh: 'مثلاً لیدز', postcode: 'کد پستی', postcodePh: 'مثلاً LS1 4AP', askingPrice: 'قیمت درخواستی (£)', askingPricePh: 'مثلاً ۵۰۰۰۰', description: 'درباره کسب‌وکار', descriptionPh: 'کسب‌وکار را توصیف کن…', phone: 'شماره تلفن', phonePh: '+44 7700 900000', whatsapp: 'واتساپ (اختیاری)', whatsappPh: '+44 7700 900000', images: 'عکس کسب‌وکار (تا ۱۰ عکس)', imagesDesc: 'تا ۱۰ عکس آپلود کن', submit: 'ارسال برای بررسی', submitting: 'در حال ارسال…', back: '→ بازگشت', successTitle: 'ارسال شد! 🎉', successMsg: 'آگهی کسب‌وکارت در حال بررسی است.', backHome: 'آگهی‌هایم', errFill: 'لطفاً همه فیلدهای ضروری را پر کن' },
  ar: { title: 'بع عملك التجاري', subtitle: 'أدخل التفاصيل وسنراجع خلال ٢٤ ساعة', businessName: 'اسم العمل التجاري', businessNamePh: 'مثلاً بقالة أحمد', city: 'المدينة', cityPh: 'مثلاً ليدز', postcode: 'الرمز البريدي', postcodePh: 'مثلاً LS1 4AP', askingPrice: 'السعر المطلوب (£)', askingPricePh: 'مثلاً ٥٠٠٠٠', description: 'عن العمل التجاري', descriptionPh: 'صف العمل التجاري…', phone: 'رقم الهاتف', phonePh: '+44 7700 900000', whatsapp: 'واتساب (اختياري)', whatsappPh: '+44 7700 900000', images: 'صور العمل التجاري (حتى ١٠)', imagesDesc: 'ارفع حتى ١٠ صور', submit: 'إرسال للمراجعة', submitting: 'جاري الإرسال…', back: '→ رجوع', successTitle: 'تم الإرسال! 🎉', successMsg: 'إعلان عملك التجاري قيد المراجعة.', backHome: 'إعلاناتي', errFill: 'يرجى ملء جميع الحقول المطلوبة' },
}

function SellBusinessInner() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const [focus, setFocus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [images, setImages] = useState([])
  const [form, setForm] = useState({ businessName: '', city: '', postcode: '', askingPrice: '', description: '', phone: '', whatsapp: '' })

  
  const t = TX[lang] || TX.en

  useEffect(() => {
    const saved = localStorage.getItem('kurdlink_lang')
    if (saved) setLang(saved)
  }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const inp = (f) => ({ width: '100%', padding: '14px 16px', border: `2px solid ${focus === f ? '#FF6B35' : 'rgba(0,0,0,0.1)'}`, borderRadius: 14, fontSize: 15, fontFamily: FONT, outline: 'none', background: '#fff', color: '#1a1a1a', boxSizing: 'border-box', transition: 'border-color 0.2s', direction: 'ltr' })
  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 700, color: '#444', marginBottom: 6 }

  const handleImages = (e) => setImages(Array.from(e.target.files).slice(0, 10))

  const handleSubmit = async () => {
    setError('')
    const { businessName, city, postcode, askingPrice, description, phone } = form
    if (!businessName || !city || !postcode || !askingPrice || !description || !phone) return setError(t.errFill)
    setLoading(true)
    try {
      const supabase = getSupabase()
      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user?.id
      const userName = session?.user?.user_metadata?.full_name || ''
      const userEmail = session?.user?.email || ''
      const imageUrls = await Promise.all(
        images.map(async (img) => {
          const ext = img.name.split('.').pop()
          const path = `listings/public/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
          const { error: uploadError } = await supabase.storage.from('listing-images').upload(path, img)
          if (!uploadError) {
            const { data: urlData } = supabase.storage.from('listing-images').getPublicUrl(path)
            return urlData.publicUrl
          }
          return null
        })
      ).then(urls => urls.filter(Boolean))
      const { error: e } = await supabase.from('listings').insert({ type: 'sell_business', status: 'pending', user_id: userId, data: { ...form, imageUrls, name: userName, email: userEmail } })
      if (e) throw e
      setSubmitted(true)
    } catch (err) { setError(err.message || 'Something went wrong.') }
    finally { setLoading(false) }
  }

  if (submitted) return (
    <div style={{ minHeight: '100vh', background: '#f7f7f5', fontFamily: FONT, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center' }}>
      <div style={{ fontSize: 60, marginBottom: 20 }}>🎉</div>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: NAVY, margin: '0 0 12px' }}>{t.successTitle}</h2>
      <p style={{ fontSize: 15, color: '#666', maxWidth: 320, lineHeight: 1.6, margin: '0 0 32px' }}>{t.successMsg}</p>
      <button onClick={() => router.push('/account')} style={{ background: ORANGE, border: 'none', borderRadius: 14, padding: '14px 32px', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: FONT }}>{t.backHome}</button>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f5', fontFamily: FONT, direction: 'ltr' }}>
      <div style={{ background: NAVY, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 15, cursor: 'pointer', fontFamily: FONT, fontWeight: 600 }}>{t.back}</button>
        <div style={{ fontSize: 18, fontWeight: 800, background: ORANGE, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>KurdLink</div>
        <LangDropdown lang={lang} onChange={setLang} />
      </div>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '24px 20px 60px', boxSizing: 'border-box' }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>💼</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: NAVY, margin: '0 0 6px' }}>{t.title}</h1>
          <p style={{ fontSize: 13, color: '#888', margin: 0, lineHeight: 1.5 }}>{t.subtitle}</p>
        </div>
        {error && <div style={{ background: '#fff0f0', border: '1.5px solid #ffcdd2', borderRadius: 12, padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#c62828', marginBottom: 16 }}>{error}</div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div><label style={labelStyle}>{t.businessName} *</label><input type="text" value={form.businessName} onChange={e => set('businessName', e.target.value)} placeholder={t.businessNamePh} onFocus={() => setFocus('businessName')} onBlur={() => setFocus(null)} style={inp('businessName')} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={labelStyle}>{t.city} *</label><input type="text" value={form.city} onChange={e => set('city', e.target.value)} placeholder={t.cityPh} onFocus={() => setFocus('city')} onBlur={() => setFocus(null)} style={inp('city')} /></div>
            <div><label style={labelStyle}>{t.postcode} *</label><input type="text" value={form.postcode} onChange={e => set('postcode', e.target.value)} placeholder={t.postcodePh} onFocus={() => setFocus('postcode')} onBlur={() => setFocus(null)} style={inp('postcode')} /></div>
          </div>
          <div><label style={labelStyle}>{t.askingPrice} *</label><input type="number" value={form.askingPrice} onChange={e => set('askingPrice', e.target.value)} placeholder={t.askingPricePh} onFocus={() => setFocus('askingPrice')} onBlur={() => setFocus(null)} style={inp('askingPrice')} /></div>
          <div><label style={labelStyle}>{t.description} *</label><textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder={t.descriptionPh} onFocus={() => setFocus('description')} onBlur={() => setFocus(null)} rows={4} style={{ ...inp('description'), resize: 'vertical', lineHeight: 1.5 }} /></div>
          <div><label style={labelStyle}>{t.phone} *</label><input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder={t.phonePh} onFocus={() => setFocus('phone')} onBlur={() => setFocus(null)} style={inp('phone')} /></div>
          <div><label style={{ ...labelStyle, color: '#aaa' }}>{t.whatsapp}</label><input type="tel" value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder={t.whatsappPh} onFocus={() => setFocus('whatsapp')} onBlur={() => setFocus(null)} style={inp('whatsapp')} /></div>
          <div>
            <label style={labelStyle}>{t.images}</label>
            <p style={{ fontSize: 12, color: '#888', margin: '0 0 8px' }}>{t.imagesDesc}</p>
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', border: '2px dashed rgba(0,0,0,0.15)', borderRadius: 14, background: '#fff', cursor: 'pointer', gap: 8 }}>
              <span style={{ fontSize: 28 }}>📷</span>
              <span style={{ fontSize: 13, color: '#666', fontWeight: 600 }}>{images.length > 0 ? `${images.length} photo(s) selected` : 'Tap to upload photos'}</span>
              <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/heic" multiple onChange={handleImages} style={{ display: 'none' }} />
            </label>
          </div>
          <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '15px', background: loading ? '#ccc' : ORANGE, border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, color: '#fff', cursor: loading ? 'default' : 'pointer', fontFamily: FONT, boxShadow: loading ? 'none' : '0 4px 16px rgba(255,107,53,0.35)', marginTop: 8 }}>
            {loading ? t.submitting : t.submit}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SellBusiness() {
  return <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f7f7f5' }} />}><SellBusinessInner /></Suspense>
}