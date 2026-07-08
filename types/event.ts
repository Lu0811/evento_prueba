export type WeddingEvent = {
  id: string
  slug: string
  title: string
  description: string
  event_date: string
  cover_image: string | null
  venue: string | null
  location: string | null
  quote: string | null
  hashtag: string | null
  created_at: string
}

export type WeddingPhoto = {
  id: string
  event_id: string
  image_url: string
  storage_path: string
  uploaded_by: string | null
  caption: string | null
  created_at: string
}

export type WeddingMessage = {
  id: string
  event_id: string
  guest_name: string
  message: string
  created_at: string
}

export type WeddingPageData = {
  event: WeddingEvent
  photos: WeddingPhoto[]
  messages: WeddingMessage[]
}