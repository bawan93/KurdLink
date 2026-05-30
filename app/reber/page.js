'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import LangDropdown from '@/components/LangDropdown'

const NAVY = '#1A2B5F'
const ORANGE = '#FF6B35'
const FONT = "'Plus Jakarta Sans', 'Sora', sans-serif"

function getSupabase() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

const ADMIN_EMAIL = 'bawanhozhin@outlook.com'

// ─── STAGES ───────────────────────────────────────────────────────────────────
const STAGES = [
  { id: 'arrived',  emoji: '🛬', color: '#3B82F6', label: { en: 'Just Arrived',  ku: 'تازە گەیشتووم',   fa: 'تازه رسیدم',      ar: 'وصلت للتو'      } },
  { id: 'waiting',  emoji: '⏳', color: '#F59E0B', label: { en: 'Waiting',       ku: 'چاوەڕوانم',       fa: 'در انتظارم',      ar: 'في الانتظار'    } },
  { id: 'granted',  emoji: '✅', color: '#10B981', label: { en: 'Status Granted', ku: 'مافم درا',        fa: 'وضعیت تأیید شد',  ar: 'مُنح الوضع'     } },
  { id: 'refused',  emoji: '❌', color: '#EF4444', label: { en: 'Refused',        ku: 'ڕەتکرایەوە',     fa: 'رد شد',           ar: 'رُفض'           } },
  { id: 'settled',  emoji: '🏡', color: '#8B5CF6', label: { en: 'Settled',        ku: 'جێگیرکراوە',     fa: 'مستقر شدم',       ar: 'استقررت'        } },
  { id: 'citizen',  emoji: '🇬🇧', color: '#F59E0B', label: { en: 'Citizen Path',  ku: 'ڕێگای هاووڵاتی', fa: 'مسیر شهروندی',    ar: 'مسار المواطنة'  } },
]

// ─── CONTENT ──────────────────────────────────────────────────────────────────
const STAGE_CONTENT = {
  arrived: {
    color: '#3B82F6',
    title: { en: "You've Just Arrived", ku: 'تازە گەیشتووتە بەریتانیا', fa: 'تازه وارد شدی', ar: 'لقد وصلت للتو' },
    subtitle: { en: 'Here is exactly what to do in your first days.', ku: 'ئەمەیە کە دەبێت لە ڕۆژە یەکەمەکانت بیکەیت.', fa: 'اینجاست که در روزهای اول باید انجام دهی.', ar: 'هذا ما يجب عليك فعله في أيامك الأولى.' },
    sections: [
      {
        icon: '⏰', title: { en: 'First 24 Hours', ku: 'یەکەم ٢٤ کاتژمێر', fa: '۲۴ ساعت اول', ar: 'أول ٢٤ ساعة' },
        points: {
          en: ['Report to the Home Office immediately — do not wait', 'Do NOT destroy any documents, even if told to', 'Say clearly: "I want to claim asylum"', 'Ask for an interpreter — this is your legal right', 'Keep your phone charged and with you at all times', 'Write down the name and badge number of any officer you speak to', 'You have the right to contact a lawyer before answering questions'],
          ku: ['یەکسەر ڕاپۆرت بدە بۆ هۆم ئۆفیس — چاوەڕوان مەبە', 'هیچ بەلگەیەک لەناوبەری مەبە، تەنانەت ئەگەر پێت بڵێن', 'ئاشکرا بڵێ: "دەمەوێت داواکاری ئامادەیی بکەم"', 'داوای وەرگێڕی بکە — ئەمە مافی یاساییتە', 'مۆبایلەکەت شارژ و هەموو کاتێک لەگەلت بێت', 'ناو و ژمارەی بەجی هەر ئەفیسەرێک بنووسە کە پێیدا دەدەیت', 'مافت هەیە پەیوەندی بە پارێزەر بکەیت پێش وەڵامدانەوە'],
          fa: ['فوری به Home Office گزارش بده — منتظر نشو', 'هیچ مدرکی را از بین نبر، حتی اگر به تو گفته شود', 'واضح بگو: "می‌خواهم درخواست پناهندگی کنم"', 'مترجم بخواه — این حق قانونی توست', 'گوشی‌ات را شارژ نگه‌دار و همیشه با خودت داشته باش', 'نام و شماره نشان هر مأموری که با او صحبت می‌کنی را یادداشت کن', 'حق داری قبل از پاسخ به سوالات با وکیل تماس بگیری'],
          ar: ['أبلغ وزارة الداخلية فوراً — لا تنتظر', 'لا تتلف أي وثائق حتى لو طُلب منك ذلك', 'قل بوضوح: "أريد طلب اللجوء"', 'اطلب مترجماً — هذا حقك القانوني', 'اجعل هاتفك مشحوناً ومعك دائماً', 'سجّل اسم ورقم شارة أي ضابط تتحدث إليه', 'لديك الحق في التواصل مع محامٍ قبل الإجابة على الأسئلة'],
        }
      },
      {
        icon: '🪪', title: { en: 'Your ARC Card', ku: 'کارتی ARC ی تۆ', fa: 'کارت ARC تو', ar: 'بطاقة ARC الخاصة بك' },
        points: {
          en: ['ARC = Application Registration Card — your ID while your case is open', 'You will receive it within a few days of claiming asylum', 'It shows your photo, nationality, and whether you can work', 'Keep it safe — you will need it for NHS, housing and legal appointments', 'If lost, report immediately to the Home Office: 0300 123 2241', 'Do not give it to anyone other than an official'],
          ku: ['ARC = کارتی تۆمارکردنی داواکاری — ناسنامەت لەکاتی کردنەوەی کێسەکەت', 'لە چەند ڕۆژدا دوای داواکارییەکە دەیگریت', 'وێنەت، نەتەوەت و ئایا دەتوانیت کاربکەیت نیشان دەدات', 'بیپارێزە — پێویستتی پێیە بۆ NHS، مال و کۆبوونەوەی یاسایی', 'ئەگەر وەرت چوو، یەکسەر ڕاپۆرت بدە بۆ هۆم ئۆفیس: 0300 123 2241', 'بە هیچ کەسێکی تر مەدە جگە لە ئەفیسەرێکی فەرمی'],
          fa: ['ARC = کارت ثبت درخواست — هویت تو در طول رسیدگی به پرونده‌ات', 'چند روز پس از درخواست پناهندگی دریافت می‌کنی', 'عکس، ملیت و اینکه آیا مجاز به کار هستی را نشان می‌دهد', 'آن را حفظ کن — برای NHS، مسکن و قرارهای حقوقی به آن نیاز داری', 'اگر گم شد، فوری به Home Office گزارش بده: 0300 123 2241', 'آن را به کسی غیر از مأمور رسمی ندهی'],
          ar: ['ARC = بطاقة تسجيل الطلب — هويتك أثناء فتح قضيتك', 'ستستلمها خلال أيام قليلة من تقديم طلب اللجوء', 'تُظهر صورتك وجنسيتك وما إذا كنت تستطيع العمل', 'احتفظ بها — ستحتاجها للـ NHS والإسكان والمواعيد القانونية', 'إذا فقدت، أبلغ فوراً وزارة الداخلية: 0300 123 2241', 'لا تعطها لأحد غير مسؤول رسمي'],
        }
      },
      {
        icon: '🏠', title: { en: 'Emergency Housing', ku: 'مالی فووری', fa: 'مسکن اضطراری', ar: 'الإسكان الطارئ' },
        points: {
          en: ['You will be given Section 98 emergency housing while your case starts', 'This may be a hostel, hotel, or shared house — you cannot choose', 'It may be anywhere in the UK — not necessarily near family', 'Do NOT refuse the housing offered — you may lose all support', 'Once your case is registered you move to Section 95 housing', 'You will receive £49.18 per week for food and essentials', 'If housing is unsafe or you feel threatened, tell your caseworker immediately'],
          ku: ['مالی فووری بەشی ٩٨ دەدرێتت لەکاتی دەستپێکردنی کێسەکەت', 'لەگەڵ ئەوەی خانووچە، هۆتێل، یان خانووی هاوبەشە — ناتوانیت هەڵبژێریت', 'لەگەڵ ئەوەی هەر شوێنێکی UK — نەبێت نزیک خێزانەکەت', 'مالەکەی پێشکەشکراو ڕەت مەکەوە — لەگەڵ ئەوەی هەموو پشتگیرییەکەت دەچێت', 'دوای تۆمارکردنی کێسەکەت بۆ مالی بەشی ٩٥ دەگوێزرێیتەوە', '٤٩.١٨ پاوەند هەفتانە بۆ خواردن و پێداویستییەکان دەگریت', 'ئەگەر مال ناپارێزە یان ترسیدیت، یەکسەر بە کارمەندەکەت بڵێ'],
          fa: ['مسکن اضطراری بخش ۹۸ در شروع پرونده‌ات داده می‌شود', 'ممکن است خوابگاه، هتل یا خانه مشترک باشد — نمی‌توانی انتخاب کنی', 'ممکن است هر جایی در UK باشد — لزوماً نزدیک خانواده‌ات نیست', 'مسکن پیشنهادی را رد نکن — ممکن است تمام حمایت قطع شود', 'پس از ثبت پرونده به مسکن بخش ۹۵ منتقل می‌شوی', 'هفته‌ای ۴۹.۱۸ پوند برای غذا و ضروریات دریافت می‌کنی', 'اگر مسکن ناامن است یا تهدید می‌شوی، فوری به کارشناست بگو'],
          ar: ['ستُعطى إسكاناً طارئاً بموجب القسم 98 أثناء بدء قضيتك', 'قد يكون نُزلاً أو فندقاً أو منزلاً مشتركاً — لا يمكنك الاختيار', 'قد يكون في أي مكان في المملكة المتحدة — ليس بالضرورة قرب عائلتك', 'لا ترفض الإسكان المقدم — قد تفقد كل الدعم', 'بعد تسجيل قضيتك ستنتقل إلى إسكان القسم 95', 'ستتلقى 49.18 جنيهاً أسبوعياً للطعام والضروريات', 'إذا كان الإسكان غير آمن أو تشعر بالتهديد، أخبر مسؤول قضيتك فوراً'],
        }
      },
      {
        icon: '⚠️', title: { en: 'What NOT To Do', ku: 'چی نەکەی', fa: 'چه کاری نکنی', ar: 'ما يجب ألا تفعله' },
        points: {
          en: ['Do NOT work until you have written permission', 'Do NOT travel outside the UK — your case will be closed', 'Do NOT miss any reporting appointments — this is critical', 'Do NOT move address without telling the Home Office first', 'Do NOT sign anything you do not understand — ask for an interpreter', 'Do NOT use a lawyer who is not OISC registered — check at oisc.gov.uk', 'Do NOT pay anyone who claims they can speed up your case'],
          ku: ['کارمەکە تا مۆڵەتی نووسراوت نەدراوە', 'گەرانەوە دەرەوەی UK مەکە — کێسەکەت داخرێتەوە', 'هیچ کاتی ڕاپۆرتدانت لەدەستمەدە — ئەمە زۆر گرنگە', 'بەبێ ئاگادارکردنەوەی هۆم ئۆفیس جێمەگۆڕیت', 'هیچ شتێک مەئیمزابکە کە تێناگەیتت — داوای وەرگێڕی بکە', 'پارێزەرێک بەکارمەهێنە کە تۆمارنەکراوە لە OISC — سەیری oisc.gov.uk بکە', 'بە هیچ کەسێک پارە مەدە کە دەڵێت دەتوانێت کێسەکەت خێراتر بکات'],
          fa: ['تا مجوز کتبی نداری کار نکن', 'از UK خارج نشو — پرونده‌ات بسته می‌شود', 'هیچ وقت سر قرار گزارش‌دهی نرو — این بسیار مهم است', 'بدون اطلاع قبلی به Home Office آدرست را عوض نکن', 'چیزی که نمی‌فهمی امضا نکن — مترجم بخواه', 'از وکیلی استفاده نکن که در OISC ثبت نشده — در oisc.gov.uk چک کن', 'به کسی که ادعا می‌کند می‌تواند پرونده‌ات را سریع‌تر کند پول نده'],
          ar: ['لا تعمل حتى تحصل على إذن مكتوب', 'لا تسافر خارج المملكة المتحدة — ستُغلق قضيتك', 'لا تفوت أي مواعيد الإبلاغ — هذا بالغ الأهمية', 'لا تغير عنوانك دون إخبار وزارة الداخلية أولاً', 'لا توقع على أي شيء لا تفهمه — اطلب مترجماً', 'لا تستخدم محامياً غير مسجل في OISC — تحقق على oisc.gov.uk', 'لا تدفع لأحد يدّعي أنه يمكنه تسريع قضيتك'],
        }
      },
      {
        icon: '⚖️', title: { en: 'Your Rights From Day One', ku: 'مافەکانت لە ڕۆژی یەکەم', fa: 'حقوق تو از روز اول', ar: 'حقوقك من اليوم الأول' },
        points: {
          en: ['Right to free legal representation through Legal Aid', 'Right to a free interpreter at every official appointment', 'Right to emergency NHS healthcare regardless of status', 'Right to education for your children aged 5-16', 'Right to report abuse, exploitation or crime safely', 'Right to remain in the UK while your claim is being decided', 'Right to appeal if your claim is refused'],
          ku: ['مافی نوێنەری یاسایی بەخۆڕایی لە ڕێگەی Legal Aid', 'مافی وەرگێڕی بەخۆڕایی لە هەموو کۆبوونەوەی فەرمی', 'مافی چارەسەری NHS ی فووری بەخۆڕایی بێ گوێرەی مافی', 'مافی خوێندن بۆ منداڵەکانت لە تەمەنی ٥-١٦', 'مافی ڕاپۆرتدانی ئازار، ئیستیسمار یان تاوان بە ئارامی', 'مافی مانەوە لە UK لەکاتی تەماشاکردنی داواکارییەکەت', 'مافی تژیاوەکردن ئەگەر داواکارییەکەت ڕەتکرایەوە'],
          fa: ['حق نمایندگی حقوقی رایگان از طریق Legal Aid', 'حق مترجم رایگان در هر قرار رسمی', 'حق مراقبت اضطراری رایگان NHS صرف نظر از وضعیت', 'حق تحصیل برای فرزندان ۵ تا ۱۶ ساله‌ات', 'حق گزارش آزار، استثمار یا جرم به صورت ایمن', 'حق ماندن در UK در طول بررسی درخواستت', 'حق تجدیدنظر اگر درخواستت رد شود'],
          ar: ['حق التمثيل القانوني المجاني من خلال المساعدة القانونية', 'حق الحصول على مترجم مجاني في كل موعد رسمي', 'حق الرعاية الصحية الطارئة المجانية بغض النظر عن الوضع', 'حق التعليم لأطفالك من سن 5-16', 'حق الإبلاغ عن الإساءة والاستغلال والجريمة بأمان', 'حق البقاء في المملكة المتحدة أثناء النظر في طلبك', 'حق الاستئناف إذا رُفض طلبك'],
        }
      },
    ]
  },
  waiting: {
    color: '#F59E0B',
    title: { en: 'While You Wait', ku: 'لەکاتی چاوەڕوانی', fa: 'در حین انتظار', ar: 'أثناء الانتظار' },
    subtitle: { en: 'Your case is being decided. Know what you can and cannot do.', ku: 'کێسەکەت بڕیاردەدرێت. بزانە چیت دەکرێت و چیت ناکرێت.', fa: 'پرونده‌ات در حال بررسی است. بدان چه می‌توانی و چه نمی‌توانی انجام دهی.', ar: 'يجري البت في قضيتك. اعرف ما يمكنك وما لا يمكنك فعله.' },
    sections: [
      {
        icon: '💰', title: { en: 'What You Are Entitled To', ku: 'چیت مافی هەیە', fa: 'چه حقوقی داری', ar: 'ما تستحقه' },
        points: {
          en: ['Section 95 asylum support — £49.18 per week per adult', 'Free NHS healthcare for you and your entire family', 'Free school for all children aged 5-16', 'Free legal aid for your asylum case', 'Free interpreter at all official appointments', 'Free school meals if your children are in school', 'Right to open a basic bank account with your ARC card'],
          ku: ['پشتگیری ئامادەیی بەشی ٩٥ — ٤٩.١٨ پاوەند هەفتانە بۆ هەر گەورەسالێک', 'چارەسەری NHS ی بەخۆڕایی بۆ تۆ و هەموو خێزانەکەت', 'خوێندنی بەخۆڕایی بۆ هەموو منداڵی ٥-١٦ ساڵ', 'یارمەتی یاسایی بەخۆڕایی بۆ کێسی ئامادەیییەکەت', 'وەرگێڕی بەخۆڕایی لە هەموو کۆبوونەوەی فەرمی', 'خواردنی قوتابخانەی بەخۆڕایی ئەگەر منداڵەکانت لە قوتابخانەن', 'مافی کردنەوەی ئەکاونتی بانکی بنچینەیی بە کارتی ARC ت'],
          fa: ['کمک پناهندگی بخش ۹۵ — ۴۹.۱۸ پوند در هفته برای هر بزرگسال', 'مراقبت بهداشتی رایگان NHS برای تو و تمام خانواده‌ات', 'مدرسه رایگان برای تمام کودکان ۵ تا ۱۶ ساله', 'کمک حقوقی رایگان برای پرونده پناهندگی‌ات', 'مترجم رایگان در تمام قرارهای رسمی', 'وعده غذایی رایگان مدرسه اگر فرزندانت در مدرسه هستند', 'حق افتتاح حساب بانکی اولیه با کارت ARC'],
          ar: ['دعم اللجوء بموجب القسم 95 — 49.18 جنيهاً أسبوعياً لكل بالغ', 'الرعاية الصحية المجانية لك ولعائلتك بأكملها', 'مدرسة مجانية لجميع الأطفال من 5-16 سنة', 'مساعدة قانونية مجانية لقضية لجوئك', 'مترجم مجاني في جميع المواعيد الرسمية', 'وجبات مدرسية مجانية إذا كان أطفالك في المدرسة', 'حق فتح حساب بنكي أساسي ببطاقة ARC'],
        }
      },
      {
        icon: '🎤', title: { en: 'Your Asylum Interview', ku: 'چاوپێکەوتنی ئامادەییت', fa: 'مصاحبه پناهندگی تو', ar: 'مقابلة اللجوء الخاصة بك' },
        points: {
          en: ['This is the most important part of your case — prepare carefully', 'Tell the full truth — inconsistencies will damage your case', 'You MUST have a solicitor present — never go alone', 'Ask for breaks whenever you feel overwhelmed — you can request this', 'You can ask for a same-gender interviewer if preferred', 'The interview will be recorded — everything you say matters', 'Your solicitor can challenge any unfair or misleading questions', 'If you remember something important after — tell your solicitor immediately'],
          ku: ['ئەمە گرنگترین بەشی کێسەکەتە — بە وردی ئامادەبکەرەوە', 'ڕاستی تەواو بڵێ — ناڕاستەواز دەبێتە زیانی کێسەکەت', 'دەبێت پارێزەرت لەگەڵت بێت — هەرگیز تەنیا مەچو', 'هەموو کاتێک کە سەختت بوو داوای وەستان بکە — دەتوانیت داواکاری بکەیت', 'دەتوانیت داوای هەلگری هەمجنس بکەیت ئەگەر پێشتر بیت', 'چاوپێکەوتنەکە تۆمار دەکرێت — هەموو شتێک دەڵێیت گرنگە', 'پارێزەرەکەت دەتوانێت هەر پرسیاری نادادپەروەرانەیەک بدەوە', 'ئەگەر دوای چاوپێکەوتنەکە شتێکی گرنگت بیرهاتەوە — یەکسەر بە پارێزەرەکەت بڵێ'],
          fa: ['این مهم‌ترین بخش پرونده‌ات است — با دقت آماده شو', 'تمام حقیقت را بگو — ناسازگاری به پرونده‌ات آسیب می‌رساند', 'باید وکیل داشته باشی — هرگز تنها نرو', 'هر وقت احساس فشار کردی استراحت بخواه — می‌توانی این را بخواهی', 'می‌توانی مصاحبه‌گر هم‌جنس بخواهی اگر ترجیح می‌دهی', 'مصاحبه ضبط می‌شود — هر چه می‌گویی اهمیت دارد', 'وکیلت می‌تواند سوالات ناعادلانه یا گمراه‌کننده را به چالش بکشد', 'اگر بعد از مصاحبه چیز مهمی به یادت آمد — فوری به وکیلت بگو'],
          ar: ['هذا أهم جزء في قضيتك — استعد بعناية', 'أخبر بكامل الحقيقة — التناقضات ستضر بقضيتك', 'يجب أن يكون محاميك حاضراً — لا تذهب وحدك أبداً', 'اطلب استراحات كلما شعرت بالإرهاق — يمكنك طلب ذلك', 'يمكنك طلب محاور من نفس جنسك إذا كنت تفضل ذلك', 'ستُسجَّل المقابلة — كل ما تقوله مهم', 'يمكن لمحاميك الطعن في أي أسئلة غير عادلة أو مضللة', 'إذا تذكرت شيئاً مهماً بعد المقابلة — أخبر محاميك فوراً'],
        }
      },
      {
        icon: '🧠', title: { en: 'Your Mental Health Matters', ku: 'تەندروستیی دەروونیت گرنگە', fa: 'سلامت روان تو مهم است', ar: 'صحتك النفسية مهمة' },
        points: {
          en: ['Feeling anxious, isolated, and scared is completely normal', 'The waiting period is one of the hardest parts — you are not alone', 'Talk to someone — keeping it inside makes things worse', 'Samaritans: 116 123 — free, 24/7, no questions asked', 'MIND: 0300 123 3393 — mental health support', 'Shout: text 85258 — crisis text support', 'Your GP can refer you for free counselling — ask them', 'Asylum seekers are 5x more likely to experience PTSD — this is real'],
          ku: ['نیگەرانی، تەنیابوون و ترسان تەواو ئادیییە', 'کاتی چاوەڕوانی یەکێکە لە سەختترین بەشەکان — تەنیا نیت', 'بە کەسێک قسە بکە — نیگهگرتنی لەناو شتەکان خراپتر دەکات', 'Samaritans: 116 123 — بەخۆڕایی، ٢٤/٧، هیچ پرسیارێک نادەن', 'MIND: 0300 123 3393 — پشتگیری تەندروستیی دەروونی', 'Shout: نامەی دەنووسی بۆ 85258 — پشتگیری نووسینی کریز', 'دکتەرەکەت دەتوانێت بنێرێتت بۆ ڕاوێژکاری بەخۆڕایی — داوایی بکە', 'داواکارانی ئامادەیی ٥ جار زیاتر PTSD تەجربەدەکەن — ئەمە ڕاستە'],
          fa: ['احساس اضطراب، انزوا و ترس کاملاً طبیعی است', 'دوره انتظار یکی از سخت‌ترین بخش‌هاست — تنها نیستی', 'با کسی صحبت کن — نگه داشتن درون اوضاع را بدتر می‌کند', 'Samaritans: 116 123 — رایگان، ۲۴/۷، بدون سوال', 'MIND: 0300 123 3393 — حمایت از سلامت روان', 'Shout: پیام به 85258 — حمایت متنی در بحران', 'دکترت می‌تواند برای مشاوره رایگان ارجاع دهد — از او بخواه', 'پناهجویان ۵ برابر بیشتر احتمال دارد PTSD تجربه کنند — این واقعی است'],
          ar: ['الشعور بالقلق والعزلة والخوف أمر طبيعي تماماً', 'فترة الانتظار من أصعب المراحل — لست وحدك', 'تحدث مع شخص ما — الاحتفاظ به بداخلك يجعل الأمور أسوأ', 'Samaritans: 116 123 — مجاني، 24/7، بدون أسئلة', 'MIND: 0300 123 3393 — دعم الصحة النفسية', 'Shout: أرسل رسالة إلى 85258 — دعم نصي في الأزمات', 'يمكن لطبيبك إحالتك للإرشاد المجاني — اطلب منه', 'طالبو اللجوء أكثر عرضة للإصابة بـ PTSD بمقدار 5 مرات — هذا حقيقي'],
        }
      },
    ]
  },
  granted: {
    color: '#10B981',
    title: { en: 'Status Granted — Next Steps', ku: 'مافت درا — هەنگاوە داواکانت', fa: 'وضعیت تأیید شد — گام‌های بعدی', ar: 'تم منح الوضع — الخطوات التالية' },
    subtitle: { en: 'Congratulations. Act quickly — you have 28 days before support stops.', ku: 'پیرۆزت بێت. خێرا ڕەفتاربکە — ٢٨ ڕۆژت هەیە پێش راگرتنی پشتگیری.', fa: 'تبریک. سریع اقدام کن — ۲۸ روز قبل از قطع حمایت داری.', ar: 'تهانينا. تصرف بسرعة — لديك 28 يوماً قبل توقف الدعم.' },
    sections: [
      {
        icon: '⚡', title: { en: 'The Critical 28 Days', ku: '٢٨ ڕۆژی گرنگ', fa: '۲۸ روز بحرانی', ar: 'الـ 28 يوماً الحرجة' },
        points: {
          en: ['You have exactly 28 days from your decision letter before asylum support stops', 'Use these 28 days to apply for Universal Credit, housing and your NI number', 'Collect your BRP card from the Post Office listed in your letter — within 10 days', 'Register with a GP immediately — your ARIES card and BRP will be needed', 'Contact your local council about housing — do this in week 1', 'Open a bank account — Monzo and Starling accept BRP and are easiest', 'Apply for your National Insurance number at gov.uk immediately'],
          ku: ['تەواو ٢٨ ڕۆژت هەیە لە نامەی بڕیارەکەت پێش راگرتنی پشتگیری ئامادەیی', 'ئەم ٢٨ ڕۆژەیان بەکاربهێنە بۆ داواکاری Universal Credit، مال و ژمارەی NI ت', 'کارتی BRP ت لە ئۆفیسی پۆستی نووسراو لە نامەکەت وەربگرە — لە ناو ١٠ ڕۆژدا', 'یەکسەر تۆمار بکە لەگەڵ GP — پێویستت بە کارتی ARIES و BRP دەبێت', 'پەیوەندی بە شارداریی ناوچەکەت بکە دەربارەی مال — ئەمەی بکە لە هەفتەی یەکەم', 'ئەکاونتی بانکی بکەرەوە — مۆنزۆ و ستارلینگ BRP قبوول دەکەن و ئاسانترن', 'یەکسەر داواکاری ژمارەی بیمەی نیشتمانیت بکە لە gov.uk'],
          fa: ['دقیقاً ۲۸ روز از نامه تصمیم تا قطع حمایت پناهندگی داری', 'این ۲۸ روز را برای درخواست Universal Credit، مسکن و شماره NI استفاده کن', 'کارت BRP را از پست‌آفیس ذکر شده در نامه‌ات بگیر — ظرف ۱۰ روز', 'فوری با GP ثبت‌نام کن — به کارت ARIES و BRP نیاز داری', 'با شورای محلی‌ات در مورد مسکن تماس بگیر — این را در هفته اول انجام بده', 'حساب بانکی باز کن — Monzo و Starling BRP قبول می‌کنند و آسان‌ترند', 'فوری در gov.uk برای شماره بیمه ملی درخواست بده'],
          ar: ['لديك 28 يوماً بالضبط من رسالة القرار قبل توقف دعم اللجوء', 'استخدم هذه الـ 28 يوماً للتقدم للحصول على Universal Credit والإسكان ورقم NI', 'اجمع بطاقة BRP من مكتب البريد المذكور في رسالتك — خلال 10 أيام', 'سجّل لدى طبيب عام فوراً — ستحتاج بطاقة ARIES وBRP', 'تواصل مع مجلسك المحلي بشأن الإسكان — افعل هذا في الأسبوع الأول', 'افتح حساباً مصرفياً — Monzo وStarling يقبلان BRP وهما الأسهل', 'تقدم فوراً للحصول على رقم التأمين الوطني على gov.uk'],
        }
      },
      {
        icon: '🏦', title: { en: 'Opening a Bank Account', ku: 'کردنەوەی ئەکاونتی بانکی', fa: 'افتتاح حساب بانکی', ar: 'فتح حساب مصرفي' },
        points: {
          en: ['Monzo and Starling are the easiest — open through the app in minutes', 'You need: BRP card, UK address, phone number, email', 'Halifax and Lloyds also accept BRP for in-branch accounts', 'Avoid payday loan companies — they charge enormous interest', 'Your Universal Credit will be paid directly into your bank account', 'You can send money internationally using Wise or Remitly — much cheaper than banks', 'Never share your account details, PIN or online banking password with anyone'],
          ku: ['مۆنزۆ و ستارلینگ ئاسانترن — لە ڕێگەی ئەپ لە چەند خولەکدا بکەرەوە', 'پێویستتە: کارتی BRP، ناونیشانی UK، ژمارەی تەلەفۆن، ئیمەیڵ', 'هالیفاکس و لۆیدز هەروەها BRP قبوول دەکەن بۆ ئەکاونتی لە شاخەدا', 'لە کۆمپانیاکانی قەرزی ڕۆژانە دووربکەوەرەوە — سوودی زۆری گران وەردەگرن', 'Universal Credit ت ڕاستەوخۆ دەدرێتە ئەکاونتی بانکیت', 'دەتوانیت پارە بنێریت بۆ دەرەوەی وڵات بە Wise یان Remitly — زیاتر ئاسانتر لە بانکەکان', 'هەرگیز زانیاری ئەکاونتەکەت، PIN یان پاسوۆردی بانکداریی ئۆنلاینت بە هیچ کەسێک مەدە'],
          fa: ['Monzo و Starling آسان‌ترند — از طریق اپ در چند دقیقه باز کن', 'نیاز داری: کارت BRP، آدرس UK، شماره تلفن، ایمیل', 'Halifax و Lloyds هم BRP را برای حساب‌های شعبه قبول می‌کنند', 'از شرکت‌های وام روزانه دور باش — سود بسیار بالایی می‌گیرند', 'Universal Credit مستقیم به حساب بانکی‌ات پرداخت می‌شود', 'می‌توانی با Wise یا Remitly بین‌المللی پول بفرستی — خیلی ارزان‌تر از بانک‌ها', 'هرگز مشخصات حساب، PIN یا رمز بانک آنلاینت را به کسی ندهی'],
          ar: ['Monzo وStarling الأسهل — افتح من خلال التطبيق في دقائق', 'تحتاج: بطاقة BRP وعنوان بريطاني ورقم هاتف وبريد إلكتروني', 'Halifax وLloyds يقبلان أيضاً BRP للحسابات داخل الفرع', 'تجنب شركات القروض اليومية — تفرض فوائد باهظة', 'سيُدفع Universal Credit مباشرة في حسابك البنكي', 'يمكنك إرسال الأموال دولياً باستخدام Wise أو Remitly — أرخص بكثير من البنوك', 'لا تشارك أبداً تفاصيل حسابك أو رقم PIN أو كلمة مرور البنك الإلكتروني مع أحد'],
        }
      },
      {
        icon: '🚗', title: { en: 'Getting Your Driving Licence', ku: 'وەرگرتنی مۆڵەتی شۆفێری', fa: 'گرفتن گواهینامه رانندگی', ar: 'الحصول على رخصة القيادة' },
        points: {
          en: ['Apply for your provisional licence at gov.uk/apply-first-provisional-driving-licence', 'Cost: £34 online — you need BRP, passport photo, UK address', 'Theory test: £23 — book at gov.uk/book-theory-test', 'Practical test: £62 — book at gov.uk/book-driving-test', 'Find a Kurdish driving instructor on KurdLink', 'If you held a licence in another country, you may be able to convert it', 'Most people take 30-50 hours of lessons before passing'],
          ku: ['داواکاری مۆڵەتی پرۆڤیژنەلت بکە لە gov.uk/apply-first-provisional-driving-licence', 'تێچوو: ٣٤ پاوەند ئۆنلاین — پێویستتە BRP، وێنەی پاسپۆرت، ناونیشانی UK', 'تێستی تیۆری: ٢٣ پاوەند — جێگیربکە لە gov.uk/book-theory-test', 'تێستی پراکتیکی: ٦٢ پاوەند — جێگیربکە لە gov.uk/book-driving-test', 'مامۆستای شۆفێری کوردی لە KurdLink بدۆزەرەوە', 'ئەگەر لە وڵاتێکی تر مۆڵەتت هەبوو، لەگەڵ ئەوەی دەتوانیت گۆڕانت بکەیت', 'زۆربەی خەڵک ٣٠-٥٠ کاتژمێر درس وەردەگرن پێش تێپەڕین'],
          fa: ['برای مجوز موقتت در gov.uk/apply-first-provisional-driving-licence درخواست بده', 'هزینه: ۳۴ پوند آنلاین — به BRP، عکس پاسپورت، آدرس UK نیاز داری', 'تست نظری: ۲۳ پوند — در gov.uk/book-theory-test رزرو کن', 'تست عملی: ۶۲ پوند — در gov.uk/book-driving-test رزرو کن', 'مربی رانندگی کرد را در KurdLink پیدا کن', 'اگر در کشور دیگری گواهینامه داشتی، ممکن است بتوانی آن را تبدیل کنی', 'اکثر مردم ۳۰-۵۰ ساعت درس می‌گیرند قبل از قبولی'],
          ar: ['تقدم للحصول على رخصتك المؤقتة على gov.uk/apply-first-provisional-driving-licence', 'التكلفة: 34 جنيهاً عبر الإنترنت — تحتاج BRP وصورة جواز سفر وعنوان بريطاني', 'اختبار النظري: 23 جنيهاً — احجز على gov.uk/book-theory-test', 'الاختبار العملي: 62 جنيهاً — احجز على gov.uk/book-driving-test', 'اعثر على مدرب قيادة كردي على KurdLink', 'إذا كنت تحمل رخصة من بلد آخر، قد تتمكن من تحويلها', 'معظم الناس يأخذون 30-50 ساعة دروس قبل النجاح'],
        }
      },
    ]
  },
  refused: {
    color: '#EF4444',
    title: { en: 'Your Claim Was Refused', ku: 'داواکارییەکەت ڕەتکرایەوە', fa: 'درخواستت رد شد', ar: 'تم رفض طلبك' },
    subtitle: { en: "Don't panic. You have rights and options. Act within 14 days.", ku: 'نیگەران مەبە. مافت و ویستت هەیە. لە ناو ١٤ ڕۆژدا ڕەفتاربکە.', fa: 'نگران نباش. حقوق و گزینه‌هایی داری. ظرف ۱۴ روز اقدام کن.', ar: 'لا تذعر. لديك حقوق وخيارات. تصرف خلال 14 يوماً.' },
    sections: [
      {
        icon: '⏱️', title: { en: 'You Have 14 Days to Appeal', ku: '١٤ ڕۆژت هەیە بۆ تژیاوەکردن', fa: '۱۴ روز برای تجدیدنظر داری', ar: 'لديك 14 يوماً للاستئناف' },
        points: {
          en: ['Read the refusal letter very carefully — understand every reason given', 'Contact your solicitor TODAY — do not wait even one day', 'No solicitor? Call Legal Aid immediately: 0300 200 2020', 'You can usually remain in the UK while your appeal is being heard', 'Keep attending all reporting appointments — missing one can cause problems', 'Your housing and financial support should continue during appeal', 'Write down everything you remember — new evidence can be added at appeal'],
          ku: ['نامەی ڕەتکردنەوەکە بە وردی بخوێنەوە — هەموو هۆکارێک تێبگە', 'ئەمڕۆ پەیوەندی بە پارێزەرەکەت بکە — تەنانەت یەک ڕۆژ چاوەڕوان مەبە', 'پارێزەرت نییە؟ یەکسەر پەیوەندی بە Legal Aid بکە: 0300 200 2020', 'باشی دەتوانیت لە UK بمێنیتەوە لەکاتی گوێگرتن لە تژیاوەکردنەکەت', 'هەموو کاتی ڕاپۆرتدانت بچو — لەدەستدانی یەکێکیان دەکرێت بکاتە کێشە', 'مال و پشتگیری داراییت دەبێت بەردەوام بێت لەکاتی تژیاوەکردن', 'هەموو شتێک بنووسە کە تەماشادەکەیت — بەلگەی نوێ دەتوانرێت لە تژیاوەکردندا زیاد بکرێت'],
          fa: ['نامه رد را خیلی دقیق بخوان — هر دلیلی را درک کن', 'امروز با وکیلت تماس بگیر — حتی یک روز هم صبر نکن', 'وکیل نداری؟ فوری با Legal Aid تماس بگیر: 0300 200 2020', 'معمولاً می‌توانی در UK بمانی در حالی که تجدیدنظرت در حال بررسی است', 'به تمام قرارهای گزارش‌دهی برو — از دست دادن یکی می‌تواند مشکل ایجاد کند', 'مسکن و حمایت مالی‌ات باید در طول تجدیدنظر ادامه داشته باشد', 'هر چه به یاد می‌آوری بنویس — در تجدیدنظر می‌توان مدارک جدید اضافه کرد'],
          ar: ['اقرأ رسالة الرفض بعناية شديدة — افهم كل سبب مذكور', 'تواصل مع محاميك اليوم — لا تنتظر حتى يوماً واحداً', 'لا محامي؟ اتصل بالمساعدة القانونية فوراً: 0300 200 2020', 'يمكنك عادةً البقاء في المملكة المتحدة أثناء النظر في استئنافك', 'استمر في حضور جميع مواعيد الإبلاغ — تفويت أحدها قد يسبب مشاكل', 'يجب أن يستمر إسكانك ودعمك المالي أثناء الاستئناف', 'اكتب كل ما تتذكره — يمكن إضافة أدلة جديدة في الاستئناف'],
        }
      },
      {
        icon: '🤝', title: { en: 'Organisations That Can Help Now', ku: 'ڕێکخراوەکانی دەتوانن ئێستا یارمەتیت بدەن', fa: 'سازمان‌هایی که الان می‌توانند کمک کنند', ar: 'منظمات يمكنها المساعدة الآن' },
        points: {
          en: ['Refugee Council: 020 7346 6700 — free advice and support', 'Asylum Aid: 020 7354 9631 — free legal representation', 'Migrant Help: 0808 8010 503 — free 24/7 helpline', 'UNHCR UK: unhcr.org/uk — UN refugee agency', 'Citizens Advice: 0800 144 8848 — free general advice', 'Shelter: 0808 800 4444 — if you are at risk of homelessness', 'Medical Justice: if you have been detained or experienced trauma'],
          ku: ['شورای پەنابەر: 020 7346 6700 — ڕاوێژ و پشتگیری بەخۆڕایی', 'Asylum Aid: 020 7354 9631 — نوێنەرایەتی یاسایی بەخۆڕایی', 'Migrant Help: 0808 8010 503 — هێڵی یارمەتی بەخۆڕایی ٢٤/٧', 'UNHCR UK: unhcr.org/uk — ئەژانسی پەنابەری نەتەوەیەکگرتووەکان', 'Citizens Advice: 0800 144 8848 — ڕاوێژی گشتی بەخۆڕایی', 'Shelter: 0808 800 4444 — ئەگەر مەترسی بێ ماویت هەیە', 'Medical Justice: ئەگەر بەند بووتەوە یان ئەزموونی ئازاری هەیە'],
          fa: ['شورای پناهندگان: 020 7346 6700 — مشاوره و حمایت رایگان', 'Asylum Aid: 020 7354 9631 — نمایندگی حقوقی رایگان', 'Migrant Help: 0808 8010 503 — خط کمک رایگان ۲۴/۷', 'UNHCR UK: unhcr.org/uk — آژانس پناهندگی سازمان ملل', 'Citizens Advice: 0800 144 8848 — مشاوره عمومی رایگان', 'Shelter: 0808 800 4444 — اگر در خطر بی‌خانمانی هستی', 'Medical Justice: اگر بازداشت شده‌ای یا تجربه تروما داشته‌ای'],
          ar: ['مجلس اللاجئين: 020 7346 6700 — مشورة ودعم مجاني', 'Asylum Aid: 020 7354 9631 — تمثيل قانوني مجاني', 'Migrant Help: 0808 8010 503 — خط مساعدة مجاني 24/7', 'UNHCR UK: unhcr.org/uk — وكالة اللاجئين الأممية', 'Citizens Advice: 0800 144 8848 — مشورة عامة مجانية', 'Shelter: 0808 800 4444 — إذا كنت في خطر التشرد', 'Medical Justice: إذا كنت قد احتُجزت أو عانيت من صدمة'],
        }
      },
    ]
  },
  settled: {
    color: '#8B5CF6',
    title: { en: 'Building Your Life in the UK', ku: 'دروستکردنی ژیانت لە UK', fa: 'ساختن زندگی‌ات در UK', ar: 'بناء حياتك في المملكة المتحدة' },
    subtitle: { en: 'You have status. Now build something great.', ku: 'مافت هەیە. ئێستا شتێکی جوان بنیادبنێ.', fa: 'وضعیت داری. حالا چیز عالی بساز.', ar: 'لديك وضع. الآن ابنِ شيئاً رائعاً.' },
    sections: [
      {
        icon: '💼', title: { en: 'Your Right to Work', ku: 'مافی کارکردنت', fa: 'حق کار کردن تو', ar: 'حقك في العمل' },
        points: {
          en: ['You can work in almost any job in the UK', 'Minimum wage (2024): £11.44/hour for adults over 21', 'Your employer cannot pay you less because of your background', 'You pay National Insurance and income tax like everyone else', 'Keep all payslips — you will need them for ILR application', 'Report exploitation anonymously: 0800 028 3838', 'You can start your own business — KurdLink can help you list it'],
          ku: ['دەتوانیت لە تقریبن هەر کارێکی UK بکەیت', 'کەمترین مووچە (٢٠٢٤): ١١.٤٤ پاوەند/کاتژمێر بۆ گەورەسالانی ژێر ٢١', 'کارفەرمات ناتوانێت کەمتر پارەت بدات بەهۆی پشتەوانەت', 'بیمەی نیشتمانی و باجی داهات وەک هەموو کەسێک دەدەیت', 'هەموو پارەدانەکانت بیگرەوە — پێویستیان بۆ داواکاری ILR دەبێت', 'ئیستیسمار بەبێ ناسراوی ڕاپۆرت بکە: 0800 028 3838', 'دەتوانیت کاروباری خۆت بکەیتەوە — KurdLink دەتوانێت یارمەتیت بدات لیستی بکەیت'],
          fa: ['می‌توانی تقریباً در هر شغلی در UK کار کنی', 'حداقل دستمزد (۲۰۲۴): ۱۱.۴۴ پوند/ساعت برای بزرگسالان بالای ۲۱', 'کارفرمایت نمی‌تواند به خاطر پیشینه‌ات کمتر پرداخت کند', 'بیمه ملی و مالیات بر درآمد مثل همه دیگران می‌پردازی', 'تمام فیش‌های حقوقی را نگه‌دار — برای درخواست ILR به آن‌ها نیاز داری', 'استثمار را به صورت ناشناس گزارش بده: 0800 028 3838', 'می‌توانی کسب‌وکار خودت را راه‌اندازی کنی — KurdLink می‌تواند کمک کند'],
          ar: ['يمكنك العمل في تقريباً أي وظيفة في المملكة المتحدة', 'الحد الأدنى للأجر (2024): 11.44 جنيهاً/ساعة للبالغين فوق 21', 'لا يمكن لصاحب العمل أن يدفع لك أقل بسبب خلفيتك', 'تدفع التأمين الوطني وضريبة الدخل مثل الجميع', 'احتفظ بجميع كشوف الراتب — ستحتاجها لطلب ILR', 'أبلغ عن الاستغلال بشكل مجهول: 0800 028 3838', 'يمكنك بدء عملك التجاري — يمكن لـ KurdLink مساعدتك في إدراجه'],
        }
      },
      {
        icon: '🌍', title: { en: 'Bringing Your Family to the UK', ku: 'هێنانی خێزانت بۆ UK', fa: 'آوردن خانواده‌ات به UK', ar: 'جلب عائلتك إلى المملكة المتحدة' },
        points: {
          en: ['As a refugee you can apply to bring your partner and children under 18', 'Apply within 3 months of getting status for the easiest process', 'Application fee: from £388 per person', 'Contact the Refugee Council for free help: 020 7346 6700', 'Process takes 6-12 months typically', 'Your family members will also receive refugee status', 'They can work, study and access NHS once they arrive'],
          ku: ['وەک پەنابەر دەتوانیت داواکاری بکەیت بۆ هێنانی هاوسەرت و منداڵی ژێر ١٨', 'لە ناو ٣ مانگی گرتنی مافەکەت داواکاری بکە بۆ پرۆسەیەکی ئاسانتر', 'تێچووی داواکارییەکە: لە ٣٨٨ پاوەند بۆ هەر کەسێک', 'پەیوەندی بە شورای پەنابەر بکە بۆ یارمەتیی بەخۆڕایی: 020 7346 6700', 'پرۆسەکە باشی ٦-١٢ مانگ دەخایەنێت', 'ئەندامانی خێزانەکەت هەروەها مافی پەنابەری وەردەگرن', 'دەتوانن کاربکەن، بخوێنن و دەستبگەن بە NHS دوای گەیشتنیان'],
          fa: ['به عنوان پناهنده می‌توانی برای آوردن همسر و فرزندان زیر ۱۸ سال درخواست دهی', 'ظرف ۳ ماه از دریافت وضعیت درخواست بده برای فرایند آسان‌تر', 'هزینه درخواست: از ۳۸۸ پوند به ازای هر نفر', 'برای کمک رایگان با شورای پناهندگان تماس بگیر: 020 7346 6700', 'فرایند معمولاً ۶-۱۲ ماه طول می‌کشد', 'اعضای خانواده‌ات هم وضعیت پناهندگی دریافت می‌کنند', 'می‌توانند پس از ورود کار کنند، تحصیل کنند و به NHS دسترسی داشته باشند'],
          ar: ['كلاجئ يمكنك التقدم لجلب شريكك وأطفالك دون 18 سنة', 'تقدم خلال 3 أشهر من الحصول على الوضع لإجراء أسهل', 'رسوم الطلب: من 388 جنيهاً لكل شخص', 'تواصل مع مجلس اللاجئين للحصول على مساعدة مجانية: 020 7346 6700', 'تستغرق العملية عادةً 6-12 شهراً', 'سيحصل أفراد عائلتك أيضاً على وضع اللاجئ', 'يمكنهم العمل والدراسة والوصول إلى NHS بعد وصولهم'],
        }
      },
    ]
  },
  citizen: {
    color: '#F59E0B',
    title: { en: 'The Path to British Citizenship', ku: 'ڕێگای بەرەو هاووڵاتیی بەریتانی', fa: 'مسیر به سمت شهروندی بریتانیایی', ar: 'الطريق إلى الجنسية البريطانية' },
    subtitle: { en: 'From refugee to British citizen — the full journey.', ku: 'لە پەنابەر بۆ هاووڵاتیی بەریتانی — گشت گەشتەکە.', fa: 'از پناهنده تا شهروند بریتانیایی — کل سفر.', ar: 'من لاجئ إلى مواطن بريطاني — الرحلة الكاملة.' },
    sections: [
      {
        icon: '📋', title: { en: 'Applying for ILR', ku: 'داواکاری ILR', fa: 'درخواست ILR', ar: 'التقدم لـ ILR' },
        points: {
          en: ['ILR = Indefinite Leave to Remain — permanent permission to live in the UK', 'Eligible after 5 years of lawful residence', 'Application fee: £2,885 — start saving early', 'Must pass the Life in the UK test first', 'Must meet English language requirements (B1 level)', 'Criminal record will affect your eligibility', 'Apply online at gov.uk/indefinite-leave-to-remain'],
          ku: ['ILR = مۆڵەتی مانەوەی نەمانچاو — مۆڵەتی هەمیشەیی بۆ ژیان لە UK', 'کارێز دەبیت دوای ٥ ساڵی نیشتەجێبوونی یاسایی', 'تێچووی داواکارییەکە: ٢،٨٨٥ پاوەند — زووتر دەستبکە بە پاشەکەوتکردن', 'پێویستە پێش ئەوە تێستی ژیانی UK ی تێپەڕ بکەیت', 'پێویستە مەرجی زمانی ئینگلیزی پێشکەش بکەیت (ئاستی B1)', 'تۆمەری تاوان کاریگەر دەبێت بەسەر ئەگەری واجببوونتدا', 'ئۆنلاین داواکاری بکە لە gov.uk/indefinite-leave-to-remain'],
          fa: ['ILR = اقامت نامحدود — اجازه دائمی برای زندگی در UK', 'بعد از ۵ سال اقامت قانونی واجد شرایط می‌شوی', 'هزینه درخواست: ۲،۸۸۵ پوند — زود شروع به پس‌انداز کن', 'باید ابتدا تست زندگی در UK را بگذری', 'باید شرایط زبان انگلیسی را برآورده کنی (سطح B1)', 'سابقه کیفری روی واجد شرایط بودنت تأثیر می‌گذارد', 'آنلاین در gov.uk/indefinite-leave-to-remain درخواست بده'],
          ar: ['ILR = إقامة غير محددة المدة — إذن دائم للعيش في المملكة المتحدة', 'مؤهل بعد 5 سنوات من الإقامة القانونية', 'رسوم الطلب: 2,885 جنيهاً — ابدأ الادخار مبكراً', 'يجب اجتياز اختبار الحياة في المملكة المتحدة أولاً', 'يجب استيفاء متطلبات اللغة الإنجليزية (مستوى B1)', 'السجل الجنائي سيؤثر على أهليتك', 'تقدم عبر الإنترنت على gov.uk/indefinite-leave-to-remain'],
        }
      },
      {
        icon: '📖', title: { en: 'Life in the UK Test', ku: 'تێستی ژیان لە UK', fa: 'تست زندگی در UK', ar: 'اختبار الحياة في المملكة المتحدة' },
        points: {
          en: ['24 questions, 45 minutes, must score 75% or higher to pass', 'Costs £50 per attempt — no limit on how many times you can take it', 'Covers British history, values, culture, law and government', 'Official study book available for £14.99 on Amazon', 'Free practice tests at lifeintheuktest.gov.uk', 'Many libraries offer free study classes — ask your local library', 'Most people pass within 1-3 attempts with proper preparation'],
          ku: ['٢٤ پرسیار، ٤٥ خولەک، دەبێت ٧٥٪ یان زیاتر بگریت بۆ تێپەڕین', '٥٠ پاوەند بۆ هەر هەوڵدانێک — سنور نییە بۆ چەندجار دەتوانیت بیکەیت', 'مێژووی بەریتانیا، بەهاکان، کولتوور، یاسا و حکومەت داپۆشراوە', 'کتێبی خوێندنی فەرمی بەردەستە بۆ ١٤.٩٩ پاوەند لە ئەمەزۆن', 'تێستی چاكسازی بەخۆڕایی لە lifeintheuktest.gov.uk', 'زۆربەی کتێبخانەکان پۆلی خوێندنی بەخۆڕایی پێشکەش دەکەن — لە کتێبخانەی ناوچەکەتدا بیپرسە', 'زۆربەی خەڵک لە ناو ١-٣ هەوڵدانەوە تێدەپەڕن بە ئامادەکاریی باش'],
          fa: ['۲۴ سوال، ۴۵ دقیقه، باید ۷۵٪ یا بیشتر بگیری تا قبول شوی', 'هر بار ۵۰ پوند هزینه دارد — محدودیتی برای تعداد دفعات نیست', 'تاریخ، ارزش‌ها، فرهنگ، قانون و حکومت بریتانیا را شامل می‌شود', 'کتاب مطالعاتی رسمی با ۱۴.۹۹ پوند در آمازون موجود است', 'تست‌های تمرینی رایگان در lifeintheuktest.gov.uk', 'بسیاری از کتابخانه‌ها کلاس‌های مطالعه رایگان ارائه می‌دهند', 'اکثر مردم با آمادگی مناسب در ۱-۳ تلاش قبول می‌شوند'],
          ar: ['24 سؤالاً، 45 دقيقة، يجب الحصول على 75% أو أعلى للنجاح', 'يكلف 50 جنيهاً لكل محاولة — لا حد لعدد المرات', 'يغطي التاريخ والقيم والثقافة والقانون والحكومة البريطانية', 'كتاب الدراسة الرسمي متاح بـ 14.99 جنيهاً على أمازون', 'اختبارات تدريبية مجانية على lifeintheuktest.gov.uk', 'تقدم كثير من المكتبات دروساً دراسية مجانية — اسأل مكتبتك المحلية', 'معظم الناس ينجحون خلال 1-3 محاولات مع الإعداد المناسب'],
        }
      },
    ]
  },
}

// ─── INFO SECTIONS ────────────────────────────────────────────────────────────
const INFO_SECTIONS = [
  {
    id: 'health', icon: '🏥', color: '#EC4899',
    title: { en: 'Health', ku: 'تەندروستی', fa: 'سلامت', ar: 'الصحة' },
    points: {
      en: ['Register with a GP at nhs.uk/find-a-gp — no ID or immigration docs needed', 'You cannot be refused NHS treatment because of your immigration status', 'Always ask for a Kurdish/Sorani/Farsi/Arabic interpreter — it is free and your right', '999 = life-threatening emergency only | 111 = medical help, not emergency | GP = regular care', 'A&E is open 24/7 for serious injuries and illnesses', 'Dental care is free if you are on asylum support or Universal Credit', 'Maternity care is free — tell your midwife your situation', 'Mental health support is available — ask your GP for a referral', 'Sexual health clinics are free and completely confidential'],
      ku: ['لەگەڵ GP تۆمار بکە لە nhs.uk/find-a-gp — پێویستت بە ناسنامە یان بەلگەی کۆچبەری نییە', 'ناتوانرێت بەهۆی مافی کۆچبەریتەوە ڕەتی چارەسەری NHS بکرێت', 'هەموو کاتێک داوای وەرگێڕی کوردی/سۆرانی/فارسی/عەرەبی بکە — بەخۆڕاییە و مافی توە', '999 = تەنها کریزی مەترسیدار بۆ ژیان | 111 = یارمەتیی تەندروستی، نەک کریز | GP = چارەسەری ئادی', 'A&E کراوەیە ٢٤/٧ بۆ ئەفتانی گیران و نەخۆشی گیران', 'چارەسەری دەندانی بەخۆڕاییە ئەگەر لەسەر پشتگیری ئامادەیی یان Universal Credit بیت', 'چارەسەری دووگیانی بەخۆڕاییە — بە مامەوانەکەت دەربارەی دەوروبەرت بڵێ', 'پشتگیری تەندروستیی دەروونی بەردەستە — لە GP ت داوابکە بنێرێتت', 'کلینیکەکانی تەندروستیی جنسی بەخۆڕایین و تەواو نهێنین'],
      fa: ['با GP در nhs.uk/find-a-gp ثبت‌نام کن — به مدرک هویت یا مدارک مهاجرتی نیاز نیست', 'به دلیل وضعیت مهاجرتی‌ات نمی‌توانند از درمان NHS محروم کنند', 'همیشه مترجم کردی/سورانی/فارسی/عربی بخواه — رایگان است و حق توست', '999 = فقط اورژانس تهدیدکننده حیات | 111 = کمک پزشکی غیراورژانسی | GP = مراقبت معمولی', 'اورژانس ۲۴/۷ برای آسیب‌ها و بیماری‌های جدی باز است', 'دندانپزشکی رایگان است اگر از حمایت پناهندگی یا Universal Credit استفاده می‌کنی', 'مراقبت بارداری رایگان است — به ماما وضعیتت را بگو', 'حمایت از سلامت روان در دسترس است — از GP ارجاع بخواه', 'کلینیک‌های بهداشت جنسی رایگان و کاملاً محرمانه هستند'],
      ar: ['سجّل لدى طبيب عام على nhs.uk/find-a-gp — لا تحتاج هوية أو وثائق هجرة', 'لا يمكن رفض علاجك في NHS بسبب وضع هجرتك', 'اطلب دائماً مترجماً كردياً/سورانياً/فارسياً/عربياً — مجاني وحقك', '999 = حالات الطوارئ المهددة للحياة فقط | 111 = مساعدة طبية غير طارئة | طبيب عام = رعاية منتظمة', 'الطوارئ مفتوحة 24/7 للإصابات والأمراض الخطيرة', 'رعاية الأسنان مجانية إذا كنت تتلقى دعم اللجوء أو Universal Credit', 'رعاية الأمومة مجانية — أخبري قابلتك عن وضعك', 'دعم الصحة النفسية متاح — اطلب إحالة من طبيبك', 'عيادات الصحة الجنسية مجانية وسرية تماماً'],
    }
  },
  {
    id: 'education', icon: '🎓', color: '#06B6D4',
    title: { en: 'Education', ku: 'خوێندن', fa: 'آموزش', ar: 'التعليم' },
    points: {
      en: ['All children aged 5-16 must be in school by law — this applies to asylum seekers too', 'Contact your local council to find a school place — they must provide one', 'Schools cannot refuse a child based on immigration status', 'EAL (English as Additional Language) support is available at most schools', 'Free school meals available if you receive asylum support or Universal Credit', 'Uniform grants are available — ask the school', 'ESOL (English for Speakers of Other Languages) classes are free — find them at esol.org.uk', 'Adults can access free college courses — ask your local college', 'University is possible — check UKCISA.org.uk for guidance on fees and funding'],
      ku: ['هەموو منداڵی ٥-١٦ ساڵ بە یاسا دەبێت لە قوتابخانە بن — ئەمە بۆ داواکارانی ئامادەیی هەروەها جێبەجێ دەبێت', 'پەیوەندی بە شارداریی ناوچەکەت بکە بۆ دۆزینەوەی شوێنی قوتابخانە — دەبێت پەیدایبکەن', 'قوتابخانەکان ناتوانن منداڵێک ڕەت بکەنەوە بەهۆی مافی کۆچبەریەوە', 'پشتگیری EAL (ئینگلیزی وەک زمانی زیادە) لە زۆربەی قوتابخانەکان بەردەستە', 'خواردنی قوتابخانەی بەخۆڕایی بەردەستە ئەگەر پشتگیری ئامادەیی یان Universal Credit وەردەگریت', 'بەخشینی یونیفۆرم بەردەستە — لە قوتابخانەکە بیپرسە', 'پۆلەکانی ESOL (ئینگلیزی بۆ قسەکەرانی زمانەکانی تر) بەخۆڕایین — لە esol.org.uk بیدۆزەرەوە', 'گەورەسالان دەتوانن دەستبگەن بە کۆرسی کۆلێجی بەخۆڕایی — لە کۆلێجی ناوچەکەتدا بیپرسە', 'زانکۆ بوونی هەیە — بۆ ڕێنماییدانی دەربارەی خەرجی و دارایی UKCISA.org.uk بچێک بکە'],
      fa: ['تمام کودکان ۵ تا ۱۶ ساله باید طبق قانون در مدرسه باشند — این برای پناهجویان هم صدق می‌کند', 'با شورای محلی‌ات تماس بگیر تا جای مدرسه پیدا کنی — باید یکی تهیه کنند', 'مدارس نمی‌توانند کودکی را بر اساس وضعیت مهاجرتی رد کنند', 'حمایت EAL (انگلیسی به عنوان زبان دوم) در اکثر مدارس موجود است', 'وعده غذایی رایگان مدرسه اگر حمایت پناهندگی یا Universal Credit دریافت می‌کنی', 'کمک هزینه یونیفورم موجود است — از مدرسه بپرس', 'کلاس‌های ESOL رایگان هستند — در esol.org.uk پیدا کن', 'بزرگسالان می‌توانند به دوره‌های رایگان کالج دسترسی داشته باشند', 'دانشگاه ممکن است — برای راهنمایی در مورد هزینه‌ها UKCISA.org.uk را چک کن'],
      ar: ['يجب أن يكون جميع الأطفال من 5-16 في المدرسة بموجب القانون — ينطبق هذا على طالبي اللجوء أيضاً', 'تواصل مع مجلسك المحلي للعثور على مكان في المدرسة — يجب عليهم توفير مكان', 'لا يمكن للمدارس رفض طفل بسبب وضع هجرته', 'دعم EAL متاح في معظم المدارس', 'وجبات مدرسية مجانية إذا كنت تتلقى دعم اللجوء أو Universal Credit', 'منح الزي المدرسي متاحة — اسأل المدرسة', 'دروس ESOL مجانية — اعثر عليها على esol.org.uk', 'يمكن للبالغين الوصول إلى دورات الكلية المجانية', 'الجامعة ممكنة — تحقق من UKCISA.org.uk للتوجيه بشأن الرسوم والتمويل'],
    }
  },
  {
    id: 'emergency', icon: '🆘', color: '#EF4444',
    title: { en: 'Emergency Contacts', ku: 'ژمارەکانی کریز', fa: 'اورژانس', ar: 'جهات الطوارئ' },
    points: {
      en: ['🚨 999 — Police, Fire, Ambulance (life-threatening ONLY)', '🏥 111 — NHS medical advice, non-emergency (free)', '👮 101 — Non-emergency police matters', '⚖️ Legal Aid Agency: 0300 200 2020', '🤝 Migrant Help: 0808 8010 503 (free, 24/7)', '💙 Samaritans: 116 123 (mental health crisis, free, 24/7)', '🏠 Shelter (housing crisis): 0808 800 4444', '💜 National Domestic Violence Helpline: 0808 2000 247', '👶 NSPCC (child protection): 0808 800 5000', '🔥 Gas emergency: 0800 111 999'],
      ku: ['🚨 999 — پۆلیس، ئاگرکوژێنەوە، ئەمبولانس (تەنها کریزی مەترسیدار بۆ ژیان)', '🏥 111 — ڕاوێژی تەندروستیی NHS، نەک کریز (بەخۆڕایی)', '👮 101 — کارە پۆلیسیەکانی نەکریز', '⚖️ ئەژانسی Legal Aid: 0300 200 2020', '🤝 Migrant Help: 0808 8010 503 (بەخۆڕایی، ٢٤/٧)', '💙 Samaritans: 116 123 (کریزی تەندروستیی دەروونی، بەخۆڕایی، ٢٤/٧)', '🏠 Shelter (کریزی مال): 0808 800 4444', '💜 هێڵی نیشتمانیی ئازاری ناوخانەوە: 0808 2000 247', '👶 NSPCC (پارێزگاری منداڵ): 0808 800 5000', '🔥 کریزی گاز: 0800 111 999'],
      fa: ['🚨 999 — پلیس، آتش‌نشانی، آمبولانس (فقط تهدید حیاتی)', '🏥 111 — مشاوره پزشکی NHS، غیراورژانسی (رایگان)', '👮 101 — موارد پلیسی غیراورژانسی', '⚖️ Legal Aid Agency: 0300 200 2020', '🤝 Migrant Help: 0808 8010 503 (رایگان، ۲۴/۷)', '💙 Samaritans: 116 123 (بحران سلامت روان، رایگان، ۲۴/۷)', '🏠 Shelter (بحران مسکن): 0808 800 4444', '💜 خط ملی خشونت خانگی: 0808 2000 247', '👶 NSPCC (حمایت از کودک): 0808 800 5000', '🔥 اورژانس گاز: 0800 111 999'],
      ar: ['🚨 999 — الشرطة والإطفاء والإسعاف (للتهديدات الحياتية فقط)', '🏥 111 — مشورة طبية NHS، غير طارئة (مجاني)', '👮 101 — شؤون الشرطة غير الطارئة', '⚖️ Legal Aid Agency: 0300 200 2020', '🤝 Migrant Help: 0808 8010 503 (مجاني، 24/7)', '💙 Samaritans: 116 123 (أزمة الصحة النفسية، مجاني، 24/7)', '🏠 Shelter (أزمة السكن): 0808 800 4444', '💜 الخط الوطني للعنف المنزلي: 0808 2000 247', '👶 NSPCC (حماية الطفل): 0808 800 5000', '🔥 طوارئ الغاز: 0800 111 999'],
    }
  },
  {
    id: 'rights', icon: '⚖️', color: '#6366F1',
    title: { en: 'Know Your Rights', ku: 'مافەکانت بناسە', fa: 'حقوقت را بشناس', ar: 'اعرف حقوقك' },
    points: {
      en: ['You CANNOT be deported while an appeal is active', 'You ALWAYS have the right to a free interpreter — demand it', 'Police cannot stop you based on race, religion or appearance alone', 'Your employer MUST pay minimum wage regardless of your status', 'A landlord CANNOT evict you without a proper court order', 'Domestic abuse victims can leave and still receive support', 'Reporting exploitation will NOT harm your asylum case', 'You can report a hate crime safely: 0800 138 1625', 'Children cannot be used as interpreters at medical or legal appointments', 'You have the right to see a doctor privately without your caseworker'],
      ku: ['ناتوانرێیت دیپۆرت بکرێیت لەکاتی چالاکبوونی تژیاوەکردنێک', 'هەموو کاتێک مافت هەیە بۆ وەرگێڕی بەخۆڕایی — داوایی بکە', 'پۆلیس ناتوانێت لەسەر بنچینەی ڕەگ، ئایین یان دیمەنت بیوەستێنێتت', 'کارفەرمات دەبێت کەمترین مووچە پێبدات بێ گوێرەی مافیت', 'خاوەن مالەکە ناتوانێت بەبێ فەرمانی دادگای دروست دەربکاتت', 'قوربانیانی ئازاری ناوخانە دەتوانن بچنە دەرەوە و هێشتا پشتگیری بگرن', 'ئاگادارکردنەوەی ئیستیسمار کێسی ئامادەیییەکەت خراپ ناکات', 'دەتوانیت کریمی ڕقەبەرانە بە ئارامی ڕاپۆرت بکەیت: 0800 138 1625', 'منداڵان ناتوانرێن وەرگێڕ بن لە چاوپێکەوتنی تەندروستی یان یاسایی', 'مافت هەیە بەتایبەت دکتەرت ببینیت بەبێ کارمەندی کێسەکەت'],
      fa: ['در حالی که استیناف فعال است نمی‌توانی اخراج شوی', 'همیشه حق داری به مترجم رایگان — آن را بخواه', 'پلیس نمی‌تواند فقط بر اساس نژاد، مذهب یا ظاهرت متوقفت کند', 'کارفرمایت باید صرف نظر از وضعیتت حداقل دستمزد بپردازد', 'صاحبخانه نمی‌تواند بدون حکم دادگاه مناسب اخراجت کند', 'قربانیان خشونت خانگی می‌توانند بروند و همچنان حمایت دریافت کنند', 'گزارش استثمار به پرونده پناهندگی‌ات آسیب نمی‌رساند', 'می‌توانی جرم نفرت‌آمیز را با خیال راحت گزارش دهی: 0800 138 1625', 'نمی‌توان از کودکان به عنوان مترجم در قرارهای پزشکی یا حقوقی استفاده کرد', 'حق داری بدون کارشناس پرونده‌ات به صورت خصوصی دکتر ببینی'],
      ar: ['لا يمكن ترحيلك أثناء الاستئناف الناشط', 'لديك دائماً الحق في مترجم مجاني — اطلبه', 'لا يمكن للشرطة إيقافك بناءً على العرق أو الدين أو المظهر وحده', 'يجب أن يدفع لك صاحب العمل الحد الأدنى للأجر بغض النظر عن وضعك', 'لا يمكن للمالك إخلاءك دون أمر قضائي مناسب', 'يمكن لضحايا العنف الأسري المغادرة والحصول على دعم', 'الإبلاغ عن الاستغلال لن يضر بقضية لجوئك', 'يمكنك الإبلاغ عن جريمة كراهية بأمان: 0800 138 1625', 'لا يمكن استخدام الأطفال مترجمين في المواعيد الطبية أو القانونية', 'لديك الحق في رؤية طبيب بشكل خاص دون مسؤول قضيتك'],
    }
  },
  {
    id: 'money', icon: '💰', color: '#10B981',
    title: { en: 'Money & Benefits', ku: 'پارە و یارمەتییەکان', fa: 'پول و مزایا', ar: 'المال والمزايا' },
    points: {
      en: ['Universal Credit: main benefit for working-age adults — apply at gov.uk/universal-credit', 'Child Benefit: £25.60/week for first child, £16.95 for each additional child', 'Free school meals for children if on low income', 'Council tax reduction — apply at your local council', 'Healthy Start vouchers if pregnant or have children under 4', 'Warm Home Discount: £150 off energy bills if on certain benefits', 'Free prescriptions if on Universal Credit or income support', 'NHS Low Income Scheme (HC1 form) for help with dental and eye costs', 'Citizens Advice can check if you are claiming everything you are entitled to: 0800 144 8848'],
      ku: ['Universal Credit: یارمەتیی سەرەکی بۆ گەورەسالانی تەمەنی کارکردن — داواکاری بکە لە gov.uk/universal-credit', 'یارمەتیی منداڵ: ٢٥.٦٠ پاوەند/هەفتانە بۆ منداڵی یەکەم، ١٦.٩٥ بۆ هەر منداڵێکی زیادە', 'خواردنی قوتابخانەی بەخۆڕایی بۆ منداڵان ئەگەر داهاتی کەم بیت', 'کەمکردنەوەی باجی شار — لە شارداریی ناوچەکەتدا داواکاری بکە', 'بەرگەکانی Healthy Start ئەگەر دووگیانت یان منداڵی ژێر ٤ ساڵت هەیە', 'داشکاندنی مالی گەرم: ١٥٠ پاوەند کەمکردن لە ئەژمارەکانی وزە ئەگەر لەسەر ژمارەیەک یارمەتی بیت', 'نووسخەی بەخۆڕایی ئەگەر لەسەر Universal Credit یان پشتگیری داهاتی بیت', 'پرۆگرامی داهاتی کەمی NHS (فۆرمی HC1) بۆ یارمەتی لە تێچووی دەندان و چاوی', 'Citizens Advice دەتوانێت بچێک بکات ئایا هەموو شتێک داوا دەکەیت کە مافت پێیەتی: 0800 144 8848'],
      fa: ['Universal Credit: مزیت اصلی برای بزرگسالان در سن کار — در gov.uk/universal-credit درخواست بده', 'کمک هزینه کودک: ۲۵.۶۰ پوند/هفته برای فرزند اول، ۱۶.۹۵ برای هر فرزند بعدی', 'وعده غذایی رایگان مدرسه برای کودکان اگر درآمد پایینی داری', 'کاهش مالیات شورا — در شورای محلی‌ات درخواست بده', 'کوپن‌های Healthy Start اگر باردار هستی یا کودک زیر ۴ سال داری', 'تخفیف گرمایش خانه: ۱۵۰ پوند تخفیف از قبض‌های انرژی اگر از مزایای خاصی برخوردار هستی', 'نسخه‌های رایگان اگر Universal Credit یا کمک درآمد دریافت می‌کنی', 'طرح درآمد پایین NHS (فرم HC1) برای کمک با هزینه‌های دندانپزشکی و چشم', 'Citizens Advice می‌تواند بررسی کند آیا همه چیزی که حق توست را مطالبه می‌کنی: 0800 144 8848'],
      ar: ['Universal Credit: المزيا الرئيسية لبالغي سن العمل — تقدم على gov.uk/universal-credit', 'إعانة الطفل: 25.60 جنيهاً/أسبوعاً للطفل الأول، 16.95 لكل طفل إضافي', 'وجبات مدرسية مجانية للأطفال إذا كان دخلك منخفضاً', 'تخفيض ضريبة المجلس — تقدم في مجلسك المحلي', 'قسائم Healthy Start إذا كنت حاملاً أو لديك أطفال دون 4 سنوات', 'خصم المنزل الدافئ: 150 جنيهاً خصم من فواتير الطاقة في حالات معينة', 'وصفات مجانية إذا كنت تتلقى Universal Credit أو دعم الدخل', 'مخطط دخل NHS المنخفض (نموذج HC1) للمساعدة في تكاليف الأسنان والعيون', 'يمكن لـ Citizens Advice التحقق مما إذا كنت تطالب بكل ما تستحقه: 0800 144 8848'],
    }
  },
]

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const TX = {
  en: { myStage: '📍 My Stage', infoHelp: '📋 Info & Help', ask: '❓ Ask', reberTitle: 'Rêber', reberSub: 'ڕێبەر — Your guide to life in the UK', selectStage: 'Where are you in your journey?', askTitle: 'Ask a Question', askSub: 'Ask anything about life in the UK. Bawan will answer personally.', askPlaceholder: 'Type your question here…', askBtn: 'Submit Question', askSuccess: 'Your question has been submitted!', awaitingAnswer: 'Awaiting answer…', answeredBy: 'Answered by Bawan', upvote: 'Helpful', questions: 'Questions', noQuestions: 'No questions yet — be the first to ask!', back: '← Back' },
  ku: { myStage: '📍 قۆناغەکەم', infoHelp: '📋 زانیاری و یارمەتی', ask: '❓ پرسیار', reberTitle: 'ڕێبەر', reberSub: 'ڕێنمای ژیانت لە UK', selectStage: 'لە کوێیت لە گەشتەکەتدا؟', askTitle: 'پرسیار بکە', askSub: 'هەر شتێک بپرسە دەربارەی ژیان لە UK. باوان بە خۆی وەڵام دەداتەوە.', askPlaceholder: 'پرسیارەکەت ئێرە بنووسە…', askBtn: 'پرسیار بنێرە', askSuccess: 'پرسیارەکەت نێردرا!', awaitingAnswer: 'چاوەڕوانی وەڵامە…', answeredBy: 'وەڵامدراوەتەوە لەلایەن باوان', upvote: 'یارمەتیدەر', questions: 'پرسیارەکان', noQuestions: 'هێشتا هیچ پرسیارێک نییە — یەکەمین بە!', back: '→ گەڕانەوە' },
  fa: { myStage: '📍 مرحله من', infoHelp: '📋 اطلاعات و کمک', ask: '❓ سوال', reberTitle: 'ڕێبەر', reberSub: 'راهنمای زندگی در بریتانیا', selectStage: 'در کجای سفرت هستی؟', askTitle: 'سوال بپرس', askSub: 'هر چیزی درباره زندگی در UK بپرس. باوان شخصاً پاسخ می‌دهد.', askPlaceholder: 'سوالت را اینجا بنویس…', askBtn: 'ارسال سوال', askSuccess: 'سوالت ارسال شد!', awaitingAnswer: 'در انتظار پاسخ…', answeredBy: 'پاسخ داده شده توسط باوان', upvote: 'مفید', questions: 'سوالات', noQuestions: 'هنوز سوالی نیست — اولین نفر باش!', back: '→ بازگشت' },
  ar: { myStage: '📍 مرحلتي', infoHelp: '📋 معلومات ومساعدة', ask: '❓ اسأل', reberTitle: 'ڕێبەر', reberSub: 'دليلك للحياة في المملكة المتحدة', selectStage: 'أين أنت في رحلتك؟', askTitle: 'اطرح سؤالاً', askSub: 'اسأل أي شيء عن الحياة في المملكة المتحدة. سيجيب باوان شخصياً.', askPlaceholder: 'اكتب سؤالك هنا…', askBtn: 'إرسال السؤال', askSuccess: 'تم إرسال سؤالك!', awaitingAnswer: 'في انتظار الإجابة…', answeredBy: 'أجاب عليه باوان', upvote: 'مفيد', questions: 'الأسئلة', noQuestions: 'لا توجد أسئلة بعد — كن الأول!', back: '→ رجوع' },
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function SectionCard({ section, lang, color }) {
  const [open, setOpen] = useState(false)
  return (
    <div onClick={() => setOpen(!open)} style={{ background: '#fff', borderRadius: 16, marginBottom: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', cursor: 'pointer', border: `1.5px solid ${open ? color : 'transparent'}`, transition: 'border 0.2s' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px' }}>
        <span style={{ fontSize: 26, flexShrink: 0 }}>{section.icon}</span>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 15, color: NAVY, flex: 1 }}>{section.title[lang] || section.title.en}</span>
        <span style={{ fontSize: 18, color, transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>›</span>
      </div>
      {open && (
        <div style={{ borderTop: `2px solid ${color}20`, padding: '4px 16px 16px' }}>
          {(section.points[lang] || section.points.en).map((point, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 10 }}>
              <span style={{ color, fontWeight: 900, fontSize: 16, flexShrink: 0, marginTop: 1 }}>•</span>
              <span style={{ fontFamily: FONT, fontSize: 14, color: '#333', lineHeight: 1.6 }}>{point}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function InfoCard({ section, lang }) {
  const [open, setOpen] = useState(false)
  return (
    <div onClick={() => setOpen(!open)} style={{ background: '#fff', borderRadius: 16, marginBottom: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', cursor: 'pointer', border: `1.5px solid ${open ? section.color : 'transparent'}`, transition: 'border 0.2s' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px' }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${section.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{section.icon}</div>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 15, color: NAVY, flex: 1 }}>{section.title[lang] || section.title.en}</span>
        <span style={{ fontSize: 18, color: section.color, transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>›</span>
      </div>
      {open && (
        <div style={{ borderTop: `2px solid ${section.color}20`, padding: '4px 16px 16px' }}>
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

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function ReberPage() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const [activeTab, setActiveTab] = useState('stage')
  const [activeStage, setActiveStage] = useState(null)
  const [questions, setQuestions] = useState([])
  const [newQuestion, setNewQuestion] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [upvoted, setUpvoted] = useState({})
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminAnswer, setAdminAnswer] = useState({})
  const t = TX[lang] || TX.en

  useEffect(() => {
    const saved = localStorage.getItem('kurdlink_lang')
    if (saved) setLang(saved)
    fetchQuestions()
    checkAdmin()
    const voted = JSON.parse(localStorage.getItem('reber_upvoted') || '{}')
    setUpvoted(voted)
  }, [])

  const checkAdmin = async () => {
    const supabase = getSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (user?.email === ADMIN_EMAIL) setIsAdmin(true)
  }

  const fetchQuestions = async () => {
    const supabase = getSupabase()
    const { data } = await supabase.from('questions').select('*').order('upvotes', { ascending: false })
    setQuestions(data || [])
  }

  const handleSubmitQuestion = async () => {
    if (!newQuestion.trim()) return
    setSubmitting(true)
    const supabase = getSupabase()
    await supabase.from('questions').insert({ question: newQuestion.trim() })
    setNewQuestion('')
    setSubmitted(true)
    setSubmitting(false)
    fetchQuestions()
    setTimeout(() => setSubmitted(false), 4000)
  }

  const handleUpvote = async (question) => {
    if (upvoted[question.id]) return
    const supabase = getSupabase()
    await supabase.from('questions').update({ upvotes: (question.upvotes || 0) + 1 }).eq('id', question.id)
    const newVoted = { ...upvoted, [question.id]: true }
    setUpvoted(newVoted)
    localStorage.setItem('reber_upvoted', JSON.stringify(newVoted))
    fetchQuestions()
  }

  const handleAdminAnswer = async (questionId) => {
    const answer = adminAnswer[questionId]
    if (!answer?.trim()) return
    const supabase = getSupabase()
    await supabase.from('questions').update({ answer: answer.trim(), status: 'answered', answered_at: new Date().toISOString() }).eq('id', questionId)
    setAdminAnswer(prev => ({ ...prev, [questionId]: '' }))
    fetchQuestions()
  }

  const stageContent = activeStage ? STAGE_CONTENT[activeStage] : null

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF', fontFamily: FONT, direction: 'ltr' }}>

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #2D4A9E 100%)`, padding: '16px 16px 0', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => activeStage ? setActiveStage(null) : router.push('/home')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 22, cursor: 'pointer', padding: 0 }}>←</button>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>🧭 {t.reberTitle}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>{t.reberSub}</div>
            </div>
          </div>
          <LangDropdown lang={lang} onChange={setLang} />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0 }}>
          {[
            { id: 'stage', label: t.myStage },
            { id: 'info',  label: t.infoHelp },
            { id: 'ask',   label: t.ask },
          ].map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setActiveStage(null) }} style={{
              flex: 1, padding: '10px 4px 12px', background: 'none', border: 'none',
              color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.5)',
              fontWeight: activeTab === tab.id ? 800 : 600, fontSize: 12,
              cursor: 'pointer', fontFamily: FONT,
              borderBottom: activeTab === tab.id ? '3px solid #FF6B35' : '3px solid transparent',
              transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── MY STAGE TAB ── */}
      {activeTab === 'stage' && !activeStage && (
        <div style={{ padding: '24px 16px' }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginBottom: 20, textAlign: 'center' }}>{t.selectStage}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 500, margin: '0 auto' }}>
            {STAGES.map(stage => (
              <button key={stage.id} onClick={() => setActiveStage(stage.id)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 8, padding: '20px 12px',
                background: '#fff', border: `2px solid ${stage.color}30`,
                borderRadius: 18, cursor: 'pointer', fontFamily: FONT,
                boxShadow: `0 4px 16px ${stage.color}15`,
                transition: 'all 0.2s',
              }}>
                <span style={{ fontSize: 32 }}>{stage.emoji}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: stage.color, textAlign: 'center', lineHeight: 1.3 }}>
                  {stage.label[lang] || stage.label.en}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── STAGE DETAIL ── */}
      {activeTab === 'stage' && activeStage && stageContent && (
        <div style={{ padding: '16px 16px 32px' }}>
          <div style={{ background: `linear-gradient(135deg, ${stageContent.color} 0%, ${stageContent.color}CC 100%)`, borderRadius: 20, padding: '20px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -20, right: -20, fontSize: 90, opacity: 0.1 }}>
              {STAGES.find(s => s.id === activeStage)?.emoji}
            </div>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{STAGES.find(s => s.id === activeStage)?.emoji}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 6 }}>{stageContent.title[lang] || stageContent.title.en}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>{stageContent.subtitle[lang] || stageContent.subtitle.en}</div>
          </div>
          {stageContent.sections.map((section, i) => (
            <SectionCard key={i} section={section} lang={lang} color={stageContent.color} />
          ))}
        </div>
      )}

      {/* ── INFO & HELP TAB ── */}
      {activeTab === 'info' && (
        <div style={{ padding: '16px 16px 32px' }}>
          {INFO_SECTIONS.map((section, i) => (
            <InfoCard key={i} section={section} lang={lang} />
          ))}
        </div>
      )}

      {/* ── ASK TAB ── */}
      {activeTab === 'ask' && (
        <div style={{ padding: '16px 16px 32px' }}>
          {/* Submit question */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '20px', marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: NAVY, marginBottom: 6 }}>❓ {t.askTitle}</div>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 16, lineHeight: 1.5 }}>{t.askSub}</div>
            <textarea
              value={newQuestion}
              onChange={e => setNewQuestion(e.target.value)}
              placeholder={t.askPlaceholder}
              rows={3}
              style={{ width: '100%', padding: '12px 14px', border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: 12, fontSize: 14, fontFamily: FONT, outline: 'none', resize: 'vertical', lineHeight: 1.5, boxSizing: 'border-box' }}
            />
            {submitted && (
              <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: '10px 14px', marginTop: 10, color: '#166534', fontSize: 13, fontWeight: 600 }}>
                ✅ {t.askSuccess}
              </div>
            )}
            <button
              onClick={handleSubmitQuestion}
              disabled={submitting || !newQuestion.trim()}
              style={{ width: '100%', marginTop: 12, padding: '13px', background: newQuestion.trim() ? `linear-gradient(135deg, ${ORANGE}, #FF8C61)` : '#e5e7eb', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, color: newQuestion.trim() ? '#fff' : '#9ca3af', cursor: newQuestion.trim() ? 'pointer' : 'default', fontFamily: FONT }}
            >
              {submitting ? '…' : t.askBtn}
            </button>
          </div>

          {/* Questions list */}
          <div style={{ fontSize: 15, fontWeight: 800, color: NAVY, marginBottom: 14 }}>💬 {t.questions}</div>
          {questions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#aaa', fontSize: 14 }}>{t.noQuestions}</div>
          ) : (
            questions.map(q => (
              <div key={q.id} style={{ background: '#fff', borderRadius: 16, padding: '16px', marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a', margin: '0 0 12px', lineHeight: 1.5 }}>{q.question}</p>

                {/* Answer */}
                {q.answer ? (
                  <div style={{ background: '#F0F9FF', borderRadius: 12, padding: '12px 14px', marginBottom: 12, borderLeft: `3px solid ${NAVY}` }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>🧭 {t.answeredBy}</div>
                    <p style={{ fontSize: 14, color: '#1a1a1a', margin: 0, lineHeight: 1.6 }}>{q.answer}</p>
                  </div>
                ) : (
                  <div style={{ background: '#FFFBEB', borderRadius: 10, padding: '8px 12px', marginBottom: 12, display: 'inline-block' }}>
                    <span style={{ fontSize: 12, color: '#92400E', fontWeight: 600 }}>⏳ {t.awaitingAnswer}</span>
                  </div>
                )}

                {/* Admin answer input */}
                {isAdmin && !q.answer && (
                  <div style={{ marginBottom: 12 }}>
                    <textarea
                      placeholder="Type your answer…"
                      value={adminAnswer[q.id] || ''}
                      onChange={e => setAdminAnswer(prev => ({ ...prev, [q.id]: e.target.value }))}
                      rows={2}
                      style={{ width: '100%', padding: '10px 12px', border: '1.5px solid rgba(26,43,95,0.2)', borderRadius: 10, fontSize: 13, fontFamily: FONT, outline: 'none', resize: 'vertical', boxSizing: 'border-box', marginBottom: 6 }}
                    />
                    <button
                      onClick={() => handleAdminAnswer(q.id)}
                      style={{ padding: '8px 16px', background: NAVY, border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: FONT }}
                    >
                      Post Answer
                    </button>
                  </div>
                )}

                {/* Upvote */}
                <button
                  onClick={() => handleUpvote(q)}
                  disabled={upvoted[q.id]}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: upvoted[q.id] ? '#FFF4F0' : '#f5f5f5', border: upvoted[q.id] ? '1px solid #FF6B35' : '1px solid rgba(0,0,0,0.08)', borderRadius: 20, cursor: upvoted[q.id] ? 'default' : 'pointer', fontFamily: FONT }}
                >
                  <span style={{ fontSize: 14 }}>👍</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: upvoted[q.id] ? ORANGE : '#666' }}>{q.upvotes || 0}</span>
                  <span style={{ fontSize: 11, color: upvoted[q.id] ? ORANGE : '#888' }}>{t.upvote}</span>
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}