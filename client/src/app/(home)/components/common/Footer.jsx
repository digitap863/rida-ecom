import React from 'react'
import appstore from "@/assets/home/appstore.png";
import playstore from "@/assets/home/playstore.png";
import Image from 'next/image';
import { Facebook, Instagram, X, Youtube } from 'lucide-react';
import Newsletter from '../home/Newsletter';
const Footer = () => {
    return (
        <>
            <Newsletter />
            <footer>
                <div className='container mx-auto p-20'>
                    <div className='grid grid-cols-4'>
                        <div className='flex flex-col gap-2'>
                            <div className='font-helvetica uppercase text-[#808D9E] text-lg'>Shopping Services</div>
                            <ul className='font-medium text-[#191A26] text-lg space-y-2'>
                                <li>Catalog</li>
                                <li>Schedule Consulataion</li>
                                <li>Stores</li>
                                <li>Trade program</li>
                            </ul>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <div className='font-helvetica uppercase text-[#808D9E] text-lg'>About</div>
                            <ul className='font-medium text-[#191A26] text-lg space-y-2'>
                                <li>Reviews</li>
                                <li>Financing</li>
                                <li>Patents</li>
                                <li>Our Blog</li>
                            </ul>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <div className='font-helvetica uppercase text-[#808D9E] text-lg'>Resources</div>
                            <ul className='font-medium text-[#191A26] text-lg space-y-2'>
                                <li>Look Up Order Status</li>
                                <li>Assembly Intrustions</li>
                                <li>Returns</li>
                                <li>Shipping & Delivery</li>
                                <li>FAQ</li>
                            </ul>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <div className='font-helvetica uppercase text-[#808D9E] text-lg'>Contact Us</div>
                            <ul className='font-medium text-[#191A26] text-lg space-y-2'>
                                <li>Email:Support@rida.com</li>
                                <div>
                                    <h1>Hours</h1>
                                    <ul>
                                        <li>Monday to Friday - 10am to 8pm</li>
                                        <li>Saturday to Sunday - 10am to 2pm</li>
                                        <a href="tel:+62831702">+62 83175 02</a>
                                    </ul>
                                </div>
                            </ul>
                            <div className='pt-10'>
                                <h1 className='font-helvetica font-medium text-[#191A26] text-lg'>Download  App</h1>
                                <div className='flex gap-2 mt-2'>

                                    <Image src={appstore} alt='appstore' />
                                    <Image src={playstore} alt='playstore' />
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className='h-0.5 w-full bg-[#D2D7E3] mt-10'>
                        <div className='flex gap-5 py-4'>
                            <Instagram />
                            <Facebook />
                            <Youtube />
                            <X />
                        </div>

                    </div>
                </div>
            </footer>
        </>

    )
}

export default Footer
