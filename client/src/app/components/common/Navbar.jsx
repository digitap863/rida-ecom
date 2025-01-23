"use client";
import { MoveRight, X, ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import logo from "@/assets/home/Rida_logo.svg";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { getdata, postData, searchProducts } from "@/api/req";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";




const Navbar = () => {
  const router = useRouter()
  const [isClose, setIsClose] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data } = useQuery({
    queryKey: ["category"],
    queryFn: () => getdata("/category"),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
  });


  const { data: subcategoriesData } = useQuery({
    queryKey: ["subcategories"],
    queryFn: () => getdata("/subcategories"),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
  });

  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  const { data: searchResults } = useQuery({
    queryKey: ["search", debouncedSearch],
    queryFn: () => searchProducts(debouncedSearch),
    enabled: debouncedSearch.length > 0,
    staleTime: 1000 * 60 * 5,
  });
  console.log(subcategoriesData?.data, "thisis sub")
  const handleNavigate = (item) => {
    const sub = subcategoriesData?.data?.filter((sub) => sub.category._id === item._id)[0]
    router.push(`/${item.category}/${sub.subcategory}`)
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="relative">
      {/* Top Banner */}
      <div
        className={`h-8 w-full bg-ind_blue flex items-center justify-center relative ${isClose ? "hidden" : "block"
          }`}
      >
        <p className="uppercase text-white font-ibmMono flex gap-2 items-center text-center text-xs md:text-sm lg:text-base">
          NATIONAL DAY Sale is LIVE! <MoveRight />
        </p>
        <X
          size={16}
          className="absolute right-2 text-white cursor-pointer"
          onClick={() => setIsClose(!isClose)}
        />
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <div className="hidden h-10 w-full bg-[#F4EFE9] md:flex items-center justify-end font-urbanist text-textgray px-10 font-medium text-sm">
          <div className="flex justify-end">
            <div className="divide-x-2 divide-gray-300 flex gap-2 items-center justify-center self-end">
              <a
                href="http://"
                target="_blank"
                rel="noopener noreferrer"
                className=""
              >
                See locations{" "}
              </a>
              <a href="mailto:" className="pl-3">
                products@rida.in
              </a>
              <div className="pl-3">
                Call us between 8 AM - 10 PM /{" "}
                <a href="tel:+666855558464">6668 5555 8464</a>
              </div>
            </div>
          </div>
        </div>
        <nav>
          <div className="hidden md:grid grid-cols-4 py-2 ">
            <div className="col-span-1"></div>
            <div className="col-span-2 flex items-center justify-between gap-10 font-urbanist font-semibold">
              <Link href={"/"}>Home</Link>
              <Link href={"/"}>Products</Link>
              <Link href={"/"}>
                <Image src={logo} alt="logo" priority={true} />
              </Link>
              <Link href={"/"}>Solution</Link>
              <Link href={"/"}>Contact Us</Link>
            </div>
            <div className="col-span-1 relative w-64 mx-auto flex items-center justify-center">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search products..."
                className="w-full pl-4 pr-10 py-2 border rounded-full focus:outline-none bg-[#F8F8F8] focus:border-ind_blue"
              />
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-800"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

              {/* Search Suggestions */}
              <AnimatePresence>
                {showSuggestions && searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-md shadow-lg z-50 max-h-[400px] overflow-y-auto"
                  >
                    {searchResults?.products?.length > 0 ? (
                      searchResults.products.map((product, idx) => (
                        <Link
                          key={product._id}
                          href={`/category/${product.category.name}/${product.subcategory.name}/${product.manufacturer.name}/${product.slug}`}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowSuggestions(false)}
                        >
                          <img
                            src={product.image[0]}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex flex-col">
                            <span className="font-medium">{product.name}</span>
                            <span className="text-sm text-gray-500">
                              {product.partNumber} - {product.model}
                            </span>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        <p>No products found</p>
                        <p className="text-sm mt-1">Try searching with a different term</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </nav>
        <div className="hidden h-16 w-full bg-ind_blue md:flex items-center justify-around text-white">
          <div className="relative">
            <ul className="flex items-center gap-6">
              {data?.categories?.map((category, index) => (
                <li
                  key={index}
                  className="relative"
                  onMouseEnter={() => setActiveCategory(category._id)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <button className="px-4 py-2 text-white hover:bg-ind_blue/50 rounded-md transition-colors flex items-center gap-1 group">
                    {category.name}
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${activeCategory === category._id ? 'rotate-180' : 'rotate-0'
                        }`}
                    />
                  </button>

                  <AnimatePresence>
                    {activeCategory === category._id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-0 mt-2 min-w-[400px] bg-white rounded-md shadow-lg z-50"
                      >
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="grid gap-3 p-6 text-black"
                        >
                          {subcategoriesData?.data
                            ?.filter((sub) => sub.category._id === category._id)
                            ?.map((subcategory, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                              >
                                <Link
                                  href={`/${category.category}/${subcategory.subcategory}`}
                                  className="block p-2 hover:bg-slate-100 rounded-md transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={subcategory.image}
                                      alt={subcategory.name}
                                      className="w-10 h-10 object-cover rounded"
                                    />
                                    <span>{subcategory.name}</span>
                                  </div>
                                </Link>
                              </motion.div>
                            ))}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="flex items-center justify-between p-2">
          <Link href={"/"}>
            <Image src={logo} alt="logo" priority={true} className="w-28" />
          </Link>
          <div>

            <Menu
            strokeWidth={3}
              size={36}
              className="cursor-pointer text-ind_blue"
              onClick={() => setIsMobileMenuOpen(true)}
            />
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut"
                }}
                className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              />

              {/* Menu */}
              <motion.div
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: "0%", opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 25,
                  mass: 0.8
                }}
                className="fixed inset-y-0 right-0 w-[78%] bg-ind_blue z-50"
              >
                <div className="p-4 h-full relative">
                  {/* Close Button */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.3,
                      duration: 0.4,
                      ease: "easeOut"
                    }}
                    className="flex justify-end"
                  >
                    <X
                      size={24}
                      className="text-white cursor-pointer hover:rotate-90 transition-transform duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                  </motion.div>

                  {/* Navigation Links Container */}
                  <motion.div
                    initial="closed"
                    animate="open"
                    variants={{
                      open: {
                        transition: {
                          staggerChildren: 0.1,
                          delayChildren: 0.3
                        }
                      },
                      closed: {
                        transition: {
                          staggerChildren: 0.05,
                          staggerDirection: -1
                        }
                      }
                    }}
                    className="mt-8 flex flex-col space-y-6"
                  >
                    {/* Home Link */}
                    <motion.div
                      variants={{
                        open: {
                          x: 0,
                          opacity: 1,
                          transition: {
                            type: "spring",
                            stiffness: 200,
                            damping: 20
                          }
                        },
                        closed: {
                          x: 50,
                          opacity: 0
                        }
                      }}
                    >
                      <Link
                        href="/"
                        className="text-white text-2xl font-urbanist hover:text-yellow-300 transition-colors duration-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Home
                      </Link>
                    </motion.div>

                    {/* Products Accordion */}
                    <motion.div
                      variants={{
                        open: {
                          x: 0,
                          opacity: 1,
                          transition: {
                            type: "spring",
                            stiffness: 200,
                            damping: 20
                          }
                        },
                        closed: {
                          x: 50,
                          opacity: 0
                        }
                      }}
                      className="text-white text-2xl font-urbanist"
                    >
                      <div
                        className="flex items-center justify-between cursor-pointer hover:text-yellow-300 transition-colors duration-300"
                        onClick={() => setIsProductsOpen(!isProductsOpen)}
                      >
                        Products
                        <ChevronDown
                          size={24}
                          className={`transform transition-all duration-500 ease-out ${isProductsOpen ? 'rotate-180' : 'rotate-0'
                            }`}
                        />
                      </div>

                      <AnimatePresence>
                        {isProductsOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{
                              height: "auto",
                              opacity: 1,
                              transition: {
                                height: {
                                  duration: 0.4,
                                  ease: "easeOut"
                                },
                                opacity: {
                                  duration: 0.3,
                                  delay: 0.1
                                }
                              }
                            }}
                            exit={{
                              height: 0,
                              opacity: 0,
                              transition: {
                                height: {
                                  duration: 0.3,
                                  ease: "easeInOut"
                                },
                                opacity: {
                                  duration: 0.2
                                }
                              }
                            }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 ml-4 flex flex-col space-y-4 text-lg">
                              {data && data?.categories?.map((item, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ x: -20, opacity: 0 }}
                                  animate={{
                                    x: 0,
                                    opacity: 1,
                                    transition: {
                                      delay: 0.1 * i,
                                      duration: 0.4,
                                      ease: "easeOut"
                                    }
                                  }}
                                >
                                  <div
                                    // href={`/${item.toLowerCase().replace(/ /g, '-')}`}
                                    // href={"/"}
                                    className="text-white/90 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block"
                                    // onClick={() => setIsMobileMenuOpen(false)}
                                    onClick={() => handleNavigate(item)}
                                  >
                                    {item?.name}
                                  </div>

                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Solution and Contact Links */}
                    {["Solution", "Contact Us"].map((item, i) => (
                      <motion.div
                        key={i}
                        variants={{
                          open: {
                            x: 0,
                            opacity: 1,
                            transition: {
                              type: "spring",
                              stiffness: 200,
                              damping: 20
                            }
                          },
                          closed: {
                            x: 50,
                            opacity: 0
                          }
                        }}
                      >
                        <Link
                          href={`/${item.toLowerCase().replace(/ /g, '-')}`}
                          className="text-white text-2xl font-urbanist hover:text-yellow-300 transition-colors duration-300"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item}
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Contact Information */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{
                      y: 0,
                      opacity: 1,
                      transition: {
                        delay: 0.5,
                        duration: 0.4,
                        ease: "easeOut"
                      }
                    }}
                    className="absolute bottom-10 left-4 right-4"
                  >
                    <div className="text-white">
                      <p className="text-sm hover:text-yellow-300 transition-colors duration-300 cursor-pointer">
                        Call us between 8 AM - 10 PM
                      </p>
                      <p className="text-sm hover:text-yellow-300 transition-colors duration-300 cursor-pointer">
                        6668 5555 8464
                      </p>
                      <p className="text-sm hover:text-yellow-300 transition-colors duration-300 cursor-pointer">
                        products@rida.in
                      </p>
                      <p className="text-sm hover:text-yellow-300 transition-colors duration-300 cursor-pointer">
                        See locations
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Navbar;
