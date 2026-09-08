import DivisionGallery from '@/components/group/DivisionGallery'

export function generateStaticParams() {
  return [
    { slug: 'digital-marketing' },
    { slug: 'creative-agency' },
    { slug: 'event-management' },
    { slug: 'corporate-services' }
  ]
}

export default async function DivisionGalleryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return <DivisionGallery slug={resolvedParams.slug} />
}
