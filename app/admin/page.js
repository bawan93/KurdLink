'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/app/lib/supabase'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const FONT        = "'Nunito', sans-serif"
const INDIGO      = '#4F46E5'
const INDIGO_DARK = '#1C1A4F'
const SOFT        = '#EDE9FE'
const BG          = '#F5F4FF'
const MINT        = '#34D399'
const AMBER       = '#D97706'
const ADMIN_EMAIL = 'bawanhozhin@outlook.com'
const LIVE_THRESHOLD = 2 * 60 * 1000

function getSupabase() {
  return createClient()
}

const TYPE_LABELS = {
  hire_staff:   { label: 'Job Posting', icon: '👥', color: INDIGO },
  list_service: { label: 'Service',     icon: '🛠️', color: '#059669' },
}

const LISTING_FILTERS = [
  { id: 'pending',  label: 'Pending',  color: '#F59E0B' },
  { id: 'approved', label: 'Approved', color: '#22C55E' },
  { id: 'rejected', label: 'Rejected', color: '#EF4444' },
  { id: 'filled',   label: 'Filled',   color: '#9CA3AF' },
]

const ERROR_TYPE_META = {
  rate_limited:     { label: 'Rate Limited', color: '#F59E0B', bg: '#FFFBEB', icon: '🚦' },
  api_error:        { label: 'API Error',    color: '#EF4444', bg: '#FEF2F2', icon: '🔴' },
  parse_error:      { label: 'Parse Error',  color: '#8B5CF6', bg: '#F5F3FF', icon: '⚠️' },
  no_content:       { label: 'No Content',   color: '#6B7280', bg: '#F9FAFB', icon: '📭' },
  unexpected_error: { label: 'Unexpected',   color: '#DC2626', bg: '#FEF2F2', icon: '💥' },
}

const MAIN_TABS = [
  { id: 'listings', label: '📋 Listings' },
  { id: 'visitors', label: '👥 Visitors' },
  { id: 'errors',   label: '⚠️ Errors'   },
]

const PERIOD_TABS = [
  { id: 'day',   label: 'Today' },
  { id: 'week',  label: 'Week'  },
  { id: 'month', label: 'Month' },
  { id: 'year',  label: 'Year'  },
]

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function formatDuration(ms) {
  if (ms < 60000) return '<1 min'
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  if (diff < 60000) return 'just now'
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function periodStart(period) {
  const now = new Date()
  if (period === 'day') {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  }
  if (period === 'week') {
    const d = new Date(now)
    d.setDate(d.getDate() - 6)
    d.setHours(0, 0, 0, 0)
    return d.toISOString()
  }
  if (period === 'month') {
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  }
  if (period === 'year') {
    return new Date(now.getFullYear(), 0, 1).toISOString()
  }
  return new Date(0).toISOString()
}

function computePeriodStats(visitors, period) {
  const start = periodStart(period)
  let newCount = 0
  let returningCount = 0
  for (const v of visitors) {
    const activeInPeriod = v.sessions.some(s => s.started_at >= start)
    if (!activeInPeriod) continue
    if (v.firstSeen >= start) newCount++
    else returningCount++
  }
  return { new: newCount, returning: returningCount, total: newCount + returningCount }
}

// ─── Chart data builder ──────────────────────────────────────────────────────
// Builds an array of { label, new, returning } data points
// granularity adapts to the selected period
function buildChartData(visitors, period) {
  const now = new Date()
  const buckets = []

  if (period === 'day') {
    // Last 24 hours, one bucket per hour
    for (let i = 23; i >= 0; i--) {
      const start = new Date(now)
      start.setMinutes(0, 0, 0)
      start.setHours(start.getHours() - i)
      const end = new Date(start)
      end.setHours(end.getHours() + 1)
      buckets.push({
        label: start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        startIso: start.toISOString(),
        endIso:   end.toISOString(),
      })
    }
  } else if (period === 'week') {
    // Last 7 days, one bucket per day
    for (let i = 6; i >= 0; i--) {
      const start = new Date(now)
      start.setDate(start.getDate() - i)
      start.setHours(0, 0, 0, 0)
      const end = new Date(start)
      end.setDate(end.getDate() + 1)
      buckets.push({
        label: start.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' }),
        startIso: start.toISOString(),
        endIso:   end.toISOString(),
      })
    }
  } else if (period === 'month') {
    // Last 30 days, one bucket per day
    for (let i = 29; i >= 0; i--) {
      const start = new Date(now)
      start.setDate(start.getDate() - i)
      start.setHours(0, 0, 0, 0)
      const end = new Date(start)
      end.setDate(end.getDate() + 1)
      buckets.push({
        label: start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        startIso: start.toISOString(),
        endIso:   end.toISOString(),
      })
    }
  } else if (period === 'year') {
    // Last 12 months, one bucket per month
    for (let i = 11; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const end   = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
      buckets.push({
        label: start.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }),
        startIso: start.toISOString(),
        endIso:   end.toISOString(),
      })
    }
  }

  // For each bucket, count new and returning visitors
  // New      = firstSeen is within [bucketStart, bucketEnd)
  // Returning = had a session within [bucketStart, bucketEnd) AND firstSeen is before bucketStart
  return buckets.map(b => {
    let newCount = 0
    let returningCount = 0
    for (const v of visitors) {
      const activeInBucket = v.sessions.some(
        s => s.started_at >= b.startIso && s.started_at < b.endIso
      )
      if (!activeInBucket) continue
      if (v.firstSeen >= b.startIso && v.firstSeen < b.endIso) newCount++
      else returningCount++
    }
    return { label: b.label, New: newCount, Returning: returningCount }
  })
}

// Custom tooltip for the chart
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div style={{ background: '#fff', border: `1.5px solid ${SOFT}`, borderRadius: 12, padding: '10px 14px', fontFamily: FONT, boxShadow: '0 4px 16px rgba(79,70,229,0.12)' }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: '#9CA3AF', marginBottom: 6 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: INDIGO_DARK }}>{p.name}:</span>
          <span style={{ fontSize: 12, fontWeight: 900, color: p.color }}>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

function AdminInner() {
  const router = useRouter()
  const [loading, setLoading]       = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [mainTab, setMainTab]       = useState('listings')

  // Listings
  const [listings, setListings]           = useState([])
  const [selected, setSelected]           = useState(null)
  const [filter, setFilter]               = useState('pending')
  const [rejectReason, setRejectReason]   = useState('')
  const [showReject, setShowReject]       = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [counts, setCounts]               = useState({})

  // Errors
  const [errors, setErrors]               = useState([])
  const [errorLoading, setErrorLoading]   = useState(false)
  const [expandedError, setExpandedError] = useState(null)
  const [errorCount, setErrorCount]       = useState(0)

  // Visitors
  const [sessions, setSessions]               = useState([])
  const [visitorLoading, setVisitorLoading]   = useState(false)
  const [expandedVisitor, setExpandedVisitor] = useState(null)
  const [visitorStats, setVisitorStats]       = useState({ total: 0, live: 0, returning: 0 })
  const [periodTab, setPeriodTab]             = useState('day')
  const [periodStats, setPeriodStats]         = useState({ new: 0, returning: 0, total: 0 })
  const [chartData, setChartData]             = useState([])
  const liveTimer   = useRef(null)
  const allVisitors = useRef([])

  useEffect(() => { checkAuth() }, [])
  useEffect(() => { if (authorized) fetchListings() }, [authorized, filter])
  useEffect(() => {
    if (authorized && mainTab === 'errors')   fetchErrors()
    if (authorized && mainTab === 'visitors') fetchVisitors()
  }, [authorized, mainTab])

  useEffect(() => {
    if (mainTab === 'visitors' && authorized) {
      liveTimer.current = setInterval(fetchVisitors, 30000)
    }
    return () => { if (liveTimer.current) clearInterval(liveTimer.current) }
  }, [mainTab, authorized])

  // Recompute period stats AND chart when period tab switches — no extra fetch
  useEffect(() => {
    if (allVisitors.current.length > 0) {
      setPeriodStats(computePeriodStats(allVisitors.current, periodTab))
      setChartData(buildChartData(allVisitors.current, periodTab))
    }
  }, [periodTab])

  const checkAuth = async () => {
    const supabase = getSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (user?.email === ADMIN_EMAIL) setAuthorized(true)
    else router.push('/')
    setLoading(false)
  }

  const fetchListings = async () => {
    const supabase = getSupabase()
    const { data } = await supabase
      .from('listings')
      .select('*')
      .eq('status', filter)
      .order('created_at', { ascending: false })
    setListings(data || [])

    const newCounts = {}
    for (const f of LISTING_FILTERS) {
      const { count } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('status', f.id)
      newCounts[f.id] = count || 0
    }
    setCounts(newCounts)

    const { count: ec } = await supabase
      .from('explainer_errors')
      .select('*', { count: 'exact', head: true })
    setErrorCount(ec || 0)
  }

  const fetchErrors = async () => {
    setErrorLoading(true)
    const supabase = getSupabase()
    const { data } = await supabase
      .from('explainer_errors')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200)
    setErrors(data || [])
    setErrorCount(data?.length || 0)
    setErrorLoading(false)
  }

  const fetchVisitors = async () => {
    setVisitorLoading(true)
    const supabase = getSupabase()
    const { data: rawSessions } = await supabase
      .from('app_sessions')
      .select('*')
      .order('last_seen_at', { ascending: false })

    if (!rawSessions) { setVisitorLoading(false); return }

    const now = Date.now()
    const liveThreshold = new Date(now - LIVE_THRESHOLD).toISOString()

    const visitorMap = {}
    for (const s of rawSessions) {
      const key = s.identifier
      if (!visitorMap[key]) {
        visitorMap[key] = {
          identifier:      s.identifier,
          identifier_type: s.identifier_type,
          sessions:        [],
          firstSeen:       s.started_at,
          lastSeen:        s.last_seen_at,
          isLive:          false,
          currentPage:     null,
          totalVisits:     0,
          totalTimeMs:     0,
        }
      }
      const v = visitorMap[key]
      v.sessions.push(s)

      const sessionMs = new Date(s.last_seen_at).getTime() - new Date(s.started_at).getTime()
      v.totalTimeMs += Math.max(0, sessionMs)
      v.totalVisits = Math.max(v.totalVisits, s.visit_count || 0)

      if (s.last_seen_at > v.lastSeen) {
        v.lastSeen    = s.last_seen_at
        v.currentPage = s.page_path
      }
      if (s.last_seen_at >= liveThreshold) v.isLive = true
      if (s.started_at < v.firstSeen) v.firstSeen = s.started_at
    }

    const visitors = Object.values(visitorMap).sort(
      (a, b) => new Date(b.lastSeen) - new Date(a.lastSeen)
    )

    const liveCount      = visitors.filter(v => v.isLive).length
    const returningCount = visitors.filter(v => v.totalVisits > 1).length

    allVisitors.current = visitors
    setSessions(visitors)
    setVisitorStats({ total: visitors.length, live: liveCount, returning: returningCount })
    setPeriodStats(computePeriodStats(visitors, periodTab))
    setChartData(buildChartData(visitors, periodTab))
    setVisitorLoading(false)
  }

  const handleDeleteError = async (id) => {
    await getSupabase().from('explainer_errors').delete().eq('id', id)
    setErrors(prev => prev.filter(e => e.id !== id))
    setExpandedError(null)
    setErrorCount(prev => Math.max(0, prev - 1))
  }

  const handleClearAllErrors = async () => {
    if (!confirm('Clear all explainer errors? This cannot be undone.')) return
    await getSupabase()
      .from('explainer_errors')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
    setErrors([])
    setErrorCount(0)
    setExpandedError(null)
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
    await getSupabase()
      .from('listings')
      .update({ status: 'rejected', reject_reason: rejectReason })
      .eq('id', id)
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

  // ─── LOADING ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT }}>
      <div style={{ width: 36, height: 36, border: `3px solid ${SOFT}`, borderTopColor: INDIGO, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (!authorized) return null

  // ─── LISTING DETAIL ─────────────────────────────────────────────────────────
  if (selected) {
    const d    = selected.data || {}
    const type = TYPE_LABELS[selected.type] || { label: selected.type, icon: '📋', color: INDIGO }
    const fields = Object.entries(d).filter(([k]) => k !== 'imageUrls')
    return (
      <div style={{ minHeight: '100vh', background: BG, fontFamily: FONT }}>
        <div style={{ background: `linear-gradient(135deg, ${INDIGO_DARK} 0%, #2D2A7A 100%)`, padding: '16px 20px', position: 'sticky', top: 0, zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => { setSelected(null); setShowReject(false); setRejectReason('') }}
            style={{ background: 'none', border: 'none', color: '#fff', fontSize: 15, cursor: 'pointer', fontFamily: FONT, fontWeight: 700 }}>← Back</button>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>Review Listing</div>
          <div style={{ width: 60 }} />
        </div>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px 16px 80px' }}>
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
          <div style={{ background: '#fff', borderRadius: 16, padding: '16px', marginBottom: 14, boxShadow: '0 2px 12px rgba(79,70,229,0.07)' }}>
            {fields.map(([key, val]) => (
              <div key={key} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${SOFT}` }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: INDIGO, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 }}>
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div style={{ fontSize: 14, color: INDIGO_DARK, fontWeight: 500, lineHeight: 1.5 }}>{String(val)}</div>
              </div>
            ))}
          </div>
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
                <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                  placeholder="e.g. Inappropriate content, missing details…" rows={3}
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

  // ─── MAIN VIEW ───────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: FONT }}>
      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      {/* ── Header ── */}
      <div style={{ background: `linear-gradient(135deg, ${INDIGO_DARK} 0%, #2D2A7A 100%)`, padding: '16px 20px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>Komek Admin</div>
          <button onClick={() => router.push('/home')}
            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: FONT, fontWeight: 700, padding: '6px 14px', borderRadius: 20 }}>
            ← App
          </button>
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: mainTab === 'listings' ? 14 : 0 }}>
          {MAIN_TABS.map(t => (
            <button key={t.id} onClick={() => setMainTab(t.id)}
              style={{ flex: 1, padding: '9px 0', background: mainTab === t.id ? '#fff' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 10, fontSize: 11, fontWeight: 800, color: mainTab === t.id ? INDIGO_DARK : 'rgba(255,255,255,0.8)', cursor: 'pointer', fontFamily: FONT, position: 'relative' }}>
              {t.label}
              {t.id === 'errors' && errorCount > 0 && (
                <span style={{ position: 'absolute', top: -6, right: -4, background: '#EF4444', color: '#fff', fontSize: 10, fontWeight: 900, borderRadius: 20, padding: '2px 6px', minWidth: 18, textAlign: 'center' }}>{errorCount}</span>
              )}
              {t.id === 'visitors' && visitorStats.live > 0 && (
                <span style={{ position: 'absolute', top: -6, right: -4, background: MINT, color: '#065F46', fontSize: 10, fontWeight: 900, borderRadius: 20, padding: '2px 6px', minWidth: 18, textAlign: 'center', animation: 'pulse 2s infinite' }}>{visitorStats.live}</span>
              )}
            </button>
          ))}
        </div>
        {mainTab === 'listings' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 12 }}>
              {LISTING_FILTERS.map(f => (
                <div key={f.id} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 4px', textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: f.color }}>{counts[f.id] ?? 0}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{f.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {LISTING_FILTERS.map(f => (
                <button key={f.id} onClick={() => setFilter(f.id)}
                  style={{ flex: 1, padding: '7px 0', background: filter === f.id ? '#fff' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 10, fontSize: 11, fontWeight: 700, color: filter === f.id ? INDIGO_DARK : 'rgba(255,255,255,0.7)', cursor: 'pointer', fontFamily: FONT }}>
                  {f.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── LISTINGS TAB ── */}
      {mainTab === 'listings' && (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '16px 16px 80px' }}>
          {listings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
              <p style={{ fontSize: 14, color: '#9CA3AF', fontWeight: 600 }}>No {filter} listings</p>
            </div>
          ) : listings.map(listing => {
            const type  = TYPE_LABELS[listing.type] || { label: listing.type, icon: '📋', color: INDIGO }
            const d     = listing.data || {}
            const title = d.jobTitle || d.serviceName || 'Untitled'
            const sub   = d.location || ''
            return (
              <button key={listing.id} onClick={() => setSelected(listing)}
                style={{ width: '100%', background: '#fff', border: `1.5px solid ${SOFT}`, borderRadius: 16, padding: '14px 16px', marginBottom: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', boxSizing: 'border-box', boxShadow: '0 2px 8px rgba(79,70,229,0.06)' }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: SOFT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{type.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: INDIGO_DARK, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF' }}>{type.label}{sub ? ` • ${sub}` : ''}</div>
                  <div style={{ fontSize: 11, color: '#C4B5FD', marginTop: 2 }}>{formatDate(listing.created_at)}</div>
                </div>
                <div style={{ fontSize: 18, color: INDIGO, opacity: 0.4, flexShrink: 0 }}>›</div>
              </button>
            )
          })}
        </div>
      )}

      {/* ── VISITORS TAB ── */}
      {mainTab === 'visitors' && (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '16px 16px 80px' }}>
          {visitorLoading && sessions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ width: 32, height: 32, border: `3px solid ${SOFT}`, borderTopColor: INDIGO, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
            </div>
          ) : (
            <>
              {/* All-time summary */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
                {[
                  { label: 'Total Visitors', value: visitorStats.total,     color: INDIGO,    bg: SOFT,      pulse: false },
                  { label: 'Live Now',        value: visitorStats.live,      color: '#059669', bg: '#F0FDF4', pulse: true  },
                  { label: 'Returning',       value: visitorStats.returning, color: AMBER,     bg: '#FFFBEB', pulse: false },
                ].map(s => (
                  <div key={s.label} style={{ background: s.bg, borderRadius: 14, padding: '14px 10px', textAlign: 'center' }}>
                    <div style={{ fontSize: 28, fontWeight: 900, color: s.color, animation: s.pulse && visitorStats.live > 0 ? 'pulse 2s infinite' : 'none' }}>
                      {s.value}
                    </div>
                    <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 700, marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* ── Period stats + chart card ── */}
              <div style={{ background: '#fff', borderRadius: 16, padding: '16px', marginBottom: 16, boxShadow: '0 2px 8px rgba(79,70,229,0.06)', border: `1.5px solid ${SOFT}` }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: INDIGO, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
                  New vs Returning
                </div>

                {/* Period pills */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                  {PERIOD_TABS.map(p => (
                    <button key={p.id} onClick={() => setPeriodTab(p.id)}
                      style={{ flex: 1, padding: '7px 0', background: periodTab === p.id ? INDIGO : SOFT, border: 'none', borderRadius: 10, fontSize: 11, fontWeight: 800, color: periodTab === p.id ? '#fff' : INDIGO, cursor: 'pointer', fontFamily: FONT, transition: 'background 0.15s' }}>
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Period stat boxes */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
                  {[
                    { label: 'New',       value: periodStats.new,      color: '#059669', bg: '#F0FDF4' },
                    { label: 'Returning', value: periodStats.returning, color: AMBER,     bg: '#FFFBEB' },
                    { label: 'Total',     value: periodStats.total,     color: INDIGO,    bg: SOFT      },
                  ].map(s => (
                    <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: '12px 8px', textAlign: 'center' }}>
                      <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 700, marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                {periodStats.total > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', height: 8, background: '#F3F4F6' }}>
                      <div style={{ width: `${(periodStats.new / periodStats.total) * 100}%`, background: '#059669', transition: 'width 0.3s' }} />
                      <div style={{ width: `${(periodStats.returning / periodStats.total) * 100}%`, background: AMBER, transition: 'width 0.3s' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                      <span style={{ fontSize: 10, color: '#059669', fontWeight: 700 }}>
                        {Math.round((periodStats.new / periodStats.total) * 100)}% New
                      </span>
                      <span style={{ fontSize: 10, color: AMBER, fontWeight: 700 }}>
                        {Math.round((periodStats.returning / periodStats.total) * 100)}% Returning
                      </span>
                    </div>
                  </div>
                )}

                {/* ── Line chart ── */}
                <div style={{ fontSize: 11, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
                  Trend
                </div>
                {chartData.length > 0 && chartData.some(d => d.New > 0 || d.Returning > 0) ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={SOFT} vertical={false} />
                      <XAxis
                        dataKey="label"
                        tick={{ fontSize: 9, fontFamily: FONT, fill: '#9CA3AF', fontWeight: 700 }}
                        tickLine={false}
                        axisLine={false}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 9, fontFamily: FONT, fill: '#9CA3AF', fontWeight: 700 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip content={<ChartTooltip />} />
                      <Legend
                        wrapperStyle={{ fontSize: 11, fontFamily: FONT, fontWeight: 700, paddingTop: 8 }}
                        iconType="circle"
                        iconSize={8}
                      />
                      <Line
                        type="monotone"
                        dataKey="New"
                        stroke="#059669"
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: '#059669', strokeWidth: 0 }}
                        activeDot={{ r: 5, fill: '#059669', strokeWidth: 0 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Returning"
                        stroke={AMBER}
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: AMBER, strokeWidth: 0 }}
                        activeDot={{ r: 5, fill: AMBER, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ textAlign: 'center', padding: '24px 0', fontSize: 13, color: '#9CA3AF', fontWeight: 600 }}>
                    No data to chart for this period
                  </div>
                )}

                {periodStats.total === 0 && (
                  <div style={{ textAlign: 'center', paddingTop: 8, fontSize: 13, color: '#9CA3AF', fontWeight: 600 }}>
                    No visitors in this period
                  </div>
                )}
              </div>

              {/* Refresh */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                <button onClick={fetchVisitors}
                  style={{ background: SOFT, border: 'none', color: INDIGO, borderRadius: 10, padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>
                  🔄 Refresh
                </button>
              </div>

              {/* ── Visitor list ── */}
              {sessions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>👻</div>
                  <p style={{ fontSize: 14, color: '#9CA3AF', fontWeight: 600 }}>No visitors yet</p>
                </div>
              ) : sessions.map(v => {
                const isExpanded  = expandedVisitor === v.identifier
                const isLive      = v.isLive
                const isReturning = v.totalVisits > 1
                const isUser      = v.identifier_type === 'user'
                return (
                  <div key={v.identifier}
                    style={{ background: '#fff', border: `1.5px solid ${isLive ? MINT : SOFT}`, borderRadius: 16, marginBottom: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(79,70,229,0.05)', transition: 'border-color 0.2s' }}>

                    <button onClick={() => setExpandedVisitor(isExpanded ? null : v.identifier)}
                      style={{ width: '100%', background: 'none', border: 'none', padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', fontFamily: FONT, boxSizing: 'border-box' }}>
                      <div style={{ width: 42, height: 42, borderRadius: 12, background: isUser ? SOFT : '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0, position: 'relative' }}>
                        {isUser ? '👤' : '🌐'}
                        {isLive && (
                          <div style={{ position: 'absolute', top: -3, right: -3, width: 12, height: 12, background: MINT, borderRadius: '50%', border: '2px solid #fff', animation: 'pulse 2s infinite' }} />
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 13, fontWeight: 800, color: INDIGO_DARK }}>
                            {isUser ? 'Account user' : 'Anonymous'}
                          </span>
                          {isLive && (
                            <span style={{ fontSize: 10, background: '#D1FAE5', color: '#059669', borderRadius: 6, padding: '2px 7px', fontWeight: 800 }}>● LIVE</span>
                          )}
                          {isReturning && (
                            <span style={{ fontSize: 10, background: '#FEF3C7', color: AMBER, borderRadius: 6, padding: '2px 7px', fontWeight: 800 }}>↩ RETURNING</span>
                          )}
                        </div>
                        <div style={{ fontSize: 11, color: '#9CA3AF' }}>
                          Last seen {timeAgo(v.lastSeen)}
                          {v.currentPage && isLive && (
                            <span style={{ color: INDIGO, fontWeight: 700 }}> · {v.currentPage}</span>
                          )}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 900, color: INDIGO }}>{v.totalVisits}×</div>
                        <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>visits</div>
                      </div>
                      <div style={{ fontSize: 16, color: '#9CA3AF', flexShrink: 0, transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>›</div>
                    </button>

                    {isExpanded && (
                      <div style={{ padding: '0 16px 16px', borderTop: `1px solid ${SOFT}` }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginTop: 12 }}>
                          {[
                            { label: 'First Visit',  value: formatDate(v.firstSeen) },
                            { label: 'Last Seen',    value: formatDate(v.lastSeen) },
                            { label: 'Total Time',   value: formatDuration(v.totalTimeMs) },
                            { label: 'Total Visits', value: `${v.totalVisits} session${v.totalVisits !== 1 ? 's' : ''}` },
                          ].map(s => (
                            <div key={s.label} style={{ background: BG, borderRadius: 10, padding: '10px 12px' }}>
                              <div style={{ fontSize: 10, fontWeight: 800, color: INDIGO, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 }}>{s.label}</div>
                              <div style={{ fontSize: 12, color: INDIGO_DARK, fontWeight: 700 }}>{s.value}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{ marginTop: 12 }}>
                          <div style={{ fontSize: 11, fontWeight: 800, color: INDIGO, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Session History</div>
                          {v.sessions.slice(0, 10).map((s, i) => (
                            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < Math.min(v.sessions.length, 10) - 1 ? `1px solid ${SOFT}` : 'none' }}>
                              <div style={{ width: 6, height: 6, borderRadius: '50%', background: new Date(s.last_seen_at).getTime() > Date.now() - LIVE_THRESHOLD ? MINT : '#D1D5DB', flexShrink: 0 }} />
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 11, color: INDIGO_DARK, fontWeight: 600 }}>{formatDate(s.started_at)}</div>
                                <div style={{ fontSize: 11, color: '#9CA3AF' }}>
                                  {formatDuration(Math.max(0, new Date(s.last_seen_at) - new Date(s.started_at)))} · {s.page_path || '/'}
                                </div>
                              </div>
                              <div style={{ fontSize: 10, color: INDIGO, fontWeight: 700 }}>#{s.visit_count}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{ marginTop: 12, background: '#1F2937', borderRadius: 10, padding: '10px 14px' }}>
                          <div style={{ fontSize: 10, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 }}>
                            {isUser ? 'User ID' : 'IP Address'}
                          </div>
                          <div style={{ fontSize: 11, color: '#E5E7EB', fontFamily: 'monospace', wordBreak: 'break-all' }}>{v.identifier}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </>
          )}
        </div>
      )}

      {/* ── ERRORS TAB ── */}
      {mainTab === 'errors' && (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '16px 16px 80px' }}>
          {errorLoading ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ width: 32, height: 32, border: `3px solid ${SOFT}`, borderTopColor: INDIGO, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
            </div>
          ) : errors.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
              <p style={{ fontSize: 14, color: '#9CA3AF', fontWeight: 600 }}>No errors logged</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                <button onClick={handleClearAllErrors}
                  style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', color: '#EF4444', borderRadius: 10, padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>
                  🗑️ Clear All
                </button>
              </div>
              {errors.map(err => {
                const meta       = ERROR_TYPE_META[err.error_type] || { label: err.error_type, color: '#6B7280', bg: '#F9FAFB', icon: '❓' }
                const isExpanded = expandedError === err.id
                return (
                  <div key={err.id}
                    style={{ background: '#fff', border: `1.5px solid ${isExpanded ? meta.color : SOFT}`, borderRadius: 16, marginBottom: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(79,70,229,0.05)', transition: 'border-color 0.2s' }}>
                    <button onClick={() => setExpandedError(isExpanded ? null : err.id)}
                      style={{ width: '100%', background: 'none', border: 'none', padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', fontFamily: FONT, boxSizing: 'border-box' }}>
                      <div style={{ width: 42, height: 42, borderRadius: 12, background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{meta.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                          <span style={{ fontSize: 13, fontWeight: 800, color: meta.color }}>{meta.label}</span>
                          <span style={{ fontSize: 11, background: err.input_type === 'image' ? '#EFF6FF' : '#F0FDF4', color: err.input_type === 'image' ? '#3B82F6' : '#059669', borderRadius: 6, padding: '2px 7px', fontWeight: 700 }}>{err.input_type || '—'}</span>
                          <span style={{ fontSize: 11, background: SOFT, color: INDIGO, borderRadius: 6, padding: '2px 7px', fontWeight: 700 }}>{err.lang || '—'}</span>
                        </div>
                        <div style={{ fontSize: 11, color: '#9CA3AF' }}>{formatDate(err.created_at)}</div>
                        {!isExpanded && err.error_detail && (
                          <div style={{ fontSize: 12, color: '#6B7280', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{err.error_detail}</div>
                        )}
                      </div>
                      <div style={{ fontSize: 16, color: '#9CA3AF', flexShrink: 0, transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>›</div>
                    </button>
                    {isExpanded && (
                      <div style={{ padding: '0 16px 16px', borderTop: `1px solid ${SOFT}` }}>
                        <div style={{ marginTop: 12 }}>
                          <div style={{ fontSize: 11, fontWeight: 800, color: INDIGO, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Error Detail</div>
                          <div style={{ background: '#1F2937', borderRadius: 10, padding: '12px 14px', fontSize: 12, color: '#E5E7EB', fontFamily: 'monospace', lineHeight: 1.6, wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>
                            {err.error_detail || '(no detail)'}
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
                          <div style={{ background: BG, borderRadius: 10, padding: '10px 12px' }}>
                            <div style={{ fontSize: 10, fontWeight: 800, color: INDIGO, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 }}>Identifier</div>
                            <div style={{ fontSize: 12, color: INDIGO_DARK, fontWeight: 600, wordBreak: 'break-all' }}>{err.identifier || '—'}</div>
                          </div>
                          <div style={{ background: BG, borderRadius: 10, padding: '10px 12px' }}>
                            <div style={{ fontSize: 10, fontWeight: 800, color: INDIGO, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 }}>User Type</div>
                            <div style={{ fontSize: 12, color: INDIGO_DARK, fontWeight: 600 }}>{err.identifier_type === 'user' ? '👤 Account' : '🌐 Anonymous'}</div>
                          </div>
                        </div>
                        <button onClick={() => handleDeleteError(err.id)}
                          style={{ marginTop: 12, width: '100%', padding: '10px', background: '#1F2937', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: FONT }}>
                          🗑️ Delete This Error
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </>
          )}
        </div>
      )}
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