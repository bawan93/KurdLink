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
    heroTitle: 'Leave to Remain',
    heroSub: 'Everything you need to know about extending your stay in the UK',
    stepsTitle: 'The Process',
    steps: [
      { icon: '📅', title: 'Apply Early', desc: 'You must apply before your current visa or leave expires. The 42-day window before expiry is the safest time to apply.' },
      { icon: '📋', title: 'Gather Documents', desc: 'Passport, biometric residence permit, proof of address, financial evidence, and any supporting documents relevant to your visa type.' },
      { icon: '💻', title: 'Apply Online', desc: 'Most applications are made through the UK Visas and Immigration (UKVI) online portal. Make sure you choose the correct visa category.' },
      { icon: '🏪', title: 'Biometrics Appointment', desc: 'After applying online, you\'ll need to attend a UK Visa and Citizenship Application Services (UKVCAS) centre to give your fingerprints and photo.' },
      { icon: '⏳', title: 'Wait for Decision', desc: 'Standard processing can take 8 weeks or more. Priority and Super Priority services are available for faster decisions at extra cost.' },
    ],
    rightsTitle: 'Your Rights While Waiting',
    rights: [
      { icon: '✅', title: 'Right to Work', desc: 'If you applied before your visa expired, you can usually continue working while waiting.' },
      { icon: '🏥', title: 'NHS Access', desc: 'You continue to have access to NHS services while your application is being considered.' },
      { icon: '🏠', title: 'Stay in the UK', desc: 'You have the right to remain in the UK while your application is pending — this is called "section 3C leave".' },
      { icon: '👨‍👩‍👧', title: 'Family Members', desc: 'Dependants on your application also have the right to stay and access services during this time.' },
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
    showAnswer: 'Show answer',
    hideAnswer: 'Hide answer',
  },

  ku: {
    heroTitle: 'پاسپۆرتەکەت وەرگرتووە',
    heroSub: 'هەموو ئەو شتانەی کە پێویستە بزانیت دەربارەی درێژکردنەوەی مانەوەت لە بەریتانیا',
    stepsTitle: 'پرۆسەکە',
    steps: [
      { icon: '📅', title: 'زوو داواکاری پێشکەش بکە', desc: '' },
      { icon: '📋', title: 'پێویستە بەڵگەنامەکان کۆبکەیتەوە', desc: 'پاسپۆرت، مۆڵەتی مانەوەی بایۆمەتری، بەڵگەی ناونیشان، بەڵگەی دارایی.' },
      { icon: '💻', title: 'داواکاری پێشکەشکردن بە شێوەی ئۆنلاین', desc: 'زۆربەی داواکارییەکان لە ڕێگەی پۆرتاڵی ئۆنلاین UKVI ئەنجام دەدرێن. دڵنیابە کە پۆلی ڤیزەی دروست هەڵدەبژێریت.' },
      { icon: '🏪', title: 'چاوپێکەوتنی بایۆمەتری', desc: 'دوای پێشکەشکردنی داواکاری بە شێوەی ئۆنلاین پێویستە بەشداری سەنتەری UKVCAS بکەیت بۆ پێدانی پەنجەمۆر و وێنەکەت.' },
      { icon: '⏳', title: 'چاوەڕێی بڕیاردان', desc: 'پرۆسێسی ستاندارد دەتوانێت 8 هەفتە یان زیاتر بخایەنێت. خزمەتگوزارییەکانی ئەولەویەت و ئەولەویەتی سەرەکی بەردەستە بۆ بڕیاردانی خێراتر بە تێچووی زیادە.' },
    ],
    rightsTitle: 'مافەکانت لەکاتی چاوەڕوانیدا',
    rights: [
      { icon: '✅', title: 'مافی کارکردن', desc: '' },
      { icon: '🏥', title: 'دەستڕاگەیشتن بە NHS', desc: 'تۆ بەردەوام دەبیت لە دەستڕاگەیشتن بە خزمەتگوزارییەکانی NHS لەکاتێکدا چاوەڕێی بڕیارەکەت دەکەیت.' },
      { icon: '🏠', title: 'مانەوە لە بەریتانیا', desc: 'تۆ مافی ئەوەت هەیە لە بەریتانیا بمێنیتەوە لەکاتێکدا داواکارییەکەت هەڵپەسێردراوە — ئەمە پێی دەوترێت مۆڵەتی بەشی 3C.' },
      { icon: '👨‍👩‍👧', title: 'ئەندامانی خێزان', desc: 'هەر کەسێک کە لەگەڵت داواکاری پێشکەش دەکەیت، هەروەها مافی مانەوە و دەستڕاگەیشتن بە خزمەتگوزارییەکانی هەیە لەم ماوەیەدا.' },
    ],
    faqTitle: 'پرسیارە باوەکان',
    faqs: [
      { q: 'پەنجەرەی 42 ڕۆژە چییە؟', a: 'لە مانگی ئازاری 2026ەوە 42 ڕۆژت هەیە پێش تەواوبوونی مۆڵەتی ئێستات بۆ پێشکەشکردنی داواکاری. بە زووترین کات بەکاری بهێنە.' },
      { q: 'چی ئەگەر وادەی دیاریکراوم لەدەستدا؟', a: 'ئەگەر مۆڵەتەکەت بەسەرچوو پێش ئەوەی داواکاری پێشکەش بکەیت ئەوا بەبێ مۆڵەت لە بەریتانیا دەبیت. ئەمەش پێی دەوترێت زیادەڕۆیی و دەتوانێت کاریگەری جددی لەسەر بەکارهێنانەکانی داهاتوو هەبێت. دەستبەجێ داوای ڕاوێژی یاسایی بکە.' },
      { q: 'ئایا دەتوانم گەشت بکەم لەکاتێکدا داواکارییەکەم هەڵپەسێردراوە؟', a: 'بەگشتی نەخێر — ئەگەر تۆ بەریتانیا بەجێبهێڵیت لەکاتێکدا داواکارییەکەت هەڵپەسێردراوە لەوانەیە وەک کشانەوە مامەڵەی لەگەڵدا بکرێت. پێش گەشتکردن لە ڕاوێژکاری کۆچبەری بپرسە.' },
      { q: 'تێچووی چەندە؟', a: 'تێچوونەکان بەپێی جۆری ڤیزە دەگۆڕێت. بۆ زانینی کرێی ئێستا سەیری ماڵپەڕی UKVI بکە.' },
    ],
    helpTitle: 'یارمەتی وەربگرە',
    helpers: [
      { emoji: '📞', name: 'سەنتەری پەیوەندی UKVI', desc: 'هێڵی یارمەتی فەرمی بۆ پرسیاری ڤیزە و کۆچبەری', number: '0300 790 6268', tag: 'فەرمی' },
      { emoji: '⚖️', name: 'ئامۆژگاری یاسایی کۆچبەری', desc: 'ئامۆژگاری هاووڵاتیان دەتوانێت یارمەتیت بدات بۆ دۆزینەوەی ڕاوێژکاری ڕێکخراو لە بواری کۆچبەری', number: '0800 144 8848', tag: 'خۆڕایی' },
      { emoji: '🌍', name: 'یارمەتی کۆچبەران', desc: 'ئامۆژگاری و پاڵپشتی کۆچبەری بێبەرامبەر بۆ پەناخوازان', number: '0808 801 0503', tag: 'خۆڕایی' },
    ],
    showAnswer: 'وەڵام پیشان بدە',
    hideAnswer: 'وەڵام بشارەوە',
  },

  fa: {
    heroTitle: 'اجازه اقامت',
    heroSub: 'همه چیزی که باید درباره تمدید اقامت در بریتانیا بدانی',
    stepsTitle: 'مراحل',
    steps: [
      { icon: '📅', title: 'زود درخواست بده', desc: 'باید قبل از انقضای ویزا یا اجازه اقامت فعلی‌ات درخواست بدهی. پنجره ۴۲ روزه قبل از انقضا امن‌ترین زمان است.' },
      { icon: '📋', title: 'مدارک را جمع کن', desc: 'پاسپورت، کارت اقامت بیومتریک، مدرک آدرس، مدارک مالی، و هر مدرک پشتیبانی مرتبط.' },
      { icon: '💻', title: 'آنلاین درخواست بده', desc: 'بیشتر درخواست‌ها از طریق درگاه آنلاین UKVI انجام می‌شود. مطمئن شو دسته ویزای درست را انتخاب می‌کنی.' },
      { icon: '🏪', title: 'نوبت بیومتریک', desc: 'بعد از درخواست آنلاین، باید به مرکز UKVCAS بروی تا اثر انگشت و عکست را بدهی.' },
      { icon: '⏳', title: 'منتظر تصمیم باش', desc: 'پردازش استاندارد می‌تواند ۸ هفته یا بیشتر طول بکشد. خدمات سریع و فوق‌سریع با هزینه بیشتر در دسترس است.' },
    ],
    rightsTitle: 'حقوق تو در زمان انتظار',
    rights: [
      { icon: '✅', title: 'حق کار', desc: 'اگر قبل از انقضای ویزا درخواست دادی، معمولاً می‌توانی در حین انتظار به کار ادامه دهی.' },
      { icon: '🏥', title: 'دسترسی به NHS', desc: 'در حین بررسی درخواستت همچنان به خدمات NHS دسترسی داری.' },
      { icon: '🏠', title: 'ماندن در بریتانیا', desc: 'حق داری در حین انتظار در بریتانیا بمانی — به این "اجازه بند ۳C" می‌گویند.' },
      { icon: '👨‍👩‍👧', title: 'اعضای خانواده', desc: 'افراد تحت تکفل در درخواستت هم حق ماندن و دریافت خدمات را دارند.' },
    ],
    faqTitle: 'سوالات رایج',
    faqs: [
      { q: 'پنجره ۴۲ روزه چیست؟', a: 'از مارس ۲۰۲۶، ۴۲ روز قبل از انقضای اجازه فعلی فرصت داری درخواست بدهی. زودتر اقدام کردن همیشه امن‌تر است.' },
      { q: 'اگر مهلت را از دست بدهم چه می‌شود؟', a: 'اگر اجازه‌ات قبل از درخواست منقضی شود، بدون مجوز در بریتانیا خواهی بود. فوری مشاوره حقوقی بگیر.' },
      { q: 'آیا می‌توانم در حین انتظار سفر کنم؟', a: 'معمولاً نه — اگر در حین انتظار از بریتانیا خارج شوی، ممکن است درخواستت کنسل شود.' },
      { q: 'هزینه چقدر است؟', a: 'هزینه‌ها بر اساس نوع ویزا بین ۸۲۷ تا بیش از ۱۵۰۰ پوند متغیر است. علاوه بر این، هزینه Immigration Health Surcharge هم اضافه می‌شود. برای هزینه‌های فعلی سایت UKVI را چک کن.' },
    ],
    helpTitle: 'کمک بگیر',
    helpers: [
      { emoji: '📞', name: 'مرکز تماس UKVI', desc: 'خط کمک رسمی برای سوالات ویزا و مهاجرت', number: '0300 790 6268', tag: 'رسمی' },
      { emoji: '⚖️', name: 'مشاوره حقوقی مهاجرت', desc: 'Citizens Advice می‌تواند مشاوران مهاجرتی معتبر را پیدا کنی', number: '0800 144 8848', tag: 'رایگان' },
      { emoji: '🌍', name: 'Migrant Help', desc: 'مشاوره رایگان مهاجرتی برای پناهجویان', number: '0808 801 0503', tag: 'رایگان' },
    ],
    showAnswer: 'نمایش پاسخ',
    hideAnswer: 'پنهان',
  },

  ar: {
    heroTitle: 'الإذن بالبقاء',
    heroSub: 'كل ما تحتاج معرفته حول تمديد إقامتك في المملكة المتحدة',
    stepsTitle: 'الخطوات',
    steps: [
      { icon: '📅', title: 'تقدم مبكراً', desc: 'يجب التقدم قبل انتهاء تأشيرتك الحالية. نافذة الـ 42 يوماً قبل الانتهاء هي الوقت الأكثر أماناً.' },
      { icon: '📋', title: 'اجمع المستندات', desc: 'جواز السفر، بطاقة الإقامة البيومترية، إثبات العنوان، المستندات المالية، وأي وثائق داعمة.' },
      { icon: '💻', title: 'تقدم إلكترونياً', desc: 'معظم الطلبات تتم عبر بوابة UKVI الإلكترونية. تأكد من اختيار فئة التأشيرة الصحيحة.' },
      { icon: '🏪', title: 'موعد القياسات الحيوية', desc: 'بعد التقدم إلكترونياً، ستحتاج لزيارة مركز UKVCAS لتقديم بصماتك وصورتك.' },
      { icon: '⏳', title: 'انتظر القرار', desc: 'قد تستغرق المعالجة العادية 8 أسابيع أو أكثر. خدمات أسرع متاحة بتكلفة إضافية.' },
    ],
    rightsTitle: 'حقوقك أثناء الانتظار',
    rights: [
      { icon: '✅', title: 'حق العمل', desc: 'إذا تقدمت قبل انتهاء تأشيرتك، يمكنك عادةً الاستمرار في العمل أثناء الانتظار.' },
      { icon: '🏥', title: 'الوصول إلى NHS', desc: 'تستمر في الوصول إلى خدمات NHS أثناء النظر في طلبك.' },
      { icon: '🏠', title: 'البقاء في المملكة المتحدة', desc: 'لديك الحق في البقاء في المملكة المتحدة أثناء انتظار قرار طلبك.' },
      { icon: '👨‍👩‍👧', title: 'أفراد الأسرة', desc: 'المعالون في طلبك لديهم أيضاً حق البقاء والحصول على الخدمات.' },
    ],
    faqTitle: 'أسئلة شائعة',
    faqs: [
      { q: 'ما هي نافذة الـ 42 يوماً؟', a: 'اعتباراً من مارس 2026، لديك 42 يوماً قبل انتهاء إقامتك الحالية لتقديم طلبك. التقدم المبكر دائماً أكثر أماناً.' },
      { q: 'ماذا يحدث إذا فاتني الموعد؟', a: 'إذا انتهت إقامتك قبل التقدم، ستكون في المملكة المتحدة بدون تصريح. اطلب مشورة قانونية فوراً.' },
      { q: 'هل يمكنني السفر أثناء الانتظار؟', a: 'بشكل عام لا — إذا غادرت المملكة المتحدة أثناء انتظار قرار طلبك، قد يُعتبر طلبك مسحوباً.' },
      { q: 'كم تكلف؟', a: 'تتراوح الرسوم حسب نوع التأشيرة من 827 جنيهاً إلى أكثر من 1500 جنيه. يُضاف إلى ذلك رسوم Immigration Health Surcharge. تحقق من موقع UKVI للرسوم الحالية.' },
    ],
    helpTitle: 'احصل على مساعدة',
    helpers: [
      { emoji: '📞', name: 'مركز اتصال UKVI', desc: 'الخط الرسمي لاستفسارات التأشيرة والهجرة', number: '0300 790 6268', tag: 'رسمي' },
      { emoji: '⚖️', name: 'المشورة القانونية للهجرة', desc: 'Citizens Advice تساعدك في إيجاد مستشاري هجرة معتمدين', number: '0800 144 8848', tag: 'مجاني' },
      { emoji: '🌍', name: 'Migrant Help', desc: 'مشورة هجرة مجانية لطالبي اللجوء', number: '0808 801 0503', tag: 'مجاني' },
    ],
    showAnswer: 'عرض الإجابة',
    hideAnswer: 'إخفاء',
  },
}

export default function LeaveToRemainPage() {
  const [lang, setLang] = useState('en')
  const [openFaq, setOpenFaq] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('komek_lang')
    if (saved && TX[saved]) setLang(saved)
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
            <span style={{ fontSize: 11, fontWeight: 800, color: INDIGO_LIGHT, letterSpacing: 1.5 }}>STAGE 3</span>
          </div>
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
                  <div style={{ fontSize: 14, fontWeight: 800, color: INDIGO, marginBottom: s.desc ? 4 : 0 }}>{s.title}</div>
                  {s.desc ? <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6 }}>{s.desc}</div> : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHTS */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 12, border: `1px solid ${SOFT}`, boxShadow: '0 2px 10px rgba(79,70,229,0.06)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 900, color: INDIGO_DARK, margin: '0 0 14px' }}>{t.rightsTitle}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {t.rights.map((r, i) => (
              <div key={i} style={{ background: SOFT, borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{r.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: INDIGO_DARK, marginBottom: r.desc ? 4 : 0 }}>{r.title}</div>
                {r.desc ? <div style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.4 }}>{r.desc}</div> : null}
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
                  style={{ width: '100%', padding: '13px 16px', background: openFaq === i ? SOFT : '#fff', border: 'none', textAlign: 'left', fontFamily: FONT, fontSize: 14, fontWeight: 700, color: INDIGO_DARK, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{f.q}</span>
                  <span style={{ color: INDIGO, fontSize: 18, fontWeight: 900, flexShrink: 0, marginLeft: 8 }}>{openFaq === i ? '−' : '+'}</span>
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