'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const INDIGO = '#4F46E5'
const INDIGO_DARK = '#1C1A4F'
const INDIGO_LIGHT = '#818CF8'
const MINT = '#34D399'
const SOFT = '#EDE9FE'
const BG = '#F5F4FF'
const FONT = "'Nunito', sans-serif"

const TX = {
  en: {
    heroTitle: "Your Journey in the UK",
    heroSub: "A step-by-step guide from arrival to citizenship — in your language, at your pace.",
    quizTitle: "Not sure where you are?",
    quizSub: "Answer 3 quick questions and we'll find your stage.",
    startQuiz: "Find My Stage",
    allStages: "All Stages",
    letterBanner: "Got a letter from the Home Office?",
    letterCta: "Explain it free",
    back: "← Back",
    payAttention: "Pay close attention to this section",
    deadlineCalc: "Deadline Calculator",
    enterGrantDate: "Enter the date on your grant letter:",
    yourDeadline: "Your deadline:",
    daysRemaining: "days remaining",
    deadlinePassed: "Your deadline has passed — get legal advice immediately",
    stages: [
      { step: "Stage 1", title: "Just Arrived", badge: "Start here", badgeColor: MINT, desc: "You've just arrived in the UK and don't know what happens next.", preview: ["What happens when you first arrive", "Where they will put you", "What to do in your first week"], cta: "View Stage 1", route: "/reber/new-to-uk" },
      { step: "Stage 2", title: "Asylum Seeker", badge: "Most common", badgeColor: INDIGO_LIGHT, desc: "Your asylum claim is being processed and you are waiting for a decision.", preview: ["Your asylum interview", "Your rights while waiting", "If they say no to your claim"], cta: "View Stage 2", route: "/reber/new-to-uk" },
      { step: "Stage 3", title: "Got Leave to Remain", badge: "Act quickly", badgeColor: "#F59E0B", desc: "You have been granted refugee status. Now you need to secure your future.", preview: ["42-day deadline calculator", "Biometric Residence Permit", "How to become a British citizen"], cta: "View Stage 3", route: "/reber/leave-to-remain" },
    ],
    quiz: [
      { q: "When did you arrive in the UK?", options: ["In the last few weeks", "A few months ago", "More than a year ago"] },
      { q: "Have you had your asylum interview yet?", options: ["No, not yet", "Yes, I have had it", "I do not have an asylum claim"] },
      { q: "Have you received a decision on your case?", options: ["No, still waiting", "Yes — I was granted status", "Yes — I was refused"] },
    ],
    quizResult: ["You are at Stage 1 — Just Arrived", "You are at Stage 2 — Asylum Seeker", "You are at Stage 3 — Leave to Remain"],
    goToStage: "Go to my stage →",
    retake: "Retake quiz",
  },

  ku: {
    heroTitle: "گەشتەکەت لە بەریتانیا",
    heroSub: "ڕێنمایی هەنگاو بە هەنگاو لە گەیشتن تا هاووڵاتیبوون — بە زمانی خۆت.",
    quizTitle: "دڵنیا نیت لە کوێیت؟",
    quizSub: "وەڵامی 3 پرسیاری خێرا بدەرەوە و قۆناغەکەت دەدۆزینەوە.",
    startQuiz: "قۆناغی من بدۆزەرەوە",
    allStages: "هەموو قۆناغەکان",
    letterBanner: "نامەیەکت لە هۆم ئۆفیس وەرگرتووە؟",
    letterCta: "بەخۆڕایی ڕوونی بکەرەوە",
    back: "← گەڕانەوە",
    payAttention: "گرنگییەکی زۆر بەم بەشە بدە",
    deadlineCalc: "حاسیبەی وادەی کۆتایی",
    enterGrantDate: "کەی نامەی یارمەتییەکەت وەرگرتووە؟",
    yourDeadline: "دوا وادەت:",
    daysRemaining: "ڕۆژەکانی ماوە",
    deadlinePassed: "وادەت تێپەڕیوە — دەستبەجێ ئامۆژگاری یاسایی وەربگرە",
    stages: [
      { step: "قۆناغی یەکەم", title: "تۆ تازە گەیشتووی؟", badge: "لێرەوە دەست پێ بکە", badgeColor: MINT, desc: "تازە گەیشتووی بە بەریتانیا و هەنگاوەکانی داهاتوو نازانیت.", preview: ["چی ڕوودەدات کاتێک تۆ تازە گەیشتووی؟", "لە کوێ نیشتەجێ دەکرێیت", "لیستی پشکنینی هەفتەی یەکەم"], cta: "بینینی قۆناغی یەکەم", route: "/reber/new-to-uk" },
      { step: "قۆناغی دووەم", title: "پەناخواز", badge: "زۆرترین باو", badgeColor: INDIGO_LIGHT, desc: "داواکاری مافی پەنابەریت جێبەجێ دەکرێت و چاوەڕێی بڕیار دەکەیت.", preview: ["چاوپێکەوتنی پەنابەریت", "مافەکانت لەکاتی چاوەڕوانیدا", "ئەگەر داواکارییەکەت ڕەتکرایەوە"], cta: "بینینی قۆناغی دووەم", route: "/reber/new-to-uk" },
      { step: "قۆناغی سێیەم", title: "مۆڵەت بۆ مانەوە وەرگرتووە", badge: "خێرا مامەڵە بکە", badgeColor: "#F59E0B", desc: "پێگەی پەنابەریت پێدراوە. ئێستا پێویستە داهاتووت مسۆگەر بکەیت.", preview: ["42 ڕۆژ حیساب بکە", "مۆڵەتی مانەوەی بایۆمەتری", "ڕێگای هاوڵاتیبوون"], cta: "بینینی قۆناغی سێیەم", route: "/reber/leave-to-remain" },
    ],
    quiz: [
      { q: "کەی گەیشتیتە بەریتانیا؟", options: ["لە چەند هەفتەی ڕابردوودا", "چەند مانگێک لەمەوبەر", "زیاتر لە ساڵێک لەمەوبەر"] },
      { q: "تا ئێستا چاوپێکەوتنی پەنابەریت ئەنجامداوە؟", options: ["نەخێر، هێشتا چاوەڕێم", "بەڵێ، چاوپێکەوتنەکەم ئەنجامداوە", "من داوای پەنابەریم نەکردووە"] },
      { q: "ئایا بڕیارت لەسەر کەیسەکەت وەرگرتووە؟", options: ["نەخێر، هێشتا چاوەڕێم", "بەڵێ — کەیسەکەم وەرگیرا", "بەڵێ — دۆسیەکەم ڕەتکرایەوە"] },
    ],
    quizResult: ["تۆ لە قۆناغی یەکەمدایت — تازە گەیشتووی", "تۆ لە قۆناغی دووەمدایت — پەناخواز", "تۆ لە قۆناغی سێیەمدایت — مۆڵەت بۆ مانەوە"],
    goToStage: "بڕۆ بۆ قۆناغی من ←",
    retake: "دووبارە ئەنجامدانی کویزەکە",
  },

  fa: {
    heroTitle: "مسیر تو در بریتانیا",
    heroSub: "راهنمای گام به گام از ورود تا شهروندی — به زبانت، با سرعت خودت.",
    quizTitle: "مطمئن نیستی کجا هستی؟",
    quizSub: "۳ سوال کوتاه را جواب بده تا مرحله‌ات را پیدا کنیم.",
    startQuiz: "مرحله‌ام را پیدا کن",
    allStages: "همه مراحل",
    letterBanner: "نامه‌ای از Home Office داری؟",
    letterCta: "رایگان توضیح بده",
    back: "← برگشت",
    payAttention: "به این بخش دقت کن",
    deadlineCalc: "ماشین‌حساب مهلت",
    enterGrantDate: "تاریخ نامه تأیید را وارد کن:",
    yourDeadline: "مهلت تو:",
    daysRemaining: "روز باقی مانده",
    deadlinePassed: "مهلت گذشته — فوری مشاوره حقوقی بگیر",
    stages: [
      { step: "مرحله ۱", title: "تازه رسیدی", badge: "از اینجا شروع کن", badgeColor: MINT, desc: "تازه به بریتانیا رسیدی و نمی‌دانی چه اتفاقی می‌افتد.", preview: ["چه اتفاقی در مرز می‌افتد", "کجا اسکان می‌یابی", "چک‌لیست هفته اول"], cta: "مرحله ۱ را ببین", route: "/reber/new-to-uk" },
      { step: "مرحله ۲", title: "پناهجو", badge: "رایج‌ترین", badgeColor: INDIGO_LIGHT, desc: "درخواستت در حال بررسی است. منتظر تصمیم هستی.", preview: ["مصاحبه پناهندگی‌ات", "حقوقت در انتظار", "اگر رد شدی"], cta: "مرحله ۲ را ببین", route: "/reber/new-to-uk" },
      { step: "مرحله ۳", title: "اجازه اقامت گرفتی", badge: "سریع اقدام کن", badgeColor: "#F59E0B", desc: "وضعیتت تأیید شده. الان باید آینده‌ات را تضمین کنی.", preview: ["ماشین‌حساب مهلت ۴۲ روزه", "کارت اقامت بیومتریک", "مسیر شهروندی"], cta: "مرحله ۳ را ببین", route: "/reber/leave-to-remain" },
    ],
    quiz: [
      { q: "کی به بریتانیا رسیدی؟", options: ["چند هفته پیش", "چند ماه پیش", "بیش از یک سال پیش"] },
      { q: "مصاحبه پناهندگی داشتی؟", options: ["نه، هنوز نه", "بله، داشتم", "درخواست پناهندگی ندارم"] },
      { q: "تصمیمی درباره پرونده‌ات گرفته شده؟", options: ["نه، هنوز منتظرم", "بله — وضعیتم تأیید شد", "بله — رد شدم"] },
    ],
    quizResult: ["در مرحله ۱ هستی — تازه رسیدی", "در مرحله ۲ هستی — پناهجو", "در مرحله ۳ هستی — اجازه اقامت"],
    goToStage: "برو به مرحله‌ام ←",
    retake: "دوباره امتحان کن",
  },

  ar: {
    heroTitle: "رحلتك في المملكة المتحدة",
    heroSub: "دليل خطوة بخطوة من الوصول إلى الجنسية — بلغتك، بسرعتك.",
    quizTitle: "لست متأكداً أين أنت؟",
    quizSub: "أجب على ٣ أسئلة سريعة ونجد مرحلتك.",
    startQuiz: "اعثر على مرحلتي",
    allStages: "كل المراحل",
    letterBanner: "لديك رسالة من Home Office؟",
    letterCta: "اشرحها مجاناً",
    back: "← رجوع",
    payAttention: "انتبه جيداً لهذا القسم",
    deadlineCalc: "حاسبة الموعد النهائي",
    enterGrantDate: "أدخل تاريخ رسالة المنح:",
    yourDeadline: "موعدك النهائي:",
    daysRemaining: "يوماً متبقياً",
    deadlinePassed: "انتهى الموعد النهائي — اطلب مشورة قانونية فوراً",
    stages: [
      { step: "المرحلة ١", title: "وصلت للتو", badge: "ابدأ من هنا", badgeColor: MINT, desc: "وصلت للتو إلى المملكة المتحدة ولا تعرف ماذا سيحدث بعد ذلك.", preview: ["ما يحدث عند الحدود", "أين ستقيم", "قائمة التحقق للأسبوع الأول"], cta: "عرض المرحلة ١", route: "/reber/new-to-uk" },
      { step: "المرحلة ٢", title: "طالب لجوء", badge: "الأكثر شيوعاً", badgeColor: INDIGO_LIGHT, desc: "طلبك قيد المعالجة. أنت تنتظر قراراً.", preview: ["مقابلة اللجوء", "حقوقك أثناء الانتظار", "إذا رُفض طلبك"], cta: "عرض المرحلة ٢", route: "/reber/new-to-uk" },
      { step: "المرحلة ٣", title: "حصلت على إذن البقاء", badge: "تصرف بسرعة", badgeColor: "#F59E0B", desc: "تم منحك الوضع القانوني. الآن تحتاج إلى تأمين مستقبلك.", preview: ["حاسبة الموعد النهائي ٤٢ يوماً", "بطاقة الإقامة البيومترية", "مسار الجنسية"], cta: "عرض المرحلة ٣", route: "/reber/leave-to-remain" },
    ],
    quiz: [
      { q: "متى وصلت إلى المملكة المتحدة؟", options: ["خلال الأسابيع الماضية", "قبل أشهر", "منذ أكثر من سنة"] },
      { q: "هل أجريت مقابلة اللجوء؟", options: ["لا، لم أجرها بعد", "نعم، أجريتها", "ليس لدي طلب لجوء"] },
      { q: "هل تلقيت قراراً بشأن قضيتك؟", options: ["لا، ما زلت أنتظر", "نعم — تم منحي الوضع", "نعم — رُفض طلبي"] },
    ],
    quizResult: ["أنت في المرحلة ١ — وصلت للتو", "أنت في المرحلة ٢ — طالب لجوء", "أنت في المرحلة ٣ — إذن البقاء"],
    goToStage: "اذهب إلى مرحلتي ←",
    retake: "أعد الاختبار",
  },
}

export default function ComingToUKPage() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizStep, setQuizStep] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState([])
  const [quizDone, setQuizDone] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('komek_lang')
    if (saved && TX[saved]) setLang(saved)
    const handler = (e) => { if (TX[e.detail]) setLang(e.detail) }
    window.addEventListener('langchange', handler)
    return () => window.removeEventListener('langchange', handler)
  }, [])

  const t = TX[lang] || TX.en

  const handleQuizAnswer = (answer) => {
    const next = [...quizAnswers, answer]
    if (quizStep < 2) { setQuizAnswers(next); setQuizStep(quizStep + 1) }
    else { setQuizAnswers(next); setQuizDone(true) }
  }

  const getQuizResult = () => {
    if (quizAnswers[0] === t.quiz[0].options[0]) return 0
    if (quizAnswers[2] === t.quiz[2].options[1]) return 2
    return 1
  }

  const resetQuiz = () => { setShowQuiz(false); setQuizStep(0); setQuizAnswers([]); setQuizDone(false) }

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: FONT, direction: 'ltr', paddingBottom: 80 }}>

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${INDIGO_DARK} 0%, #2d2b6b 60%, #3730a3 100%)`, padding: '36px 20px 44px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(79,70,229,0.15)' }} />
        <div style={{ position: 'absolute', bottom: -30, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(52,211,153,0.08)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: i === 0 ? MINT : i === 1 ? INDIGO_LIGHT : '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff' }}>{i + 1}</div>
                  <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10, fontWeight: 600 }}>{t.stages[i].step}</span>
                </div>
                {i < 2 && <div style={{ width: 20, height: 2, background: 'rgba(255,255,255,0.2)', marginBottom: 14 }} />}
              </div>
            ))}
          </div>
          <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, margin: '0 0 10px', lineHeight: 1.2 }}>{t.heroTitle}</h1>
          <p style={{ color: '#a5b4fc', fontSize: 14, margin: 0, lineHeight: 1.6 }}>{t.heroSub}</p>
        </div>
      </div>

      {/* Quiz */}
      <div style={{ padding: '14px 16px 0' }}>
        {!showQuiz ? (
          <div style={{ background: `linear-gradient(135deg, ${INDIGO}, #6366f1)`, borderRadius: 16, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(79,70,229,0.25)' }}>
            <div>
              <p style={{ color: '#fff', fontWeight: 800, fontSize: 14, margin: '0 0 3px' }}>{t.quizTitle}</p>
              <p style={{ color: '#c7d2fe', fontSize: 12, margin: 0 }}>{t.quizSub}</p>
            </div>
            <button onClick={() => setShowQuiz(true)} style={{ background: MINT, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 14px', fontSize: 12, fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap', marginLeft: 12, flexShrink: 0, fontFamily: FONT }}>
              {t.startQuiz}
            </button>
          </div>
        ) : !quizDone ? (
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 12px rgba(79,70,229,0.08)', border: `1px solid ${SOFT}` }}>
            <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
              {[0, 1, 2].map(i => <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i <= quizStep ? INDIGO : SOFT, transition: 'background 0.3s' }} />)}
            </div>
            <p style={{ color: INDIGO_DARK, fontWeight: 800, fontSize: 16, margin: '0 0 16px', lineHeight: 1.4 }}>{t.quiz[quizStep].q}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {t.quiz[quizStep].options.map((opt, i) => (
                <button key={i} onClick={() => handleQuizAnswer(opt)}
                  style={{ background: BG, border: `1.5px solid ${SOFT}`, borderRadius: 10, padding: '12px 14px', textAlign: 'left', fontSize: 14, color: INDIGO_DARK, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = INDIGO; e.currentTarget.style.background = SOFT }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = SOFT; e.currentTarget.style.background = BG }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: `1.5px solid ${INDIGO}`, boxShadow: '0 2px 12px rgba(79,70,229,0.12)' }}>
            <p style={{ fontSize: 22, margin: '0 0 8px' }}>👇</p>
            <p style={{ color: INDIGO, fontWeight: 800, fontSize: 16, margin: '0 0 14px' }}>{t.quizResult[getQuizResult()]}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <button onClick={() => router.push(t.stages[getQuizResult()].route)}
                style={{ background: INDIGO, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>
                {t.goToStage}
              </button>
              <button onClick={resetQuiz}
                style={{ background: 'transparent', color: INDIGO_LIGHT, border: 'none', fontSize: 12, cursor: 'pointer', fontFamily: FONT }}>
                {t.retake}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stage Cards */}
      <div style={{ padding: '14px 16px 0' }}>
        <p style={{ color: '#6b7280', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, margin: '0 0 10px' }}>{t.allStages}</p>
        {t.stages.map((stage, i) => (
          <div key={i} onClick={() => router.push(stage.route)}
            style={{ background: '#fff', borderRadius: 16, marginBottom: 12, border: `1px solid ${SOFT}`, boxShadow: '0 2px 10px rgba(79,70,229,0.06)', overflow: 'hidden', cursor: 'pointer' }}>
            <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #F3F4F6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: stage.badgeColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff', flexShrink: 0 }}>{i + 1}</div>
                <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 600 }}>{stage.step}</span>
                <span style={{ background: stage.badgeColor + '22', color: stage.badgeColor, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, border: `1px solid ${stage.badgeColor}44` }}>{stage.badge}</span>
              </div>
              <h3 style={{ color: INDIGO_DARK, fontWeight: 800, fontSize: 17, margin: '0 0 5px' }}>{stage.title}</h3>
              <p style={{ color: '#6b7280', fontSize: 13, margin: 0, lineHeight: 1.5 }}>{stage.desc}</p>
            </div>
            <div style={{ padding: '10px 16px' }}>
              {stage.preview.map((item, j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: stage.badgeColor, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: '#4b5563' }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: '0 16px 14px' }}>
              <div style={{ background: INDIGO_DARK, color: '#fff', borderRadius: 10, padding: 12, textAlign: 'center', fontSize: 14, fontWeight: 700 }}>
                {stage.cta} →
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Letter explainer banner */}
      <div style={{ padding: '4px 16px 0' }}>
        <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e1b4b)', borderRadius: 16, padding: '18px 16px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(79,70,229,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>📄</div>
          <div style={{ flex: 1 }}>
            <p style={{ color: '#fff', fontWeight: 800, fontSize: 14, margin: '0 0 3px' }}>{t.letterBanner}</p>
            <p style={{ color: '#a5b4fc', fontSize: 12, margin: '0 0 10px' }}>{t.heroSub}</p>
            <button onClick={() => router.push('/journey/document-explainer')}
              style={{ background: MINT, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>
              {t.letterCta} →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}