"use client";
import Image from "next/image";
import React, { use, useEffect, useState } from "react";
import bock from "@/assets/category/bock.png";
import prod from "@/assets/category/prod.png";
import { Card } from "@/components/ui/card";
import AccordionItem from "@/app/components/common/AccordionItem";

import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getdata } from "@/api/req";

const Category = ({ params }) => {
  const resolvedParams = use(params);
  const { category } = resolvedParams;
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const { data, refetch } = useQuery({
    queryKey: ["categorydetails", category],
    queryFn: () => getdata(`/category/${category}`),
    enabled: !!category
  });

  useEffect(() => {
    if (category) {
      refetch();
    }
  }, [category, refetch]);

  useEffect(() => {
    if (data?.data) {
      setSelectedSubcategory(data.data.defaultSubcategory);
      setSelectedManufacturer(data.data.defaultManufacturer);
      setFilteredProducts(data.data.products);
    }
  }, [data]);

  // Transform API data for accordion
  const accordionData = data?.data?.subcategories?.map(subcat => ({
    id: subcat._id,
    title: subcat.name,
    items: data.data.manufacturers
      .filter(mfr => mfr.subcategory === subcat._id)
      .map(mfr => ({
        id: mfr._id,
        name: mfr.name,
        image: mfr.image,
        description: mfr.description
      })),
    isFirst: subcat._id === data?.data?.defaultSubcategory?._id
  })) || [];

  const handleManufacturerSelect = (manufacturerId) => {
    const manufacturer = data.data.manufacturers.find(m => m._id === manufacturerId);
    setSelectedManufacturer(manufacturer);
    
    // Filter products for selected manufacturer
    const manufacturerProducts = data.data.products.filter(
      p => p.manufacturer._id === manufacturerId
    );
    setFilteredProducts(manufacturerProducts);
  };

  const handleSubcategorySelect = (subcategoryId) => {
    const subcategory = data.data.subcategories.find(s => s._id === subcategoryId);
    setSelectedSubcategory(subcategory);
    
    // Find first manufacturer in this subcategory
    const firstManufacturer = data.data.manufacturers.find(
      m => m.subcategory === subcategoryId
    );
    if (firstManufacturer) {
      handleManufacturerSelect(firstManufacturer._id);
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto">
      <div className="p-20">
        <div className="font-urbanist text-[#A2a2a2] font-medium">
          {data?.data?.category?.name} {" > "}{" "}
          <span className="text-[#2369AC]">
            {selectedSubcategory?.name}
          </span>
        </div>
        <div className="flex gap-10 mt-4">
          <div className="w-1/4">
            <Card className="p-4 rounded min-h-screen">
              {accordionData.map((accordion, index) => (
                <AccordionItem
                  key={index}
                  title={accordion.title}
                  items={accordion.items}
                  isFirst={accordion.isFirst}
                  onSubcategorySelect={() => handleSubcategorySelect(accordion.id)}
                  onManufacturerSelect={handleManufacturerSelect}
                />
              ))}
            </Card>
          </div>
          <div className="w-3/4 flex flex-col">
            <div className="flex gap-10 justify-between">
              <div className="w-1/2 font-urbanist">
                <h1 className="text-ind_blue text-4xl font-bold uppercase">
                  {selectedManufacturer?.name}
                </h1>
                <p className="font-medium">
                  {selectedManufacturer?.description || 
                    `Provide Original / Replacement ${selectedManufacturer?.name} products
                    for bus / van factory, after-sale market of bus repair center`}
                </p>
              </div>
              <div className="w-1/2">
                <Image 
                  src={selectedManufacturer?.image || bock} 
                  alt={selectedManufacturer?.name || ""}
                  width={400}
                  height={300}
                  className="object-contain"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-10">
              {filteredProducts.map((product, index) => (
                <Card key={index} className="aspect-[1/1.2]">
                  <div className="p-3">
                    <Image 
                      src={product.image} 
                      alt={product.partNumber} 
                      className="mx-auto object-contain" 
                      width={200} 
                      height={200} 
                    />
                  </div>
                  <div className="p-5 font-urbanist space-y-3">
                    <h3 className="font-bold text-lg">{product.partNumber}</h3>
                    <p className="text-[#5E5E5E] font-medium">
                      {Array.isArray(product.oe) ? product.oe.join(', ') : product.oe}
                    </p>
                    <Button className="w-full border text-ind_blue hover:bg-ind_blue hover:text-white border-ind_blue bg-transparent">
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
