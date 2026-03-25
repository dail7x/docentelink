export function getOgDeps(data: any): string {
  // We extract all fields that visibly affect the OgPreviewCard
  // to prevent unnecessary re-captures and uploads strings.
  return JSON.stringify({
    nombre: data?.nombre?.trim() || '',
    apellido: data?.apellido?.trim() || '',
    tituloHabilitante: data?.tituloHabilitante?.trim() || '',
    provincia: data?.provincia?.trim() || data?.localidades?.[0]?.trim() || '',
    photoUrl: data?.photoUrl || '',
    slug: data?.slug || '',
    materias: data?.materias || []
  });
}
