"use client"
import { useState } from "react"
import Layout from "@/components/layout/Layout"
import { useQuery } from "@tanstack/react-query"
import { getdata } from "../api/req"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

const ProductList = () => {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedSubcategory, setSelectedSubcategory] = useState("")
  const [selectedManufacturer, setSelectedManufacturer] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch all required data
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getdata("/category"),
  })

  const { data: subcategories = [] } = useQuery({
    queryKey: ["subcategories", selectedCategory],
    queryFn: () => getdata(`/category/${selectedCategory}`),
    enabled: !!selectedCategory,
  })

  const { data: manufacturers = [] } = useQuery({
    queryKey: ["manufacturers", selectedSubcategory],
    queryFn: () => getdata(`/subcategory/${selectedSubcategory}`),
    enabled: !!selectedSubcategory,
  })

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getdata("/product"),
  })

  // Filter products based on selected filters and search query
  const filteredProducts = products?.data?.products?.filter((product) => {
    const matchesCategory = !selectedCategory || product.category?._id === selectedCategory
    const matchesSubcategory = !selectedSubcategory || product.subcategory?._id === selectedSubcategory
    const matchesManufacturer = !selectedManufacturer || product.manufacturer?._id === selectedManufacturer
    const matchesSearch = !searchQuery || 
      product.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.oe.some(oe => oe.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesCategory && matchesSubcategory && matchesManufacturer && matchesSearch
  })

  const resetFilters = () => {
    setSelectedCategory("")
    setSelectedSubcategory("")
    setSelectedManufacturer("")
    setSearchQuery("")
  }

  return (
    <Layout>
      <div className="p-4 space-y-4">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Products List</h2>
          
          {/* Filters Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-lg shadow">
            <div className="relative">
              <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search part number or OE..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.data?.categories?.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={selectedSubcategory} 
              onValueChange={setSelectedSubcategory}
              disabled={!selectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Subcategory" />
              </SelectTrigger>
              <SelectContent>
                {subcategories?.data?.subcategories?.map((subcategory) => (
                  <SelectItem key={subcategory._id} value={subcategory._id}>
                    {subcategory.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={selectedManufacturer} 
              onValueChange={setSelectedManufacturer}
              disabled={!selectedSubcategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Manufacturer" />
              </SelectTrigger>
              <SelectContent>
                {manufacturers?.data?.manufacturers?.map((manufacturer) => (
                  <SelectItem key={manufacturer._id} value={manufacturer._id}>
                    {manufacturer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={resetFilters}
              className="md:col-start-4"
            >
              Reset Filters
            </Button>
          </div>

          {/* Table Section */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Part Number</TableHead>
                  <TableHead>OE Numbers</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Subcategory</TableHead>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredProducts?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts?.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>
                        <img 
                          src={product.image} 
                          alt={product.partNumber} 
                          className="w-12 h-12 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{product.partNumber}</TableCell>
                      <TableCell>{product.oe.join(", ")}</TableCell>
                      <TableCell>{product.category?.name}</TableCell>
                      <TableCell>{product.subcategory?.name}</TableCell>
                      <TableCell>{product.manufacturer?.name}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm">
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ProductList