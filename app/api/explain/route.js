"use server"
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const systemPrompts = {
  ku: `تۆ یارمەتیدەری کوردەکانی نیشتەجێبووی بەریتانیایی. نامەکە بە سۆرانی کوردی ڕوونبکەرەوە. تەنها JSON خامی بگەڕێنەوە، بەبێ مارک‌داون یان باکتیک. {"letterType":"جۆری نامەکە","summary":"ڕوونکردنەوەی نامەکە","deadlines":["بەروار یان ماوەی گرنگ"],"whatToDo":["هەنگاوی یەکەم","هەنگاوی دووەم"],"warning":null}`,
  fa: `تو دستیار ایرانیان ساکن بریتانیا هستی. نامه را به فارسی ساده توضیح بده. فقط JSON خام برگردان، بدون مارک‌داون. {"letterType":"","summary":"","deadlines":["مهلت یا تاریخ مهم"],"whatToDo":["قدم اول","قدم دوم"],"warning":null}`,
  ar: `أنت مساعد للعرب المقيمين في بريتانيا. اشرح الرسالة بالعربية البسيطة. أعد فقط JSON خام بدون markdown. {"letterType":"","summary":"","deadlines":["موعد أو تاريخ مهم"],"whatToDo":["الخطوة الأولى","الخطوة الثانية"],"warning":null}`,
  en: `You are a helpful assistant for people living in the UK. Explain the letter in simple plain English. Respond with ONLY a raw JSON object, no markdown, no backticks. Use this exact structure: {"letterType":"type of letter","summary":"plain explanation of what this letter means","deadlines":["any important dates or deadlines as array items"],"whatToDo":["step 1","step 2"],"warning":"any urgent warning or null if none"}`
}

async function getAnonTotalCount(identifier) {
  const { count } = await supabaseAdmin
    .from('explainer_usage')
    .select('*', { count: 'exact', head: true })
    .eq('identifier', identifier)
    .eq('identifier_type', 'ip')
  return count || 0
}

async function getUsageCount(identifier, identifierType, inputType) {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { count } = await supabaseAdmin
    .from('explainer_usage')
    .select('*', { count: 'exact', head: true })
    .eq('identifier', identifier)
    .eq('identifier_type', identifierType)
    .eq('input_type', inputType)
    .gte('created_at', since)
  return count || 0
}

async function recordUsage(identifier, identifierType, inputType) {
  await supabaseAdmin.from('explainer_usage').insert({
    identifier,
    identifier_type: identifierType,
    input_type: inputType,
  })
}

async function logError(identifier, identifierType, inputType, lang, errorType, errorDetail) {
  try {
    await supabaseAdmin.from('explainer_errors').insert({
      identifier,
      identifier_type: identifierType,
      input_type: inputType,
      lang,
      error_type: errorType,
      error_detail: errorDetail,
    })
  } catch (e) {
    console.error('Failed to log error to Supabase:', e)
  }
}

export async function POST(req) {
  let ip = 'unknown'
  let userId = null
  let inputType = 'text'
  let lang = 'en'

  try {
    const body = await req.json()
    lang = body.lang || 'en'
    const { text, imageData, imageType } = body
    userId = body.userId || null
    inputType = imageData ? 'image' : 'text'

    ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
         req.headers.get('x-real-ip') ||
         'unknown'

    const identifier = userId || ip
    const identifierType = userId ? 'user' : 'ip'

    // --- RATE LIMITING ---
    if (userId) {
      if (inputType === 'image') {
        const count = await getUsageCount(userId, 'user', 'image')
        if (count >= 10) {
          await logError(identifier, identifierType, inputType, lang, 'rate_limited', 'Account image limit reached (10/day)')
          return NextResponse.json({ error: 'limit_reached', limitType: 'image_account' }, { status: 429 })
        }
      }
    } else {
      const total = await getAnonTotalCount(ip)
      if (total >= 3) {
        await logError(identifier, identifierType, inputType, lang, 'rate_limited', 'Anonymous total limit reached (3 lifetime)')
        return NextResponse.json({ error: 'limit_reached', limitType: 'total_anon' }, { status: 429 })
      }
    }

    // --- VALIDATE CONTENT ---
    if (!imageData && (!text || !text.trim())) {
      await logError(identifier, identifierType, inputType, lang, 'no_content', 'Request arrived with no text or image')
      return NextResponse.json({ error: 'No content provided' }, { status: 400 })
    }

    // --- BUILD MESSAGE ---
    const systemPrompt = systemPrompts[lang] || systemPrompts.en
    let messages

    if (imageData && imageType) {
      const validType = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(imageType)
        ? imageType : 'image/jpeg'
      messages = [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: validType, data: imageData }
          },
          {
            type: 'text',
            text: 'This is a photo of an official UK letter. Please read it carefully and explain it as instructed in the system prompt.'
          }
        ]
      }]
    } else {
      messages = [{ role: 'user', content: `Explain this letter:\n\n${text}` }]
    }

    // --- CALL ANTHROPIC ---
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1200,
        system: systemPrompt,
        messages
      })
    })

    const data = await res.json()

    if (!res.ok) {
      const detail = JSON.stringify(data)
      console.error('Anthropic API error:', detail)
      await logError(identifier, identifierType, inputType, lang, 'api_error', detail)
      return NextResponse.json({ error: 'API error' }, { status: 500 })
    }

    // --- PARSE RESPONSE ---
    let parsed
    try {
      const raw = data.content[0].text.replace(/```json|```/g, '').trim()
      parsed = JSON.parse(raw)
    } catch (parseErr) {
      const raw = data.content?.[0]?.text || '(no response text)'
      await logError(identifier, identifierType, inputType, lang, 'parse_error', `JSON parse failed. Raw response: ${raw.slice(0, 500)}`)
      return NextResponse.json({ error: 'Failed to parse response' }, { status: 500 })
    }

    // Record usage only after full success
    await recordUsage(identifier, identifierType, inputType)

    return NextResponse.json({
      letterType: String(parsed.letterType || ''),
      summary: String(parsed.summary || ''),
      deadlines: Array.isArray(parsed.deadlines) ? parsed.deadlines : parsed.deadlines ? [String(parsed.deadlines)] : [],
      whatToDo: Array.isArray(parsed.whatToDo) ? parsed.whatToDo : parsed.whatToDo ? [String(parsed.whatToDo)] : [],
      warning: parsed.warning ? String(parsed.warning) : null,
    })

  } catch (e) {
    console.error('Explain route error:', e)
    const identifier = userId || ip
    const identifierType = userId ? 'user' : 'ip'
    await logError(identifier, identifierType, inputType, lang, 'unexpected_error', e?.message || 'Unknown error')
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}