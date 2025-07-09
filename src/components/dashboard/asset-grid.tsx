"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { deleteAssetAction } from "@/actions/dashboard-actions";
import EditAsset from "./edit-asset";

type Asset = {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  thumbnailUrl: string | null;
  categoryId: string | null;
  createdAt: string;
  isApproved?: "approved" | "rejected" | "pending";
};

type Category = {
  id: string;
  name: string;
  createdAt?: Date;
};

interface AssetGridProps {
  assets: Asset[];
  categories: Category[];
  showActions?: boolean;
}

function AssetGrid({ assets, categories, showActions = false }: AssetGridProps) {
  const [localAssets, setLocalAssets] = useState<Asset[]>(assets);

  const handleDeleteAsset = async (assetId: string) => {
    if (!confirm("Are you sure you want to delete this asset?")) return;

    try {
      const result = await deleteAssetAction(assetId);
      if (result.success) {
        setLocalAssets(localAssets.filter((asset) => asset.id !== assetId));
      }
    } catch (error) {
      console.error("Error deleting asset:", error);
    }
  };

  const handleAssetUpdate = (updatedAsset: Asset) => {
    setLocalAssets(
      localAssets.map((asset) =>
        asset.id === updatedAsset.id ? updatedAsset : asset
      )
    );
  };

  if (localAssets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No assets found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {localAssets.map((asset) => (
        <Card key={asset.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="relative">
            <Image
              src={asset.thumbnailUrl || asset.fileUrl}
              alt={asset.title}
              width={300}
              height={200}
              className="w-full h-48 object-cover"
            />
            {showActions && (
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/80 hover:bg-white">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/gallery/${asset.id}`} className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <EditAsset asset={asset} categories={categories} />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteAsset(asset.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-800 truncate mb-2">
              {asset.title}
            </h3>
            {asset.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {asset.description}
              </p>
            )}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                {new Date(asset.createdAt).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default AssetGrid;
