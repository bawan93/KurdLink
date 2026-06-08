'use client'

export default function Error({ error, reset }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#F5F4FF',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Nunito, sans-serif',
      padding: '0 24px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>⚠️</div>
      <h1 style={{ fontSize: 28, fontWeight: 900, color: '#1C1A4F', margin: '0 0 8px' }}>Something went wrong</h1>
      <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 32px', maxWidth: 280, lineHeight: 1.6 }}>
        {error?.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <button
        onClick={reset}
        style={{
          background: '#4F46E5',
          color: 'white',
          padding: '12px 28px',
          borderRadius: 12,
          fontWeight: 800,
          fontSize: 14,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Try again
      </button>
    </div>
  )
}
