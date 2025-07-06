import UploadAsset from "@/components/dashboard/upload-asset";
import AssetGrid from "@/components/dashboard/asset-grid";
import { getCategoriesAction} from "@/actions/dashboard-actions";

async function UserAssetsPage() {

    const [categories] = await Promise.all([getCategoriesAction()]);

    return (
        <div className="container py-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">My Assets</h1>
                <UploadAsset categories={categories?.map(cat => ({
                    ...cat,
                    id: cat.id.toString()
                })) || []} />
            </div>
            <AssetGrid />
        </div>
    );
}
export default UserAssetsPage;






