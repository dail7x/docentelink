'use client';

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { OgPreviewCard } from "@/components/wizard/OgPreviewCard";
import { Eye, X, Share2, Copy, Check, MessageCircle, Facebook, Linkedin, Twitter } from "lucide-react";

type SocialNetwork = 'whatsapp' | 'facebook' | 'linkedin' | 'twitter';

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

const socialNetworks = [
  { id: 'whatsapp' as SocialNetwork, name: 'WhatsApp', icon: MessageCircle, color: '#25D366' },
  { id: 'facebook' as SocialNetwork, name: 'Facebook', icon: Facebook, color: '#1877F2' },
  { id: 'linkedin' as SocialNetwork, name: 'LinkedIn', icon: Linkedin, color: '#0A66C2' },
  { id: 'twitter' as SocialNetwork, name: 'Twitter', icon: Twitter, color: '#1DA1F2' },
];

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
  const [activeTab, setActiveTab] = useState<SocialNetwork>('whatsapp');
  const [copied, setCopied] = useState(false);

  const profileUrl = `docentelink.ar/cv/${aliasPerfil}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`https://${profileUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="font-bold"
        onClick={() => setIsOpen(true)}
      >
        <Eye className="w-4 h-4 mr-2" /> Previsualizar tarjeta
      </Button>
    );
  }

  const activeNetwork = socialNetworks.find(n => n.id === activeTab);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-3xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#534ab7]/5 to-transparent shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#534ab7] flex items-center justify-center">
              <Share2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1a1a2e]">Vista previa</h3>
              <p className="text-xs text-[#4a4a5c]">Así se verá al compartir</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Tabs de redes sociales */}
        <div className="flex border-b border-gray-100 shrink-0 overflow-x-auto">
          {socialNetworks.map((network) => {
            const Icon = network.icon;
            const isActive = activeTab === network.id;
            return (
              <button
                key={network.id}
                onClick={() => setActiveTab(network.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-[#534ab7] border-b-2 border-[#534ab7] bg-[#534ab7]/5'
                    : 'text-[#4a4a5c] hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" style={{ color: isActive ? network.color : undefined }} />
                {network.name}
              </button>
            );
          })}
        </div>

        {/* Contenido scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Link con botón copiar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                <div className="w-2 h-2 rounded-full bg-[#1d9e75]" />
                <span className="text-sm text-[#4a4a5c]">Tu link:</span>
                <code className="font-mono text-sm text-[#534ab7] font-semibold truncate">
                  {profileUrl}
                </code>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-green-500" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </>
                )}
              </Button>
            </div>

            {/* Mockup de la red social seleccionada */}
            <div className="relative">
              {/* Header del mockup */}
              <div
                className="rounded-t-xl px-4 py-2 flex items-center gap-2"
                style={{ backgroundColor: activeNetwork?.color || '#25D366' }}
              >
                {activeNetwork && (
                  <>
                    <activeNetwork.icon className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-medium">{activeNetwork.name}</span>
                  </>
                )}
              </div>

              {/* Área del preview - fondo tipo chat/preview */}
              <div className="bg-[#f0f2f5] rounded-b-xl p-4">
                {/* Contenedor del OG Card - escala ajustada */}
                <div className="w-full max-w-[500px] mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
                  <div className="transform scale-[0.42] origin-top-left" style={{ width: '1200px', height: '630px' }}>
                    <OgPreviewCard
                      name={name}
                      title={title}
                      province={province}
                      image={image}
                      isVerified={isVerified}
                      especialidadDestacada={especialidadDestacada}
                      especialidadesPills={especialidadesPills}
                      aliasPerfil={aliasPerfil}
                    />
                  </div>
                </div>

                {/* Metadatos OG Preview - como aparece en WhatsApp */}
                <div className="w-full max-w-[500px] mx-auto mt-[1px] bg-white rounded-b-lg p-3 shadow-sm border-l-4 border-[#534ab7] border-t border-gray-100">
                  {/* Título OG */}
                  <p className="text-sm font-semibold text-[#1a1a2e] line-clamp-1">
                    {name || 'Docente'} | {title || 'Perfil Profesional'} | Perfil en DocenteLink
                  </p>
                  {/* Descripción OG */}
                  <p className="text-xs text-[#4a4a5c] mt-1 line-clamp-2">
                    CV de {name || 'Docente'}{title ? `, ${title}` : ''}{province ? ` en ${province}` : ''}, perfil profesional en DocenteLink
                  </p>
                  {/* Dominio */}
                  <p className="text-xs text-[#534ab7] mt-1 font-medium">
                    docentelink.ar
                  </p>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="bg-[#eeedfe] rounded-xl p-4">
              <p className="text-sm text-[#3c3489] leading-relaxed">
                Esta es la tarjeta de previsualización que aparecerá cuando compartas tu perfil en <strong>{activeNetwork?.name}</strong>. La imagen se genera automáticamente con tu información actual.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between shrink-0 bg-gray-50/50">
          <p className="text-xs text-[#4a4a5c]">
            Se actualiza automáticamente con los cambios de tu perfil
          </p>
          <button
            onClick={() => setIsOpen(false)}
            className="px-5 py-2 bg-[#534ab7] text-white text-sm font-semibold rounded-lg hover:bg-[#3c3489] transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
