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

  const { data, refetch } = useQuery({
    queryKey: ["categorydetails", category], // Add category to queryKey
    queryFn: () => getdata(`/category/${category}`),
    enabled: !!category // Only fetch if category exists
  });


  useEffect(() => {
    if (category) {
      refetch();
    }
  }, [category, refetch]);

  // Transform API data for accordion
  const accordionData = data?.data?.subcategories?.map(subcat => ({
    title: subcat.name,
    items: data?.data?.manufacturers
      .filter(mfr => mfr.subcategory === subcat._id)
      .map(mfr => mfr.name),
    isFirst: subcat._id === data?.data?.defaultSubcategory?._id
  })) || [];

  return (
    <div className="max-w-screen-2xl mx-auto">
      <div className="p-20">
        <div className="font-urbanist text-[#A2a2a2] font-medium">
          {data?.data?.category?.name} {" > "}{" "}
          <span className="text-[#2369AC]">
            {data?.data?.defaultSubcategory?.name}
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
                />
              ))}
            </Card>
          </div>
          <div className="w-3/4 flex flex-col">
            <div className="flex gap-10 justify-between">
              <div className="w-1/2 font-urbanist">
                <h1 className="text-ind_blue text-4xl font-bold uppercase">
                  {data?.data?.defaultManufacturer?.name}
                </h1>
                <p className="font-medium">
                  Provide Original / Replacement {data?.data?.defaultManufacturer?.name} products
                  for bus / van factory, after-sale market of bus repair center
                </p>
              </div>
              <div className="w-1/2">
                <Image src={bock} alt="" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-10">
              {data?.data?.products.map((product, index) => (
                <Card key={index} className="aspect-[1/1.2]">
                  <div className="p-3">
                    <Image src={product.image} alt="" className="mx-auto" width={200} height={200} />
                  </div>
                  <div className="p-5 font-urbanist space-y-3">
                    <h3 className="font-bold text-lg">{product.partNumber}</h3>
                    <p className="text-[#5E5E5E] font-medium">{product.oe}</p>
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
