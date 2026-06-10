'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const INDIGO = '#4F46E5'
const INDIGO_DARK = '#1C1A4F'
const INDIGO_LIGHT = '#818CF8'
const MINT = '#34D399'
const SOFT = '#EDE9FE'
const BG = '#F5F4FF'
const FONT = "'Nunito', sans-serif"

const TX = {
  en: {
    heroSub: 'Built for Kurdish, Farsi and Arabic speaking people in the UK',
    tagline: 'Free. Always.',
    featuresTitle: 'Everything Komek does for you — free, always',
    features: [
      {
        icon: '📄',
        title: 'Understand Any Letter',
        desc: 'Got a letter from the Home Office, HMRC, the council or your landlord? Take a photo or paste the text and our AI explains it in your language in seconds.',
        cta: 'Try it free',
        route: '/journey/document-explainer',
      },
      {
        icon: '🧭',
        title: 'Your Guide to Life in the UK',
        desc: 'Step by step guidance from the moment you arrive — asylum process, Leave to Remain, path to British citizenship. In Kurdish, Farsi and Arabic.',
        cta: 'Open guide',
        route: '/reber/coming-to-uk',
      },
      {
        icon: '❓',
        title: 'Ask a Question',
        desc: 'Ask anything about life in the UK. Our team answers personally — no bots, no automated replies.',
        cta: 'Ask now',
        route: '/reber/ask',
      },
      {
        icon: '🔍',
        title: 'Find Jobs and Services',
        desc: 'Browse jobs and services posted by Kurdish businesses and individuals across the UK — drivers, mechanics, solicitors, accountants and more.',
        cta: 'Browse',
        route: '/find',
      },
      {
        icon: '📝',
        title: 'Post a Job or Service',
        desc: 'Are you a business or self-employed? List your service or job vacancy — free, visible to thousands of Kurdish people across the UK.',
        cta: 'Post now',
        route: '/post',
      },
    ],
    footer: 'Komek is free for everyone. Always.',
  },
  ku: {
    heroSub: 'کۆمێک وەک دەستی یارمەتی دروست کراوە',
    tagline: 'بەخۆڕایی. گشت کاتێک.',
    featuresTitle: 'هەموو ئەوەی Komek بۆت دەکات — بەخۆڕایی، هەموو کاتێک',
    features: [
      {
        icon: '📄',
        title: 'ڕوونکردنەوەی نامە',
        desc: 'نامەیەکت لە هۆم ئۆفیس یان HMRC یان ئەنجومەن یان خاوەن خانووەکەت وەرگرتووە؟ وێنەیەک بگرە یان دەقەکە بنووسە و AI ی ئێمە لە چەند چرکەیەکدا بە زمانی خۆت ڕوونی دەکاتەوە.',
        cta: 'تاقی بکەرەوە',
        route: '/journey/document-explainer',
      },
      {
        icon: '🧭',
        title: 'ژیان لە بەریتانیا',
        desc: 'ڕێنمایی هەنگاو بە هەنگاو لە ساتەوەختی گەیشتنتەوە — پرۆسەی پەنابەری، مۆڵەت بۆ مانەوە، ڕێگا بۆ ڕەگەزنامەی بەریتانیا. بە کوردی و فارسی و عەرەبی.',
        cta: 'ڕێنمایی بکەرەوە',
        route: '/reber/coming-to-uk',
      },
      {
        icon: '❓',
        title: 'پرسیارێک بکە',
        desc: 'هەر شتێک دەربارەی ژیانی بەریتانیا بپرسە. تیمەکەمان لە ماوەی ٢٤ کاتژمێردا بە شێوەیەکی شەخسی وەڵام دەداتەوە.',
        cta: 'ئێستا پرسیار بکە',
        route: '/reber/ask',
      },
      {
        icon: '🔍',
        title: 'هەلی کار و خزمەتگوزاری بدۆزەرەوە',
        desc: 'گەڕان بەدوای ئەو هەلی کار و خزمەتگوزارییانەی کە لەلایەن بازرگان و کەسانی کورد لە سەرانسەری بەریتانیادا بڵاوکراونەتەوە — شۆفێر، میکانیک، پارێزەر، ژمێریار و زۆر شتی تر.',
        cta: 'گەڕان',
        route: '/find',
      },
      {
        icon: '📝',
        title: 'هەلی کار یان خزمەتگوزاری پۆست بکە',
        desc: 'خزمەتگوزاری یان شوێنی بەتاڵی کارەکەت بنووسە — بەخۆڕاییە، و هەزاران کەسی کورد لە سەرانسەری بەریتانیا دەتوانن بیبینن.',
        cta: 'ئێستا پۆست بکە',
        route: '/post',
      },
    ],
    footer: 'کۆمێک بۆ هەمووان بەخۆڕاییە. گشت کاتێک.',
  },
  fa: {
    heroSub: 'ساخته شده برای کردها، فارسی‌زبانان و عرب‌های ساکن بریتانیا',
    tagline: 'رایگان. همیشه.',
    featuresTitle: 'همه کارهایی که کومک برایت انجام می‌دهد — رایگان، همیشه',
    features: [
      {
        icon: '📄',
        title: 'هر نامه‌ای را بفهم',
        desc: 'نامه‌ای از Home Office، HMRC، شورا یا صاحبخانه داری؟ عکس بگیر یا متن را بچسبان، هوش مصنوعی ما در چند ثانیه به زبانت توضیح می‌دهد.',
        cta: 'رایگان امتحان کن',
        route: '/journey/document-explainer',
      },
      {
        icon: '🧭',
        title: 'راهنمای زندگی در بریتانیا',
        desc: 'راهنمای گام به گام از لحظه ورود — فرآیند پناهندگی، اجازه اقامت، مسیر شهروندی بریتانیا. به کردی، فارسی و عربی.',
        cta: 'باز کردن راهنما',
        route: '/reber/coming-to-uk',
      },
      {
        icon: '❓',
        title: 'سوال بپرس',
        desc: 'هر چیزی درباره زندگی در بریتانیا بپرس. تیم ما شخصاً پاسخ می‌دهد — نه ربات، نه پاسخ خودکار.',
        cta: 'الان بپرس',
        route: '/reber/ask',
      },
      {
        icon: '🔍',
        title: 'شغل و خدمات پیدا کن',
        desc: 'شغل و خدمات ارائه شده توسط کسب‌وکارها و افراد کرد در سراسر بریتانیا را مرور کن — راننده، مکانیک، وکیل، حسابدار و بیشتر.',
        cta: 'مرور کن',
        route: '/find',
      },
      {
        icon: '📝',
        title: 'شغل یا خدمت ارسال کن',
        desc: 'کسب‌وکار داری یا خوداشتغال هستی؟ خدمت یا آگهی شغلی‌ات را ثبت کن — رایگان، قابل مشاهده برای هزاران کرد در سراسر بریتانیا.',
        cta: 'الان ارسال کن',
        route: '/post',
      },
    ],
    footer: 'کومک برای همه رایگان است. همیشه.',
  },
  ar: {
    heroSub: 'مبني للكرد والفارسيين والعرب المقيمين في المملكة المتحدة',
    tagline: 'مجاني. دائماً.',
    featuresTitle: 'كل ما تفعله كومك من أجلك — مجاناً، دائماً',
    features: [
      {
        icon: '📄',
        title: 'افهم أي رسالة',
        desc: 'هل لديك رسالة من وزارة الداخلية أو HMRC أو المجلس أو المالك؟ التقط صورة أو الصق النص وسيشرحها الذكاء الاصطناعي بلغتك في ثوانٍ.',
        cta: 'جرّبه مجاناً',
        route: '/journey/document-explainer',
      },
      {
        icon: '🧭',
        title: 'دليلك للحياة في بريطانيا',
        desc: 'إرشادات خطوة بخطوة منذ لحظة وصولك — إجراءات اللجوء، الإذن بالبقاء، مسار الجنسية البريطانية. بالكردية والفارسية والعربية.',
        cta: 'افتح الدليل',
        route: '/reber/coming-to-uk',
      },
      {
        icon: '❓',
        title: 'اطرح سؤالاً',
        desc: 'اسأل أي شيء عن الحياة في المملكة المتحدة. فريقنا يجيب شخصياً — لا روبوتات، لا ردود آلية.',
        cta: 'اسأل الآن',
        route: '/reber/ask',
      },
      {
        icon: '🔍',
        title: 'ابحث عن وظائف وخدمات',
        desc: 'تصفح الوظائف والخدمات التي ينشرها الأعمال والأفراد الكرد في جميع أنحاء المملكة المتحدة — سائقون، ميكانيكيون، محامون، محاسبون والمزيد.',
        cta: 'تصفح',
        route: '/find',
      },
      {
        icon: '📝',
        title: 'انشر وظيفة أو خدمة',
        desc: 'هل لديك عمل تجاري أو تعمل لحسابك؟ أدرج خدمتك أو وظيفتك الشاغرة — مجاناً، مرئية لآلاف الكرد في جميع أنحاء المملكة المتحدة.',
        cta: 'انشر الآن',
        route: '/post',
      },
    ],
    footer: 'كومك مجاني للجميع. دائماً.',
  },
}

function SproutLogo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <linearGradient id="sbg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={INDIGO} /><stop offset="100%" stopColor={INDIGO_LIGHT} />
        </linearGradient>
        <linearGradient id="sl" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#059669" /><stop offset="100%" stopColor="#6EE7B7" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="url(#sbg)" />
      <path d="M 50 76 L 50 45" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M 50 60 Q 26 55 22 34 Q 44 28 52 56 Z" fill="url(#sl)" />
      <path d="M 50 50 Q 72 44 76 23 Q 56 17 48 46 Z" fill="url(#sl)" opacity="0.85" />
      <ellipse cx="50" cy="40" rx="6" ry="9" fill={MINT} />
      <ellipse cx="50" cy="37" rx="3" ry="4" fill="white" opacity="0.8" />
    </svg>
  )
}

export default function HomePage() {
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
  const isRtl = ['ku', 'fa', 'ar'].includes(lang)
  const ta = isRtl ? 'right' : 'left'

  return (
    <div style={{ fontFamily: FONT, background: BG, minHeight: '100vh', paddingBottom: 90, direction: 'ltr' }}>

      {/* HERO */}
      <div style={{ background: `linear-gradient(135deg, ${INDIGO_DARK} 0%, #2d2b6b 60%, #3730a3 100%)`, padding: '48px 24px 56px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(79,70,229,0.15)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(52,211,153,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
            <SproutLogo size={48} />
            <span style={{ fontSize: 36, fontWeight: 900, color: '#fff', letterSpacing: -1 }}>Komek</span>
          </div>
          <p style={{ color: '#a5b4fc', fontSize: 15, margin: '0 0 20px', lineHeight: 1.6, maxWidth: 340, marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}>{t.heroSub}</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${MINT}22`, border: `1px solid ${MINT}44`, borderRadius: 20, padding: '6px 16px' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: MINT }} />
            <span style={{ fontSize: 13, fontWeight: 800, color: MINT }}>{t.tagline}</span>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ padding: '24px 16px 0', maxWidth: 520, margin: '0 auto' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#6b7280', textAlign: ta, margin: '0 0 20px', lineHeight: 1.5 }}>{t.featuresTitle}</p>

        {t.features.map((f, i) => (
          <div key={i}
            onClick={() => router.push(f.route)}
            style={{ background: '#fff', borderRadius: 20, marginBottom: 14, padding: '20px', border: `1px solid ${SOFT}`, boxShadow: '0 2px 12px rgba(79,70,229,0.06)', cursor: 'pointer', display: 'flex', flexDirection: isRtl ? 'row-reverse' : 'row', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: SOFT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{f.icon}</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 15, fontWeight: 900, color: INDIGO_DARK, margin: '0 0 6px', textAlign: ta }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 12px', lineHeight: 1.6, textAlign: ta }}>{f.desc}</p>
              <div style={{ display: 'flex', justifyContent: isRtl ? 'flex-end' : 'flex-start' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: INDIGO, borderRadius: 10, padding: '7px 14px' }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>{f.cta} {isRtl ? '←' : '→'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* FOOTER LINE */}
        <div style={{ textAlign: ta, padding: '8px 0 16px' }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: INDIGO_LIGHT }}>{t.footer}</span>
        </div>
      </div>
    </div>
  )
}