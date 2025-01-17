"use client"
import React from "react";
import Image from "next/image";
import unit_1 from "@/assets/home/unit_1.png";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const CustomNavButtons = () => {
    return (
        <div className="flex justify-center gap-4 mt-8">
            <button className="custom-prev-button w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-ind_blue flex items-center justify-center group hover:bg-ind_blue transition-colors duration-300">
                <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    className="stroke-ind_blue group-hover:stroke-white transition-colors duration-300"
                >
                    <path 
                        d="M15 19l-7-7 7-7" 
                        strokeWidth="2" 
                        fill="none" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
            <button className="custom-next-button w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-ind_blue flex items-center justify-center group hover:bg-ind_blue transition-colors duration-300">
                <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    className="stroke-ind_blue group-hover:stroke-white transition-colors duration-300"
                >
                    <path 
                        d="M9 5l7 7-7 7" 
                        strokeWidth="2" 
                        fill="none" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
        </div>
    );
};

const TopSelling = () => {
    return (
        <div className="max-w-screen-2xl mx-auto">
            <div className="px-4 py-8 md:p-20">
                <div className="flex items-center gap-2">
                    <h1 className="flex font-urbanist font-bold text-2xl md:text-4xl">
                        Top Selling<span className="pl-3 font-normal"> Products </span>
                    </h1>
                    <div className="h-1 w-4 rounded-lg bg-[#FEC500]"></div>
                </div>
                
                <div className="pt-10">
                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={24}
                        className="py-8"
                        navigation={{
                            prevEl: '.custom-prev-button',
                            nextEl: '.custom-next-button',
                        }}
                        breakpoints={{
                            320: {
                                slidesPerView: 1,
                            },
                            640: {
                                slidesPerView: 2,
                            },
                            768: {
                                slidesPerView: 3,
                            },
                            1024: {
                                slidesPerView: 4,
                            },
                        }}
                    >
                        {[1, 2, 3, 4].map((item, i) => (
                            <SwiperSlide key={i}>
                                <div className="w-56 mt-4 transition-all duration-300 hover:-translate-y-2 mx-auto">
                                    <div className="w-full shadow-md hover:shadow-xl transition-shadow duration-300 drop-shadow-md p-5 bg-white rounded-lg">
                                        <Image 
                                            src={unit_1} 
                                            alt="Product Image" 
                                            className="transition-transform duration-300 hover:scale-105 w-full h-auto"
                                        />
                                    </div>
                                    <div className="font-poppins flex flex-col items-center justify-center p-3 gap-y-1">
                                        <h3 className="font-medium text-lg md:text-xl">Trailer Unit</h3>
                                        <p className="text-ind_blue font-medium">Bus HVAC Part</p>
                                        <Button className="bg-ind_blue px-6 md:px-10 font-urbanist mt-3 transition-all duration-300 hover:bg-ind_blue/90 hover:scale-105">
                                            View Product
                                        </Button>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <CustomNavButtons />
                </div>
            </div>
        </div>
    );
};

export default TopSelling;
