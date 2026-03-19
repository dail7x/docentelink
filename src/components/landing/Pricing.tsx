import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

const plans = [
  {
    name: "Plan Gratuito",
    price: "$0",
    description: "Ideal para comenzar tu trayectoria.",
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
    variant: "outline" as const,
  },
  {
    name: "Plan Pro",
    price: "$2.990",
    period: "Pago único",
    description: "Para docentes que buscan destacarse.",
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
    variant: "accent" as const,
    highlight: true,
  },
];

export default function Pricing() {
  return (
    <section id="planes" className="py-24 px-6 bg-dl-primary-bg">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-dl-primary-dark tracking-tight">
            Planes a tu medida
          </h2>
          <p className="text-lg text-dl-muted leading-relaxed font-medium">
            Empezá gratis y mejorá tu perfil cuando quieras.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative flex flex-col p-8 sm:p-10 rounded-3xl bg-white border-2 transition-all duration-300 hover:shadow-xl group ${
                plan.highlight ? "border-dl-accent/30 shadow-md ring-4 ring-dl-accent/5" : "border-dl-primary-light/40"
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 right-10 -translate-y-1/2 px-4 py-1.5 bg-dl-accent text-white text-xs font-bold rounded-full tracking-wide shadow-sm">
                  RECOMENDADO
                </div>
              )}

              <div className="mb-10 space-y-4">
                <h3 className="text-2xl font-bold text-dl-primary-dark">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold text-dl-primary-dark">{plan.price}</span>
                  {plan.period && <span className="text-dl-muted font-medium ml-1">/ {plan.period}</span>}
                </div>
                <p className="text-dl-muted text-sm font-medium">{plan.description}</p>
              </div>

              <ul className="flex-1 space-y-4 mb-10">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-dl-accent shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-dl-muted/30 shrink-0" />
                    )}
                    <span className={`text-sm ${feature.included ? "text-dl-primary-dark font-semibold" : "text-dl-muted/50 font-normal"}`}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              <Button size="lg" variant={plan.variant} className="w-full font-bold">
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
