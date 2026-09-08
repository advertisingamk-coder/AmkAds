import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import PortfolioGallery from '@/components/portfolio/PortfolioGallery';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio | AmkAds',
  description: 'Explore our latest Out-Of-Home (OOH) advertising campaigns and billboard placements.',
};

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-slate-900 selection:bg-brand-orange/30 selection:text-brand-orange-light">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors font-medium group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          

        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="max-w-3xl mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Our Portfolio & <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-orange-light">Media Gallery</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl">
              Explore our latest Out-Of-Home (OOH) advertising campaigns, digital screens, and strategic billboard placements across key locations.
            </p>
          </div>

          {/* Gallery Component */}
          <PortfolioGallery />

        </div>
      </main>

    </div>
  );
}
