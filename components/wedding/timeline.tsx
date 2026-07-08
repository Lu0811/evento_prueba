import { Flower2, Wine, Utensils, Music, Sparkles } from 'lucide-react'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'

const schedule = [
  { time: '3:00 PM', title: 'Ceremony', icon: Flower2, text: 'Vows beneath the garden arch' },
  { time: '4:30 PM', title: 'Cocktail Hour', icon: Wine, text: 'Drinks & canapés on the terrace' },
  { time: '6:00 PM', title: 'Dinner', icon: Utensils, text: 'A seasonal feast, shared slowly' },
  { time: '8:00 PM', title: 'First Dance', icon: Music, text: 'Our first steps as newlyweds' },
  { time: '9:00 PM', title: 'Celebration', icon: Sparkles, text: 'Dancing under the lanterns' },
]

export function Timeline() {
  return (
    <section id="timeline" className="bg-secondary/40 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          eyebrow="The Day"
          title="How the day unfolds"
          description="An unhurried celebration, from the first vow to the last dance."
        />

        <div className="relative mt-20">
          <div
            className="absolute left-6 top-2 hidden h-[calc(100%-1rem)] w-px bg-border md:left-0 md:top-9 md:block md:h-px md:w-full"
            aria-hidden="true"
          />
          <ol className="grid gap-10 md:grid-cols-5 md:gap-6">
            {schedule.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <li className="relative flex items-start gap-5 md:flex-col md:items-center md:gap-0 md:text-center">
                  <span className="relative z-10 inline-flex size-14 shrink-0 items-center justify-center rounded-full border border-border bg-card text-primary shadow-sm md:size-16">
                    <s.icon className="size-6" />
                  </span>
                  <div className="md:mt-6">
                    <p className="font-serif text-lg font-medium text-primary">{s.time}</p>
                    <h3 className="mt-1 font-serif text-xl font-light text-foreground">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
