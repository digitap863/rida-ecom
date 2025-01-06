import Layout from "@/components/layout/Layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteData, getdata } from "../api/req"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const Manufacture = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  // Fetch manufacturers
  const { data: manufacturers = [] } = useQuery({
    queryKey: ["manufacturers"],
    queryFn: () => getdata("/manufacturer"),
  })

  const deleteManufacturerMutation = useMutation({
    mutationFn: (id) => deleteData(`/manufacturer/${id}`),
    onSuccess: () => {
      toast.success("Manufacturer deleted successfully")
      queryClient.invalidateQueries(["manufacturers"])
    },
    onError: (error) => {
      toast.error(`Error occurred: ${error.response?.data?.message || 'Something went wrong'}`)
    }
  })

  const handleDelete = (id) => {
    setItemToDelete(id)
    setIsDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (itemToDelete) {
      await deleteManufacturerMutation.mutateAsync(itemToDelete)
      setItemToDelete(null)
      setIsDialogOpen(false)
    }
  }

  return (
    <Layout>
      <div className="p-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Manufacturers</CardTitle>
              <Button onClick={() => navigate("/add-manufacturer")}>
                Add New Manufacturer
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {manufacturers?.data?.manufacturers?.map((manufacturer) => (
                <div
                  key={manufacturer._id}
                  className="grid grid-cols-4 items-center p-3 border rounded hover:bg-accent"
                >
                  <img 
                    src={manufacturer.image} 
                    alt={manufacturer.name} 
                    className="w-12 h-12 object-cover rounded" 
                  />
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