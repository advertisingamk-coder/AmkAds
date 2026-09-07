'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ZoomIn, Loader2 } from 'lucide-react';

// Define the type locally since we are fetching it
export type PortfolioMediaType = {
  id: string;
  title: string;
  brand: string;
  type: string;
  imageSrc: string;
  description: string;
  location?: string;
  altText?: string;
  displayOrder?: number;
  isFeatured?: number;
  created_at?: string;
};

export default function PortfolioGallery() {
  const [items, setItems] = useState<PortfolioMediaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<PortfolioMediaType | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/portfolio`);
        if (res.ok) {
          const data = await res.json();
          setItems(data as PortfolioMediaType[]);
        }
      } catch (err) {
        console.error("Failed to load portfolio items", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  // Close modal when hitting ESC
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSelectedItem(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-12 h-12 text-brand-orange animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-800/50 rounded-2xl border border-white/5">
        <h3 className="text-2xl text-slate-300 font-semibold mb-2">No Campaigns Found</h3>
        <p className="text-slate-500">Check back later to see our latest media campaigns.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="glass-card rounded-xl overflow-hidden group cursor-pointer hover:border-brand-orange/30 hover:shadow-card-hover transition-all duration-300"
            onClick={() => setSelectedItem(item)}
          >
            {/* Image Container */}
            <div className="relative aspect-video w-full overflow-hidden bg-slate-900/50 p-6 flex items-center justify-center">
              <img 
                src={item.imageSrc}
                alt={item.altText || item.title}
                width={300}
                height={200}
                loading="lazy"
                decoding="async"
                className="w-auto h-auto max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
              />
              {item.isFeatured === 1 && (
                <div className="absolute top-3 right-3 bg-brand-orange text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-lg z-10 flex items-center gap-1">
                  ★ Featured
                </div>
              )}
              <div className="absolute inset-0 bg-brand-orange/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <ZoomIn className="w-10 h-10 text-white drop-shadow-md" />
              </div>
            </div>
            
            {/* Details */}
            <div className="p-5 border-t border-white/5">
              <span className="text-brand-orange text-xs font-bold tracking-wider uppercase mb-2 block">
                {item.type}
              </span>
              <h3 className="text-white font-semibold text-lg mb-1">{item.title}</h3>
              <p className="text-slate-400 text-sm mb-1">{brandInfo(item.brand)}</p>
              {item.location && (
                <p className="text-slate-500 text-xs flex items-center gap-1 mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange/70"></span>
                  {item.location}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4 sm:p-8 backdrop-blur-sm"
          onClick={() => setSelectedItem(null)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close Button */}
          <button 
            className="absolute top-4 right-4 sm:top-8 sm:right-8 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-[110]"
            onClick={() => setSelectedItem(null)}
          >
            <X className="w-6 h-6" />
          </button>
          
          <div 
            className="relative max-w-5xl w-full flex flex-col md:flex-row bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image */}
            <div className="flex-1 bg-white/5 p-8 flex items-center justify-center min-h-[300px] md:min-h-[500px] relative">
              {selectedItem.isFeatured === 1 && (
                <div className="absolute top-4 right-4 bg-brand-orange text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded shadow-lg z-10 flex items-center gap-1">
                  ★ Featured
                </div>
              )}
              <img 
                src={selectedItem.imageSrc}
                alt={selectedItem.altText || selectedItem.title}
                width={800}
                height={600}
                loading="lazy"
                decoding="async"
                className="w-auto h-auto max-w-full max-h-full object-contain"
              />
            </div>
            
            {/* Modal Content */}
            <div className="w-full md:w-80 lg:w-96 p-6 sm:p-8 border-l border-white/10 flex flex-col justify-center">
              <span className="inline-block px-3 py-1 bg-brand-orange/20 text-brand-orange text-xs font-bold rounded-full mb-4 w-fit uppercase">
                {selectedItem.type}
              </span>
              <h2 className="text-2xl font-bold text-white mb-2">{selectedItem.title}</h2>
              <p className="text-brand-orange font-medium mb-2">{selectedItem.brand}</p>
              {selectedItem.location && (
                <p className="text-slate-400 text-sm mb-6 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-orange/70"></span>
                  {selectedItem.location}
                </p>
              )}
              
              <div className="prose prose-invert prose-sm">
                <p className="text-slate-300 leading-relaxed">
                  {selectedItem.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function brandInfo(brand: string) {
  return `Brand: ${brand}`;
}
