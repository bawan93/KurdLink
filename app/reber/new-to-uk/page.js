'use client'
import { useState, useEffect } from 'react'

const INDIGO = '#4F46E5'
const INDIGO_LIGHT = '#818CF8'
const INDIGO_DARK = '#1C1A4F'
const MINT = '#34D399'
const SOFT = '#EDE9FE'
const BG = '#F5F4FF'
const FONT = "'Nunito', 'Plus Jakarta Sans', sans-serif"

const TX = {
  en: {
    heroLabel: 'YOUR JOURNEY',
    heroTitle: 'New to the UK.',
    heroTitleItalic: "Here's what to do.",
    heroSub: 'A clear, honest guide for anyone who has just arrived and needs to claim asylum in the UK.',
    stat1: '£49.18', stat1Label: 'Weekly support payment',
    stat2: '12mo', stat2Label: 'Wait before right to work',
    stat3: '100%', stat3Label: 'Free NHS from day one',
    stat4: '0', stat4Label: 'Documents needed to see a GP',
    stepsLabel: 'STEP BY STEP',
    stepsTitle: 'How the Asylum Process Works',
    steps: [
      { n: '1', icon: '✈️', title: 'Claim Asylum', desc: 'At the airport, port or train station, tell an immigration officer: "I want to claim asylum." You can do this with no documents.' },
      { n: '2', icon: '📋', title: 'Screening Interview', desc: 'A short interview with the Home Office. Basic questions about who you are and why you left. A free interpreter is your right.' },
      { n: '3', icon: '🪪', title: 'Get Your ARC Card', desc: 'Your Asylum Registration Card is your ID. It gives you access to housing support, NHS, and other services. Keep it safe.' },
      { n: '4', icon: '🏠', title: 'Apply for Support', desc: 'If you have no money or home, apply for asylum support: £49.18/week per person on an ASPEN card, plus accommodation.' },
      { n: '5', icon: '⚖️', title: 'Get a Free Lawyer', desc: 'This is the most important step. You are entitled to free legal aid. Call Migrant Help free: 0808 8010 503, 24/7.' },
      { n: '6', icon: '🗣️', title: 'Full Asylum Interview', desc: 'Your main interview where you explain your case. Bring all evidence. Your lawyer should be with you. Be honest and detailed.' },
    ],
    rightsLabel: 'YOUR RIGHTS',
    rightsTitle: 'What You Are Entitled To',
    rights: [
      { icon: '🏥', title: 'Free NHS Healthcare', desc: 'From day one. No documents needed. Always request a free interpreter.' },
      { icon: '🎒', title: 'Free School for Children', desc: 'All children 5–16 must be in school. The council must find a place.' },
      { icon: '💳', title: 'Financial Support', desc: '£49.18/week on an ASPEN card if destitute. £9.95 if meals provided.' },
      { icon: '⚖️', title: 'Free Legal Advice', desc: 'You are entitled to legal aid. Get a lawyer as soon as possible.' },
      { icon: '🌍', title: 'Free Interpreter', desc: 'For every interview, appointment or meeting. Always demand it.' },
      { icon: '🛡️', title: 'Cannot Be Deported', desc: 'While your claim or appeal is active, you cannot be removed from the UK.' },
    ],
    faqLabel: 'COMMON QUESTIONS',
    faqTitle: 'Things People Ask',
    faqs: [
      { emoji: '💼', q: 'Can I work while waiting?', a: 'Generally no. But if you have been waiting more than 12 months and the delay is not your fault, you can apply for permission to work using the PTW1 form. If approved, your ARC card will show "Work Permitted".' },
      { emoji: '👨‍👩‍👧', q: 'Can my family join me?', a: 'Not while your claim is being decided. Once you are granted refugee status you can apply for family reunion to bring your spouse and children under 18.' },
      { emoji: '❗', q: 'What if I am refused?', a: 'Do not panic. Most refusals can be appealed. You usually have 14 days to appeal. Contact your lawyer or Migrant Help immediately. You can stay in the UK while your appeal is active.' },
      { emoji: '📬', q: 'How long does it take?', a: 'It varies greatly. Some cases are decided in months, others take years. Keep your address updated with the Home Office at all times so they can contact you.' },
      { emoji: '🏥', q: 'Do I need ID to see a doctor?', a: 'No. You have the right to free NHS care from day one, even without your ARC card. Some GPs may ask for ID but they cannot legally refuse you. Always request a free interpreter.' },
      { emoji: '💳', q: 'What is the ASPEN card?', a: 'A pre-paid debit card loaded with your weekly asylum support (£49.18/week). Use it like a bank card to buy food and essentials, or withdraw cash.' },
    ],
    helpLabel: 'GET HELP',
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
    heroTitle: 'تازە گەیشتوویت بە UK.',
    heroTitleItalic: 'ئەمەت دەکات.',
    heroSub: 'ڕێنمایەکی ڕوون و راستەقینە بۆ هەر کەسێک کە تازە گەیشتووە و پێویستی بە داواکردنی ئامادەیی هەیە.',
    stat1: '٤٩.١٨£', stat1Label: 'پارەی پشتگیری هەفتانە',
    stat2: '١٢ مانگ', stat2Label: 'چاوەڕوانی پێش مافی کار',
    stat3: '١٠٠٪', stat3Label: 'NHS بەخۆڕایی لە ڕۆژی یەکەم',
    stat4: '٠', stat4Label: 'بەلگە پێویست نییە بۆ GP',
    stepsLabel: 'هەنگاو بە هەنگاو',
    stepsTitle: 'چۆنییەتی کارکردنی پرۆسەی ئامادەیی',
    steps: [
      { n: '١', icon: '✈️', title: 'داوای ئامادەیی بکە', desc: 'لە فڕۆکەخانە، بەندەر یان وێستگە، بڵێ: "I want to claim asylum." بەبێ بەلگەش دەکرێت.' },
      { n: '٢', icon: '📋', title: 'چاوپێکەوتنی پشکنین', desc: 'چاوپێکەوتنێکی کورت لەگەڵ ئۆفیسی ناوخۆ. وەرگێڕی بەخۆڕایی مافی توە.' },
      { n: '٣', icon: '🪪', title: 'کارتی ARC وەربگرە', desc: 'کارتی تۆمارکردنی ئامادەییت ناسنامەکەتە. دەستگەیشتن بە NHS و خزمەتگوزاریەکان دەدات. بیپارێزە.' },
      { n: '٤', icon: '🏠', title: 'داوای پشتگیری بکە', desc: 'ئەگەر پارەت نییە، داوای پشتگیری ئامادەیی بکە: ٤٩.١٨ پاوەند هەفتانە لەسەر کارتی ASPEN.' },
      { n: '٥', icon: '⚖️', title: 'پارێزەری بەخۆڕایی بگرە', desc: 'مافت هەیە بۆ یارمەتیی یاساییی بەخۆڕایی. Migrant Help: 0808 8010 503 (بەخۆڕایی، ٢٤/٧)' },
      { n: '٦', icon: '🗣️', title: 'چاوپێکەوتنی تەواوی ئامادەیی', desc: 'چاوپێکەوتنی سەرەکیتە. هەموو بەلگەکانت بهێنە. راست بە وردی باس بکە.' },
    ],
    rightsLabel: 'مافەکانت',
    rightsTitle: 'چی مافت هەیە',
    rights: [
      { icon: '🏥', title: 'چارەسەری بەخۆڕاییی NHS', desc: 'لە ڕۆژی یەکەمەوە. پێویستت بە بەلگە نییە.' },
      { icon: '🎒', title: 'قوتابخانەی بەخۆڕایی', desc: 'هەموو منداڵانی ٥-١٦ ساڵ دەبێت لە قوتابخانە بن.' },
      { icon: '💳', title: 'پشتگیری دارایی', desc: '٤٩.١٨ پاوەند هەفتانە لەسەر کارتی ASPEN.' },
      { icon: '⚖️', title: 'ڕاوێژی یاساییی بەخۆڕایی', desc: 'مافت هەیە بۆ یارمەتیی یاسایی.' },
      { icon: '🌍', title: 'وەرگێڕی بەخۆڕایی', desc: 'بۆ هەموو چاوپێکەوتن و مۆڵەتەکان.' },
      { icon: '🛡️', title: 'ناتوانرێیت دیپۆرت بکرێیت', desc: 'لەکاتی چالاکبوونی کێسەکەت.' },
    ],
    faqLabel: 'پرسیارە باوەکان',
    faqTitle: 'شتەی کەسان دەیپرسن',
    faqs: [
      { emoji: '💼', q: 'دەتوانم کار بکەم؟', a: 'بە گشتی نەخێر. بەلام ئەگەر زیاتر لە ١٢ مانگ چاوەڕوانت کردووە، دەتوانیت داوای مۆڵەتی کار بکەیت.' },
      { emoji: '❗', q: 'ئەگەر داوام ڕەتکرایەوە؟', a: 'نەترسە. زۆرینەی ڕەتکردنەوەکان دەتوانرێن تژیاوە بکرێن. معمولاً ١٤ ڕۆژ هەیت. فەوری پەیوەندی بکە بە پارێزەرەکەت.' },
      { emoji: '📬', q: 'چەند دەخایەنێت؟', a: 'جیاواز دەبێت. هەندێ مانگەکان، هەندێکی تر ساڵەکان. ئادرەسەکەت هەموو کاتێک نوێ بکەرەوە.' },
      { emoji: '💳', q: 'کارتی ASPEN چییە؟', a: 'کارتێکی دەبیتیە کە بە ٤٩.١٨ پاوەند هەفتانە داندرێت. وەک کارتی بانکی بەکاریبهێنە.' },
    ],
    helpLabel: 'یارمەتی بگرە',
    helpTitle: 'کێ بپەیوەندێ',
    helpers: [
      { emoji: '📞', name: 'Migrant Help', desc: 'ڕاوێژ و پشتگیری بەخۆڕایی', number: '0808 8010 503', tag: 'بەخۆڕایی · ٢٤/٧' },
      { emoji: '⚖️', name: 'Legal Aid Agency', desc: 'نوێنەرایەتیی یاساییی بەخۆڕایی', number: '0300 200 2020', tag: 'بەخۆڕایی' },
      { emoji: '💙', name: 'Samaritans', desc: 'پشتگیری کریزی دەروونی', number: '116 123', tag: 'بەخۆڕایی · ٢٤/٧' },
      { emoji: '🏠', name: 'Shelter', desc: 'یارمەتیی کریزی نیشتەجێبوون', number: '0808 800 4444', tag: 'بەخۆڕایی' },
    ],
    disclaimer: '⚠️ ئەم ڕێنمایە تەنها بۆ زانیارییە. هەموو کاتێک ڕاوێژی یاساییی کەسیگرەو بگرە.',
  },
  fa: {
    heroLabel: 'سفر شما',
    heroTitle: 'تازه رسیدی به UK.',
    heroTitleItalic: 'این کارها را بکن.',
    heroSub: 'راهنمای واضح برای هر کسی که تازه رسیده و نیاز به درخواست پناهندگی دارد.',
    stat1: '£49.18', stat1Label: 'کمک مالی هفتگی',
    stat2: '12 ماه', stat2Label: 'انتظار قبل از حق کار',
    stat3: '100%', stat3Label: 'NHS رایگان از روز اول',
    stat4: '0', stat4Label: 'مدرک لازم برای دیدن دکتر',
    stepsLabel: 'گام به گام',
    stepsTitle: 'فرآیند پناهندگی چطور کار می‌کند',
    steps: [
      { n: '1', icon: '✈️', title: 'درخواست پناهندگی', desc: 'در فرودگاه، بندر یا ایستگاه قطار، به مأمور مهاجرت بگو: "I want to claim asylum." حتی بدون مدرک می‌توانی این کار را بکنی.' },
      { n: '2', icon: '📋', title: 'مصاحبه غربالگری', desc: 'یک مصاحبه کوتاه با Home Office. سوالات ساده درباره اینکه کی هستی و چرا رفتی. مترجم رایگان حق توست.' },
      { n: '3', icon: '🪪', title: 'کارت ARC بگیر', desc: 'کارت ثبت پناهندگی هویت توست. دسترسی به NHS، حمایت مسکن و خدمات دیگر را می‌دهد. آن را نگه دار.' },
      { n: '4', icon: '🏠', title: 'درخواست حمایت', desc: 'اگر پول یا خانه نداری، درخواست حمایت پناهندگی کن: هفته‌ای £49.18 برای هر نفر روی کارت ASPEN.' },
      { n: '5', icon: '⚖️', title: 'وکیل رایگان بگیر', desc: 'مهم‌ترین قدم است. حق داری کمک حقوقی رایگان بگیری. با Migrant Help تماس بگیر: 0808 8010 503' },
      { n: '6', icon: '🗣️', title: 'مصاحبه کامل پناهندگی', desc: 'مصاحبه اصلی که توضیح می‌دهی چرا نمی‌توانی برگردی. همه مدارک را بیاور. صادق و دقیق باش.' },
    ],
    rightsLabel: 'حقوق شما',
    rightsTitle: 'به چه چیزی حق داری',
    rights: [
      { icon: '🏥', title: 'درمان رایگان NHS', desc: 'از روز اول. بدون مدرک. همیشه مترجم رایگان بخواه.' },
      { icon: '🎒', title: 'مدرسه رایگان برای بچه‌ها', desc: 'همه کودکان 5-16 ساله باید در مدرسه باشند.' },
      { icon: '💳', title: 'حمایت مالی', desc: 'هفته‌ای £49.18 روی کارت ASPEN در صورت نیاز.' },
      { icon: '⚖️', title: 'مشاوره حقوقی رایگان', desc: 'حق داری کمک حقوقی بگیری. هرچه زودتر وکیل بگیر.' },
      { icon: '🌍', title: 'مترجم رایگان', desc: 'برای هر مصاحبه، قرار ملاقات یا جلسه. همیشه درخواست کن.' },
      { icon: '🛡️', title: 'نمی‌توانی اخراج شوی', desc: 'در حالی که پرونده‌ات فعال است، نمی‌توانند تو را اخراج کنند.' },
    ],
    faqLabel: 'سوالات رایج',
    faqTitle: 'چیزهایی که مردم می‌پرسند',
    faqs: [
      { emoji: '💼', q: 'می‌توانم کار کنم؟', a: 'معمولاً نه. اما اگر بیش از 12 ماه منتظر بودی و تأخیر تقصیر تو نبوده، می‌توانی درخواست مجوز کار بدهی.' },
      { emoji: '❗', q: 'اگر رد شدم چی؟', a: 'نگران نباش. اکثر رد شدن‌ها قابل تجدیدنظر هستند. معمولاً 14 روز فرصت داری. فوری با وکیلت تماس بگیر.' },
      { emoji: '📬', q: 'چقدر طول می‌کشد؟', a: 'خیلی متفاوت است. بعضی پرونده‌ها ماه‌ها، بعضی سال‌ها طول می‌کشد. آدرست را همیشه به‌روز نگه دار.' },
      { emoji: '💳', q: 'کارت ASPEN چیست؟', a: 'یک کارت دبیت پیش‌پرداخت که با £49.18 هفتگی شارژ می‌شود. مثل کارت بانکی استفاده کن.' },
    ],
    helpLabel: 'کمک بگیر',
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
    stat1: '£49.18', stat1Label: 'دفعة دعم أسبوعية',
    stat2: '12 شهر', stat2Label: 'انتظار قبل حق العمل',
    stat3: '100%', stat3Label: 'NHS مجاني من اليوم الأول',
    stat4: '0', stat4Label: 'وثائق مطلوبة لرؤية الطبيب',
    stepsLabel: 'خطوة بخطوة',
    stepsTitle: 'كيف تعمل عملية اللجوء',
    steps: [
      { n: '1', icon: '✈️', title: 'اطلب اللجوء', desc: 'في المطار أو الميناء أو محطة القطار، أخبر ضابط الهجرة: "I want to claim asylum." يمكنك فعل هذا بدون وثائق.' },
      { n: '2', icon: '📋', title: 'مقابلة الفرز', desc: 'مقابلة قصيرة مع وزارة الداخلية. أسئلة بسيطة عن هويتك ولماذا غادرت. المترجم المجاني حقك.' },
      { n: '3', icon: '🪪', title: 'احصل على بطاقة ARC', desc: 'بطاقة تسجيل اللجوء هي هويتك. تتيح الوصول لدعم السكن والـ NHS والخدمات الأخرى. احتفظ بها.' },
      { n: '4', icon: '🏠', title: 'تقدم للحصول على دعم', desc: 'إذا لم يكن لديك مال أو منزل، تقدم لدعم اللجوء: £49.18 أسبوعياً لكل شخص على بطاقة ASPEN.' },
      { n: '5', icon: '⚖️', title: 'احصل على محامٍ مجاني', desc: 'هذه أهم خطوة. لديك حق في المساعدة القانونية المجانية. اتصل بـ Migrant Help: 0808 8010 503' },
      { n: '6', icon: '🗣️', title: 'مقابلة اللجوء الكاملة', desc: 'مقابلتك الرئيسية التي تشرح فيها قضيتك. أحضر كل الأدلة. كن صادقاً ومفصلاً.' },
    ],
    rightsLabel: 'حقوقك',
    rightsTitle: 'ما الذي تستحقه',
    rights: [
      { icon: '🏥', title: 'رعاية NHS المجانية', desc: 'من اليوم الأول. لا تحتاج وثائق. اطلب دائماً مترجماً مجانياً.' },
      { icon: '🎒', title: 'مدرسة مجانية للأطفال', desc: 'جميع الأطفال 5-16 سنة يجب أن يكونوا في المدرسة.' },
      { icon: '💳', title: 'الدعم المالي', desc: '£49.18 أسبوعياً على بطاقة ASPEN إذا كنت معدماً.' },
      { icon: '⚖️', title: 'مشورة قانونية مجانية', desc: 'لديك حق في المساعدة القانونية. احصل على محامٍ في أقرب وقت.' },
      { icon: '🌍', title: 'مترجم مجاني', desc: 'لكل مقابلة وموعد واجتماع. اطلبه دائماً.' },
      { icon: '🛡️', title: 'لا يمكن ترحيلك', desc: 'ما دامت قضيتك أو استئنافك نشطاً، لا يمكن إبعادك.' },
    ],
    faqLabel: 'أسئلة شائعة',
    faqTitle: 'ما يسأله الناس',
    faqs: [
      { emoji: '💼', q: 'هل يمكنني العمل أثناء الانتظار؟', a: 'بشكل عام لا. لكن إذا انتظرت أكثر من 12 شهراً والتأخير ليس خطأك، يمكنك التقدم للحصول على إذن عمل.' },
      { emoji: '❗', q: 'ماذا لو رُفض طلبي؟', a: 'لا تذعر. معظم الرفض يمكن استئنافه. عادة لديك 14 يوماً للاستئناف. تواصل مع محاميك أو Migrant Help فوراً.' },
      { emoji: '📬', q: 'كم من الوقت يستغرق؟', a: 'يتفاوت كثيراً. بعض الحالات تستغرق أشهراً وأخرى سنوات. حدّث عنوانك مع وزارة الداخلية دائماً.' },
      { emoji: '💳', q: 'ما هي بطاقة ASPEN؟', a: 'بطاقة خصم مدفوعة مسبقاً محملة بـ £49.18 أسبوعياً. استخدمها كبطاقة بنكية لشراء الطعام والضروريات.' },
    ],
    helpLabel: 'احصل على مساعدة',
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
  const [openFaq, setOpenFaq] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('komek_lang')
    if (saved && TX[saved]) setLang(saved)
    const handler = (e) => { if (TX[e.detail]) setLang(e.detail) }
    window.addEventListener('langchange', handler)
    return () => window.removeEventListener('langchange', handler)
  }, [])

  const t = TX[lang] || TX.en
  const isRtl = lang === 'ku' || lang === 'fa' || lang === 'ar'

  return (
    <div style={{ fontFamily: FONT, direction: isRtl ? 'rtl' : 'ltr', background: BG, minHeight: '100vh', paddingBottom: 80 }}>

      {/* HERO */}
      <div style={{ background: INDIGO_DARK, padding: '40px 24px 48px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(129,140,248,0.2)', border: '1px solid rgba(129,140,248,0.3)', borderRadius: 20, padding: '4px 14px', marginBottom: 20 }}>
            <span style={{ fontSize: 12 }}>✈️</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: INDIGO_LIGHT, letterSpacing: 1.5 }}>{t.heroLabel}</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#fff', margin: '0 0 4px', lineHeight: 1.2, letterSpacing: -0.5 }}>{t.heroTitle}</h1>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: MINT, margin: '0 0 16px', lineHeight: 1.2, letterSpacing: -0.5, fontStyle: 'italic' }}>{t.heroTitleItalic}</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: '0 0 36px', lineHeight: 1.7, fontWeight: 500 }}>{t.heroSub}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { val: t.stat1, label: t.stat1Label, color: MINT },
              { val: t.stat2, label: t.stat2Label, color: INDIGO_LIGHT },
              { val: t.stat3, label: t.stat3Label, color: MINT },
              { val: t.stat4, label: t.stat4Label, color: '#F87171' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: s.color, letterSpacing: -0.5 }}>{s.val}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginTop: 4, lineHeight: 1.4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STEPS */}
      <div style={{ background: BG, padding: '40px 24px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: INDIGO, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8, opacity: 0.6 }}>{t.stepsLabel}</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: INDIGO_DARK, margin: '0 0 28px', letterSpacing: -0.3 }}>{t.stepsTitle}</h2>
          <div style={{ overflowX: 'auto', paddingBottom: 8, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, minWidth: 'max-content', padding: '0 4px' }}>
              {t.steps.map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 80 }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: SOFT, border: `2px solid ${INDIGO}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, position: 'relative', marginBottom: 8 }}>
                      {step.icon}
                      <div style={{ position: 'absolute', top: -6, right: isRtl ? 'auto' : -6, left: isRtl ? -6 : 'auto', width: 20, height: 20, borderRadius: '50%', background: INDIGO, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: '#fff' }}>
                        {step.n}
                      </div>
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 800, color: INDIGO, textAlign: 'center', lineHeight: 1.3, width: 72 }}>{step.title}</div>
                  </div>
                  {i < t.steps.length - 1 && (
                    <div style={{ width: 24, height: 2, background: `${INDIGO}30`, flexShrink: 0, marginBottom: 28 }} />
                  )}
                </div>
              ))}
            </div>
          </div>
          {t.steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 12, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: SOFT, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, border: `1.5px solid ${INDIGO}20` }}>
                {step.icon}
              </div>
              <div style={{ flex: 1, background: '#fff', borderRadius: 14, padding: '12px 14px', border: '1px solid #EDE9FE', boxShadow: '0 2px 8px rgba(79,70,229,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: INDIGO, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: '#fff', flexShrink: 0 }}>{step.n}</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: INDIGO }}>{step.title}</div>
                </div>
                <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.7, fontWeight: 500 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHTS */}
      <div style={{ background: INDIGO_DARK, padding: '40px 24px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: MINT, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8, opacity: 0.8 }}>{t.rightsLabel}</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: '0 0 24px', letterSpacing: -0.3 }}>{t.rightsTitle}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {t.rights.map((r, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: '16px', border: '1px solid rgba(129,140,248,0.2)' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{r.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 6, lineHeight: 1.3 }}>{r.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, fontWeight: 500 }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ background: BG, padding: '40px 24px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: INDIGO, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8, opacity: 0.6 }}>{t.faqLabel}</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: INDIGO_DARK, margin: '0 0 20px', letterSpacing: -0.3 }}>{t.faqTitle}</h2>
          {t.faqs.map((faq, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 16, marginBottom: 10, overflow: 'hidden', border: openFaq === i ? `1.5px solid ${INDIGO}` : '1.5px solid #EDE9FE', boxShadow: openFaq === i ? '0 4px 20px rgba(79,70,229,0.1)' : '0 2px 8px rgba(79,70,229,0.04)', transition: 'all 0.2s' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', padding: '14px 16px', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', fontFamily: FONT, flexDirection: isRtl ? 'row-reverse' : 'row', textAlign: isRtl ? 'right' : 'left' }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: SOFT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{faq.emoji}</div>
                <div style={{ flex: 1, fontSize: 14, fontWeight: 700, color: INDIGO_DARK }}>{faq.q}</div>
                <span style={{ fontSize: 18, color: openFaq === i ? INDIGO : '#C4B5FD', transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(90deg)' : 'none', flexShrink: 0 }}>›</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 16px 16px', paddingInlineStart: isRtl ? 16 : 66 }}>
                  <div style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.8, fontWeight: 500, background: SOFT, borderRadius: 12, padding: '12px 14px' }}>{faq.a}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* HELP */}
      <div style={{ background: INDIGO_DARK, padding: '40px 24px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: MINT, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8, opacity: 0.8 }}>{t.helpLabel}</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: '0 0 20px', letterSpacing: -0.3 }}>{t.helpTitle}</h2>
          {t.helpers.map((h, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: '14px 16px', marginBottom: 10, border: '1px solid rgba(129,140,248,0.2)', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(129,140,248,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{h.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, flexWrap: 'wrap' }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{h.name}</div>
                  <div style={{ background: 'rgba(52,211,153,0.15)', color: MINT, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{h.tag}</div>
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>{h.desc}</div>
              </div>
              <a href={`tel:${h.number.replace(/\s/g, '')}`} style={{ background: MINT, color: '#fff', fontWeight: 800, fontSize: 12, padding: '8px 14px', borderRadius: 12, textDecoration: 'none', flexShrink: 0, whiteSpace: 'nowrap' }}>
                📞 {h.number}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ background: BG, padding: '20px 24px 40px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto', background: '#FFFBEB', borderRadius: 16, padding: '14px 16px', border: '1px solid rgba(251,191,36,0.3)' }}>
          <div style={{ fontSize: 12, color: '#92400E', lineHeight: 1.7, fontWeight: 500 }}>{t.disclaimer}</div>
        </div>
      </div>
    </div>
  )
}