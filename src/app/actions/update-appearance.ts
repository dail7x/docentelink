'use server';

import { db } from '@/db';
import { resumes } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface UpdateAppearanceParams {
  resumeId: string;
  theme: string;
  photoShape: string;
  photoBorder: boolean;
}

export async function updateAppearanceAction({
  resumeId,
  theme,
  photoShape,
  photoBorder,
}: UpdateAppearanceParams) {
  try {
    await db
      .update(resumes)
      .set({
        theme: theme,
        photoShape: photoShape,
        photoBorder: photoBorder,
      })
      .where(eq(resumes.id, resumeId));

    return { success: true };
  } catch (error) {
    console.error('Error updating appearance:', error);
    throw new Error('Error al guardar la apariencia');
  }
}