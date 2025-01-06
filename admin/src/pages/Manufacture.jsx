import Layout from "@/components/layout/Layout"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteData, getdata,postForm } from "../api/req"
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
    .required("Manufacturer name is required")
    .min(2, "Name must be at least 2 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  image: Yup.mixed().required("Image is required"),
  category: Yup.string().required("Category is required"),
  subcategory: Yup.string().required("Subcategory is required"),
})

const Manufacture = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getdata("/category"),
  });


  // Fetch subcategories
  const { data: subcategories = [] } = useQuery({
    queryKey: ["subcategories", selectedCategory],
    queryFn: () => getdata(`/category/${selectedCategory}`),
    enabled: !!selectedCategory
  });

  // Fetch manufacturers
  const { data: manufacturers = [] } = useQuery({
    queryKey: ["manufacturers"],
    queryFn: () => getdata("/manufacturer"),
  });

  const addManufacturerMutation = useMutation({
    mutationFn: (data) => postForm("/manufacturer", data),
    onSuccess: () => {
      toast.success("Manufacturer added successfully");
      queryClient.invalidateQueries(["manufacturers"]);
    },
    onError: (error) => {
      toast.error(`Error occurred: ${error.response?.data?.message || 'Something went wrong'}`);
    }
  });

  const deleteManufacturerMutation = useMutation({
    mutationFn: (id) => deleteData(`/manufacturer/${id}`), 
    onSuccess: () => {
      toast.success("Manufacturer deleted successfully");
      queryClient.invalidateQueries(["manufacturers"]);
    },
    onError: (error) => {
      toast.error(`Error occurred: ${error.response?.data?.message || 'Something went wrong'}`);
    }
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      image: null,
      category: "",
      subcategory: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("image", values.image);
      formData.append("category", selectedCategory);
      formData.append("subcategory", selectedSubcategory);
      try {
        await addManufacturerMutation.mutateAsync(formData);
        formik.resetForm();
        setSelectedCategory('');
        setSelectedSubcategory('');
        document.getElementById("image").value = "";
      } catch (error) {
        console.error("Error adding manufacturer:", error);
      }
    },
  });

  const handleDelete = (id) => {
    setItemToDelete(id);
    setIsDialogOpen(true);
  }

  const confirmDelete = async () => {
    if (itemToDelete) {
      await deleteManufacturerMutation.mutateAsync(itemToDelete);
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
              <CardTitle>Add New Manufacturer</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="text-sm font-medium">
                      Manufacturer Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`mt-2 ${formik.touched.name && formik.errors.name ? "border-red-500" : ""}`}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <div className="text-red-500 text-xs">{formik.errors.name}</div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="description" className="text-sm font-medium">
                      Description
                    </label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`mt-2 ${formik.touched.description && formik.errors.description ? "border-red-500" : ""}`}
                    />
                    {formik.touched.description && formik.errors.description && (
                      <div className="text-red-500 text-xs">{formik.errors.description}</div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="image" className="text-sm font-medium">
                      Image
                    </label>
                    <Input
                      id="image"
                      name="image"
                      type="file"
                      onChange={(event) => {
                        formik.setFieldValue("image", event.currentTarget.files[0]);
                      }}
                      onBlur={formik.handleBlur}
                      className={`mt-2 ${formik.touched.image && formik.errors.image ? "border-red-500" : ""}`}
                    />
                    {formik.touched.image && formik.errors.image && (
                      <div className="text-red-500 text-xs">{formik.errors.image}</div>
                    )}
                  </div>
                  <div>
                    <label>Category</label>
                    <Select
                      name="category"
                      value={selectedCategory}
                      onValueChange={(value) => {
                        setSelectedCategory(value);
                        setSelectedSubcategory('');
                        formik.setFieldValue('subcategory', '');
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
                        formik.setFieldValue('subcategory', value);
                      }}
                      disabled={!selectedCategory}
                    >
                      <SelectTrigger className={`w-full mt-2 ${formik.touched.subcategory && formik.errors.subcategory ? "border-red-500" : ""}`}>
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
                    {formik.touched.subcategory && formik.errors.subcategory && (
                      <div className="text-red-500 text-xs">{formik.errors.subcategory}</div>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={addManufacturerMutation.isLoading || !formik.isValid}
                >
                  {addManufacturerMutation.isLoading ? "Adding..." : "Add Manufacturer"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>Manufacturers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {manufacturers?.data?.manufacturers?.map((manufacturer) => (
                  <div
                    key={manufacturer._id}
                    className="grid grid-cols-4 items-center p-3 border rounded hover:bg-accent"
                  >
                    <img src={manufacturer.image} alt={manufacturer.name} className="w-12 h-12 object-cover rounded" />
                    <span className="font-medium">{manufacturer.name}</span>
                    <span className="text-sm truncate">{manufacturer.description}</span>
                    <div className="flex justify-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(manufacturer._id)}
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this manufacturer? This action cannot be undone.
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

export default Manufacture