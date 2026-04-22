import type { LayoutServerLoad } from './$types';

// Facet counts are not filter-dependent, so we load them here instead of in
// +page.server.ts. SvelteKit's URL-dependency tracking means this loader
// does NOT rerun on search/category/tag clicks — only on explicit
// invalidation (which we trigger after create/edit/delete).
export const load: LayoutServerLoad = async ({ locals }) => {
  const { data: rows } = await locals.supabase.from('memos').select('category,tags');

  const categoryCounts: Record<string, number> = {};
  const tagCounts: Record<string, number> = {};
  for (const row of rows ?? []) {
    const r = row as { category: string | null; tags: string[] | null };
    if (r.category) categoryCounts[r.category] = (categoryCounts[r.category] ?? 0) + 1;
    for (const t of r.tags ?? []) tagCounts[t] = (tagCounts[t] ?? 0) + 1;
  }

  return {
    categoryCounts,
    tagCounts,
    total: rows?.length ?? 0
  };
};
