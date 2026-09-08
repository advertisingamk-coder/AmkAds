'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Play, X, Globe, Brush, Calendar, Briefcase, Layers } from 'lucide-react'
import Navbar from '@/components/nav/Navbar'
import Footer from '@/components/footer/Footer'

const divisionInfo: Record<string, { title: string, tagline: string, desc: string, icon: React.ElementType }> = {
  'digital-marketing': {
    title: 'Digital Marketing',
    tagline: 'AmkAds Digital',
    desc: 'Full-service digital advertising: social media management, Google Ads, influencer marketing, and performance campaigns integrated with your OOH strategy.',
    icon: Globe
  },
  'creative-agency': {
    title: 'Creative Agency',
    tagline: 'AmkAds Creative',
    desc: 'In-house creative studio delivering world-class design, copywriting, 3D visualizations, and large-format print production for every OOH format.',
    icon: Brush
  },
  'event-management': {
    title: 'Event Management',
    tagline: 'AmkAds Events',
    desc: 'On-ground activations, brand launches, pop-up experiences, and experiential marketing that bring your OOH campaigns to life face-to-face.',
    icon: Calendar
  },
  'corporate-services': {
    title: 'Corporate Services',
    tagline: 'AmkAds Corp',
    desc: 'End-to-end corporate branding, office signage, wayfinding systems, and B2B media planning for enterprises scaling their brand presence.',
    icon: Briefcase
  }
}

type MediaItem = {
  id: number;
  division_slug: string;
  media_type: 'image' | 'video';
  media_url: string;
  title: string;
}

export default function DivisionGallery({ slug }: { slug: string }) {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  const info = divisionInfo[slug]

  useEffect(() => {
    if (!info) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://amkads.advertisingamk.workers.dev"}/api/division-media/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMedia(data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [slug, info])

  if (!info) {
    return (
      <main className="min-h-screen bg-brand-black flex flex-col justify-center items-center">
        <h1 className="text-white text-2xl">Division Not Found</h1>
        <Link href="/#group" className="text-brand-orange mt-4">Return Home</Link>
      </main>
    )
  }

  const Icon = info.icon

  return (
    <main className="min-h-screen bg-brand-black flex flex-col">
      <Navbar />

      <div className="flex-1">
        <section className="relative pt-32 pb-16 overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
          <div className="glow-orb w-[500px] h-[500px] bg-brand-orange/10 top-0 left-1/2 -translate-x-1/2 pointer-events-none" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/#group" className="inline-flex items-center gap-2 text-brand-greyMedium hover:text-white transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" />
              Back to Ecosystem
            </Link>

            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="w-16 h-16 rounded-2xl bg-brand-orange/20 text-brand-orange flex items-center justify-center mx-auto mb-6">
                <Icon className="w-8 h-8" />
              </div>
              <p className="text-brand-orange font-bold uppercase tracking-widest text-sm mb-2">{info.tagline}</p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-outfit text-white mb-6">{info.title} Gallery</h1>
              <p className="text-slate-400 text-lg leading-relaxed">{info.desc}</p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-orange"></div>
              </div>
            ) : media.length === 0 ? (
              <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
                <Layers className="w-12 h-12 text-slate-500 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-outfit font-semibold text-white mb-2">No media uploaded yet</h3>
                <p className="text-slate-400">Check back later for updates from our {info.title} team.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {media.map((item) => (
                  <div 
                    key={item.id} 
                    className="group relative aspect-video bg-[#111111] rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-brand-orange/50 transition-all duration-300 shadow-lg hover:shadow-glow-orange"
                    onClick={() => item.media_type === 'video' ? setSelectedVideo(item.media_url) : setSelectedImage(item.media_url)}
                  >
                    {item.media_type === 'image' ? (
                      <img src={item.media_url} alt={item.title || 'Gallery image'} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    ) : (
                      <div className="w-full h-full relative">
                        <video src={item.media_url} className="w-full h-full object-cover opacity-60" muted playsInline />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                          <div className="w-14 h-14 rounded-full bg-brand-orange text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                            <Play className="w-6 h-6 ml-1" />
                          </div>
                        </div>
                      </div>
                    )}
                    {item.title && (
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                        <p className="text-white font-medium truncate">{item.title}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />

      {/* Image Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50">
            <X className="w-6 h-6" />
          </button>
          <img src={selectedImage} alt="Fullscreen" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 sm:p-8 backdrop-blur-md" onClick={() => setSelectedVideo(null)}>
          <button className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50">
            <X className="w-6 h-6" />
          </button>
          <div className="w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <video src={selectedVideo} className="w-full h-full" autoPlay controls playsInline />
          </div>
        </div>
      )}
    </main>
  )
}
