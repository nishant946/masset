import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAllUserPurchasesAssetAction } from "@/actions/payment-action";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileImage, Calendar, ShoppingBag, DollarSign } from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

async function UserPurchasesPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/login");
    }

    const purchases = await getAllUserPurchasesAssetAction();

    // Calculate total spent
    const totalSpent = purchases.reduce((sum, { purchase }) => sum + purchase.price, 0);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Purchases</h1>
                            <p className="text-gray-600">Download your purchased digital assets</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 mt-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-600">Total Purchases:</span>
                            <span className="text-lg font-semibold text-teal-600">{purchases.length}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-600">Total Spent:</span>
                            <span className="text-lg font-semibold text-green-600">
                                ${(totalSpent / 100).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Purchases Grid */}
                {purchases && purchases.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {purchases.map(({ purchase, asset }) => (
                            <Card key={purchase.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white">
                                {/* Asset Image */}
                                <div className="relative w-full h-48 group">
                                    <Image
                                        src={asset.thumbnailUrl || asset.fileUrl}
                                        alt={asset.title}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                    <div className="absolute top-2 right-2">
                                        <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                            Purchased
                                        </div>
                                    </div>
                                </div>

                                {/* Asset Info */}
                                <CardContent className="p-4">
                                    <h3 className="font-semibold text-gray-800 truncate mb-2">
                                        {asset.title}
                                    </h3>
                                    
                                    {asset.description && (
                                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                            {asset.description}
                                        </p>
                                    )}

                                    {/* Purchase Details */}
                                    <div className="space-y-2 text-xs text-gray-500 mb-4">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            <span>
                                                {formatDistanceToNow(new Date(purchase.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <DollarSign className="w-3 h-3" />
                                            <span>${(purchase.price / 100).toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Download Button */}
                                    <Button 
                                        asChild 
                                        className="w-full bg-teal-600 hover:bg-teal-700 text-white transition-colors"
                                    >
                                        <a 
                                            href={asset.fileUrl} 
                                            download={asset.title}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Download Asset
                                        </a>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="bg-white shadow-md rounded-xl border max-w-2xl mx-auto">
                        <CardContent className="py-20 flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <FileImage className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                No purchases yet
                            </h3>
                            <p className="text-gray-500 text-center max-w-md mb-6">
                                You have not purchased any assets yet. Browse our gallery to find amazing digital assets to add to your collection.
                            </p>
                            <Button asChild className="bg-teal-600 hover:bg-teal-700">
                                <Link href="/gallery">
                                    <a className="w-full text-white transition-colors hover:text-teal-700">
                                        Browse Gallery
                                    </a>
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

export default UserPurchasesPage;