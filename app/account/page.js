'use client';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

const NAV_H = 64;
const NAVY = '#1A2B5F';
const ORANGE = '#FF6B35';
const LIGHT_BG = '#F7F8FC';
const CARD_BG = '#FFFFFF';
const BORDER = '#E8ECF4';
const GREEN = '#22C55E';
const RED = '#EF4444';
const AMBER = '#F59E0B';
const BLUE = '#3B82F6';

const STATUS_CONFIG = {
  approved: { label: 'Approved', labelKu: 'پەسەندکراو', color: GREEN, bg: '#F0FDF4' },
  pending: { label: 'Pending', labelKu: 'چاوەڕوانە', color: AMBER, bg: '#FFFBEB' },
  rejected: { label: 'Rejected', labelKu: 'ڕەتکراوە', color: RED, bg: '#FEF2F2' },
  paused: { label: 'Paused', labelKu: 'ڕاگیراوە', color: BLUE, bg: '#EFF6FF' },
};

const TYPE_CONFIG = {
  'sell-car': { label: 'Car Sale', labelKu: 'فرۆشتنی ئۆتۆمبێل', icon: '🚗' },
  'sell-business': { label: 'Business Sale', labelKu: 'فرۆشتنی بازرگانی', icon: '🏢' },
  'hire-staff': { label: 'Staff Hire', labelKu: 'کرێکارگرتن', icon: '👥' },
  'list-service': { label: 'Service', labelKu: 'خزمەتگوزاری', icon: '🛠️' },
};

export default function AccountPage() {
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const router = useRouter();

  const [lang, setLang] = useState('en');
  const isKu = lang === 'ku';
  const t = (en, ku) => isKu ? ku : en;

  const [mode, setMode] = useState('login'); // login | signup
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) fetchListings(session.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchListings(session.user.id);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function fetchListings(userId) {
    setListingsLoading(true);
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (!error) setListings(data || []);
    setListingsLoading(false);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(t('Incorrect email or password. Please try again.', 'ئیمەیڵ یان پاسوۆرد هەڵەیە. دووبارە هەوڵبدەرەوە.'));
    setAuthLoading(false);
  }

  async function handleSignup(e) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    if (!name.trim()) {
      setAuthError(t('Please enter your name.', 'تکایە ناوت بنووسە.'));
      setAuthLoading(false);
      return;
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    });
    if (error) {
      setAuthError(t('Could not create account. Try a different email.', 'نەتوانرا ئەکاونت درووست بکرێت. ئیمەیڵێکی تر بکەرەوە.'));
    } else {
      setAuthSuccess(t('Account created! You can now log in.', 'ئەکاونت درووست کرا! ئێستا دەتوانی بچیتە ژوورەوە.'));
      setMode('login');
    }
    setAuthLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setListings([]);
  }

  async function handleInstantUpdate(listing, updates) {
    setActionLoading(listing.id);
    const { error } = await supabase
      .from('listings')
      .update(updates)
      .eq('id', listing.id);
    if (!error) {
      setListings(prev => prev.map(l => l.id === listing.id ? { ...l, ...updates } : l));
    }
    setActionLoading(null);
  }

  async function handleDelete(listingId) {
    if (!confirm(t('Are you sure you want to delete this listing?', 'دڵنیایت کە دەتەوێت ئەم لیستەیە بسڕیتەوە؟'))) return;
    setActionLoading(listingId);
    const { error } = await supabase.from('listings').delete().eq('id', listingId);
    if (!error) setListings(prev => prev.filter(l => l.id !== listingId));
    setActionLoading(null);
  }

  async function handleSaveEdit(listing) {
    setActionLoading(listing.id);
    const updatedData = { ...listing.data, ...editData };
    const { error } = await supabase
      .from('listings')
      .update({ data: updatedData, status: 'pending' })
      .eq('id', listing.id);
    if (!error) {
      setListings(prev => prev.map(l => l.id === listing.id ? { ...l, data: updatedData, status: 'pending' } : l));
      setEditingId(null);
      setEditData({});
    }
    setActionLoading(null);
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: LIGHT_BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: `3px solid ${BORDER}`, borderTopColor: ORANGE, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: LIGHT_BG, fontFamily: "'Plus Jakarta Sans', sans-serif", direction: isKu ? 'rtl' : 'ltr' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input { outline: none; }
        button { cursor: pointer; border: none; }
      `}</style>

      {/* Header */}
      <div style={{ background: NAVY, height: NAV_H, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', position: 'sticky', top: 0, zIndex: 100 }}>
        <span onClick={() => router.push('/home')} style={{ color: '#fff', fontWeight: 800, fontSize: 20, cursor: 'pointer' }}>
          Kurd<span style={{ color: ORANGE }}>Link</span>
        </span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Language Toggle */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 3 }}>
            {['en', 'ku'].map(l => (
              <button key={l} onClick={() => setLang(l)} style={{ padding: '4px 12px', borderRadius: 16, background: lang === l ? '#fff' : 'transparent', color: lang === l ? NAVY : '#fff', fontWeight: 700, fontSize: 12, transition: 'all 0.2s' }}>
                {l === 'en' ? 'EN' : 'کوردی'}
              </button>
            ))}
          </div>
          {user && (
            <button onClick={handleLogout} style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
              {t('Log out', 'دەرچوون')}
            </button>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 16px', animation: 'fadeIn 0.4s ease' }}>

        {!user ? (
          /* ─── AUTH SECTION ─── */
          <div>
            {/* Hero message */}
            <div style={{ background: NAVY, borderRadius: 20, padding: '28px 24px', marginBottom: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🔐</div>
              <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
                {t('Your KurdLink Account', 'ئەکاونتی KurdLink ت')}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 1.6 }}>
                {t(
                  'Want to post a job, sell a car, list a service, or sell a business? You need a free account first. Browsing is free for everyone.',
                  'دەتەوێت کار بڵاو بکەیتەوە، ئۆتۆمبێل بفرۆشیت، خزمەتگوزاری تۆمار بکەیت، یان بازرگانی بفرۆشیت؟ پێویستت بە ئەکاونتی خۆڕایە. بینینی بۆ هەموو کەس خۆڕاییە.'
                )}
              </p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', background: CARD_BG, borderRadius: 14, padding: 4, marginBottom: 20, border: `1px solid ${BORDER}` }}>
              {[['login', t('Log In', 'چوونەژوورەوە')], ['signup', t('Create Account', 'ئەکاونت درووست بکە')]].map(([m, label]) => (
                <button key={m} onClick={() => { setMode(m); setAuthError(''); setAuthSuccess(''); }} style={{ flex: 1, padding: '10px 0', borderRadius: 10, background: mode === m ? NAVY : 'transparent', color: mode === m ? '#fff' : '#666', fontWeight: 700, fontSize: 14, transition: 'all 0.2s', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {label}
                </button>
              ))}
            </div>

            {/* Form */}
            <div style={{ background: CARD_BG, borderRadius: 20, padding: '28px 24px', border: `1px solid ${BORDER}` }}>
              {authError && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 16px', marginBottom: 16, color: RED, fontSize: 14, fontWeight: 500 }}>
                  {authError}
                </div>
              )}
              {authSuccess && (
                <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: '12px 16px', marginBottom: 16, color: GREEN, fontSize: 14, fontWeight: 500 }}>
                  {authSuccess}
                </div>
              )}

              {mode === 'signup' && (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>{t('Full Name', 'ناوی تەواو')}</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder={t('Your full name', 'ناوی تەواوت')} style={{ width: '100%', padding: '12px 16px', border: `1.5px solid ${BORDER}`, borderRadius: 12, fontSize: 15, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1a1a1a' }} />
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>{t('Email Address', 'ئیمەیڵ')}</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com" style={{ width: '100%', padding: '12px 16px', border: `1.5px solid ${BORDER}`, borderRadius: 12, fontSize: 15, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1a1a1a' }} />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>{t('Password', 'پاسوۆرد')}</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={t('At least 6 characters', 'کەمەوە 6 پیت')} style={{ width: '100%', padding: '12px 16px', border: `1.5px solid ${BORDER}`, borderRadius: 12, fontSize: 15, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1a1a1a' }} />
              </div>

              <button
                onClick={mode === 'login' ? handleLogin : handleSignup}
                disabled={authLoading}
                style={{ width: '100%', padding: '14px 0', background: authLoading ? '#ccc' : ORANGE, color: '#fff', borderRadius: 14, fontSize: 16, fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'all 0.2s' }}
              >
                {authLoading ? '...' : mode === 'login' ? t('Log In', 'چوونەژوورەوە') : t('Create Free Account', 'ئەکاونتی خۆڕای درووست بکە')}
              </button>
            </div>
          </div>

        ) : (
          /* ─── DASHBOARD ─── */
          <div>
            {/* Welcome */}
            <div style={{ background: NAVY, borderRadius: 20, padding: '24px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 4 }}>{t('Welcome back', 'بەخێربێیتەوە')}</p>
                <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>{user.user_metadata?.full_name || user.email}</h2>
              </div>
              <div style={{ width: 48, height: 48, background: ORANGE, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: '#fff' }}>
                {(user.user_metadata?.full_name || user.email || '?')[0].toUpperCase()}
              </div>
            </div>

            {/* Post new button */}
            <button onClick={() => router.push('/post')} style={{ width: '100%', padding: '14px 0', background: ORANGE, color: '#fff', borderRadius: 14, fontSize: 15, fontWeight: 800, marginBottom: 28, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              + {t('Post a New Listing', 'لیستەیەکی نوێ بڵاو بکەرەوە')}
            </button>

            {/* Listings */}
            <h3 style={{ fontSize: 17, fontWeight: 800, color: NAVY, marginBottom: 16 }}>
              {t('My Listings', 'لیستەکانم')}
            </h3>

            {listingsLoading ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <div style={{ width: 32, height: 32, border: `3px solid ${BORDER}`, borderTopColor: ORANGE, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
              </div>
            ) : listings.length === 0 ? (
              <div style={{ background: CARD_BG, borderRadius: 20, padding: '40px 24px', textAlign: 'center', border: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                <p style={{ color: '#888', fontSize: 15 }}>{t("You haven't posted anything yet.", 'تا ئێستا هیچت بڵاو نەکردوەتەوە.')}</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {listings.map(listing => {
                  const typeConfig = TYPE_CONFIG[listing.type] || { label: listing.type, icon: '📋', labelKu: listing.type };
                  const statusConfig = STATUS_CONFIG[listing.paused ? 'paused' : listing.status] || STATUS_CONFIG.pending;
                  const isEditing = editingId === listing.id;
                  const isLoading = actionLoading === listing.id;
                  const title = listing.data?.title || listing.data?.make || listing.data?.position || listing.data?.businessType || t('Untitled', 'بێ ناو');

                  return (
                    <div key={listing.id} style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${BORDER}`, overflow: 'hidden', animation: 'fadeIn 0.3s ease' }}>

                      {/* Card header */}
                      <div style={{ padding: '16px 18px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 22 }}>{typeConfig.icon}</span>
                          <div>
                            <p style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a' }}>{title}</p>
                            <p style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{isKu ? typeConfig.labelKu : typeConfig.label}</p>
                          </div>
                        </div>
                        <div style={{ background: statusConfig.bg, color: statusConfig.color, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>
                          {isKu ? statusConfig.labelKu : statusConfig.label}
                        </div>
                      </div>

                      {/* Re-approval notice */}
                      {listing.status === 'pending' && !listing.paused && (
                        <div style={{ background: '#FFFBEB', padding: '10px 18px', fontSize: 13, color: '#92400E', borderBottom: `1px solid ${BORDER}` }}>
                          ⏳ {t('This listing is waiting for admin approval.', 'ئەم لیستەیە چاوەڕوانی پەسەندکردنی ئەدمینە.')}
                        </div>
                      )}
                      {listing.status === 'rejected' && (
                        <div style={{ background: '#FEF2F2', padding: '10px 18px', fontSize: 13, color: RED, borderBottom: `1px solid ${BORDER}` }}>
                          ❌ {t('Rejected', 'ڕەتکراوە')}{listing.reject_reason ? `: ${listing.reject_reason}` : ''}
                        </div>
                      )}

                      {/* Edit form */}
                      {isEditing && (
                        <div style={{ padding: '16px 18px', background: '#F8FAFF', borderBottom: `1px solid ${BORDER}` }}>
                          <p style={{ fontSize: 13, color: NAVY, fontWeight: 700, marginBottom: 12 }}>
                            ✏️ {t('Edit your listing — it will need re-approval after saving.', 'لیستەکەت دەستکاری بکە — دوای پاشەکەوتکردن دووبارە پەسەند دەکرێت.')}
                          </p>
                          {Object.entries(listing.data || {}).filter(([k]) => !['images'].includes(k)).map(([key, val]) => (
                            <div key={key} style={{ marginBottom: 12 }}>
                              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 4, textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</label>
                              <input
                                defaultValue={val}
                                onChange={e => setEditData(prev => ({ ...prev, [key]: e.target.value }))}
                                style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${BORDER}`, borderRadius: 10, fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                              />
                            </div>
                          ))}
                          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                            <button onClick={() => handleSaveEdit(listing)} disabled={isLoading} style={{ flex: 1, padding: '10px 0', background: NAVY, color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                              {isLoading ? '...' : t('Save & Submit for Approval', 'پاشەکەوت بکە و بنێرە بۆ پەسەندکردن')}
                            </button>
                            <button onClick={() => { setEditingId(null); setEditData({}); }} style={{ padding: '10px 16px', background: BORDER, color: '#444', borderRadius: 10, fontSize: 14, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                              {t('Cancel', 'هەڵوەشاندنەوە')}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div style={{ padding: '14px 18px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>

                        {/* Edit button — only if approved */}
                        {listing.status === 'approved' && !listing.paused && !isEditing && (
                          <button onClick={() => { setEditingId(listing.id); setEditData({}); }} style={{ padding: '8px 14px', background: '#EFF6FF', color: BLUE, borderRadius: 10, fontSize: 13, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            ✏️ {t('Edit', 'دەستکاری')}
                          </button>
                        )}

                        {/* SOLD — cars and businesses */}
                        {['sell-car', 'sell-business'].includes(listing.type) && listing.status === 'approved' && !listing.paused && (
                          <button onClick={() => handleInstantUpdate(listing, { status: 'sold' })} disabled={isLoading} style={{ padding: '8px 14px', background: '#F0FDF4', color: GREEN, borderRadius: 10, fontSize: 13, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {isLoading ? '...' : `✅ ${t('Mark as Sold', 'وەک فرۆشراو نیشان بدە')}`}
                          </button>
                        )}

                        {/* FILLED — staff hire */}
                        {listing.type === 'hire-staff' && listing.status === 'approved' && !listing.paused && (
                          <button onClick={() => handleInstantUpdate(listing, { status: 'filled' })} disabled={isLoading} style={{ padding: '8px 14px', background: '#F0FDF4', color: GREEN, borderRadius: 10, fontSize: 13, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {isLoading ? '...' : `✅ ${t('Mark as Filled', 'وەک پڕکراو نیشان بدە')}`}
                          </button>
                        )}

                        {/* PAUSE/UNPAUSE — services only */}
                        {listing.type === 'list-service' && listing.status === 'approved' && (
                          <button onClick={() => handleInstantUpdate(listing, { paused: !listing.paused })} disabled={isLoading} style={{ padding: '8px 14px', background: listing.paused ? '#EFF6FF' : '#FFF7ED', color: listing.paused ? BLUE : AMBER, borderRadius: 10, fontSize: 13, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {isLoading ? '...' : listing.paused ? `▶️ ${t('Unpause', 'دووبارە چالاک بکەرەوە')}` : `⏸️ ${t('Pause', 'ڕاگرتن')}`}
                          </button>
                        )}

                        {/* Delete — always available */}
                        <button onClick={() => handleDelete(listing.id)} disabled={isLoading} style={{ padding: '8px 14px', background: '#FEF2F2', color: RED, borderRadius: 10, fontSize: 13, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", marginLeft: 'auto' }}>
                          {isLoading ? '...' : `🗑️ ${t('Delete', 'سڕینەوە')}`}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}