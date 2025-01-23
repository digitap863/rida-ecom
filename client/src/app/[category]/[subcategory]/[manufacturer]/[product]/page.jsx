"use client"
import React, { use, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getdata } from '@/api/req';
import Loading from '@/components/Loading';
import { ProductImages } from './ProductImages';
import { ProductDetails } from './ProductDetails';
import { ProductContent } from './ProductContent';
import AccordionItem from '@/app/components/common/AccordionItem';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';

const ProductPage = ({ params }) => {
  const resolvedParams = use(params);
  const { category, subcategory, manufacturer, product } = resolvedParams;
  const router = useRouter();
  
  const { data, error } = useQuery({
    queryKey: ["productData", category, subcategory, manufacturer, product],
    queryFn: () => getdata(`/category/${category}/${subcategory}/${manufacturer}/${product}`),
    enabled: !!category && !!subcategory && !!manufacturer && !!product
  });

  const { data: sidebarData } = useQuery({
    queryKey: ["sidebarData", category, subcategory],
    queryFn: () => getdata(`/category/${category}/${subcategory}/${manufacturer}/${product}/sidebar`),
    enabled: !!category && !!subcategory
  });

  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (data?.data?.product?.image?.length > 0) {
      setSelectedImage(data.data.product.image[0]);
    }
  }, [data]);

  const handleManufacturerSelect = (manufacturerId) => {
  
    const selectedAccordion = sidebarData?.data?.find(accordion => 
      accordion.items.some(item => item.id === manufacturerId)
    );

    const selectedManufacturer = selectedAccordion?.items.find(item => 
      item.id === manufacturerId
    );

    if (selectedAccordion && selectedManufacturer) {
      router.push(`/${category}/${selectedAccordion.subcategorySlug}?manufacturer=${selectedManufacturer.slug}`);
    }
  };

  if (!data?.data?.product?.image) {
    return <div><Loading /></div>;
  }

  return (
    <div className="container mx-auto px-4 lg:px-20 py-8 lg:py-20 font-urbanist">
      <div className="text-sm mb-6">
        <span className="text-gray-500">{category} &gt; {subcategory} &gt; {manufacturer} &gt; {product}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProductImages 
          images={data.data.product.image}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
        <ProductDetails product={data.data.product} />
      </div>

      <div className='mt-10'>
        <div className="flex flex-col-reverse md:flex-row gap-4">
          <ProductContent 
            product={data?.data?.product}
            relatedProducts={data?.data?.relatedProducts}
          />
          <div className='md:w-1/4'>
          <Card className="p-4 rounded  md:min-h-screen">
            {sidebarData?.data?.map((accordion, index) => (
              <AccordionItem
                key={accordion.id}
                title={accordion.title}
                items={accordion.items}
                isFirst={accordion.isFirst}
                isEmpty={accordion.isEmpty}
                subcategoryId={accordion.id}
                onManufacturerSelect={(manufacturerId) => {
                  handleManufacturerSelect(manufacturerId);
                }}
              />
            ))}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;