import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b-2 border-dl-primary-light/40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo />
          
          <nav className="hidden md:flex items-center gap-10 text-sm font-bold text-dl-primary-dark tracking-wide uppercase tracking-widest">
            <Link href="#como-funciona" className="hover:text-dl-accent transition-colors duration-200">
              Cómo funciona
            </Link>
            <Link href="#planes" className="hover:text-dl-accent transition-colors duration-200">
              Planes
            </Link>
            <Link href="#preguntas" className="hover:text-dl-accent transition-colors duration-200">
              Preguntas
            </Link>
          </nav>

          <div className="flex items-center gap-6">
            <Link href="/login" className="hidden sm:block text-sm font-bold text-dl-primary-dark uppercase hover:text-dl-accent tracking-widest">
              Ingresar
            </Link>
            <Link href="/cv/create">
              <Button variant="primary" size="md" className="font-bold">
                Empezar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20">
        <Hero />
        <HowItWorks />
        
        {/* Mockup Preview Section Placeholder */}
        <section className="py-24 px-6 bg-white overflow-hidden">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-dl-primary-dark">
                Tu perfil, <span className="text-dl-accent">tu prestigio.</span>
              </h2>
              <p className="text-lg text-dl-muted leading-relaxed max-w-2xl mx-auto font-medium">
                Diseñamos cada perfil para que destaque tu autoridad académica con una estética editorial moderna.
              </p>
            </div>
            
            <div className="relative group max-w-5xl mx-auto">
              <div className="absolute inset-0 bg-dl-accent/10 rounded-[2.5rem] blur-2xl transform scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="relative aspect-[16/10] bg-dl-primary-dark rounded-[2rem] shadow-2xl overflow-hidden border-8 border-white/10 ring-1 ring-black/5">
                <div className="absolute inset-0 bg-gradient-to-br from-dl-primary/20 to-transparent flex items-center justify-center">
                  <span className="text-white/40 font-black text-2xl uppercase tracking-widest rotate-[-15deg]">
                    Vista Previa de Perfil
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Pricing />
        
        {/* FAQ Section */}
        <section id="preguntas" className="py-24 px-6 bg-white">
          <div className="max-w-4xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-dl-primary-dark">Preguntas Frecuentes</h2>
              <p className="text-lg text-dl-muted font-medium">Todo lo que necesitás saber sobre DocenteLink.</p>
            </div>
            
            <div className="space-y-6">
              {[
                { q: "¿Es realmente gratis?", a: "Sí, el Plan Gratuito te permite crear tu CV completo, tener tu link único y usar el editor de foto básico para siempre." },
                { q: "¿Cómo funciona la importación de PDF?", a: "Subís tu CV actual en PDF y nuestra inteligencia artificial detecta automáticamente tu experiencia y formación académica para pre-completar el wizard." },
                { q: "¿Qué métodos de pago aceptan para el Plan Pro?", a: "Aceptamos todas las tarjetas de crédito, débito y dinero en cuenta a través de MercadoPago (Transferencias, Pago Fácil, etc)." },
              ].map((item, i) => (
                <div key={i} className="p-8 rounded-2xl bg-dl-primary-bg/50 border-2 border-dl-primary-light/30 hover:bg-dl-primary-bg/80 transition-all duration-300">
                  <h3 className="text-xl font-bold text-dl-primary-dark mb-3">{item.q}</h3>
                  <p className="text-dl-muted leading-7 font-medium tracking-tight whitespace-pre-line">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
