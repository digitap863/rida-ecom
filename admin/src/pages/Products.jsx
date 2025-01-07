import Layout from "@/components/layout/Layout"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getdata, postForm } from "../api/req"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Update validation schema
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  partNumber: Yup.string().required("Part number is required"),
  image: Yup.mixed().required("Image is required"),
  manufacturer: Yup.string().required("Manufacturer is required"),
  category: Yup.string().required("Category is required"),
  subcategory: Yup.string().required("Subcategory is required"),
});

const Products = () => {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getdata("/category"),
  });
  
  const { data: subcategories = [] } = useQuery({
    queryKey: ["subcategories", selectedCategory],
    queryFn: () => getdata(`/category/${selectedCategory}`),
    enabled: !!selectedCategory
  });
  
  const { data: manufacturers = [] } = useQuery({
    queryKey: ["manufacturers", selectedSubcategory],
    queryFn: () => getdata(`/subcategory/${selectedSubcategory}`),
    enabled: !!selectedSubcategory
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

  const formik = useFormik({
    initialValues: {
      name: "",
      partNumber: "",
      image: null,
      manufacturer: "",
      category: "",
      subcategory: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("partNumber", values.partNumber);
      formData.append("name", values.name);
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

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name">Name</label>
                <Input
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.name && formik.errors.name ? "border-red-500" : ""}
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="text-red-500 text-xs">{formik.errors.name}</div>
                )}
              </div>

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
    </Layout>
  )
}

export default Products