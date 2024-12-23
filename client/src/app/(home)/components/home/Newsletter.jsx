import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'

const Newsletter = () => {
    return (
        <div className='flex bg-ind_blue'>
            <div className='container mx-auto p-20 text-white flex justify-between items-center'>
            <p className='font-helvetica text-4xl '>Subscribe to our <i>newsletter</i></p>
            <div className='flex gap-4'>
                <Input type='email' placeholder='Sign up for enthralling couch reads' className="bg-white h-12 pl-6  w-96 rounded-md py-4 text-black"  />
                <Button className="bg-[#FEC500] text-[#191A26] uppercase py-6 rounded-md font-helvetica font-medium">Subscribe</Button>
            </div>
            </div>
        </div>
    )
}

export default Newsletter
