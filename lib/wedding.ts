export const wedding = {
  bride: 'Aiko',
  groom: 'Elias',
  // ISO date/time of the ceremony
  date: '2026-09-12T15:00:00',
  displayDate: 'September 12, 2026',
  location: 'Kanazawa, Japan',
  venue: 'Kenroku Garden Pavilion',
  quote:
    'Two souls, one quiet path — walking gently into forever, together.',
  hashtag: '#AikoAndElias',
} as const

export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Our Story', href: '#story' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Upload Memories', href: '#memories' },
  { label: 'Details', href: '#details' },
  { label: 'RSVP', href: '#rsvp' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Contact', href: '#contact' },
] as const
