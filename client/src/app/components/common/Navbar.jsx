"use client";
import { MoveRight, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import logo from "@/assets/home/Rida_logo.svg";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { getdata, postData } from "@/api/req";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"




const Navbar = () => {

  const [isClose, setIsClose] = useState(false);
  const { data } = useQuery({
    queryKey: ["category"],
    queryFn: () => getdata("/category"),
    // staleTime: 1000 * 60 * 5,
    // cacheTime: 1000 * 60 * 30,
  });


  const { data: subcategoriesData } = useQuery({
    queryKey: ["subcategories"],
    queryFn: () => getdata("/subcategories"),
    // staleTime: 1000 * 60 * 5,
    // cacheTime: 1000 * 60 * 30,
  });
  


  return (
    <div>
      <div
        className={`h-8 w-full bg-ind_blue flex items-center justify-center relative ${isClose ? "hidden" : "block"
          }`}
      >
        <p className="uppercase text-white font-ibmMono flex gap-2 items-center text-center">
          NATIONAL DAY Sale is LIVE! <MoveRight />
        </p>
        <X
          size={16}
          className="absolute right-2 text-white cursor-pointer"
          onClick={() => setIsClose(!isClose)}
        />
      </div>
      <div className="h-10 w-full bg-[#F4EFE9] flex items-center justify-end font-urbanist text-textgray px-10 font-medium text-sm">
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
        <div className="grid grid-cols-4 py-2">
          <div className="col-span-1"></div>
          <div className="col-span-2 flex items-center justify-between gap-10 font-urbanist font-semibold">
            <Link href={"/"}>Home</Link>
            <Link href={"/"}>Products</Link>
            <Link href={"/"}>
              <Image src={logo} alt="logo"  priority={true}/>
            </Link>
            <Link href={"/"}>Solution</Link>
            <Link href={"/"}>Contact Us</Link>
          </div>
          <div className="col-span-1 relative w-64 mx-auto flex items-center justify-center">
            <Input
              type="text"
              placeholder="Search products..."
              className="w-full pl-4 pr-10 py-2 border rounded-full focus:outline-none bg-[#F8F8F8] focus:border-ind_blue "
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
          </div>
        </div>
      </nav>
      <div className="bg-ind_blue h-16 w-full flex items-center justify-around text-white">
        <NavigationMenu>
          <NavigationMenuList>
            {data?.categories?.map((category, index) => (
              <NavigationMenuItem key={index}>
                <NavigationMenuTrigger className="bg-transparent text-white hover:bg-ind_blue/50">
                  {category.name}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[400px] bg-white text-black">
                    {subcategoriesData?.data
                      ?.filter((sub) => sub.category._id === category._id)
                      ?.map((subcategory, idx) => (
                        <Link
                          key={idx}
                          href={`/${category.category}/${subcategory.subcategory}`}
                          className="block p-2 hover:bg-slate-100 rounded-md"
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
                      ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

export default Navbar;
