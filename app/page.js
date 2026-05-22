'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

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

  const handleOption = (optionId) => {
    const routes = {
      find: '/listings/browse',
      sellBiz: '/listings/sell-business',
      sellCar: '/listings/sell-car',
      hire: '/listings/hire-staff',
      listService: '/listings/list-service',
    }
    router.push(routes[optionId])
  }

  const getCardTitle = (id) => {
    const keyMap = {
      find: 'findServices',
      sellBiz: 'sellBusiness',
      sellCar: 'sellCar',
      hire: 'hireStaff',
      listService: 'listService',
    }
    return t[keyMap[id]]
  }

  const getCardDesc = (id) => {
    const keyMap = {
      find: 'findServicesDesc',
      sellBiz: 'sellBusinessDesc',
      sellCar: 'sellCarDesc',
      hire: 'hireStaffDesc',
      listService: 'listServiceDesc',
    }
    return t[keyMap[id]]
  }

  return (
    <div className={styles.container} dir={t.dir}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.logo}>KurdLink</div>

        {/* Language Toggle */}
        <div className={styles.langToggle}>
          {['en', 'ku'].map(langCode => (
            <button
              key={langCode}
              onClick={() => setLang(langCode)}
              className={`${styles.langButton} ${lang === langCode ? styles.active : ''}`}
            >
              {langCode === 'en' ? 'EN' : 'KU'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Hero Section */}
        <div className={styles.hero}>
          <h1 className={styles.title}>{t.welcome}</h1>
          <p className={styles.tagline}>{t.tagline}</p>
        </div>

        {/* Question */}
        <p className={styles.question}>{t.question}</p>

        {/* Option Cards */}
        <div className={styles.grid}>
          {OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOption(option.id)}
              className={styles.card}
            >
              <div className={styles.cardIcon}>{option.icon}</div>
              <div className={styles.cardContent}>
                <p className={styles.cardTitle}>{getCardTitle(option.id)}</p>
                <p className={styles.cardDesc}>{getCardDesc(option.id)}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <p className={styles.footerText}>{t.alreadyHave}</p>
          <button
            onClick={() => router.push('/auth')}
            className={styles.signInButton}
          >
            {t.signIn}
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className={styles.decorativeBottom} />
      <div className={styles.decorativeTop} />
    </div>
  )
}