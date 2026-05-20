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
  { id: 1, av: 'A', color: '#FF6B35', type: 0, rating: 4.9, rc: 128, verified: true, open: true, dist: '1.2 mi', name: { en: 'Ahmad & Co Law', ku: 'ئەحمەد و هاوکارەکانی', ar: 'أحمد ومشاركوه' }, btype: { en: 'Immigration Lawyer', ku: 'پارێزەری کۆچبەری', ar: 'محامي هجرة' }, tags: { en: ['Kurdish Speaking', 'Visa', 'Asylum'], ku: ['کوردی قسەدەکات', 'ڤیزا', 'پەناگەرایەتی'], ar: ['يتحدث الكردية', 'تأشيرة', 'لجوء'] } },
  { id: 2, av: 'S', color: '#4ECDC4', type: 1, rating: 4.8, rc: 94, verified: true, open: true, dist: '2.1 mi', name: { en: 'Dr. Sara Karim', ku: 'دکتۆر سارا کەریم', ar: 'د. سارة كريم' }, btype: { en: 'GP • Healthcare', ku: 'دکتۆر • تەندروستی', ar: 'طبيب عام' }, tags: { en: ['Kurdish Speaking', 'NHS', 'Private'], ku: ['کوردی قسەدەکات', 'NHS', 'تایبەت'], ar: ['يتحدث الكردية', 'خدمة صحية', 'خاص'] } },
  { id: 3, av: 'R', color: '#C77DFF', type: 2, rating: 5.0, rc: 61, verified: true, open: false, dist: '3.4 mi', name: { en: 'Renas Accountancy', ku: 'ژمێریاری ڕێناس', ar: 'شركة رينا للمحاسبة' }, btype: { en: 'Chartered Accountant', ku: 'ژمێریاری مەزوون', ar: 'محاسب قانوني' }, tags: { en: ['Tax Returns', 'Self-Employed'], ku: ['داوای باج', 'خۆکار'], ar: ['إقرار ضريبي', 'عمل حر'] } },
  { id: 4, av: 'A', color: '#96CEB4', type: 3, rating: 4.7, rc: 43, verified: false, open: true, dist: '4.7 mi', name: { en: 'Ari Driving School', ku: 'قوتابخانەی شوفێری ئاری', ar: 'مدرسة أري للقيادة' }, btype: { en: 'Driving Instructor', ku: 'مامۆستای شوفێری', ar: 'مدرب قيادة' }, tags: { en: ['Manual', 'Automatic'], ku: ['دەستی', 'ئۆتۆماتیک'], ar: ['يدوي', 'أوتوماتيك'] } },
  { id: 5, av: 'B', color: '#E76F51', type: 4, rating: 4.9, rc: 87, verified: true, open: true, dist: '1.8 mi', name: { en: 'Baran Translation', ku: 'وەرگێڕانی باران', ar: 'ترجمة باران' }, btype: { en: 'Certified Translator', ku: 'وەرگێڕی مەزوون', ar: 'مترجم معتمد' }, tags: { en: ['Legal', 'Medical'], ku: ['یاسایی', 'پزیشکی'], ar: ['قانوني', 'طبي'] } },
]

const TX = {
  en: { dir: 'ltr', greeting: 'Good morning 👋', hero: ['Find trusted Kurdish', 'professionals near you'], searchPh: 'Lawyers, doctors, accountants…', categories: 'Categories', seeAll: 'See all', featured: 'Featured', nearby: 'Near You', verified: '✓ Verified', openNow: 'Open Now', closed: 'Closed', reviews: 'reviews', viewProfile: 'View Profile →', kurdishSp: 'Kurdish Speaking', listBiz: 'List Your Business Free →', bizCta: '🚀 For Business Owners', bizCtaTitle: 'First 100 businesses get listed FREE', bizCtaDesc: 'Reach thousands of Kurdish customers across the UK.', home: 'Home', search: 'Search', saved: 'Saved', messages: 'Messages', profile: 'Profile' },
  ku: { dir: 'rtl', greeting: 'بەیانیت باش 👋', hero: ['پیشەیە متمانەپێکراوەکان', 'بدۆزەرەوە نزیکت'], searchPh: 'پارێزەر، دکتۆر، ژمێریار…', categories: 'پۆلەکان', seeAll: 'هەموو ببینە', featured: 'تایبەت', nearby: 'نزیکت', verified: '✓ دڵنیاکراوە', openNow: 'ئێستا کراوەیە', closed: 'داخراوە', reviews: 'نرخاندن', viewProfile: '→ پرۆفایل ببینە', kurdishSp: 'کوردی قسەدەکات', listBiz: '← کاروبارەکەت خۆڕایی تۆمار بکە', bizCta: '🚀 بۆ کاروبارەکان', bizCtaTitle: '١٠٠ کاروباری یەکەم خۆڕایی تۆمار دەکرێن', bizCtaDesc: 'بگەنە هەزاران کڕیاری کوردی لەسەرانسەری وەڵات.', home: 'سەرەکی', search: 'گەڕان', saved: 'پاشەکەوت', messages: 'نامە', profile: 'پرۆفایل' },
  ar: { dir: 'rtl', greeting: 'صباح الخير 👋', hero: ['ابحث عن محترفين كرد', 'موثوقين بالقرب منك'], searchPh: 'محامون، أطباء، محاسبون…', categories: 'الفئات', seeAll: 'عرض الكل', featured: 'مميز', nearby: 'بالقرب منك', verified: '✓ موثق', openNow: 'مفتوح الآن', closed: 'مغلق', reviews: 'تقييمات', viewProfile: '→ عرض الملف', kurdishSp: 'يتحدث الكردية', listBiz: '← أدرج عملك مجاناً', bizCta: '🚀 لأصحاب الأعمال', bizCtaTitle: 'أول ١٠٠ شركة تُدرج مجاناً', bizCtaDesc: 'تواصل مع آلاف العملاء الكرد في جميع أنحاء المملكة المتحدة.', home: 'الرئيسية', search: 'بحث', saved: 'المحفوظة', messages: 'الرسائل', profile: 'الملف' },
}

const stars = (n) => '★'.repeat(Math.floor(n)) + '☆'.repeat(5 - Math.floor(n))
const HEADING = "'Plus Jakarta Sans', sans-serif"

export default function Home() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const [tab, setTab] = useState('home')
  const [saved, setSaved] = useState([])
  const t = TX[lang]
  const isRtl = t.dir === 'rtl'
  const toggleSave = (id) => setSaved(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', background: '#F5F5F7', fontFamily: isRtl ? "'Noto Sans Arabic', sans-serif" : "'DM Sans', sans-serif", direction: t.dir, position: 'relative' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=DM+Sans:wght@400;500;600;700;800&family=Noto+Sans+Arabic:wght@400;600;700;800&display=swap" rel="stylesheet" />

      {/* TOP BAR */}
      <div style={{ background: '#fff', padding: '0 16px', height: '58px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,.07)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg,#FF6B35,#FF8C61)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 4L11 12L5 20H9L15 12L9 4H5Z" fill="white" /><path d="M14 8L17 12L14 16H18L21 12L18 8H14Z" fill="white" opacity=".55" /></svg>
          </div>
          <span style={{ fontFamily: HEADING, fontSize: '18px', fontWeight: 800, color: '#1C1C1E' }}>Kurd<span style={{ color: '#FF6B35' }}>Link</span></span>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <div style={{ display: 'flex', background: '#F5F5F7', borderRadius: '50px', padding: '3px', gap: '2px' }}>
            {['en', 'ku', 'ar'].map(l => (
              <button key={l} onClick={() => setLang(l)} style={{ padding: '4px 9px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 700, fontFamily: 'inherit', background: lang === l ? '#FF6B35' : 'transparent', color: lang === l ? '#fff' : '#636366', transition: 'all .2s' }}>{l.toUpperCase()}</button>
            ))}
          </div>
          <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'linear-gradient(135deg,#FF6B35,#FF8C61)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: '#fff', cursor: 'pointer' }}>J</div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: '20px 16px 80px', overflowY: 'auto' }}>
        <p style={{ fontSize: '12px', color: '#8E8E93', marginBottom: '4px' }}>{t.greeting}</p>
        <h1 style={{ fontFamily: HEADING, fontSize: '22px', fontWeight: 800, color: '#1C1C1E', lineHeight: 1.25, marginBottom: '18px' }}>{t.hero[0]}<br />{t.hero[1]}</h1>

        <div style={{ background: '#fff', borderRadius: '14px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 12px rgba(0,0,0,.07)', marginBottom: '24px', border: '2px solid transparent', transition: 'border-color .2s' }}>
          <span style={{ fontSize: '16px', color: '#AEAEB2' }}>🔍</span>
          <input placeholder={t.searchPh} onFocus={e => e.currentTarget.parentElement.style.borderColor='#FF6B35'} onBlur={e => e.currentTarget.parentElement.style.borderColor='transparent'} style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px', color: '#1C1C1E', background: 'transparent', direction: t.dir, fontFamily: 'inherit' }} />
        </div>

        {/* Categories */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '13px' }}>
            <span style={{ fontFamily: HEADING, fontSize: '17px', fontWeight: 700, color: '#1C1C1E' }}>{t.categories}</span>
            <span onClick={() => router.push('/search')} style={{ fontSize: '12px', fontWeight: 600, color: '#FF6B35', cursor: 'pointer' }}>{t.seeAll}</span>
          </div>
          <div style={{ display: 'flex', overflowX: 'auto', gap: '12px', paddingBottom: '4px', scrollbarWidth: 'none' }}>
            {CATEGORIES.map((cat, i) => (
              <div key={i} onClick={() => router.push('/search')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', flexShrink: 0, cursor: 'pointer', minWidth: '54px' }}>
                <div style={{ width: '54px', height: '54px', borderRadius: '16px', background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '23px' }}>{cat.icon}</div>
                <span style={{ fontSize: '10px', fontWeight: 600, color: '#636366', whiteSpace: 'nowrap', textAlign: 'center' }}>{cat[lang]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Featured */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '13px' }}>
            <span style={{ fontFamily: HEADING, fontSize: '17px', fontWeight: 700, color: '#1C1C1E' }}>{t.featured}</span>
            <span onClick={() => router.push('/search')} style={{ fontSize: '12px', fontWeight: 600, color: '#FF6B35', cursor: 'pointer' }}>{t.seeAll}</span>
          </div>
          <div style={{ display: 'flex', overflowX: 'auto', gap: '13px', paddingBottom: '8px', scrollbarWidth: 'none' }}>
            {BUSINESSES.slice(0, 3).map(b => (
              <div key={b.id} onClick={() => router.push(`/business/${b.id}`)} style={{ flexShrink: 0, width: '265px', background: '#fff', borderRadius: '20px', padding: '17px', position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,.08)', cursor: 'pointer' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: `linear-gradient(90deg,${b.color},${b.color}55)`, borderRadius: '20px 20px 0 0' }} />
                <button onClick={e => { e.stopPropagation(); toggleSave(b.id) }} style={{ position: 'absolute', top: '13px', right: '13px', width: '29px', height: '29px', borderRadius: '50%', border: 'none', cursor: 'pointer', background: saved.includes(b.id) ? '#FFF0EB' : '#F5F5F7', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: saved.includes(b.id) ? '#FF6B35' : '#AEAEB2' }}>{saved.includes(b.id) ? '♥' : '♡'}</button>
                <div style={{ display: 'flex', gap: '9px', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '13px', background: `linear-gradient(135deg,${b.color},${b.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>{b.av}</div>
                  <div>
                    <div style={{ fontFamily: HEADING, fontWeight: 700, fontSize: '13px', color: '#1C1C1E', marginBottom: '2px' }}>{b.name[lang]}</div>
                    <div style={{ fontSize: '11px', color: '#8E8E93', marginBottom: '3px' }}>{b.btype[lang]}</div>
                    {b.verified && <span style={{ background: '#E6F9F5', color: '#1DB87A', fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '50px' }}>{t.verified}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                  <span style={{ color: '#F4A261', fontSize: '11px' }}>{stars(b.rating)}</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#1C1C1E' }}>{b.rating}</span>
                  <span style={{ fontSize: '11px', color: '#AEAEB2' }}>({b.rc} {t.reviews})</span>
                </div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '11px' }}>
                  {b.tags[lang].map((tag, i) => <span key={i} style={{ fontSize: '10px', fontWeight: 600, background: '#F5F5F7', color: '#555', padding: '3px 8px', borderRadius: '50px' }}>{tag}</span>)}
                </div>
                <button style={{ width: '100%', padding: '10px', background: 'linear-gradient(135deg,#FF6B35,#FF8C61)', border: 'none', borderRadius: '12px', fontSize: '12px', fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>{t.viewProfile}</button>
              </div>
            ))}
          </div>
        </div>

        {/* Nearby */}
        <div style={{ marginBottom: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '13px' }}>
            <span style={{ fontFamily: HEADING, fontSize: '17px', fontWeight: 700, color: '#1C1C1E' }}>{t.nearby}</span>
            <span onClick={() => router.push('/search')} style={{ fontSize: '12px', fontWeight: 600, color: '#FF6B35', cursor: 'pointer' }}>{t.seeAll}</span>
          </div>
          {BUSINESSES.slice(3, 5).map(b => (
            <div key={b.id} onClick={() => router.push(`/business/${b.id}`)} style={{ background: '#fff', borderRadius: '16px', padding: '13px', display: 'flex', gap: '11px', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,.05)', marginBottom: '10px', cursor: 'pointer' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '13px', background: `linear-gradient(135deg,${b.color},${b.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>{b.av}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: HEADING, fontWeight: 700, fontSize: '13px', color: '#1C1C1E', marginBottom: '1px' }}>{b.name[lang]}</div>
                <div style={{ fontSize: '11px', color: '#8E8E93', marginBottom: '2px' }}>{b.btype[lang]}</div>
                <span style={{ color: '#F4A261', fontSize: '11px' }}>{stars(b.rating)}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#FF6B35', background: '#FFF0EB', padding: '3px 8px', borderRadius: '50px' }}>📍 {b.dist}</span>
                <button onClick={e => { e.stopPropagation(); toggleSave(b.id) }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: saved.includes(b.id) ? '#FF6B35' : '#AEAEB2' }}>{saved.includes(b.id) ? '♥' : '♡'}</button>
              </div>
            </div>
          ))}
        </div>

        {/* Biz CTA */}
        <div style={{ background: 'linear-gradient(135deg,#1C1C2E,#2D1B4E)', borderRadius: '19px', padding: '22px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,107,53,.18)', filter: 'blur(25px)', pointerEvents: 'none' }} />
          <p style={{ fontSize: '10px', fontWeight: 800, color: '#FF6B35', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '5px' }}>{t.bizCta}</p>
          <p style={{ fontFamily: HEADING, fontSize: '16px', fontWeight: 800, color: '#fff', lineHeight: 1.3, marginBottom: '6px' }}>{t.bizCtaTitle}</p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,.5)', marginBottom: '13px' }}>{t.bizCtaDesc}</p>
          <button style={{ background: 'linear-gradient(135deg,#FF6B35,#FF8C61)', border: 'none', borderRadius: '11px', padding: '11px 18px', fontSize: '12px', fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>{t.listBiz}</button>
        </div>
      </div>

      {/* BOTTOM NAV */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '480px', background: 'rgba(255,255,255,.97)', borderTop: '1px solid rgba(0,0,0,.07)', display: 'flex', zIndex: 50 }}>
        {[
          { id: 'home', icon: '⊞', label: t.home, path: '/' },
          { id: 'search', icon: '🔍', label: t.search, path: '/search' },
          { id: 'saved', icon: '♡', label: t.saved, path: '/saved' },
          { id: 'messages', icon: '✉', label: t.messages, path: '/messages' },
          { id: 'profile', icon: '◉', label: t.profile, path: '/profile' },
        ].map(item => (
          <button key={item.id} onClick={() => { setTab(item.id); router.push(item.path) }} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0', fontFamily: 'inherit' }}>
            <span style={{ fontSize: '20px', color: tab === item.id ? '#FF6B35' : '#AEAEB2' }}>{item.icon}</span>
            <span style={{ fontSize: '10px', fontWeight: 600, color: tab === item.id ? '#FF6B35' : '#AEAEB2' }}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}