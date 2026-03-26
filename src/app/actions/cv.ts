'use server';

import { db } from "@/db";
import { resumes, users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, or } from "drizzle-orm";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import { syncClerkUserWithDb } from "@/lib/user";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function saveResumeAction(formData: any) {
  const session = await auth();
  if (!session.userId) throw new Error("Unauthorized");

  await syncClerkUserWithDb();

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
  if (!formData.isAutosave) score += 5; 

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
        nombre: formData.nombre,
        apellido: formData.apellido,
        tituloHabilitante: formData.tituloHabilitante,
        nivelEducativo: formData.nivelEducativo || [],
        materias: formData.materias || [],
        resumen: formData.resumen || "",
        mostrarResumenPublico: formData.mostrarResumenPublico ?? true,
        mostrarNivelesPublico: formData.mostrarNivelesPublico ?? true,
        localidades: formData.localidades || [],
        habilidades: formData.habilidades || [],
        turnos: formData.turnos || [],
        diasDisponibles: formData.diasDisponibles || [],
        disponibleDesde: formData.disponibleDesde || null,
        mostrarTelPublico: formData.mostrarTelPublico ?? false, // Guardamos flag de privacidad
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

  // Cleanup old profile image if it changed or was removed
  if (userResume) {
    const oldJr = (userResume.jsonResume as any) || {};
    const oldImageUrl = oldJr.basics?.image;

    if (oldImageUrl && oldImageUrl !== formData.photoUrl && oldImageUrl.includes("utfs.io")) {
      try {
        const fileKey = oldImageUrl.split('/').pop();
        if (fileKey) {
          await utapi.deleteFiles(fileKey);
        }
      } catch (err) {
        console.error("Error deleting old profile image:", err);
      }
    }
  }

  try {
    if (userResume) {
      await db.update(resumes)
        .set({
          username: formData.slug,
          title: formData.tituloHabilitante,
          jsonResume: jsonResume,
          completionScore: score,
          updatedAt: new Date(),
          ogImageUrl: formData.ogImageUrl ?? undefined,
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
        ogImageUrl: formData.ogImageUrl || null,
      });
    }
  } catch (dbError: any) {
    throw new Error(dbError.message || "Error al guardar en la base de datos");
  }

  const skipRedirect = (formData as any).skipRedirect || formData.isAutosave;
  
  if (!skipRedirect) {
    redirect(`/dashboard?status=success`);
  }
}
