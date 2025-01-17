import Image from 'next/image'
import React from 'react'
import banner from "@/assets/home/banner.png";
import { Button } from '@/components/ui/button';

const Landing = () => {
  return (
    <div className="relative font-urbanist">
      <div className='bg-black/40 absolute inset-0 z-10'></div>
      <Image 
        src={banner} 
        alt="Banner Image" 
        className="h-[100dvh] sm:h-[90vh] md:h-[80vh] w-full object-cover object-center" 
        priority
      />
      <div className='absolute z-20 space-y-3 md:space-y-4 
        left-4 sm:left-8 md:left-20 top-1/2 transform -translate-y-1/2
        max-w-[90%] sm:max-w-[80%] md:max-w-[600px]'
      >
        <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-semibold leading-tight'>
          Airconditioning Systems <br className='hidden md:block' />
          For Any Vehicles
        </h1>
        <p className='text-white text-sm sm:text-base md:text-lg opacity-90'>
          Bus Airconditioning Systems For Any Busses Bus Airconditioning Systems
          <br className='hidden md:block' />
          For Any Busses Bus Airconditioning Systems For Any Busses
        </p>
        <Button className="bg-[#FEC500] hover:bg-ind_blue hover:text-white text-black 
          text-xs sm:text-sm md:text-base px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 mt-4 md:mt-6
          transition-all duration-300 font-medium"
        >
          SHOP NOW
        </Button>
      </div>
    </div>
  )
}

export default Landing
