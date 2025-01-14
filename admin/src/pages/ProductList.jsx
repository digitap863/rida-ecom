"use client"
import { useState } from "react"
import Layout from "@/components/layout/Layout"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getdata, deleteData } from "../api/req"
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
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"

const ProductList = () => {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedSubcategory, setSelectedSubcategory] = useState("")
  const [selectedManufacturer, setSelectedManufacturer] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

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
      product.name.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSubcategory && matchesManufacturer && matchesSearch
  })

  // Pagination logic
  const totalItems = filteredProducts?.length || 0
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filteredProducts?.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const resetFilters = () => {
    setSelectedCategory("")
    setSelectedSubcategory("")
    setSelectedManufacturer("")
    setSearchQuery("")
  }

  // Add delete mutation
  const deleteProductMutation = useMutation({
    mutationFn: (id) => deleteData(`/product/${id}`),
    onSuccess: () => {
      toast.success("Product deleted successfully")
      queryClient.invalidateQueries(["products"])
    },
    onError: (error) => {
      toast.error(`Error occurred: ${error.response?.data?.message || 'Something went wrong'}`)
    }
  })

  // Add delete handlers
  const handleDelete = (id) => {
    setItemToDelete(id)
    setIsDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (itemToDelete) {
      await deleteProductMutation.mutateAsync(itemToDelete)
      setItemToDelete(null)
      setIsDialogOpen(false)
    }
  }

  const handleEdit = (product) => {
    navigate("/product-add", { 
      state: { 
        isEdit: true, 
        product 
      } 
    });
  };

  return (
    <Layout>
      <div className="p-4 space-y-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Products List</h2>
            <Button onClick={() => navigate("/product-add")}>
              Add New Product
            </Button>
          </div>
          
          {/* Filters Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-lg shadow">
            <div className="relative">
              <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search part number or name..."
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
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Subcategory</TableHead>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead>Actions</TableHead>
                  <TableHead>Add Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : currentItems?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems?.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>
                        <img 
                          src={product.image[0]} 
                          alt={product.partNumber} 
                          className="w-12 h-12 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{product.partNumber}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category?.name}</TableCell>
                      <TableCell>{product.subcategory?.name}</TableCell>
                      <TableCell>{product.manufacturer?.name}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEdit(product)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDelete(product._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link to={`/products/add-details/${product._id}`}>
                        
                          <Button variant="outline" size="sm">
                            Add Details
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {totalItems > 0 && (
            <div className="flex items-center justify-between px-2">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} results
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center space-x-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  )
}

export default ProductList