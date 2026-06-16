'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/app/lib/supabase'

const FONT = "'Nunito', sans-serif"
const INDIGO = '#4F46E5'
const INDIGO_DARK = '#1C1A4F'
const INDIGO_LIGHT = '#818CF8'
const MINT = '#34D399'
const SOFT = '#EDE9FE'

function SproutLogo({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="auth-sbg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={INDIGO} />
          <stop offset="100%" stopColor={INDIGO_LIGHT} />
        </linearGradient>
        <linearGradient id="auth-sl" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#6EE7B7" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="url(#auth-sbg)" />
      <path d="M 50 76 L 50 45" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M 50 60 Q 26 55 22 34 Q 44 28 52 56 Z" fill="url(#auth-sl)" />
      <path d="M 50 50 Q 72 44 76 23 Q 56 17 48 46 Z" fill="url(#auth-sl)" opacity="0.85" />
      <ellipse cx="50" cy="40" rx="6" ry="9" fill={MINT} />
      <ellipse cx="50" cy="37" rx="3" ry="4" fill="white" opacity="0.8" />
    </svg>
  )
}

function AuthInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/home'

  const [lang, setLang] = useState('en')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [focus, setFocus] = useState(null)

  const isRtl = lang === 'ku'
  const T = {
    en: { title: 'Welcome back', tagline: 'Sign in to your Komek account', email: 'Email Address', emailPh: 'you@example.com', password: 'Password', passPh: 'Your password', signIn: 'Sign In', signingIn: 'Signing in…', noAccount: "Don't have an account?", signUp: 'Sign Up', errFill: 'Please enter your email and password', errInvalid: 'Invalid email or password' },
    ku: { title: 'بەخێربێیتەوە', tagline: 'بچۆ ژوورەوە بۆ ئەکاونتی کۆمەک', email: 'ئیمەیڵ', emailPh: 'ئیمەیڵەکەت', password: 'وشەی نهێنی', passPh: 'وشەی نهێنیەکەت', signIn: 'چوونەژوورەوە', signingIn: 'چاوەڕوانبە…', noAccount: 'ئەکاونتت نییە؟', signUp: 'دروستکردنی ئەکاونت', errFill: 'تکایە ئیمەیڵ و وشەی نهێنی بنووسە', errInvalid: 'ئیمەیڵ یان وشەی نهێنی هەڵەیە' },
    fa: { title: 'خوش آمدی', tagline: 'وارد حساب کومک شو', email: 'ایمیل', emailPh: 'ایمیل شما', password: 'رمز عبور', passPh: 'رمز عبور شما', signIn: 'ورود', signingIn: 'در حال ورود…', noAccount: 'حساب نداری؟', signUp: 'ثبت‌نام', errFill: 'لطفاً ایمیل و رمز عبور را وارد کن', errInvalid: 'ایمیل یا رمز عبور نادرست است' },
    ar: { title: 'أهلاً بعودتك', tagline: 'سجّل الدخول إلى حساب كومك', email: 'البريد الإلكتروني', emailPh: 'بريدك الإلكتروني', password: 'كلمة المرور', passPh: 'كلمة المرور', signIn: 'تسجيل الدخول', signingIn: 'جارٍ الدخول…', noAccount: 'ليس لديك حساب؟', signUp: 'إنشاء حساب', errFill: 'يرجى إدخال البريد الإلكتروني وكلمة المرور', errInvalid: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
  }
  const t = T[lang] || T.en

  const LANGS = [
    { id: 'en', label: 'EN' },
    { id: 'ku', label: 'KU' },
    { id: 'fa', label: 'FA' },
    { id: 'ar', label: 'AR' },
  ]

  const handleSignIn = async () => {
    setError('')
    if (!email.trim() || !password) return setError(t.errFill)
    setLoading(true)
    try {
      const supabase = createClient()
      const { error: e } = await supabase.auth.signInWithPassword({ email, password })
      if (e) throw e
      router.push(redirect)
    } catch {
      setError(t.errInvalid)
    } finally {
      setLoading(false)
    }
  }

  const inp = (f) => ({
    width: '100%', padding: '14px 16px',
    border: `2px solid ${focus === f ? INDIGO : 'rgba(255,255,255,0.15)'}`,
    borderRadius: 14, fontSize: 15, fontFamily: FONT, outline: 'none',
    background: 'rgba(255,255,255,0.07)', color: '#fff', boxSizing: 'border-box',
    transition: 'border-color 0.2s', direction: 'ltr',
  })

  return (
    <div style={{ minHeight: '100vh', minHeight: '100dvh', background: `linear-gradient(160deg, ${INDIGO_DARK} 0%, #2d2b6b 60%, #3730a3 100%)`, fontFamily: FONT, direction: isRtl ? 'rtl' : 'ltr', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, zIndex: 10, backdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SproutLogo size={28} />
          <span style={{ fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>Komek</span>
        </div>
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.08)', padding: '5px 6px', borderRadius: 20 }}>
          {LANGS.map(l => (
            <button key={l.id} onClick={() => setLang(l.id)} style={{ padding: '5px 10px', background: lang === l.id ? '#fff' : 'transparent', color: lang === l.id ? INDIGO_DARK : 'rgba(255,255,255,0.7)', border: 'none', borderRadius: 14, fontWeight: 700, fontSize: 11, cursor: 'pointer', fontFamily: FONT }}>
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: '32px 20px 40px', maxWidth: 480, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>👋</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', margin: '0 0 8px', lineHeight: 1.2 }}>{t.title}</h1>
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
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={t.passPh}
                onFocus={() => setFocus('password')}
                onBlur={() => setFocus(null)}
                onKeyDown={e => e.key === 'Enter' && handleSignIn()}
                style={{ ...inp('password'), paddingRight: 48 }}
              />
              <span onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: 18, color: 'rgba(255,255,255,0.5)' }}>
                {showPass ? '🙈' : '👁'}
              </span>
            </div>
          </div>

          <button
            onClick={handleSignIn}
            disabled={loading}
            style={{ width: '100%', padding: '15px', background: loading ? 'rgba(255,255,255,0.1)' : `linear-gradient(135deg, ${MINT} 0%, #059669 100%)`, border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 800, color: loading ? 'rgba(255,255,255,0.4)' : '#fff', cursor: loading ? 'default' : 'pointer', fontFamily: FONT, boxShadow: loading ? 'none' : '0 4px 16px rgba(52,211,153,0.35)', marginTop: 4 }}
          >
            {loading ? t.signingIn : t.signIn}
          </button>

          <div style={{ textAlign: 'center', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{t.noAccount} </span>
            <span onClick={() => router.push(`/account?redirect=${redirect}`)} style={{ fontSize: 13, fontWeight: 700, color: MINT, cursor: 'pointer' }}>{t.signUp}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Auth() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#1C1A4F' }} />}>
      <AuthInner />
    </Suspense>
  )
}
