'use server';

import { db } from "@/db";
import { resumes } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function saveOgImageAction(formData: FormData) {
  const session = await auth();
  if (!session.userId) throw new Error("Unauthorized");
  
  const ogUrl = formData.get("ogUrl") as string;
  const username = formData.get("username") as string;
  
  if (!ogUrl || !username) {
    throw new Error("Missing required parameters");
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
