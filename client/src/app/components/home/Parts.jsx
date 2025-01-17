"use client";
import parts_1 from "@/assets/home/parts_1.png";
import Image from "next/image";
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import "swiper/css/autoplay";

const Parts = () => {
    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-4 py-10 md:py-20">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-urbanist text-center">
                    <span className="font-bold">HVAC</span> Parts
                </h1>
                
                <div className="mt-6 md:mt-10">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={30}
                        slidesPerView={1}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        className="w-full max-w-[1200px] mx-auto"
                    >
                        <SwiperSlide>
                            <div className="p-4 md:p-8">
                                <Image 
                                    src={parts_1} 
                                    alt="HVAC PARTS" 
                                    className="w-full md:w-[85%] lg:w-[65%] object-cover mx-auto rounded-lg " 
                                    quality={100} 
                                />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="p-4 md:p-8">
                                <Image 
                                    src={parts_1} 
                                    alt="HVAC PARTS" 
                                    className="w-full md:w-[85%] lg:w-[65%] object-cover mx-auto rounded-lg " 
                                    quality={100} 
                                />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="p-4 md:p-8">
                                <Image 
                                    src={parts_1} 
                                    alt="HVAC PARTS" 
                                    className="w-full md:w-[85%] lg:w-[65%] object-cover mx-auto rounded-lg " 
                                    quality={100} 
                                />
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>
        </div>
    )
}

export default Parts;