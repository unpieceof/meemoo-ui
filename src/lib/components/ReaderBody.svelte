<script lang="ts">
  import type { Memo } from '$lib/supabase/types';
  import { fmtLong } from '$lib/utils/date';

  let { memo }: { memo: Memo } = $props();

  const summary = $derived(memo.summary_bullets ?? []);
  const displayUrl = $derived(memo.source_url?.replace(/^https?:\/\//, '') ?? '');
</script>

<div class="body">
  <div class="mono kicker">
    {#if memo.category}<span class="ink">{memo.category}</span>{:else}<span class="ink">—</span>{/if}
    <span class="dot">·</span> {fmtLong(memo.created_at)}
    {#if memo.source_type}
      <span class="dot">·</span> From {memo.source_type}
    {/if}
  </div>

  <h1 class="serif headline">{memo.title}</h1>

  {#if memo.source_url}
    <a class="mono source-link" href={memo.source_url} target="_blank" rel="noopener noreferrer">
      ↗ {displayUrl}
    </a>
  {/if}

  <div class="rule"></div>

  {#if summary[0]}
    <p class="serif lede">{summary[0]}</p>
  {/if}

  {#if summary.length > 1}
    <section class="summary">
      <h4 class="mono section-title">Summary</h4>
      <ol class="list">
        {#each summary.slice(1) as s, i (i)}
          <li>
            <span class="mono num">{String(i + 2).padStart(2, '0')}</span>
            <span class="text">{s}</span>
          </li>
        {/each}
      </ol>
    </section>
  {/if}

  {#if memo.raw_content}
    <section class="notes">
      <h4 class="mono section-title">Notes</h4>
      <p class="serif notes-body">{memo.raw_content}</p>
    </section>
  {/if}

  {#if (memo.tags?.length ?? 0) > 0}
    <div class="tags-strip">
      {#each memo.tags ?? [] as t (t)}
        <span class="mono tag">#{t}</span>
      {/each}
    </div>
  {/if}
</div>

<style>
  .body {
    padding: 40px 56px 100px;
    max-width: 680px;
  }
  .kicker {
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--ink-3);
    margin-bottom: 18px;
  }
  .kicker .ink {
    color: var(--ink);
  }
  .kicker .dot {
    margin: 0 8px;
  }
  .headline {
    margin: 0;
    font-size: clamp(36px, 4.6vw, 58px);
    line-height: 1.04;
    letter-spacing: -0.025em;
    font-weight: 500;
    text-wrap: balance;
  }
  .source-link {
    display: inline-block;
    margin-top: 18px;
    font-size: 12px;
    color: var(--ink-2);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 4px;
    word-break: break-all;
  }
  .rule {
    border-top: 1px solid var(--ink);
    margin: 32px 0 28px;
  }
  .lede {
    margin: 0;
    font-size: 22px;
    line-height: 1.5;
    color: var(--ink);
    font-weight: 400;
    letter-spacing: -0.01em;
    text-wrap: pretty;
  }
  .summary {
    margin-top: 32px;
  }
  .section-title {
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--ink-3);
    margin: 0 0 12px;
  }
  .list {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .list li {
    padding: 10px 0;
    border-top: 1px solid var(--rule);
    display: grid;
    grid-template-columns: 36px 1fr;
    gap: 12px;
  }
  .list .num {
    font-size: 11px;
    color: var(--ink-4);
    padding-top: 4px;
    font-variant-numeric: tabular-nums;
  }
  .list .text {
    font-size: 15px;
    line-height: 1.6;
    color: var(--ink-2);
  }
  .notes {
    margin-top: 36px;
  }
  .notes-body {
    margin: 0;
    font-size: 17px;
    line-height: 1.72;
    color: var(--ink);
    text-wrap: pretty;
    white-space: pre-wrap;
    word-break: break-word;
  }
  .tags-strip {
    margin-top: 44px;
    padding-top: 16px;
    border-top: 1px solid var(--ink);
    display: flex;
    flex-wrap: wrap;
    gap: 6px 10px;
  }
  .tag {
    font-size: 12px;
    color: var(--ink-2);
  }
  @media (max-width: 640px) {
    .body {
      padding: 28px 24px 80px;
    }
  }
</style>
