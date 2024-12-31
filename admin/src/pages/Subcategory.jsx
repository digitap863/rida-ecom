import Layout from "@/components/layout/Layout"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteData, getdata, postData } from "../api/req"
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


const validationSchema = Yup.object({
  name: Yup.string()
    .required("Subcategory name is required")
    .min(2, "Subcategory name must be at least 2 characters"),
  category: Yup.string().required("Category is required")
})

const Subcategory = () => {
  // Single query for categories
  const { data: categories = [] } = useQuery({
    queryKey: ["category"],
    queryFn: () => getdata("/category"),
  });
  const { data: subcategories = [] } = useQuery({
    queryKey: ["subcategory"],
    queryFn: () => getdata("/subcategory"),
  });


  const queryClient = useQueryClient();
  const addCategoryMutation = useMutation({
    mutationFn: (data) => postData("/subcategory", data),
    onError: (error) => {
      toast.error(`Error occurred: ${error.response?.data?.message || 'Something went wrong'}`);
    },
    onSuccess: () => {
      toast.success("Subcategory added successfully");
      queryClient.invalidateQueries(["subcategory"]);
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id) => deleteData(`/category/${id}`),
    onError: (error) => {
      toast.error(`Error occurred: ${error.response?.data?.message || 'Something went wrong'}`);
    },
    onSuccess: () => {
      toast.success("Subcategory deleted successfully");
      queryClient.invalidateQueries(["subcategory"]);
    }
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      category: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      // Format the category data
      const categoryData = {
        name: values.name,
        categoryId:values.category 
      }
      try {
        await addCategoryMutation.mutateAsync(categoryData);
        formik.resetForm();
      } catch (error) {
        console.error("Error adding category:", error);
      }
    },
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const handleDelete = (id) => {
    setCategoryToDelete(id);
    setIsDialogOpen(true);
  }

  const confirmDelete = async () => {
    if (categoryToDelete) {
      await deleteCategoryMutation.mutateAsync(categoryToDelete);
      setCategoryToDelete(null);
      setIsDialogOpen(false);
    }
  }

  return (
    <Layout>
      <div className="flex gap-4 p-4">
        <div className="w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Add New Category</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div className="">
                  <label htmlFor="name" className="text-sm font-medium ">Select Category</label>
                  <Select 
                    name="category" 
                    value={formik.values.category}
                    onValueChange={(value) => formik.setFieldValue('category', value)}
                    onBlur={formik.handleBlur}
                  >
                    <SelectTrigger className={`w-full mt-2 ${formik.touched.category && formik.errors.category ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent >
                      {categories?.data?.categories?.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formik.touched.category && formik.errors.category && (
                    <div className="text-red-500 text-xs">{formik.errors.category}</div>
                  )}
                  <label htmlFor="name" className="text-sm font-medium mt-2 ">
                    Subcategory Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`mt-2 ${formik.touched.name && formik.errors.name ? "border-red-500" : ""}`}
                    disabled={addCategoryMutation.isLoading}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="text-red-500 text-xs">{formik.errors.name}</div>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={addCategoryMutation.isLoading || !formik.isValid || !formik.dirty}
                >
                  {addCategoryMutation.isLoading ? "Adding..." : "Add Subcategory"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="w-2/3 max-w-screen-md">
          <Card>
            <CardHeader>
              <CardTitle>Subcategories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {subcategories?.data?.data?.map((category) => (
                  <div
                    key={category?._id}
                    className="grid grid-cols-3 items-center justify-between p-3 border rounded hover:bg-accent"
                  >
                    <span className="font-medium">{category?.name}</span>
                    <span className="text-sm">{category?.category?.name}</span>
                    <div className="flex justify-end items-center space-x-2">

                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-fit self-end"
                      onClick={() => handleDelete(category._id)}
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
