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
    heroLabel: 'YOUR JOURNEY',
    heroTitle: 'New to the UK.',
    heroTitleItalic: "Here's what to do.",
    heroSub: 'A clear honest guide for anyone who has just arrived and needs to claim asylum in the UK.',
    stepsLabel: 'STEP BY STEP',
    stepsTitle: 'How the Asylum Process Works',
    steps: [
      { n: '1', icon: '🛬', title: 'Claim Asylum', desc: 'At the airport, port or train station, tell an immigration officer: "I want to claim asylum." You can do this with no documents.' },
      { n: '2', icon: '📋', title: 'Screening Interview', desc: 'A short interview with the Home Office. Basic questions about who you are and why you left. A free interpreter is your right.' },
      { n: '3', icon: '🪪', title: 'Get Your ARC Card', desc: 'Your Asylum Registration Card is your ID. It gives you access to housing support, NHS and other services. Keep it safe.' },
      { n: '4', icon: '🏠', title: 'Apply for Support', desc: 'If you have no money or home, apply for asylum support: £49.18 per week per person on an ASPEN card, plus accommodation.' },
      { n: '5', icon: '⚖️', title: 'Get a Free Lawyer', desc: 'This is the most important step. You are entitled to free legal aid. Call Migrant Help free: 0808 8010 503' },
      { n: '6', icon: '🗣️', title: 'Full Asylum Interview', desc: 'Your main interview where you explain your case. Bring all evidence. Your lawyer should be with you. Be honest and detailed.' },
    ],
    rightsTitle: 'What You Are Entitled To',
    rights: [
      { icon: '🏥', title: 'Free NHS Healthcare', desc: 'From day one. No documents needed. Always request a free interpreter.' },
      { icon: '🎒', title: 'Free School for Children', desc: 'All children 5–16 must be in school. The council must find a place.' },
      { icon: '💳', title: 'Financial Support', desc: '£49.18 per week on an ASPEN card if destitute.' },
      { icon: '⚖️', title: 'Free Legal Advice', desc: 'You are entitled to legal aid. Get a lawyer as soon as possible.' },
      { icon: '🌍', title: 'Free Interpreter', desc: 'For every interview, appointment or meeting. Always demand it.' },
      { icon: '🛡️', title: 'Cannot Be Deported', desc: 'While your claim or appeal is active you cannot be removed from the UK.' },
    ],
    rightsExtra: 'After 12 months you may be eligible to apply for the right to work.',
    helpTitle: 'Who to Call',
    helpers: [
      { emoji: '📞', name: 'Migrant Help', desc: 'Free advice and support for asylum seekers', number: '0808 8010 503', tag: 'Free · 24/7' },
      { emoji: '⚖️', name: 'Legal Aid Agency', desc: 'Free legal representation for asylum cases', number: '0300 200 2020', tag: 'Free' },
      { emoji: '💙', name: 'Samaritans', desc: 'Mental health crisis support', number: '116 123', tag: 'Free · 24/7' },
      { emoji: '🏠', name: 'Shelter', desc: 'Housing crisis and homelessness help', number: '0808 800 4444', tag: 'Free' },
    ],
    disclaimer: '⚠️ This guide is for information only. Laws and policies change. Always get personal legal advice.',
  },

  ku: {
    heroLabel: 'گەشتەکەت',
    heroTitle: 'تۆ تازەی لە بەریتانیا و پێویستە چی بکەیت.',
    heroTitleItalic: '',
    heroSub: 'ڕێنماییەکی ڕوون و ڕاستگۆیانە بۆ هەر کەسێک کە تازە گەیشتووە و پێویستی بە داوای مافی پەنابەری هەیە لە بەریتانیا.',
    stepsLabel: 'هەنگاو بە هەنگاو',
    stepsTitle: 'چۆنیەتی کارکردنی پرۆسەی پەنابەری',
    steps: [
      { n: '١', icon: '🛬', title: 'داوای پەنابەری', desc: 'هەر کە گەیشتیت بە ئەفسەرێکی کۆچبەری بڵێ دەمەوێت داوای مافی پەنابەری بکەم. دەتوانیت ئەم کارە بکەیت بەبێ هیچ بەڵگەنامەیەک.' },
      { n: '٢', icon: '📋', title: 'چاوپێکەوتنی سکرینکردن', desc: 'چاوپێکەوتنێکی کورت لەگەڵ هۆم ئۆفیس. پرسیارە بنەڕەتییەکان سەبارەت بەوەی کە تۆ کێیت و بۆچی هاتوویت. دەتوانیت داوای وەرگێڕ بکەیت.' },
      { n: '٣', icon: '🪪', title: 'بەدەست بهێنە ARC کارتی', desc: 'کارتی تۆمارکردنی پەنابەریت ناسنامەی تۆیە. دەستڕاگەیشتن بە پشتگیری نیشتەجێبوون NHS و خزمەتگوزارییەکانی ترت پێدەبەخشێت. بە سەلامەتی بیهێڵەرەوە.' },
      { n: '٤', icon: '🏠', title: 'داواکاری پێشکەش بکە بۆ پشتگیری', desc: 'ئەگەر پارەت نییە یان ماڵت نییە داوای پاڵپشتی پەنابەری بکە: ٤٩.١٨ پاوەند لە هەفتەیەکدا بۆ هەر کەسێک لەسەر کارتی ASPEN لەگەڵ شوێنی نیشتەجێبوون.' },
      { n: '٥', icon: '⚖️', title: 'پارێزەرێکی بێ بەرامبەر بەدەست بهێنە', desc: 'ئەمە گرنگترین هەنگاوە. تۆ مافی یارمەتی یاسایی بێبەرامبەرت هەیە. پەیوەندی بکەن بە یارمەتی کۆچبەران بەخۆڕایی: 0808 8010 503' },
      { n: '٦', icon: '🗣️', title: 'چاوپێکەوتنی تەواوی پەنابەری', desc: 'چاوپێکەوتنی سەرەکیت کە تێیدا کەیسەکەت ڕوون دەکەیتەوە. هەموو بەڵگەکان لەگەڵ خۆتان بهێنن. پارێزەرەکەت لەگەڵت بێت. ڕاستگۆ و وردبین بە.' },
    ],
    rightsTitle: 'ئەوەی مافی خۆتە',
    rights: [
      { icon: '🏥', title: 'چاودێری تەندروستی NHS بەخۆڕایی', desc: 'لە ڕۆژی یەکەمەوە. هیچ بەڵگەنامەیەک پێویست نییە. هەمیشە داوای وەرگێڕێکی بێبەرامبەر بکە.' },
      { icon: '🎒', title: 'قوتابخانەی بێ بەرامبەر بۆ منداڵان', desc: 'هەموو منداڵانی ٥ تا ١٦ ساڵ دەبێت لە قوتابخانە بن. ئەنجوومەنی ناوخۆیی دەبێت شوێنێکیان بۆ بدۆزێتەوە.' },
      { icon: '💳', title: 'پاڵپشتی دارایی', desc: '٤٩.١٨ پاوەند بۆ هەفتەیەک لەسەر کارتی ASPEN.' },
      { icon: '⚖️', title: 'ئامۆژگاری یاسایی بەخۆڕایی', desc: 'تۆ مافی یارمەتی یاسایی هەیە. بە زووترین کات پارێزەرێک وەربگرە.' },
      { icon: '🌍', title: 'داوای وەرگێڕ بکە', desc: 'بۆ هەموو چاوپێکەوتنێک یان کۆبوونەوەیەک. هەمیشە داوای بکە.' },
      { icon: '🛡️', title: 'ناتوانرێت دیپۆرت بکرێتەوە', desc: 'لەکاتێکدا تۆ داواکاری یان دووبارە داواکاری پێشکەش دەکەیت، ناتوانرێت لە بەریتانیا دووربخرێتەوە.' },
    ],
    rightsExtra: 'دوای ١٢ مانگ چاوەڕوانی مافی داواکردنی کار کردنت هەییە',
    helpTitle: 'دوای یارمەتی بکە',
    helpers: [
      { emoji: '📞', name: 'Migrant Help', desc: 'ئامۆژگاری و پشتیوانی بێبەرامبەر بۆ پەناخوازان', number: '0808 8010 503', tag: 'بەخۆڕایی' },
      { emoji: '⚖️', name: 'Legal Aid Agency', desc: 'نوێنەرایەتی یاسایی ئازاد بۆ کەیسەکانی پەنابەری', number: '0300 200 2020', tag: 'بەخۆڕایی' },
      { emoji: '💙', name: 'Samaritans', desc: 'پشتگیری لە قەیرانی تەندروستی دەروونی', number: '116 123', tag: 'بەخۆڕایی' },
      { emoji: '🏠', name: 'Shelter', desc: 'قەیرانی نیشتەجێبوون و یارمەتی بێ ماڵ و حاڵ', number: '0808 800 4444', tag: 'بەخۆڕایی' },
    ],
    disclaimer: '⚠️ ئەم ڕێنماییە تەنها بۆ زانیارییە. یاسا و سیاسەتەکان دەگۆڕدرێن. هەمیشە ئامۆژگاری یاسایی وەربگرە.',
  },

  fa: {
    heroLabel: 'سفر شما',
    heroTitle: 'تازه رسیدی به UK.',
    heroTitleItalic: 'این کارها را بکن.',
    heroSub: 'راهنمای واضح برای هر کسی که تازه رسیده و نیاز به درخواست پناهندگی دارد.',
    stepsLabel: 'گام به گام',
    stepsTitle: 'فرآیند پناهندگی چطور کار می‌کند',
    steps: [
      { n: '1', icon: '🛬', title: 'درخواست پناهندگی', desc: 'در فرودگاه، بندر یا ایستگاه قطار، به مأمور مهاجرت بگو: "I want to claim asylum." حتی بدون مدرک می‌توانی این کار را بکنی.' },
      { n: '2', icon: '📋', title: 'مصاحبه غربالگری', desc: 'یک مصاحبه کوتاه با Home Office. سوالات ساده درباره اینکه کی هستی و چرا رفتی. مترجم رایگان حق توست.' },
      { n: '3', icon: '🪪', title: 'کارت ARC بگیر', desc: 'کارت ثبت پناهندگی هویت توست. دسترسی به NHS، حمایت مسکن و خدمات دیگر را می‌دهد. آن را نگه دار.' },
      { n: '4', icon: '🏠', title: 'درخواست حمایت', desc: 'اگر پول یا خانه نداری، درخواست حمایت پناهندگی کن: هفته‌ای £49.18 برای هر نفر روی کارت ASPEN.' },
      { n: '5', icon: '⚖️', title: 'وکیل رایگان بگیر', desc: 'مهم‌ترین قدم است. حق داری کمک حقوقی رایگان بگیری. با Migrant Help تماس بگیر: 0808 8010 503' },
      { n: '6', icon: '🗣️', title: 'مصاحبه کامل پناهندگی', desc: 'مصاحبه اصلی که توضیح می‌دهی چرا نمی‌توانی برگردی. همه مدارک را بیاور. صادق و دقیق باش.' },
    ],
    rightsTitle: 'به چه چیزی حق داری',
    rights: [
      { icon: '🏥', title: 'درمان رایگان NHS', desc: 'از روز اول. بدون مدرک. همیشه مترجم رایگان بخواه.' },
      { icon: '🎒', title: 'مدرسه رایگان برای بچه‌ها', desc: 'همه کودکان 5-16 ساله باید در مدرسه باشند.' },
      { icon: '💳', title: 'حمایت مالی', desc: 'هفته‌ای £49.18 روی کارت ASPEN در صورت نیاز.' },
      { icon: '⚖️', title: 'مشاوره حقوقی رایگان', desc: 'حق داری کمک حقوقی بگیری. هرچه زودتر وکیل بگیر.' },
      { icon: '🌍', title: 'مترجم رایگان', desc: 'برای هر مصاحبه، قرار ملاقات یا جلسه. همیشه درخواست کن.' },
      { icon: '🛡️', title: 'نمی‌توانی اخراج شوی', desc: 'در حالی که پرونده‌ات فعال است، نمی‌توانند تو را اخراج کنند.' },
    ],
    rightsExtra: 'پس از ۱۲ ماه ممکن است واجد شرایط درخواست حق کار باشی.',
    helpTitle: 'با کی تماس بگیری',
    helpers: [
      { emoji: '📞', name: 'Migrant Help', desc: 'مشاوره و حمایت رایگان', number: '0808 8010 503', tag: 'رایگان · 24/7' },
      { emoji: '⚖️', name: 'Legal Aid Agency', desc: 'نمایندگی حقوقی رایگان', number: '0300 200 2020', tag: 'رایگان' },
      { emoji: '💙', name: 'Samaritans', desc: 'حمایت بحران سلامت روان', number: '116 123', tag: 'رایگان · 24/7' },
      { emoji: '🏠', name: 'Shelter', desc: 'کمک بحران مسکن', number: '0808 800 4444', tag: 'رایگان' },
    ],
    disclaimer: '⚠️ این راهنما فقط برای اطلاعات است. قوانین تغییر می‌کنند. همیشه مشاوره حقوقی شخصی بگیر.',
  },

  ar: {
    heroLabel: 'رحلتك',
    heroTitle: 'وصلت للتو إلى UK.',
    heroTitleItalic: 'هذا ما تفعله.',
    heroSub: 'دليل واضح وصادق لكل من وصل حديثاً ويحتاج إلى طلب اللجوء في المملكة المتحدة.',
    stepsLabel: 'خطوة بخطوة',
    stepsTitle: 'كيف تعمل عملية اللجوء',
    steps: [
      { n: '1', icon: '🛬', title: 'اطلب اللجوء', desc: 'في المطار أو الميناء أو محطة القطار، أخبر ضابط الهجرة: "I want to claim asylum." يمكنك فعل هذا بدون وثائق.' },
      { n: '2', icon: '📋', title: 'مقابلة الفرز', desc: 'مقابلة قصيرة مع وزارة الداخلية. أسئلة بسيطة عن هويتك ولماذا غادرت. المترجم المجاني حقك.' },
      { n: '3', icon: '🪪', title: 'احصل على بطاقة ARC', desc: 'بطاقة تسجيل اللجوء هي هويتك. تتيح الوصول لدعم السكن والـ NHS والخدمات الأخرى. احتفظ بها.' },
      { n: '4', icon: '🏠', title: 'تقدم للحصول على دعم', desc: 'إذا لم يكن لديك مال أو منزل، تقدم لدعم اللجوء: £49.18 أسبوعياً لكل شخص على بطاقة ASPEN.' },
      { n: '5', icon: '⚖️', title: 'احصل على محامٍ مجاني', desc: 'هذه أهم خطوة. لديك حق في المساعدة القانونية المجانية. اتصل بـ Migrant Help: 0808 8010 503' },
      { n: '6', icon: '🗣️', title: 'مقابلة اللجوء الكاملة', desc: 'مقابلتك الرئيسية التي تشرح فيها قضيتك. أحضر كل الأدلة. كن صادقاً ومفصلاً.' },
    ],
    rightsTitle: 'ما الذي تستحقه',
    rights: [
      { icon: '🏥', title: 'رعاية NHS المجانية', desc: 'من اليوم الأول. لا تحتاج وثائق. اطلب دائماً مترجماً مجانياً.' },
      { icon: '🎒', title: 'مدرسة مجانية للأطفال', desc: 'جميع الأطفال 5-16 سنة يجب أن يكونوا في المدرسة.' },
      { icon: '💳', title: 'الدعم المالي', desc: '£49.18 أسبوعياً على بطاقة ASPEN إذا كنت معدماً.' },
      { icon: '⚖️', title: 'مشورة قانونية مجانية', desc: 'لديك حق في المساعدة القانونية. احصل على محامٍ في أقرب وقت.' },
      { icon: '🌍', title: 'مترجم مجاني', desc: 'لكل مقابلة وموعد واجتماع. اطلبه دائماً.' },
      { icon: '🛡️', title: 'لا يمكن ترحيلك', desc: 'ما دامت قضيتك أو استئنافك نشطاً، لا يمكن إبعادك.' },
    ],
    rightsExtra: 'بعد 12 شهراً قد تكون مؤهلاً للتقدم بطلب للحصول على حق العمل.',
    helpTitle: 'من تتصل به',
    helpers: [
      { emoji: '📞', name: 'Migrant Help', desc: 'مشورة ودعم مجاني للاجئين', number: '0808 8010 503', tag: 'مجاني · 24/7' },
      { emoji: '⚖️', name: 'Legal Aid Agency', desc: 'تمثيل قانوني مجاني', number: '0300 200 2020', tag: 'مجاني' },
      { emoji: '💙', name: 'Samaritans', desc: 'دعم أزمات الصحة النفسية', number: '116 123', tag: 'مجاني · 24/7' },
      { emoji: '🏠', name: 'Shelter', desc: 'مساعدة أزمات السكن', number: '0808 800 4444', tag: 'مجاني' },
    ],
    disclaimer: '⚠️ هذا الدليل للمعلومات فقط. القوانين والسياسات تتغير. احصل دائماً على مشورة قانونية شخصية.',
  },
}

export default function NewToUKPage() {
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

  return (
    <div style={{ fontFamily: FONT, direction: 'ltr', background: BG, minHeight: '100vh', paddingBottom: 80 }}>

      {/* HERO */}
      <div style={{ background: INDIGO_DARK, padding: '40px 24px 48px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(129,140,248,0.2)', border: '1px solid rgba(129,140,248,0.3)', borderRadius: 20, padding: '4px 14px', marginBottom: 20 }}>
            <span style={{ fontSize: 12 }}>🛬</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: INDIGO_LIGHT, letterSpacing: 1.5, textAlign: isRtlText ? 'right' : 'left' }}>{t.heroLabel}</span>
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: '#fff', margin: '0 0 4px', lineHeight: 1.2, textAlign: isRtlText ? 'right' : 'left' }}>{t.heroTitle}</h1>
          {t.heroTitleItalic ? (
            <h1 style={{ fontSize: 30, fontWeight: 900, color: MINT, margin: '0 0 16px', lineHeight: 1.2, fontStyle: 'italic', textAlign: isRtlText ? 'right' : 'left' }}>{t.heroTitleItalic}</h1>
          ) : null}
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.7, fontWeight: 500, textAlign: isRtlText ? 'right' : 'left' }}>{t.heroSub}</p>
        </div>
      </div>

      {/* STEPS */}
      <div style={{ background: BG, padding: '36px 20px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: INDIGO, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6, opacity: 0.6, textAlign: isRtlText ? 'right' : 'left' }}>{t.stepsLabel}</div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: INDIGO_DARK, margin: '0 0 24px', textAlign: isRtlText ? 'right' : 'left' }}>{t.stepsTitle}</h2>
          {t.steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10, alignItems: 'flex-start', flexDirection: isRtlText ? 'row-reverse' : 'row' }}>
              <div style={{ width: 42, height: 42, borderRadius: 14, background: SOFT, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, border: `1.5px solid ${INDIGO}20`, position: 'relative' }}>
                {step.icon}
                <div style={{ position: 'absolute', top: -6, right: isRtlText ? 'auto' : -6, left: isRtlText ? -6 : 'auto', width: 18, height: 18, borderRadius: '50%', background: INDIGO, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 900, color: '#fff' }}>{step.n}</div>
              </div>
              <div style={{ flex: 1, background: '#fff', borderRadius: 14, padding: '12px 14px', border: `1px solid ${SOFT}`, boxShadow: '0 2px 8px rgba(79,70,229,0.05)' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: INDIGO, marginBottom: 4, textAlign: isRtlText ? 'right' : 'left' }}>{step.title}</div>
                <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.7, textAlign: isRtlText ? 'right' : 'left' }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHTS */}
      <div style={{ background: INDIGO_DARK, padding: '36px 20px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          {lang !== 'ku' && (
            <div style={{ fontSize: 11, fontWeight: 800, color: MINT, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6, opacity: 0.8, textAlign: isRtlText ? 'right' : 'left' }}>
              {lang === 'en' ? 'YOUR RIGHTS' : lang === 'fa' ? 'حقوق شما' : 'حقوقك'}
            </div>
          )}
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#fff', margin: '0 0 20px', textAlign: isRtlText ? 'right' : 'left' }}>{t.rightsTitle}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {t.rights.map((r, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: '14px', border: '1px solid rgba(129,140,248,0.2)' }}>
                <div style={{ fontSize: 26, marginBottom: 8, textAlign: isRtlText ? 'right' : 'left' }}>{r.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 5, lineHeight: 1.3, textAlign: isRtlText ? 'right' : 'left' }}>{r.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, textAlign: isRtlText ? 'right' : 'left' }}>{r.desc}</div>
              </div>
            ))}
          </div>
          {t.rightsExtra && (
            <div style={{ marginTop: 14, background: 'rgba(52,211,153,0.1)', borderRadius: 14, padding: '14px 16px', border: '1px solid rgba(52,211,153,0.25)' }}>
              <p style={{ color: MINT, fontSize: 13, fontWeight: 700, margin: 0, lineHeight: 1.6, textAlign: isRtlText ? 'right' : 'left' }}>{t.rightsExtra}</p>
            </div>
          )}
        </div>
      </div>

      {/* HELP */}
      <div style={{ background: INDIGO_DARK, padding: '36px 20px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#fff', margin: '0 0 18px', textAlign: isRtlText ? 'right' : 'left' }}>{t.helpTitle}</h2>
          {t.helpers.map((h, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: '14px 16px', marginBottom: 10, border: '1px solid rgba(129,140,248,0.2)', flexDirection: isRtlText ? 'row-reverse' : 'row' }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(129,140,248,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{h.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, flexWrap: 'wrap', flexDirection: isRtlText ? 'row-reverse' : 'row' }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{h.name}</div>
                  <div style={{ background: 'rgba(52,211,153,0.15)', color: MINT, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{h.tag}</div>
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', textAlign: isRtlText ? 'right' : 'left' }}>{h.desc}</div>
              </div>
              <a href={`tel:${h.number.replace(/\s/g, '')}`}
                style={{ background: MINT, color: '#fff', fontWeight: 800, fontSize: 11, padding: '8px 12px', borderRadius: 10, textDecoration: 'none', flexShrink: 0, whiteSpace: 'nowrap' }}>
                📞 {h.number}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* DISCLAIMER */}
      <div style={{ background: BG, padding: '20px 20px 40px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto', background: '#FFFBEB', borderRadius: 14, padding: '14px 16px', border: '1px solid rgba(251,191,36,0.3)' }}>
          <div style={{ fontSize: 12, color: '#92400E', lineHeight: 1.7, textAlign: isRtlText ? 'right' : 'left' }}>{t.disclaimer}</div>
        </div>
      </div>
    </div>
  )
}