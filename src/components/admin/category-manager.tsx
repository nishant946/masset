"use client";

import { Plus, Trash2, Folder, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import { addNewCategoryAction, deleteCategoryAction } from "@/actions/admin-actions";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "../ui/badge";

type Category = {
  id: number;
  name: string;
  createdAt: Date;
};

interface CategoryManagerProps {
  categories: Category[];
}

function CategoryManager({ categories: initialCategories }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddNewCategory = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newCategoryName.trim()) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", newCategoryName);

      const result = await addNewCategoryAction(formData);

      if (result.success) {
        const newCategory = {
          id: Math.max(0, ...categories.map((c) => c.id)) + 1,
          name: newCategoryName,
          createdAt: new Date(),
        };
        setCategories([...categories, newCategory]);
        setNewCategoryName("");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (currentCategoryIdToDelete: number) => {
    if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) return;

    try {
      const result = await deleteCategoryAction(currentCategoryIdToDelete);
      if (result.success) {
        setCategories(categories.filter((c) => c.id !== currentCategoryIdToDelete));
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Category Form */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Folder className="w-5 h-5 text-teal-600" />
          <h3 className="text-lg font-semibold text-gray-800">Add New Category</h3>
        </div>
        
        <form onSubmit={handleAddNewCategory} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="categoryName" className="text-sm font-medium text-gray-700">
              Category Name
            </Label>
            <div className="flex gap-3">
              <Input
                type="text"
                id="categoryName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white px-6"
                disabled={isLoading || !newCategoryName.trim()}
              >
                <Plus className="h-4 w-4 mr-2" />
                {isLoading ? "Adding..." : "Add Category"}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Folder className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">Categories</h3>
              <Badge variant="secondary" className="bg-teal-100 text-teal-700">
                {categories.length}
              </Badge>
            </div>
          </div>
        </div>

        {categories.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No categories yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Add your first category above to start organizing assets by category.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">Category Name</TableHead>
                  <TableHead className="font-semibold text-gray-700">Created</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category, index) => (
                  <TableRow key={category.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <TableCell className="font-medium text-gray-800">
                      {category.name}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(category.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        onClick={() => handleDeleteCategory(category.id)} 
                        variant="ghost" 
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryManager;
