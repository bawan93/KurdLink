import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const SIX_HOURS_MS = 6 * 60 * 60 * 1000

async function fetchFreshNews() {
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

This includes:
- UK immigration and asylum policy that affects these communities
- Home Office decisions on refugee resettlement or deportation
- Kurdish community news and events in the UK
- Integration, housing, employment support for refugees in the UK
- Discrimination, hate crime, or community safety affecting these groups in the UK
- UK government schemes or charities supporting Kurdish, Iraqi, Iranian or Syrian people
- Any UK news story where the Kurdish or wider Middle Eastern community in Britain is directly affected

Do NOT include:
- News from Iraq, Iran, Syria or the Kurdistan region unless it directly affects people living in the UK
- General world news with no UK relevance
- Sports or entertainment news

Rules:
- Only include articles published in the last 7 days
- Each article must have a real URL and a real publication date in YYYY-MM-DD format
- Sort by date, newest first

Return ONLY a valid JSON array with no markdown, no explanation, no backticks. Exactly this format:
[
  {
    "title": "Article title here",
    "summary": "One sentence summary of why this matters to Kurdish and Middle Eastern communities in the UK",
    "source": "Source name e.g. BBC News",
    "url": "https://...",
    "date": "2026-06-14"
  }
]`,
        },
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`)
  }

  const data = await response.json()

  let jsonText = ''
  for (const block of data.content) {
    if (block.type === 'text' && block.text) {
      jsonText = block.text
    }
  }

  const clean = jsonText.replace(/```json|```/g, '').trim()
  const articles = JSON.parse(clean)

  if (!Array.isArray(articles)) throw new Error('Response was not an array')

  // Sort newest first on our side — never trust Claude's order
  articles.sort((a, b) => {
    const dateA = new Date(a.date || '1970-01-01')
    const dateB = new Date(b.date || '1970-01-01')
    return dateB - dateA
  })

  return articles
}

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        cookies: {
          get(name) { return cookieStore.get(name)?.value },
        },
      }
    )

    // Check cache
    const { data: cache, error: cacheError } = await supabase
      .from('news_cache')
      .select('articles, fetched_at')
      .eq('id', 1)
      .single()

    if (!cacheError && cache) {
      const age = Date.now() - new Date(cache.fetched_at).getTime()
      if (age < SIX_HOURS_MS && Array.isArray(cache.articles) && cache.articles.length > 0) {
        return Response.json({ articles: cache.articles, cached: true })
      }
    }

    // Cache stale — fetch fresh
    const articles = await fetchFreshNews()

    await supabase
      .from('news_cache')
      .update({ articles, fetched_at: new Date().toISOString() })
      .eq('id', 1)

    return Response.json({ articles, cached: false })
  } catch (err) {
    console.error('News API error:', err)
    return Response.json({ error: 'Failed to load news' }, { status: 500 })
  }
}