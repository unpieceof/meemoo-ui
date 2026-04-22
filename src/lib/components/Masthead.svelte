<script lang="ts">
  import { fmtMasthead } from '$lib/utils/date';

  type View = 'gallery' | 'index';

  let {
    search,
    onSearch,
    searchEl = $bindable(),
    view,
    setView,
    onNew,
    total,
    filteredCount
  }: {
    search: string;
    onSearch: (q: string) => void;
    searchEl?: HTMLInputElement | null;
    view: View;
    setView: (v: View) => void;
    onNew: () => void;
    total: number;
    filteredCount: number;
  } = $props();

  /* svelte-ignore state_referenced_locally */
  let localValue = $state(search);
  let timer: ReturnType<typeof setTimeout> | null = null;

  $effect(() => {
    localValue = search;
  });

  function handleInput(e: Event) {
    const v = (e.target as HTMLInputElement).value;
    localValue = v;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => onSearch(v), 250);
  }

  const today = new Date();
  const dateLabel = fmtMasthead(today);
</script>

<header class="masthead">
  <div class="inner">
    <div class="top-meta">
      <span class="mono meta">VOL. Ⅱ · {dateLabel}</span>
      <span class="mono meta">N° <span class="ink">{String(total).padStart(3, '0')}</span> · 메모 저널</span>
    </div>

    <div class="wordmark-row">
      <div></div>
      <h1 class="serif wordmark">
        <span class="italic-mee">mee</span>moo
      </h1>
      <div class="view-toggle">
        <button
          class="mono toggle-link"
          class:active={view === 'gallery'}
          onclick={() => setView('gallery')}>Gallery</button>
        <span class="divider"></span>
        <button
          class="mono toggle-link"
          class:active={view === 'index'}
          onclick={() => setView('index')}>Index</button>
      </div>
    </div>

    <div class="search-row">
      <span class="mono meta">Find ⟶</span>
      <input
        bind:this={searchEl}
        type="search"
        value={localValue}
        oninput={handleInput}
        class="serif search-input"
        autocomplete="off"
        aria-label="Search memos"
      />
      <span class="mono meta count">Showing {filteredCount} / {total}</span>
      <button class="mono new-btn" onclick={onNew}>+ New memo</button>
    </div>
  </div>
</header>

<style>
  .masthead {
    border-bottom: 1px solid var(--ink);
    padding: 28px 40px 20px;
    background: var(--paper);
  }
  .inner {
    max-width: 1280px;
    margin: 0 auto;
    width: 100%;
  }
  .top-meta {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding-bottom: 18px;
    gap: 20px;
    flex-wrap: wrap;
  }
  .meta {
    font-size: 10.5px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--ink-3);
  }
  .ink {
    color: var(--ink);
  }
  .wordmark-row {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 32px;
    padding: 20px 0 24px;
    border-top: 1px solid var(--ink);
    border-bottom: 1px solid var(--ink);
  }
  .wordmark {
    margin: 0;
    font-size: clamp(54px, 9vw, 116px);
    font-weight: 400;
    line-height: 0.86;
    text-align: center;
    letter-spacing: -0.04em;
    font-feature-settings: 'ss01', 'onum';
  }
  .italic-mee {
    font-style: italic;
    font-weight: 300;
  }
  .view-toggle {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 14px;
  }
  .toggle-link {
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--ink-3);
    border-bottom: 1px solid transparent;
    padding-bottom: 2px;
  }
  .toggle-link.active {
    color: var(--ink);
    border-bottom-color: var(--ink);
  }
  .divider {
    width: 1px;
    height: 10px;
    background: var(--ink-4);
  }
  .search-row {
    display: flex;
    align-items: center;
    gap: 18px;
    padding-top: 18px;
    flex-wrap: wrap;
  }
  .search-input {
    flex: 1;
    min-width: 220px;
    padding: 6px 0;
    font-size: 26px;
    font-weight: 400;
    color: var(--ink);
    border: none;
    outline: none;
    border-bottom: 1px solid transparent;
    letter-spacing: -0.015em;
    transition: border-color 120ms ease;
  }
  .search-input:focus {
    border-bottom-color: var(--ink);
  }
  .count {
    white-space: nowrap;
  }
  .new-btn {
    padding: 10px 18px;
    font-size: 10.5px;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    border: 1px solid var(--ink);
    background: var(--ink);
    color: var(--paper);
    transition: background 120ms ease, color 120ms ease;
    white-space: nowrap;
  }
  .new-btn:hover {
    background: var(--paper);
    color: var(--ink);
  }
</style>
