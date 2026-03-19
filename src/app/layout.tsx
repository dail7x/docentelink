import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "@/components/layout/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DocenteLink — La carrera docente tiene un lugar propio",
  description: "Crea tu perfil profesional docente, importa tu CV con IA y compartí tu link único.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
        </ClerkProvider>
      </body>
    </html>
  );
}
