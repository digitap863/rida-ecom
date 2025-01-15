import React from 'react'

export const ProductDetails = ({ product }) => {
  return (
    <div className="space-y-6">
      <div className='font-urbanist'>
        <p className="text-gray-600">Part Number: {product?.partNumber}</p>
        <h1 className="text-3xl font-bold mt-2">{product?.name}</h1>
        <p className="text-lg mt-2">Model: {product?.model}</p>
      </div>

      <div className="text-gray-700 font-urbanist">
        <p>{product?.description}</p>
      </div>

      <div className="flex gap-4 font-urbanist">
        <button className="bg-ind_blue text-white px-6 py-2 rounded-lg flex items-center gap-2">
          Send Inquiry
        </button>
        <button className="border border-ind_blue text-ind_blue px-6 py-2 rounded-lg flex items-center gap-2">
          Chat Now
        </button>
      </div>
    </div>
  )
}