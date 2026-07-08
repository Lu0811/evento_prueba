import { EventPage } from '@/components/wedding/event-page'
import { getDefaultEventPageData } from '@/services/events'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const pageData = await getDefaultEventPageData()

  if (!pageData) {
    return null
  }

  return <EventPage {...pageData} />
}
