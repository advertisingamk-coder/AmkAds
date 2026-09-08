'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Globe, Brush, Calendar, Briefcase, ArrowRight, Layers, PlayCircle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const ecosystem = [
  {
    icon: Globe,
    title: 'Digital Marketing',
    tagline: 'AmkAds Digital',
    desc: 'Full-service digital advertising: social media management, Google Ads, influencer marketing, and performance campaigns integrated with your OOH strategy.',
    services: ['Social Media Ads', 'Google/Meta Campaigns', 'SEO & Content', 'Influencer Outreach'],
    color: 'blue',
    gradient: 'from-brand-orange/20 to-brand-black/10',
    slug: 'digital-marketing',
  },
  {
    icon: Brush,
    title: 'Creative Agency',
    tagline: 'AmkAds Creative',
    desc: 'In-house creative studio delivering world-class design, copywriting, 3D visualizations, and large-format print production for every OOH format.',
    services: ['Graphic Design', '3D Anamorphic Art', 'Copywriting', 'Print Production'],
    color: 'amber',
    gradient: 'from-orange-500/20 to-orange-900/10',
    slug: 'creative-agency',
  },
  {
    icon: Calendar,
    title: 'Event Management',
    tagline: 'AmkAds Events',
    desc: 'On-ground activations, brand launches, pop-up experiences, and experiential marketing that bring your OOH campaigns to life face-to-face.',
    services: ['Brand Activations', 'Product Launches', 'Pop-up Experiences', 'Experiential Marketing'],
    color: 'blue',
    gradient: 'from-brand-orange/20 to-brand-black/10',
    slug: 'event-management',
  },
  {
    icon: Briefcase,
    title: 'Corporate Services',
    tagline: 'AmkAds Corp',
    desc: 'End-to-end corporate branding, office signage, wayfinding systems, and B2B media planning for enterprises scaling their brand presence.',
    services: ['Corporate Branding', 'Office Signage', 'Wayfinding Systems', 'B2B Media Planning'],
    color: 'amber',
    gradient: 'from-orange-500/20 to-orange-900/10',
    slug: 'corporate-services',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function GroupSection() {
  const [videoMap, setVideoMap] = useState<Record<string, string>>({})
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://amkads.advertisingamk.workers.dev"}/api/service-videos`)
        if (res.ok) {
          const data = await res.json()
          setVideoMap(data)
        }
      } catch (e) {
        console.error("Failed to fetch videos", e)
      }
    }
    fetchVideos()
  }, [])

  return (
    <section id="group" className="relative py-24 bg-brand-greyLight overflow-hidden">
      <div className="glow-orb w-[500px] h-[500px] bg-brand-orange/8 bottom-0 right-0 pointer-events-none" />
      <div className="glow-orb w-[300px] h-[300px] bg-brand-orange/6 top-0 left-0 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="section-label mx-auto mb-4 inline-flex">
            <Layers className="w-3.5 h-3.5" />
            The AmkAds Ecosystem
          </div>
          <h2 className="section-title-light mb-4">
            One Group.{' '}
            <span className="text-brand-orange">
              Every Solution.
            </span>
          </h2>
          <p className="section-subtitle-light">
            AmkAds is more than OOH — we are a full-service communications group
            with specialist arms across digital, creative, events, and corporate branding.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {ecosystem.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="relative glass-card p-8 group overflow-hidden hover:border-brand-orange/30 hover:shadow-card-hover transition-all duration-500"
              >
                {/* Gradient Accent */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                <div className="relative z-10">
                  {/* Header Row */}
                  <div className="flex items-start gap-4 mb-5">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 ${
                        item.color === 'blue'
                          ? 'bg-brand-orange/20 text-brand-orange'
                          : 'bg-brand-orange/20 text-brand-orange'
                      }`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-widest mb-0.5 ${
                        item.color === 'blue' ? 'text-brand-orange' : 'text-brand-orange'
                      }`}>
                        {item.tagline}
                      </p>
                      <h3 className="font-outfit font-bold text-brand-black text-xl group-hover:text-brand-black transition-colors duration-200">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-brand-greyMedium text-sm leading-relaxed mb-5">{item.desc}</p>

                  {/* Services chips */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {item.services.map((s) => (
                      <span
                        key={s}
                        className={`text-xs px-3 py-1 rounded-full border ${
                          item.color === 'blue'
                            ? 'bg-brand-orange/10 border-brand-orange/20 text-brand-orange'
                            : 'bg-brand-orange/10 border-brand-orange/20 text-brand-orange'
                        }`}
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-6">
                    <Link
                      href={`/group/${item.slug}`}
                      className={`flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 group/btn ${
                        item.color === 'blue' ? 'text-brand-orange' : 'text-brand-orange'
                      }`}
                    >
                      Explore Gallery
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </Link>

                    {videoMap[item.slug] && (
                      <button
                        onClick={() => setActiveVideo(videoMap[item.slug])}
                        className={`flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 hover:opacity-80 ${
                          item.color === 'blue' ? 'text-brand-orange' : 'text-brand-orange'
                        }`}
                      >
                        <PlayCircle className="w-4 h-4" />
                        Watch Video
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black text-white rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="aspect-video w-full bg-black">
                <video
                  src={activeVideo}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
