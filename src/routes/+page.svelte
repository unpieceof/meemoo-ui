<script lang="ts">
  import SearchBar from '$lib/components/SearchBar.svelte';
  import MemoList from '$lib/components/MemoList.svelte';
  import EmptyState from '$lib/components/EmptyState.svelte';
  import EditModal from '$lib/components/EditModal.svelte';
  import type { PageData } from './$types';
  import type { Memo } from '$lib/supabase/types';

  let { data }: { data: PageData } = $props();

  // 결과 목록은 로컬 상태로 관리 — 검색 시 페이지 재렌더링 없음
  let memos = $state(data.memos);
  let currentSearch = $state(data.search);
  let editingMemo: Memo | null = $state(null);
  let view = $state<'card' | 'list'>('card');

  // 카테고리/태그 이동(goto) 시에만 서버 데이터로 동기화
  $effect(() => {
    memos = data.memos;
    currentSearch = data.search;
  });

  async function handleSearch(query: string) {
    currentSearch = query;

    // URL만 업데이트 (내비게이션 없음 → 포커스 유지)
    const params = new URLSearchParams(window.location.search);
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    history.replaceState(null, '', `?${params.toString()}`);

    // 결과만 별도 fetch
    const res = await fetch(`/api/memos?${params.toString()}`);
    const result = await res.json();
    memos = result.memos;
  }

  function handleEdit(memo: Memo) {
    editingMemo = memo;
  }

  function handleModalClose() {
    editingMemo = null;
  }
</script>

<div class="page">
  <SearchBar initialValue={data.search} onSearch={handleSearch} />

  {#if memos.length === 0}
    <EmptyState search={currentSearch} category={data.category} tag={data.tag} />
  {:else}
    <div class="results-header">
      <span class="results-count">{memos.length}개 메모</span>
      {#if data.category}
        <span class="filter-badge">카테고리: {data.category}</span>
      {/if}
      {#if data.tag}
        <span class="filter-badge">태그: #{data.tag}</span>
      {/if}
      <div class="view-toggle">
        <button class="toggle-btn" class:active={view === 'card'} onclick={() => (view = 'card')} title="카드 보기">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
          </svg>
        </button>
        <button class="toggle-btn" class:active={view === 'list'} onclick={() => (view = 'list')} title="리스트 보기">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
    <MemoList {memos} onEdit={handleEdit} {view} />
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
    flex-wrap: wrap;
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

  .view-toggle {
    display: flex;
    gap: 2px;
    margin-left: auto;
  }

  .toggle-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.12s ease;
  }

  .toggle-btn:hover {
    background-color: var(--color-bg-elevated);
    color: var(--color-text-primary);
  }

  .toggle-btn.active {
    background-color: var(--color-bg-elevated);
    color: var(--color-text-primary);
    border-color: var(--color-text-secondary);
  }
</style>
