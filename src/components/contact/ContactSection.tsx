'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, Send, CheckCircle2, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const contactInfo = [
  { icon: Phone, label: 'Call Us',      value: '0339-192-0339',    href: 'tel:03391920339' },
  { icon: Mail,  label: 'Email Us',     value: 'info@amkadvertising.com',   href: 'mailto:info@amkadvertising.com' },
  { icon: MapPin, label: 'Head Office', value: 'Building No. 39, Wocland Society, Opposite Al-Fateh, Pine Avenue Road, Lahore, Pakistan.',  href: '#' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '', service: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const endpoint = `${process.env.NEXT_PUBLIC_API_URL || ""}/api/contact`

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(form),
      })

      if (response.ok) {
        setSubmitted(true)
        setForm({ name: '', email: '', company: '', message: '', service: '' })
        toast.success('Message sent successfully!')
      } else {
        const errData = await response.json().catch(() => null)
        console.error('Backend returned an error:', errData || response.statusText)
        toast.error('Failed to send message. Please ensure the API route is correct.')
      }
    } catch (error) {
      console.error('Network or fetch error:', error)
      toast.error('An error occurred while sending the message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="relative py-24 bg-brand-black overflow-hidden">
      <div className="glow-orb w-[500px] h-[500px] bg-brand-orange/12 top-0 left-1/2 -translate-x-1/2 pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

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
            <Send className="w-3.5 h-3.5" />
            Let&apos;s Work Together
          </div>
          <h2 className="section-title mb-4">
            Ready to{' '}
            <span className="text-brand-orange">
              Amplify Your Brand?
            </span>
          </h2>
          <p className="section-subtitle mx-auto text-slate-400">
            Get in touch with our OOH specialists. We&apos;ll craft a custom media strategy
            tailored to your brand goals and budget.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-10">
          {/* Contact Info */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            {contactInfo.map(({ icon: Icon, label, value, href }) => (
              <motion.a
                variants={itemVariants}
                key={label}
                href={href}
                className="glass-card p-6 flex items-center gap-4 group hover:border-brand-orange/30 hover:shadow-card-hover transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-orange/15 text-brand-orange flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-widest mb-0.5">{label}</p>
                  <p className="text-white font-semibold">{value}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-brand-orange ml-auto opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1" />
              </motion.a>
            ))}

            {/* Why AMK ADS */}
            <motion.div variants={itemVariants} className="glass-card p-6 flex-grow">
              <h3 className="font-outfit font-bold text-white text-lg mb-4">Why AMK ADS?</h3>
              <ul className="space-y-3">
                {[
                  'Nationwide OOH inventory in 50+ cities',
                  'End-to-end campaign management',
                  'Real-time tracking & reporting',
                  'Creative production in-house',
                  'Dedicated account managers',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-slate-400 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-brand-orange flex-shrink-0 mt-0.5" />
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-3 glass-card p-5 sm:p-8"
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center gap-4">
                <div className="w-20 h-20 rounded-full bg-brand-orange/15 flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-10 h-10 text-brand-orange" />
                </div>
                <h3 className="font-outfit font-bold text-white text-2xl">Message Sent!</h3>
                <p className="text-slate-400">
                  Our team will get back to you within 24 business hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', company: '', message: '', service: '' }) }}
                  className="btn-outline text-sm mt-4"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <h3 className="font-outfit font-bold text-white text-xl mb-1">Send Us a Message</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text" name="name" required value={form.name} onChange={handleChange}
                      placeholder="Your name"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-orange/50 focus:bg-white/8 transition-all duration-200"
                    />
                  </div>
                  {/* Email */}
                  <div>
                    <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email" name="email" required value={form.email} onChange={handleChange}
                      placeholder="you@company.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-orange/50 focus:bg-white/8 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Company */}
                <div>
                  <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider mb-1.5">
                    Company / Brand
                  </label>
                  <input
                    type="text" name="company" value={form.company} onChange={handleChange}
                    placeholder="Your company name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-orange/50 focus:bg-white/8 transition-all duration-200"
                  />
                </div>

                {/* Service */}
                <div>
                  <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider mb-1.5">
                    Service Interested In
                  </label>
                  <select
                    name="service" value={form.service} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-orange/50 transition-all duration-200 text-slate-300"
                    style={{ background: 'rgba(255,255,255,0.05)', color: form.service ? '#cbd5e1' : '#475569' }}
                  >
                    <option value="" disabled style={{ background: '#1E293B' }}>Select a service</option>
                    <option value="Billboard"    style={{ background: '#1E293B' }}>Billboard Advertising</option>
                    <option value="Transit"      style={{ background: '#1E293B' }}>Transit & Transport Media</option>
                    <option value="DOOH"         style={{ background: '#1E293B' }}>Digital OOH (DOOH)</option>
                    <option value="Airport"      style={{ background: '#1E293B' }}>Airport Media</option>
                    <option value="Mall"         style={{ background: '#1E293B' }}>Mall & Retail Media</option>
                    <option value="Digital"      style={{ background: '#1E293B' }}>Digital Marketing</option>
                    <option value="Creative"     style={{ background: '#1E293B' }}>Creative Services</option>
                    <option value="Other"        style={{ background: '#1E293B' }}>Other</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-slate-400 text-xs font-medium uppercase tracking-wider mb-1.5">
                    Message *
                  </label>
                  <textarea
                    name="message" required value={form.message} onChange={handleChange}
                    rows={4} placeholder="Tell us about your campaign goals, budget, and timeline..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-orange/50 focus:bg-white/8 transition-all duration-200 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary justify-center py-4 text-base disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
