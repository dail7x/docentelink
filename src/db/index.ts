import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// Singleton para el cliente de DB
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

function createDbClient() {
  const url = process.env.TURSO_DATABASE_URL;
  
  if (!url || url === 'undefined') {
    // Durante el build time en Coolify, retornamos un mock que fallará gracefulmente
    // o lanzamos un error claro
    if (process.env.NODE_ENV === 'production' && !process.env.COOLIFY_CONTAINER_NAME) {
      // Estamos en build time de Coolify
      console.warn('TURSO_DATABASE_URL no disponible durante build - esto es normal en Coolify/Nixpacks');
    }
    throw new Error("TURSO_DATABASE_URL no está definida");
  }
  
  const client = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  
  return drizzle(client, { schema });
}

export function getDb() {
  if (!dbInstance) {
    dbInstance = createDbClient();
  }
  return dbInstance;
}

// Para mantener compatibilidad con imports existentes
// Usamos un getter que solo se ejecuta cuando se accede a las propiedades
const handler = {
  get(_target: any, prop: string | symbol) {
    const db = getDb();
    const value = (db as any)[prop];
    if (typeof value === 'function') {
      return value.bind(db);
    }
    return value;
  }
};

export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, handler);
