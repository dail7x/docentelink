import { createClient, Config } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// Lazy connection - solo se crea cuando se usa
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!dbInstance) {
    const url = process.env.TURSO_DATABASE_URL;
    
    if (!url) {
      throw new Error("TURSO_DATABASE_URL no está definida en las variables de entorno");
    }
    
    const client = createClient({
      url,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    
    dbInstance = drizzle(client, { schema });
  }
  
  return dbInstance;
}

// Export db como getter para compatibilidad con código existente
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(target, prop) {
    return getDb()[prop as keyof typeof target];
  },
});
