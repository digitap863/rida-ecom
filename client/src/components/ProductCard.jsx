"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
const ProductCard = ({ product }) => {
    console.log(product)
    const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === product.image.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.image.length - 1 : prev - 1
    );
  };

  return (
    <Card className="aspect-[1/1.2] group hover:shadow-lg transition-shadow duration-300 relative overflow-hidden">
      {/* Image Container */}
      <div className="p-3 h-[200px] relative">
        {/* Loading Skeleton */}
        {isLoading && (
          <Skeleton className="w-full h-full absolute top-0 left-0" />
        )}

        {/* Product Image */}
        <Image 
          src={product.image[currentImageIndex]} 
          alt={product.partNumber} 
          className={`
            mx-auto object-contain w-full h-full transition-all duration-300 
            group-hover:scale-105 
            ${isLoading ? 'opacity-0' : 'opacity-100'}
          `}
          width={200} 
          height={200}
          onLoad={() => setIsLoading(false)}
          priority
        />

        {/* Image Navigation Arrows (only show if multiple images) */}
        {product.image.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 
                       bg-white/80 rounded-full p-1.5
                       opacity-0 group-hover:opacity-100 
                       transition-all duration-300
                       hover:bg-white hover:shadow-md
                       focus:outline-none focus:ring-2 focus:ring-ind_blue"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 
                       bg-white/80 rounded-full p-1.5
                       opacity-0 group-hover:opacity-100 
                       transition-all duration-300
                       hover:bg-white hover:shadow-md
                       focus:outline-none focus:ring-2 focus:ring-ind_blue"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>
          </>
        )}

        {/* Image Navigation Dots */}
        {product.image.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {product.image.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentImageIndex(i);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300
                          ${i === currentImageIndex 
                            ? 'bg-ind_blue scale-110' 
                            : 'bg-gray-300 hover:bg-gray-400'}`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-5 font-urbanist space-y-3">

        {/* Product Name */}
        <h3 className="font-bold text-lg line-clamp-2 min-h-[30px]">
          {product.name}
        </h3>
        {/* Part Number Badge */}
        <div className="text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-3 py-1 w-fit">
          {product.partNumber}
        </div>

        {/* Model (if available) */}
        {product.model && (
          <p className="text-sm text-gray-600">
            Model: {product.model}
          </p>
        )}

        {/* Action Button */}
        <Button 
          className="w-full border-2 text-ind_blue hover:bg-ind_blue hover:text-white border-ind_blue 
                    bg-transparent transition-colors duration-300 font-semibold"
        >
          View Details
        </Button>
      </div>

    </Card>
  );
};

export default ProductCard;