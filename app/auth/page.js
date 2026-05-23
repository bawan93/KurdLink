'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

const FONT = "'Plus Jakarta Sans', 'Sora', sans-serif"
const ORANGE = 'linear-gradient(135deg, #FF6B35, #FF8C61)'
const NAVY = '#1A2B5F'

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

function AuthInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const [lang, setLang] = useState('en')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [focus, setFocus] = useState(null)

  const isRtl = lang === 'ku'
  const T = {
    en: { title: 'Welcome back', tagline: 'Sign in to your KurdLink account', email: 'Email Address', emailPh: 'you@example.com', password: 'Password', passPh: 'Your password', signIn: 'Sign In', signingIn: 'Signing in…', noAccount: "Don't have an account?", signUp: 'Sign Up', errFill: 'Please enter your email and password', errInvalid: 'Invalid email or password' },
    ku: { title: 'بەخێربێیتەوە', tagline: 'بچۆ ژوورەوە بۆ ئەکاونتی KurdLink', email: 'ئیمەیڵ', emailPh: 'ئیمەیڵەکەت', password: 'وشەی نهێنی', passPh: 'وشەی نهێنیەکەت', signIn: 'چوونەژوورەوە', signingIn: 'چاوەڕوانبە…', noAccount: 'ئەکاونتت نییە؟', signUp: 'دروستکردنی ئەکاونت', errFill: 'تکایە ئیمەیڵ و وشەی نهێنی بنووسە', errInvalid: 'ئیمەیڵ یان وشەی نهێنی هەڵەیە' }
  }
  const t = T[lang]

  const handleSignIn = async () => {
    setError('')
    if (!email.trim() || !password) return setError(t.errFill)
    setLoading(true)
    try {
      const supabase = getSupabase()
      const { error: e } = await supabase.auth.signInWithPassword({ email, password })
      if (e) throw e
      router.push(redirect)
    } catch (err) {
      setError(t.errInvalid)
    } finally {
      setLoading(false)
    }
  }

  const inp = (f) => ({
    width: '100%', padding: '14px 16px',
    border: `2px solid ${focus === f ? '#FF6B35' : 'rgba(255,255,255,0.15)'}`,
    borderRadius: 14, fontSize: 15, fontFamily: FONT, outline: 'none',
    background: 'rgba(255,255,255,0.07)', color: '#fff', boxSizing: 'border-box',
    transition: 'border-color 0.2s', direction: 'ltr'
  })

  return (
    <div style={{ minHeight: '100vh', minHeight: '100dvh', background: `linear-gradient(160deg,${NAVY} 0%,#0f2240 100%)`, fontFamily: FONT, direction: isRtl ? 'rtl' : 'ltr', display: 'flex', flexDirection: 'column' }}>

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
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', margin: '0 0 8px', lineHeight: 1.2 }}>{t.title}</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: 0 }}>{t.tagline}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.15)', border: '1.5px solid rgba(239,68,68,0.5)', borderRadius: 12, padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#FCA5A5' }}>
              {error}
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>{t.email}</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t.emailPh} onFocus={() => setFocus('email')} onBlur={() => setFocus(null)} style={inp('email')} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>{t.password}</label>
            <div style={{ position: 'relative' }}>
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder={t.passPh} onFocus={() => setFocus('password')} onBlur={() => setFocus(null)} onKeyDown={e => e.key === 'Enter' && handleSignIn()} style={{ ...inp('password'), paddingRight: 48 }} />
              <span onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: 18, color: 'rgba(255,255,255,0.5)' }}>{showPass ? '🙈' : '👁'}</span>
            </div>
          </div>

          <button onClick={handleSignIn} disabled={loading} style={{ width: '100%', padding: '15px', background: loading ? 'rgba(255,255,255,0.1)' : ORANGE, border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, color: loading ? 'rgba(255,255,255,0.4)' : '#fff', cursor: loading ? 'default' : 'pointer', fontFamily: FONT, boxShadow: loading ? 'none' : '0 4px 16px rgba(255,107,53,0.35)', marginTop: 4 }}>
            {loading ? t.signingIn : t.signIn}
          </button>

          <div style={{ textAlign: 'center', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{t.noAccount} </span>
            <span onClick={() => router.push(`/onboarding?redirect=${redirect}`)} style={{ fontSize: 13, fontWeight: 700, color: '#FF6B35', cursor: 'pointer' }}>{t.signUp}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Auth() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#1A2B5F' }} />}>
      <AuthInner />
    </Suspense>
  )
}