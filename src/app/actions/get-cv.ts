'use server';

import { db } from "@/db";
import { resumes } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function getResumeAction() {
  const session = await auth();
  if (!session.userId) return null;

  const resume = await db.query.resumes.findFirst({
    where: eq(resumes.userId, session.userId),
  });

  if (!resume) return null;

  // Mapeamos el jsonResume guardado de vuelta al formato que espera el Wizard (formData)
  const jr = (resume.jsonResume as any) || {};
  const meta = jr.meta?.docente || {};
  const basics = jr.basics || {};

  return {
    nombre: basics.name || "",
    email: basics.email || "",
    telefono: basics.phone || "",
    slug: resume.username,
    tituloHabilitante: meta.tituloHabilitante || basics.label || "",
    provincia: meta.provincia || basics.location?.region || "",
    localidad: meta.localidad || basics.location?.city || "",
    disponibilidad: meta.disponibilidad || "inmediata",
    nivelEducativo: meta.nivelEducativo || [],
    materias: meta.materias || [],
    resumen: meta.resumen || "", // New field
    tipoEmpleo: meta.tipoEmpleo || [],
    experiencia: jr.work || [],
    formacion: jr.education || [],
    photoUrl: basics.image || "", // FIX: Changed 'imagen' to 'photoUrl' to match StepPersonal
    cursos: meta.cursos || [],
  };
}
