import { Reveal } from './reveal'

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
}: {
  eyebrow?: string
  title: string
  description?: string
  align?: 'center' | 'left'
}) {
  const alignment =
    align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left'
  return (
    <Reveal className={`flex max-w-2xl flex-col gap-4 ${alignment}`}>
      {eyebrow ? (
        <span className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.35em] text-primary">
          <span className="h-px w-8 bg-primary/50" aria-hidden="true" />
          {eyebrow}
          <span className="h-px w-8 bg-primary/50" aria-hidden="true" />
        </span>
      ) : null}
      <h2 className="text-balance font-serif text-4xl font-light leading-tight text-foreground md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="text-pretty leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </Reveal>
  )
}
