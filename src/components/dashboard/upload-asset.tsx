"use client";

import { Plus, Upload } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

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
}

function UploadAsset({ categories }: UploadDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressStatus, setUploadProgressStatus] = useState(0);
  const [formState, setFormState] = useState<FormState>({
    title: "",
    description: "",
    categoryId: "",
    file: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setFormState((prev) => ({ ...prev, file }));
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Upload Asset
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload New Asset</DialogTitle>
        </DialogHeader>
        <form className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              value={formState.title}
              onChange={handleInputChange}
              id="title"
              name="title"
              placeholder="Title"
              className="border-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              value={formState.description}
              onChange={handleInputChange}
              id="description"
              name="description"
              placeholder="Description"
              className="border-gray-300"
            />
          </div>
          <div className="space-y-2"> 
            <Label htmlFor="category">Category</Label>
            <Select value={formState.categoryId} onValueChange={(value) => setFormState({ ...formState, categoryId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <Input
              id="file"
              value={formState.file?.name || ""}
              accept="image/*"
              type="file"
              onChange={handleFileChange}
            />
          </div>

          </div>
          <DialogFooter>
            <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white">
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
