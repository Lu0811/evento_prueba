import { useEffect, useState } from 'react'
import type { WeddingMessage } from '@/types/event'
import { getBrowserSupabaseClient, hasSupabaseClientConfig } from '@/services/supabase/client'

export function useEventMessages(eventId: string, initialMessages: WeddingMessage[]) {
  const [messages, setMessages] = useState(initialMessages)

  useEffect(() => {
    setMessages(initialMessages)
  }, [initialMessages])

  useEffect(() => {
    if (!eventId) return undefined
    if (!hasSupabaseClientConfig()) return undefined

    const supabase = getBrowserSupabaseClient()
    const channel = supabase
      .channel(`event-messages:${eventId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `event_id=eq.${eventId}` },
        (payload) => {
          const nextMessage = payload.new as WeddingMessage
          setMessages((current) => [nextMessage, ...current.filter((message) => message.id !== nextMessage.id)])
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [eventId])

  return { messages, setMessages }
}