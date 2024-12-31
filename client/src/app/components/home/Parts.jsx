"use client";
import parts_1 from "@/assets/home/parts_1.png";
import Image from "next/image";
import { Navigation, Pagination, Scrollbar, A11y,Autoplay } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import "swiper/css/autoplay";
const Parts = () => {
    return (
        <div>
            <div className="container mx-auto py-20">
                <h1 className="text-4xl font-urbanist text-center"><span className="font-bold ">HVAC</span> Parts</h1>
                <div className="mt-6">
                    <Swiper
                        // install Swiper modules
                        modules={[Navigation, Pagination, Scrollbar, A11y,Autoplay]}
                        spaceBetween={50}
                        slidesPerView={1}
                        pagination={{
                            clickable: true,

                        }}
                        autoplay
                    >
                        <SwiperSlide>
                            <div>
                                <Image src={parts_1} alt="HVAC PARTS" className="w-[65%] object-cover mx-auto" quality={100} />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div>
                                <Image src={parts_1} alt="HVAC PARTS" className="w-[65%] object-cover mx-auto" quality={100} />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div>
                                <Image src={parts_1} alt="HVAC PARTS" className="w-[65%] object-cover mx-auto" quality={100} />
                            </div>
                        </SwiperSlide>


                    </Swiper>

                </div>

            </div>
        </div>
    )
}

export default Parts