import { Loader2, Sparkles } from 'lucide-react';

export default function CreateCvLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-8">
      <div className="relative">
        <Loader2 className="w-24 h-24 text-dl-accent animate-spin" />
        <Sparkles className="absolute top-0 right-0 w-8 h-8 text-dl-primary animate-pulse" />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-dl-primary-dark">
          Preparando tu espacio...
        </h2>
        <p className="text-dl-muted font-medium">
          Estamos cargando todo lo necesario para crear tu perfil
        </p>
      </div>
    </div>
  );
}
