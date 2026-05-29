// components/KurdishFlag.js
// Inline SVG of the Kurdish flag — red/white/green stripes with yellow sun

export default function KurdishFlag({ size = 24 }) {
  const w = size * 1.5
  const h = size
  return (
    <svg width={w} height={h} viewBox="0 0 90 60" style={{ borderRadius: 3, display: 'block', flexShrink: 0 }}>
      {/* Red stripe */}
      <rect width="90" height="20" fill="#E30A17" />
      {/* White stripe */}
      <rect y="20" width="90" height="20" fill="#FFFFFF" />
      {/* Green stripe */}
      <rect y="40" width="90" height="20" fill="#009C3B" />
      {/* Yellow sun */}
      <circle cx="45" cy="30" r="9" fill="#F7C200" />
      {/* Sun rays — 21 rays */}
      {Array.from({ length: 21 }).map((_, i) => {
        const angle = (i * 360 / 21) * Math.PI / 180
        const x1 = 45 + Math.cos(angle) * 9
        const y1 = 30 + Math.sin(angle) * 9
        const x2 = 45 + Math.cos(angle) * 14
        const y2 = 30 + Math.sin(angle) * 14
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#F7C200" strokeWidth="1.5" />
      })}
      {/* Inner sun circle */}
      <circle cx="45" cy="30" r="5" fill="#E30A17" />
    </svg>
  )
}