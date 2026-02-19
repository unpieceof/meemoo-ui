<script lang="ts">
  import MemoCard from './MemoCard.svelte';
  import type { Memo } from '$lib/supabase/types';

  let { memos, onEdit }: { memos: Memo[]; onEdit: (memo: Memo) => void } = $props();
</script>

<div class="memo-grid">
  {#each memos as memo (memo.id)}
    <MemoCard {memo} {onEdit} />
  {/each}
</div>

<style>
  .memo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 16px;
  }
</style>
