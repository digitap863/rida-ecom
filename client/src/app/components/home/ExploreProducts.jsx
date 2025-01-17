"use client"
import React from 'react'
import CategoryCard from './CategoryCard'
import { getdata } from '@/api/req';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

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

const ExploreProducts = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['category'],
        queryFn: () => getdata('/category'),
    })

    return (
        <div className='max-w-screen-2xl mx-auto px-4 py-8 md:p-20'>
            <div className='flex items-center gap-2'>
                <h1 className='flex flex-wrap font-urbanist font-bold text-2xl md:text-4xl'>
                    Explore products <span className='pl-2 md:pl-3 font-normal'> by category </span>
                </h1>
                <div className='h-1 w-4 rounded-lg bg-[#FEC500]'></div>
            </div>

            <div className='mt-6 md:mt-10'>
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
                            spaceBetween: 16,
                        },
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                        768: {
                            slidesPerView: 3,
                            spaceBetween: 24,
                        },
                        1024: {
                            slidesPerView: 4,
                            spaceBetween: 24,
                        },
                    }}
                >
                    {data?.categories?.map((item, index) => (
                        <SwiperSlide key={index}>
                            <CategoryCard item={item} />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <CustomNavButtons />
            </div>
        </div>
    )
}

export default ExploreProducts