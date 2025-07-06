import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { User, Users } from "lucide-react";
import CategoryManager from "@/components/admin/category-manager";
import { File } from "lucide-react";
import { getAllCategoriesAction, getTotalUserCountAction } from "@/actions/admin-actions";

 async function SettingsPage() {

  const [categories , userCount] = await Promise.all([
    getAllCategoriesAction(),
    getTotalUserCountAction()
  ])

  return (
    <div className="container py-18 px-4 mx-auto">
    <div className="flex items-center gap-3 mb-8">
      <span className="inline-flex items-center justify-center rounded-full bg-teal-100 p-3">
        <User className="h-7 w-7 text-teal-600" />
      </span>
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
        Admin Settings
      </h1>
    </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-7">
        <Card className="bg-gradient-to-br from-white via-teal-50 to-teal-100 p-6 shadow-lg rounded-xl transition-transform hover-shadow-xl ">
          <CardHeader className="p-0 mb-4 flex flex-col items-start">
            <div className="flex items-center mb-2">
              <span className="inline-flex items-center justify-center rounded-full bg-teal-100 p-2 mr-3">
            <Users className="h-6 w-6 text-teal-600" />
              </span>
              <CardTitle className="text-xl font-semibold text-gray-800">
            Total Users
              </CardTitle>
            </div>
            <CardDescription className="text-gray-500">
              All registered users on the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-end justify-between mt-2">
            <p className="text-4xl font-extrabold text-teal-700">{userCount}</p>
          </CardContent>
        </Card>
         <Card className="bg-gradient-to-br from-white via-teal-50 to-teal-100 p-6 shadow-lg rounded-xl transition-transform hover-shadow-xl ">
          <CardHeader className="p-0 mb-4 flex flex-col items-start">
            <div className="flex items-center mb-2">
              <span className="inline-flex items-center justify-center rounded-full bg-teal-100 p-2 mr-3">
            <File className="h-6 w-6 text-teal-600" />
              </span>
              <CardTitle className="text-xl font-semibold text-gray-800">
            Total Assets
              </CardTitle>
            </div>
            <CardDescription className="text-gray-500">
              All uploaded assets on the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-end justify-between mt-2">
            <p className="text-4xl font-extrabold text-teal-700">
              {Array.isArray(categories)
                ? categories.length
                : categories?.categories?.length ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>
        <Card className="bg-gradient-to-br from-white via-teal-50 to-teal-100 p-6 shadow-lg rounded-xl transition-transform hover:shadow-xl">
          <CardHeader className="p-0 mb-4 flex flex-col items-start">
            <div className="flex items-center mb-2">
              <span className="inline-flex items-center justify-center rounded-full bg-teal-100 p-2 mr-3">
          <File className="h-6 w-6 text-teal-600" />
              </span>
              <CardTitle className="text-xl font-semibold text-gray-800">
          Category Management
              </CardTitle>
            </div>
            <CardDescription className="text-gray-500">
              Manage categories and subcategories.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-2">
            <CategoryManager categories={
              Array.isArray(categories)
                ? categories
                : categories?.categories ?? []
            } />
          </CardContent>
        </Card>
    </div>
  );
}
export default SettingsPage;
