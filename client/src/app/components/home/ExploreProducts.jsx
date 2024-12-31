import React from 'react'
import CategoryCard from './CategoryCard'
import Category_1 from "@/assets/home/category_1.png";
import Category_2 from "@/assets/home/category_2.png";
import Category_3 from "@/assets/home/category_3.png";
import Category_4 from "@/assets/home/category_4.png";

const category = [
    {
        id: 1,
        name: 'BUS HVAC PARTS',
        image: Category_1
    },
    {
        id: 2,
        name: "TRANSPORT REFRIGERATION PARTS",
        image: Category_2
    },
    {
        id: 3,
        name: 'TRUCK HVAC PARTS',
        image: Category_3
    },
    {
        id: 4,
        name: 'VEHICLE AC',
        image: Category_4
    }
]

const ExploreProducts = () => {
    return (
        <div className='max-w-screen-2xl mx-auto p-20'>
            <div className='flex items-center gap-2'>
                <h1 className='flex  font-urbanist  font-bold text-4xl'>Explore products <span className='pl-3 font-normal'> by category </span></h1>
                <div className='h-1 w-4 rounded-lg bg-[#FEC500]'></div>
            </div>
            <div className=' flex gap-10  mt-10 '>
                {
                    category.map((item) => (
                        <CategoryCard key={item.id} item={item} />
                    ))
                }
            </div>
        </div>
    )
}

export default ExploreProducts