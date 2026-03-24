"use client";

import { FileDown, Edit3, Share2, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Subí tu PDF",
    description:
      "Nuestra IA analiza tu trayectoria docente y completa los campos iniciales automáticamente.",
    icon: FileDown,
    accent: "#534ab7",
    lightAccent: "#eeedfe",
  },
  {
    number: "02",
    title: "Completá",
    description:
      "Editá tu perfil, ajustá tu foto y definí tus preferencias laborales con precisión.",
    icon: Edit3,
    accent: "#1d9e75",
    lightAccent: "#e1f5ee",
  },
  {
    number: "03",
    title: "Compartí",
    description:
      "Recibí tu link único docentelink.ar/cv/tu-nombre y envialo por WhatsApp o email.",
    icon: Share2,
    accent: "#7f77dd",
    lightAccent: "#eeedfe",
  },
];

export const HowItWorksRedesigned = () => {
  return (
    <section id="como-funciona" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-white" />
      <div className="absolute inset-0 paper-grain" />

      {/* Decorative lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#534ab7]/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#534ab7]/10 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header - Asymmetric */}
        <div className="grid lg:grid-cols-12 gap-8 mb-16 lg:mb-24">
          <div className="lg:col-span-5 space-y-4">
            <div className="chapter-mark">
              <span>Cómo funciona</span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-[#1a1a2e] leading-[1.1] tracking-tight">
              Tu perfil
              <br />
              profesional en
              <br />
              <span className="relative inline-block">
                <span className="text-[#1d9e75]">3 minutos</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 4C40 2 120 2 198 4"
                    stroke="#1d9e75"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>
          </div>

          <div className="lg:col-span-5 lg:col-start-8 flex items-end">
            <p className="text-lg text-[#4a4a5c] leading-relaxed font-body">
              Eliminá el roce de los formularios tradicionales. Nuestra
              tecnología se encarga del trabajo pesado para que vos te enfoques
              en lo que importa: tu trayectoria.
            </p>
          </div>
        </div>

        {/* Steps - Editorial cards */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`group relative ${
                index === 1 ? "lg:mt-12" : ""
              } ${index === 2 ? "lg:mt-24" : ""}`}
            >
              {/* Large number background */}
              <div className="absolute -top-8 -left-4 font-display text-[8rem] lg:text-[10rem] font-medium leading-none text-[#534ab7]/[0.03] select-none pointer-events-none">
                {step.number}
              </div>

              {/* Card */}
              <div className="relative card-editorial rounded-lg p-8 lg:p-10 h-full transition-all duration-500 hover:shadow-editorial-lg group-hover:-translate-y-1">
                {/* Step indicator */}
                <div className="flex items-center justify-between mb-8">
                  <span
                    className="font-display text-sm font-medium"
                    style={{ color: step.accent }}
                  >
                    Paso {step.number}
                  </span>

                  {/* Connector line for desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:flex items-center gap-2">
                      <div className="w-12 h-px bg-gradient-to-r from-[#534ab7]/20 to-transparent" />
                      <ArrowRight className="w-4 h-4 text-[#534ab7]/30" />
                    </div>
                  )}
                </div>

                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-lg flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: step.lightAccent }}
                >
                  <step.icon
                    className="w-6 h-6"
                    style={{ color: step.accent }}
                  />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="font-display text-2xl font-medium text-[#1a1a2e]">
                    {step.title}
                  </h3>
                  <p className="text-[#4a4a5c] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Hover accent line */}
                <div
                  className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500 rounded-b-lg"
                  style={{ backgroundColor: step.accent }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 lg:mt-24 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#eeedfe] rounded-full">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-[#534ab7] to-[#7f77dd] border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <span className="text-sm font-medium text-[#534ab7]">
              +500 docentes ya crearon su perfil
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
