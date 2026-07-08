import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'

const milestones = [
  {
    date: 'Spring 2019',
    title: 'The First Hello',
    image: '/images/story-meeting.png',
    text: 'A quiet café, two cups of coffee, and a conversation that somehow lasted until the lights dimmed. We knew something had begun.',
  },
  {
    date: 'Summer 2021',
    title: 'Our First Journey',
    image: '/images/story-trip.png',
    text: 'Salt air and slow mornings by the sea. Between the tides we learned how easy it was to build a whole world for two.',
  },
  {
    date: 'Winter 2024',
    title: 'The Proposal',
    image: '/images/story-proposal.png',
    text: 'A single ring resting on linen, a question whispered, and a yes that felt like coming home. The beginning of forever.',
  },
  {
    date: 'September 2026',
    title: 'The Wedding',
    image: '/images/story-wedding.png',
    text: 'Beneath soft light and gentle greenery, surrounded by the people we love, we say the words that bind two lives into one.',
  },
]

export function OurStory() {
  return (
    <section id="story" className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Our Story"
          title="A gentle path to forever"
          description="Every love has its own rhythm. Here are the quiet moments that led us here."
        />

        <div className="relative mt-20">
          <div
            className="absolute left-6 top-0 h-full w-px bg-border md:left-1/2 md:-translate-x-1/2"
            aria-hidden="true"
          />
          <ol className="flex flex-col gap-16 md:gap-24">
            {milestones.map((m, i) => {
              const flip = i % 2 === 1
              return (
                <li key={m.title} className="relative md:grid md:grid-cols-2 md:items-center md:gap-12">
                  <span
                    className="absolute left-6 top-3 z-10 size-3 -translate-x-1/2 rounded-full border-2 border-background bg-primary md:left-1/2"
                    aria-hidden="true"
                  />

                  <Reveal
                    y={30}
                    className={`pl-14 md:pl-0 ${flip ? 'md:order-2 md:pl-12' : 'md:pr-12 md:text-right'}`}
                  >
                    <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
                      {m.date}
                    </p>
                    <h3 className="mt-2 font-serif text-3xl font-light text-foreground">
                      {m.title}
                    </h3>
                    <p className="mt-4 leading-relaxed text-muted-foreground">{m.text}</p>
                  </Reveal>

                  <Reveal
                    y={30}
                    delay={0.1}
                    className={`mt-6 pl-14 md:mt-0 md:pl-0 ${flip ? 'md:order-1' : ''}`}
                  >
                    <div className="overflow-hidden rounded-3xl shadow-sm ring-1 ring-border/60">
                      <img
                        src={m.image || '/placeholder.svg'}
                        alt={m.title}
                        loading="lazy"
                        className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  </Reveal>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
