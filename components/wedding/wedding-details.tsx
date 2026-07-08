import { CalendarHeart, Church, Wine, Shirt, Gift, Clock, MapPin } from 'lucide-react'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'
import { wedding } from '@/lib/wedding'

const details = [
  {
    icon: Church,
    title: 'Ceremony',
    lines: ['3:00 PM', 'Kenroku Garden Pavilion', 'Outdoor garden terrace'],
  },
  {
    icon: Wine,
    title: 'Reception',
    lines: ['6:00 PM until late', 'The Linen Hall', 'Dinner, toasts & dancing'],
  },
  {
    icon: Shirt,
    title: 'Dress Code',
    lines: ['Garden formal', 'Soft, earthy tones', 'Comfortable footwear advised'],
  },
  {
    icon: Clock,
    title: 'Schedule',
    lines: ['Arrival — 2:30 PM', 'Ceremony — 3:00 PM', 'Reception — 6:00 PM'],
  },
  {
    icon: Gift,
    title: 'Gifts',
    lines: [
      'Your presence is the gift',
      'A contribution to our home',
      'is warmly appreciated',
    ],
  },
  {
    icon: CalendarHeart,
    title: 'The Date',
    lines: [wedding.displayDate, 'Saturday afternoon', 'Kanazawa, Japan'],
  },
]

export function WeddingDetails() {
  const mapQuery = encodeURIComponent(`${wedding.venue}, ${wedding.location}`)

  return (
    <section id="details" className="bg-secondary/40 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Wedding Details"
          title="Everything you need to know"
          description="A calm celebration held across an afternoon and evening. We would be honoured to have you there."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {details.map((d, i) => (
            <Reveal key={d.title} delay={i * 0.05}>
              <article className="flex h-full flex-col items-start gap-4 rounded-3xl border border-border/60 bg-card p-8 shadow-sm transition-shadow hover:shadow-md">
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <d.icon className="size-5" />
                </span>
                <h3 className="font-serif text-2xl font-light text-foreground">{d.title}</h3>
                <ul className="space-y-1 text-muted-foreground">
                  {d.lines.map((line) => (
                    <li key={line} className="leading-relaxed">
                      {line}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-6" delay={0.1}>
          <div className="grid overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm md:grid-cols-2">
            <div className="flex flex-col justify-center gap-4 p-8 md:p-10">
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <MapPin className="size-5" />
              </span>
              <h3 className="font-serif text-2xl font-light text-foreground">How to find us</h3>
              <p className="leading-relaxed text-muted-foreground">
                {wedding.venue}
                <br />
                {wedding.location}
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-light uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <MapPin className="size-4" />
                Open in Google Maps
              </a>
            </div>
            <div className="min-h-64 md:min-h-full">
              <iframe
                title="Wedding venue location map"
                src={`https://maps.google.com/maps?q=${mapQuery}&z=13&output=embed`}
                className="h-full min-h-64 w-full grayscale-[0.4]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
