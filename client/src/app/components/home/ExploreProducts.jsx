"use client"
import React from 'react'
import CategoryCard from './CategoryCard'
import { getdata } from '@/api/req';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ArrowLeft, ArrowRight } from 'lucide-react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const CustomNavButtons = () => {
    return (
        <div className="flex justify-center gap-4 mt-8">
            <button className="custom-prev-button w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-ind_blue flex items-center justify-center group hover:bg-ind_blue transition-colors duration-300 text-ind_blue hover:text-white">
                <ArrowLeft  />
            </button>
            <button className="custom-next-button w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-ind_blue flex items-center justify-center group hover:bg-ind_blue transition-colors duration-300 text-ind_blue hover:text-white">
                <ArrowRight  />
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
                <h1 className='flex flex-col md:flex-row justify-start flex-wrap font-urbanist font-bold text-2xl md:text-4xl'>
                    Explore products <span className='md:pl-3 font-normal'>  by category </span>
                </h1>
                <div className='hidden md:block h-1 w-4 rounded-lg bg-[#FEC500]'></div>
            </div>

            <div className='mt-6 md:mt-10'>
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={1}
                    className="py-8"
                    navigation={{
                        prevEl: '.custom-prev-button',
                        nextEl: '.custom-next-button',
                    }}
                    centeredSlides={true}
                    slidesOffsetBefore={0}
                    breakpoints={{
                        320: {
                            slidesPerView: 1.2,
                            spaceBetween: 16,
                            centeredSlides: true,
                        },
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                            centeredSlides: false,
                        },
                        768: {
                            slidesPerView: 3,
                            spaceBetween: 24,
                            centeredSlides: false,
                        },
                        1024: {
                            slidesPerView: 4,
                            spaceBetween: 24,
                            centeredSlides: false,
                        },
                    }}
                >
                    {data?.categories?.map((item, index) => (
                        <SwiperSlide key={index}>
                            <CategoryCard item={item} />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className='flex  justify-end'>
                    <CustomNavButtons />
                </div>
            </div>
        </div>
    )
}

export default ExploreProducts