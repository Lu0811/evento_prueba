'use client'

import { useCallback, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { UploadCloud, Camera, X, ImageIcon, Check, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Item = {
  id: string
  file: File
  url: string
  caption: string
}

export function UploadMemories() {
  const [items, setItems] = useState<Item[]>([])
  const [guest, setGuest] = useState('')
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return
    const images = Array.from(fileList).filter((f) => f.type.startsWith('image/'))
    if (images.length === 0) {
      toast.error('Please choose image files only.')
      return
    }
    setDone(false)
    setItems((prev) => [
      ...prev,
      ...images.map((file) => ({
        id: `${file.name}-${crypto.randomUUID()}`,
        file,
        url: URL.createObjectURL(file),
        caption: '',
      })),
    ])
  }, [])

  const removeItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((p) => p.id === id)
      if (target) URL.revokeObjectURL(target.url)
      return prev.filter((p) => p.id !== id)
    })
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }

  const handleUpload = () => {
    if (!guest.trim()) {
      toast.error('Please add your name so we know who to thank.')
      return
    }
    if (items.length === 0) {
      toast.error('Add at least one photo to share.')
      return
    }
    setUploading(true)
    setProgress(0)
    // Simulated upload — ready to connect to Supabase Storage later.
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          setUploading(false)
          setDone(true)
          items.forEach((i) => URL.revokeObjectURL(i.url))
          setItems([])
          toast.success('Thank you! Your memories have been shared.')
          return 100
        }
        return p + 5
      })
    }, 80)
  }

  return (
    <section id="memories" className="bg-secondary/40 py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Upload Memories"
          title="Share your view of the day"
          description="Captured a moment we might have missed? Add your photos to our shared album — we would love to see the celebration through your eyes."
        />

        <Reveal className="mt-14">
          <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm md:p-10">
            <div className="grid gap-2">
              <Label htmlFor="guest-name" className="text-sm text-foreground">
                Your name
              </Label>
              <Input
                id="guest-name"
                value={guest}
                onChange={(e) => setGuest(e.target.value)}
                placeholder="e.g. Hana Watanabe"
                className="h-11 rounded-xl bg-background"
              />
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault()
                setDragging(true)
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={`mt-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
                dragging ? 'border-primary bg-primary/5' : 'border-border bg-background/60'
              }`}
            >
              <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <UploadCloud className="size-6" />
              </span>
              <p className="mt-4 font-serif text-xl font-light text-foreground">
                Drag &amp; drop your photos here
              </p>
              <p className="mt-1 text-sm text-muted-foreground">or choose from your device</p>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-light uppercase tracking-[0.15em] text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <ImageIcon className="size-4" />
                  Browse Photos
                </button>
                <button
                  type="button"
                  onClick={() => cameraRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-xs font-light uppercase tracking-[0.15em] text-foreground transition-colors hover:border-primary/50"
                >
                  <Camera className="size-4" />
                  Take a Photo
                </button>
              </div>

              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => addFiles(e.target.files)}
              />
              <input
                ref={cameraRef}
                type="file"
                accept="image/*"
                capture="environment"
                hidden
                onChange={(e) => addFiles(e.target.files)}
              />
            </div>

            <AnimatePresence>
              {items.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 grid gap-4 sm:grid-cols-2"
                >
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 rounded-2xl border border-border/60 bg-background p-3"
                    >
                      <img
                        src={item.url || '/placeholder.svg'}
                        alt={item.file.name}
                        className="size-20 shrink-0 rounded-xl object-cover"
                      />
                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <Input
                          value={item.caption}
                          onChange={(e) =>
                            setItems((prev) =>
                              prev.map((p) =>
                                p.id === item.id ? { ...p, caption: e.target.value } : p,
                              ),
                            )
                          }
                          placeholder="Add a caption…"
                          className="h-9 rounded-lg text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="mt-2 inline-flex w-fit items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-destructive"
                        >
                          <X className="size-3" /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>

            {uploading ? (
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Loader2 className="size-3.5 animate-spin" /> Uploading…
                  </span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : null}

            {done ? (
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/10 p-4 text-primary">
                <Check className="size-5 shrink-0" />
                <p className="text-sm">
                  Thank you for sharing! Your memories are now part of our album.
                </p>
              </div>
            ) : null}

            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-8 py-4 text-xs font-light uppercase tracking-[0.2em] text-background transition-colors hover:bg-foreground/90 disabled:opacity-60"
            >
              {uploading ? 'Uploading…' : 'Share Memories'}
            </button>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Your photos stay private and are shared only with the couple.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
