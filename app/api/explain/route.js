"use server"
import { NextResponse } from 'next/server'

const systemPrompts = {
  sorani: `تۆ یارمەتیدەری کوردەکانی نیشتەجێبووی بەریتانیایی. نامەکە بە سۆرانی کوردی ڕوونبکەرەوە. وەک هاوڕێیەکی زانا و باوەڕپێکراو بنووسە. تەنها JSON خامی بگەڕێنەوە، بەبێ مارک‌داون یان باکتیک. {"letterType":"جۆری نامەکە بە کوردی","summary":"ڕوونکردنەوەی ئەوەی نامەکە چییە بە کوردی","deadlines":"بەروار و ماوەی گرنگ بە کوردی، یان هیچ بەروارێکی گرنگ نییە ئەگەر نەبوو","whatToDo":"هەنگاوەکانی دواتر بە کوردی","important":"هەر ئاگادارکردنەوەیەکی گرنگ بە کوردی، یان null ئەگەر نەبوو"}`,
  kurmanji: `Tu alîkarê Kurdên li Brîtanyayê yî. Nameyê bi Kurdî Kurmancî rave bike. Tenê JSON xav vegerîne. {"letterType":"","summary":"","deadlines":"","whatToDo":"","important":null}`,
  farsi: `تو دستیار ایرانیان ساکن بریتانیا هستی. نامه را به فارسی ساده توضیح بده. فقط JSON خام برگردان. {"letterType":"","summary":"","deadlines":"","whatToDo":"","important":null}`,
  arabic: `أنت مساعد للعرب المقيمين في بريطانيا. اشرح الرسالة بالعربية البسيطة. أعد فقط JSON خام. {"letterType":"","summary":"","deadlines":"","whatToDo":"","important":null}`,
  english: `You are a helpful assistant for people living in the UK. Explain the letter in simple plain English. Respond with ONLY a raw JSON object, no markdown, no backticks. {"letterType":"","summary":"","deadlines":"","whatToDo":"","important":null}`
}

export async function POST(req) {
  try {
    const { letterContent, language, inputMode, imageData, mediaType } = await req.json()

    let messages

    if (inputMode === 'upload' && imageData) {
      messages = [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: ['image/jpeg','image/png','image/gif','image/webp'].includes(mediaType) ? mediaType : 'image/jpeg',
              data: imageData
            }
          },
          {
            type: 'text',
            text: 'This is a photo of an official UK letter. Please read it carefully and explain it as instructed.'
          }
        ]
      }]
    } else {
      messages = [{
        role: 'user',
        content: `Explain this letter:\n\n${letterContent}`
      }]
    }

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1000,
        system: systemPrompts[language] || systemPrompts.english,
        messages
      })
    })

    const data = await res.json()
    console.log('RESPONSE:', JSON.stringify(data).substring(0, 200))

    const raw = data.content[0].text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(raw)

    return NextResponse.json({
      letterType: String(parsed.letterType || ''),
      summary: String(parsed.summary || ''),
      deadlines: String(parsed.deadlines || ''),
      whatToDo: String(parsed.whatToDo || ''),
      important: parsed.important ? String(parsed.important) : null
    })

  } catch(e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}