'use client'

import { useState, useEffect, useRef } from 'react'

const INDIGO = '#4F46E5'
const INDIGO_DARK = '#1C1A4F'
const INDIGO_LIGHT = '#818CF8'
const MINT = '#34D399'
const SOFT = '#EDE9FE'
const BG = '#F5F4FF'
const MAX_USES = 10
const STORAGE_KEY = 'komek_explainer_uses'
const RESET_KEY = 'komek_explainer_reset'

const translations = {
  en: {
    heroTitle: 'Understand Your Letter',
    heroSub: "Paste or upload any official letter and we'll explain it in plain language",
    usesLeft: 'uses left today',
    resetsIn: 'Resets in',
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
    limitReached: 'Daily limit reached. Come back tomorrow.',
    errorMsg: 'Something went wrong. Please try again.',
    imageReady: 'Image ready — tap Explain',
    removeImage: '✕ Remove image',
  },
  ku: {
    heroTitle: 'نامەکەت تێبگە',
    heroSub: 'نامەی فەرمی بنووسە یان بار بکە، ئێمەش بە زمانێکی ئاسان ڕوونی دەکەینەوە',
    usesLeft: 'جار ئەمڕۆ ماوە',
    resetsIn: 'دەگەڕێتەوە لە',
    tab_paste: 'دەقی بنووسە',
    tab_upload: 'بار بکە / وێنە',
    placeholder: 'نامەکەت لێرە بنووسە...',
    dragDrop: 'وێنەی نامەکە بخە یان',
    browse: 'گەڕان',
    camera: '📷 وێنە بکە',
    btn: 'نامەکە ڕوون بکەرەوە',
    explaining: 'ڕوونکردنەوە...',
    letterType: 'جۆری نامە',
    summary: 'کورتە',
    deadlines: 'ماوەکان',
    whatToDo: 'چی بکەیت',
    warning: '⚠️ ئاگادارکردنەوە',
    limitReached: 'سنووری ڕۆژانە تەواو بوو. سبەی دەگەڕێیتەوە.',
    errorMsg: 'هەڵەیەک ڕوویدا. دووبارە هەوڵ بدەوە.',
    imageReady: 'وێنەکە ئامادەیە — دەست بکە',
    removeImage: '✕ وێنەکە بسڕەوە',
  },
  fa: {
    heroTitle: 'نامه‌ات را بفهم',
    heroSub: 'هر نامه رسمی را بچسبان یا آپلود کن، ما آن را به زبان ساده توضیح می‌دهیم',
    usesLeft: 'بار امروز باقی مانده',
    resetsIn: 'بازنشینی در',
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
    limitReached: 'محدودیت روزانه تمام شد. فردا برگردید.',
    errorMsg: 'مشکلی پیش آمد. دوباره تلاش کنید.',
    imageReady: 'تصویر آماده است — توضیح بده',
    removeImage: '✕ حذف تصویر',
  },
  ar: {
    heroTitle: 'افهم رسالتك',
    heroSub: 'الصق أو أرسل أي رسالة رسمية وسنشرحها بلغة بسيطة',
    usesLeft: 'استخدامات متبقية اليوم',
    resetsIn: 'يُعاد الضبط في',
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
    limitReached: 'تم الوصول إلى الحد اليومي. ارجع غداً.',
    errorMsg: 'حدث خطأ. حاول مرة أخرى.',
    imageReady: 'الصورة جاهزة — اشرح',
    removeImage: '✕ إزالة الصورة',
  },
}

function getUsageData() {
  if (typeof window === 'undefined') return { uses: 0, resetTime: null }
  try {
    const uses = parseInt(localStorage.getItem(STORAGE_KEY) || '0')
    const resetTime = localStorage.getItem(RESET_KEY)
    if (resetTime && Date.now() > parseInt(resetTime)) {
      localStorage.setItem(STORAGE_KEY, '0')
      localStorage.removeItem(RESET_KEY)
      return { uses: 0, resetTime: null }
    }
    return { uses, resetTime: resetTime ? parseInt(resetTime) : null }
  } catch { return { uses: 0, resetTime: null } }
}

function incrementUsage() {
  try {
    const uses = parseInt(localStorage.getItem(STORAGE_KEY) || '0') + 1
    localStorage.setItem(STORAGE_KEY, uses.toString())
    if (!localStorage.getItem(RESET_KEY)) {
      localStorage.setItem(RESET_KEY, (Date.now() + 24 * 60 * 60 * 1000).toString())
    }
    return uses
  } catch { return 1 }
}

export default function DocumentExplainerPage() {
  const [lang, setLang] = useState('en')
  const [tab, setTab] = useState('paste')
  const [text, setText] = useState('')
  const [imageData, setImageData] = useState(null)
  const [imageType, setImageType] = useState(null)
  const [imageName, setImageName] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [uses, setUses] = useState(0)
  const [resetTime, setResetTime] = useState(null)
  const [countdown, setCountdown] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef(null)
  const cameraRef = useRef(null)
  const t = translations[lang] || translations.en
  const isRTL = ['ku', 'fa', 'ar'].includes(lang)

  useEffect(() => {
    const stored = localStorage.getItem('komek_lang')
    if (stored) setLang(stored)
    const { uses: u, resetTime: r } = getUsageData()
    setUses(u)
    setResetTime(r)
    const handler = (e) => setLang(e.detail)
    window.addEventListener('langchange', handler)
    return () => window.removeEventListener('langchange', handler)
  }, [])

  useEffect(() => {
    if (!resetTime) return
    const interval = setInterval(() => {
      const diff = resetTime - Date.now()
      if (diff <= 0) { setUses(0); setResetTime(null); setCountdown(''); clearInterval(interval); return }
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      setCountdown(`${h}h ${m}m`)
    }, 60000)
    const diff = resetTime - Date.now()
    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    setCountdown(`${h}h ${m}m`)
    return () => clearInterval(interval)
  }, [resetTime])

  const usesLeft = MAX_USES - uses
  const limitReached = uses >= MAX_USES
  const canSubmit = tab === 'paste' ? text.trim().length > 0 : imageData !== null

  function handleFile(file) {
    if (!file) return
    const isImage = file.type.startsWith('image/')
    if (isImage) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          // Max dimension 1000px — keeps text readable but cuts tokens dramatically
          const MAX_DIM = 1000
          let { width, height } = img
          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) {
              height = Math.round((height / width) * MAX_DIM)
              width = MAX_DIM
            } else {
              width = Math.round((width / height) * MAX_DIM)
              height = MAX_DIM
            }
          }
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          // White background (in case of transparency)
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, width, height)
          ctx.drawImage(img, 0, 0, width, height)
          // 0.7 quality — good enough for reading text, ~60-70% smaller
          const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.7)
          const base64 = jpegDataUrl.split(',')[1]
          setImageData(base64)
          setImageType('image/jpeg')
          setImageName(file.name)
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    } else {
      const reader = new FileReader()
      reader.onload = (e) => {
        setText(e.target.result)
        setTab('paste')
      }
      reader.readAsText(file)
    }
  }

  async function handleExplain() {
    if (limitReached || !canSubmit) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const body = tab === 'upload' && imageData
        ? { lang, imageData, imageType }
        : { lang, text }

      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      const newUses = incrementUsage()
      setUses(newUses)
      const { resetTime: r } = getUsageData()
      setResetTime(r)
      setResult(data)
    } catch (e) {
      setError(t.errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: 'Nunito, sans-serif', background: BG, minHeight: '100vh', paddingBottom: 80, direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${INDIGO_DARK} 0%, #2D2A7A 100%)`, padding: '40px 20px 48px', textAlign: 'center' }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>📄</div>
        <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 900, margin: '0 0 10px', lineHeight: 1.2 }}>{t.heroTitle}</h1>
        <p style={{ color: INDIGO_LIGHT, fontSize: 14, fontWeight: 500, margin: '0 0 24px', maxWidth: 320, marginLeft: 'auto', marginRight: 'auto' }}>{t.heroSub}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
          {Array.from({ length: MAX_USES }).map((_, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: i < uses ? '#6366F1' : MINT, opacity: i < uses ? 0.4 : 1, transition: 'all 0.3s' }} />
          ))}
        </div>
        <div style={{ color: INDIGO_LIGHT, fontSize: 12, fontWeight: 600, marginTop: 8 }}>
          {limitReached
            ? (countdown ? `${t.resetsIn} ${countdown}` : t.limitReached)
            : `${usesLeft} ${t.usesLeft}`}
        </div>
      </div>

      {/* Main card */}
      <div style={{ padding: '0 16px', marginTop: -20 }}>
        <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 4px 24px rgba(79,70,229,0.10)', overflow: 'hidden' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${SOFT}` }}>
            {['paste', 'upload'].map(t2 => (
              <button key={t2} onClick={() => setTab(t2)} style={{ flex: 1, padding: '14px 0', background: 'none', border: 'none', fontFamily: 'Nunito, sans-serif', fontSize: 14, fontWeight: 700, color: tab === t2 ? INDIGO : '#9CA3AF', borderBottom: tab === t2 ? `2px solid ${INDIGO}` : '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
                {t2 === 'paste' ? t.tab_paste : t.tab_upload}
              </button>
            ))}
          </div>

          <div style={{ padding: 20 }}>
            {tab === 'paste' ? (
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder={t.placeholder}
                style={{ width: '100%', minHeight: 160, border: `1.5px solid ${SOFT}`, borderRadius: 12, padding: 14, fontFamily: 'Nunito, sans-serif', fontSize: 14, color: '#1C1A4F', resize: 'vertical', outline: 'none', background: BG, boxSizing: 'border-box', direction: 'ltr' }}
              />
            ) : (
              <div>
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
                  style={{ border: `2px dashed ${dragOver ? INDIGO : imageData ? MINT : SOFT}`, borderRadius: 14, padding: '32px 20px', textAlign: 'center', background: dragOver ? SOFT : imageData ? '#F0FDF4' : BG, transition: 'all 0.2s', cursor: 'pointer' }}
                  onClick={() => fileRef.current?.click()}
                >
                  {imageData ? (
                    <div>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                      <p style={{ color: '#059669', fontSize: 13, fontWeight: 700, margin: '0 0 4px' }}>{imageName}</p>
                      <p style={{ color: '#6B7280', fontSize: 12, margin: 0 }}>{t.imageReady}</p>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>📎</div>
                      <p style={{ color: '#6B7280', fontSize: 13, margin: '0 0 12px' }}>
                        {t.dragDrop} <span style={{ color: INDIGO, fontWeight: 700 }}>{t.browse}</span>
                      </p>
                      <button
                        onClick={e => { e.stopPropagation(); cameraRef.current?.click() }}
                        style={{ background: SOFT, color: INDIGO, border: 'none', borderRadius: 10, padding: '10px 20px', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                      >
                        {t.camera}
                      </button>
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="image/*,.txt" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
                  <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
                </div>
                {imageData && (
                  <button onClick={() => { setImageData(null); setImageType(null); setImageName(null) }}
                    style={{ marginTop: 8, background: 'none', border: 'none', color: '#9CA3AF', fontSize: 12, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
                    {t.removeImage}
                  </button>
                )}
              </div>
            )}

            {error && <p style={{ color: '#EF4444', fontSize: 13, fontWeight: 600, marginTop: 10 }}>{error}</p>}

            <button
              onClick={handleExplain}
              disabled={loading || limitReached || !canSubmit}
              style={{ width: '100%', marginTop: 16, padding: '15px', background: limitReached || !canSubmit ? '#E5E7EB' : INDIGO, color: limitReached || !canSubmit ? '#9CA3AF' : '#fff', border: 'none', borderRadius: 14, fontFamily: 'Nunito, sans-serif', fontSize: 16, fontWeight: 800, cursor: limitReached || !canSubmit ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
            >
              {loading ? t.explaining : limitReached ? t.limitReached : t.btn}
            </button>
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
                {result.deadlines.map((d, i) => (
                  <div key={i} style={{ fontSize: 14, color: '#92400E', fontWeight: 600, marginBottom: 4 }}>⏰ {d}</div>
                ))}
              </div>
            )}
            {result.whatToDo && result.whatToDo.length > 0 && (
              <div style={{ background: '#F0FDF4', borderRadius: 16, padding: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t.whatToDo}</div>
                {result.whatToDo.map((d, i) => (
                  <div key={i} style={{ fontSize: 14, color: '#065F46', fontWeight: 600, marginBottom: 4 }}>✅ {d}</div>
                ))}
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