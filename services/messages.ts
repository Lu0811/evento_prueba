import type { WeddingMessage } from '@/types/event'
import { getBrowserSupabaseClient, hasSupabaseClientConfig } from './supabase/client'

export async function createGuestMessage(eventId: string, guestName: string, message: string) {
  if (!hasSupabaseClientConfig()) {
    throw new Error('Supabase environment variables are missing.')
  }

  const supabase = getBrowserSupabaseClient()

  const { data, error } = await supabase
    .from('messages')
    .insert({
      event_id: eventId,
      guest_name: guestName.trim(),
      message: message.trim(),
    })
    .select('id, event_id, guest_name, message, created_at')
    .single()

  if (error) {
    throw error
  }

  return data as WeddingMessage
}