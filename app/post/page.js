'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
'

const NAVY = '#1A2B5F'
const ORANGE = '#FF6B35'
const LIGHT_BG = '#F7F8FC'
const BORDER = '#E8ECF4'
const CARD_BG = '#FFFFFF'
const FONT = "'Plus Jakarta Sans', sans-serif"

const TX = {
  en: { title: 'What would you like to post?', sub: 'Choose a category to get started.', sellCar: 'Sell a Car', sellCarDesc: 'List your car for sale', sellBiz: 'Sell a Business', sellBizDesc: 'List your business for sale', hireStaff: 'Hire Staff', hireStaffDesc: 'Post a job vacancy', listService: 'List a Service', listServiceDesc: 'Offer your professional service' },
  ku: { title: 'چی دەتەوێت بڵاو بکەیتەوە؟', sub: 'کەتەگۆریێک هەڵبژێرە بۆ دەستپێکردن.', sellCar: 'ئۆتۆمبێل بفرۆشە', sellCarDesc: 'ئۆتۆمبێلەکەت بۆ فرۆشتن تۆمار بکە', sellBiz: 'بازرگانی بفرۆشە', sellBizDesc: 'بازرگانیەکەت بۆ فرۆشتن تۆمار بکە', hireStaff: 'کرێکار بگرە', hireStaffDesc: 'شوێنی کارێکی بەتاڵ بڵاو بکەرەوە', listService: 'خزمەتگوزاری تۆمار بکە', listServiceDesc: 'خزمەتگوزاری پیشەییەکەت پێشکەش بکە' },
  fa: { title: 'چه می‌خواهید پست کنید؟', sub: 'یک دسته‌بندی انتخاب کنید.', sellCar: 'فروش ماشین', sellCarDesc: 'ماشینت را برای فروش ثبت کن', sellBiz: 'فروش کسب‌وکار', sellBizDesc: 'کسب‌وکارت را برای فروش ثبت کن', hireStaff: 'استخدام کارمند', hireStaffDesc: 'آگهی شغلی منتشر کن', listService: 'ثبت خدمت', listServiceDesc: 'خدمت حرفه‌ای‌ات را ارائه بده' },
  ar: { title: 'ماذا تريد أن تنشر؟', sub: 'اختر فئة للبدء.', sellCar: 'بيع سيارة', sellCarDesc: 'أدرج سيارتك للبيع', sellBiz: 'بيع عمل تجاري', sellBizDesc: 'أدرج عملك التجاري للبيع', hireStaff: 'توظيف موظفين', hireStaffDesc: 'انشر وظيفة شاغرة', listService: 'إدراج خدمة', listServiceDesc: 'قدّم خدمتك المهنية' },
}

export default function PostPage() {
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [lang, setLang] = useState('en')
  const t = TX[lang] || TX.en

  useEffect(() => {
    const saved = localStorage.getItem('kurdlink_lang')
    if (saved) setLang(saved)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace('/account?reason=post')
      else setChecking(false)
    })
  }, [])

  const options = [
    { icon: '🚗', title: t.sellCar,     desc: t.sellCarDesc,     route: '/listings/sell-car' },
    { icon: '🏢', title: t.sellBiz,     desc: t.sellBizDesc,     route: '/listings/sell-business' },
    { icon: '👥', title: t.hireStaff,   desc: t.hireStaffDesc,   route: '/listings/hire-staff' },
    { icon: '🛠️', title: t.listService, desc: t.listServiceDesc, route: '/listings/list-service' },
  ]

  if (checking) return (
    <div style={{ minHeight: '100vh', background: LIGHT_BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 36, height: 36, border: `3px solid ${BORDER}`, borderTopColor: ORANGE, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: LIGHT_BG, fontFamily: FONT, direction: 'ltr' }}>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }`}</style>
      <div style={{ background: NAVY, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
        <span onClick={() => router.push('/home')} style={{ color: '#fff', fontWeight: 800, fontSize: 20, cursor: 'pointer' }}>
          Kurd<span style={{ color: ORANGE }}>Link</span>
        </span>
        <LangDropdown lang={lang} onChange={setLang} />
      </div>
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '32px 16px', animation: 'fadeIn 0.4s ease' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: NAVY, marginBottom: 6 }}>{t.title}</h1>
        <p style={{ fontSize: 14, color: '#888', marginBottom: 28 }}>{t.sub}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {options.map(opt => (
            <button
              key={opt.route}
              onClick={() => router.push(opt.route)}
              style={{ background: CARD_BG, border: `1.5px solid ${BORDER}`, borderRadius: 18, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', textAlign: 'left', fontFamily: FONT, transition: 'all 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = ORANGE; e.currentTarget.style.background = '#FFF8F5' }}
              onMouseOut={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.background = CARD_BG }}
            >
              <span style={{ fontSize: 32, flexShrink: 0 }}>{opt.icon}</span>
              <div>
                <p style={{ fontWeight: 800, fontSize: 16, color: NAVY, marginBottom: 3 }}>{opt.title}</p>
                <p style={{ fontSize: 13, color: '#888', margin: 0 }}>{opt.desc}</p>
              </div>
              <span style={{ marginLeft: 'auto', color: '#ccc', fontSize: 20 }}>→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}