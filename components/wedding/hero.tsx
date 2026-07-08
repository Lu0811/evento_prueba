'use client'

import { motion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { wedding } from '@/lib/wedding'
import { useCountdown } from './use-countdown'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] },
  }),
}

export function Hero() {
  const time = useCountdown(wedding.date)

  const units = [
    { label: 'Days', value: time?.days },
    { label: 'Hours', value: time?.hours },
    { label: 'Minutes', value: time?.minutes },
    { label: 'Seconds', value: time?.seconds },
  ]

  return (
    <section id="home" className="relative flex min-h-svh items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/images/hero.png"
          alt="Aiko and Elias walking through a serene garden"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/25 to-foreground/50" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-5 pt-24 pb-28 text-center text-background">
        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-xs font-light uppercase tracking-[0.4em] text-background/80"
        >
          We are getting married
        </motion.p>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-6 text-balance font-serif text-6xl font-light leading-none tracking-tight sm:text-7xl md:text-8xl"
        >
          {wedding.bride}
          <span className="mx-3 italic text-background/70">&amp;</span>
          {wedding.groom}
        </motion.h1>

        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-6 flex items-center gap-4 text-sm font-light uppercase tracking-[0.3em] text-background/90"
        >
          <span className="h-px w-8 bg-background/50" aria-hidden="true" />
          {wedding.displayDate}
          <span className="h-px w-8 bg-background/50" aria-hidden="true" />
        </motion.div>

        <motion.p
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-8 max-w-md text-balance font-serif text-xl font-light italic leading-relaxed text-background/90"
        >
          {`"${wedding.quote}"`}
        </motion.p>

        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-12 grid grid-cols-4 gap-3 sm:gap-5"
        >
          {units.map((u) => (
            <div
              key={u.label}
              className="flex min-w-16 flex-col items-center rounded-2xl border border-background/20 bg-background/10 px-3 py-4 backdrop-blur-md sm:min-w-20 sm:px-5"
            >
              <span className="font-serif text-3xl font-light tabular-nums sm:text-4xl">
                {u.value === undefined ? '--' : String(u.value).padStart(2, '0')}
              </span>
              <span className="mt-1 text-[0.65rem] font-light uppercase tracking-[0.2em] text-background/70">
                {u.label}
              </span>
            </div>
          ))}
        </motion.div>

        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-12"
        >
          <a
            href="#story"
            className="inline-flex items-center rounded-full border border-background/40 bg-background/10 px-8 py-3 text-xs font-light uppercase tracking-[0.25em] text-background backdrop-blur-md transition-colors hover:bg-background hover:text-foreground"
          >
            View Invitation
          </a>
        </motion.div>
      </div>

      <motion.a
        href="#story"
        aria-label="Scroll to our story"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-background/80"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
      >
        <ChevronDown className="size-6" />
      </motion.a>
    </section>
  )
}
