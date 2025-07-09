import {
  Badge,
  DollarSign,
  Download,
  Info,
  Loader2,
  ShoppingCart,
  Tag,
} from "lucide-react";
import { headers } from "next/headers";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { getAssetByIdAction } from "@/actions/dashboard-actions";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createPaypalOrderAction } from "@/actions/payment-action";

interface GallaryDetailsPageProps {
  params: {
    id: string;
  };
}

export default function GallaryDetailsPage({
  params,
}: GallaryDetailsPageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <GallaryContent params={params} />
    </Suspense>
  );
}

async function GallaryContent({ params }: GallaryDetailsPageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user?.role === "admin") redirect("/");

  const result = await getAssetByIdAction(params?.id);
  if (!result) notFound();

  const { asset, categoryName, userName, userId, userImage } = result;
  const isAuthor = session?.user?.id === userId;
  const initials =
    userName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";
  const hasPurchased = false;

  async function handlePurchase() {
    "use server";
    try {
      const result = await createPaypalOrderAction(params?.id);
      console.log("PayPal order result:", result);

      if (result?.approvalLink) {
        // Redirect to PayPal approval page
        redirect(result.approvalLink);
      } else if (result?.alreadyPurchased) {
        // Handle already purchased case
        console.log("Asset already purchased");
      } else {
        throw new Error("Failed to create PayPal order");
      }
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      throw error;
    }
  }

  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
        {/* LEFT SIDE - All current content */}
        <div className="md:col-span-2 space-y-6">
          {/* Image */}
          <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow">
            <Image
              src={asset.fileUrl}
              alt={asset.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Title + Badge + Description */}
          <div>
            <h1 className="text-3xl font-semibold">{asset.title}</h1>
            {categoryName && (
              <div className="space-y-2">
                <Badge className="mt-2 bg-gray-100 text-gray-800 flex items-center gap-1 px-2 py-1 text-sm rounded-md">
                  <Tag className="w-4 h-4" />
                  <span>{categoryName}</span>
                </Badge>
                <p className="text-sm text-gray-500">{asset.description}</p>
              </div>
            )}
          </div>

          {/* Uploaded by */}
          <div className="border-t pt-4 space-y-4">
            <h2 className="text-lg font-medium">Uploaded By</h2>
            <div className="flex items-center gap-3">
              {userImage ? (
                <Image
                  src={userImage}
                  alt={userName || ""}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
                  {initials}
                </div>
              )}
              <div>
                <p className="font-medium">{userName}</p>
                <p className="text-sm text-gray-500">Creator</p>
              </div>
            </div>
          </div>

          {/* Author notice */}
          {isAuthor && (
            <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
              You are the author of this asset.
            </div>
          )}
        </div>

        {/* RIGHT SIDE - Blank (for future use) */}
        <div className="space-y-6">
          <div className="sticky top-24">
            <Card className="overflow-hidden border-0 shadow-lg rounded-xl">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Premium Asset</h3>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">$ 5</span>
                  <span className="ml-2 text-gray-300">One Time Purchase</span>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {session?.user ? (
                    isAuthor ? (
                      <div className="bg-blue-50 text-blue-700 p-5 rounded-lg flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                        <p className="text-sm">
                          You are the author of this asset. You cannot purchase
                          it.
                        </p>
                      </div>
                    ) : (
                      <div>
                        {hasPurchased ? (
                          <Button
                            asChild
                            className="w-full bg-green-600 hover:bg-green-700 transition-colors duration-300 cursor-pointer text-white h-12"
                          >
                            <a download>
                              <Download className="w-6 h-6 mr-2" />
                              Download
                            </a>
                          </Button>
                        ) : (
                          <form action={handlePurchase}>
                            <Button
                              type="submit"
                              className="w-full bg-black text-white h-12"
                            >
                              <ShoppingCart className="w-6 h-6 mr-2" />
                              Purchase
                            </Button>
                          </form>
                        )}
                      </div>
                    )
                  ) : (
                    <>
                      <Button
                        asChild
                        className="w-full bg-black text-white h-12"
                      >
                        <Link href="/login">Sign in to Purchase</Link>
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
