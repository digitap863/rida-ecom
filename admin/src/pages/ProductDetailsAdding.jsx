import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getdata, putForm, uploadImage } from '@/api/req';
import Layout from '@/components/layout/Layout';
import { Editor } from '@tinymce/tinymce-react';

// Import shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from 'sonner';
const editorConfig = {
  height: 500,
  menubar: true,
  plugins: [
    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'media', 'table', 'help', 'wordcount'
  ],
  toolbar: 'undo redo | blocks | ' +
    'bold italic forecolor | alignleft aligncenter ' +
    'alignright alignjustify | bullist numlist outdent indent | ' +
    'removeformat | table image | help',
  images_upload_handler: async (blobInfo) => {
    try {
      const formData = new FormData();
      formData.append('image', blobInfo.blob(), blobInfo.filename());
      
      const result = await uploadImage(formData);
      
      if (!result.location) {
        throw new Error('Upload failed: No location returned');
      }
      
      console.log('Upload successful:', result);
      return result.location;
    } catch (error) {
      console.error('Upload error details:', error);
      throw new Error(`Image upload failed: ${error.message}`);
    }
  },
  // Updated table configurations
  table_default_attributes: {
    border: '1'
  },
  table_default_styles: {
    'border-collapse': 'collapse',
    'width': '100%'
  },
  table_sizing_mode: 'fixed',
  table_toolbar: 'tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
  content_style: `
    table {
      width: 100%;
      border-collapse: collapse;
    }
    table td, table th {
      border: 1px solid #ccc;
      padding: 0.4rem;
    }
  `
};

const ProductDetailsAdding = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  
  const [specifications, setSpecifications] = useState('');
  const [technicalData, setTechnicalData] = useState('');
  const [videoLink, setVideoLink] = useState('');

  // Fetch existing product data
  const { data: product } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getdata(`/products/${id}`)
  });

  // Mutation for updating product details
  const updateMutation = useMutation({
    mutationFn: (data) => putForm(`/products/${id}/details`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', id] })
      toast.success('Product details updated successfully');
    },
    onError: (error) => {
      toast.error(`Error occurred: ${error.response?.data?.message || 'Something went wrong'}`);
    }
  });

  // Form submission handlers
  const handleSpecificationsSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate({ specifications });
  };

  const handleTechnicalDataSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate({ technicalData });
  };

  const handleVideoSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate({ videoLink });
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Product Details - {product?.data?.product?.name}</h1>

        <Tabs defaultValue="specifications" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="technical-data">Technical Data</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
          </TabsList>

          {/* Specifications Tab */}
          <TabsContent value="specifications">
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSpecificationsSubmit} className="space-y-4">
                  <Editor
                    apiKey="hcrrth1lpac35dpiup1dyp187brl4ulzcwgzs8tjh7qt4vab"
                    value={specifications || product?.data?.product?.specifications}
                    onEditorChange={(content) => setSpecifications(content)}
                    init={editorConfig}
                  />
                  <Button 
                    type="submit" 
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? 'Saving...' : 'Save Specifications'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Technical Data Tab */}
          <TabsContent value="technical-data">
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleTechnicalDataSubmit} className="space-y-4">
                  <Editor
                    apiKey="hcrrth1lpac35dpiup1dyp187brl4ulzcwgzs8tjh7qt4vab"
                    value={ technicalData || product?.data?.product?.technicalData}
                    onEditorChange={(content) => setTechnicalData(content)}
                    init={editorConfig}
                  />
                  <Button type="submit">Save Technical Data</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Video Tab */}
          <TabsContent value="video">
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleVideoSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">YouTube Embed Link</label>
                    <Input
                      type="text"
                      value={videoLink || product?.data?.product?.videoLink}
                      onChange={(e) => setVideoLink(e.target.value)}
                      placeholder="e.g., https://www.youtube.com/embed/..."
                    />
                    <p className="text-sm text-muted-foreground">
                      Please enter the embedded video link from YouTube (click share → embed → copy src URL)
                    </p>
                  </div>
                  
                  {videoLink && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">Preview:</h3>
                      <div className="aspect-video">
                        <iframe
                          className="w-full h-full"
                          src={videoLink || product?.data?.product?.videoLink}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  )}
                  
                  <Button type="submit">Save Video Link</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ProductDetailsAdding;