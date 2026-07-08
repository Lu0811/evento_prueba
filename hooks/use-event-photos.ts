import { useEffect, useState } from 'react'
import type { WeddingPhoto } from '@/types/event'
import { getBrowserSupabaseClient, hasSupabaseClientConfig } from '@/services/supabase/client'

export function useEventPhotos(eventId: string, initialPhotos: WeddingPhoto[]) {
  const [photos, setPhotos] = useState(initialPhotos)

  useEffect(() => {
    setPhotos(initialPhotos)
  }, [initialPhotos])

  useEffect(() => {
    if (!eventId) return undefined
    if (!hasSupabaseClientConfig()) return undefined

    const supabase = getBrowserSupabaseClient()
    const channel = supabase
      .channel(`event-photos:${eventId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'photos', filter: `event_id=eq.${eventId}` },
        (payload) => {
          const nextPhoto = payload.new as WeddingPhoto
          setPhotos((current) => [nextPhoto, ...current.filter((photo) => photo.id !== nextPhoto.id)])
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [eventId])

  return { photos, setPhotos }
}