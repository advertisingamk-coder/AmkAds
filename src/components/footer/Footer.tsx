'use client'

import { Phone, Mail, MapPin, Twitter, Linkedin, Instagram, Facebook, Youtube, ArrowRight } from 'lucide-react'

const quickLinks = {
  Company: [
    { label: 'About AMK ADS', href: '#home' },
    { label: 'Our Services',  href: '#services' },
    { label: 'Portfolio',     href: '#portfolio' },
    { label: 'AMK ADS Group',  href: '#group' },
  ],
  Services: [
    { label: 'Billboard Advertising', href: '#services' },
    { label: 'Transit Media',         href: '#services' },
    { label: 'Digital OOH',           href: '#services' },
    { label: 'Airport Media',         href: '#services' },
    { label: 'Mall Media',            href: '#services' },
  ],
  Contact: [
    { label: '0339-192-0339', href: 'tel:03391920339' },
    { label: 'info@amkadvertising.com', href: 'mailto:info@amkadvertising.com' },
    { label: 'Building No. 39, Wocland Society, Opposite Al-Fateh, Pine Avenue Road, Lahore, Pakistan.', href: '#' },
  ],
}

const socials = [
  { icon: Twitter,   href: '#', label: 'Twitter'   },
  { icon: Linkedin,  href: 'https://www.linkedin.com/in/amk-ads-761791434/?isSelfProfile=true', label: 'LinkedIn'  },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook,  href: '#', label: 'Facebook'  },
  { icon: Youtube,   href: '#', label: 'YouTube'   },
]

const contactDetails = [
  { icon: Phone,  text: '0339-192-0339',  href: 'tel:03391920339' },
  { icon: Mail,   text: 'info@amkadvertising.com',  href: 'mailto:info@amkadvertising.com' },
  { icon: MapPin, text: 'Building No. 39, Wocland Society, Opposite Al-Fateh, Pine Avenue Road, Lahore, Pakistan.', href: '#' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  const handleNav = (href: string) => {
    if (href.startsWith('#')) {
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="relative bg-slate-50 border-t border-slate-200 text-slate-900 overflow-hidden">
      {/* Glow */}
      <div className="glow-orb w-[400px] h-[400px] bg-brand-orange/6 top-0 left-1/2 -translate-x-1/2" />

      {/* ── Top CTA Bar ── */}
      <div className="relative z-10 bg-brand-greyLight bg-gradient-to-r from-brand-orange/20 via-brand-orange/10 to-brand-orange/10 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-outfit font-bold text-brand-black text-xl">
              Ready to launch your next OOH campaign?
            </h3>
            <p className="text-brand-greyMedium text-sm mt-1">
              Speak to our media specialists today.
            </p>
          </div>
          <button
            onClick={() => handleNav('#contact')}
            className="btn-secondary flex-shrink-0 flex items-center gap-2"
          >
            Get Started Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Main Footer ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <button onClick={() => handleNav('#home')} className="flex items-center justify-center mb-4 group transition-opacity hover:opacity-80 duration-300 w-fit">
              <img src="/images/amk-ads-logo-final.png" alt="AMK ADS Logo" className="h-10 md:h-12 w-auto object-contain" />
            </button>

            <p className="text-slate-600 text-sm leading-relaxed mb-6 max-w-sm">
              Pakistan&apos;s leading Out-of-Home media agency — delivering nationwide billboard,
              transit, digital, and airport advertising solutions with cutting-edge planning technology.
            </p>

            {/* Contact details */}
            <div className="space-y-3 mb-6">
              {contactDetails.map(({ icon: Icon, text, href }) => (
                <a
                  key={text}
                  href={href}
                  className="flex items-center gap-2.5 text-slate-700 hover:text-brand-orangeHover text-sm transition-colors duration-200"
                >
                  <Icon className="w-4 h-4 text-brand-orange flex-shrink-0" />
                  {text}
                </a>
              ))}
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg border border-slate-300 text-slate-700 hover:border-brand-orange hover:text-brand-orangeHover bg-white flex items-center justify-center transition-all duration-200 shadow-sm"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(quickLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-slate-900 font-bold text-sm tracking-wider uppercase mb-4">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href.startsWith('#') ? href : href}
                      onClick={(e) => {
                        if (href.startsWith('#')) {
                          e.preventDefault()
                          handleNav(href)
                        }
                      }}
                      className="text-slate-600 hover:text-brand-orangeHover text-sm transition-colors duration-200 hover:translate-x-1 inline-flex items-center gap-1 group"
                    >
                      <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-200 text-brand-orange">›</span>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom Bar ── */}
        <div className="border-t border-slate-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">
            © {year} AMK ADS. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-slate-500 text-xs">
            <a href="#" className="hover:text-slate-800 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-800 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-800 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
