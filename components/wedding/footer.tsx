import { Heart } from 'lucide-react'
import type { WeddingEvent } from '@/types/event'
import { formatEventDate, getEventHashtag, splitEventTitle } from '@/lib/event-format'

export function Footer({ event }: { event: WeddingEvent }) {
  const [firstName, secondName] = splitEventTitle(event.title)

  return (
    <footer className="border-t border-border/60 bg-secondary/40 py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 text-center md:px-8">
        <span className="font-serif text-4xl font-light text-foreground">
          {firstName}
          <span className="mx-2 italic text-primary">&amp;</span>
          {secondName}
        </span>
        <div className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-muted-foreground">
          <span className="h-px w-8 bg-border" aria-hidden="true" />
          {formatEventDate(event.event_date)}
          <span className="h-px w-8 bg-border" aria-hidden="true" />
        </div>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          Made with <Heart className="size-4 fill-primary text-primary" /> for our celebration
        </p>
        <p className="text-xs text-muted-foreground/70">{getEventHashtag(event)}</p>
      </div>
    </footer>
  )
}
