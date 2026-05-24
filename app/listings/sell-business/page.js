'use client'
import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

const FONT = "'Plus Jakarta Sans', 'Sora', sans-serif"
const ORANGE = 'linear-gradient(135deg, #FF6B35, #FF8C61)'
const NAVY = '#1A2B5F'

function getSupabase() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

function SellBusinessInner() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const [focus, setFocus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [images, setImages] = useState([])
  const [form, setForm] = useState({ name: '', businessName: '', city: '', postcode: '', askingPrice: '', description: '', phone: '', email: '' })

  const isRtl = lang === 'ku'
  const T = {
    en: { title: 'Sell Your Business', subtitle: 'Fill in the details and we\'ll review within 24 hours', name: 'Your Full Name', namePh: 'e.g. Ahmed Hassan', businessName: 'Business Name', businessNamePh: 'e.g. Ahmad & Co Grocers', city: 'City', cityPh: 'e.g. Leeds', postcode: 'Postcode', postcodePh: 'e.g. LS1 4AP', askingPrice: 'Asking Price (£)', askingPricePh: 'e.g. 50000', description: 'About the Business', descriptionPh: 'Describe the business, why you\'re selling, what\'s included…', phone: 'Phone Number', phonePh: '+44 7700 900000', email: 'Your Email Address', emailPh: 'you@example.com', emailNote: 'We\'ll email you within 24 hours once your listing is reviewed. Please also check your junk/spam folder.', images: 'Business Photos', imagesDesc: 'Upload up to 5 photos', submit: 'Submit for Review', submitting: 'Submitting…', back: '← Back', successTitle: 'Submitted! 🎉', successMsg: 'Your listing is under review. Check your email within 24 hours — and don\'t forget to check your junk folder!', backHome: 'Back to Home', errFill: 'Please fill in all required fields' },
    ku: { title: 'بیزنسەکەت بفرۆشە', subtitle: 'زانیاریەکان پڕ بکەوە، ئێمەش لە ٢٤ کاتژمێردا پێداچوونەوەی دەکەین', name: 'ناوی تەواو', namePh: 'وەک: ئەحمەد حەسەن', businessName: 'ناوی بیزنس', businessNamePh: 'وەک: دوکانی ئەحمەد', city: 'شار', cityPh: 'وەک: لیدز', postcode: 'پۆستکۆد', postcodePh: 'وەک: LS1 4AP', askingPrice: 'نرخی داواکراو (£)', askingPricePh: 'وەک: ٥٠٠٠٠', description: 'دەربارەی بیزنس', descriptionPh: 'بیزنسەکە وەسف بکە…', phone: 'ژمارەی تەلەفۆن', phonePh: '+44 7700 900000', email: 'ئیمەیڵەکەت', emailPh: 'you@example.com', emailNote: 'ئێمە لە ماوەی ٢٤ کاتژمێردا ئیمەیڵت بۆ دەنێرین. تکایە فۆڵدەری جەنکی ئیمەیڵەکەت هەروەها سەیر بکە.', images: 'وێنەی بیزنس', imagesDesc: 'تا ٥ وێنە بار بکە', submit: 'بنێرە بۆ پێداچوونەوە', submitting: 'دەنێردرێت…', back: '→ گەڕانەوە', successTitle: '!دانرا 🎉', successMsg: 'داواکاریەکەت تەماشا دەکرێت. ئیمەیڵەکەت سەیر بکە لە ماوەی ٢٤ کاتژمێردا — فۆڵدەری جەنکیشت بچێکە!', backHome: 'گەڕانەوە بۆ ماڵەوە', errFill: 'تکایە هەموو خانەکان پڕ بکەوە' }
  }
  const t = T[lang]
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const inp = (f) => ({ width: '100%', padding: '14px 16px', border: `2px solid ${focus === f ? '#FF6B35' : 'rgba(0,0,0,0.1)'}`, borderRadius: 14, fontSize: 15, fontFamily: FONT, outline: 'none', background: '#fff', color: '#1a1a1a', boxSizing: 'border-box', transition: 'border-color 0.2s', direction: 'ltr' })
  const label = { display: 'block', fontSize: 13, fontWeight: 700, color: '#444', marginBottom: 6 }

  const handleImages = (e) => setImages(Array.from(e.target.files).slice(0, 5))

  const handleSubmit = async () => {
    setError('')
    const { name, businessName, city, postcode, askingPrice, description, phone, email } = form
    if (!name || !businessName || !city || !postcode || !askingPrice || !description || !email) return setError(t.errFill)
    setLoading(true)
    try {
      const supabase = getSupabase()
      const imageUrls = []
      for (const img of images) {
        const ext = img.name.split('.').pop()
        const path = `listings/public/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error: uploadError } = await supabase.storage.from('listing-images').upload(path, img)
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('listing-images').getPublicUrl(path)
          imageUrls.push(urlData.publicUrl)
        }
      }
      const { error: e } = await supabase.from('listings').insert({ type: 'sell_business', status: 'pending', data: { ...form, imageUrls } })
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
      <button onClick={() => router.push('/home')} style={{ background: ORANGE, border: 'none', borderRadius: 14, padding: '14px 32px', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: FONT }}>{t.backHome}</button>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f5', fontFamily: FONT, direction: isRtl ? 'rtl' : 'ltr' }}>
      <div style={{ background: NAVY, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 15, cursor: 'pointer', fontFamily: FONT, fontWeight: 600 }}>{t.back}</button>
        <div style={{ fontSize: 18, fontWeight: 800, background: ORANGE, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>KurdLink</div>
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.1)', padding: '4px 6px', borderRadius: 20 }}>
          {['en', 'ku'].map(l => (<button key={l} onClick={() => setLang(l)} style={{ padding: '5px 12px', background: lang === l ? '#fff' : 'transparent', color: lang === l ? NAVY : 'rgba(255,255,255,0.7)', border: 'none', borderRadius: 16, fontWeight: 700, fontSize: 11, cursor: 'pointer', fontFamily: FONT }}>{l === 'en' ? 'EN' : 'KU'}</button>))}
        </div>
      </div>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '24px 20px 60px', boxSizing: 'border-box' }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>💼</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: NAVY, margin: '0 0 6px' }}>{t.title}</h1>
          <p style={{ fontSize: 13, color: '#888', margin: 0, lineHeight: 1.5 }}>{t.subtitle}</p>
        </div>
        {error && <div style={{ background: '#fff0f0', border: '1.5px solid #ffcdd2', borderRadius: 12, padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#c62828', marginBottom: 16 }}>{error}</div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={label}>{t.name} *</label>
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder={t.namePh} onFocus={() => setFocus('name')} onBlur={() => setFocus(null)} style={inp('name')} />
          </div>
          <div>
            <label style={label}>{t.businessName} *</label>
            <input type="text" value={form.businessName} onChange={e => set('businessName', e.target.value)} placeholder={t.businessNamePh} onFocus={() => setFocus('businessName')} onBlur={() => setFocus(null)} style={inp('businessName')} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={label}>{t.city} *</label>
              <input type="text" value={form.city} onChange={e => set('city', e.target.value)} placeholder={t.cityPh} onFocus={() => setFocus('city')} onBlur={() => setFocus(null)} style={inp('city')} />
            </div>
            <div>
              <label style={label}>{t.postcode} *</label>
              <input type="text" value={form.postcode} onChange={e => set('postcode', e.target.value)} placeholder={t.postcodePh} onFocus={() => setFocus('postcode')} onBlur={() => setFocus(null)} style={inp('postcode')} />
            </div>
          </div>
          <div>
            <label style={label}>{t.askingPrice} *</label>
            <input type="number" value={form.askingPrice} onChange={e => set('askingPrice', e.target.value)} placeholder={t.askingPricePh} onFocus={() => setFocus('askingPrice')} onBlur={() => setFocus(null)} style={inp('askingPrice')} />
          </div>
          <div>
            <label style={label}>{t.description} *</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder={t.descriptionPh} onFocus={() => setFocus('description')} onBlur={() => setFocus(null)} rows={4} style={{ ...inp('description'), resize: 'vertical', lineHeight: 1.5 }} />
          </div>
          <div>
            <label style={label}>{t.phone}</label>
            <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder={t.phonePh} onFocus={() => setFocus('phone')} onBlur={() => setFocus(null)} style={inp('phone')} />
          </div>
          <div>
            <label style={label}>{t.email} *</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder={t.emailPh} onFocus={() => setFocus('email')} onBlur={() => setFocus(null)} style={inp('email')} />
            <p style={{ fontSize: 12, color: '#888', margin: '8px 0 0', lineHeight: 1.5, background: 'rgba(255,107,53,0.06)', padding: '10px 12px', borderRadius: 10, borderLeft: '3px solid #FF6B35' }}>📬 {t.emailNote}</p>
          </div>
          <div>
            <label style={label}>{t.images}</label>
            <p style={{ fontSize: 12, color: '#888', margin: '0 0 8px' }}>{t.imagesDesc}</p>
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', border: '2px dashed rgba(0,0,0,0.15)', borderRadius: 14, background: '#fff', cursor: 'pointer', gap: 8 }}>
              <span style={{ fontSize: 28 }}>📷</span>
              <span style={{ fontSize: 13, color: '#666', fontWeight: 600 }}>{images.length > 0 ? `${images.length} photo(s) selected` : 'Tap to upload photos'}</span>
              <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" multiple onChange={handleImages} style={{ display: 'none' }} />
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
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f7f7f5' }} />}>
      <SellBusinessInner />
    </Suspense>
  )
}