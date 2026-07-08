import type { WeddingPageData } from '@/types/event'
import { Navbar } from './navbar'
import { Hero } from './hero'
import { OurStory } from './our-story'
import { Gallery } from './gallery'
import { UploadMemories } from './upload-memories'
import { WeddingDetails } from './wedding-details'
import { Rsvp } from './rsvp'
import { Timeline } from './timeline'
import { Contact } from './contact'
import { Footer } from './footer'

export function EventPage({ event, photos, messages }: WeddingPageData) {
  return (
    <main className="bg-background">
      <Navbar event={event} />
      <Hero event={event} />
      <OurStory />
      <Gallery event={event} initialPhotos={photos} />
      <UploadMemories event={event} />
      <WeddingDetails event={event} />
      <Rsvp event={event} initialMessages={messages} />
      <Timeline />
      <Contact event={event} />
      <Footer event={event} />
    </main>
  )
}