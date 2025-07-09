import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { asset } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { recordPurchaseAction } from "@/actions/payment-action";


export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const assetId = searchParams.get("assetId");
    const payerId = searchParams.get("PayerID");

    if (!token || !assetId || !payerId) {
        redirect("/gallery")
    }

    const session = await auth.api.getSession({ 
        headers: await headers()
     });

    if (!session?.user.id) {
        redirect("/login");
    }

   const response = await fetch(`${process.env.PAYPAL_API_URL}/v2/checkout/orders/${token}/capture`, {
    method : "POST",
    headers : {
        "Content-Type" : "application/json",
        "Authorization" : `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64")}`,
    },
   });
   const data = await response.json();
    if(data.status === "COMPLETED") {
        const saveToDb = await recordPurchaseAction(assetId, token, session.user.id, '5.00');
        if(saveToDb.success) {
            redirect(`/gallery/${assetId}?success=true`);
        }
        else {
            redirect(`/gallery/${assetId}?error=true`);
        }   
    try {
    const [getAsset] = await db.select().from(asset).where(eq(asset.id, assetId));
    if (!getAsset) {
        redirect("/gallery");
    }
    else {
        redirect(`/gallery/${assetId}?cancelled=true`);
    }
    }
    catch (e) {
        console.error(e);
        redirect(`/gallery/${assetId}?error=true`);
    }
 }
}
