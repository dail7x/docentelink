"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "¿Es realmente gratis?",
    answer:
      "Sí, el Plan Gratuito te permite crear tu CV completo, tener tu link único y usar el editor de foto básico para siempre. Sin límites de tiempo ni funcionalidades ocultas.",
  },
  {
    question: "¿Cómo funciona la importación de PDF?",
    answer:
      "Subís tu CV actual en PDF y nuestra inteligencia artificial detecta automáticamente tu experiencia, formación académica, habilidades y datos personales para pre-completar el wizard de creación.",
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer:
      "Aceptamos todas las tarjetas de crédito, débito y dinero en cuenta a través de MercadoPago (Transferencias, Pago Fácil, Rapipago, etc). El pago es único, sin suscripciones.",
  },
  {
    question: "¿Puedo cambiar mi slug después?",
    answer:
      "Sí, con el Plan Pro podés personalizar tu URL tantas veces como quieras. Tu link anterior seguirá redirigiendo al nuevo por 30 días para garantizar la continuidad.",
  },
  {
    question: "¿Mis datos están seguros?",
    answer:
      "Absolutamente. Utilizamos encriptación de nivel bancario, servidores en la nube con certificación SOC 2, y nunca compartimos tu información con terceros. Vos controlás la visibilidad de tu perfil.",
  },
];

export const FAQRedesigned = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="preguntas" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-white" />
      <div className="absolute inset-0 paper-grain" />

      {/* Decorative lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#534ab7]/10 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="grid lg:grid-cols-12 gap-8 mb-16 lg:mb-20">
          <div className="lg:col-span-5 space-y-4">
            <div className="chapter-mark">
              <span>Preguntas frecuentes</span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-[#1a1a2e] leading-[1.1] tracking-tight">
              Todo lo que
              <br />
              <span className="relative inline-block">
                necesitás saber
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 280 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 4C60 2 220 2 278 4"
                    stroke="#534ab7"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>
          </div>

          <div className="lg:col-span-5 lg:col-start-8 flex items-end">
            <p className="text-lg text-[#4a4a5c] leading-relaxed font-body">
              Respuestas claras a las dudas más comunes. Si tenés otra pregunta,
              no dudes en contactarnos.
            </p>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="card-editorial rounded-lg overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full flex items-center justify-between p-6 text-left group"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-display text-sm text-[#534ab7] font-medium">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-lg text-[#1a1a2e] group-hover:text-[#534ab7] transition-colors">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-[#534ab7] transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-out ${
                    openIndex === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="px-6 pb-6 pt-0">
                    <div className="pl-10 border-l-2 border-[#534ab7]/10">
                      <p className="text-[#4a4a5c] leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
