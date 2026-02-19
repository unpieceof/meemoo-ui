<script lang="ts">
  import SearchBar from '$lib/components/SearchBar.svelte';
  import MemoList from '$lib/components/MemoList.svelte';
  import EmptyState from '$lib/components/EmptyState.svelte';
  import EditModal from '$lib/components/EditModal.svelte';
  import type { PageData } from './$types';
  import type { Memo } from '$lib/supabase/types';

  let { data }: { data: PageData } = $props();

  let editingMemo: Memo | null = $state(null);

  function handleEdit(memo: Memo) {
    editingMemo = memo;
  }

  function handleModalClose() {
    editingMemo = null;
  }
</script>

<div class="page">
  <SearchBar initialValue={data.search} />

  {#if data.memos.length === 0}
    <EmptyState search={data.search} category={data.category} tag={data.tag} />
  {:else}
    <div class="results-header">
      <span class="results-count">{data.memos.length}개 메모</span>
      {#if data.category}
        <span class="filter-badge">카테고리: {data.category}</span>
      {/if}
      {#if data.tag}
        <span class="filter-badge">태그: #{data.tag}</span>
      {/if}
    </div>
    <MemoList memos={data.memos} onEdit={handleEdit} />
  {/if}
</div>

{#if editingMemo}
  <EditModal memo={editingMemo} onClose={handleModalClose} />
{/if}

<style>
  .page {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .results-header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .results-count {
    font-size: 13px;
    color: var(--color-text-secondary);
  }

  .filter-badge {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    background-color: var(--color-bg-elevated);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    font-size: 12px;
    color: var(--color-accent);
  }
</style>
