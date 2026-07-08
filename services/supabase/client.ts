import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const bucketName = process.env.NEXT_PUBLIC_SUPABASE_EVENT_PHOTOS_BUCKET ?? 'event-photos'

let browserClient: SupabaseClient | null = null

export function getBrowserSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables are missing.')
  }

  if (!browserClient) {
    browserClient = createClient(supabaseUrl, supabaseAnonKey)
  }

  return browserClient
}

export function hasSupabaseClientConfig() {
  return Boolean(supabaseUrl && supabaseAnonKey)
}

export function getSupabaseBucketName() {
  return bucketName
}

export function getSupabaseUrl() {
  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is missing.')
  }

  return supabaseUrl
}

export function getSupabaseAnonKey() {
  if (!supabaseAnonKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.')
  }

  return supabaseAnonKey
}