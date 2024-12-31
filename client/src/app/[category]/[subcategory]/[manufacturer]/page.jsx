"use client";
import Image from "next/image";
import React, { use, useState } from "react";
import bock from "@/assets/category/bock.png";
import prod from "@/assets/category/prod.png";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const AccordionItem = ({ title, items, isFirst }) => {
  const [isOpen, setIsOpen] = useState(isFirst);

  return (
    <div className={`border-b border-gray-100 py-2 ${isFirst ? "" : "mt-4"}`}>
      <motion.div
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <ChevronDown
            size={20}
            className="p-1 bg-ind_blue text-white rounded-full group-hover:shadow-md transition-shadow"
          />
        </motion.div>
        <span className="font-urbanist font-bold text-ind_blue uppercase tracking-wide">
          {title}
        </span>
      </motion.div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: { duration: 0.3, ease: "easeOut" },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: { duration: 0.2, ease: "easeIn" },
            }}
          >
            <ul className="ml-7 mt-3 space-y-2">
              {items.map((item, index) => (
                <motion.li
                  key={index}
                  className="flex gap-3 items-center font-urbanist font-medium text-gray-600 py-2 px-3 rounded-lg hover:bg-gray-50"
                  whileHover={{ x: 8, backgroundColor: "#f8fafc" }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    whileHover={{ rotate: -45 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight
                      size={18}
                      strokeWidth={2.5}
                      className="p-1 border border-gray-600 rounded-full"
                    />
                  </motion.div>
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Manufacturer = ({ params }) => {
  const resolvedParams = use(params);
  const { category, subcategory, manufacturer } = resolvedParams;

  const accordionData = [
    {
      title: "Compressor",
      items: ["Bock", "Bock", "Bock"],
      isFirst: true,
    },
    {
      title: "Another Category",
      items: ["Item 1", "Item 2", "Item 3"],
      isFirst: false,
    },
  ];

  return (
    <div className="max-w-screen-2xl mx-auto">
      <div className=" p-20">
        <div className="font-urbanist text-[#A2a2a2] font-medium">
          BUS HVAC PARTS {">"}{" "}
          <span className="text-[#2369AC]"> Compressor</span>
        </div>
        <div className="flex gap-10 mt-4">
          <div className="w-1/4">
            <Card className="p-4 rounded  min-h-screen">
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
                  bock
                </h1>
                <p className="font-medium">
                  Provide Original / Replacement Bock FK40 series, FK50 series
                  compressor for bus / van factory, after-sale market of bus
                  repair center
                </p>
              </div>
              <div className="w-1/2">
                <Image src={bock} alt="" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-10">
              <Card className="aspect-[1/1.2]">
                <div className="p-3">
                  <Image src={prod} alt="" className="mx-auto" />
                </div>
                <div className="p-5 font-urbanist space-y-3">
                  <h3 className="font-bold text-lg">
                    Bock FKX40 390K Compressor
                  </h3>
                  <p className="text-[#5E5E5E] font-medium">1001-2001</p>
                  <Button className="w-full border  text-ind_blue hover:bg-ind_blue hover:text-white border-ind_blue bg-transparent">
                    View Details
                  </Button>
                </div>
              </Card>
              <Card className="aspect-[1/1.2]">
                <div className="p-3">
                  <Image src={prod} alt="" className="mx-auto" />
                </div>
                <div className="p-5 font-urbanist space-y-3">
                  <h3 className="font-bold text-lg">
                    Bock FKX40 390K Compressor
                  </h3>
                  <p className="text-[#5E5E5E] font-medium">1001-2001</p>
                  <Button className="w-full border  text-ind_blue hover:bg-ind_blue hover:text-white border-ind_blue bg-transparent">
                    View Details
                  </Button>
                </div>
              </Card>
              <Card className="aspect-[1/1.2]">
                <div className="p-3">
                  <Image src={prod} alt="" className="mx-auto" />
                </div>
                <div className="p-5 font-urbanist space-y-3">
                  <h3 className="font-bold text-lg">
                    Bock FKX40 390K Compressor
                  </h3>
                  <p className="text-[#5E5E5E] font-medium">1001-2001</p>
                  <Button className="w-full border  text-ind_blue hover:bg-ind_blue hover:text-white border-ind_blue bg-transparent">
                    View Details
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manufacturer;
