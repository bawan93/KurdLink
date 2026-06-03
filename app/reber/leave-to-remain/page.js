'use client'

import { useState, useEffect } from 'react'

const GREEN_DARK = '#064E3B'
const GREEN = '#059669'
const GREEN_LIGHT = '#F0FDF4'
const GREEN_MID = '#D1FAE5'
const INDIGO = '#4F46E5'
const INDIGO_DARK = '#1C1A4F'
const BG = '#F5F4FF'
const SOFT = '#EDE9FE'

const translations = {
  en: {
    heroTitle: 'Leave to Remain',
    heroSub: 'Everything you need to know about extending your stay in the UK',
    stepsTitle: 'The Process',
    steps: [
      { emoji: '📅', title: 'Apply Early', desc: 'You must apply before your current visa or leave expires. The 42-day window before expiry is the safest time to apply.' },
      { emoji: '📋', title: 'Gather Documents', desc: 'Passport, biometric residence permit, proof of address, financial evidence, and any supporting documents relevant to your visa type.' },
      { emoji: '💻', title: 'Apply Online', desc: 'Most applications are made through the UK Visas and Immigration (UKVI) online portal. Make sure you choose the correct visa category.' },
      { emoji: '🏪', title: 'Biometrics Appointment', desc: 'After applying online, you\'ll need to attend a UK Visa and Citizenship Application Services (UKVCAS) centre to give your fingerprints and photo.' },
      { emoji: '⏳', title: 'Wait for Decision', desc: 'Standard processing can take 8 weeks or more. Priority and Super Priority services are available for faster decisions at extra cost.' },
    ],
    rightsTitle: 'Your Rights While Waiting',
    rights: [
      { emoji: '✅', title: 'Right to Work', desc: 'If you applied before your visa expired, you can usually continue working while waiting.' },
      { emoji: '🏥', title: 'NHS Access', desc: 'You continue to have access to NHS services while your application is being considered.' },
      { emoji: '🏠', title: 'Stay in the UK', desc: 'You have the right to remain in the UK while your application is pending — this is called "section 3C leave".' },
      { emoji: '👨‍👩‍👧', title: 'Family Members', desc: 'Dependants on your application also have the right to stay and access services during this time.' },
    ],
    faqTitle: 'Common Questions',
    faqs: [
      { q: 'What is the 42-day window?', a: 'As of March 2026, you have 42 days before your current leave expires to submit your application. Applying earlier is always safer.' },
      { q: 'What if I miss the deadline?', a: 'If your leave expires before you apply, you will be in the UK without permission. This is called overstaying and can seriously affect future applications. Seek legal advice immediately.' },
      { q: 'Can I travel while my application is pending?', a: 'Generally no — if you leave the UK while your application is pending, it may be treated as withdrawn. Check with an immigration adviser before travelling.' },
      { q: 'How much does it cost?', a: 'Fees vary by visa type and range from £827 to over £1,500. There is also the Immigration Health Surcharge on top. Check the UKVI website for current fees.' },
    ],
    helpTitle: 'Get Help',
    helpers: [
      { emoji: '📞', name: 'UKVI Contact Centre', desc: 'Official helpline for visa and immigration enquiries', number: '0300 790 6268', tag: 'Official' },
      { emoji: '⚖️', name: 'Immigration Legal Advice', desc: 'Citizens Advice can help you find regulated immigration advisers', number: '0800 144 8848', tag: 'Free' },
      { emoji: '🌍', name: 'Migrant Help', desc: 'Free immigration advice and support for asylum seekers', number: '0808 801 0503', tag: 'Free' },
    ],
    faqOpen: 'Show answer',
    faqClose: 'Hide answer',
  },
  ku: {
    heroTitle: 'مانەوەی مۆڵەتدار',
    heroSub: 'هەموو ئەوەی پێویستە بزانیت دەربارەی درێژکردنەوەی مانەوەت لە بریتانیا',
    stepsTitle: 'پرۆسەکە',
    steps: [
      { emoji: '📅', title: 'زوو داوا بکە', desc: 'دەبێت پێش بەسەرچوونی ڤیزا یان مۆڵەتی ئێستات داواکاری بکەیت. مەودای ٤٢ ڕۆژ پێش بەسەرچوون ئامانتریترین کاتە.' },
      { emoji: '📋', title: 'بەڵگەکان کۆ بکەرەوە', desc: 'پاسپۆرت، کارتی ناسنامەی بایۆمێتریک، بەڵگەی ناونیشان، بەڵگەی دارایی، و هەر بەڵگەیەکی پشتگیری.' },
      { emoji: '💻', title: 'ئۆنلاین داوا بکە', desc: 'زۆرینەی داواکاریەکان لەڕێگەی دەرگای ئۆنلاینی UKVI دەکرێن. دلنیابە لە هەڵبژاردنی جۆری ڤیزای دروست.' },
      { emoji: '🏪', title: 'چاوپێکەوتنی بایۆمێتریک', desc: 'دوای داواکاری ئۆنلاین، پێویستە بچیتە ناوەندی UKVCAS بۆ دانی نیشانەی تووت و وێنەت.' },
      { emoji: '⏳', title: 'چاوەڕێی بڕیار', desc: 'پرۆسەکردنی ئاسایی دەتوانێت ٨ هەفتە یان زیاتر بکێشێت. خزمەتگوزاری خێرا و زۆر خێرا بەردەستن.' },
    ],
    rightsTitle: 'مافەکانت لە کاتی چاوەڕێ',
    rights: [
      { emoji: '✅', title: 'مافی کارکردن', desc: 'ئەگەر پێش بەسەرچوونی ڤیزات داواکاری کرد، بەمعمولی دەتوانیت بەردەوام بکەیت لە کارکردن.' },
      { emoji: '🏥', title: 'دەستگەیشتن بە NHS', desc: 'بەردەوام دەستگەیشتنت بە خزمەتگوزارییەکانی NHS هەیە لە کاتی بررسی داواکاری.' },
      { emoji: '🏠', title: 'مانەوە لە بریتانیا', desc: 'مافت هەیە بمێنیتەوە لە بریتانیا لە کاتی چاوەڕێکردن — ئەمەش "مانەوەی خاوەنی ٣C" دەوترێ.' },
      { emoji: '👨‍👩‍👧', title: 'ئەندامانی خێزان', desc: 'ئەوانەی لە داواکاریەکەتدا ئەندامن مافیان هەیە بمێننەوە و خزمەتگوزاریش وەربگرن.' },
    ],
    faqTitle: 'پرسیاری باو',
    faqs: [
      { q: 'مەودای ٤٢ ڕۆژ چییە؟', a: 'لە مارسی ٢٠٢٦، ٤٢ ڕۆژت هەیە پێش بەسەرچوونی مۆڵەتی ئێستات داواکاریت تۆمار بکەیت.' },
      { q: 'ئەگەر ماوەکە لەدەست بدەم چی دەبێت؟', a: 'ئەگەر مۆڵەتت بەسەر بچێت پێش داواکاری، بە بێ مۆڵەت دەبیت لە بریتانیا. ئەمەش "مانەوەی زیادە" دەوترێ. یەکسەر ڕاوێژی یاسایی بخوازە.' },
      { q: 'ئایا دەتوانم گەشت بکەم لە کاتی چاوەڕێ؟', a: 'بەمعمولی نەخێر — ئەگەر بریتانیا بهێڵیت لە کاتی چاوەڕێ، داواکاریەکەت دەتوانرێت وەک کێشانەوە بژمێردرێت.' },
      { q: 'چەند تووشی خەرجی دەبێت؟', a: 'کرێکان بەپێی جۆری ڤیزا جیاوازن و لە ٨٢٧ پاوند تا زیاتر لە ١٥٠٠ پاوند دەگەن.' },
    ],
    helpTitle: 'یارمەتی بخوازە',
    helpers: [
      { emoji: '📞', name: 'ناوەندی پەیوەندی UKVI', desc: 'هێڵی یارمەتی فەرمی بۆ پرسیارەکانی ڤیزا و کۆچ', number: '0300 790 6268', tag: 'فەرمی' },
      { emoji: '⚖️', name: 'ڕاوێژی یاسایی کۆچ', desc: 'Citizens Advice یارمەتیت دەدات بدۆزیتەوە ڕاوێژکارانی رێکخراوی کۆچ', number: '0800 144 8848', tag: 'خۆڕایی' },
      { emoji: '🌍', name: 'Migrant Help', desc: 'ڕاوێژی خۆڕایی بۆ داواکارانی پەناهەندەیی', number: '0808 801 0503', tag: 'خۆڕایی' },
    ],
    faqOpen: 'وەڵام پیشان بدە',
    faqClose: 'شاردنەوە',
  },
  fa: {
    heroTitle: 'اجازه اقامت',
    heroSub: 'همه چیزی که باید درباره تمدید اقامت در بریتانیا بدانی',
    stepsTitle: 'مراحل',
    steps: [
      { emoji: '📅', title: 'زود درخواست بده', desc: 'باید قبل از انقضای ویزا یا اجازه اقامت فعلی‌ات درخواست بدهی. پنجره ۴۲ روزه قبل از انقضا امن‌ترین زمان است.' },
      { emoji: '📋', title: 'مدارک را جمع کن', desc: 'پاسپورت، کارت اقامت بیومتریک، مدرک آدرس، مدارک مالی، و هر مدرک پشتیبانی مرتبط.' },
      { emoji: '💻', title: 'آنلاین درخواست بده', desc: 'بیشتر درخواست‌ها از طریق درگاه آنلاین UKVI انجام می‌شود. مطمئن شو دسته ویزای درست را انتخاب می‌کنی.' },
      { emoji: '🏪', title: 'نوبت بیومتریک', desc: 'بعد از درخواست آنلاین، باید به مرکز UKVCAS بروی تا اثر انگشت و عکست را بدهی.' },
      { emoji: '⏳', title: 'منتظر تصمیم باش', desc: 'پردازش استاندارد می‌تواند ۸ هفته یا بیشتر طول بکشد. خدمات سریع و فوق‌سریع با هزینه بیشتر در دسترس است.' },
    ],
    rightsTitle: 'حقوق تو در زمان انتظار',
    rights: [
      { emoji: '✅', title: 'حق کار', desc: 'اگر قبل از انقضای ویزا درخواست دادی، معمولاً می‌توانی در حین انتظار به کار ادامه دهی.' },
      { emoji: '🏥', title: 'دسترسی به NHS', desc: 'در حین بررسی درخواستت همچنان به خدمات NHS دسترسی داری.' },
      { emoji: '🏠', title: 'ماندن در بریتانیا', desc: 'حق داری در حین انتظار در بریتانیا بمانی — به این "اجازه بند ۳C" می‌گویند.' },
      { emoji: '👨‍👩‍👧', title: 'اعضای خانواده', desc: 'افراد تحت تکفل در درخواستت هم حق ماندن و دریافت خدمات را دارند.' },
    ],
    faqTitle: 'سوالات رایج',
    faqs: [
      { q: 'پنجره ۴۲ روزه چیست؟', a: 'از مارس ۲۰۲۶، ۴۲ روز قبل از انقضای اجازه فعلی فرصت داری درخواست بدهی. زودتر اقدام کردن همیشه امن‌تر است.' },
      { q: 'اگر مهلت را از دست بدهم چه می‌شود؟', a: 'اگر اجازه‌ات قبل از درخواست منقضی شود، بدون مجوز در بریتانیا خواهی بود. فوری مشاوره حقوقی بگیر.' },
      { q: 'آیا می‌توانم در حین انتظار سفر کنم؟', a: 'معمولاً نه — اگر در حین انتظار از بریتانیا خارج شوی، ممکن است درخواستت کنسل شود.' },
      { q: 'هزینه چقدر است؟', a: 'هزینه‌ها بر اساس نوع ویزا بین ۸۲۷ تا بیش از ۱۵۰۰ پوند متغیر است.' },
    ],
    helpTitle: 'کمک بگیر',
    helpers: [
      { emoji: '📞', name: 'مرکز تماس UKVI', desc: 'خط کمک رسمی برای سوالات ویزا و مهاجرت', number: '0300 790 6268', tag: 'رسمی' },
      { emoji: '⚖️', name: 'مشاوره حقوقی مهاجرت', desc: 'Citizens Advice می‌تواند مشاوران مهاجرتی معتبر را پیدا کنی', number: '0800 144 8848', tag: 'رایگان' },
      { emoji: '🌍', name: 'Migrant Help', desc: 'مشاوره رایگان مهاجرتی برای پناهجویان', number: '0808 801 0503', tag: 'رایگان' },
    ],
    faqOpen: 'نمایش پاسخ',
    faqClose: 'پنهان',
  },
  ar: {
    heroTitle: 'الإذن بالبقاء',
    heroSub: 'كل ما تحتاج معرفته حول تمديد إقامتك في المملكة المتحدة',
    stepsTitle: 'الخطوات',
    steps: [
      { emoji: '📅', title: 'تقدم مبكراً', desc: 'يجب التقدم قبل انتهاء تأشيرتك الحالية. نافذة الـ 42 يوماً قبل الانتهاء هي الوقت الأكثر أماناً.' },
      { emoji: '📋', title: 'اجمع المستندات', desc: 'جواز السفر، بطاقة الإقامة البيومترية، إثبات العنوان، المستندات المالية، وأي وثائق داعمة.' },
      { emoji: '💻', title: 'تقدم إلكترونياً', desc: 'معظم الطلبات تتم عبر بوابة UKVI الإلكترونية. تأكد من اختيار فئة التأشيرة الصحيحة.' },
      { emoji: '🏪', title: 'موعد القياسات الحيوية', desc: 'بعد التقدم إلكترونياً، ستحتاج لزيارة مركز UKVCAS لتقديم بصماتك وصورتك.' },
      { emoji: '⏳', title: 'انتظر القرار', desc: 'قد تستغرق المعالجة العادية 8 أسابيع أو أكثر. خدمات أسرع متاحة بتكلفة إضافية.' },
    ],
    rightsTitle: 'حقوقك أثناء الانتظار',
    rights: [
      { emoji: '✅', title: 'حق العمل', desc: 'إذا تقدمت قبل انتهاء تأشيرتك، يمكنك عادةً الاستمرار في العمل أثناء الانتظار.' },
      { emoji: '🏥', title: 'الوصول إلى NHS', desc: 'تستمر في الوصول إلى خدمات NHS أثناء النظر في طلبك.' },
      { emoji: '🏠', title: 'البقاء في المملكة المتحدة', desc: 'لديك الحق في البقاء في المملكة المتحدة أثناء انتظار قرار طلبك.' },
      { emoji: '👨‍👩‍👧', title: 'أفراد الأسرة', desc: 'المعالون في طلبك لديهم أيضاً حق البقاء والحصول على الخدمات.' },
    ],
    faqTitle: 'أسئلة شائعة',
    faqs: [
      { q: 'ما هي نافذة الـ 42 يوماً؟', a: 'اعتباراً من مارس 2026، لديك 42 يوماً قبل انتهاء إقامتك الحالية لتقديم طلبك. التقدم المبكر دائماً أكثر أماناً.' },
      { q: 'ماذا يحدث إذا فاتني الموعد؟', a: 'إذا انتهت إقامتك قبل التقدم، ستكون في المملكة المتحدة بدون تصريح. اطلب مشورة قانونية فوراً.' },
      { q: 'هل يمكنني السفر أثناء الانتظار؟', a: 'بشكل عام لا — إذا غادرت المملكة المتحدة أثناء انتظار قرار طلبك، قد يُعتبر طلبك مسحوباً.' },
      { q: 'كم تكلف؟', a: 'تتراوح الرسوم حسب نوع التأشيرة من 827 جنيهاً إلى أكثر من 1500 جنيه.' },
    ],
    helpTitle: 'احصل على مساعدة',
    helpers: [
      { emoji: '📞', name: 'مركز اتصال UKVI', desc: 'الخط الرسمي لاستفسارات التأشيرة والهجرة', number: '0300 790 6268', tag: 'رسمي' },
      { emoji: '⚖️', name: 'المشورة القانونية للهجرة', desc: 'Citizens Advice تساعدك في إيجاد مستشاري هجرة معتمدين', number: '0800 144 8848', tag: 'مجاني' },
      { emoji: '🌍', name: 'Migrant Help', desc: 'مشورة هجرة مجانية لطالبي اللجوء', number: '0808 801 0503', tag: 'مجاني' },
    ],
    faqOpen: 'عرض الإجابة',
    faqClose: 'إخفاء',
  },
}

export default function LeaveToRemainPage() {
  const [lang, setLang] = useState('en')
  const [openFaq, setOpenFaq] = useState(null)
  const t = translations[lang] || translations.en
  const isRTL = ['ku', 'fa', 'ar'].includes(lang)

  useEffect(() => {
    const stored = localStorage.getItem('komek_lang')
    if (stored) setLang(stored)
    const handler = (e) => setLang(e.detail)
    window.addEventListener('langchange', handler)
    return () => window.removeEventListener('langchange', handler)
  }, [])

  return (
    <div style={{ fontFamily: 'Nunito, sans-serif', background: BG, minHeight: '100vh', paddingBottom: 80, direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${GREEN_DARK} 0%, #065F46 100%)`, padding: '40px 20px 56px', textAlign: 'center' }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>📋</div>
        <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 900, margin: '0 0 10px', lineHeight: 1.2 }}>{t.heroTitle}</h1>
        <p style={{ color: '#6EE7B7', fontSize: 14, fontWeight: 500, margin: 0, maxWidth: 300, marginLeft: 'auto', marginRight: 'auto' }}>{t.heroSub}</p>
      </div>

      <div style={{ padding: '0 16px', marginTop: -24 }}>

        {/* Steps */}
        <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 4px 20px rgba(6,78,59,0.08)', padding: 20, marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 900, color: GREEN_DARK, margin: '0 0 16px' }}>{t.stepsTitle}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {t.steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: GREEN_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{s.emoji}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: GREEN_DARK, marginBottom: 3 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rights */}
        <div style={{ background: GREEN_LIGHT, borderRadius: 20, padding: 20, marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 900, color: GREEN_DARK, margin: '0 0 14px' }}>{t.rightsTitle}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {t.rights.map((r, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 14, padding: 14, boxShadow: '0 1px 6px rgba(6,78,59,0.06)' }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{r.emoji}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: GREEN_DARK, marginBottom: 4 }}>{r.title}</div>
                <div style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.4 }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 4px 20px rgba(6,78,59,0.08)', padding: 20, marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 900, color: GREEN_DARK, margin: '0 0 14px' }}>{t.faqTitle}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {t.faqs.map((f, i) => (
              <div key={i} style={{ borderRadius: 12, border: `1.5px solid ${GREEN_MID}`, overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', padding: '13px 16px', background: openFaq === i ? GREEN_LIGHT : '#fff', border: 'none', textAlign: isRTL ? 'right' : 'left', fontFamily: 'Nunito, sans-serif', fontSize: 14, fontWeight: 700, color: GREEN_DARK, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span>{f.q}</span>
                  <span style={{ color: GREEN, fontSize: 18, fontWeight: 900 }}>{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '12px 16px', background: GREEN_LIGHT, fontSize: 13, color: '#374151', lineHeight: 1.6, borderTop: `1px solid ${GREEN_MID}` }}>{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Help */}
        <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 4px 20px rgba(6,78,59,0.08)', padding: 20, marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 900, color: GREEN_DARK, margin: '0 0 14px' }}>{t.helpTitle}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {t.helpers.map((h, i) => (
              <div key={i} style={{ background: GREEN_LIGHT, borderRadius: 14, padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{h.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: GREEN_DARK }}>{h.name}</span>
                    <span style={{ background: GREEN_MID, color: GREEN, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{h.tag}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#6B7280' }}>{h.desc}</div>
                </div>
                <a href={`tel:${h.number.replace(/\s/g, '')}`} style={{ background: GREEN, color: '#fff', fontWeight: 800, fontSize: 12, padding: '8px 12px', borderRadius: 10, textDecoration: 'none', flexShrink: 0, whiteSpace: 'nowrap' }}>
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