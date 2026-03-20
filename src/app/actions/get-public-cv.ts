import { db } from "@/db";
import { resumes } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getPublicResumeAction(username: string) {
  try {
    const resume = await db.query.resumes.findFirst({
      where: eq(resumes.username, username),
    });

    if (!resume) return null;

    return {
      ...resume,
      meta: resume.meta as any,
    };
  } catch (error) {
    console.error("Error fetching public resume:", error);
    return null;
  }
}
