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
  ar: `أنت مساعد للعرب المقيمين في بريطانيا. اشرح الرسالة بالعربية البسيطة. أعد فقط JSON خام بدون markdown. {"letterType":"","summary":"","deadlines":["موعد أو تاريخ مهم"],"whatToDo":["الخطوة الأولى","الخطوة الثانية"],"warning":null}`,
  en: `You are a helpful assistant for people living in the UK. Explain the letter in simple plain English. Respond with ONLY a raw JSON object, no markdown, no backticks. Use this exact structure: {"letterType":"type of letter","summary":"plain explanation of what this letter means","deadlines":["any important dates or deadlines as array items"],"whatToDo":["step 1","step 2"],"warning":"any urgent warning or null if none"}`
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

export async function POST(req) {
  try {
    const body = await req.json()
    const { lang, text, imageData, imageType, userId } = body
    const inputType = imageData ? 'image' : 'text'

    // Get IP for anonymous users
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                req.headers.get('x-real-ip') || 
                'unknown'

    // --- RATE LIMITING ---
    if (userId) {
      // Logged in user
      if (inputType === 'image') {
        const count = await getUsageCount(userId, 'user', 'image')
        if (count >= 10) {
          return NextResponse.json({ error: 'limit_reached', limitType: 'image_account' }, { status: 429 })
        }
      }
      // Logged in users have unlimited text — no check needed
    } else {
      // Anonymous user — check by IP
      if (inputType === 'image') {
        const count = await getUsageCount(ip, 'ip', 'image')
        if (count >= 3) {
          return NextResponse.json({ error: 'limit_reached', limitType: 'image_anon' }, { status: 429 })
        }
      } else {
        const count = await getUsageCount(ip, 'ip', 'text')
        if (count >= 10) {
          return NextResponse.json({ error: 'limit_reached', limitType: 'text_anon' }, { status: 429 })
        }
      }
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
    } else if (text && text.trim()) {
      messages = [{ role: 'user', content: `Explain this letter:\n\n${text}` }]
    } else {
      return NextResponse.json({ error: 'No content provided' }, { status: 400 })
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
  model: imageData ? "claude-sonnet-4-6" : "claude-haiku-4-5-20251001",
  max_tokens: 1200,
  system: systemPrompt,
  messages
})
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('Anthropic API error:', JSON.stringify(data))
      return NextResponse.json({ error: 'API error' }, { status: 500 })
    }

    // Record usage after successful response
    if (userId) {
      await recordUsage(userId, 'user', inputType)
    } else {
      await recordUsage(ip, 'ip', inputType)
    }

    const raw = data.content[0].text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(raw)

    return NextResponse.json({
      letterType: String(parsed.letterType || ''),
      summary: String(parsed.summary || ''),
      deadlines: Array.isArray(parsed.deadlines) ? parsed.deadlines : parsed.deadlines ? [String(parsed.deadlines)] : [],
      whatToDo: Array.isArray(parsed.whatToDo) ? parsed.whatToDo : parsed.whatToDo ? [String(parsed.whatToDo)] : [],
      warning: parsed.warning ? String(parsed.warning) : null,
    })

  } catch (e) {
    console.error('Explain route error:', e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}