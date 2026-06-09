'use client'
import { useState, useEffect } from 'react'

const INDIGO = '#4F46E5'
const INDIGO_LIGHT = '#818CF8'
const INDIGO_DARK = '#1C1A4F'
const MINT = '#34D399'
const SOFT = '#EDE9FE'
const BG = '#F5F4FF'
const FONT = "'Nunito', sans-serif"

const TX = {
  en: {
    heroLabel: 'STAGE 3',
    heroTitle: 'British Citizenship',
    heroSub: 'Your guide to becoming a British citizen',
    stepsTitle: 'The Application Process',
    steps: [
      { icon: '✅', title: 'Check Eligibility', desc: 'You must have lived in the UK for at least 5 years (3 years if married to a British citizen), have Indefinite Leave to Remain or Settled Status, and passed the Life in the UK test.' },
      { icon: '🧠', title: 'Life in the UK Test', desc: 'A 24-question test about British history, values, and laws. You must score at least 75% to pass. You can retake it if you fail.' },
      { icon: '🌐', title: 'English Language', desc: 'You must prove your English is at B1 level or above, either through a recognised test or an approved degree taught in English.' },
      { icon: '📝', title: 'Apply Online', desc: 'Complete your application at the UKVI website. The current fee is £1,709 (April 2026). This includes a citizenship ceremony fee.' },
      { icon: '🤝', title: 'Biometrics & Documents', desc: 'Attend a UKVCAS appointment to provide biometrics and submit your supporting documents.' },
      { icon: '🎖️', title: 'Citizenship Ceremony', desc: "Once approved, you'll attend a ceremony where you take the Oath or Affirmation of Allegiance and receive your certificate." },
    ],
    reqTitle: 'Key Requirements',
    requirements: [
      { icon: '📅', title: '5 Years Residence', desc: 'Must have lived in the UK for at least 5 years (3 if married to a British citizen)' },
      { icon: '📄', title: 'Settled Status', desc: 'Must hold ILR or EU Settled Status before applying' },
      { icon: '🧪', title: 'Life in the UK Test', desc: 'Must have a valid passing certificate from the official test' },
      { icon: '🗣️', title: 'English B1+', desc: 'Proof of English language ability at B1 level or above' },
      { icon: '✈️', title: 'Absences', desc: 'Cannot have spent more than 450 days outside the UK in 5 years, or 90 days in the final year' },
      { icon: '⚖️', title: 'Good Character', desc: 'Must not have serious criminal convictions or significant immigration issues' },
    ],
    faqTitle: 'Common Questions',
    faqs: [
      { emoji: '⏱️', q: 'How long does it take?', a: 'The Home Office aims to process applications within 6 months, though many take longer. You should not book travel or make irreversible plans while waiting.' },
      { emoji: '👨‍👩‍👧', q: 'Can my children apply too?', a: 'Children under 18 can register as British citizens, but it is a separate application with its own fee (£1,214 as of April 2026). A child born in the UK to a British parent is automatically British.' },
      { emoji: '🛂', q: 'Do I have to give up my other passport?', a: 'The UK allows dual nationality, so in most cases you do not need to give up your other citizenship. However, some countries do not allow dual nationality — check your home country\'s rules.' },
      { emoji: '📖', q: 'What is the Life in the UK test?', a: 'It is a 45-minute computer test at an approved centre. There are 24 questions. You need 18 correct to pass. The test costs £50. You can retake it as many times as needed.' },
    ],
    helpTitle: 'Get Help',
    helpers: [
      { emoji: '📞', name: 'UKVI Nationality Helpline', desc: 'Official helpline for citizenship and nationality enquiries', number: '0300 790 6268', tag: 'Official' },
      { emoji: '📚', name: 'Life in the UK Test', desc: 'Book your test at the official website: lifeintheuktestweb.co.uk', number: '0800 015 4033', tag: 'Test' },
      { emoji: '⚖️', name: 'Free Legal Advice', desc: 'Citizens Advice can refer you to specialist immigration solicitors', number: '0800 144 8848', tag: 'Free' },
    ],
  },

  ku: {
    heroLabel: 'قۆناغی سێیەم',
    heroTitle: 'بریتانیایی بوون',
    heroSub: 'ڕێنماییەکەت بۆ بریتانیایی بوون',
    stepsTitle: 'پرۆسەی داواکاری',
    steps: [
      { icon: '✅', title: 'شەرتەکان بپشکنە', desc: 'دەبێت لانیکەم ٥ ساڵ لە بریتانیا ژیابیت (٣ ساڵ ئەگەر هاوسەرەکەت بریتانیاییە)، مۆڵەتی نامحدود هەبێت، و تاقیکردنەوەی ژیان لە بریتانیا دەرباز کرد بێت.' },
      { icon: '🧠', title: 'تاقیکردنەوەی ژیان لە بریتانیا', desc: 'تاقیکردنەوەیەکی ٢٤ پرسیار دەربارەی مێژوو و نەریتەکانی بریتانیا. پێویستە لانیکەم ٧٥٪ بدەیت بۆ دەرباز کردن.' },
      { icon: '🌐', title: 'زمانی ئینگلیزی', desc: 'پێویستە B1 یان سەرووی ئینگلیزیت ئیسپات بکەیت.' },
      { icon: '📝', title: 'ئۆنلاین داوا بکە', desc: 'داواکاریەکەت لە ماڵپەڕی UKVI تەواو بکە. کرێی ئێستا ١،٧٠٩ پاوندە (ئەپریلی ٢٠٢٦).' },
      { icon: '🤝', title: 'بایۆمێتریک و بەڵگەکان', desc: 'چاوپێکەوتنێکی UKVCAS بپێوەندە بۆ دانی بایۆمێتریک و بەڵگەکانت.' },
      { icon: '🎖️', title: 'ئایینی بریتانیایی بوون', desc: 'دوای پەسەندکردن، ئایینێکت لێ دەبێت کە سوێند دەخۆیت و بڕوانامەکەت وەردەگریت.' },
    ],
    reqTitle: 'مەرجە سەرەکیەکان',
    requirements: [
      { icon: '📅', title: '٥ ساڵ مانەوە', desc: 'دەبێت لانیکەم ٥ ساڵ لە بریتانیا ژیابیت' },
      { icon: '📄', title: 'مۆڵەتی دانیشتن', desc: 'دەبێت ILR یان Settled Status هەبێت' },
      { icon: '🧪', title: 'تاقیکردنەوەی ژیان', desc: 'پێویستە بڕوانامەی دەرباز کردنی تاقیکردنەوەی فەرمی هەبێت' },
      { icon: '🗣️', title: 'ئینگلیزی B1+', desc: 'ئیسپاتی توانای زمانی ئینگلیزی لە ئاستی B1 یان سەروو' },
      { icon: '✈️', title: 'غیابات', desc: 'نابێت زیاتر لە ٤٥٠ ڕۆژ لە ٥ ساڵدا دەرەوەی بریتانیا بوویت' },
      { icon: '⚖️', title: 'خوی باش', desc: 'نابێت تاوانباریی گران یان کێشەی کۆچی گرنگت هەبێت' },
    ],
    faqTitle: 'پرسیارە باوەکان',
    faqs: [
      { emoji: '⏱️', q: 'چەند کاتێک دەکێشێت؟', a: 'وەزارەتی ناوخۆ ئامانجی ٦ مانگ هەیە بۆ پرۆسەکردن، بەڵام زۆربەی کات درێژتر دەکێشێت.' },
      { emoji: '👨‍👩‍👧', q: 'منەکانم دەتوانن داوا بکەن؟', a: 'منەکانی ژێر ١٨ ساڵ دەتوانن تۆمار بکەن وەک بریتانیاییەکان، بەڵام داواکارییەکی جیاوازە.' },
      { emoji: '🛂', q: 'پێویستە پاسپۆرتی دیکەم بدەم؟', a: 'بریتانیا دووملیەتی قبووڵ دەکات، لەبەر ئەوە زۆرینەی کات پێویست ناکات ملیەتی دیکەت بدەیت.' },
      { emoji: '📖', q: 'تاقیکردنەوەی ژیان لە بریتانیا چییە؟', a: 'تاقیکردنەوەیەکی کۆمپیوتەریە ٤٥ خولەکی، ٢٤ پرسیار. پێویستە ١٨ وەڵامی دروست بدەیت. کرێکەی ٥٠ پاوندە.' },
    ],
    helpTitle: 'یارمەتی وەربگرە',
    helpers: [
      { emoji: '📞', name: 'هێڵی یارمەتی ملیەتی UKVI', desc: 'هێڵی فەرمی بۆ پرسیارەکانی بریتانیایی بوون', number: '0300 790 6268', tag: 'فەرمی' },
      { emoji: '📚', name: 'تاقیکردنەوەی ژیان لە بریتانیا', desc: 'تاقیکردنەوەکەت تۆمار بکە لە ماڵپەڕی فەرمی', number: '0800 015 4033', tag: 'تاقیکردنەوە' },
      { emoji: '⚖️', name: 'ڕاوێژی یاسایی خۆڕایی', desc: 'Citizens Advice دەتوانێت بنێرێتت بۆ شارەزایانی کۆچ', number: '0800 144 8848', tag: 'خۆڕایی' },
    ],
  },

  fa: {
    heroLabel: 'مرحله ۳',
    heroTitle: 'شهروندی بریتانیا',
    heroSub: 'راهنمای تو برای تبدیل شدن به شهروند بریتانیا',
    stepsTitle: 'مراحل درخواست',
    steps: [
      { icon: '✅', title: 'شرایط را بررسی کن', desc: 'باید حداقل ۵ سال در بریتانیا زندگی کرده باشی، اجازه اقامت نامحدود داشته باشی، و آزمون زندگی در بریتانیا را گذرانده باشی.' },
      { icon: '🧠', title: 'آزمون زندگی در بریتانیا', desc: 'آزمونی با ۲۴ سوال درباره تاریخ و ارزش‌های بریتانیا. باید حداقل ۷۵٪ بگیری.' },
      { icon: '🌐', title: 'زبان انگلیسی', desc: 'باید توانایی انگلیسی B1 یا بالاتر را اثبات کنی.' },
      { icon: '📝', title: 'آنلاین درخواست بده', desc: 'درخواستت را در وب‌سایت UKVI کامل کن. هزینه فعلی ۱۷۰۹ پوند است (آوریل ۲۰۲۶).' },
      { icon: '🤝', title: 'بیومتریک و مدارک', desc: 'نوبت UKVCAS بگیر تا بیومتریک بدهی و مدارکت را ارائه کنی.' },
      { icon: '🎖️', title: 'مراسم شهروندی', desc: 'پس از تأیید، در مراسمی شرکت می‌کنی که سوگند یاد می‌کنی و گواهینامه‌ات را دریافت می‌کنی.' },
    ],
    reqTitle: 'شرایط اصلی',
    requirements: [
      { icon: '📅', title: '۵ سال اقامت', desc: 'باید حداقل ۵ سال در بریتانیا زندگی کرده باشی' },
      { icon: '📄', title: 'اقامت دائم', desc: 'باید ILR یا وضعیت تسویه‌شده داشته باشی' },
      { icon: '🧪', title: 'آزمون زندگی', desc: 'باید گواهینامه معتبر قبولی از آزمون رسمی داشته باشی' },
      { icon: '🗣️', title: 'انگلیسی B1+', desc: 'مدرک توانایی زبان انگلیسی در سطح B1 یا بالاتر' },
      { icon: '✈️', title: 'غیبت‌ها', desc: 'نباید بیش از ۴۵۰ روز در ۵ سال خارج از بریتانیا بوده باشی' },
      { icon: '⚖️', title: 'حسن سابقه', desc: 'نباید محکومیت جنایی جدی یا مشکل مهاجرتی مهم داشته باشی' },
    ],
    faqTitle: 'سوالات رایج',
    faqs: [
      { emoji: '⏱️', q: 'چقدر طول می‌کشد؟', a: 'وزارت کشور هدف ۶ ماه دارد، اما بسیاری بیشتر طول می‌کشد.' },
      { emoji: '👨‍👩‍👧', q: 'فرزندانم هم می‌توانند درخواست بدهند؟', a: 'بله، اما درخواست جداگانه‌ای با هزینه جداست.' },
      { emoji: '🛂', q: 'آیا باید پاسپورتم را تسلیم کنم؟', a: 'بریتانیا دوتابعیتی را می‌پذیرد، پس در اکثر موارد نیازی به تسلیم تابعیت دیگرت نیست.' },
      { emoji: '📖', q: 'آزمون زندگی در بریتانیا چیست؟', a: 'آزمون کامپیوتری ۴۵ دقیقه‌ای با ۲۴ سوال. باید ۱۸ پاسخ درست بدهی. هزینه ۵۰ پوند است.' },
    ],
    helpTitle: 'کمک بگیر',
    helpers: [
      { emoji: '📞', name: 'خط ملیت UKVI', desc: 'خط رسمی برای سوالات شهروندی و ملیت', number: '0300 790 6268', tag: 'رسمی' },
      { emoji: '📚', name: 'آزمون زندگی در بریتانیا', desc: 'آزمون را در وب‌سایت رسمی ثبت کن', number: '0800 015 4033', tag: 'آزمون' },
      { emoji: '⚖️', name: 'مشاوره حقوقی رایگان', desc: 'Citizens Advice می‌تواند تو را به متخصصان مهاجرت ارجاع دهد', number: '0800 144 8848', tag: 'رایگان' },
    ],
  },

  ar: {
    heroLabel: 'المرحلة ٣',
    heroTitle: 'الجنسية البريطانية',
    heroSub: 'دليلك لتصبح مواطناً بريطانياً',
    stepsTitle: 'خطوات التقديم',
    steps: [
      { icon: '✅', title: 'تحقق من الأهلية', desc: 'يجب أن تكون قد عشت في المملكة المتحدة لمدة 5 سنوات على الأقل، وتمتلك إذن إقامة غير محدود، واجتزت اختبار الحياة في المملكة المتحدة.' },
      { icon: '🧠', title: 'اختبار الحياة في بريطانيا', desc: 'اختبار من 24 سؤالاً عن التاريخ والقيم البريطانية. يجب أن تحصل على 75% على الأقل.' },
      { icon: '🌐', title: 'اللغة الإنجليزية', desc: 'يجب إثبات مستوى B1 أو أعلى في الإنجليزية.' },
      { icon: '📝', title: 'تقدم إلكترونياً', desc: 'أكمل طلبك على موقع UKVI. الرسوم الحالية £1,709 (أبريل 2026).' },
      { icon: '🤝', title: 'القياسات الحيوية والمستندات', desc: 'احضر موعد UKVCAS لتقديم القياسات الحيوية ومستنداتك.' },
      { icon: '🎖️', title: 'حفل الجنسية', desc: 'بعد الموافقة، ستحضر حفلاً تؤدي فيه القسم وتستلم شهادتك.' },
    ],
    reqTitle: 'المتطلبات الأساسية',
    requirements: [
      { icon: '📅', title: '5 سنوات إقامة', desc: 'يجب أن تكون قد عشت في المملكة المتحدة 5 سنوات على الأقل' },
      { icon: '📄', title: 'الإقامة الدائمة', desc: 'يجب امتلاك ILR أو Settled Status' },
      { icon: '🧪', title: 'اختبار الحياة', desc: 'يجب امتلاك شهادة نجاح صالحة من الاختبار الرسمي' },
      { icon: '🗣️', title: 'إنجليزي B1+', desc: 'إثبات الكفاءة اللغوية بمستوى B1 أو أعلى' },
      { icon: '✈️', title: 'الغيابات', desc: 'يجب ألا تكون قد قضيت أكثر من 450 يوماً خارج المملكة المتحدة في 5 سنوات' },
      { icon: '⚖️', title: 'حسن السيرة', desc: 'يجب ألا يكون لديك إدانات جنائية خطيرة أو مشاكل هجرة مهمة' },
    ],
    faqTitle: 'أسئلة شائعة',
    faqs: [
      { emoji: '⏱️', q: 'كم يستغرق الأمر؟', a: 'تهدف وزارة الداخلية إلى معالجة الطلبات خلال 6 أشهر، لكن كثيراً ما يستغرق وقتاً أطول.' },
      { emoji: '👨‍👩‍👧', q: 'هل يمكن لأطفالي التقدم أيضاً؟', a: 'نعم، لكنه طلب منفصل برسوم منفصلة.' },
      { emoji: '🛂', q: 'هل يجب التنازل عن جنسيتي الأخرى؟', a: 'تسمح المملكة المتحدة بازدواجية الجنسية، لذا في معظم الحالات لا تحتاج للتنازل عن جنسيتك الأخرى.' },
      { emoji: '📖', q: 'ما هو اختبار الحياة في بريطانيا؟', a: 'اختبار حاسوبي مدته 45 دقيقة، 24 سؤالاً. تحتاج 18 إجابة صحيحة للنجاح. يكلف £50.' },
    ],
    helpTitle: 'احصل على مساعدة',
    helpers: [
      { emoji: '📞', name: 'خط المساعدة للجنسية UKVI', desc: 'الخط الرسمي لاستفسارات الجنسية', number: '0300 790 6268', tag: 'رسمي' },
      { emoji: '📚', name: 'اختبار الحياة في بريطانيا', desc: 'احجز اختبارك على الموقع الرسمي', number: '0800 015 4033', tag: 'اختبار' },
      { emoji: '⚖️', name: 'مشورة قانونية مجانية', desc: 'يمكن لـ Citizens Advice إحالتك لمختصين في الهجرة', number: '0800 144 8848', tag: 'مجاني' },
    ],
  },
}

export default function CitizenshipPage() {
  const [lang, setLang] = useState('en')
  const [openFaq, setOpenFaq] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('komek_lang')
    if (stored && TX[stored]) setLang(stored)
    const handler = (e) => { if (TX[e.detail]) setLang(e.detail) }
    window.addEventListener('langchange', handler)
    return () => window.removeEventListener('langchange', handler)
  }, [])

  const t = TX[lang] || TX.en

  return (
    <div style={{ fontFamily: FONT, direction: 'ltr', background: BG, minHeight: '100vh', paddingBottom: 80 }}>

      {/* HERO */}
      <div style={{ background: `linear-gradient(135deg, ${INDIGO_DARK} 0%, #2d2b6b 60%, #3730a3 100%)`, padding: '40px 20px 48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(79,70,229,0.15)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -30, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(52,211,153,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(129,140,248,0.2)', border: '1px solid rgba(129,140,248,0.3)', borderRadius: 20, padding: '4px 14px', marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: INDIGO_LIGHT, letterSpacing: 1.5 }}>{t.heroLabel}</span>
          </div>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🎖️</div>
          <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 900, margin: '0 0 10px', lineHeight: 1.2 }}>{t.heroTitle}</h1>
          <p style={{ color: '#a5b4fc', fontSize: 14, margin: 0, lineHeight: 1.6 }}>{t.heroSub}</p>
        </div>
      </div>

      <div style={{ padding: '16px 16px 0', maxWidth: 480, margin: '0 auto' }}>

        {/* STEPS */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 12, border: `1px solid ${SOFT}`, boxShadow: '0 2px 10px rgba(79,70,229,0.06)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 900, color: INDIGO_DARK, margin: '0 0 16px' }}>{t.stepsTitle}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {t.steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: SOFT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0, position: 'relative' }}>
                  {s.icon}
                  <div style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: '50%', background: INDIGO, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 900, color: '#fff' }}>{i + 1}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: INDIGO, marginBottom: 4 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* REQUIREMENTS */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 12, border: `1px solid ${SOFT}`, boxShadow: '0 2px 10px rgba(79,70,229,0.06)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 900, color: INDIGO_DARK, margin: '0 0 14px' }}>{t.reqTitle}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {t.requirements.map((r, i) => (
              <div key={i} style={{ background: SOFT, borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{r.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: INDIGO_DARK, marginBottom: 4 }}>{r.title}</div>
                <div style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.4 }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 12, border: `1px solid ${SOFT}`, boxShadow: '0 2px 10px rgba(79,70,229,0.06)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 900, color: INDIGO_DARK, margin: '0 0 14px' }}>{t.faqTitle}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {t.faqs.map((f, i) => (
              <div key={i} style={{ borderRadius: 12, border: `1.5px solid ${openFaq === i ? INDIGO : SOFT}`, overflow: 'hidden', transition: 'border 0.2s' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', padding: '13px 16px', background: openFaq === i ? SOFT : '#fff', border: 'none', textAlign: 'left', fontFamily: FONT, fontSize: 14, fontWeight: 700, color: INDIGO_DARK, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{f.emoji}</span>
                    <span>{f.q}</span>
                  </div>
                  <span style={{ color: INDIGO, fontSize: 18, fontWeight: 900, flexShrink: 0 }}>{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '12px 16px', background: SOFT, fontSize: 13, color: '#374151', lineHeight: 1.6, borderTop: `1px solid ${SOFT}` }}>{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* HELP */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 12, border: `1px solid ${SOFT}`, boxShadow: '0 2px 10px rgba(79,70,229,0.06)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 900, color: INDIGO_DARK, margin: '0 0 14px' }}>{t.helpTitle}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {t.helpers.map((h, i) => (
              <div key={i} style={{ background: SOFT, borderRadius: 12, padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{h.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: INDIGO_DARK }}>{h.name}</span>
                    <span style={{ background: INDIGO + '22', color: INDIGO, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{h.tag}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#6B7280' }}>{h.desc}</div>
                </div>
                <a href={`tel:${h.number.replace(/\s/g, '')}`}
                  style={{ background: MINT, color: '#fff', fontWeight: 800, fontSize: 11, padding: '8px 12px', borderRadius: 10, textDecoration: 'none', flexShrink: 0, whiteSpace: 'nowrap' }}>
                  📞 {h.number}
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}