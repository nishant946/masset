'use server';

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { asset, payment, purchase } from "@/lib/db/schema";    
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

export async function createPaypalOrderAction(assetId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/login");
    }

    const [getAsset] = await db.select().from(asset).where(eq(asset.id, assetId));
    if (!getAsset) {
        throw new Error("Asset not found");
    }

    const existingPurchase = await db
        .select()
        .from(purchase)
        .where(
            and(
                eq(purchase.userId, session.user.id),
                eq(purchase.assetId, assetId)
            )
        )
        .limit(1);

    if (existingPurchase.length > 0) {
        return {
            alreadyPurchased : true,
        }
    }
    try {
        const response = await fetch(`${process.env.PAYPAL_API_URL}/v2/checkout/orders`, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64")}`,
            },
            body : JSON.stringify({
                intent : "CAPTURE",
                purchase_units : [{
                    reference_id : assetId,
                    description : getAsset.title,
                    amount : {
                        currency_code : "USD",
                        value : '5.00',
                    },
                    custom_id : `${session.user.id}-${assetId}`,
                   
                }],
                application_context : {
                    return_url : `${process.env.APP_URL}/api/paypal/capture?assetId=${assetId}`,
                    cancel_url : `${process.env.APP_URL}/gallery/${assetId}?cancelled=true`,
                },
            }),
        });
        const data = await response.json();

        console.log("PayPal order response:", JSON.stringify(data, null, 2));

        if(data.id) {
            const approvalLink = data.links?.find((link: any) => link.rel === "approve")?.href;
            if (approvalLink) {
                return {
                    orderId : data.id,
                    approvalLink : approvalLink,
                }
            } else {
                throw new Error("Failed to find approval link in PayPal response");
            }
        }
        else {
            throw new Error("Failed to create PayPal order");
        }
    } catch (e) {    
        console.error(e);
        throw new Error("Failed to create PayPal order");
    }
    
        
    
    
}

export async function recordPurchaseAction(assetId: string ,paypalOrderId: string ,userId: string ,price = '5.00') {
    try {
        const existingPurchase = await db.select().from(purchase).where(and(eq(purchase.userId, userId), eq(purchase.assetId, assetId))).limit(1);
        if (existingPurchase.length > 0) {
            return {
                success : true,
                alreadyExists : true,
            }
        }

        const paymentUuid = uuidv4();
        const purchaseUuid = uuidv4();

        await db.insert(payment).values({
            id : paymentUuid,
            amount : Math.round(Number(price) * 100),
            currency : 'USD',
            status : 'completed',
            provider : 'paypal',
            providerId : paypalOrderId,
            userId : userId,
            createdAt : new Date(),
        });

        await db.insert(purchase).values({
            id : purchaseUuid,
            userId : userId,
            assetId : assetId,
            paymentId : paymentUuid,
            price : Math.round(Number(price) * 100),
            createdAt : new Date(),
        });

        //create invoice letter
        revalidatePath(`/gallery/${assetId}`);
        revalidatePath(`/dashboard/purchases`);

        return {
            success : true,
            purchaseId : purchaseUuid,
        }
        
    } catch (error) {
        console.error(error);
        return {
            success : false,
            error : "Failed to record purchase",
        }
    }
}

export async function hasUserPurchasedAssetAction(assetId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user.id) {
        return false;
    }

   try {
    const existingPurchase = await db.select().from(purchase).where(and(eq(purchase.userId, session.user.id), eq(purchase.assetId, assetId))).limit(1);
    return existingPurchase.length > 0;
    
   } catch (error) {
        console.error(error);
        return false;
   }
}

export async function getAllUserPurchasesAssetAction() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user.id) {
        redirect("/login");
    }

    try {
        const userPurchases = await db.select({
            purchase : purchase,
            asset : asset,
        }).from(purchase).innerJoin(asset, eq(purchase.assetId, asset.id)).where(eq(purchase.userId, session.user.id));
        
        return userPurchases;
    } catch (error) {
        console.error(error);
        return [];
    }
    

}