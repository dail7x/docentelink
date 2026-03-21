'use server';

import { db } from "@/db";
import { resumes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { syncClerkUserWithDb } from "@/lib/user";
import { revalidatePath } from "next/cache";

export async function updateProfileVisibility(resumeId: string, isPublic: boolean, hiddenUntil: string | null) {
  const user = await syncClerkUserWithDb();
  if (!user) throw new Error("No estás logueado.");

  // Obtenemos el currículum
  const cv = await db.query.resumes.findFirst({
    where: eq(resumes.id, resumeId),
  });

  if (!cv || cv.userId !== user.id) {
    throw new Error("No se encontró el CV o no tienes permisos.");
  }

  // Modificamos el meta.docente para guardar la fecha de ocultación si la hay
  const meta = cv.jsonResume.meta || { docente: {} as any };
  meta.docente = {
    ...meta.docente,
    hiddenUntil: hiddenUntil
  };

  const updatedJsonResume = {
    ...cv.jsonResume,
    meta
  };

  await db.update(resumes)
    .set({
      isPublic,
      jsonResume: updatedJsonResume,
      updatedAt: new Date()
    })
    .where(eq(resumes.id, resumeId));

  revalidatePath('/dashboard');
  revalidatePath('/cv/' + cv.username);
  return true;
}
