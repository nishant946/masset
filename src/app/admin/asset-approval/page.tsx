import { approveAssetAction, getPendingAssetsAction } from "@/actions/admin-actions";
import { rejectAssetAction } from "@/actions/admin-actions";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

type Asset = {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  thumbnailUrl: string | null;
  createdAt: string;
};

type PendingAsset = {
  asset: Asset;
  userName: string;
};

async function AssetApprovalPage() {
  // getPendingAssetsAction returns asset.createdAt as Date, but PendingAsset expects string
  const rawPendingAssets = await getPendingAssetsAction();
  const pendingAssets: PendingAsset[] = rawPendingAssets.map(
    ({ asset, userName }: { asset: Omit<Asset, 'createdAt'> & { createdAt: Date }; userName: string | null }) => ({
      asset: {
        ...asset,
        createdAt: typeof asset.createdAt === "string" ? asset.createdAt : asset.createdAt.toISOString(),
      },
      userName: userName || "",
    })
  );

  if (pendingAssets.length === 0) {
    return (
      <Card className="bg-white shadow-md rounded-xl border">
        <CardContent className="py-20 flex flex-col items-center justify-center">
          <p className="text-gray-500 text-lg font-semibold text-center">
            🎉 No pending assets to review!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="">
      <div className=" grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4">
      {pendingAssets.map(({ asset, userName }) => (
        <div
          key={asset.id}
          className="flex flex-col bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
          {/* Image */}
          <div className="relative w-full h-48 sm:h-52 md:h-56">
            <Image
              src={asset.thumbnailUrl || asset.fileUrl}
              alt={asset.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col flex-grow px-4 py-3">
            <h3 className="text-md font-semibold text-gray-800 truncate">{asset.title}</h3>

            {asset.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{asset.description}</p>
            )}

            <div className="flex justify-between items-center mt-4 text-xs text-gray-400">
              <span>
                ⏱ {formatDistanceToNow(new Date(asset.createdAt), { addSuffix: true })}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {userName}
              </span>
            </div>
          </div>
          <div className="flex justify-end px-4 pb-3">
            <form action={
              async() => {
                'use server';
                await approveAssetAction(asset.id);
              }
            }>
            <Button variant="outline" size="sm" className="bg-green-500 text-white hover:bg-green-600">
              Approve
            </Button>
            
            </form>
              <form action={
                async() => {
                  'use server';
                  await rejectAssetAction(asset.id);
                }
              }>
                <Button variant="outline" size="sm" className="bg-red-500 text-white hover:bg-red-600">
              Reject
            </Button>
              </form>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
}

export default AssetApprovalPage;
