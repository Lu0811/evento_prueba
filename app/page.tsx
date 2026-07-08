import { Navbar } from '@/components/wedding/navbar'
import { Hero } from '@/components/wedding/hero'
import { OurStory } from '@/components/wedding/our-story'
import { Gallery } from '@/components/wedding/gallery'
import { UploadMemories } from '@/components/wedding/upload-memories'
import { WeddingDetails } from '@/components/wedding/wedding-details'
import { Rsvp } from '@/components/wedding/rsvp'
import { Timeline } from '@/components/wedding/timeline'
import { Contact } from '@/components/wedding/contact'
import { Footer } from '@/components/wedding/footer'

export default function Page() {
  return (
    <main className="bg-background">
      <Navbar />
      <Hero />
      <OurStory />
      <Gallery />
      <UploadMemories />
      <WeddingDetails />
      <Rsvp />
      <Timeline />
      <Contact />
      <Footer />
    </main>
  )
}
