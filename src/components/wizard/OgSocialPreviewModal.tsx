import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { OgPreviewCard } from "@/components/wizard/OgPreviewCard";
import { X as XIcon, Share2, Copy, Check, MessageCircle, Facebook, Linkedin, Twitter, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import { uploadFiles } from "@/lib/uploadthing";

export type SocialNetwork = 'whatsapp' | 'facebook' | 'linkedin' | 'x';

export const socialNetworks = [
  { id: 'whatsapp' as SocialNetwork, name: 'WhatsApp', icon: MessageCircle, color: '#25D366' },
  { id: 'facebook' as SocialNetwork, name: 'Facebook', icon: Facebook, color: '#1877F2' },
  { id: 'linkedin' as SocialNetwork, name: 'LinkedIn', icon: Linkedin, color: '#0A66C2' },
  { id: 'x' as SocialNetwork, name: 'X', icon: Twitter, color: '#000000' },
];

export interface OgSocialPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Card Props
  name: string;
  title: string;
  province: string;
  image?: string | null;
  isVerified?: boolean;
  especialidadDestacada?: string;
  especialidadesPills?: string[];
  aliasPerfil?: string;
  shouldCapture?: boolean;
  // Optional rendering customizations
  footerActionText?: string;
  onFooterAction?: (ogUrl?: string) => void | Promise<void>;
  footerIcon?: React.ReactNode;
  footerLeftContent?: React.ReactNode;
}

export function OgSocialPreviewModal({
  isOpen,
  onClose,
  name,
  title,
  province,
  image,
  isVerified = false,
  especialidadDestacada,
  especialidadesPills = [],
  aliasPerfil,
  shouldCapture = true,
  footerActionText = "Entendido",
  onFooterAction,
  footerIcon,
  footerLeftContent,
}: OgSocialPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<SocialNetwork>('whatsapp');
  const [copied, setCopied] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const profileUrl = aliasPerfil ? `docentelink.ar/cv/${aliasPerfil}` : 'docentelink.ar/cv/tu-perfil';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`https://${profileUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const activeNetwork = socialNetworks.find(n => n.id === activeTab);

  const handleAction = async () => {
    if (onFooterAction && cardRef.current && shouldCapture) {
      try {
        setIsCapturing(true);
        // Force rendering at 1x scale for capture
        const dataUrl = await toPng(cardRef.current, {
          width: 1200,
          height: 630,
          pixelRatio: 1,
          style: {
            transform: 'scale(1)',
            transformOrigin: 'top left',
          }
        });

        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], `og-${aliasPerfil || 'preview'}.png`, { type: 'image/png' });

        const uploadRes = await uploadFiles("ogImage", { files: [file] });
        const ogUrl = uploadRes[0]?.url;

        await onFooterAction(ogUrl);
      } catch (err) {
        console.error("Failed to capture and upload OG image:", err);
        // Fallback to normal action without ogUrl
        await onFooterAction();
      } finally {
        setIsCapturing(false);
      }
    } else if (onFooterAction) {
      await onFooterAction();
    } else {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-[#534ab7]/5 to-transparent shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#534ab7] flex items-center justify-center">
              <Share2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#1a1a2e]">Vista previa</h3>
              <p className="text-[11px] text-[#4a4a5c]">Así se verá al compartir</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XIcon className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Tabs de redes sociales */}
        <div className="flex border-b border-gray-100 shrink-0 overflow-x-auto scroolbar-hide">
          {socialNetworks.map((network) => {
            const Icon = network.icon;
            const isActive = activeTab === network.id;
            return (
              <button
                key={network.id}
                onClick={() => setActiveTab(network.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-[#534ab7] border-b-2 border-[#534ab7] bg-[#534ab7]/5'
                    : 'text-[#4a4a5c] hover:bg-gray-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: isActive ? network.color : undefined }} />
                {network.name}
              </button>
            );
          })}
        </div>

        {/* Contenido principal - adaptado para no scrollear idealmente */}
        <div className="flex-1 overflow-y-auto w-full bg-gray-50/30">
          <div className="p-4 sm:p-5 flex flex-col items-center gap-4">
            {/* Link con botón copiar */}
            <div className="flex items-center gap-2 w-full max-w-[450px]">
              <div className="flex-1 flex items-center gap-1.5 bg-white rounded-lg px-3 py-2 border border-gray-200">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1d9e75] shrink-0" />
                <span className="text-xs text-[#4a4a5c] shrink-0">Tu link:</span>
                <code className="font-mono text-xs text-[#534ab7] font-semibold truncate bg-transparent border-0 p-0 m-0">
                  {profileUrl}
                </code>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="shrink-0 h-9 px-3 text-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1.5 text-green-500" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1.5" />
                    Copiar
                  </>
                )}
              </Button>
            </div>

            {/* Mockup de la red social seleccionada */}
            <div className="relative w-full max-w-[450px] shadow-sm rounded-xl overflow-hidden bg-white border border-gray-200">
              {/* Header del mockup */}
              <div
                className="px-3 py-1.5 flex items-center gap-1.5"
                style={{ backgroundColor: activeNetwork?.color || '#25D366' }}
              >
                {activeNetwork && (
                  <>
                    <activeNetwork.icon className="w-3.5 h-3.5 text-white" />
                    <span className="text-white text-xs font-medium">{activeNetwork.name}</span>
                  </>
                )}
              </div>

              {/* Área del preview - fondo tipo chat/preview */}
              <div className="bg-[#f0f2f5] p-3 flex flex-col items-center">
                {/* Contenedor del OG Card - escala ajustada para ocupar menos altura */}
                {/* 1200x630 -> scale 0.35 = 420x220.5 */}
                <div className="w-full max-w-[420px] mx-auto bg-white rounded-t-lg overflow-hidden shadow-sm border border-gray-200 border-b-0 h-[220.5px]">
                  <div className="transform scale-[0.35] origin-top-left" style={{ width: '1200px', height: '630px' }}>
                    <div ref={cardRef} style={{ width: '1200px', height: '630px' }}>
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
                </div>

                {/* Metadatos OG Preview - como aparece en WhatsApp */}
                <div className="w-full max-w-[420px] mx-auto bg-white rounded-b-lg p-2.5 shadow-sm border border-gray-200 border-l-4 border-l-[#534ab7]">
                  {/* Título OG */}
                  <p className="text-xs font-semibold text-[#1a1a2e] line-clamp-1 leading-snug">
                    {name || 'Docente'} | {title || 'Perfil Profesional'} | Perfil en DocenteLink
                  </p>
                  {/* Descripción OG */}
                  <p className="text-[10px] text-[#4a4a5c] mt-0.5 line-clamp-1 leading-snug">
                    CV de {name || 'Docente'}{title ? `, ${title}` : ''}{province ? ` en ${province}` : ''}, perfil profesional en DocenteLink
                  </p>
                  {/* Dominio */}
                  <p className="text-[10px] text-[#534ab7] mt-0.5 font-medium leading-none">
                    docentelink.ar
                  </p>
                </div>
              </div>
            </div>

            {/* Descripción / Notice */}
            <div className="bg-[#eeedfe] rounded-lg p-3 w-full max-w-[450px]">
              <p className="text-[11px] sm:text-xs text-[#3c3489] leading-relaxed text-center">
                Esta es la tarjeta de previsualización que aparecerá al compartir tu perfil en <strong>{activeNetwork?.name}</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between shrink-0 bg-white">
          {footerLeftContent !== undefined ? (
            footerLeftContent
          ) : (
            <p className="text-xs text-[#4a4a5c] hidden sm:block">
              Se actualiza automáticamente
            </p>
          )}
          <button
            onClick={handleAction}
            disabled={isCapturing}
            className="px-5 py-2 sm:py-2.5 bg-[#534ab7] text-white text-sm font-semibold rounded-lg hover:bg-[#3c3489] transition-colors ml-auto flex items-center gap-2 shadow-sm disabled:opacity-70"
          >
            {isCapturing ? "Generando visual..." : footerActionText} 
            {isCapturing ? <Loader2 className="w-4 h-4 animate-spin" /> : footerIcon}
          </button>
        </div>
      </div>
    </div>
  );
}
