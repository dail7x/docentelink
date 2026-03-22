'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PrintCvButtonProps {
  username?: string;
  variant?: 'default' | 'floating';
}

export function PrintCvButton({ username, variant = 'default' }: PrintCvButtonProps) {
  const handlePrint = () => {
    // Agregar clase al body para estilos de impresión
    document.body.classList.add('printing-cv');
    
    // Cambiar el título temporalmente
    const originalTitle = document.title;
    if (username) {
      document.title = `CV - ${username} | DocenteLink`;
    }
    
    // Imprimir
    window.print();
    
    // Restaurar
    setTimeout(() => {
      document.body.classList.remove('printing-cv');
      document.title = originalTitle;
    }, 100);
  };

  if (variant === 'floating') {
    return (
      <div className="fixed right-6 top-24 z-40 print:hidden">
        <Button
          onClick={handlePrint}
          variant="accent"
          size="lg"
          className="shadow-xl font-bold gap-2"
        >
          <Download className="w-5 h-5" />
          Descargar CV
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handlePrint}
      variant="accent"
      className="font-bold gap-2"
    >
      <Download className="w-4 h-4" />
      Descargar CV (PDF)
    </Button>
  );
}
