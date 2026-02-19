<script lang="ts">
  import { goto } from '$app/navigation';
  import TagBadge from './TagBadge.svelte';
  import type { Memo } from '$lib/supabase/types';

  let { memo, onEdit }: { memo: Memo; onEdit: (memo: Memo) => void } = $props();

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  const sourceIcons: Record<string, string> = {
    article: '📄',
    video: '🎬',
    tweet: '🐦',
    book: '📚',
    podcast: '🎙️',
    default: '🔗'
  };

  function getSourceIcon(type: string | null) {
    if (!type) return sourceIcons.default;
    return sourceIcons[type.toLowerCase()] ?? sourceIcons.default;
  }

  function handleCardClick(e: MouseEvent) {
    if ((e.target as HTMLElement).closest('button, a')) return;
    goto(`/memo/${memo.id}`);
  }
</script>

<article class="memo-card" onclick={handleCardClick}>
  <header class="card-header">
    <div class="card-meta">
      {#if memo.source_type}
        <span class="source-type">{getSourceIcon(memo.source_type)} {memo.source_type}</span>
      {/if}
      {#if memo.category}
        <span class="category">{memo.category}</span>
      {/if}
    </div>
    <div class="card-actions">
      <button class="action-btn" onclick={() => onEdit(memo)} title="편집">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </button>
    </div>
  </header>

  <h2 class="card-title">{memo.title}</h2>

  {#if memo.summary_bullets && memo.summary_bullets.length > 0}
    <ul class="summary-list">
      {#each memo.summary_bullets.slice(0, 3) as bullet}
        <li>{bullet}</li>
      {/each}
    </ul>
  {/if}

  <footer class="card-footer">
    <div class="tags">
      {#each (memo.tags ?? []).slice(0, 4) as tag}
        <TagBadge {tag} />
      {/each}
    </div>
    <time class="date" datetime={memo.created_at}>{formatDate(memo.created_at)}</time>
  </footer>
</article>

<style>
  .memo-card {
    background-color: var(--color-bg-surface);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: border-color 0.15s ease;
    cursor: pointer;
  }

  .memo-card:hover {
    border-color: color-mix(in srgb, var(--color-border) 50%, var(--color-accent) 50%);
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .card-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }

  .source-type {
    font-size: 11px;
    color: var(--color-text-secondary);
    text-transform: capitalize;
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
  }

  .card-actions {
    display: flex;
    gap: 4px;
    opacity: 0;
    transition: opacity 0.15s ease;
  }

  .memo-card:hover .card-actions {
    opacity: 1;
  }

  .action-btn {
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
    transition: all 0.15s ease;
  }

  .action-btn:hover {
    background-color: var(--color-bg-elevated);
    color: var(--color-text-primary);
    border-color: var(--color-text-secondary);
  }

  .card-title {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text-primary);
    line-height: 1.4;
  }

  .summary-list {
    margin: 0;
    padding: 0 0 0 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .summary-list li {
    font-size: 12px;
    color: var(--color-text-secondary);
    line-height: 1.5;
  }

  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-top: auto;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    flex: 1;
  }

  .date {
    font-size: 11px;
    color: var(--color-text-secondary);
    white-space: nowrap;
    flex-shrink: 0;
  }
</style>
