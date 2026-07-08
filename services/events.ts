import type { WeddingEvent, WeddingMessage, WeddingPageData, WeddingPhoto } from '@/types/event'
import { hasSupabaseServerConfig, createSupabaseServerClient } from './supabase/server'

export const demoEvent: WeddingEvent = {
  id: '00000000-0000-0000-0000-000000000001',
  slug: 'aiko-and-elias',
  title: 'Aiko & Elias',
  description: 'Join us as we celebrate the wedding of Aiko & Elias.',
  event_date: '2026-09-12T15:00:00',
  cover_image: '/images/hero.png',
  venue: 'Kenroku Garden Pavilion',
  location: 'Kanazawa, Japan',
  quote: 'Two souls, one quiet path — walking gently into forever, together.',
  hashtag: '#AikoAndElias',
  created_at: '2026-01-01T00:00:00Z',
}

const demoPhotos: WeddingPhoto[] = [
  {
    id: 'demo-photo-1',
    event_id: demoEvent.id,
    image_url: '/images/gallery-2.png',
    storage_path: 'demo/portrait-1.png',
    uploaded_by: null,
    caption: 'Bride holding a dried-flower bouquet',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'demo-photo-2',
    event_id: demoEvent.id,
    image_url: '/images/gallery-1.png',
    storage_path: 'demo/detail-1.png',
    uploaded_by: null,
    caption: 'Minimalist wedding table setting',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'demo-photo-3',
    event_id: demoEvent.id,
    image_url: '/images/gallery-4.png',
    storage_path: 'demo/moment-1.png',
    uploaded_by: null,
    caption: 'Couple embracing in golden light',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'demo-photo-4',
    event_id: demoEvent.id,
    image_url: '/images/gallery-3.png',
    storage_path: 'demo/detail-2.png',
    uploaded_by: null,
    caption: 'Wedding venue interior with wood beams',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'demo-photo-5',
    event_id: demoEvent.id,
    image_url: '/images/gallery-6.png',
    storage_path: 'demo/moment-2.png',
    uploaded_by: null,
    caption: 'Guests at an outdoor dinner at dusk',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'demo-photo-6',
    event_id: demoEvent.id,
    image_url: '/images/gallery-7.png',
    storage_path: 'demo/detail-3.png',
    uploaded_by: null,
    caption: 'Hands with wedding rings on linen',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'demo-photo-7',
    event_id: demoEvent.id,
    image_url: '/images/story-wedding.png',
    storage_path: 'demo/moment-3.png',
    uploaded_by: null,
    caption: 'Ceremony arch with linen drapes',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'demo-photo-8',
    event_id: demoEvent.id,
    image_url: '/images/gallery-5.png',
    storage_path: 'demo/detail-4.png',
    uploaded_by: null,
    caption: 'Minimalist naked wedding cake',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'demo-photo-9',
    event_id: demoEvent.id,
    image_url: '/images/story-proposal.png',
    storage_path: 'demo/portrait-2.png',
    uploaded_by: null,
    caption: 'Engagement ring on folded linen',
    created_at: '2026-01-01T00:00:00Z',
  },
]

const demoMessages: WeddingMessage[] = []

export function getDemoPageData(): WeddingPageData {
  return { event: demoEvent, photos: demoPhotos, messages: demoMessages }
}

function selectEventFields() {
  return 'id, slug, title, description, event_date, cover_image, venue, location, quote, hashtag, created_at'
}

export async function getEventBySlug(slug: string): Promise<WeddingEvent | null> {
  if (!hasSupabaseServerConfig()) {
    return demoEvent.slug === slug ? demoEvent : demoEvent
  }

  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase.from('events').select(selectEventFields()).eq('slug', slug).maybeSingle()

  if (error) {
    throw error
  }

  return (data as WeddingEvent | null) ?? (slug === demoEvent.slug ? demoEvent : demoEvent)
}

export async function getEventPhotos(eventId: string): Promise<WeddingPhoto[]> {
  if (!hasSupabaseServerConfig()) {
    return demoPhotos
  }

  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from('photos')
    .select('id, event_id, image_url, storage_path, uploaded_by, caption, created_at')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return (data?.length ? (data as WeddingPhoto[]) : demoPhotos) as WeddingPhoto[]
}

export async function getEventMessages(eventId: string): Promise<WeddingMessage[]> {
  if (!hasSupabaseServerConfig()) {
    return demoMessages
  }

  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from('messages')
    .select('id, event_id, guest_name, message, created_at')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return (data?.length ? (data as WeddingMessage[]) : demoMessages) as WeddingMessage[]
}

export async function getEventPageDataBySlug(slug: string): Promise<WeddingPageData | null> {
  if (!hasSupabaseServerConfig()) {
    return getDemoPageData()
  }

  const event = await getEventBySlug(slug)

  if (!event) {
    return getDemoPageData()
  }

  const [photos, messages] = await Promise.all([getEventPhotos(event.id), getEventMessages(event.id)])

  return { event, photos, messages }
}

export async function getDefaultEventSlug() {
  const envSlug = process.env.NEXT_PUBLIC_DEFAULT_EVENT_SLUG?.trim()
  if (envSlug) {
    return envSlug
  }

  if (!hasSupabaseServerConfig()) {
    return demoEvent.slug
  }

  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase.from('events').select('slug').order('created_at', { ascending: true }).limit(1)

  if (error) {
    throw error
  }

  return data?.[0]?.slug ?? demoEvent.slug
}

export async function getDefaultEventPageData() {
  if (!hasSupabaseServerConfig()) {
    return getDemoPageData()
  }

  const slug = await getDefaultEventSlug()

  if (!slug) {
    return getDemoPageData()
  }

  return getEventPageDataBySlug(slug)
}