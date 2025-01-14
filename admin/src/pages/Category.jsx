import Layout from "@/components/layout/Layout"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteData, getdata, postData, putForm } from "../api/req"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { useState } from "react"


const validationSchema = Yup.object({
    name: Yup.string()
        .required("Category name is required")
        .min(2, "Category name must be at least 2 characters"),
    image: Yup.mixed()
        .test("fileRequired", "Image is required", function (value) {
            // Only require image for new categories, not for updates
            return !this.parent.id || value instanceof File;
        })
});

const AddCategory = () => {
    // Single query for categories
    const { data: categories = [] } = useQuery({
        queryKey: ["category"],
        queryFn: () => getdata("/category"),
    });
    const queryClient = useQueryClient();
    const addCategoryMutation = useMutation({
        mutationFn: (data) => postData("/category", data),
        onError: (error) => {
            toast.error(`Error occurred: ${error.response?.data?.message || 'Something went wrong'}`);
        },
        onSuccess: () => {
            toast.success("Category added successfully");
            queryClient.invalidateQueries(["category"]);
        }
    });

    const deleteCategoryMutation = useMutation({
        mutationFn: (id) => deleteData(`/category/${id}`),
        onError: (error) => {
            toast.error(`Error occurred: ${error.response?.data?.message || 'Something went wrong'}`);
        },
        onSuccess: () => {
            toast.success("Category deleted successfully");
            queryClient.invalidateQueries(["category"]);
        }
    });

    const updateCategoryMutation = useMutation({
        mutationFn: ({ id, data }) => putForm(`/category/${id}`, data),
        onError: (error) => {
            toast.error(`Error occurred: ${error.response?.data?.message || 'Something went wrong'}`);
        },
        onSuccess: () => {
            toast.success("Category updated successfully");
            queryClient.invalidateQueries(["category"]);
            setIsEditMode(false);
            setEditingCategory(null);
            formik.resetForm();
        }
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            image: null,
        },
        validationSchema,
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append("name", values.name);
            
            // Check if there's a new image file selected
            if (values.image instanceof File) {
                formData.append("image", values.image);
            }
            
            try {
                if (isEditMode && editingCategory) {
                    await updateCategoryMutation.mutateAsync({
                        id: editingCategory._id,
                        data: formData
                    });
                } else {
                    await addCategoryMutation.mutateAsync(formData);
                }
                formik.resetForm();
            } catch (error) {
                console.error("Error:", error);
            }
        },
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

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

    const handleEdit = (category) => {
        setEditingCategory(category);
        setIsEditMode(true);
        formik.setValues({
            name: category.name,
            image: category.image
        });
    }

    const handleFileChange = (event) => {
        const file = event.currentTarget.files[0];
        formik.setFieldValue("image", file);
    };

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
                                <div className="space-y-2">
                                    <label htmlFor="image" className="text-sm font-medium">
                                        Image
                                    </label>
                                    <Input
                                        id="image"
                                        name="image"
                                        onChange={handleFileChange}
                                        onBlur={formik.handleBlur}
                                        type="file"
                                        className={`${formik.touched.image && formik.errors.image ? "border-red-500" : ""}`}
                                        disabled={addCategoryMutation.isLoading || updateCategoryMutation.isLoading}
                                    />
                                    <label htmlFor="name" className="text-sm font-medium">
                                        Category Name
                                    </label>
                                    <Input
                                        id="name"
                                        name="name"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.name}
                                        className={`${formik.touched.name && formik.errors.name ? "border-red-500" : ""}`}
                                        disabled={addCategoryMutation.isLoading}
                                    />
                                    {formik.touched.name && formik.errors.name && (
                                        <div className="text-red-500 text-xs">{formik.errors.name}</div>
                                    )}
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={addCategoryMutation.isPending || updateCategoryMutation.isPending || !formik.isValid}
                                >
                                    {isEditMode 
                                        ? (updateCategoryMutation.isPending ? "Updating..." : "Update Category")
                                        : (addCategoryMutation.isPending ? "Adding..." : "Add Category")
                                    }
                                </Button>
                                {isEditMode && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full mt-2"
                                        onClick={() => {
                                            setIsEditMode(false);
                                            setEditingCategory(null);
                                            formik.resetForm();
                                            document.getElementById("image").value = "";
                                        }}
                                    >
                                        Cancel Edit
                                    </Button>
                                )}
                            </form>
                        </CardContent>
                    </Card>
                </div>
                <div className="w-2/3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Categories</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <table className="w-full">
                                    <thead className="bg-muted/50">
                                        <tr className="border-b">
                                            <th className="h-12 px-4 text-left align-middle font-medium">Image</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories?.data?.categories?.map((category) => (
                                            <tr
                                                key={category._id}
                                                className="border-b transition-colors hover:bg-muted/50"
                                            >
                                                <td className="p-4">
                                                    <img 
                                                        src={category.image} 
                                                        alt={category.name} 
                                                        className="h-16 w-16 rounded-md object-cover"
                                                    />
                                                </td>
                                                <td className="p-4 align-middle font-medium">
                                                    {category.name}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEdit(category)}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDelete(category._id)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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

export default AddCategory;
