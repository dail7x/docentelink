'use server';

import { db } from "@/db";
import { resumes, users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';

export async function saveResumeAction(formData: any) {
  const session = await auth();
  if (!session.userId) throw new Error("Unauthorized");

  // El username/slug debe ser único. Implementaremos validación aquí.
  const existingResume = await db.query.resumes.findFirst({
    where: eq(resumes.username, formData.slug),
  });

  if (existingResume && existingResume.userId !== session.userId) {
    throw new Error("El slug ya está en uso. Por favor elige otro.");
  }

  // Preparamos el JsonResume
  const jsonResume = {
    basics: {
      name: formData.nombre,
      email: formData.email,
      phone: formData.telefono,
      label: formData.tituloHabilitante,
      location: {
        city: formData.localidad,
        region: formData.provincia,
      }
    },
    work: formData.experiencia || [],
    education: formData.formacion || [],
    meta: {
      docente: {
        tituloHabilitante: formData.tituloHabilitante,
        nivelEducativo: formData.nivelEducativo || [],
        materias: formData.materias || [],
        tipoEmpleo: formData.tipoEmpleo || [],
        provincia: formData.provincia,
        localidad: formData.localidad,
        disponibilidad: formData.disponibilidad,
        completionScore: 100, // Placeholder
        isVerified: false,
        parsedFromPdf: formData.parsedFromPdf || false,
      }
    }
  };

  const resumeId = existingResume?.id || uuidv4();

  if (existingResume) {
    await db.update(resumes)
      .set({
        username: formData.slug,
        title: formData.tituloHabilitante,
        jsonResume: jsonResume,
        updatedAt: new Date(),
      })
      .where(eq(resumes.id, resumeId));
  } else {
    await db.insert(resumes).values({
      id: resumeId,
      userId: session.userId,
      username: formData.slug,
      title: formData.tituloHabilitante,
      jsonResume: jsonResume,
      isPublic: true,
      parsedFromPdf: formData.parsedFromPdf || false,
    });
  }

  redirect(`/dashboard?status=success`);
}
