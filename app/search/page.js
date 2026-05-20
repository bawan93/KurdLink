'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CATEGORIES = [
  { icon: '⚖️', color: '#FF6B35', bg: '#FFF0EB', en: 'Lawyers', ku: 'پارێزەر', ar: 'محامون' },
  { icon: '🏥', color: '#4ECDC4', bg: '#E8FAF9', en: 'Healthcare', ku: 'تەندروستی', ar: 'الرعاية الصحية' },
  { icon: '💼', color: '#45B7D1', bg: '#E8F6FB', en: 'Jobs', ku: 'کار', ar: 'وظائف' },
  { icon: '🚗', color: '#96CEB4', bg: '#EDF7F2', en: 'Driving', ku: 'شوفێری', ar: 'القيادة' },
  { icon: '📊', color: '#F4A261', bg: '#FEF4EB', en: 'Accountants', ku: 'ژمێریار', ar: 'محاسبون' },
  { icon: '✈️', color: '#C77DFF', bg: '#F5EDFF', en: 'Immigration', ku: 'کۆچبەری', ar: 'الهجرة' },
  { icon: '🎓', color: '#E9C46A', bg: '#FEF9ED', en: 'Education', ku: 'خوێندن', ar: 'تعليم' },
  { icon: '🗣️', color: '#E76F51', bg: '#FDEEEA', en: 'Translators', ku: 'وەرگێڕ', ar: 'مترجمون' },
  { icon: '🏠', color: '#2A9D8F', bg: '#E6F5F3', en: 'Housing', ku: 'خانوو', ar: 'سكن' },
  { icon: '🤝', color: '#457B9D', bg: '#EAF2F8', en: 'Community', ku: 'کۆمەڵگا', ar: 'مجتمع' },
]

const BUSINESSES = [
  { id: 1, av: 'A', color: '#FF6B35', type: 0, rating: 4.9, rc: 128, verified: true, open: true, dist: '1.2 mi', price: '££', kurdish: true, name: { en: 'Ahmad & Co Law', ku: 'ئەحمەد و هاوکارەکانی', ar: 'أحمد ومشاركوه' }, btype: { en: 'Immigration Lawyer', ku: 'پارێزەری کۆچبەری', ar: 'محامي هجرة' }, tags: { en: ['Kurdish Speaking', 'Visa', 'Asylum'], ku: ['کوردی قسەدەکات', 'ڤیزا', 'پەناگەرایەتی'], ar: ['يتحدث الكردية', 'تأشيرة', 'لجوء'] } },
  { id: 2, av: 'S', color: '#4ECDC4', type: 1, rating: 4.8, rc: 94, verified: true, open: true, dist: '2.1 mi', price: '£', kurdish: true, name: { en: 'Dr. Sara Karim', ku: 'دکتۆر سارا کەریم', ar: 'د. سارة كريم' }, btype: { en: 'GP • Healthcare', ku: 'دکتۆر • تەندروستی', ar: 'طبيب عام' }, tags: { en: ['Kurdish Speaking', 'NHS', 'Private'], ku: ['کوردی قسەدەکات', 'NHS', 'تایبەت'], ar: ['يتحدث الكردية', 'خدمة صحية', 'خاص'] } },
  { id: 3, av: 'R', color: '#C77DFF', type: 2, rating: 5.0, rc: 61, verified: true, open: false, dist: '3.4 mi', price: '££', kurdish: true, name: { en: 'Renas Accountancy', ku: 'ژمێریاری ڕێناس', ar: 'شركة رينا للمحاسبة' }, btype: { en: 'Chartered Accountant', ku: 'ژمێریاری مەزوون', ar: 'محاسب قانوني' }, tags: { en: ['Tax Returns', 'Self-Employed'], ku: ['داوای باج', 'خۆکار'], ar: ['إقرار ضريبي', 'عمل حر'] } },
  { id: 4, av: 'A', color: '#96CEB4', type: 3, rating: 4.7, rc: 43, verified: false, open: true, dist: '4.7 mi', price: '£', kurdish: true, name: { en: 'Ari Driving School', ku: 'قوتابخانەی شوفێری ئاری', ar: 'مدرسة أري للقيادة' }, btype: { en: 'Driving Instructor', ku: 'مامۆستای شوفێری', ar: 'مدرب قيادة' }, tags: { en: ['Manual', 'Automatic'], ku: ['دەستی', 'ئۆتۆماتیک'], ar: ['يدوي', 'أوتوماتيك'] } },
  { id: 5, av: 'B', color: '#E76F51', type: 4, rating: 4.9, rc: 87, verified: true, open: true, dist: '1.8 mi', price: '£', kurdish: true, name: { en: 'Baran Translation', ku: 'وەرگێڕانی باران', ar: 'ترجمة باران' }, btype: { en: 'Certified Translator', ku: 'وەرگێڕی مەزوون', ar: 'مترجم معتمد' }, tags: { en: ['Legal', 'Medical'], ku: ['یاسایی', 'پزیشکی'], ar: ['قانوني', 'طبي'] } },
  { id: 6, av: 'K', color: '#45B7D1', type: 5, rating: 4.6, rc: 32, verified: true, open: false, dist: '5.2 mi', price: '££', kurdish: false, name: { en: 'Kawa Travel', ku: 'گەشتی کاوە', ar: 'كاوا للسفر' }, btype: { en: 'Travel Agent', ku: 'ئاژانسی گەشت', ar: 'وكيل سفر' }, tags: { en: ['Flights', 'Hotels'], ku: ['فڕۆکە', 'ئوتێل'], ar: ['رحلات', 'فنادق'] } },
]

const TX = {
  en: { dir: 'ltr', searchPh: 'Lawyers, doctors, accountants…', filters: 'Filters', clearAll: 'Clear all', apply: 'Apply', results: 'results', openNow: 'Open Now', closed: 'Closed', verified: '✓ Verified', kurdishSp: 'Kurdish Speaking', topRated: 'Top Rated', anyRating: 'Any Rating', above4: '4+ Stars', above45: '4.5+ Stars', fiveOnly: '5 Stars', viewProfile: 'View Profile →', home: 'Home', search: 'Search', saved: 'Saved', messages: 'Messages', profile: 'Profile' },
  ku: { dir: 'rtl', searchPh: 'پارێزەر، دکتۆر، ژمێریار…', filters: 'فلتەر', clearAll: 'پاككردنەوە', apply: 'جێبەجێکردن', results: 'ئەنجام', openNow: 'ئێستا کراوەیە', closed: 'داخراوە', verified: '✓ دڵنیاکراوە', kurdishSp: 'کوردی قسەدەکات', topRated: 'باشترین', anyRating: 'هەر نرخاندنێک', above4: '٤+ ئەستێرە', above45: '٤.٥+ ئەستێرە', fiveOnly: '٥ ئەستێرە', viewProfile: '→ پرۆفایل ببینە', home: 'سەرەکی', search: 'گەڕان', saved: 'پاشەکەوت', messages: 'نامە', profile: 'پرۆفایل' },
  ar: { dir: 'rtl', searchPh: 'محامون، أطباء، محاسبون…', filters: 'الفلاتر', clearAll: 'مسح الكل', apply: 'تطبيق', results: 'نتيجة', openNow: 'مفتوح الآن', closed: 'مغلق', verified: '✓ موثق', kurdishSp: 'يتحدث الكردية', topRated: 'الأعلى تقييماً', anyRating: 'أي تقييم', above4: '+٤ نجوم', above45: '+٤.٥ نجوم', fiveOnly: '٥ نجوم', viewProfile: '→ عرض الملف', home: 'الرئيسية', search: 'بحث', saved: 'المحفوظة', messages: 'الرسائل', profile: 'الملف' },
}

const stars = (n) => '★'.repeat(Math.floor(n)) + '☆'.repeat(5 - Math.floor(n))

export default function Search() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const [query, setQuery] = useState('')
  const [saved, setSaved] = useState([])
  const [filterOpen, setFilterOpen] = useState(false)
  const [minRating, setMinRating] = useState(0)
  const [onlyOpen, setOnlyOpen] = useState(false)
  const [onlyVerified, setOnlyVerified] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)
  const t = TX[lang]
  const isRtl = t.dir === 'rtl'

  const toggleSave = (id) => setSaved(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const filtered = BUSINESSES.filter(b => {
    if (minRating && b.rating < minRating) return false
    if (onlyOpen && !b.open) return false
    if (onlyVerified && !b.verified) return false
    if (activeCategory !== null && b.type !== activeCategory) return false
    if (query) {
      const q = query.toLowerCase()
      const nameMatch = b.name[lang].toLowerCase().includes(q)
      const typeMatch = b.btype[lang].toLowerCase().includes(q)
      const tagMatch = b.tags[lang].some(tg => tg.toLowerCase().includes(q))
      if (!nameMatch && !typeMatch && !tagMatch) return false
    }
    return true
  })

  const activeFilters = [minRating > 0, onlyOpen, onlyVerified, activeCategory !== null].filter(Boolean).length

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', background: '#F5F5F7', fontFamily: isRtl ? "'Noto Sans Arabic', sans-serif" : "'DM Sans', sans-serif", direction: t.dir }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&family=Noto+Sans+Arabic:wght@400;600;700;800&display=swap" rel="stylesheet" />

      {/* TOP BAR */}
      <div style={{ background: '#fff', padding: '0 16px', height: '58px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,.07)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg,#FF6B35,#FF8C61)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 4L11 12L5 20H9L15 12L9 4H5Z" fill="white" /><path d="M14 8L17 12L14 16H18L21 12L18 8H14Z" fill="white" opacity=".55" /></svg>
          </div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 800, color: '#1C1C1E' }}>Kurd<span style={{ color: '#FF6B35' }}>Link</span></span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['en', 'ku', 'ar'].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ padding: '4px 9px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 700, fontFamily: 'inherit', background: lang === l ? '#FF6B35' : '#F5F5F7', color: lang === l ? '#fff' : '#636366' }}>{l.toUpperCase()}</button>
          ))}
        </div>
      </div>

      {/* SEARCH BAR */}
      <div style={{ background: '#fff', padding: '11px 16px', borderBottom: '1px solid rgba(0,0,0,.06)' }}>
        <div style={{ background: '#F5F5F7', borderRadius: '13px', padding: '10px 13px', display: 'flex', alignItems: 'center', gap: '8px', border: '2px solid #FF6B35' }}>
          <span style={{ fontSize: '15px', color: '#AEAEB2', flexShrink: 0 }}>🔍</span>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder={t.searchPh} style={{ flex: 1, border: 'none', outline: 'none', fontFamily: 'inherit', fontSize: '14px', color: '#1C1C1E', background: 'transparent', direction: t.dir }} />
          {query && <span onClick={() => setQuery('')} style={{ color: '#AEAEB2', cursor: 'pointer', fontSize: '17px' }}>×</span>}
        </div>
      </div>

      {/* CATEGORY PILLS */}
      <div style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,.05)', padding: '10px 16px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          <button onClick={() => setActiveCategory(null)} style={{ flexShrink: 0, padding: '6px 13px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px', fontWeight: 600, background: activeCategory === null ? '#FF6B35' : '#F5F5F7', color: activeCategory === null ? '#fff' : '#636366' }}>All</button>
          {CATEGORIES.map((cat, i) => (
            <button key={i} onClick={() => setActiveCategory(activeCategory === i ? null : i)} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 13px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px', fontWeight: 600, background: activeCategory === i ? cat.color : '#F5F5F7', color: activeCategory === i ? '#fff' : '#636366' }}>
              <span>{cat.icon}</span>{cat[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* FILTER BAR */}
      <div style={{ background: '#fff', padding: '9px 16px', borderBottom: '1px solid rgba(0,0,0,.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '7px' }}>
          <button onClick={() => setFilterOpen(true)} style={{ padding: '7px 13px', borderRadius: '50px', border: `1.5px solid ${activeFilters > 0 ? '#FF6B35' : 'rgba(0,0,0,.1)'}`, background: activeFilters > 0 ? '#FF6B35' : '#fff', color: activeFilters > 0 ? '#fff' : '#1C1C1E', cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px', fontWeight: 700 }}>⚙ {t.filters}{activeFilters > 0 ? ` (${activeFilters})` : ''}</button>
          {onlyOpen && <button onClick={() => setOnlyOpen(false)} style={{ padding: '7px 13px', borderRadius: '50px', border: 'none', background: '#FF6B35', color: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px', fontWeight: 700 }}>{t.openNow} ×</button>}
        </div>
        <span style={{ fontSize: '12px', color: '#8E8E93', flexShrink: 0 }}>{filtered.length} {t.results}</span>
      </div>

      {/* RESULTS */}
      <div style={{ padding: '12px 16px 80px' }}>
        {filtered.map(b => (
          <div key={b.id} style={{ background: '#fff', borderRadius: '18px', padding: '17px', boxShadow: '0 2px 12px rgba(0,0,0,.05)', marginBottom: '12px', cursor: 'pointer', border: '2px solid transparent', transition: 'border-color .2s', position: 'relative', overflow: 'hidden' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,107,53,.2)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
            onClick={() => router.push(`/business/${b.id}`)}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: `linear-gradient(180deg,${b.color},${b.color}44)` }} />
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `linear-gradient(135deg,${b.color},${b.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '19px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>{b.av}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '3px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap', marginBottom: '2px' }}>
                      <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '14px', color: '#1C1C1E' }}>{b.name[lang]}</span>
                      {b.verified && <span style={{ background: '#E6F9F5', color: '#1DB87A', fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '50px' }}>{t.verified}</span>}
                    </div>
                    <div style={{ fontSize: '11px', color: '#8E8E93' }}>
                      {b.btype[lang]} • <span style={{ color: b.open ? '#1DB87A' : '#AEAEB2', fontWeight: 600 }}>● {b.open ? t.openNow : t.closed}</span>
                      {b.kurdish && ` • 🗣 ${t.kurdishSp}`}
                    </div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); toggleSave(b.id) }} style={{ background: saved.includes(b.id) ? '#FFF0EB' : '#F5F5F7', border: 'none', borderRadius: '9px', padding: '5px 8px', fontSize: '14px', cursor: 'pointer', flexShrink: 0, color: saved.includes(b.id) ? '#FF6B35' : '#AEAEB2' }}>{saved.includes(b.id) ? '♥' : '♡'}</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '7px', flexWrap: 'wrap' }}>
                  <span style={{ color: '#F4A261', fontSize: '11px' }}>{stars(b.rating)}</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#1C1C1E' }}>{b.rating}</span>
                  <span style={{ fontSize: '11px', color: '#AEAEB2' }}>({b.rc})</span>
                  <span style={{ fontSize: '11px', color: '#FF6B35', fontWeight: 600 }}>📍 {b.dist}</span>
                  <span style={{ fontSize: '11px', color: '#8E8E93' }}>{b.price}</span>
                </div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '10px' }}>
                  {b.tags[lang].map((tag, i) => <span key={i} style={{ fontSize: '10px', fontWeight: 600, background: '#F5F5F7', color: '#555', padding: '3px 8px', borderRadius: '50px' }}>{tag}</span>)}
                </div>
                <div style={{ display: 'flex', gap: '7px' }}>
                  <button onClick={e => { e.stopPropagation(); router.push(`/business/${b.id}`) }} style={{ flex: 2, padding: '9px', background: 'linear-gradient(135deg,#FF6B35,#FF8C61)', border: 'none', borderRadius: '12px', fontSize: '12px', fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>{t.viewProfile}</button>
                  <button onClick={e => e.stopPropagation()} style={{ flex: 1, padding: '9px', background: '#E7F9EF', border: 'none', borderRadius: '12px', fontSize: '13px', color: '#25D366', cursor: 'pointer' }}>💬</button>
                  <button onClick={e => e.stopPropagation()} style={{ flex: 1, padding: '9px', background: '#F5F5F7', border: 'none', borderRadius: '12px', fontSize: '13px', cursor: 'pointer' }}>📞</button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
            <p style={{ fontWeight: 700, color: '#1C1C1E', fontSize: '16px', marginBottom: '6px' }}>No results found</p>
            <p style={{ color: '#8E8E93', fontSize: '13px' }}>Try a different search or clear your filters</p>
            <button onClick={() => { setQuery(''); setMinRating(0); setOnlyOpen(false); setOnlyVerified(false); setActiveCategory(null) }} style={{ marginTop: '16px', padding: '11px 22px', background: 'linear-gradient(135deg,#FF6B35,#FF8C61)', border: 'none', borderRadius: '13px', fontSize: '13px', fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>Clear all filters</button>
          </div>
        )}
      </div>

      {/* FILTER DRAWER */}
      {filterOpen && (
        <div onClick={() => setFilterOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '22px 22px 0 0', padding: '22px 22px 38px', width: '100%', maxWidth: '480px' }}>
            <div style={{ width: '38px', height: '4px', background: '#E0E0E0', borderRadius: '2px', margin: '0 auto 18px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '17px', fontWeight: 800, color: '#1C1C1E' }}>{t.filters}</span>
              <span onClick={() => { setMinRating(0); setOnlyOpen(false); setOnlyVerified(false) }} style={{ fontSize: '12px', color: '#FF6B35', fontWeight: 700, cursor: 'pointer' }}>{t.clearAll}</span>
            </div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#AEAEB2', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '9px' }}>Rating</p>
            <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {[[0, t.anyRating], [4, t.above4], [4.5, t.above45], [5, t.fiveOnly]].map(([v, l]) => (
                <button key={v} onClick={() => setMinRating(v)} style={{ padding: '7px 13px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px', fontWeight: 600, background: minRating === v ? '#FF6B35' : '#F5F5F7', color: minRating === v ? '#fff' : '#636366' }}>{l}</button>
              ))}
            </div>
            {[[onlyOpen, setOnlyOpen, `● ${t.openNow}`], [onlyVerified, setOnlyVerified, `✓ ${t.verified}`]].map(([val, setter, label], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #F5F5F7' }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#1C1C1E' }}>{label}</span>
                <div onClick={() => setter(!val)} style={{ width: '46px', height: '26px', borderRadius: '13px', background: val ? '#FF6B35' : '#D1D1D6', cursor: 'pointer', position: 'relative', transition: 'background .2s' }}>
                  <div style={{ position: 'absolute', width: '20px', height: '20px', borderRadius: '50%', background: '#fff', top: '3px', left: val ? '23px' : '3px', transition: 'left .2s', boxShadow: '0 1px 4px rgba(0,0,0,.2)' }} />
                </div>
              </div>
            ))}
            <button onClick={() => setFilterOpen(false)} style={{ width: '100%', marginTop: '18px', padding: '13px', background: 'linear-gradient(135deg,#FF6B35,#FF8C61)', border: 'none', borderRadius: '13px', fontSize: '14px', fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>{t.apply}</button>
          </div>
        </div>
      )}

      {/* BOTTOM NAV */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '480px', background: 'rgba(255,255,255,.97)', borderTop: '1px solid rgba(0,0,0,.07)', display: 'flex', zIndex: 50 }}>
        {[
          { id: 'home', icon: '⊞', label: t.home, path: '/' },
          { id: 'search', icon: '🔍', label: t.search, path: '/search' },
          { id: 'saved', icon: '♡', label: t.saved, path: '/saved' },
          { id: 'messages', icon: '✉', label: t.messages, path: '/messages' },
          { id: 'profile', icon: '◉', label: t.profile, path: '/profile' },
        ].map(item => (
          <button key={item.id} onClick={() => router.push(item.path)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0', fontFamily: 'inherit' }}>
            <span style={{ fontSize: '20px', color: item.id === 'search' ? '#FF6B35' : '#AEAEB2' }}>{item.icon}</span>
            <span style={{ fontSize: '10px', fontWeight: 600, color: item.id === 'search' ? '#FF6B35' : '#AEAEB2' }}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}