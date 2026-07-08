import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { EventPage } from '@/components/wedding/event-page'
import { getEventPageDataBySlug } from '@/services/events'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params
  const pageData = await getEventPageDataBySlug(slug)

  if (!pageData) {
    return {
      title: 'Wedding Invitation',
      description: 'Wedding invitation and guest album',
    }
  }

  return {
    title: pageData.event.title,
    description: pageData.event.description,
  }
}

export default async function EventRoute({ params }: { params: { slug: string } }) {
  const { slug } = params
  const pageData = await getEventPageDataBySlug(slug)

  if (!pageData) {
    notFound()
  }

  return <EventPage {...pageData} />
}