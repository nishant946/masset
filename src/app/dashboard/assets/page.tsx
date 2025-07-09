import UploadAsset from "@/components/dashboard/upload-asset";
import AssetGrid from "@/components/dashboard/asset-grid";
import { getCategoriesAction, getUserAssetsAction } from "@/actions/dashboard-actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function UserAssetsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session === null) return null;

  const [categories, assets] = await Promise.all([
    getCategoriesAction(),
    getUserAssetsAction(session.user.id),
  ]);

  return (
    <div className="w-full px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-teal-800">My Assets</h1>
        <UploadAsset
          categories={
            categories?.map((cat) => ({
              ...cat,
              id: cat.id.toString(),
            })) || []
          }
        />
      </div>

      {/* Grid or fallback */}
      {assets && assets.length > 0 ? (
        <AssetGrid 
          assets={assets.map(asset => ({
            ...asset,
            isApproved: asset.isApproved as "approved" | "rejected" | "pending"
          }))} 
        />
      ) : (
        <div className="text-center py-12 text-gray-500 text-lg">
          You haven't uploaded any assets yet.
        </div>
      )}
    </div>
  );
}

export default UserAssetsPage;
