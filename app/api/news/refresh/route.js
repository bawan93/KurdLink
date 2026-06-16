export async function GET() {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2000,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [
          {
            role: 'user',
            content: `Search the web for the 10 most recent news articles published within the last 7 days that are relevant to Kurdish, Iraqi, Iranian, and Syrian people living in the UK. Focus on UK immigration and asylum policy, Home Office decisions, Kurdish community news, integration support, hate crime, and government schemes. Do NOT include news from Iraq/Iran/Syria unless it directly affects UK residents. Only articles from last 7 days with real URLs and dates in YYYY-MM-DD format, newest first. Return ONLY a valid JSON array, no markdown, no backticks: [{"title":"...","summary":"...","source":"...","url":"...","date":"..."}]`,
          },
        ],
      }),
    })

    if (!response.ok) throw new Error(`Anthropic error: ${response.status}`)

    const data = await response.json()

    let jsonText = ''
    for (const block of data.content) {
      if (block.type === 'text' && block.text) {
        jsonText = block.text
      }
    }

    const clean = jsonText.replace(/```json|```/g, '').trim()
    const match = clean.match(/\[[\s\S]*\]/)
    if (!match) throw new Error('No JSON array found')
    const articles = JSON.parse(match[0])
    if (!Array.isArray(articles)) throw new Error('Not an array')

    articles.sort((a, b) => new Date(b.date) - new Date(a.date))

    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    await supabase
      .from('news_cache')
      .upsert({ id: 1, articles, fetched_at: new Date().toISOString() })

    return Response.json({ success: true, count: articles.length })

  } catch (err) {
    console.error('News refresh failed:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
} 