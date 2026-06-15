'export async function GET() {
  }

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
            content: `Search the web for the 10 most recent news articles published within the last 7 days that are relevant to Kurdish, Iraqi, Iranian, and Syrian people living in the UK.

Focus on:
- UK immigration and asylum policy affecting these communities
- Home Office decisions on refugee resettlement or deportation
- Kurdish community news and events in the UK
- Integration, housing, employment support for refugees in the UK
- Discrimination, hate crime, or community safety affecting these groups
- UK government schemes or charities supporting these communities
- Any UK news where Kurdish or wider Middle Eastern communities are directly affected

Do NOT include:
- News from Iraq, Iran, Syria or Kurdistan region unless it directly affects UK residents
- General world news with no UK relevance
- Sports or entertainment news

Rules:
- Only articles published in the last 7 days
- Real URLs and real dates in YYYY-MM-DD format
- Newest first

Return ONLY a valid JSON array, no markdown, no backticks:
[
  {
    "title": "Article title",
    "summary": "One sentence summary of why this matters to Kurdish communities in the UK",
    "source": "BBC News",
    "url": "https://...",
    "date": "2026-06-15"
  }
]`,
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
    const articles = JSON.parse(clean)
    if (!Array.isArray(articles)) throw new Error('Not an array')

    articles.sort((a, b) => new Date(b.date) - new Date(a.date))

    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    await supabase
      .from('news_cache')
      .update({ articles, fetched_at: new Date().toISOString() })
      .eq('id', 1)

    console.log(`News refreshed: ${articles.length} articles saved`)
    return Response.json({ success: true, count: articles.length })

  } catch (err) {
    console.error('News refresh failed:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}