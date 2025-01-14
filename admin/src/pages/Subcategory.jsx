import Layout from "@/components/layout/Layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { deleteData, getdata, putForm } from "../api/req"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const Subcategory = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Single query for categories
  const { data: categories = [] } = useQuery({
    queryKey: ["category"],
    queryFn: () => getdata("/category"),
  });
  const { data: subcategories = [], isLoading } = useQuery({
    queryKey: ["subcategory"],
    queryFn: () => getdata("/subcategory"),
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Add update mutation
  const updateSubcategoryMutation = useMutation({
    mutationFn: ({ id, data }) => putForm(`/subcategory/${id}`, data),
    onSuccess: () => {
      toast.success("Subcategory updated successfully");
      queryClient.invalidateQueries(["subcategory"]);
      navigate("/subcategory");
    },
    onError: (error) => {
      toast.error(`Error occurred: ${error.response?.data?.message || 'Something went wrong'}`);
    }
  });

  const handleDelete = (id) => {
    setCategoryToDelete(id);
    setIsDialogOpen(true);
  }

  const confirmDelete = async () => {
    if (categoryToDelete) {
      await deleteData(`/subcategory/${categoryToDelete}`);
      setCategoryToDelete(null);
      setIsDialogOpen(false);
    }
  }

  // Filter subcategories based on selected category and search query
  const filteredSubcategories = subcategories?.data?.data?.filter((subcategory) => {
    const matchesCategory = selectedCategoryFilter === "all" || subcategory.category?._id === selectedCategoryFilter
    const matchesSearch = !searchQuery ||
      subcategory.name.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  // Add handler for edit button
  const handleEdit = (subcategory) => {
    navigate("/add-subcategory", { 
      state: { 
        isEdit: true, 
        subcategory 
      } 
    });
  };

  return (
    <Layout>
      <div className="p-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Subcategories</CardTitle>
              <Button onClick={() => navigate("/add-subcategory")}>
                Add New Subcategory
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search subcategories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>

              <Select
                value={selectedCategoryFilter}
                onValueChange={setSelectedCategoryFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.data?.categories?.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategoryFilter("all")
                  setSearchQuery("")
                }}
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
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Edit</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubcategories?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No subcategories found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSubcategories?.map((subcategory) => (
                      <TableRow key={subcategory._id}>
                        <TableCell>
                          <img
                            src={subcategory.image}
                            alt={subcategory.name}
                            className="w-10 h-10 object-cover rounded-full"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {subcategory.name}
                        </TableCell>
                        <TableCell>{subcategory.category?.name}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(subcategory)}
                          >
                            Edit
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(subcategory._id)}
                            >
                              Delete
                            </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Move Dialog outside the map function */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Subcategory;
