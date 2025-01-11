"use client"
import React, { use, useState } from 'react'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { getdata } from '@/api/req'
import { useEffect } from 'react'
import Loading from '@/components/Loading'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PlayCircle } from "lucide-react"

const ProductPage = ({ params }) => {
  const resolvedParams = use(params);
  const { category, subcategory, manufacturer, product } = resolvedParams;
  const { data, error } = useQuery({
    queryKey: ["productData", category, subcategory, manufacturer, product],
    queryFn: () => getdata(`/category/${category}/${subcategory}/${manufacturer}/${product}`),
    enabled: !!category && !!subcategory && !!manufacturer && !!product
  });

  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (data?.data?.product?.image?.length > 0) {
      setSelectedImage(data.data.product.image[0]);
    }
  }, [data]);

  // Only render the image section if we have valid image data
  const renderProductImage = () => {
    if (!selectedImage) return null;

    return (
      <Image
        src={selectedImage}
        alt="Product Image"
        className="mx-auto object-contain aspect-square"
        width={400}
        height={400}
        priority={true}
      />
    );
  }

  // Only render thumbnail if the image source is valid
  const renderThumbnail = (image, index) => {
    if (!image) return null;

    return (
      <div
        key={index}
        className={`border rounded-lg p-2 w-24 h-24 cursor-pointer transition-all
          ${selectedImage === image ? 'border-blue-500 border-2' : 'border-gray-200'}
        `}
        onClick={() => setSelectedImage(image)}
      >
        <Image
          src={image}
          alt={`Product view ${index + 1}`}
          className="w-full h-full object-cover"
          width={96}
          height={96}
          priority={true}
        />
      </div>
    );
  }

  const renderSpecifications = () => {
    if (!data?.data?.product?.specifications) return null;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = data.data.product.specifications;
    const tables = tempDiv.getElementsByTagName('table');
    
    // Add classes based on row count
    Array.from(tables).forEach(table => {
      const rowCount = table.getElementsByTagName('tr').length;
      if (rowCount > 2) {
        table.classList.add('table-with-borders');
      } else if (rowCount === 1) {
        table.classList.add('table-single-row');
      } else {
        table.classList.add('table-no-borders');
      }
    });

    return (
      <div className='mt-5'>
        <div className='[&>h1]:text-3xl 
                      [&>h1]:font-semibold 
                      [&>h1]:mb-4
                      [&>h2]:text-2xl
                      [&>h2]:font-semibold
                      [&>h2]:mb-3
                      [&>h3]:text-xl 
                      [&>h3]:font-semibold 
                      [&>h3]:mb-2
                      [&>h4]:text-lg
                      [&>h4]:font-medium
                      [&>h4]:mb-2
                      [&>h5]:text-base
                      [&>h5]:font-medium
                      [&>h5]:mb-2
                      [&>h6]:text-sm
                      [&>h6]:font-medium
                      [&>h6]:mb-2
                      [&>p]:text-[#444444] 
                      [&>p]:text-sm 
                      [&>p]:pt-2
                      [&>p]:pb-2
                      font-urbanist
                      [&>table]:my-4
                      [&>table]:w-full
                      [&>table]:border-collapse
                      [&>.table-with-borders]:border
                      [&>.table-with-borders]:border-ind_blue
                      [&>.table-with-borders>thead>tr>th]:border
                      [&>.table-with-borders>thead>tr>th]:border-ind_blue
                      [&>.table-with-borders>tbody>tr>td]:border
                      [&>.table-with-borders>tbody>tr>td]:border-ind_blue
                      [&>.table-single-row>tbody>tr]:bg-[#F1F1F1]
                      [&>table>thead>tr>th]:p-3
                      [&>table>tbody>tr>td]:p-3
                      [&>table>tbody>tr:nth-child(even)]:bg-white
                      [&>table>tbody>tr:nth-child(odd)]:bg-[#F1F1F1]
                      [&>table>tbody>tr:hover]:bg-gray-100
                      [&>table>tbody>tr]:transition-all
                      [&>table>tbody>tr]:duration-300' 
              dangerouslySetInnerHTML={{ __html: tempDiv.innerHTML }} />
      </div>
    );
  };

  const renderTechnicalData = () => {
    if (!data?.data?.product?.technicalData) return null;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = data.data.product.technicalData;
    const tables = tempDiv.getElementsByTagName('table');
    
    // Add classes based on row count
    Array.from(tables).forEach(table => {
      const rowCount = table.getElementsByTagName('tr').length;
      if (rowCount > 2) {
        table.classList.add('table-with-borders');
      } else if (rowCount === 1) {
        table.classList.add('table-single-row');
      } else {
        table.classList.add('table-no-borders');
      }
    });

    return (
      <div className='mt-5'>
        <div className='[&>h1]:text-3xl 
                      [&>h1]:font-semibold 
                      [&>h1]:mb-4
                      [&>h2]:text-2xl
                      [&>h2]:font-semibold
                      [&>h2]:mb-3
                      [&>h3]:text-xl 
                      [&>h3]:font-semibold 
                      [&>h3]:mb-2
                      [&>h4]:text-lg
                      [&>h4]:font-medium
                      [&>h4]:mb-2
                      [&>h5]:text-base
                      [&>h5]:font-medium
                      [&>h5]:mb-2
                      [&>h6]:text-sm
                      [&>h6]:font-medium
                      [&>h6]:mb-2
                      [&>p]:text-[#444444] 
                      [&>p]:text-sm 
                      [&>p]:pt-2
                      [&>p]:pb-2
                      font-urbanist
                      [&>table]:my-4
                      [&>table]:w-full
                      [&>table]:border-collapse
                      [&>.table-with-borders]:border
                      [&>.table-with-borders]:border-ind_blue
                      [&>.table-with-borders>thead>tr>th]:border
                      [&>.table-with-borders>thead>tr>th]:border-ind_blue
                      [&>.table-with-borders>tbody>tr>td]:border
                      [&>.table-with-borders>tbody>tr>td]:border-ind_blue
                      [&>.table-single-row>tbody>tr]:bg-[#FAFAFA]
                      [&>table>thead>tr>th]:p-3
                      [&>table>tbody>tr>td]:p-3
                      [&>table>tbody>tr:nth-child(even)]:bg-white
                      [&>table>tbody>tr:nth-child(odd)]:bg-[#FAFAFA]
                      [&>table>tbody>tr:hover]:bg-gray-100
                      [&>table>tbody>tr]:transition-all
                      [&>table>tbody>tr]:duration-300' 
              dangerouslySetInnerHTML={{ __html: tempDiv.innerHTML }} />
      </div>
    );
  };

  const renderVideoSection = () => {
    if (!data?.data?.product?.videoLink) return null;

    return (
      <div className='mt-5'>
        <h2 className='text-3xl  mb-3 font-urbanist font-semibold'>Video</h2>
        <Dialog>
          <DialogTrigger asChild>
            <div className='relative w-full h-[300px] bg-gray-100 rounded-lg cursor-pointer group overflow-hidden'>
              {/* Thumbnail */}
              <div className='w-full h-full bg-cover bg-center'
                   style={{
                     backgroundImage: `url(https://img.youtube.com/vi/${getYouTubeVideoId(data.data.product.videoLink)}/maxresdefault.jpg)`
                   }}>
                {/* Play button overlay */}
                <div className='absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all duration-300'>
                  <PlayCircle className='w-16 h-16 text-white opacity-90 group-hover:scale-110 transition-transform duration-300' />
                </div>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] h-[600px] p-0">
            <DialogTitle className="hidden"/>
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${getYouTubeVideoId(data.data.product.videoLink)}?autoplay=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  // Helper function to extract YouTube video ID
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (!data?.data?.product?.image) {
    return <div><Loading /></div>;
  }






  return (
    <div className="container mx-auto px-4 lg:px-20 py-8 lg:py-20">
      {/* Breadcrumb Navigation */}
      <div className="text-sm mb-6 ca">
        <span className="text-gray-500">{category} &gt; {subcategory} &gt; {manufacturer} &gt; {product}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images Section */}
        <div className="space-y-4">
          <div className="rounded-lg p-4">
            {renderProductImage()}
          </div>
          <div className="flex gap-4">
            {data?.data?.product?.image?.map((image, index) =>
              image ? renderThumbnail(image, index) : null
            )}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="space-y-6">
          <div>
            <p className="text-gray-600">Part Number: {data?.data?.product?.partNumber}</p>
            <h1 className="text-3xl font-bold mt-2">{data?.data?.product?.name}</h1>
            <p className="text-lg mt-2">Model: {data?.data?.product?.model}</p>
          </div>

          <div className="text-gray-700">
            <p>
              {data?.data?.product?.description}
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
      <div className='mt-10'>
        <div className="flex gap-4"> 
          <div className='w-3/4 bg-[#FAFAFA] px-8 py-5 rounded-lg'>
            <div className='flex gap-4 justify-between'>
              <Button className='bg-ind_blue text-white min-w-[150px] hover:bg-ind_blue hover:text-white'>Specifications</Button>
              <Button className='bg-transparent border border-ind_blue text-ind_blue min-w-[150px] hover:bg-ind_blue hover:text-white'>Technical Data</Button>
              <Button className='bg-transparent border border-ind_blue text-ind_blue min-w-[150px] hover:bg-ind_blue hover:text-white'>Video</Button>
              <Button className='bg-transparent border border-ind_blue text-ind_blue min-w-[150px] hover:bg-ind_blue hover:text-white'>Related Products</Button>
              <Button className='bg-transparent border border-ind_blue text-ind_blue min-w-[150px] hover:bg-ind_blue hover:text-white'>Inquiry</Button>
            </div>
            {renderSpecifications()}
            {renderTechnicalData()}
            {renderVideoSection()}
          </div>

          <div className='w-1/4'>


          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage