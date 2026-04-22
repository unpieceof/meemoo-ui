import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
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

  const [{ data: memos, error }, { count: total }] = await Promise.all([
    query,
    locals.supabase.from('memos').select('*', { count: 'exact', head: true })
  ]);

  if (error) {
    console.error('Failed to load memos:', error);
    return { memos: [], total: total ?? 0, search, category, tags };
  }

  return { memos: memos ?? [], total: total ?? memos?.length ?? 0, search, category, tags };
};
