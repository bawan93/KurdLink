'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const TX = {
  en: {
    dir: 'ltr',
    welcome: 'Welcome to KurdLink',
    tagline: 'Your trusted community platform',
    question: 'What would you like to do?',
    findServices: 'Find Services',
    findServicesDesc: 'Discover trusted Kurdish professionals',
    sellBusiness: 'Sell Your Business',
    sellBusinessDesc: 'Find a buyer quickly',
    sellCar: 'Sell Your Car',
    sellCarDesc: 'List and connect with buyers',
    hireStaff: 'Hire Staff',
    hireStaffDesc: 'Post jobs and find talent',
    listService: 'List My Service',
    listServiceDesc: 'Build your verified profile',
    alreadyHave: 'Already have an account?',
    signIn: 'Sign In',
  },
  ku: {
    dir: 'rtl',
    welcome: 'بەخێربێیت بۆ KurdLink',
    tagline: 'پلاتفۆرمی کۆمەڵگای قوتابیت',
    question: 'چیت دەیهوێت بکەی؟',
    findServices: 'بدۆزەوە بۆ خزمەتگوزاریەکان',
    findServicesDesc: 'کاریگەری کرد بە پیشەوەری کورد',
    sellBusiness: 'فرۆشتنی بیزنسەکەت',
    sellBusinessDesc: 'بیدۆزەوە بۆ کڕیار بە خێرایی',
    sellCar: 'فرۆشتنی ئۆتۆمبێلەکەت',
    sellCarDesc: 'لیست کردن و پەیوەندی کردن',
    hireStaff: 'کاری بکەرمنند بگرە',
    hireStaffDesc: 'پۆستی پڕۆگرامی کردن و بدۆزەوە نیعمە',
    listService: 'لیستکردنی خزمەتگوزاریەکەم',
    listServiceDesc: 'دروستکردنی پڕۆفایلی سەلماندراو',
    alreadyHave: 'حسابی هەیت؟',
    signIn: 'چوونەژوورەوە',
  }
}

const OPTIONS = [
  { id: 'find', icon: '🔍', color: '#FF6B35' },
  { id: 'sellBiz', icon: '💼', color: '#00B4D8' },
  { id: 'sellCar', icon: '🚗', color: '#06FFA5' },
  { id: 'hire', icon: '👥', color: '#FFB703' },
  { id: 'listService', icon: '🎯', color: '#FF006E' },
]

export default function LandingChoice() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const t = TX[lang]
  const isRtl = t.dir === 'rtl'

  const handleOption = (optionId) => {
    // Route to appropriate form based on selection
    const routes = {
      find: '/listings/browse',
      sellBiz: '/listings/sell-business',
      sellCar: '/listings/sell-car',
      hire: '/listings/hire-staff',
      listService: '/listings/list-service',
    }
    router.push(routes[optionId])
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1A2B5F 0%, #1a3a52 100%)',
      fontFamily: "'Sora', 'Segoe UI', sans-serif",
      direction: t.dir,
      padding: '0',
      margin: '0',
      overflow: 'hidden'
    }}>
      
      {/* Header with Logo & Language Toggle */}
      <div style={{
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{
          fontSize: '24px',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #FF6B35, #FF8C61)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          KurdLink
        </div>

        {/* Language Toggle */}
        <div style={{
          display: 'flex',
          gap: '6px',
          background: 'rgba(255,255,255,0.08)',
          padding: '6px 8px',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
        }}>
          {['en', 'ku'].map(langCode => (
            <button
              key={langCode}
              onClick={() => setLang(langCode)}
              style={{
                padding: '6px 12px',
                background: lang === langCode ? '#fff' : 'transparent',
                color: lang === langCode ? '#1A2B5F' : '#fff',
                border: 'none',
                borderRadius: '16px',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            >
              {langCode === 'en' ? 'EN' : 'KU'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        padding: '32px 20px 20px',
        maxWidth: '600px',
        margin: '0 auto',
      }}>
        
        {/* Hero Section */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 800,
            color: '#fff',
            margin: '0 0 8px 0',
            lineHeight: 1.2,
          }}>
            {t.welcome}
          </h1>
          <p style={{
            fontSize: '15px',
            color: 'rgba(255,255,255,0.7)',
            margin: '0',
            fontWeight: 500,
          }}>
            {t.tagline}
          </p>
        </div>

        {/* Question */}
        <p style={{
          fontSize: '16px',
          fontWeight: 700,
          color: '#fff',
          textAlign: 'center',
          marginBottom: '28px',
          opacity: 0.95,
        }}>
          {t.question}
        </p>

        {/* Option Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '14px',
          marginBottom: '20px',
        }}>
          {OPTIONS.map((option, idx) => {
            const textKey = option.id === 'find' ? 'findServices' :
                           option.id === 'sellBiz' ? 'sellBusiness' :
                           option.id === 'sellCar' ? 'sellCar' :
                           option.id === 'hire' ? 'hireStaff' :
                           'listService'
            const descKey = option.id === 'find' ? 'findServicesDesc' :
                           option.id === 'sellBiz' ? 'sellBusinessDesc' :
                           option.id === 'sellCar' ? 'sellCarDesc' :
                           option.id === 'hire' ? 'hireStaffDesc' :
                           'listServiceDesc'

            return (
              <button
                key={option.id}
                onClick={() => handleOption(option.id)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '2px solid rgba(255,255,255,0.15)',
                  borderRadius: '16px',
                  padding: '20px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `rgba(${option.color.substring(1).match(/.{1,2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.15)`
                  e.currentTarget.style.borderColor = option.color
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = `0 8px 24px ${option.color}40`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{
                  fontSize: '32px',
                  lineHeight: 1,
                }}>
                  {option.icon}
                </div>
                <div style={{
                  textAlign: 'center',
                }}>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#fff',
                    margin: '0 0 4px 0',
                    lineHeight: 1.2,
                  }}>
                    {t[textKey]}
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.6)',
                    margin: '0',
                    lineHeight: 1.3,
                  }}>
                    {t[descKey]}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Sign In Link */}
        <div style={{
          textAlign: 'center',
          marginTop: '32px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}>
          <p style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.7)',
            margin: '0 0 10px 0',
          }}>
            {t.alreadyHave}
          </p>
          <button
            onClick={() => router.push('/auth')}
            style={{
              background: 'linear-gradient(135deg, #FF6B35, #FF8C61)',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 32px',
              color: '#fff',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 4px 14px rgba(255,107,53,0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,107,53,0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(255,107,53,0.3)'
            }}
          >
            {t.signIn}
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '200px',
        background: 'radial-gradient(circle at 20% 50%, rgba(255,107,53,0.15), transparent 50%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />
      <div style={{
        position: 'fixed',
        top: '10%',
        right: '-10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(0,180,216,0.1), transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 0,
      }} />
    </div>
  )
}