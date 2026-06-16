'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/app/lib/supabase'
import LangDropdown from '../../components/LangDropdown'
const INDIGO = '#4F46E5'
const INDIGO_DARK = '#1C1A4F'
const MINT = '#34D399'
const FONT = "'Nunito', sans-serif"

function getSupabase() {
  return createClient()
}

const ADMIN_EMAIL = 'bawanhozhin@outlook.com'

const STAGES = [
  { id: 'arrived',  emoji: '🛬', color: '#3B82F6', label: { en: 'Just Arrived',  ku: 'تازە گەیشتووم',   fa: 'تازه رسیدم',      ar: 'وصلت للتو'      } },
  { id: 'waiting',  emoji: '⏳', color: '#F59E0B', label: { en: 'Waiting',       ku: 'چاوەڕوانم',       fa: 'در انتظارم',      ar: 'في الانتظار'    } },
  { id: 'granted',  emoji: '✅', color: '#10B981', label: { en: 'Status Granted', ku: 'مافم درا',        fa: 'وضعیت تأیید شد',  ar: 'مُنح الوضع'     } },
  { id: 'refused',  emoji: '❌', color: '#EF4444', label: { en: 'Refused',        ku: 'ڕەتکرایەوە',     fa: 'رد شد',           ar: 'رُفض'           } },
  { id: 'settled',  emoji: '🏡', color: '#8B5CF6', label: { en: 'Settled',        ku: 'جێگیرکراوە',     fa: 'مستقر شدم',       ar: 'استقررت'        } },
  { id: 'citizen',  emoji: '🇬🇧', color: '#F59E0B', label: { en: 'Citizen Path',  ku: 'ڕێگای هاووڵاتی', fa: 'مسیر شهروندی',    ar: 'مسار المواطنة'  } },
]

const TX = {
  en: { myStage: 'My Stage', infoHelp: 'Info & Help', ask: 'Ask', reberTitle: 'Reber', reberSub: 'Your guide to life in the UK', selectStage: 'Where are you in your journey?', askTitle: 'Ask a Question', askSub: 'Ask anything about life in the UK.', askPlaceholder: 'Type your question here...', askBtn: 'Submit Question', askSuccess: 'Your question has been submitted!', awaitingAnswer: 'Awaiting answer...', answeredBy: 'Answered by Bawan', upvote: 'Helpful', questions: 'Questions', noQuestions: 'No questions yet', back: 'Back' },
  ku: { myStage: 'قۆناغەکەم', infoHelp: 'زانیاری و یارمەتی', ask: 'پرسیار', reberTitle: 'ڕێبەر', reberSub: 'ڕێنمای ژیانت لە UK', selectStage: 'لە کوێیت لە گەشتەکەتدا؟', askTitle: 'پرسیار بکە', askSub: 'هەر شتێک بپرسە', askPlaceholder: 'پرسیارەکەت ئێرە بنووسە...', askBtn: 'پرسیار بنێرە', askSuccess: 'پرسیارەکەت نێردرا!', awaitingAnswer: 'چاوەڕوانی وەڵامە...', answeredBy: 'وەڵامدراوەتەوە لەلایەن باوان', upvote: 'یارمەتیدەر', questions: 'پرسیارەکان', noQuestions: 'هێشتا هیچ پرسیارێک نییە', back: 'گەڕانەوە' },
  fa: { myStage: 'مرحله من', infoHelp: 'اطلاعات و کمک', ask: 'سوال', reberTitle: 'ڕێبەر', reberSub: 'راهنمای زندگی در بریتانیا', selectStage: 'در کجای سفرت هستی؟', askTitle: 'سوال بپرس', askSub: 'هر چیزی بپرس', askPlaceholder: 'سوالت را اینجا بنویس...', askBtn: 'ارسال سوال', askSuccess: 'سوالت ارسال شد!', awaitingAnswer: 'در انتظار پاسخ...', answeredBy: 'پاسخ داده شده توسط باوان', upvote: 'مفید', questions: 'سوالات', noQuestions: 'هنوز سوالی نیست', back: 'بازگشت' },
  ar: { myStage: 'مرحلتي', infoHelp: 'معلومات ومساعدة', ask: 'اسأل', reberTitle: 'ڕێبەر', reberSub: 'دليلك للحياة في المملكة المتحدة', selectStage: 'أين أنت في رحلتك؟', askTitle: 'اطرح سؤالاً', askSub: 'اسأل أي شيء', askPlaceholder: 'اكتب سؤالك هنا...', askBtn: 'إرسال السؤال', askSuccess: 'تم إرسال سؤالك!', awaitingAnswer: 'في انتظار الإجابة...', answeredBy: 'أجاب عليه باوان', upvote: 'مفيد', questions: 'الأسئلة', noQuestions: 'لا توجد أسئلة بعد', back: 'رجوع' },
}

export default function JourneyPage() {
  const router = useRouter()
  const [lang, setLang] = useState('en')
  const [activeTab, setActiveTab] = useState('stage')
  const [activeStage, setActiveStage] = useState(null)
  const [questions, setQuestions] = useState([])
  const [newQuestion, setNewQuestion] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [upvoted, setUpvoted] = useState({})
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminAnswer, setAdminAnswer] = useState({})
  const t = TX[lang] || TX.en

  useEffect(() => {
    const saved = localStorage.getItem('kurdlink_lang')
    if (saved) setLang(saved)
    fetchQuestions()
    checkAdmin()
    const voted = JSON.parse(localStorage.getItem('reber_upvoted') || '{}')
    setUpvoted(voted)
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

  const handleSubmitQuestion = async () => {
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

  const handleUpvote = async (question) => {
    if (upvoted[question.id]) return
    const supabase = getSupabase()
    await supabase.from('questions').update({ upvotes: (question.upvotes || 0) + 1 }).eq('id', question.id)
    const newVoted = { ...upvoted, [question.id]: true }
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

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FF', fontFamily: FONT }}>
      <div style={{ background: `linear-gradient(135deg, ${INDIGO_DARK} 0%, #2D4A9E 100%)`, padding: '16px 16px 0', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => router.push('/home')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 22, cursor: 'pointer', padding: 0 }}>←</button>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>🧭 {t.reberTitle}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>{t.reberSub}</div>
            </div>
          </div>
          <LangDropdown lang={lang} onChange={setLang} />
        </div>
        <div style={{ display: 'flex', gap: 0 }}>
          {[
            { id: 'stage', label: '📍 ' + t.myStage },
            { id: 'info', label: '📋 ' + t.infoHelp },
            { id: 'ask', label: '❓ ' + t.ask },
          ].map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setActiveStage(null) }} style={{
              flex: 1, padding: '10px 4px 12px', background: 'none', border: 'none',
              color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.5)',
              fontWeight: activeTab === tab.id ? 800 : 600, fontSize: 12,
              cursor: 'pointer', fontFamily: FONT,
              borderBottom: activeTab === tab.id ? '3px solid #FF6B35' : '3px solid transparent',
              transition: 'all 0.2s',
            }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'stage' && !activeStage && (
        <div style={{ padding: '24px 16px' }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: INDIGO_DARK, marginBottom: 20, textAlign: 'center' }}>{t.selectStage}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 500, margin: '0 auto' }}>
            {STAGES.map(stage => (
              <button key={stage.id} onClick={() => setActiveStage(stage.id)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 8, padding: '20px 12px',
                background: '#fff', border: `2px solid ${stage.color}30`,
                borderRadius: 18, cursor: 'pointer', fontFamily: FONT,
                boxShadow: `0 4px 16px ${stage.color}15`,
              }}>
                <span style={{ fontSize: 32 }}>{stage.emoji}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: stage.color, textAlign: 'center', lineHeight: 1.3 }}>
                  {stage.label[lang] || stage.label.en}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'ask' && (
        <div style={{ padding: '16px 16px 32px' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '20px', marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: INDIGO_DARK, marginBottom: 6 }}>❓ {t.askTitle}</div>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>{t.askSub}</div>
            <textarea
              value={newQuestion}
              onChange={e => setNewQuestion(e.target.value)}
              placeholder={t.askPlaceholder}
              rows={3}
              style={{ width: '100%', padding: '12px 14px', border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: 12, fontSize: 14, fontFamily: FONT, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
            />
            {submitted && (
              <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: '10px 14px', marginTop: 10, color: '#166534', fontSize: 13, fontWeight: 600 }}>
                ✅ {t.askSuccess}
              </div>
            )}
            <button onClick={handleSubmitQuestion} disabled={submitting || !newQuestion.trim()}
              style={{ width: '100%', marginTop: 12, padding: '13px', background: newQuestion.trim() ? `linear-gradient(135deg, ${MINT}, #FF8C61)` : '#e5e7eb', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, color: newQuestion.trim() ? '#fff' : '#9ca3af', cursor: newQuestion.trim() ? 'pointer' : 'default', fontFamily: FONT }}>
              {submitting ? '...' : t.askBtn}
            </button>
          </div>

          <div style={{ fontSize: 15, fontWeight: 800, color: INDIGO_DARK, marginBottom: 14 }}>💬 {t.questions}</div>
          {questions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#aaa', fontSize: 14 }}>{t.noQuestions}</div>
          ) : (
            questions.map(q => (
              <div key={q.id} style={{ background: '#fff', borderRadius: 16, padding: '16px', marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a', margin: '0 0 12px', lineHeight: 1.5 }}>{q.question}</p>
                {q.answer ? (
                  <div style={{ background: '#F0F9FF', borderRadius: 12, padding: '12px 14px', marginBottom: 12, borderLeft: `3px solid ${INDIGO_DARK}` }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: INDIGO_DARK, marginBottom: 6, textTransform: 'uppercase' }}>🧭 {t.answeredBy}</div>
                    <p style={{ fontSize: 14, color: '#1a1a1a', margin: 0, lineHeight: 1.6 }}>{q.answer}</p>
                  </div>
                ) : (
                  <div style={{ background: '#FFFBEB', borderRadius: 10, padding: '8px 12px', marginBottom: 12, display: 'inline-block' }}>
                    <span style={{ fontSize: 12, color: '#92400E', fontWeight: 600 }}>⏳ {t.awaitingAnswer}</span>
                  </div>
                )}
                {isAdmin && !q.answer && (
                  <div style={{ marginBottom: 12 }}>
                    <textarea placeholder="Type your answer..." value={adminAnswer[q.id] || ''} onChange={e => setAdminAnswer(prev => ({ ...prev, [q.id]: e.target.value }))} rows={2}
                      style={{ width: '100%', padding: '10px 12px', border: '1.5px solid rgba(26,43,95,0.2)', borderRadius: 10, fontSize: 13, fontFamily: FONT, outline: 'none', resize: 'vertical', boxSizing: 'border-box', marginBottom: 6 }} />
                    <button onClick={() => handleAdminAnswer(q.id)}
                      style={{ padding: '8px 16px', background: INDIGO_DARK, border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: FONT }}>
                      Post Answer
                    </button>
                  </div>
                )}
                <button onClick={() => handleUpvote(q)} disabled={upvoted[q.id]}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: upvoted[q.id] ? '#FFF4F0' : '#f5f5f5', border: upvoted[q.id] ? `1px solid ${MINT}` : '1px solid rgba(0,0,0,0.08)', borderRadius: 20, cursor: upvoted[q.id] ? 'default' : 'pointer', fontFamily: FONT }}>
                  <span style={{ fontSize: 14 }}>👍</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: upvoted[q.id] ? MINT : '#666' }}>{q.upvotes || 0}</span>
                  <span style={{ fontSize: 11, color: upvoted[q.id] ? MINT : '#888' }}>{t.upvote}</span>
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}