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

  // Asegurar que el usuario existe en Turso antes de guardar CV (FK constraint user_id)
  await syncClerkUserWithDb();

  // Buscar si el usuario ya tiene un CV guardado, y también chequear si alguien más tiene el slug
  const existingRecords = await db.query.resumes.findMany({
    where: or(
      eq(resumes.userId, session.userId),
      eq(resumes.username, formData.slug)
    ),
  });

  const userResume = existingRecords.find(r => r.userId === session.userId);
  const slugTakenBySomeoneElse = existingRecords.find(r => r.username === formData.slug && r.userId !== session.userId);

  if (slugTakenBySomeoneElse) {
    console.error(`Error: slug ${formData.slug} está ocupado por otro userId`);
    throw new Error("El slug ya está en uso. Por favor elige otro.");
  }

  // Cálculo de Completion Score (0-100) básicos
  let score = 0;
  if (formData.nombre) score += 10;
  if (formData.email) score += 10;
  if (formData.telefono) score += 10;
  if (formData.tituloHabilitante) score += 20;
  if (formData.provincia) score += 10;
  if (formData.localidad) score += 10;
  if (formData.experiencia && formData.experiencia.length > 0) score += 15;
  if (formData.formacion && formData.formacion.length > 0) score += 15;

  // Si hay una foto nueva o existente, la guardamos en el perfil
  const photoUrl = formData.photoUrl || null;

  // Preparamos el JsonResume
  const jsonResume = {
    basics: {
      name: formData.nombre,
      email: formData.email,
      phone: formData.telefono,
      label: formData.tituloHabilitante,
      image: photoUrl,
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
        completionScore: score,
        isVerified: false,
        parsedFromPdf: formData.parsedFromPdf || false,
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
      console.log("Resume updated successfully:", resumeId, "Score:", score);
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
      console.log("Resume inserted successfully:", resumeId, "Score:", score);
    }
  } catch (dbError: any) {
    console.error("DETALLE ERROR DB:", dbError);
    // Extraer mensaje amigable si es posible
    const msg = dbError.message || "Error desconocido en la base de datos";
    throw new Error(msg);
  }

  if (!formData.isAutosave) {
    redirect(`/dashboard?status=success`);
  }
}
