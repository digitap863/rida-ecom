import React from "react";
import Image from "next/image";
import unit_1 from "@/assets/home/unit_1.png";
import { Button } from "@/components/ui/button";
const TopSelling = () => {
    return (
        <div>
            <div className="p-20">
                <div className="flex items-center gap-2">
                    <h1 className="flex  font-urbanist  font-bold text-4xl">
                        Top Selling<span className="pl-3 font-normal"> Products </span>
                    </h1>
                    <div className="h-1 w-4 rounded-lg bg-[#FEC500]"></div>
                </div>
                <div className="pt-10 flex gap-6 flex-wrap">
                    {
                        [1, 2, 3, 4].map((item, i) => (
                            <div className="w-64 transition-all duration-300 hover:-translate-y-2" key={i}>
                                <div className="w-full shadow-md hover:shadow-xl transition-shadow duration-300 drop-shadow-md p-5 bg-white rounded-lg">
                                    <Image src={unit_1} alt="" className="transition-transform duration-300 hover:scale-105" />
                                </div>
                                <div className="font-poppins flex flex-col items-center justify-center p-3 gap-y-1">
                                    <h3 className="font-medium text-xl">Trailer Unit</h3>
                                    <p className="text-ind_blue font-medium">Bus HVAC Part</p>
                                    <Button className="bg-ind_blue px-10 font-urbanist mt-3 transition-all duration-300 hover:bg-ind_blue/90 hover:scale-105">View Product</Button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default TopSelling;
