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

function HireStaffInner() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const [focus, setFocus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ jobTitle: '', city: '', postcode: '', salary: '', description: '', applyPhone: '', applyEmail: '' })

  const isRtl = lang === 'ku'
  const T = {
    en: { title: 'Hire Staff', subtitle: 'Post a job and find the right talent within the Kurdish community', jobTitle: 'Full Job Title', jobTitlePh: 'e.g. Full Time Shop Assistant, Part Time Driver, Head Chef', city: 'City', cityPh: 'e.g. Birmingham', postcode: 'Postcode', postcodePh: 'e.g. B1 1AA', salary: 'Salary / Rate', salaryPh: 'e.g. £12/hr or £28,000/year', description: 'Job Description', descriptionPh: 'Describe the role, responsibilities, working hours…', applyPhone: 'Apply by Phone', applyPhonePh: '+44 7700 900000', applyEmail: 'Apply by Email', applyEmailPh: 'jobs@yourbusiness.com', submit: 'Post Job', submitting: 'Posting…', back: '← Back', successTitle: 'Job Posted! 🎉', successMsg: 'Your job listing is under review. We\'ll notify you within 24 hours once approved.', backHome: 'Back to Home', errFill: 'Please fill in all required fields' },
    ku: { title: 'کارمەند بگرە', subtitle: 'کار پۆست بکە و ئەو بەتوانا لە کۆمەڵگای کورد بدۆزەوە', jobTitle: 'ناوی تەواوی کار', jobTitlePh: 'وەک: یاریدەدەری دوکان تەواو کات، شۆفێر نیوەکات', city: 'شار', cityPh: 'وەک: بێرمینگەم', postcode: 'پۆستکۆد', postcodePh: 'وەک: B1 1AA', salary: 'مووچە / نرخ', salaryPh: 'وەک: £١٢ کاتژمێر', description: 'وەسفی کار', descriptionPh: 'کارەکە وەسف بکە، ئەرکەکان، کاتژمێرەکان…', applyPhone: 'دەرخواستی تەلەفۆن', applyPhonePh: '+44 7700 900000', applyEmail: 'دەرخواستی ئیمەیڵ', applyEmailPh: 'jobs@yourbusiness.com', submit: 'کار پۆست بکە', submitting: 'دەنێردرێت…', back: '→ گەڕانەوە', successTitle: '!کار پۆست کرا 🎉', successMsg: 'کارەکەت تەماشا دەکرێت. لە ٢٤ کاتژمێردا ئاگادارت دەکەینەوە.', backHome: 'گەڕانەوە بۆ ماڵەوە', errFill: 'تکایە هەموو خانەکان پڕ بکەوە' }
  }
  const t = T[lang]
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const inp = (f) => ({ width: '100%', padding: '14px 16px', border: `2px solid ${focus === f ? '#FF6B35' : 'rgba(0,0,0,0.1)'}`, borderRadius: 14, fontSize: 15, fontFamily: FONT, outline: 'none', background: '#fff', color: '#1a1a1a', boxSizing: 'border-box', transition: 'border-color 0.2s', direction: 'ltr' })
  const label = { display: 'block', fontSize: 13, fontWeight: 700, color: '#444', marginBottom: 6 }

  const handleSubmit = async () => {
    setError('')
    const { jobTitle, city, postcode, salary, description, applyPhone, applyEmail } = form
    if (!jobTitle || !city || !postcode || !salary || !description || (!applyPhone && !applyEmail)) return setError(t.errFill)
    setLoading(true)
    try {
      const supabase = getSupabase()
      const { data: { user } } = await supabase.auth.getUser()
      const { error: e } = await supabase.from('listings').insert({ type: 'hire_staff', user_id: user?.id, status: 'pending', data: form })
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
          <div style={{ fontSize: 32, marginBottom: 8 }}>👥</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: NAVY, margin: '0 0 6px' }}>{t.title}</h1>
          <p style={{ fontSize: 13, color: '#888', margin: 0, lineHeight: 1.5 }}>{t.subtitle}</p>
        </div>
        {error && <div style={{ background: '#fff0f0', border: '1.5px solid #ffcdd2', borderRadius: 12, padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#c62828', marginBottom: 16 }}>{error}</div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={label}>{t.jobTitle} *</label>
            <input type="text" value={form.jobTitle} onChange={e => set('jobTitle', e.target.value)} placeholder={t.jobTitlePh} onFocus={() => setFocus('jobTitle')} onBlur={() => setFocus(null)} style={inp('jobTitle')} />
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
            <label style={label}>{t.salary} *</label>
            <input type="text" value={form.salary} onChange={e => set('salary', e.target.value)} placeholder={t.salaryPh} onFocus={() => setFocus('salary')} onBlur={() => setFocus(null)} style={inp('salary')} />
          </div>
          <div>
            <label style={label}>{t.description} *</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder={t.descriptionPh} onFocus={() => setFocus('description')} onBlur={() => setFocus(null)} rows={4} style={{ ...inp('description'), resize: 'vertical', lineHeight: 1.5 }} />
          </div>
          <div>
            <label style={label}>{t.applyPhone}</label>
            <input type="tel" value={form.applyPhone} onChange={e => set('applyPhone', e.target.value)} placeholder={t.applyPhonePh} onFocus={() => setFocus('applyPhone')} onBlur={() => setFocus(null)} style={inp('applyPhone')} />
          </div>
          <div>
            <label style={label}>{t.applyEmail}</label>
            <input type="email" value={form.applyEmail} onChange={e => set('applyEmail', e.target.value)} placeholder={t.applyEmailPh} onFocus={() => setFocus('applyEmail')} onBlur={() => setFocus(null)} style={inp('applyEmail')} />
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

export default function HireStaff() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f7f7f5' }} />}>
      <HireStaffInner />
    </Suspense>
  )
}