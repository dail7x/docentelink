export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { syncClerkUserWithDb } from "@/lib/user";
import { Button } from "@/components/ui/Button";
import { Plus, Share2, Award, Zap, ExternalLink, Edit3, Eye, FileText, Download } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { resumes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cn } from "@/lib/utils";
import { ProfileVisibilityManager } from "@/components/dashboard/ProfileVisibilityManager";

export default async function DashboardPage() {
  const user = await syncClerkUserWithDb();

  if (!user) {
    redirect("/");
  }

  // Buscamos el CV activo del usuario
  const userResume = await db.query.resumes.findFirst({
    where: eq(resumes.userId, user.id),
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Header Sección */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 py-8 border-b-2 border-dl-primary-light/40">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dl-accent/10 text-dl-accent text-xs font-bold uppercase tracking-widest">
            <Zap className="w-3 h-3 fill-current" />
            Panel de Control
          </div>
          <h1 className="text-4xl font-extrabold text-dl-primary-dark tracking-tight">
            ¡Hola, <span className="text-dl-primary">{user.name?.split(' ')[0]}</span>! 👋
          </h1>
          <p className="text-lg text-dl-muted font-medium">
            {userResume 
              ? "Tu trayectoria ya está online. Seguí mejorando tu perfil."
              : "Tu trayectoria docente merece ser vista. ¿Empezamos un nuevo CV?"}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {!userResume && (
            <Link href="/cv/create">
              <Button size="lg" className="font-bold shadow-lg">
                <Plus className="mr-2 w-5 h-5" />
                Crear mi CV
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Grid de Estado */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Mi Link/Perfil */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-dl-primary-dark tracking-tight">Mi Perfil Profesional</h2>
          
          <div className="p-10 rounded-[2.5rem] bg-white border-2 border-dl-primary-light/30 shadow-sm space-y-8">
             {userResume ? (
               <div className="space-y-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl bg-dl-primary-bg/40 border-2 border-dl-primary-light/20">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-dl-primary flex items-center justify-center text-white shadow-lg">
                           <FileText className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                           <h3 className="text-xl font-black text-dl-primary-dark tracking-tight">{userResume.title || "Sin título definido"}</h3>
                           <p className="text-dl-muted font-bold text-sm">docentelink.ar/cv/{userResume.username}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-2 flex-wrap">
                        <Link href={`/cv/${userResume.username}`} target="_blank">
                           <Button variant="ghost" size="sm" className="font-bold">
                              <ExternalLink className="w-4 h-4 mr-2" /> Ver público
                           </Button>
                        </Link>
                        <Link href="/cv/create?edit=true">
                           <Button variant="outline" size="sm" className="font-bold">
                              <Edit3 className="w-4 h-4 mr-2" /> Editar
                           </Button>
                        </Link>
                        <a 
                          href={`/api/cv/me/pdf`} 
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                           <Button variant="accent" size="sm" className="font-bold">
                              <Download className="w-4 h-4 mr-2" /> Descargar PDF
                           </Button>
                        </a>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="p-6 rounded-3xl border-2 border-dl-primary-light/10 space-y-1">
                        <p className="text-[10px] font-black uppercase text-dl-muted tracking-widest">Vistas totales</p>
                        <p className="text-2xl font-black text-dl-primary-dark flex items-center gap-2">
                           <Eye className="w-5 h-5 text-dl-accent" />
                           {userResume.views || 0}
                        </p>
                     </div>
                     <div className="md:col-span-2">
                       <ProfileVisibilityManager 
                         resumeId={userResume.id}
                         isPublic={userResume.isPublic ?? false}
                         hiddenUntil={(userResume.jsonResume.meta as any)?.docente?.hiddenUntil ?? null}
                       />
                     </div>
                  </div>
               </div>
             ) : (
               <div className="space-y-4">
                  <p className="text-sm font-bold text-dl-muted uppercase tracking-widest">Estado del perfil</p>
                  <div className="flex items-center justify-center p-12 border-4 border-dashed border-dl-primary-light rounded-[1.5rem] bg-dl-primary-bg/50 group hover:border-dl-primary/30 transition-all duration-300">
                     <div className="text-center space-y-4">
                        <p className="text-dl-muted font-medium">Aún no has creado tu primer perfil público.</p>
                        <Link href="/cv/create">
                           <span className="text-dl-primary font-bold hover:underline underline-offset-4 flex items-center justify-center cursor-pointer">
                              Lanzar Wizard <Plus className="ml-1 w-4 h-4" />
                           </span>
                        </Link>
                     </div>
                  </div>
               </div>
             )}
          </div>
        </div>

        {/* Sidebar: Gamificación */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-dl-primary-dark tracking-tight">Gamificación</h2>
          
          <div className="p-8 rounded-[2rem] bg-dl-primary text-white shadow-xl space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-500" />
            
            <div className="relative z-10 space-y-4">
               <div className="flex items-center justify-between">
                  <span className="text-sm font-bold uppercase tracking-widest opacity-80">Progreso total</span>
                  <span className="text-2xl font-black italic tracking-tighter">
                     {userResume ? (userResume.completionScore || 0) : 0}%
                  </span>
               </div>
               <div className="h-4 bg-white/20 rounded-full overflow-hidden border border-white/10">
                  <div 
                    className="h-full bg-dl-accent transition-all duration-1000" 
                    style={{ width: `${userResume ? (userResume.completionScore || 0) : 0}%` }}
                  />
               </div>
               <p className="text-xs font-medium opacity-70 leading-relaxed italic">
                 {userResume 
                   ? "¡Excelente! Casi terminas tu perfil estelar." 
                   : "Sincroniza tu CV y completa los campos faltantes para subir de nivel."}
               </p>
            </div>
          </div>

          <div className="p-8 rounded-[2rem] bg-white border-2 border-dl-primary-light/30 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-dl-primary-dark flex items-center gap-2">
              <Award className="w-5 h-5 text-dl-accent" />
              Insignias
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={cn(
                  "aspect-square rounded-2xl flex items-center justify-center border border-dl-primary-light/50",
                  userResume && i === 1 ? "bg-dl-accent/20 border-dl-accent shadow-inner grayscale-0 opacity-100" : "bg-dl-primary-bg/50 grayscale opacity-30"
                )}>
                   <div className={cn(
                     "w-4 h-4 rounded-full",
                     userResume && i === 1 ? "bg-dl-accent" : "bg-dl-muted"
                   )} />
                </div>
              ))}
            </div>
          </div>
          
          <Button variant="outline" className="w-full font-bold group">
             <Share2 className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform" />
             Compartir DocenteLink
          </Button>
        </div>
      </div>
    </div>
  );
}
