<script lang="ts">
  import TagBadge from './TagBadge.svelte';
  import type { Memo } from '$lib/supabase/types';

  let { memo, onEdit }: { memo: Memo; onEdit: (memo: Memo) => void } = $props();

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  }
</script>

<a href="/memo/{memo.id}" class="list-item">
  <div class="item-main">
    <span class="item-title">{memo.title}</span>
    <div class="item-badges">
      {#if memo.category}
        <span class="category">{memo.category}</span>
      {/if}
      {#each (memo.tags ?? []).slice(0, 3) as tag}
        <TagBadge {tag} />
      {/each}
    </div>
  </div>
  <div class="item-right">
    <time class="date">{formatDate(memo.created_at)}</time>
    <button
      class="edit-btn"
      onclick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(memo); }}
      title="편집"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    </button>
  </div>
</a>

<style>
  .list-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    background-color: var(--color-bg-surface);
    border-bottom: 1px solid var(--color-border);
    text-decoration: none;
    color: inherit;
    transition: background-color 0.12s ease;
  }

  .list-item:first-child {
    border-top: 1px solid var(--color-border);
    border-radius: 8px 8px 0 0;
  }

  .list-item:last-child {
    border-radius: 0 0 8px 8px;
  }

  .list-item:only-child {
    border-radius: 8px;
  }

  .list-item:hover {
    background-color: var(--color-bg-elevated);
  }

  .item-main {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  .item-title {
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
    min-width: 0;
  }

  .item-badges {
    display: flex;
    align-items: center;
    gap: 5px;
    flex-shrink: 0;
  }

  .category {
    display: inline-flex;
    align-items: center;
    padding: 1px 6px;
    background-color: color-mix(in srgb, var(--color-accent) 15%, transparent);
    border-radius: 3px;
    font-size: 11px;
    color: var(--color-accent);
    font-weight: 500;
    white-space: nowrap;
  }

  .item-right {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .date {
    font-size: 11px;
    color: var(--color-text-secondary);
    white-space: nowrap;
  }

  .edit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    color: var(--color-text-secondary);
    cursor: pointer;
    opacity: 0;
    transition: all 0.12s ease;
  }

  .list-item:hover .edit-btn {
    opacity: 1;
  }

  .edit-btn:hover {
    background-color: var(--color-bg-surface);
    color: var(--color-text-primary);
    border-color: var(--color-text-secondary);
  }
</style>
