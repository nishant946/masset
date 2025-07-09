"use client";

import { Plus, Upload } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { uploadAssetAction } from "@/actions/dashboard-actions";
import { toast } from "sonner";





type Category = {
  id: string;
  name: string;
  createdAt: Date;
};

interface UploadDialogProps {
  categories: Category[];
}

type FormState = {
  title: string;
  description: string;
  categoryId: string;
  file: File | null;
};

type CloudinarySignature = {
  signature: string;
  timestamp: number;
  api_key: string;
}

function UploadAsset({ categories }: UploadDialogProps) {
  const [formState, setFormState] = useState<FormState>({
    title: "",
    description: "",
    categoryId: "",
    file: null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressStatus, setUploadProgressStatus] = useState(0);
  const [open, setOpen] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormState((prev) => ({ ...prev, file }));
    }
  };

  const getCloudinarySignature = async (): Promise<CloudinarySignature> => {
    const timestamp = Math.floor(Date.now() / 1000);
    const response = await fetch('/api/cloudinary/signature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({timestamp})
    })
    if (!response.ok) {
      throw new Error('Failed to get cloudinary signature');
    }
    return response.json();
  }


  const handleAssetUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgressStatus(0);
    try {
      const {signature, timestamp, api_key} = await getCloudinarySignature();
      const cloudinaryData = new FormData();
      cloudinaryData.append('file', formState.file as File);
      cloudinaryData.append('folder', 'masset-images');
      cloudinaryData.append('timestamp', timestamp.toString());
      cloudinaryData.append('signature', signature);
      cloudinaryData.append('api_key', api_key);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgressStatus(progress);
        }
      }
      const cloudinaryPromise = new Promise<any>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } else {
            reject(new Error('Upload failed'));
          }
        }
        xhr.onerror = () => {
          reject(new Error('Upload failed'));
        }
      });
      xhr.send(cloudinaryData);
      const cloudinaryResponse = await cloudinaryPromise;
      const formData = new FormData();
             formData.append('title', formState.title);
       formData.append('description', formState.description);
       formData.append('categoryId', formState.categoryId);
       formData.append('fileUrl', cloudinaryResponse.secure_url);
       formData.append('thumbnailUrl', cloudinaryResponse.secure_url);
      

      const result = await uploadAssetAction(formData);
      if(result.success) {
        setOpen(false);
        setFormState({
          title: "",
          description: "",
          categoryId: "",
          file: null,
        })
        toast.success('Asset uploaded successfully');
      } else {
        toast.error('Failed to upload asset');
      }
    } catch (e) {
      console.error('Upload failed:', e);
      toast.error('Failed to upload asset');
    } finally {
      setIsUploading(false);
      setUploadProgressStatus(0);
    } 
  };

  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white shadow-md rounded-lg px-4 py-2">
          <Plus className="w-4 h-4 mr-2" />
          Upload Asset
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-white via-teal-50 to-teal-100 border border-teal-400 rounded-2xl p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-teal-800 text-2xl font-semibold">
            Upload New Asset
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleAssetUpload} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-teal-800 font-medium">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              value={formState.title}
              onChange={handleInputChange}
              placeholder="Enter asset title"
              className="rounded-md border-teal-300 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-teal-800 font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formState.description}
              onChange={handleInputChange}
              placeholder="Write a short description..."
              className="rounded-md border-teal-300 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-teal-800 font-medium">
              Category
            </Label>
            <Select
              value={formState.categoryId}
              onValueChange={(value) =>
                setFormState({ ...formState, categoryId: value })
              }
            >
              <SelectTrigger className="border-teal-300 focus:ring-teal-500 focus:border-teal-500 cursor-pointer">
                <SelectValue placeholder="Select a category"/>
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file" className="text-teal-800 font-medium">
              File
            </Label>
            <Input
              id="file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file:cursor-pointer border-teal-300 file:bg-teal-500 file:text-white file:px-4 file:rounded-md  hover:file:bg-teal-700"
            />
            {formState.file && (
              <p className="text-sm text-teal-700">
                Selected: {formState.file.name}
              </p>
            )}
          </div>

          {isUploading && uploadProgressStatus > 0 && (
            <div className="flex items-center space-x-2">
              <div className="w-full bg-teal-200 rounded-full h-2.5">
                <div className="bg-teal-600 h-2.5 rounded-full" style={{width: `${uploadProgressStatus}%`}}></div>
                <p className="text-teal-700 text-sm">Uploading...</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="submit"
              className="bg-teal-600 cursor-pointer hover:bg-teal-700 text-white rounded-lg px-6 py-2 shadow-md"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Asset
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default UploadAsset;
