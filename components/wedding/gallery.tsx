'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { X, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import type { WeddingEvent, WeddingPhoto } from '@/types/event'
import { useEventPhotos } from '@/hooks/use-event-photos'
import { SectionHeading } from './section-heading'
import { cn } from '@/lib/utils'

type Category = 'All' | 'Portraits' | 'Details' | 'Moments'

const categories: Category[] = ['All', 'Portraits', 'Details', 'Moments']

type GalleryPhoto = WeddingPhoto & {
  category: Exclude<Category, 'All'>
}

function getPhotoCategory(photo: WeddingPhoto): Exclude<Category, 'All'> {
  const haystack = `${photo.caption ?? ''} ${photo.storage_path}`.toLowerCase()

  if (haystack.includes('portrait')) return 'Portraits'
  if (haystack.includes('detail')) return 'Details'
  return 'Moments'
}

export function Gallery({ event, initialPhotos }: { event: WeddingEvent; initialPhotos: WeddingPhoto[] }) {
  const [active, setActive] = useState<Category>('All')
  const [lightbox, setLightbox] = useState<number | null>(null)
  const { photos } = useEventPhotos(event.id, initialPhotos)

  const visible = useMemo(() => {
    const mapped: GalleryPhoto[] = photos.map((photo) => ({
      ...photo,
      category: getPhotoCategory(photo),
    }))

    return active === 'All' ? mapped : mapped.filter((photo) => photo.category === active)
  }, [active, photos])

  useEffect(() => {
    if (lightbox !== null && lightbox >= visible.length) {
      setLightbox(null)
    }
  }, [lightbox, visible.length])

  const close = () => setLightbox(null)
  const show = (delta: number) =>
    setLightbox((prev) => {
      if (prev === null) return prev
      return (prev + delta + visible.length) % visible.length
    })

  return (
    <section id="gallery" className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Gallery"
          title="Moments we hold dear"
          description="A collection of quiet frames — soft light, gentle details, and the people who make our story."
        />

        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              className={cn(
                'rounded-full border px-5 py-2 text-xs font-light uppercase tracking-[0.15em] transition-colors',
                active === c
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-transparent text-muted-foreground hover:border-primary/50 hover:text-foreground',
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {visible.map((photo, i) => (
            <motion.button
              layout
              type="button"
              key={photo.id}
              onClick={() => setLightbox(i)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
              className="group relative block w-full overflow-hidden rounded-3xl ring-1 ring-border/60"
              aria-label={`Open ${photo.caption ?? event.title}`}
            >
              <img
                src={photo.image_url || '/placeholder.svg'}
                alt={photo.caption ?? event.title}
                loading="lazy"
                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-foreground/0 transition-colors duration-500 group-hover:bg-foreground/25">
                <Plus className="size-8 text-background opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox !== null ? (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/90 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
          >
            <button
              type="button"
              onClick={close}
              className="absolute right-5 top-5 inline-flex size-11 items-center justify-center rounded-full bg-background/10 text-background transition-colors hover:bg-background/20"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                show(-1)
              }}
              className="absolute left-4 inline-flex size-11 items-center justify-center rounded-full bg-background/10 text-background transition-colors hover:bg-background/20 md:left-8"
              aria-label="Previous image"
            >
              <ChevronLeft className="size-6" />
            </button>
            <motion.img
              key={visible[lightbox].image_url}
              src={visible[lightbox].image_url || '/placeholder.svg'}
              alt={visible[lightbox].caption ?? event.title}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="max-h-[85svh] max-w-full rounded-2xl object-contain"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                show(1)
              }}
              className="absolute right-4 inline-flex size-11 items-center justify-center rounded-full bg-background/10 text-background transition-colors hover:bg-background/20 md:right-8"
              aria-label="Next image"
            >
              <ChevronRight className="size-6" />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
