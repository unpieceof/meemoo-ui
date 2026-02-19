<script lang="ts">
  import { goto, invalidateAll } from '$app/navigation';
  import TagBadge from '$lib/components/TagBadge.svelte';
  import EditModal from '$lib/components/EditModal.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let editOpen = $state(false);

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
</script>

<div class="detail-page">
  <div class="top-bar">
    <a href="/" class="back-link">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
      목록으로
    </a>
    <button class="edit-btn" onclick={() => (editOpen = true)}>
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
      편집
    </button>
  </div>

  <article class="memo-detail">
    <h1 class="memo-title">{data.memo.title}</h1>

    <div class="memo-meta">
      {#if data.memo.category}
        <span class="category">{data.memo.category}</span>
      {/if}
      {#if data.memo.source_type}
        <span class="source-type">{getSourceIcon(data.memo.source_type)} {data.memo.source_type}</span>
      {/if}
      <time class="date" datetime={data.memo.created_at}>{formatDate(data.memo.created_at)}</time>
      {#if data.memo.source_url}
        <a href={data.memo.source_url} target="_blank" rel="noopener noreferrer" class="source-link">
          🔗 원본
        </a>
      {/if}
    </div>

    {#if (data.memo.tags ?? []).length > 0}
      <div class="tags">
        {#each data.memo.tags as tag}
          <TagBadge {tag} />
        {/each}
      </div>
    {/if}

    {#if data.memo.summary_bullets && data.memo.summary_bullets.length > 0}
      <section class="section">
        <h2 class="section-title">Summary</h2>
        <ul class="summary-list">
          {#each data.memo.summary_bullets as bullet}
            <li>{bullet}</li>
          {/each}
        </ul>
      </section>
    {/if}

    {#if data.memo.raw_content}
      <section class="section">
        <h2 class="section-title">원문</h2>
        <pre class="raw-content">{data.memo.raw_content}</pre>
      </section>
    {/if}
  </article>
</div>

{#if editOpen}
  <EditModal
    memo={data.memo}
    onClose={() => (editOpen = false)}
    onDeleted={() => goto('/')}
  />
{/if}

<style>
  .detail-page {
    max-width: 720px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    color: var(--color-text-secondary);
    text-decoration: none;
    transition: color 0.15s ease;
  }

  .back-link:hover {
    color: var(--color-text-primary);
  }

  .edit-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    font-size: 13px;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .edit-btn:hover {
    background-color: var(--color-bg-elevated);
    color: var(--color-text-primary);
    border-color: var(--color-text-secondary);
  }

  .memo-detail {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .memo-title {
    margin: 0;
    font-size: 22px;
    font-weight: 700;
    color: var(--color-text-primary);
    line-height: 1.4;
  }

  .memo-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }

  .category {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    background-color: color-mix(in srgb, var(--color-accent) 15%, transparent);
    border-radius: 4px;
    font-size: 12px;
    color: var(--color-accent);
    font-weight: 500;
  }

  .source-type {
    font-size: 12px;
    color: var(--color-text-secondary);
    text-transform: capitalize;
  }

  .date {
    font-size: 12px;
    color: var(--color-text-secondary);
  }

  .source-link {
    font-size: 12px;
    color: var(--color-accent);
    text-decoration: none;
  }

  .source-link:hover {
    text-decoration: underline;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-top: 16px;
    border-top: 1px solid var(--color-border);
  }

  .section-title {
    margin: 0;
    font-size: 12px;
    font-weight: 600;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .summary-list {
    margin: 0;
    padding: 0 0 0 18px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .summary-list li {
    font-size: 14px;
    color: var(--color-text-primary);
    line-height: 1.6;
  }

  .raw-content {
    margin: 0;
    font-family: inherit;
    font-size: 13px;
    color: var(--color-text-secondary);
    line-height: 1.7;
    white-space: pre-wrap;
    word-break: break-word;
  }
</style>
