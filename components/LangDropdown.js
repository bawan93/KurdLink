'use client'
import { useState, useRef, useEffect } from 'react'

const LANGS = [
  { id: 'en', label: 'EN',      full: 'English', flag: '🇬🇧' },
  { id: 'ku', label: 'کوردی',  full: 'Kurdish',  flag: '🏴' },
  { id: 'fa', label: 'فارسی',  full: 'Farsi',    flag: '🇮🇷' },
  { id: 'ar', label: 'عربي',   full: 'Arabic',   flag: '🇮🇶' },
]

// Coloured dot fallback in case emoji flags don't render
const FLAG_COLORS = { en: '#012169', ku: '#FF9800', fa: '#239f40', ar: '#000000' }

export default function LangDropdown({ lang, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = LANGS.find(l => l.id === lang) || LANGS[0]

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (id) => {
    localStorage.setItem('kurdlink_lang', id)
    onChange(id)
    setOpen(false)
  }

  // Wrapper style — always LTR, always positioned top-right
  // position:absolute + right:0 pins it regardless of page direction
  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top: '50%',
        right: 16,
        transform: 'translateY(-50%)',
        userSelect: 'none',
        direction: 'ltr',
        zIndex: 100,
      }}
    >
      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 10px',
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: 20,
          color: '#fff', fontWeight: 700, fontSize: 12,
          cursor: 'pointer',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ fontSize: 16, lineHeight: 1 }}>{current.flag}</span>
        <span>{current.label}</span>
        <span style={{ fontSize: 9, opacity: 0.7 }}>{open ? '▲' : '▼'}</span>
      </button>

      {/* Dropdown — always anchored to right edge */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            background: '#fff',
            borderRadius: 14,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            zIndex: 300,
            minWidth: 160,
            border: '1px solid rgba(0,0,0,0.08)',
            direction: 'ltr',
          }}
        >
          {LANGS.map(l => (
            <button
              key={l.id}
              onClick={() => handleSelect(l.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '11px 16px',
                background: lang === l.id ? '#FFF4F0' : '#fff',
                border: 'none',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>{l.flag}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: lang === l.id ? '#FF6B35' : '#1a1a1a' }}>
                  {l.label}
                </div>
                <div style={{ fontSize: 11, color: '#aaa' }}>{l.full}</div>
              </div>
              {lang === l.id && (
                <span style={{ color: '#FF6B35', fontSize: 14, flexShrink: 0 }}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}