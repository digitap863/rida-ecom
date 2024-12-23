"use client"
import React from 'react'
import prod_1 from "@/assets/home/prod_1.png";
import Image from 'next/image';
import { motion } from "framer-motion"

const Topdeal = () => {
  return (
    <div className='p-20'>
      <div className='flex items-center gap-2'>
        <h1 className='flex  font-urbanist  font-bold text-4xl'>Top Deals on <span className='pl-3 font-normal'> Products </span></h1>
        <div className='h-1 w-4 rounded-lg bg-[#FEC500]'></div>
      </div>
      <div className=' flex gap-6  mt-10 '>
        {
          [1, 2, 3, 4].map((item, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className='relative w-64 aspect-[1/1.2] shadow-md p-5 bg-white rounded-lg'
              key={i}
            >
              <div className='p-5 aspect-[1/0.8] flex items-center justify-center'>
                <Image src={prod_1} alt='product' />
              </div>
              <div className=' py-5'>
                <div className='font-poppins font-medium'>
                  <h5 className='text-xl text-[#383838]'>Intelligence Runs Kool</h5>
                  <p className='text-[#2369AC] mt-2'>Bus HVAC</p>
                </div>
                <p className='font-poppins text-base text-[#0BC155] font-medium mt-4 absolute bottom-3 left-5'>Available : 10</p>
              </div>
              <div className='uppercase font-poppins bg-ind_blue p-2 rounded-md text-xs  text-white font-medium  absolute top-5 right-5'>
                25% off
              </div>
            </motion.div>

          ))
        }
      </div>
    </div>
  )
}

export default Topdeal