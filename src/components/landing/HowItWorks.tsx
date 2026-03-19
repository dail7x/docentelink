import { FileDown, Edit3, Share2 } from "lucide-react";

const steps = [
  {
    title: "Subí tu PDF",
    description: "Nuestra IA analiza tu trayectoria docente y completa los campos iniciales.",
    icon: FileDown,
    color: "bg-dl-primary-light text-dl-primary",
  },
  {
    title: "Completá",
    description: "Editá tu perfil, ajustá tu foto y definí tus preferencias laborales.",
    icon: Edit3,
    color: "bg-dl-accent-light text-dl-accent",
  },
  {
    title: "Compartí",
    description: "Recibí tu link único `docentelink.ar/cv/tu-nombre` y envialo por WhatsApp o mail.",
    icon: Share2,
    color: "bg-dl-primary-light text-dl-primary-mid",
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 px-6 bg-white/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-dl-primary-dark">
            Tu perfil profesional docente en <span className="text-dl-accent underline decoration-4 underline-offset-8">3 minutos</span>
          </h2>
          <p className="text-lg text-dl-muted leading-relaxed">
            Eliminá el roce de los formularios tradicionales. Nuestra tecnología se encarga del trabajo pesado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-16">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center group space-y-6">
              <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl ${step.color} shadow-sm flex items-center justify-center transform group-hover:-translate-y-2 transition-transform duration-300`}>
                <step.icon className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-dl-primary-dark tracking-tight">{step.title}</h3>
                <p className="text-dl-muted leading-6 font-medium px-4">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
