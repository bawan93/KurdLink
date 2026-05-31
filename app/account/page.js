'use client'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import LangDropdown from "../components/LangDropdown"
'

const NAVY = '#1A2B5F'
const ORANGE = '#FF6B35'
const LIGHT_BG = '#F7F8FC'
const CARD_BG = '#FFFFFF'
const BORDER = '#E8ECF4'
const GREEN = '#22C55E'
const RED = '#EF4444'
const AMBER = '#F59E0B'
const BLUE = '#3B82F6'
const FONT = "'Plus Jakarta Sans', sans-serif"

const STATUS_CFG = {
  sold:     { en: 'Sold',     ku: 'فرۆشراوە', fa: 'فروخته شد',  ar: 'مُباع',        color: '#6B7280', bg: '#F3F4F6' },
  filled:   { en: 'Filled',   ku: 'پڕکراوە',  fa: 'پر شد',      ar: 'مكتمل',        color: '#6B7280', bg: '#F3F4F6' },
  approved: { en: 'Approved', ku: 'پەسەندکراو',fa: 'تأیید شد',  ar: 'موافق عليه',   color: GREEN,     bg: '#F0FDF4' },
  pending:  { en: 'Pending',  ku: 'چاوەڕوانە', fa: 'در انتظار',  ar: 'معلق',         color: AMBER,     bg: '#FFFBEB' },
  rejected: { en: 'Rejected', ku: 'ڕەتکراوە', fa: 'رد شد',      ar: 'مرفوض',        color: RED,       bg: '#FEF2F2' },
  paused:   { en: 'Paused',   ku: 'ڕاگیراوە', fa: 'متوقف',      ar: 'موقوف',        color: BLUE,      bg: '#EFF6FF' },
}

const TYPE_CFG = {
  sell_car:      { en: 'Car Sale',      ku: 'فرۆشتنی ئۆتۆمبێل', fa: 'فروش ماشین',      ar: 'بيع سيارة',       icon: '🚗' },
  sell_business: { en: 'Business Sale', ku: 'فرۆشتنی بازرگانی',  fa: 'فروش کسب‌وکار',   ar: 'بيع عمل تجاري',   icon: '🏢' },
  hire_staff:    { en: 'Job Posting',   ku: 'بڵاوکردنەوەی کار',  fa: 'آگهی شغلی',       ar: 'إعلان وظيفة',     icon: '👥' },
  list_service:  { en: 'Service',       ku: 'خزمەتگوزاری',       fa: 'خدمت',            ar: 'خدمة',            icon: '🎯' },
}

const TX = {
  en: { title: 'My Account', heroTitle: 'Your KurdLink Account', heroSub: 'Log in or create a free account to post listings.', login: 'Log In', signup: 'Create Account', fullName: 'Full Name', email: 'Email', password: 'Password', namePh: 'Your full name', passPh: 'At least 6 characters', loginBtn: 'Log In', signupBtn: 'Create Free Account', logout: 'Log out', welcome: 'Welcome back', postNew: '+ Post a New Listing', myListings: 'My Listings', noListings: "You haven't posted anything yet.", wrongPass: 'Incorrect email or password.', noName: 'Please enter your name.', cantCreate: 'Could not create account.', created: 'Account created! You can now log in.', deleteCfm: 'Are you sure you want to delete this listing?', pendingNote: 'Waiting for admin approval.', edit: 'Edit', markSold: 'Mark as Sold', markFilled: 'Mark as Filled', pause: 'Pause', unpause: 'Unpause', delete: 'Delete', saveEdit: 'Save & Resubmit', cancel: 'Cancel', editNote: 'Edit below — listing will need re-approval after saving.', untitled: 'Untitled' },
  ku: { title: 'ئەکاونتەکەم', heroTitle: 'ئەکاونتی KurdLink ت', heroSub: 'بچۆ ژوورەوە یان ئەکاونتی خۆڕای دروست بکە بۆ بڵاوکردنەوەی لیست.', login: 'چوونەژوورەوە', signup: 'ئەکاونت درووست بکە', fullName: 'ناوی تەواو', email: 'ئیمەیڵ', password: 'پاسوۆرد', namePh: 'ناوی تەواوت', passPh: 'کەمەوە ٦ پیت', loginBtn: 'چوونەژوورەوە', signupBtn: 'ئەکاونتی خۆڕای درووست بکە', logout: 'دەرچوون', welcome: 'بەخێربێیتەوە', postNew: '+ لیستەیەکی نوێ بڵاو بکەرەوە', myListings: 'لیستەکانم', noListings: 'تا ئێستا هیچت بڵاو نەکردوەتەوە.', wrongPass: 'ئیمەیڵ یان پاسوۆرد هەڵەیە.', noName: 'تکایە ناوت بنووسە.', cantCreate: 'نەتوانرا ئەکاونت درووست بکرێت.', created: 'ئەکاونت درووست کرا!', deleteCfm: 'دڵنیایت کە دەتەوێت بسڕیتەوە؟', pendingNote: 'چاوەڕوانی پەسەندکردنی ئەدمینە.', edit: 'دەستکاری', markSold: 'وەک فرۆشراو نیشان بدە', markFilled: 'وەک پڕکراو نیشان بدە', pause: 'ڕاگرتن', unpause: 'دووبارە چالاک بکەرەوە', delete: 'سڕینەوە', saveEdit: 'پاشەکەوت و دووبارە بنێرە', cancel: 'هەڵوەشاندنەوە', editNote: 'دەستکاری بکە — دوای پاشەکەوت پەسەند دەکرێتەوە.', untitled: 'بێ ناو' },
  fa: { title: 'حساب من', heroTitle: 'حساب KurdLink شما', heroSub: 'وارد شوید یا حساب رایگان بسازید تا آگهی ثبت کنید.', login: 'ورود', signup: 'ایجاد حساب', fullName: 'نام کامل', email: 'ایمیل', password: 'رمز عبور', namePh: 'نام کاملت', passPh: 'حداقل ۶ کاراکتر', loginBtn: 'ورود', signupBtn: 'ایجاد حساب رایگان', logout: 'خروج', welcome: 'خوش آمدید', postNew: '+ ثبت آگهی جدید', myListings: 'آگهی‌هایم', noListings: 'هنوز چیزی پست نکرده‌اید.', wrongPass: 'ایمیل یا رمز عبور اشتباه است.', noName: 'لطفاً نامت را وارد کن.', cantCreate: 'نمی‌توان حساب ایجاد کرد.', created: 'حساب ایجاد شد!', deleteCfm: 'مطمئنی که می‌خواهی حذف کنی؟', pendingNote: 'در انتظار تأیید مدیر.', edit: 'ویرایش', markSold: 'علامت‌گذاری به عنوان فروخته شده', markFilled: 'علامت‌گذاری به عنوان پر شده', pause: 'توقف', unpause: 'از سرگیری', delete: 'حذف', saveEdit: 'ذخیره و ارسال مجدد', cancel: 'لغو', editNote: 'ویرایش کن — پس از ذخیره نیاز به تأیید مجدد دارد.', untitled: 'بدون عنوان' },
  ar: { title: 'حسابي', heroTitle: 'حساب KurdLink الخاص بك', heroSub: 'سجّل دخولك أو أنشئ حساباً مجانياً لنشر الإعلانات.', login: 'تسجيل الدخول', signup: 'إنشاء حساب', fullName: 'الاسم الكامل', email: 'البريد الإلكتروني', password: 'كلمة المرور', namePh: 'اسمك الكامل', passPh: '٦ أحرف على الأقل', loginBtn: 'تسجيل الدخول', signupBtn: 'إنشاء حساب مجاني', logout: 'تسجيل الخروج', welcome: 'مرحباً بعودتك', postNew: '+ نشر إعلان جديد', myListings: 'إعلاناتي', noListings: 'لم تنشر أي شيء بعد.', wrongPass: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.', noName: 'يرجى إدخال اسمك.', cantCreate: 'تعذر إنشاء الحساب.', created: 'تم إنشاء الحساب!', deleteCfm: 'هل أنت متأكد من الحذف؟', pendingNote: 'في انتظار موافقة المشرف.', edit: 'تعديل', markSold: 'وضع علامة كمُباع', markFilled: 'وضع علامة كمكتمل', pause: 'إيقاف مؤقت', unpause: 'استئناف', delete: 'حذف', saveEdit: 'حفظ وإعادة الإرسال', cancel: 'إلغاء', editNote: 'قم بالتعديل — سيحتاج إلى إعادة موافقة بعد الحفظ.', untitled: 'بدون عنوان' },
}

function getTitle(listing) {
  const d = listing.data || {}
  if (listing.type === 'list_service') return d.fullName || d.category
  if (listing.type === 'hire_staff') return d.jobTitle
  if (listing.type === 'sell_car') return `${d.make || ''} ${d.model || ''}`.trim()
  if (listing.type === 'sell_business') return d.businessName
  return ''
}

export default function AccountPage() {
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  const router = useRouter()
  const [lang, setLang] = useState('en')
  
  const t = TX[lang] || TX.en

  const [mode, setMode] = useState('login')
  const [user, setUser] = useState(null)
  const [pageLoading, setPageLoading] = useState(true)
  const [listings, setListings] = useState([])
  const [listingsLoading, setListingsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authSuccess, setAuthSuccess] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('kurdlink_lang')
    if (saved) setLang(saved)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setPageLoading(false)
      if (session?.user) fetchListings(session.user.id)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchListings(session.user.id)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function fetchListings(userId) {
    setListingsLoading(true)
    const { data } = await supabase.from('listings').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    setListings(data || [])
    setListingsLoading(false)
  }

  async function handleLogin(e) {
    e.preventDefault(); setAuthLoading(true); setAuthError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setAuthError(t.wrongPass)
    setAuthLoading(false)
  }

  async function handleSignup(e) {
    e.preventDefault(); setAuthLoading(true); setAuthError('')
    if (!name.trim()) { setAuthError(t.noName); setAuthLoading(false); return }
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })
    if (error) { setAuthError(t.cantCreate) } else { setAuthSuccess(t.created); setMode('login') }
    setAuthLoading(false)
  }

  async function handleLogout() { await supabase.auth.signOut(); setUser(null); setListings([]) }

  async function handleInstantUpdate(listing, updates) {
    setActionLoading(listing.id)
    const { error } = await supabase.from('listings').update(updates).eq('id', listing.id)
    if (!error) setListings(prev => prev.map(l => l.id === listing.id ? { ...l, ...updates } : l))
    setActionLoading(null)
  }

  async function handleDelete(id) {
    if (!confirm(t.deleteCfm)) return
    setActionLoading(id)
    await supabase.from('listings').delete().eq('id', id)
    setListings(prev => prev.filter(l => l.id !== id))
    setActionLoading(null)
  }

  async function handleSaveEdit(listing) {
    setActionLoading(listing.id)
    const updatedData = { ...listing.data, ...editData }
    const { error } = await supabase.from('listings').update({ data: updatedData, status: 'pending' }).eq('id', listing.id)
    if (!error) {
      setListings(prev => prev.map(l => l.id === listing.id ? { ...l, data: updatedData, status: 'pending' } : l))
      setEditingId(null); setEditData({})
    }
    setActionLoading(null)
  }

  const inpStyle = { width: '100%', padding: '12px 16px', border: `1.5px solid ${BORDER}`, borderRadius: 12, fontSize: 15, fontFamily: FONT, color: '#1a1a1a', outline: 'none', boxSizing: 'border-box' }

  if (pageLoading) return (
    <div style={{ minHeight: '100vh', background: LIGHT_BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: `3px solid ${BORDER}`, borderTopColor: ORANGE, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: LIGHT_BG, fontFamily: FONT, direction: 'ltr' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes fadeIn { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } } * { box-sizing:border-box; } input,button { font-family:${FONT}; }`}</style>

      {/* Header */}
      <div style={{ background: NAVY, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', position: 'sticky', top: 0, zIndex: 100 }}>
        <span onClick={() => router.push('/home')} style={{ color: '#fff', fontWeight: 800, fontSize: 20, cursor: 'pointer' }}>Kurd<span style={{ color: ORANGE }}>Link</span></span>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <LangDropdown lang={lang} onChange={setLang} />
          {user && <button onClick={handleLogout} style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: 20, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>{t.logout}</button>}
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 16px', animation: 'fadeIn 0.4s ease' }}>
        {!user ? (
          /* AUTH */
          <div>
            <div style={{ background: NAVY, borderRadius: 20, padding: '28px 24px', marginBottom: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🔐</div>
              <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 800, marginBottom: 8 }}>{t.heroTitle}</h1>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 1.6 }}>{t.heroSub}</p>
            </div>
            <div style={{ display: 'flex', background: CARD_BG, borderRadius: 14, padding: 4, marginBottom: 20, border: `1px solid ${BORDER}` }}>
              {[['login', t.login], ['signup', t.signup]].map(([m, label]) => (
                <button key={m} onClick={() => { setMode(m); setAuthError(''); setAuthSuccess('') }} style={{ flex: 1, padding: '10px 0', borderRadius: 10, background: mode === m ? NAVY : 'transparent', color: mode === m ? '#fff' : '#666', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}>{label}</button>
              ))}
            </div>
            <div style={{ background: CARD_BG, borderRadius: 20, padding: '28px 24px', border: `1px solid ${BORDER}` }}>
              {authError && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 16px', marginBottom: 16, color: RED, fontSize: 14 }}>{authError}</div>}
              {authSuccess && <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: '12px 16px', marginBottom: 16, color: GREEN, fontSize: 14 }}>{authSuccess}</div>}
              {mode === 'signup' && (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>{t.fullName}</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder={t.namePh} style={inpStyle} />
                </div>
              )}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>{t.email}</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com" style={inpStyle} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>{t.password}</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={t.passPh} style={inpStyle} />
              </div>
              <button onClick={mode === 'login' ? handleLogin : handleSignup} disabled={authLoading} style={{ width: '100%', padding: '14px 0', background: authLoading ? '#ccc' : ORANGE, color: '#fff', borderRadius: 14, fontSize: 16, fontWeight: 800, border: 'none', cursor: 'pointer' }}>
                {authLoading ? '...' : mode === 'login' ? t.loginBtn : t.signupBtn}
              </button>
            </div>
          </div>
        ) : (
          /* DASHBOARD */
          <div>
            <div style={{ background: NAVY, borderRadius: 20, padding: '24px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 4 }}>{t.welcome}</p>
                <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>{user.user_metadata?.full_name || user.email}</h2>
              </div>
              <div style={{ width: 48, height: 48, background: ORANGE, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: '#fff' }}>
                {(user.user_metadata?.full_name || user.email || '?')[0].toUpperCase()}
              </div>
            </div>

            <button onClick={() => router.push('/post')} style={{ width: '100%', padding: '14px 0', background: ORANGE, color: '#fff', borderRadius: 14, fontSize: 15, fontWeight: 800, marginBottom: 28, border: 'none', cursor: 'pointer' }}>
              {t.postNew}
            </button>

            <h3 style={{ fontSize: 17, fontWeight: 800, color: NAVY, marginBottom: 16 }}>{t.myListings}</h3>

            {listingsLoading ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <div style={{ width: 32, height: 32, border: `3px solid ${BORDER}`, borderTopColor: ORANGE, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
              </div>
            ) : listings.length === 0 ? (
              <div style={{ background: CARD_BG, borderRadius: 20, padding: '40px 24px', textAlign: 'center', border: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                <p style={{ color: '#888', fontSize: 15 }}>{t.noListings}</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {listings.map(listing => {
                  const typeCfg = TYPE_CFG[listing.type] || { en: listing.type, ku: listing.type, fa: listing.type, ar: listing.type, icon: '📋' }
                  const statusKey = listing.paused ? 'paused' : listing.status
                  const statusCfg = STATUS_CFG[statusKey] || STATUS_CFG.pending
                  const isEditing = editingId === listing.id
                  const isLoading = actionLoading === listing.id
                  const title = getTitle(listing) || t.untitled

                  // Fields to show in edit form — exclude internal fields
                  const editableFields = Object.entries(listing.data || {}).filter(([k]) =>
                    !['imageUrls', 'images', 'email', 'name'].includes(k)
                  )

                  return (
                    <div key={listing.id} style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
                      {/* Card header */}
                      <div style={{ padding: '16px 18px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 22 }}>{typeCfg.icon}</span>
                          <div>
                            <p style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a', margin: 0 }}>{title}</p>
                            <p style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{typeCfg[lang] || typeCfg.en}</p>
                          </div>
                        </div>
                        <div style={{ background: statusCfg.bg, color: statusCfg.color, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>
                          {statusCfg[lang] || statusCfg.en}
                        </div>
                      </div>

                      {/* Notices */}
                      {listing.status === 'pending' && !listing.paused && (
                        <div style={{ background: '#FFFBEB', padding: '10px 18px', fontSize: 13, color: '#92400E', borderBottom: `1px solid ${BORDER}` }}>⏳ {t.pendingNote}</div>
                      )}
                      {listing.status === 'rejected' && (
                        <div style={{ background: '#FEF2F2', padding: '10px 18px', fontSize: 13, color: RED, borderBottom: `1px solid ${BORDER}` }}>❌ {listing.reject_reason || 'Rejected'}</div>
                      )}

                      {/* Edit form */}
                      {isEditing && (
                        <div style={{ padding: '16px 18px', background: '#F8FAFF', borderBottom: `1px solid ${BORDER}` }}>
                          <p style={{ fontSize: 13, color: NAVY, fontWeight: 700, marginBottom: 12 }}>✏️ {t.editNote}</p>
                          {editableFields.map(([key, val]) => (
                            <div key={key} style={{ marginBottom: 12 }}>
                              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 4, textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</label>
                              <input defaultValue={val} onChange={e => setEditData(prev => ({ ...prev, [key]: e.target.value }))} style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${BORDER}`, borderRadius: 10, fontSize: 14, fontFamily: FONT, direction: 'ltr' }} />
                            </div>
                          ))}
                          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                            <button onClick={() => handleSaveEdit(listing)} disabled={isLoading} style={{ flex: 1, padding: '10px 0', background: NAVY, color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer' }}>{isLoading ? '...' : t.saveEdit}</button>
                            <button onClick={() => { setEditingId(null); setEditData({}) }} style={{ padding: '10px 16px', background: BORDER, color: '#444', borderRadius: 10, fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer' }}>{t.cancel}</button>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div style={{ padding: '14px 18px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {/* Edit — available for all approved listings */}
                        {listing.status === 'approved' && !listing.paused && !isEditing && (
                          <button onClick={() => { setEditingId(listing.id); setEditData({}) }} style={{ padding: '8px 14px', background: '#EFF6FF', color: BLUE, borderRadius: 10, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer' }}>✏️ {t.edit}</button>
                        )}
                        {/* Mark as Sold — cars & businesses */}
                        {['sell_car', 'sell_business'].includes(listing.type) && listing.status === 'approved' && !listing.paused && (
                          <button onClick={() => handleInstantUpdate(listing, { status: 'sold' })} disabled={isLoading} style={{ padding: '8px 14px', background: '#F0FDF4', color: GREEN, borderRadius: 10, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer' }}>{isLoading ? '...' : `✅ ${t.markSold}`}</button>
                        )}
                        {/* Mark as Filled — jobs */}
                        {listing.type === 'hire_staff' && listing.status === 'approved' && !listing.paused && (
                          <button onClick={() => handleInstantUpdate(listing, { status: 'filled' })} disabled={isLoading} style={{ padding: '8px 14px', background: '#F0FDF4', color: GREEN, borderRadius: 10, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer' }}>{isLoading ? '...' : `✅ ${t.markFilled}`}</button>
                        )}
                        {/* Pause/Unpause — services */}
                        {listing.type === 'list_service' && listing.status === 'approved' && (
                          <button onClick={() => handleInstantUpdate(listing, { paused: !listing.paused })} disabled={isLoading} style={{ padding: '8px 14px', background: listing.paused ? '#EFF6FF' : '#FFF7ED', color: listing.paused ? BLUE : AMBER, borderRadius: 10, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                            {isLoading ? '...' : listing.paused ? `▶️ ${t.unpause}` : `⏸️ ${t.pause}`}
                          </button>
                        )}
                        {/* Delete */}
                        <button onClick={() => handleDelete(listing.id)} disabled={isLoading} style={{ padding: '8px 14px', background: '#FEF2F2', color: RED, borderRadius: 10, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', marginLeft: 'auto' }}>
                          {isLoading ? '...' : `🗑️ ${t.delete}`}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}