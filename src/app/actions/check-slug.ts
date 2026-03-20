'use server';

import { db } from "@/db";
import { resumes } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, ne } from "drizzle-orm";

export async function checkSlugAction(slug: string) {
  const session = await auth();
  if (!session.userId) return { available: false };

  const existing = await db.query.resumes.findFirst({
    where: and(
      eq(resumes.username, slug),
      ne(resumes.userId, session.userId) // No contar si el slug es el del propio usuario
    ),
  });

  return { available: !existing };
}
