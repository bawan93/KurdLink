'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

const FONT = "'Nunito', sans-serif"
const INDIGO = '#4F46E5'
const INDIGO_DARK = '#1C1A4F'
const INDIGO_LIGHT = '#818CF8'
const SOFT = '#EDE9FE'
const BG = '#F5F4FF'
const MINT = '#34D399'
const ADMIN_EMAIL = 'bawanhozhin@outlook.com'

function getSupabase() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

const TYPE_LABELS = {
  hire_staff:   { label: 'Job Posting', icon: '👥', color: INDIGO },
  list_service: { label: 'Service',     icon: '🛠️', color: '#059669' },
}

const FILTERS = [
  { id: 'pending',  label: 'Pending',  color: '#F59E0B' },
  { id: 'approved', label: 'Approved', color: '#22C55E' },
  { id: 'rejected', label: 'Rejected', color: '#EF4444' },
  { id: 'filled',   label: 'Filled',   color: '#9CA3AF' },
]

function AdminInner() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [listings, setListings] = useState([])
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('pending')
  const [rejectReason, setRejectReason] = useState('')
  const [showReject, setShowReject] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [counts, setCounts] = useState({})

  useEffect(() => { checkAuth() }, [])
  useEffect(() => { if (authorized) fetchListings() }, [authorized, filter])

  const checkAuth = async () => {
    const supabase = getSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (user?.email === ADMIN_EMAIL) setAuthorized(true)
    else router.push('/')
    setLoading(false)
  }

  const fetchListings = async () => {
    const supabase = getSupabase()
    const { data } = await supabase.from('listings').select('*').eq('status', filter).order('created_at', { ascending: false })
    setListings(data || [])
    const newCounts = {}
    for (const f of FILTERS) {
      const { count } = await supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', f.id)
      newCounts[f.id] = count || 0
    }
    setCounts(newCounts)
  }

  const handleApprove = async (id) => {
    setActionLoading(true)
    await getSupabase().from('listings').update({ status: 'approved' }).eq('id', id)
    setSelected(null)
    await fetchListings()
    setActionLoading(false)
  }

  const handleReject = async (id) => {
    if (!rejectReason.trim()) return
    setActionLoading(true)
    await getSupabase().from('listings').update({ status: 'rejected', reject_reason: rejectReason }).eq('id', id)
    setSelected(null); setShowReject(false); setRejectReason('')
    await fetchListings()
    setActionLoading(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Permanently delete this listing?')) return
    setActionLoading(true)
    await getSupabase().from('listings').delete().eq('id', id)
    setSelected(null)
    await fetchListings()
    setActionLoading(false)
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  if (loading) return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT }}>
      <div style={{ width: 36, height: 36, border: `3px solid ${SOFT}`, borderTopColor: INDIGO, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (!authorized) return null

  if (selected) {
    const d = selected.data || {}
    const type = TYPE_LABELS[selected.type] || { label: selected.type, icon: '📋', color: INDIGO }
    const fields = Object.entries(d).filter(([k]) => k !== 'imageUrls')

    return (
      <div style={{ minHeight: '100vh', background: BG, fontFamily: FONT }}>
        {/* Header */}
        <div style={{ background: `linear-gradient(135deg, ${INDIGO_DARK} 0%, #2D2A7A 100%)`, padding: '16px 20px', position: 'sticky', top: 0, zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => { setSelected(null); setShowReject(false); setRejectReason('') }} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 15, cursor: 'pointer', fontFamily: FONT, fontWeight: 700 }}>← Back</button>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>Review Listing</div>
          <div style={{ width: 60 }} />
        </div>

        <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px 16px 80px' }}>
          {/* Type + status */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '16px', marginBottom: 14, boxShadow: '0 2px 12px rgba(79,70,229,0.07)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: SOFT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{type.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: INDIGO_DARK }}>{type.label}</div>
              <div style={{ fontSize: 12, color: '#9CA3AF' }}>Submitted {formatDate(selected.created_at)}</div>
            </div>
            <div style={{ padding: '5px 12px', borderRadius: 20, background: selected.status === 'pending' ? '#FFFBEB' : selected.status === 'approved' ? '#F0FDF4' : '#FEF2F2', color: selected.status === 'pending' ? '#D97706' : selected.status === 'approved' ? '#059669' : '#EF4444', fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>
              {selected.status}
            </div>
          </div>

          {/* Fields */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '16px', marginBottom: 14, boxShadow: '0 2px 12px rgba(79,70,229,0.07)' }}>
            {fields.map(([key, val]) => (
              <div key={key} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${SOFT}` }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: INDIGO, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 }}>{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                <div style={{ fontSize: 14, color: INDIGO_DARK, fontWeight: 500, lineHeight: 1.5 }}>{String(val)}</div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {selected.status === 'pending' && !showReject && (
              <>
                <button onClick={() => handleApprove(selected.id)} disabled={actionLoading}
                  style={{ width: '100%', padding: '15px', background: '#22C55E', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 800, color: '#fff', cursor: 'pointer', fontFamily: FONT }}>
                  {actionLoading ? 'Processing…' : '✅ Approve Listing'}
                </button>
                <button onClick={() => setShowReject(true)}
                  style={{ width: '100%', padding: '15px', background: '#EF4444', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 800, color: '#fff', cursor: 'pointer', fontFamily: FONT }}>
                  ❌ Reject Listing
                </button>
              </>
            )}

            {selected.status === 'pending' && showReject && (
              <div style={{ background: '#fff', borderRadius: 16, padding: 16, border: '1.5px solid #FECACA' }}>
                <p style={{ fontSize: 13, fontWeight: 800, color: '#EF4444', margin: '0 0 10px' }}>Reason for rejection:</p>
                <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="e.g. Inappropriate content, missing details…" rows={3}
                  style={{ width: '100%', padding: '12px', border: `1.5px solid ${SOFT}`, borderRadius: 12, fontSize: 14, fontFamily: FONT, outline: 'none', resize: 'vertical', boxSizing: 'border-box', background: BG }} />
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button onClick={() => { setShowReject(false); setRejectReason('') }}
                    style={{ flex: 1, padding: '12px', background: SOFT, border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, color: INDIGO, cursor: 'pointer', fontFamily: FONT }}>Cancel</button>
                  <button onClick={() => handleReject(selected.id)} disabled={actionLoading || !rejectReason.trim()}
                    style={{ flex: 2, padding: '12px', background: '#EF4444', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 800, color: '#fff', cursor: 'pointer', fontFamily: FONT }}>
                    {actionLoading ? 'Rejecting…' : 'Confirm Reject'}
                  </button>
                </div>
              </div>
            )}

            <button onClick={() => handleDelete(selected.id)} disabled={actionLoading}
              style={{ width: '100%', padding: '15px', background: '#1F2937', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 800, color: '#fff', cursor: 'pointer', fontFamily: FONT }}>
              🗑️ Delete Permanently
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: FONT }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${INDIGO_DARK} 0%, #2D2A7A 100%)`, padding: '16px 20px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>Komek Admin</div>
          <button onClick={() => router.push('/home')} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: FONT, fontWeight: 700, padding: '6px 14px', borderRadius: 20 }}>← App</button>
        </div>

        {/* Counts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 12 }}>
          {FILTERS.map(f => (
            <div key={f.id} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 4px', textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: f.color }}>{counts[f.id] ?? 0}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{f.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 6 }}>
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              style={{ flex: 1, padding: '7px 0', background: filter === f.id ? '#fff' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 10, fontSize: 11, fontWeight: 700, color: filter === f.id ? INDIGO_DARK : 'rgba(255,255,255,0.7)', cursor: 'pointer', fontFamily: FONT }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '16px 16px 80px' }}>
        {listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <p style={{ fontSize: 14, color: '#9CA3AF', fontWeight: 600 }}>No {filter} listings</p>
          </div>
        ) : (
          listings.map(listing => {
            const type = TYPE_LABELS[listing.type] || { label: listing.type, icon: '📋', color: INDIGO }
            const d = listing.data || {}
            const title = d.jobTitle || d.serviceName || 'Untitled'
            const subtitle = d.location || ''
            return (
              <button key={listing.id} onClick={() => setSelected(listing)}
                style={{ width: '100%', background: '#fff', border: `1.5px solid ${SOFT}`, borderRadius: 16, padding: '14px 16px', marginBottom: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', boxSizing: 'border-box', boxShadow: '0 2px 8px rgba(79,70,229,0.06)' }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: SOFT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{type.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: INDIGO_DARK, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF' }}>{type.label}{subtitle ? ` • ${subtitle}` : ''}</div>
                  <div style={{ fontSize: 11, color: '#C4B5FD', marginTop: 2 }}>{formatDate(listing.created_at)}</div>
                </div>
                <div style={{ fontSize: 18, color: INDIGO, opacity: 0.4, flexShrink: 0 }}>›</div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

export default function Admin() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: BG }} />}>
      <AdminInner />
    </Suspense>
  )
}