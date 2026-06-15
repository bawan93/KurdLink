import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { data, error } = await supabase
      .from('news_cache')
      .select('articles, fetched_at')
      .eq('id', 1)
      .single()

    if (error) {
      console.error('Supabase error:', JSON.stringify(error))
      return Response.json({ articles: [], debug: error.message })
    }

    if (!data || !data.articles?.length) {
      return Response.json({ articles: [], debug: 'no data or empty articles' })
    }

    return Response.json({ articles: data.articles, fetched_at: data.fetched_at })

  } catch (err) {
    console.error('News fetch error:', err.message)
    return Response.json({ error: err.message }, { status: 500 })
  }
}