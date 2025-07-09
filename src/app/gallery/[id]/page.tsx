import { Loader2 } from "lucide-react";
import { headers } from "next/headers";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { getAssetByIdAction } from "@/actions/dashboard-actions";
import { log } from "console";


interface GallaryDetailsPageProps{
    params: {
        id: string;
    }
}

async function GallaryDetailsPage({params}: GallaryDetailsPageProps){
    return <Suspense 
    fallback={
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="w-10 h-10 animate-spin" />
        </div>

    }
    >
        <GallaryContent params={params} />
    </Suspense>
}

export default GallaryDetailsPage;

async function GallaryContent({params}: GallaryDetailsPageProps){
    
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if(session && session?.user?.role === "admin"){
        redirect('/')
    }

    const result = await getAssetByIdAction(params?.id)

    if(!result){
        notFound()
    }
    console.log(result)

    return <div>GallaryContent</div>
}