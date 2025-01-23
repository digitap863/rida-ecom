import React from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react';

const Navbutton = ({prev, next}) => {
    return (
        <div className="flex justify-center gap-4 mt-8">
            <button className={`${prev}  w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-ind_blue flex items-center justify-center group hover:bg-ind_blue transition-colors duration-300 text-ind_blue hover:text-white ${prev ? 'block' : 'hidden'}`}>
<ArrowLeft/>
            </button>
            <button className={`${next}  w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-ind_blue flex items-center justify-center group hover:bg-ind_blue transition-colors duration-300 text-ind_blue hover:text-white ${next ? 'block' : 'hidden'}`}>
       <ArrowRight/>
            </button>
        </div>
    )
}

export default Navbutton