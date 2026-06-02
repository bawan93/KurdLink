import { useState } from "react"

const INDIGO = '#4F46E5'
const INDIGO_LIGHT = '#818CF8'
const INDIGO_DARK = '#1C1A4F'
const MINT = '#34D399'
const SOFT = '#EDE9FE'
const BG = '#F5F4FF'
const FONT = "'Nunito', 'Plus Jakarta Sans', sans-serif"

function BoatIllustration() {
  return (
    <svg viewBox="0 0 320 180" width="100%" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="skyS" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#DBEAFE" />
          <stop offset="55%" stopColor="#BFDBFE" />
          <stop offset="100%" stopColor="#93C5FD" />
        </linearGradient>
        <linearGradient id="seaS" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1E40AF" />
        </linearGradient>
        <linearGradient id="cliffS" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F8FAFC" />
          <stop offset="85%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
        <linearGradient id="cliffGreenS" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#86EFAC" />
          <stop offset="100%" stopColor="#4ADE80" />
        </linearGradient>
        <filter id="cliffBlurS">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
      </defs>

      {/* Sky */}
      <rect width="320" height="180" fill="url(#skyS)" />

      {/* Clouds — soft, wispy */}
      <g opacity="0.65">
        <ellipse cx="52" cy="26" rx="32" ry="10" fill="white" />
        <ellipse cx="35" cy="30" rx="20" ry="8" fill="white" />
        <ellipse cx="70" cy="31" rx="22" ry="8" fill="white" />
        <ellipse cx="55" cy="34" rx="26" ry="7" fill="white" />
      </g>
      <g opacity="0.4">
        <ellipse cx="195" cy="20" rx="24" ry="7" fill="white" />
        <ellipse cx="180" cy="24" rx="16" ry="6" fill="white" />
        <ellipse cx="212" cy="24" rx="18" ry="6" fill="white" />
      </g>

      {/* Horizon glow */}
      <ellipse cx="160" cy="98" rx="200" ry="18" fill="#E0E7FF" opacity="0.25" />

      {/* WHITE CLIFFS — smooth, rounded, realistic Dover shape */}
      {/* The key is smooth bezier curves, no sharp peaks */}
      <g filter="url(#cliffBlurS)">
        {/* Main cliff body — smooth rounded top */}
        <path d="
          M 140,108
          L 140,82
          C 145,60 155,55 165,58
          C 172,60 175,65 178,62
          C 183,56 190,50 200,52
          C 210,54 212,60 218,58
          C 226,54 232,48 242,50
          C 252,52 255,58 262,56
          C 270,53 278,46 288,48
          C 298,50 305,56 315,54
          L 320,54
          L 320,108
          Z"
          fill="url(#cliffS)" />

        {/* Green grass on top of cliffs — thin strip following the curve */}
        <path d="
          M 140,82
          C 145,60 155,55 165,58
          C 172,60 175,65 178,62
          C 183,56 190,50 200,52
          C 210,54 212,60 218,58
          C 226,54 232,48 242,50
          C 252,52 255,58 262,56
          C 270,53 278,46 288,48
          C 298,50 305,56 315,54
          L 320,54 L 320,58
          C 305,60 298,54 288,52
          C 278,50 270,57 262,60
          C 255,62 252,56 242,54
          C 232,52 226,58 218,62
          C 212,64 210,58 200,56
          C 190,54 183,60 178,66
          C 175,69 172,64 165,62
          C 155,59 145,64 140,86
          Z"
          fill="url(#cliffGreenS)" opacity="0.7" />

        {/* Cliff face shadow / texture — subtle vertical shading */}
        <path d="M 175,62 C 176,70 177,85 178,108" stroke="#CBD5E1" strokeWidth="1.5" fill="none" opacity="0.4" />
        <path d="M 218,60 C 218,72 220,90 222,108" stroke="#CBD5E1" strokeWidth="1.2" fill="none" opacity="0.3" />
        <path d="M 258,57 C 258,70 260,88 262,108" stroke="#CBD5E1" strokeWidth="1" fill="none" opacity="0.25" />
      </g>

      {/* Lighthouse on cliff — clean, simple */}
      <g opacity="0.85">
        <rect x="295" y="36" width="8" height="20" rx="2" fill="#F1F5F9" />
        <rect x="293" y="34" width="12" height="5" rx="1" fill="#E2E8F0" />
        <polygon points="293,34 305,34 299,28" fill="#F1F5F9" />
        {/* Red band */}
        <rect x="295" y="43" width="8" height="5" fill="#FCA5A5" opacity="0.75" />
        {/* Light */}
        <circle cx="299" cy="30" r="4" fill="#FDE68A" opacity="0.9" />
        <ellipse cx="299" cy="30" rx="10" ry="7" fill="#FDE68A" opacity="0.18" />
        {/* Lighthouse base */}
        <rect x="292" y="54" width="14" height="5" rx="1" fill="#CBD5E1" />
      </g>

      {/* Sea */}
      <rect x="0" y="108" width="320" height="72" fill="url(#seaS)" />

      {/* Sea — calm subtle waves */}
      <path d="M0,114 Q40,111 80,114 Q120,117 160,114 Q200,111 240,114 Q280,117 320,114"
        stroke="rgba(255,255,255,0.13)" strokeWidth="1.2" fill="none" />
      <path d="M0,126 Q50,123 100,126 Q150,129 200,126 Q250,123 300,126 L320,126"
        stroke="rgba(255,255,255,0.09)" strokeWidth="1" fill="none" />
      <path d="M0,140 Q80,137 160,140 Q240,143 320,140"
        stroke="rgba(255,255,255,0.07)" strokeWidth="1" fill="none" />
      <path d="M0,155 Q100,152 200,155 Q260,158 320,155"
        stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" fill="none" />

      {/* Subtle light shimmer on water from sun */}
      <ellipse cx="270" cy="125" rx="30" ry="4" fill="#FDE68A" opacity="0.08" />
      <ellipse cx="268" cy="138" rx="18" ry="2.5" fill="#FDE68A" opacity="0.05" />

      {/* BOAT — medium sized, left-centre, proper sailing boat */}
      <g transform="translate(28, 104)">
        {/* Wake */}
        <path d="M0,18 Q55,24 110,18" stroke="white" strokeWidth="0.8" fill="none" opacity="0.18" />
        <ellipse cx="55" cy="20" rx="58" ry="5" fill="white" opacity="0.06" />

        {/* Hull shadow */}
        <ellipse cx="55" cy="20" rx="56" ry="4" fill="#1E40AF" opacity="0.25" />

        {/* Hull — clean, proper sailboat shape */}
        <path d="M3,5 L8,16 L102,16 L107,5 Z" fill="#1E293B" />
        {/* Hull highlight stripe */}
        <path d="M5,8 L105,8" stroke="#334155" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
        {/* Waterline */}
        <path d="M5,13 L105,13" stroke="#3B82F6" strokeWidth="0.8" opacity="0.4" />

        {/* Cabin */}
        <rect x="58" y="-6" width="36" height="13" rx="3" fill="#2D3748" />
        <rect x="61" y="-3" width="8" height="7" rx="1" fill="#818CF8" opacity="0.45" />
        <rect x="72" y="-3" width="8" height="7" rx="1" fill="#818CF8" opacity="0.35" />
        <rect x="83" y="-3" width="8" height="7" rx="1" fill="#818CF8" opacity="0.28" />

        {/* Mast */}
        <rect x="44" y="-58" width="3" height="64" rx="1" fill="#94A3B8" />

        {/* Main sail — large, elegant */}
        <polygon points="46.5,-56 46.5,5 105,-15" fill="#EEF2FF" opacity="0.9" />
        <path d="M46.5,-56 L105,-15 L46.5,5" stroke="#C7D2FE" strokeWidth="0.8" fill="none" />

        {/* Foresail */}
        <polygon points="45,-50 45,4 8,-10" fill="#E0E7FF" opacity="0.78" />
        <path d="M45,-50 L8,-10 L45,4" stroke="#C7D2FE" strokeWidth="0.7" fill="none" />

        {/* Boom */}
        <line x1="12" y1="5" x2="105" y2="5" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />

        {/* Rigging */}
        <line x1="45" y1="-58" x2="3" y2="3" stroke="#94A3B8" strokeWidth="0.6" opacity="0.5" />
        <line x1="45" y1="-58" x2="105" y2="-14" stroke="#94A3B8" strokeWidth="0.5" opacity="0.35" />
        <line x1="45" y1="-30" x2="3" y2="3" stroke="#94A3B8" strokeWidth="0.4" opacity="0.3" />

        {/* UK flag — small on mast top */}
        <g transform="translate(46, -66)">
          <rect width="14" height="9" rx="1" fill="#012169" />
          <line x1="0" y1="0" x2="14" y2="9" stroke="white" strokeWidth="1.3" />
          <line x1="14" y1="0" x2="0" y2="9" stroke="white" strokeWidth="1.3" />
          <line x1="7" y1="0" x2="7" y2="9" stroke="white" strokeWidth="1.8" />
          <line x1="0" y1="4.5" x2="14" y2="4.5" stroke="white" strokeWidth="1.8" />
          <line x1="0" y1="0" x2="14" y2="9" stroke="#C8102E" strokeWidth="0.7" />
          <line x1="14" y1="0" x2="0" y2="9" stroke="#C8102E" strokeWidth="0.7" />
          <line x1="7" y1="0" x2="7" y2="9" stroke="#C8102E" strokeWidth="2.5" />
          <line x1="0" y1="4.5" x2="14" y2="4.5" stroke="#C8102E" strokeWidth="2.5" />
        </g>
      </g>

      {/* Sun — soft atmospheric glow only, no rays */}
      <circle cx="275" cy="44" r="22" fill="#FDE68A" opacity="0.18" />
      <circle cx="275" cy="44" r="13" fill="#FDE68A" opacity="0.3" />
      <circle cx="275" cy="44" r="7" fill="#FEF3C7" opacity="0.65" />

      {/* Two distant birds — minimal */}
      <path d="M165,46 Q169,42 173,46" stroke="#94A3B8" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.55" />
      <path d="M178,38 Q183,34 188,38" stroke="#94A3B8" strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.45" />
    </svg>
  )
}

function LeaveToRemainIllustration() {
  return (
    <svg viewBox="0 0 320 180" width="100%" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="bg2e" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#064E3B" />
          <stop offset="100%" stopColor="#065F46" />
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#bg2e)" />
      {[[25,20,'#34D399',15],[60,15,'#FCD34D',25],[100,25,'#F87171',10],[150,12,'#818CF8',20],[200,22,'#34D399',30],[250,16,'#FCD34D',15],[290,28,'#F87171',25],[40,45,'#818CF8',10],[130,40,'#FCD34D',20],[220,38,'#34D399',15],[280,42,'#F87171',30]].map(([x,y,c,r],i) => (
        <g key={i} transform={`translate(${x},${y}) rotate(${r})`}>
          <rect x="-4" y="-2" width="8" height="4" rx="1" fill={c} opacity="0.85" />
        </g>
      ))}
      <g transform="translate(35, 50)">
        <rect x="0" y="20" width="130" height="90" rx="6" fill="#FEF9C3" />
        <polygon points="0,20 65,60 130,20 130,20 65,55 0,20" fill="#FDE68A" />
        <polygon points="0,20 0,110 30,65" fill="#FDE047" opacity="0.4" />
        <polygon points="130,20 130,110 100,65" fill="#FDE047" opacity="0.4" />
      </g>
      <g transform="translate(80, 20)">
        <rect x="0" y="0" width="90" height="115" rx="5" fill="white" />
        <rect x="10" y="14" width="55" height="4" rx="2" fill="#E5E7EB" />
        <rect x="10" y="24" width="70" height="3" rx="1.5" fill="#E5E7EB" />
        <rect x="10" y="32" width="65" height="3" rx="1.5" fill="#E5E7EB" />
        <rect x="10" y="40" width="68" height="3" rx="1.5" fill="#E5E7EB" />
        <rect x="10" y="48" width="50" height="3" rx="1.5" fill="#E5E7EB" />
        <g transform="translate(12, 58) rotate(-8)">
          <rect x="0" y="0" width="60" height="22" rx="3" fill="none" stroke="#059669" strokeWidth="2.5" />
          <text x="30" y="15" textAnchor="middle" fontSize="11" fontWeight="900" fill="#059669" fontFamily="monospace">APPROVED</text>
        </g>
        <circle cx="70" cy="90" r="18" fill="#34D399" />
        <circle cx="70" cy="90" r="14" fill="#059669" />
        <path d="M62,90 L68,97 L80,82" stroke="white" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="10" y="98" width="45" height="3" rx="1.5" fill="#E5E7EB" />
      </g>
      <text x="240" y="55" fontSize="28" opacity="0.8">⭐</text>
      <text x="270" y="100" fontSize="18" opacity="0.7">✨</text>
      <text x="20" y="120" fontSize="20" opacity="0.7">🎉</text>
      <text x="265" y="145" fontSize="22" opacity="0.8">🎊</text>
      <g transform="translate(220, 70)">
        <circle cx="35" cy="35" r="35" fill="#34D399" opacity="0.15" />
        <circle cx="35" cy="35" r="28" fill="#34D399" opacity="0.25" />
        <circle cx="35" cy="35" r="22" fill="#34D399" />
        <text x="35" y="30" textAnchor="middle" fontSize="16" fontWeight="900" fill="white">28</text>
        <text x="35" y="44" textAnchor="middle" fontSize="8" fontWeight="700" fill="white">DAYS</text>
      </g>
    </svg>
  )
}

function CitizenshipIllustration() {
  return (
    <svg viewBox="0 0 320 180" width="100%" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="bg3e" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2E1065" />
          <stop offset="100%" stopColor="#4C1D95" />
        </linearGradient>
        <linearGradient id="passport3e" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#bg3e)" />
      {[[15,15],[45,8],[80,18],[120,10],[165,16],[210,8],[255,18],[295,12],[30,35],[90,28],[145,32],[200,26],[260,30],[310,35]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={i%4===0 ? 2.2 : 1.3} fill="#FCD34D" opacity={0.3+(i%3)*0.25} />
      ))}
      <g transform="translate(220, 60)" opacity="0.5">
        <rect x="15" y="80" width="30" height="42" fill="#3B1F6B" />
        <rect x="10" y="60" width="40" height="25" fill="#3B1F6B" />
        <rect x="5" y="48" width="50" height="16" fill="#3B1F6B" />
        <polygon points="0,48 30,20 60,48" fill="#3B1F6B" />
        <circle cx="30" cy="65" r="10" fill="none" stroke="#FCD34D" strokeWidth="1.5" opacity="0.6" />
      </g>
      <g transform="translate(45, 28)">
        <rect x="0" y="0" width="95" height="125" rx="6" fill="url(#passport3e)" />
        <rect x="98" y="0" width="95" height="125" rx="6" fill="url(#passport3e)" />
        <rect x="91" y="0" width="11" height="125" fill="#1E3A8A" />
        <rect x="8" y="10" width="79" height="50" rx="3" fill="rgba(255,255,255,0.08)" />
        <rect x="12" y="14" width="30" height="38" rx="2" fill="rgba(255,255,255,0.15)" />
        <circle cx="27" cy="28" r="8" fill="rgba(255,255,255,0.2)" />
        <ellipse cx="27" cy="42" rx="10" ry="6" fill="rgba(255,255,255,0.2)" />
        <rect x="48" y="18" width="35" height="3" rx="1" fill="rgba(255,255,255,0.3)" />
        <rect x="48" y="26" width="28" height="3" rx="1" fill="rgba(255,255,255,0.2)" />
        <rect x="48" y="34" width="32" height="3" rx="1" fill="rgba(255,255,255,0.2)" />
        <rect x="8" y="105" width="79" height="4" rx="1" fill="rgba(255,255,255,0.15)" />
        <rect x="8" y="114" width="79" height="4" rx="1" fill="rgba(255,255,255,0.15)" />
        <circle cx="30" cy="82" r="15" fill="none" stroke="#34D399" strokeWidth="1.5" strokeDasharray="3 2" />
        <text x="30" y="86" textAnchor="middle" fontSize="7" fill="#34D399" fontWeight="700">ENTRY</text>
        <circle cx="68" cy="90" r="12" fill="none" stroke="#818CF8" strokeWidth="1.5" strokeDasharray="3 2" />
        <text x="68" y="94" textAnchor="middle" fontSize="6" fill="#818CF8" fontWeight="700">UK</text>
        <rect x="106" y="8" width="79" height="110" rx="3" fill="rgba(255,255,255,0.05)" />
        <g transform="translate(145, 22)">
          <rect x="-20" y="18" width="40" height="8" rx="2" fill="#FCD34D" />
          <rect x="-16" y="6" width="32" height="14" rx="1" fill="#FCD34D" />
          <polygon points="-16,6 -10,-8 -4,2" fill="#FCD34D" />
          <polygon points="-2,6 0,-12 2,6" fill="#FCD34D" />
          <polygon points="4,6 10,-8 16,6" fill="#FCD34D" />
          <circle cx="-10" cy="-5" r="3" fill="#F87171" />
          <circle cx="0" cy="-8" r="3.5" fill="#34D399" />
          <circle cx="10" cy="-5" r="3" fill="#818CF8" />
        </g>
        <text x="145" y="68" textAnchor="middle" fontSize="9" fontWeight="900" fill="rgba(255,255,255,0.7)" letterSpacing="1">BRITISH</text>
        <text x="145" y="80" textAnchor="middle" fontSize="7" fontWeight="700" fill="rgba(255,255,255,0.5)" letterSpacing="1">PASSPORT</text>
        <g transform="translate(124, 88)">
          <rect width="42" height="26" rx="2" fill="#012169" />
          <line x1="0" y1="0" x2="42" y2="26" stroke="white" strokeWidth="3.5" />
          <line x1="42" y1="0" x2="0" y2="26" stroke="white" strokeWidth="3.5" />
          <line x1="21" y1="0" x2="21" y2="26" stroke="white" strokeWidth="5" />
          <line x1="0" y1="13" x2="42" y2="13" stroke="white" strokeWidth="5" />
          <line x1="0" y1="0" x2="42" y2="26" stroke="#C8102E" strokeWidth="2" />
          <line x1="42" y1="0" x2="0" y2="26" stroke="#C8102E" strokeWidth="2" />
          <line x1="21" y1="0" x2="21" y2="26" stroke="#C8102E" strokeWidth="6" />
          <line x1="0" y1="13" x2="42" y2="13" stroke="#C8102E" strokeWidth="6" />
        </g>
      </g>
      <ellipse cx="143" cy="95" rx="80" ry="50" fill="#7C3AED" opacity="0.15" />
      <text x="15" y="90" fontSize="18">⭐</text>
      <text x="290" y="75" fontSize="14">✨</text>
      <text x="280" y="155" fontSize="20">👑</text>
    </svg>
  )
}

const CARDS = [
  {
    step: 'Stage 1', title: 'New to the UK',
    desc: 'Just arrived? This guide covers everything from your first steps on UK soil to getting your ARC card, housing support and free legal help.',
    stats: [{ val: '£49.18', label: 'Weekly support' }, { val: '100%', label: 'Free NHS' }],
    color: INDIGO, light: SOFT, cta: 'Read the guide',
    Illustration: BoatIllustration,
  },
  {
    step: 'Stage 2', title: 'Leave to Remain',
    desc: 'Been granted refugee status? You have 28 days to act. Housing, benefits, work, bank accounts — this guide covers it all.',
    stats: [{ val: '28', label: 'Days to act' }, { val: '5yr', label: 'Leave to remain' }],
    color: '#059669', light: '#D1FAE5', cta: 'Read the guide',
    Illustration: LeaveToRemainIllustration,
  },
  {
    step: 'Stage 3', title: 'British Citizenship',
    desc: 'The path to a British passport — settled status, indefinite leave to remain, the Life in the UK test and naturalisation.',
    stats: [{ val: '5yr', label: 'To settled status' }, { val: '£1,500', label: 'Approx. fee' }],
    color: '#7C3AED', light: '#EDE9FE', cta: 'Read the guide',
    Illustration: CitizenshipIllustration,
  },
]

export default function ComingToUKFinal() {
  const [pressed, setPressed] = useState(null)

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: FONT, paddingBottom: 80 }}>
      <div style={{ background: INDIGO_DARK, padding: '36px 24px 32px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(129,140,248,0.2)', border: '1px solid rgba(129,140,248,0.3)', borderRadius: 20, padding: '4px 14px', marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: INDIGO_LIGHT, letterSpacing: 1.5 }}>YOUR JOURNEY</span>
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: '#fff', margin: '0 0 10px', letterSpacing: -0.5 }}>Coming to the UK</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.7, fontWeight: 500 }}>
            Everything you need to know — from the moment you arrive to becoming a British citizen.
          </p>
        </div>
      </div>

      <div style={{ padding: '24px 20px', maxWidth: 480, margin: '0 auto' }}>
        {CARDS.map((card, i) => {
          const Illus = card.Illustration
          return (
            <div key={i}
              onPointerDown={() => setPressed(i)}
              onPointerUp={() => setPressed(null)}
              onPointerLeave={() => setPressed(null)}
              style={{
                background: '#fff', borderRadius: 24, marginBottom: 20,
                overflow: 'hidden', border: `1.5px solid ${card.color}15`,
                boxShadow: pressed === i ? `0 2px 8px ${card.color}20` : `0 8px 40px ${card.color}18`,
                cursor: 'pointer',
                transform: pressed === i ? 'scale(0.98)' : 'scale(1)',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ position: 'relative' }}>
                <Illus />
                <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)', borderRadius: 20, padding: '4px 12px', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#fff', letterSpacing: 1 }}>{card.step}</span>
                </div>
              </div>
              <div style={{ padding: '18px 20px 8px' }}>
                <h3 style={{ fontSize: 20, fontWeight: 900, color: card.color, margin: '0 0 8px', letterSpacing: -0.3 }}>{card.title}</h3>
                <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 16px', lineHeight: 1.7, fontWeight: 500 }}>{card.desc}</p>
                <div style={{ display: 'flex', gap: 10, marginBottom: 4 }}>
                  {card.stats.map((s, j) => (
                    <div key={j} style={{ flex: 1, background: card.light, borderRadius: 12, padding: '10px 14px' }}>
                      <div style={{ fontSize: 18, fontWeight: 900, color: card.color }}>{s.val}</div>
                      <div style={{ fontSize: 10, color: card.color, fontWeight: 600, opacity: 0.7, marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding: '12px 20px 20px' }}>
                <div style={{ background: `linear-gradient(135deg, ${card.color}, ${card.color}CC)`, borderRadius: 14, padding: '13px', textAlign: 'center', fontSize: 14, fontWeight: 800, color: '#fff', boxShadow: `0 4px 16px ${card.color}35` }}>
                  {card.cta} →
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}