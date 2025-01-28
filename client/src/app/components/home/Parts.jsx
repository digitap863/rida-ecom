"use client";
import parts_1 from "@/assets/home/parts_1.png";
import parts_2 from "@/assets/home/parts_2.png";
import parts_3 from "@/assets/home/parts_3.png";
import Image from "next/image";
import { Navigation, Pagination, Autoplay, Zoom } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import "swiper/css/autoplay";
import 'swiper/css/zoom';
import { ZoomIn } from "lucide-react";
import { useRef, useState } from "react";

const Parts = () => {
    const images = [parts_1, parts_2, parts_3];
    const swiperRef = useRef(null);
    const [isInteracting, setIsInteracting] = useState(false);

    // Function to stop autoplay
    const stopAutoplay = () => {
        if (swiperRef.current?.swiper?.autoplay) {
            swiperRef.current.swiper.autoplay.stop();
            setIsInteracting(true);
        }
    };

    // Function to start autoplay
    const startAutoplay = () => {
        if (swiperRef.current?.swiper?.autoplay && !isInteracting) {
            swiperRef.current.swiper.autoplay.start();
        }
    };

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-4 py-10 md:py-20">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-urbanist text-center">
                    <span className="font-bold">HVAC</span> Parts
                </h1>
                <div className="mt-6 md:mt-10">
                    <Swiper
                        ref={swiperRef}
                        modules={[Navigation, Pagination, Autoplay, Zoom]}
                        spaceBetween={30}
                        slidesPerView={1}
                        zoom={{
                            maxRatio: 3,
                            minRatio: 1
                        }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: true,
                        }}
                        className="w-full max-w-[1200px] mx-auto p-10"
                        onTouchStart={stopAutoplay}
                        onMouseEnter={stopAutoplay}
                        onMouseLeave={startAutoplay}
                        onClick={stopAutoplay}
                        onZoomChange={(swiper, scale) => {
                            if (scale > 1) {
                                stopAutoplay();
                            }
                        }}
                    >
                        {images.map((image, index) => (
                            <SwiperSlide key={index}>
                                <div className="swiper-zoom-container relative group">
                                    <Image
                                        src={image}
                                        alt={`parts_${index + 1}`}
                                        className="w-full h-auto object-cover"
                                        quality={100}
                                    />
                                    <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/90 px-3 py-2 rounded-full shadow-lg backdrop-blur transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out cursor-pointer">
                                        <span className="text-sm font-medium text-gray-700">Zoom</span>
                                        <ZoomIn className="w-4 h-4 text-gray-700 animate-pulse" />
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    );
};

export default Parts;