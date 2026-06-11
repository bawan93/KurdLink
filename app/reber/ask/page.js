'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import TX from '../../../lib/translations'

const INDIGO = '#4F46E5'
const INDIGO_DARK = '#1C1A4F'
const INDIGO_LIGHT = '#818CF8'
const MINT = '#34D399'
const SOFT = '#EDE9FE'
const BG = '#F5F4FF'
const ADMIN_EMAIL = 'bawanhozhin@outlook.com'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function AskPage() {
  const [lang, setLang] = useState('en')
  const [question, setQuestion] = useState('')
  const [posting, setPosting] = useState(false)
  const [questions, setQuestions] = useState([])
  const [voted, setVoted] = useState({})
  const [adminAnswer, setAdminAnswer] = useState({})
  const [answerPosting, setAnswerPosting] = useState({})
  const [deleting, setDeleting] = useState({})
  const [user, setUser] = useState(null)
  const t = (TX[lang] || TX.en).ask

  useEffect(() => {
    const stored = localStorage.getItem('komek_lang')
    if (stored) setLang(stored)
    const handler = (e) => setLang(e.detail)
    window.addEventListener('langchange', handler)
    fetchQuestions()
    supabase.auth.getUser().then(({ data }) => setUser(data?.user || null))
    return () => window.removeEventListener('langchange', handler)
  }, [])

  async function fetchQuestions() {
    const { data } = await supabase
      .from('questions')
      .select('*')
      .order('upvotes', { ascending: false })
    if (data) setQuestions(data)
  }

  async function handlePost() {
    if (!question.trim()) return
    setPosting(true)
    await supabase.from('questions').insert({ question: question.trim() })
    setQuestion('')
    setPosting(false)
    fetchQuestions()
  }

  async function handleUpvote(q) {
    if (voted[q.id]) return
    setVoted(v => ({ ...v, [q.id]: true }))
    await supabase.from('questions').update({ upvotes: (q.upvotes || 0) + 1 }).eq('id', q.id)
    fetchQuestions()
  }

  async function handleAnswer(q) {
    const ans = adminAnswer[q.id]
    if (!ans?.trim()) return
    setAnswerPosting(v => ({ ...v, [q.id]: true }))
    await supabase.from('questions').update({ answer: ans.trim(), status: 'answered', answered_at: new Date().toISOString() }).eq('id', q.id)
    setAdminAnswer(v => ({ ...v, [q.id]: '' }))
    setAnswerPosting(v => ({ ...v, [q.id]: false }))
    fetchQuestions()
  }

  async function handleDelete(q) {
    if (!window.confirm('Delete this question?')) return
    setDeleting(v => ({ ...v, [q.id]: true }))
    await supabase.from('questions').delete().eq('id', q.id)
    fetchQuestions()
    setDeleting(v => ({ ...v, [q.id]: false }))
  }

  return (
    <div style={{ fontFamily: 'Nunito, sans-serif', background: BG, minHeight: '100vh', paddingBottom: 80, direction: 'ltr' }}>
      <div style={{ background: `linear-gradient(135deg, ${INDIGO_DARK} 0%, #2D2A7A 100%)`, padding: '40px 20px 48px', textAlign: 'center' }}>
        <div style={{ fontSize: 44, marginBottom: 12, transform: (lang === 'ku' || lang === 'fa' || lang === 'ar') ? 'scaleX(-1)' : 'none' }}>❓</div>
        <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 900, margin: '0 0 10px' }}>{t.heroTitle}</h1>
        <p style={{ color: INDIGO_LIGHT, fontSize: 14, fontWeight: 500, margin: 0 }}>{t.heroSub}</p>
      </div>

      <div style={{ padding: '0 16px', marginTop: -20 }}>
        <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 4px 24px rgba(79,70,229,0.10)', padding: 20, marginBottom: 20 }}>
          <textarea
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder={t.placeholder}
            rows={3}
            style={{ width: '100%', border: `1.5px solid ${SOFT}`, borderRadius: 12, padding: 14, fontFamily: 'Nunito, sans-serif', fontSize: 14, color: INDIGO_DARK, resize: 'none', outline: 'none', background: BG, boxSizing: 'border-box' }}
          />
          <button
            onClick={handlePost}
            disabled={posting || !question.trim()}
            style={{ width: '100%', marginTop: 12, padding: '14px', background: !question.trim() ? '#E5E7EB' : INDIGO, color: !question.trim() ? '#9CA3AF' : '#fff', border: 'none', borderRadius: 14, fontFamily: 'Nunito, sans-serif', fontSize: 15, fontWeight: 800, cursor: !question.trim() ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
          >
            {posting ? t.posting : t.askBtn}
          </button>
        </div>

        {questions.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#9CA3AF', fontSize: 14, fontWeight: 600, marginTop: 40 }}>{t.empty}</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {questions.map(q => (
              <div key={q.id} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(79,70,229,0.07)', overflow: 'hidden' }}>
                <div style={{ background: q.status === 'answered' ? '#F0FDF4' : SOFT, padding: '6px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: q.status === 'answered' ? MINT : INDIGO_LIGHT }} />
                    <span style={{ fontSize: 11, fontWeight: 800, color: q.status === 'answered' ? '#059669' : INDIGO, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {q.status === 'answered' ? t.answered : t.awaiting}
                    </span>
                  </div>
                  {user?.email === ADMIN_EMAIL && (
                    <button
                      onClick={() => handleDelete(q)}
                      disabled={deleting[q.id]}
                      style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', padding: '2px 6px' }}
                    >
                      {deleting[q.id] ? '…' : '🗑 Delete'}
                    </button>
                  )}
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: INDIGO_DARK, margin: '0 0 10px', lineHeight: 1.4 }}>{q.question}</p>
                  {q.answer && (
                    <div style={{ background: '#F0FDF4', borderRadius: 10, padding: '10px 14px', marginBottom: 10 }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#059669', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Komek</div>
                      <p style={{ fontSize: 13, color: '#065F46', margin: 0, lineHeight: 1.5 }}>{q.answer}</p>
                    </div>
                  )}
                  <button
                    onClick={() => handleUpvote(q)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, background: voted[q.id] ? SOFT : 'transparent', border: `1.5px solid ${voted[q.id] ? INDIGO : '#E5E7EB'}`, borderRadius: 20, padding: '6px 14px', fontFamily: 'Nunito, sans-serif', fontSize: 12, fontWeight: 700, color: voted[q.id] ? INDIGO : '#6B7280', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    👍 {t.upvote} · {q.upvotes || 0}
                  </button>
                  {user?.email === ADMIN_EMAIL && q.status !== 'answered' && (
                    <div style={{ marginTop: 12 }}>
                      <textarea
                        value={adminAnswer[q.id] || ''}
                        onChange={e => setAdminAnswer(v => ({ ...v, [q.id]: e.target.value }))}
                        placeholder={t.answerPlaceholder}
                        rows={2}
                        style={{ width: '100%', border: `1.5px solid ${SOFT}`, borderRadius: 10, padding: 10, fontFamily: 'Nunito, sans-serif', fontSize: 13, color: INDIGO_DARK, resize: 'none', outline: 'none', background: BG, boxSizing: 'border-box' }}
                      />
                      <button
                        onClick={() => handleAnswer(q)}
                        disabled={answerPosting[q.id]}
                        style={{ marginTop: 8, padding: '8px 18px', background: MINT, color: '#fff', border: 'none', borderRadius: 10, fontFamily: 'Nunito, sans-serif', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}
                      >
                        {answerPosting[q.id] ? t.posting : t.answerBtn}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}