'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import LangDropdown from '../../../components/LangDropdown'

const FONT = "'Plus Jakarta Sans', 'Sora', sans-serif"
const ORANGE = 'linear-gradient(135deg, #FF6B35, #FF8C61)'
const NAVY = '#1A2B5F'

function getSupabase() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

const JOB_TYPES = {
  en: ['Full-Time', 'Part-Time', 'Temporary', 'Weekend Only', 'Flexible'],
  ku: ['کاتی تەواو', 'نیوەکاتی', 'کاتی', 'ئەندێنە تەنها', 'نەرم'],
  fa: ['تمام‌وقت', 'پاره‌وقت', 'موقت', 'آخر هفته', 'انعطاف‌پذیر'],
  ar: ['دوام كامل', 'دوام جزئي', 'مؤقت', 'عطلة نهاية الأسبوع', 'مرن'],
}

const TX = {
  en: { title: 'Hire Staff', subtitle: "Post a job vacancy and we'll review within 24 hours", companyName: 'Company / Business Name', companyNamePh: 'e.g. Hassan Takeaway', jobTitle: 'Job Title', jobTitlePh: 'e.g. Chef, Driver, Cashier', jobType: 'Job Type', selectType: 'Select job type…', salary: 'Salary / Pay Rate', salaryPh: 'e.g. £12/hr or £24,000/year', city: 'City', cityPh: 'e.g. Birmingham', postcode: 'Postcode', postcodePh: 'e.g. B1 1AA', description: 'Job Description', descriptionPh: 'Describe the role, responsibilities, requirements…', phone: 'Phone Number', phonePh: '+44 7700 900000', submit: 'Submit for Review', submitting: 'Submitting…', back: '← Back', successTitle: 'Job Posted! 🎉', successMsg: 'Your job listing is under review. Track its status in your Account page.', backHome: 'View My Listings', errFill: 'Please fill in all required fields' },
  ku: { title: 'کرێکار بگرە', subtitle: 'شوێنی کارێکی بەتاڵ بڵاو بکەرەوە، ئێمەش لە ٢٤ کاتژمێردا پێداچوونەوەی دەکەین', companyName: 'ناوی کۆمپانیا / بیزنس', companyNamePh: 'وەک: رستەرانی حەسەن', jobTitle: 'ناوی کار', jobTitlePh: 'وەک: ئاشپەز، شۆفێر', jobType: 'جۆری کار', selectType: 'جۆری کار هەڵبژێرە…', salary: 'مووچە / کرێ', salaryPh: 'وەک: £12 کاتژمێر', city: 'شار', cityPh: 'وەک: بیرمینگەم', postcode: 'پۆستکۆد', postcodePh: 'وەک: B1 1AA', description: 'وەسفی کار', descriptionPh: 'کارەکە وەسف بکە…', phone: 'ژمارەی تەلەفۆن', phonePh: '+44 7700 900000', submit: 'بنێرە بۆ پێداچوونەوە', submitting: 'دەنێردرێت…', back: '→ گەڕانەوە', successTitle: '!کارەکە بڵاو کرایەوە 🎉', successMsg: 'داواکاریەکەت تەماشا دەکرێت.', backHome: 'لیستەکانم ببینە', errFill: 'تکایە هەموو خانەکان پڕ بکەوە' },
  fa: { title: 'استخدام کارمند', subtitle: 'آگهی شغلی منتشر کن، ما ظرف ۲۴ ساعت بررسی می‌کنیم', companyName: 'نام شرکت / کسب‌وکار', companyNamePh: 'مثلاً رستوران حسن', jobTitle: 'عنوان شغل', jobTitlePh: 'مثلاً آشپز، راننده', jobType: 'نوع شغل', selectType: 'نوع شغل را انتخاب کن…', salary: 'حقوق / دستمزد', salaryPh: 'مثلاً ۱۲ پوند در ساعت', city: 'شهر', cityPh: 'مثلاً بیرمنگام', postcode: 'کد پستی', postcodePh: 'مثلاً B1 1AA', description: 'شرح شغل', descriptionPh: 'شغل را توصیف کن…', phone: 'شماره تلفن', phonePh: '+44 7700 900000', submit: 'ارسال برای بررسی', submitting: 'در حال ارسال…', back: '→ بازگشت', successTitle: 'آگهی منتشر شد! 🎉', successMsg: 'آگهی شغلی‌ات در حال بررسی است.', backHome: 'آگهی‌هایم', errFill: 'لطفاً همه فیلدهای ضروری را پر کن' },
  ar: { title: 'توظيف موظفين', subtitle: 'انشر وظيفة شاغرة وسنراجع خلال ٢٤ ساعة', companyName: 'اسم الشركة / العمل', companyNamePh: 'مثلاً مطعم حسن', jobTitle: 'المسمى الوظيفي', jobTitlePh: 'مثلاً طاهٍ، سائق', jobType: 'نوع الوظيفة', selectType: 'اختر نوع الوظيفة…', salary: 'الراتب / الأجر', salaryPh: 'مثلاً ١٢ جنيهاً/ساعة', city: 'المدينة', cityPh: 'مثلاً برمنغهام', postcode: 'الرمز البريدي', postcodePh: 'مثلاً B1 1AA', description: 'وصف الوظيفة', descriptionPh: 'صف الوظيفة…', phone: 'رقم الهاتف', phonePh: '+44 7700 900000', submit: 'إرسال للمراجعة', submitting: 'جاري الإرسال…', back: '→ رجوع', successTitle: 'تم نشر الوظيفة! 🎉', successMsg: 'إعلان وظيفتك قيد المراجعة.', backHome: 'إعلاناتي', errFill: 'يرجى ملء جميع الحقول المطلوبة' },
}

function HireStaffInner() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const [focus, setFocus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ companyName: '', jobTitle: '', jobType: '', salary: '', city: '', postcode: '', description: '', phone: '' })

  
  const t = TX[lang] || TX.en
  const jobTypes = JOB_TYPES[lang] || JOB_TYPES.en

  useEffect(() => {
    const saved = localStorage.getItem('kurdlink_lang')
    if (saved) setLang(saved)
  }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const inp = (f) => ({ width: '100%', padding: '14px 16px', border: `2px solid ${focus === f ? '#FF6B35' : 'rgba(0,0,0,0.1)'}`, borderRadius: 14, fontSize: 15, fontFamily: FONT, outline: 'none', background: '#fff', color: '#1a1a1a', boxSizing: 'border-box', transition: 'border-color 0.2s', direction: 'ltr' })
  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 700, color: '#444', marginBottom: 6 }

  const handleSubmit = async () => {
    setError('')
    const { companyName, jobTitle, jobType, salary, city, postcode, description, phone } = form
    if (!companyName || !jobTitle || !jobType || !salary || !city || !postcode || !description || !phone) return setError(t.errFill)
    setLoading(true)
    try {
      const supabase = getSupabase()
      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user?.id
      const userName = session?.user?.user_metadata?.full_name || ''
      const userEmail = session?.user?.email || ''
      const { error: e } = await supabase.from('listings').insert({ type: 'hire_staff', status: 'pending', user_id: userId, data: { ...form, name: userName, email: userEmail } })
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
      <button onClick={() => router.push('/account')} style={{ background: ORANGE, border: 'none', borderRadius: 14, padding: '14px 32px', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: FONT }}>{t.backHome}</button>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f5', fontFamily: FONT, direction: 'ltr' }}>
      <div style={{ background: NAVY, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 15, cursor: 'pointer', fontFamily: FONT, fontWeight: 600 }}>{t.back}</button>
        <div style={{ fontSize: 18, fontWeight: 800, background: ORANGE, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>KurdLink</div>
        <LangDropdown lang={lang} onChange={setLang} />
      </div>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '24px 20px 60px', boxSizing: 'border-box' }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>👥</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: NAVY, margin: '0 0 6px' }}>{t.title}</h1>
          <p style={{ fontSize: 13, color: '#888', margin: 0, lineHeight: 1.5 }}>{t.subtitle}</p>
        </div>
        {error && <div style={{ background: '#fff0f0', border: '1.5px solid #ffcdd2', borderRadius: 12, padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#c62828', marginBottom: 16 }}>{error}</div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div><label style={labelStyle}>{t.companyName} *</label><input type="text" value={form.companyName} onChange={e => set('companyName', e.target.value)} placeholder={t.companyNamePh} onFocus={() => setFocus('companyName')} onBlur={() => setFocus(null)} style={inp('companyName')} /></div>
          <div><label style={labelStyle}>{t.jobTitle} *</label><input type="text" value={form.jobTitle} onChange={e => set('jobTitle', e.target.value)} placeholder={t.jobTitlePh} onFocus={() => setFocus('jobTitle')} onBlur={() => setFocus(null)} style={inp('jobTitle')} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>{t.jobType} *</label>
              <select value={form.jobType} onChange={e => set('jobType', e.target.value)} style={{ ...inp('jobType'), appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer' }}>
                <option value="">{t.selectType}</option>
                {jobTypes.map((j, i) => <option key={i} value={JOB_TYPES.en[i]}>{j}</option>)}
              </select>
            </div>
            <div><label style={labelStyle}>{t.salary} *</label><input type="text" value={form.salary} onChange={e => set('salary', e.target.value)} placeholder={t.salaryPh} onFocus={() => setFocus('salary')} onBlur={() => setFocus(null)} style={inp('salary')} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={labelStyle}>{t.city} *</label><input type="text" value={form.city} onChange={e => set('city', e.target.value)} placeholder={t.cityPh} onFocus={() => setFocus('city')} onBlur={() => setFocus(null)} style={inp('city')} /></div>
            <div><label style={labelStyle}>{t.postcode} *</label><input type="text" value={form.postcode} onChange={e => set('postcode', e.target.value)} placeholder={t.postcodePh} onFocus={() => setFocus('postcode')} onBlur={() => setFocus(null)} style={inp('postcode')} /></div>
          </div>
          <div><label style={labelStyle}>{t.description} *</label><textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder={t.descriptionPh} onFocus={() => setFocus('description')} onBlur={() => setFocus(null)} rows={5} style={{ ...inp('description'), resize: 'vertical', lineHeight: 1.5 }} /></div>
          <div><label style={labelStyle}>{t.phone} *</label><input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder={t.phonePh} onFocus={() => setFocus('phone')} onBlur={() => setFocus(null)} style={inp('phone')} /></div>
          <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '15px', background: loading ? '#ccc' : ORANGE, border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, color: '#fff', cursor: loading ? 'default' : 'pointer', fontFamily: FONT, boxShadow: loading ? 'none' : '0 4px 16px rgba(255,107,53,0.35)', marginTop: 8 }}>
            {loading ? t.submitting : t.submit}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function HireStaff() {
  return <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f7f7f5' }} />}><HireStaffInner /></Suspense>
}