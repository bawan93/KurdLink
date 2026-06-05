'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

const INDIGO = '#4F46E5'
const INDIGO_DARK = '#1C1A4F'
const INDIGO_LIGHT = '#818CF8'
const MINT = '#34D399'
const SOFT = '#EDE9FE'
const BG = '#F5F4FF'
const KURD_YELLOW = '#F7C200'
const KURD_RED = '#E30A17'
const FONT = "Nunito, sans-serif"

function getSupabase() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

function SproutLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <linearGradient id="sbg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={INDIGO} /><stop offset="100%" stopColor={INDIGO_LIGHT} />
        </linearGradient>
        <linearGradient id="sl" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#059669" /><stop offset="100%" stopColor="#6EE7B7" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="url(#sbg)" />
      <path d="M 50 76 L 50 45" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M 50 60 Q 26 55 22 34 Q 44 28 52 56 Z" fill="url(#sl)" />
      <path d="M 50 50 Q 72 44 76 23 Q 56 17 48 46 Z" fill="url(#sl)" opacity="0.85" />
      <ellipse cx="50" cy="40" rx="6" ry="9" fill={MINT} />
      <ellipse cx="50" cy="37" rx="3" ry="4" fill="white" opacity="0.8" />
    </svg>
  )
}

function Counter({ target, duration = 1500, suffix = "" }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (target === 0) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target])
  return <span>{count.toLocaleString()}{suffix}</span>
}

export default function HomePage() {
  const [lang, setLang] = useState('en')
  const [stats, setStats] = useState({ explained: 0, listings: 0 })
  const [questions, setQuestions] = useState([])
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const isRTL = ['ku', 'fa', 'ar'].includes(lang)

  useEffect(() => {
    const saved = localStorage.getItem('komek_lang')
    if (saved) setLang(saved)
    const handler = (e) => setLang(e.detail)
    window.addEventListener('langchange', handler)
    fetchAll()

    // Refetch when page becomes visible again
    const onFocus = () => fetchAll()
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') fetchAll()
    })

    return () => {
      window.removeEventListener('langchange', handler)
      window.removeEventListener('focus', onFocus)
    }
  }, [])

  async function fetchAll() {
    const supabase = getSupabase()
    setLoading(true)

    // 1. Count explainer usage (people helped)
    const { count: explainCount } = await supabase
      .from('explainer_usage')
      .select('*', { count: 'exact', head: true })

    // 2. Count active listings
    const { count: listingCount } = await supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .in('type', ['hire_staff', 'list_service'])
      .in('status', ['approved', 'filled'])

    // 3. Top 2 most upvoted questions
    const { data: topQuestions } = await supabase
      .from('questions')
      .select('id, question, status, upvotes')
      .order('upvotes', { ascending: false })
      .limit(2)

    // 4. Latest 3 approved listings
    const { data: latestListings } = await supabase
      .from('listings')
      .select('id, type, data, status')
      .in('type', ['hire_staff', 'list_service'])
      .in('status', ['approved', 'filled'])
      .order('created_at', { ascending: false })
      .limit(3)

    setStats({ explained: explainCount || 0, listings: listingCount || 0 })
    setQuestions(topQuestions || [])
    setListings(latestListings || [])
    setLoading(false)
  }

  const listingColors = [MINT, INDIGO_LIGHT, KURD_YELLOW]

  return (
    <div style={{
      minHeight: '100vh', background: BG,
      fontFamily: FONT, paddingBottom: 90,
      direction: isRTL ? 'rtl' : 'ltr',
    }}>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }`}</style>

      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${INDIGO_DARK} 0%, #2D2A7A 100%)`,
        padding: '44px 20px 28px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Kurdish sun watermark */}
        <svg style={{ position: 'absolute', right: -30, top: -30, opacity: 0.06, pointerEvents: 'none' }} width="200" height="200" viewBox="0 0 200 200">
          {Array.from({ length: 21 }).map((_, i) => {
            const a = (i * 360 / 21) * Math.PI / 180
            return <line key={i} x1={100+Math.cos(a)*50} y1={100+Math.sin(a)*50} x2={100+Math.cos(a)*85} y2={100+Math.sin(a)*85} stroke={KURD_YELLOW} strokeWidth="4" strokeLinecap="round" />
          })}
          <circle cx="100" cy="100" r="50" fill={KURD_YELLOW} />
          <circle cx="100" cy="100" r="22" fill={KURD_RED} />
        </svg>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
          <SproutLogo size={34} />
          <span style={{ fontSize: 20, fontWeight: 900, color: 'white', letterSpacing: -0.5 }}>Komek</span>
        </div>

        {/* Live stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { value: stats.explained, suffix: '+', label: lang === 'ku' ? 'یارمەتی کراو' : lang === 'fa' ? 'نفر کمک شده' : lang === 'ar' ? 'تم مساعدتهم' : 'People helped', color: MINT },
            { value: stats.listings, suffix: '', label: lang === 'ku' ? 'کار و خزمەت' : lang === 'fa' ? 'شغل و خدمت' : lang === 'ar' ? 'وظائف وخدمات' : 'Jobs & services', color: INDIGO_LIGHT },
            { value: 4, suffix: '', label: lang === 'ku' ? 'زمان' : lang === 'fa' ? 'زبان' : lang === 'ar' ? 'لغات' : 'Languages', color: KURD_YELLOW },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: s.color, lineHeight: 1 }}>
                {loading ? '—' : <Counter target={s.value} suffix={s.suffix} />}
              </div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginTop: 4, lineHeight: 1.3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px 16px 0', animation: 'fadeIn 0.4s ease' }}>

        {/* Letter explainer card */}
        <div style={{
          background: `linear-gradient(135deg, #1e1b6e, #2D2A7A)`,
          borderRadius: 24, padding: '20px', marginBottom: 14,
          position: 'relative', overflow: 'hidden',
        }}>
          <svg style={{ position: 'absolute', right: 12, bottom: -8, opacity: 0.1, pointerEvents: 'none' }} width="90" height="70" viewBox="0 0 100 80">
            <rect width="100" height="70" rx="8" fill="white" />
            <path d="M0 0 L50 40 L100 0" stroke="white" strokeWidth="3" fill="none" />
          </svg>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>📄</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 900, color: 'white', marginBottom: 3 }}>
                {lang === 'ku' ? 'نامەکەت ڕوون بکەرەوە' : lang === 'fa' ? 'نامه را توضیح بده' : lang === 'ar' ? 'اشرح رسالتك' : 'Letter Explainer'}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', lineHeight: 1.4 }}>
                {lang === 'ku' ? 'هەر نامەیەکی فەرمی بار بکە — AI بە زمانی خۆت ڕوونی دەکاتەوە' : lang === 'fa' ? 'هر نامه رسمی را آپلود کن — AI به زبانت توضیح می‌دهد' : lang === 'ar' ? 'ارفع أي رسالة رسمية — الذكاء الاصطناعي يشرحها بلغتك' : 'Upload any official letter — AI explains it in your language'}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.07)', borderRadius: 8, padding: '8px 10px' }}>
              {[90,70,80].map((w,i) => <div key={i} style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)', width: `${w}%`, marginBottom: i<2?4:0 }} />)}
            </div>
            <div style={{ color: MINT, fontSize: 18, fontWeight: 900 }}>→</div>
            <div style={{ flex: 1, background: 'rgba(79,70,229,0.35)', borderRadius: 8, padding: '8px 10px', border: '1px solid rgba(129,140,248,0.25)' }}>
              {[85,65,75].map((w,i) => <div key={i} style={{ height: 4, borderRadius: 2, background: i===0?MINT:'rgba(255,255,255,0.25)', width: `${w}%`, marginBottom: i<2?4:0, opacity: i===0?0.9:1 }} />)}
            </div>
          </div>
        </div>

        {/* Journey steps */}
        <div style={{ background: 'white', borderRadius: 24, padding: '18px 20px', marginBottom: 14, boxShadow: '0 2px 16px rgba(79,70,229,0.07)' }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: INDIGO_DARK, marginBottom: 16 }}>
            {lang === 'ku' ? 'گەشتەکەت لە بریتانیا' : lang === 'fa' ? 'سفر تو در بریتانیا' : lang === 'ar' ? 'رحلتك في بريطانيا' : 'Your Journey in the UK'}
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: 19, left: 20, right: 20, height: 2, background: `linear-gradient(90deg, ${INDIGO}, #7C3AED, ${MINT})`, borderRadius: 1, zIndex: 0 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
              {[
                { icon: '✈️', label: lang === 'ku' ? 'گەیشتن' : lang === 'fa' ? 'ورود' : lang === 'ar' ? 'الوصول' : 'Arrive', sub: lang === 'ku' ? 'تازە گەیشتوویت' : lang === 'fa' ? 'تازه رسیدی' : lang === 'ar' ? 'الجديد' : 'New to UK', color: INDIGO },
                { icon: '📋', label: lang === 'ku' ? 'مانەوە' : lang === 'fa' ? 'اقامت' : lang === 'ar' ? 'الإقامة' : 'Stay', sub: lang === 'ku' ? 'مۆڵەتی مانەوە' : lang === 'fa' ? 'اجازه اقامت' : lang === 'ar' ? 'الإذن بالبقاء' : 'Leave to Remain', color: '#7C3AED' },
                { icon: '🇬🇧', label: lang === 'ku' ? 'هاووڵاتیی' : lang === 'fa' ? 'شهروندی' : lang === 'ar' ? 'الجنسية' : 'Citizen', sub: lang === 'ku' ? 'بریتانیایی بوون' : lang === 'fa' ? 'شهروند بریتانیا' : lang === 'ar' ? 'الجنسية البريطانية' : 'Citizenship', color: MINT },
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: i === 0 ? step.color : 'white', border: `2px solid ${step.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, boxShadow: i === 0 ? `0 0 16px ${step.color}44` : 'none' }}>{step.icon}</div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 10, fontWeight: 900, color: step.color }}>{step.label}</div>
                    <div style={{ fontSize: 8, color: '#9CA3AF', fontWeight: 600, lineHeight: 1.3 }}>{step.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Community + Jobs — 2 col */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>

          {/* Community questions */}
          <div style={{ background: 'white', borderRadius: 20, padding: '14px', boxShadow: '0 2px 16px rgba(79,70,229,0.07)' }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: INDIGO_DARK, marginBottom: 10 }}>
              {lang === 'ku' ? 'کۆمیونیتی' : lang === 'fa' ? 'جامعه' : lang === 'ar' ? 'المجتمع' : 'Community'}
            </div>
            {loading ? (
              <div style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 20, height: 20, border: `2px solid ${SOFT}`, borderTopColor: INDIGO, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              </div>
            ) : questions.length === 0 ? (
              <div style={{ fontSize: 9, color: '#9CA3AF', fontWeight: 600, textAlign: 'center', padding: '10px 0' }}>No questions yet</div>
            ) : questions.map((q, i) => (
              <div key={q.id} style={{ background: BG, borderRadius: 8, padding: '7px 8px', marginBottom: i < questions.length-1 ? 6 : 0 }}>
                <div style={{ fontSize: 8, color: INDIGO_DARK, fontWeight: 700, lineHeight: 1.35, marginBottom: 3 }}>{q.question.length > 45 ? q.question.slice(0, 45) + '…' : q.question}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: q.status === 'answered' ? MINT : '#F59E0B' }} />
                  <span style={{ fontSize: 7, color: '#9CA3AF', fontWeight: 600 }}>{q.upvotes || 0} helpful</span>
                </div>
              </div>
            ))}
          </div>

          {/* Live listings */}
          <div style={{ background: 'white', borderRadius: 20, padding: '14px', boxShadow: '0 2px 16px rgba(79,70,229,0.07)' }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: INDIGO_DARK, marginBottom: 10 }}>
              {lang === 'ku' ? 'کار و خزمەت' : lang === 'fa' ? 'شغل و خدمات' : lang === 'ar' ? 'وظائف وخدمات' : 'Jobs & Services'}
            </div>
            {loading ? (
              <div style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 20, height: 20, border: `2px solid ${SOFT}`, borderTopColor: INDIGO, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              </div>
            ) : listings.length === 0 ? (
              <div style={{ fontSize: 9, color: '#9CA3AF', fontWeight: 600, textAlign: 'center', padding: '10px 0' }}>No listings yet</div>
            ) : listings.map((l, i) => {
              const d = l.data || {}
              const title = l.type === 'hire_staff' ? d.jobTitle : d.serviceName
              const detail = l.type === 'hire_staff' ? (d.salary || d.location || '') : (d.price || d.location || '')
              return (
                <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: i < listings.length-1 ? 8 : 0 }}>
                  <div style={{ width: 3, height: 28, borderRadius: 2, background: listingColors[i % listingColors.length], flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 9, fontWeight: 900, color: INDIGO_DARK, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
                    <div style={{ fontSize: 8, color: '#9CA3AF', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{detail}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Languages strip */}
        <div style={{
          background: `linear-gradient(135deg, ${INDIGO_DARK}, #2D2A7A)`,
          borderRadius: 20, padding: '14px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ fontSize: 11, fontWeight: 900, color: 'white' }}>
            {lang === 'ku' ? 'بەردەستە بە' : lang === 'fa' ? 'موجود در' : lang === 'ar' ? 'متاح بـ' : 'Available in'}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[{ flag: '🇬🇧', name: 'EN' }, { flag: '🏴', name: 'کوردی' }, { flag: '🇮🇷', name: 'فارسی' }, { flag: '🇮🇶', name: 'عربي' }].map((l, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18 }}>{l.flag}</div>
                <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>{l.name}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}