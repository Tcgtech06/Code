import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageSlideshowProps {
  images: string[];
  alt: string;
  className?: string;
}

export function ImageSlideshow({ images, alt, className = '' }: ImageSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fallback if no images provided
  const displayImages = images.length > 0 ? images : ['https://via.placeholder.com/800x600?text=No+Image'];

  const nextSlide = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if wrapped in a link
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  return (
    <div className={`relative group w-full h-full overflow-hidden ${className}`}>
      <img
        src={displayImages[currentIndex]}
        alt={`${alt} - Image ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Image+Load+Error';
        }}
      />
      
      {displayImages.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-1.5 rounded-full opacity-80 hover:opacity-100 transition-opacity z-10 shadow-sm"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-1.5 rounded-full opacity-80 hover:opacity-100 transition-opacity z-10 shadow-sm"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          
          {/* Indicators */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
            {displayImages.map((_, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-white w-3' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
