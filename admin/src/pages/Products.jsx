import Layout from "@/components/layout/Layout"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteData, getdata, postForm } from "../api/req"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


// Update validation schema
const validationSchema = Yup.object({
  partNumber: Yup.string().required("Part number is required"),
  oe: Yup.string().required("OE numbers are required"),
  image: Yup.mixed().required("Image is required"),
  manufacturer: Yup.string().required("Manufacturer is required"),
  category: Yup.string().required("Category is required"),
  subcategory: Yup.string().required("Subcategory is required"),
});

const Products = () => {
  const queryClient = useQueryClient();
  // Add these new queries after existing imports
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getdata("/category"),
  });
  
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  
  // Fetch subcategories based on selected category
  const { data: subcategories = [] } = useQuery({
    queryKey: ["subcategories", selectedCategory],
    queryFn: () => getdata(`/category/${selectedCategory}`),
    enabled: !!selectedCategory
  });
  
  // Update manufacturers query to filter by subcategory
  const { data: manufacturers = [] } = useQuery({
    queryKey: ["manufacturers", selectedSubcategory],
    queryFn: () => getdata(`/subcategory/${selectedSubcategory}`),
    enabled: !!selectedSubcategory
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Fetch products
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => getdata("/product"),
  });

  const addProductMutation = useMutation({
    mutationFn: (data) => postForm("/product", data),
    onSuccess: () => {
      toast.success("Product added successfully");
      queryClient.invalidateQueries(["products"]);
    },
    onError: (error) => {
      toast.error(`Error occurred: ${error.response?.data?.message || 'Something went wrong'}`);
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id) => deleteData(`/product/${id}`),
    onSuccess: () => {
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries(["products"]);
    },
    onError: (error) => {
      toast.error(`Error occurred: ${error.response?.data?.message || 'Something went wrong'}`);
    }
  });

  // Update formik initialization
  const formik = useFormik({
    initialValues: {
      partNumber: "",
      oe: "",
      image: null,
      manufacturer: "",
      category: "",
      subcategory: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("partNumber", values.partNumber);
      formData.append("oe", values.oe);
      formData.append("image", values.image);
      formData.append("manufacturer", values.manufacturer);
      formData.append("category", selectedCategory);
      formData.append("subcategory", selectedSubcategory);

      try {
        await addProductMutation.mutateAsync(formData);
        formik.resetForm();
        setSelectedCategory('');
        setSelectedSubcategory('');
        document.getElementById("image").value = "";
      } catch (error) {
        console.error("Error adding product:", error);
      }
    },
  });

  const handleDelete = (id) => {
    setItemToDelete(id);
    setIsDialogOpen(true);
  }

  const confirmDelete = async () => {
    if (itemToDelete) {
      await deleteProductMutation.mutateAsync(itemToDelete);
      setItemToDelete(null);
      setIsDialogOpen(false);
    }
  }

  return (
    <Layout>
      <div className="flex gap-4 p-4">
        <div className="w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Add New Product</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="partNumber">Part Number</label>
                  <Input
                    id="partNumber"
                    name="partNumber"
                    value={formik.values.partNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.partNumber && formik.errors.partNumber ? "border-red-500" : ""}
                  />
                  {formik.touched.partNumber && formik.errors.partNumber && (
                    <div className="text-red-500 text-xs">{formik.errors.partNumber}</div>
                  )}
                </div>

                <div>
                  <label htmlFor="oe">OE Numbers (comma-separated)</label>
                  <Input
                    id="oe"
                    name="oe"
                    value={formik.values.oe}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.oe && formik.errors.oe ? "border-red-500" : ""}
                  />
                  {formik.touched.oe && formik.errors.oe && (
                    <div className="text-red-500 text-xs">{formik.errors.oe}</div>
                  )}
                </div>

                <div>
                  <label htmlFor="image">Image</label>
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    onChange={(event) => {
                      formik.setFieldValue("image", event.currentTarget.files[0]);
                    }}
                    onBlur={formik.handleBlur}
                    className={formik.touched.image && formik.errors.image ? "border-red-500" : ""}
                  />
                  {formik.touched.image && formik.errors.image && (
                    <div className="text-red-500 text-xs">{formik.errors.image}</div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label>Category</label>
                    <Select
                      name="category"
                      value={selectedCategory}
                      onValueChange={(value) => {
                        setSelectedCategory(value);
                        setSelectedSubcategory('');
                        formik.setFieldValue('manufacturer', '');
                        formik.setFieldValue('category', value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.data?.categories?.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label>Subcategory</label>
                    <Select
                      name="subcategory"
                      value={selectedSubcategory}
                      onValueChange={(value) => {
                        setSelectedSubcategory(value);
                        formik.setFieldValue('manufacturer', '');
                        formik.setFieldValue('subcategory', value);
                      }}
                      disabled={!selectedCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {subcategories?.data?.subcategories?.map((subcategory) => (
                          <SelectItem key={subcategory._id} value={subcategory._id}>
                            {subcategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label>Manufacturer</label>
                    <Select
                      name="manufacturer"
                      value={formik.values.manufacturer}
                      onValueChange={(value) => formik.setFieldValue('manufacturer', value)}
                      disabled={!selectedSubcategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a manufacturer" />
                      </SelectTrigger>
                      <SelectContent>
                        {manufacturers?.data?.manufacturers?.map((manufacturer) => (
                          <SelectItem key={manufacturer._id} value={manufacturer._id}>
                            {manufacturer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={addProductMutation.isPending}
                >
                  {addProductMutation.isPending ? "Adding..." : "Add Product"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {products?.data?.products?.map((product) => (
                  <div
                    key={product._id}
                    className="grid grid-cols-6 items-center p-3 border rounded hover:bg-accent"
                  >
                    <img src={product.image} alt={product.partNumber} className="w-12 h-12 object-cover rounded" />
                    <span className="font-medium">{product.partNumber}</span>
                    <span className="text-sm">{product.oe.join(", ")}</span>
                    <span className="text-sm">{product.category?.name}</span>
                    <span className="text-sm">{product.subcategory?.name}</span>
                    <div className="flex justify-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(product._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  )
}

export default Products