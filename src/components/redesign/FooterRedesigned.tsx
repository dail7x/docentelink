"use client";

import Link from "next/link";

const footerLinks = [
  {
    title: "Producto",
    links: [
      { label: "Cómo funciona", href: "#como-funciona" },
      { label: "Planes", href: "#planes" },
      { label: "FAQ", href: "#preguntas" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Términos", href: "/legal" },
      { label: "Privacidad", href: "/legal" },
    ],
  },
];

export const FooterRedesigned = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-16 lg:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#1a1a2e]" />
      <div className="absolute inset-0 paper-grain" />

      {/* Decorative top line */}
      <div className="absolute top-0 left-0 right-0 h-px">
        <div className="h-full bg-gradient-to-r from-transparent via-[#534ab7] to-transparent opacity-50" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Logo */}
            <Link href="/" className="inline-block group">
              <div className="flex items-baseline gap-1">
                <span className="font-display text-2xl font-semibold text-white tracking-tight">
                  Docente
                </span>
                <span className="font-display text-2xl font-semibold text-[#1d9e75] tracking-tight">
                  Link
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#1d9e75] ml-0.5 mb-2"></span>
              </div>
            </Link>

            <p className="text-[#8a8a9c] leading-relaxed max-w-sm">
              El primer espacio dedicado a potenciar la trayectoria docente en Argentina.
              Diseñado con el rigor académico que merecés.
            </p>

            {/* Location badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <span className="text-2xl">🇦🇷</span>
              <span className="text-sm text-white/70">
                Hecho en Argentina
              </span>
            </div>
          </div>

          {/* Links columns */}
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="grid grid-cols-2 gap-8">
              {footerLinks.map((section) => (
                <div key={section.title}>
                  <h4 className="font-display text-sm font-semibold text-white uppercase tracking-wider mb-4">
                    {section.title}
                  </h4>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-[#8a8a9c] hover:text-white transition-colors duration-300 text-sm"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#8a8a9c]">
              © {currentYear} DocenteLink. Todos los derechos reservados.
            </p>

            <div className="flex items-center gap-6">
              <span className="text-xs text-[#8a8a9c]">
                Diseñado con precisión académica
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
