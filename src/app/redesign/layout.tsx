import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { NavbarRedesigned } from "@/components/redesign/NavbarRedesigned";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DocenteLink — La carrera docente tiene un lugar propio",
  description: "Crea tu perfil profesional docente, importa tu CV con IA y compartí tu link único.",
};

export default function RedesignLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body bg-[#F8F7FC]">
        <ClerkProvider>
          <NavbarRedesigned />
          <main className="flex-1">
            {children}
          </main>
        </ClerkProvider>
      </body>
    </html>
  );
}
