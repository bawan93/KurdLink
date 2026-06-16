'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/app/lib/supabase'
import TX from '../../lib/translations'

const INDIGO = '#4F46E5'
const INDIGO_DARK = '#1C1A4F'
const INDIGO_LIGHT = '#818CF8'
const MINT = '#34D399'
const SOFT = '#EDE9FE'
const BG = '#F5F4FF'
const FONT = "'Nunito', sans-serif"

const supabase = createClient()

export default function FindPage() {
  const [lang, setLang] = useState('en')
  const [tab, setTab] = useState('jobs')
  const [jobs, setJobs] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const isRTL = ['ku', 'fa', 'ar'].includes(lang)
  const t = (TX[lang] || TX.en).find

  useEffect(() => {
    const saved = localStorage.getItem('komek_lang')
    if (saved) setLang(saved)
    const handler = (e) => setLang(e.detail)
    window.addEventListener('langchange', handler)
    fetchListings()
    return () => window.removeEventListener('langchange', handler)
  }, [])

  async function fetchListings() {
    setLoading(true)
    const { data } = await supabase
      .from('listings')
      .select('*')
      .in('type', ['hire_staff', 'list_service'])
      .in('status', ['approved', 'filled'])
      .neq('paused', true)
      .order('created_at', { ascending: false })
    if (data) {
      setJobs(data.filter(l => l.type === 'hire_staff'))
      setServices(data.filter(l => l.type === 'list_service'))
    }
    setLoading(false)
  }

  const listings = tab === 'jobs' ? jobs : services

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: FONT, direction: isRTL ? 'rtl' : 'ltr', paddingBottom: 80 }}>
      <div style={{ background: `linear-gradient(135deg, ${INDIGO_DARK} 0%, #2D2A7A 100%)`, padding: '40px 20px 56px', textAlign: 'center' }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>🔍</div>
        <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 900, margin: '0 0 8px' }}>{t.heroTitle}</h1>
        <p style={{ color: INDIGO_LIGHT, fontSize: 14, fontWeight: 500, margin: 0 }}>{t.heroSub}</p>
      </div>

      <div style={{ padding: '0 16px', marginTop: -24 }}>
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(79,70,229,0.10)', display: 'flex', marginBottom: 16, overflow: 'hidden' }}>
          {['jobs', 'services'].map(t2 => (
            <button key={t2} onClick={() => setTab(t2)} style={{
              flex: 1, padding: '14px 0', background: tab === t2 ? SOFT : '#fff',
              border: 'none', fontFamily: FONT, fontSize: 14, fontWeight: 700,
              color: tab === t2 ? INDIGO : '#9CA3AF',
              borderBottom: tab === t2 ? `2px solid ${INDIGO}` : '2px solid transparent',
              cursor: 'pointer', transition: 'all 0.2s',
            }}>
              {t2 === 'jobs' ? `👥 ${t.jobs}` : `🛠️ ${t.services}`}
              <span style={{ marginLeft: 6, background: tab === t2 ? INDIGO : '#E5E7EB', color: tab === t2 ? '#fff' : '#6B7280', fontSize: 11, fontWeight: 800, padding: '2px 7px', borderRadius: 20 }}>
                {t2 === 'jobs' ? jobs.length : services.length}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <div style={{ width: 32, height: 32, border: `3px solid ${SOFT}`, borderTopColor: INDIGO, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#9CA3AF', fontSize: 14, fontWeight: 600, padding: '40px 0' }}>{t.empty}</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {listings.map(listing => {
              const d = listing.data || {}
              const isFilled = listing.status === 'filled'
              return (
                <div key={listing.id} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(79,70,229,0.07)', overflow: 'hidden', opacity: isFilled ? 0.7 : 1 }}>
                  <div style={{ background: tab === 'jobs' ? SOFT : '#F0FDF4', padding: '6px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 13 }}>{tab === 'jobs' ? '👥' : '🛠️'}</span>
                      <span style={{ fontSize: 11, fontWeight: 800, color: tab === 'jobs' ? INDIGO : '#059669', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        {tab === 'jobs' ? t.jobs : t.services}
                      </span>
                    </div>
                    {isFilled && <span style={{ background: '#FEF3C7', color: '#D97706', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 20 }}>{t.filled}</span>}
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: INDIGO_DARK, margin: '0 0 8px' }}>
                      {tab === 'jobs' ? d.jobTitle : d.serviceName}
                    </h3>
                    <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 12px', lineHeight: 1.5 }}>{d.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                      {d.location && <span style={{ background: BG, color: INDIGO_DARK, fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 20 }}>📍 {d.location}</span>}
                      {(d.salary || d.price) && <span style={{ background: '#F0FDF4', color: '#059669', fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 20 }}>💰 {d.salary || d.price}</span>}
                    </div>
                    {d.contact && !isFilled && (
                      <a href={d.contact.includes('@') ? `mailto:${d.contact}` : `tel:${d.contact.replace(/\s/g, '')}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: INDIGO, color: '#fff', fontFamily: FONT, fontWeight: 700, fontSize: 13, padding: '9px 16px', borderRadius: 10, textDecoration: 'none' }}>
                        📞 {t.contact}
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}