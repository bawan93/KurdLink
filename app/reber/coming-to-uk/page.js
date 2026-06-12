'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const INDIGO = '#4F46E5'
const INDIGO_DARK = '#1C1A4F'
const INDIGO_LIGHT = '#818CF8'
const MINT = '#34D399'
const SOFT = '#EDE9FE'
const BG = '#F5F4FF'
const FONT = "'Nunito', sans-serif"

const ARABIC_NUMS = ['١', '٢', '٣']

const TX = {
  en: {
    heroTitle: "Your Journey in the UK",
    heroSub: "A step-by-step guide from arrival to citizenship — in your language, at your pace.",
    allStages: "All Stages",
    letterBanner: "Got a letter from the Home Office?",
    letterCta: "Explain it free",
    stages: [
      { step: "Stage 1", title: "Just Arrived", badge: "Start here", badgeColor: MINT, cta: "View Stage 1", route: "/reber/new-to-uk" },
      { step: "Stage 2", title: "Leave to Remain", badge: "Most common", badgeColor: INDIGO_LIGHT, cta: "View Stage 2", route: "/reber/leave-to-remain" },
      { step: "Stage 3", title: "Path to Citizenship", badge: "Final stage", badgeColor: "#F59E0B", cta: "View Stage 3", route: "/reber/citizenship" },
    ],
  },
  ku: {
    heroTitle: "گەشتەکەت لە بەریتانیا",
    heroSub: "ڕێنمایی هەنگاو بە هەنگاو لە گەیشتن تا هاووڵاتیبوون.",
    allStages: "قۆناغەکان",
    letterBanner: "نامەیەکت لە هۆم ئۆفیس وەرگرتووە؟",
    letterCta: "بەخۆڕایی ڕوونی بکەرەوە",
    stages: [
      { step: "قۆناغی یەکەم", title: "کاتێک تازە گەیشتووی", badge: "لێرەوە دەست پێ بکە", badgeColor: MINT, cta: "بینینی قۆناغی یەکەم", route: "/reber/new-to-uk" },
      { step: "قۆناغی دووەم", title: "پاسپۆرتەکەت وەرگرتووە", badge: "باوترین قۆناغ", badgeColor: INDIGO_LIGHT, cta: "بینینی قۆناغی دووەم", route: "/reber/leave-to-remain" },
      { step: "قۆناغی سێیەم", title: "ڕێگای هاوڵاتیبوون", badge: "قۆناغی کۆتایی", badgeColor: "#F59E0B", cta: "بینینی قۆناغی سێیەم", route: "/reber/citizenship" },
    ],
  },
  fa: {
    heroTitle: "مسیر تو در بریتانیا",
    heroSub: "راهنمای گام به گام از ورود تا شهروندی — به زبانت، با سرعت خودت.",
    allStages: "همه مراحل",
    letterBanner: "نامه‌ای از Home Office داری؟",
    letterCta: "رایگان توضیح بده",
    stages: [
      { step: "مرحله ۱", title: "تازه رسیدی", badge: "از اینجا شروع کن", badgeColor: MINT, cta: "مرحله ۱ را ببین", route: "/reber/new-to-uk" },
      { step: "مرحله ۲", title: "اجازه اقامت", badge: "رایج‌ترین", badgeColor: INDIGO_LIGHT, cta: "مرحله ۲ را ببین", route: "/reber/leave-to-remain" },
      { step: "مرحله ۳", title: "مسیر شهروندی", badge: "مرحله آخر", badgeColor: "#F59E0B", cta: "مرحله ۳ را ببین", route: "/reber/citizenship" },
    ],
  },
  ar: {
    heroTitle: "رحلتك في المملكة المتحدة",
    heroSub: "دليل خطوة بخطوة من الوصول إلى الجنسية — بلغتك، بسرعتك.",
    allStages: "كل المراحل",
    letterBanner: "لديك رسالة من Home Office؟",
    letterCta: "اشرحها مجاناً",
    stages: [
      { step: "المرحلة ١", title: "وصلت للتو", badge: "ابدأ من هنا", badgeColor: MINT, cta: "عرض المرحلة ١", route: "/reber/new-to-uk" },
      { step: "المرحلة ٢", title: "إذن البقاء", badge: "الأكثر شيوعاً", badgeColor: INDIGO_LIGHT, cta: "عرض المرحلة ٢", route: "/reber/leave-to-remain" },
      { step: "المرحلة ٣", title: "مسار الجنسية", badge: "المرحلة الأخيرة", badgeColor: "#F59E0B", cta: "عرض المرحلة ٣", route: "/reber/citizenship" },
    ],
  },
}

export default function ComingToUKPage() {
  const router = useRouter()
  const [lang, setLang] = useState('en')

  useEffect(() => {
    const saved = localStorage.getItem('komek_lang')
    if (saved && TX[saved]) setLang(saved)
    const handler = (e) => { if (TX[e.detail]) setLang(e.detail) }
    window.addEventListener('langchange', handler)
    return () => window.removeEventListener('langchange', handler)
  }, [])

  const t = TX[lang] || TX.en
  const isRtlText = lang === 'ku' || lang === 'fa' || lang === 'ar'
  const useArabicNums = lang === 'ku' || lang === 'fa' || lang === 'ar'

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: FONT, direction: 'ltr', paddingBottom: 80 }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${INDIGO_DARK} 0%, #2d2b6b 60%, #3730a3 100%)`, padding: '36px 20px 44px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(79,70,229,0.15)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -30, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(52,211,153,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: i===0?MINT:i===1?INDIGO_LIGHT:'#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff' }}>
                    {useArabicNums ? ARABIC_NUMS[i] : i + 1}
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10, fontWeight: 600 }}>{t.stages[i].step}</span>
                </div>
                {i < 2 && <div style={{ width: 20, height: 2, background: 'rgba(255,255,255,0.2)', marginBottom: 14 }} />}
              </div>
            ))}
          </div>
          <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, margin: '0 0 10px', lineHeight: 1.2, textAlign: isRtlText ? 'right' : 'left' }}>{t.heroTitle}</h1>
          <p style={{ color: '#a5b4fc', fontSize: 14, margin: 0, lineHeight: 1.6, textAlign: isRtlText ? 'right' : 'left' }}>{t.heroSub}</p>
        </div>
      </div>

      {/* Stage cards */}
      <div style={{ padding: '14px 16px 0' }}>
        <p style={{ color: '#6b7280', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, margin: '0 0 10px', textAlign: isRtlText ? 'right' : 'left' }}>{t.allStages}</p>
        {t.stages.map((stage, i) => (
          <div key={i} onClick={() => router.push(stage.route)} style={{ background: '#fff', borderRadius: 16, marginBottom: 12, border: `1px solid ${SOFT}`, boxShadow: '0 2px 10px rgba(79,70,229,0.06)', overflow: 'hidden', cursor: 'pointer' }}>
            <div style={{ padding: '16px 16px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexDirection: isRtlText ? 'row-reverse' : 'row' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: stage.badgeColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                  {useArabicNums ? ARABIC_NUMS[i] : i + 1}
                </div>
                <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 600 }}>{stage.step}</span>
                <span style={{ background: stage.badgeColor+'22', color: stage.badgeColor, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, border: `1px solid ${stage.badgeColor}44` }}>{stage.badge}</span>
              </div>
              <h3 style={{ color: INDIGO_DARK, fontWeight: 800, fontSize: 17, margin: '0 0 14px', textAlign: isRtlText ? 'right' : 'left' }}>{stage.title}</h3>
              <div style={{ background: INDIGO_DARK, color: '#fff', borderRadius: 10, padding: 12, textAlign: 'center', fontSize: 14, fontWeight: 700 }}>{stage.cta} →</div>
            </div>
          </div>
        ))}
      </div>

      {/* Letter banner */}
      <div style={{ padding: '4px 16px 0' }}>
        <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e1b4b)', borderRadius: 16, padding: '18px 16px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(79,70,229,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>📄</div>
          <div style={{ flex: 1 }}>
            <p style={{ color: '#fff', fontWeight: 800, fontSize: 14, margin: '0 0 3px', textAlign: isRtlText ? 'right' : 'left' }}>{t.letterBanner}</p>
            <p style={{ color: '#a5b4fc', fontSize: 12, margin: '0 0 10px', textAlign: isRtlText ? 'right' : 'left' }}>{t.heroSub}</p>
            <button onClick={() => router.push('/journey/document-explainer')} style={{ background: MINT, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>{t.letterCta} →</button>
          </div>
        </div>
      </div>
    </div>
  )
}