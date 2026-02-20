import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const search = url.searchParams.get('q') ?? '';
  const category = url.searchParams.get('category') ?? '';
  const tag = url.searchParams.get('tag') ?? '';

  let query = locals.supabase
    .from('memos')
    .select('id,title,summary_bullets,category,tags,source_url,source_type,created_at')
    .order('created_at', { ascending: false })
    .limit(200);

  if (search) {
    query = query.textSearch('title', search, { type: 'websearch', config: 'simple' });
  }
  if (category) {
    query = query.eq('category', category);
  }
  if (tag) {
    query = query.contains('tags', [tag]);
  }

  const { data: memos, error } = await query;

  if (error) {
    console.error('Failed to load memos:', error);
    return { memos: [], search, category, tag };
  }

  return { memos: memos ?? [], search, category, tag };
};
