import React from 'react';
import { getPublicResumeAction } from '@/app/actions/get-public-cv';
import { notFound } from 'next/navigation';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  Briefcase, 
  Award, 
  ExternalLink,
  ChevronRight,
  User as UserIcon
} from 'lucide-react';
import Image from 'next/image';

export default async function PublicCVPage({ params }: { params: { username: string } }) {
  const resume = await getPublicResumeAction(params.username);

  if (!resume) {
    notFound();
  }

  const { meta } = resume;
  const docente = meta.docente;

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
                  {docente.photoUrl ? (
                    <Image 
                      src={docente.photoUrl} 
                      alt={docente.nombre} 
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
                 <div className="space-y-1">
                    <h1 className="text-4xl md:text-5xl font-black text-dl-primary-dark tracking-tight leading-none">
                       {docente.nombre}
                    </h1>
                    <p className="text-xl font-bold text-dl-accent italic opacity-90">
                       {docente.tituloHabilitante || "Perfil Docente"}
                    </p>
                 </div>
                 
                 <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <a href={`mailto:${docente.email}`} className="flex items-center gap-2 px-4 py-2 bg-dl-primary-bg rounded-full text-sm font-bold text-dl-primary-dark hover:bg-dl-accent hover:text-white transition-all shadow-sm">
                       <Mail className="w-4 h-4" /> {docente.email}
                    </a>
                    <a href={`https://wa.me/${docente.telefono.replace(/\+/g, '').replace(/\s/g, '')}`} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-dl-primary-bg rounded-full text-sm font-bold text-dl-primary-dark hover:bg-green-500 hover:text-white transition-all shadow-sm">
                       <Phone className="w-4 h-4" /> WhatsApp
                    </a>
                 </div>
              </div>
           </div>
        </header>

        {/* Cuerpo del CV */}
        <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
           
           {/* Columna Izquierda (Sidebar) */}
           <div className="space-y-8">
              {/* Formación Académica */}
              <section className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-dl-primary-dark/5 border border-dl-primary-light/5">
                 <h2 className="text-lg font-black text-dl-primary-dark uppercase tracking-widest mb-6 flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 text-dl-accent" /> Formación
                 </h2>
                 <div className="space-y-6">
                    {docente.formacion.map((edu: any, i: number) => (
                       <div key={i} className="group cursor-default">
                          <p className="text-sm font-black text-dl-primary-dark group-hover:text-dl-accent transition-colors">
                             {edu.titulo}
                          </p>
                          <p className="text-xs font-bold text-dl-muted leading-tight mt-1">
                             {edu.institucion}
                          </p>
                          <span className="inline-block mt-2 px-3 py-1 bg-dl-primary-bg rounded-lg text-[10px] font-black text-dl-muted uppercase tracking-wider">
                             {edu.anio || "En curso"}
                          </span>
                       </div>
                    ))}
                 </div>
              </section>

              {/* Cursos & Capacitaciones */}
              <section className="bg-dl-primary-dark rounded-[2.5rem] p-8 shadow-xl text-white">
                 <h2 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-3 text-dl-accent">
                    <Award className="w-4 h-4" /> Capacitaciones
                 </h2>
                 <div className="space-y-5">
                    {docente.cursos?.map((c: any, i: number) => (
                       <div key={i} className="border-l-2 border-dl-accent/30 pl-4 py-1">
                          <p className="text-xs font-black leading-tight">{c.nombre}</p>
                          <p className="text-[10px] font-bold text-white/50 mt-1 uppercase tracking-tighter">{c.institucion}</p>
                       </div>
                    ))}
                 </div>
              </section>
           </div>

           {/* Columna Derecha (Contenido Principal) */}
           <div className="md:col-span-2 space-y-8">
              {/* Experiencia Laboral */}
              <section className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-dl-primary-dark/5 border border-dl-primary-light/10">
                 <h2 className="text-2xl font-black text-dl-primary-dark tracking-tight mb-10 flex items-center justify-between">
                    Trayectoria Docente
                    <Briefcase className="w-6 h-6 text-dl-accent opacity-30" />
                 </h2>

                 <div className="space-y-12 relative">
                    {/* Línea vertical de tiempo */}
                    <div className="absolute left-0 top-2 bottom-0 w-1 bg-dl-primary-bg rounded-full hidden md:block"></div>

                    {docente.experiencia.map((exp: any, i: number) => (
                       <div key={i} className="relative md:pl-10 group">
                          {/* Dot indicador */}
                          <div className="absolute left-[-5px] top-2 w-3.5 h-3.5 rounded-full bg-dl-primary-bg border-2 border-white group-hover:bg-dl-accent group-hover:scale-125 transition-all hidden md:block z-10 shadow-sm"></div>
                          
                          <div className="space-y-3">
                             <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                <h3 className="text-xl font-black text-dl-primary-dark group-hover:text-dl-accent transition-colors leading-none">
                                   {exp.cargo}
                                </h3>
                                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-dl-accent/10 text-dl-accent rounded-full whitespace-nowrap">
                                   {exp.desde} — {exp.hasta || "Actualidad"}
                                </span>
                             </div>
                             
                             <p className="text-md font-bold text-dl-muted leading-tight">
                                {exp.institucion}
                             </p>

                             {exp.descripcion && (
                               <div className="bg-dl-primary-bg/50 p-6 rounded-2xl border-l-4 border-dl-primary-light/20">
                                  <p className="text-sm font-medium text-dl-primary-dark/80 whitespace-pre-line leading-relaxed italic">
                                     "{exp.descripcion}"
                                  </p>
                               </div>
                             )}
                          </div>
                       </div>
                    ))}
                 </div>
              </section>
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
