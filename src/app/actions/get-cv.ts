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
  const jr = resume.jsonResume;
  const meta = jr.meta.docente;

  return {
    nombre: jr.basics?.name || "",
    email: jr.basics?.email || "",
    telefono: jr.basics?.phone || "",
    slug: resume.username,
    tituloHabilitante: meta.tituloHabilitante || jr.basics?.label || "",
    provincia: meta.provincia || jr.basics?.location?.region || "",
    localidad: meta.localidad || jr.basics?.location?.city || "",
    disponibilidad: meta.disponibilidad || "inmediata",
    nivelEducativo: meta.nivelEducativo || [],
    materias: meta.materias || [],
    tipoEmpleo: meta.tipoEmpleo || [],
    experiencia: jr.work || [],
    formacion: jr.education || [],
    imagen: jr.basics?.image || "",
  };
}
