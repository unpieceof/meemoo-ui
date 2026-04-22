import type { PageServerLoad } from './$types';

const PAGE_SIZE = 15;

export const load: PageServerLoad = async ({ locals, url }) => {
  const search = url.searchParams.get('q') ?? '';
  const category = url.searchParams.get('category') ?? '';
  const tags = url.searchParams.getAll('tag').filter(Boolean);
  const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10) || 1);

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = locals.supabase
    .from('memos')
    .select('id,title,summary_bullets,category,tags,source_url,source_type,created_at,raw_content', {
      count: 'exact'
    })
    .order('created_at', { ascending: false })
    .range(from, to);

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

  const [
    { data: memos, error, count: filteredCount },
    { count: total }
  ] = await Promise.all([
    query,
    locals.supabase.from('memos').select('*', { count: 'exact', head: true })
  ]);

  if (error) {
    console.error('Failed to load memos:', error);
    return {
      memos: [],
      total: total ?? 0,
      filteredCount: 0,
      search,
      category,
      tags,
      page,
      pageSize: PAGE_SIZE
    };
  }

  return {
    memos: memos ?? [],
    total: total ?? 0,
    filteredCount: filteredCount ?? memos?.length ?? 0,
    search,
    category,
    tags,
    page,
    pageSize: PAGE_SIZE
  };
};
