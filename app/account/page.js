'use client'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import TX from '@/lib/translations'

const INDIGO = '#4F46E5'
const INDIGO_DARK = '#1C1A4F'
const INDIGO_LIGHT = '#818CF8'
const MINT = '#34D399'
const SOFT = '#EDE9FE'
const BG = '#F5F4FF'
const FONT = "'Nunito', sans-serif"
const GREEN = '#22C55E'
const RED = '#EF4444'
const AMBER = '#F59E0B'
const BLUE = '#3B82F6'

const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

function getTitle(listing) {
  const d = listing.data || {}
  if (listing.type === 'hire_staff') return d.jobTitle
  if (listing.type === 'list_service') return d.serviceName
  return ''
}

export default function AccountPage() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
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
  const isRTL = ['ku', 'fa', 'ar'].includes(lang)
  const t = (TX[lang] || TX.en).account
  const tAccount = TX[lang] || TX.en

  const STATUS_CFG = {
    approved: { label: t.approved, color: GREEN, bg: '#F0FDF4' },
    pending:  { label: t.pending,  color: AMBER,  bg: '#FFFBEB' },
    rejected: { label: t.rejected, color: RED,    bg: '#FEF2F2' },
    paused:   { label: t.paused,   color: BLUE,   bg: '#EFF6FF' },
    filled:   { label: t.filled,   color: '#6B7280', bg: '#F3F4F6' },
  }

  const TYPE_CFG = {
    hire_staff:   { label: t.jobPosting, icon: '👥' },
    list_service: { label: t.service,    icon: '🛠️' },
  }

  useEffect(() => {
    const saved = localStorage.getItem('komek_lang')
    if (saved) setLang(saved)
    const handler = (e) => setLang(e.detail)
    window.addEventListener('langchange', handler)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setPageLoading(false)
      if (session?.user) fetchListings(session.user.id)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchListings(session.user.id)
    })
    return () => { subscription.unsubscribe(); window.removeEventListener('langchange', handler) }
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

  const inpStyle = { width: '100%', padding: '12px 14px', border: `1.5px solid ${SOFT}`, borderRadius: 12, fontSize: 14, fontFamily: FONT, color: INDIGO_DARK, outline: 'none', background: BG, boxSizing: 'border-box' }

  if (pageLoading) return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 36, height: 36, border: `3px solid ${SOFT}`, borderTopColor: INDIGO, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: FONT, direction: isRTL ? 'rtl' : 'ltr', paddingBottom: 80 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes fadeIn { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }`}</style>
      <div style={{ background: `linear-gradient(135deg, ${INDIGO_DARK} 0%, #2D2A7A 100%)`, padding: '40px 20px 56px', textAlign: 'center' }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>👤</div>
        <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 900, margin: '0 0 8px' }}>{t.heroTitle}</h1>
        <p style={{ color: INDIGO_LIGHT, fontSize: 14, fontWeight: 500, margin: 0 }}>{t.heroSub}</p>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 16px', marginTop: -24, animation: 'fadeIn 0.4s ease' }}>
        {!user ? (
          <div>
            <div style={{ display: 'flex', background: '#fff', borderRadius: 16, padding: 4, marginBottom: 16, boxShadow: '0 4px 24px rgba(79,70,229,0.10)' }}>
              {[['login', t.login], ['signup', t.signup]].map(([m, label]) => (
                <button key={m} onClick={() => { setMode(m); setAuthError(''); setAuthSuccess('') }}
                  style={{ flex: 1, padding: '11px 0', borderRadius: 12, background: mode === m ? INDIGO : 'transparent', color: mode === m ? '#fff' : '#9CA3AF', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', transition: 'all 0.2s', fontFamily: FONT }}>
                  {label}
                </button>
              ))}
            </div>
            <div style={{ background: '#fff', borderRadius: 20, padding: '24px 20px', boxShadow: '0 4px 24px rgba(79,70,229,0.10)' }}>
              {authError && <div style={{ background: '#FEF2F2', borderRadius: 10, padding: '12px 14px', marginBottom: 16, color: RED, fontSize: 13, fontWeight: 600 }}>{authError}</div>}
              {authSuccess && <div style={{ background: '#F0FDF4', borderRadius: 10, padding: '12px 14px', marginBottom: 16, color: GREEN, fontSize: 13, fontWeight: 600 }}>{authSuccess}</div>}
              {mode === 'signup' && (
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: INDIGO_DARK, marginBottom: 6 }}>{t.fullName}</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder={t.namePh} style={inpStyle} />
                </div>
              )}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: INDIGO_DARK, marginBottom: 6 }}>{t.email}</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com" style={inpStyle} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: INDIGO_DARK, marginBottom: 6 }}>{t.password}</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={t.passPh} style={inpStyle} />
              </div>
              <button onClick={mode === 'login' ? handleLogin : handleSignup} disabled={authLoading}
                style={{ width: '100%', padding: '14px 0', background: authLoading ? '#E5E7EB' : INDIGO, color: authLoading ? '#9CA3AF' : '#fff', borderRadius: 14, fontSize: 15, fontWeight: 800, border: 'none', cursor: authLoading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', fontFamily: FONT }}>
                {authLoading ? '...' : mode === 'login' ? t.loginBtn : t.signupBtn}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ background: '#fff', borderRadius: 20, padding: '20px', marginBottom: 14, boxShadow: '0 4px 24px rgba(79,70,229,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#9CA3AF', fontSize: 12, fontWeight: 600, margin: '0 0 4px' }}>{t.welcome}</p>
                <h2 style={{ color: INDIGO_DARK, fontSize: 18, fontWeight: 900, margin: 0 }}>{user.user_metadata?.full_name || user.email}</h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 44, height: 44, background: INDIGO, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: '#fff' }}>
                  {(user.user_metadata?.full_name || user.email || '?')[0].toUpperCase()}
                </div>
                <button onClick={handleLogout} style={{ padding: '8px 14px', background: SOFT, color: INDIGO, borderRadius: 20, fontSize: 12, fontWeight: 800, border: 'none', cursor: 'pointer', fontFamily: FONT }}>{t.logout}</button>
              </div>
            </div>
            <button onClick={() => router.push('/post')}
              style={{ width: '100%', padding: '15px 0', background: INDIGO, color: '#fff', borderRadius: 14, fontSize: 15, fontWeight: 800, marginBottom: 24, border: 'none', cursor: 'pointer', transition: 'all 0.2s', fontFamily: FONT }}>
              {t.postNew}
            </button>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: INDIGO_DARK, marginBottom: 14 }}>{t.myListings}</h3>
            {listingsLoading ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <div style={{ width: 32, height: 32, border: `3px solid ${SOFT}`, borderTopColor: INDIGO, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
              </div>
            ) : listings.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: 20, padding: '40px 24px', textAlign: 'center', boxShadow: '0 2px 12px rgba(79,70,229,0.07)' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                <p style={{ color: '#9CA3AF', fontSize: 14, fontWeight: 600 }}>{t.noListings}</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {listings.map(listing => {
                  const typeCfg = TYPE_CFG[listing.type] || { label: listing.type, icon: '📋' }
                  const statusKey = listing.paused ? 'paused' : listing.status
                  const statusCfg = STATUS_CFG[statusKey] || STATUS_CFG.pending
                  const isEditing = editingId === listing.id
                  const isLoading = actionLoading === listing.id
                  const title = getTitle(listing) || t.untitled
                  const editableFields = Object.entries(listing.data || {}).filter(([k]) => !['imageUrls', 'images'].includes(k))
                  return (
                    <div key={listing.id} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(79,70,229,0.07)', overflow: 'hidden' }}>
                      <div style={{ padding: '14px 16px', borderBottom: `1px solid ${SOFT}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 38, height: 38, background: SOFT, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{typeCfg.icon}</div>
                          <div>
                            <p style={{ fontWeight: 800, fontSize: 14, color: INDIGO_DARK, margin: 0 }}>{title}</p>
                            <p style={{ fontSize: 11, color: '#9CA3AF', margin: '2px 0 0' }}>{typeCfg.label}</p>
                          </div>
                        </div>
                        <span style={{ background: statusCfg.bg, color: statusCfg.color, padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 800, whiteSpace: 'nowrap' }}>{statusCfg.label}</span>
                      </div>
                      {listing.status === 'pending' && !listing.paused && (
                        <div style={{ background: '#FFFBEB', padding: '8px 16px', fontSize: 12, color: '#92400E', borderBottom: `1px solid #FDE68A` }}>⏳ {t.pendingNote}</div>
                      )}
                      {listing.status === 'rejected' && (
                        <div style={{ background: '#FEF2F2', padding: '8px 16px', fontSize: 12, color: RED, borderBottom: `1px solid #FECACA` }}>❌ {listing.reject_reason || t.rejected}</div>
                      )}
                      {isEditing && (
                        <div style={{ padding: '14px 16px', background: BG, borderBottom: `1px solid ${SOFT}` }}>
                          <p style={{ fontSize: 12, color: INDIGO, fontWeight: 700, marginBottom: 10 }}>✏️ {t.editNote}</p>
                          {editableFields.map(([key, val]) => (
                            <div key={key} style={{ marginBottom: 10 }}>
                              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#6B7280', marginBottom: 4, textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</label>
                              <input defaultValue={val} onChange={e => setEditData(prev => ({ ...prev, [key]: e.target.value }))}
                                style={{ width: '100%', padding: '9px 12px', border: `1.5px solid ${SOFT}`, borderRadius: 10, fontSize: 13, fontFamily: FONT, direction: 'ltr', outline: 'none', background: '#fff' }} />
                            </div>
                          ))}
                          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                            <button onClick={() => handleSaveEdit(listing)} disabled={isLoading}
                              style={{ flex: 1, padding: '10px 0', background: INDIGO, color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 800, border: 'none', cursor: 'pointer', fontFamily: FONT }}>
                              {isLoading ? '...' : t.saveEdit}
                            </button>
                            <button onClick={() => { setEditingId(null); setEditData({}) }}
                              style={{ padding: '10px 16px', background: SOFT, color: INDIGO, borderRadius: 10, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: FONT }}>
                              {t.cancel}
                            </button>
                          </div>
                        </div>
                      )}
                      <div style={{ padding: '12px 16px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {listing.status === 'approved' && !listing.paused && !isEditing && (
                          <button onClick={() => { setEditingId(listing.id); setEditData({}) }}
                            style={{ padding: '7px 12px', background: '#EFF6FF', color: BLUE, borderRadius: 10, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: FONT }}>✏️ {t.edit}</button>
                        )}
                        {listing.type === 'hire_staff' && listing.status === 'approved' && !listing.paused && (
                          <button onClick={() => handleInstantUpdate(listing, { status: 'filled' })} disabled={isLoading}
                            style={{ padding: '7px 12px', background: '#F0FDF4', color: GREEN, borderRadius: 10, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: FONT }}>
                            {isLoading ? '...' : `✅ ${t.markFilled}`}
                          </button>
                        )}
                        {listing.type === 'list_service' && listing.status === 'approved' && (
                          <button onClick={() => handleInstantUpdate(listing, { paused: !listing.paused })} disabled={isLoading}
                            style={{ padding: '7px 12px', background: listing.paused ? '#EFF6FF' : '#FFF7ED', color: listing.paused ? BLUE : AMBER, borderRadius: 10, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: FONT }}>
                            {isLoading ? '...' : listing.paused ? `▶️ ${t.unpause}` : `⏸️ ${t.pause}`}
                          </button>
                        )}
                        <button onClick={() => handleDelete(listing.id)} disabled={isLoading}
                          style={{ padding: '7px 12px', background: '#FEF2F2', color: RED, borderRadius: 10, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer', marginLeft: 'auto', fontFamily: FONT }}>
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