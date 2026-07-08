import { NextResponse } from 'next/server'
import type { WeddingPhoto } from '@/types/event'
import { demoEvent } from '@/services/events'
import { createSupabaseAdminClient } from '@/services/supabase/server'

export const runtime = 'nodejs'

function sanitizeFileName(fileName: string) {
  return fileName.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-+|-+$/g, '') || 'photo'
}

export async function POST(request: Request) {
  const formData = await request.formData()
  const eventId = String(formData.get('eventId') ?? '').trim()
  const eventSlug = String(formData.get('eventSlug') ?? '').trim()
  const caption = String(formData.get('caption') ?? '').trim()
  const file = formData.get('file')

  if (!eventId || !eventSlug || !(file instanceof File)) {
    return NextResponse.json({ error: 'Missing upload data.' }, { status: 400 })
  }

  const supabase = createSupabaseAdminClient()
  const { data: existingEvent, error: eventLookupError } = await supabase
    .from('events')
    .select('id, slug')
    .eq('id', eventId)
    .maybeSingle()

  if (eventLookupError) {
    return NextResponse.json({ error: eventLookupError.message }, { status: 400 })
  }

  if (!existingEvent) {
    const { error: createEventError } = await supabase.from('events').upsert({
      id: eventId,
      slug: eventSlug,
      title: demoEvent.title,
      description: demoEvent.description,
      event_date: demoEvent.event_date,
      cover_image: demoEvent.cover_image,
      venue: demoEvent.venue,
      location: demoEvent.location,
      quote: demoEvent.quote,
      hashtag: demoEvent.hashtag,
      created_at: demoEvent.created_at,
    })

    if (createEventError) {
      return NextResponse.json({ error: createEventError.message }, { status: 400 })
    }
  }

  const storagePath = `${eventSlug}/${crypto.randomUUID()}-${sanitizeFileName(file.name)}`
  const fileBuffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supabase.storage
    .from('event-photos')
    .upload(storagePath, fileBuffer, {
      contentType: file.type || 'application/octet-stream',
      upsert: true,
      cacheControl: '3600',
    })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 400 })
  }

  const { data: publicUrlData } = supabase.storage.from('event-photos').getPublicUrl(storagePath)

  const { data, error } = await supabase
    .from('photos')
    .insert({
      event_id: eventId,
      image_url: publicUrlData.publicUrl,
      storage_path: storagePath,
      uploaded_by: null,
      caption: caption || null,
    })
    .select('id, event_id, image_url, storage_path, uploaded_by, caption, created_at')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ photo: data as WeddingPhoto })
}