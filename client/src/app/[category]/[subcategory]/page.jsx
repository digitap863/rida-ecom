"use client";
import Image from "next/image";
import React, { use, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import AccordionItem from "@/app/components/common/AccordionItem";
import { useQuery } from "@tanstack/react-query";
import { getdata } from "@/api/req";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";


const Subcategory = ({ params }) => {
  const resolvedParams = use(params);
  const { category, subcategory } = resolvedParams;
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const manufacturerSlug = searchParams.get('manufacturer');
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

  // Handle manufacturer selection
  const handleManufacturerSelect = async (manufacturerId) => {
    if (manufacturerId === 'no-manufacturer') {
      setSelectedManufacturer({
        name: 'No Manufacturers Available',
        description: 'No manufacturers are currently available for this subcategory.'
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
        setFilteredProducts(products || []); // Ensure products is always an array
      }
    } catch (error) {
      console.error("Error fetching manufacturer products:", error);
      setFilteredProducts([]); // Reset products on error
    }
  };

  // Initial data setup
  useEffect(() => {
    if (categoryData?.data) {
      const { currentSubcategory, manufacturers, subcategories, products } = categoryData.data;
      
      // Transform data for accordion
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
            : [{ 
                id: 'no-manufacturer',
                name: 'No Manufacturers Available',
                description: 'No manufacturers are currently available for this subcategory.'
              }],
          isFirst: subcat._id === currentSubcategory._id,
          isEmpty: subcatManufacturers.length === 0
        };
      });

      setSidebarData(accordionData);
      setSelectedSubcategory(currentSubcategory);

      // If manufacturer slug is in URL, find and select that manufacturer
      if (manufacturerSlug && manufacturers.length > 0) {
        const matchingManufacturer = manufacturers.find(m => m.slug === manufacturerSlug);
        if (matchingManufacturer) {
          handleManufacturerSelect(matchingManufacturer._id);
        }
      } else {
        // Default behavior
        const defaultManufacturer = manufacturers[0];
        setSelectedManufacturer(defaultManufacturer || null);
        setFilteredProducts(products || []);
      }
    }
  }, [categoryData, manufacturerSlug]);

  // Add this function to handle subcategory opening
  const handleSubcategoryOpen = async (subcategoryId) => {
    try {
      const response = await getdata(
        `/category/${category}/${subcategory}/subcategory/${subcategoryId}`
      );
      
      if (response.success) {
        const { manufacturers } = response.data;
        
        // Update the sidebar data with new manufacturers
        setSidebarData(prevData => 
          prevData.map(item => {
            if (item.id === subcategoryId) {
              return {
                ...item,
                items: manufacturers.length > 0 
                  ? manufacturers.map(mfr => ({
                      id: mfr._id,
                      name: mfr.name,
                      image: mfr.image,
                      description: mfr.description
                    }))
                  : [{ 
                      id: 'no-manufacturer',
                      name: 'No Manufacturers Available',
                      description: 'No manufacturers are currently available for this subcategory.'
                    }]
              };
            }
            return item;
          })
        );
      }
    } catch (error) {
      console.error("Error fetching subcategory manufacturers:", error);
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
                  subcategoryId={accordion.id}
                  onManufacturerSelect={handleManufacturerSelect}
                  onSubcategoryOpen={handleSubcategoryOpen}
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
                  <ProductCard key={index} product={product} />
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