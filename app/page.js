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
    findServicesDesc: 'Discover trusted Kurdish professionals near you',
    sellBusiness: 'Sell Your Business',
    sellBusinessDesc: 'Find a buyer quickly and securely',
    sellCar: 'Sell Your Car',
    sellCarDesc: 'List your car and connect with buyers',
    hireStaff: 'Hire Staff',
    hireStaffDesc: 'Post a job and find the right talent',
    listService: 'List My Service',
    listServiceDesc: 'Build your verified professional profile',
    alreadyHave: 'Already have an account?',
    signIn: 'Sign In',
  },
  ku: {
    dir: 'rtl',
    welcome: 'بەخێربێیت بۆ KurdLink',
    tagline: 'پلاتفۆرمی پشتیوانی کۆمەڵگاکەت',
    question: 'چیت دەیهوێت بکەی؟',
    findServices: 'بدۆزەوە خزمەتگوزاری',
    findServicesDesc: 'پیشەوەری کوردی متمانەپێکراو نزیکت بدۆزەوە',
    sellBusiness: 'بیزنسەکەت بفرۆشە',
    sellBusinessDesc: 'بە خێرایی و پارێزراوی کڕیار بدۆزەوە',
    sellCar: 'ئۆتۆمبێلەکەت بفرۆشە',
    sellCarDesc: 'ئۆتۆمبێلەکەت لیست بکە و کڕیار بدۆزەوە',
    hireStaff: 'کارمەند بگرە',
    hireStaffDesc: 'کار پۆست بکە و ئەو بەتوانا بدۆزەوە',
    listService: 'خزمەتگوزاریەکەم لیست بکە',
    listServiceDesc: 'پڕۆفایلی پیشەیی سەلماندراوت بنیاد بنێ',
    alreadyHave: 'حسابی هەیت؟',
    signIn: 'چوونەژوورەوە',
  }
}

const OPTIONS = [
  {
    id: 'find',
    icon: '🔍',
    titleKey: 'findServices',
    descKey: 'findServicesDesc',
    route: '/search',
  },
  {
    id: 'sellBiz',
    icon: '💼',
    titleKey: 'sellBusiness',
    descKey: 'sellBusinessDesc',
    route: '/listings/sell-business',
  },
  {
    id: 'sellCar',
    icon: '🚗',
    titleKey: 'sellCar',
    descKey: 'sellCarDesc',
    route: '/listings/sell-car',
  },
  {
    id: 'hire',
    icon: '👥',
    titleKey: 'hireStaff',
    descKey: 'hireStaffDesc',
    route: '/listings/hire-staff',
  },
  {
    id: 'listService',
    icon: '🎯',
    titleKey: 'listService',
    descKey: 'listServiceDesc',
    route: '/listings/list-service',
  },
]

export default function LandingChoice() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const t = TX[lang]

  return (
    <div className={styles.container} dir={t.dir}>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.logo}>KurdLink</div>
        <div className={styles.langToggle}>
          {['en', 'ku'].map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`${styles.langButton} ${lang === l ? styles.active : ''}`}
            >
              {l === 'en' ? 'EN' : 'KU'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>

        {/* Hero */}
        <div className={styles.hero}>
          <h1 className={styles.title}>{t.welcome}</h1>
          <p className={styles.tagline}>{t.tagline}</p>
        </div>

        {/* Question */}
        <p className={styles.question}>{t.question}</p>

        {/* Cards */}
        <div className={styles.grid}>
          {OPTIONS.map(option => (
            <button
              key={option.id}
              onClick={() => router.push(option.route)}
              className={styles.card}
            >
              <div className={styles.cardIcon}>{option.icon}</div>
              <div className={styles.cardContent}>
                <p className={styles.cardTitle}>{t[option.titleKey]}</p>
                <p className={styles.cardDesc}>{t[option.descKey]}</p>
              </div>
              <span className={styles.cardArrow}>›</span>
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

      <div className={styles.decorativeBottom} />
      <div className={styles.decorativeTop} />
    </div>
  )
}