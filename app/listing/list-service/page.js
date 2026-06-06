'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import TX from '@/lib/translations'

const INDIGO = '#4F46E5'
const INDIGO_DARK = '#1C1A4F'
const INDIGO_LIGHT = '#818CF8'
const SOFT = '#EDE9FE'
const BG = '#F5F4FF'
const FONT = "'Nunito', sans-serif"

const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export default function ListServicePage() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const [userId, setUserId] = useState(null)
  const [form, setForm] = useState({ serviceName: '', description: '', location: '', price: '', contact: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const isRTL = ['ku', 'fa', 'ar'].includes(lang)
  const t = (TX[lang] || TX.en).listService

  useEffect(() => {
    const saved = localStorage.getItem('komek_lang')
    if (saved) setLang(saved)
    const handler = (e) => setLang(e.detail)
    window.addEventListener('langchange', handler)
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) router.replace('/account?reason=post')
      else setUserId(data.user.id)
    })
    return () => window.removeEventListener('langchange', handler)
  }, [])

  function update(field, value) { setForm(f => ({ ...f, [field]: value })) }

  async function handleSubmit() {
    const { serviceName, description, location, price, contact } = form
    if (!serviceName || !description || !location || !price || !contact) { setError(t.required); return }
    setError(''); setSubmitting(true)
    const { error: sbError } = await supabase.from('listings').insert({ type: 'list_service', status: 'pending', user_id: userId, data: { serviceName, description, location, price, contact } })
    setSubmitting(false)
    if (sbError) { setError(sbError.message); return }
    setSuccess(true)
    setTimeout(() => router.push('/home'), 2500)
  }

  const fields = [
    { key: 'serviceName', label: t.serviceName, placeholder: t.serviceNamePh, multiline: false },
    { key: 'description', label: t.description, placeholder: t.descPh, multiline: true },
    { key: 'location', label: t.location, placeholder: t.locationPh, multiline: false },
    { key: 'price', label: t.price, placeholder: t.pricePh, multiline: false },
    { key: 'contact', label: t.contact, placeholder: t.contactPh, multiline: false },
  ]

  if (success) return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 56 }}>✅</div>
      <p style={{ fontSize: 16, fontWeight: 700, color: INDIGO_DARK, textAlign: 'center', maxWidth: 280 }}>{t.success}</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: FONT, direction: isRTL ? 'rtl' : 'ltr', paddingBottom: 80 }}>
      <div style={{ background: `linear-gradient(135deg, ${INDIGO_DARK} 0%, #2D2A7A 100%)`, padding: '40px 20px 56px', textAlign: 'center' }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>🛠️</div>
        <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 900, margin: '0 0 8px' }}>{t.heroTitle}</h1>
        <p style={{ color: INDIGO_LIGHT, fontSize: 14, fontWeight: 500, margin: 0 }}>{t.heroSub}</p>
      </div>
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 16px', marginTop: -24 }}>
        <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 4px 24px rgba(79,70,229,0.10)', padding: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {fields.map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 13, fontWeight: 800, color: INDIGO_DARK, display: 'block', marginBottom: 6 }}>{f.label}</label>
                {f.multiline
                  ? <textarea value={form[f.key]} onChange={e => update(f.key, e.target.value)} placeholder={f.placeholder} rows={4} style={{ width: '100%', border: `1.5px solid ${SOFT}`, borderRadius: 12, padding: '12px 14px', fontFamily: FONT, fontSize: 14, color: INDIGO_DARK, resize: 'vertical', outline: 'none', background: BG, boxSizing: 'border-box' }} />
                  : <input value={form[f.key]} onChange={e => update(f.key, e.target.value)} placeholder={f.placeholder} style={{ width: '100%', border: `1.5px solid ${SOFT}`, borderRadius: 12, padding: '12px 14px', fontFamily: FONT, fontSize: 14, color: INDIGO_DARK, outline: 'none', background: BG, boxSizing: 'border-box' }} />
                }
              </div>
            ))}
            {error && <p style={{ color: '#EF4444', fontSize: 13, fontWeight: 600, margin: 0 }}>{error}</p>}
            <button onClick={handleSubmit} disabled={submitting}
              style={{ width: '100%', padding: '15px', background: submitting ? '#E5E7EB' : INDIGO, color: submitting ? '#9CA3AF' : '#fff', border: 'none', borderRadius: 14, fontFamily: FONT, fontSize: 16, fontWeight: 800, cursor: submitting ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
              {submitting ? t.submitting : t.submit}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}