'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

const INDIGO = '#4F46E5'
const INDIGO_DARK = '#1C1A4F'
const SOFT = '#EDE9FE'
const BG = '#F5F4FF'
const FONT = "'Nunito', sans-serif"

const TX = {
  en: {
    title: 'What would you like to post?',
    sub: 'Choose a category to get started.',
    hireStaff: 'Hire Staff',
    hireStaffDesc: 'Post a job vacancy',
    listService: 'List a Service',
    listServiceDesc: 'Offer your professional service',
  },
  ku: {
    title: 'چی دەتەوێت بڵاو بکەیتەوە؟',
    sub: 'کەتەگۆریێک هەڵبژێرە بۆ دەستپێکردن.',
    hireStaff: 'کرێکار بگرە',
    hireStaffDesc: 'شوێنی کارێکی بەتاڵ بڵاو بکەرەوە',
    listService: 'خزمەتگوزاری تۆمار بکە',
    listServiceDesc: 'خزمەتگوزاری پیشەییەکەت پێشکەش بکە',
  },
  fa: {
    title: 'چه می‌خواهید پست کنید؟',
    sub: 'یک دسته‌بندی انتخاب کنید.',
    hireStaff: 'استخدام کارمند',
    hireStaffDesc: 'آگهی شغلی منتشر کن',
    listService: 'ثبت خدمت',
    listServiceDesc: 'خدمت حرفه‌ای‌ات را ارائه بده',
  },
  ar: {
    title: 'ماذا تريد أن تنشر؟',
    sub: 'اختر فئة للبدء.',
    hireStaff: 'توظيف موظفين',
    hireStaffDesc: 'انشر وظيفة شاغرة',
    listService: 'إدراج خدمة',
    listServiceDesc: 'قدّم خدمتك المهنية',
  },
}

export default function PostPage() {
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [lang, setLang] = useState('en')
  const isRTL = ['ku', 'fa', 'ar'].includes(lang)
  const t = TX[lang] || TX.en

  useEffect(() => {
    const saved = localStorage.getItem('komek_lang')
    if (saved) setLang(saved)
    const handler = (e) => setLang(e.detail)
    window.addEventListener('langchange', handler)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace('/account?reason=post')
      else setChecking(false)
    })
    return () => window.removeEventListener('langchange', handler)
  }, [])

  const options = [
    { icon: '👥', title: t.hireStaff, desc: t.hireStaffDesc, route: '/listing/hire-staff' },
    { icon: '🛠️', title: t.listService, desc: t.listServiceDesc, route: '/listing/list-service' },
  ]

  if (checking) return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 36, height: 36, border: `3px solid ${SOFT}`, borderTopColor: INDIGO, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: FONT, direction: isRTL ? 'rtl' : 'ltr', paddingBottom: 80 }}>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }`}</style>

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${INDIGO_DARK} 0%, #2D2A7A 100%)`, padding: '40px 20px 56px', textAlign: 'center' }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>➕</div>
        <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 900, margin: '0 0 8px' }}>{t.title}</h1>
        <p style={{ color: '#818CF8', fontSize: 14, fontWeight: 500, margin: 0 }}>{t.sub}</p>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 16px', marginTop: -24, animation: 'fadeIn 0.4s ease' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {options.map(opt => (
            <button
              key={opt.route}
              onClick={() => router.push(opt.route)}
              style={{ background: '#fff', border: `1.5px solid ${SOFT}`, borderRadius: 20, padding: '20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', textAlign: 'left', fontFamily: FONT, boxShadow: '0 2px 12px rgba(79,70,229,0.08)', transition: 'all 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = INDIGO; e.currentTarget.style.background = SOFT }}
              onMouseOut={e => { e.currentTarget.style.borderColor = SOFT; e.currentTarget.style.background = '#fff' }}
            >
              <div style={{ width: 52, height: 52, borderRadius: 16, background: SOFT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>{opt.icon}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 800, fontSize: 16, color: INDIGO_DARK, marginBottom: 3, margin: '0 0 4px' }}>{opt.title}</p>
                <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>{opt.desc}</p>
              </div>
              <span style={{ color: INDIGO, fontSize: 20, opacity: 0.4 }}>→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}