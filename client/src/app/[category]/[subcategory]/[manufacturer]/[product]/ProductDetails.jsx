import { MessageCircleMore, MessageCircleQuestion } from 'lucide-react'
import React from 'react'

export const ProductDetails = ({ product }) => {
  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
      <div className='font-urbanist'>
        <p className="text-gray-600 text-sm sm:text-base">Part Number: {product?.partNumber}</p>
        <h1 className="text-2xl sm:text-3xl font-bold mt-2">{product?.name}</h1>
        <p className="text-base sm:text-lg mt-2">Model: {product?.model}</p>
      </div>

      <div className="text-gray-700 font-urbanist text-sm sm:text-base">
        <p>{product?.description}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 font-urbanist">
        <button className="bg-ind_blue text-white px-4 sm:px-6 py-2 rounded-lg flex items-center justify-center gap-2">
          Send Inquiry <MessageCircleQuestion  className='w-4 h-4 mt-1'/>
        </button>
        <button className="border border-ind_blue text-ind_blue px-4 sm:px-6 py-2 rounded-lg flex items-center justify-center gap-2">
          Chat Now <MessageCircleMore className='w-4 h-4'/>
        </button>
      </div>
    </div>
  )
}