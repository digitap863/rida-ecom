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
import { Textarea } from "@/components/ui/textarea"

// Update validation schema
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  partNumber: Yup.string().required("Part number is required"),
  image: Yup.mixed().required("Image is required"),
  manufacturer: Yup.string().required("Manufacturer is required"),
  category: Yup.string().required("Category is required"),
  subcategory: Yup.string().required("Subcategory is required"),
  model: Yup.string().required("Model is required"),
  description: Yup.string().required("Description is required"),
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
      image: [],
      manufacturer: "",
      category: "",
      subcategory: "",
      model: "",
      description: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("partNumber", values.partNumber);
      formData.append("name", values.name);
      values.image.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("manufacturer", values.manufacturer);
      formData.append("category", selectedCategory);
      formData.append("subcategory", selectedSubcategory);
      formData.append("model", values.model);
      formData.append("description", values.description);

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
                <label htmlFor="model">Model</label>
                <Input
                  id="model"
                  name="model"
                  value={formik.values.model}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.model && formik.errors.model ? "border-red-500" : ""}
                />
                {formik.touched.model && formik.errors.model && (
                  <div className="text-red-500 text-xs">{formik.errors.model}</div>
                )}
              </div>
              <div>
                <label htmlFor="description">Description</label>
                <Textarea
                  id="description"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.description && formik.errors.description ? "border-red-500" : ""}
                  multiline={true}
                  rows={4}
                />
                {formik.touched.description && formik.errors.description && (
                  <div className="text-red-500 text-xs">{formik.errors.description}</div>
                )}
              </div>
              <div>
                <label htmlFor="image">Images (Select up to 3)</label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(event) => {
                    const files = Array.from(event.currentTarget.files).slice(0, 3);
                    formik.setFieldValue("image", files);
                  }}
                  onBlur={formik.handleBlur}
                  className={formik.touched.image && formik.errors.image ? "border-red-500" : ""}
                />
                {formik.touched.image && formik.errors.image && (
                  <div className="text-red-500 text-xs">{formik.errors.image}</div>
                )}

                <div className="mt-4 flex gap-4">
                  {formik.values.image && Array.from(formik.values.image).map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        onClick={() => {
                          const newFiles = Array.from(formik.values.image).filter((_, i) => i !== index);
                          formik.setFieldValue("image", newFiles);
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
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