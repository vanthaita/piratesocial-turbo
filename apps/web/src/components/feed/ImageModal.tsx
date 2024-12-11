/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageModalProps {
  imagesUrl: string[];
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imagesUrl, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <button className="absolute top-4 left-4 text-white" onClick={onClose}>
        <X size={30} />
      </button>
      <div className="flex items-center">
        <button
          className="text-white p-2"
          onClick={prevImage}
          aria-label="Previous Image"
        >
          <ChevronLeft size={30} />
        </button>
        <img
          src={imagesUrl[currentImageIndex]}
          alt={`Modal content ${currentImageIndex + 1}`}
          className="rounded-lg object-contain max-h-[90%] max-w-[90%]"
        />
        <button
          className="text-white p-2"
          onClick={nextImage}
          aria-label="Next Image"
        >
          <ChevronRight size={30} />
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
