'use client'
import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

const FONT = "'Plus Jakarta Sans', 'Sora', sans-serif"
const ORANGE = 'linear-gradient(135deg, #FF6B35, #FF8C61)'
const NAVY = '#1A2B5F'
const CITIES = ['London','Birmingham','Manchester','Leeds','Sheffield','Glasgow','Bristol','Leicester','Nottingham','Liverpool','Newcastle','Cardiff','Edinburgh','Coventry','Bradford']
const MAKES = ['BMW','Mercedes','Audi','Toyota','Ford','Volkswagen','Honda','Nissan','Hyundai','Kia','Vauxhall','Peugeot','Renault','Skoda','Seat','Other']
const CONDITIONS = ['Excellent','Good','Fair','Needs Work']

function getSupabase() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

function SellCarInner() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const [focus, setFocus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ make: '', model: '', year: '', mileage: '', price: '', condition: '', description: '', phone: '', email: '', city: '' })

  const isRtl = lang === 'ku'
  const T = {
    en: { title: 'Sell Your Car', subtitle: 'Fill in your car details and we\'ll review within 24 hours', make: 'Make', model: 'Model', modelPh: 'e.g. 3 Series, C-Class', year: 'Year', yearPh: 'e.g. 2019', mileage: 'Mileage', mileagePh: 'e.g. 45000', price: 'Asking Price (£)', pricePh: 'e.g. 12500', condition: 'Condition', city: 'Location', description: 'Description', descriptionPh: 'Describe the car, service history, any extras…', phone: 'Phone Number', phonePh: '+44 7700 900000', email: 'Email Address', emailPh: 'you@example.com', submit: 'Submit for Review', submitting: 'Submitting…', back: '← Back', successTitle: 'Submitted! 🎉', successMsg: 'Your car listing is under review. We\'ll notify you within 24 hours.', backHome: 'Back to Home', errFill: 'Please fill in all required fields' },
    ku: { title: 'ئۆتۆمبێلەکەت بفرۆشە', subtitle: 'زانیاریەکان پڕ بکەوە، ئێمەش لە ٢٤ کاتژمێردا پێداچوونەوەی دەکەین', make: 'مارکا', model: 'مۆدێل', modelPh: 'وەک: 3 Series', year: 'ساڵ', yearPh: 'وەک: ٢٠١٩', mileage: 'میلیج', mileagePh: 'وەک: ٤٥٠٠٠', price: 'نرخی داواکراو (£)', pricePh: 'وەک: ١٢٥٠٠', condition: 'حاڵەت', city: 'شوێن', description: 'وەسف', descriptionPh: 'ئۆتۆمبێلەکە وەسف بکە…', phone: 'ژمارەی تەلەفۆن', phonePh: '+44 7700 900000', email: 'ئیمەیڵ', emailPh: 'you@example.com', submit: 'بنێرە بۆ پێداچوونەوە', submitting: 'دەنێردرێت…', back: '→ گەڕانەوە', successTitle: '!دانرا 🎉', successMsg: 'ئۆتۆمبێلەکەت تەماشا دەکرێت. لە ٢٤ کاتژمێردا ئاگادارت دەکەینەوە.', backHome: 'گەڕانەوە بۆ ماڵەوە', errFill: 'تکایە هەموو خانەکان پڕ بکەوە' }
  }
  const t = T[lang]
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const inp = (f) => ({ width: '100%', padding: '14px 16px', border: `2px solid ${focus === f ? '#FF6B35' : 'rgba(0,0,0,0.1)'}`, borderRadius: 14, fontSize: 15, fontFamily: FONT, outline: 'none', background: '#fff', color: '#1a1a1a', boxSizing: 'border-box', transition: 'border-color 0.2s', direction: 'ltr' })
  const label = { display: 'block', fontSize: 13, fontWeight: 700, color: '#444', marginBottom: 6 }

  const handleSubmit = async () => {
    setError('')
    const { make, model, year, mileage, price, condition, description, phone, email, city } = form
    if (!make || !model || !year || !mileage || !price || !condition || !description || !phone || !email || !city) return setError(t.errFill)
    setLoading(true)
    try {
      const supabase = getSupabase()
      const { data: { user } } = await supabase.auth.getUser()
      const { error: e } = await supabase.from('listings').insert({ type: 'sell_car', user_id: user?.id, status: 'pending', data: form })
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
          <div style={{ fontSize: 32, marginBottom: 8 }}>🚗</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: NAVY, margin: '0 0 6px' }}>{t.title}</h1>
          <p style={{ fontSize: 13, color: '#888', margin: 0, lineHeight: 1.5 }}>{t.subtitle}</p>
        </div>
        {error && <div style={{ background: '#fff0f0', border: '1.5px solid #ffcdd2', borderRadius: 12, padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#c62828', marginBottom: 16 }}>{error}</div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={label}>{t.make} *</label>
              <select value={form.make} onChange={e => set('make', e.target.value)} style={{ ...inp('make'), appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer' }}>
                <option value="">Select…</option>
                {MAKES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label style={label}>{t.model} *</label>
              <input type="text" value={form.model} onChange={e => set('model', e.target.value)} placeholder={t.modelPh} onFocus={() => setFocus('model')} onBlur={() => setFocus(null)} style={inp('model')} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={label}>{t.year} *</label>
              <input type="number" value={form.year} onChange={e => set('year', e.target.value)} placeholder={t.yearPh} onFocus={() => setFocus('year')} onBlur={() => setFocus(null)} style={inp('year')} />
            </div>
            <div>
              <label style={label}>{t.mileage} *</label>
              <input type="number" value={form.mileage} onChange={e => set('mileage', e.target.value)} placeholder={t.mileagePh} onFocus={() => setFocus('mileage')} onBlur={() => setFocus(null)} style={inp('mileage')} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={label}>{t.price} *</label>
              <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder={t.pricePh} onFocus={() => setFocus('price')} onBlur={() => setFocus(null)} style={inp('price')} />
            </div>
            <div>
              <label style={label}>{t.condition} *</label>
              <select value={form.condition} onChange={e => set('condition', e.target.value)} style={{ ...inp('condition'), appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer' }}>
                <option value="">Select…</option>
                {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={label}>{t.city} *</label>
            <select value={form.city} onChange={e => set('city', e.target.value)} style={{ ...inp('city'), appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer' }}>
              <option value="">Select…</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={label}>{t.description} *</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder={t.descriptionPh} onFocus={() => setFocus('description')} onBlur={() => setFocus(null)} rows={4} style={{ ...inp('description'), resize: 'vertical', lineHeight: 1.5 }} />
          </div>
          <div>
            <label style={label}>{t.phone} *</label>
            <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder={t.phonePh} onFocus={() => setFocus('phone')} onBlur={() => setFocus(null)} style={inp('phone')} />
          </div>
          <div>
            <label style={label}>{t.email} *</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder={t.emailPh} onFocus={() => setFocus('email')} onBlur={() => setFocus(null)} style={inp('email')} />
          </div>
          <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '15px', background: loading ? '#ccc' : ORANGE, border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, color: '#fff', cursor: loading ? 'default' : 'pointer', fontFamily: FONT, boxShadow: loading ? 'none' : '0 4px 16px rgba(255,107,53,0.35)', marginTop: 8 }}>
            {loading ? t.submitting : t.submit}
          </button>
          <p style={{ fontSize: 11, color: '#aaa', textAlign: 'center', margin: 0 }}>Your listing will be reviewed within 24 hours before going live.</p>
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