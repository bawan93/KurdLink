'use client'
const HEADING = "'Plus Jakarta Sans', sans-serif"
import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

const BUSINESSES = [
  { id: 1, av: 'A', color: '#FF6B35', type: 0, rating: 4.9, rc: 128, verified: true, open: true, phone: '+44 20 7946 0958', whatsapp: '+447700900123', address: '47 Commercial Rd, London E1 1LN', website: 'ahmadlaw.co.uk', kurdish: true, name: { en: 'Ahmad & Co Law', ku: 'ئەحمەد و هاوکارەکانی', ar: 'أحمد ومشاركوه' }, btype: { en: 'Immigration Lawyer', ku: 'پارێزەری کۆچبەری', ar: 'محامي هجرة' }, about: { en: 'A specialist immigration and asylum law firm based in London, serving the Kurdish community across the UK for over 12 years. Fully Kurdish-speaking team.', ku: 'فەرمی تایبەت بە یاسای کۆچبەری و پەناگەرایەتی لە لەندەن، بۆ مەودای ١٢ ساڵ خزمەت بە کۆمەڵگای کوردی دەکات.', ar: 'شركة قانونية متخصصة في الهجرة واللجوء مقرها لندن، تخدم المجتمع الكردي منذ أكثر من ١٢ عامًا.' }, services: { en: ['Asylum & Refugee Claims', 'Family Reunification', 'Visa Appeals', 'ILR Applications', 'Naturalisation'], ku: ['داواکاری پەناگەرایەتی', 'یەکخستنەوەی خێزان', 'پێداچوونەوەبەی ڤیزا', 'داواکاری ILR', 'تابعیەت'], ar: ['طلبات اللجوء', 'لمّ شمل الأسرة', 'استئنافات التأشيرة', 'طلبات ILR', 'التجنيس'] }, reviews: [{ name: 'Shilan M.', rating: 5, av: 'S', color: '#FF6B35', text: { en: 'Ahmad helped my family through an incredibly difficult asylum process. Highly recommend.', ku: 'ئەحمەد یارمەتیی خێزانم دا لە پرۆسەی پەناگەرایەتی. زۆر پێشنیازی دەکەم.', ar: 'ساعد أحمد عائلتي في عملية اللجوء الصعبة. أوصي به بشدة.' } }, { name: 'Karwan B.', rating: 5, av: 'K', color: '#4ECDC4', text: { en: 'Professional and honest. Got my ILR approved after two rejections.', ku: 'پیشەیی و راستگۆ. ILRم پاش دوو ڕەتکردنەوە پەسەند کرا.', ar: 'محترف وصادق. تمت الموافقة على ILR بعد رفضين.' } }, { name: 'Dilan H.', rating: 4, av: 'D', color: '#C77DFF', text: { en: 'Very knowledgeable. The result was positive.', ku: 'زۆر زانابوو. ئەنجامەکە ئەرێنی بوو.', ar: 'على دراية واسعة. كانت النتيجة إيجابية.' } }], stats: { yearsExp: 12, cases: 500, success: 98 }, hours: { en: 'Mon–Fri, 9am–6pm', ku: 'دووشەممە-هەینی، ٩ب–٦ئێ', ar: 'الاثنين–الجمعة، ٩ص–٦م' }, langs: { en: ['Kurdish', 'Arabic', 'English'], ku: ['کوردی', 'عەرەبی', 'ئینگلیزی'], ar: ['الكردية', 'العربية', 'الإنجليزية'] } },
  { id: 2, av: 'S', color: '#4ECDC4', type: 1, rating: 4.8, rc: 94, verified: true, open: true, phone: '+44 20 7946 0111', whatsapp: '+447700900456', address: '12 Whitechapel High St, London E1 7PT', website: 'drsarakarim.co.uk', kurdish: true, name: { en: 'Dr. Sara Karim', ku: 'دکتۆر سارا کەریم', ar: 'د. سارة كريم' }, btype: { en: 'GP • Healthcare', ku: 'دکتۆر • تەندروستی', ar: 'طبيب عام' }, about: { en: 'A Kurdish-speaking GP providing NHS and private healthcare services in London. Specialising in family medicine with over 10 years experience.', ku: 'دکتۆری کوردی زوان کە خزمەتگوزاری تەندروستی NHS و تایبەتی لە لەندەن دەکات.', ar: 'طبيب عام يتحدث الكردية يقدم خدمات الرعاية الصحية في لندن.' }, services: { en: ['General Consultations', 'Family Medicine', 'Mental Health Support', 'Chronic Disease Management', 'Health Screenings'], ku: ['مشورەی گشتی', 'پزیشکی خێزانی', 'پشتیوانی تەندروستی دەروونی', 'بەڕێوەبردنی نەخۆشی درێژخایەن', 'پشکنینی تەندروستی'], ar: ['استشارات عامة', 'طب الأسرة', 'دعم الصحة النفسية', 'إدارة الأمراض المزمنة', 'الفحوصات الصحية'] }, reviews: [{ name: 'Narin A.', rating: 5, av: 'N', color: '#4ECDC4', text: { en: 'Dr Sara is amazing. She speaks Kurdish and makes you feel comfortable.', ku: 'دکتۆر سارا نایابە. کوردی قسە دەکات و ئارامت پێ دەدات.', ar: 'الدكتورة سارة رائعة. تتحدث الكردية وتجعلك مرتاحاً.' } }, { name: 'Soran M.', rating: 5, av: 'S', color: '#FF6B35', text: { en: 'Best doctor I have seen in years. Very thorough and caring.', ku: 'باشترین دکتۆرێکی کە لە ساڵانی دواین بینیومە.', ar: 'أفضل طبيب رأيته منذ سنوات. دقيق ومهتم جداً.' } }], stats: { yearsExp: 10, cases: 2000, success: 99 }, hours: { en: 'Mon–Fri, 8am–5pm', ku: 'دووشەممە-هەینی، ٨ب–٥ئێ', ar: 'الاثنين–الجمعة، ٨ص–٥م' }, langs: { en: ['Kurdish', 'Arabic', 'English'], ku: ['کوردی', 'عەرەبی', 'ئینگلیزی'], ar: ['الكردية', 'العربية', 'الإنجليزية'] } },
  { id: 3, av: 'R', color: '#C77DFF', type: 2, rating: 5.0, rc: 61, verified: true, open: false, phone: '+44 121 946 0222', whatsapp: '+447700900789', address: '88 Broad St, Birmingham B1 2HF', website: 'renasaccountancy.co.uk', kurdish: true, name: { en: 'Renas Accountancy', ku: 'ژمێریاری ڕێناس', ar: 'شركة رينا للمحاسبة' }, btype: { en: 'Chartered Accountant', ku: 'ژمێریاری مەزوون', ar: 'محاسب قانوني' }, about: { en: 'Chartered accountants serving the Kurdish business community across the UK. Specialists in tax returns, self-assessment, and business accounting.', ku: 'ژمێریارە مەزوونەکان کە خزمەتی کۆمەڵگای کاروباری کوردی لەسەرانسەری وەڵات دەکەن.', ar: 'محاسبون قانونيون يخدمون مجتمع الأعمال الكردي في جميع أنحاء المملكة المتحدة.' }, services: { en: ['Tax Returns', 'Self-Assessment', 'Business Accounting', 'VAT Returns', 'Payroll Management'], ku: ['داوای باج', 'هەڵسەنگاندنی خۆی', 'ژمێریاری کاروبار', 'VAT', 'بەڕێوەبردنی مووچە'], ar: ['الإقرار الضريبي', 'التقييم الذاتي', 'محاسبة الأعمال', 'ضريبة القيمة المضافة', 'إدارة الرواتب'] }, reviews: [{ name: 'Azad K.', rating: 5, av: 'A', color: '#C77DFF', text: { en: 'Renas sorted my tax return quickly and saved me money. Highly recommended.', ku: 'ڕێناس داوای باجەکەم خێرا چارەسەر کرد و پارەم پاشەکەوت کرد.', ar: 'رينا رتّب إقراري الضريبي بسرعة ووفّر لي المال.' } }], stats: { yearsExp: 8, cases: 300, success: 100 }, hours: { en: 'Mon–Fri, 9am–5pm', ku: 'دووشەممە-هەینی، ٩ب–٥ئێ', ar: 'الاثنين–الجمعة، ٩ص–٥م' }, langs: { en: ['Kurdish', 'English'], ku: ['کوردی', 'ئینگلیزی'], ar: ['الكردية', 'الإنجليزية'] } },
  { id: 4, av: 'A', color: '#96CEB4', type: 3, rating: 4.7, rc: 43, verified: false, open: true, phone: '+44 20 7946 0333', whatsapp: '+447700900321', address: '22 Mile End Rd, London E1 4AA', website: '', kurdish: true, name: { en: 'Ari Driving School', ku: 'قوتابخانەی شوفێری ئاری', ar: 'مدرسة أري للقيادة' }, btype: { en: 'Driving Instructor', ku: 'مامۆستای شوفێری', ar: 'مدرب قيادة' }, about: { en: 'DVSA approved driving instructor offering manual and automatic lessons in East London. Patient and experienced, with over 7 years teaching experience.', ku: 'مامۆستای شوفێری پەسەندکراوی DVSA کە وانەی دەستی و ئۆتۆماتیک لە ئیست لەندەن دەدات.', ar: 'مدرب قيادة معتمد من DVSA يقدم دروساً يدوية وأوتوماتيكية في شرق لندن.' }, services: { en: ['Manual Lessons', 'Automatic Lessons', 'Motorway Driving', 'Pass Plus', 'Refresher Lessons'], ku: ['وانەی دەستی', 'وانەی ئۆتۆماتیک', 'شوفێری ئۆتۆبان', 'Pass Plus', 'وانەی نوێکردنەوە'], ar: ['دروس يدوية', 'دروس أوتوماتيكية', 'قيادة الطريق السريع', 'Pass Plus', 'دروس تجديد'] }, reviews: [{ name: 'Hana R.', rating: 5, av: 'H', color: '#96CEB4', text: { en: 'Passed first time thanks to Ari! Very patient instructor.', ku: 'یەکەم جار تێپەڕیم مەرسی ئاری! مامۆستایەکی زۆر سەبر هەیە.', ar: 'نجحت من المرة الأولى بفضل أري! مدرب صبور جداً.' } }], stats: { yearsExp: 7, cases: 200, success: 87 }, hours: { en: 'Mon–Sun, 7am–8pm', ku: 'دووشەممە-یەکشەممە، ٧ب–٨ئێ', ar: 'الاثنين–الأحد، ٧ص–٨م' }, langs: { en: ['Kurdish', 'English'], ku: ['کوردی', 'ئینگلیزی'], ar: ['الكردية', 'الإنجليزية'] } },
  { id: 5, av: 'B', color: '#E76F51', type: 4, rating: 4.9, rc: 87, verified: true, open: true, phone: '+44 20 7946 0444', whatsapp: '+447700900654', address: '5 Brick Lane, London E1 6RF', website: 'barantranslation.co.uk', kurdish: true, name: { en: 'Baran Translation', ku: 'وەرگێڕانی باران', ar: 'ترجمة باران' }, btype: { en: 'Certified Translator', ku: 'وەرگێڕی مەزوون', ar: 'مترجم معتمد' }, about: { en: 'Professional certified translation services in Kurdish, Arabic and English. Specialising in legal and medical document translation.', ku: 'خزمەتگوزاری وەرگێڕانی پیشەیی مەزوون بە کوردی، عەرەبی و ئینگلیزی.', ar: 'خدمات ترجمة احترافية معتمدة بالكردية والعربية والإنجليزية.' }, services: { en: ['Legal Translation', 'Medical Translation', 'Certified Documents', 'Court Interpreting', 'Phone Interpreting'], ku: ['وەرگێڕانی یاسایی', 'وەرگێڕانی پزیشکی', 'بەڵگە مەزوون', 'وەرگێڕانی دادگا', 'وەرگێڕانی تەلەفۆن'], ar: ['ترجمة قانونية', 'ترجمة طبية', 'وثائق معتمدة', 'ترجمة فورية للمحاكم', 'ترجمة هاتفية'] }, reviews: [{ name: 'Roj S.', rating: 5, av: 'R', color: '#E76F51', text: { en: 'Fast and accurate translation. Used them for my court documents.', ku: 'وەرگێڕانی خێرا و ورد. بۆ بەڵگەی دادگاکەم بەکارمان هێنا.', ar: 'ترجمة سريعة ودقيقة. استخدمتهم لوثائق المحكمة.' } }], stats: { yearsExp: 6, cases: 1500, success: 99 }, hours: { en: 'Mon–Fri, 9am–6pm', ku: 'دووشەممە-هەینی، ٩ب–٦ئێ', ar: 'الاثنين–الجمعة، ٩ص–٦م' }, langs: { en: ['Kurdish', 'Arabic', 'English'], ku: ['کوردی', 'عەرەبی', 'ئینگلیزی'], ar: ['الكردية', 'العربية', 'الإنجليزية'] } },
  { id: 6, av: 'K', color: '#45B7D1', type: 5, rating: 4.6, rc: 32, verified: true, open: false, phone: '+44 20 7946 0555', whatsapp: '+447700900987', address: '99 Edgware Rd, London W2 2HU', website: 'kawatravel.co.uk', kurdish: false, name: { en: 'Kawa Travel', ku: 'گەشتی کاوە', ar: 'كاوا للسفر' }, btype: { en: 'Travel Agent', ku: 'ئاژانسی گەشت', ar: 'وكيل سفر' }, about: { en: 'Full service travel agency specialising in flights and holidays to Kurdistan, Middle East and beyond. Over 15 years in the travel industry.', ku: 'ئاژانسی گەشتی تەواو کە تایبەتی بە فڕۆکە و پشووی کوردستان، ناوەراستی ئاسیا و ئەوتریش.', ar: 'وكالة سفر متكاملة متخصصة في الرحلات إلى كردستان والشرق الأوسط.' }, services: { en: ['Flight Booking', 'Holiday Packages', 'Hotel Reservations', 'Visa Assistance', 'Group Travel'], ku: ['فرۆکەپەسەندکردن', 'پاکێجی پشوو', 'ئوتێل', 'یارمەتی ڤیزا', 'گەشتی کۆمەڵی'], ar: ['حجز الطيران', 'باقات العطلات', 'حجز الفنادق', 'مساعدة التأشيرة', 'السفر الجماعي'] }, reviews: [{ name: 'Bnar T.', rating: 5, av: 'B', color: '#45B7D1', text: { en: 'Booked our family holiday to Erbil through Kawa. Excellent service.', ku: 'پشووی خێزانمان بۆ هەولێر لە ڕێگای کاوەوە گرتین. خزمەتگوزاری نایاب.', ar: 'حجزنا عطلة عائلية إلى أربيل عبر كاوا. خدمة ممتازة.' } }], stats: { yearsExp: 15, cases: 5000, success: 97 }, hours: { en: 'Mon–Sat, 9am–7pm', ku: 'دووشەممە-شەممە، ٩ب–٧ئێ', ar: 'الاثنين–السبت، ٩ص–٧م' }, langs: { en: ['Kurdish', 'Arabic', 'English'], ku: ['کوردی', 'عەرەبی', 'ئینگلیزی'], ar: ['الكردية', 'العربية', 'الإنجليزية'] } },
]

const TX = {
  en: { dir: 'ltr', verified: '✓ Verified', openNow: 'Open Now', closed: 'Closed', kurdishSp: 'Kurdish Speaking', reviews: 'reviews', about: 'About', services: 'Services', reviewsTab: 'Reviews', contact: 'Contact', save: 'Save', saved: '♥ Saved', sendEnquiry: '✉ Send Enquiry', enquirySent: 'Sent ✓', yearsExp: 'Years Exp.', cases: 'Cases', success: 'Success', hours: 'Hours', languages: 'Languages', call: 'Call', whatsapp: 'WhatsApp', address: 'Address', website: 'Website', home: 'Home', search: 'Search', savedNav: 'Saved', messages: 'Messages', profile: 'Profile', back: '← Back' },
  ku: { dir: 'rtl', verified: '✓ دڵنیاکراوە', openNow: 'ئێستا کراوەیە', closed: 'داخراوە', kurdishSp: 'کوردی قسەدەکات', reviews: 'نرخاندن', about: 'دەربارە', services: 'خزمەتگوزارییەکان', reviewsTab: 'نرخاندنەکان', contact: 'پەیوەندی', save: 'پاشەکەوت', saved: '♥ پاشەکەوتکرا', sendEnquiry: '✉ پرسیار بنێرە', enquirySent: 'نێردرا ✓', yearsExp: 'ساڵی ئەزموون', cases: 'دەعوا', success: 'سەرکەوتن', hours: 'کاتژمێر', languages: 'زمانەکان', call: 'پەیوەندی', whatsapp: 'واتساپ', address: 'ناونیشان', website: 'ماڵپەڕ', home: 'سەرەکی', search: 'گەڕان', savedNav: 'پاشەکەوت', messages: 'نامە', profile: 'پرۆفایل', back: '→ گەڕانەوە' },
  ar: { dir: 'rtl', verified: '✓ موثق', openNow: 'مفتوح الآن', closed: 'مغلق', kurdishSp: 'يتحدث الكردية', reviews: 'تقييمات', about: 'نبذة', services: 'الخدمات', reviewsTab: 'التقييمات', contact: 'تواصل', save: 'حفظ', saved: '♥ محفوظ', sendEnquiry: '✉ إرسال استفسار', enquirySent: 'تم الإرسال ✓', yearsExp: 'سنة خبرة', cases: 'قضية', success: 'نجاح', hours: 'ساعات العمل', languages: 'اللغات', call: 'اتصال', whatsapp: 'واتساب', address: 'العنوان', website: 'الموقع', home: 'الرئيسية', search: 'بحث', savedNav: 'المحفوظة', messages: 'الرسائل', profile: 'الملف', back: '→ رجوع' },
}

const stars = (n) => '★'.repeat(Math.floor(n)) + '☆'.repeat(5 - Math.floor(n))

export default function BusinessProfile() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const [activeTab, setActiveTab] = useState(0)
  const [isSaved, setIsSaved] = useState(false)
  const [enquirySent, setEnquirySent] = useState(false)
  const t = TX[lang]
  const isRtl = t.dir === 'rtl'

  const urlParams = useParams()
  const id = parseInt(urlParams.id)
  const biz = BUSINESSES.find(b => b.id === id) || BUSINESSES[0]

  const tabs = [t.about, t.services, t.reviewsTab, t.contact]

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', background: '#F5F5F7', fontFamily: isRtl ? "'Noto Sans Arabic', sans-serif" : "'DM Sans', sans-serif", direction: t.dir }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=DM+Sans:wght@400;500;600;700;800&family=Noto+Sans+Arabic:wght@400;600;700;800&display=swap" rel="stylesheet" />

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg,#1C1C2E,#2D1B4E)', padding: '16px 16px 56px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,107,53,.12)', filter: 'blur(35px)', pointerEvents: 'none' }} />

        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <button onClick={() => router.back()} style={{ background: 'rgba(255,255,255,.1)', border: 'none', borderRadius: '10px', padding: '8px 13px', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 600, fontFamily: 'inherit' }}>{t.back}</button>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['en', 'ku', 'ar'].map(l => (
              <button key={l} onClick={() => setLang(l)} style={{ padding: '4px 9px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 700, fontFamily: 'inherit', background: lang === l ? '#FF6B35' : 'rgba(255,255,255,.15)', color: '#fff' }}>{l.toUpperCase()}</button>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginBottom: '12px' }}>
          <span style={{ background: 'rgba(255,107,53,.2)', color: '#FF8C61', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '50px' }}>{biz.btype[lang]}</span>
          {biz.verified && <span style={{ background: 'rgba(78,205,196,.2)', color: '#4ECDC4', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '50px' }}>{t.verified}</span>}
          {biz.kurdish && <span style={{ background: 'rgba(255,255,255,.1)', color: 'rgba(255,255,255,.8)', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '50px' }}>🗣 {t.kurdishSp}</span>}
        </div>

        <h1 style={{ fontFamily: HEADING, fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '5px', lineHeight: 1.2 }}>{biz.name[lang]}</h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,.6)', marginBottom: '12px' }}>{biz.btype[lang]} • {biz.address.split(',').slice(-1)[0].trim()}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ color: '#F4A261', fontSize: '14px' }}>{stars(biz.rating)}</span>
          <span style={{ fontWeight: 800, fontSize: '14px', color: '#fff' }}>{biz.rating}</span>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,.5)' }}>({biz.rc} {t.reviews})</span>
          <span style={{ color: 'rgba(255,255,255,.3)' }}>•</span>
          <span style={{ fontSize: '12px', color: biz.open ? '#4ECDC4' : 'rgba(255,255,255,.5)' }}>● {biz.open ? t.openNow : t.closed}</span>
        </div>
      </div>

      {/* CARD */}
      <div style={{ background: '#fff', borderRadius: '22px', padding: '20px', margin: '0 14px', marginTop: '-38px', position: 'relative', zIndex: 10, boxShadow: '0 8px 36px rgba(0,0,0,.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '13px', marginBottom: '16px' }}>
          <div style={{ width: '54px', height: '54px', borderRadius: '16px', background: `linear-gradient(135deg,${biz.color},${biz.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>{biz.av}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: HEADING, fontSize: '15px', fontWeight: 800, color: '#1C1C1E', marginBottom: '2px' }}>{biz.name[lang]}</div>
            <div style={{ fontSize: '11px', color: '#8E8E93' }}>🕐 {biz.hours[lang]}</div>
          </div>
          <button onClick={() => setIsSaved(!isSaved)} style={{ background: isSaved ? '#FFF0EB' : '#F5F5F7', border: 'none', borderRadius: '11px', padding: '8px 12px', fontSize: '12px', fontWeight: 700, color: isSaved ? '#FF6B35' : '#8E8E93', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>{isSaved ? t.saved : t.save}</button>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <button onClick={() => setEnquirySent(true)} style={{ flex: 2, padding: '11px', background: enquirySent ? '#E6F9F5' : 'linear-gradient(135deg,#FF6B35,#FF8C61)', border: 'none', borderRadius: '13px', fontSize: '12px', fontWeight: 700, color: enquirySent ? '#1DB87A' : '#fff', cursor: 'pointer', fontFamily: 'inherit', boxShadow: enquirySent ? 'none' : '0 4px 14px rgba(255,107,53,.25)' }}>{enquirySent ? t.enquirySent : t.sendEnquiry}</button>
          <a href={`https://wa.me/${biz.whatsapp.replace(/[^0-9]/g, '')}`} style={{ flex: 1, padding: '11px', background: '#E7F9EF', border: 'none', borderRadius: '13px', fontSize: '13px', color: '#25D366', cursor: 'pointer', textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>💬</a>
          <a href={`tel:${biz.phone}`} style={{ flex: 1, padding: '11px', background: '#F5F5F7', border: 'none', borderRadius: '13px', fontSize: '13px', cursor: 'pointer', textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📞</a>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {[[`${biz.stats.yearsExp}+`, t.yearsExp], [`${biz.stats.cases}+`, t.cases], [`${biz.stats.success}%`, t.success]].map(([v, l]) => (
            <div key={l} style={{ flex: 1, background: '#F5F5F7', borderRadius: '12px', padding: '12px 8px', textAlign: 'center' }}>
              <div style={{ fontFamily: HEADING, fontSize: '18px', fontWeight: 800, color: '#FF6B35', marginBottom: '2px' }}>{v}</div>
              <div style={{ fontSize: '10px', color: '#8E8E93', fontWeight: 600 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TABS */}
      <div style={{ padding: '13px 14px 80px' }}>
        <div style={{ display: 'flex', background: '#F5F5F7', borderRadius: '13px', padding: '4px', marginBottom: '13px' }}>
          {tabs.map((tab, i) => (
            <button key={i} onClick={() => setActiveTab(i)} style={{ flex: 1, padding: '9px 3px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '11px', fontWeight: 600, background: activeTab === i ? '#fff' : 'transparent', color: activeTab === i ? '#1C1C1E' : '#8E8E93', boxShadow: activeTab === i ? '0 2px 8px rgba(0,0,0,.08)' : 'none', transition: 'all .2s' }}>{tab}</button>
          ))}
        </div>

        {/* About */}
        {activeTab === 0 && (
          <div style={{ background: '#fff', borderRadius: '18px', padding: '18px', boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
            <p style={{ fontSize: '13px', color: '#636366', lineHeight: 1.75, marginBottom: '13px' }}>{biz.about[lang]}</p>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '8px' }}>{t.languages}</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {biz.langs[lang].map((l, i) => <span key={i} style={{ background: '#FFF0EB', color: '#FF6B35', fontWeight: 700, fontSize: '12px', padding: '5px 12px', borderRadius: '50px' }}>{l}</span>)}
            </div>
          </div>
        )}

        {/* Services */}
        {activeTab === 1 && (
          <div style={{ background: '#fff', borderRadius: '18px', padding: '18px', boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
            {biz.services[lang].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '9px', background: '#F5F5F7', borderRadius: '11px', padding: '11px 13px', marginBottom: '7px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `linear-gradient(135deg,${biz.color},${biz.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', flexShrink: 0, color: '#fff', fontWeight: 700 }}>{i + 1}</div>
                <span style={{ fontWeight: 600, fontSize: '13px', color: '#1C1C1E' }}>{s}</span>
              </div>
            ))}
          </div>
        )}

        {/* Reviews */}
        {activeTab === 2 && (
          <div style={{ background: '#fff', borderRadius: '18px', padding: '18px', boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
            {biz.reviews.map((r, i) => (
              <div key={i} style={{ background: '#F5F5F7', borderRadius: '14px', padding: '14px', marginBottom: '9px' }}>
                <div style={{ display: 'flex', gap: '9px', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: `linear-gradient(135deg,${r.color},${r.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>{r.av}</div>
                  <div>
                    <div style={{ fontFamily: HEADING, fontWeight: 700, fontSize: '13px', color: '#1C1C1E' }}>{r.name}</div>
                    <span style={{ color: '#F4A261', fontSize: '11px' }}>{stars(r.rating)}</span>
                  </div>
                </div>
                <p style={{ fontSize: '12px', color: '#636366', lineHeight: 1.65 }}>{r.text[lang]}</p>
              </div>
            ))}
          </div>
        )}

        {/* Contact */}
        {activeTab === 3 && (
          <div style={{ background: '#fff', borderRadius: '18px', padding: '18px', boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
            {[
              ['📞', t.call, biz.phone, `tel:${biz.phone}`],
              ['💬', t.whatsapp, biz.whatsapp, `https://wa.me/${biz.whatsapp.replace(/[^0-9]/g, '')}`],
              ['📍', t.address, biz.address, `https://maps.google.com/?q=${encodeURIComponent(biz.address)}`],
              ...(biz.website ? [['🌐', t.website, biz.website, `https://${biz.website}`]] : []),
            ].map(([icon, label, val, href]) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', gap: '11px', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #F5F5F7', cursor: 'pointer', textDecoration: 'none' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FFF0EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', flexShrink: 0 }}>{icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '11px', color: '#AEAEB2', fontWeight: 600, marginBottom: '1px' }}>{label}</div>
                  <div style={{ fontSize: '13px', color: '#1C1C1E', fontWeight: 600 }}>{val}</div>
                </div>
                <span style={{ color: '#AEAEB2', fontSize: '15px' }}>{isRtl ? '‹' : '›'}</span>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '480px', background: 'rgba(255,255,255,.97)', borderTop: '1px solid rgba(0,0,0,.07)', display: 'flex', zIndex: 50 }}>
        {[
          { id: 'home', icon: '⊞', label: t.home, path: '/' },
          { id: 'search', icon: '🔍', label: t.search, path: '/search' },
          { id: 'saved', icon: '♡', label: t.savedNav, path: '/saved' },
          { id: 'messages', icon: '✉', label: t.messages, path: '/messages' },
          { id: 'profile', icon: '◉', label: t.profile, path: '/profile' },
        ].map(item => (
          <button key={item.id} onClick={() => router.push(item.path)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0', fontFamily: 'inherit' }}>
            <span style={{ fontSize: '20px', color: '#AEAEB2' }}>{item.icon}</span>
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#AEAEB2' }}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}