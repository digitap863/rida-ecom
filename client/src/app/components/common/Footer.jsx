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
            <footer className="bg-white">
                <div className='container mx-auto px-4 py-8 md:p-20'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6'>
                        {/* Shopping Services */}
                        <div className='flex flex-col gap-2'>
                            <div className='font-helvetica uppercase text-[#808D9E] text-base md:text-lg'>
                                Shopping Services
                            </div>
                            <ul className='font-medium text-[#191A26] text-base md:text-lg space-y-2'>
                                <li className='hover:text-ind_blue cursor-pointer transition-colors'>Catalog</li>
                                <li className='hover:text-ind_blue cursor-pointer transition-colors'>Schedule Consultation</li>
                                <li className='hover:text-ind_blue cursor-pointer transition-colors'>Stores</li>
                                <li className='hover:text-ind_blue cursor-pointer transition-colors'>Trade program</li>
                            </ul>
                        </div>

                        {/* About */}
                        <div className='flex flex-col gap-2'>
                            <div className='font-helvetica uppercase text-[#808D9E] text-base md:text-lg'>
                                About
                            </div>
                            <ul className='font-medium text-[#191A26] text-base md:text-lg space-y-2'>
                                <li className='hover:text-ind_blue cursor-pointer transition-colors'>Reviews</li>
                                <li className='hover:text-ind_blue cursor-pointer transition-colors'>Financing</li>
                                <li className='hover:text-ind_blue cursor-pointer transition-colors'>Patents</li>
                                <li className='hover:text-ind_blue cursor-pointer transition-colors'>Our Blog</li>
                            </ul>
                        </div>

                        {/* Resources */}
                        <div className='flex flex-col gap-2'>
                            <div className='font-helvetica uppercase text-[#808D9E] text-base md:text-lg'>
                                Resources
                            </div>
                            <ul className='font-medium text-[#191A26] text-base md:text-lg space-y-2'>
                                <li className='hover:text-ind_blue cursor-pointer transition-colors'>Look Up Order Status</li>
                                <li className='hover:text-ind_blue cursor-pointer transition-colors'>Assembly Instructions</li>
                                <li className='hover:text-ind_blue cursor-pointer transition-colors'>Returns</li>
                                <li className='hover:text-ind_blue cursor-pointer transition-colors'>Shipping & Delivery</li>
                                <li className='hover:text-ind_blue cursor-pointer transition-colors'>FAQ</li>
                            </ul>
                        </div>

                        {/* Contact Us */}
                        <div className='flex flex-col gap-2'>
                            <div className='font-helvetica uppercase text-[#808D9E] text-base md:text-lg'>
                                Contact Us
                            </div>
                            <ul className='font-medium text-[#191A26] text-base md:text-lg space-y-2'>
                                <li className='hover:text-ind_blue cursor-pointer transition-colors'>
                                    Email: Support@rida.com
                                </li>
                                <div className='space-y-1'>
                                    <h1 className='font-medium'>Hours</h1>
                                    <ul className='space-y-1 text-sm md:text-base'>
                                        <li>Monday to Friday - 10am to 8pm</li>
                                        <li>Saturday to Sunday - 10am to 2pm</li>
                                        <a href="tel:+62831702" className='text-ind_blue hover:underline'>
                                            +62 83175 02
                                        </a>
                                    </ul>
                                </div>
                            </ul>
                            
                            {/* Download App Section */}
                            <div className='pt-6 md:pt-10'>
                                <h1 className='font-helvetica font-medium text-[#191A26] text-base md:text-lg mb-2'>
                                    Download App
                                </h1>
                                <div className='flex flex-wrap gap-2'>
                                    <Image 
                                        src={appstore} 
                                        alt='appstore'
                                        className='h-10 w-auto object-contain' 
                                    />
                                    <Image 
                                        src={playstore} 
                                        alt='playstore'
                                        className='h-10 w-auto object-contain' 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Media Section */}
                    <div className='mt-8 md:mt-10 border-t border-[#D2D7E3]'>
                        <div className='flex gap-4 md:gap-5 py-4 justify-center md:justify-start'>
                            <Instagram className='w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:text-ind_blue transition-colors' />
                            <Facebook className='w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:text-ind_blue transition-colors' />
                            <Youtube className='w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:text-ind_blue transition-colors' />
                            <X className='w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:text-ind_blue transition-colors' />
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer
