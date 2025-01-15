"use client"
import React from 'react'
import CategoryCard from './CategoryCard'
import { getdata } from '@/api/req';
import { useQuery } from '@tanstack/react-query';


const ExploreProducts = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['category'],
        queryFn: () => getdata('/category'),
    })

    


    return (
        <div className='max-w-screen-2xl mx-auto p-20'>
            <div className='flex items-center gap-2'>
                <h1 className='flex  font-urbanist  font-bold text-4xl'>Explore products <span className='pl-3 font-normal'> by category </span></h1>
                <div className='h-1 w-4 rounded-lg bg-[#FEC500]'></div>
            </div>
            <div className=' flex gap-10  mt-10 '>
                {
                    data?.categories?.map((item,index) => (
                        <CategoryCard key={index} item={item} />
                    ))
                }
            </div>
        </div>
    )
}

export default ExploreProducts