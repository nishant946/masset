import {headers} from "next/headers";
import {auth} from "@/lib/auth";
import { redirect } from "next/dist/client/components/navigation";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getCategoriesAction, getPublicAssetsAction } from "@/actions/dashboard-actions";
import Image from "next/image";


interface GalleryPageProps{
    searchParams: Promise<{
        category? : string;
    }>
}

 async function GalleryPage({searchParams}: GalleryPageProps) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (session && session?.user?.role === 'admin') redirect('/');
    return <Suspense
    fallback={
        <div className="flex items-center justify-center min-h-[65vh]">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>

    }
    >
        <GallaryContent searchParams={searchParams}/>
        </Suspense>
}
export default GalleryPage;


async function GallaryContent({searchParams}: GalleryPageProps) {
    const { category } = await searchParams;
    const categoryId = category ? Number.parseInt(category) : undefined;

    const categories = await getCategoriesAction();
    const assets = await getPublicAssetsAction(categoryId);

    return (
        <div className="min-h-screen container px-4 bg-white">
            <div className="sticky top-0 z-30 bg-white border-b py-3 px-4">
                <div className="container flex overflow-x-auto gap-2 ">
                    <Button variant={!category ? 'default' : 'outline'} size="sm"
                     className={!categoryId ? 'bg-black text-white' : ''}>
                        <Link href="/gallery">
                            All
                        </Link>


                    </Button>
                    {categories.map((category) => (
                        <Button key={category.id} variant={categoryId === category.id ? 'default' : 'outline'} size="sm"
                        className={categoryId === category.id ? 'bg-black text-white' : ''}>
                            <Link href={`/gallery?category=${category.id}`}>
                                {category.name}
                            </Link>
                        </Button>
                    ))}
                </div>

            </div>
            <div className="container py-12 ">
                    {
                        assets.length === 0 ? <p className="text-xl text-center font-bold ">
                            no assets uploaded!
                        </p>
                        : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {
                                    assets.map(({ asset, categoryName, userName }) => (
                                        <Link href={`/gallery/${asset.id}`} key={asset.id} className="block">
                                            <div className="group relative overflow-hidden rounded-lg h-64">
                                                <Image
                                                    src={asset.fileUrl}
                                                    alt={asset.title}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                   <div className="absolute bottom-0 left-0 right-0 p-4">
                                                    <p className="text-white text-lg font-medium">{asset.title}</p>
                                                    <p className="text-white text-xs">{categoryName}</p>
                                                    <p className="text-white text-xs">{userName}</p>
                                                   </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                }
                            </div>
                        )
                    }
            </div>
        </div>
    )
    
}