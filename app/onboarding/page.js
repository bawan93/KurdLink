'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

const FONT = "'Plus Jakarta Sans', 'Sora', sans-serif"
const ORANGE = 'linear-gradient(135deg, #FF6B35, #FF8C61)'
const NAVY = '#1A2B5F'
const CITIES = ['London','Birmingham','Manchester','Leeds','Sheffield','Glasgow','Bristol','Leicester','Nottingham','Liverpool','Newcastle','Cardiff','Edinburgh','Coventry','Bradford']

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

function OnboardingInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  const [lang, setLang] = useState('en')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [focus, setFocus] = useState(null)
  const [showPass, setShowPass] = useState(false)

  const isRtl = lang === 'ku'
  const T = {
    en: { welcome:'Create your account', tagline:'Join thousands of Kurds across the UK', fullName:'Full Name', namePh:'Your full name', email:'Email Address', emailPh:'you@example.com', password:'Password', passPh:'At least 8 characters', city:'Your City', selectCity:'Select your city…', createBtn:'Create Account', creating:'Creating…', hasAccount:'Already have an account?', signIn:'Sign In', terms:'By creating an account you agree to our Terms & Privacy Policy', success:'🎉 Account created! Redirecting…', errName:'Please enter your full name', errEmail:'Please enter your email', errPass:'Password must be at least 8 characters', errCity:'Please select your city' },
    ku: { welcome:'ئەکاونتەکەت دروست بکە', tagline:'بەشداری هەزاران کورد لە UK بکە', fullName:'ناوی تەواو', namePh:'ناوی تەواوت', email:'ئیمەیڵ', emailPh:'ئیمەیڵەکەت', password:'وشەی نهێنی', passPh:'لانیکەم ٨ پیت', city:'شارەکەت', selectCity:'شارەکەت هەڵبژێرە…', createBtn:'دروستکردنی ئەکاونت', creating:'چاوەڕوانبە…', hasAccount:'ئەکاونتی هەیت؟', signIn:'چوونەژوورەوە', terms:'بە دروستکردنی ئەکاونت ڕەزامەندیت لەسەر مەرجەکانمان دەردەخەیت', success:'🎉 ئەکاونت دروستکرا!', errName:'تکایە ناوت بنووسە', errEmail:'تکایە ئیمەیڵەکەت بنووسە', errPass:'وشەی نهێنی دەبێت لانیکەم ٨ پیت بێت', errCity:'تکایە شارەکەت هەڵبژێرە' }
  }
  const t = T[lang]

  const handleSignUp = async () => {
    setError('')
    if (!name.trim()) return setError(t.errName)
    if (!email.trim()) return setError(t.errEmail)
    if (password.length < 8) return setError(t.errPass)
    if (!city) return setError(t.errCity)
    setLoading(true)
    try {
      const supabase = getSupabase()
      const { data, error: e } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name, city } } })
      if (e) throw e
      if (data?.user?.identities?.length === 0) setError('This email is already registered. Please sign in.')
      else { setSuccess(t.success); setTimeout(() => router.push(redirect), 1500) }
    } catch (err) { setError(err.message || 'Something went wrong.') }
    finally { setLoading(false) }
  }

  const inp = (f) => ({
    width: '100%', padding: '14px 16px',
    border: `2px solid ${focus === f ? '#FF6B35' : 'rgba(255,255,255,0.15)'}`,
    borderRadius: 14, fontSize: 15, fontFamily: FONT, outline: 'none',
    background: 'rgba(255,255,255,0.07)', color: '#fff', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
    direction: f === 'email' || f === 'password' ? 'ltr' : isRtl ? 'rtl' : 'ltr'
  })

  const label = { display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: 6 }

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(160deg,${NAVY} 0%,#0f2240 100%)`, fontFamily: FONT, direction: isRtl ? 'rtl' : 'ltr', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, zIndex: 10, backdropFilter: 'blur(12px)' }}>
        <div style={{ fontSize: 22, fontWeight: 800, background: ORANGE, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>KurdLink</div>
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.08)', padding: '5px 6px', borderRadius: 20 }}>
          {['en', 'ku'].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ padding: '6px 14px', background: lang === l ? '#fff' : 'transparent', color: lang === l ? NAVY : 'rgba(255,255,255,0.7)', border: 'none', borderRadius: 16, fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: FONT }}>
              {l === 'en' ? 'EN' : 'KU'}
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: '32px 20px 40px', maxWidth: 480, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>👋</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', margin: '0 0 8px', lineHeight: 1.2 }}>{t.welcome}</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: 0 }}>{t.tagline}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && <div style={{ background: 'rgba(239,68,68,0.15)', border: '1.5px solid rgba(239,68,68,0.5)', borderRadius: 12, padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#FCA5A5' }}>{error}</div>}
          {success && <div style={{ background: 'rgba(29,184,122,0.15)', border: '1.5px solid rgba(29,184,122,0.5)', borderRadius: 12, padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#6EE7B7' }}>{success}</div>}

          <div>
            <label style={label}>{t.fullName}</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={t.namePh} onFocus={() => setFocus('name')} onBlur={() => setFocus(null)} style={inp('name')} />
          </div>
          <div>
            <label style={label}>{t.email}</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t.emailPh} onFocus={() => setFocus('email')} onBlur={() => setFocus(null)} style={inp('email')} />
          </div>
          <div>
            <label style={label}>{t.password}</label>
            <div style={{ position: 'relative' }}>
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder={t.passPh} onFocus={() => setFocus('password')} onBlur={() => setFocus(null)} onKeyDown={e => e.key === 'Enter' && handleSignUp()} style={{ ...inp('password'), paddingRight: 48 }} />
              <span onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: 18, color: 'rgba(255,255,255,0.5)' }}>{showPass ? '🙈' : '👁'}</span>
            </div>
          </div>
          <div>
            <label style={label}>{t.city}</label>
            <select value={city} onChange={e => setCity(e.target.value)} onFocus={() => setFocus('city')} onBlur={() => setFocus(null)} style={{ ...inp('city'), appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer' }}>
              <option value="" style={{ background: NAVY }}>{t.selectCity}</option>
              {CITIES.map(c => <option key={c} value={c} style={{ background: NAVY }}>{c}</option>)}
            </select>
          </div>

          <button onClick={handleSignUp} disabled={loading} style={{ width: '100%', padding: '15px', background: loading ? 'rgba(255,255,255,0.1)' : ORANGE, border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, color: loading ? 'rgba(255,255,255,0.4)' : '#fff', cursor: loading ? 'default' : 'pointer', fontFamily: FONT, boxShadow: loading ? 'none' : '0 4px 16px rgba(255,107,53,0.35)', marginTop: 4 }}>
            {loading ? t.creating : t.createBtn}
          </button>

          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', margin: 0, lineHeight: 1.6 }}>{t.terms}</p>

          <div style={{ textAlign: 'center', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{t.hasAccount} </span>
            <span onClick={() => router.push(`/auth?redirect=${redirect}`)} style={{ fontSize: 13, fontWeight: 700, color: '#FF6B35', cursor: 'pointer' }}>{t.signIn}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Onboarding() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#1A2B5F' }} />}>
      <OnboardingInner />
    </Suspense>
  )
}