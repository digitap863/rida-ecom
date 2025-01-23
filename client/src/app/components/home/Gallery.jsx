import React from 'react'
import gallery_1 from '@/assets/home/gallery_1.png'
import gallery_2 from '@/assets/home/gallery_2.png'
import gallery_3 from '@/assets/home/gallery_3.png'
import gallery_4 from '@/assets/home/gallery_4.png'
import gallery_5 from '@/assets/home/gallery_5.png'
import gallery_6 from '@/assets/home/gallery_6.png'
import Image from 'next/image'


const Gallery = () => {
    return (
        <div>
            <div className='max-w-screen-2xl mx-auto px-4 py-8 lg:p-20'>
                <div className='flex flex-col lg:flex-row gap-4 font-urbanist'>
                    <div>
                        <h1 className='text-2xl md:text-4xl'><span className='font-bold'>Photos</span> by our <br className='hidden md:block' />clients</h1>
                        <p className='text-[#808D9E] max-w-sm mt-2'>Bus Airconditioning Systems For Any Busses Bus Airconditioning Systems
                            For Any Busses  Bus Airconditioning Systems For Any Busses </p>
                    </div>
                    <div className='w-full overflow-x-auto'>

                        <div className='flex flex-row gap-3 w-[250%] sm:w-full overflow-x-auto  '>
                            <div className='space-y-3 '>
                                <div className='relative overflow-hidden rounded-3xl'>
                                    <Image src={gallery_1} alt='gallery_1' className='hover:scale-105 duration-200 w-full sm:w-[80%] mx-auto lg:w-full' quality={100} />
                                    <p className='absolute  bottom-3 lg:bottom-5 lg:text-xl uppercase left-10 lg:left-8 font-urbanist font-semibold  '>Truck</p>
                                </div>
                                <div className='relative overflow-hidden rounded-3xl'>
                                    <Image src={gallery_2} alt='gallery_2' className='hover:scale-105 duration-200 w-full sm:w-[80%] mx-auto lg:w-full' quality={100} />
                                    <p className='absolute bottom-3 lg:bottom-5 lg:text-xl uppercase left-10 lg:left-8 font-urbanist font-semibold  '>Truck</p>
                                </div>
                            </div>
                            <div className='space-y-3'>
                                <div className='relative overflow-hidden rounded-3xl'>
                                    <Image src={gallery_3} alt='gallery_3' className='hover:scale-105 duration-200 w-full sm:w-[80%] mx-auto lg:w-full' quality={100} />
                                    <p className='absolute bottom-3 lg:bottom-5 lg:text-xl uppercase left-10 lg:left-8 font-urbanist font-semibold  '>Bus</p>
                                </div>
                                <div className='relative overflow-hidden rounded-3xl'>
                                    <Image src={gallery_4} alt='gallery_4' className='hover:scale-105 duration-200 w-full sm:w-[80%] mx-auto lg:w-full' quality={100} />
                                    <p className='absolute bottom-3 lg:bottom-5 lg:text-xl uppercase left-10 lg:left-8 font-urbanist font-semibold  '>Bus</p>
                                </div>

                            </div>
                            <div className='space-y-3'>
                                <div className='relative overflow-hidden rounded-3xl'>
                                    <Image src={gallery_5} alt='gallery_5' className='hover:scale-105 duration-200 w-full sm:w-[80%] mx-auto lg:w-full' quality={100} />
                                    <p className='absolute bottom-3 lg:bottom-5 lg:text-xl uppercase left-10 lg:left-8 font-urbanist font-semibold  '>Truck</p>
                                </div>
                                <div className='relative overflow-hidden rounded-3xl'>
                                    <Image src={gallery_6} alt='gallery_6' className='hover:scale-105 duration-200 w-full sm:w-[80%] mx-auto lg:w-full' quality={100} />
                                    <p className='absolute bottom-3 lg:bottom-5 lg:text-xl uppercase left-10 lg:left-8 font-urbanist font-semibold  '>Truck</p>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

            </div>

        </div>

    )
}

export default Gallery