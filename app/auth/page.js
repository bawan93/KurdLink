'use client'
const HEADING = "'Plus Jakarta Sans', sans-serif"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../lib/supabase'

const TX = {
  en: { dir: 'ltr', welcome: 'Welcome to KurdLink', tagline: 'Your community. Connected.', signIn: 'Sign In', signUp: 'Create Account', email: 'Email Address', password: 'Password', fullName: 'Full Name', namePh: 'Your full name', emailPh: 'you@example.com', passPh: 'At least 8 characters', signingIn: 'Signing in…', signingUp: 'Creating account…', noAccount: "Don't have an account?", hasAccount: 'Already have an account?', orWith: 'or continue with', forgotPass: 'Forgot password?', terms: 'By signing up you agree to our Terms & Privacy Policy', emailSent: '✓ Check your email to confirm your account', back: '← Back' },
  ku: { dir: 'rtl', welcome: 'بەخێربێیت بۆ KurdLink', tagline: 'کۆمەڵگاکەت. پەیوەندیکراو.', signIn: 'چوونەژوورەوە', signUp: 'دروستکردنی حساب', email: 'ئیمەیڵ', password: 'وشەی نهێنی', fullName: 'ناوی تەواو', namePh: 'ناوی تەواوت', emailPh: 'ئیمەیڵەکەت', passPh: 'لانیکەم ٨ پیت', signingIn: 'چوونەژوورەوە…', signingUp: 'دروستکردنی حساب…', noAccount: 'حسابت نییە؟', hasAccount: 'حسابی هەیت؟', orWith: 'یان بەردەوام بە', forgotPass: 'وشەی نهێنیت لەبیرچووە؟', terms: 'بە تۆمارکردن ڕەزامەندیت لەسەر مەرج و مەزهەبەکانمان دەردەخەیت', emailSent: '✓ ئیمەیڵەکەت بپشکنە بۆ دڵنیاکردنەوەی حسابەکەت', back: '→ گەڕانەوە' },
  ar: { dir: 'rtl', welcome: 'مرحباً بك في KurdLink', tagline: 'مجتمعك. متصل.', signIn: 'تسجيل الدخول', signUp: 'إنشاء حساب', email: 'البريد الإلكتروني', password: 'كلمة المرور', fullName: 'الاسم الكامل', namePh: 'اسمك الكامل', emailPh: 'بريدك@example.com', passPh: '8 أحرف على الأقل', signingIn: 'جارٍ الدخول…', signingUp: 'جارٍ إنشاء الحساب…', noAccount: 'ليس لديك حساب؟', hasAccount: 'لديك حساب بالفعل؟', orWith: 'أو تابع باستخدام', forgotPass: 'نسيت كلمة المرور؟', terms: 'بالتسجيل توافق على شروطنا وسياسة الخصوصية', emailSent: '✓ تحقق من بريدك الإلكتروني لتأكيد حسابك', back: '→ رجوع' },
}

export default function Auth() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const [mode, setMode] = useState('signin') // signin | signup
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const t = TX[lang]
  const isRtl = t.dir === 'rtl'
  const supabase = createClient()

  const handleSubmit = async () => {
    setError('')
    setSuccess('')
    if (!email || !password) { setError('Please fill in all fields'); return }
    if (mode === 'signup' && !name) { setError('Please enter your full name'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true)

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } }
        })
        if (signUpError) throw signUpError
        if (data?.user?.identities?.length === 0) {
          setError('This email is already registered. Please sign in.')
        } else {
          setSuccess(t.emailSent)
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) throw signInError
        router.push('/')
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', background: '#F5F5F7', fontFamily: isRtl ? "'Noto Sans Arabic', sans-serif" : "'DM Sans', sans-serif", direction: t.dir }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=DM+Sans:wght@400;500;600;700;800&family=Noto+Sans+Arabic:wght@400;600;700;800&display=swap" rel="stylesheet" />

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg,#1C1C2E,#2D1B4E)', padding: '48px 24px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,107,53,.12)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(78,205,196,.08)', filter: 'blur(35px)', pointerEvents: 'none' }} />

        {/* Lang toggle */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,.1)', borderRadius: '50px', padding: '3px', gap: '2px' }}>
            {['en', 'ku', 'ar'].map(l => (
              <button key={l} onClick={() => setLang(l)} style={{ padding: '4px 9px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 700, fontFamily: 'inherit', background: lang === l ? '#FF6B35' : 'transparent', color: '#fff' }}>{l.toUpperCase()}</button>
            ))}
          </div>
        </div>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg,#FF6B35,#FF8C61)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(255,107,53,.4)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 4L11 12L5 20H9L15 12L9 4H5Z" fill="white" /><path d="M14 8L17 12L14 16H18L21 12L18 8H14Z" fill="white" opacity=".55" /></svg>
          </div>
          <span style={{ fontFamily: HEADING, fontSize: '26px', fontWeight: 800, color: '#fff' }}>Kurd<span style={{ color: '#FF6B35' }}>Link</span></span>
        </div>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,.6)', position: 'relative', zIndex: 1 }}>{t.tagline}</p>
      </div>

      {/* CARD */}
      <div style={{ background: '#fff', borderRadius: '22px', padding: '28px 22px', margin: '0 16px', marginTop: '-40px', position: 'relative', zIndex: 10, boxShadow: '0 8px 36px rgba(0,0,0,.1)' }}>

        {/* Mode tabs */}
        <div style={{ display: 'flex', background: '#F5F5F7', borderRadius: '13px', padding: '4px', marginBottom: '24px' }}>
          {[['signin', t.signIn], ['signup', t.signUp]].map(([m, label]) => (
            <button key={m} onClick={() => { setMode(m); setError(''); setSuccess('') }} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', fontWeight: 700, background: mode === m ? '#fff' : 'transparent', color: mode === m ? '#1C1C1E' : '#8E8E93', boxShadow: mode === m ? '0 2px 8px rgba(0,0,0,.08)' : 'none', transition: 'all .2s' }}>{label}</button>
          ))}
        </div>

        {/* Success message */}
        {success && (
          <div style={{ background: '#E6F9F5', border: '1px solid #1DB87A', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', fontWeight: 600, color: '#1DB87A' }}>{success}</div>
        )}

        {/* Error message */}
        {error && (
          <div style={{ background: '#FEE2E2', border: '1px solid #EF4444', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', fontWeight: 600, color: '#EF4444' }}>{error}</div>
        )}

        {/* Name field (signup only) */}
        {mode === 'signup' && (
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1C1C1E', marginBottom: '6px' }}>{t.fullName}</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder={t.namePh} type="text" style={{ width: '100%', padding: '13px 14px', border: '2px solid #F0F0F0', borderRadius: '12px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', background: '#fff', boxSizing: 'border-box', direction: t.dir, transition: 'border-color .2s' }} onFocus={e => e.target.style.borderColor='#FF6B35'} onBlur={e => e.target.style.borderColor='#F0F0F0'} />
          </div>
        )}

        {/* Email */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1C1C1E', marginBottom: '6px' }}>{t.email}</label>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder={t.emailPh} type="email" style={{ width: '100%', padding: '13px 14px', border: '2px solid #F0F0F0', borderRadius: '12px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', background: '#fff', boxSizing: 'border-box', direction: 'ltr', transition: 'border-color .2s' }} onFocus={e => e.target.style.borderColor='#FF6B35'} onBlur={e => e.target.style.borderColor='#F0F0F0'} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>

        {/* Password */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#1C1C1E' }}>{t.password}</label>
            {mode === 'signin' && <span style={{ fontSize: '12px', color: '#FF6B35', cursor: 'pointer', fontWeight: 600 }}>{t.forgotPass}</span>}
          </div>
          <div style={{ position: 'relative' }}>
            <input value={password} onChange={e => setPassword(e.target.value)} placeholder={t.passPh} type={showPass ? 'text' : 'password'} style={{ width: '100%', padding: '13px 44px 13px 14px', border: '2px solid #F0F0F0', borderRadius: '12px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', background: '#fff', boxSizing: 'border-box', direction: 'ltr', transition: 'border-color .2s' }} onFocus={e => e.target.style.borderColor='#FF6B35'} onBlur={e => e.target.style.borderColor='#F0F0F0'} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            <span onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '16px', color: '#AEAEB2' }}>{showPass ? '🙈' : '👁'}</span>
          </div>
        </div>

        {/* Submit button */}
        <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '14px', background: loading ? '#F0F0F0' : 'linear-gradient(135deg,#FF6B35,#FF8C61)', border: 'none', borderRadius: '13px', fontSize: '15px', fontWeight: 700, color: loading ? '#AEAEB2' : '#fff', cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit', boxShadow: loading ? 'none' : '0 4px 14px rgba(255,107,53,.3)', transition: 'all .2s', marginBottom: '16px' }}>
          {loading ? (mode === 'signup' ? t.signingUp : t.signingIn) : (mode === 'signup' ? t.signUp : t.signIn)}
        </button>

        {/* Switch mode */}
        <p style={{ textAlign: 'center', fontSize: '13px', color: '#8E8E93', marginBottom: '16px' }}>
          {mode === 'signin' ? t.noAccount : t.hasAccount}{' '}
          <span onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setSuccess('') }} style={{ color: '#FF6B35', fontWeight: 700, cursor: 'pointer' }}>{mode === 'signin' ? t.signUp : t.signIn}</span>
        </p>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ flex: 1, height: '1px', background: '#F0F0F0' }} />
          <span style={{ fontSize: '12px', color: '#AEAEB2' }}>{t.orWith}</span>
          <div style={{ flex: 1, height: '1px', background: '#F0F0F0' }} />
        </div>

        {/* Social buttons */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: mode === 'signup' ? '16px' : '0' }}>
          <button style={{ flex: 1, padding: '12px', border: '2px solid #F0F0F0', borderRadius: '12px', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', fontWeight: 600, color: '#1C1C1E', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>🇬 Google</button>
          <button style={{ flex: 1, padding: '12px', border: '2px solid #F0F0F0', borderRadius: '12px', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', fontWeight: 600, color: '#1C1C1E', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>🍎 Apple</button>
        </div>

        {/* Terms */}
        {mode === 'signup' && (
          <p style={{ fontSize: '11px', color: '#AEAEB2', textAlign: 'center', lineHeight: 1.6, marginTop: '16px' }}>{t.terms}</p>
        )}
      </div>

      {/* Back to home */}
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', color: '#FF6B35', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{t.back}</button>
      </div>
    </div>
  )
}