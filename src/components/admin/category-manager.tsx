"use client";

import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";


type Category = {
  id: number;
  name: string;
  createdAt: Date
}
interface CategoryManagerProps { 
  categories: Category[];
}  

const handleAddNewCategory = async(event : React.FormEvent) => {
  event.preventDefault();

  try {
    const formData = new FormData()
    formData.append("name", newCategoryName);
    
  } catch (error) {
    
  }
  };


function CategoryManager({categories: initialCategories} : CategoryManagerProps) {

  const [categories , setCategories] =  useState<Category[]>(initialCategories);
  const [newCategoryName, setNewCategoryName] = useState("");

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddNewCategory} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="categoryName">New Category</Label>
          <div className="flex gap-2">
            <Input
              type="text"
              id="categoryName"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              className="border border-gray-300 p-1.5 rounded-md w-full"
            />
            <Button
              type="submit"
              className="bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-md"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
export default CategoryManager;
function setNewCategoryName(arg0: string) {
  throw new Error("Function not implemented.");
}

function setCategories(arg0: any[]) {
  throw new Error("Function not implemented.");
}

