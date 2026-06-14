import { createClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const SIX_HOURS_MS = 6 * 60 * 60 * 1000

async function fetchFreshNews() {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'interleaved-thinking-2025-05-14',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [
        {
          role: 'user',
          content: `Search the web for the 10 most recent news articles published within the last 7 days about these topics:
- UK immigration news and policy
- Asylum seekers in the UK
- Refugees in the UK
- Kurdish community news in the UK or Europe
- Kurdish political news (Iraq, Iran, Syria)

Rules:
- Only include articles published in the last 7 days
- Sort by date, newest first
- Each article must have a real URL
- Categorise each as either "immigration" or "kurdish"

Return ONLY a valid JSON array with no markdown, no explanation, no backticks. Exactly this format:
[
  {
    "title": "Article title here",
    "summary": "One sentence summary of the article in plain English",
    "source": "Source name e.g. BBC News",
    "url": "https://...",
    "date": "2025-01-15",
    "category": "immigration"
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

  // Extract text from response — find the last text block which contains the JSON
  let jsonText = ''
  for (const block of data.content) {
    if (block.type === 'text' && block.text) {
      jsonText = block.text
    }
  }

  // Clean and parse
  const clean = jsonText.replace(/```json|```/g, '').trim()
  const articles = JSON.parse(clean)

  if (!Array.isArray(articles)) throw new Error('Response was not an array')

  return articles
}

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createClient(
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
        // Cache is fresh — return immediately
        return Response.json({ articles: cache.articles, cached: true })
      }
    }

    // Cache is stale — fetch fresh from Claude
    const articles = await fetchFreshNews()

    // Update cache
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