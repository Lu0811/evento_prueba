import { Heart } from 'lucide-react'
import { wedding } from '@/lib/wedding'

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-secondary/40 py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 text-center md:px-8">
        <span className="font-serif text-4xl font-light text-foreground">
          {wedding.bride}
          <span className="mx-2 italic text-primary">&amp;</span>
          {wedding.groom}
        </span>
        <div className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-muted-foreground">
          <span className="h-px w-8 bg-border" aria-hidden="true" />
          {wedding.displayDate}
          <span className="h-px w-8 bg-border" aria-hidden="true" />
        </div>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          Made with <Heart className="size-4 fill-primary text-primary" /> for our celebration
        </p>
        <p className="text-xs text-muted-foreground/70">{wedding.hashtag}</p>
      </div>
    </footer>
  )
}
