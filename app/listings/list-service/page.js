'use client'
import { useState, useEffect, Suspense } from 'react'
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

const TX = {
  en: { title: 'List My Service', subtitle: 'Create your professional profile on KurdLink', fullName: 'Your Full Name', fullNamePh: 'e.g. Dr. Sara Ahmed', businessName: 'Business / Practice Name (optional)', businessNamePh: 'e.g. Ahmed Law Firm', category: 'Your Service / Profession', categoryPh: 'e.g. Immigration Lawyer, Accountant, Driving Instructor', city: 'City', cityPh: 'e.g. London', postcode: 'Postcode', postcodePh: 'e.g. E1 6RF', address: 'Address (optional)', addressPh: '47 Commercial Rd, London', phone: 'Phone Number', phonePh: '+44 7700 900000', whatsapp: 'WhatsApp (optional)', whatsappPh: '+44 7700 900000', website: 'Website (optional)', websitePh: 'www.yourwebsite.com', experience: 'Years of Experience (optional)', experiencePh: 'e.g. 10', description: 'About Your Service', descriptionPh: 'Describe your services, specialities, languages spoken…', images: 'Photo / Logo (optional, up to 5)', submit: 'Submit for Review', submitting: 'Submitting…', back: '← Back', successTitle: 'Profile Submitted! 🎉', successMsg: 'Your profile is under review. Check your Account page for status updates.', backHome: 'View My Listings', errFill: 'Please fill in all required fields' },
  ku: { title: 'خزمەتگوزاریەکەم لیست بکە', subtitle: 'پڕۆفایلی پیشەییت لە KurdLink دروست بکە', fullName: 'ناوی تەواو', fullNamePh: 'وەک: د. سارا ئەحمەد', businessName: 'ناوی بیزنس (ئارەزوومەندانە)', businessNamePh: 'وەک: بیروی یاسایی ئەحمەد', category: 'خزمەتگوزاری / پیشەت', categoryPh: 'وەک: بایەخنامەی کوچ، ژمێریار', city: 'شار', cityPh: 'وەک: لەندەن', postcode: 'پۆستکۆد', postcodePh: 'وەک: E1 6RF', address: 'ناونیشان (ئارەزوومەندانە)', addressPh: '٤٧ ڕێگای بازرگانی', phone: 'ژمارەی تەلەفۆن', phonePh: '+44 7700 900000', whatsapp: 'واتساپ (ئارەزوومەندانە)', whatsappPh: '+44 7700 900000', website: 'ماڵپەڕ (ئارەزوومەندانە)', websitePh: 'www.yourwebsite.com', experience: 'ساڵانی ئەزموون (ئارەزوومەندانە)', experiencePh: 'وەک: ١٠', description: 'دەربارەی خزمەتگوزاریەکەت', descriptionPh: 'خزمەتگوزاریەکانت وەسف بکە…', images: 'وێنە / لۆگۆ (ئارەزوومەندانە، تا ٥)', submit: 'بنێرە بۆ پێداچوونەوە', submitting: 'دەنێردرێت…', back: '→ گەڕانەوە', successTitle: '!پڕۆفایل نێردرا 🎉', successMsg: 'پڕۆفایلەکەت تەماشا دەکرێت.', backHome: 'لیستەکانم ببینە', errFill: 'تکایە هەموو خانەکان پڕ بکەوە' },
  fa: { title: 'ثبت خدمت', subtitle: 'پروفایل حرفه‌ای‌ات را در KurdLink بساز', fullName: 'نام کامل', fullNamePh: 'مثلاً دکتر سارا احمد', businessName: 'نام شرکت (اختیاری)', businessNamePh: 'مثلاً دفتر حقوقی احمد', category: 'خدمت / حرفه', categoryPh: 'مثلاً وکیل مهاجرت، حسابدار', city: 'شهر', cityPh: 'مثلاً لندن', postcode: 'کد پستی', postcodePh: 'مثلاً E1 6RF', address: 'آدرس (اختیاری)', addressPh: 'خیابان تجاری ۴۷', phone: 'شماره تلفن', phonePh: '+44 7700 900000', whatsapp: 'واتساپ (اختیاری)', whatsappPh: '+44 7700 900000', website: 'وب‌سایت (اختیاری)', websitePh: 'www.yourwebsite.com', experience: 'سال‌های تجربه (اختیاری)', experiencePh: 'مثلاً ۱۰', description: 'درباره خدمتت', descriptionPh: 'خدماتت را توصیف کن…', images: 'عکس / لوگو (اختیاری، تا ۵)', submit: 'ارسال برای بررسی', submitting: 'در حال ارسال…', back: '→ بازگشت', successTitle: 'پروفایل ارسال شد! 🎉', successMsg: 'پروفایلت در حال بررسی است.', backHome: 'آگهی‌هایم', errFill: 'لطفاً همه فیلدهای ضروری را پر کن' },
  ar: { title: 'إدراج خدمة', subtitle: 'أنشئ ملفك المهني على KurdLink', fullName: 'اسمك الكامل', fullNamePh: 'مثلاً د. سارة أحمد', businessName: 'اسم الشركة (اختياري)', businessNamePh: 'مثلاً مكتب أحمد القانوني', category: 'خدمتك / مهنتك', categoryPh: 'مثلاً محامي هجرة، محاسب', city: 'المدينة', cityPh: 'مثلاً لندن', postcode: 'الرمز البريدي', postcodePh: 'مثلاً E1 6RF', address: 'العنوان (اختياري)', addressPh: '٤٧ شارع تجاري', phone: 'رقم الهاتف', phonePh: '+44 7700 900000', whatsapp: 'واتساب (اختياري)', whatsappPh: '+44 7700 900000', website: 'الموقع الإلكتروني (اختياري)', websitePh: 'www.yourwebsite.com', experience: 'سنوات الخبرة (اختياري)', experiencePh: 'مثلاً ١٠', description: 'عن خدمتك', descriptionPh: 'صف خدماتك…', images: 'صورة / شعار (اختياري، حتى ٥)', submit: 'إرسال للمراجعة', submitting: 'جاري الإرسال…', back: '→ رجوع', successTitle: 'تم إرسال الملف الشخصي! 🎉', successMsg: 'ملفك الشخصي قيد المراجعة.', backHome: 'إعلاناتي', errFill: 'يرجى ملء جميع الحقول المطلوبة' },
}

function ListServiceInner() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const [focus, setFocus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [images, setImages] = useState([])
  const [form, setForm] = useState({ fullName: '', businessName: '', category: '', city: '', postcode: '', address: '', phone: '', whatsapp: '', website: '', experience: '', description: '' })

  
  const t = TX[lang] || TX.en

  useEffect(() => {
    const saved = localStorage.getItem('kurdlink_lang')
    if (saved) setLang(saved)
  }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const inp = (f) => ({ width: '100%', padding: '14px 16px', border: `2px solid ${focus === f ? '#FF6B35' : 'rgba(0,0,0,0.1)'}`, borderRadius: 14, fontSize: 15, fontFamily: FONT, outline: 'none', background: '#fff', color: '#1a1a1a', boxSizing: 'border-box', transition: 'border-color 0.2s', direction: 'ltr' })
  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 700, color: '#444', marginBottom: 6 }
  const optLabel = { display: 'block', fontSize: 13, fontWeight: 700, color: '#aaa', marginBottom: 6 }

  const handleImages = (e) => setImages(Array.from(e.target.files).slice(0, 5))

  const handleSubmit = async () => {
    setError('')
    const { fullName, category, city, postcode, phone, description } = form
    if (!fullName || !category || !city || !postcode || !phone || !description) return setError(t.errFill)
    setLoading(true)
    try {
      const supabase = getSupabase()
      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user?.id
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
      const { error: e } = await supabase.from('listings').insert({ type: 'list_service', status: 'pending', user_id: userId, data: { ...form, imageUrls, email: userEmail } })
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
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎯</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: NAVY, margin: '0 0 6px' }}>{t.title}</h1>
          <p style={{ fontSize: 13, color: '#888', margin: 0, lineHeight: 1.5 }}>{t.subtitle}</p>
        </div>
        {error && <div style={{ background: '#fff0f0', border: '1.5px solid #ffcdd2', borderRadius: 12, padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#c62828', marginBottom: 16 }}>{error}</div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div><label style={labelStyle}>{t.fullName} *</label><input type="text" value={form.fullName} onChange={e => set('fullName', e.target.value)} placeholder={t.fullNamePh} onFocus={() => setFocus('fullName')} onBlur={() => setFocus(null)} style={inp('fullName')} /></div>
          <div><label style={optLabel}>{t.businessName}</label><input type="text" value={form.businessName} onChange={e => set('businessName', e.target.value)} placeholder={t.businessNamePh} onFocus={() => setFocus('businessName')} onBlur={() => setFocus(null)} style={inp('businessName')} /></div>
          <div><label style={labelStyle}>{t.category} *</label><input type="text" value={form.category} onChange={e => set('category', e.target.value)} placeholder={t.categoryPh} onFocus={() => setFocus('category')} onBlur={() => setFocus(null)} style={inp('category')} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={labelStyle}>{t.city} *</label><input type="text" value={form.city} onChange={e => set('city', e.target.value)} placeholder={t.cityPh} onFocus={() => setFocus('city')} onBlur={() => setFocus(null)} style={inp('city')} /></div>
            <div><label style={labelStyle}>{t.postcode} *</label><input type="text" value={form.postcode} onChange={e => set('postcode', e.target.value)} placeholder={t.postcodePh} onFocus={() => setFocus('postcode')} onBlur={() => setFocus(null)} style={inp('postcode')} /></div>
          </div>
          <div><label style={optLabel}>{t.address}</label><input type="text" value={form.address} onChange={e => set('address', e.target.value)} placeholder={t.addressPh} onFocus={() => setFocus('address')} onBlur={() => setFocus(null)} style={inp('address')} /></div>
          <div><label style={labelStyle}>{t.phone} *</label><input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder={t.phonePh} onFocus={() => setFocus('phone')} onBlur={() => setFocus(null)} style={inp('phone')} /></div>
          <div><label style={optLabel}>{t.whatsapp}</label><input type="tel" value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder={t.whatsappPh} onFocus={() => setFocus('whatsapp')} onBlur={() => setFocus(null)} style={inp('whatsapp')} /></div>
          <div><label style={optLabel}>{t.experience}</label><input type="number" value={form.experience} onChange={e => set('experience', e.target.value)} placeholder={t.experiencePh} onFocus={() => setFocus('experience')} onBlur={() => setFocus(null)} style={inp('experience')} /></div>
          <div><label style={optLabel}>{t.website}</label><input type="url" value={form.website} onChange={e => set('website', e.target.value)} placeholder={t.websitePh} onFocus={() => setFocus('website')} onBlur={() => setFocus(null)} style={inp('website')} /></div>
          <div><label style={labelStyle}>{t.description} *</label><textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder={t.descriptionPh} onFocus={() => setFocus('description')} onBlur={() => setFocus(null)} rows={5} style={{ ...inp('description'), resize: 'vertical', lineHeight: 1.5 }} /></div>
          <div>
            <label style={optLabel}>{t.images}</label>
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', border: '2px dashed rgba(0,0,0,0.15)', borderRadius: 14, background: '#fff', cursor: 'pointer', gap: 8 }}>
              <span style={{ fontSize: 28 }}>📷</span>
              <span style={{ fontSize: 13, color: '#666', fontWeight: 600 }}>{images.length > 0 ? `${images.length} photo(s) selected` : 'Tap to upload photo / logo'}</span>
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

export default function ListService() {
  return <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f7f7f5' }} />}><ListServiceInner /></Suspense>
}