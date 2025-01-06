import Layout from "@/components/layout/Layout"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getdata, postForm } from "../api/req"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNavigate } from "react-router-dom"

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Subcategory name is required")
    .min(2, "Subcategory name must be at least 2 characters"),
  category: Yup.string().required("Category is required"),
  image: Yup.mixed().required("Image is required"),
})

const AddSubcategory = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: categories = [] } = useQuery({
    queryKey: ["category"],
    queryFn: () => getdata("/category"),
  })

  const addCategoryMutation = useMutation({
    mutationFn: (data) => postForm("/subcategory", data),
    onSuccess: () => {
      toast.success("Subcategory added successfully")
      queryClient.invalidateQueries(["subcategory"])
      navigate("/subcategories") // Navigate back to subcategories list
    },
    onError: (error) => {
      toast.error(`Error occurred: ${error.response?.data?.message || 'Something went wrong'}`)
    }
  })

  const formik = useFormik({
    initialValues: {
      name: "",
      category: "",
      image: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData()
      formData.append("name", values.name)
      formData.append("categoryId", values.category)
      formData.append("image", values.image)
      try {
        await addCategoryMutation.mutateAsync(formData)
      } catch (error) {
        console.error("Error adding category:", error)
      }
    },
  })

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Add New Subcategory</CardTitle>
              <Button variant="outline" onClick={() => navigate("/subcategory")}>
                Back to List
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium">Select Category</label>
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

              <Button
                type="submit"
                className="w-full"
                disabled={addCategoryMutation.isPending || !formik.isValid || !formik.dirty}
              >
                {addCategoryMutation.isPending ? "Adding..." : "Add Subcategory"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default AddSubcategory
