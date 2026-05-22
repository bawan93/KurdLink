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

function ListServiceInner() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const [focus, setFocus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [images, setImages] = useState([])
  const [form, setForm] = useState({ fullName: '', businessName: '', category: '', city: '', postcode: '', address: '', phone: '', whatsapp: '', email: '', website: '', experience: '', description: '' })

  const isRtl = lang === 'ku'
  const T = {
    en: { title: 'List My Service', subtitle: 'Create your verified professional profile on KurdLink', fullName: 'Your Full Name', fullNamePh: 'e.g. Dr. Sara Ahmed', businessName: 'Business / Practice Name', businessNamePh: 'e.g. Ahmed Law Firm (optional)', category: 'Your Service / Profession', categoryPh: 'e.g. Immigration Lawyer, Accountant, Driving Instructor', city: 'City', cityPh: 'e.g. London', postcode: 'Postcode', postcodePh: 'e.g. E1 6RF', address: 'Address', addressPh: '47 Commercial Rd, London (optional)', phone: 'Phone Number', phonePh: '+44 7700 900000', whatsapp: 'WhatsApp Number', whatsappPh: '+44 7700 900000 (if different)', email: 'Email Address', emailPh: 'you@example.com', website: 'Website', websitePh: 'www.yourwebsite.com (optional)', experience: 'Years of Experience', experiencePh: 'e.g. 10', description: 'About Your Service', descriptionPh: 'Describe your services, specialities, languages spoken, qualifications…', images: 'Photo / Logo', imagesDesc: 'Upload a photo of yourself or your business logo', submit: 'Submit for Review', submitting: 'Submitting…', back: '← Back', successTitle: 'Profile Submitted! 🎉', successMsg: 'Your profile is under review. Once approved you\'ll appear on KurdLink for thousands to find you.', backHome: 'Back to Home', errFill: 'Please fill in all required fields' },
    ku: { title: 'خزمەتگوزاریەکەم لیست بکە', subtitle: 'پڕۆفایلی پیشەیی سەلماندراوت لە KurdLink دروست بکە', fullName: 'ناوی تەواو', fullNamePh: 'وەک: د. سارا ئەحمەد', businessName: 'ناوی بیزنس', businessNamePh: 'وەک: بیروی یاسایی ئەحمەد (ئارەزوومەندانە)', category: 'خزمەتگوزاری / پیشەت', categoryPh: 'وەک: بایەخنامەی کوچ، ژمێریار، مامۆستای شۆفێری', city: 'شار', cityPh: 'وەک: لەندەن', postcode: 'پۆستکۆد', postcodePh: 'وەک: E1 6RF', address: 'ناونیشان', addressPh: '٤٧ ڕێگای بازرگانی (ئارەزوومەندانە)', phone: 'ژمارەی تەلەفۆن', phonePh: '+44 7700 900000', whatsapp: 'واتساپ', whatsappPh: '+44 7700 900000', email: 'ئیمەیڵ', emailPh: 'you@example.com', website: 'ماڵپەڕ', websitePh: 'www.yourwebsite.com (ئارەزوومەندانە)', experience: 'ساڵانی ئەزموون', experiencePh: 'وەک: ١٠', description: 'دەربارەی خزمەتگوزاریەکەت', descriptionPh: 'خزمەتگوزاریەکانت وەسف بکە، تایبەتمەندیەکان، زمانەکان…', images: 'وێنە / لۆگۆ', imagesDesc: 'وێنەی خۆت یان لۆگۆی بیزنسەکەت بار بکە', submit: 'بنێرە بۆ پێداچوونەوە', submitting: 'دەنێردرێت…', back: '→ گەڕانەوە', successTitle: '!پڕۆفایل نێردرا 🎉', successMsg: 'پڕۆفایلەکەت تەماشا دەکرێت. دوای پەسەندکردن هەزاران کورد دەتبینن.', backHome: 'گەڕانەوە بۆ ماڵەوە', errFill: 'تکایە هەموو خانەکان پڕ بکەوە' }
  }
  const t = T[lang]
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const inp = (f) => ({ width: '100%', padding: '14px 16px', border: `2px solid ${focus === f ? '#FF6B35' : 'rgba(0,0,0,0.1)'}`, borderRadius: 14, fontSize: 15, fontFamily: FONT, outline: 'none', background: '#fff', color: '#1a1a1a', boxSizing: 'border-box', transition: 'border-color 0.2s', direction: 'ltr' })
  const label = { display: 'block', fontSize: 13, fontWeight: 700, color: '#444', marginBottom: 6 }
  const optLabel = { display: 'block', fontSize: 13, fontWeight: 700, color: '#888', marginBottom: 6 }

  const handleImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 5)
    setImages(files)
  }

  const handleSubmit = async () => {
    setError('')
    const { fullName, category, city, postcode, phone, email, description } = form
    if (!fullName || !category || !city || !postcode || !phone || !email || !description) return setError(t.errFill)
    setLoading(true)
    try {
      const supabase = getSupabase()
      const { data: { user } } = await supabase.auth.getUser()
      const imageUrls = []
      for (const img of images) {
        const ext = img.name.split('.').pop()
        const path = `listings/${user?.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error: uploadError } = await supabase.storage.from('listing-images').upload(path, img)
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('listing-images').getPublicUrl(path)
          imageUrls.push(urlData.publicUrl)
        }
      }
      const { error: e } = await supabase.from('listings').insert({ type: 'list_service', user_id: user?.id, status: 'pending', data: { ...form, imageUrls } })
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
      <button onClick={() => router.push('/')} style={{ background: ORANGE, border: 'none', borderRadius: 14, padding: '14px 32px', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: FONT }}>{t.backHome}</button>
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
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎯</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: NAVY, margin: '0 0 6px' }}>{t.title}</h1>
          <p style={{ fontSize: 13, color: '#888', margin: 0, lineHeight: 1.5 }}>{t.subtitle}</p>
        </div>
        {error && <div style={{ background: '#fff0f0', border: '1.5px solid #ffcdd2', borderRadius: 12, padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#c62828', marginBottom: 16 }}>{error}</div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={label}>{t.fullName} *</label>
            <input type="text" value={form.fullName} onChange={e => set('fullName', e.target.value)} placeholder={t.fullNamePh} onFocus={() => setFocus('fullName')} onBlur={() => setFocus(null)} style={inp('fullName')} />
          </div>
          <div>
            <label style={optLabel}>{t.businessName}</label>
            <input type="text" value={form.businessName} onChange={e => set('businessName', e.target.value)} placeholder={t.businessNamePh} onFocus={() => setFocus('businessName')} onBlur={() => setFocus(null)} style={inp('businessName')} />
          </div>
          <div>
            <label style={label}>{t.category} *</label>
            <input type="text" value={form.category} onChange={e => set('category', e.target.value)} placeholder={t.categoryPh} onFocus={() => setFocus('category')} onBlur={() => setFocus(null)} style={inp('category')} />
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={optLabel}>{t.address}</label>
              <input type="text" value={form.address} onChange={e => set('address', e.target.value)} placeholder={t.addressPh} onFocus={() => setFocus('address')} onBlur={() => setFocus(null)} style={inp('address')} />
            </div>
            <div>
              <label style={optLabel}>{t.experience}</label>
              <input type="number" value={form.experience} onChange={e => set('experience', e.target.value)} placeholder={t.experiencePh} onFocus={() => setFocus('experience')} onBlur={() => setFocus(null)} style={inp('experience')} />
            </div>
          </div>
          <div>
            <label style={label}>{t.phone} *</label>
            <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder={t.phonePh} onFocus={() => setFocus('phone')} onBlur={() => setFocus(null)} style={inp('phone')} />
          </div>
          <div>
            <label style={optLabel}>{t.whatsapp}</label>
            <input type="tel" value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder={t.whatsappPh} onFocus={() => setFocus('whatsapp')} onBlur={() => setFocus(null)} style={inp('whatsapp')} />
          </div>
          <div>
            <label style={label}>{t.email} *</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder={t.emailPh} onFocus={() => setFocus('email')} onBlur={() => setFocus(null)} style={inp('email')} />
          </div>
          <div>
            <label style={optLabel}>{t.website}</label>
            <input type="url" value={form.website} onChange={e => set('website', e.target.value)} placeholder={t.websitePh} onFocus={() => setFocus('website')} onBlur={() => setFocus(null)} style={inp('website')} />
          </div>
          <div>
            <label style={label}>{t.description} *</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder={t.descriptionPh} onFocus={() => setFocus('description')} onBlur={() => setFocus(null)} rows={5} style={{ ...inp('description'), resize: 'vertical', lineHeight: 1.5 }} />
          </div>
          <div>
            <label style={label}>{t.images}</label>
            <p style={{ fontSize: 12, color: '#888', margin: '0 0 8px' }}>{t.imagesDesc}</p>
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', border: '2px dashed rgba(0,0,0,0.15)', borderRadius: 14, background: '#fff', cursor: 'pointer', gap: 8 }}>
              <span style={{ fontSize: 28 }}>📷</span>
              <span style={{ fontSize: 13, color: '#666', fontWeight: 600 }}>{images.length > 0 ? `${images.length} photo(s) selected` : 'Tap to upload photo / logo'}</span>
              <input type="file" accept="image/*" multiple onChange={handleImages} style={{ display: 'none' }} />
            </label>
            {images.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                {images.map((img, i) => (<div key={i} style={{ fontSize: 12, background: '#e8f5e9', color: '#2e7d32', padding: '4px 10px', borderRadius: 20, fontWeight: 600 }}>✓ {img.name.slice(0, 15)}…</div>))}
              </div>
            )}
          </div>
          <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '15px', background: loading ? '#ccc' : ORANGE, border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, color: '#fff', cursor: loading ? 'default' : 'pointer', fontFamily: FONT, boxShadow: loading ? 'none' : '0 4px 16px rgba(255,107,53,0.35)', marginTop: 8 }}>
            {loading ? t.submitting : t.submit}
          </button>
          <p style={{ fontSize: 11, color: '#aaa', textAlign: 'center', margin: 0 }}>Your profile will be reviewed within 24 hours before going live.</p>
        </div>
      </div>
    </div>
  )
}

export default function ListService() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f7f7f5' }} />}>
      <ListServiceInner />
    </Suspense>
  )
}