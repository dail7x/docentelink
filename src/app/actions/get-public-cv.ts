import { db } from "@/db";
import { resumes } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getPublicResumeAction(username: string) {
  if (!username) {
    console.error("getPublicResumeAction: No se proporcionó username");
    return null;
  }

  try {
    const resume = await db.query.resumes.findFirst({
      where: eq(resumes.username, username),
    });

    if (!resume) {
       console.log(`getPublicResumeAction: No se encontró CV para el slug: ${username}`);
       return null;
    }

    return resume;
  } catch (error) {
    console.error("Error fetching public resume en DB:", error);
    return null;
  }
}
