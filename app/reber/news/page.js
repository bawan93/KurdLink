'use client'
<div style={{ maxWidth: 480, margin: '0 auto', padding: '20px 16px 0' }}>
    {loading && (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: `3px solid ${SOFT}`, borderTop: `3px solid ${INDIGO}`, margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: '#9CA3AF', fontFamily: FONT, fontSize: 14, margin: 0 }}>{t.loading}</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )}
    {error && !loading && (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📡</div>
        <p style={{ color: '#6B7280', fontFamily: FONT, fontSize: 14, marginBottom: 20 }}>{t.error}</p>
        <button onClick={loadNews} style={{ padding: '10px 24px', background: INDIGO, color: '#fff', border: 'none', borderRadius: 20, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: FONT }}>
          {t.retry}
        </button>
      </div>
    )}
    {!loading && !error && articles.length === 0 && (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📰</div>
        <p style={{ color: '#9CA3AF', fontFamily: FONT, fontSize: 14, margin: 0 }}>{t.noArticles}</p>
      </div>
    )}
    {!loading && !error && articles.length > 0 && (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {articles.map((article, i) => (
          <NewsCard key={i} article={article} lang={lang} />
        ))}
      </div>
    )}
  </div>
</div>
)

}