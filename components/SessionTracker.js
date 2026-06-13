'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

const HEARTBEAT_INTERVAL = 60000   // ping every 60s
const SESSION_TIMEOUT   = 30 * 60 * 1000 // 30 min gap = new session

export default function SessionTracker() {
  const pathname = usePathname()
  const sessionId   = useRef(null)
  const identifier  = useRef(null)
  const identifierType = useRef(null)
  const heartbeatRef = useRef(null)

  const getSupabase = () => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  async function getIdentifier() {
    const supabase = getSupabase()
    const { data } = await supabase.auth.getUser()
    if (data?.user?.id) {
      return { id: data.user.id, type: 'user' }
    }
    try {
      // Check localStorage cache first to avoid hammering ipify
      const cached = localStorage.getItem('komek_ip')
      if (cached) return { id: cached, type: 'ip' }
      const res = await fetch('https://api.ipify.org?format=json')
      const d = await res.json()
      localStorage.setItem('komek_ip', d.ip)
      return { id: d.ip, type: 'ip' }
    } catch {
      return { id: 'unknown', type: 'ip' }
    }
  }

  async function startSession(id, type, path) {
    const supabase = getSupabase()
    const now = new Date().toISOString()

    // Check if there's a recent session (within SESSION_TIMEOUT) for this identifier
    const cutoff = new Date(Date.now() - SESSION_TIMEOUT).toISOString()
    const { data: recent } = await supabase
      .from('app_sessions')
      .select('id, visit_count')
      .eq('identifier', id)
      .eq('identifier_type', type)
      .gte('last_seen_at', cutoff)
      .order('last_seen_at', { ascending: false })
      .limit(1)

    if (recent && recent.length > 0) {
      // Resume existing session — just update last_seen and path
      sessionId.current = recent[0].id
      await supabase
        .from('app_sessions')
        .update({ last_seen_at: now, page_path: path })
        .eq('id', recent[0].id)
    } else {
      // New session — check if this is a returning visitor
      const { count } = await supabase
        .from('app_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('identifier', id)
        .eq('identifier_type', type)

      const { data: inserted } = await supabase
        .from('app_sessions')
        .insert({
          identifier: id,
          identifier_type: type,
          started_at: now,
          last_seen_at: now,
          page_path: path,
          visit_count: (count || 0) + 1,
        })
        .select('id')
        .single()

      if (inserted) sessionId.current = inserted.id
    }
  }

  async function heartbeat(path) {
    if (!sessionId.current) return
    const supabase = getSupabase()
    await supabase
      .from('app_sessions')
      .update({ last_seen_at: new Date().toISOString(), page_path: path })
      .eq('id', sessionId.current)
  }

  useEffect(() => {
    let cancelled = false

    async function init() {
      const { id, type } = await getIdentifier()
      if (cancelled) return
      identifier.current = id
      identifierType.current = type
      await startSession(id, type, pathname)
    }

    init()

    return () => { cancelled = true }
  }, [])

  // Update page_path on navigation, restart heartbeat
  useEffect(() => {
    if (!identifier.current) return

    heartbeat(pathname)

    if (heartbeatRef.current) clearInterval(heartbeatRef.current)
    heartbeatRef.current = setInterval(() => heartbeat(pathname), HEARTBEAT_INTERVAL)

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current)
    }
  }, [pathname])

  return null
}