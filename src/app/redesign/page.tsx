import "./redesign.css";
import { HeroRedesigned } from "@/components/redesign/HeroRedesigned";
import { HowItWorksRedesigned } from "@/components/redesign/HowItWorksRedesigned";
import { PricingRedesigned } from "@/components/redesign/PricingRedesigned";
import { FAQRedesigned } from "@/components/redesign/FAQRedesigned";
import { FooterRedesigned } from "@/components/redesign/FooterRedesigned";

export default function RedesignPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroRedesigned />
      <HowItWorksRedesigned />

      {/* Preview Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[#f8f7fc]" />
        <div className="absolute inset-0 paper-grain" />

        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#534ab7]/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div className="lg:col-span-5 space-y-6">
              <div className="chapter-mark">
                <span>Vista previa</span>
              </div>

              <h2 className="font-display text-4xl sm:text-5xl font-medium text-[#1a1a2e] leading-[1.1] tracking-tight">
                Tu perfil,
                <br />
                <span className="text-[#534ab7]">tu prestigio</span>.
              </h2>

              <p className="text-lg text-[#4a4a5c] leading-relaxed">
                Diseñamos cada perfil para que destaque tu autoridad académica
                con una estética editorial moderna. Cada detalle pensado para
                transmitir profesionalismo.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#1d9e75]" />
                  <span className="text-sm text-[#4a4a5c]">Diseño responsive</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#534ab7]" />
                  <span className="text-sm text-[#4a4a5c]">Exportable a PDF</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#7f77dd]" />
                  <span className="text-sm text-[#4a4a5c]">Foto optimizada</span>
                </div>
              </div>
            </div>

            {/* Preview mockup */}
            <div className="lg:col-span-7">
              <div className="relative group">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#534ab7]/20 to-[#1d9e75]/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative card-editorial rounded-xl overflow-hidden shadow-editorial-lg">
                  {/* Mockup browser chrome */}
                  <div className="bg-[#f5f5f5] px-4 py-3 flex items-center gap-2 border-b border-[#534ab7]/10">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                      <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                      <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="bg-white rounded-md px-4 py-1.5 text-xs text-[#4a4a5c] text-center border border-[#534ab7]/10"
                      >
                        docentelink.ar/cv/
                      </div>
                    </div>
                  </div>

                  {/* Mockup content */}
                  <div className="p-8 bg-white">
                    <div className="max-w-sm mx-auto space-y-6">
                      {/* Profile header */}
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-[#534ab7] to-[#7f77dd] flex items-center justify-center text-white font-display text-3xl"
                        >
                          D
                        </div>
                        <div className="flex-1">
                          <div className="h-6 bg-[#1a1a2e]/10 rounded w-3/4 mb-2" />
                          <div className="h-4 bg-[#4a4a5c]/10 rounded w-1/2" />
                        </div>
                      </div>

                      {/* Bio section */}
                      <div className="space-y-2">
                        <div className="h-4 bg-[#4a4a5c]/10 rounded w-full" />
                        <div className="h-4 bg-[#4a4a5c]/10 rounded w-5/6" />
                        <div className="h-4 bg-[#4a4a5c]/10 rounded w-4/5" />
                      </div>

                      {/* Experience section */}
                      <div className="pt-4 border-t border-[#534ab7]/10">
                        <div className="h-5 bg-[#534ab7]/10 rounded w-1/3 mb-4" />
                        <div className="space-y-3">
                          <div className="flex gap-3">
                            <div className="w-2 h-2 rounded-full bg-[#1d9e75] mt-2 shrink-0" />
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-[#1a1a2e]/10 rounded w-2/3" />
                              <div className="h-3 bg-[#4a4a5c]/10 rounded w-1/2" />
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <div className="w-2 h-2 rounded-full bg-[#534ab7] mt-2 shrink-0" />
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-[#1a1a2e]/10 rounded w-3/4" />
                              <div className="h-3 bg-[#4a4a5c]/10 rounded w-1/3" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Skills tags */}
                      <div className="flex flex-wrap gap-2 pt-4">
                        {["Educación", "Pedagogía", "TICs"].map((tag) => (
                          <div
                            key={tag}
                            className="px-3 py-1 bg-[#eeedfe] rounded-full text-xs text-[#534ab7]"
                          >
                            {tag}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PricingRedesigned />
      <FAQRedesigned />
      <FooterRedesigned />
    </div>
  );
}
