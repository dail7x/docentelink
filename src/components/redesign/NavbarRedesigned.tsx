"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";

export const NavbarRedesigned = () => {
  const pathname = usePathname();
  const isLanding = pathname === "/" || pathname === "/redesign";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#como-funciona", label: "Cómo funciona" },
    { href: "#planes", label: "Planes" },
    { href: "#preguntas", label: "Preguntas" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md border-b border-[#534ab7]/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between">
            {/* Logo - Asymmetrical position */}
            <Link href="/" className="relative group">
              <div className="flex items-baseline gap-1">
                <span className="font-display text-2xl font-semibold text-[#1a1a2e] tracking-tight">
                  Docente
                </span>
                <span className="font-display text-2xl font-semibold text-[#1d9e75] tracking-tight">
                  Link
                </span>
                <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#1d9e75] ml-0.5 mb-2"></span>
              </div>
              <div className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-[#534ab7] to-[#1d9e75] transition-all duration-300 group-hover:w-full" />
            </Link>

            {/* Desktop Navigation - Editorial style */}
            {isLanding && (
              <nav className="hidden md:flex items-center gap-8">
                {navLinks.map((link, index) => (
                  <div key={link.href} className="flex items-center">
                    <Link
                      href={link.href}
                      className="relative py-2 text-sm font-medium text-[#4a4a5c] hover:text-[#1a1a2e] transition-colors duration-300 group"
                    >
                      <span className="font-body">{link.label}</span>
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-[#534ab7] transition-all duration-300 group-hover:w-full" />
                    </Link>
                    {index < navLinks.length - 1 && (
                      <span className="ml-8 w-1 h-1 rounded-full bg-[#534ab7]/20" />
                    )}
                  </div>
                ))}
              </nav>
            )}

            {/* Auth Section */}
            <div className="flex items-center gap-4">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="hidden sm:block text-sm font-medium text-[#4a4a5c] hover:text-[#1a1a2e] transition-colors duration-300"
                  >
                    Ingresar
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="relative overflow-hidden px-5 py-2.5 bg-[#534ab7] text-white text-sm font-semibold rounded-sm transition-all duration-300 hover:bg-[#3c3489] hover:shadow-lg hover:shadow-[#534ab7]/25 group">
                    <span className="relative z-10">Empezar</span>
                  </button>
                </SignUpButton>
              </Show>

              <Show when="signed-in">
                <Link
                  href="/dashboard"
                  className="hidden sm:block text-sm font-medium text-[#4a4a5c] hover:text-[#1a1a2e] transition-colors duration-300"
                >
                  Mi Escritorio
                </Link>
                <div className="w-px h-6 bg-[#534ab7]/10 hidden sm:block"></div>
                <UserButton />
              </Show>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-[#1a1a2e] hover:text-[#534ab7] transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Decorative line */}
        <div
          className={`h-px bg-gradient-to-r from-transparent via-[#534ab7]/20 to-transparent transition-opacity duration-500 ${
            isScrolled ? "opacity-100" : "opacity-0"
          }`}
        />
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className="absolute inset-0 bg-[#1a1a2e]/20 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute top-20 left-4 right-4 bg-white rounded-lg shadow-editorial-lg p-6 transform transition-all duration-500 ${
            isMobileMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-4 opacity-0"
          }`}
        >
          <nav className="flex flex-col gap-4">
            {navLinks.map((link, index) => (
              <React.Fragment key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-3 text-lg font-medium text-[#1a1a2e] hover:text-[#534ab7] transition-colors"
                >
                  {link.label}
                </Link>
                {index < navLinks.length - 1 && (
                  <div className="h-px bg-[#534ab7]/10" />
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};
