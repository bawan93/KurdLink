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
    stat1: '£49.18', stat1Label: 'Weekly support payment',
    stat2: '12mo', stat2Label: 'Wait before right to work',
    stat3: '100%', stat3Label: 'Free NHS from day one',
    stat4: '0', stat4Label: 'Documents needed to see a GP',
    stepsLabel: 'STEP BY STEP',
    stepsTitle: 'How the Asylum Process Works',
    steps: [
      { n: '1', icon: '✈️', title: 'Claim Asylum', desc: 'At the airport, port or train station, tell an immigration officer: "I want to claim asylum." You can do this with no documents.' },
      { n: '2', icon: '📋', title: 'Screening Interview', desc: 'A short interview with the Home Office. Basic questions about who you are and why you left. A free interpreter is your right.' },
      { n: '3', icon: '🪪', title: 'Get Your ARC Card', desc: 'Your Asylum Registration Card is your ID. It gives you access to housing support, NHS and other services. Keep it safe.' },
      { n: '4', icon: '🏠', title: 'Apply for Support', desc: 'If you have no money or home, apply for asylum support: £49.18 per week per person on an ASPEN card, plus accommodation.' },
      { n: '5', icon: '⚖️', title: 'Get a Free Lawyer', desc: 'This is the most important step. You are entitled to free legal aid. Call Migrant Help free: 0808 8010 503, 24/7.' },
      { n: '6', icon: '🗣️', title: 'Full Asylum Interview', desc: 'Your main interview where you explain your case. Bring all evidence. Your lawyer should be with you. Be honest and detailed.' },
    ],
    rightsLabel: 'YOUR RIGHTS',
    rightsTitle: 'What You Are Entitled To',
    rights: [
      { icon: '🏥', title: 'Free NHS Healthcare', desc: 'From day one. No documents needed. Always request a free interpreter.' },
      { icon: '🎒', title: 'Free School for Children', desc: 'All children 5–16 must be in school. The council must find a place.' },
      { icon: '💳', title: 'Financial Support', desc: '£49.18 per week on an ASPEN card if destitute.' },
      { icon: '⚖️', title: 'Free Legal Advice', desc: 'You are entitled to legal aid. Get a lawyer as soon as possible.' },
      { icon: '🌍', title: 'Free Interpreter', desc: 'For every interview, appointment or meeting. Always demand it.' },
      { icon: '🛡️', title: 'Cannot Be Deported', desc: 'While your claim or appeal is active you cannot be removed from the UK.' },
    ],
    faqLabel: 'COMMON QUESTIONS',
    faqTitle: 'Things People Ask',
    faqs: [
      { emoji: '💼', q: 'Can I work while waiting?', a: 'Generally no. But if you have been waiting more than 12 months and the delay is not your fault you can apply for permission to work.' },
      { emoji: '❗', q: 'What if I am refused?', a: 'Do not panic. Most refusals can be appealed. You usually have 14 days to appeal. Contact your lawyer or Migrant Help immediately.' },
      { emoji: '📬', q: 'How long does it take?', a: 'It varies. Some cases are decided in months others take years. Keep your address updated with the Home Office at all times.' },
      { emoji: '💳', q: 'What is the ASPEN card?', a: 'A pre-paid debit card loaded with your weekly asylum support £49.18 per week. Use it like a bank card to buy food and essentials.' },
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
    heroTitle: 'من تازەم لە بەریتانیا.',
    heroTitleItalic: 'پێویستە چی بکەیت.',
    heroSub: 'ڕێنماییەکی ڕوون و ڕاستگۆیانە بۆ هەر کەسێک کە تازە گەیشتووە و پێویستی بە داوای مافی پەنابەری هەیە لە بەریتانیا.',
    stat1: '£49.18', stat1Label: 'پارەی پشتگیری هەفتانە',
    stat2: '١٢ مانگ', stat2Label: 'چاوەڕێ بکە پێش مافی کارکردنت',
    stat3: '١٠٠٪', stat3Label: 'لە ڕۆژی یەکەمەوە NHS بەخۆڕایی',
    stat4: '٠', stat4Label: 'ئەو بەڵگەنامانەی کە پێویستن بۆ بینینی GP',
    stepsLabel: 'هەنگاو بە هەنگاو',
    stepsTitle: 'چۆنیەتی کارکردنی پرۆسەی پەنابەری',
    steps: [
      { n: '١', icon: '✈️', title: 'داوای پەنابەری', desc: 'هەر کە گەیشتیت بە ئەفسەرێکی کۆچبەری بڵێ دەمەوێت داوای مافی پەنابەری بکەم. دەتوانیت ئەم کارە بکەیت بەبێ هیچ بەڵگەنامەیەک.' },
      { n: '٢', icon: '📋', title: 'چاوپێکەوتنی سکرینکردن', desc: 'چاوپێکەوتنێکی کورت لەگەڵ هۆم ئۆفیس. پرسیارە بنەڕەتییەکان سەبارەت بەوەی کە تۆ کێیت و بۆچی هاتوویت. دەتوانیت داوای وەرگێڕ بکەیت.' },
      { n: '٣', icon: '🪪', title: 'کارتی ARC بەدەست بهێنە', desc: 'کارتی تۆمارکردنی پەنابەریت ناسنامەی تۆیە. دەستڕاگەیشتن بە پشتگیری نیشتەجێبوون NHS و خزمەتگوزارییەکانی ترت پێدەبەخشێت. بە سەلامەتی بیهێڵەرەوە.' },
      { n: '٤', icon: '🏠', title: 'داواکاری پێشکەش بکە بۆ پشتگیری', desc: 'ئەگەر پارەت نییە یان ماڵت نییە داوای پاڵپشتی پەنابەری بکە: ٤٩.١٨ پاوەند لە هەفتەیەکدا بۆ هەر کەسێک لەسەر کارتی ASPEN لەگەڵ شوێنی نیشتەجێبوون.' },
      { n: '٥', icon: '⚖️', title: 'پارێزەرێکی بێ بەرامبەر بەدەست بهێنە', desc: 'ئەمە گرنگترین هەنگاوە. تۆ مافی یارمەتی یاسایی بێبەرامبەرت هەیە. پەیوەندی بکەن بە یارمەتی کۆچبەران بەخۆڕایی: 0808 8010 503' },
      { n: '٦', icon: '🗣️', title: 'چاوپێکەوتنی تەواوی پەنابەری', desc: 'چاوپێکەوتنی سەرەکیت کە تێیدا کەیسەکەت ڕوون دەکەیتەوە. هەموو بەڵگەکان لەگەڵ خۆتان بهێنن. پارێزەرەکەت لەگەڵت بێت. ڕاستگۆ و وردبین بە.' },
    ],
    rightsLabel: 'مافەکانت',
    rightsTitle: 'ئەوەی مافی خۆتە',
    rights: [
      { icon: '🏥', title: 'چاودێری تەندروستی NHS بەخۆڕایی', desc: 'لە ڕۆژی یەکەمەوە. هیچ بەڵگەنامەیەک پێویست نییە. هەمیشە داوای وەرگێڕێکی بێبەرامبەر بکە.' },
      { icon: '🎒', title: 'قوتابخانەی بێ بەرامبەر بۆ منداڵان', desc: 'هەموو منداڵانی ٥ تا ١٦ ساڵ دەبێت لە قوتابخانە بن. ئەنجوومەنی ناوخۆیی دەبێت شوێنێکیان بۆ بدۆزێتەوە.' },
      { icon: '💳', title: 'پاڵپشتی دارایی', desc: '٤٩.١٨ پاوەند بۆ هەفتەیەک لەسەر کارتی ASPEN.' },
      { icon: '⚖️', title: 'ئامۆژگاری یاسایی بەخۆڕایی', desc: 'تۆ مافی یارمەتی یاسایی هەیە. بە زووترین کات پارێزەرێک وەربگرە.' },
      { icon: '🌍', title: 'داوای وەرگێڕ بکە', desc: 'بۆ هەموو چاوپێکەوتنێک یان کۆبوونەوەیەک. هەمیشە داوای بکە.' },
      { icon: '🛡️', title: 'ناتوانرێت دیپۆرت بکرێتەوە', desc: 'لەکاتێکدا تۆ داواکاری یان دووبارە داواکاری پێشکەش دەکەیت، ناتوانرێت لە بەریتانیا دووربخرێتەوە.' },
    ],
    faqLabel: 'پرسیارە باوەکان',
    faqTitle: 'ئەو شتانەی خەڵک لێی دەپرسن',
    faqs: [
      { emoji: '💼', q: 'ئایا دەتوانم لە کاتی چاوەڕوانیدا کار بکەم؟', a: 'بەگشتی نەخێر. بەڵام ئەگەر زیاتر لە ١٢ مانگ چاوەڕێی دەکەیت و دواکەوتنەکە خەتای تۆ نییە دەتوانیت داوای مۆڵەتی کارکردن بکەیت.' },
      { emoji: '❗', q: 'چی ئەگەر ڕەتکرامەوە؟', a: 'مەترسە. دەتوانیت دووبارە داواکاری پێشکەش بکەیت. بەزۆری ١٤ ڕۆژت هەیە. دەستبەجێ پەیوەندی بە پارێزەرەکەتەوە یان یارمەتی کۆچبەرانەوە بکە.' },
      { emoji: '📬', q: 'چەند کات دەخایەنێت؟', a: 'دەگۆڕێت. هەندێک حاڵەت بە چەند مانگێک یەکلایی دەکرێنەوە هەندێکی تر ساڵانێک دەخایەنێت. لە هەموو کاتێکدا ناونیشانەکەت لەگەڵ Home Office نوێ بکەرەوە.' },
      { emoji: '💳', q: 'کارتی ASPEN چییە؟', a: 'کارتێکی بانکی پێشوەختە کە پڕکراوە لە پشتگیری هەفتانەی پەنابەریت ٤٩.١٨ پاوەند لە هەفتەیەکدا. وەک کارتی بانک بەکاری بهێنە بۆ کڕینی خواردن و پێداویستییە سەرەکییەکان.' },
    ],
    helpLabel: 'یارمەتی وەربگرە',
    helpTitle: 'پەیوەندی بە کێوە بکات',
    helpers: [
      { emoji: '📞', name: 'Migrant Help', desc: 'ئامۆژگاری و پشتیوانی بێبەرامبەر بۆ پەناخوازان', number: '0808 8010 503', tag: 'بەخۆڕایی · ٢٤/٧' },
      { emoji: '⚖️', name: 'Legal Aid Agency', desc: 'نوێنەرایەتی یاسایی ئازاد بۆ کەیسەکانی پەنابەری', number: '0300 200 2020', tag: 'بەخۆڕایی' },
      { emoji: '💙', name: 'Samaritans', desc: 'پشتگیری لە قەیرانی تەندروستی دەروونی', number: '116 123', tag: 'بەخۆڕایی · ٢٤/٧' },
      { emoji: '🏠', name: 'Shelter', desc: 'قەیرانی نیشتەجێبوون و یارمەتی بێ ماڵ و حاڵ', number: '0808 800 4444', tag: 'بەخۆڕایی' },
    ],
    disclaimer: '⚠️ ئەم ڕێنماییە تەنها بۆ زانیارییە. یاسا و سیاسەتەکان دەگۆڕدرێن. هەمیشە ئامۆژگاری یاسایی وەربگرە.',
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

  return (
    <div style={{ fontFamily: FONT, direction: 'ltr', background: BG, minHeight: '100vh', paddingBottom: 80 }}>

      {/* HERO */}
      <div style={{ background: INDIGO_DARK, padding: '40px 24px 48px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(129,140,248,0.2)', border: '1px solid rgba(129,140,248,0.3)', borderRadius: 20, padding: '4px 14px', marginBottom: 20 }}>
            <span style={{ fontSize: 12 }}>✈️</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: INDIGO_LIGHT, letterSpacing: 1.5 }}>{t.heroLabel}</span>
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: '#fff', margin: '0 0 4px', lineHeight: 1.2 }}>{t.heroTitle}</h1>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: MINT, margin: '0 0 16px', lineHeight: 1.2, fontStyle: 'italic' }}>{t.heroTitleItalic}</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: '0 0 32px', lineHeight: 1.7, fontWeight: 500 }}>{t.heroSub}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { val: t.stat1, label: t.stat1Label, color: MINT },
              { val: t.stat2, label: t.stat2Label, color: INDIGO_LIGHT },
              { val: t.stat3, label: t.stat3Label, color: MINT },
              { val: t.stat4, label: t.stat4Label, color: '#F87171' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 14, padding: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginTop: 4, lineHeight: 1.4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STEPS */}
      <div style={{ background: BG, padding: '36px 20px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: INDIGO, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6, opacity: 0.6 }}>{t.stepsLabel}</div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: INDIGO_DARK, margin: '0 0 24px' }}>{t.stepsTitle}</h2>
          {t.steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 42, height: 42, borderRadius: 14, background: SOFT, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, border: `1.5px solid ${INDIGO}20`, position: 'relative' }}>
                {step.icon}
                <div style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: '50%', background: INDIGO, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 900, color: '#fff' }}>{step.n}</div>
              </div>
              <div style={{ flex: 1, background: '#fff', borderRadius: 14, padding: '12px 14px', border: `1px solid ${SOFT}`, boxShadow: '0 2px 8px rgba(79,70,229,0.05)' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: INDIGO, marginBottom: 4 }}>{step.title}</div>
                <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.7 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHTS */}
      <div style={{ background: INDIGO_DARK, padding: '36px 20px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: MINT, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6, opacity: 0.8 }}>{t.rightsLabel}</div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#fff', margin: '0 0 20px' }}>{t.rightsTitle}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {t.rights.map((r, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: '14px', border: '1px solid rgba(129,140,248,0.2)' }}>
                <div style={{ fontSize: 26, marginBottom: 8 }}>{r.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 5, lineHeight: 1.3 }}>{r.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ background: BG, padding: '36px 20px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: INDIGO, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6, opacity: 0.6 }}>{t.faqLabel}</div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: INDIGO_DARK, margin: '0 0 18px' }}>{t.faqTitle}</h2>
          {t.faqs.map((faq, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 14, marginBottom: 10, overflow: 'hidden', border: openFaq === i ? `1.5px solid ${INDIGO}` : `1.5px solid ${SOFT}`, boxShadow: openFaq === i ? '0 4px 20px rgba(79,70,229,0.1)' : '0 2px 8px rgba(79,70,229,0.04)', transition: 'all 0.2s' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: '100%', padding: '14px 16px', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', fontFamily: FONT, textAlign: 'left' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: SOFT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{faq.emoji}</div>
                <div style={{ flex: 1, fontSize: 14, fontWeight: 700, color: INDIGO_DARK }}>{faq.q}</div>
                <span style={{ fontSize: 18, color: openFaq === i ? INDIGO : '#C4B5FD', transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(90deg)' : 'none', flexShrink: 0 }}>›</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 16px 16px 64px' }}>
                  <div style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.8, background: SOFT, borderRadius: 12, padding: '12px 14px' }}>{faq.a}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* HELP */}
      <div style={{ background: INDIGO_DARK, padding: '36px 20px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: MINT, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6, opacity: 0.8 }}>{t.helpLabel}</div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#fff', margin: '0 0 18px' }}>{t.helpTitle}</h2>
          {t.helpers.map((h, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: '14px 16px', marginBottom: 10, border: '1px solid rgba(129,140,248,0.2)' }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(129,140,248,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{h.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, flexWrap: 'wrap' }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{h.name}</div>
                  <div style={{ background: 'rgba(52,211,153,0.15)', color: MINT, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{h.tag}</div>
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{h.desc}</div>
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
          <div style={{ fontSize: 12, color: '#92400E', lineHeight: 1.7 }}>{t.disclaimer}</div>
        </div>
      </div>
    </div>
  )
}