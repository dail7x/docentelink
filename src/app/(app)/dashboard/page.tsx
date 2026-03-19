import { syncClerkUserWithDb } from "@/lib/user";
import { Button } from "@/components/ui/Button";
import { Plus, Share2, Award, Zap } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await syncClerkUserWithDb();

  if (!user) {
    redirect("/");
  }

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
            Tu trayectoria docente merece ser vista. ¿Empezamos un nuevo CV?
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/cv/create">
            <Button size="lg" className="font-bold shadow-lg">
              <Plus className="mr-2 w-5 h-5" />
              Crear mi CV
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid de Estado */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Mi Link/Perfil */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-dl-primary-dark tracking-tight">Mi Perfil Profesional</h2>
          
          <div className="p-10 rounded-[2.5rem] bg-white border-2 border-dl-primary-light/30 shadow-sm space-y-8">
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
                  <span className="text-2xl font-black italic tracking-tighter">0%</span>
               </div>
               <div className="h-4 bg-white/20 rounded-full overflow-hidden border border-white/10">
                  <div className="h-full bg-dl-accent w-0 transition-all duration-1000" />
               </div>
               <p className="text-xs font-medium opacity-70 leading-relaxed italic">
                 Sincroniza tu CV y completa los campos faltantes para subir de nivel.
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
                <div key={i} className="aspect-square bg-dl-primary-bg/50 rounded-2xl flex items-center justify-center grayscale opacity-30 border border-dl-primary-light/50">
                   <div className="w-4 h-4 rounded-full bg-dl-muted" />
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
