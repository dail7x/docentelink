'use client';

import React from 'react';
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b-2 border-dl-primary-light/40">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>
        
        {isLanding && (
          <nav className="hidden md:flex items-center gap-10 text-sm font-bold text-dl-primary-dark tracking-wide uppercase tracking-widest">
            <Link href="#como-funciona" className="hover:text-dl-accent transition-colors duration-200">
              Cómo funciona
            </Link>
            <Link href="#planes" className="hover:text-dl-accent transition-colors duration-200">
              Planes
            </Link>
            <Link href="#preguntas" className="hover:text-dl-accent transition-colors duration-200">
              Preguntas
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-6">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="hidden sm:block text-sm font-bold text-dl-primary-dark uppercase hover:text-dl-accent tracking-widest cursor-pointer">
                Ingresar
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant="primary" size="md" className="font-bold">
                Empezar
              </Button>
            </SignUpButton>
          </Show>
          
          <Show when="signed-in">
             <Link href="/dashboard" className="hidden sm:block text-sm font-bold text-dl-primary-dark uppercase hover:text-dl-accent tracking-widest">
                Mi Escritorio
             </Link>
             <UserButton />
          </Show>
        </div>
      </div>
    </header>
  );
};
