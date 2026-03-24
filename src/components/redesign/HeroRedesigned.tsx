"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export const HeroRedesigned = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background textures */}
      <div className="absolute inset-0 paper-grain" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#f8f7fc] via-[#f8f7fc] to-[#eeedfe]/50" />

      {/* Decorative elements */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[#534ab7]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#1d9e75]/5 rounded-full blur-3xl" />

      {/* Editorial grid lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-[15%] w-px h-full bg-[#534ab7]/5" />
        <div className="absolute top-0 left-[50%] w-px h-full bg-[#534ab7]/5" />
        <div className="absolute top-0 right-[15%] w-px h-full bg-[#534ab7]/5" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left column - Main content */}
          <div className="lg:col-span-7 space-y-8">
            {/* Chapter mark */}
            <div className="chapter-mark animate-fade-slide-in opacity-0">
              <span>Perfil Profesional Docente</span>
            </div>

            {/* Main headline - Editorial style */}
            <h1 className="space-y-2 animate-fade-slide-up opacity-0 delay-100">
              <span className="block font-display text-5xl sm:text-6xl lg:text-7xl font-medium text-[#1a1a2e] leading-[0.95] tracking-tight">
                La carrera
              </span>
              <span className="block font-display text-5xl sm:text-6xl lg:text-7xl font-medium text-[#1a1a2e] leading-[0.95] tracking-tight">
                docente tiene
              </span>
              <span className="block font-display text-5xl sm:text-6xl lg:text-7xl font-medium leading-[0.95] tracking-tight">
                <span className="relative inline-block">
                  <span className="text-[#1d9e75]">un lugar propio</span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 300 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 8C50 2 150 2 298 8"
                      stroke="#534ab7"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="animate-draw-line"
                      style={{ animationDelay: "800ms" }}
                    />
                  </svg>
                </span>
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-[#4a4a5c] leading-relaxed max-w-xl font-body animate-fade-slide-up opacity-0 delay-200"
            >
              DocenteLink es el primer espacio dedicado a potenciar tu trayectoria educativa.
              <span className="text-[#534ab7] font-medium">Creá tu perfil profesional</span>{" "}
              con una estética editorial que destaca tu autoridad académica.
            </p>

            {/* CTA Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4 animate-fade-slide-up opacity-0 delay-300"
            >
              <Link href="/cv/create">
                <button className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#534ab7] text-white font-semibold rounded-sm overflow-hidden transition-all duration-500 hover:bg-[#3c3489] hover:shadow-xl hover:shadow-[#534ab7]/25"
                >
                  <span className="relative z-10">Creá tu perfil gratis</span>
                  <ArrowRight className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1d9e75]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </button>
              </Link>

              <div className="flex items-center gap-2 text-sm text-[#4a4a5c]">
                <Sparkles className="w-4 h-4 text-[#1d9e75]" />
                <span>Importá tu PDF con IA</span>
              </div>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 pt-8 animate-fade-slide-up opacity-0 delay-400">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-[#534ab7] to-[#7f77dd] border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-sm text-[#4a4a5c]">
                <span className="font-semibold text-[#1a1a2e]">+500 docentes</span>
                <br />
                ya crearon su perfil
              </div>
            </div>
          </div>

          {/* Right column - Visual composition */}
          <div className="lg:col-span-5 relative">
            {/* Editorial number */}
            <div className="editorial-number -top-20 -left-10 lg:-left-20 animate-fade-slide-up opacity-0 delay-200">
              01
            </div>

            {/* Main card */}
            <div className="relative animate-scale-in opacity-0 delay-500"
            >
              <div className="card-editorial rounded-lg p-8 lg:p-10 shadow-editorial-lg">
                {/* Profile preview card */}
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#534ab7] to-[#7f77dd] flex items-center justify-center text-white font-display text-2xl"
                    >
                      D
                    </div>
                    <div>
                      <div className="font-display text-xl text-[#1a1a2e]">
                        Docente
                      </div>
                      <div className="text-sm text-[#4a4a5c]">
                        docentelink.ar/cv/
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-[#534ab7]/10" />

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#1d9e75]/10 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#1d9e75]" />
                      </div>
                      <span className="text-sm text-[#4a4a5c]">CV profesional</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#534ab7]/10 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#534ab7]" />
                      </div>
                      <span className="text-sm text-[#4a4a5c]">Link único personalizado</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#eeedfe] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#7f77dd]" />
                      </div>
                      <span className="text-sm text-[#4a4a5c]">Foto de perfil optimizada</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#eeedfe] rounded-full text-xs font-medium text-[#534ab7]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1d9e75] animate-pulse" />
                      Perfil verificado
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating accent card */}
              <div className="absolute -bottom-6 -left-6 lg:-left-12 bg-[#1d9e75] text-white p-4 rounded-lg shadow-editorial animate-fade-slide-up opacity-0 delay-600"
              >
                <div className="font-display text-2xl">3 min</div>
                <div className="text-xs text-white/80">tiempo promedio</div>
              </div>

              {/* Decorative stamp */}
              <div className="absolute -top-4 -right-4 lg:-right-8 w-20 h-20 border-2 border-[#534ab7]/20 rounded-full flex items-center justify-center animate-fade-slide-up opacity-0 delay-700"
              >
                <div className="text-[10px] font-bold text-[#534ab7]/40 uppercase tracking-widest rotate-[-15deg]">
                  Argentina
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#534ab7]/20 to-transparent" />
    </section>
  );
};
