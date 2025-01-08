"use client"
import React, { useState } from 'react'
import img from "@/assets/category/prod.png"
import img2 from "@/assets/category/prod2.png"
import Image from 'next/image'

const ProductPage = () => {
  const [selectedImage, setSelectedImage] = useState(img)
  
  const images = [img2, img]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <div className="text-sm mb-6">
        <span className="text-gray-500">Bus HVAC Parts &gt; Compressors &gt; Bock FKX40 390K</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images Section */}
        <div className="space-y-4">
          <div className=" rounded-lg p-4">
            <Image 
              src={selectedImage} 
              alt="Bock FKX40 390K Compressor"
              className="mx-auto object-contain aspect-square"
              width={400}
              height={400}
            />
          </div>
          <div className="flex gap-4">
            {images.map((image, index) => (
              <div 
                key={index}
                className={`border rounded-lg p-2 w-24 h-24 cursor-pointer transition-all
                  ${selectedImage === image ? 'border-blue-500 border-2' : 'border-gray-200'}
                `}
                onClick={() => setSelectedImage(image)}
              >
                <Image 
                  src={image} 
                  alt={`Compressor view ${index + 1}`}
                  className="w-full h-full object-cover"
                  width={96}
                  height={96}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="space-y-6">
          <div>
            <p className="text-gray-600">Part Number: 1001-2001</p>
            <h1 className="text-3xl font-bold mt-2">Bock FKX40 390K Compressor</h1>
            <p className="text-lg mt-2">Model: R134a</p>
          </div>

          <div className="text-gray-700">
            <p>
              Compressor is the heart of the bus air conditioner system. Bock compressor is 
              specialized applied for bus air conditioner system. It is main responsible for 
              cooling when summer coming bring lots of hot days. Make your bus air 
              comfortable and suitable for every day. Compact dimensions, low weight, the 
              wide capacity spectrum together with the high operating safety will make a 
              decision quick for your number 1 choice on bus compressor.
            </p>
          </div>

          <div className="flex gap-4">
            <button className="bg-ind_blue text-white px-6 py-2 rounded-lg flex items-center gap-2">
              Send Inquiry
            </button>
            <button className="border border-ind_blue text-ind_blue px-6 py-2 rounded-lg flex items-center gap-2">
              Chat Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage