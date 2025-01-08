"use client"
import { ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

const AccordionItem = ({ 
  title, 
  items, 
  isFirst, 
  subcategoryId,
  onManufacturerSelect,
  onSubcategoryOpen
}) => {
  const [isOpen, setIsOpen] = useState(isFirst);

  const handleSubcategoryClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen && onSubcategoryOpen) {
      onSubcategoryOpen(subcategoryId);
    }
  };

  const handleManufacturerClick = (manufacturerId) => {
    if (onManufacturerSelect) {
      onManufacturerSelect(manufacturerId);
    }
  };

  return (
    <div className={`border-b border-gray-100 py-2 ${isFirst ? "" : "mt-4"}`}>
      <motion.div
        className="flex items-center gap-3 cursor-pointer group"
        onClick={handleSubcategoryClick}
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
              {items.map((item) => (
                <motion.li
                  key={item.id}
                  className="flex gap-3 items-center font-urbanist font-medium text-gray-600 py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                  whileHover={{ x: 8, backgroundColor: "#f8fafc" }}
                  transition={{ duration: 0.2 }}
                  onClick={() => handleManufacturerClick(item.id)}
                >
                  <div className="flex items-center gap-3 w-full">
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
                    <div className="flex items-center gap-2 flex-1">
                      <span className="flex-1">{item.name}</span>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccordionItem;