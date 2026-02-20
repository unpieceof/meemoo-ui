import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
  const [{ data: categories }, { data: tagsData }] = await Promise.all([
    locals.supabase.from('memos').select('category').not('category', 'is', null),
    locals.supabase.from('memos').select('tags').not('tags', 'is', null)
  ]);

  // Count per category
  const categoryCounts: Record<string, number> = {};
  let total = 0;
  for (const row of categories ?? []) {
    if (row.category) {
      categoryCounts[row.category] = (categoryCounts[row.category] ?? 0) + 1;
      total++;
    }
  }

  // Flatten tags and dedupe
  const tagSet = new Set<string>();
  for (const row of tagsData ?? []) {
    for (const tag of row.tags ?? []) {
      tagSet.add(tag);
    }
  }

  return {
    categories: categoryCounts,
    total,
    allTags: Array.from(tagSet).sort()
  };
};
