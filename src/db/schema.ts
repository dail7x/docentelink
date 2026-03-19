import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id:            text('id').primaryKey(), // Correspondiente al Clerk userId
  email:         text('email').notNull().unique(),
  name:          text('name'),
  imageUrl:      text('image_url'),
  plan:          text('plan').default('free').$type<'free' | 'pro'>(),
  
  // Referidos (Fase 2)
  proExpiresAt:  integer('pro_expires_at', { mode: 'timestamp' }), // null = Pro pago permanente; fecha = Pro por referido
  referredBy:    text('referred_by'),      // username del referidor
  referralCount: integer('referral_count').default(0), 
  
  createdAt:     integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const resumes = sqliteTable('resumes', {
  id:             text('id').primaryKey(),
  userId:         text('user_id').notNull().references(() => users.id),
  username:       text('username').notNull(),
  title:          text('title'),

  // Datos del CV — JSON Resume estándar + meta.docente
  jsonResume:     text('json_resume', { mode: 'json' }).notNull().$type<JsonResume>(),

  // Visibilidad
  isPublic:       integer('is_public',      { mode: 'boolean' }).default(false),
  parsedFromPdf:  integer('parsed_from_pdf', { mode: 'boolean' }).default(false),

  // Foto
  photoProcessed: integer('photo_processed', { mode: 'boolean' }).default(false),
  photoFrame:     text('photo_frame').default('none'),

  // Gamificación
  completionScore: integer('completion_score').default(0),    // 0–100
  isVerified:      integer('is_verified', { mode: 'boolean' }).default(false),
  unlockedBadges:  text('unlocked_badges', { mode: 'json' })
                      .default(sql`'[]'`).$type<string[]>(),   // JSON array de strings

  // Analytics
  views:     integer('views').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at',  { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
}, (t) => ({
  usernameIdx: uniqueIndex('username_idx').on(t.username),
  userIdx:     uniqueIndex('user_idx').on(t.userId),
}));

// --- Types ---
export interface JsonResume {
  basics?: {
    name?: string;
    label?: string;
    image?: string;
    email?: string;
    phone?: string;
    url?: string;
    summary?: string;
    location?: {
      address?: string;
      postalCode?: string;
      city?: string;
      countryCode?: string;
      region?: string;
    };
    profiles?: Array<{
      network?: string;
      username?: string;
      url?: string;
    }>;
  };
  work?: Array<{
    name?: string;
    position?: string;
    url?: string;
    startDate?: string;
    endDate?: string;
    summary?: string;
    highlights?: string[];
  }>;
  education?: Array<{
    institution?: string;
    url?: string;
    area?: string;
    studyType?: string;
    startDate?: string;
    endDate?: string;
    score?: string;
    courses?: string[];
  }>;
  meta: {
    docente: DocenteMeta;
    [key: string]: any;
  };
}

export interface DocenteMeta {
  tituloHabilitante?: string;
  nivelEducativo:    Array<'inicial' | 'primaria' | 'secundaria' | 'terciaria' | 'universitaria' | 'adultos'>;
  materias:          string[];
  provincia:         string;
  localidad:         string;
  disponibilidad:    'inmediata' | 'a_partir_de' | 'no_disponible';
  tipoEmpleo:        Array<'planta' | 'suplencia' | 'reemplazo' | 'horas_catedra'>;
  completionScore:   number;
  isVerified:        boolean;
  parsedFromPdf:     boolean;
}
