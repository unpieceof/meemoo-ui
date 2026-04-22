import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, url }) => {
  const search = url.searchParams.get('q') ?? '';
  const category = url.searchParams.get('category') ?? '';
  const tags = url.searchParams.getAll('tag').filter(Boolean);

  let query = locals.supabase
    .from('memos')
    .select('id,title,summary_bullets,category,tags,source_url,source_type,created_at,raw_content')
    .order('created_at', { ascending: false })
    .limit(200);

  if (search) {
    const terms = search.trim().split(/\s+/).filter(Boolean);
    for (const term of terms) {
      query = query.or(`title.ilike.%${term}%,tags.cs.{"${term}"}`);
    }
  }
  if (category) {
    query = query.eq('category', category);
  }
  if (tags.length) {
    query = query.contains('tags', tags);
  }

  const { data: memos, error: dbError } = await query;
  if (dbError) return json({ memos: [] });

  return json({ memos: memos ?? [] });
};

export const POST: RequestHandler = async ({ request, locals }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Invalid JSON body');
  }

  const allowedFields = [
    'title',
    'category',
    'tags',
    'summary_bullets',
    'source_url',
    'source_type',
    'raw_content'
  ];
  const insert: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (field in body) insert[field] = body[field];
  }

  if (!insert.title || typeof insert.title !== 'string' || !insert.title.trim()) {
    throw error(400, 'title is required');
  }

  const { data, error: dbError } = await locals.supabase
    .from('memos')
    // Supabase generated types default to `never` on insert — cast to bypass
    .insert(insert as never)
    .select('id')
    .single();

  if (dbError) throw error(500, dbError.message);

  return json({ success: true, id: (data as { id?: string } | null)?.id });
};
