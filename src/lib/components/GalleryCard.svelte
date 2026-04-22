<script lang="ts">
  import type { Memo } from '$lib/supabase/types';
  import { fmtDateParts } from '$lib/utils/date';

  let {
    memo,
    index,
    feature,
    span,
    onOpen
  }: {
    memo: Memo;
    index: number;
    feature: boolean;
    span: number;
    onOpen: (memo: Memo) => void;
  } = $props();

  const d = $derived(fmtDateParts(memo.created_at));
  const tagCap = $derived(feature ? 4 : 2);
  const visibleTags = $derived((memo.tags ?? []).slice(0, tagCap));
  const extraTags = $derived(Math.max(0, (memo.tags?.length ?? 0) - tagCap));
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
<article
  class="card"
  class:feature
  style="grid-column: span {span};"
  onclick={() => onOpen(memo)}
  onkeydown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen(memo);
    }
  }}
  role="button"
  tabindex="0">
  <div class="top">
    <span class="mono meta">N° {String(index + 1).padStart(3, '0')}</span>
    {#if memo.category}
      <span class="mono meta">{memo.category}</span>
    {/if}
  </div>

  <h3 class="serif title">{memo.title}</h3>

  {#if memo.summary_bullets?.[0]}
    <p class="summary">{memo.summary_bullets[0]}</p>
  {/if}

  <div class="bottom">
    <div class="tags">
      {#each visibleTags as t (t)}
        <span class="mono tag">#{t}</span>
      {/each}
      {#if extraTags > 0}
        <span class="mono tag more">+{extraTags}</span>
      {/if}
    </div>
    <span class="mono date">{d.yy}.{d.mm}.{d.dd}</span>
  </div>
</article>

<style>
  .card {
    background: var(--paper);
    color: var(--ink);
    padding: 18px 18px 15px;
    min-height: 170px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    cursor: pointer;
    position: relative;
    outline: 2px solid transparent;
    outline-offset: 0;
    transition: outline-color 120ms ease, outline-offset 120ms ease;
    text-align: left;
  }
  .card.feature {
    padding: 24px 24px 18px;
    min-height: 240px;
  }
  .card:hover,
  .card:focus-visible {
    outline-color: var(--ink);
    outline-offset: -2px;
  }
  .card:focus {
    outline-color: var(--ink);
    outline-offset: -2px;
  }
  .top {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
  }
  .meta {
    font-size: 10.5px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--ink-3);
  }
  .title {
    margin: 0;
    font-size: 22px;
    line-height: 1.15;
    font-weight: 400;
    letter-spacing: -0.02em;
    flex: 1;
    text-wrap: balance;
    color: var(--ink);
  }
  .card.feature .title {
    font-size: clamp(30px, 3vw, 42px);
    font-weight: 500;
  }
  .summary {
    margin: 0;
    font-size: 13px;
    line-height: 1.6;
    color: var(--ink-3);
    text-wrap: pretty;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .card.feature .summary {
    font-size: 15px;
    -webkit-line-clamp: 3;
    line-clamp: 3;
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding-top: 12px;
    border-top: 1px solid var(--rule);
    gap: 12px;
  }
  .tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    min-width: 0;
  }
  .tag {
    font-size: 10.5px;
    color: var(--ink-3);
  }
  .tag.more {
    color: var(--ink-4);
  }
  .date {
    font-size: 10.5px;
    color: var(--ink-3);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
</style>
