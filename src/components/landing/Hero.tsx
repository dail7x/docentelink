import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center py-20 px-6 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 z-[-1] bg-[radial-gradient(circle_at_center,_var(--color-dl-primary-light)_0%,_transparent_70%)] opacity-40" />
      
      <div className="max-w-4xl text-center space-y-6">
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-dl-primary-dark">
          La carrera docente tiene <br />
          <span className="text-dl-accent">un lugar propio.</span>
        </h1>
        
        <p className="text-xl sm:text-2xl text-dl-muted max-w-2xl mx-auto leading-relaxed font-medium">
          DocenteLink es el primer espacio dedicado a potenciar tu trayectoria educativa. Creá tu perfil profesional hoy.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/cv/create">
            <Button size="xl" variant="primary" className="group">
              Creá tu perfil gratis
              <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <p className="text-sm text-dl-muted/80 w-full sm:w-auto text-center px-4">
            Importá tu PDF actual y convertilo en un link único.
          </p>
        </div>
      </div>
    </section>
  );
}
