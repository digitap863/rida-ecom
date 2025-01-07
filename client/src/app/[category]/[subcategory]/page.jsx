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
import { useRouter, usePathname } from "next/navigation";

const Subcategory = ({ params }) => {
  const resolvedParams = use(params);
  const { category, subcategory } = resolvedParams;
  
  const router = useRouter();
  const pathname = usePathname();
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sidebarData, setSidebarData] = useState(null);

  // Query for initial category and subcategory data
  const { data: categoryData } = useQuery({
    queryKey: ["categoryData", category, subcategory],
    queryFn: () => getdata(`/category/${category}/${subcategory}`),
    enabled: !!category && !!subcategory
  });

  // Set up initial data
  useEffect(() => {
    if (categoryData?.data) {
      const { currentSubcategory, defaultManufacturer, manufacturers, subcategories, products } = categoryData.data;
      
      // Transform data for accordion, handling empty subcategories
      const accordionData = subcategories.map(subcat => {
        const subcatManufacturers = manufacturers
          .filter(mfr => mfr.subcategory.toString() === subcat._id.toString());

        return {
          id: subcat._id,
          title: subcat.name,
          subcategorySlug: subcat.subcategory,
          items: subcatManufacturers.length > 0 
            ? subcatManufacturers.map(mfr => ({
                id: mfr._id,
                name: mfr.name,
                image: mfr.image,
                description: mfr.description
              }))
            : [{ // Default item for empty subcategories
                id: 'no-manufacturer',
                name: 'No Manufacturers Available',
                // image: bock, // Default image
                description: 'No manufacturers are currently available for this subcategory.'
              }],
          isFirst: subcat._id === currentSubcategory._id,
          isEmpty: subcatManufacturers.length === 0
        };
      });

      setSidebarData(accordionData);
      setSelectedSubcategory(currentSubcategory);
      setSelectedManufacturer(defaultManufacturer || null);
      setFilteredProducts(products || []);
    }
  }, [categoryData]);

  const handleManufacturerSelect = async (manufacturerId) => {
    // Skip API call for empty subcategories
    if (manufacturerId === 'no-manufacturer') {
      setSelectedManufacturer({
        name: 'No Manufacturers Available',
        description: 'No manufacturers are currently available for this subcategory.',
        // image: bock
      });
      setFilteredProducts([]);
      return;
    }

    try {
      const response = await getdata(
        `/category/${category}/${subcategory}/manufacturer/${manufacturerId}`
      );
      
      if (response.success) {
        const { products, manufacturer } = response.data;
        setSelectedManufacturer(manufacturer);
        setFilteredProducts(products);
      }
    } catch (error) {
      console.error("Error fetching manufacturer products:", error);
    }
  };

  const handleSubcategorySelect = (subcategoryId) => {
    const subcategory = sidebarData?.find(item => item.id === subcategoryId);
    if (subcategory) {
      router.push(`/${category}/${subcategory.subcategorySlug}`);
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto">
      <div className="p-20">
        <div className="font-urbanist text-[#A2a2a2] font-medium capitalize">
          {categoryData?.data?.category?.name || category.replace(/-/g, " ")} {" > "}{" "}
          <span className="text-[#2369AC]">
            {selectedSubcategory?.name || subcategory.replace(/-/g, " ")}
          </span>
        </div>
        <div className="flex gap-10 mt-4">
          <div className="w-1/4">
            <Card className="p-4 rounded min-h-screen">
              {sidebarData?.map((accordion, index) => (
                <AccordionItem
                  key={accordion.id}
                  title={accordion.title}
                  items={accordion.items}
                  isFirst={accordion.isFirst}
                  isEmpty={accordion.isEmpty}
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
                  {selectedManufacturer?.name || 'No Manufacturer'}
                </h1>
                <p className="font-medium">
                  {selectedManufacturer?.description || 
                    ''}
                </p>
              </div>
              <div className="w-1/2">
              {
                selectedManufacturer?.image && (
                <Image 
                src={selectedManufacturer?.image} 
                  alt={selectedManufacturer?.name}
                  width={400}
                  height={300}
                  className="object-contain"
                />
                )
              }
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-10">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
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
                      <h3 className="font-bold text-lg">{product.name}</h3>
                      <p className="text-[#5E5E5E] font-medium">
                        {product.partNumber}
                      </p>
                      <Button className="w-full border text-ind_blue hover:bg-ind_blue hover:text-white border-ind_blue bg-transparent">
                        View Details
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 text-center py-10 text-gray-500">
                  No products available for this selection.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subcategory;