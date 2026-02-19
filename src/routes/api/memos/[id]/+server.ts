import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
  const { id } = params;
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    throw error(400, 'Invalid JSON body');
  }

  const allowedFields = ['title', 'category', 'tags', 'summary_bullets', 'raw_content'];
  const update: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (field in body) {
      update[field] = body[field];
    }
  }

  if (Object.keys(update).length === 0) {
    throw error(400, 'No valid fields to update');
  }

  const { error: dbError } = await locals.supabase
    .from('memos')
    .update(update)
    .eq('id', id);

  if (dbError) {
    throw error(500, dbError.message);
  }

  return json({ success: true });
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
  const { id } = params;

  const { error: dbError } = await locals.supabase
    .from('memos')
    .delete()
    .eq('id', id);

  if (dbError) {
    throw error(500, dbError.message);
  }

  return json({ success: true });
};
