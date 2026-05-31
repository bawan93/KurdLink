'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

const NAVY = '#1A2B5F'
const ORANGE = '#FF6B35'
const FONT = "'Plus Jakarta Sans', 'Sora', sans-serif"
const ADMIN_EMAIL = 'bawanhozhin@outlook.com'

function getSupabase() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

const TX = {
  en: { title: 'Ask a Question', sub: 'Ask anything about life in the UK. Bawan will answer personally.', placeholder: 'Type your question here...', btn: 'Submit Question', success: 'Your question has been submitted!', awaiting: 'Awaiting answer...', answeredBy: 'Answered by Bawan', upvote: 'Helpful', questions: 'Questions', noQuestions: 'No questions yet — be the first to ask!' },
  ku: { title: 'پرسیار بکە', sub: 'هەر شتێک بپرسە دەربارەی ژیان لە UK. باوان بە خۆی وەڵام دەداتەوە.', placeholder: 'پرسیارەکەت ئێرە بنووسە...', btn: 'پرسیار بنێرە', success: 'پرسیارەکەت نێردرا!', awaiting: 'چاوەڕوانی وەڵامە...', answeredBy: 'وەڵامدراوەتەوە لەلایەن باوان', upvote: 'یارمەتیدەر', questions: 'پرسیارەکان', noQuestions: 'هێشتا هیچ پرسیارێک نییە — یەکەمین بە!' },
  fa: { title: 'سوال بپرس', sub: 'هر چیزی درباره زندگی در UK بپرس. باوان شخصاً پاسخ می‌دهد.', placeholder: 'سوالت را اینجا بنویس...', btn: 'ارسال سوال', success: 'سوالت ارسال شد!', awaiting: 'در انتظار پاسخ...', answeredBy: 'پاسخ داده شده توسط باوان', upvote: 'مفید', questions: 'سوالات', noQuestions: 'هنوز سوالی نیست — اولین نفر باش!' },
  ar: { title: 'اطرح سؤالاً', sub: 'اسأل أي شيء عن الحياة في المملكة المتحدة. سيجيب باوان شخصياً.', placeholder: 'اكتب سؤالك هنا...', btn: 'إرسال السؤال', success: 'تم إرسال سؤالك!', awaiting: 'في انتظار الإجابة...', answeredBy: 'أجاب عليه باوان', upvote: 'مفيد', questions: 'الأسئلة', noQuestions: 'لا توجد أسئلة بعد — كن الأول!' },
}

export default function AskPage() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const [questions, setQuestions] = useState([])
  const [newQuestion, setNewQuestion] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [upvoted, setUpvoted] = useState({})
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminAnswer, setAdminAnswer] = useState({})

  useEffect(() => {
    const saved = localStorage.getItem('kurdlink_lang')
    if (saved && TX[saved]) setLang(saved)
    fetchQuestions()
    checkAdmin()
    const voted = JSON.parse(localStorage.getItem('reber_upvoted') || '{}')
    setUpvoted(voted)

    const handler = (e) => setLang(e.detail)
    window.addEventListener('langchange', handler)
    return () => window.removeEventListener('langchange', handler)
  }, [])

  const checkAdmin = async () => {
    const supabase = getSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (user?.email === ADMIN_EMAIL) setIsAdmin(true)
  }

  const fetchQuestions = async () => {
    const supabase = getSupabase()
    const { data } = await supabase.from('questions').select('*').order('upvotes', { ascending: false })
    setQuestions(data || [])
  }

  const handleSubmit = async () => {
    if (!newQuestion.trim()) return
    setSubmitting(true)
    const supabase = getSupabase()
    await supabase.from('questions').insert({ question: newQuestion.trim() })
    setNewQuestion('')
    setSubmitted(true)
    setSubmitting(false)
    fetchQuestions()
    setTimeout(() => setSubmitted(false), 4000)
  }

  const handleUpvote = async (q) => {
    if (upvoted[q.id]) return
    const supabase = getSupabase()
    await supabase.from('questions').update({ upvotes: (q.upvotes || 0) + 1 }).eq('id', q.id)
    const newVoted = { ...upvoted, [q.id]: true }
    setUpvoted(newVoted)
    localStorage.setItem('reber_upvoted', JSON.stringify(newVoted))
    fetchQuestions()
  }

  const handleAdminAnswer = async (questionId) => {
    const answer = adminAnswer[questionId]
    if (!answer?.trim()) return
    const supabase = getSupabase()
    await supabase.from('questions').update({ answer: answer.trim(), status: 'answered', answered_at: new Date().toISOString() }).eq('id', questionId)
    setAdminAnswer(prev => ({ ...prev, [questionId]: '' }))
    fetchQuestions()
  }

  const t = TX[lang] || TX.en
  const isRtl = lang === 'ku' || lang === 'fa' || lang === 'ar'

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF', fontFamily: FONT, direction: isRtl ? 'rtl' : 'ltr', paddingBottom: 80 }}>
      <div style={{ padding: '16px 16px 32px', maxWidth: 600, margin: '0 auto' }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: '20px', marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 6 }}>{t.title}</div>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 16, lineHeight: 1.5 }}>{t.sub}</div>
          <textarea value={newQuestion} onChange={e => setNewQuestion(e.target.value)} placeholder={t.placeholder} rows={3}
            style={{ width: '100%', padding: '12px 14px', border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: 12, fontSize: 14, fontFamily: FONT, outline: 'none', resize: 'vertical', lineHeight: 1.5, boxSizing: 'border-box' }} />
          {submitted && (
            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: '10px 14px', marginTop: 10, color: '#166534', fontSize: 13, fontWeight: 600 }}>
              ✅ {t.success}
            </div>
          )}
          <button onClick={handleSubmit} disabled={submitting || !newQuestion.trim()}
            style={{ width: '100%', marginTop: 12, padding: '13px', background: newQuestion.trim() ? `linear-gradient(135deg, ${ORANGE}, #FF8C61)` : '#e5e7eb', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, color: newQuestion.trim() ? '#fff' : '#9ca3af', cursor: newQuestion.trim() ? 'pointer' : 'default', fontFamily: FONT }}>
            {submitting ? '...' : t.btn}
          </button>
        </div>

        <div style={{ fontSize: 15, fontWeight: 800, color: NAVY, marginBottom: 14 }}>💬 {t.questions}</div>
        {questions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#aaa', fontSize: 14 }}>{t.noQuestions}</div>
        ) : (
          questions.map(q => (
            <div key={q.id} style={{ background: '#fff', borderRadius: 16, padding: '16px', marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a', margin: '0 0 12px', lineHeight: 1.5 }}>{q.question}</p>
              {q.answer ? (
                <div style={{ background: '#F0F9FF', borderRadius: 12, padding: '12px 14px', marginBottom: 12, borderLeft: `3px solid ${NAVY}` }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 6, textTransform: 'uppercase' }}>🧭 {t.answeredBy}</div>
                  <p style={{ fontSize: 14, color: '#1a1a1a', margin: 0, lineHeight: 1.6 }}>{q.answer}</p>
                </div>
              ) : (
                <div style={{ background: '#FFFBEB', borderRadius: 10, padding: '8px 12px', marginBottom: 12, display: 'inline-block' }}>
                  <span style={{ fontSize: 12, color: '#92400E', fontWeight: 600 }}>⏳ {t.awaiting}</span>
                </div>
              )}
              {isAdmin && !q.answer && (
                <div style={{ marginBottom: 12 }}>
                  <textarea placeholder="Type your answer..." value={adminAnswer[q.id] || ''} onChange={e => setAdminAnswer(prev => ({ ...prev, [q.id]: e.target.value }))} rows={2}
                    style={{ width: '100%', padding: '10px 12px', border: `1.5px solid rgba(26,43,95,0.2)`, borderRadius: 10, fontSize: 13, fontFamily: FONT, outline: 'none', resize: 'vertical', boxSizing: 'border-box', marginBottom: 6 }} />
                  <button onClick={() => handleAdminAnswer(q.id)}
                    style={{ padding: '8px 16px', background: NAVY, border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: FONT }}>
                    Post Answer
                  </button>
                </div>
              )}
              <button onClick={() => handleUpvote(q)} disabled={upvoted[q.id]}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: upvoted[q.id] ? '#FFF4F0' : '#f5f5f5', border: upvoted[q.id] ? `1px solid ${ORANGE}` : '1px solid rgba(0,0,0,0.08)', borderRadius: 20, cursor: upvoted[q.id] ? 'default' : 'pointer', fontFamily: FONT }}>
                <span style={{ fontSize: 14 }}>👍</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: upvoted[q.id] ? ORANGE : '#666' }}>{q.upvotes || 0}</span>
                <span style={{ fontSize: 11, color: upvoted[q.id] ? ORANGE : '#888' }}>{t.upvote}</span>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}