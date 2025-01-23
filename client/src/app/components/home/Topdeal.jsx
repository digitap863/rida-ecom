"use client"
import React from 'react'
import prod_1 from "@/assets/home/prod_1.png";
import Image from 'next/image';
import { motion } from "framer-motion"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import Navbutton from '../common/Navbutton';



const Topdeal = () => {
  return (
    <div className='max-w-screen-2xl mx-auto px-4 py-8 md:p-20'>
      <div className='flex items-center gap-2'>
        <h1 className='flex flex-wrap font-urbanist font-bold text-2xl md:text-4xl'>
          Top Deals on <span className='pl-2 md:pl-3 font-normal'> Products </span>
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
          {[1, 2, 3, 4].map((item, i) => (
            <SwiperSlide key={i}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className='relative w-72 my-4 max-w-sm mx-auto shadow-md p-4 md:p-5 bg-white rounded-lg'
              >
                <div className='aspect-square p-3 md:p-5 flex items-center justify-center'>
                  <Image 
                    src={prod_1} 
                    alt='product' 
                    className='w-full h-full object-contain transition-transform duration-300 hover:scale-105'
                  />
                </div>
              
                <div className='py-3 md:py-5'>
                  <div className='font-poppins'>
                    <h5 className='text-lg md:text-xl text-[#383838] font-medium'>Intelligence Runs Kool</h5>
                    <p className='text-[#2369AC] mt-1 md:mt-2 text-sm md:text-base'>Bus HVAC</p>
                  </div>
                  <p className='font-poppins text-sm md:text-base text-[#0BC155] font-medium mt-3 md:mt-4 absolute bottom-2 md:bottom-5 left-4 md:left-5'>
                    Available : 10
                  </p>
                </div>
                
                <div className='uppercase font-poppins bg-ind_blue p-2 rounded-md text-xs md:text-sm text-white font-medium absolute top-4 md:top-5 right-4 md:right-5'>
                  25% off
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="flex justify-end">
        <Navbutton prev="custom-prev-button" next="custom-next-button" />
          </div>
      </div>
    </div>
  )
}

export default Topdeal