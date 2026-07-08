import type { WeddingEvent } from '@/types/event'

export function formatEventDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

export function splitEventTitle(title: string) {
  const cleaned = title.trim()
  const pair = cleaned
    .split(/\s*&\s*|\s+and\s+/i)
    .map((part) => part.trim())
    .filter(Boolean)

  if (pair.length >= 2) {
    return [pair[0], pair[1]] as const
  }

  const words = cleaned.split(/\s+/).filter(Boolean)

  if (words.length >= 2) {
    return [words[0], words[1]] as const
  }

  return [cleaned, cleaned] as const
}

export function getEventMonogram(title: string) {
  const [first, second] = splitEventTitle(title)
  return `${first[0] ?? ''} & ${second[0] ?? ''}`.trim()
}

export function getEventQuote(event: WeddingEvent) {
  return event.quote ?? event.description
}

export function getEventHashtag(event: WeddingEvent) {
  if (event.hashtag?.trim()) return event.hashtag
  return `#${event.title.replace(/[^a-z0-9]+/gi, '').slice(0, 24) || 'WeddingDay'}`
}