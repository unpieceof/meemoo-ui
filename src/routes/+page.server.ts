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
    .select(
      'id,title,summary_bullets,category,tags,source_url,source_type,created_at,raw_content',
      { count: 'exact' }
    )
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

  // Facet query: pull category+tags for ALL memos (ignoring current filters) so
  // that the Navbar can keep showing every section/tag even after a filter is
  // applied. `category` and `tags` are small columns; fetching them all is
  // cheaper than maintaining a separate aggregation table.
  const [
    { data: memos, error, count: filteredCount },
    { data: facetRows }
  ] = await Promise.all([
    query,
    locals.supabase.from('memos').select('category,tags')
  ]);

  const categoryCounts: Record<string, number> = {};
  const tagCounts: Record<string, number> = {};
  for (const row of facetRows ?? []) {
    const r = row as { category: string | null; tags: string[] | null };
    if (r.category) categoryCounts[r.category] = (categoryCounts[r.category] ?? 0) + 1;
    for (const t of r.tags ?? []) tagCounts[t] = (tagCounts[t] ?? 0) + 1;
  }
  const total = facetRows?.length ?? 0;

  if (error) {
    console.error('Failed to load memos:', error);
    return {
      memos: [],
      total,
      filteredCount: 0,
      categoryCounts,
      tagCounts,
      search,
      category,
      tags,
      page,
      pageSize: PAGE_SIZE
    };
  }

  return {
    memos: memos ?? [],
    total,
    filteredCount: filteredCount ?? memos?.length ?? 0,
    categoryCounts,
    tagCounts,
    search,
    category,
    tags,
    page,
    pageSize: PAGE_SIZE
  };
};
