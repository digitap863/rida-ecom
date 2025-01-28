import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'

const Newsletter = () => {
    return (
        <div className='flex bg-ind_blue'>
            <div className='container mx-auto px-4 py-10 md:p-20 text-white flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-0'>
                <p className='font-urbanist font-semibold text-2xl md:text-3xl lg:text-4xl text-center lg:text-left mb-4 lg:mb-0'>
                    Subscribe to our <i>newsletter</i>
                </p>
                <div className='flex flex-col sm:flex-row gap-4 w-full lg:w-auto'>
                    <Input 
                        type='email' 
                        placeholder='Enter your email ' 
                        className="bg-white h-12 pl-6 w-full sm:w-96 rounded-md py-4 text-black"  
                    />
                    <Button className="bg-[#FEC500] text-[#191A26] hover:bg-ind_blue hover:text-white uppercase py-6 rounded-md font-helvetica font-medium w-full sm:w-auto">
                        Subscribe
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Newsletter
