import Image from "next/image";
import { Badge } from "../ui/badge";
import { formatDistanceToNow } from "date-fns";

type Asset = {
  id: string;
  title: string;
  description: string | null;
  categoryId: number;
  fileUrl: string;
  thumbnailUrl: string | null;
  createdAt: Date;
isApproved: "approved" | "rejected" | "pending";
};

interface AssetGridProps {
  assets: Asset[];
}

function AssetGrid({ assets }: AssetGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {assets.map((asset) => {
        const statusColor =
          asset.isApproved === "approved"
            ? "bg-green-500"
            : asset.isApproved === "rejected"
            ? "bg-red-500"
            : "bg-yellow-500";

        const statusText =
          asset.isApproved === "approved"
            ? "Approved"
            : asset.isApproved === "rejected"
            ? "Rejected"
            : "Pending";

        return (
          <div
            key={asset.id}
            className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            {/* Image Section */}
            <div className="relative w-full h-60">
              <Image
                src={asset.thumbnailUrl || asset.fileUrl}
                alt={asset.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3 z-10">
                <Badge className={`text-white ${statusColor}`}>
                  {statusText}
                </Badge>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-800 truncate">
                {asset.title}
              </h3>
              {asset.description && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {asset.description}
                </p>
              )}
              <div className="mt-2 text-[11px] text-gray-400">
                {formatDistanceToNow(new Date(asset.createdAt), {
                  addSuffix: true,
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AssetGrid;
