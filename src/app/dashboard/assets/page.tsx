import UploadAsset from "@/components/dashboard/upload-asset";
import AssetGrid from "@/components/dashboard/asset-grid";
import { getCategoriesAction, getUserAssetsAction } from "@/actions/dashboard-actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Package, Clock, CheckCircle, XCircle } from "lucide-react";

async function UserAssetsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session === null) return null;

  const [categories, assets] = await Promise.all([
    getCategoriesAction(),
    getUserAssetsAction(session.user.id),
  ]);

  const approvedAssets = assets.filter(asset => asset.isApproved === "approved");
  const pendingAssets = assets.filter(asset => asset.isApproved === "pending");
  const rejectedAssets = assets.filter(asset => asset.isApproved === "rejected");

  return (
    <div className="w-full px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-teal-800">My Assets</h1>
          <p className="text-gray-600 mt-2">Manage and track your uploaded assets</p>
        </div>
        <UploadAsset
          categories={
            categories?.map((cat) => ({
              ...cat,
              id: cat.id.toString(),
            })) || []
          }
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Assets</p>
                <p className="text-2xl font-bold text-gray-900">{assets.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{approvedAssets.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pendingAssets.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{rejectedAssets.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assets Grid */}
      {assets && assets.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">All Assets</h2>
            <p className="text-sm text-gray-500">
              {assets.length} asset{assets.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <AssetGrid 
            assets={assets.map(asset => ({
              ...asset,
              isApproved: asset.isApproved as "approved" | "rejected" | "pending",
              categoryId: asset.categoryId !== undefined && asset.categoryId !== null ? asset.categoryId.toString() : null,
              createdAt: typeof asset.createdAt === "string" ? asset.createdAt : asset.createdAt?.toISOString?.() ?? "",
            }))} 
            categories={categories?.map((cat) => ({
              ...cat,
              id: cat.id.toString(),
            })) || []}
            showActions={true}
          />
        </div>
      ) : (
        <Card className="bg-white shadow-md rounded-xl border">
          <CardContent className="py-20 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No assets uploaded yet
            </h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              Start building your portfolio by uploading your first digital asset. 
              Share your creativity with the community!
            </p>
            <UploadAsset
              categories={
                categories?.map((cat) => ({
                  ...cat,
                  id: cat.id.toString(),
                })) || []
              }
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default UserAssetsPage;
