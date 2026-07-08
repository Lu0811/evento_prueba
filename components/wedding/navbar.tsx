'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import type { WeddingEvent } from '@/types/event'
import { navLinks } from '@/lib/navigation'
import { getEventHashtag, getEventMonogram } from '@/lib/event-format'
import { cn } from '@/lib/utils'

export function Navbar({ event }: { event: WeddingEvent }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const monogram = getEventMonogram(event.title)

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled
          ? 'border-b border-border/60 bg-background/80 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8"
        aria-label="Primary"
      >
        <a
          href="#home"
          className={cn(
            'font-serif text-xl tracking-wide transition-colors md:text-2xl',
            scrolled ? 'text-foreground' : 'text-background',
          )}
        >
          {monogram}
        </a>

        <ul className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={cn(
                  'text-[0.8rem] font-light uppercase tracking-[0.15em] transition-colors',
                  scrolled
                    ? 'text-muted-foreground hover:text-primary'
                    : 'text-background/80 hover:text-background',
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            'inline-flex size-10 items-center justify-center rounded-full transition-colors lg:hidden',
            scrolled ? 'text-foreground hover:bg-muted' : 'text-background hover:bg-background/10',
          )}
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              className="absolute right-0 top-0 flex h-full w-4/5 max-w-xs flex-col bg-background px-6 py-6 shadow-xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-xl text-foreground">{monogram}</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex size-10 items-center justify-center rounded-full text-foreground hover:bg-muted"
                  aria-label="Close menu"
                >
                  <X className="size-5" />
                </button>
              </div>
              <ul className="mt-10 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-3 py-3 font-serif text-lg text-foreground transition-colors hover:bg-muted hover:text-primary"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-auto text-sm text-muted-foreground">{getEventHashtag(event)}</p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
