import Layout from "@/components/layout/Layout"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getdata, postForm, putForm } from "../api/req"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Subcategory name is required")
    .min(2, "Subcategory name must be at least 2 characters"),
  category: Yup.string().required("Category is required"),
  image: Yup.mixed()
    .test("fileRequired", "Image is required", function (value) {
      // Image is only required for new subcategories
      return !this.parent.isEdit || value instanceof File || this.parent.existingImage;
    }),
})

const AddSubcategory = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const location = useLocation()
  const [previewImage, setPreviewImage] = useState(null);

  // Get edit state and subcategory data from navigation
  const isEdit = location.state?.isEdit || false
  const editingSubcategory = location.state?.subcategory

  const { data: categories = [] } = useQuery({
    queryKey: ["category"],
    queryFn: () => getdata("/category"),
  })

  const addSubcategoryMutation = useMutation({
    mutationFn: (data) => postForm("/subcategory", data),
    onSuccess: () => {
      toast.success("Subcategory added successfully")
      queryClient.invalidateQueries(["subcategory"])
      navigate("/subcategory")
    },
    onError: (error) => {
      toast.error(`Error occurred: ${error.response?.data?.message || 'Something went wrong'}`)
    }
  })

  const updateSubcategoryMutation = useMutation({
    mutationFn: ({ id, data }) => putForm(`/subcategory/${id}`, data),
    onSuccess: () => {
      toast.success("Subcategory updated successfully")
      queryClient.invalidateQueries(["subcategory"])
      navigate("/subcategory")
    },
    onError: (error) => {
      toast.error(`Error occurred: ${error.response?.data?.message || 'Something went wrong'}`)
    }
  })

  const formik = useFormik({
    initialValues: {
      name: editingSubcategory?.name || "",
      category: editingSubcategory?.category?._id || "",
      image: editingSubcategory?.image || null,
      isEdit: isEdit,
      existingImage: editingSubcategory?.image || null, // Track existing image
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData()
      formData.append("name", values.name)
      formData.append("categoryId", values.category)
      if (values.image) {
        formData.append("image", values.image)
      }
      formData.append("subcategory", values.name.toLowerCase().replace(/\s+/g, "-"))

      try {
        if (isEdit) {
          await updateSubcategoryMutation.mutateAsync({
            id: editingSubcategory._id,
            data: formData,
          })
        } else {
          await addSubcategoryMutation.mutateAsync(formData)
        }
      } catch (error) {
        console.error("Error:", error)
      }
    },
  })

  // Handle file input change with preview
  const handleImageChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      formik.setFieldValue("image", file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    }
  };

  // Cleanup preview URL on component unmount
  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{isEdit ? "Edit Subcategory" : "Add New Subcategory"}</CardTitle>
              <Button variant="outline" onClick={() => navigate("/subcategory")}>
                Back to List
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="category" className="text-sm font-medium">Select Category</label>
                <Select
                  name="category"
                  value={formik.values.category}
                  onValueChange={(value) => formik.setFieldValue('category', value)}
                  onBlur={formik.handleBlur}
                >
                  <SelectTrigger className={`w-full mt-2 ${formik.touched.category && formik.errors.category ? "border-red-500" : ""}`}>
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
                {formik.touched.category && formik.errors.category && (
                  <div className="text-red-500 text-xs">{formik.errors.category}</div>
                )}
              </div>

              <div>
                <label htmlFor="name" className="text-sm font-medium">
                  Subcategory Name
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
                <label htmlFor="image" className="text-sm font-medium">
                  {isEdit ? "Update Image" : "Image"}
                </label>
                {isEdit && (
                  <div className="mt-2 mb-2">
                    <img 
                      src={previewImage || editingSubcategory.image} 
                      alt={formik.values.name || "Preview"} 
                      className="w-32 h-32 object-cover rounded-md"
                    />
                  </div>
                )}
                <Input
                  id="image"
                  name="image"
                  type="file"
                  onChange={handleImageChange}
                  onBlur={formik.handleBlur}
                  className={`mt-2 ${formik.touched.image && formik.errors.image ? "border-red-500" : ""}`}
                />
                {formik.touched.image && formik.errors.image && (
                  <div className="text-red-500 text-xs">{formik.errors.image}</div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={
                  (isEdit ? updateSubcategoryMutation.isPending : addSubcategoryMutation.isPending) || 
                  !formik.isValid || 
                  // (!isEdit && !formik.values.image)
                  (!formik.dirty && !formik.values.image)
                }
              >
                {isEdit 
                  ? (updateSubcategoryMutation.isPending ? "Updating..." : "Update Subcategory")
                  : (addSubcategoryMutation.isPending ? "Adding..." : "Add Subcategory")
                }
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default AddSubcategory
