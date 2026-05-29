'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

const FONT = "'Plus Jakarta Sans', 'Sora', sans-serif"
const ORANGE = 'linear-gradient(135deg, #FF6B35, #FF8C61)'
const NAVY = '#1A2B5F'
const ADMIN_EMAIL = 'bawanhozhin@outlook.com'

function getSupabase() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

const TYPE_LABELS = {
  sell_car:      { label: 'Sell Car',      icon: '🚗', color: '#00B4D8' },
  sell_business: { label: 'Sell Business', icon: '💼', color: '#FFB703' },
  hire_staff:    { label: 'Hire Staff',    icon: '👥', color: '#06FFA5' },
  list_service:  { label: 'List Service',  icon: '🎯', color: '#FF006E' },
}

const FILTERS = [
  { id: 'pending',  label: 'Pending',  color: '#FFB703' },
  { id: 'approved', label: 'Approved', color: '#06FFA5' },
  { id: 'rejected', label: 'Rejected', color: '#FF6B6B' },
  { id: 'sold',     label: 'Sold',     color: '#aaa'    },
  { id: 'filled',   label: 'Filled',   color: '#aaa'    },
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
    <div style={{ minHeight: '100vh', background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT }}>
      <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>Loading…</div>
    </div>
  )

  if (!authorized) return null

  if (selected) {
    const d = selected.data || {}
    const type = TYPE_LABELS[selected.type] || { label: selected.type, icon: '📋', color: '#888' }
    const fields = Object.entries(d).filter(([k]) => k !== 'imageUrls')

    return (
      <div style={{ minHeight: '100vh', background: '#f7f7f5', fontFamily: FONT }}>
        <div style={{ background: NAVY, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
          <button onClick={() => { setSelected(null); setShowReject(false); setRejectReason('') }} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 15, cursor: 'pointer', fontFamily: FONT, fontWeight: 600 }}>← Back</button>
          <div style={{ fontSize: 16, fontWeight: 800, background: ORANGE, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Review Listing</div>
          <div style={{ width: 60 }} />
        </div>

        <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px 20px 60px', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 28 }}>{type.icon}</span>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: NAVY }}>{type.label}</div>
              <div style={{ fontSize: 12, color: '#888' }}>Submitted {formatDate(selected.created_at)}</div>
            </div>
            <div style={{ marginLeft: 'auto', padding: '6px 14px', borderRadius: 20, background: selected.status === 'pending' ? '#FFF3E0' : selected.status === 'approved' ? '#E8F5E9' : selected.status === 'sold' || selected.status === 'filled' ? '#F3F4F6' : '#FFEBEE', color: selected.status === 'pending' ? '#E65100' : selected.status === 'approved' ? '#2E7D32' : selected.status === 'sold' || selected.status === 'filled' ? '#6B7280' : '#C62828', fontSize: 12, fontWeight: 700 }}>
              {selected.status.toUpperCase()}
            </div>
          </div>

          {d.imageUrls && d.imageUrls.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#444', marginBottom: 8 }}>Photos</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {d.imageUrls.map((url, i) => (
                  <img key={i} src={url} alt={`photo ${i + 1}`} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 12, border: '1px solid rgba(0,0,0,0.1)' }} />
                ))}
              </div>
            </div>
          )}

          <div style={{ background: '#fff', borderRadius: 16, padding: '20px', marginBottom: 20, border: '1px solid rgba(0,0,0,0.06)' }}>
            {fields.map(([key, val]) => (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: 0.5 }}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span style={{ fontSize: 14, color: '#1a1a1a', fontWeight: 500, lineHeight: 1.5 }}>{String(val)}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {selected.status === 'pending' && !showReject && (
              <>
                <button onClick={() => handleApprove(selected.id)} disabled={actionLoading} style={{ width: '100%', padding: '15px', background: 'linear-gradient(135deg, #2E7D32, #43A047)', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: FONT, boxShadow: '0 4px 16px rgba(46,125,50,0.3)' }}>
                  {actionLoading ? 'Processing…' : '✅ Approve Listing'}
                </button>
                <button onClick={() => setShowReject(true)} style={{ width: '100%', padding: '15px', background: 'linear-gradient(135deg, #C62828, #E53935)', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: FONT }}>
                  ❌ Reject Listing
                </button>
              </>
            )}

            {selected.status === 'pending' && showReject && (
              <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1.5px solid #ffcdd2' }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#C62828', margin: '0 0 12px' }}>Reason for rejection:</p>
                <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="e.g. Inappropriate content, missing details…" rows={3} style={{ width: '100%', padding: '12px', border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: 12, fontSize: 14, fontFamily: FONT, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                  <button onClick={() => { setShowReject(false); setRejectReason('') }} style={{ flex: 1, padding: '12px', background: '#f5f5f5', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, color: '#666', cursor: 'pointer', fontFamily: FONT }}>Cancel</button>
                  <button onClick={() => handleReject(selected.id)} disabled={actionLoading || !rejectReason.trim()} style={{ flex: 2, padding: '12px', background: 'linear-gradient(135deg, #C62828, #E53935)', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: FONT }}>
                    {actionLoading ? 'Rejecting…' : 'Confirm Reject'}
                  </button>
                </div>
              </div>
            )}

            {/* Delete always visible */}
            <button onClick={() => handleDelete(selected.id)} disabled={actionLoading} style={{ width: '100%', padding: '15px', background: '#333', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: FONT }}>
              🗑️ Delete Permanently
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f5', fontFamily: FONT }}>
      <div style={{ background: NAVY, padding: '16px 20px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 800, background: ORANGE, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>KurdLink Admin</div>
          <button onClick={() => router.push('/home')} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: FONT, fontWeight: 600, padding: '6px 12px', borderRadius: 20 }}>← App</button>
        </div>

        {/* Counts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginBottom: 14 }}>
          {FILTERS.map(f => (
            <div key={f.id} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '8px 4px', textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: f.color }}>{counts[f.id] ?? 0}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{f.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{ flexShrink: 0, padding: '7px 14px', background: filter === f.id ? '#fff' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 700, color: filter === f.id ? NAVY : 'rgba(255,255,255,0.7)', cursor: 'pointer', fontFamily: FONT }}>
              {f.label} {counts[f.id] ? `(${counts[f.id]})` : ''}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '16px 16px 60px', boxSizing: 'border-box' }}>
        {listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <p style={{ fontSize: 15, color: '#888', fontWeight: 600 }}>No {filter} listings</p>
          </div>
        ) : (
          listings.map(listing => {
            const type = TYPE_LABELS[listing.type] || { label: listing.type, icon: '📋', color: '#888' }
            const d = listing.data || {}
            const title = d.businessName || d.make || d.jobTitle || d.fullName || 'Untitled'
            const subtitle = d.city || d.postcode || ''
            return (
              <button key={listing.id} onClick={() => setSelected(listing)} style={{ width: '100%', background: '#fff', border: '1.5px solid rgba(0,0,0,0.06)', borderRadius: 16, padding: '16px', marginBottom: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left', boxSizing: 'border-box', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: `${type.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{type.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{type.label} {subtitle ? `• ${subtitle}` : ''}</div>
                  <div style={{ fontSize: 11, color: '#aaa' }}>{formatDate(listing.created_at)}</div>
                </div>
                <div style={{ fontSize: 18, color: 'rgba(0,0,0,0.2)', flexShrink: 0 }}>›</div>
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
    <Suspense fallback={<div style={{ minHeight: '100vh', background: NAVY }} />}>
      <AdminInner />
    </Suspense>
  )
}