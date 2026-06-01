import { useState, useRef } from "react"

const INDIGO = '#4F46E5'
const INDIGO_LIGHT = '#818CF8'
const MINT = '#34D399'
const SOFT = '#EDE9FE'
const FONT = "'Nunito', 'Plus Jakarta Sans', sans-serif"

function SproutLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <linearGradient id="nbg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={INDIGO} />
          <stop offset="100%" stopColor={INDIGO_LIGHT} />
        </linearGradient>
        <linearGradient id="nleaf" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#6EE7B7" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="url(#nbg)" />
      <ellipse cx="50" cy="76" rx="30" ry="10" fill="rgba(255,255,255,0.2)" />
      <path d="M 42 76 Q 36 84 32 90" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.35" />
      <path d="M 50 76 L 50 90" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.35" />
      <path d="M 58 76 Q 64 84 68 90" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.35" />
      <path d="M 50 76 L 50 45" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M 50 60 Q 26 55 22 34 Q 44 28 52 56 Z" fill="url(#nleaf)" />
      <path d="M 50 50 Q 72 44 76 23 Q 56 17 48 46 Z" fill="url(#nleaf)" opacity="0.85" />
      <ellipse cx="50" cy="40" rx="6" ry="9" fill={MINT} />
      <ellipse cx="50" cy="37" rx="3" ry="4" fill="white" opacity="0.8" />
    </svg>
  )
}

function KurdFlag({ size = 14 }) {
  const w = size * 1.5
  return (
    <svg width={w} height={size} viewBox="0 0 90 60" style={{ borderRadius: 3, display: 'block', flexShrink: 0 }}>
      <rect width="90" height="20" fill="#E30A17" />
      <rect y="20" width="90" height="20" fill="#FFFFFF" />
      <rect y="40" width="90" height="20" fill="#009C3B" />
      <circle cx="45" cy="30" r="9" fill="#F7C200" />
      {Array.from({ length: 21 }).map((_, i) => {
        const angle = (i * 360 / 21) * Math.PI / 180
        return <line key={i} x1={45 + Math.cos(angle) * 9} y1={30 + Math.sin(angle) * 9} x2={45 + Math.cos(angle) * 14} y2={30 + Math.sin(angle) * 14} stroke="#F7C200" strokeWidth="1.5" />
      })}
      <circle cx="45" cy="30" r="5" fill="#E30A17" />
    </svg>
  )
}

const GUIDE_ITEMS = [
  { label: 'My Stage',               sub: 'Track your asylum journey',       icon: '📍' },
  { label: 'Info & Help',            sub: 'Health, rights, money & more',    icon: '📋' },
  { label: 'Ask a Question',         sub: 'Get answers from the community',  icon: '❓' },
  { label: 'Understand Your Letter', sub: 'Explain any UK official letter',  icon: '📄' },
]

export default function NavBarPreview() {
  const [activeTab, setActiveTab] = useState('list_service')
  const [showGuide, setShowGuide] = useState(false)
  const [lang, setLang] = useState('en')
  const [showLang, setShowLang] = useState(false)

  const LANGS = [
    { id: 'en', flag: '🇬🇧', name: 'EN', full: 'English' },
    { id: 'ku', flag: null,   name: 'کوردی', full: 'Kurdish' },
    { id: 'fa', flag: '🇮🇷', name: 'فارسی', full: 'Farsi' },
    { id: 'ar', flag: '🇮🇶', name: 'عربي', full: 'Arabic' },
  ]
  const current = LANGS.find(l => l.id === lang) || LANGS[0]

  return (
    <div style={{ background: '#F5F4FF', minHeight: '100vh', fontFamily: FONT }}>

      {/* NavBar */}
      <div style={{ background: '#fff', position: 'sticky', top: 0, zIndex: 200, borderBottom: '1px solid #EDE9FE', boxShadow: '0 2px 16px rgba(79,70,229,0.08)' }}>

        {/* Top bar */}
        <div style={{ padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <SproutLogo size={34} />
            <span style={{ fontSize: 20, fontWeight: 900, color: INDIGO, letterSpacing: -0.5 }}>Komek</span>
          </div>

          {/* Lang selector */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => { setShowLang(o => !o); setShowGuide(false) }} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px',
              background: SOFT, border: `1.5px solid #C4B5FD`,
              borderRadius: 20, color: INDIGO, fontWeight: 800, fontSize: 12, cursor: 'pointer', fontFamily: FONT,
            }}>
              {current.id === 'ku' ? <KurdFlag size={14} /> : <span style={{ fontSize: 14 }}>{current.flag}</span>}
              <span>{current.name}</span>
              <span style={{ fontSize: 9, opacity: 0.6 }}>{showLang ? '▲' : '▼'}</span>
            </button>
            {showLang && (
              <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 32px rgba(79,70,229,0.15)', zIndex: 400, minWidth: 160, border: '1px solid #EDE9FE' }}>
                {LANGS.map(l => (
                  <button key={l.id} onClick={() => { setLang(l.id); setShowLang(false) }} style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px',
                    background: lang === l.id ? SOFT : '#fff', border: 'none',
                    borderBottom: '1px solid #F5F4FF', cursor: 'pointer', textAlign: 'left', fontFamily: FONT,
                  }}>
                    {l.id === 'ku' ? <KurdFlag size={20} /> : <span style={{ fontSize: 20 }}>{l.flag}</span>}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: lang === l.id ? INDIGO : '#1a1a1a' }}>{l.name}</div>
                      <div style={{ fontSize: 11, color: '#9CA3AF' }}>{l.full}</div>
                    </div>
                    {lang === l.id && <span style={{ color: MINT, fontSize: 14, fontWeight: 900 }}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', padding: '0 12px', gap: 4 }}>
          {[{ id: 'list_service', label: 'Services' }, { id: 'hire_staff', label: 'Jobs' }].map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setShowGuide(false) }} style={{
              flex: 1, padding: '10px 8px',
              background: activeTab === tab.id && !showGuide ? SOFT : 'transparent',
              border: 'none',
              color: activeTab === tab.id && !showGuide ? INDIGO : '#9CA3AF',
              fontWeight: activeTab === tab.id && !showGuide ? 800 : 600,
              fontSize: 13, cursor: 'pointer', fontFamily: FONT,
              borderBottom: activeTab === tab.id && !showGuide ? `2px solid ${INDIGO}` : '2px solid transparent',
              borderRadius: '8px 8px 0 0', transition: 'all 0.2s',
            }}>
              {tab.label}
            </button>
          ))}

          <div style={{ width: 1, height: 20, background: '#EDE9FE', margin: 'auto 4px', flexShrink: 0 }} />

          <div style={{ position: 'relative', flex: 1 }}>
            <button onClick={() => { setShowGuide(o => !o); setShowLang(false) }} style={{
              width: '100%', padding: '10px 8px',
              background: showGuide ? SOFT : 'transparent',
              border: 'none',
              color: showGuide ? INDIGO : '#9CA3AF',
              fontWeight: showGuide ? 800 : 600, fontSize: 13,
              cursor: 'pointer', fontFamily: FONT,
              borderBottom: showGuide ? `2px solid ${MINT}` : '2px solid transparent',
              borderRadius: '8px 8px 0 0', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            }}>
              🧭 Guide <span style={{ fontSize: 8, opacity: 0.6 }}>{showGuide ? '▲' : '▼'}</span>
            </button>

            {showGuide && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                background: '#fff', borderRadius: 20, overflow: 'hidden',
                boxShadow: '0 8px 40px rgba(79,70,229,0.15)', zIndex: 300, minWidth: 260,
                border: '1px solid #EDE9FE',
              }}>
                {/* Handshake lives here in the guide dropdown header */}
                <div style={{ background: `linear-gradient(135deg, ${INDIGO}, ${INDIGO_LIGHT})`, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 24 }}>🤝</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 900, color: '#fff' }}>🧭 Guide</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>Your guide to life in the UK</div>
                  </div>
                </div>
                {GUIDE_ITEMS.map((item, i) => (
                  <button key={i} onClick={() => setShowGuide(false)} style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 18px', background: '#fff', border: 'none',
                    borderBottom: i < GUIDE_ITEMS.length - 1 ? '1px solid #F5F4FF' : 'none',
                    cursor: 'pointer', textAlign: 'left', fontFamily: FONT,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F5F4FF'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: SOFT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                      {item.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: INDIGO }}>{item.label}</div>
                      <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{item.sub}</div>
                    </div>
                    <span style={{ fontSize: 16, color: '#C4B5FD' }}>›</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Page content */}
      <div style={{ padding: 20 }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: 24, textAlign: 'center', border: '1px solid #EDE9FE', marginBottom: 16 }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>👆</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: INDIGO }}>Click Guide to see the 🤝 handshake</div>
          <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 6 }}>It lives in the Guide dropdown header</div>
        </div>

        {/* Bottom nav preview */}
        <div style={{ fontSize: 11, fontWeight: 800, color: '#9CA3AF', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>Bottom Nav</div>
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #EDE9FE', overflow: 'hidden' }}>
          <div style={{ display: 'flex' }}>
            {[{ icon: '🏠', label: 'Home', active: true }, { icon: '➕', label: 'Post', post: true }, { icon: '👤', label: 'Account', active: false }].map(item => (
              <button key={item.label} style={{
                flex: 1, padding: item.post ? '10px 0 8px' : '12px 0 10px',
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, fontFamily: FONT,
              }}>
                {item.post ? (
                  <div style={{ width: 44, height: 44, background: `linear-gradient(135deg, ${INDIGO}, ${INDIGO_LIGHT})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginTop: -20, boxShadow: `0 4px 16px rgba(79,70,229,0.4)` }}>➕</div>
                ) : (
                  <span style={{ fontSize: 22 }}>{item.icon}</span>
                )}
                <span style={{ fontSize: 10, fontWeight: 800, color: item.active ? INDIGO : '#9CA3AF' }}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}