'use client'
import { useState, useEffect } from 'react'

const INDIGO = '#4F46E5'
const INDIGO_LIGHT = '#818CF8'
const INDIGO_DARK = '#1C1A4F'
const MINT = '#34D399'
const PURPLE = '#7C3AED'
const PURPLE_LIGHT = '#EDE9FE'
const BG = '#F5F4FF'
const FONT = "'Nunito', 'Plus Jakarta Sans', sans-serif"

const TX = {
  en: {
    heroLabel: 'STAGE 3',
    heroTitle: 'British Citizenship.',
    heroTitleItalic: 'The final step.',
    heroSub: 'The path from refugee status to a British passport. It takes time, patience and preparation — but it is possible.',
    stat1: '5yr', stat1Label: 'Leave to remain first',
    stat2: '1yr', stat2Label: 'Hold ILR before applying',
    stat3: '£1,709', stat3Label: 'Naturalisation fee (2026)',
    stat4: '450', stat4Label: 'Max days abroad in 5 years',
    stepsLabel: 'THE PATH TO CITIZENSHIP',
    stepsTitle: 'From Refugee to British Citizen',
    steps: [
      { n: '1', icon: '📄', title: 'Refugee Status (5 Years)', desc: 'When you are first granted refugee status you receive 5 years Leave to Remain. From March 2026, new applicants receive 30 months (2.5 years) instead. You must live in the UK lawfully during this period.' },
      { n: '2', icon: '🏠', title: 'Apply for Settlement (ILR)', desc: 'After 5 years (or 30 months for newer grants), apply for Indefinite Leave to Remain (ILR) — also called "Settlement" or "Settled Status". This gives you the right to live in the UK permanently with no time limit. Apply at gov.uk.' },
      { n: '3', icon: '📚', title: 'Pass the Life in the UK Test', desc: 'Before applying for citizenship you must pass the Life in the UK Test — 24 questions about British history, culture, values and laws. You must score at least 18/24. The test costs £50 and can be taken at approved centres. Study the official handbook first.' },
      { n: '4', icon: '🗣️', title: 'Prove Your English', desc: 'You must demonstrate English language ability. This can be done through an approved English language qualification, a degree taught in English, or being a national of an English-speaking country. Many refugees already meet this through their ESOL courses.' },
      { n: '5', icon: '📝', title: 'Apply for Naturalisation', desc: 'Once you have held ILR for at least 12 months, apply using Form AN at gov.uk. The fee is £1,709 as of April 2026 — be aware this is largely non-refundable even if refused. Include all documents: ILR proof, travel history, language evidence, two referees.' },
      { n: '6', icon: '🎉', title: 'Citizenship Ceremony', desc: 'If your application is approved, you will be invited to a citizenship ceremony where you take an oath or affirmation of allegiance and receive your certificate of naturalisation. You can then apply for a British passport.' },
    ],
    requirementsLabel: 'KEY REQUIREMENTS',
    requirementsTitle: 'What You Need to Qualify',
    requirements: [
      { icon: '🗓️', title: '5 Years Residence', desc: 'You must have lived lawfully in the UK for 5 years before applying (3 years if married to a British citizen).' },
      { icon: '🏠', title: 'Hold ILR for 1 Year', desc: 'You must have held Indefinite Leave to Remain for at least 12 months before applying for citizenship.' },
      { icon: '✈️', title: 'Limited Absences', desc: 'No more than 450 days outside the UK in the last 5 years, and no more than 90 days in the last 12 months.' },
      { icon: '📚', title: 'Life in the UK Test', desc: 'Pass the 24-question test about British life, history and values. Study the official handbook — it covers everything.' },
      { icon: '🗣️', title: 'English Language', desc: 'Demonstrate English ability through an approved qualification, degree or nationality exemption.' },
      { icon: '✅', title: 'Good Character', desc: 'No serious criminal record in the UK or abroad. The Home Office checks immigration compliance, honesty and financial responsibility.' },
    ],
    faqLabel: 'COMMON QUESTIONS',
    faqTitle: 'Things People Ask',
    faqs: [
      { emoji: '⚠️', q: 'I came on a small boat. Can I still get citizenship?', a: 'This is critical. A 2025 policy change may permanently block people who entered via "dangerous journeys" including small boats or lorries from obtaining British citizenship. This affects an estimated 71,000 refugees. Get legal advice urgently — contact the Refugee Council or a specialist immigration lawyer.' },
      { emoji: '🗓️', q: 'How long does the whole process take?', a: 'From first arriving to citizenship is typically 6+ years: 5 years leave to remain, then 12 months holding ILR, then applying. From March 2026, new refugees get 30 months leave initially, which may affect timelines. The naturalisation application itself takes around 6 months to process.' },
      { emoji: '💰', q: 'What does it cost?', a: 'The naturalisation fee is £1,709 as of April 2026. Only the £130 ceremony fee is refunded if your application is refused — so only apply when you are confident you meet all requirements. Get legal advice before applying.' },
      { emoji: '🌍', q: 'Do I have to give up my original nationality?', a: 'The UK allows dual nationality, so you can keep your original passport alongside your British one. However, some countries do not allow dual citizenship — check your home country\'s rules before applying, as becoming British might mean losing your original nationality automatically.' },
      { emoji: '📚', q: 'How do I pass the Life in the UK Test?', a: 'Buy and study the official "Life in the United Kingdom: A Guide for New Residents" handbook — the test is taken entirely from this book. Practice tests are available online. The test is 45 minutes, 24 questions, and you need 18/24 to pass. It costs £50 per attempt.' },
      { emoji: '🇬🇧', q: 'What can I do with a British passport?', a: 'A British passport allows visa-free or visa-on-arrival access to over 190 countries. You can vote in all UK elections, stand for public office, pass British citizenship to your children, and never face immigration controls in the UK again.' },
      { emoji: '👨‍👩‍👧', q: 'What about my children?', a: 'Children born in the UK to a parent who is a British citizen or settled are British automatically. Children born before you got citizenship can be registered as British citizens — this is a separate (cheaper) process. Get advice from the Refugee Council or Citizens Advice.' },
      { emoji: '📋', q: 'What is the "good character" requirement?', a: 'The Home Office assesses your criminal history (in the UK and abroad), whether you have been honest in immigration applications, your financial responsibility (e.g. unpaid debts to the government), and whether you have complied with UK laws. Minor issues do not always prevent citizenship — get legal advice if unsure.' },
    ],
    helpLabel: 'GET HELP',
    helpTitle: 'Who Can Help You Apply',
    helpers: [
      { emoji: '⚖️', name: 'Refugee Council', desc: 'Free advice on citizenship and settlement', number: '020 7346 6700', tag: 'Free' },
      { emoji: '💷', name: 'Citizens Advice', desc: 'Free guidance on immigration rights', number: '0800 144 8848', tag: 'Free' },
      { emoji: '📞', name: 'Migrant Help', desc: 'Support navigating the immigration system', number: '0808 8010 503', tag: 'Free · 24/7' },
      { emoji: '📚', name: 'UKCISA', desc: 'Education and settlement advice for migrants', number: '020 7788 9214', tag: 'Free' },
    ],
    warning: '⚠️ Critical: If you entered the UK via a small boat, lorry or other "dangerous journey", a 2025 policy change may permanently block you from British citizenship regardless of how long you have lived here. Get specialist legal advice immediately.',
    disclaimer: '⚠️ This guide is for information only. Immigration law changes frequently. Always get personal legal advice before applying for citizenship — a refused application costs over £1,500.',
  },
  ku: {
    heroLabel: 'قۆناغی ٣',
    heroTitle: 'هاووڵاتیی بریتانی.',
    heroTitleItalic: 'هەنگاوی کۆتایی.',
    heroSub: 'ڕێگای گەیشتن لە مافی ئامادەیی تا پاسپۆرتی بریتانی. کات، سەبر و ئامادەکاری پێویستە — بەلام گەنجینەیەکە.',
    stat1: '٥ ساڵ', stat1Label: 'یەکەم مۆڵەتی مانەوە',
    stat2: '١ ساڵ', stat2Label: 'ILR بگرە پێش داواکردن',
    stat3: '١٧٠٩£', stat3Label: 'کرێی نیشتمانی (٢٠٢٦)',
    stat4: '٤٥٠', stat4Label: 'زۆرترین ڕۆژ دەرەوە لە ٥ ساڵ',
    stepsLabel: 'ڕێگای هاووڵاتیی',
    stepsTitle: 'لە پەناهبەر تا هاووڵاتیی بریتانی',
    steps: [
      { n: '١', icon: '📄', title: 'مافی ئامادەیی (٥ ساڵ)', desc: 'کاتێک مافی ئامادەییت دەدرێت، ٥ ساڵ مۆڵەتی مانەوەت وەردەگریت. لە مارسی ٢٠٢٦ەوە، داواکارانی نوێ ٣٠ مانگ وەردەگرن. دەبێت لە ئەم ماوەیەدا بە یاسایی لە UK بژیی.' },
      { n: '٢', icon: '🏠', title: 'داوای نیشتەجێبوون (ILR) بکە', desc: 'دوای ٥ ساڵ، داوای نیشتەجێبوونی بەردەوام (ILR) بکە. ئەمە مافی ماوونەت لە UK بەبێ سنووری کات دەدات. داوا بکە لە gov.uk.' },
      { n: '٣', icon: '📚', title: 'تاقیکردنەوەی ژیان لە UK تێپەڕبکە', desc: 'پێویستە تاقیکردنەوەی ژیان لە UK تێپەڕبکەیت — ٢٤ پرسیار دەربارەی مێژوو، کەلتوور، بەهاکان و یاسای بریتانی. پێویستە لانیکەم ١٨/٢٤ وەریبگریت. ٥٠ پاوەند تێدەچێت.' },
      { n: '٤', icon: '🗣️', title: 'ئینگلیزییەکەت ثابتبکە', desc: 'پێویستە ئەنگلیزی ئیسپاتبکەیت لە ڕێگای مەزوونیەتی ئەنگلیزیی یان بروانامەی خوێندنی بەرزی ئینگلیزیی. زۆرێک لە پەناهبەران لە ڕێگای خوێندنکاریەکانی ESOL ئەمەیان تەواوکردووە.' },
      { n: '٥', icon: '📝', title: 'داوای نیشتمانی بکە', desc: 'کاتێک ILR لانیکەم ١٢ مانگ لەلایەنت هەبوو، داوا بکە بە فۆرمی AN لە gov.uk. کرێکە ١٧٠٩ پاوەند لە ئەپریلی ٢٠٢٦ — زۆرینەی ئەمە ئەگەر ڕەتکرایتەوە گەڕانەوەی نییە.' },
      { n: '٦', icon: '🎉', title: 'ئایینی هاووڵاتیی', desc: 'ئەگەر داواکەت قبووڵکرا، داوەتت دەکرێت بۆ ئایینی هاووڵاتیی کە تێیدا سوێند دەخوریت و بروانامەی نیشتمانیکردنت وەردەگریت. دوانی ئاواش دەتوانیت داوای پاسپۆرتی بریتانی بکەیت.' },
    ],
    requirementsLabel: 'مەرجە سەرەکییەکان',
    requirementsTitle: 'چی پێویستە بۆ شایستەبوون',
    requirements: [
      { icon: '🗓️', title: '٥ ساڵ نیشتەجێبوون', desc: 'پێویستە ٥ ساڵ بە یاسایی لە UK ژیابیت پێش داواکردن.' },
      { icon: '🏠', title: 'ILR لە ١ ساڵ بگرە', desc: 'پێویستە ILR لانیکەم ١٢ مانگ لەلایەنت هەبێت پێش داواکردنی هاووڵاتیی.' },
      { icon: '✈️', title: 'مانەوەی دەرەوە سنووردار', desc: 'نە زیاتر لە ٤٥٠ ڕۆژ لە دەرەوەی UK لە ٥ ساڵی دواوە.' },
      { icon: '📚', title: 'تاقیکردنەوەی ژیان لە UK', desc: 'تاقیکردنەوەی ٢٤ پرسیاری دەربارەی ژیانی بریتانی تێپەڕبکە.' },
      { icon: '🗣️', title: 'زمانی ئینگلیزی', desc: 'توانای ئینگلیزی ئیسپات بکە.' },
      { icon: '✅', title: 'خوی باش', desc: 'هیچ تۆمەتی گرنگی تاوانکارانە لە UK یان دەرەوەی نییە.' },
    ],
    faqLabel: 'پرسیارە باوەکان',
    faqTitle: 'شتەی کەسان دەیپرسن',
    faqs: [
      { emoji: '⚠️', q: 'بە بەلەمی بچووک هاتم. دەتوانم هاووڵاتیی بگرم؟', a: 'ئەمە زۆر گرنگە. گۆڕانکارییەکی سیاسەتی ٢٠٢٥ لەوانەیە بە دایمی بەر کەسانێک ببەستێت کە لە ڕێگای "گەشتی مەترسیدار" هاتوون لە بەدەستهێنانی هاووڵاتیی بریتانی. فەوری ڕاوێژی یاسایی بگرە.' },
      { emoji: '🗓️', q: 'هەموو پرۆسەکە چەند دەخایەنێت؟', a: 'لە گەیشتن تا هاووڵاتیی معمولاً ٦+ ساڵ دەخایەنێت: ٥ ساڵ مۆڵەتی مانەوە، دواتر ١٢ مانگ گرتنی ILR، دواتر داواکاری. خودی داواکارییەکە نزیکەی ٦ مانگ دەخایەنێت.' },
      { emoji: '💰', q: 'چەند تێدەچێت؟', a: 'کرێی نیشتمانیکردن ١٧٠٩ پاوەندە لە ئەپریلی ٢٠٢٦. تەنها ١٣٠ پاوەندی ئایینەکە گەڕانەوەدەکرێت ئەگەر ڕەتکرایتەوە — تەنها داوابکە کاتێک دڵنیایت لە هەموو مەرجەکان.' },
      { emoji: '🌍', q: 'پێویستمە نیشتمانیی کەیم بگێڕمەوە؟', a: 'UK دوو نیشتمانیەتی ڕێدەدات، بەلام هەندێک وڵات ڕێنادات. پشکنینی یاسای وڵاتی خۆتت بکە پێش داواکردن.' },
    ],
    helpLabel: 'یارمەتی بگرە',
    helpTitle: 'کێ دەتوانێت یارمەتیت بدات',
    helpers: [
      { emoji: '⚖️', name: 'Refugee Council', desc: 'ڕاوێژی بەخۆڕایی دەربارەی هاووڵاتیی و نیشتەجێبوون', number: '020 7346 6700', tag: 'بەخۆڕایی' },
      { emoji: '💷', name: 'Citizens Advice', desc: 'ڕێنمای بەخۆڕایی دەربارەی مافی کۆچ', number: '0800 144 8848', tag: 'بەخۆڕایی' },
      { emoji: '📞', name: 'Migrant Help', desc: 'پشتگیری لە ناوبردن لە سیستەمی کۆچ', number: '0808 8010 503', tag: 'بەخۆڕایی · ٢٤/٧' },
      { emoji: '📚', name: 'UKCISA', desc: 'ڕاوێژی پەروەردە و نیشتەجێبوون', number: '020 7788 9214', tag: 'بەخۆڕایی' },
    ],
    warning: '⚠️ گرنگ: ئەگەر لە ڕێگای بەلەمی بچووک، کامیۆن یان "گەشتی مەترسیدار"ی تر گەیشتیتە UK، گۆڕانکارییەکی سیاسەتی ٢٠٢٥ لەوانەیە بە دایمی بەر تووبگەیتەوە لە هاووڵاتیی بریتانی. فەوری ڕاوێژی یاساییی پسپۆڕ بگرە.',
    disclaimer: '⚠️ ئەم ڕێنمایە تەنها بۆ زانیارییە. یاسای کۆچ بەردەوام دەگۆڕێت. پێش داواکردنی هاووڵاتیی هەموو کاتێک ڕاوێژی یاساییی کەسیگرەو بگرە.',
  },
  fa: {
    heroLabel: 'مرحله ۳',
    heroTitle: 'شهروندی بریتانیا.',
    heroTitleItalic: 'قدم آخر.',
    heroSub: 'مسیر از وضعیت پناهندگی تا پاسپورت بریتانیایی. زمان، صبر و آمادگی لازم است — اما ممکن است.',
    stat1: '5سال', stat1Label: 'ابتدا اجازه اقامت',
    stat2: '1سال', stat2Label: 'نگه داشتن ILR قبل از درخواست',
    stat3: '£1,709', stat3Label: 'هزینه تابعیت (2026)',
    stat4: '450', stat4Label: 'حداکثر روز خارج در 5 سال',
    stepsLabel: 'مسیر شهروندی',
    stepsTitle: 'از پناهنده تا شهروند بریتانیایی',
    steps: [
      { n: '1', icon: '📄', title: 'وضعیت پناهندگی (5 سال)', desc: 'وقتی وضعیت پناهندگی می‌گیری، 5 سال اجازه اقامت دریافت می‌کنی. از مارس 2026، درخواست‌دهندگان جدید 30 ماه دریافت می‌کنند. باید در این مدت به صورت قانونی در UK زندگی کنی.' },
      { n: '2', icon: '🏠', title: 'درخواست اسکان (ILR)', desc: 'پس از 5 سال، درخواست اقامت دائم (ILR) بده. این حق ماندن دائمی در UK را بدون محدودیت زمانی می‌دهد. در gov.uk درخواست بده.' },
      { n: '3', icon: '📚', title: 'قبولی در آزمون Life in the UK', desc: 'باید آزمون Life in the UK را بگذری — 24 سوال درباره تاریخ، فرهنگ، ارزش‌ها و قوانین بریتانیا. باید حداقل 18/24 بگیری. هزینه £50 است.' },
      { n: '4', icon: '🗣️', title: 'اثبات زبان انگلیسی', desc: 'باید توانایی انگلیسی را از طریق مدرک زبان مورد تایید یا مدرک دانشگاهی به انگلیسی اثبات کنی.' },
      { n: '5', icon: '📝', title: 'درخواست تابعیت', desc: 'وقتی ILR را حداقل 12 ماه داشتی، با فرم AN در gov.uk درخواست بده. هزینه £1,709 از آوریل 2026 است — اگر رد شوی عموماً بازگردانده نمی‌شود.' },
      { n: '6', icon: '🎉', title: 'مراسم شهروندی', desc: 'اگر درخواستت تأیید شد، به مراسم شهروندی دعوت می‌شوی. پس از آن می‌توانی پاسپورت بریتانیایی درخواست کنی.' },
    ],
    requirementsLabel: 'شرایط کلیدی',
    requirementsTitle: 'برای واجد شرایط بودن چه نیاز داری',
    requirements: [
      { icon: '🗓️', title: '5 سال اقامت', desc: 'باید 5 سال قانونی در UK زندگی کرده باشی قبل از درخواست.' },
      { icon: '🏠', title: 'نگه داشتن ILR 1 سال', desc: 'باید حداقل 12 ماه ILR داشته باشی قبل از درخواست شهروندی.' },
      { icon: '✈️', title: 'غیبت محدود', desc: 'حداکثر 450 روز خارج از UK در 5 سال گذشته.' },
      { icon: '📚', title: 'آزمون Life in the UK', desc: '24 سوال درباره زندگی، تاریخ و ارزش‌های بریتانی را بگذر.' },
      { icon: '🗣️', title: 'زبان انگلیسی', desc: 'توانایی انگلیسی را از طریق مدرک تأیید شده اثبات کن.' },
      { icon: '✅', title: 'حسن سابقه', desc: 'هیچ پرونده جنایی جدی در UK یا خارج نداشته باشی.' },
    ],
    faqLabel: 'سوالات رایج',
    faqTitle: 'چیزهایی که مردم می‌پرسند',
    faqs: [
      { emoji: '⚠️', q: 'با قایق کوچک آمدم. آیا می‌توانم شهروندی بگیرم؟', a: 'این بسیار مهم است. تغییر سیاست 2025 ممکن است به طور دائم افرادی که از طریق "سفر خطرناک" آمدند را از شهروندی بریتانیایی محروم کند. فوری مشاوره حقوقی بگیر.' },
      { emoji: '🗓️', q: 'کل فرآیند چقدر طول می‌کشد؟', a: 'از ورود تا شهروندی معمولاً 6+ سال طول می‌کشد: 5 سال اجازه اقامت، سپس 12 ماه نگه داشتن ILR، سپس درخواست. خود درخواست تابعیت حدود 6 ماه طول می‌کشد.' },
      { emoji: '💰', q: 'هزینه چقدر است؟', a: 'هزینه تابعیت £1,709 از آوریل 2026 است. فقط £130 هزینه مراسم در صورت رد شدن بازگردانده می‌شود — فقط وقتی مطمئن هستی درخواست بده.' },
    ],
    helpLabel: 'کمک بگیر',
    helpTitle: 'چه کسی می‌تواند کمک کند',
    helpers: [
      { emoji: '⚖️', name: 'Refugee Council', desc: 'مشاوره رایگان درباره شهروندی و اسکان', number: '020 7346 6700', tag: 'رایگان' },
      { emoji: '💷', name: 'Citizens Advice', desc: 'راهنمای رایگان حقوق مهاجرتی', number: '0800 144 8848', tag: 'رایگان' },
      { emoji: '📞', name: 'Migrant Help', desc: 'پشتیبانی در سیستم مهاجرت', number: '0808 8010 503', tag: 'رایگان · 24/7' },
      { emoji: '📚', name: 'UKCISA', desc: 'مشاوره تحصیل و اسکان', number: '020 7788 9214', tag: 'رایگان' },
    ],
    warning: '⚠️ مهم: اگر از طریق قایق کوچک، کامیون یا "سفر خطرناک" دیگری وارد UK شدی، تغییر سیاست 2025 ممکن است دائماً شهروندی بریتانیایی را برایت ممنوع کند. فوری مشاوره حقوقی متخصص بگیر.',
    disclaimer: '⚠️ این راهنما فقط برای اطلاعات است. قوانین مهاجرت مرتباً تغییر می‌کند. قبل از درخواست شهروندی همیشه مشاوره حقوقی شخصی بگیر.',
  },
  ar: {
    heroLabel: 'المرحلة ٣',
    heroTitle: 'الجنسية البريطانية.',
    heroTitleItalic: 'الخطوة الأخيرة.',
    heroSub: 'المسار من وضع اللاجئ إلى جواز السفر البريطاني. يستغرق وقتاً وصبراً وإعداداً — لكنه ممكن.',
    stat1: '5سنوات', stat1Label: 'إذن البقاء أولاً',
    stat2: '1سنة', stat2Label: 'احتفظ بـ ILR قبل التقديم',
    stat3: '£1,709', stat3Label: 'رسوم التجنيس (2026)',
    stat4: '450', stat4Label: 'أقصى أيام خارج في 5 سنوات',
    stepsLabel: 'مسار الجنسية',
    stepsTitle: 'من لاجئ إلى مواطن بريطاني',
    steps: [
      { n: '1', icon: '📄', title: 'وضع اللاجئ (5 سنوات)', desc: 'عند منحك وضع اللاجئ، تحصل على إذن البقاء لمدة 5 سنوات. من مارس 2026، يحصل المتقدمون الجدد على 30 شهراً. يجب أن تعيش في المملكة المتحدة بصورة قانونية خلال هذه الفترة.' },
      { n: '2', icon: '🏠', title: 'تقدم للتسوية (ILR)', desc: 'بعد 5 سنوات، تقدم لإقامة دائمة غير محددة (ILR). هذا يمنحك حق الإقامة الدائمة في UK بدون قيود زمنية. تقدم في gov.uk.' },
      { n: '3', icon: '📚', title: 'اجتز اختبار الحياة في UK', desc: 'يجب اجتياز اختبار Life in the UK — 24 سؤالاً عن التاريخ والثقافة والقيم والقوانين البريطانية. يجب الحصول على 18/24 على الأقل. التكلفة £50.' },
      { n: '4', icon: '🗣️', title: 'أثبت مستوى الإنجليزية', desc: 'يجب إثبات الكفاءة في اللغة الإنجليزية من خلال مؤهل لغوي معتمد أو درجة علمية باللغة الإنجليزية.' },
      { n: '5', icon: '📝', title: 'تقدم للتجنيس', desc: 'بمجرد امتلاكك ILR لمدة 12 شهراً على الأقل، تقدم باستخدام النموذج AN في gov.uk. الرسوم £1,709 من أبريل 2026 — معظمها غير مسترد إذا رُفض.' },
      { n: '6', icon: '🎉', title: 'حفل الجنسية', desc: 'إذا قُبل طلبك، ستُدعى لحفل الجنسية حيث تقسم اليمين وتحصل على شهادة التجنيس. بعدها يمكنك التقدم لجواز سفر بريطاني.' },
    ],
    requirementsLabel: 'المتطلبات الأساسية',
    requirementsTitle: 'ما تحتاجه للتأهل',
    requirements: [
      { icon: '🗓️', title: '5 سنوات إقامة', desc: 'يجب أن تكون قد أقمت قانونياً في UK لمدة 5 سنوات قبل التقديم.' },
      { icon: '🏠', title: 'احتفظ بـ ILR سنة', desc: 'يجب امتلاك ILR لمدة 12 شهراً على الأقل قبل التقدم للجنسية.' },
      { icon: '✈️', title: 'غيابات محدودة', desc: 'لا تزيد عن 450 يوماً خارج UK في السنوات الخمس الأخيرة.' },
      { icon: '📚', title: 'اختبار الحياة في UK', desc: 'اجتز 24 سؤالاً عن الحياة والتاريخ والقيم البريطانية.' },
      { icon: '🗣️', title: 'اللغة الإنجليزية', desc: 'أثبت الكفاءة في الإنجليزية من خلال مؤهل معتمد.' },
      { icon: '✅', title: 'حسن السيرة', desc: 'لا توجد سجلات جنائية خطيرة في UK أو الخارج.' },
    ],
    faqLabel: 'أسئلة شائعة',
    faqTitle: 'ما يسأله الناس',
    faqs: [
      { emoji: '⚠️', q: 'جئت بقارب صغير. هل لا يزال بإمكاني الحصول على الجنسية؟', a: 'هذا بالغ الأهمية. قد يحظر بشكل دائم تغيير سياسة 2025 الأشخاص الذين وصلوا عبر "رحلات خطرة" بما فيها القوارب الصغيرة والشاحنات من الحصول على الجنسية البريطانية. احصل على مشورة قانونية متخصصة فوراً.' },
      { emoji: '🗓️', q: 'كم يستغرق الأمر كله؟', a: 'من الوصول إلى الجنسية يستغرق عادةً 6+ سنوات: 5 سنوات إذن بقاء، ثم 12 شهراً مع ILR، ثم التقديم. طلب التجنيس نفسه يستغرق نحو 6 أشهر.' },
      { emoji: '💰', q: 'ما هي التكلفة؟', a: 'رسوم التجنيس £1,709 من أبريل 2026. فقط £130 رسوم الحفل يُسترد إذا رُفض الطلب — تقدم فقط عندما تكون واثقاً من استيفاء جميع الشروط.' },
    ],
    helpLabel: 'احصل على مساعدة',
    helpTitle: 'من يمكنه مساعدتك',
    helpers: [
      { emoji: '⚖️', name: 'Refugee Council', desc: 'مشورة مجانية حول الجنسية والتسوية', number: '020 7346 6700', tag: 'مجاني' },
      { emoji: '💷', name: 'Citizens Advice', desc: 'إرشاد مجاني حول حقوق الهجرة', number: '0800 144 8848', tag: 'مجاني' },
      { emoji: '📞', name: 'Migrant Help', desc: 'دعم التنقل في منظومة الهجرة', number: '0808 8010 503', tag: 'مجاني · 24/7' },
      { emoji: '📚', name: 'UKCISA', desc: 'مشورة التعليم والتسوية', number: '020 7788 9214', tag: 'مجاني' },
    ],
    warning: '⚠️ مهم: إذا دخلت UK عبر قارب صغير أو شاحنة أو "رحلة خطرة" أخرى، قد يحظر بشكل دائم تغيير سياسة 2025 حصولك على الجنسية البريطانية بغض النظر عن مدة إقامتك. احصل على مشورة قانونية متخصصة فوراً.',
    disclaimer: '⚠️ هذا الدليل للمعلومات فقط. قوانين الهجرة تتغير باستمرار. احصل دائماً على مشورة قانونية شخصية قبل التقدم للجنسية.',
  },
}

export default function CitizenshipPage() {
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
      <div style={{ background: '#2E1065', padding: '40px 24px 48px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(167,139,250,0.2)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 20, padding: '4px 14px', marginBottom: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#C4B5FD', letterSpacing: 1.5 }}>{t.heroLabel}</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#fff', margin: '0 0 4px', lineHeight: 1.2, letterSpacing: -0.5 }}>{t.heroTitle}</h1>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#C4B5FD', margin: '0 0 16px', lineHeight: 1.2, letterSpacing: -0.5, fontStyle: 'italic' }}>{t.heroTitleItalic}</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', margin: '0 0 36px', lineHeight: 1.7, fontWeight: 500 }}>{t.heroSub}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { val: t.stat1, label: t.stat1Label, color: '#C4B5FD' },
              { val: t.stat2, label: t.stat2Label, color: MINT },
              { val: t.stat3, label: t.stat3Label, color: '#FCA5A5' },
              { val: t.stat4, label: t.stat4Label, color: '#FDE68A' },
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
          <div style={{ fontSize: 11, fontWeight: 800, color: PURPLE, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8, opacity: 0.8 }}>{t.stepsLabel}</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#2E1065', margin: '0 0 28px', letterSpacing: -0.3 }}>{t.stepsTitle}</h2>

          <div style={{ overflowX: 'auto', paddingBottom: 8, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, minWidth: 'max-content', padding: '0 4px' }}>
              {t.steps.map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 80 }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: PURPLE_LIGHT, border: `2px solid ${PURPLE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, position: 'relative', marginBottom: 8 }}>
                      {step.icon}
                      <div style={{ position: 'absolute', top: -6, right: isRtl ? 'auto' : -6, left: isRtl ? -6 : 'auto', width: 20, height: 20, borderRadius: '50%', background: PURPLE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: '#fff' }}>
                        {step.n}
                      </div>
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 800, color: PURPLE, textAlign: 'center', lineHeight: 1.3, width: 72 }}>{step.title}</div>
                  </div>
                  {i < t.steps.length - 1 && (
                    <div style={{ width: 24, height: 2, background: `${PURPLE}30`, flexShrink: 0, marginBottom: 28 }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {t.steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 12, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: PURPLE_LIGHT, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, border: `1.5px solid ${PURPLE}30` }}>
                {step.icon}
              </div>
              <div style={{ flex: 1, background: '#fff', borderRadius: 14, padding: '12px 14px', border: '1px solid #EDE9FE', boxShadow: '0 2px 8px rgba(124,58,237,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: PURPLE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: '#fff', flexShrink: 0 }}>{step.n}</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: PURPLE }}>{step.title}</div>
                </div>
                <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.7, fontWeight: 500 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REQUIREMENTS */}
      <div style={{ background: '#2E1065', padding: '40px 24px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#C4B5FD', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8, opacity: 0.8 }}>{t.requirementsLabel}</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: '0 0 24px', letterSpacing: -0.3 }}>{t.requirementsTitle}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {t.requirements.map((r, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: '16px', border: '1px solid rgba(196,181,253,0.2)' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{r.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 6, lineHeight: 1.3 }}>{r.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, fontWeight: 500 }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WARNING */}
      <div style={{ background: '#FEF3C7', padding: '20px 24px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto', background: '#FFFBEB', borderRadius: 16, padding: '16px', border: '2px solid #FCD34D' }}>
          <div style={{ fontSize: 13, color: '#92400E', lineHeight: 1.7, fontWeight: 600 }}>{t.warning}</div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ background: BG, padding: '40px 24px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: PURPLE, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8, opacity: 0.8 }}>{t.faqLabel}</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#2E1065', margin: '0 0 20px', letterSpacing: -0.3 }}>{t.faqTitle}</h2>
          {t.faqs.map((faq, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 16, marginBottom: 10, overflow: 'hidden', border: openFaq === i ? `1.5px solid ${PURPLE}` : '1.5px solid #EDE9FE', boxShadow: openFaq === i ? `0 4px 20px rgba(124,58,237,0.1)` : '0 2px 8px rgba(124,58,237,0.04)', transition: 'all 0.2s' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', padding: '14px 16px', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', fontFamily: FONT, flexDirection: isRtl ? 'row-reverse' : 'row', textAlign: isRtl ? 'right' : 'left' }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: PURPLE_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{faq.emoji}</div>
                <div style={{ flex: 1, fontSize: 14, fontWeight: 700, color: '#2E1065' }}>{faq.q}</div>
                <span style={{ fontSize: 18, color: openFaq === i ? PURPLE : '#C4B5FD', transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(90deg)' : 'none', flexShrink: 0 }}>›</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 16px 16px', paddingInlineStart: isRtl ? 16 : 66 }}>
                  <div style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.8, fontWeight: 500, background: PURPLE_LIGHT, borderRadius: 12, padding: '12px 14px' }}>{faq.a}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* HELP */}
      <div style={{ background: '#2E1065', padding: '40px 24px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#C4B5FD', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8, opacity: 0.8 }}>{t.helpLabel}</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: '0 0 20px', letterSpacing: -0.3 }}>{t.helpTitle}</h2>
          {t.helpers.map((h, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: '14px 16px', marginBottom: 10, border: '1px solid rgba(196,181,253,0.2)', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(196,181,253,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{h.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, flexWrap: 'wrap' }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{h.name}</div>
                  <div style={{ background: 'rgba(196,181,253,0.2)', color: '#C4B5FD', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{h.tag}</div>
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{h.desc}</div>
              </div>
              <a href={`tel:${h.number.replace(/\s/g, '')}`} style={{ background: '#C4B5FD', color: '#2E1065', fontWeight: 800, fontSize: 12, padding: '8px 14px', borderRadius: 12, textDecoration: 'none', flexShrink: 0, whiteSpace: 'nowrap' }}>
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