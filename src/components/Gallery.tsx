import React, { useState, useEffect, useCallback } from 'react';

// --- Interface Definitions ---
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

// --- Image Placeholders (Fixed) ---
const defaultImages: GalleryImage[] = [
    { src: 'https://placehold.co/600x400/1e293b/a5f3fc?text=Primary+Logo', alt: 'Primary Logo', caption: 'Primary Logo Design' },
    { src: 'https://placehold.co/600x400/0f172a/67e8f9?text=Alternative+Design', alt: 'Alternative Logo', caption: 'Alternative Logo Style' },
    { src: 'https://placehold.co/600x400/083344/22d3ee?text=Variant+Style', alt: 'Variant Logo', caption: 'Dark Mode Variant' },
    { src: 'https://placehold.co/600x400/0f766e/ccfbf1?text=Secondary+Mark', alt: 'Secondary Logo', caption: 'Secondary Brand Mark' },
    { src: 'https://placehold.co/600x400/155e75/cffafe?text=Iconography+Example', alt: 'Icon Example', caption: 'A set of brand icons.' },
];

// --- Gallery Component ---
const Gallery: React.FC<GalleryProps> = ({
  images = defaultImages,
  title = "Image Gallery Showcase",
  showCaptions = true,
  enableZoom = true,
  enableNavigation = true,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const imageCount = images.length;

  // Handle image load
  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages(prev => new Set(prev).add(index));
  }, []);

  // Modal navigation handlers
  const goToPrevious = useCallback(() => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      setIsZoomed(false);
    }
  }, [selectedIndex]);

  const goToNext = useCallback(() => {
    if (selectedIndex !== null && selectedIndex < imageCount - 1) {
      setSelectedIndex(selectedIndex + 1);
      setIsZoomed(false);
    }
  }, [selectedIndex, imageCount]);

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
            setIsZoomed(prev => !prev);
          }
          break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, isZoomed, enableNavigation, enableZoom, goToPrevious, goToNext]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    const style = document.body.style;
    if (selectedIndex !== null) {
      style.overflow = 'hidden';
    } else {
      style.overflow = ''; // Reset to default
    }
    return () => {
      style.overflow = '';
    };
  }, [selectedIndex]);

  return (
    <section id="gallery" className="py-16 bg-slate-900 text-white min-h-screen font-sans">
      <div className="container mx-auto px-6 max-w-7xl">
        <h2 className="text-4xl font-extrabold text-cyan-400 mb-6 border-b border-cyan-700/50 pb-2">{title}</h2>
        <p className="text-slate-300 mb-10">Click any image to open the full-screen viewer. You can navigate with the arrows or use the left/right arrow keys.</p>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {images.map((img, i) => (
            <div
              key={img.src}
              className="relative group cursor-pointer overflow-hidden aspect-video rounded-xl shadow-lg ring-1 ring-cyan-500/30 hover:shadow-cyan-400/30 transition-all duration-300 transform hover:scale-[1.03]"
              onClick={() => setSelectedIndex(i)}
            >
                {/* Image Placeholder/Loading State */}
              {!loadedImages.has(i) && (
                <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center text-sm text-slate-500">Loading...</div>
              )}
              <img
                src={img.src}
                alt={img.alt || `Gallery image ${i + 1}`}
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  loadedImages.has(i) ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => handleImageLoad(i)}
                loading="lazy"
              />

                {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 rounded-full bg-cyan-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
                
                {/* Caption */}
              {showCaptions && img.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs md:text-sm p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {img.caption}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Modal Viewer */}
        {selectedIndex !== null && (
          <div
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8 animate-fade-in"
            onClick={() => { setSelectedIndex(null); setIsZoomed(false); }}
          >
            
            {/* Modal Content Wrapper */}
            <div 
                className="relative flex items-center justify-center w-full h-full max-w-full max-h-full"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Close Button */}
              <button
                className="absolute top-0 right-0 m-4 text-white p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/80 transition-colors duration-300 z-[60]"
                onClick={() => { setSelectedIndex(null); setIsZoomed(false); }}
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Navigation Arrows */}
              {enableNavigation && (
                <>
                  <button
                    className="absolute left-0 lg:-left-12 top-1/2 -translate-y-1/2 text-white p-3 rounded-full bg-slate-800/50 hover:bg-cyan-500/50 transition-colors duration-300 disabled:opacity-30 disabled:hover:bg-slate-800/50 z-[60]"
                    onClick={goToPrevious}
                    disabled={selectedIndex === 0}
                    aria-label="Previous image"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    className="absolute right-0 lg:-right-12 top-1/2 -translate-y-1/2 text-white p-3 rounded-full bg-slate-800/50 hover:bg-cyan-500/50 transition-colors duration-300 disabled:opacity-30 disabled:hover:bg-slate-800/50 z-[60]"
                    onClick={goToNext}
                    disabled={selectedIndex === imageCount - 1}
                    aria-label="Next image"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
              </>
            )}

              {/* Image */}
              <img
                src={images[selectedIndex].src}
                alt={images[selectedIndex].alt || `Gallery image ${selectedIndex + 1}`}
                className={`max-h-[90vh] max-w-full object-contain rounded-xl shadow-2xl ring-2 ring-cyan-500/50 transition-transform duration-500 ${
                  enableZoom ? (isZoomed ? 'cursor-zoom-out scale-[1.5]' : 'cursor-zoom-in hover:scale-[1.05]') : ''
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (enableZoom) setIsZoomed(prev => !prev);
                }}
                style={{ transformOrigin: 'center' }}
              />

              {/* Caption & Counter */}
              <div className="absolute bottom-0 w-full flex flex-col items-center p-4">
                {showCaptions && images[selectedIndex].caption && (
                  <div className="bg-black/70 text-white text-center text-sm p-3 rounded-t-lg mb-1 max-w-lg w-full">
                    {images[selectedIndex].caption}
                  </div>
                )}
                <div className="text-white text-xs bg-cyan-700/70 px-3 py-1 rounded-full">
                  {selectedIndex + 1} / {imageCount}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// --- Main App Component to Render the Gallery ---
const App: React.FC = () => {
    return (
        <div className="bg-slate-900 min-h-screen">
            <Gallery />
            {/* Custom CSS (converted from <style jsx> to standard React style block) */}
            <style>
                {`
                    @keyframes fade-in {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    .animate-fade-in {
                        animation: fade-in 0.3s ease-out;
                    }
                `}
            </style>
        </div>
    );
}

export default App;
