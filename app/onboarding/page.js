'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/app/lib/supabase'

const FONT = "'Nunito', sans-serif"
const INDIGO = '#4F46E5'
const INDIGO_DARK = '#1C1A4F'
const INDIGO_LIGHT = '#818CF8'
const MINT = '#34D399'
const CITIES = ['London','Birmingham','Manchester','Leeds','Sheffield','Glasgow','Bristol','Leicester','Nottingham','Liverpool','Newcastle','Cardiff','Edinburgh','Coventry','Bradford']

function OnboardingInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/home'
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

  const isRtl = lang === 'ku' || lang === 'fa' || lang === 'ar'
  const T = {
    en: { welcome: 'Create your account', tagline: 'Join thousands of Kurds across the UK', fullName: 'Full Name', namePh: 'Your full name', email: 'Email Address', emailPh: 'you@example.com', password: 'Password', passPh: 'At least 8 characters', city: 'Your City', selectCity: 'Select your city…', createBtn: 'Create Account', creating: 'Creating…', hasAccount: 'Already have an account?', signIn: 'Sign In', terms: 'By creating an account you agree to our Terms & Privacy Policy', success: '🎉 Account created! Redirecting…', errName: 'Please enter your full name', errEmail: 'Please enter your email', errPass: 'Password must be at least 8 characters', errCity: 'Please select your city' },
    ku: { welcome: 'ئەکاونتەکەت دروست بکە', tagline: 'بەشداری هەزاران کورد لە UK بکە', fullName: 'ناوی تەواو', namePh: 'ناوی تەواوت', email: 'ئیمەیڵ', emailPh: 'ئیمەیڵەکەت', password: 'وشەی نهێنی', passPh: 'لانیکەم ٨ پیت', city: 'شارەکەت', selectCity: 'شارەکەت هەڵبژێرە…', createBtn: 'دروستکردنی ئەکاونت', creating: 'چاوەڕوانبە…', hasAccount: 'ئەکاونتی هەیت؟', signIn: 'چوونەژوورەوە', terms: 'بە دروستکردنی ئەکاونت ڕەزامەندیت لەسەر مەرجەکانمان دەردەخەیت', success: '🎉 ئەکاونت دروستکرا!', errName: 'تکایە ناوت بنووسە', errEmail: 'تکایە ئیمەیڵەکەت بنووسە', errPass: 'وشەی نهێنی دەبێت لانیکەم ٨ پیت بێت', errCity: 'تکایە شارەکەت هەڵبژێرە' },
    fa: { welcome: 'حساب کاربری بساز', tagline: 'به هزاران کرد در سراسر بریتانیا بپیوند', fullName: 'نام کامل', namePh: 'نام کاملت', email: 'ایمیل', emailPh: 'ایمیل شما', password: 'رمز عبور', passPh: 'حداقل ۸ کاراکتر', city: 'شهرت', selectCity: 'شهرت را انتخاب کن…', createBtn: 'ایجاد حساب', creating: 'در حال ایجاد…', hasAccount: 'حساب داری؟', signIn: 'ورود', terms: 'با ایجاد حساب موافقت خود را با شرایط ما اعلام می‌کنی', success: '🎉 حساب ایجاد شد!', errName: 'لطفاً نامت را وارد کن', errEmail: 'لطفاً ایمیلت را وارد کن', errPass: 'رمز عبور باید حداقل ۸ کاراکتر باشد', errCity: 'لطفاً شهرت را انتخاب کن' },
    ar: { welcome: 'أنشئ حسابك', tagline: 'انضم إلى آلاف الأكراد في جميع أنحاء المملكة المتحدة', fullName: 'الاسم الكامل', namePh: 'اسمك الكامل', email: 'البريد الإلكتروني', emailPh: 'بريدك الإلكتروني', password: 'كلمة المرور', passPh: '٨ أحرف على الأقل', city: 'مدينتك', selectCity: 'اختر مدينتك…', createBtn: 'إنشاء حساب', creating: 'جارٍ الإنشاء…', hasAccount: 'لديك حساب؟', signIn: 'تسجيل الدخول', terms: 'بإنشاء حساب فأنت توافق على شروطنا وسياسة الخصوصية', success: '🎉 تم إنشاء الحساب!', errName: 'يرجى إدخال اسمك', errEmail: 'يرجى إدخال بريدك الإلكتروني', errPass: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل', errCity: 'يرجى اختيار مدينتك' },
  }
  const t = T[lang] || T.en

  const LANGS = [
    { id: 'en', label: 'EN' },
    { id: 'ku', label: 'KU' },
    { id: 'fa', label: 'FA' },
    { id: 'ar', label: 'AR' },
  ]

  const handleSignUp = async () => {
    setError('')
    if (!name.trim()) return setError(t.errName)
    if (!email.trim()) return setError(t.errEmail)
    if (password.length < 8) return setError(t.errPass)
    if (!city) return setError(t.errCity)
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error: e } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name, city } } })
      if (e) throw e
      if (data?.user?.identities?.length === 0) setError('This email is already registered. Please sign in.')
      else { setSuccess(t.success); setTimeout(() => router.push(redirect), 1500) }
    } catch (err) { setError(err.message || 'Something went wrong.') }
    finally { setLoading(false) }
  }

  const inp = (f) => ({
    width: '100%', padding: '14px 16px',
    border: `2px solid ${focus === f ? INDIGO : 'rgba(255,255,255,0.15)'}`,
    borderRadius: 14, fontSize: 15, fontFamily: FONT, outline: 'none',
    background: 'rgba(255,255,255,0.07)', color: '#fff', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
    direction: f === 'email' || f === 'password' ? 'ltr' : isRtl ? 'rtl' : 'ltr',
  })

  const labelStyle = { display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: 6 }

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(160deg, ${INDIGO_DARK} 0%, #2d2b6b 60%, #3730a3 100%)`, fontFamily: FONT, direction: isRtl ? 'rtl' : 'ltr', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, zIndex: 10, backdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', margin: '0 0 8px', lineHeight: 1.2 }}>{t.welcome}</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: 0 }}>{t.tagline}</p>
        </div>

        <form onSubmit={e => { e.preventDefault(); handleSignUp() }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && <div style={{ background: 'rgba(239,68,68,0.15)', border: '1.5px solid rgba(239,68,68,0.5)', borderRadius: 12, padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#FCA5A5' }}>{error}</div>}
          {success && <div style={{ background: 'rgba(29,184,122,0.15)', border: '1.5px solid rgba(29,184,122,0.5)', borderRadius: 12, padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#6EE7B7' }}>{success}</div>}

          <div>
            <label style={labelStyle}>{t.fullName}</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={t.namePh} onFocus={() => setFocus('name')} onBlur={() => setFocus(null)} style={inp('name')} />
          </div>
          <div>
            <label style={labelStyle}>{t.email}</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t.emailPh} onFocus={() => setFocus('email')} onBlur={() => setFocus(null)} style={inp('email')} />
          </div>
          <div>
            <label style={labelStyle}>{t.password}</label>
            <div style={{ position: 'relative' }}>
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder={t.passPh} onFocus={() => setFocus('password')} onBlur={() => setFocus(null)} style={{ ...inp('password'), paddingRight: 48 }} />
              <span onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: 18, color: 'rgba(255,255,255,0.5)' }}>{showPass ? '🙈' : '👁'}</span>
            </div>
          </div>
          <div>
            <label style={labelStyle}>{t.city}</label>
            <select value={city} onChange={e => setCity(e.target.value)} onFocus={() => setFocus('city')} onBlur={() => setFocus(null)} style={{ ...inp('city'), appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer' }}>
              <option value="" style={{ background: INDIGO_DARK }}>{t.selectCity}</option>
              {CITIES.map(c => <option key={c} value={c} style={{ background: INDIGO_DARK }}>{c}</option>)}
            </select>
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '15px', background: loading ? 'rgba(255,255,255,0.1)' : `linear-gradient(135deg, ${MINT} 0%, #059669 100%)`, border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 800, color: loading ? 'rgba(255,255,255,0.4)' : '#fff', cursor: loading ? 'default' : 'pointer', fontFamily: FONT, boxShadow: loading ? 'none' : '0 4px 16px rgba(52,211,153,0.35)', marginTop: 4 }}>
            {loading ? t.creating : t.createBtn}
          </button>

          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', margin: 0, lineHeight: 1.6 }}>{t.terms}</p>

          <div style={{ textAlign: 'center', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{t.hasAccount} </span>
            <span onClick={() => router.push(`/auth?redirect=${redirect}`)} style={{ fontSize: 13, fontWeight: 700, color: MINT, cursor: 'pointer' }}>{t.signIn}</span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Onboarding() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#1C1A4F' }} />}>
      <OnboardingInner />
    </Suspense>
  )
}
