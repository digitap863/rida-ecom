import Layout from "@/components/layout/Layout"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteData, getdata, postData } from "@/api/req"
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
})

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

    const formik = useFormik({
        initialValues: {
            name: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            // Format the category data
            const categoryData = {
                name: values.name,
                category: values.name.toLowerCase().replace(/\s+/g, "-")
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
                                <div className="space-y-2">
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
                                    disabled={addCategoryMutation.isPending || !formik.isValid}
                                >
                                    {addCategoryMutation.isPending ? "Adding..." : "Add Category"}
                                </Button>
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
                            <div className="space-y-2">
                                {categories?.data?.categories?.map((category) => (
                                    <div
                                        key={category._id}
                                        className="flex items-center justify-between p-3 border rounded hover:bg-accent"
                                    >
                                        <span className="font-medium">{category.name}</span>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(category._id)}
                                        >
                                            Delete
                                        </Button>
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

export default AddCategory;
