import React, { useState, useEffect, useCallback } from 'react';

interface GalleryImage {
  src: string;
  alt?: string;
  caption?: string;
}

interface GalleryProps {
  images?: GalleryImage[];
  title?: string;
  showCaptions?: boolean;
  enableZoom?: boolean;
  enableNavigation?: boolean;
}

const Gallery: React.FC<GalleryProps> = ({
  images = [
    { src: '/public/images/logo.jpeg', alt: 'Logo 1', caption: 'Primary Logo' },
    { src: '/public/images/logo3.jpeg', alt: 'Logo 3', caption: 'Alternative Logo' },
    { src: '/public/images/logo4.jpeg', alt: 'Logo 4', caption: 'Variant Logo' },
    { src: '/public/images/logo2.jpeg', alt: 'Logo 2', caption: 'Secondary Logo' },
  ],
  title = "Gallery & public",
  showCaptions = true,
  enableZoom = true,
  enableNavigation = true,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  // Handle image load
  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages(prev => new Set(prev).add(index));
  }, []);

  // Modal navigation
  const goToPrevious = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      setIsZoomed(false);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null && selectedIndex < images.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      setIsZoomed(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      switch (e.key) {
        case 'Escape':
          setSelectedIndex(null);
          setIsZoomed(false);
          break;
        case 'ArrowLeft':
          if (enableNavigation) goToPrevious();
          break;
        case 'ArrowRight':
          if (enableNavigation) goToNext();
          break;
        case ' ':
          if (enableZoom) {
            e.preventDefault();
            setIsZoomed(!isZoomed);
          }
          break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, isZoomed, enableNavigation, enableZoom]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedIndex]);

  return (
    <section id="gallery" className="py-20 bg-gradient-to-b from-transparent to-black/5">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-cyan-300 mb-4">{title}</h2>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <div
              key={img.src}
              className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => setSelectedIndex(i)}
            >
              <img
                src={img.src}
                alt={img.alt || `Gallery image ${i + 1}`}
                className={`w-full h-40 object-cover transition-all duration-300 group-hover:scale-105 ${
                  loadedImages.has(i) ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => handleImageLoad(i)}
                loading="lazy"
              />
              {!loadedImages.has(i) && (
                <div className="absolute inset-0 bg-slate-700 animate-pulse rounded-lg"></div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              {showCaptions && img.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-sm p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {img.caption}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedIndex !== null && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setSelectedIndex(null)}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-white hover:text-cyan-300 transition-colors duration-300 z-60"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(null);
                setIsZoomed(false);
              }}
              aria-label="Close modal"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation Arrows */}
            {enableNavigation && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-cyan-300 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed z-60"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  disabled={selectedIndex === 0}
                  aria-label="Previous image"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-cyan-300 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed z-60"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  disabled={selectedIndex === images.length - 1}
                  aria-label="Next image"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Image */}
            <div className="relative max-w-full max-h-full">
              <img
                src={images[selectedIndex].src}
                alt={images[selectedIndex].alt || `Gallery image ${selectedIndex + 1}`}
                className={`max-h-[80vh] max-w-full object-contain rounded-lg transition-transform duration-300 ${
                  isZoomed ? 'cursor-zoom-out scale-150' : 'cursor-zoom-in'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (enableZoom) setIsZoomed(!isZoomed);
                }}
                style={{ transformOrigin: 'center' }}
              />
              {showCaptions && images[selectedIndex].caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-center p-4 rounded-b-lg">
                  {images[selectedIndex].caption}
                </div>
              )}
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default Gallery;
