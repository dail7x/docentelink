import React from 'react';
import { getPublicResumeAction } from '@/app/actions/get-public-cv';
import { notFound } from 'next/navigation';
import { 
  Mail, 
  Phone, 
  GraduationCap, 
  Briefcase, 
  Award, 
  User as UserIcon,
  AlertCircle,
  MapPin
} from 'lucide-react';
import Image from 'next/image';

// REGLA DE ORO NEXT 15/16: params ES UNA PROMISE
export default async function PublicCVPage({ params }: { params: Promise<{ username: string }> }) {
  const unwrappedParams = await params;
  const username = unwrappedParams?.username;

  if (!username) {
    notFound();
  }

  const resume = await getPublicResumeAction(username);

  if (!resume) {
    notFound();
  }

  // Mapeo del esquema: Los datos del wizard están en jsonResume
  const jsonResume = resume.jsonResume as any;
  
  // Extraemos datos de basics (donde se guardan en saveResumeAction)
  const basics = jsonResume?.basics || {};
  const metaDocente = jsonResume?.meta?.docente || {};
  
  // Priorizamos datos de basics y complementamos con meta.docente
  const nombre = basics.name || "Perfil Docente";
  const email = basics.email;
  const telefono = basics.phone;
  const foto = basics.image;
  const profesion = basics.label || metaDocente.tituloHabilitante || "Docente";
  const localidad = basics.location?.city || metaDocente.localidad;
  const provincia = basics.location?.region || metaDocente.provincia;

  // Listas de educación y experiencia
  // En saveResumeAction se guardan como work y education
  const experiencia = jsonResume?.work || [];
  const formacion = jsonResume?.education || [];
  const cursos = metaDocente.cursos || [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 pt-10 px-4 md:px-0 selection:bg-dl-accent selection:text-white">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
        
        {/* Header / Perfil */}
        <header className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-dl-primary-dark/5 border border-dl-primary-light/10 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-dl-accent/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-dl-accent/10 transition-colors duration-1000"></div>
           
           <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
              {/* Foto de Perfil Premium */}
              <div className="relative">
                <div className="w-44 h-44 md:w-52 md:h-52 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl relative z-10 bg-dl-primary-bg flex items-center justify-center">
                  {foto ? (
                    <Image 
                      src={foto} 
                      alt={nombre} 
                      fill 
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <UserIcon className="w-20 h-20 text-dl-muted opacity-20" />
                  )}
                </div>
                <div className="absolute inset-0 bg-dl-accent/30 rounded-[2.5rem] translate-x-4 translate-y-4 -z-10 blur-xl opacity-50"></div>
              </div>

              <div className="flex-1 text-center md:text-left space-y-4">
                 <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-black text-dl-primary-dark tracking-tight leading-tight">
                       {nombre}
                    </h1>
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                      <p className="text-xl font-bold text-dl-accent italic">
                         {profesion}
                      </p>
                      {(localidad || provincia) && (
                        <span className="flex items-center justify-center md:justify-start gap-1 text-dl-muted font-bold text-sm bg-dl-primary-bg px-3 py-1 rounded-full w-fit mx-auto md:mx-0">
                          <MapPin className="w-3.5 h-3.5 text-dl-accent" />
                          {localidad}{localidad && provincia ? ', ' : ''}{provincia}
                        </span>
                      )}
                    </div>
                 </div>
                 
                 <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    {email && (
                      <a href={`mailto:${email}`} className="flex items-center gap-2 px-5 py-2.5 bg-dl-primary-bg rounded-full text-sm font-bold text-dl-primary-dark hover:bg-dl-accent hover:text-white transition-all shadow-sm border border-dl-primary-light/5">
                         <Mail className="w-4 h-4" /> {email}
                      </a>
                    )}
                    {telefono && (
                      <a href={`https://wa.me/${telefono.replace(/\+/g, '').replace(/\s/g, '')}`} target="_blank" className="flex items-center gap-2 px-5 py-2.5 bg-green-50 rounded-full text-sm font-bold text-green-700 hover:bg-green-500 hover:text-white transition-all shadow-sm border border-green-100">
                         <Phone className="w-4 h-4" /> WhatsApp
                      </a>
                    )}
                 </div>
              </div>
           </div>
        </header>

        {/* Cuerpo del CV */}
        <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
           
           {/* Columna Izquierda (Sidebar) */}
           <div className="space-y-8">
              {/* Formación Académica */}
              {formacion.length > 0 && (
                <section className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-dl-primary-light/5">
                   <h2 className="text-lg font-black text-dl-primary-dark uppercase tracking-widest mb-6 flex items-center gap-3">
                      <GraduationCap className="w-5 h-5 text-dl-accent" /> Formación
                   </h2>
                   <div className="space-y-6">
                      {formacion.map((edu: any, i: number) => (
                         <div key={i} className="group cursor-default">
                            <p className="text-sm font-black text-dl-primary-dark group-hover:text-dl-accent transition-colors">
                               {edu.area || edu.titulo || edu.degree}
                            </p>
                            <p className="text-xs font-bold text-dl-muted leading-tight mt-1">
                               {edu.institution || edu.institucion}
                            </p>
                            <span className="inline-block mt-2 px-3 py-1 bg-dl-primary-bg rounded-lg text-[10px] font-black text-dl-muted uppercase tracking-wider">
                               {edu.year || edu.anio || edu.endDate || (edu.startDate ? 'En curso' : '')}
                            </span>
                         </div>
                      ))}
                   </div>
                </section>
              )}

              {/* Cursos & Capacitaciones */}
              {cursos.length > 0 && (
                <section className="bg-dl-primary-dark rounded-[2.5rem] p-8 shadow-xl text-white">
                   <h2 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-3 text-dl-accent">
                      <Award className="w-4 h-4" /> Capacitaciones
                   </h2>
                   <div className="space-y-5">
                      {cursos.map((c: any, i: number) => (
                         <div key={i} className="border-l-2 border-dl-accent/30 pl-4 py-1">
                            <p className="text-xs font-black leading-tight uppercase tracking-tight">{c.nombre}</p>
                            <p className="text-[10px] font-bold text-white/50 mt-1 uppercase leading-tight opacity-70">{c.institucion}</p>
                         </div>
                      ))}
                   </div>
                </section>
              )}
           </div>

           {/* Columna Derecha (Contenido Principal) */}
           <div className="md:col-span-2 space-y-8">
              {/* Experiencia Laboral */}
              {experiencia.length > 0 && (
                <section className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-dl-primary-light/10">
                   <h2 className="text-2xl font-black text-dl-primary-dark mb-10 flex items-center justify-between">
                      Trayectoria Docente
                      <Briefcase className="w-6 h-6 text-dl-accent opacity-30" />
                   </h2>

                   <div className="space-y-12 relative">
                      {/* Línea vertical de tiempo */}
                      <div className="absolute left-0 top-2 bottom-0 w-1 bg-dl-primary-bg rounded-full hidden md:block"></div>

                      {experiencia.map((exp: any, i: number) => (
                         <div key={i} className="relative md:pl-10 group">
                            {/* Dot indicador */}
                            <div className="absolute left-[-5.5px] top-2 w-4 h-4 rounded-full bg-dl-primary-bg border-4 border-white group-hover:bg-dl-accent group-hover:scale-125 transition-all hidden md:block z-10 shadow-sm"></div>
                            
                            <div className="space-y-3">
                               <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                  <h3 className="text-xl font-black text-dl-primary-dark group-hover:text-dl-accent transition-colors leading-none">
                                     {exp.position || exp.cargo}
                                  </h3>
                                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-dl-accent/10 text-dl-accent rounded-full whitespace-nowrap">
                                     {exp.startDate || exp.desde} — {exp.endDate || exp.hasta || "Actualidad"}
                                  </span>
                               </div>
                               
                               <p className="text-md font-bold text-dl-muted leading-tight">
                                  {exp.name || exp.institucion}
                               </p>

                               {(exp.summary || exp.descripcion) && (
                                 <div className="bg-dl-primary-bg/50 p-6 rounded-2xl border-l-4 border-dl-primary-light/20">
                                    <p className="text-sm font-medium text-dl-primary-dark/80 whitespace-pre-line leading-relaxed italic">
                                       "{exp.summary || exp.descripcion}"
                                    </p>
                                 </div>
                               )}
                            </div>
                         </div>
                      ))}
                   </div>
                </section>
              )}
           </div>
        </main>

        {/* Footer simple */}
        <footer className="text-center pt-10 text-dl-muted/50">
           <p className="text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
              Perfil verificado en <span className="text-dl-accent">docentelink.ar</span>
           </p>
        </footer>
      </div>
    </div>
  );
}
