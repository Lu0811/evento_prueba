'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Heart, Check } from 'lucide-react'
import { toast } from 'sonner'
import type { WeddingEvent, WeddingMessage } from '@/types/event'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useEventMessages } from '@/hooks/use-event-messages'
import { createGuestMessage } from '@/services/messages'

export function Rsvp({ event, initialMessages }: { event: WeddingEvent; initialMessages: WeddingMessage[] }) {
  const [attendance, setAttendance] = useState('yes')
  const [guests, setGuests] = useState('1')
  const [submitted, setSubmitted] = useState(false)
  const [pending, setPending] = useState(false)
  const { messages } = useEventMessages(event.id, initialMessages)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()

    if (!name || !message) {
      toast.error('Please share your name and a note.')
      return
    }

    setPending(true)

    try {
      await createGuestMessage(event.id, name, message)
      setSubmitted(true)
      toast.success(
        attendance === 'yes'
          ? 'Wonderful! We can’t wait to celebrate with you.'
          : 'Thank you for letting us know — you’ll be missed.',
      )
      form.reset()
    } catch (error) {
      console.error(error)
      toast.error('We could not save your note right now. Please try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <section id="rsvp" className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-2xl px-5 md:px-8">
        <SectionHeading
          eyebrow="RSVP"
          title="Will you join us?"
          description="Kindly respond by August 1, 2026 so we can prepare a seat for you at our table."
        />

        <Reveal className="mt-14">
          <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm md:p-10">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="thanks"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-4 py-10 text-center"
                >
                  <span className="inline-flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="size-7" />
                  </span>
                  <h3 className="font-serif text-3xl font-light text-foreground">
                    Your RSVP is received
                  </h3>
                  <p className="max-w-sm leading-relaxed text-muted-foreground">
                    Thank you for responding. We’ll be in touch closer to the day with any final
                    details.
                  </p>
                  {messages.length > 0 ? (
                    <div className="mt-4 w-full max-w-xl rounded-2xl border border-border/60 bg-background/70 p-4 text-left">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        Recent guest notes
                      </p>
                      <div className="mt-3 grid gap-3">
                        {messages.slice(0, 3).map((message) => (
                          <div key={message.id} className="rounded-xl border border-border/50 bg-card px-4 py-3">
                            <p className="font-serif text-base font-light text-foreground">{message.message}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                              {message.guest_name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-2 text-xs uppercase tracking-[0.2em] text-primary underline-offset-4 hover:underline"
                  >
                    Edit response
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={onSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-5"
                >
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" name="name" placeholder="Your name" className="h-11 rounded-xl" />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@email.com"
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+81 …"
                        className="h-11 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <Label>Will you attend?</Label>
                    <RadioGroup
                      value={attendance}
                      onValueChange={(v) => setAttendance(String(v))}
                      className="grid-cols-2 gap-3"
                    >
                      {[
                        { value: 'yes', label: 'Joyfully accepts' },
                        { value: 'no', label: 'Regretfully declines' },
                      ].map((opt) => (
                        <label
                          key={opt.value}
                          htmlFor={`att-${opt.value}`}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm transition-colors ${
                            attendance === opt.value
                              ? 'border-primary bg-primary/5 text-foreground'
                              : 'border-border text-muted-foreground hover:border-primary/40'
                          }`}
                        >
                          <RadioGroupItem id={`att-${opt.value}`} value={opt.value} />
                          {opt.label}
                        </label>
                      ))}
                    </RadioGroup>
                  </div>

                  <AnimatePresence initial={false}>
                    {attendance === 'yes' ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid gap-5 overflow-hidden sm:grid-cols-2"
                      >
                        <div className="grid gap-2">
                          <Label htmlFor="guests">Number of guests</Label>
                          <select
                            id="guests"
                            name="guests"
                            value={guests}
                            onChange={(e) => setGuests(e.target.value)}
                            className="h-11 rounded-xl border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                          >
                            {['1', '2', '3', '4', '5'].map((n) => (
                              <option key={n} value={n}>
                                {n} {n === '1' ? 'guest' : 'guests'}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="diet">Dietary restrictions</Label>
                          <Input
                            id="diet"
                            name="diet"
                            placeholder="Vegetarian, allergies…"
                            className="h-11 rounded-xl"
                          />
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  <div className="grid gap-2">
                    <Label htmlFor="message">A note for the couple</Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="Share your wishes or a favourite memory…"
                      className="rounded-xl"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={pending}
                    className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-xs font-light uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
                  >
                    <Heart className="size-4" />
                    {pending ? 'Sending…' : 'Send RSVP'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
