"use client";

import { Plus, Upload, Image, FileText, Folder, Loader2 } from "lucide-react";
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
    if (!formState.title.trim() || !formState.categoryId || !formState.file) {
      return;
    }

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
      }
    } catch (e) {
      console.error('Upload failed:', e);
    } finally {
      setIsUploading(false);
      setUploadProgressStatus(0);
    } 
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white shadow-md rounded-lg px-6 py-2">
          <Plus className="w-4 h-4 mr-2" />
          Upload Asset
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] bg-white border-0 shadow-xl rounded-xl">
        <DialogHeader className="pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Upload New Asset
              </DialogTitle>
              <p className="text-gray-600 text-sm">
                Share your digital assets with the community
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleAssetUpload} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Asset Title *
            </Label>
            <Input
              id="title"
              name="title"
              value={formState.title}
              onChange={handleInputChange}
              placeholder="Enter a descriptive title..."
              className="w-full"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formState.description}
              onChange={handleInputChange}
              placeholder="Describe your asset..."
              className="w-full resize-none"
              rows={3}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Folder className="w-4 h-4" />
              Category *
            </Label>
            <Select
              value={formState.categoryId}
              onValueChange={(value) =>
                setFormState({ ...formState, categoryId: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
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

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Image className="w-4 h-4" />
              Asset File *
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-400 transition-colors">
              <Input
                id="file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                required
              />
              <label htmlFor="file" className="cursor-pointer">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <Image className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {formState.file ? formState.file.name : "Click to upload image"}
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </label>
            </div>
            {formState.file && (
              <p className="text-sm text-teal-600 flex items-center gap-1">
                <Image className="w-4 h-4" />
                Selected: {formState.file.name}
              </p>
            )}
          </div>

          {/* Upload Progress */}
          {isUploading && uploadProgressStatus > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Uploading...</span>
                <span className="text-teal-600 font-medium">{uploadProgressStatus}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-teal-600 h-2 rounded-full transition-all duration-300" 
                  style={{width: `${uploadProgressStatus}%`}}
                ></div>
              </div>
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white px-6"
              disabled={isUploading || !formState.title.trim() || !formState.categoryId || !formState.file}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Asset
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default UploadAsset;
