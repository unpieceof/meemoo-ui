<script lang="ts">
  let {
    categoryCounts,
    tagCounts,
    total,
    activeCategory,
    setActiveCategory,
    activeTags,
    toggleTag,
    onClear,
    filtering
  }: {
    categoryCounts: Record<string, number>;
    tagCounts: Record<string, number>;
    total: number;
    activeCategory: string;
    setActiveCategory: (c: string) => void;
    activeTags: string[];
    toggleTag: (t: string) => void;
    onClear: () => void;
    filtering: boolean;
  } = $props();

  let tagsOpen = $state(false);

  const categoryEntries = $derived(
    Object.entries(categoryCounts).sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
    )
  );

  const tagEntries = $derived(
    Object.entries(tagCounts).sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
    )
  );
</script>

<nav class="navbar">
  <div class="bar-inner">
    <div class="sections">
      <span class="mono meta label">Sections —</span>
      <button
        class="section-btn"
        class:active={!activeCategory}
        onclick={() => setActiveCategory('')}>
        <span class="mono name" class:bold={!activeCategory}>All</span>
        <span class="mono count">{String(total).padStart(2, '0')}</span>
        {#if !activeCategory}<span class="underline"></span>{/if}
      </button>
      {#each categoryEntries as [cat, n] (cat)}
        <button
          class="section-btn"
          class:active={activeCategory === cat}
          onclick={() => setActiveCategory(cat)}>
          <span class="mono name" class:bold={activeCategory === cat}>{cat}</span>
          <span class="mono count">{String(n).padStart(2, '0')}</span>
          {#if activeCategory === cat}<span class="underline"></span>{/if}
        </button>
      {/each}
    </div>

    <div class="right">
      {#if filtering}
        <button class="mono meta clear" onclick={onClear}>Clear all ×</button>
      {/if}
      {#if activeTags.length}
        <div class="active-tags">
          {#each activeTags as t (t)}
            <button class="mono active-tag" onclick={() => toggleTag(t)}>
              #{t}<span class="x">×</span>
            </button>
          {/each}
        </div>
      {/if}
      <button
        class="mono tags-btn"
        class:open={tagsOpen}
        onclick={() => (tagsOpen = !tagsOpen)}>
        Tags · {tagEntries.length} {tagsOpen ? '▴' : '▾'}
      </button>
    </div>
  </div>

  {#if tagsOpen}
    <div class="tag-sheet">
      <div class="tag-sheet-inner">
        {#each tagEntries as [t, n] (t)}
          {@const active = activeTags.includes(t)}
          <button class="mono tag-chip" class:active onclick={() => toggleTag(t)}>
            #{t}<span class="tag-count">{n}</span>
          </button>
        {/each}
        {#if tagEntries.length === 0}
          <span class="mono meta">no tags yet</span>
        {/if}
      </div>
    </div>
  {/if}
</nav>

<style>
  .navbar {
    border-bottom: 1px solid var(--ink);
    background: var(--paper);
    position: sticky;
    top: 0;
    z-index: 20;
  }
  .bar-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 40px;
    display: flex;
    align-items: stretch;
    gap: 0;
  }
  .sections {
    display: flex;
    align-items: center;
    gap: 28px;
    padding-right: 28px;
    border-right: 1px solid var(--rule);
    flex-wrap: wrap;
  }
  .label {
    padding: 14px 0;
  }
  .meta {
    font-size: 10.5px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--ink-3);
  }
  .section-btn {
    padding: 14px 0 13px;
    position: relative;
    display: flex;
    align-items: baseline;
    gap: 6px;
    color: var(--ink-3);
    white-space: nowrap;
    flex-shrink: 0;
  }
  .section-btn.active {
    color: var(--ink);
  }
  .section-btn .name {
    font-size: 12px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    font-weight: 400;
  }
  .section-btn .name.bold {
    font-weight: 600;
  }
  .section-btn .count {
    font-size: 10.5px;
    color: var(--ink-4);
  }
  .section-btn.active .count {
    color: var(--ink-3);
  }
  .underline {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 2px;
    background: var(--ink);
  }
  .right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 18px;
    padding-left: 24px;
    flex-wrap: wrap;
  }
  .clear {
    color: var(--ink-3);
    border-bottom: 1px solid var(--rule);
    padding-bottom: 2px;
  }
  .active-tags {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }
  .active-tag {
    font-size: 11px;
    padding: 3px 8px;
    background: var(--ink);
    color: var(--paper);
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .active-tag .x {
    opacity: 0.6;
  }
  .tags-btn {
    font-size: 10.5px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    padding: 14px 0 13px;
    color: var(--ink-3);
    border-bottom: 3px solid transparent;
  }
  .tags-btn.open {
    color: var(--ink);
    border-bottom-color: var(--ink);
  }
  .tag-sheet {
    border-top: 1px solid var(--rule);
    background: var(--paper-2);
  }
  .tag-sheet-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 20px 40px 24px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px 8px;
  }
  .tag-chip {
    padding: 4px 10px;
    font-size: 12px;
    background: transparent;
    color: var(--ink-2);
    border: 1px solid var(--rule);
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .tag-chip.active {
    background: var(--ink);
    color: var(--paper);
    border-color: var(--ink);
  }
  .tag-count {
    opacity: 0.55;
    font-size: 10.5px;
  }
</style>
