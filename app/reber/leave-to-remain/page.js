'use client'
import { useState, useEffect } from 'react'

const INDIGO = '#4F46E5'
const INDIGO_LIGHT = '#818CF8'
const INDIGO_DARK = '#1C1A4F'
const MINT = '#34D399'
const GREEN = '#059669'
const GREEN_LIGHT = '#D1FAE5'
const SOFT = '#EDE9FE'
const BG = '#F5F4FF'
const FONT = "'Nunito', 'Plus Jakarta Sans', sans-serif"

const TX = {
  en: {
    heroLabel: 'STAGE 2',
    heroTitle: 'Leave to Remain.',
    heroTitleItalic: 'Act fast.',
    heroSub: 'You have been granted refugee status. This is great news — but you now have a limited window to sort your housing, benefits and bank account before asylum support ends.',
    stat1: '42', stat1Label: 'Days before support ends',
    stat2: '5yr', stat2Label: 'Leave to remain granted',
    stat3: '£500', stat3Label: 'Integration loan available',
    stat4: '5wk', stat4Label: 'Universal Credit wait',
    stepsLabel: 'WHAT TO DO NOW',
    stepsTitle: 'Your First 42 Days',
    steps: [
      { n: '1', icon: '📬', title: 'Read Your Grant Letter', desc: 'You will receive a grant letter from the Home Office confirming your refugee status and the date your asylum support will end. Read it carefully and note the exact end date.' },
      { n: '2', icon: '📱', title: 'Get Your eVisa', desc: 'The Home Office will create a UKVI account for you. Your eVisa is your digital proof of status — you need it to open a bank account, apply for housing, find work, and claim benefits. Check all your details are correct.' },
      { n: '3', icon: '🏦', title: 'Open a Bank Account', desc: 'You now have the right to open a bank account. Take your eVisa and grant letter to a bank. Some banks are more refugee-friendly — try Lloyds, Halifax or Barclays. You need an account to receive Universal Credit.' },
      { n: '4', icon: '💷', title: 'Apply for Universal Credit', desc: 'Apply for Universal Credit immediately at gov.uk or your local Jobcentre. Be aware there is a 5-week wait for your first payment — apply the same day you get your grant letter. You can request an advance payment to bridge the gap.' },
      { n: '5', icon: '🏠', title: 'Sort Your Housing', desc: 'Contact your local council to go on the social housing waiting list. Also contact local charities and Migrant Help — they can help you find private rented accommodation. Do not wait until your move-on period ends.' },
      { n: '6', icon: '💼', title: 'Start Looking for Work', desc: 'You now have the right to work in any job at any level in the UK. Contact your local Jobcentre Plus, which has specialist refugee employment advisers. Also try the Refugee Council employment service if you are in London.' },
      { n: '7', icon: '🪪', title: 'Get Your National Insurance Number', desc: 'You should have applied for a National Insurance number when you first claimed asylum. You need it to work, pay tax, and claim benefits. If you do not have one, apply at gov.uk or contact the NI number enquiry line.' },
      { n: '8', icon: '🏥', title: 'Register with a GP', desc: 'If you have not already done so, register with a local GP. You now have full NHS access. Also register your children with a GP and enrol them in school if they are aged 5-16.' },
    ],
    rightsLabel: 'YOUR NEW RIGHTS',
    rightsTitle: 'What Changes When You Get Status',
    rights: [
      { icon: '💼', title: 'Right to Work', desc: 'Any job, any profession, any skill level. No restrictions.' },
      { icon: '💷', title: 'Full Benefits', desc: 'Universal Credit, Housing Benefit, Child Benefit and more — same as UK citizens.' },
      { icon: '🏠', title: 'Social Housing', desc: 'You can join the council housing waiting list on equal terms with UK citizens.' },
      { icon: '🏥', title: 'Full NHS', desc: 'Complete access to all NHS services including GP, hospital and mental health.' },
      { icon: '🎓', title: 'Education', desc: 'Access to free education including university student finance.' },
      { icon: '✈️', title: 'Travel Document', desc: 'You can apply for a UK Refugee Travel Document to travel internationally.' },
    ],
    faqLabel: 'COMMON QUESTIONS',
    faqTitle: 'Things People Ask',
    faqs: [
      { emoji: '⏰', q: 'How long do I actually have before support ends?', a: 'As of March 2026, asylum support ends 42 days after your grant letter in practice, though the legal period is 28 days. You will receive a separate Asylum Support Discontinuation Letter stating the exact end date. Do not wait — apply for Universal Credit on day one.' },
      { emoji: '💷', q: 'What is Universal Credit and how do I get it?', a: 'Universal Credit is the main benefit for people on a low income. Apply at gov.uk/universal-credit or at your local Jobcentre Plus. There is a 5-week wait for your first payment — always request an Advance Payment on the same day you apply. This is a loan deducted from future payments but bridges the gap.' },
      { emoji: '🏠', q: 'What if I have nowhere to live when support ends?', a: 'Contact your local council immediately and tell them you are at risk of homelessness. They have a legal duty to help. Also contact Shelter (0808 800 4444) and Migrant Help (0808 8010 503). Do not leave it to the last day — councils need time to process.' },
      { emoji: '💰', q: 'What is the Refugee Integration Loan?', a: 'You can apply for a loan of up to £500 (single person) or £780 (couple) from the Home Office to help with rent deposits, household items, or training costs. It is repaid through deductions from your benefits. Apply at gov.uk/refugee-integration-loan.' },
      { emoji: '👨‍👩‍👧', q: 'Can my family join me now?', a: 'Yes — once you have refugee status you can apply for family reunion to bring your spouse and children under 18 who were part of your family before you fled. Apply at gov.uk. Note: if you entered the UK via a dangerous journey (small boat, lorry), new 2025 rules may affect your family reunion rights — get legal advice.' },
      { emoji: '🇬🇧', q: 'Can I become a British citizen?', a: 'Important: A 2025 policy change means people who entered the UK via "dangerous journeys" including small boats may be permanently blocked from citizenship. If you entered this way, get legal advice urgently. For others, the path is: 5 years leave to remain → Indefinite Leave to Remain → citizenship after 1 more year.' },
      { emoji: '🚗', q: 'Can I drive in the UK?', a: 'You can drive using your home country licence for up to 12 months. After that you must convert it to a UK licence. Some countries have automatic exchange agreements with the UK — check at gov.uk. If you have no licence, you must take UK driving lessons and tests.' },
      { emoji: '📚', q: 'Can I go to university?', a: 'Yes. Refugees are eligible for Home Fee status and student finance (loans and grants) at UK universities, the same as UK students. Contact UKCISA for advice on funding your studies.' },
    ],
    helpLabel: 'GET HELP NOW',
    helpTitle: 'Who to Call',
    helpers: [
      { emoji: '📞', name: 'Migrant Help', desc: 'Free advice on housing, benefits and next steps', number: '0808 8010 503', tag: 'Free · 24/7' },
      { emoji: '🏠', name: 'Shelter', desc: 'Housing crisis and homelessness help', number: '0808 800 4444', tag: 'Free' },
      { emoji: '⚖️', name: 'Refugee Council', desc: 'Employment, integration and legal advice', number: '020 7346 6700', tag: 'Free' },
      { emoji: '💷', name: 'Citizens Advice', desc: 'Benefits, housing and legal rights guidance', number: '0800 144 8848', tag: 'Free' },
    ],
    warning: '⚠️ Important: If you entered the UK via a small boat or lorry, a 2025 policy change may permanently affect your right to British citizenship. Get legal advice as soon as possible.',
    disclaimer: '⚠️ This guide is for information only. Laws and policies change frequently. Always get personal legal advice.',
  },
  ku: {
    heroLabel: 'قۆناغی ٢',
    heroTitle: 'مۆڵەتی مانەوە.',
    heroTitleItalic: 'زوو بجوڵە.',
    heroSub: 'مافی ئامادەییت دراوە. ئەمە هەواڵێکی باشە — بەلام ئێستا ماوەیەکی کەمت هەیە بۆ ڕێکخستنی نیشتەجێبووندن، یارمەتییەکان و ئەژمارەی بانکیت پێش کۆتایی هاتنی پشتگیری ئامادەیی.',
    stat1: '٤٢', stat1Label: 'ڕۆژ پێش کۆتایی پشتگیری',
    stat2: '٥ ساڵ', stat2Label: 'مۆڵەتی مانەوە درا',
    stat3: '٥٠٠£', stat3Label: 'قەرزی یەکپێکهێنانی پەیدابوو',
    stat4: '٥ هەفتە', stat4Label: 'چاوەڕوانی Universal Credit',
    stepsLabel: 'چی دەکەیت ئێستا',
    stepsTitle: '٤٢ ڕۆژی یەکەمت',
    steps: [
      { n: '١', icon: '📬', title: 'نامەی مۆڵەتەکەت بخوێنەوە', desc: 'نامەیەکت لە ئۆفیسی ناوخۆ وەردەگریت کە مافی ئامادەییت پشتڕاستدەکات و بەرواری کۆتایی پشتگیری ئامادەییت دیاریدەکات. بە وردی بیخوێنەوە.' },
      { n: '٢', icon: '📱', title: 'eVisa وەربگرە', desc: 'ئۆفیسی ناوخۆ ئەژمارەی UKVI بۆت دروستدەکات. eVisa ئەلیکترۆنیەکەت بەلگەی دیجیتاڵی مافی ماوونەتە — پێویستتە بۆ کردنەوەی ئەژمارەی بانکی، داواکردنی نیشتەجێبوون، دۆزینەوەی کار و داواکردنی یارمەتییەکان.' },
      { n: '٣', icon: '🏦', title: 'ئەژمارەی بانکی کردنەوە', desc: 'ئێستا مافت هەیە ئەژمارەی بانکی کردنەوە. eVisa و نامەی مۆڵەتەکەت بۆ بانکێک ببە. هەندێک بانک زیاتر بۆ پەناهبەران باشترن — هەوڵبدە Lloyds، Halifax یان Barclays.' },
      { n: '٤', icon: '💷', title: 'داوای Universal Credit بکە', desc: 'فەوری داوای Universal Credit بکە لە gov.uk یان Jobcentre ناوچەکەت. تێبینیبکە ٥ هەفتە چاوەڕوان دەبیت — هەمان ڕۆژی وەرگرتنی نامەکەت داوای بکە. دەتوانیت داوای پارەی پێشکەوتووی Advance Payment بکەیت.' },
      { n: '٥', icon: '🏠', title: 'نیشتەجێبوون ڕێکبخە', desc: 'پەیوەندی بکە بە شارداریی ناوچەکەت بۆ چوونە سەر لیستی چاوەڕوانی خانوی کۆمەڵایەتی. هەروەها پەیوەندی بکە بە خێرخوازییەکان و Migrant Help.' },
      { n: '٦', icon: '💼', title: 'دەست بکە بە گەڕان بۆ کار', desc: 'ئێستا مافت هەیە لە هەر کارێک لە هەر ئاستێک لە UK کار بکەیت. پەیوەندی بکە بە Jobcentre Plus ناوچەکەت.' },
      { n: '٧', icon: '🪪', title: 'ژمارەی National Insurance وەربگرە', desc: 'پێویستتە بۆ کار، بەرپرسایەتییی باج و داواکردنی یارمەتییەکان. ئەگەر نەتت هەیە، داوای بکە لە gov.uk.' },
      { n: '٨', icon: '🏥', title: 'تۆمار بکە لەگەڵ GP', desc: 'تۆمار بکە لەگەڵ دکتۆری ناوچەکەت. ئێستا دەستگەیشتنی تەواوت بە NHS هەیە. هەروەها منداڵەکانت تۆمار بکە و بنێرە قوتابخانە.' },
    ],
    rightsLabel: 'مافە نوێکانت',
    rightsTitle: 'چی دەگۆڕێت کاتێک مافت دەدرێت',
    rights: [
      { icon: '💼', title: 'مافی کار', desc: 'هەر کار، هەر پیشە، هەر ئاست. هیچ سنووریەک نییە.' },
      { icon: '💷', title: 'یارمەتییە تەواوەکان', desc: 'Universal Credit، یارمەتیی نیشتەجێبوون، یارمەتیی منداڵ و زیاتر.' },
      { icon: '🏠', title: 'خانوی کۆمەڵایەتی', desc: 'دەتوانیت بچیتە سەر لیستی چاوەڕوانی شارداری.' },
      { icon: '🏥', title: 'NHS تەواو', desc: 'دەستگەیشتنی تەواو بە هەموو خزمەتگوزارییەکانی NHS.' },
      { icon: '🎓', title: 'خوێندن', desc: 'دەستگەیشتن بە خوێندنی بەخۆڕایی و دارایی خوێندنگەی بەرز.' },
      { icon: '✈️', title: 'بەلگەی گەشتو گوزار', desc: 'دەتوانیت داوای بەلگەی گەشتو گوزاری پەناهبەری UK بکەیت.' },
    ],
    faqLabel: 'پرسیارە باوەکان',
    faqTitle: 'شتەی کەسان دەیپرسن',
    faqs: [
      { emoji: '⏰', q: 'چەند وەختم هەیە پێش کۆتایی پشتگیری؟', a: 'لە مارسی ٢٠٢٦ەوە، پشتگیری ئامادەیی ٤٢ ڕۆژ دوای نامەی مۆڵەتەکەت کۆتادێت. نامەی جیاوازی وەردەگریت کە بەرواری تەواوییەکی دیاریدەکات. چاوەڕوان مەبە — هەمان ڕۆژی یەکەم داوای Universal Credit بکە.' },
      { emoji: '💷', q: 'Universal Credit چییە و چۆن وەریدەگرم؟', a: 'Universal Credit یارمەتیی سەرەکییە بۆ کەسانی داهاتی کەم. داوا بکە لە gov.uk/universal-credit یان Jobcentre ناوچەکەت. ٥ هەفتە چاوەڕوان دەبیت — هەموو کاتێک داوای Advance Payment بکە.' },
      { emoji: '🏠', q: 'ئەگەر شوێنی مانەوەم نەبوو چ دەکەم؟', a: 'فەوری پەیوەندی بکە بە شارداریی ناوچەکەت و بڵێ لە مەترسیی بێ خانوماندنیدایت. هەروەها پەیوەندی بکە بە Shelter: 0808 800 4444.' },
      { emoji: '💰', q: 'قەرزی یەکپێکهێنانی پەناهبەر چییە؟', a: 'دەتوانیت داوای قەرزی تا ٥٠٠£ (تەنیا) یان ٧٨٠£ (جووت) بکەیت بۆ یارمەتی پارەی مانەوەنامە، کالا و پەروەردەی پیشەیی. داوا بکە لە gov.uk/refugee-integration-loan.' },
    ],
    helpLabel: 'یارمەتی بگرە ئێستا',
    helpTitle: 'کێ بپەیوەندێ',
    helpers: [
      { emoji: '📞', name: 'Migrant Help', desc: 'ڕاوێژی بەخۆڕایی دەربارەی نیشتەجێبوون و یارمەتییەکان', number: '0808 8010 503', tag: 'بەخۆڕایی · ٢٤/٧' },
      { emoji: '🏠', name: 'Shelter', desc: 'یارمەتیی کریزی نیشتەجێبوون', number: '0808 800 4444', tag: 'بەخۆڕایی' },
      { emoji: '⚖️', name: 'Refugee Council', desc: 'ڕاوێژی کار، یەکپێکهێنان و یاسا', number: '020 7346 6700', tag: 'بەخۆڕایی' },
      { emoji: '💷', name: 'Citizens Advice', desc: 'ڕێنمای یارمەتی، نیشتەجێبوون و مافی یاسایی', number: '0800 144 8848', tag: 'بەخۆڕایی' },
    ],
    warning: '⚠️ گرنگ: ئەگەر لە ڕێگای بەلەمی بچووک یان کامیۆنێوە گەیشتیتە UK، گۆڕانکارییەکی سیاسەتی ٢٠٢٥ لەوانەیە بە دایمی کاریگەری لەسەر مافی هاووڵاتیی بریتانیت بکات. هەرچوون زوو ڕاوێژی یاسایی بگرە.',
    disclaimer: '⚠️ ئەم ڕێنمایە تەنها بۆ زانیارییە. یاسا و سیاسەتەکان بەردەوام دەگۆڕێن. هەموو کاتێک ڕاوێژی یاساییی کەسیگرەو بگرە.',
  },
  fa: {
    heroLabel: 'مرحله ۲',
    heroTitle: 'اجازه اقامت.',
    heroTitleItalic: 'سریع عمل کن.',
    heroSub: 'وضعیت پناهندگی‌ات تأیید شده. این خبر خوبی است — اما حالا وقت محدودی داری تا مسکن، مزایا و حساب بانکی‌ات را قبل از پایان حمایت پناهندگی مرتب کنی.',
    stat1: '42', stat1Label: 'روز تا پایان حمایت',
    stat2: '5سال', stat2Label: 'اجازه اقامت داده شد',
    stat3: '£500', stat3Label: 'وام ادغام موجود',
    stat4: '5هفته', stat4Label: 'انتظار Universal Credit',
    stepsLabel: 'چه کاری انجام بدی',
    stepsTitle: '42 روز اول',
    steps: [
      { n: '1', icon: '📬', title: 'نامه تأییدیه را بخوان', desc: 'نامه‌ای از Home Office دریافت می‌کنی که وضعیت پناهندگی‌ات را تأیید می‌کند و تاریخ پایان حمایت را مشخص می‌کند. آن را با دقت بخوان.' },
      { n: '2', icon: '📱', title: 'eVisa بگیر', desc: 'Home Office یک حساب UKVI برایت ایجاد می‌کند. eVisa مدرک دیجیتالی وضعیتت است — برای باز کردن حساب بانکی، درخواست مسکن، یافتن کار و درخواست مزایا به آن نیاز داری.' },
      { n: '3', icon: '🏦', title: 'حساب بانکی باز کن', desc: 'حالا حق باز کردن حساب بانکی داری. eVisa و نامه تأییدیه را به بانک ببر. Lloyds، Halifax یا Barclays معمولاً پناهنده‌پذیرتر هستند.' },
      { n: '4', icon: '💷', title: 'درخواست Universal Credit بده', desc: 'فوری در gov.uk یا Jobcentre محلی درخواست Universal Credit بده. 5 هفته باید صبر کنی — همان روزی که نامه را گرفتی درخواست بده. می‌توانی Advance Payment درخواست کنی.' },
      { n: '5', icon: '🏠', title: 'مسکن را مرتب کن', desc: 'با شورای محلی تماس بگیر تا در لیست انتظار مسکن اجتماعی ثبت‌نام کنی. همچنین با خیریه‌ها و Migrant Help تماس بگیر.' },
      { n: '6', icon: '💼', title: 'دنبال کار بگرد', desc: 'حالا حق کار در هر شغلی در هر سطحی در UK داری. با Jobcentre Plus محلی تماس بگیر.' },
      { n: '7', icon: '🪪', title: 'شماره National Insurance بگیر', desc: 'برای کار، پرداخت مالیات و درخواست مزایا لازمی. اگر نداری در gov.uk درخواست بده.' },
      { n: '8', icon: '🏥', title: 'نزد GP ثبت‌نام کن', desc: 'نزد پزشک محلی ثبت‌نام کن. حالا دسترسی کامل به NHS داری. فرزندانت را هم ثبت‌نام کن و به مدرسه بفرست.' },
    ],
    rightsLabel: 'حقوق جدیدت',
    rightsTitle: 'وقتی وضعیت می‌گیری چه تغییر می‌کند',
    rights: [
      { icon: '💼', title: 'حق کار', desc: 'هر شغل، هر حرفه، هر سطح. بدون محدودیت.' },
      { icon: '💷', title: 'مزایای کامل', desc: 'Universal Credit، کمک هزینه مسکن، کمک هزینه فرزند و بیشتر.' },
      { icon: '🏠', title: 'مسکن اجتماعی', desc: 'می‌توانی در لیست انتظار مسکن شورا ثبت‌نام کنی.' },
      { icon: '🏥', title: 'NHS کامل', desc: 'دسترسی کامل به همه خدمات NHS.' },
      { icon: '🎓', title: 'تحصیل', desc: 'دسترسی به تحصیل رایگان و وام دانشجویی.' },
      { icon: '✈️', title: 'سند سفر', desc: 'می‌توانی سند سفر پناهندگی UK درخواست کنی.' },
    ],
    faqLabel: 'سوالات رایج',
    faqTitle: 'چیزهایی که مردم می‌پرسند',
    faqs: [
      { emoji: '⏰', q: 'واقعاً چقدر وقت دارم قبل از پایان حمایت؟', a: 'از مارس 2026، حمایت پناهندگی 42 روز پس از نامه تأییدیه پایان می‌یابد. نامه جداگانه‌ای دریافت می‌کنی با تاریخ دقیق. صبر نکن — همان روز اول درخواست Universal Credit بده.' },
      { emoji: '💷', q: 'Universal Credit چیست و چطور می‌گیرم؟', a: 'Universal Credit کمک اصلی برای افراد با درآمد پایین است. در gov.uk/universal-credit یا Jobcentre محلی درخواست بده. 5 هفته باید صبر کنی — همیشه Advance Payment درخواست کن.' },
      { emoji: '🏠', q: 'اگر جایی برای زندگی نداشتم چه کار کنم؟', a: 'فوری با شورای محلی تماس بگیر و بگو در خطر بی‌خانمانی هستی. همچنین با Shelter: 0808 800 4444 تماس بگیر.' },
    ],
    helpLabel: 'همین الان کمک بگیر',
    helpTitle: 'با کی تماس بگیری',
    helpers: [
      { emoji: '📞', name: 'Migrant Help', desc: 'مشاوره رایگان درباره مسکن و مزایا', number: '0808 8010 503', tag: 'رایگان · 24/7' },
      { emoji: '🏠', name: 'Shelter', desc: 'کمک بحران مسکن', number: '0808 800 4444', tag: 'رایگان' },
      { emoji: '⚖️', name: 'Refugee Council', desc: 'مشاوره کار، ادغام و حقوقی', number: '020 7346 6700', tag: 'رایگان' },
      { emoji: '💷', name: 'Citizens Advice', desc: 'راهنمای مزایا، مسکن و حقوق قانونی', number: '0800 144 8848', tag: 'رایگان' },
    ],
    warning: '⚠️ مهم: اگر از طریق قایق کوچک یا کامیون وارد UK شدی، تغییر سیاست 2025 ممکن است دائماً بر حق شهروندی بریتانیایی‌ات تأثیر بگذارد. هرچه زودتر مشاوره حقوقی بگیر.',
    disclaimer: '⚠️ این راهنما فقط برای اطلاعات است. قوانین و سیاست‌ها مرتباً تغییر می‌کنند. همیشه مشاوره حقوقی شخصی بگیر.',
  },
  ar: {
    heroLabel: 'المرحلة ٢',
    heroTitle: 'الإذن بالبقاء.',
    heroTitleItalic: 'تصرف بسرعة.',
    heroSub: 'منحت وضع اللاجئ. هذا خبر رائع — لكن لديك الآن وقت محدود لترتيب السكن والمزايا والحساب البنكي قبل انتهاء دعم اللجوء.',
    stat1: '42', stat1Label: 'يوماً قبل انتهاء الدعم',
    stat2: '5سنوات', stat2Label: 'إذن البقاء الممنوح',
    stat3: '£500', stat3Label: 'قرض الاندماج المتاح',
    stat4: '5أسابيع', stat4Label: 'انتظار Universal Credit',
    stepsLabel: 'ماذا تفعل الآن',
    stepsTitle: 'أول 42 يوماً',
    steps: [
      { n: '1', icon: '📬', title: 'اقرأ رسالة الموافقة', desc: 'ستتلقى رسالة من وزارة الداخلية تؤكد وضعك كلاجئ وتاريخ انتهاء دعم اللجوء. اقرأها بعناية.' },
      { n: '2', icon: '📱', title: 'احصل على eVisa', desc: 'ستنشئ وزارة الداخلية حساب UKVI لك. eVisa هو إثبات رقمي لوضعك — تحتاجه لفتح حساب بنكي وطلب السكن والعمل والمزايا.' },
      { n: '3', icon: '🏦', title: 'افتح حساباً بنكياً', desc: 'لديك الآن حق فتح حساب بنكي. خذ eVisa ورسالة الموافقة إلى بنك. Lloyds وHalifax وBarclays أكثر قبولاً للاجئين.' },
      { n: '4', icon: '💷', title: 'تقدم لـ Universal Credit', desc: 'تقدم فوراً في gov.uk أو Jobcentre المحلي. هناك انتظار 5 أسابيع — تقدم في نفس اليوم. يمكنك طلب دفعة مسبقة Advance Payment.' },
      { n: '5', icon: '🏠', title: 'رتب السكن', desc: 'تواصل مع مجلسك المحلي للانضمام لقائمة انتظار الإسكان الاجتماعي. تواصل أيضاً مع الجمعيات الخيرية و Migrant Help.' },
      { n: '6', icon: '💼', title: 'ابدأ البحث عن عمل', desc: 'لديك الآن حق العمل في أي وظيفة بأي مستوى في UK. تواصل مع Jobcentre Plus المحلي.' },
      { n: '7', icon: '🪪', title: 'احصل على رقم National Insurance', desc: 'تحتاجه للعمل ودفع الضرائب والمزايا. إذا لم يكن لديك، تقدم في gov.uk.' },
      { n: '8', icon: '🏥', title: 'سجل مع طبيب عام', desc: 'سجل مع طبيب محلي. لديك الآن وصول كامل لـ NHS. سجل أطفالك أيضاً وأدخلهم المدرسة.' },
    ],
    rightsLabel: 'حقوقك الجديدة',
    rightsTitle: 'ماذا يتغير عند الحصول على الوضع',
    rights: [
      { icon: '💼', title: 'حق العمل', desc: 'أي وظيفة، أي مهنة، أي مستوى. بلا قيود.' },
      { icon: '💷', title: 'المزايا الكاملة', desc: 'Universal Credit ومزايا السكن ومزايا الأطفال والمزيد.' },
      { icon: '🏠', title: 'الإسكان الاجتماعي', desc: 'يمكنك الانضمام لقائمة انتظار مجلس الإسكان.' },
      { icon: '🏥', title: 'NHS كامل', desc: 'وصول كامل لجميع خدمات NHS.' },
      { icon: '🎓', title: 'التعليم', desc: 'الوصول للتعليم المجاني والتمويل الجامعي.' },
      { icon: '✈️', title: 'وثيقة السفر', desc: 'يمكنك التقدم لوثيقة سفر اللاجئ البريطانية.' },
    ],
    faqLabel: 'أسئلة شائعة',
    faqTitle: 'ما يسأله الناس',
    faqs: [
      { emoji: '⏰', q: 'كم من الوقت لدي فعلاً قبل انتهاء الدعم؟', a: 'اعتباراً من مارس 2026، ينتهي دعم اللجوء بعد 42 يوماً من رسالة الموافقة. ستتلقى رسالة منفصلة بالتاريخ الدقيق. لا تنتظر — تقدم لـ Universal Credit في اليوم الأول.' },
      { emoji: '💷', q: 'ما هو Universal Credit وكيف أحصل عليه؟', a: 'هو المزيا الرئيسية للأشخاص ذوي الدخل المنخفض. تقدم في gov.uk/universal-credit أو Jobcentre المحلي. هناك انتظار 5 أسابيع — اطلب دائماً دفعة مسبقة Advance Payment.' },
      { emoji: '🏠', q: 'ماذا لو لم يكن لي مكان للعيش؟', a: 'تواصل فوراً مع مجلسك المحلي وأخبره أنك في خطر التشرد. تواصل أيضاً مع Shelter: 0808 800 4444.' },
    ],
    helpLabel: 'احصل على مساعدة الآن',
    helpTitle: 'من تتصل به',
    helpers: [
      { emoji: '📞', name: 'Migrant Help', desc: 'مشورة مجانية حول السكن والمزايا', number: '0808 8010 503', tag: 'مجاني · 24/7' },
      { emoji: '🏠', name: 'Shelter', desc: 'مساعدة أزمات السكن', number: '0808 800 4444', tag: 'مجاني' },
      { emoji: '⚖️', name: 'Refugee Council', desc: 'مشورة العمل والاندماج والقانون', number: '020 7346 6700', tag: 'مجاني' },
      { emoji: '💷', name: 'Citizens Advice', desc: 'إرشاد المزايا والسكن والحقوق القانونية', number: '0800 144 8848', tag: 'مجاني' },
    ],
    warning: '⚠️ مهم: إذا دخلت UK عبر قارب صغير أو شاحنة، قد يؤثر تغيير سياسة 2025 بشكل دائم على حقك في الجنسية البريطانية. احصل على مشورة قانونية في أقرب وقت.',
    disclaimer: '⚠️ هذا الدليل للمعلومات فقط. القوانين والسياسات تتغير باستمرار. احصل دائماً على مشورة قانونية شخصية.',
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
  const isRtl = lang === 'ku' || lang === 'fa' || lang === 'ar'

  return (
    <div style={{ fontFamily: FONT, direction: isRtl ? 'rtl' : 'ltr', background: BG, minHeight: '100vh', paddingBottom: 80 }}>

      {/* HERO */}
      <div style={{ background: '#064E3B', padding: '40px 24px 48px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(52,211,153,0.2)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 20, padding: '4px 14px', marginBottom: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: MINT, letterSpacing: 1.5 }}>{t.heroLabel}</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#fff', margin: '0 0 4px', lineHeight: 1.2, letterSpacing: -0.5 }}>{t.heroTitle}</h1>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: MINT, margin: '0 0 16px', lineHeight: 1.2, letterSpacing: -0.5, fontStyle: 'italic' }}>{t.heroTitleItalic}</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', margin: '0 0 36px', lineHeight: 1.7, fontWeight: 500 }}>{t.heroSub}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { val: t.stat1, label: t.stat1Label, color: '#FCA5A5' },
              { val: t.stat2, label: t.stat2Label, color: MINT },
              { val: t.stat3, label: t.stat3Label, color: '#FDE68A' },
              { val: t.stat4, label: t.stat4Label, color: '#A5B4FC' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 16, padding: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: s.color, letterSpacing: -0.5 }}>{s.val}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 600, marginTop: 4, lineHeight: 1.4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STEPS */}
      <div style={{ background: BG, padding: '40px 24px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: GREEN, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8, opacity: 0.8 }}>{t.stepsLabel}</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#064E3B', margin: '0 0 28px', letterSpacing: -0.3 }}>{t.stepsTitle}</h2>

          {/* Horizontal step circles */}
          <div style={{ overflowX: 'auto', paddingBottom: 8, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, minWidth: 'max-content', padding: '0 4px' }}>
              {t.steps.map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 80 }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: GREEN_LIGHT, border: `2px solid ${GREEN}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, position: 'relative', marginBottom: 8 }}>
                      {step.icon}
                      <div style={{ position: 'absolute', top: -6, right: isRtl ? 'auto' : -6, left: isRtl ? -6 : 'auto', width: 20, height: 20, borderRadius: '50%', background: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: '#fff' }}>
                        {step.n}
                      </div>
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 800, color: GREEN, textAlign: 'center', lineHeight: 1.3, width: 72 }}>{step.title}</div>
                  </div>
                  {i < t.steps.length - 1 && (
                    <div style={{ width: 24, height: 2, background: `${GREEN}30`, flexShrink: 0, marginBottom: 28 }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {t.steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 12, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: GREEN_LIGHT, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, border: `1.5px solid ${GREEN}30` }}>
                {step.icon}
              </div>
              <div style={{ flex: 1, background: '#fff', borderRadius: 14, padding: '12px 14px', border: '1px solid #D1FAE5', boxShadow: '0 2px 8px rgba(5,150,105,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: '#fff', flexShrink: 0 }}>{step.n}</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: GREEN }}>{step.title}</div>
                </div>
                <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.7, fontWeight: 500 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHTS */}
      <div style={{ background: '#064E3B', padding: '40px 24px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: MINT, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8, opacity: 0.8 }}>{t.rightsLabel}</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: '0 0 24px', letterSpacing: -0.3 }}>{t.rightsTitle}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {t.rights.map((r, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: '16px', border: '1px solid rgba(52,211,153,0.2)' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{r.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 6, lineHeight: 1.3 }}>{r.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, fontWeight: 500 }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WARNING BANNER */}
      <div style={{ background: '#FEF3C7', padding: '20px 24px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto', background: '#FFFBEB', borderRadius: 16, padding: '16px', border: '2px solid #FCD34D' }}>
          <div style={{ fontSize: 13, color: '#92400E', lineHeight: 1.7, fontWeight: 600 }}>{t.warning}</div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ background: BG, padding: '40px 24px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: GREEN, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8, opacity: 0.8 }}>{t.faqLabel}</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#064E3B', margin: '0 0 20px', letterSpacing: -0.3 }}>{t.faqTitle}</h2>
          {t.faqs.map((faq, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 16, marginBottom: 10, overflow: 'hidden', border: openFaq === i ? `1.5px solid ${GREEN}` : '1.5px solid #D1FAE5', boxShadow: openFaq === i ? `0 4px 20px rgba(5,150,105,0.1)` : '0 2px 8px rgba(5,150,105,0.04)', transition: 'all 0.2s' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', padding: '14px 16px', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', fontFamily: FONT, flexDirection: isRtl ? 'row-reverse' : 'row', textAlign: isRtl ? 'right' : 'left' }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: GREEN_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{faq.emoji}</div>
                <div style={{ flex: 1, fontSize: 14, fontWeight: 700, color: '#064E3B' }}>{faq.q}</div>
                <span style={{ fontSize: 18, color: openFaq === i ? GREEN : '#6EE7B7', transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(90deg)' : 'none', flexShrink: 0 }}>›</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 16px 16px', paddingInlineStart: isRtl ? 16 : 66 }}>
                  <div style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.8, fontWeight: 500, background: GREEN_LIGHT, borderRadius: 12, padding: '12px 14px' }}>{faq.a}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* HELP */}
      <div style={{ background: '#064E3B', padding: '40px 24px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: MINT, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8, opacity: 0.8 }}>{t.helpLabel}</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: '0 0 20px', letterSpacing: -0.3 }}>{t.helpTitle}</h2>
          {t.helpers.map((h, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: '14px 16px', marginBottom: 10, border: '1px solid rgba(52,211,153,0.2)', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(52,211,153,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{h.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, flexWrap: 'wrap' }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{h.name}</div>
                  <div style={{ background: 'rgba(52,211,153,0.2)', color: MINT, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{h.tag}</div>
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{h.desc}</div>
              </div>
              <a href={`tel:${h.number.replace(/\s/g, '')}`} style={{ background: MINT, color: '#064E3B', fontWeight: 800, fontSize: 12, padding: '8px 14px', borderRadius: 12, textDecoration: 'none', flexShrink: 0, whiteSpace: 'nowrap' }}>
                📞 {h.number}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* DISCLAIMER */}
      <div style={{ background: BG, padding: '20px 24px 40px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto', background: '#FFFBEB', borderRadius: 16, padding: '14px 16px', border: '1px solid rgba(251,191,36,0.3)' }}>
          <div style={{ fontSize: 12, color: '#92400E', lineHeight: 1.7, fontWeight: 500 }}>{t.disclaimer}</div>
        </div>
      </div>
    </div>
  )
}