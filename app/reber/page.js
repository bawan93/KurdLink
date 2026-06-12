'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LangDropdown from "../../components/LangDropdown"
import { createClient } from '../lib/supabase'

const INDIGO = '#4F46E5'
const INDIGO_DARK = '#1C1A4F'
const INDIGO_LIGHT = '#818CF8'
const MINT = '#34D399'
const FONT = "'Nunito', sans-serif"

const ADMIN_EMAIL = 'bawanhozhin@outlook.com'

const STAGES = [
  { id: 'arrived',  emoji: '🛬', color: '#3B82F6', label: { en: 'Just Arrived',  ku: 'تازە گەیشتووم',      fa: 'تازه رسیدم',      ar: 'وصلت للتو'      } },
  { id: 'waiting',  emoji: '⏳', color: '#F59E0B', label: { en: 'Waiting',       ku: 'لە چاوەڕوانیدام',   fa: 'در انتظارم',      ar: 'في الانتظار'    } },
  { id: 'granted',  emoji: '✅', color: '#10B981', label: { en: 'Status Granted', ku: 'مافم پێدرا',        fa: 'وضعیت تأیید شد',  ar: 'مُنح الوضع'     } },
  { id: 'refused',  emoji: '❌', color: '#EF4444', label: { en: 'Refused',        ku: 'داوام ڕەتکرایەوە',  fa: 'رد شد',           ar: 'رُفض'           } },
  { id: 'settled',  emoji: '🏡', color: '#8B5CF6', label: { en: 'Settled',        ku: 'نیشتەجێ بووم',      fa: 'مستقر شدم',       ar: 'استقررت'        } },
  { id: 'citizen',  emoji: '🇬🇧', color: '#F59E0B', label: { en: 'Citizen Path',  ku: 'ڕێگای هاووڵاتیبوون', fa: 'مسیر شهروندی',    ar: 'مسار المواطنة'  } },
]

const STAGE_CONTENT = {
  arrived: {
    color: '#3B82F6',
    title: { en: "You've Just Arrived", ku: 'تازە گەیشتووتە بەریتانیا', fa: 'تازه وارد شدی', ar: 'لقد وصلت للتو' },
    subtitle: { en: 'Here is exactly what to do in your first days.', ku: 'ئەمەش ئەوەیە کە دەبێت لە ڕۆژانی یەکەمدا بیکەیت.', fa: 'اینجاست که در روزهای اول باید انجام دهی.', ar: 'هذا ما يجب عليك فعله في أيامك الأولى.' },
    sections: [
      {
        icon: '⏰', title: { en: 'First 24 Hours', ku: 'یەکەم ٢٤ کاتژمێر', fa: '۲۴ ساعت اول', ar: 'أول ٢٤ ساعة' },
        points: {
          en: ['Report to the Home Office immediately — do not wait', 'Do NOT destroy any documents, even if told to', 'Say clearly: "I want to claim asylum"', 'Ask for an interpreter — this is your legal right', 'Keep your phone charged and with you at all times', 'Write down the name and badge number of any officer you speak to', 'You have the right to contact a lawyer before answering questions'],
          ku: ['فەوری خۆت بە هۆم ئۆفیس بگەیەنە — چاوەڕوانی مەکە', 'هیچ بەلگەیەک لەناو مەبە، تەنانەت ئەگەر کەس پێت بڵێ', 'ئاشکرا بڵێ: "دەمەوێت پەنام داواکەم"', 'داوای وەرگێڕی بکە — ئەمە مافی یاساییتە', 'مۆبایلەکەت شارژدار بکەرەوە و هەموو کاتێک لەگەڵت بێت', 'ناو و ژمارەی نیشانەی هەر ئەفیسەرێک بنووسە کە لەگەڵی قسەدەکەیت', 'مافت هەیە پێش وەڵامدانەوە پەیوەندی بە پارێزەر بکەیت'],
          fa: ['فوری به Home Office گزارش بده — منتظر نشو', 'هیچ مدرکی را از بین نبر، حتی اگر به تو گفته شود', 'واضح بگو: "می‌خواهم درخواست پناهندگی کنم"', 'مترجم بخواه — این حق قانونی توست', 'گوشی‌ات را شارژ نگه‌دار و همیشه با خودت داشته باش', 'نام و شماره نشان هر مأموری که با او صحبت می‌کنی را یادداشت کن', 'حق داری قبل از پاسخ به سوالات با وکیل تماس بگیری'],
          ar: ['أبلغ وزارة الداخلية فوراً — لا تنتظر', 'لا تتلف أي وثائق حتى لو طُلب منك ذلك', 'قل بوضوح: "أريد طلب اللجوء"', 'اطلب مترجماً — هذا حقك القانوني', 'اجعل هاتفك مشحوناً ومعك دائماً', 'سجّل اسم ورقم شارة أي ضابط تتحدث إليه', 'لديك الحق في التواصل مع محامٍ قبل الإجابة على الأسئلة'],
        }
      },
      {
        icon: '🪪', title: { en: 'Your ARC Card', ku: 'کارتی ARC ی تۆ', fa: 'کارت ARC تو', ar: 'بطاقة ARC الخاصة بك' },
        points: {
          en: ['ARC = Application Registration Card — your ID while your case is open', 'You will receive it within a few days of claiming asylum', 'It shows your photo, nationality, and whether you can work', 'Keep it safe — you will need it for NHS, housing and legal appointments', 'If lost, report immediately to the Home Office: 0300 123 2241', 'Do not give it to anyone other than an official'],
          ku: ['ARC = کارتی تۆمارکردنی پەنا — ناسنامەتە لەکاتی کردنەوەی کێسەکەت', 'لە چەند ڕۆژدا دوای داواکارییەکە دەیگریت', 'وێنەت، نەتەوەت و ئایا مافی کارکردنت هەیە نیشان دەدات', 'بیپارێزە — پێویستی پێیە بۆ NHS، مال و چاوپێکەوتنی یاسایی', 'ئەگەر وەرت چوو، فەوری پەیوەندی بکە بە هۆم ئۆفیس: 0300 123 2241', 'بە هیچ کەسێکی تر مەدە جگە لە ئەفیسەرێکی فەرمی'],
          fa: ['ARC = کارت ثبت درخواست — هویت تو در طول رسیدگی به پرونده‌ات', 'چند روز پس از درخواست پناهندگی دریافت می‌کنی', 'عکس، ملیت و اینکه آیا مجاز به کار هستی را نشان می‌دهد', 'آن را حفظ کن — برای NHS، مسکن و قرارهای حقوقی به آن نیاز داری', 'اگر گم شد، فوری به Home Office گزارش بده: 0300 123 2241', 'آن را به کسی غیر از مأمور رسمی ندهی'],
          ar: ['ARC = بطاقة تسجيل الطلب — هويتك أثناء فتح قضيتك', 'ستستلمها خلال أيام قليلة من تقديم طلب اللجوء', 'تُظهر صورتك وجنسيتك وما إذا كنت تستطيع العمل', 'احتفظ بها — ستحتاجها للـ NHS والإسكان والمواعيد القانونية', 'إذا فقدت، أبلغ فوراً وزارة الداخلية: 0300 123 2241', 'لا تعطها لأحد غير مسؤول رسمي'],
        }
      },
      {
        icon: '🏠', title: { en: 'Emergency Housing', ku: 'مالی فووری', fa: 'مسکن اضطراری', ar: 'الإسكان الطارئ' },
        points: {
          en: ['You will be given Section 98 emergency housing while your case starts', 'This may be a hostel, hotel, or shared house — you cannot choose', 'It may be anywhere in the UK — not necessarily near family', 'Do NOT refuse the housing offered — you may lose all support', 'Once your case is registered you move to Section 95 housing', 'You will receive £49.18 per week for food and essentials', 'If housing is unsafe or you feel threatened, tell your caseworker immediately'],
          ku: ['مالی فووری بەشی ٩٨ دەدرێتت لەکاتی دەستپێکردنی پرۆسەی پەناکەت', 'ئەمە دەبێت خانووچە، هۆتێل، یان خانووی هاوبەش بێت — تۆ هەڵبژاردنت نییە', 'ئەمە دەکرێت لە هەر شوێنێکی UK بێت', 'مالەکەی پێشکەشکراو ڕەت مەکەوە — هەموو پشتگیرییەکەت دەچێت', 'دوای تۆمارکردنی کێسەکەت بۆ مالی بەشی ٩٥ دەگوێزرێیتەوە', '٤٩.١٨ پاوەند هەفتانە بۆ خواردن و پێداویستییەکانت دەگریت', 'ئەگەر مالەکە ناپارێزرا بوو، فەوری بە کارمەندی کێسەکەت بڵێ'],
          fa: ['مسکن اضطراری بخش ۹۸ در شروع پرونده‌ات داده می‌شود', 'ممکن است خوابگاه، هتل یا خانه مشترک باشد — نمی‌توانی انتخاب کنی', 'ممکن است هر جایی در UK باشد', 'مسکن پیشنهادی را رد نکن — ممکن است تمام حمایت قطع شود', 'پس از ثبت پرونده به مسکن بخش ۹۵ منتقل می‌شوی', 'هفته‌ای ۴۹.۱۸ پوند برای غذا و ضروریات دریافت می‌کنی', 'اگر مسکن ناامن است، فوری به کارشناست بگو'],
          ar: ['ستُعطى إسكاناً طارئاً بموجب القسم 98 أثناء بدء قضيتك', 'قد يكون نُزلاً أو فندقاً أو منزلاً مشتركاً — لا يمكنك الاختيار', 'قد يكون في أي مكان في المملكة المتحدة', 'لا ترفض الإسكان المقدم — قد تفقد كل الدعم', 'بعد تسجيل قضيتك ستنتقل إلى إسكان القسم 95', 'ستتلقى 49.18 جنيهاً أسبوعياً للطعام والضروريات', 'إذا كان الإسكان غير آمن، أخبر مسؤول قضيتك فوراً'],
        }
      },
      {
        icon: '⚠️', title: { en: 'What NOT To Do', ku: 'چی نەکەی', fa: 'چه کاری نکنی', ar: 'ما يجب ألا تفعله' },
        points: {
          en: ['Do NOT work until you have written permission', 'Do NOT travel outside the UK — your case will be closed', 'Do NOT miss any reporting appointments — this is critical', 'Do NOT move address without telling the Home Office first', 'Do NOT sign anything you do not understand — ask for an interpreter', 'Do NOT use a lawyer who is not OISC registered — check at oisc.gov.uk', 'Do NOT pay anyone who claims they can speed up your case'],
          ku: ['کار مەکە تاوەکو مۆڵەتی نووسراو بگریت', 'دەرچوونی UK مەکە — کێسەکەت داخرێتەوە', 'هیچ کاتێک قۆناغی ڕاپۆرتدانت لەدەستمەدە', 'بەبێ ئاگادارکردنەوەی هۆم ئۆفیس ناونیشانت مەگۆڕیت', 'هیچ شتێک مەئیمزابکە کە تێناگەیتت — داوای وەرگێڕی بکە', 'پارێزەرێک بەکار مەهێنە کە تۆمارنەکراوە لە OISC', 'بە هیچ کەسێک پارە مەدە کە دەڵێت دەتوانێت کێسەکەت خێراتر بکات'],
          fa: ['تا مجوز کتبی نداری کار نکن', 'از UK خارج نشو — پرونده‌ات بسته می‌شود', 'هیچ وقت سر قرار گزارش‌دهی نرو', 'بدون اطلاع قبلی به Home Office آدرست را عوض نکن', 'چیزی که نمی‌فهمی امضا نکن — مترجم بخواه', 'از وکیلی استفاده نکن که در OISC ثبت نشده', 'به کسی که ادعا می‌کند می‌تواند پرونده‌ات را سریع‌تر کند پول نده'],
          ar: ['لا تعمل حتى تحصل على إذن مكتوب', 'لا تسافر خارج المملكة المتحدة — ستُغلق قضيتك', 'لا تفوت أي مواعيد الإبلاغ', 'لا تغير عنوانك دون إخبار وزارة الداخلية أولاً', 'لا توقع على أي شيء لا تفهمه — اطلب مترجماً', 'لا تستخدم محامياً غير مسجل في OISC', 'لا تدفع لأحد يدّعي أنه يمكنه تسريع قضيتك'],
        }
      },
      {
        icon: '⚖️', title: { en: 'Your Rights From Day One', ku: 'مافەکانت لە ڕۆژی یەکەم', fa: 'حقوق تو از روز اول', ar: 'حقوقك من اليوم الأول' },
        points: {
          en: ['Right to free legal representation through Legal Aid', 'Right to a free interpreter at every official appointment', 'Right to emergency NHS healthcare regardless of status', 'Right to education for your children aged 5-16', 'Right to report abuse, exploitation or crime safely', 'Right to remain in the UK while your claim is being decided', 'Right to appeal if your claim is refused'],
          ku: ['مافی نوێنەرایەتیی یاسایی بەخۆڕایی لە ڕێگەی Legal Aid', 'مافی وەرگێڕی بەخۆڕایی لە هەموو چاوپێکەوتنی فەرمی', 'مافی چارەسەری فووری بەخۆڕایی لە NHS', 'مافی خوێندن بۆ منداڵەکانت لە تەمەنی ٥ تا ١٦ ساڵ', 'مافی ڕاپۆرتدانی ئازار، ئیستیسمار یان تاوان بە ئارامی', 'مافی مانەوە لە UK لەکاتی بڕیاردانی کێسەکەت', 'مافی تژیاوکاری ئەگەر داواکارییەکەت ڕەتکرایەوە'],
          fa: ['حق نمایندگی حقوقی رایگان از طریق Legal Aid', 'حق مترجم رایگان در هر قرار رسمی', 'حق مراقبت اضطراری رایگان NHS', 'حق تحصیل برای فرزندان ۵ تا ۱۶ ساله‌ات', 'حق گزارش آزار، استثمار یا جرم به صورت ایمن', 'حق ماندن در UK در طول بررسی درخواستت', 'حق تجدیدنظر اگر درخواستت رد شود'],
          ar: ['حق التمثيل القانوني المجاني من خلال المساعدة القانونية', 'حق الحصول على مترجم مجاني في كل موعد رسمي', 'حق الرعاية الصحية الطارئة المجانية', 'حق التعليم لأطفالك من سن 5-16', 'حق الإبلاغ عن الإساءة والاستغلال والجريمة بأمان', 'حق البقاء في المملكة المتحدة أثناء النظر في طلبك', 'حق الاستئناف إذا رُفض طلبك'],
        }
      },
    ]
  },
  waiting: {
    color: '#F59E0B',
    title: { en: 'While You Wait', ku: 'لە ماوەی چاوەڕوانیدا', fa: 'در حین انتظار', ar: 'أثناء الانتظار' },
    subtitle: { en: 'Your case is being decided. Know what you can and cannot do.', ku: 'کێسەکەت لە بڕیارداندایە. بزانە چیت دەکرێت و چیت ناکرێت.', fa: 'پرونده‌ات در حال بررسی است.', ar: 'يجري البت في قضيتك.' },
    sections: [
      {
        icon: '💰', title: { en: 'What You Are Entitled To', ku: 'چیت مافی هەیە', fa: 'چه حقوقی داری', ar: 'ما تستحقه' },
        points: {
          en: ['Section 95 asylum support — £49.18 per week per adult', 'Free NHS healthcare for you and your entire family', 'Free school for all children aged 5-16', 'Free legal aid for your asylum case', 'Free interpreter at all official appointments', 'Free school meals if your children are in school', 'Right to open a basic bank account with your ARC card'],
          ku: ['پشتگیری پەنای بەشی ٩٥ — ٤٩.١٨ پاوەند هەفتانە', 'چارەسەری بەخۆڕاییی NHS بۆ تۆ و هەموو خێزانەکەت', 'قوتابخانەی بەخۆڕایی بۆ هەموو منداڵی ٥ تا ١٦ ساڵ', 'یارمەتیی یاسایی بەخۆڕایی بۆ کێسی پەناکەت', 'وەرگێڕی بەخۆڕایی لە هەموو چاوپێکەوتنی فەرمی', 'خواردنی بەخۆڕاییی قوتابخانە ئەگەر منداڵەکانت لە قوتابخانەن', 'مافی کردنەوەی ئەکاونتی بانکی بنچینەیی بە کارتی ARCت'],
          fa: ['کمک پناهندگی بخش ۹۵ — ۴۹.۱۸ پوند در هفته', 'مراقبت بهداشتی رایگان NHS برای تو و تمام خانواده‌ات', 'مدرسه رایگان برای تمام کودکان ۵ تا ۱۶ ساله', 'کمک حقوقی رایگان برای پرونده پناهندگی‌ات', 'مترجم رایگان در تمام قرارهای رسمی', 'وعده غذایی رایگان مدرسه اگر فرزندانت در مدرسه هستند', 'حق افتتاح حساب بانکی اولیه با کارت ARC'],
          ar: ['دعم اللجوء بموجب القسم 95 — 49.18 جنيهاً أسبوعياً', 'الرعاية الصحية المجانية لك ولعائلتك بأكملها', 'مدرسة مجانية لجميع الأطفال من 5-16 سنة', 'مساعدة قانونية مجانية لقضية لجوئك', 'مترجم مجاني في جميع المواعيد الرسمية', 'وجبات مدرسية مجانية إذا كان أطفالك في المدرسة', 'حق فتح حساب بنكي أساسي ببطاقة ARC'],
        }
      },
      {
        icon: '🎤', title: { en: 'Your Asylum Interview', ku: 'چاوپێکەوتنی ئامادەییت', fa: 'مصاحبه پناهندگی تو', ar: 'مقابلة اللجوء الخاصة بك' },
        points: {
          en: ['This is the most important part of your case — prepare carefully', 'Tell the full truth — inconsistencies will damage your case', 'You MUST have a solicitor present — never go alone', 'Ask for breaks whenever you feel overwhelmed', 'You can ask for a same-gender interviewer if preferred', 'The interview will be recorded — everything you say matters', 'Your solicitor can challenge any unfair or misleading questions', 'If you remember something important after — tell your solicitor immediately'],
          ku: ['ئەمە گرنگترین بەشی کێسەکەتە — بە وردی خۆت ئامادەبکەرەوە', 'ڕاستی تەواو بڵێ — ناڕاستەواز زیانی کێسەکەت دەدات', 'دەبێت پارێزەرت لەگەڵت بێت — هەرگیز تەنیا مەچو', 'هەر کاتێک کە گرانت بوو داوای پشوودانێک بکە', 'دەتوانیت داوای چاوپێکەوتنگری هەمجنس بکەیت', 'چاوپێکەوتنەکە تۆمار دەکرێت — هەموو شتێک دەڵێیت گرنگە', 'پارێزەرەکەت دەتوانێت هەر پرسیاری نادادپەروەرانەیەک ڕەت بکاتەوە', 'ئەگەر دوای چاوپێکەوتنەکە شتێکی گرنگت بیرهاتەوە — فەوری بە پارێزەرەکەت بڵێ'],
          fa: ['این مهم‌ترین بخش پرونده‌ات است — با دقت آماده شو', 'تمام حقیقت را بگو — ناسازگاری به پرونده‌ات آسیب می‌رساند', 'باید وکیل داشته باشی — هرگز تنها نرو', 'هر وقت احساس فشار کردی استراحت بخواه', 'می‌توانی مصاحبه‌گر هم‌جنس بخواهی', 'مصاحبه ضبط می‌شود — هر چه می‌گویی اهمیت دارد', 'وکیلت می‌تواند سوالات ناعادلانه را به چالش بکشد', 'اگر بعد از مصاحبه چیز مهمی به یادت آمد — فوری به وکیلت بگو'],
          ar: ['هذا أهم جزء في قضيتك — استعد بعناية', 'أخبر بكامل الحقيقة — التناقضات ستضر بقضيتك', 'يجب أن يكون محاميك حاضراً — لا تذهب وحدك أبداً', 'اطلب استراحات كلما شعرت بالإرهاق', 'يمكنك طلب محاور من نفس جنسك', 'ستُسجَّل المقابلة — كل ما تقوله مهم', 'يمكن لمحاميك الطعن في أي أسئلة غير عادلة', 'إذا تذكرت شيئاً مهماً بعد المقابلة — أخبر محاميك فوراً'],
        }
      },
      {
        icon: '🧠', title: { en: 'Your Mental Health Matters', ku: 'تەندروستیی دەروونیت گرنگە', fa: 'سلامت روان تو مهم است', ar: 'صحتك النفسية مهمة' },
        points: {
          en: ['Feeling anxious, isolated, and scared is completely normal', 'The waiting period is one of the hardest parts — you are not alone', 'Talk to someone — keeping it inside makes things worse', 'Samaritans: 116 123 — free, 24/7, no questions asked', 'MIND: 0300 123 3393 — mental health support', 'Shout: text 85258 — crisis text support', 'Your GP can refer you for free counselling — ask them', 'Asylum seekers are 5x more likely to experience PTSD — this is real'],
          ku: ['ترس، نیگەرانی و تەنیابوون هەستی ئاسایین — تاقم نیت', 'ماوەی چاوەڕوانی یەکێکە لە سەختترین کاتەکان', 'بە کەسێک دەربارەیدا قسە بکە', 'Samaritans: 116 123 — بەخۆڕایی، ٢٤/٧', 'MIND: 0300 123 3393 — پشتگیری تەندروستیی دەروونی', 'Shout: تێکستی بنێرە بۆ 85258', 'دکتەرەکەت دەتوانێت بنێرێتت بۆ ڕاوێژکاری بەخۆڕایی', 'پەناهەندەکان ٥ جار زیاتر دوچاری PTSD دەبن'],
          fa: ['احساس اضطراب، انزوا و ترس کاملاً طبیعی است', 'دوره انتظار یکی از سخت‌ترین بخش‌هاست — تنها نیستی', 'با کسی صحبت کن', 'Samaritans: 116 123 — رایگان، ۲۴/۷', 'MIND: 0300 123 3393 — حمایت از سلامت روان', 'Shout: پیام به 85258', 'دکترت می‌تواند برای مشاوره رایگان ارجاع دهد', 'پناهجویان ۵ برابر بیشتر احتمال دارد PTSD تجربه کنند'],
          ar: ['الشعور بالقلق والعزلة والخوف أمر طبيعي تماماً', 'فترة الانتظار من أصعب المراحل — لست وحدك', 'تحدث مع شخص ما', 'Samaritans: 116 123 — مجاني، 24/7', 'MIND: 0300 123 3393 — دعم الصحة النفسية', 'Shout: أرسل رسالة إلى 85258', 'يمكن لطبيبك إحالتك للإرشاد المجاني', 'طالبو اللجوء أكثر عرضة للإصابة بـ PTSD بمقدار 5 مرات'],
        }
      },
    ]
  },
  granted: {
    color: '#10B981',
    title: { en: 'Status Granted — Next Steps', ku: 'مافت پێدرا — هەنگاوە داواکانت', fa: 'وضعیت تأیید شد — گام‌های بعدی', ar: 'تم منح الوضع — الخطوات التالية' },
    subtitle: { en: 'Congratulations. Act quickly — you have 28 days before support stops.', ku: 'پیرۆزت بێت. خێرا ڕەفتار بکە — تەنها ٢٨ ڕۆژت هەیە.', fa: 'تبریک. سریع اقدام کن — ۲۸ روز قبل از قطع حمایت داری.', ar: 'تهانينا. تصرف بسرعة — لديك 28 يوماً قبل توقف الدعم.' },
    sections: [
      {
        icon: '⚡', title: { en: 'The Critical 28 Days', ku: '٢٨ ڕۆژی گرنگ', fa: '۲۸ روز بحرانی', ar: 'الـ 28 يوماً الحرجة' },
        points: {
          en: ['You have exactly 28 days from your decision letter before asylum support stops', 'Use these 28 days to apply for Universal Credit, housing and your NI number', 'Collect your BRP card from the Post Office listed in your letter — within 10 days', 'Register with a GP immediately', 'Contact your local council about housing — do this in week 1', 'Open a bank account — Monzo and Starling accept BRP and are easiest', 'Apply for your National Insurance number at gov.uk immediately'],
          ku: ['تەنها ٢٨ ڕۆژت هەیە لە وەرگرتنی نامەی بڕیارەکەت', 'ئەم ٢٨ ڕۆژانە بەکاربهێنە بۆ داواکاری Universal Credit، مال و ژمارەی NI ت', 'کارتی BRP ت لە ئۆفیسی پۆستی نووسراو لە نامەکەت وەربگرە', 'فەوری لەگەڵ GP تۆمار بکە', 'پەیوەندی بە شارداریی ناوچەکەت بکە دەربارەی مال', 'ئەکاونتی بانکی بکەرەوە — Monzo و Starling ئاسانترن', 'فەوری داواکاری ژمارەی بیمەی نیشتمانیت بکە لە gov.uk'],
          fa: ['دقیقاً ۲۸ روز از نامه تصمیم تا قطع حمایت پناهندگی داری', 'این ۲۸ روز را برای درخواست Universal Credit، مسکن و شماره NI استفاده کن', 'کارت BRP را از پست‌آفیس ذکر شده در نامه‌ات بگیر', 'فوری با GP ثبت‌نام کن', 'با شورای محلی‌ات در مورد مسکن تماس بگیر', 'حساب بانکی باز کن — Monzo و Starling آسان‌ترند', 'فوری در gov.uk برای شماره بیمه ملی درخواست بده'],
          ar: ['لديك 28 يوماً بالضبط من رسالة القرار قبل توقف دعم اللجوء', 'استخدم هذه الـ 28 يوماً للتقدم للحصول على Universal Credit والإسكان ورقم NI', 'اجمع بطاقة BRP من مكتب البريد المذكور في رسالتك', 'سجّل لدى طبيب عام فوراً', 'تواصل مع مجلسك المحلي بشأن الإسكان', 'افتح حساباً مصرفياً — Monzo وStarling الأسهل', 'تقدم فوراً للحصول على رقم التأمين الوطني على gov.uk'],
        }
      },
    ]
  },
  refused: {
    color: '#EF4444',
    title: { en: 'Your Claim Was Refused', ku: 'داواکارییەکەت ڕەتکرایەوە', fa: 'درخواستت رد شد', ar: 'تم رفض طلبك' },
    subtitle: { en: "Don't panic. You have rights and options. Act within 14 days.", ku: 'نیگەران مەبە. مافت و بژاردەت هەیە. لە ناو ١٤ ڕۆژدا ڕەفتار بکە.', fa: 'نگران نباش. ظرف ۱۴ روز اقدام کن.', ar: 'لا تذعر. تصرف خلال 14 يوماً.' },
    sections: [
      {
        icon: '⏱️', title: { en: 'You Have 14 Days to Appeal', ku: '١٤ ڕۆژت هەیە بۆ تژیاوەکردن', fa: '۱۴ روز برای تجدیدنظر داری', ar: 'لديك 14 يوماً للاستئناف' },
        points: {
          en: ['Read the refusal letter very carefully — understand every reason given', 'Contact your solicitor TODAY — do not wait even one day', 'No solicitor? Call Legal Aid immediately: 0300 200 2020', 'You can usually remain in the UK while your appeal is being heard', 'Keep attending all reporting appointments', 'Your housing and financial support should continue during appeal', 'Write down everything you remember — new evidence can be added at appeal'],
          ku: ['نامەی ڕەتکردنەوەکە بە وردی بخوێنەوە', 'ئەمڕۆ پەیوەندی بە پارێزەرەکەت بکە', 'پارێزەرت نییە؟ فەوری پەیوەندی بکە بە Legal Aid: 0300 200 2020', 'دەتوانیت لە UK بمێنیتەوە لەکاتی گوێگرتن لە تژیاوکارییەکەت', 'هەموو کاتێک چوونە ڕاپۆرتدانت بکە', 'مال و پشتگیری داراییت دەبێت بەردەوام بێت', 'هەموو شتێک بنووسە کە یادت دێتەوە'],
          fa: ['نامه رد را خیلی دقیق بخوان', 'امروز با وکیلت تماس بگیر', 'وکیل نداری؟ فوری با Legal Aid تماس بگیر: 0300 200 2020', 'معمولاً می‌توانی در UK بمانی', 'به تمام قرارهای گزارش‌دهی برو', 'مسکن و حمایت مالی‌ات باید ادامه داشته باشد', 'هر چه به یاد می‌آوری بنویس'],
          ar: ['اقرأ رسالة الرفض بعناية شديدة', 'تواصل مع محاميك اليوم', 'لا محامي؟ اتصل بالمساعدة القانونية فوراً: 0300 200 2020', 'يمكنك عادةً البقاء في المملكة المتحدة', 'استمر في حضور جميع مواعيد الإبلاغ', 'يجب أن يستمر إسكانك ودعمك المالي', 'اكتب كل ما تتذكره'],
        }
      },
      {
        icon: '🤝', title: { en: 'Organisations That Can Help Now', ku: 'ڕێکخراوەکانی دەتوانن ئێستا یارمەتیت بدەن', fa: 'سازمان‌هایی که الان می‌توانند کمک کنند', ar: 'منظمات يمكنها المساعدة الآن' },
        points: {
          en: ['Refugee Council: 020 7346 6700 — free advice and support', 'Asylum Aid: 020 7354 9631 — free legal representation', 'Migrant Help: 0808 8010 503 — free 24/7 helpline', 'UNHCR UK: unhcr.org/uk — UN refugee agency', 'Citizens Advice: 0800 144 8848 — free general advice', 'Shelter: 0808 800 4444 — if you are at risk of homelessness', 'Medical Justice: if you have been detained or experienced trauma'],
          ku: ['ئەنجومەنی پەناهەندەکان: 020 7346 6700', 'Asylum Aid: 020 7354 9631', 'Migrant Help: 0808 8010 503 — بەخۆڕایی ٢٤/٧', 'UNHCR UK: unhcr.org/uk', 'Citizens Advice: 0800 144 8848', 'Shelter: 0808 800 4444', 'Medical Justice: ئەگەر دەستگیرکراوت یان ئەزموونی ئازاری هەیە'],
          fa: ['شورای پناهندگان: 020 7346 6700', 'Asylum Aid: 020 7354 9631', 'Migrant Help: 0808 8010 503 — رایگان ۲۴/۷', 'UNHCR UK: unhcr.org/uk', 'Citizens Advice: 0800 144 8848', 'Shelter: 0808 800 4444', 'Medical Justice: اگر بازداشت شده‌ای یا تجربه تروما داشته‌ای'],
          ar: ['مجلس اللاجئين: 020 7346 6700', 'Asylum Aid: 020 7354 9631', 'Migrant Help: 0808 8010 503 — مجاني 24/7', 'UNHCR UK: unhcr.org/uk', 'Citizens Advice: 0800 144 8848', 'Shelter: 0808 800 4444', 'Medical Justice: إذا كنت قد احتُجزت أو عانيت من صدمة'],
        }
      },
    ]
  },
  settled: {
    color: '#8B5CF6',
    title: { en: 'Building Your Life in the UK', ku: 'دروستکردنی ژیانت لە UK', fa: 'ساختن زندگی‌ات در UK', ar: 'بناء حياتك في المملكة المتحدة' },
    subtitle: { en: 'You have status. Now build something great.', ku: 'مافت هەیە. ئێستا شتێکی بەرزت بنیادبنێ.', fa: 'وضعیت داری. حالا چیز عالی بساز.', ar: 'لديك وضع. الآن ابنِ شيئاً رائعاً.' },
    sections: [
      {
        icon: '💼', title: { en: 'Your Right to Work', ku: 'مافی کارکردنت', fa: 'حق کار کردن تو', ar: 'حقك في العمل' },
        points: {
          en: ['You can work in almost any job in the UK', 'Minimum wage (2025): £12.21/hour for adults over 21', 'Your employer cannot pay you less because of your background', 'You pay National Insurance and income tax like everyone else', 'Keep all payslips — you will need them for ILR application', 'Report exploitation anonymously: 0800 028 3838', 'You can start your own business — Komek can help you list it'],
          ku: ['دەتوانیت لە هەرجۆر کارێکدا لە UK کاربکەیت', 'کەمترین مووچە (٢٠٢٥): ١٢.٢١ پاوەند/کاتژمێر', 'کارفەرمات ناتوانێت بەهۆی پێشینەکەتەوە کەمتر پارەت بدات', 'بیمەی نیشتمانی و باجی داهات وەک هەموو کەسێک دەدەیت', 'هەموو پارەدانەکانت بیگرەوە — پێویستیان بۆ داواکاری ILR دەبێت', 'ئیستیسمار بەبێ ناسراوی ڕاپۆرت بکە: 0800 028 3838', 'دەتوانیت کاروباری خۆت دامەزرێنیت — Komek یارمەتیت دەدات'],
          fa: ['می‌توانی تقریباً در هر شغلی در UK کار کنی', 'حداقل دستمزد (۲۰۲۵): ۱۲.۲۱ پوند/ساعت', 'کارفرمایت نمی‌تواند به خاطر پیشینه‌ات کمتر پرداخت کند', 'بیمه ملی و مالیات بر درآمد مثل همه دیگران می‌پردازی', 'تمام فیش‌های حقوقی را نگه‌دار', 'استثمار را به صورت ناشناس گزارش بده: 0800 028 3838', 'می‌توانی کسب‌وکار خودت را راه‌اندازی کنی'],
          ar: ['يمكنك العمل في تقريباً أي وظيفة في المملكة المتحدة', 'الحد الأدنى للأجر (2025): 12.21 جنيهاً/ساعة', 'لا يمكن لصاحب العمل أن يدفع لك أقل بسبب خلفيتك', 'تدفع التأمين الوطني وضريبة الدخل مثل الجميع', 'احتفظ بجميع كشوف الراتب', 'أبلغ عن الاستغلال بشكل مجهول: 0800 028 3838', 'يمكنك بدء عملك التجاري'],
        }
      },
    ]
  },
  citizen: {
    color: '#F59E0B',
    title: { en: 'The Path to British Citizenship', ku: 'ڕێگای بەرەو هاووڵاتیی بەریتانی', fa: 'مسیر به سمت شهروندی بریتانیایی', ar: 'الطريق إلى الجنسية البريطانية' },
    subtitle: { en: 'From refugee to British citizen — the full journey.', ku: 'لە پەناهەندە تا هاووڵاتیی بەریتانی.', fa: 'از پناهنده تا شهروند بریتانیایی.', ar: 'من لاجئ إلى مواطن بريطاني.' },
    sections: [
      {
        icon: '📋', title: { en: 'Applying for ILR', ku: 'داواکاری ILR', fa: 'درخواست ILR', ar: 'التقدم لـ ILR' },
        points: {
          en: ['ILR = Indefinite Leave to Remain — permanent permission to live in the UK', 'Eligible after 5 years of lawful residence', 'Application fee: £2,885 — start saving early', 'Must pass the Life in the UK test first', 'Must meet English language requirements (B1 level)', 'Apply online at gov.uk/indefinite-leave-to-remain'],
          ku: ['ILR = مۆڵەتی مانەوەی بەبێ کۆتایی', 'دوای ٥ ساڵی نیشتەجێبوونی یاسایی واجب دەبیت', 'تێچووی داواکارییەکە: ٢،٨٨٥ پاوەند', 'پێویستە تێستی ژیانی UK ت تێپەڕ بکەیت', 'پێویستە ئاستی B1 لە زمانی ئینگلیزی پێشکەش بکەیت', 'ئۆنلاین داواکاری بکە لە gov.uk/indefinite-leave-to-remain'],
          fa: ['ILR = اقامت نامحدود', 'بعد از ۵ سال اقامت قانونی واجد شرایط می‌شوی', 'هزینه درخواست: ۲،۸۸۵ پوند', 'باید ابتدا تست زندگی در UK را بگذری', 'باید شرایط زبان انگلیسی را برآورده کنی', 'آنلاین در gov.uk/indefinite-leave-to-remain درخواست بده'],
          ar: ['ILR = إقامة غير محددة المدة', 'مؤهل بعد 5 سنوات من الإقامة القانونية', 'رسوم الطلب: 2,885 جنيهاً', 'يجب اجتياز اختبار الحياة في المملكة المتحدة أولاً', 'يجب استيفاء متطلبات اللغة الإنجليزية', 'تقدم عبر الإنترنت على gov.uk/indefinite-leave-to-remain'],
        }
      },
    ]
  },
}

const INFO_SECTIONS = [
  {
    id: 'health', icon: '🏥', color: '#EC4899',
    title: { en: 'Health', ku: 'تەندروستی', fa: 'سلامت', ar: 'الصحة' },
    points: {
      en: ['Register with a GP at nhs.uk/find-a-gp — no ID or immigration docs needed', 'You cannot be refused NHS treatment because of your immigration status', 'Always ask for a Kurdish/Sorani/Farsi/Arabic interpreter — it is free and your right', '999 = life-threatening emergency only | 111 = medical help, not emergency | GP = regular care', 'Dental care is free if you are on asylum support or Universal Credit', 'Maternity care is free — tell your midwife your situation', 'Mental health support is available — ask your GP for a referral', 'Sexual health clinics are free and completely confidential'],
      ku: ['لەگەڵ GP تۆمار بکە لە nhs.uk/find-a-gp — پێویستت بە ناسنامە نییە', 'بەهۆی مافی کۆچبەریتەوە ناتوانرێت ڕەتی چارەسەری NHS بکرێت', 'هەموو کاتێک داوای وەرگێڕی کوردی/سۆرانی/فارسی/عەرەبی بکە', '999 = تەنها کریزی گیان | 111 = یارمەتیی تەندروستی | GP = چارەسەری ئاسایی', 'چارەسەری دەندانی بەخۆڕاییە ئەگەر لەسەر پشتگیری پەنا یان Universal Credit بیت', 'چارەسەری دووگیانی بەخۆڕاییە', 'پشتگیری تەندروستیی دەروونی بەردەستە', 'کلینیکەکانی تەندروستیی جنسی بەخۆڕایین و تەواو نهێنین'],
      fa: ['با GP در nhs.uk/find-a-gp ثبت‌نام کن — به مدرک هویت نیاز نیست', 'به دلیل وضعیت مهاجرتی‌ات نمی‌توانند از درمان NHS محروم کنند', 'همیشه مترجم کردی/سورانی/فارسی/عربی بخواه', '999 = فقط اورژانس تهدیدکننده حیات | 111 = کمک پزشکی | GP = مراقبت معمولی', 'دندانپزشکی رایگان است اگر از حمایت پناهندگی استفاده می‌کنی', 'مراقبت بارداری رایگان است', 'حمایت از سلامت روان در دسترس است', 'کلینیک‌های بهداشت جنسی رایگان و کاملاً محرمانه هستند'],
      ar: ['سجّل لدى طبيب عام على nhs.uk/find-a-gp — لا تحتاج هوية', 'لا يمكن رفض علاجك في NHS بسبب وضع هجرتك', 'اطلب دائماً مترجماً كردياً/سورانياً/فارسياً/عربياً', '999 = حالات الطوارئ المهددة للحياة فقط | 111 = مساعدة طبية | طبيب عام = رعاية منتظمة', 'رعاية الأسنان مجانية إذا كنت تتلقى دعم اللجوء', 'رعاية الأمومة مجانية', 'دعم الصحة النفسية متاح', 'عيادات الصحة الجنسية مجانية وسرية تماماً'],
    }
  },
  {
    id: 'emergency', icon: '🆘', color: '#EF4444',
    title: { en: 'Emergency Contacts', ku: 'ژمارەکانی کریز', fa: 'اورژانس', ar: 'جهات الطوارئ' },
    points: {
      en: ['🚨 999 — Police, Fire, Ambulance (life-threatening ONLY)', '🏥 111 — NHS medical advice, non-emergency (free)', '👮 101 — Non-emergency police matters', '⚖️ Legal Aid Agency: 0300 200 2020', '🤝 Migrant Help: 0808 8010 503 (free, 24/7)', '💙 Samaritans: 116 123 (mental health crisis, free, 24/7)', '🏠 Shelter (housing crisis): 0808 800 4444', '💜 National Domestic Violence Helpline: 0808 2000 247', '👶 NSPCC (child protection): 0808 800 5000'],
      ku: ['🚨 999 — پۆلیس، ئاگرکوژێنەوە، ئەمبولانس (تەنها کریزی مەترسیدار)', '🏥 111 — ڕاوێژی تەندروستیی NHS (بەخۆڕایی)', '👮 101 — کارە پۆلیسیەکانی نەکریز', '⚖️ Legal Aid Agency: 0300 200 2020', '🤝 Migrant Help: 0808 8010 503 (بەخۆڕایی، ٢٤/٧)', '💙 Samaritans: 116 123 (بەخۆڕایی، ٢٤/٧)', '🏠 Shelter: 0808 800 4444', '💜 هێڵی ئازاری ناوخانەوە: 0808 2000 247', '👶 NSPCC: 0808 800 5000'],
      fa: ['🚨 999 — پلیس، آتش‌نشانی، آمبولانس (فقط تهدید حیاتی)', '🏥 111 — مشاوره پزشکی NHS (رایگان)', '👮 101 — موارد پلیسی غیراورژانسی', '⚖️ Legal Aid Agency: 0300 200 2020', '🤝 Migrant Help: 0808 8010 503 (رایگان، ۲۴/۷)', '💙 Samaritans: 116 123 (رایگان، ۲۴/۷)', '🏠 Shelter: 0808 800 4444', '💜 خط ملی خشونت خانگی: 0808 2000 247', '👶 NSPCC: 0808 800 5000'],
      ar: ['🚨 999 — الشرطة والإطفاء والإسعاف (للتهديدات الحياتية فقط)', '🏥 111 — مشورة طبية NHS (مجاني)', '👮 101 — شؤون الشرطة غير الطارئة', '⚖️ Legal Aid Agency: 0300 200 2020', '🤝 Migrant Help: 0808 8010 503 (مجاني، 24/7)', '💙 Samaritans: 116 123 (مجاني، 24/7)', '🏠 Shelter: 0808 800 4444', '💜 الخط الوطني للعنف المنزلي: 0808 2000 247', '👶 NSPCC: 0808 800 5000'],
    }
  },
  {
    id: 'rights', icon: '⚖️', color: '#6366F1',
    title: { en: 'Know Your Rights', ku: 'مافەکانت بناسە', fa: 'حقوقت را بشناس', ar: 'اعرف حقوقك' },
    points: {
      en: ['You CANNOT be deported while an appeal is active', 'You ALWAYS have the right to a free interpreter — demand it', 'Police cannot stop you based on race, religion or appearance alone', 'Your employer MUST pay minimum wage regardless of your status', 'A landlord CANNOT evict you without a proper court order', 'Domestic abuse victims can leave and still receive support', 'Reporting exploitation will NOT harm your asylum case', 'Children cannot be used as interpreters at medical or legal appointments'],
      ku: ['تاوەکو تژیاوکارییەکەت چالاک بێت ناتوانرێت دەربکرێیت', 'هەموو کاتێک مافت هەیە بۆ وەرگێڕی بەخۆڕایی', 'پۆلیس ناتوانێت تەنها بەهۆی ڕەگ یان ئایینتەوە بیوەستێنێتت', 'کارفەرمات دەبێت کەمترین مووچە پێبدات', 'خاوەن مالەکە ناتوانێت بەبێ بڕیاری دادگا دەربکاتت', 'قوربانیانی ئازاری ناوخانە دەتوانن دەربچن و هێشتا پشتگیری بگرن', 'ئاگادارکردنەوەی ئیستیسمار کێسی پەناکەت خراپ ناکات', 'منداڵان ناتوانرێن وەرگێڕ بن لە چاوپێکەوتنی یاسایی'],
      fa: ['در حالی که استیناف فعال است نمی‌توانی اخراج شوی', 'همیشه حق داری به مترجم رایگان', 'پلیس نمی‌تواند فقط بر اساس نژاد یا ظاهرت متوقفت کند', 'کارفرمایت باید حداقل دستمزد بپردازد', 'صاحبخانه نمی‌تواند بدون حکم دادگاه اخراجت کند', 'قربانیان خشونت خانگی می‌توانند بروند و همچنان حمایت دریافت کنند', 'گزارش استثمار به پرونده پناهندگی‌ات آسیب نمی‌رساند', 'نمی‌توان از کودکان به عنوان مترجم استفاده کرد'],
      ar: ['لا يمكن ترحيلك أثناء الاستئناف الناشط', 'لديك دائماً الحق في مترجم مجاني', 'لا يمكن للشرطة إيقافك بناءً على العرق أو الدين وحده', 'يجب أن يدفع لك صاحب العمل الحد الأدنى للأجر', 'لا يمكن للمالك إخلاءك دون أمر قضائي', 'يمكن لضحايا العنف الأسري المغادرة والحصول على دعم', 'الإبلاغ عن الاستغلال لن يضر بقضية لجوئك', 'لا يمكن استخدام الأطفال مترجمين في المواعيد القانونية'],
    }
  },
  {
    id: 'money', icon: '💰', color: '#10B981',
    title: { en: 'Money & Benefits', ku: 'پارە و یارمەتییەکان', fa: 'پول و مزایا', ar: 'المال والمزايا' },
    points: {
      en: ['Universal Credit: main benefit for working-age adults — apply at gov.uk/universal-credit', 'Child Benefit: £25.60/week for first child, £16.95 for each additional child', 'Free school meals for children if on low income', 'Council tax reduction — apply at your local council', 'Healthy Start vouchers if pregnant or have children under 4', 'Warm Home Discount: £150 off energy bills if on certain benefits', 'Free prescriptions if on Universal Credit or income support', 'Citizens Advice can check if you are claiming everything you are entitled to: 0800 144 8848'],
      ku: ['Universal Credit: یارمەتیی سەرەکی — داواکاری بکە لە gov.uk/universal-credit', 'یارمەتیی منداڵ: ٢٥.٦٠ پاوەند/هەفتانە بۆ منداڵی یەکەم', 'خواردنی بەخۆڕاییی قوتابخانە بۆ منداڵان ئەگەر داهاتی کەم بیت', 'کەمکردنەوەی باجی شار — لە شارداریی ناوچەکەتدا داواکاری بکە', 'کوپۆنەکانی Healthy Start ئەگەر دووگیانت یان منداڵی ژێر ٤ ساڵت هەیە', 'داشکاندنی مالی گەرم: ١٥٠ پاوەند کەمکردن لە ئەژمارەی وزەت', 'نووسخەی بەخۆڕایی ئەگەر Universal Credit وەردەگریت', 'Citizens Advice: 0800 144 8848'],
      fa: ['Universal Credit: مزیت اصلی — در gov.uk/universal-credit درخواست بده', 'کمک هزینه کودک: ۲۵.۶۰ پوند/هفته برای فرزند اول', 'وعده غذایی رایگان مدرسه برای کودکان اگر درآمد پایینی داری', 'کاهش مالیات شورا — در شورای محلی‌ات درخواست بده', 'کوپن‌های Healthy Start اگر باردار هستی', 'تخفیف گرمایش خانه: ۱۵۰ پوند تخفیف', 'نسخه‌های رایگان اگر Universal Credit دریافت می‌کنی', 'Citizens Advice: 0800 144 8848'],
      ar: ['Universal Credit: المزيا الرئيسية — تقدم على gov.uk/universal-credit', 'إعانة الطفل: 25.60 جنيهاً/أسبوعاً للطفل الأول', 'وجبات مدرسية مجانية للأطفال إذا كان دخلك منخفضاً', 'تخفيض ضريبة المجلس — تقدم في مجلسك المحلي', 'قسائم Healthy Start إذا كنت حاملاً', 'خصم المنزل الدافئ: 150 جنيهاً خصم', 'وصفات مجانية إذا كنت تتلقى Universal Credit', 'Citizens Advice: 0800 144 8848'],
    }
  },
]

const TX = {
  en: { myStage: '📍 My Stage', infoHelp: '📋 Info & Help', ask: '❓ Ask', reberTitle: 'Rêber', reberSub: 'Your step-by-step guide from arrival to citizenship', selectStage: 'Where are you in your journey?', askTitle: 'Ask a Question', askSub: 'Ask anything about life in the UK. Bawan will answer personally.', askPlaceholder: 'Type your question here…', askBtn: 'Submit Question', askSuccess: 'Your question has been submitted!', awaitingAnswer: 'Awaiting answer…', answeredBy: 'Answered by Bawan', upvote: 'Helpful', questions: 'Questions', noQuestions: 'No questions yet — be the first to ask!', back: '← Back' },
  ku: { myStage: '📍 قۆناغەکەم', infoHelp: '📋 زانیاری و یارمەتی', ask: '❓ پرسیار', reberTitle: 'ڕێبەر', reberSub: 'ڕێنمای هەنگاو بە هەنگاوت لە گەیشتن تا هاووڵاتیبوون', selectStage: 'لە کوێیت لە گەشتەکەتدا؟', askTitle: 'پرسیار بکە', askSub: 'هەر شتێک بپرسە دەربارەی ژیان لە UK. باوان بە خۆی وەڵام دەداتەوە.', askPlaceholder: 'پرسیارەکەت ئێرە بنووسە…', askBtn: 'پرسیار بنێرە', askSuccess: 'پرسیارەکەت نێردرا!', awaitingAnswer: 'چاوەڕوانی وەڵامە…', answeredBy: 'وەڵامدراوەتەوە لەلایەن باوان', upvote: 'یارمەتیدەر', questions: 'پرسیارەکان', noQuestions: 'هێشتا هیچ پرسیارێک نییە — یەکەمین بە!', back: '→ گەڕانەوە' },
  fa: { myStage: '📍 مرحله من', infoHelp: '📋 اطلاعات و کمک', ask: '❓ سوال', reberTitle: 'ڕێبەر', reberSub: 'راهنمای گام به گام از ورود تا شهروندی', selectStage: 'در کجای سفرت هستی؟', askTitle: 'سوال بپرس', askSub: 'هر چیزی درباره زندگی در UK بپرس. باوان شخصاً پاسخ می‌دهد.', askPlaceholder: 'سوالت را اینجا بنویس…', askBtn: 'ارسال سوال', askSuccess: 'سوالت ارسال شد!', awaitingAnswer: 'در انتظار پاسخ…', answeredBy: 'پاسخ داده شده توسط باوان', upvote: 'مفید', questions: 'سوالات', noQuestions: 'هنوز سوالی نیست — اولین نفر باش!', back: '→ بازگشت' },
  ar: { myStage: '📍 مرحلتي', infoHelp: '📋 معلومات ومساعدة', ask: '❓ اسأل', reberTitle: 'ڕێبەر', reberSub: 'دليلك خطوة بخطوة من الوصول إلى الجنسية', selectStage: 'أين أنت في رحلتك؟', askTitle: 'اطرح سؤالاً', askSub: 'اسأل أي شيء عن الحياة في المملكة المتحدة. سيجيب باوان شخصياً.', askPlaceholder: 'اكتب سؤالك هنا…', askBtn: 'إرسال السؤال', askSuccess: 'تم إرسال سؤالك!', awaitingAnswer: 'في انتظار الإجابة…', answeredBy: 'أجاب عليه باوان', upvote: 'مفيد', questions: 'الأسئلة', noQuestions: 'لا توجد أسئلة بعد — كن الأول!', back: '→ رجوع' },
}

function SectionCard({ section, lang, color }) {
  const [open, setOpen] = useState(false)
  const isRTL = lang === 'ku' || lang === 'fa' || lang === 'ar'
  return (
    <div onClick={() => setOpen(!open)} style={{ background: '#fff', borderRadius: 16, marginBottom: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', cursor: 'pointer', border: `1.5px solid ${open ? color : 'transparent'}`, transition: 'border 0.2s' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px' }}>
        <span style={{ fontSize: 26, flexShrink: 0 }}>{section.icon}</span>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 15, color: INDIGO_DARK, flex: 1, textAlign: isRTL ? 'right' : 'left' }}>{section.title[lang] || section.title.en}</span>
        <span style={{ fontSize: 18, color, transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>›</span>
      </div>
      {open && (
        <div style={{ borderTop: `2px solid ${color}20`, padding: '4px 16px 16px' }}>
          {(section.points[lang] || section.points.en).map((point, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 10, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <span style={{ color, fontWeight: 900, fontSize: 16, flexShrink: 0, marginTop: 1 }}>•</span>
              <span style={{ fontFamily: FONT, fontSize: 14, color: '#333', lineHeight: 1.6, textAlign: isRTL ? 'right' : 'left' }}>{point}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function InfoCard({ section, lang }) {
  const [open, setOpen] = useState(false)
  const isRTL = lang === 'ku' || lang === 'fa' || lang === 'ar'
  return (
    <div onClick={() => setOpen(!open)} style={{ background: '#fff', borderRadius: 16, marginBottom: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', cursor: 'pointer', border: `1.5px solid ${open ? section.color : 'transparent'}`, transition: 'border 0.2s' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px' }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${section.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{section.icon}</div>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 15, color: INDIGO_DARK, flex: 1, textAlign: isRTL ? 'right' : 'left' }}>{section.title[lang] || section.title.en}</span>
        <span style={{ fontSize: 18, color: section.color, transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>›</span>
      </div>
      {open && (
        <div style={{ borderTop: `2px solid ${section.color}20`, padding: '4px 16px 16px' }}>
          {(section.points[lang] || section.points.en).map((point, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 10, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <span style={{ color: section.color, fontWeight: 900, fontSize: 16, flexShrink: 0, marginTop: 1 }}>•</span>
              <span style={{ fontFamily: FONT, fontSize: 14, color: '#333', lineHeight: 1.6, textAlign: isRTL ? 'right' : 'left' }}>{point}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

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
  const isRTL = lang === 'ku' || lang === 'fa' || lang === 'ar'

  useEffect(() => {
    const saved = localStorage.getItem('komek_lang')
    if (saved) setLang(saved)
    fetchQuestions()
    checkAdmin()
    const voted = JSON.parse(localStorage.getItem('reber_upvoted') || '{}')
    setUpvoted(voted)
  }, [])

  const checkAdmin = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user?.email === ADMIN_EMAIL) setIsAdmin(true)
  }

  const fetchQuestions = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('questions').select('*').order('upvotes', { ascending: false })
    setQuestions(data || [])
  }

  const handleSubmitQuestion = async () => {
    if (!newQuestion.trim()) return
    setSubmitting(true)
    const supabase = createClient()
    await supabase.from('questions').insert({ question: newQuestion.trim() })
    setNewQuestion('')
    setSubmitted(true)
    setSubmitting(false)
    fetchQuestions()
    setTimeout(() => setSubmitted(false), 4000)
  }

  const handleUpvote = async (question) => {
    if (upvoted[question.id]) return
    const supabase = createClient()
    await supabase.from('questions').update({ upvotes: (question.upvotes || 0) + 1 }).eq('id', question.id)
    const newVoted = { ...upvoted, [question.id]: true }
    setUpvoted(newVoted)
    localStorage.setItem('reber_upvoted', JSON.stringify(newVoted))
    fetchQuestions()
  }

  const handleAdminAnswer = async (questionId) => {
    const answer = adminAnswer[questionId]
    if (!answer?.trim()) return
    const supabase = createClient()
    await supabase.from('questions').update({ answer: answer.trim(), status: 'answered', answered_at: new Date().toISOString() }).eq('id', questionId)
    setAdminAnswer(prev => ({ ...prev, [questionId]: '' }))
    fetchQuestions()
  }

  const stageContent = activeStage ? STAGE_CONTENT[activeStage] : null

  return (
    <div style={{ minHeight: '100vh', background: '#F5F4FF', fontFamily: FONT, direction: 'ltr', paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${INDIGO_DARK} 0%, #2d2b6b 100%)`, padding: '16px 16px 0', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <button onClick={() => activeStage ? setActiveStage(null) : router.push('/home')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 22, cursor: 'pointer', padding: 0, flexShrink: 0 }}>←</button>

          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>🧭 {t.reberTitle}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{t.reberSub}</div>
          </div>

          <LangDropdown lang={lang} onChange={setLang} />
        </div>

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
              borderBottom: activeTab === tab.id ? `3px solid ${MINT}` : '3px solid transparent',
              transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* MY STAGE TAB */}
      {activeTab === 'stage' && !activeStage && (
        <div style={{ padding: '24px 16px' }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: INDIGO_DARK, marginBottom: 20, textAlign: 'center' }}>{t.selectStage}</p>
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

      {/* STAGE DETAIL */}
      {activeTab === 'stage' && activeStage && stageContent && (
        <div style={{ padding: '16px 16px 32px' }}>
          <div style={{ background: `linear-gradient(135deg, ${stageContent.color} 0%, ${stageContent.color}CC 100%)`, borderRadius: 20, padding: '20px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -20, right: -20, fontSize: 90, opacity: 0.1 }}>
              {STAGES.find(s => s.id === activeStage)?.emoji}
            </div>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{STAGES.find(s => s.id === activeStage)?.emoji}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 6, textAlign: isRTL ? 'right' : 'left' }}>{stageContent.title[lang] || stageContent.title.en}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, textAlign: isRTL ? 'right' : 'left' }}>{stageContent.subtitle[lang] || stageContent.subtitle.en}</div>
          </div>
          {stageContent.sections.map((section, i) => (
            <SectionCard key={i} section={section} lang={lang} color={stageContent.color} />
          ))}
        </div>
      )}

      {/* INFO & HELP TAB */}
      {activeTab === 'info' && (
        <div style={{ padding: '16px 16px 32px' }}>
          {INFO_SECTIONS.map((section, i) => (
            <InfoCard key={i} section={section} lang={lang} />
          ))}
        </div>
      )}

      {/* ASK TAB */}
      {activeTab === 'ask' && (
        <div style={{ padding: '16px 16px 32px' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '20px', marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: INDIGO_DARK, marginBottom: 6, textAlign: isRTL ? 'right' : 'left' }}>❓ {t.askTitle}</div>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 16, lineHeight: 1.5, textAlign: isRTL ? 'right' : 'left' }}>{t.askSub}</div>
            <textarea
              value={newQuestion}
              onChange={e => setNewQuestion(e.target.value)}
              placeholder={t.askPlaceholder}
              rows={3}
              style={{ width: '100%', padding: '12px 14px', border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: 12, fontSize: 14, fontFamily: FONT, outline: 'none', resize: 'vertical', lineHeight: 1.5, boxSizing: 'border-box', textAlign: isRTL ? 'right' : 'left' }}
            />
            {submitted && (
              <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: '10px 14px', marginTop: 10, color: '#166534', fontSize: 13, fontWeight: 600 }}>
                ✅ {t.askSuccess}
              </div>
            )}
            <button
              onClick={handleSubmitQuestion}
              disabled={submitting || !newQuestion.trim()}
              style={{ width: '100%', marginTop: 12, padding: '13px', background: newQuestion.trim() ? `linear-gradient(135deg, ${INDIGO}, #6366f1)` : '#e5e7eb', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, color: newQuestion.trim() ? '#fff' : '#9ca3af', cursor: newQuestion.trim() ? 'pointer' : 'default', fontFamily: FONT }}
            >
              {submitting ? '…' : t.askBtn}
            </button>
          </div>

          <div style={{ fontSize: 15, fontWeight: 800, color: INDIGO_DARK, marginBottom: 14, textAlign: isRTL ? 'right' : 'left' }}>💬 {t.questions}</div>
          {questions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#aaa', fontSize: 14 }}>{t.noQuestions}</div>
          ) : (
            questions.map(q => (
              <div key={q.id} style={{ background: '#fff', borderRadius: 16, padding: '16px', marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a', margin: '0 0 12px', lineHeight: 1.5, textAlign: isRTL ? 'right' : 'left' }}>{q.question}</p>
                {q.answer ? (
                  <div style={{ background: '#F0F9FF', borderRadius: 12, padding: '12px 14px', marginBottom: 12, borderLeft: `3px solid ${INDIGO_DARK}` }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: INDIGO_DARK, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5, textAlign: isRTL ? 'right' : 'left' }}>🧭 {t.answeredBy}</div>
                    <p style={{ fontSize: 14, color: '#1a1a1a', margin: 0, lineHeight: 1.6, textAlign: isRTL ? 'right' : 'left' }}>{q.answer}</p>
                  </div>
                ) : (
                  <div style={{ background: '#FFFBEB', borderRadius: 10, padding: '8px 12px', marginBottom: 12, display: 'inline-block' }}>
                    <span style={{ fontSize: 12, color: '#92400E', fontWeight: 600 }}>⏳ {t.awaitingAnswer}</span>
                  </div>
                )}
                {isAdmin && !q.answer && (
                  <div style={{ marginBottom: 12 }}>
                    <textarea
                      placeholder="Type your answer…"
                      value={adminAnswer[q.id] || ''}
                      onChange={e => setAdminAnswer(prev => ({ ...prev, [q.id]: e.target.value }))}
                      rows={2}
                      style={{ width: '100%', padding: '10px 12px', border: `1.5px solid rgba(28,26,79,0.2)`, borderRadius: 10, fontSize: 13, fontFamily: FONT, outline: 'none', resize: 'vertical', boxSizing: 'border-box', marginBottom: 6 }}
                    />
                    <button onClick={() => handleAdminAnswer(q.id)} style={{ padding: '8px 16px', background: INDIGO_DARK, border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: FONT }}>
                      Post Answer
                    </button>
                  </div>
                )}
                <button
                  onClick={() => handleUpvote(q)}
                  disabled={upvoted[q.id]}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: upvoted[q.id] ? '#EEF2FF' : '#f5f5f5', border: upvoted[q.id] ? `1px solid ${INDIGO}` : '1px solid rgba(0,0,0,0.08)', borderRadius: 20, cursor: upvoted[q.id] ? 'default' : 'pointer', fontFamily: FONT }}
                >
                  <span style={{ fontSize: 14 }}>👍</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: upvoted[q.id] ? INDIGO : '#666' }}>{q.upvotes || 0}</span>
                  <span style={{ fontSize: 11, color: upvoted[q.id] ? INDIGO : '#888' }}>{t.upvote}</span>
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}