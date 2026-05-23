'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

const FONT = "'Plus Jakarta Sans', 'Sora', sans-serif"
const ORANGE = 'linear-gradient(135deg, #FF6B35, #FF8C61)'
const NAVY = '#1A2B5F'

function getSupabase() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export default function Jobs() {
  const router = useRouter()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [lang, setLang] = useState('en')
  const isRtl = lang === 'ku'

  const T = {
    en: { title: 'Jobs', subtitle: 'Latest job opportunities in the Kurdish community', empty: 'No jobs posted yet', emptyDesc: 'Check back soon or post a job yourself', postJob: 'Post a Job', apply: 'Apply Now' },
    ku: { title: 'کارەکان', subtitle: 'دواترین دەرفەتی کار لە کۆمەڵگای کورد', empty: 'هێشتا هیچ کارێک پۆست نەکراوە', emptyDesc: 'دواتر سەردان بکەرەوە یان خۆت کارێک پۆست بکە', postJob: 'کار پۆست بکە', apply: 'داواکاری بکە' }
  }
  const t = T[lang]

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    const supabase = getSupabase()
    const { data } = await supabase
      .from('listings')
      .select('*')
      .eq('type', 'hire_staff')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
    setListings(data || [])
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f5', fontFamily: FONT, direction: isRtl ? 'rtl' : 'ltr', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ background: NAVY, padding: '16px 20px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 15, cursor: 'pointer', fontFamily: FONT, fontWeight: 600 }}>← Back</button>
          <div style={{ fontSize: 18, fontWeight: 800, background: ORANGE, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>KurdLink</div>
          <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.1)', padding: '4px 6px', borderRadius: 20 }}>
            {['en', 'ku'].map(l => (<button key={l} onClick={() => setLang(l)} style={{ padding: '5px 12px', background: lang === l ? '#fff' : 'transparent', color: lang === l ? NAVY : 'rgba(255,255,255,0.7)', border: 'none', borderRadius: 16, fontWeight: 700, fontSize: 11, cursor: 'pointer', fontFamily: FONT }}>{l === 'en' ? 'EN' : 'KU'}</button>))}
          </div>
        </div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: '8px 0 2px' }}>👥 {t.title}</h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', margin: 0 }}>{t.subtitle}</p>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '16px 16px 20px', boxSizing: 'border-box' }}>
        {/* Post a job CTA */}
        <button onClick={() => router.push('/listings/hire-staff')} style={{ width: '100%', background: ORANGE, border: 'none', borderRadius: 14, padding: '14px', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: FONT, marginBottom: 16, boxShadow: '0 4px 16px rgba(255,107,53,0.3)' }}>
          + {t.postJob}
        </button>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#aaa', fontSize: 14 }}>Loading…</div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#444', margin: '0 0 6px' }}>{t.empty}</p>
            <p style={{ fontSize: 13, color: '#aaa', margin: 0 }}>{t.emptyDesc}</p>
          </div>
        ) : (
          listings.map(listing => {
            const d = listing.data || {}
            return (
              <div key={listing.id} style={{ background: '#fff', borderRadius: 16, padding: '18px', marginBottom: 12, border: '1.5px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(6,255,165,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>👥</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: NAVY, margin: '0 0 4px', lineHeight: 1.2 }}>{d.jobTitle}</h3>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {d.city && <span style={{ fontSize: 12, color: '#666' }}>📍 {d.city}</span>}
                      {d.postcode && <span style={{ fontSize: 12, color: '#666' }}>{d.postcode}</span>}
                    </div>
                  </div>
                </div>
                {d.salary && (
                  <div style={{ display: 'inline-block', background: 'rgba(255,107,53,0.1)', color: '#FF6B35', fontSize: 13, fontWeight: 700, padding: '4px 12px', borderRadius: 20, marginBottom: 10 }}>
                    💰 {d.salary}
                  </div>
                )}
                {d.description && (
                  <p style={{ fontSize: 13, color: '#666', margin: '0 0 14px', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{d.description}</p>
                )}
                <div style={{ display: 'flex', gap: 8 }}>
                  {d.applyPhone && (
                    <a href={`tel:${d.applyPhone}`} style={{ flex: 1, background: ORANGE, border: 'none', borderRadius: 10, padding: '10px', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: FONT, textAlign: 'center', textDecoration: 'none', display: 'block' }}>📞 Call</a>
                  )}
                  {d.applyEmail && (
                    <a href={`mailto:${d.applyEmail}`} style={{ flex: 1, background: 'rgba(26,43,95,0.08)', border: 'none', borderRadius: 10, padding: '10px', color: NAVY, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: FONT, textAlign: 'center', textDecoration: 'none', display: 'block' }}>✉️ Email</a>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}