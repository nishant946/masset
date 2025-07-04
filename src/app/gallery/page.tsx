import {headers} from "next/headers";
import {auth} from "@/lib/auth";
import { redirect } from "next/dist/client/components/navigation";

 async function GalleryPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (session && session?.user?.role === 'admin') redirect('/');
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h1 className="text-2xl font-bold text-center mb-4">Gallery</h1>
                <p className="text-center text-gray-600">This is the gallery page.</p>
            </div>
        </div>
    );
}
export default GalleryPage;