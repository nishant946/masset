"use server";
import { db } from "@/lib/db";
import { asset, category, user } from "@/lib/db/schema";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { z } from 'zod';
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";


const AssetSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    categoryId: z.number().int().positive(),
    fileUrl: z.string().url('invalid file url'),
    thumbnailUrl: z.string().url('invalid thumbnail url').optional(),
})

export async function getCategoriesAction() {
    try {
        return await db.select().from(category);
    } catch (e) {
        console.error("Error fetching categories:", e);
        return [];
    }
}

//server action to save the asset to the database
export async function uploadAssetAction(formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session?.user) {
        throw new Error('you must be logged in to save an asset')
    }
    try {
        const validatedFields = AssetSchema.parse({
            title: formData.get('title'),
            description: formData.get('description'),
            categoryId: Number(formData.get('categoryId')),
            fileUrl: formData.get('fileUrl'),
            thumbnailUrl: formData.get('thumbnailUrl') || formData.get('fileUrl'),
        })
        await db.insert(asset).values({
            id: crypto.randomUUID(),
            title: validatedFields.title,
            description: validatedFields.description,
            categoryId: validatedFields.categoryId,
            fileUrl: validatedFields.fileUrl,
            thumbnailUrl: validatedFields.thumbnailUrl,
            isApproved: 'pending',
            userId: session.user.id,
        })
        revalidatePath('/dashboard/assets')
        return {success: true}
    } catch (e) {
        console.error('Error saving asset:', e);
        return {success: false, error: 'Failed to save asset'}
    }
}

//server action to get all assets
export async function getUserAssetsAction(userId: string) {
    try {
        const assets = await db.select().from(asset).where(eq(asset.userId, userId)).orderBy(asset.createdAt);
        return assets;
    } catch (e) {
        console.error('Error fetching user assets:', e);
        return [];
    }
}

export async function getPublicAssetsAction(categoryId?: number) {
    try {

        let condition = and(
            eq(asset.isApproved, 'approved'),
        )
        if(categoryId) {
            condition = and(condition, eq(asset.categoryId, categoryId))
        }
        const query = await db.select({
            asset: asset,
            categoryName: category.name,
            userName: user.name, 
        }).from(asset).leftJoin(category, eq(asset.categoryId, category.id)).leftJoin(user, eq(asset.userId, user.id)).where(condition);
        return query;
    } catch (e) {
        console.error('Error fetching public assets:', e);
        return [];
    }
}

export async function getAssetByIdAction(assetId: string) {
    try {
        const [result] = await db.select({
            asset: asset,
            categoryName: category.name,
            userName: user.name,
            userImage: user.image,
            userId: user.id,
        }).from(asset).leftJoin(category, eq(asset.categoryId, category.id)).leftJoin(user, eq(asset.userId, user.id)).where(eq(asset.id, assetId));
        return result;
    } catch (e) {
        console.error('Error fetching asset by id:', e);
        return null;
    }
}