'use client'
import { useState, useEffect } from 'react'

const INDIGO = '#4F46E5'
const INDIGO_DARK = '#1C1A4F'
const MINT = '#34D399'
const SOFT = '#EDE9FE'
const BG = '#F5F4FF'
const FONT = "'Nunito', 'Plus Jakarta Sans', sans-serif"

const T = {
  en: {
    heroTitle: 'News for Kurds in the UK',
    heroSub: 'Latest UK news relevant to Kurdish and Middle Eastern communities',
    readMore: 'Read more',
    loading: 'Loading news...',
    error: 'Could not load news. Please try again.',
    noArticles: 'No articles found.',
    retry: 'Try again',
  },
  ku: {
    heroTitle: 'هەواڵ بۆ کوردەکانی UK',
    heroSub: 'دوایین هەواڵی UK کە پەیوەندیی بە کۆمەڵگەی کوردی هەیە',
    readMore: 'زیاتر بخوێنەوە',
    loading: 'هەواڵەکان بارکردن...',
    error: 'هەواڵ نەتوانرا بارکرێت. تکایە دووبارە هەوڵ بدەرەوە.',
    noArticles: 'هیچ وتارێک نەدۆزرایەوە.',
    retry: 'دووبارە هەوڵ بدەرەوە',
  },
  fa: {
    heroTitle: 'اخبار کردها در بریتانیا',
    heroSub: 'آخرین اخبار بریتانیا مرتبط با جوامع کردی و خاورمیانه‌ای',
    readMore: 'بیشتر بخوان',
    loading: 'در حال بارگذاری...',
    error: 'خبرها بارگذاری نشد. دوباره تلاش کن.',
    noArticles: 'مقاله‌ای یافت نشد.',
    retry: 'دوباره تلاش کن',
  },
  ar: {
    heroTitle: 'أخبار الأكراد في المملكة المتحدة',
    heroSub: 'آخر أخبار المملكة المتحدة ذات الصلة بالمجتمعات الكردية والشرق أوسطية',
    readMore: 'اقرأ المزيد',
    loading: 'جارٍ تحميل الأخبار...',
    error: 'تعذّر تحميل الأخبار. حاول مرة أخرى.',
    noArticles: 'لم يتم العثور على مقالات.',
    retry: 'حاول مرة أخرى',
  },
}

function timeAgo(dateStr) {
  try {
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  } catch {
    return dateStr
  }
}

function NewsCard({ article, lang }) {
  const isRtl = lang === 'ku' || lang === 'fa' || lang === 'ar'
  const align = isRtl ? 'right' : 'left'
  const t = T[lang] || T.en

  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      border: '1px solid #EDE9FE',
      boxShadow: '0 2px 12px rgba(79,70,229,0.07)',
      padding: '18px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      {/* Date */}
      <div style={{
        display: 'flex',
        justifyContent: isRtl ? 'flex-start' : 'flex-end',
      }}>
        <span style={{
          fontSize: 11,
          color: '#9CA3AF',
          fontFamily: FONT,
          fontWeight: 600,
        }}>
          {timeAgo(article.date)}
        </span>
      </div>

      {/* Title */}
      <h3 style={{
        margin: 0,
        fontSize: 15,
        fontWeight: 800,
        color: INDIGO_DARK,
        fontFamily: FONT,
        lineHeight: 1.4,
        textAlign: align,
      }}>
        {article.title}
      </h3>

      {/* Summary */}
      <p style={{
        margin: 0,
        fontSize: 13,
        color: '#6B7280',
        fontFamily: FONT,
        lineHeight: 1.6,
        textAlign: align,
      }}>
        {article.summary}
      </p>

      {/* Source + Read more */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: isRtl ? 'row-reverse' : 'row',
        marginTop: 4,
      }}>
        <span style={{
          fontSize: 12,
          fontWeight: 700,
          color: '#9CA3AF',
          fontFamily: FONT,
        }}>
          {article.source}
        </span>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '7px 14px',
            background: SOFT,
            color: INDIGO,
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 800,
            fontFamily: FONT,
            textDecoration: 'none',
            border: '1.5px solid #C4B5FD',
          }}
        >
          {t.readMore} →
        </a>
      </div>
    </div>
  )
}

export default function NewsPage() {
  const [lang, setLang] = useState('en')
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('komek_lang')
    if (saved) setLang(saved)
    const handler = (e) => setLang(e.detail)
    window.addEventListener('langchange', handler)
    return () => window.removeEventListener('langchange', handler)
  }, [])

  useEffect(() => {
    loadNews()
  }, [])

  async function loadNews() {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch('/api/news')
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setArticles(data.articles || [])
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const t = T[lang] || T.en
  const isRtl = lang === 'ku' || lang === 'fa' || lang === 'ar'
  const align = isRtl ? 'right' : 'left'

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: FONT, paddingBottom: 80 }}>

      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${INDIGO_DARK} 0%, #2D2A7A 60%, #1a3a5c 100%)`,
        padding: '40px 20px 48px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 180, height: 180, borderRadius: '50%',
          background: 'rgba(129,140,248,0.12)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -30, left: -30,
          width: 120, height: 120, borderRadius: '50%',
          background: 'rgba(52,211,153,0.10)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 480, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(52,211,153,0.18)',
            color: MINT,
            borderRadius: 20,
            padding: '4px 14px',
            fontSize: 12,
            fontWeight: 700,
            marginBottom: 14,
          }}>
            {lang === 'ku' ? 'هەواڵ' : lang === 'fa' ? 'اخبار' : lang === 'ar' ? 'الأخبار' : 'News'}
          </div>
          <h1 style={{
            color: '#fff',
            fontSize: 26,
            fontWeight: 900,
            margin: '0 0 10px',
            lineHeight: 1.3,
            textAlign: align,
          }}>
            {t.heroTitle}
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 14,
            margin: 0,
            lineHeight: 1.6,
            textAlign: align,
          }}>
            {t.heroSub}
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px 16px 0' }}>

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              border: `3px solid ${SOFT}`,
              borderTop: `3px solid ${INDIGO}`,
              margin: '0 auto 16px',
              animation: 'spin 0.8s linear infinite',
            }} />
            <p style={{ color: '#9CA3AF', fontFamily: FONT, fontSize: 14, margin: 0 }}>
              {t.loading}
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}

        {error && !loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📡</div>
            <p style={{ color: '#6B7280', fontFamily: FONT, fontSize: 14, marginBottom: 20 }}>
              {t.error}
            </p>
            <button
              onClick={loadNews}
              style={{
                padding: '10px 24px',
                background: INDIGO,
                color: '#fff',
                border: 'none',
                borderRadius: 20,
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
                fontFamily: FONT,
              }}
            >
              {t.retry}
            </button>
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📰</div>
            <p style={{ color: '#9CA3AF', fontFamily: FONT, fontSize: 14, margin: 0 }}>
              {t.noArticles}
            </p>
          </div>
        )}

        {!loading && !error && articles.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {articles.map((article, i) => (
              <NewsCard key={i} article={article} lang={lang} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}