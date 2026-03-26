'use server';

import { db } from "@/db";
import { resumes } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function saveOgImageAction(formData: FormData) {
  const session = await auth();
  if (!session.userId) throw new Error("Unauthorized");
  
  const ogUrl = formData.get("ogUrl") as string;
  const username = formData.get("username") as string;
  
  if (!ogUrl || !username) {
    throw new Error("Missing required parameters");
  }
  
  // Get current resume to find old image URL and delete it from UploadThing
  const currentResume = await db.query.resumes.findFirst({
    where: eq(resumes.username, username),
  });

  if (currentResume?.ogImageUrl && currentResume.ogImageUrl.includes("utfs.io")) {
    try {
      // Extract key from URL: https://utfs.io/f/KEY
      const fileKey = currentResume.ogImageUrl.split('/').pop();
      if (fileKey) {
        await utapi.deleteFiles(fileKey);
      }
    } catch (deleteError) {
      console.error("Error deleting old OG image:", deleteError);
      // We continue anyway to update with the new one
    }
  }

  // Update the resume with the new OG image URL
  await db.update(resumes)
    .set({
      ogImageUrl: ogUrl,
      updatedAt: new Date(),
    })
    .where(eq(resumes.username, username));
    
  return { success: true, ogUrl };
}
