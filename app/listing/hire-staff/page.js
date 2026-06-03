'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

const INDIGO = '#4F46E5'
const INDIGO_DARK = '#1C1A4F'
const INDIGO_LIGHT = '#818CF8'
const MINT = '#34D399'
const SOFT = '#EDE9FE'
const BG = '#F5F4FF'
const FONT = "'Nunito', sans-serif"

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const TX = {
  en: {
    heroTitle: 'Post a Job',
    heroSub: 'Find the right person for your role',
    jobTitle: 'Job Title',
    jobTitlePh: 'e.g. Delivery Driver, Chef, Receptionist',
    description: 'Job Description',
    descPh: 'Describe the role, responsibilities, and what you\'re looking for...',
    location: 'Location',
    locationPh: 'e.g. London, Birmingham, Manchester',
    salary: 'Salary / Pay',
    salaryPh: 'e.g. £12/hour, £25,000/year, Negotiable',
    contact: 'Contact (Phone or Email)',
    contactPh: 'How should people apply or get in touch?',
    submit: 'Post Job',
    submitting: 'Posting...',
    success: 'Job posted! It will appear once approved.',
    required: 'Please fill in all fields.',
  },
  ku: {
    heroTitle: 'کار بڵاو بکەرەوە',
    heroSub: 'کەسی گونجاو بدۆزەرەوە بۆ شوێنەکەت',
    jobTitle: 'ناونیشانی کار',
    jobTitlePh: 'بۆ نموونە: شۆفێر، ئاشپەز، ڕیسێپشنیست',
    description: 'وەصفی کار',
    descPh: 'کارەکە، بەرپرسیارییەکان، و ئەوەی دەتەوێت وەسف بکە...',
    location: 'شوێن',
    locationPh: 'بۆ نموونە: لەندەن، بێرمینگهام',
    salary: 'مووچە',
    salaryPh: 'بۆ نموونە: ١٢ پاوند/کاتژمێر، بەلێن دەدرێت',
    contact: 'پەیوەندی (تەلەفۆن یان ئیمەیل)',
    contactPh: 'چۆن داواکاری بکەن؟',
    submit: 'کار بڵاو بکەرەوە',
    submitting: 'دەنێردرێت...',
    success: 'کار بڵاو کرایەوە! دوای پەسەندکردن دەردەکەوێت.',
    required: 'تکایە هەموو خانەکان پڕ بکەرەوە.',
  },
  fa: {
    heroTitle: 'آگهی شغلی بگذار',
    heroSub: 'فرد مناسب برای نقشت پیدا کن',
    jobTitle: 'عنوان شغل',
    jobTitlePh: 'مثلاً: راننده، آشپز، منشی',
    description: 'توضیحات شغل',
    descPh: 'نقش، مسئولیت‌ها و آنچه دنبالش هستی را توضیح بده...',
    location: 'موقعیت',
    locationPh: 'مثلاً: لندن، بیرمنگام',
    salary: 'حقوق',
    salaryPh: 'مثلاً: ۱۲ پوند/ساعت، قابل مذاکره',
    contact: 'تماس (تلفن یا ایمیل)',
    contactPh: 'چطور باید متقاضیان تماس بگیرند؟',
    submit: 'انتشار آگهی',
    submitting: 'در حال انتشار...',
    success: 'آگهی ثبت شد! پس از تأیید نمایش داده می‌شود.',
    required: 'لطفاً همه فیلدها را پر کنید.',
  },
  ar: {
    heroTitle: 'انشر وظيفة',
    heroSub: 'ابحث عن الشخص المناسب لدورك',
    jobTitle: 'المسمى الوظيفي',
    jobTitlePh: 'مثال: سائق، طاهٍ، موظف استقبال',
    description: 'وصف الوظيفة',
    descPh: 'صف الدور والمسؤوليات وما تبحث عنه...',
    location: 'الموقع',
    locationPh: 'مثال: لندن، برمنغهام',
    salary: 'الراتب',
    salaryPh: 'مثال: £12/ساعة، قابل للتفاوض',
    contact: 'التواصل (هاتف أو بريد إلكتروني)',
    contactPh: 'كيف يتقدم المتقدمون؟',
    submit: 'نشر الوظيفة',
    submitting: 'جارٍ النشر...',
    success: 'تم نشر الوظيفة! ستظهر بعد الموافقة.',
    required: 'يرجى ملء جميع الحقول.',
  },
}

export default function HireStaffPage() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const [userId, setUserId] = useState(null)
  const [form, setForm] = useState({ jobTitle: '', description: '', location: '', salary: '', contact: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const isRTL = ['ku', 'fa', 'ar'].includes(lang)
  const t = TX[lang] || TX.en

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

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit() {
    const { jobTitle, description, location, salary, contact } = form
    if (!jobTitle || !description || !location || !salary || !contact) {
      setError(t.required)
      return
    }
    setError('')
    setSubmitting(true)
    const { error: sbError } = await supabase.from('listings').insert({
      type: 'hire_staff',
      status: 'pending',
      user_id: userId,
      data: { jobTitle, description, location, salary, contact },
    })
    setSubmitting(false)
    if (sbError) { setError(sbError.message); return }
    setSuccess(true)
    setTimeout(() => router.push('/home'), 2500)
  }

  const fields = [
    { key: 'jobTitle', label: t.jobTitle, placeholder: t.jobTitlePh, multiline: false },
    { key: 'description', label: t.description, placeholder: t.descPh, multiline: true },
    { key: 'location', label: t.location, placeholder: t.locationPh, multiline: false },
    { key: 'salary', label: t.salary, placeholder: t.salaryPh, multiline: false },
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
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${INDIGO_DARK} 0%, #2D2A7A 100%)`, padding: '40px 20px 56px', textAlign: 'center' }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>👥</div>
        <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 900, margin: '0 0 8px' }}>{t.heroTitle}</h1>
        <p style={{ color: INDIGO_LIGHT, fontSize: 14, fontWeight: 500, margin: 0 }}>{t.heroSub}</p>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 16px', marginTop: -24 }}>
        <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 4px 24px rgba(79,70,229,0.10)', padding: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {fields.map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 13, fontWeight: 800, color: INDIGO_DARK, display: 'block', marginBottom: 6 }}>{f.label}</label>
                {f.multiline ? (
                  <textarea
                    value={form[f.key]}
                    onChange={e => update(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    rows={4}
                    style={{ width: '100%', border: `1.5px solid ${SOFT}`, borderRadius: 12, padding: '12px 14px', fontFamily: FONT, fontSize: 14, color: INDIGO_DARK, resize: 'vertical', outline: 'none', background: BG, boxSizing: 'border-box' }}
                  />
                ) : (
                  <input
                    value={form[f.key]}
                    onChange={e => update(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    style={{ width: '100%', border: `1.5px solid ${SOFT}`, borderRadius: 12, padding: '12px 14px', fontFamily: FONT, fontSize: 14, color: INDIGO_DARK, outline: 'none', background: BG, boxSizing: 'border-box' }}
                  />
                )}
              </div>
            ))}

            {error && <p style={{ color: '#EF4444', fontSize: 13, fontWeight: 600, margin: 0 }}>{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{ width: '100%', padding: '15px', background: submitting ? '#E5E7EB' : INDIGO, color: submitting ? '#9CA3AF' : '#fff', border: 'none', borderRadius: 14, fontFamily: FONT, fontSize: 16, fontWeight: 800, cursor: submitting ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
            >
              {submitting ? t.submitting : t.submit}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}