/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageModalProps {
  imagesUrl: string[];
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imagesUrl, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === imagesUrl.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? imagesUrl.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
              onClose();
          }
      };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      };
  }, [onClose]);


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 transition-all duration-300"
      aria-modal="true"
      role="dialog"
    >
        <button
            className={cn(
                "absolute top-4 left-4 text-white bg-black/20 rounded-full p-1 transition-all duration-200 hover:opacity-80 focus:outline-none",
            )}
            onClick={onClose}
            aria-label='close-image-modal'
        >
            <X size={30} />
        </button>
      <div ref={modalContentRef} className="flex items-center relative">
          {imagesUrl.length > 1 &&  (
              <button
                  className={cn(
                      "absolute left-2 top-1/2 transform -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full focus:outline-none",
                      'transition-all duration-200 hover:bg-black/20'
                  )}
                  onClick={prevImage}
                  aria-label="previous-image"
              >
              <ChevronLeft size={30} />
            </button>
           )}

        <img
          src={imagesUrl[currentImageIndex]}
          alt={`Modal content ${currentImageIndex + 1}`}
          className="rounded-lg object-contain max-h-[85vh] max-w-[85vw] transition-transform duration-300 transform-gpu"
            referrerPolicy="no-referrer"
        />
           {imagesUrl.length > 1 && (
           <button
              className={cn(
                  "absolute right-2 top-1/2 transform -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full focus:outline-none",
                  'transition-all duration-200 hover:bg-black/20',
              )}
              onClick={nextImage}
              aria-label="next-image"
          >
              <ChevronRight size={30} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageModal;