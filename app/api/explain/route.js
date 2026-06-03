"use server"
import { NextResponse } from 'next/server'

const systemPrompts = {
  ku: `تۆ یارمەتیدەری کوردەکانی نیشتەجێبووی بەریتانیایی. نامەکە بە سۆرانی کوردی ڕوونبکەرەوە. تەنها JSON خامی بگەڕێنەوە، بەبێ مارک‌داون یان باکتیک. {"letterType":"جۆری نامەکە","summary":"ڕوونکردنەوەی نامەکە","deadlines":["بەروار یان ماوەی گرنگ"],"whatToDo":["هەنگاوی یەکەم","هەنگاوی دووەم"],"warning":null}`,
  fa: `تو دستیار ایرانیان ساکن بریتانیا هستی. نامه را به فارسی ساده توضیح بده. فقط JSON خام برگردان، بدون مارک‌داون. {"letterType":"","summary":"","deadlines":["مهلت یا تاریخ مهم"],"whatToDo":["قدم اول","قدم دوم"],"warning":null}`,
  ar: `أنت مساعد للعرب المقيمين في بريطانيا. اشرح الرسالة بالعربية البسيطة. أعد فقط JSON خام بدون markdown. {"letterType":"","summary":"","deadlines":["موعد أو تاريخ مهم"],"whatToDo":["الخطوة الأولى","الخطوة الثانية"],"warning":null}`,
  en: `You are a helpful assistant for people living in the UK. Explain the letter in simple plain English. Respond with ONLY a raw JSON object, no markdown, no backticks. Use this exact structure: {"letterType":"type of letter","summary":"plain explanation of what this letter means","deadlines":["any important dates or deadlines as array items"],"whatToDo":["step 1","step 2"],"warning":"any urgent warning or null if none"}`
}

export async function POST(req) {
  try {
    const body = await req.json()
    const { lang, text, imageData, imageType } = body

    const systemPrompt = systemPrompts[lang] || systemPrompts.en

    let messages

    if (imageData && imageType) {
      // Image upload mode
      const validType = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(imageType)
        ? imageType
        : 'image/jpeg'
      messages = [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: validType,
              data: imageData,
            }
          },
          {
            type: 'text',
            text: 'This is a photo of an official UK letter. Please read it carefully and explain it as instructed in the system prompt.'
          }
        ]
      }]
    } else if (text && text.trim()) {
      // Text paste mode
      messages = [{
        role: 'user',
        content: `Explain this letter:\n\n${text}`
      }]
    } else {
      return NextResponse.json({ error: 'No content provided' }, { status: 400 })
    }

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: systemPrompt,
        messages
      })
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('Anthropic API error:', JSON.stringify(data))
      return NextResponse.json({ error: 'API error' }, { status: 500 })
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