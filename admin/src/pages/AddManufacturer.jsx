import Layout from "@/components/layout/Layout"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getdata, postForm, putForm } from "../api/req"
import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNavigate, useLocation } from "react-router-dom"



const AddManufacturer = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  
  // Get edit state and manufacturer data
  const isEdit = location.state?.isEdit || false
  const editingManufacturer = location.state?.manufacturer

  const [selectedCategory, setSelectedCategory] = useState(editingManufacturer?.category || '')
  const [selectedSubcategory, setSelectedSubcategory] = useState(editingManufacturer?.subcategory || '')
  const [previewImage, setPreviewImage] = useState(null)

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getdata("/category"),
  })

  const { data: subcategories = [] } = useQuery({
    queryKey: ["subcategories", selectedCategory],
    queryFn: () => getdata(`/category/${selectedCategory}`),
    enabled: !!selectedCategory
  })

  const addManufacturerMutation = useMutation({
    mutationFn: (data) => postForm("/manufacturer", data),
    onSuccess: () => {
      toast.success("Manufacturer added successfully")
      queryClient.invalidateQueries(["manufacturers"])
      navigate("/manufacturer")
    },
    onError: (error) => {
      toast.error(`Error occurred: ${error.response?.data?.message || 'Something went wrong'}`)
    }
  })

  const updateManufacturerMutation = useMutation({
    mutationFn: ({ id, data }) => putForm(`/manufacturer/${id}`, data),
    onSuccess: () => {
      toast.success("Manufacturer updated successfully")
      queryClient.invalidateQueries(["manufacturers"])
      navigate("/manufacturer")
    },
    onError: (error) => {
      toast.error(`Error occurred: ${error.response?.data?.message || 'Something went wrong'}`)
    }
  })

  const formik = useFormik({
    initialValues: {
      name: editingManufacturer?.name || "",
      description: editingManufacturer?.description || "",
      image: editingManufacturer?.image || null,
      category: editingManufacturer?.category || "",
      subcategory: editingManufacturer?.subcategory || "",
      isEdit: isEdit,
      existingImage: editingManufacturer?.image || null,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Manufacturer name is required")
        .min(2, "Name must be at least 2 characters"),
      description: Yup.string()
        .required("Description is required")
        .min(10, "Description must be at least 10 characters"),
      image: Yup.mixed()
        .test("fileRequired", "Image is required", function (value) {
          return !this.parent.isEdit || value instanceof File || this.parent.existingImage;
        }),
      category: Yup.string().required("Category is required"),
      subcategory: Yup.string().required("Subcategory is required"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData()
      formData.append("name", values.name)
      formData.append("description", values.description)
      formData.append("category", selectedCategory)
      formData.append("subcategory", selectedSubcategory)
      
      if (values.image) {
        formData.append("image", values.image)
      }

      try {
        if (isEdit) {
          await updateManufacturerMutation.mutateAsync({
            id: editingManufacturer._id,
            data: formData,
          })
        } else {
          await addManufacturerMutation.mutateAsync(formData)
        }
      } catch (error) {
        console.error("Error:", error)
      }
    },
  })

  const handleImageChange = (event) => {
    const file = event.currentTarget.files[0]
    if (file) {
      formik.setFieldValue("image", file)
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage)
      }
    }
  }, [previewImage])

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                {isEdit ? "Edit Manufacturer" : "Add New Manufacturer"}
              </CardTitle>
              <Button variant="outline" onClick={() => navigate("/manufacturer")}>
                Back to List
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
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
                  {isEdit ? "Update Image" : "Image"}
                </label>
                {isEdit && (
                  <div className="mt-2 mb-2">
                    <img 
                      src={previewImage || editingManufacturer.image} 
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

              <div>
                <label>Category</label>
                <Select
                  name="category"
                  value={selectedCategory}
                  onValueChange={(value) => {
                    setSelectedCategory(value)
                    setSelectedSubcategory('')
                    formik.setFieldValue('subcategory', '')
                    formik.setFieldValue('category', value)
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
                    setSelectedSubcategory(value)
                    formik.setFieldValue('subcategory', value)
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
                {formik.touched.subcategory && formik.errors.subcategory && (
                  <div className="text-red-500 text-xs">{formik.errors.subcategory}</div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={
                  (isEdit ? updateManufacturerMutation.isPending : addManufacturerMutation.isPending) || 
                  !formik.isValid || 
                  (!isEdit && !formik.values.image)
                }
              >
                {isEdit 
                  ? (updateManufacturerMutation.isPending ? "Updating..." : "Update Manufacturer")
                  : (addManufacturerMutation.isPending ? "Adding..." : "Add Manufacturer")
                }
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default AddManufacturer
