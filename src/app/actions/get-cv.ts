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

  const jr = (resume.jsonResume as any) || {};
  const meta = jr.meta?.docente || {};
  const basics = jr.basics || {};

  const splitName = (fullName: string) => {
    if (!fullName) return { nombre: "", apellido: "" };
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return { nombre: parts[0], apellido: "" };
    const apellido = parts.pop() || "";
    const nombre = parts.join(" ");
    return { nombre, apellido };
  };

  const nameData = splitName(basics.name || '');

  return {
    nombre: meta.nombre || nameData.nombre || basics.name || "",
    apellido: meta.apellido || nameData.apellido || "",
    email: basics.email || "",
    telefono: basics.phone || "",
    mostrarTelPublico: meta.mostrarTelPublico ?? false, // Recuperamos flag
    slug: resume.username,
    tituloHabilitante: meta.tituloHabilitante || basics.label || "",
    provincia: meta.provincia || basics.location?.region || "Buenos Aires",
    localidad: meta.localidad || basics.location?.city || "",
    localidades: meta.localidades || (meta.localidad ? [meta.localidad] : []), // Recuperamos lista de pills
    disponibilidad: meta.disponibilidad || "inmediata",
    nivelEducativo: meta.nivelEducativo || [],
    materias: meta.materias || [],
    resumen: meta.resumen || "",
    mostrarResumenPublico: meta.mostrarResumenPublico ?? true,
    mostrarNivelesPublico: meta.mostrarNivelesPublico ?? true,
    habilidades: meta.habilidades || [],
    turnos: meta.turnos || ["manana", "tarde"],
    diasDisponibles: meta.diasDisponibles || ["lun", "mar", "mie", "jue", "vie"],
    disponibleDesde: meta.disponibleDesde || "",
    experiencia: jr.work || [],
    formacion: jr.education || [],
    photoUrl: basics.image || "",
    ogImageUrl: resume.ogImageUrl || "",
    cursos: meta.cursos || [],
  };
}
