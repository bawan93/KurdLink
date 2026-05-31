"use client";
import { useState, useEffect } from "react";

const NAVY = "#1A2B5F";
const ORANGE = "#FF6B35";

const STAGES = [
  { id: "arrived", emoji: "🛬", color: "#3B82F6", light: "#EFF6FF", label: { en: "Arrived", ku: "گەیشتوویت", fa: "رسیدی", ar: "وصلت" } },
  { id: "waiting", emoji: "⏳", color: "#F59E0B", light: "#FFFBEB", label: { en: "Waiting", ku: "چاوەڕوانی", fa: "انتظار", ar: "انتظار" } },
  { id: "granted", emoji: "✅", color: "#10B981", light: "#ECFDF5", label: { en: "Granted", ku: "مافت درا", fa: "تأیید شد", ar: "مُنح" } },
  { id: "refused", emoji: "❌", color: "#EF4444", light: "#FEF2F2", label: { en: "Refused", ku: "ڕەتکرایەوە", fa: "رد شد", ar: "رُفض" } },
  { id: "settled", emoji: "🏡", color: "#8B5CF6", light: "#F5F3FF", label: { en: "Settled", ku: "جێگیرکراوە", fa: "مستقر شدی", ar: "استقررت" } },
  { id: "citizen", emoji: "🇬🇧", color: "#F59E0B", light: "#FFFBEB", label: { en: "Citizen", ku: "هاووڵاتی", fa: "شهروند", ar: "مواطن" } },
];

const LANGS = [
  { id: "en", label: "EN", dir: "ltr" },
  { id: "ku", label: "کوردی", dir: "rtl" },
  { id: "fa", label: "فارسی", dir: "rtl" },
  { id: "ar", label: "عربي", dir: "rtl" },
];

const CONTENT = {
  arrived: {
    title: { en: "You've Just Arrived", ku: "تازە گەیشتووتە بەریتانیا", fa: "تازه وارد شدی", ar: "لقد وصلت للتو" },
    subtitle: { en: "You landed. Here's what happens next.", ku: "گەیشتیت. ئەمەیە کە دواتر ڕوودەدات.", fa: "فرود آمدی. اینجاست که بعد چه اتفاقی می‌افتد.", ar: "لقد هبطت. هذا ما سيحدث بعد ذلك." },
    color: "#3B82F6",
    cards: [
      { icon: "⏰", title: { en: "First 24 Hours", ku: "یەکەم ٢٤ کاتژمێر", fa: "۲۴ ساعت اول", ar: "أول ٢٤ ساعة" }, points: { en: ["Report to the Home Office immediately", "Do not destroy any documents", "Tell them you want to claim asylum", "Ask for an interpreter — it is your right", "Keep your phone charged and with you"], ku: ["یەکسەر ڕاپۆرت بدە بۆ هۆم ئۆفیس", "هیچ بەلگەیەک لەناوبەری مەبە", "بڵێ دەتەوێت داواکاری ئامادەیی بکەیت", "داوای وەرگێڕی بکە — مافی توە", "مۆبایلەکەت شارژ و لەگەلت بێت"], fa: ["فوری به Home Office گزارش بده", "هیچ مدرکی را از بین نبر", "بگو می‌خواهی درخواست پناهندگی کنی", "مترجم بخواه — این حق توست", "گوشی‌ات را شارژ نگه‌دار"], ar: ["أبلغ وزارة الداخلية فوراً", "لا تتلف أي وثائق", "قل إنك تريد طلب اللجوء", "اطلب مترجماً — هذا حقك", "اجعل هاتفك مشحوناً معك"] } },
      { icon: "🪪", title: { en: "Your ARC Card", ku: "کارتی ARC ی تۆ", fa: "کارت ARC تو", ar: "بطاقة ARC الخاصة بك" }, points: { en: ["ARC = Application Registration Card", "This is your ID while your case is open", "Keep it safe — carry it everywhere", "It proves you are an asylum seeker", "Lost it? Report immediately"], ku: ["ARC = کارتی تۆمارکردنی داواکاری", "ئەمە ناسنامەی تۆیە لەکاتی کردنەوەی کێسەکەت", "بیپارێزە — هەموو شوێنێک بیبە", "ئەمە دەخاتەوە ئەتۆ داواکاری ئامادەیی کردووتە", "وەرت چووە؟ یەکسەر ڕاپۆرت بدە"], fa: ["ARC = کارت ثبت درخواست", "این هویت توست در حالی که پرونده‌ات باز است", "آن را حفظ کن — همه جا با خودت ببر", "ثابت می‌کند که پناهنده هستی", "گم شد؟ فوری گزارش بده"], ar: ["ARC = بطاقة تسجيل الطلب", "هذه هويتك أثناء فتح قضيتك", "احتفظ بها — احملها في كل مكان", "تثبت أنك طالب لجوء", "فقدتها؟ أبلغ فوراً"] } },
      { icon: "🏠", title: { en: "Section 98 Housing", ku: "مالی بەشی ٩٨", fa: "مسکن بخش ۹۸", ar: "إسكان المادة ٩٨" }, points: { en: ["Emergency housing while your case starts", "You may be placed anywhere in the UK", "It may be a hostel or shared house", "You cannot choose the location", "Do not refuse it — you may lose support"], ku: ["مالی فووری لەکاتی دەستپێکردنی کێسەکەت", "لەگەڵ ئەوەی دەتنێرن هەر شوێنێکی UK", "لەگەڵ ئەوەی خانووی هاوبەشە یان خانووچە", "ناتوانیت شوێنەکە هەڵبژێریت", "ڕەتیمەکەوە — لەگەڵ ئەوەی یارمەتیت دەبڕدرێتەوە"], fa: ["مسکن اضطراری در شروع پرونده‌ات", "ممکن است هر جایی در UK باشی", "ممکن است خوابگاه یا خانه مشترک باشد", "نمی‌توانی محل را انتخاب کنی", "رد نکن — ممکن است حمایتت قطع شود"], ar: ["إسكان طارئ أثناء بدء قضيتك", "قد تُوضع في أي مكان في المملكة المتحدة", "قد يكون نُزلاً أو منزلاً مشتركاً", "لا يمكنك اختيار الموقع", "لا ترفضه — قد تفقد الدعم"] } },
      { icon: "⚠️", title: { en: "What NOT To Do", ku: "چی نەکەی", fa: "چه کاری نکنی", ar: "ما يجب ألا تفعله" }, points: { en: ["Do NOT work until you have permission", "Do NOT travel outside the UK", "Do NOT miss any reporting appointments", "Do NOT move without telling Home Office", "Do NOT sign anything you don't understand"], ku: ["کارمەکە تا مۆڵەتت نەدراوە", "گەرانەوە دەرەوەی UK مەکە", "هیچ کاتی ڕاپۆرتدانت لەدەستمەدە", "بەبێ ئاگادارکردنەوەی هۆم ئۆفیس جێمەگۆڕیت", "هیچ شتێک مەئیمزابکە کە تێناگەیتت"], fa: ["تا مجوز نداری کار نکن", "از UK خارج نشو", "هیچ وقت سر قرار گزارش‌دهی نرو", "بدون اطلاع دادن به Home Office جابجا نشو", "چیزی که نمی‌فهمی امضا نکن"], ar: ["لا تعمل حتى تحصل على إذن", "لا تسافر خارج المملكة المتحدة", "لا تفوت أي مواعيد الإبلاغ", "لا تنتقل دون إخبار وزارة الداخلية", "لا توقع على أي شيء لا تفهمه"] } },
      { icon: "⚖️", title: { en: "Your Rights From Day One", ku: "مافەکانت لە ڕۆژی یەکەم", fa: "حقوق تو از روز اول", ar: "حقوقك من اليوم الأول" }, points: { en: ["Right to free legal representation", "Right to a free interpreter always", "Right to emergency NHS healthcare", "Right to education for your children", "Right to report abuse or crime safely"], ku: ["مافی نوێنەری یاسایی بەخۆڕایی", "مافی وەرگێڕی بەخۆڕایی هەموو کاتێک", "مافی چارەسەری NHS ی فووری بەخۆڕایی", "مافی خوێندن بۆ منداڵەکانت", "مافی ڕاپۆرتدانی ئازارو تاوان بە ئارامی"], fa: ["حق داشتن وکیل رایگان", "حق داشتن مترجم رایگان همیشه", "حق مراقبت اضطراری رایگان NHS", "حق تحصیل برای فرزندانت", "حق گزارش دادن آزار یا جرم به صورت ایمن"], ar: ["حق التمثيل القانوني المجاني", "حق الحصول على مترجم مجاني دائماً", "حق الرعاية الصحية الطارئة المجانية", "حق التعليم لأطفالك", "حق الإبلاغ عن الإساءة أو الجريمة بأمان"] } },
    ]
  },
  waiting: {
    title: { en: "While You Wait", ku: "لەکاتی چاوەڕوانی", fa: "در حین انتظار", ar: "أثناء الانتظار" },
    subtitle: { en: "Your case is being decided. Here's what you can and can't do.", ku: "کێسەکەت بڕیاردەدرێت. ئەمەیە کە دەتوانیت و ناتوانیت بیکەیت.", fa: "پرونده‌ات در حال بررسی است. اینجا آنچه می‌توانی و نمی‌توانی انجام دهی.", ar: "يجري البت في قضيتك. هذا ما يمكنك وما لا يمكنك فعله." },
    color: "#F59E0B",
    cards: [
      { icon: "💰", title: { en: "What You're Entitled To", ku: "چیت مافی هەیە", fa: "چه حقوقی داری", ar: "ما تستحقه" }, points: { en: ["Section 95 support — around £49/week", "Free NHS healthcare for you and family", "Free school for your children", "Free legal aid for your case", "Free interpreter at all official appointments"], ku: ["پشتگیری بەشی ٩٥ — نزیکەی ٤٩ پاوەند هەفتانە", "چارەسەری NHS ی بەخۆڕایی بۆ تۆ و خێزانت", "خوێندنی بەخۆڕایی بۆ منداڵەکانت", "یارمەتی یاسایی بەخۆڕایی بۆ کێسەکەت", "وەرگێڕی بەخۆڕایی لە هەموو کۆبوونەوەی فەرمی"], fa: ["کمک بخش ۹۵ — حدود ۴۹ پوند در هفته", "مراقبت بهداشتی رایگان NHS برای تو و خانواده‌ات", "مدرسه رایگان برای فرزندانت", "کمک حقوقی رایگان برای پرونده‌ات", "مترجم رایگان در همه قرارهای رسمی"], ar: ["دعم القسم 95 — حوالي 49 جنيهاً أسبوعياً", "الرعاية الصحية المجانية لك ولعائلتك", "مدرسة مجانية لأطفالك", "مساعدة قانونية مجانية لقضيتك", "مترجم مجاني في جميع المواعيد الرسمية"] } },
      { icon: "🎤", title: { en: "Your Asylum Interview", ku: "چاوپێکەوتنی ئامادەییت", fa: "مصاحبه پناهندگی تو", ar: "مقابلة اللجوء الخاصة بك" }, points: { en: ["This is the most important meeting of your case", "Tell the truth — every detail matters", "You MUST have a solicitor present", "Ask for breaks if you feel overwhelmed", "You can ask for same-gender interviewer", "Your solicitor can challenge unfair questions"], ku: ["ئەمە گرنگترین کۆبوونەوەی کێسەکەتە", "ڕاستەکە بڵێ — هەموو وردەکاری گرنگە", "دەبێت پارێزەرت لەگەڵت بێت", "داوای وەستان بکە ئەگەر سەختت بووە", "دەتوانیت داوای هەلگری هەمجنس بکەیت", "پارێزەرەکەت دەتوانێت پرسیاری نادادپەروەرانە بدەوە"], fa: ["این مهم‌ترین جلسه پرونده‌ات است", "حقیقت را بگو — هر جزئیاتی مهم است", "باید وکیل داشته باشی", "اگر احساس غرق شدن کردی استراحت بخواه", "می‌توانی مصاحبه‌گر هم‌جنس بخواهی", "وکیلت می‌تواند سوالات ناعادلانه را به چالش بکشد"], ar: ["هذا أهم اجتماع في قضيتك", "قل الحقيقة — كل تفصيل مهم", "يجب أن يكون محاميك حاضراً", "اطلب استراحات إذا شعرت بالإرهاق", "يمكنك طلب محاور من نفس جنسك", "يمكن لمحاميك الطعن في الأسئلة غير العادلة"] } },
      { icon: "🧠", title: { en: "Your Mental Health Matters", ku: "تەندروستیی دەروونیت گرنگە", fa: "سلامت روان تو مهم است", ar: "صحتك النفسية مهمة" }, points: { en: ["Feeling anxious, lost and scared is normal", "Talking helps — don't keep it inside", "Samaritans: 116 123 (free, 24/7)", "MIND: 0300 123 3393", "Shout: text 85258 (crisis support)", "Your GP can refer you for free counselling"], ku: ["نیگەرانی، وەرهەڵسان و ترسان ئادیییە", "قسەکردن یارمەتی دەدات — نیگهت بیگرێت", "Samaritans: 116 123 (بەخۆڕایی، ٢٤/٧)", "MIND: 0300 123 3393", "Shout: نامەی دەنووسی بۆ 85258 (پشتگیری کریز)", "دکتەرەکەت دەتوانێت بنێرێتت بۆ ڕاوێژکاری بەخۆڕایی"], fa: ["اضطراب، گم‌شدگی و ترس طبیعی است", "صحبت کمک می‌کند — درونت نگه‌دار نکن", "Samaritans: 116 123 (رایگان، ۲۴/۷)", "MIND: 0300 123 3393", "Shout: پیام به 85258 (پشتیبانی بحران)", "دکترت می‌تواند برای مشاوره رایگان ارجاع دهد"], ar: ["الشعور بالقلق والضياع والخوف أمر طبيعي", "الحديث يساعد — لا تحتفظ به بداخلك", "Samaritans: 116 123 (مجاني، 24/7)", "MIND: 0300 123 3393", "Shout: أرسل رسالة إلى 85258 (دعم الأزمات)", "يمكن لطبيبك إحالتك للإرشاد المجاني"] } },
    ]
  },
  granted: {
    title: { en: "You've Been Granted Status! 🎉", ku: "مافت دراوتە! 🎉", fa: "وضعیتت تأیید شد! 🎉", ar: "تم منحك الوضع! 🎉" },
    subtitle: { en: "Congratulations. Now here's your step-by-step checklist.", ku: "پیرۆزت بێت. ئێستا ئەمەیە تەختەی پێناساکانت.", fa: "تبریک. حالا اینجا چک‌لیست گام به گام توست.", ar: "تهانينا. الآن إليك قائمة التحقق خطوة بخطوة." },
    color: "#10B981",
    cards: [
      { icon: "1️⃣", title: { en: "Collect Your BRP Card", ku: "کارتی BRP ی خۆت وەرگرە", fa: "کارت BRP ات را بگیر", ar: "احصل على بطاقة BRP الخاصة بك" }, points: { en: ["BRP = Biometric Residence Permit", "You'll get a letter with Post Office location", "Collect within 10 days or it returns", "This is now your main ID document", "Check the dates on it are correct"], ku: ["BRP = مۆڵەتی نیشتەجێبوونی بایۆمەتری", "نامەیەک دەگریتت بە شوێنی ئۆفیسی پۆستی", "لە ناو ١٠ ڕۆژدا وەریگرە وەرنەگرابێت دەگەڕێتەوە", "ئەمە ئێستا بەلگەی ناسنامەی سەرەکیتە", "بپشکنە کە بەرواری لەسەرن دروستن"], fa: ["BRP = مجوز اقامت بیومتریک", "نامه‌ای با آدرس پست‌آفیس دریافت می‌کنی", "ظرف ۱۰ روز بگیر وگرنه برمی‌گردد", "این حالا مدرک هویت اصلی توست", "بررسی کن که تاریخ‌ها درست هستند"], ar: ["BRP = تصريح إقامة بيومتري", "ستتلقى رسالة بموقع مكتب البريد", "اجمعه خلال 10 أيام وإلا سيُعاد", "هذه الآن وثيقة هويتك الرئيسية", "تحقق من صحة التواريخ المدونة عليه"] } },
      { icon: "2️⃣", title: { en: "National Insurance Number", ku: "ژمارەی بیمەی نیشتمانی", fa: "شماره بیمه ملی", ar: "رقم التأمين الوطني" }, points: { en: ["Apply online at gov.uk/apply-national-insurance-number", "You need this to work and pay tax", "Usually takes 4-6 weeks to arrive", "Keep it secret — never share it", "You need BRP card to apply"], ku: ["داواکاری لەسەر ئینتەرنێت لە gov.uk/apply-national-insurance-number", "پێویستتە بۆ کارکردن و پارەدانی باج", "باشی ٤-٦ هەفتە دەبێت بگات", "نهێنی بیگرە — هەرگیز ماشێکی مەدە", "پێویستتە کارتی BRP بۆ داواکارییەکە"], fa: ["آنلاین درخواست بده در gov.uk/apply-national-insurance-number", "برای کار و پرداخت مالیات به آن نیاز داری", "معمولاً ۴-۶ هفته طول می‌کشد", "محرمانه نگه‌دار — هرگز به کسی نده", "برای درخواست به BRP نیاز داری"], ar: ["تقدم عبر الإنترنت على gov.uk/apply-national-insurance-number", "تحتاجه للعمل ودفع الضرائب", "عادة يستغرق 4-6 أسابيع للوصول", "اجعله سراً — لا تشاركه أبداً", "تحتاج بطاقة BRP للتقديم"] } },
      { icon: "3️⃣", title: { en: "Open a Bank Account", ku: "ئەکاونتی بانکی بکەرەوە", fa: "حساب بانکی باز کن", ar: "افتح حساباً مصرفياً" }, points: { en: ["Banks that accept BRP: Monzo, Starling, Halifax", "Monzo and Starling are easiest — app-based", "You need: BRP, proof of address, phone number", "Avoid: payday loans and illegal money transfers", "Universal Credit paid directly to bank account"], ku: ["بانکەکانی قبوولکردنی BRP: مۆنزۆ، ستارلینگ، هالیفاکس", "مۆنزۆ و ستارلینگ ئاسانترن — بنەرەتی ئەپ", "پێویستتە: BRP، بەلگەی ناونیشان، ژمارەی تەلەفۆن", "لێبوورنەوە: قەرزی ڕۆژانە و گواستنەوەی پارەی نایاسایی", "پارەی یونیڤەرسەل کرێدیت ڕاستەوخۆ دەدرێتە ئەکاونتی بانکی"], fa: ["بانک‌هایی که BRP قبول می‌کنند: Monzo، Starling، Halifax", "Monzo و Starling راحت‌ترند — اپ‌محور", "نیاز داری: BRP، مدرک آدرس، شماره تلفن", "از وام‌های روزانه و انتقال غیرقانونی پول بپرهیز", "Universal Credit مستقیم به حساب بانکی پرداخت می‌شود"], ar: ["البنوك التي تقبل BRP: Monzo وStarling وHalifax", "Monzo وStarling الأسهل — مبني على التطبيق", "تحتاج: BRP وإثبات العنوان ورقم الهاتف", "تجنب: قروض يوم الدفع والتحويلات غير القانونية", "يُدفع Universal Credit مباشرة في الحساب البنكي"] } },
      { icon: "4️⃣", title: { en: "Apply for Universal Credit", ku: "داواکاری یونیڤەرسەل کرێدیت", fa: "درخواست Universal Credit", ar: "تقدم للحصول على Universal Credit" }, points: { en: ["Apply at: gov.uk/universal-credit", "You need: bank account, NI number, BRP", "First payment takes 5 weeks", "Tell them about any savings or other income", "Free help applying: Citizens Advice 0800 144 8444"], ku: ["داواکاری لە: gov.uk/universal-credit", "پێویستتە: ئەکاونتی بانکی، ژمارەی NI، BRP", "یەکەم پارەدان ٥ هەفتە دەخایەنێت", "پێیان بڵێ دەربارەی هەر پاشەکەوتێک یان داهاتی دیکە", "یارمەتی بەخۆڕایی بۆ داواکارییەکە: Citizens Advice 0800 144 8444"], fa: ["درخواست در: gov.uk/universal-credit", "نیاز داری: حساب بانکی، شماره NI، BRP", "اولین پرداخت ۵ هفته طول می‌کشد", "در مورد هر پس‌اندازی یا درآمد دیگری بگو", "کمک رایگان برای درخواست: Citizens Advice 0800 144 8444"], ar: ["قدم في: gov.uk/universal-credit", "تحتاج: حساب بنكي ورقم NI وBRP", "يستغرق أول دفعة 5 أسابيع", "أخبرهم عن أي مدخرات أو دخل آخر", "مساعدة مجانية للتقديم: Citizens Advice 0800 144 8444"] } },
      { icon: "5️⃣", title: { en: "Driving Licence", ku: "مۆڵەتی شۆفێری", fa: "گواهینامه رانندگی", ar: "رخصة القيادة" }, points: { en: ["Apply for provisional licence at gov.uk/apply-first-provisional-driving-licence", "Cost: £34 online", "Need: BRP, passport photo, UK address", "Then book theory test: £23", "Then book practical test: £62", "Find a Kurdish driving instructor on KurdLink!"], ku: ["داواکاری مۆڵەتی پرۆڤیژنەل لە gov.uk/apply-first-provisional-driving-licence", "تێچوو: ٣٤ پاوەند ئۆنلاین", "پێویستتە: BRP، وێنەی پاسپۆرت، ناونیشانی UK", "دواتر تیۆری تێست جێگیربکە: ٢٣ پاوەند", "دواتر تێستی پراکتیکی جێگیربکە: ٦٢ پاوەند", "مامۆستای شۆفێری کوردی لە KurdLink بدۆزەرەوە!"], fa: ["در gov.uk/apply-first-provisional-driving-licence درخواست بده", "هزینه: ۳۴ پوند آنلاین", "نیاز داری: BRP، عکس پاسپورت، آدرس UK", "سپس تست نظری رزرو کن: ۲۳ پوند", "سپس تست عملی رزرو کن: ۶۲ پوند", "مربی رانندگی کرد را در KurdLink پیدا کن!"], ar: ["تقدم للحصول على رخصة مؤقتة في gov.uk/apply-first-provisional-driving-licence", "التكلفة: 34 جنيهاً عبر الإنترنت", "تحتاج: BRP وصورة جواز سفر وعنوان بريطاني", "ثم احجز اختبار النظري: 23 جنيهاً", "ثم احجز الاختبار العملي: 62 جنيهاً", "اعثر على مدرب قيادة كردي على KurdLink!"] } },
    ]
  },
  refused: {
    title: { en: "Your Case Was Refused", ku: "کێسەکەت ڕەتکرایەوە", fa: "پرونده‌ات رد شد", ar: "تم رفض قضيتك" },
    subtitle: { en: "Don't panic. You have rights and options. Act quickly.", ku: "نیگەران مەبە. مافت و ویستت هەیە. خێرا ڕەفتاربکە.", fa: "نگران نباش. حقوق و گزینه‌هایی داری. سریع اقدام کن.", ar: "لا تذعر. لديك حقوق وخيارات. تصرف بسرعة." },
    color: "#EF4444",
    cards: [
      { icon: "⏱️", title: { en: "You Have 14 Days to Appeal", ku: "١٤ ڕۆژت هەیە بۆ تژیاوەکردن", fa: "۱۴ روز برای تجدیدنظر داری", ar: "لديك 14 يوماً للاستئناف" }, points: { en: ["Read the refusal letter very carefully", "Do NOT ignore the deadline", "Contact your solicitor TODAY", "No solicitor? Call Legal Aid: 0300 200 2020", "You can usually stay in the UK during appeal", "Keep attending all reporting appointments"], ku: ["نامەی ڕەتکردنەوەکە بە وردی بخوێنەوە", "مۆهڵەتەکە نەبەستێت", "ئەمڕۆ پەیوەندی بە پارێزەرەکەت بکە", "پارێزەرت نییە؟ پەیوەندی بە Legal Aid بکە: 0300 200 2020", "باشی دەتوانیت لەکاتی تژیاوەکردن لە UK بمێنیتەوە", "هەموو کاتی ڕاپۆرتدانت بچو"], fa: ["نامه رد را خیلی دقیق بخوان", "از مهلت چشم‌پوشی نکن", "امروز با وکیلت تماس بگیر", "وکیل نداری؟ با Legal Aid تماس بگیر: 0300 200 2020", "معمولاً می‌توانی در حین تجدیدنظر در UK بمانی", "به همه قرارهای گزارش‌دهی برو"], ar: ["اقرأ رسالة الرفض بعناية شديدة", "لا تتجاهل الموعد النهائي", "تواصل مع محاميك اليوم", "لا محامي؟ اتصل بالمساعدة القانونية: 0300 200 2020", "يمكنك عادةً البقاء في المملكة المتحدة أثناء الاستئناف", "استمر في حضور جميع مواعيد الإبلاغ"] } },
      { icon: "🏛️", title: { en: "The Appeal Process", ku: "پرۆسەی تژیاوەکردن", fa: "فرایند تجدیدنظر", ar: "إجراءات الاستئناف" }, points: { en: ["Appeal goes to First-tier Tribunal (Immigration)", "A judge hears your case — not Home Office", "New evidence can be submitted", "Process takes 6-18 months typically", "If refused again: Upper Tribunal is next", "Judicial review is a final option"], ku: ["تژیاوەکردن دەچێتە دادگای تایبەتی یەکەم (کۆچبەری)", "دادوەرێک گوێی کێسەکەت دەگرێت — نەک هۆم ئۆفیس", "بەلگەی نوێ دەتوانرێت پێشکەش بکرێت", "پرۆسەکە باشی ٦-١٨ مانگ دەخایەنێت", "دووبارە ڕەتکرا: دادگای باڵاتر دواتری", "پشکنینی دادوەری ویستی کۆتاییە"], fa: ["تجدیدنظر به دادگاه درجه اول (مهاجرت) می‌رود", "یک قاضی به پرونده‌ات گوش می‌دهد — نه Home Office", "می‌توان مدارک جدید ارائه داد", "فرایند معمولاً ۶-۱۸ ماه طول می‌کشد", "دوباره رد شد: دادگاه عالی بعدی است", "بررسی قضایی آخرین گزینه است"], ar: ["يذهب الاستئناف إلى المحكمة الابتدائية (الهجرة)", "قاضٍ يستمع إلى قضيتك — لا وزارة الداخلية", "يمكن تقديم أدلة جديدة", "تستغرق العملية عادةً 6-18 شهراً", "رُفض مجدداً: المحكمة العليا هي التالية", "المراجعة القضائية هي الخيار الأخير"] } },
      { icon: "🤝", title: { en: "Organisations That Can Help Now", ku: "ڕێکخراوەکانی دەتوانن ئێستا یارمەتیت بدەن", fa: "سازمان‌هایی که الان می‌توانند کمک کنند", ar: "منظمات يمكنها المساعدة الآن" }, points: { en: ["Refugee Council: 020 7346 6700", "Asylum Aid: 020 7354 9631", "Migrant Help: 0808 8010 503 (free)", "UNHCR UK: unhcr.org/uk", "Citizens Advice: 0800 144 8848", "Housing support continues during appeal"], ku: ["شورای پەنابەر: 020 7346 6700", "Asylum Aid: 020 7354 9631", "Migrant Help: 0808 8010 503 (بەخۆڕایی)", "UNHCR UK: unhcr.org/uk", "Citizens Advice: 0800 144 8848", "پشتگیری مال لەکاتی تژیاوەکردن بەردەوامە"], fa: ["شورای پناهندگان: 020 7346 6700", "Asylum Aid: 020 7354 9631", "Migrant Help: 0808 8010 503 (رایگان)", "UNHCR UK: unhcr.org/uk", "Citizens Advice: 0800 144 8848", "حمایت مسکن در طول تجدیدنظر ادامه دارد"], ar: ["مجلس اللاجئين: 020 7346 6700", "Asylum Aid: 020 7354 9631", "Migrant Help: 0808 8010 503 (مجاني)", "UNHCR UK: unhcr.org/uk", "Citizens Advice: 0800 144 8848", "دعم الإسكان مستمر أثناء الاستئناف"] } },
    ]
  },
  settled: {
    title: { en: "Building Your Life in the UK", ku: "دروستکردنی ژیانت لە UK", fa: "ساختن زندگی‌ات در UK", ar: "بناء حياتك في المملكة المتحدة" },
    subtitle: { en: "You have status. Now let's build something great.", ku: "مافت هەیە. ئێستا با شتێکی جوان بنیادبنێین.", fa: "وضعیت داری. حالا بیا چیز عالی بسازیم.", ar: "لديك وضع. الآن لنبنِ شيئاً رائعاً." },
    color: "#8B5CF6",
    cards: [
      { icon: "💼", title: { en: "Your Right to Work", ku: "مافی کارکردنت", fa: "حق کار کردن تو", ar: "حقك في العمل" }, points: { en: ["You can work in almost any job", "Minimum wage: £11.44/hour (2024)", "Your employer CANNOT exploit you", "You pay National Insurance and tax", "Keep payslips — you'll need them for ILR", "Report exploitation: 0800 028 3838"], ku: ["دەتوانیت لە تقریبن هەر کارێک کاربکەیت", "کەمترین مووچە: ١١.٤٤ پاوەند/کاتژمێر (٢٠٢٤)", "کارفەرمای تۆ ناتوانێت بیکەشێنێتت", "بیمەی نیشتمانی و باج دەدەیت", "پارەدانەکانت بیگرەوە — پێویستتان دەبێت بۆ ILR", "ئاگادارکردنەوەی کیشەکەش: 0800 028 3838"], fa: ["تقریباً در هر شغلی می‌توانی کار کنی", "حداقل دستمزد: ۱۱.۴۴ پوند/ساعت (۲۰۲۴)", "کارفرمایت نمی‌تواند از تو بهره‌کشی کند", "بیمه ملی و مالیات می‌پردازی", "فیش حقوق نگه‌دار — برای ILR لازمشان داری", "گزارش بهره‌کشی: 0800 028 3838"], ar: ["يمكنك العمل في تقريباً أي وظيفة", "الحد الأدنى للأجر: 11.44 جنيهاً/ساعة (2024)", "لا يمكن لصاحب العمل استغلالك", "تدفع التأمين الوطني والضرائب", "احتفظ بكشوف الراتب — ستحتاجها لـ ILR", "الإبلاغ عن الاستغلال: 0800 028 3838"] } },
      { icon: "🏠", title: { en: "Finding a Home", ku: "دۆزینەوەی مال", fa: "پیدا کردن خانه", ar: "إيجاد منزل" }, points: { en: ["Apply for council housing at your local council", "Private renting: you'll need deposit + first month", "Rightmove and Zoopla for listings", "Landlord must give you a proper tenancy agreement", "You can report bad landlords to the council", "Housing benefit helps with rent costs"], ku: ["داواکاری مالی شاری لە شارداریی ناوچەکەت بکە", "کرێی تایبەتی: پێویستتە مەبەستی بدەیت + مانگی یەکەم", "رایتمووڤ و زووپلا بۆ لیستکردنەکان", "خاوەن مالەکە دەبێت پەیمانی کرێکاری دروست پێت بدات", "دەتوانیت خاوەنمالی خراپ بۆ شارداری ڕاپۆرت بکەیت", "یارمەتی مالی چاوپێکەوتن لەگەڵ تێچووی کرێ"], fa: ["در شورای محلی‌ات برای مسکن دولتی درخواست بده", "اجاره خصوصی: به ودیعه + ماه اول نیاز داری", "Rightmove و Zoopla برای آگهی‌ها", "صاحبخانه باید قرارداد اجاره‌ای درست به تو بدهد", "می‌توانی صاحبخانه‌های بد را به شورا گزارش دهی", "کمک هزینه مسکن با هزینه‌های اجاره کمک می‌کند"], ar: ["تقدم للإسكان البلدي في مجلسك المحلي", "الإيجار الخاص: ستحتاج وديعة + الشهر الأول", "Rightmove وZoopla للإعلانات", "يجب على المالك أن يعطيك عقد إيجار مناسباً", "يمكنك الإبلاغ عن الملاك السيئين للمجلس", "مساعدة الإسكان تساعد في تكاليف الإيجار"] } },
      { icon: "🌍", title: { en: "Family Reunification", ku: "یەکتربوونەوەی خێزان", fa: "اجتماع مجدد خانواده", ar: "لم شمل الأسرة" }, points: { en: ["Refugees can apply to bring immediate family", "Partner, children under 18 can join you", "Apply within 3 months of getting status for easier process", "Application fee: from £388 per person", "Contact Refugee Council for free help", "Process takes 6-12 months typically"], ku: ["پەنابەرەکان دەتوانن داواکاری بکەن بۆ هێنانی خێزانی نزیک", "هاوسەر، منداڵی ژێر ١٨ دەتوانن بێن پێشت", "داواکاری لە ناو ٣ مانگی گرتنی مافەکەت بکە بۆ پرۆسەیەکی ئاسانتر", "تێچووی داواکارییەکە: لە ٣٨٨ پاوەند بۆ هەر کەسێک", "پەیوەندی بە شورای پەنابەر بکە بۆ یارمەتیی بەخۆڕایی", "پرۆسەکە باشی ٦-١٢ مانگ دەخایەنێت"], fa: ["پناهندگان می‌توانند برای آوردن خانواده نزدیک درخواست دهند", "همسر، فرزندان زیر ۱۸ سال می‌توانند به تو بپیوندند", "ظرف ۳ ماه از گرفتن وضعیت درخواست بده برای فرایند آسان‌تر", "هزینه درخواست: از ۳۸۸ پوند به ازای هر نفر", "برای کمک رایگان با شورای پناهندگان تماس بگیر", "فرایند معمولاً ۶-۱۲ ماه طول می‌کشد"], ar: ["يمكن للاجئين التقدم لجلب أسرتهم المباشرة", "يمكن لشريك حياتك وأطفالك دون 18 الانضمام إليك", "تقدم خلال 3 أشهر من الحصول على الوضع لإجراء أسهل", "رسوم الطلب: من 388 جنيهاً لكل شخص", "تواصل مع مجلس اللاجئين للحصول على مساعدة مجانية", "تستغرق العملية عادةً 6-12 شهراً"] } },
    ]
  },
  citizen: {
    title: { en: "The Path to a British Passport", ku: "ڕێگای بەرەو پاسپۆرتی بەریتانی", fa: "مسیر به سمت پاسپورت بریتانیایی", ar: "الطريق إلى جواز السفر البريطاني" },
    subtitle: { en: "From refugee to British citizen. Here's the full journey.", ku: "لە پەنابەر بۆ هاووڵاتیی بەریتانی. ئەمەیە گشت گەشتەکە.", fa: "از پناهنده تا شهروند بریتانیایی. اینجا کل سفر است.", ar: "من لاجئ إلى مواطن بريطاني. هذه هي الرحلة الكاملة." },
    color: "#F59E0B",
    cards: [
      { icon: "📋", title: { en: "Step 1: Apply for ILR", ku: "هەنگاوی ١: داواکاری ILR", fa: "مرحله ۱: درخواست ILR", ar: "الخطوة 1: التقدم لـ ILR" }, points: { en: ["ILR = Indefinite Leave to Remain", "Eligible after 5 years of lawful residence", "Application fee: £2,885", "Need to pass Life in the UK test first", "Need to meet English language requirement", "Criminal record will affect eligibility"], ku: ["ILR = مۆڵەتی مانەوەی نەمانچاو", "کارێز دەبیت دوای ٥ ساڵی نیشتەجێبوونی یاسایی", "تێچووی داواکارییەکە: ٢،٨٨٥ پاوەند", "پێویستە پێش ئەوە تێستی ژیانی UK ی تێپەڕ بکەیت", "پێویستە مەرجی زمانی ئینگلیزی پێشکەش بکەیت", "تۆمەری تاوان ئەگەری واجببوونت کاریگەر دەبێت"], fa: ["ILR = اقامت نامحدود", "بعد از ۵ سال اقامت قانونی واجد شرایط هستی", "هزینه درخواست: ۲،۸۸۵ پوند", "باید ابتدا تست زندگی در UK را بگذری", "باید شرط زبان انگلیسی را برآورده کنی", "سابقه کیفری روی واجد شرایط بودن تأثیر می‌گذارد"], ar: ["ILR = إقامة غير محددة المدة", "مؤهل بعد 5 سنوات من الإقامة القانونية", "رسوم الطلب: 2,885 جنيهاً", "يجب اجتياز اختبار الحياة في المملكة المتحدة أولاً", "يجب استيفاء متطلبات اللغة الإنجليزية", "السجل الجنائي سيؤثر على الأهلية"] } },
      { icon: "📖", title: { en: "Life in the UK Test", ku: "تێستی ژیان لە UK", fa: "تست زندگی در UK", ar: "اختبار الحياة في المملكة المتحدة" }, points: { en: ["24 questions, 45 minutes, £50 fee", "Must score 75% or higher to pass", "Covers: British history, culture, law, values", "Official study book: £14.99 on Amazon", "Free practice tests at lifeintheuktest.gov.uk", "Can retake if failed — no limit"], ku: ["٢٤ پرسیار، ٤٥ خولەک، ٥٠ پاوەند تێچوو", "دەبێت ٧٥٪ یان زیاتر بگری بۆ تێپەڕین", "داپۆشراوی: مێژووی بەریتانیا، کولتوور، یاسا، بەهاکان", "کتێبی خوێندنی فەرمی: ١٤.٩٩ پاوەند لە ئەمەزۆن", "تێستی چاكسازی بەخۆڕایی لە lifeintheuktest.gov.uk", "دەتوانیت دووبارە بپشکنیت ئەگەر لەکارت هات — سنور نییە"], fa: ["۲۴ سوال، ۴۵ دقیقه، ۵۰ پوند هزینه", "باید ۷۵٪ یا بیشتر بگیری تا قبول شوی", "شامل: تاریخ بریتانیا، فرهنگ، قانون، ارزش‌ها", "کتاب مطالعاتی رسمی: ۱۴.۹۹ پوند در آمازون", "تست‌های تمرینی رایگان در lifeintheuktest.gov.uk", "اگر شکست خوردی می‌توانی دوباره امتحان بدهی — بدون محدودیت"], ar: ["24 سؤالاً، 45 دقيقة، رسوم 50 جنيهاً", "يجب الحصول على 75% أو أعلى للنجاح", "يغطي: التاريخ البريطاني والثقافة والقانون والقيم", "كتاب الدراسة الرسمي: 14.99 جنيهاً على أمازون", "اختبارات تدريبية مجانية على lifeintheuktest.gov.uk", "يمكن إعادته إذا رسبت — لا حد"] } },
      { icon: "🎉", title: { en: "Citizenship & Your Passport", ku: "هاووڵاتیبوون و پاسپۆرتەکەت", fa: "شهروندی و پاسپورتت", ar: "الجنسية وجواز سفرك" }, points: { en: ["Apply for citizenship: gov.uk/apply-citizenship-indefinite-leave-to-remain", "Fee: £1,330 + £19.20 ceremony fee", "Citizenship ceremony — you take an oath", "After ceremony: apply for British passport", "Passport costs £82.50 (adult)", "Dual nationality: depends on your home country"], ku: ["داواکاری هاووڵاتیبوون: gov.uk/apply-citizenship-indefinite-leave-to-remain", "تێچوو: ١،٣٣٠ پاوەند + ١٩.٢٠ پاوەند تێچووی مراسم", "مراسمی هاووڵاتیبوون — سوێند دەخوریت", "دوای مراسمەکە: داواکاری پاسپۆرتی بەریتانی بکە", "پاسپۆرت ٨٢.٥٠ پاوەند تێدەچێت (گەورەسال)", "ناوەندی دوو نەتەوەیی: پشت بەستە بە وڵاتی ماڵت"], fa: ["درخواست شهروندی: gov.uk/apply-citizenship-indefinite-leave-to-remain", "هزینه: ۱،۳۳۰ پوند + ۱۹.۲۰ پوند هزینه مراسم", "مراسم شهروندی — سوگند می‌خوری", "بعد از مراسم: درخواست پاسپورت بریتانیایی بده", "پاسپورت ۸۲.۵۰ پوند هزینه دارد (بزرگسال)", "تابعیت مضاعف: بستگی به کشور مادری‌ات دارد"], ar: ["تقدم للحصول على الجنسية: gov.uk/apply-citizenship-indefinite-leave-to-remain", "الرسوم: 1,330 جنيهاً + 19.20 جنيهاً رسوم الحفل", "حفل الجنسية — تؤدي قسماً", "بعد الحفل: تقدم للحصول على جواز السفر البريطاني", "تكلفة جواز السفر 82.50 جنيهاً (بالغ)", "الجنسية المزدوجة: تعتمد على بلدك الأصلي"] } },
    ]
  }
};

const STANDALONE = [
  {
    id: "health", icon: "🏥", color: "#EC4899",
    title: { en: "Health", ku: "تەندروستی", fa: "سلامت", ar: "الصحة" },
    cards: [
      { icon: "🩺", title: { en: "Register with a GP", ku: "تۆمارکردن لەگەڵ GP", fa: "ثبت‌نام با GP", ar: "التسجيل لدى طبيب عام" }, points: { en: ["Find your nearest GP at nhs.uk/find-a-gp", "You don't need ID or immigration documents", "Register by filling in a GMS1 form", "They cannot refuse you because of your status", "Ask for a Kurdish/Sorani interpreter", "GP is free — never pay a GP for basic care"], ku: ["نزیکترین GP ی خۆت بدۆزەرەوە لە nhs.uk/find-a-gp", "پێویستت بە ناسنامە یان بەلگەی کۆچبەری نییە", "تۆمارکردن بە پڕکردنەوەی فۆرمی GMS1", "ناتوانن بەهۆی مافیتەوە ڕەتت بکەنەوە", "داوای وەرگێڕی کوردی/سۆرانی بکە", "GP بەخۆڕایییە — هەرگیز بۆ چارەسەری بنچینەیی پارە مەدەیت"], fa: ["نزدیک‌ترین GP را در nhs.uk/find-a-gp پیدا کن", "به مدرک هویت یا مدارک مهاجرتی نیاز نداری", "با پر کردن فرم GMS1 ثبت‌نام کن", "نمی‌توانند به خاطر وضعیتت رد کنند", "مترجم کردی/سورانی بخواه", "GP رایگان است — هرگز برای مراقبت اولیه پول نپرداز"], ar: ["اعثر على أقرب طبيب عام لك على nhs.uk/find-a-gp", "لا تحتاج إلى هوية أو وثائق هجرة", "سجل بملء نموذج GMS1", "لا يمكنهم رفضك بسبب وضعك", "اطلب مترجماً كردياً/سورانياً", "الطبيب العام مجاني — لا تدفع أبداً لرعاية أساسية"] } },
      { icon: "🚑", title: { en: "999 vs 111 vs GP", ku: "999 دژ بە 111 دژ بە GP", fa: "999 در مقابل 111 در مقابل GP", ar: "999 مقابل 111 مقابل الطبيب العام" }, points: { en: ["999: Life-threatening emergency ONLY", "111: Medical help when not life-threatening (free)", "GP: Regular health issues, prescriptions, referrals", "A&E: Serious injury or illness, open 24/7", "Walk-in centres: Minor issues, no appointment needed", "Interpreter available at all — just ask"], ku: ["999: تەنها کریزی مەترسیدار بۆ ژیان", "111: یارمەتیی تەندروستی کاتێک مەترسیدار بۆ ژیان نییە (بەخۆڕایی)", "GP: کێشەی تەندروستیی ئادی، نووسخەکان، شێوازدانەکان", "A&E: ئەفتانی گیران یان نەخۆشی گیران، کراوەیە ٢٤/٧", "ناوەندی چووپێکردن: کێشەی بچووک، پێویستی بە چاودێری نییە", "وەرگێڕ لە هەموویاندا بەردەستە — تەنها داوایی بکە"], fa: ["999: فقط اورژانس تهدیدکننده حیات", "111: کمک پزشکی وقتی تهدید حیاتی نیست (رایگان)", "GP: مشکلات بهداشتی معمولی، نسخه‌ها، ارجاعات", "اورژانس: آسیب یا بیماری جدی، ۲۴/۷ باز است", "کلینیک‌های بدون نوبت: مشکلات جزئی، بدون وقت قبلی", "مترجم در همه جا موجود است — فقط بخواه"], ar: ["999: حالات الطوارئ المهددة للحياة فقط", "111: مساعدة طبية عندما لا تكون مهددة للحياة (مجاني)", "الطبيب العام: مشاكل صحية منتظمة والوصفات والإحالات", "الطوارئ: إصابة أو مرض خطير، مفتوح 24/7", "عيادات المشي: مشاكل بسيطة، لا تحديد موعد", "المترجم متاح في كل مكان — فقط اطلب"] } },
    ]
  },
  {
    id: "education", icon: "🎓", color: "#06B6D4",
    title: { en: "Education", ku: "خوێندن", fa: "آموزش", ar: "التعليم" },
    cards: [
      { icon: "🏫", title: { en: "Enrolling Children in School", ku: "تۆمارکردنی منداڵ لە قوتابخانە", fa: "ثبت‌نام فرزندان در مدرسه", ar: "تسجيل الأطفال في المدرسة" }, points: { en: ["All children 5-16 must be in school by law", "Contact your local council to find a school place", "Schools cannot refuse based on immigration status", "Free school meals if on asylum support", "EAL support (English as Additional Language) available", "Uniform grants available — ask the school"], ku: ["هەموو منداڵی ٥-١٦ بە یاسا دەبێت لە قوتابخانە بن", "پەیوەندی بە شارداریی ناوچەکەت بکە بۆ دۆزینەوەی شوێنی قوتابخانە", "قوتابخانەکان نازانن بنا بە مافی کۆچبەری ڕەت بکەنەوە", "خواردنی بەخۆڕایی ئەگەر لەسەر پشتگیری ئامادەییت بیت", "پشتگیری EAL (ئینگلیزی وەک زمانی زیادە) بەردەستە", "بەخشینی یونیفۆرم بەردەستە — لە قوتابخانەکە بیپرسە"], fa: ["همه کودکان ۵-۱۶ ساله باید طبق قانون در مدرسه باشند", "با شورای محلی‌ات تماس بگیر تا جای مدرسه پیدا کنی", "مدارس نمی‌توانند بر اساس وضعیت مهاجرتی رد کنند", "وعده غذایی رایگان اگر در حمایت پناهندگی هستی", "حمایت EAL (انگلیسی به عنوان زبان دوم) موجود است", "کمک هزینه یونیفورم موجود است — از مدرسه بپرس"], ar: ["يجب أن يكون جميع الأطفال 5-16 في المدرسة بموجب القانون", "تواصل مع مجلسك المحلي للعثور على مكان في المدرسة", "لا يمكن للمدارس الرفض بناءً على وضع الهجرة", "وجبات مدرسية مجانية إذا كنت تتلقى دعم اللجوء", "دعم EAL (الإنجليزية كلغة إضافية) متاح", "منح الزي المدرسي متاحة — اسأل المدرسة"] } },
      { icon: "📚", title: { en: "Free English (ESOL) Classes", ku: "پۆلی ئینگلیزی بەخۆڕایی (ESOL)", fa: "کلاس‌های رایگان انگلیسی (ESOL)", ar: "دروس الإنجليزية المجانية (ESOL)" }, points: { en: ["ESOL = English for Speakers of Other Languages", "Find classes at your local college or library", "Usually free if on benefits or asylum support", "Levels from complete beginner to advanced", "Some classes offer childcare during lessons", "Search: esol.org.uk or ask your local council"], ku: ["ESOL = ئینگلیزی بۆ قسەکەرانی زمانەکانی دیکە", "پۆلەکان بدۆزەرەوە لە کۆلێجی ناوچەکەت یان کتێبخانەکە", "باشی بەخۆڕایییە ئەگەر لەسەر یارمەتی یان پشتگیری ئامادەییت بیت", "ئاستەکان لە تازەکارە بۆ پیشکەوتوو", "هەندێ پۆل لەکاتی درس چاوداری منداڵ پێشکەش دەکەن", "گەڕان: esol.org.uk یان لە شارداریی ناوچەکەتدا بیپرسە"], fa: ["ESOL = انگلیسی برای گویشوران زبان‌های دیگر", "کلاس‌ها را در کالج یا کتابخانه محلی‌ات پیدا کن", "معمولاً رایگان است اگر یارانه دریافت می‌کنی یا در حمایت پناهندگی هستی", "سطوح از مبتدی کامل تا پیشرفته", "بعضی کلاس‌ها در طول درس مراقبت از کودک ارائه می‌دهند", "جستجو: esol.org.uk یا از شورای محلی‌ات بپرس"], ar: ["ESOL = الإنجليزية للناطقين بلغات أخرى", "اعثر على الفصول في كليتك المحلية أو المكتبة", "عادةً مجاني إذا كنت تتلقى إعانات أو دعم اللجوء", "مستويات من مبتدئ تام إلى متقدم", "بعض الفصول تقدم رعاية الأطفال أثناء الدروس", "بحث: esol.org.uk أو اسأل مجلسك المحلي"] } },
    ]
  },
  {
    id: "emergency", icon: "🆘", color: "#EF4444",
    title: { en: "Emergency Contacts", ku: "ژمارەکانی کریز", fa: "اورژانس", ar: "جهات الطوارئ" },
    cards: [
      { icon: "📞", title: { en: "Key Numbers — Save These Now", ku: "ژمارە گرنگەکان — ئێستا پاشەکەوتی بکە", fa: "شماره‌های کلیدی — همین الان ذخیره کن", ar: "الأرقام الرئيسية — احفظها الآن" }, points: { en: ["🚨 999 — Police/Fire/Ambulance (emergency)", "🏥 111 — NHS medical advice (non-emergency)", "👮 101 — Non-emergency police", "⚖️ Legal Aid: 0300 200 2020", "🤝 Migrant Help: 0808 8010 503 (free)", "💙 Samaritans: 116 123 (mental health, 24/7)", "🏠 Shelter (housing crisis): 0808 800 4444", "💜 National DV Helpline: 0808 2000 247"], ku: ["🚨 999 — پۆلیس/ئاگرکوژێنەوە/ئەمبولانس (کریز)", "🏥 111 — ڕاوێژی تەندروستیی NHS (نە کریز)", "👮 101 — پۆلیسی نەکریز", "⚖️ Legal Aid: 0300 200 2020", "🤝 Migrant Help: 0808 8010 503 (بەخۆڕایی)", "💙 Samaritans: 116 123 (تەندروستیی دەروونی، ٢٤/٧)", "🏠 Shelter (کریزی مال): 0808 800 4444", "💜 هێڵی ئەنجامدانی ناوخانەوەی نیشتمانی: 0808 2000 247"], fa: ["🚨 999 — پلیس/آتش‌نشانی/آمبولانس (اورژانس)", "🏥 111 — مشاوره پزشکی NHS (غیراورژانسی)", "👮 101 — پلیس غیراورژانسی", "⚖️ Legal Aid: 0300 200 2020", "🤝 Migrant Help: 0808 8010 503 (رایگان)", "💙 Samaritans: 116 123 (سلامت روان، ۲۴/۷)", "🏠 Shelter (بحران مسکن): 0808 800 4444", "💜 خط ملی خشونت خانگی: 0808 2000 247"], ar: ["🚨 999 — الشرطة/الإطفاء/الإسعاف (طوارئ)", "🏥 111 — مشورة طبية NHS (غير طارئة)", "👮 101 — شرطة غير الطوارئ", "⚖️ Legal Aid: 0300 200 2020", "🤝 Migrant Help: 0808 8010 503 (مجاني)", "💙 Samaritans: 116 123 (الصحة النفسية، 24/7)", "🏠 Shelter (أزمة السكن): 0808 800 4444", "💜 الخط الوطني للعنف المنزلي: 0808 2000 247"] } },
    ]
  },
  {
    id: "rights", icon: "⚖️", color: "#6366F1",
    title: { en: "Know Your Rights", ku: "مافەکانت بناسە", fa: "حقوقت را بشناس", ar: "اعرف حقوقك" },
    cards: [
      { icon: "🛡️", title: { en: "Rights You Always Have", ku: "مافەکانی ئەوانەی هەموو کاتێک هەیت", fa: "حقوقی که همیشه داری", ar: "الحقوق التي تمتلكها دائماً" }, points: { en: ["You cannot be deported while your appeal is active", "You always have the right to a free interpreter", "Police cannot stop you based on race or appearance", "Your employer MUST pay you minimum wage", "Landlord CANNOT evict you without a court order", "Domestic abuse victims can leave and still get support", "Reporting exploitation will NOT hurt your case", "You can report a hate crime safely: 0800 138 1625"], ku: ["ناتوانرێیت دیپۆرت بکرێیت لەکاتی چالاکبوونی تژیاوەکردنت", "هەموو کاتێک مافت هەیە بۆ وەرگێڕی بەخۆڕایی", "پۆلیس ناتوانێت لەسەر بنچینەی ڕەگ یان دیمەنت بیوەستێنێتت", "کارفەرمای تۆ دەبێت کەمترین مووچەت پێبدات", "خاوەن مالەکە ناتوانێت بەبێ فەرمانی دادگا دەربکاتت", "قوربانیانی ئازاری ناوخانە دەتوانن بچنە دەرەوە و هێشتا پشتگیری بگرن", "ئاگادارکردنەوەی ئیستیسمار کێسەکەت خراپ ناکات", "دەتوانیت کریمی ڕقەبەرانە بە ئارامی ڕاپۆرت بکەیت: 0800 138 1625"], fa: ["در حالی که استیناف فعال است نمی‌توانی اخراج شوی", "همیشه حق داری به مترجم رایگان", "پلیس نمی‌تواند بر اساس نژاد یا ظاهر متوقفت کند", "کارفرمایت باید حداقل دستمزد را به تو بپردازد", "صاحبخانه نمی‌تواند بدون دستور دادگاه اخراجت کند", "قربانیان خشونت خانگی می‌توانند برون و هنوز حمایت بگیرند", "گزارش استثمار به پرونده‌ات آسیب نمی‌رساند", "می‌توانی جرم نفرت‌آمیز را با خیال راحت گزارش دهی: 0800 138 1625"], ar: ["لا يمكن ترحيلك أثناء الاستئناف الناشط", "دائماً لديك الحق في مترجم مجاني", "لا يمكن للشرطة إيقافك بناءً على العرق أو المظهر", "يجب أن يدفع لك صاحب العمل الحد الأدنى للأجر", "لا يمكن للمالك إخلاءك دون أمر قضائي", "يمكن لضحايا العنف الأسري المغادرة والحصول على دعم", "الإبلاغ عن الاستغلال لن يضر بقضيتك", "يمكنك الإبلاغ عن جريمة كراهية بأمان: 0800 138 1625"] } },
    ]
  },
  {
    id: "money", icon: "💰", color: "#10B981",
    title: { en: "Money & Benefits", ku: "پارە و یارمەتییەکان", fa: "پول و مزایا", ar: "المال والمزايا" },
    cards: [
      { icon: "💳", title: { en: "Benefits You May Be Entitled To", ku: "یارمەتییەکانی دەتوانن مافت هەبێت", fa: "مزایایی که ممکن است واجد شرایط باشی", ar: "المزايا التي قد تكون مستحقاً لها" }, points: { en: ["Universal Credit — main benefit for working-age adults", "Child Benefit — for each child under 16", "Free school meals — if on low income", "Council tax reduction — apply at your council", "Healthy Start vouchers — if pregnant or have young children", "Warm Home Discount — help with heating bills"], ku: ["یونیڤەرسەل کرێدیت — یارمەتیی سەرەکی بۆ گەورەسالانی تەمەنی کارکردن", "یارمەتیی منداڵ — بۆ هەر منداڵێکی ژێر ١٦", "خواردنی قوتابخانەی بەخۆڕایی — ئەگەر داهاتی کەم بیت", "کەمکردنەوەی باجی شار — لە شارداریتدا داواکاری بکە", "بەرگەی Healthy Start — ئەگەر دووگیانت یان منداڵی بچووکت هەیە", "داشکاندنی مالی گەرم — یارمەتی لەگەڵ ئەژمارەکانی گەرمکردنەوە"], fa: ["Universal Credit — مزیت اصلی برای بزرگسالان در سن کار", "کمک هزینه کودک — برای هر کودک زیر ۱۶ سال", "وعده غذایی رایگان مدرسه — اگر درآمد کم داری", "کاهش مالیات شورا — در شورایت درخواست بده", "کوپن‌های Healthy Start — اگر باردار هستی یا کودک خردسال داری", "تخفیف گرمایش خانه — کمک با قبض‌های گرمایش"], ar: ["Universal Credit — المزيا الرئيسية لبالغي سن العمل", "إعانة الطفل — لكل طفل دون 16 سنة", "وجبات مدرسية مجانية — إذا كان دخلك منخفضاً", "تخفيض ضريبة المجلس — تقدم في مجلسك", "قسائم Healthy Start — إذا كنت حاملاً أو لديك أطفال صغار", "خصم المنزل الدافئ — مساعدة في فواتير التدفئة"] } },
    ]
  },
];

function InfoCard({ card, lang, stageColor }) {
  const [open, setOpen] = useState(false);
  const isRtl = lang !== "en";
  return (
    <div onClick={() => setOpen(!open)} style={{ background: "#fff", borderRadius: 16, marginBottom: 12, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", cursor: "pointer", border: `1.5px solid ${open ? stageColor : "transparent"}`, transition: "border 0.2s" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", direction: isRtl ? "rtl" : "ltr" }}>
        <span style={{ fontSize: 24, flexShrink: 0 }}>{card.icon}</span>
        <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 15, color: NAVY, flex: 1 }}>{card.title[lang] || card.title.en}</span>
        <span style={{ fontSize: 18, color: stageColor, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>›</span>
      </div>
      {open && (
        <div style={{ borderTop: `2px solid ${stageColor}20`, padding: "12px 16px 16px", direction: isRtl ? "rtl" : "ltr" }}>
          {(card.points[lang] || card.points.en).map((point, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
              <span style={{ color: stageColor, fontWeight: 900, fontSize: 16, flexShrink: 0, marginTop: 1 }}>•</span>
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: "#444", lineHeight: 1.6 }}>{point}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function JourneyPage() {
  const [lang, setLang] = useState("en");
  const [activeStage, setActiveStage] = useState("arrived");

  useEffect(() => {
    const saved = localStorage.getItem('kurdlink_lang')
    if (saved) setLang(saved)
  }, [])
  const [activeTab, setActiveTab] = useState("journey");
  const [activeStandalone, setActiveStandalone] = useState("health");
  const isRtl = lang !== "en";
  const stage = STAGES.find(s => s.id === activeStage);
  const content = CONTENT[activeStage];
  const standaloneSection = STANDALONE.find(s => s.id === activeStandalone);

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4FF", fontFamily: "'Plus Jakarta Sans', sans-serif", direction: isRtl ? "rtl" : "ltr" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #2D4A9E 100%)`, padding: "20px 16px 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: -0.5 }}>
              {lang === "en" && "Your Guide"}
              {lang === "ku" && "ڕێنماکەت"}
              {lang === "fa" && "راهنمای تو"}
              {lang === "ar" && "دليلك"}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>KurdLink</div>
          </div>
          {/* Language Toggle */}
          <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.1)", borderRadius: 20, padding: 4 }}>
            {LANGS.map(l => (
              <button key={l.id} onClick={() => setLang(l.id)} style={{ padding: "5px 10px", borderRadius: 16, border: "none", background: lang === l.id ? "#fff" : "transparent", color: lang === l.id ? NAVY : "rgba(255,255,255,0.8)", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "all 0.2s" }}>
                {l.label}
              </button>
            ))}
          </div>
        </div>
        {/* Journey / Info Tabs */}
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setActiveTab("journey")} style={{ flex: 1, padding: "10px 0", borderRadius: 12, border: "none", background: activeTab === "journey" ? ORANGE : "rgba(255,255,255,0.12)", color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {lang === "en" ? "📍 My Stage" : lang === "ku" ? "📍 قۆناغەکەم" : lang === "fa" ? "📍 مرحله من" : "📍 مرحلتي"}
          </button>
          <button onClick={() => setActiveTab("info")} style={{ flex: 1, padding: "10px 0", borderRadius: 12, border: "none", background: activeTab === "info" ? ORANGE : "rgba(255,255,255,0.12)", color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {lang === "en" ? "📋 Info & Help" : lang === "ku" ? "📋 زانیاری و یارمەتی" : lang === "fa" ? "📋 اطلاعات و کمک" : "📋 معلومات ومساعدة"}
          </button>
        </div>
      </div>

      {activeTab === "journey" && (
        <>
          {/* Stage Selector */}
          <div style={{ overflowX: "auto", padding: "16px 16px 8px", scrollbarWidth: "none" }}>
            <div style={{ display: "flex", gap: 8, minWidth: "max-content" }}>
              {STAGES.map(s => (
                <button key={s.id} onClick={() => setActiveStage(s.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "10px 14px", borderRadius: 16, border: `2px solid ${activeStage === s.id ? s.color : "transparent"}`, background: activeStage === s.id ? `${s.color}15` : "#fff", cursor: "pointer", minWidth: 70, boxShadow: activeStage === s.id ? `0 4px 16px ${s.color}30` : "0 1px 4px rgba(0,0,0,0.06)", transition: "all 0.2s" }}>
                  <span style={{ fontSize: 22 }}>{s.emoji}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: activeStage === s.id ? s.color : "#888", whiteSpace: "nowrap", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.label[lang] || s.label.en}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stage Content */}
          <div style={{ padding: "8px 16px 32px" }}>
            {/* Stage Hero */}
            <div style={{ background: `linear-gradient(135deg, ${stage.color} 0%, ${stage.color}CC 100%)`, borderRadius: 20, padding: "20px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -20, right: isRtl ? "auto" : -20, left: isRtl ? -20 : "auto", fontSize: 80, opacity: 0.15 }}>{stage.emoji}</div>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{stage.emoji}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 6, lineHeight: 1.2 }}>{content.title[lang] || content.title.en}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>{content.subtitle[lang] || content.subtitle.en}</div>
            </div>

            {/* Cards */}
            {content.cards.map((card, i) => (
              <InfoCard key={i} card={card} lang={lang} stageColor={stage.color} />
            ))}
          </div>
        </>
      )}

      {activeTab === "info" && (
        <>
          {/* Standalone Section Tabs */}
          <div style={{ overflowX: "auto", padding: "16px 16px 8px", scrollbarWidth: "none" }}>
            <div style={{ display: "flex", gap: 8, minWidth: "max-content" }}>
              {STANDALONE.map(s => (
                <button key={s.id} onClick={() => setActiveStandalone(s.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "10px 14px", borderRadius: 16, border: `2px solid ${activeStandalone === s.id ? s.color : "transparent"}`, background: activeStandalone === s.id ? `${s.color}15` : "#fff", cursor: "pointer", minWidth: 70, boxShadow: activeStandalone === s.id ? `0 4px 16px ${s.color}30` : "0 1px 4px rgba(0,0,0,0.06)", transition: "all 0.2s" }}>
                  <span style={{ fontSize: 22 }}>{s.icon}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: activeStandalone === s.id ? s.color : "#888", whiteSpace: "nowrap", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.title[lang] || s.title.en}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Standalone Content */}
          <div style={{ padding: "8px 16px 32px" }}>
            <div style={{ background: `linear-gradient(135deg, ${standaloneSection.color} 0%, ${standaloneSection.color}CC 100%)`, borderRadius: 20, padding: "20px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -20, right: isRtl ? "auto" : -20, left: isRtl ? -20 : "auto", fontSize: 80, opacity: 0.15 }}>{standaloneSection.icon}</div>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{standaloneSection.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>{standaloneSection.title[lang] || standaloneSection.title.en}</div>
            </div>
            {standaloneSection.cards.map((card, i) => (
              <InfoCard key={i} card={card} lang={lang} stageColor={standaloneSection.color} />
            ))}
          </div>
        </>
      )}
    </div>
 