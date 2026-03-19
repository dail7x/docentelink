import { Logo } from "@/components/brand/Logo";

export default function Footer() {
  return (
    <footer className="py-24 px-6 bg-dl-primary-bg overflow-hidden border-t-2 border-dl-primary-light/40">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-12 sm:gap-16">
        <Logo className="transform scale-125 mb-4" />
        
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16 text-sm font-semibold text-dl-primary-dark/80 tracking-wide uppercase tracking-widest">
          <a href="#como-funciona" className="hover:text-dl-accent transition-colors duration-200">
            Cómo funciona
          </a>
          <a href="#planes" className="hover:text-dl-accent transition-colors duration-200">
            Planes
          </a>
          <a href="#preguntas" className="hover:text-dl-accent transition-colors duration-200">
            Preguntas
          </a>
          <a href="/legal" className="hover:text-dl-accent transition-colors duration-200">
            Legal
          </a>
        </div>

        <div className="text-center space-y-2">
          <p className="text-dl-muted font-bold text-lg tracking-tight">
            Hecho en Argentina, para docentes argentinos. 🇦🇷
          </p>
          <p className="text-dl-muted/50 text-xs font-medium uppercase tracking-widest">
            © {new Date().getFullYear()} DocenteLink. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
