import { MessageCircle, Mail, AtSign, MapPin } from 'lucide-react'
import type { WeddingEvent } from '@/types/event'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'

const baseChannels = [
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: 'Message us',
    href: 'https://wa.me/818000000000',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'lu@aikoandelias.love',
    href: 'mailto:hello@aikoandelias.love',
  },
  {
    icon: AtSign,
    label: 'Instagram',
    value: '@aikoandelias',
    href: 'https://instagram.com',
  },
]

export function Contact({ event }: { event: WeddingEvent }) {
  const location = event.location ?? 'Kanazawa, Japan'
  const venue = event.venue ?? 'Kenroku Garden Pavilion'
  const channels = [
    ...baseChannels,
    {
      icon: MapPin,
      label: 'Location',
      value: location,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue}, ${location}`)}`,
    },
  ]

  return (
    <section id="contact" className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Contact"
          title="Reach us anytime"
          description="Questions about the day, travel, or anything at all? We’re only a message away."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((c, i) => (
            <Reveal key={c.label} delay={i * 0.05}>
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full flex-col items-center gap-3 rounded-3xl border border-border/60 bg-card p-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <c.icon className="size-5" />
                </span>
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  {c.label}
                </span>
                <span className="font-serif text-lg font-light text-foreground">{c.value}</span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
