'use client';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

const NAVY = '#1A2B5F';
const ORANGE = '#FF6B35';
const LIGHT_BG = '#F7F8FC';
const BORDER = '#E8ECF4';
const CARD_BG = '#FFFFFF';

export default function PostPage() {
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [lang, setLang] = useState('en');
  const isKu = lang === 'ku';
  const t = (en, ku) => isKu ? ku : en;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/account?reason=post');
      } else {
        setChecking(false);
      }
    });
  }, []);

  const options = [
    {
      icon: '🚗',
      titleEn: 'Sell a Car',
      titleKu: 'ئۆتۆمبێل بفرۆشە',
      descEn: 'List your car for sale',
      descKu: 'ئۆتۆمبێلەکەت بۆ فرۆشتن تۆمار بکە',
      route: '/listings/sell-car',
    },
    {
      icon: '🏢',
      titleEn: 'Sell a Business',
      titleKu: 'بازرگانی بفرۆشە',
      descEn: 'List your business for sale',
      descKu: 'بازرگانیەکەت بۆ فرۆشتن تۆمار بکە',
      route: '/listings/sell-business',
    },
    {
      icon: '👥',
      titleEn: 'Hire Staff',
      titleKu: 'کرێکار بگرە',
      descEn: 'Post a job vacancy',
      descKu: 'شوێنی کارێکی بەتاڵ بڵاو بکەرەوە',
      route: '/listings/hire-staff',
    },
    {
      icon: '🛠️',
      titleEn: 'List a Service',
      titleKu: 'خزمەتگوزاری تۆمار بکە',
      descEn: 'Offer your professional service',
      descKu: 'خزمەتگوزاری پیشەییەکەت پێشکەش بکە',
      route: '/listings/list-service',
    },
  ];

  if (checking) return (
    <div style={{ minHeight: '100vh', background: LIGHT_BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 36, height: 36, border: `3px solid ${BORDER}`, borderTopColor: ORANGE, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: LIGHT_BG, fontFamily: "'Plus Jakarta Sans', sans-serif", direction: isKu ? 'rtl' : 'ltr' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* Header */}
      <div style={{ background: NAVY, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
        <span onClick={() => router.push('/home')} style={{ color: '#fff', fontWeight: 800, fontSize: 20, cursor: 'pointer' }}>
          Kurd<span style={{ color: ORANGE }}>Link</span>
        </span>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 3 }}>
          {['en', 'ku'].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ padding: '4px 12px', borderRadius: 16, background: lang === l ? '#fff' : 'transparent', color: lang === l ? NAVY : '#fff', fontWeight: 700, fontSize: 12, border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
              {l === 'en' ? 'EN' : 'کوردی'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '32px 16px', animation: 'fadeIn 0.4s ease' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: NAVY, marginBottom: 6 }}>
          {t("What would you like to post?", "چی دەتەوێت بڵاو بکەیتەوە؟")}
        </h1>
        <p style={{ fontSize: 14, color: '#888', marginBottom: 28 }}>
          {t('Choose a category below to get started.', 'کەتەگۆریێک هەڵبژێرە بۆ دەستپێکردن.')}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {options.map((opt) => (
            <button
              key={opt.route}
              onClick={() => router.push(opt.route)}
              style={{ background: CARD_BG, border: `1.5px solid ${BORDER}`, borderRadius: 18, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', textAlign: isKu ? 'right' : 'left', transition: 'all 0.2s', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              onMouseOver={e => { e.currentTarget.style.borderColor = ORANGE; e.currentTarget.style.background = '#FFF8F5'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.background = CARD_BG; }}
            >
              <span style={{ fontSize: 32, flexShrink: 0 }}>{opt.icon}</span>
              <div>
                <p style={{ fontWeight: 800, fontSize: 16, color: NAVY, marginBottom: 3 }}>{isKu ? opt.titleKu : opt.titleEn}</p>
                <p style={{ fontSize: 13, color: '#888' }}>{isKu ? opt.descKu : opt.descEn}</p>
              </div>
              <span style={{ marginLeft: 'auto', color: '#ccc', fontSize: 20 }}>{isKu ? '←' : '→'}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}