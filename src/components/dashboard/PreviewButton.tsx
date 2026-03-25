'use client';

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Eye } from "lucide-react";
import { OgSocialPreviewModal } from "@/components/wizard/OgSocialPreviewModal";

interface PreviewButtonProps {
  name: string;
  title: string;
  province: string;
  image?: string | null;
  isVerified?: boolean;
  especialidadDestacada?: string;
  especialidadesPills?: string[];
  aliasPerfil?: string;
}

export function PreviewButton({
  name,
  title,
  province,
  image,
  isVerified = false,
  especialidadDestacada,
  especialidadesPills = [],
  aliasPerfil,
}: PreviewButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="font-bold border-gray-200"
        onClick={() => setIsOpen(true)}
      >
        <Eye className="w-4 h-4 mr-2" /> Previsualizar tarjeta
      </Button>

      <OgSocialPreviewModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        name={name}
        title={title}
        province={province}
        image={image}
        isVerified={isVerified}
        especialidadDestacada={especialidadDestacada}
        especialidadesPills={especialidadesPills}
        aliasPerfil={aliasPerfil}
        footerActionText="Entendido"
      />
    </>
  );
}
