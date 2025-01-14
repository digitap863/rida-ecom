import Layout from "@/components/layout/Layout"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getdata, postForm, putForm } from "../api/req"
import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useLocation, useNavigate } from "react-router-dom"



const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isEdit = location.state?.isEdit || false;
  const editingProduct = location.state?.product;

  const [selectedCategory, setSelectedCategory] = useState(editingProduct?.category?._id || '');
  const [selectedSubcategory, setSelectedSubcategory] = useState(editingProduct?.subcategory?._id || '');
  const [previewImages, setPreviewImages] = useState(editingProduct?.image || []);
  const [imageFiles, setImageFiles] = useState([]);
  const [removedImageIndexes, setRemovedImageIndexes] = useState([]);

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

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      data.append('removedImageIndexes', JSON.stringify(removedImageIndexes));
      return putForm(`/product/${id}`, data);
    },
    onSuccess: () => {
      toast.success("Product updated successfully");
      queryClient.invalidateQueries(["products"]);
      navigate("/products");
    },
    onError: (error) => {
      toast.error(`Error occurred: ${error.response?.data?.message || 'Something went wrong'}`);
    }
  });

  const formik = useFormik({
    initialValues: {
      name: editingProduct?.name || "",
      partNumber: editingProduct?.partNumber || "",
      manufacturer: editingProduct?.manufacturer?._id || "",
      category: editingProduct?.category?._id || "",
      subcategory: editingProduct?.subcategory?._id || "",
      model: editingProduct?.model || "",
      description: editingProduct?.description || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      partNumber: Yup.string().required("Part number is required"),
      image: Yup.mixed().test(
        "imageRequired",
        "At least one image is required",
        function() {
          const totalImages = previewImages.length - removedImageIndexes.length;
          return totalImages > 0;
        }
      ),
      manufacturer: Yup.string().required("Manufacturer is required"),
      category: Yup.string().required("Category is required"),
      subcategory: Yup.string().required("Subcategory is required"),
      model: Yup.string().required("Model is required"),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();

      // Add form values
      Object.keys(values).forEach(key => {
        if (key !== 'image') {
          formData.append(key, values[key]);
        }
      });

      // Add new image files
      imageFiles.forEach(file => {
        formData.append("files", file);
      });

      try {
        if (isEdit) {
          await updateProductMutation.mutateAsync({
            id: editingProduct._id,
            data: formData
          });
        } else {
          await addProductMutation.mutateAsync(formData);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (previewImages.length >= 3) {
      toast.error("Maximum 3 images allowed");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPreviewImages(prev => [...prev, previewUrl]);
    setImageFiles(prev => [...prev, file]);
    event.target.value = '';
  };

  const handleRemoveImage = (index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));

    // If it's a new image (from imageFiles)
    if (index >= (editingProduct?.image?.length || 0)) {
      const adjustedIndex = index - (editingProduct?.image?.length || 0);
      setImageFiles(prev => prev.filter((_, i) => i !== adjustedIndex));
    } else {
      // If it's an existing image
      setRemovedImageIndexes(prev => [...prev, index]);
    }
  };

  // Clean up preview URLs
  useEffect(() => {
    return () => {
      previewImages.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previewImages]);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{isEdit ? "Edit Product" : "Add New Product"}</CardTitle>
              <Button onClick={() => navigate("/products")}>
                Back to Products
              </Button>
            </div>

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
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Images ({previewImages.length - removedImageIndexes.length}/3)
                  </label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={previewImages.length - removedImageIndexes.length >= 3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {previewImages.map((image, index) => (
                    <div key={index} className="relative">
                      <div className="relative w-fit border border-gray-300 rounded-lg">
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                          onClick={() => handleRemoveImage(index)}
                        >
                          ×
                        </Button>
                      </div>
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
                disabled={isEdit ? updateProductMutation.isPending : addProductMutation.isPending}
              >
                {isEdit
                  ? (updateProductMutation.isPending ? "Updating..." : "Update Product")
                  : (addProductMutation.isPending ? "Adding..." : "Add Product")
                }
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default Products