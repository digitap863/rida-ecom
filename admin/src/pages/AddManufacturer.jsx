import Layout from "@/components/layout/Layout"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getdata, postForm } from "../api/req"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNavigate } from "react-router-dom"

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

const AddManufacturer = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState('')

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
      const formData = new FormData()
      formData.append("name", values.name)
      formData.append("description", values.description)
      formData.append("image", values.image)
      formData.append("category", selectedCategory)
      formData.append("subcategory", selectedSubcategory)
      try {
        await addManufacturerMutation.mutateAsync(formData)
      } catch (error) {
        console.error("Error adding manufacturer:", error)
      }
    },
  })

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Add New Manufacturer</CardTitle>
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
                  Image
                </label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  onChange={(event) => {
                    formik.setFieldValue("image", event.currentTarget.files[0])
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
                disabled={addManufacturerMutation.isPending}
              >
                {addManufacturerMutation.isPending ? "Adding..." : "Add Manufacturer"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default AddManufacturer
