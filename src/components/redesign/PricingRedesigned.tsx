"use client";

import { Check, X, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Gratuito",
    subtitle: "Ideal para comenzar",
    price: "$0",
    period: "para siempre",
    description: "Todo lo necesario para crear tu perfil profesional.",
    features: [
      { name: "Perfil público con link único", included: true },
      { name: "CV profesional completo", included: true },
      { name: "Importación de PDF vía IA", included: true },
      { name: "Filtros de foto básicos", included: true },
      { name: "PDF con marca de agua", included: true },
      { name: "Slug personalizable", included: false },
      { name: "Marcos de foto premium", included: false },
    ],
    cta: "Comenzar gratis",
    accent: "#4a4a5c",
    lightAccent: "#f5f5f5",
  },
  {
    name: "Pro",
    subtitle: "Para destacarse",
    price: "$2.990",
    period: "pago único",
    description: "Acceso completo a todas las funciones premium.",
    features: [
      { name: "Perfil público con link único", included: true },
      { name: "CV profesional completo", included: true },
      { name: "Importación de PDF vía IA", included: true },
      { name: "Filtros de foto premium", included: true },
      { name: "PDF sin marca de agua", included: true },
      { name: "Slug personalizable (ej: MariaG)", included: true },
      { name: "Marcos de foto premium", included: true },
    ],
    cta: "Obtener Plan Pro",
    accent: "#1d9e75",
    lightAccent: "#e1f5ee",
    highlight: true,
  },
];

export const PricingRedesigned = () => {
  return (
    <section id="planes" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#f8f7fc]" />
      <div className="absolute inset-0 paper-grain" />

      {/* Decorative elements */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#534ab7]/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#1d9e75]/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
          <div className="chapter-mark justify-center mb-6">
            <span>Planes</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-[#1a1a2e] leading-[1.1] tracking-tight mb-6">
            Planes a tu
            <span className="relative inline-block">
              {" "}
              medida
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 120 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 4C30 2 90 2 118 4"
                  stroke="#534ab7"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>

          <p className="text-lg text-[#4a4a5c] leading-relaxed font-body">
            Empezá gratis y mejorá tu perfil cuando quieras. Sin suscripciones, sin
            complicaciones.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`group relative ${
                plan.highlight ? "lg:-mt-4 lg:mb-4" : ""
              }`}
            >
              {/* Popular badge */}
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#534ab7] text-white text-xs font-semibold rounded-full shadow-lg"
                  >
                    <Sparkles className="w-3 h-3" />
                    RECOMENDADO
                  </div>
                </div>
              )}

              <div
                className={`relative card-editorial rounded-lg h-full flex flex-col transition-all duration-500 hover:shadow-editorial-lg ${
                  plan.highlight
                    ? "p-8 lg:p-10 border-[#534ab7]/20"
                    : "p-8 lg:p-10"
                }`}
              >
                {/* Plan header */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-display text-2xl font-medium text-[#1a1a2e]">
                        Plan {plan.name}
                      </h3>
                      <p
                        className="text-sm font-medium"
                        style={{ color: plan.accent }}
                      >
                        {plan.subtitle}
                      </p>
                    </div>

                    {plan.highlight && (
                      <div className="w-10 h-10 rounded-full bg-[#eeedfe] flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-[#534ab7]" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-5xl font-medium text-[#1a1a2e]"
                    >
                      {plan.price}
                    </span>
                    <span className="text-sm text-[#4a4a5c]">{plan.period}</span>
                  </div>

                  <p className="mt-4 text-sm text-[#4a4a5c] leading-relaxed"
                  >
                    {plan.description}
                  </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-[#534ab7]/10 to-transparent mb-8" />

                {/* Features */}
                <ul className="flex-1 space-y-4 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 ${
                          feature.included
                            ? "bg-[#1d9e75]/10"
                            : "bg-[#4a4a5c]/5"
                        }`}
                      >
                        {feature.included ? (
                          <Check className="w-3 h-3 text-[#1d9e75]" />
                        ) : (
                          <X className="w-3 h-3 text-[#4a4a5c]/40" />
                        )}
                      </div>
                      <span
                        className={`text-sm leading-relaxed ${
                          feature.included
                            ? "text-[#1a1a2e]"
                            : "text-[#4a4a5c]/50"
                        }`}
                      >
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 ${
                    plan.highlight
                      ? "bg-[#534ab7] text-white hover:bg-[#3c3489] hover:shadow-lg hover:shadow-[#534ab7]/25"
                      : "bg-[#f5f5f5] text-[#1a1a2e] hover:bg-[#e8e8e8]"
                  }`}
                >
                  {plan.cta}
                </button>

                {/* Hover accent */}
                <div
                  className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500 rounded-b-lg"
                  style={{ backgroundColor: plan.accent }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Trust note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-[#4a4a5c]">
            Pago seguro vía{" "}
            <span className="font-semibold text-[#1a1a2e]">MercadoPago</span>.
            Acceso inmediato después del pago.
          </p>
        </div>
      </div>
    </section>
  );
};
