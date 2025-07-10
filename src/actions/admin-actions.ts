'use server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { asset, category, user } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';
import { eq } from 'drizzle-orm/sql/expressions/conditions';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import {z} from 'zod'

const CategorySchema = z.object({
  name: z.string().min(2 , 'Category name must be at least 2 characters long').max(50 , 'Category name must be at most 50 characters long'),
  
});

export type CategoryFormValues = z.infer<typeof CategorySchema>;


export async function addNewCategoryAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers : await headers()
  })
  if (!session?.user || session.user.role !== 'admin') {
    throw new Error('you must be an admin to add a new category');
  }
  
  try {
    const name = formData.get('name') as string;

    const validateFields = CategorySchema.parse({name});

    const existingCategories = await db.select().from(category).where(eq(category.name, name)).execute();
   
    if (existingCategories.length > 0) {
      return {
        success: false,
        message: 'Category already exists'
      };
    }

    await db.insert(category).values({
      name: validateFields.name
    })

    revalidatePath('/admin/settings');
    return {
      success: true,
      message: 'Category added successfully'
    };

  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: 'Failed to add category'
    };
  }
}

export async function getAllCategoriesAction() {
  const session = await auth.api.getSession({
    headers : await headers()
  })
  if (!session?.user || session.user.role !== 'admin') {
    throw new Error('you must be an admin to view categories');
  }
  
  try {
    const categories = await db.select().from(category).orderBy(category.name);
    return {
      success: true,
      categories
    };
  } catch (e) {
    console.log(e);
    return [];
  }
}

export async function getTotalUserCountAction() {
  const session = await auth.api.getSession({
    headers : await headers()
  })
  if (!session?.user || session.user.role !== 'admin') {
    throw new Error('you must be an admin to view user count');
  }
  
  try {
    const result = await db.select({count : sql<number>`count(*)`}).from(user);
    return  result[0]?.count ||0 ;
      
    
  } catch (e) {
    console.log(e);
    return 0;
  }
}
export async function deleteCategoryAction(categoryId: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || session.user.role !== 'admin') {
    throw new Error('You must be an admin to delete');
  }

  try {
    await db.delete(category).where(eq(category.id, categoryId));
    revalidatePath("/admin/settings");
    return {
      success: true,
      message: "Category deleted successfully"
    };
  } catch (error) {
    console.error("Failed to delete category:", error);
    return {
      success: false,
      message: "Failed to delete category"
    };
  }
}

export async function getTotalAssetsCountAction() {
  const session = await auth.api.getSession({
    headers : await headers()
  })
  if (!session?.user || session.user.role !== 'admin') {
    throw new Error('you must be an admin to view assets count');
  }
  
  try {
    const result = await db.select({count : sql<number>`count(*)`}).from(asset);
    return  result[0]?.count ||0 ;
      
    
  } catch (e) {
    console.log(e);
    return 0;
  }
}

//action to approve asset

export async function approveAssetAction(assetId: string) {
  const session = await auth.api.getSession({
    headers : await headers()
  })
  if (!session?.user || session.user.role !== 'admin') {
    throw new Error('you must be an admin to approve assets');
  }

  try {
    await db.update(asset).set({isApproved: 'approved' , updatedAt: new Date()}).where(eq(asset.id, assetId));
    revalidatePath('/admin/assets');
    return {success: true, message: 'Asset approved successfully'};
  } catch (e) {
    console.log(e);
    return {success: false, message: 'Failed to approve asset'};
  }
}

export async function rejectAssetAction(assetId: string) {
  const session = await auth.api.getSession({
    headers : await headers()
  })
  if (!session?.user || session.user.role !== 'admin') {
    throw new Error('you must be an admin to reject assets');
  }

  try {
    await db.update(asset).set({isApproved: 'rejected' , updatedAt: new Date()}).where(eq(asset.id, assetId));
    revalidatePath('/admin/assets');
    return {success: true, message: 'Asset rejected successfully'};
  } catch (e) {
    console.log(e);
    return {success: false, message: 'Failed to reject asset'};
  }
}

//action to get pending assets
export async function getPendingAssetsAction() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (!session?.user || session.user.role !== 'admin') {
    throw new Error('you must be an admin to view pending assets');
  }

  try {
    const pendingAssets = await db.select({asset : asset , userName : user.name }).from(asset).leftJoin(user , eq(asset.userId , user.id)).where(eq(asset.isApproved, 'pending')).orderBy(asset.createdAt);
    return pendingAssets;
  } catch (e) {
    console.log(e);
    return [];
  }
}



