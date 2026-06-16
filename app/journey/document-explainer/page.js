'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/app/lib/supabase'
import { useRouter } from 'next/navigation'

const INDIGO = '#4F46E5'
const INDIGO_DARK = '#1C1A4F'
const INDIGO_LIGHT = '#818CF8'
const MINT = '#34D399'
const SOFT = '#EDE9FE'
const BG = '#F5F4FF'

const supabase = createClient()

const translations = {
  en: {
    heroTitle: 'Understand Your Letter',
    heroSub: "Paste or upload any official letter and we'll explain it in plain language",
    tab_paste: 'Paste Text',
    tab_upload: 'Upload / Photo',
    placeholder: 'Paste your letter here...',
    dragDrop: 'Drag & drop your letter image or',
    browse: 'browse',
    camera: 'Take Photo Now',
    dragTitle: 'Upload your letter',
    dragSub: 'Any official letter, form or notice',
    orText: 'or',
    btn: '✨ Explain This Letter',
    explaining: 'Explaining...',
    letterType: 'Letter Type',
    summary: 'Summary',
    deadlines: 'Deadlines',
    whatToDo: 'What To Do',
    warning: '⚠️ Warning',
    errorMsg: 'Something went wrong. Please try again.',
    imageReady: 'Ready — tap Explain below',
    removeImage: 'Remove',
    limitTotal_anon: "You've used your 3 free explanations. Create a free account to continue.",
    limitImage_account: "You've used your 10 image explanations today. Come back tomorrow.",
    createAccount: 'Create Free Account',
    usesLeft: 'free uses left',
    resetsIn: 'Resets in',
  },
  ku: {
    heroTitle: 'لە نامەکەت تێبگە',
    heroSub: 'بۆت ڕوون دەکرێتەوە AI نامەکەت وێنە بێ یان نوسین بە',
    tab_paste: 'نووسین پەیست بکە',
    tab_upload: 'وێنە / ئەپلۆد',
    placeholder: 'ئیمەیڵ، نامەی تەلەفۆنی یان هەر نووسینێک...',
    dragDrop: 'وێنە ئەپلۆد بکە',
    browse: 'لە گەلەریەوە هەڵبژێرە',
    camera: 'ئێستا وێنە بگرە',
    dragTitle: 'وێنەی نامەکەت بگرە یان ئەپلۆد بکە',
    dragSub: 'هەر نامە، فۆرم یان ئاگاداریەک',
    orText: 'یان',
    btn: '✨ نامەکە ڕوون بکەرەوە',
    explaining: 'تکایە چاوەڕێ بکە...',
    letterType: 'جۆری نامە',
    summary: 'کورتە',
    deadlines: 'ماوەکان',
    whatToDo: 'چی بکەیت',
    warning: '⚠️ ئاگادارکردنەوە',
    errorMsg: 'هەڵەیەک ڕوویدا. دووبارە هەوڵ بدەوە.',
    imageReady: 'ئامادەیە — دەستی بکە بۆ ڕوونکردنەوە',
    removeImage: 'بسڕەوە',
    limitTotal_anon: '٣ جارت بەخۆڕایی بەکاریهێناوە. ئەکاونت دروست بکە بۆ بەردەوامبوون.',
    limitImage_account: '١٠ جارت وێنە ڕوونکردوەتەوە ئەمڕۆ. سبەی دەگەڕێیتەوە.',
    createAccount: 'ئەکاونتی خۆڕای دروست بکە',
    usesLeft: 'جار ماوە',
    resetsIn: 'نوێ دەبێتەوە لە',
  },
  fa: {
    heroTitle: 'نامه‌ات را بفهم',
    heroSub: 'هر نامه رسمی را بچسبان یا آپلود کن، ما آن را به زبان ساده توضیح می‌دهیم',
    tab_paste: 'متن را بچسبان',
    tab_upload: 'آپلود / عکس',
    placeholder: 'نامه‌ات را اینجا بچسبان...',
    dragDrop: 'تصویر نامه را بکش یا',
    browse: 'از گالری انتخاب کن',
    camera: 'همین الان عکس بگیر',
    dragTitle: 'از نامه‌ات عکس بگیر یا آپلود کن',
    dragSub: 'هر نامه، فرم یا اطلاعیه رسمی',
    orText: 'یا',
    btn: '✨ این نامه را توضیح بده',
    explaining: 'در حال توضیح...',
    letterType: 'نوع نامه',
    summary: 'خلاصه',
    deadlines: 'مهلت‌ها',
    whatToDo: 'چه کاری انجام دهید',
    warning: '⚠️ هشدار',
    errorMsg: 'مشکلی پیش آمد. دوباره تلاش کنید.',
    imageReady: 'آماده است — برای توضیح ادامه بده',
    removeImage: 'حذف',
    limitTotal_anon: 'سه توضیح رایگان استفاده کردی. حساب رایگان بساز برای ادامه.',
    limitImage_account: 'امروز ۱۰ توضیح تصویر استفاده کردی. فردا برگرد.',
    createAccount: 'ایجاد حساب رایگان',
    usesLeft: 'استفاده باقی مانده',
    resetsIn: 'بازنشینی در',
  },
  ar: {
    heroTitle: 'افهم رسالتك',
    heroSub: 'الصق أو أرسل أي رسالة رسمية وسنشرحها بلغة بسيطة',
    tab_paste: 'الصق النص',
    tab_upload: 'رفع / صورة',
    placeholder: 'الصق رسالتك هنا...',
    dragDrop: 'اسحب صورة الرسالة أو',
    browse: 'اختر من المعرض',
    camera: 'التقط صورة الآن',
    dragTitle: 'التقط صورة رسالتك أو ارفعها',
    dragSub: 'أي رسالة أو نموذج أو إشعار رسمي',
    orText: 'أو',
    btn: '✨ اشرح هذه الرسالة',
    explaining: 'جارٍ الشرح...',
    letterType: 'نوع الرسالة',
    summary: 'ملخص',
    deadlines: 'المواعيد النهائية',
    whatToDo: 'ماذا تفعل',
    warning: '⚠️ تحذير',
    errorMsg: 'حدث خطأ. حاول مرة أخرى.',
    imageReady: 'جاهز — اضغط للشرح أدناه',
    removeImage: 'إزالة',
    limitTotal_anon: 'استخدمت ٣ شروحات مجانية. أنشئ حساباً مجانياً للمتابعة.',
    limitImage_account: 'استخدمت ١٠ شروحات صور اليوم. ارجع غداً.',
    createAccount: 'إنشاء حساب مجاني',
    usesLeft: 'استخدامات متبقية',
    resetsIn: 'يتجدد في',
  },
}

async function fetchAnonTotalCount(ip) {
  const { count } = await supabase
    .from('explainer_usage')
    .select('*', { count: 'exact', head: true })
    .eq('identifier', ip)
    .eq('identifier_type', 'ip')
  return count || 0
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
  // ← CHANGED: default tab is now 'upload'
  const [tab, setTab] = useState('upload')
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

  const [anonTotalUsed, setAnonTotalUsed] = useState(0)
  const [imageUsed, setImageUsed] = useState(0)
  const [oldestImageUsage, setOldestImageUsage] = useState(null)

  const fileRef = useRef(null)
  const cameraRef = useRef(null)
  const t = translations[lang] || translations.en
  const canSubmit = tab === 'paste' ? text.trim().length > 0 : imageData !== null

  const isAnon = !userId
  const anonUsesLeft = Math.max(0, 3 - anonTotalUsed)
  const imageLeft = Math.max(0, 10 - imageUsed)

  const countdown = useCountdown(!isAnon && imageUsed > 0 ? oldestImageUsage : null)

  const textAlign = ['ku', 'fa', 'ar'].includes(lang) ? 'right' : 'left'

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
          const cached = localStorage.getItem('komek_ip')
          let ip
          if (cached) {
            ip = cached
          } else {
            const res = await fetch('https://api.ipify.org?format=json')
            const d = await res.json()
            ip = d.ip
            localStorage.setItem('komek_ip', ip)
          }
          setUserIp(ip)
          const total = await fetchAnonTotalCount(ip)
          setAnonTotalUsed(total)
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
    if (isAnon) {
      if (!userIp) return
      const total = await fetchAnonTotalCount(userIp)
      setAnonTotalUsed(total)
    } else {
      const imgCount = await fetchUsageCount(userId, 'user', 'image')
      setImageUsed(imgCount)
      if (imgCount > 0) {
        const oldest = await fetchOldestUsage(userId, 'user', 'image')
        setOldestImageUsage(oldest)
      }
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
    const isAnonLimit = limitType.includes('anon')
    const msg = limitType === 'total_anon' ? t.limitTotal_anon : t.limitImage_account
    return (
      <div style={{ background: '#FFF7ED', border: '1.5px solid #FDE68A', borderRadius: 14, padding: '16px', marginTop: 12 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#92400E', margin: '0 0 10px', textAlign }}>{msg}</p>
        {isAnonLimit && (
          <button onClick={() => router.push('/account')}
            style={{ background: INDIGO, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>
            {t.createAccount}
          </button>
        )}
      </div>
    )
  }

  const anonPillColor = anonUsesLeft === 0 ? '#EF4444' : anonUsesLeft === 1 ? '#F59E0B' : MINT
  const imagePillColor = imageLeft === 0 ? '#EF4444' : imageLeft <= 2 ? '#F59E0B' : MINT

  return (
    <div style={{ fontFamily: 'Nunito, sans-serif', background: BG, minHeight: '100vh', paddingBottom: 80, direction: 'ltr' }}>

      {/* ── Hero — UNCHANGED ── */}
      <div style={{ background: `linear-gradient(135deg, ${INDIGO_DARK} 0%, #2D2A7A 100%)`, padding: '40px 20px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>📄</div>
        <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 900, margin: '0 0 10px', lineHeight: 1.2, textAlign: 'center' }}>{t.heroTitle}</h1>
        <p style={{ color: INDIGO_LIGHT, fontSize: 14, fontWeight: 500, margin: '0 0 20px', maxWidth: 320, marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}>{t.heroSub}</p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          {isAnon ? (
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 22, fontWeight: 900, color: anonPillColor, lineHeight: 1 }}>{anonUsesLeft}</span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 600, lineHeight: 1 }}>{t.usesLeft}</span>
            </div>
          ) : tab === 'upload' ? (
            <>
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: imagePillColor, lineHeight: 1 }}>{imageLeft}</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 600, lineHeight: 1 }}>{t.usesLeft}</span>
              </div>
              {countdown ? (
                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600, lineHeight: 1 }}>{t.resetsIn}</span>
                  <span style={{ fontSize: 13, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{countdown}</span>
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </div>

      {/* ── Main card ── */}
      <div style={{ padding: '0 16px', marginTop: -20 }}>
        <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 4px 24px rgba(79,70,229,0.10)', overflow: 'hidden' }}>

          {/* ── CHANGED: Tabs — upload first, icons added ── */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${SOFT}` }}>
            {[
              { key: 'upload', label: `📷 ${t.tab_upload}` },
              { key: 'paste',  label: `✏️ ${t.tab_paste}` },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => setTab(key)} style={{
                flex: 1,
                padding: '14px 0',
                background: tab === key ? SOFT : 'none',
                border: 'none',
                fontFamily: 'Nunito, sans-serif',
                fontSize: 13,
                fontWeight: 700,
                color: tab === key ? INDIGO : '#9CA3AF',
                borderBottom: tab === key ? `2px solid ${INDIGO}` : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}>
                {label}
              </button>
            ))}
          </div>

          <div style={{ padding: 20 }}>

            {/* ── CHANGED: Paste tab — unchanged functionally ── */}
            {tab === 'paste' && (
              <textarea value={text} onChange={e => setText(e.target.value)} placeholder={t.placeholder}
                style={{ width: '100%', minHeight: 160, border: `1.5px solid ${SOFT}`, borderRadius: 12, padding: 14, fontFamily: 'Nunito, sans-serif', fontSize: 14, color: INDIGO_DARK, resize: 'vertical', outline: 'none', background: BG, boxSizing: 'border-box', direction: 'ltr', textAlign }} />
            )}

            {/* ── CHANGED: Upload tab — camera-first layout ── */}
            {tab === 'upload' && (
              <div>
                {imageData ? (
                  // Image selected — preview
                  <div style={{ borderRadius: 14, overflow: 'hidden', border: `2px solid ${MINT}`, background: '#F0FDF4' }}>
                    <img
                      src={`data:image/jpeg;base64,${imageData}`}
                      alt={imageName}
                      style={{ width: '100%', maxHeight: 320, objectFit: 'contain', display: 'block' }}
                    />
                    <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ color: '#059669', fontSize: 13, fontWeight: 700, margin: '0 0 2px', textAlign }}>{imageName}</p>
                        <p style={{ color: '#6B7280', fontSize: 12, margin: 0, textAlign }}>{t.imageReady}</p>
                      </div>
                      <button
                        onClick={() => { setImageData(null); setImageType(null); setImageName(null) }}
                        style={{ background: '#FEF2F2', border: 'none', color: '#EF4444', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', padding: '6px 10px', borderRadius: 8, flexShrink: 0 }}>
                        {t.removeImage}
                      </button>
                    </div>
                  </div>
                ) : (
                  // No image yet — camera CTA + dropzone
                  <div>
                    {/* Primary: Camera button */}
                    <button
                      onClick={() => cameraRef.current?.click()}
                      style={{
                        width: '100%',
                        padding: '17px',
                        background: `linear-gradient(135deg, ${INDIGO} 0%, #6366F1 100%)`,
                        color: '#fff',
                        border: 'none',
                        borderRadius: 14,
                        fontFamily: 'Nunito, sans-serif',
                        fontSize: 15,
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                        marginBottom: 14,
                        boxShadow: '0 4px 18px rgba(79,70,229,0.30)',
                      }}>
                      <span style={{ fontSize: 20 }}>📷</span>
                      {t.camera}
                    </button>

                    {/* Or divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                      <div style={{ flex: 1, height: 1, background: SOFT }} />
                      <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600 }}>{t.orText}</span>
                      <div style={{ flex: 1, height: 1, background: SOFT }} />
                    </div>

                    {/* Secondary: Drop zone */}
                    <div
                      onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
                      onClick={() => fileRef.current?.click()}
                      style={{
                        border: `2px dashed ${dragOver ? INDIGO : '#D1D5DB'}`,
                        borderRadius: 14,
                        padding: '22px 16px',
                        textAlign: 'center',
                        background: dragOver ? SOFT : '#FAFAFA',
                        transition: 'all 0.2s',
                        cursor: 'pointer',
                      }}>
                      <div style={{ fontSize: 26, marginBottom: 8 }}>🖼️</div>
                      <p style={{ color: INDIGO_DARK, fontSize: 13, fontWeight: 700, margin: '0 0 4px', textAlign }}>{t.dragTitle}</p>
                      <p style={{ color: '#9CA3AF', fontSize: 12, margin: '0 0 12px', textAlign }}>{t.dragSub}</p>
                      <span style={{
                        display: 'inline-block',
                        background: SOFT,
                        color: INDIGO,
                        borderRadius: 10,
                        padding: '7px 16px',
                        fontSize: 13,
                        fontWeight: 700,
                      }}>{t.browse}</span>
                    </div>
                  </div>
                )}

                <input ref={fileRef} type="file" accept="image/*,.txt" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
                <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
              </div>
            )}

            {error && <p style={{ color: '#EF4444', fontSize: 13, fontWeight: 600, marginTop: 10, textAlign }}>{error}</p>}
            <LimitBanner />

            {/* ── CHANGED: Explain button — gradient when active, shadow ── */}
            {!limitType && (
              <button onClick={handleExplain} disabled={loading || !canSubmit}
                style={{
                  width: '100%',
                  marginTop: 16,
                  padding: '15px',
                  background: !canSubmit ? '#E5E7EB' : `linear-gradient(135deg, ${INDIGO} 0%, #6366F1 100%)`,
                  color: !canSubmit ? '#9CA3AF' : '#fff',
                  border: 'none',
                  borderRadius: 14,
                  fontFamily: 'Nunito, sans-serif',
                  fontSize: 16,
                  fontWeight: 800,
                  cursor: !canSubmit ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  boxShadow: canSubmit ? '0 4px 18px rgba(79,70,229,0.28)' : 'none',
                }}>
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

        {/* ── Results — UNCHANGED ── */}
        {result && (
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {result.letterType && (
              <div style={{ background: '#fff', borderRadius: 16, padding: 18, boxShadow: '0 2px 12px rgba(79,70,229,0.08)' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: INDIGO, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, textAlign }}>{t.letterType}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: INDIGO_DARK, textAlign }}>{result.letterType}</div>
              </div>
            )}
            {result.summary && (
              <div style={{ background: SOFT, borderRadius: 16, padding: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: INDIGO, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, textAlign }}>{t.summary}</div>
                <div style={{ fontSize: 14, color: INDIGO_DARK, lineHeight: 1.6, textAlign }}>{result.summary}</div>
              </div>
            )}
            {result.deadlines && result.deadlines.length > 0 && (
              <div style={{ background: '#FFF7ED', borderRadius: 16, padding: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, textAlign }}>{t.deadlines}</div>
                {result.deadlines.map((d, i) => <div key={i} style={{ fontSize: 14, color: '#92400E', fontWeight: 600, marginBottom: 4, textAlign }}>⏰ {d}</div>)}
              </div>
            )}
            {result.whatToDo && result.whatToDo.length > 0 && (
              <div style={{ background: '#F0FDF4', borderRadius: 16, padding: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, textAlign }}>{t.whatToDo}</div>
                {result.whatToDo.map((d, i) => <div key={i} style={{ fontSize: 14, color: '#065F46', fontWeight: 600, marginBottom: 4, textAlign }}>✅ {d}</div>)}
              </div>
            )}
            {result.warning && (
              <div style={{ background: '#FEF2F2', borderRadius: 16, padding: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#DC2626', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, textAlign }}>{t.warning}</div>
                <div style={{ fontSize: 14, color: '#7F1D1D', lineHeight: 1.6, textAlign }}>{result.warning}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}