'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import LangDropdown from "../../../components/LangDropdown"
import { createBrowserClient } from '@supabase/ssr'

const FONT = "'Plus Jakarta Sans', 'Sora', sans-serif"
const ORANGE = 'linear-gradient(135deg, #FF6B35, #FF8C61)'
const NAVY = '#1A2B5F'

function getSupabase() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

const CONDITIONS = {
  en: ['Excellent', 'Good', 'Fair', 'Needs Work'],
  ku: ['زۆر باش', 'باش', 'مامناوەند', 'پێویستی بە کار هەیە'],
  fa: ['عالی', 'خوب', 'متوسط', 'نیاز به تعمیر'],
  ar: ['ممتاز', 'جيد', 'مقبول', 'يحتاج إصلاح'],
}

const TX = {
  en: {
    title: 'Sell Your Car', subtitle: "Fill in your car details and we'll review within 24 hours",
    make: 'Make', makePh: 'e.g. BMW, Toyota, Ford',
    model: 'Model', modelPh: 'e.g. 3 Series, Corolla',
    year: 'Year', yearPh: 'e.g. 2019',
    mileage: 'Mileage', mileagePh: 'e.g. 45000',
    price: 'Asking Price (£)', pricePh: 'e.g. 12500',
    condition: 'Condition', selectCondition: 'Select condition…',
    city: 'City', cityPh: 'e.g. Manchester',
    postcode: 'Postcode', postcodePh: 'e.g. M1 1AE',
    phone: 'Phone Number', phonePh: '+44 7700 900000',
    whatsapp: 'WhatsApp (optional)', whatsappPh: '+44 7700 900000',
    description: 'Description', descriptionPh: 'Describe the car, service history, any extras…',
    images: 'Car Photos (up to 10)', imagesDesc: 'Upload up to 10 photos',
    submit: 'Submit for Review', submitting: 'Submitting…', back: '← Back',
    successTitle: 'Submitted! 🎉', successMsg: 'Your car listing is under review. Track its status in your Account page.',
    backHome: 'View My Listings', errFill: 'Please fill in all required fields',
  },
  ku: {
    title: 'ئۆتۆمبێلەکەت بفرۆشە', subtitle: 'زانیاریەکان پڕ بکەوە، ئێمەش لە ٢٤ کاتژمێردا پێداچوونەوەی دەکەین',
    make: 'مارکا', makePh: 'وەک: BMW، تۆیۆتا',
    model: 'مۆدێل', modelPh: 'وەک: 3 Series',
    year: 'ساڵ', yearPh: 'وەک: ٢٠١٩',
    mileage: 'میلیج', mileagePh: 'وەک: ٤٥٠٠٠',
    price: 'نرخی داواکراو (£)', pricePh: 'وەک: ١٢٥٠٠',
    condition: 'حاڵەت', selectCondition: 'حاڵەت هەڵبژێرە…',
    city: 'شار', cityPh: 'وەک: مانچستەر',
    postcode: 'پۆستکۆد', postcodePh: 'وەک: M1 1AE',
    phone: 'ژمارەی تەلەفۆن', phonePh: '+44 7700 900000',
    whatsapp: 'واتساپ (ئارەزوومەندانە)', whatsappPh: '+44 7700 900000',
    description: 'وەسف', descriptionPh: 'ئۆتۆمبێلەکە وەسف بکە…',
    images: 'وێنەی ئۆتۆمبێل (تا ١٠)', imagesDesc: 'تا ١٠ وێنە بار بکە',
    submit: 'بنێرە بۆ پێداچوونەوە', submitting: 'دەنێردرێت…', back: '→ گەڕانەوە',
    successTitle: '!دانرا 🎉', successMsg: 'ئۆتۆمبێلەکەت تەماشا دەکرێت.',
    backHome: 'لیستەکانم ببینە', errFill: 'تکایە هەموو خانەکان پڕ بکەوە',
  },
  fa: {
    title: 'ماشینت را بفروش', subtitle: 'جزئیات ماشین را پر کن، ما ظرف ۲۴ ساعت بررسی می‌کنیم',
    make: 'برند', makePh: 'مثلاً BMW، تویوتا',
    model: 'مدل', modelPh: 'مثلاً 3 Series',
    year: 'سال', yearPh: 'مثلاً ۲۰۱۹',
    mileage: 'کارکرد', mileagePh: 'مثلاً ۴۵۰۰۰',
    price: 'قیمت درخواستی (£)', pricePh: 'مثلاً ۱۲۵۰۰',
    condition: 'وضعیت', selectCondition: 'وضعیت را انتخاب کن…',
    city: 'شهر', cityPh: 'مثلاً منچستر',
    postcode: 'کد پستی', postcodePh: 'مثلاً M1 1AE',
    phone: 'شماره تلفن', phonePh: '+44 7700 900000',
    whatsapp: 'واتساپ (اختیاری)', whatsappPh: '+44 7700 900000',
    description: 'توضیحات', descriptionPh: 'ماشین را توصیف کن…',
    images: 'عکس ماشین (تا ۱۰ عکس)', imagesDesc: 'تا ۱۰ عکس آپلود کن',
    submit: 'ارسال برای بررسی', submitting: 'در حال ارسال…', back: '→ بازگشت',
    successTitle: 'ارسال شد! 🎉', successMsg: 'آگهی ماشینت در حال بررسی است.',
    backHome: 'آگهی‌هایم', errFill: 'لطفاً همه فیلدهای ضروری را پر کن',
  },
  ar: {
    title: 'بع سيارتك', subtitle: 'أدخل تفاصيل سيارتك وسنراجع خلال ٢٤ ساعة',
    make: 'الماركة', makePh: 'مثلاً BMW أو تويوتا',
    model: 'الموديل', modelPh: 'مثلاً 3 Series',
    year: 'السنة', yearPh: 'مثلاً ٢٠١٩',
    mileage: 'الأميال', mileagePh: 'مثلاً ٤٥٠٠٠',
    price: 'السعر المطلوب (£)', pricePh: 'مثلاً ١٢٥٠٠',
    condition: 'الحالة', selectCondition: 'اختر الحالة…',
    city: 'المدينة', cityPh: 'مثلاً مانشستر',
    postcode: 'الرمز البريدي', postcodePh: 'مثلاً M1 1AE',
    phone: 'رقم الهاتف', phonePh: '+44 7700 900000',
    whatsapp: 'واتساب (اختياري)', whatsappPh: '+44 7700 900000',
    description: 'الوصف', descriptionPh: 'صف السيارة…',
    images: 'صور السيارة (حتى ١٠ صور)', imagesDesc: 'ارفع حتى ١٠ صور',
    submit: 'إرسال للمراجعة', submitting: 'جاري الإرسال…', back: '→ رجوع',
    successTitle: 'تم الإرسال! 🎉', successMsg: 'إعلان سيارتك قيد المراجعة.',
    backHome: 'إعلاناتي', errFill: 'يرجى ملء جميع الحقول المطلوبة',
  },
}

function SellCarInner() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const [focus, setFocus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [images, setImages] = useState([])
  const [sessionUser, setSessionUser] = useState(null)
  const [form, setForm] = useState({
    make: '', model: '', year: '', mileage: '', price: '',
    condition: '', city: '', postcode: '', description: '',
    phone: '', whatsapp: '',
  })

  
  const t = TX[lang] || TX.en
  const conditions = CONDITIONS[lang] || CONDITIONS.en

  useEffect(() => {
    const saved = localStorage.getItem('kurdlink_lang')
    if (saved) setLang(saved)
    getSupabase().auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setSessionUser(session.user)
    })
  }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const inp = (f) => ({
    width: '100%', padding: '14px 16px',
    border: `2px solid ${focus === f ? '#FF6B35' : 'rgba(0,0,0,0.1)'}`,
    borderRadius: 14, fontSize: 15, fontFamily: FONT, outline: 'none',
    background: '#fff', color: '#1a1a1a', boxSizing: 'border-box',
    transition: 'border-color 0.2s', direction: 'ltr',
  })
  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 700, color: '#444', marginBottom: 6 }

  const handleImages = (e) => setImages(Array.from(e.target.files).slice(0, 10))

  const handleSubmit = async () => {
    setError('')
    const { make, model, year, mileage, price, condition, city, postcode, description, phone } = form
    if (!make || !model || !year || !mileage || !price || !condition || !city || !postcode || !description || !phone) {
      return setError(t.errFill)
    }
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
      const { error: e } = await supabase.from('listings').insert({
        type: 'sell_car', status: 'pending', user_id: userId,
        data: { ...form, imageUrls, name: userName, email: userEmail },
      })
      if (e) throw e
      setSubmitted(true)
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
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
          <div style={{ fontSize: 32, marginBottom: 8 }}>🚗</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: NAVY, margin: '0 0 6px' }}>{t.title}</h1>
          <p style={{ fontSize: 13, color: '#888', margin: 0, lineHeight: 1.5 }}>{t.subtitle}</p>
        </div>

        {error && <div style={{ background: '#fff0f0', border: '1.5px solid #ffcdd2', borderRadius: 12, padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#c62828', marginBottom: 16 }}>{error}</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>{t.make} *</label>
              <input type="text" value={form.make} onChange={e => set('make', e.target.value)} placeholder={t.makePh} onFocus={() => setFocus('make')} onBlur={() => setFocus(null)} style={inp('make')} />
            </div>
            <div>
              <label style={labelStyle}>{t.model} *</label>
              <input type="text" value={form.model} onChange={e => set('model', e.target.value)} placeholder={t.modelPh} onFocus={() => setFocus('model')} onBlur={() => setFocus(null)} style={inp('model')} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>{t.year} *</label>
              <input type="number" value={form.year} onChange={e => set('year', e.target.value)} placeholder={t.yearPh} onFocus={() => setFocus('year')} onBlur={() => setFocus(null)} style={inp('year')} />
            </div>
            <div>
              <label style={labelStyle}>{t.mileage} *</label>
              <input type="number" value={form.mileage} onChange={e => set('mileage', e.target.value)} placeholder={t.mileagePh} onFocus={() => setFocus('mileage')} onBlur={() => setFocus(null)} style={inp('mileage')} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>{t.price} *</label>
              <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder={t.pricePh} onFocus={() => setFocus('price')} onBlur={() => setFocus(null)} style={inp('price')} />
            </div>
            <div>
              <label style={labelStyle}>{t.condition} *</label>
              <select value={form.condition} onChange={e => set('condition', e.target.value)} style={{ ...inp('condition'), appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer' }}>
                <option value="">{t.selectCondition}</option>
                {conditions.map((c, i) => <option key={i} value={CONDITIONS.en[i]}>{c}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>{t.city} *</label>
              <input type="text" value={form.city} onChange={e => set('city', e.target.value)} placeholder={t.cityPh} onFocus={() => setFocus('city')} onBlur={() => setFocus(null)} style={inp('city')} />
            </div>
            <div>
              <label style={labelStyle}>{t.postcode} *</label>
              <input type="text" value={form.postcode} onChange={e => set('postcode', e.target.value)} placeholder={t.postcodePh} onFocus={() => setFocus('postcode')} onBlur={() => setFocus(null)} style={inp('postcode')} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>{t.phone} *</label>
            <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder={t.phonePh} onFocus={() => setFocus('phone')} onBlur={() => setFocus(null)} style={inp('phone')} />
          </div>

          <div>
            <label style={{ ...labelStyle, color: '#aaa' }}>{t.whatsapp}</label>
            <input type="tel" value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder={t.whatsappPh} onFocus={() => setFocus('whatsapp')} onBlur={() => setFocus(null)} style={inp('whatsapp')} />
          </div>

          <div>
            <label style={labelStyle}>{t.description} *</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder={t.descriptionPh} onFocus={() => setFocus('description')} onBlur={() => setFocus(null)} rows={4} style={{ ...inp('description'), resize: 'vertical', lineHeight: 1.5 }} />
          </div>

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

export default function SellCar() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f7f7f5' }} />}>
      <SellCarInner />
    </Suspense>
  )
}