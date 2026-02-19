import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
  const { data, error: dbError } = await locals.supabase
    .from('memos')
    .select('*')
    .eq('id', params.id)
    .single();

  if (dbError || !data) throw error(404, 'Not found');
  return { memo: data };
};
