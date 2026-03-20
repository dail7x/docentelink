'use server';

import { db } from "@/db";
import { resumes, users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, or } from "drizzle-orm";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import { syncClerkUserWithDb } from "@/lib/user";

export async function saveResumeAction(formData: any) {
  const session = await auth();
  if (!session.userId) throw new Error("Unauthorized");

  // Asegurar que el usuario existe en Turso antes de guardar CV
  await syncClerkUserWithDb();

  // Buscar si el usuario ya tiene un CV guardado
  const existingRecords = await db.query.resumes.findMany({
    where: or(
      eq(resumes.userId, session.userId),
      eq(resumes.username, formData.slug)
    ),
  });

  const userResume = existingRecords.find((r: any) => r.userId === session.userId);
  const slugTakenBySomeoneElse = existingRecords.find((r: any) => r.username === formData.slug && r.userId !== session.userId);

  if (slugTakenBySomeoneElse) {
    throw new Error("El slug ya está en uso. Por favor elige otro.");
  }

  // Cálculo de Completion Score (0-100)
  let score = 0;
  if (formData.photoUrl) score += 10;
  if (formData.nombre) score += 5;
  if (formData.email) score += 5;
  if (formData.telefono) score += 5;
  if (formData.tituloHabilitante) score += 10;
  if (formData.experiencia?.length >= 1) score += 15;
  if (formData.experiencia?.length >= 3) score += 5;
  if (formData.formacion?.length >= 1) score += 15;
  if (formData.provincia && formData.nivelEducativo?.length > 0 && formData.disponibilidad) score += 15;
  if (formData.materias?.length >= 1) score += 5;
  if (formData.resumen?.length > 20) score += 5;
  if (!formData.isAutosave) score += 5; // Perfil publicado

  const isVerified = score >= 100;

  // Preparamos el JsonResume
  const jsonResume = {
    basics: {
      name: formData.nombre,
      email: formData.email,
      phone: formData.telefono,
      label: formData.tituloHabilitante,
      image: formData.photoUrl || null,
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
        resumen: formData.resumen || "",
        tipoEmpleo: formData.tipoEmpleo || [],
        provincia: formData.provincia,
        localidad: formData.localidad,
        disponibilidad: formData.disponibilidad,
        completionScore: score,
        isVerified: isVerified,
        parsedFromPdf: formData.parsedFromPdf || false,
        cursos: formData.cursos || [],
      }
    }
  };

  const resumeId = userResume?.id || uuidv4();

  try {
    if (userResume) {
      await db.update(resumes)
        .set({
          username: formData.slug,
          title: formData.tituloHabilitante,
          jsonResume: jsonResume,
          completionScore: score,
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
        completionScore: score,
        isPublic: true,
        parsedFromPdf: formData.parsedFromPdf || false,
      });
    }
  } catch (dbError: any) {
    throw new Error(dbError.message || "Error al guardar en la base de datos");
  }

  if (!formData.isAutosave) {
    redirect(`/dashboard?status=success`);
  }
}
