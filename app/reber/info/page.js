'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const NAVY = '#1A2B5F'
const FONT = "'Plus Jakarta Sans', 'Sora', sans-serif"

const INFO_SECTIONS = [
  {
    id: 'health', icon: '🏥', color: '#EC4899',
    title: { en: 'Health', ku: 'تەندروستی', fa: 'سلامت', ar: 'الصحة' },
    points: {
      en: ['Register with a GP at nhs.uk/find-a-gp — no ID or immigration docs needed', 'You cannot be refused NHS treatment because of your immigration status', 'Always ask for a Kurdish/Sorani/Farsi/Arabic interpreter — it is free and your right', '999 = life-threatening emergency only | 111 = medical help, not emergency | GP = regular care', 'A&E is open 24/7 for serious injuries and illnesses', 'Dental care is free if you are on asylum support or Universal Credit', 'Mental health support is available — ask your GP for a referral'],
      ku: ['لەگەڵ GP تۆمار بکە لە nhs.uk/find-a-gp — پێویستت بە ناسنامە یان بەلگەی کۆچبەری نییە', 'ناتوانرێت بەهۆی مافی کۆچبەریتەوە ڕەتی چارەسەری NHS بکرێت', 'هەموو کاتێک داوای وەرگێڕی کوردی/سۆرانی/فارسی/عەرەبی بکە — بەخۆڕاییە و مافی توە', '999 = تەنها کریزی مەترسیدار بۆ ژیان | 111 = یارمەتیی تەندروستی، نەک کریز | GP = چارەسەری ئادی', 'A&E کراوەیە ٢٤/٧ بۆ ئەفتانی گیران و نەخۆشی گیران', 'چارەسەری دەندانی بەخۆڕاییە ئەگەر لەسەر پشتگیری ئامادەیی یان Universal Credit بیت', 'پشتگیری تەندروستیی دەروونی بەردەستە — لە GP ت داوابکە بنێرێتت'],
      fa: ['با GP در nhs.uk/find-a-gp ثبت‌نام کن — به مدرک هویت یا مدارک مهاجرتی نیاز نیست', 'به دلیل وضعیت مهاجرتی‌ات نمی‌توانند از درمان NHS محروم کنند', 'همیشه مترجم کردی/سورانی/فارسی/عربی بخواه — رایگان است و حق توست', '999 = فقط اورژانس تهدیدکننده حیات | 111 = کمک پزشکی غیراورژانسی | GP = مراقبت معمولی', 'اورژانس ۲۴/۷ برای آسیب‌ها و بیماری‌های جدی باز است', 'دندانپزشکی رایگان است اگر از حمایت پناهندگی یا Universal Credit استفاده می‌کنی', 'حمایت از سلامت روان در دسترس است — از GP ارجاع بخواه'],
      ar: ['سجّل لدى طبيب عام على nhs.uk/find-a-gp — لا تحتاج هوية أو وثائق هجرة', 'لا يمكن رفض علاجك في NHS بسبب وضع هجرتك', 'اطلب دائماً مترجماً كردياً/سورانياً/فارسياً/عربياً — مجاني وحقك', '999 = حالات الطوارئ المهددة للحياة فقط | 111 = مساعدة طبية غير طارئة | طبيب عام = رعاية منتظمة', 'الطوارئ مفتوحة 24/7 للإصابات والأمراض الخطيرة', 'رعاية الأسنان مجانية إذا كنت تتلقى دعم اللجوء أو Universal Credit', 'دعم الصحة النفسية متاح — اطلب إحالة من طبيبك'],
    }
  },
  {
    id: 'education', icon: '🎓', color: '#06B6D4',
    title: { en: 'Education', ku: 'خوێندن', fa: 'آموزش', ar: 'التعليم' },
    points: {
      en: ['All children aged 5-16 must be in school by law', 'Contact your local council to find a school place — they must provide one', 'Schools cannot refuse a child based on immigration status', 'EAL (English as Additional Language) support is available at most schools', 'Free school meals available if you receive asylum support or Universal Credit', 'ESOL (English for Speakers of Other Languages) classes are free — find them at esol.org.uk', 'Adults can access free college courses — ask your local college'],
      ku: ['هەموو منداڵی ٥-١٦ ساڵ بە یاسا دەبێت لە قوتابخانە بن', 'پەیوەندی بە شارداریی ناوچەکەت بکە بۆ دۆزینەوەی شوێنی قوتابخانە', 'قوتابخانەکان ناتوانن منداڵێک ڕەت بکەنەوە بەهۆی مافی کۆچبەریەوە', 'پشتگیری EAL لە زۆربەی قوتابخانەکان بەردەستە', 'خواردنی قوتابخانەی بەخۆڕایی بەردەستە ئەگەر پشتگیری ئامادەیی یان Universal Credit وەردەگریت', 'پۆلەکانی ESOL بەخۆڕایین — لە esol.org.uk بیدۆزەرەوە', 'گەورەسالان دەتوانن دەستبگەن بە کۆرسی کۆلێجی بەخۆڕایی'],
      fa: ['تمام کودکان ۵ تا ۱۶ ساله باید طبق قانون در مدرسه باشند', 'با شورای محلی‌ات تماس بگیر تا جای مدرسه پیدا کنی', 'مدارس نمی‌توانند کودکی را بر اساس وضعیت مهاجرتی رد کنند', 'حمایت EAL در اکثر مدارس موجود است', 'وعده غذایی رایگان مدرسه اگر حمایت پناهندگی یا Universal Credit دریافت می‌کنی', 'کلاس‌های ESOL رایگان هستند — در esol.org.uk پیدا کن', 'بزرگسالان می‌توانند به دوره‌های رایگان کالج دسترسی داشته باشند'],
      ar: ['يجب أن يكون جميع الأطفال من 5-16 في المدرسة بموجب القانون', 'تواصل مع مجلسك المحلي للعثور على مكان في المدرسة', 'لا يمكن للمدارس رفض طفل بسبب وضع هجرته', 'دعم EAL متاح في معظم المدارس', 'وجبات مدرسية مجانية للأطفال إذا كان دخلك منخفضاً', 'دروس ESOL مجانية — اعثر عليها على esol.org.uk', 'يمكن للبالغين الوصول إلى دورات الكلية المجانية'],
    }
  },
  {
    id: 'emergency', icon: '🆘', color: '#EF4444',
    title: { en: 'Emergency Contacts', ku: 'ژمارەکانی کریز', fa: 'اورژانس', ar: 'جهات الطوارئ' },
    points: {
      en: ['🚨 999 — Police, Fire, Ambulance (life-threatening ONLY)', '🏥 111 — NHS medical advice, non-emergency (free)', '👮 101 — Non-emergency police matters', '⚖️ Legal Aid Agency: 0300 200 2020', '🤝 Migrant Help: 0808 8010 503 (free, 24/7)', '💙 Samaritans: 116 123 (mental health crisis, free, 24/7)', '🏠 Shelter (housing crisis): 0808 800 4444', '💜 National Domestic Violence Helpline: 0808 2000 247'],
      ku: ['🚨 999 — پۆلیس، ئاگرکوژێنەوە، ئەمبولانس (تەنها کریزی مەترسیدار بۆ ژیان)', '🏥 111 — ڕاوێژی تەندروستیی NHS، نەک کریز (بەخۆڕایی)', '👮 101 — کارە پۆلیسیەکانی نەکریز', '⚖️ Legal Aid: 0300 200 2020', '🤝 Migrant Help: 0808 8010 503 (بەخۆڕایی، ٢٤/٧)', '💙 Samaritans: 116 123 (کریزی تەندروستیی دەروونی، بەخۆڕایی، ٢٤/٧)', '🏠 Shelter (کریزی مال): 0808 800 4444', '💜 هێڵی نیشتمانیی ئازاری ناوخانەوە: 0808 2000 247'],
      fa: ['🚨 999 — پلیس، آتش‌نشانی، آمبولانس (فقط تهدید حیاتی)', '🏥 111 — مشاوره پزشکی NHS، غیراورژانسی (رایگان)', '👮 101 — موارد پلیسی غیراورژانسی', '⚖️ Legal Aid: 0300 200 2020', '🤝 Migrant Help: 0808 8010 503 (رایگان، ۲۴/۷)', '💙 Samaritans: 116 123 (بحران سلامت روان، رایگان، ۲۴/۷)', '🏠 Shelter (بحران مسکن): 0808 800 4444', '💜 خط ملی خشونت خانگی: 0808 2000 247'],
      ar: ['🚨 999 — الشرطة والإطفاء والإسعاف (للتهديدات الحياتية فقط)', '🏥 111 — مشورة طبية NHS، غير طارئة (مجاني)', '👮 101 — شؤون الشرطة غير الطارئة', '⚖️ Legal Aid: 0300 200 2020', '🤝 Migrant Help: 0808 8010 503 (مجاني، 24/7)', '💙 Samaritans: 116 123 (أزمة الصحة النفسية، مجاني، 24/7)', '🏠 Shelter (أزمة السكن): 0808 800 4444', '💜 الخط الوطني للعنف المنزلي: 0808 2000 247'],
    }
  },
  {
    id: 'rights', icon: '⚖️', color: '#6366F1',
    title: { en: 'Know Your Rights', ku: 'مافەکانت بناسە', fa: 'حقوقت را بشناس', ar: 'اعرف حقوقك' },
    points: {
      en: ['You CANNOT be deported while an appeal is active', 'You ALWAYS have the right to a free interpreter — demand it', 'Police cannot stop you based on race, religion or appearance alone', 'Your employer MUST pay minimum wage regardless of your status', 'A landlord CANNOT evict you without a proper court order', 'Domestic abuse victims can leave and still receive support', 'Reporting exploitation will NOT harm your asylum case', 'You can report a hate crime safely: 0800 138 1625'],
      ku: ['ناتوانرێیت دیپۆرت بکرێیت لەکاتی چالاکبوونی تژیاوەکردنێک', 'هەموو کاتێک مافت هەیە بۆ وەرگێڕی بەخۆڕایی — داوایی بکە', 'پۆلیس ناتوانێت لەسەر بنچینەی ڕەگ، ئایین یان دیمەنت بیوەستێنێتت', 'کارفەرمات دەبێت کەمترین مووچە پێبدات بێ گوێرەی مافیت', 'خاوەن مالەکە ناتوانێت بەبێ فەرمانی دادگای دروست دەربکاتت', 'قوربانیانی ئازاری ناوخانە دەتوانن بچنە دەرەوە و هێشتا پشتگیری بگرن', 'ئاگادارکردنەوەی ئیستیسمار کێسی ئامادەیییەکەت خراپ ناکات', 'دەتوانیت کریمی ڕقەبەرانە بە ئارامی ڕاپۆرت بکەیت: 0800 138 1625'],
      fa: ['در حالی که استیناف فعال است نمی‌توانی اخراج شوی', 'همیشه حق داری به مترجم رایگان — آن را بخواه', 'پلیس نمی‌تواند فقط بر اساس نژاد، مذهب یا ظاهرت متوقفت کند', 'کارفرمایت باید صرف نظر از وضعیتت حداقل دستمزد بپردازد', 'صاحبخانه نمی‌تواند بدون حکم دادگاه مناسب اخراجت کند', 'قربانیان خشونت خانگی می‌توانند بروند و همچنان حمایت دریافت کنند', 'گزارش استثمار به پرونده پناهندگی‌ات آسیب نمی‌رساند', 'می‌توانی جرم نفرت‌آمیز را با خیال راحت گزارش دهی: 0800 138 1625'],
      ar: ['لا يمكن ترحيلك أثناء الاستئناف الناشط', 'لديك دائماً الحق في مترجم مجاني — اطلبه', 'لا يمكن للشرطة إيقافك بناءً على العرق أو الدين أو المظهر وحده', 'يجب أن يدفع لك صاحب العمل الحد الأدنى للأجر بغض النظر عن وضعك', 'لا يمكن للمالك إخلاءك دون أمر قضائي مناسب', 'يمكن لضحايا العنف الأسري المغادرة والحصول على دعم', 'الإبلاغ عن الاستغلال لن يضر بقضية لجوئك', 'يمكنك الإبلاغ عن جريمة كراهية بأمان: 0800 138 1625'],
    }
  },
  {
    id: 'money', icon: '💰', color: '#10B981',
    title: { en: 'Money & Benefits', ku: 'پارە و یارمەتییەکان', fa: 'پول و مزایا', ar: 'المال والمزايا' },
    points: {
      en: ['Universal Credit — main benefit for working-age adults — apply at gov.uk/universal-credit', 'Child Benefit — £25.60/week for first child, £16.95 for each additional child', 'Free school meals for children if on low income', 'Council tax reduction — apply at your local council', 'Healthy Start vouchers if pregnant or have children under 4', 'Warm Home Discount: £150 off energy bills if on certain benefits', 'Citizens Advice can check if you are claiming everything: 0800 144 8848'],
      ku: ['Universal Credit — یارمەتیی سەرەکی بۆ گەورەسالانی تەمەنی کارکردن — داواکاری بکە لە gov.uk/universal-credit', 'یارمەتیی منداڵ — ٢٥.٦٠ پاوەند/هەفتانە بۆ منداڵی یەکەم، ١٦.٩٥ بۆ هەر منداڵێکی زیادە', 'خواردنی قوتابخانەی بەخۆڕایی بۆ منداڵان ئەگەر داهاتی کەم بیت', 'کەمکردنەوەی باجی شار — لە شارداریی ناوچەکەتدا داواکاری بکە', 'بەرگەکانی Healthy Start ئەگەر دووگیانت یان منداڵی ژێر ٤ ساڵت هەیە', 'داشکاندنی مالی گەرم: ١٥٠ پاوەند کەمکردن لە ئەژمارەکانی وزە', 'Citizens Advice دەتوانێت بچێک بکات: 0800 144 8848'],
      fa: ['Universal Credit — مزیت اصلی برای بزرگسالان در سن کار — در gov.uk/universal-credit درخواست بده', 'کمک هزینه کودک — ۲۵.۶۰ پوند/هفته برای فرزند اول، ۱۶.۹۵ برای هر فرزند بعدی', 'وعده غذایی رایگان مدرسه برای کودکان اگر درآمد پایینی داری', 'کاهش مالیات شورا — در شورای محلی‌ات درخواست بده', 'کوپن‌های Healthy Start اگر باردار هستی یا کودک زیر ۴ سال داری', 'تخفیف گرمایش خانه: ۱۵۰ پوند تخفیف از قبض‌های انرژی', 'Citizens Advice می‌تواند بررسی کند: 0800 144 8848'],
      ar: ['Universal Credit — المزيا الرئيسية — تقدم على gov.uk/universal-credit', 'إعانة الطفل — 25.60 جنيهاً/أسبوعاً للطفل الأول، 16.95 لكل طفل إضافي', 'وجبات مدرسية مجانية للأطفال إذا كان دخلك منخفضاً', 'تخفيض ضريبة المجلس — تقدم في مجلسك المحلي', 'قسائم Healthy Start إذا كنت حاملاً أو لديك أطفال دون 4 سنوات', 'خصم المنزل الدافئ: 150 جنيهاً خصم من فواتير الطاقة', 'يمكن لـ Citizens Advice التحقق: 0800 144 8848'],
    }
  },
]

const TX = {
  en: { title: 'Info & Help', sub: 'Health, rights, money and more' },
  ku: { title: 'زانیاری و یارمەتی', sub: 'تەندروستی، ماف، پارە و زیاتر' },
  fa: { title: 'اطلاعات و کمک', sub: 'سلامت، حقوق، پول و بیشتر' },
  ar: { title: 'معلومات ومساعدة', sub: 'الصحة والحقوق والمال وأكثر' },
}

function InfoCard({ section, lang }) {
  const [open, setOpen] = useState(false)
  const isRtl = lang === 'ku' || lang === 'fa' || lang === 'ar'
  return (
    <div onClick={() => setOpen(!open)} style={{ background: '#fff', borderRadius: 16, marginBottom: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', cursor: 'pointer', border: `1.5px solid ${open ? section.color : 'transparent'}`, transition: 'border 0.2s' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px', direction: isRtl ? 'rtl' : 'ltr' }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${section.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{section.icon}</div>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 15, color: NAVY, flex: 1 }}>{section.title[lang] || section.title.en}</span>
        <span style={{ fontSize: 18, color: section.color, transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>›</span>
      </div>
      {open && (
        <div style={{ borderTop: `2px solid ${section.color}20`, padding: '4px 16px 16px', direction: isRtl ? 'rtl' : 'ltr' }}>
          {(section.points[lang] || section.points.en).map((point, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 10 }}>
              <span style={{ color: section.color, fontWeight: 900, fontSize: 16, flexShrink: 0, marginTop: 1 }}>•</span>
              <span style={{ fontFamily: FONT, fontSize: 14, color: '#333', lineHeight: 1.6 }}>{point}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function InfoHelpPage() {
  const [lang, setLang] = useState('en')

  useEffect(() => {
    const saved = localStorage.getItem('kurdlink_lang')
    if (saved && TX[saved]) setLang(saved)

    const handler = (e) => setLang(e.detail)
    window.addEventListener('langchange', handler)
    return () => window.removeEventListener('langchange', handler)
  }, [])

  const isRtl = lang === 'ku' || lang === 'fa' || lang === 'ar'

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF', fontFamily: FONT, direction: isRtl ? 'rtl' : 'ltr', paddingBottom: 80 }}>
      <div style={{ padding: '16px 16px 32px', maxWidth: 600, margin: '0 auto' }}>
        {INFO_SECTIONS.map((section) => (
          <InfoCard key={section.id} section={section} lang={lang} />
        ))}
      </div>
    </div>
  )
}