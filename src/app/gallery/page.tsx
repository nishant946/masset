import { getPublicAssetsAction, getCategoriesAction } from "@/actions/dashboard-actions";
import AssetGrid from "@/components/dashboard/asset-grid";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Filter, X, Grid3X3, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

interface GalleryPageProps {
  searchParams: {
    search?: string;
    category?: string;
  };
}

async function GalleryContent({ searchParams }: GalleryPageProps) {
  const [assets, categories] = await Promise.all([
    getPublicAssetsAction(),
    getCategoriesAction(),
  ]);

  // Filter assets based on search and category
  let filteredAssets = assets;
  
  if (searchParams.search) {
    const searchTerm = searchParams.search.toLowerCase();
    filteredAssets = filteredAssets.filter(asset => 
      asset.asset.title.toLowerCase().includes(searchTerm) ||
      (asset.asset.description && asset.asset.description.toLowerCase().includes(searchTerm))
    );
  }

  if (searchParams.category && searchParams.category !== "all") {
    const categoryId = parseInt(searchParams.category);
    filteredAssets = filteredAssets.filter(asset => asset.asset.categoryId === categoryId);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Digital Asset Gallery
          </h1>
          <p className="text-xl text-teal-100 max-w-2xl mx-auto">
            Discover amazing digital assets created by our community of talented creators
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter */}
        <Card className="mb-8 shadow-sm">
          <CardContent className="p-6">
            <form className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  name="search"
                  placeholder="Search assets by title or description..."
                  defaultValue={searchParams.search}
                  className="pl-10 h-12"
                />
              </div>
              
              <Select name="category" defaultValue={searchParams.category || "all"}>
                <SelectTrigger className="w-full lg:w-48 h-12">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button type="submit" className="bg-teal-600 hover:bg-teal-700 h-12 px-8">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>

              {(searchParams.search || searchParams.category) && (
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  className="h-12"
                >
                  <a href="/gallery">
                    <X className="w-4 h-4 mr-2" />
                    Clear
                  </a>
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Results Count and Stats */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <p className="text-gray-600 text-lg">
              Showing <span className="font-semibold text-teal-600">{filteredAssets.length}</span> asset{filteredAssets.length !== 1 ? 's' : ''}
              {searchParams.search && (
                <span> for "<span className="font-semibold">{searchParams.search}</span>"</span>
              )}
              {searchParams.category && searchParams.category !== "all" && (
                <span> in <span className="font-semibold">{categories?.find(c => c.id.toString() === searchParams.category)?.name}</span></span>
              )}
            </p>
          </div>
          
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Assets Grid */}
        {filteredAssets.length > 0 ? (
          <AssetGrid 
            assets={filteredAssets.map(item => ({
              ...item.asset,
              isApproved: item.asset.isApproved as "approved" | "rejected" | "pending"
            }))} 
          />
        ) : (
          <Card className="bg-white shadow-md rounded-xl border">
            <CardContent className="py-20 flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No assets found
                </h3>
                <p className="text-gray-500 mb-6 max-w-md">
                  {searchParams.search || searchParams.category 
                    ? "Try adjusting your search criteria or browse all assets."
                    : "No assets are available at the moment. Check back later for new content."
                  }
                </p>
                {(searchParams.search || searchParams.category) && (
                  <Button asChild className="bg-teal-600 hover:bg-teal-700">
                    <a href="/gallery">View All Assets</a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Load More Section */}
        {filteredAssets.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" className="px-8 py-3">
              Load More Assets
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GalleryPage({ searchParams }: GalleryPageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <GalleryContent searchParams={searchParams} />
    </Suspense>
  );
}