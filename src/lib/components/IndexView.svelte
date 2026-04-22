<script lang="ts">
  import type { Memo } from '$lib/supabase/types';
  import { fmtDateParts } from '$lib/utils/date';

  let {
    memos,
    onOpen
  }: {
    memos: Memo[];
    onOpen: (memo: Memo) => void;
  } = $props();
</script>

<section class="index">
  <div class="row head">
    <div class="mono cell">N°</div>
    <div class="mono cell">Date</div>
    <div class="mono cell">Title / Summary</div>
    <div class="mono cell">Section</div>
    <div class="mono cell right">Tags ⟶</div>
  </div>

  {#each memos as memo, i (memo.id)}
    {@const d = fmtDateParts(memo.created_at)}
    <div
      class="row body"
      role="button"
      tabindex="0"
      onclick={() => onOpen(memo)}
      onkeydown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(memo);
        }
      }}>
      <div class="mono cell num">{String(i + 1).padStart(3, '0')}</div>
      <div class="mono cell date">{d.yy}.{d.mm}.{d.dd}</div>
      <div class="cell title-cell">
        <h3 class="serif title">{memo.title}</h3>
        {#if memo.summary_bullets?.[0]}
          <p class="summary">{memo.summary_bullets[0]}</p>
        {/if}
      </div>
      <div class="cell">
        {#if memo.category}
          <span class="mono section-label">{memo.category}</span>
        {/if}
      </div>
      <div class="cell tags">
        {#each (memo.tags ?? []).slice(0, 2) as t (t)}
          <span class="mono tag">#{t}</span>
        {/each}
        {#if (memo.tags?.length ?? 0) > 2}
          <span class="mono tag more">+{(memo.tags?.length ?? 0) - 2}</span>
        {/if}
      </div>
    </div>
  {/each}
</section>

<style>
  .index {
    display: block;
  }
  .row {
    display: grid;
    grid-template-columns: 64px 100px 1fr 120px 140px;
  }
  .row.head {
    border-top: 1px solid var(--ink);
    border-bottom: 1px solid var(--ink);
  }
  .row.head .cell {
    padding: 10px 14px;
    font-size: 10.5px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--ink-3);
  }
  .row.body {
    border-bottom: 1px solid var(--rule);
    cursor: pointer;
    background: transparent;
    transition: background 100ms ease;
    text-align: left;
  }
  .row.body:hover,
  .row.body:focus-visible {
    background: var(--paper-2);
  }
  .row.body:focus {
    outline: none;
  }
  .cell {
    padding: 22px 14px;
    min-width: 0;
  }
  .cell.right {
    text-align: right;
  }
  .cell.num {
    font-size: 11.5px;
    color: var(--ink-3);
    font-variant-numeric: tabular-nums;
  }
  .cell.date {
    font-size: 11.5px;
    color: var(--ink-2);
    font-variant-numeric: tabular-nums;
  }
  .title-cell {
    padding: 18px 14px 20px;
  }
  .title {
    margin: 0;
    font-size: 22px;
    line-height: 1.2;
    font-weight: 400;
    letter-spacing: -0.015em;
    color: var(--ink);
    text-decoration: none;
    text-decoration-thickness: 1px;
    text-underline-offset: 5px;
    transition: font-weight 80ms ease;
  }
  .row.body:hover .title,
  .row.body:focus-visible .title {
    font-weight: 500;
    text-decoration: underline;
  }
  .summary {
    margin: 6px 0 0;
    color: var(--ink-3);
    font-size: 13px;
    line-height: 1.55;
    max-width: 720px;
    text-wrap: pretty;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .section-label {
    font-size: 10.5px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--ink-2);
  }
  .tags {
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    gap: 6px;
    flex-wrap: wrap;
  }
  .tag {
    font-size: 10.5px;
    color: var(--ink-3);
  }
  .tag.more {
    color: var(--ink-4);
  }

  @media (max-width: 900px) {
    .row {
      grid-template-columns: 48px 80px 1fr 100px;
    }
    .cell.tags {
      display: none;
    }
    .row.head .cell.right {
      display: none;
    }
  }
</style>
