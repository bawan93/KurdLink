'use client'
export const dynamic = 'force-dynamic'
const HEADING = "'Plus Jakarta Sans', sans-serif"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../lib/supabase'

const CITIES = ['London','Birmingham','Manchester','Leeds','Sheffield','Glasgow','Bristol','Leicester','Nottingham','Liverpool','Newcastle','Cardiff','Edinburgh','Coventry','Bradford']

const CATEGORIES = ['Lawyers','Healthcare','Accountants','Driving Instructor','Translator','Immigration','Education','Housing','Travel Agent','Community']

const TX = {
  en: {
    dir: 'ltr',
    welcomeTo: 'Welcome to KurdLink',
    tagline: 'Your community. Connected.',
    chooseType: 'How would you like to join?',
    userType: "I'm looking for services",
    userDesc: 'Find trusted Kurdish professionals near you',
    bizType: 'I have a business',
    bizDesc: 'List your business and reach thousands of Kurdish customers',
    freeBadge: '🎉 First 100 businesses FREE',
    alreadyHave: 'Already have an account?',
    signIn: 'Sign In',
    back: '← Back',
    next: 'Continue →',
    finish: 'Create Account →',
    skip: 'Skip for now',
    // User flow
    createAccount: 'Create your account',
    fullName: 'Full Name',
    namePh: 'Your full name',
    email: 'Email Address',
    emailPh: 'you@example.com',
    password: 'Password',
    passPh: 'At least 8 characters',
    city: 'Your City',
    selectCity: 'Select your city…',
    // Biz flow
    bizDetails: 'Business details',
    bizName: 'Business Name',
    bizNamePh: 'e.g. Ahmad & Co Law',
    bizPhone: 'Phone Number',
    bizPhonePh: '+44 7700 900 000',
    bizWhatsapp: 'WhatsApp Number',
    bizAddress: 'Business Address',
    bizAddressPh: '47 Commercial Rd, London E1',
    bizDesc2: 'About Your Business',
    bizDescPh: 'Describe your services in 1-2 sentences…',
    category: 'Category',
    selectCat: 'Select category…',
    // Verify
    verifyBiz: 'Verify your business',
    verifyDesc: 'Upload a document to get your verified badge faster.',
    uploadLogo: 'Upload Logo',
    uploadLogoSub: 'PNG or JPG, tap to upload',
    uploadDoc: 'Verification Document',
    uploadDocSub: 'Company registration, professional licence, or proof of address',
    skipVerify: 'Skip for now (required within 7 days)',
    // Success
    allSet: "You're all set! 🎉",
    allSetDesc: 'Welcome to KurdLink. Start exploring trusted Kurdish professionals near you.',
    startExp: 'Start Exploring →',
    bizLive: 'Application submitted! 🚀',
    bizLiveDesc: 'Your business listing is under review. We\'ll notify you within 24 hours when it goes live.',
    viewHome: 'Go to Home →',
    // Errors
    fillAll: 'Please fill in all required fields',
    passShort: 'Password must be at least 8 characters',
    emailExists: 'This email is already registered. Please sign in.',
    genericErr: 'Something went wrong. Please try again.',
    creating: 'Creating account…',
    submitting: 'Submitting…',
    terms: 'By signing up you agree to our Terms & Privacy Policy',
  },
  ku: {
    dir: 'rtl',
    welcomeTo: 'بەخێربێیت بۆ KurdLink',
    tagline: 'کۆمەڵگاکەت. پەیوەندیکراو.',
    chooseType: 'چۆن دەتەوێت بەشداربیت؟',
    userType: 'دەمگەڕێم بۆ خزمەتگوزاری',
    userDesc: 'پیشەیە متمانەپێکراوی کوردی بدۆزەرەوە',
    bizType: 'کاروبارم هەیە',
    bizDesc: 'کاروبارەکەت تۆمار بکە و بگەنە هەزاران کڕیار',
    freeBadge: '🎉 ١٠٠ کاروباری یەکەم خۆڕایی',
    alreadyHave: 'حسابی هەیت؟',
    signIn: 'چوونەژوورەوە',
    back: '→ گەڕانەوە',
    next: '→ بەردەوامبە',
    finish: '→ دروستکردنی حساب',
    skip: 'ئێستا تێپەڕبوو',
    createAccount: 'حسابی خۆت دروست بکە',
    fullName: 'ناوی تەواو',
    namePh: 'ناوی تەواوت',
    email: 'ئیمەیڵ',
    emailPh: 'ئیمەیڵەکەت',
    password: 'وشەی نهێنی',
    passPh: 'لانیکەم ٨ پیت',
    city: 'شارەکەت',
    selectCity: 'شار هەڵبژێرە…',
    bizDetails: 'زانیاری کاروبار',
    bizName: 'ناوی کاروبار',
    bizNamePh: 'بۆ نموونە: ئەحمەد و هاوکارەکانی',
    bizPhone: 'ژمارەی تەلەفۆن',
    bizPhonePh: '+44 7700 900 000',
    bizWhatsapp: 'واتساپ',
    bizAddress: 'ناونیشانی کاروبار',
    bizAddressPh: 'ناونیشانی تەواو',
    bizDesc2: 'دەربارەی کاروبارەکەت',
    bizDescPh: 'خزمەتگوزارییەکانت وەسف بکە…',
    category: 'پۆل',
    selectCat: 'پۆل هەڵبژێرە…',
    verifyBiz: 'کاروبارەکەت دڵنیابکەرەوە',
    verifyDesc: 'بەڵگەیەک بار بکە بۆ وەرگرتنی نیشانەی دڵنیاکراوە.',
    uploadLogo: 'لۆگۆ بار بکە',
    uploadLogoSub: 'PNG یان JPG',
    uploadDoc: 'بەڵگەی دڵنیاکردنەوە',
    uploadDocSub: 'تۆمارکردنی کۆمپانیا، مۆڵەتی پیشەیی، یان سەلماندنی ناونیشان',
    skipVerify: 'ئێستا تێپەڕبوو (لەناو ٧ ڕۆژدا پێویستە)',
    allSet: '!هەموو شتێک ئامادەیە 🎉',
    allSetDesc: 'بەخێربێیت بۆ KurdLink.',
    startExp: '→ دەست بکە بە گەڕان',
    bizLive: '!داواکارییەکەت نێردرا 🚀',
    bizLiveDesc: 'لیستەی کاروبارەکەت لەژێر پێداچوونەوەدایە. لەناو ٢٤ کاتژمێردا ئاگادارت دەکەینەوە.',
    viewHome: '→ بڕۆ بۆ سەرەکی',
    fillAll: 'تکایە هەموو خانەکان پڕبکەرەوە',
    passShort: 'وشەی نهێنی دەبێت لانیکەم ٨ پیت بێت',
    emailExists: 'ئەم ئیمەیڵە پێشتر تۆمار کراوە.',
    genericErr: 'هەڵەیەک ڕووی دا. تکایە دووبارە هەوڵبدەرەوە.',
    creating: 'دروستکردنی حساب…',
    submitting: 'ناردن…',
    terms: 'بە تۆمارکردن ڕەزامەندیت لەسەر مەرج و مەزهەبەکانمان دەردەخەیت',
  },
  ar: {
    dir: 'rtl',
    welcomeTo: 'مرحباً بك في KurdLink',
    tagline: 'مجتمعك. متصل.',
    chooseType: 'كيف تريد الانضمام؟',
    userType: 'أبحث عن خدمات',
    userDesc: 'ابحث عن محترفين كرد موثوقين بالقرب منك',
    bizType: 'لديّ عمل تجاري',
    bizDesc: 'أدرج عملك وتواصل مع آلاف العملاء الكرد',
    freeBadge: '🎉 أول ١٠٠ شركة مجاناً',
    alreadyHave: 'لديك حساب؟',
    signIn: 'تسجيل الدخول',
    back: '→ رجوع',
    next: '→ متابعة',
    finish: '→ إنشاء الحساب',
    skip: 'تخطي الآن',
    createAccount: 'إنشاء حسابك',
    fullName: 'الاسم الكامل',
    namePh: 'اسمك الكامل',
    email: 'البريد الإلكتروني',
    emailPh: 'بريدك@example.com',
    password: 'كلمة المرور',
    passPh: '8 أحرف على الأقل',
    city: 'مدينتك',
    selectCity: 'اختر مدينتك…',
    bizDetails: 'تفاصيل العمل',
    bizName: 'اسم العمل',
    bizNamePh: 'مثال: أحمد ومشاركوه',
    bizPhone: 'رقم الهاتف',
    bizPhonePh: '+44 7700 900 000',
    bizWhatsapp: 'واتساب',
    bizAddress: 'عنوان العمل',
    bizAddressPh: 'العنوان الكامل',
    bizDesc2: 'نبذة عن عملك',
    bizDescPh: 'صف خدماتك في جملة أو جملتين…',
    category: 'الفئة',
    selectCat: 'اختر الفئة…',
    verifyBiz: 'تحقق من عملك',
    verifyDesc: 'ارفع مستنداً للحصول على شارة التحقق بشكل أسرع.',
    uploadLogo: 'رفع الشعار',
    uploadLogoSub: 'PNG أو JPG',
    uploadDoc: 'مستند التحقق',
    uploadDocSub: 'تسجيل الشركة، الرخصة المهنية، أو إثبات العنوان',
    skipVerify: 'تخطي الآن (مطلوب خلال ٧ أيام)',
    allSet: 'أنت جاهز! 🎉',
    allSetDesc: 'مرحباً بك في KurdLink.',
    startExp: '→ ابدأ الاستكشاف',
    bizLive: 'تم تقديم طلبك! 🚀',
    bizLiveDesc: 'قائمة عملك قيد المراجعة. سنخطرك خلال ٢٤ ساعة.',
    viewHome: '→ الذهاب إلى الرئيسية',
    fillAll: 'يرجى ملء جميع الحقول المطلوبة',
    passShort: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
    emailExists: 'هذا البريد الإلكتروني مسجل بالفعل.',
    genericErr: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
    creating: 'جارٍ إنشاء الحساب…',
    submitting: 'جارٍ الإرسال…',
    terms: 'بالتسجيل توافق على شروطنا وسياسة الخصوصية',
  }
}

export default function Onboarding() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const [flow, setFlow] = useState(null) // null | 'user' | 'biz'
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [logoPreview, setLogoPreview] = useState(null)

  // User form
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [city, setCity] = useState('')

  // Biz form
  const [bizName, setBizName] = useState('')
  const [bizCategory, setBizCategory] = useState('')
  const [bizPhone, setBizPhone] = useState('')
  const [bizWhatsapp, setBizWhatsapp] = useState('')
  const [bizAddress, setBizAddress] = useState('')
  const [bizDescription, setBizDescription] = useState('')

  const t = TX[lang]
  const isRtl = t.dir === 'rtl'
  const supabase = createClient()

  const inp = (value, onChange, placeholder, type = 'text', extraStyle = {}) => (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      type={type}
      style={{ width: '100%', padding: '13px 14px', border: '2px solid #F0F0F0', borderRadius: '12px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', background: '#fff', boxSizing: 'border-box', direction: type === 'email' || type === 'password' || type === 'tel' ? 'ltr' : t.dir, transition: 'border-color .2s', ...extraStyle }}
      onFocus={e => e.target.style.borderColor = '#FF6B35'}
      onBlur={e => e.target.style.borderColor = '#F0F0F0'}
      onKeyDown={e => e.key === 'Enter' && handleNext()}
    />
  )

  const label = (text) => (
    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1C1C1E', marginBottom: '6px' }}>{text}</label>
  )

  const field = (labelText, inputEl) => (
    <div style={{ marginBottom: '14px' }}>
      {label(labelText)}
      {inputEl}
    </div>
  )

  const handleNext = async () => {
    setError('')

    if (flow === 'user') {
      if (step === 1) {
        if (!name || !email || !password || !city) { setError(t.fillAll); return }
        if (password.length < 8) { setError(t.passShort); return }
        setLoading(true)
        try {
          const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: name, city, user_type: 'user' } }
          })
          if (signUpError) throw signUpError
          if (data?.user?.identities?.length === 0) {
            setError(t.emailExists); setLoading(false); return
          }
          setStep(2)
        } catch (err) {
          setError(err.message || t.genericErr)
        } finally {
          setLoading(false)
        }
      }
    }

    if (flow === 'biz') {
      if (step === 1) {
        if (!name || !email || !password) { setError(t.fillAll); return }
        if (password.length < 8) { setError(t.passShort); return }
        setStep(2)
      } else if (step === 2) {
        if (!bizName || !bizCategory || !bizPhone) { setError(t.fillAll); return }
        setStep(3)
      } else if (step === 3) {
        setLoading(true)
        try {
          const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: name, user_type: 'business' } }
          })
          if (signUpError) throw signUpError
          if (data?.user?.identities?.length === 0) {
            setError(t.emailExists); setLoading(false); return
          }
          if (data?.user) {
            await supabase.from('businesses').insert({
              name: bizName,
              category: bizCategory,
              phone: bizPhone,
              whatsapp: bizWhatsapp,
              address: bizAddress,
              description: bizDescription,
              city: city || 'London',
              owner_id: data.user.id,
              verified: false,
              status: 'pending',
            })
          }
          setStep(4)
        } catch (err) {
          setError(err.message || t.genericErr)
        } finally {
          setLoading(false)
        }
      }
    }
  }

  const prog = (current, total) => (
    <div style={{ display: 'flex', gap: '6px', marginBottom: '22px' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', background: i < current ? '#FF6B35' : '#F0F0F0', transition: 'background .3s' }} />
      ))}
    </div>
  )

  const backBtn = () => (
    <button onClick={() => { setError(''); step > 1 ? setStep(step - 1) : setFlow(null) }} style={{ background: 'none', border: 'none', color: '#FF6B35', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginBottom: '16px', padding: 0 }}>{t.back}</button>
  )

  const submitBtn = (label, isLast = false) => (
    <button onClick={handleNext} disabled={loading} style={{ width: '100%', padding: '14px', background: loading ? '#F0F0F0' : 'linear-gradient(135deg,#FF6B35,#FF8C61)', border: 'none', borderRadius: '13px', fontSize: '15px', fontWeight: 700, color: loading ? '#AEAEB2' : '#fff', cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit', boxShadow: loading ? 'none' : '0 4px 14px rgba(255,107,53,.3)', marginTop: '8px' }}>
      {loading ? (isLast ? t.submitting : t.creating) : label}
    </button>
  )

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', background: '#F5F5F7', fontFamily: isRtl ? "'Noto Sans Arabic', sans-serif" : "'DM Sans', sans-serif", direction: t.dir }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=DM+Sans:wght@400;500;600;700;800&family=Noto+Sans+Arabic:wght@400;600;700;800&display=swap" rel="stylesheet" />

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg,#1C1C2E,#2D1B4E)', padding: '40px 20px 70px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,107,53,.12)', filter: 'blur(40px)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,.1)', borderRadius: '50px', padding: '3px', gap: '2px' }}>
            {['en', 'ku', 'ar'].map(l => (
              <button key={l} onClick={() => setLang(l)} style={{ padding: '4px 9px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 700, fontFamily: 'inherit', background: lang === l ? '#FF6B35' : 'transparent', color: '#fff' }}>{l.toUpperCase()}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '14px', position: 'relative', zIndex: 1 }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '13px', background: 'linear-gradient(135deg,#FF6B35,#FF8C61)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(255,107,53,.4)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 4L11 12L5 20H9L15 12L9 4H5Z" fill="white" /><path d="M14 8L17 12L14 16H18L21 12L18 8H14Z" fill="white" opacity=".55" /></svg>
          </div>
          <span style={{ fontFamily: HEADING, fontSize: '24px', fontWeight: 800, color: '#fff' }}>Kurd<span style={{ color: '#FF6B35' }}>Link</span></span>
        </div>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,.6)', position: 'relative', zIndex: 1 }}>{t.tagline}</p>
      </div>

      {/* MAIN CARD */}
      <div style={{ background: '#fff', borderRadius: '22px', padding: '24px 20px', margin: '0 16px', marginTop: '-36px', position: 'relative', zIndex: 10, boxShadow: '0 8px 36px rgba(0,0,0,.1)', marginBottom: '20px' }}>

        {/* ── LANDING ── */}
        {flow === null && (
          <>
            <h2 style={{ fontFamily: HEADING, fontSize: '20px', fontWeight: 800, color: '#1C1C1E', marginBottom: '6px', textAlign: 'center' }}>{t.welcomeTo}</h2>
            <p style={{ fontSize: '13px', color: '#8E8E93', textAlign: 'center', marginBottom: '20px' }}>{t.chooseType}</p>

            {/* User option */}
            <div onClick={() => { setFlow('user'); setStep(1) }} style={{ border: '2px solid #F0F0F0', borderRadius: '16px', padding: '16px', cursor: 'pointer', marginBottom: '10px', transition: 'all .2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#FF6B35'} onMouseLeave={e => e.currentTarget.style.borderColor = '#F0F0F0'}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '13px', background: '#FFF0EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>👤</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: HEADING, fontWeight: 700, fontSize: '14px', color: '#1C1C1E', marginBottom: '2px' }}>{t.userType}</div>
                  <div style={{ fontSize: '12px', color: '#8E8E93' }}>{t.userDesc}</div>
                </div>
                <span style={{ color: '#AEAEB2', fontSize: '18px' }}>{isRtl ? '‹' : '›'}</span>
              </div>
            </div>

            {/* Biz option */}
            <div onClick={() => { setFlow('biz'); setStep(1) }} style={{ border: '2px solid #F0F0F0', borderRadius: '16px', padding: '16px', cursor: 'pointer', marginBottom: '16px', transition: 'all .2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#FF6B35'} onMouseLeave={e => e.currentTarget.style.borderColor = '#F0F0F0'}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '13px', background: '#FFF0EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>🏢</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: HEADING, fontWeight: 700, fontSize: '14px', color: '#1C1C1E', marginBottom: '2px' }}>{t.bizType}</div>
                  <div style={{ fontSize: '12px', color: '#8E8E93' }}>{t.bizDesc}</div>
                </div>
                <span style={{ color: '#AEAEB2', fontSize: '18px' }}>{isRtl ? '‹' : '›'}</span>
              </div>
              <div style={{ marginTop: '10px', background: 'linear-gradient(135deg,#FF6B35,#FF8C61)', borderRadius: '8px', padding: '5px 12px', fontSize: '11px', fontWeight: 700, color: '#fff', display: 'inline-block' }}>{t.freeBadge}</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ flex: 1, height: '1px', background: '#F0F0F0' }} />
              <span style={{ fontSize: '12px', color: '#AEAEB2' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: '#F0F0F0' }} />
            </div>

            <p style={{ textAlign: 'center', fontSize: '13px', color: '#8E8E93' }}>
              {t.alreadyHave}{' '}
              <span onClick={() => router.push('/auth')} style={{ color: '#FF6B35', fontWeight: 700, cursor: 'pointer' }}>{t.signIn}</span>
            </p>
          </>
        )}

        {/* ── USER FLOW ── */}
        {flow === 'user' && step === 1 && (
          <>
            {backBtn()}
            {prog(1, 1)}
            <h2 style={{ fontFamily: HEADING, fontSize: '20px', fontWeight: 800, color: '#1C1C1E', marginBottom: '18px' }}>{t.createAccount}</h2>
            {error && <div style={{ background: '#FEE2E2', border: '1px solid #EF4444', borderRadius: '12px', padding: '11px 14px', marginBottom: '14px', fontSize: '13px', fontWeight: 600, color: '#EF4444' }}>{error}</div>}
            {field(t.fullName, inp(name, setName, t.namePh))}
            {field(t.email, inp(email, setEmail, t.emailPh, 'email'))}
            <div style={{ marginBottom: '14px' }}>
              {label(t.password)}
              <div style={{ position: 'relative' }}>
                {inp(password, setPassword, t.passPh, showPass ? 'text' : 'password', { paddingRight: '44px' })}
                <span onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '16px', color: '#AEAEB2' }}>{showPass ? '🙈' : '👁'}</span>
              </div>
            </div>
            <div style={{ marginBottom: '18px' }}>
              {label(t.city)}
              <select value={city} onChange={e => setCity(e.target.value)} style={{ width: '100%', padding: '13px 14px', border: '2px solid #F0F0F0', borderRadius: '12px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', background: '#fff', boxSizing: 'border-box', cursor: 'pointer', transition: 'border-color .2s' }} onFocus={e => e.target.style.borderColor = '#FF6B35'} onBlur={e => e.target.style.borderColor = '#F0F0F0'}>
                <option value="">{t.selectCity}</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {submitBtn(t.finish, true)}
            <p style={{ fontSize: '11px', color: '#AEAEB2', textAlign: 'center', lineHeight: 1.6, marginTop: '12px' }}>{t.terms}</p>
          </>
        )}

        {flow === 'user' && step === 2 && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ width: '68px', height: '68px', borderRadius: '20px', background: 'linear-gradient(135deg,#FF6B35,#FF8C61)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', margin: '0 auto 16px', boxShadow: '0 8px 26px rgba(255,107,53,.3)' }}>🎉</div>
            <h2 style={{ fontFamily: HEADING, fontSize: '22px', fontWeight: 800, color: '#1C1C1E', marginBottom: '8px' }}>{t.allSet}</h2>
            <p style={{ fontSize: '13px', color: '#8E8E93', lineHeight: 1.7, marginBottom: '22px' }}>{t.allSetDesc}</p>
            <button onClick={() => router.push('/')} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#FF6B35,#FF8C61)', border: 'none', borderRadius: '13px', fontSize: '15px', fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(255,107,53,.3)' }}>{t.startExp}</button>
          </div>
        )}

        {/* ── BIZ FLOW ── */}
        {flow === 'biz' && step === 1 && (
          <>
            {backBtn()}
            {prog(1, 3)}
            <div style={{ background: '#FFF0EB', border: '1px solid rgba(255,107,53,.2)', borderRadius: '10px', padding: '8px 14px', marginBottom: '16px', fontSize: '12px', fontWeight: 700, color: '#FF6B35' }}>{t.freeBadge}</div>
            <h2 style={{ fontFamily: HEADING, fontSize: '20px', fontWeight: 800, color: '#1C1C1E', marginBottom: '18px' }}>{t.createAccount}</h2>
            {error && <div style={{ background: '#FEE2E2', border: '1px solid #EF4444', borderRadius: '12px', padding: '11px 14px', marginBottom: '14px', fontSize: '13px', fontWeight: 600, color: '#EF4444' }}>{error}</div>}
            {field(t.fullName, inp(name, setName, t.namePh))}
            {field(t.email, inp(email, setEmail, t.emailPh, 'email'))}
            <div style={{ marginBottom: '18px' }}>
              {label(t.password)}
              <div style={{ position: 'relative' }}>
                {inp(password, setPassword, t.passPh, showPass ? 'text' : 'password', { paddingRight: '44px' })}
                <span onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '16px', color: '#AEAEB2' }}>{showPass ? '🙈' : '👁'}</span>
              </div>
            </div>
            {submitBtn(t.next)}
          </>
        )}

        {flow === 'biz' && step === 2 && (
          <>
            {backBtn()}
            {prog(2, 3)}
            <h2 style={{ fontFamily: HEADING, fontSize: '20px', fontWeight: 800, color: '#1C1C1E', marginBottom: '18px' }}>{t.bizDetails}</h2>
            {error && <div style={{ background: '#FEE2E2', border: '1px solid #EF4444', borderRadius: '12px', padding: '11px 14px', marginBottom: '14px', fontSize: '13px', fontWeight: 600, color: '#EF4444' }}>{error}</div>}
            {field(t.bizName, inp(bizName, setBizName, t.bizNamePh))}
            <div style={{ marginBottom: '14px' }}>
              {label(t.category)}
              <select value={bizCategory} onChange={e => setBizCategory(e.target.value)} style={{ width: '100%', padding: '13px 14px', border: '2px solid #F0F0F0', borderRadius: '12px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', background: '#fff', boxSizing: 'border-box', cursor: 'pointer' }} onFocus={e => e.target.style.borderColor = '#FF6B35'} onBlur={e => e.target.style.borderColor = '#F0F0F0'}>
                <option value="">{t.selectCat}</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {field(t.bizPhone, inp(bizPhone, setBizPhone, t.bizPhonePh, 'tel'))}
            {field(t.bizWhatsapp, inp(bizWhatsapp, setBizWhatsapp, t.bizPhonePh, 'tel'))}
            <div style={{ marginBottom: '14px' }}>
              {label(t.city)}
              <select value={city} onChange={e => setCity(e.target.value)} style={{ width: '100%', padding: '13px 14px', border: '2px solid #F0F0F0', borderRadius: '12px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', background: '#fff', boxSizing: 'border-box', cursor: 'pointer' }} onFocus={e => e.target.style.borderColor = '#FF6B35'} onBlur={e => e.target.style.borderColor = '#F0F0F0'}>
                <option value="">{t.selectCity}</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {field(t.bizAddress, inp(bizAddress, setBizAddress, t.bizAddressPh))}
            {field(t.bizDesc2, inp(bizDescription, setBizDescription, t.bizDescPh))}
            {submitBtn(t.next)}
          </>
        )}

        {flow === 'biz' && step === 3 && (
          <>
            {backBtn()}
            {prog(3, 3)}
            <h2 style={{ fontFamily: HEADING, fontSize: '20px', fontWeight: 800, color: '#1C1C1E', marginBottom: '6px' }}>{t.verifyBiz}</h2>
            <p style={{ fontSize: '13px', color: '#8E8E93', marginBottom: '18px' }}>{t.verifyDesc}</p>
            {error && <div style={{ background: '#FEE2E2', border: '1px solid #EF4444', borderRadius: '12px', padding: '11px 14px', marginBottom: '14px', fontSize: '13px', fontWeight: 600, color: '#EF4444' }}>{error}</div>}

            {/* Logo upload */}
            <div style={{ marginBottom: '14px' }}>
              {label(t.uploadLogo)}
              <label htmlFor="logo-upload" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #E0E0E0', borderRadius: '13px', padding: '18px', cursor: 'pointer', background: '#FAFAFA', transition: 'border-color .2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#FF6B35'} onMouseLeave={e => e.currentTarget.style.borderColor = '#E0E0E0'}>
                {logoPreview ? <img src={logoPreview} alt="Logo" style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }} /> : <div style={{ fontSize: '28px', marginBottom: '6px' }}>🏢</div>}
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#636366', marginTop: '4px' }}>{t.uploadLogo}</span>
                <span style={{ fontSize: '11px', color: '#AEAEB2' }}>{t.uploadLogoSub}</span>
                <input id="logo-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = ev => setLogoPreview(ev.target.result); r.readAsDataURL(f) } }} />
              </label>
            </div>

            {/* Doc upload */}
            <div style={{ marginBottom: '18px' }}>
              {label(t.uploadDoc)}
              <label htmlFor="doc-upload" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #E0E0E0', borderRadius: '13px', padding: '18px', cursor: 'pointer', background: '#FAFAFA', transition: 'border-color .2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#FF6B35'} onMouseLeave={e => e.currentTarget.style.borderColor = '#E0E0E0'}>
                <div style={{ fontSize: '28px', marginBottom: '6px' }}>📄</div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#636366' }}>{t.uploadDoc}</span>
                <span style={{ fontSize: '11px', color: '#AEAEB2', textAlign: 'center', marginTop: '4px' }}>{t.uploadDocSub}</span>
                <input id="doc-upload" type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }} />
              </label>
            </div>

            {submitBtn(t.finish, true)}
            <button onClick={handleNext} style={{ width: '100%', marginTop: '10px', padding: '11px', background: 'none', border: 'none', fontSize: '13px', color: '#AEAEB2', cursor: 'pointer', fontFamily: 'inherit' }}>{t.skipVerify}</button>
          </>
        )}

        {flow === 'biz' && step === 4 && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ width: '68px', height: '68px', borderRadius: '20px', background: 'linear-gradient(135deg,#1C1C2E,#2D1B4E)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', margin: '0 auto 16px' }}>🚀</div>
            <h2 style={{ fontFamily: HEADING, fontSize: '22px', fontWeight: 800, color: '#1C1C1E', marginBottom: '8px' }}>{t.bizLive}</h2>
            <p style={{ fontSize: '13px', color: '#8E8E93', lineHeight: 1.7, marginBottom: '22px' }}>{t.bizLiveDesc}</p>
            <div style={{ background: '#F5F5F7', borderRadius: '14px', padding: '14px', marginBottom: '20px', textAlign: isRtl ? 'right' : 'left' }}>
              <div style={{ fontFamily: HEADING, fontSize: '14px', fontWeight: 700, color: '#1C1C1E', marginBottom: '3px' }}>{bizName}</div>
              <div style={{ fontSize: '12px', color: '#8E8E93' }}>{bizCategory} • {city}</div>
            </div>
            <button onClick={() => router.push('/')} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#FF6B35,#FF8C61)', border: 'none', borderRadius: '13px', fontSize: '15px', fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(255,107,53,.3)' }}>{t.viewHome}</button>
          </div>
        )}
      </div>
    </div>
  )
}