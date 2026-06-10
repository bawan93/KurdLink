'use client'

import { useState, useEffect, useRef } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

const INDIGO = '#4F46E5'
const INDIGO_DARK = '#1C1A4F'
const INDIGO_LIGHT = '#818CF8'
const MINT = '#34D399'
const SOFT = '#EDE9FE'
const BG = '#F5F4FF'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const translations = {
  en: {
    heroTitle: 'Understand Your Letter',
    heroSub: "Paste or upload any official letter and we'll explain it in plain language",
    tab_paste: 'Paste Text',
    tab_upload: 'Upload / Photo',
    placeholder: 'Paste your letter here...',
    dragDrop: 'Drag & drop your letter image or',
    browse: 'browse',
    camera: '📷 Take Photo',
    btn: 'Explain This Letter',
    explaining: 'Explaining...',
    letterType: 'Letter Type',
    summary: 'Summary',
    deadlines: 'Deadlines',
    whatToDo: 'What To Do',
    warning: '⚠️ Warning',
    errorMsg: 'Something went wrong. Please try again.',
    imageReady: 'Tap Explain to continue',
    removeImage: '✕ Remove image',
    limitImage_anon: "You've used your 3 free image explanations today. Create a free account for 10 per day.",
    limitText_anon: "You've used your 10 free text explanations today. Come back tomorrow.",
    limitImage_account: "You've used your 10 image explanations today. Come back tomorrow.",
    createAccount: 'Create Free Account',
    imagesLeft: 'images left',
    resetsIn: 'Resets in',
  },
  ku: {
    heroTitle: 'لە نامەکەت تێبگە',
    heroSub: 'هەر نامەیەکت هەیە، دەتوانی بە ڕەسم یان نووسین، ئێمەش بە AI شیکاری بۆ بکەین',
    tab_paste: 'نووسین پەیست بکە',
    tab_upload: 'وێنە ئەپلۆد / وێنە گرتن',
    placeholder: 'ئیمەیڵ، نامەی تەلەفۆنی یان هەر نووسینێک...',
    dragDrop: 'وێنە ئەپلۆد بکە',
    browse: '',
    camera: '📷 وێنە بگرە',
    btn: 'نامەکە ڕوون بکەرەوە',
    explaining: 'تکایە چاوەڕێ بکە...',
    letterType: 'جۆری نامە',
    summary: 'کورتە',
    deadlines: 'ماوەکان',
    whatToDo: 'چی بکەیت',
    warning: '⚠️ ئاگادارکردنەوە',
    errorMsg: 'هەڵەیەک ڕوویدا. دووبارە هەوڵ بدەوە.',
    imageReady: 'دەستی بکە بۆ ڕوونکردنەوە',
    removeImage: '✕ وێنەکە بسڕەوە',
    limitImage_anon: '٣ جارت بەخۆڕایی وێنە ڕوونکردوەتەوە ئەمڕۆ. ئەکاونت دروست بکە بۆ ١٠ جار.',
    limitText_anon: '١٠ جارت بەخۆڕایی دەق ڕوونکردوەتەوە ئەمڕۆ. سبەی دەگەڕێیتەوە.',
    limitImage_account: '١٠ جارت وێنە ڕوونکردوەتەوە ئەمڕۆ. سبەی دەگەڕێیتەوە.',
    createAccount: 'ئەکاونتی خۆڕای دروست بکە',
    imagesLeft: 'وێنە ماوە',
    resetsIn: 'نوێ دەبێتەوە لە',
  },
  fa: {
    heroTitle: 'نامه‌ات را بفهم',
    heroSub: 'هر نامه رسمی را بچسبان یا آپلود کن، ما آن را به زبان ساده توضیح می‌دهیم',
    tab_paste: 'متن را بچسبان',
    tab_upload: 'آپلود / عکس',
    placeholder: 'نامه‌ات را اینجا بچسبان...',
    dragDrop: 'تصویر نامه را بکش یا',
    browse: 'مرور',
    camera: '📷 عکس بگیر',
    btn: 'این نامه را توضیح بده',
    explaining: 'در حال توضیح...',
    letterType: 'نوع نامه',
    summary: 'خلاصه',
    deadlines: 'مهلت‌ها',
    whatToDo: 'چه کاری انجام دهید',
    warning: '⚠️ هشدار',
    errorMsg: 'مشکلی پیش آمد. دوباره تلاش کنید.',
    imageReady: 'برای توضیح ادامه بده',
    removeImage: '✕ حذف تصویر',
    limitImage_anon: 'امروز ۳ توضیح تصویر رایگان استفاده کردی. حساب رایگان بساز برای ۱۰ در روز.',
    limitText_anon: 'امروز ۱۰ توضیح متن رایگان استفاده کردی. فردا برگرد.',
    limitImage_account: 'امروز ۱۰ توضیح تصویر استفاده کردی. فردا برگرد.',
    createAccount: 'ایجاد حساب رایگان',
    imagesLeft: 'تصویر باقی مانده',
    resetsIn: 'بازنشینی در',
  },
  ar: {
    heroTitle: 'افهم رسالتك',
    heroSub: 'الصق أو أرسل أي رسالة رسمية وسنشرحها بلغة بسيطة',
    tab_paste: 'الصق النص',
    tab_upload: 'رفع / صورة',
    placeholder: 'الصق رسالتك هنا...',
    dragDrop: 'اسحب صورة الرسالة أو',
    browse: 'تصفح',
    camera: '📷 التقط صورة',
    btn: 'اشرح هذه الرسالة',
    explaining: 'جارٍ الشرح...',
    letterType: 'نوع الرسالة',
    summary: 'ملخص',
    deadlines: 'المواعيد النهائية',
    whatToDo: 'ماذا تفعل',
    warning: '⚠️ تحذير',
    errorMsg: 'حدث خطأ. حاول مرة أخرى.',
    imageReady: 'اضغط للشرح',
    removeImage: '✕ إزالة الصورة',
    limitImage_anon: 'استخدمت ٣ شروحات صور مجانية اليوم. أنشئ حساباً مجانياً للحصول على ١٠ يومياً.',
    limitText_anon: 'استخدمت ١٠ شروحات نص مجانية اليوم. ارجع غداً.',
    limitImage_account: 'استخدمت ١٠ شروحات صور اليوم. ارجع غداً.',
    createAccount: 'إنشاء حساب مجاني',
    imagesLeft: 'صور متبقية',
    resetsIn: 'يتجدد في',
  },
}

async function fetchUsageCount(identifier, identifierType, inputType) {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { count } = await supabase
    .from('explainer_usage')
    .select('*', { count: 'exact', head: true })
    .eq('identifier', identifier)
    .eq('identifier_type', identifierType)
    .eq('input_type', inputType)
    .gte('created_at', since)
  return count || 0
}

async function fetchOldestUsage(identifier, identifierType, inputType) {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { data } = await supabase
    .from('explainer_usage')
    .select('created_at')
    .eq('identifier', identifier)
    .eq('identifier_type', identifierType)
    .eq('input_type', inputType)
    .gte('created_at', since)
    .order('created_at', { ascending: true })
    .limit(1)
  return data?.[0]?.created_at || null
}

function useCountdown(resetAt) {
  const [timeLeft, setTimeLeft] = useState('')
  useEffect(() => {
    if (!resetAt) { setTimeLeft(''); return }
    const update = () => {
      const diff = new Date(resetAt).getTime() + 24 * 60 * 60 * 1000 - Date.now()
      if (diff <= 0) { setTimeLeft(''); return }
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      setTimeLeft(`${h}h ${m}m`)
    }
    update()
    const id = setInterval(update, 30000)
    return () => clearInterval(id)
  }, [resetAt])
  return timeLeft
}

export default function DocumentExplainerPage() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const [tab, setTab] = useState('paste')
  const [text, setText] = useState('')
  const [imageData, setImageData] = useState(null)
  const [imageType, setImageType] = useState(null)
  const [imageName, setImageName] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [limitType, setLimitType] = useState(null)
  const [userId, setUserId] = useState(null)
  const [userIp, setUserIp] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [imageUsed, setImageUsed] = useState(0)
  const [oldestImageUsage, setOldestImageUsage] = useState(null)
  const fileRef = useRef(null)
  const cameraRef = useRef(null)
  const t = translations[lang] || translations.en
  const canSubmit = tab === 'paste' ? text.trim().length > 0 : imageData !== null
  const imageLimit = userId ? 10 : 3
  const imageLeft = Math.max(0, imageLimit - imageUsed)
  const countdown = useCountdown(imageUsed > 0 ? oldestImageUsage : null)

  useEffect(() => {
    const stored = localStorage.getItem('komek_lang')
    if (stored) setLang(stored)
    const handler = (e) => setLang(e.detail)
    window.addEventListener('langchange', handler)

    supabase.auth.getUser().then(async ({ data }) => {
      const uid = data?.user?.id || null
      setUserId(uid)

      if (!uid) {
        try {
          const res = await fetch('https://api.ipify.org?format=json')
          const d = await res.json()
          setUserIp(d.ip)
          const imgCount = await fetchUsageCount(d.ip, 'ip', 'image')
          setImageUsed(imgCount)
          if (imgCount > 0) {
            const oldest = await fetchOldestUsage(d.ip, 'ip', 'image')
            setOldestImageUsage(oldest)
          }
        } catch {
          // IP fetch failed, continue without
        }
      } else {
        const imgCount = await fetchUsageCount(uid, 'user', 'image')
        setImageUsed(imgCount)
        if (imgCount > 0) {
          const oldest = await fetchOldestUsage(uid, 'user', 'image')
          setOldestImageUsage(oldest)
        }
      }
    })

    return () => window.removeEventListener('langchange', handler)
  }, [])

  async function refreshUsage() {
    const identifier = userId || userIp
    const identifierType = userId ? 'user' : 'ip'
    if (!identifier) return
    const imgCount = await fetchUsageCount(identifier, identifierType, 'image')
    setImageUsed(imgCount)
    if (imgCount > 0) {
      const oldest = await fetchOldestUsage(identifier, identifierType, 'image')
      setOldestImageUsage(oldest)
    }
  }

  function handleFile(file) {
    if (!file) return
    const isImage = file.type.startsWith('image/')
    if (isImage) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const MAX_DIM = 1000
          let { width, height } = img
          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) { height = Math.round((height / width) * MAX_DIM); width = MAX_DIM }
            else { width = Math.round((width / height) * MAX_DIM); height = MAX_DIM }
          }
          const canvas = document.createElement('canvas')
          canvas.width = width; canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, width, height)
          ctx.drawImage(img, 0, 0, width, height)
          const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.7)
          setImageData(jpegDataUrl.split(',')[1])
          setImageType('image/jpeg')
          setImageName(file.name)
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    } else {
      const reader = new FileReader()
      reader.onload = (e) => { setText(e.target.result); setTab('paste') }
      reader.readAsText(file)
    }
  }

  async function handleExplain() {
    if (!canSubmit || loading) return
    setLoading(true)
    setError('')
    setResult(null)
    setLimitType(null)

    try {
      const body = tab === 'upload' && imageData
        ? { lang, imageData, imageType, userId }
        : { lang, text, userId }

      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()

      if (res.status === 429) {
        setLimitType(data.limitType)
        await refreshUsage()
        return
      }
      if (!res.ok) throw new Error(data.error || 'Failed')
      setResult(data)
      await refreshUsage()
    } catch (e) {
      setError(t.errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const LimitBanner = () => {
    if (!limitType) return null
    const isAnon = limitType.includes('anon')
    const msg = t[`limit${limitType.includes('image') ? 'Image' : 'Text'}_${isAnon ? 'anon' : 'account'}`]
    return (
      <div style={{ background: '#FFF7ED', border: '1.5px solid #FDE68A', borderRadius: 14, padding: '16px', marginTop: 12 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#92400E', margin: '0 0 10px' }}>{msg}</p>
        {isAnon && (
          <button onClick={() => router.push('/account')}
            style={{ background: INDIGO, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>
            {t.createAccount}
          </button>
        )}
      </div>
    )
  }

  const barColor = imageLeft === 0 ? '#EF4444' : imageLeft === 1 ? '#F59E0B' : MINT

  return (
    <div style={{ fontFamily: 'Nunito, sans-serif', background: BG, minHeight: '100vh', paddingBottom: 80, direction: 'ltr' }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${INDIGO_DARK} 0%, #2D2A7A 100%)`, padding: '40px 20px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>📄</div>
        <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 900, margin: '0 0 10px', lineHeight: 1.2 }}>{t.heroTitle}</h1>
        <p style={{ color: INDIGO_LIGHT, fontSize: 14, fontWeight: 500, margin: '0 0 20px', maxWidth: 320, marginLeft: 'auto', marginRight: 'auto' }}>{t.heroSub}</p>

        {tab === 'upload' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 22, fontWeight: 900, color: barColor, lineHeight: 1 }}>{imageLeft}</span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 600, lineHeight: 1 }}>{t.imagesLeft}</span>
            </div>
            {countdown ? (
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600, lineHeight: 1 }}>{t.resetsIn}</span>
                <span style={{ fontSize: 13, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{countdown}</span>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Main card */}
      <div style={{ padding: '0 16px', marginTop: -20 }}>
        <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 4px 24px rgba(79,70,229,0.10)', overflow: 'hidden' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${SOFT}` }}>
            {['paste', 'upload'].map(t2 => (
              <button key={t2} onClick={() => setTab(t2)} style={{ flex: 1, padding: '14px 0', background: tab === t2 ? SOFT : 'none', border: 'none', fontFamily: 'Nunito, sans-serif', fontSize: 14, fontWeight: 700, color: tab === t2 ? INDIGO : '#9CA3AF', borderBottom: tab === t2 ? `2px solid ${INDIGO}` : '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
                {t2 === 'paste' ? t.tab_paste : t.tab_upload}
              </button>
            ))}
          </div>

          <div style={{ padding: 20 }}>
            {tab === 'paste' ? (
              <textarea value={text} onChange={e => setText(e.target.value)} placeholder={t.placeholder}
                style={{ width: '100%', minHeight: 160, border: `1.5px solid ${SOFT}`, borderRadius: 12, padding: 14, fontFamily: 'Nunito, sans-serif', fontSize: 14, color: INDIGO_DARK, resize: 'vertical', outline: 'none', background: BG, boxSizing: 'border-box', direction: 'ltr' }} />
            ) : (
              <div>
                {imageData ? (
                  <div style={{ borderRadius: 14, overflow: 'hidden', border: `2px solid ${MINT}`, background: '#F0FDF4' }}>
                    <img
                      src={`data:image/jpeg;base64,${imageData}`}
                      alt={imageName}
                      style={{ width: '100%', maxHeight: 320, objectFit: 'contain', display: 'block' }}
                    />
                    <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ color: '#059669', fontSize: 13, fontWeight: 700, margin: '0 0 2px' }}>{imageName}</p>
                        <p style={{ color: '#6B7280', fontSize: 12, margin: 0 }}>{t.imageReady}</p>
                      </div>
                      <button
                        onClick={() => { setImageData(null); setImageType(null); setImageName(null) }}
                        style={{ background: 'none', border: 'none', color: '#9CA3AF', fontSize: 12, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', flexShrink: 0 }}>
                        {t.removeImage}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
                    style={{ border: `2px dashed ${dragOver ? INDIGO : SOFT}`, borderRadius: 14, padding: '32px 20px', textAlign: 'center', background: dragOver ? SOFT : BG, transition: 'all 0.2s', cursor: 'pointer' }}
                    onClick={() => fileRef.current?.click()}
                  >
                    <div style={{ fontSize: 32, marginBottom: 8 }}>📎</div>
                    <p style={{ color: '#6B7280', fontSize: 13, margin: '0 0 12px' }}>
                      {t.dragDrop} <span style={{ color: INDIGO, fontWeight: 700 }}>{t.browse}</span>
                    </p>
                    <button onClick={e => { e.stopPropagation(); cameraRef.current?.click() }}
                      style={{ background: SOFT, color: INDIGO, border: 'none', borderRadius: 10, padding: '10px 20px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                      {t.camera}
                    </button>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*,.txt" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
                <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
              </div>
            )}

            {error && <p style={{ color: '#EF4444', fontSize: 13, fontWeight: 600, marginTop: 10 }}>{error}</p>}
            <LimitBanner />

            {!limitType && (
              <button onClick={handleExplain} disabled={loading || !canSubmit}
                style={{ width: '100%', marginTop: 16, padding: '15px', background: !canSubmit ? '#E5E7EB' : INDIGO, color: !canSubmit ? '#9CA3AF' : '#fff', border: 'none', borderRadius: 14, fontFamily: 'Nunito, sans-serif', fontSize: 16, fontWeight: 800, cursor: !canSubmit ? 'not-allowed' : 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                {loading ? (
                  <>
                    <span style={{ display: 'inline-block', width: 18, height: 18, border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    {t.explaining}
                  </>
                ) : t.btn}
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {result && (
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {result.letterType && (
              <div style={{ background: '#fff', borderRadius: 16, padding: 18, boxShadow: '0 2px 12px rgba(79,70,229,0.08)' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: INDIGO, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{t.letterType}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: INDIGO_DARK }}>{result.letterType}</div>
              </div>
            )}
            {result.summary && (
              <div style={{ background: SOFT, borderRadius: 16, padding: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: INDIGO, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{t.summary}</div>
                <div style={{ fontSize: 14, color: INDIGO_DARK, lineHeight: 1.6 }}>{result.summary}</div>
              </div>
            )}
            {result.deadlines && result.deadlines.length > 0 && (
              <div style={{ background: '#FFF7ED', borderRadius: 16, padding: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t.deadlines}</div>
                {result.deadlines.map((d, i) => <div key={i} style={{ fontSize: 14, color: '#92400E', fontWeight: 600, marginBottom: 4 }}>⏰ {d}</div>)}
              </div>
            )}
            {result.whatToDo && result.whatToDo.length > 0 && (
              <div style={{ background: '#F0FDF4', borderRadius: 16, padding: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t.whatToDo}</div>
                {result.whatToDo.map((d, i) => <div key={i} style={{ fontSize: 14, color: '#065F46', fontWeight: 600, marginBottom: 4 }}>✅ {d}</div>)}
              </div>
            )}
            {result.warning && (
              <div style={{ background: '#FEF2F2', borderRadius: 16, padding: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#DC2626', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{t.warning}</div>
                <div style={{ fontSize: 14, color: '#7F1D1D', lineHeight: 1.6 }}>{result.warning}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}