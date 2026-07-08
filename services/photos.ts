import type { WeddingPhoto } from '@/types/event'
import { getBrowserSupabaseClient, hasSupabaseClientConfig } from './supabase/client'

type UploadPhotoArgs = {
  eventId: string
  eventSlug: string
  file: File
  caption?: string
  onProgress?: (loaded: number, total: number) => void
}

function sanitizeFileName(fileName: string) {
  return fileName.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-+|-+$/g, '') || 'photo'
}

export async function uploadEventPhoto({ eventId, eventSlug, file, caption, onProgress }: UploadPhotoArgs) {
  if (!hasSupabaseClientConfig()) {
    throw new Error('Supabase environment variables are missing.')
  }

  const formData = new FormData()
  formData.append('eventId', eventId)
  formData.append('eventSlug', eventSlug)
  formData.append('file', file)
  formData.append('caption', caption?.trim() || '')

  const response = await new Promise<Response>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/photos/upload', true)

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(event.loaded, event.total)
      }
    }

    xhr.onload = () => {
      const body = xhr.responseText ? JSON.parse(xhr.responseText) : null
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(new Response(JSON.stringify(body), { status: xhr.status }))
        return
      }

      reject(new Error(body?.error || xhr.responseText || `Upload failed with status ${xhr.status}.`))
    }

    xhr.onerror = () => reject(new Error('Network error while uploading the photo.'))
    xhr.setRequestHeader('x-upload-name', sanitizeFileName(file.name))
    xhr.send(formData)
  })

  const payload = (await response.json()) as { photo: WeddingPhoto }
  return payload.photo
}