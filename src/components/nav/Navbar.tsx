'use client'

import { useState, useEffect } from 'react'
import { Menu, X, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

const navLinks = [
  { label: 'Home',      href: '#home' },
  { label: 'Services',  href: '#services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Group',     href: '#group' },
  { label: 'Contact',   href: '#contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen]   = useState(false)
  const [activeLink, setActiveLink] = useState('home')

  const handleNav = (href: string) => {
    if (href.startsWith('/')) {
      window.location.href = href;
      return;
    }
    setMenuOpen(false)
    setActiveLink(href.replace('#', ''))
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50 transition-all duration-500">
      <div className="max-w-7xl mx-auto flex w-full items-center justify-between px-6 py-2 min-h-[80px]">

          {/* ── Logo ── */}
          <button
            onClick={() => handleNav('#home')}
            className="block shrink-0 transition-opacity hover:opacity-80 duration-300"
          >
            <img 
              src="/images/amk-ads-logo-v2.png" 
              alt="AMK ADS Logo" 
              className="max-h-[80px] w-auto object-contain" 
            />
          </button>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = activeLink === link.href.replace('#', '')
              return (
                <button
                  key={link.label}
                  onClick={() => handleNav(link.href)}
                  className={`relative px-1 py-2 uppercase text-xs tracking-widest font-semibold transition-colors duration-200 ${
                    isActive ? 'text-brand-orangeHover border-b-2 border-brand-orangeHover' : 'text-slate-800 hover:text-brand-orangeHover'
                  }`}
                >
                  {link.label}
                </button>
              )
            })}
          </nav>

          {/* ── CTA Button ── */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNav('#contact')}
              className="bg-gradient-to-r from-brand-orange to-orange-600 text-white font-medium shadow-md rounded-lg text-sm px-5 py-2.5 flex items-center gap-1.5 transition-all hover:opacity-90"
            >
              Speak to Us
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
      </div>

      {/* ── Mobile Drawer ── */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white border-t border-slate-200 px-4 py-4 flex flex-col gap-1 shadow-lg">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNav(link.href)}
              className="w-full text-left px-4 py-3 text-slate-700 hover:text-brand-orangeHover hover:bg-slate-50 rounded-xl transition-all duration-200 font-medium flex items-center justify-between"
            >
              {link.label}
              <ChevronRight className="w-4 h-4 text-brand-orange" />
            </button>
          ))}
          <div className="pt-2 mt-2 border-t border-slate-100">
            <button
              onClick={() => handleNav('#contact')}
              className="bg-gradient-to-r from-brand-orange to-orange-600 text-white font-medium shadow-md rounded-lg w-full justify-center text-sm px-5 py-3 flex items-center gap-1.5 transition-all hover:opacity-90"
            >
              Speak to Us
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
