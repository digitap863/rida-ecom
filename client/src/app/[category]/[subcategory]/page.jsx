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
      const accordionData = subcategories.map(subcat => ({
        id: subcat._id,
        title: subcat.name,
        subcategorySlug: subcat.subcategory,
        items: manufacturers
          .filter(mfr => mfr.subcategory.toString() === subcat._id.toString())
          .map(mfr => ({
            id: mfr._id,
            name: mfr.name,
            image: mfr.image,
            description: mfr.description
          })),
        isFirst: subcat._id === currentSubcategory._id,
        isEmpty: manufacturers.length === 0
      }));

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
    if (!subcategoryId) return; // Add guard clause for undefined subcategoryId
    
    try {
      const response = await getdata(
        `/category/${category}/${subcategory}/subcategory/${subcategoryId}`
      );
      
      if (response.success && response.data) {
        const { manufacturers } = response.data;
        
        setSidebarData(prevData => {
          if (!prevData) return prevData;
          
          return prevData.map(item => {
            if (item.id === subcategoryId) {
              return {
                ...item,
                items: manufacturers && manufacturers.length > 0 
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
          });
        });
      }
    } catch (error) {
      console.error("Error fetching subcategory manufacturers:", error);
      setSidebarData(prevData => {
        if (!prevData) return prevData;
        
        return prevData.map(item => {
          if (item.id === subcategoryId) {
            return {
              ...item,
              items: [{ 
                id: 'error',
                name: 'Error Loading Manufacturers',
                description: 'There was an error loading manufacturers. Please try again.'
              }]
            };
          }
          return item;
        });
      });
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto">
      <div className="p-4 sm:p-6 md:p-10 lg:p-20">
        <div className="font-urbanist text-[#A2a2a2] font-medium capitalize text-sm sm:text-base">
          {categoryData?.data?.category?.name || category.replace(/-/g, " ")} {" > "}{" "}
          <span className="text-[#2369AC]">
            {selectedSubcategory?.name || subcategory.replace(/-/g, " ")}
          </span>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-10 mt-4">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <Card className="p-2 sm:p-4 rounded min-h-[40vh] md:min-h-screen">
              {sidebarData?.map((accordion, index) => (
                <AccordionItem
                  key={accordion.id}
                  title={accordion.title}
                  items={accordion.items}
                  isFirst={accordion.isFirst}
                  subcategoryId={accordion.id}
                  onManufacturerSelect={handleManufacturerSelect}
                  onSubcategoryOpen={handleSubcategoryOpen}
                />
              ))}
            </Card>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4 flex flex-col">
            <div className="flex  flex-col-reverse  lg:flex-row gap-4 sm:gap-6 lg:gap-10">
              {/* Manufacturer Info */}
              <div className="w-full lg:w-1/2 font-urbanist">
                <h1 className="text-ind_blue text-2xl sm:text-3xl md:text-4xl font-bold uppercase">
                  {selectedManufacturer?.name || 'No Manufacturer'}
                </h1>
                <p className="font-medium text-sm sm:text-base mt-2">
                  {selectedManufacturer?.description || ''}
                </p>
              </div>

              {/* Manufacturer Image */}
              <div className="w-full lg:w-1/2">
                {selectedManufacturer?.image && (
                  <Image 
                    src={selectedManufacturer?.image} 
                    alt={selectedManufacturer?.name}
                    width={400}
                    height={300}
                    className="object-contain w-full h-auto"
                  />
                )}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 sm:mt-10">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <ProductCard key={index} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-gray-500">
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