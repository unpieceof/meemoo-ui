<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  let {
    categories,
    total,
    allTags
  }: {
    categories: Record<string, number>;
    total: number;
    allTags: string[];
  } = $props();

  let currentCategory = $derived($page.url.searchParams.get('category') ?? '');
  let currentTag = $derived($page.url.searchParams.get('tag') ?? '');

  function selectCategory(cat: string) {
    const params = new URLSearchParams($page.url.searchParams);
    if (cat) {
      params.set('category', cat);
    } else {
      params.delete('category');
    }
    params.delete('tag');
    params.delete('q');
    goto(`/?${params.toString()}`);
  }

  function selectTag(tag: string) {
    const params = new URLSearchParams($page.url.searchParams);
    if (currentTag === tag) {
      params.delete('tag');
    } else {
      params.set('tag', tag);
    }
    params.delete('category');
    params.delete('q');
    goto(`/?${params.toString()}`);
  }

  const sortedCategories = $derived(
    Object.entries(categories).sort((a, b) => b[1] - a[1])
  );
</script>

<aside class="sidebar">
  <div class="sidebar-header">
    <span class="logo">meemoo</span>
  </div>

  <nav class="sidebar-nav">
    <section class="nav-section">
      <h3 class="section-label">카테고리</h3>
      <ul class="nav-list">
        <li>
          <button
            class="nav-item"
            class:active={!currentCategory}
            onclick={() => selectCategory('')}
          >
            <span class="nav-label">전체</span>
            <span class="nav-count">{total}</span>
          </button>
        </li>
        {#each sortedCategories as [cat, count]}
          <li>
            <button
              class="nav-item"
              class:active={currentCategory === cat}
              onclick={() => selectCategory(cat)}
            >
              <span class="nav-label">{cat}</span>
              <span class="nav-count">{count}</span>
            </button>
          </li>
        {/each}
      </ul>
    </section>

    {#if allTags.length > 0}
      <section class="nav-section">
        <h3 class="section-label">태그</h3>
        <div class="tag-cloud">
          {#each allTags as tag}
            <button
              class="sidebar-tag"
              class:active={currentTag === tag}
              onclick={() => selectTag(tag)}
            >
              #{tag}
            </button>
          {/each}
        </div>
      </section>
    {/if}
  </nav>
</aside>

<style>
  .sidebar {
    width: 220px;
    flex-shrink: 0;
    background-color: var(--color-bg-surface);
    border-right: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .sidebar-header {
    padding: 20px 16px 16px;
    border-bottom: 1px solid var(--color-border);
  }

  .logo {
    font-size: 16px;
    font-weight: 700;
    color: var(--color-accent);
    letter-spacing: 0.5px;
  }

  .sidebar-nav {
    padding: 12px 8px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .nav-section {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .section-label {
    margin: 0 0 6px;
    padding: 0 8px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: var(--color-text-secondary);
  }

  .nav-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 6px 8px;
    background: transparent;
    border: none;
    border-radius: 5px;
    color: var(--color-text-secondary);
    font-size: 13px;
    cursor: pointer;
    text-align: left;
    transition: all 0.12s ease;
  }

  .nav-item:hover {
    background-color: var(--color-bg-elevated);
    color: var(--color-text-primary);
  }

  .nav-item.active {
    background-color: color-mix(in srgb, var(--color-accent) 12%, transparent);
    color: var(--color-accent);
  }

  .nav-label {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .nav-count {
    font-size: 11px;
    color: var(--color-text-secondary);
    flex-shrink: 0;
    margin-left: 4px;
  }

  .nav-item.active .nav-count {
    color: var(--color-accent);
    opacity: 0.7;
  }

  .tag-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding: 0 4px;
  }

  .sidebar-tag {
    display: inline-flex;
    align-items: center;
    padding: 2px 7px;
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    color: var(--color-text-secondary);
    font-size: 11px;
    cursor: pointer;
    transition: all 0.12s ease;
  }

  .sidebar-tag:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  .sidebar-tag.active {
    background-color: color-mix(in srgb, var(--color-accent) 15%, transparent);
    border-color: var(--color-accent);
    color: var(--color-accent);
  }
</style>
