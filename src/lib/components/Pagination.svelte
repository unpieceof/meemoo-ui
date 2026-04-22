<script lang="ts">
  let {
    page,
    totalPages,
    onChange
  }: {
    page: number;
    totalPages: number;
    onChange: (page: number) => void;
  } = $props();

  const hasPrev = $derived(page > 1);
  const hasNext = $derived(page < totalPages);

  const windowPages = $derived.by(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | '…')[] = [];
    const add = (p: number | '…') => {
      if (p === '…' || !pages.includes(p)) pages.push(p);
    };
    add(1);
    if (page > 3) add('…');
    for (let p = Math.max(2, page - 1); p <= Math.min(totalPages - 1, page + 1); p++) add(p);
    if (page < totalPages - 2) add('…');
    add(totalPages);
    return pages;
  });
</script>

{#if totalPages > 1}
  <nav class="pagination" aria-label="Pagination">
    <button
      class="mono link"
      disabled={!hasPrev}
      onclick={() => hasPrev && onChange(page - 1)}>
      ← Prev
    </button>

    <div class="pages">
      {#each windowPages as p (p + '-' + page)}
        {#if p === '…'}
          <span class="mono ellipsis">·</span>
        {:else}
          <button
            class="mono num"
            class:active={p === page}
            onclick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}>
            {String(p).padStart(2, '0')}
          </button>
        {/if}
      {/each}
    </div>

    <button
      class="mono link"
      disabled={!hasNext}
      onclick={() => hasNext && onChange(page + 1)}>
      Next →
    </button>
  </nav>
{/if}

<style>
  .pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid var(--rule);
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }
  .link {
    color: var(--ink-3);
    border-bottom: 1px solid transparent;
    padding-bottom: 2px;
    transition: color 120ms ease, border-color 120ms ease;
  }
  .link:hover:not(:disabled) {
    color: var(--ink);
    border-bottom-color: var(--ink);
  }
  .link:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
  .pages {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .num {
    font-size: 11px;
    letter-spacing: 0.15em;
    color: var(--ink-3);
    font-variant-numeric: tabular-nums;
    padding: 2px 4px;
    border-bottom: 1px solid transparent;
    transition: color 120ms ease, border-color 120ms ease;
  }
  .num:hover {
    color: var(--ink);
  }
  .num.active {
    color: var(--ink);
    border-bottom-color: var(--ink);
  }
  .ellipsis {
    color: var(--ink-4);
    font-size: 11px;
    padding: 0 2px;
  }
  @media (max-width: 640px) {
    .pagination {
      gap: 12px;
      flex-wrap: wrap;
    }
  }
</style>
