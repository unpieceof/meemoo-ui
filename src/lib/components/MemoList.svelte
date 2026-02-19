<script lang="ts">
  import MemoCard from './MemoCard.svelte';
  import MemoListItem from './MemoListItem.svelte';
  import type { Memo } from '$lib/supabase/types';

  let {
    memos,
    onEdit,
    view = 'card'
  }: {
    memos: Memo[];
    onEdit: (memo: Memo) => void;
    view?: 'card' | 'list';
  } = $props();
</script>

{#if view === 'card'}
  <div class="memo-grid">
    {#each memos as memo (memo.id)}
      <MemoCard {memo} {onEdit} />
    {/each}
  </div>
{:else}
  <div class="memo-list">
    {#each memos as memo (memo.id)}
      <MemoListItem {memo} {onEdit} />
    {/each}
  </div>
{/if}

<style>
  .memo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 16px;
  }

  .memo-list {
    display: flex;
    flex-direction: column;
  }
</style>
