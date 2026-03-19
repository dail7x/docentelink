import { db } from "@/db";
import { users } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function syncClerkUserWithDb() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const userEmail = clerkUser.emailAddresses[0]?.emailAddress;
  if (!userEmail) return null;

  const existingUser = await db.query.users.findFirst({
    where: eq(users.id, clerkUser.id),
  });

  if (!existingUser) {
    await db.insert(users).values({
      id: clerkUser.id,
      email: userEmail,
      name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || null,
      imageUrl: clerkUser.imageUrl || null,
      plan: 'free',
    });
    
    return await db.query.users.findFirst({
      where: eq(users.id, clerkUser.id),
    });
  }

  return existingUser;
}
