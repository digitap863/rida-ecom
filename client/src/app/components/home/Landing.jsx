import Image from 'next/image'
import React from 'react'
import banner from "@/assets/home/banner.png";
import { Button } from '@/components/ui/button';
const Landing = () => {
  return (
    <div className="relative font-urbanist">
      <div className='bg-black/40 absolute inset-0'></div>
      <Image src={banner} alt="" className="h-[80vh] object-cover"/>
      <div className='absolute  space-y-4 left-20 top-1/2 translate-y-[-50%]'>
        <h1 className='text-6xl text-white font-semibold'>Airconditioning Systems <br />
          For Any Vehicles</h1>
        <p className='text-white'>Bus Airconditioning Systems For Any Busses Bus Airconditioning Systems <br />
          For Any Busses  Bus Airconditioning Systems For Any Busses </p>
        <Button className="bg-[#FEC500] text-black text-sm px-10">SHOP NOW</Button>
      </div>
    </div>
  )
}

export default Landing
