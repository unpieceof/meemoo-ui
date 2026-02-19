<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  let { tag }: { tag: string } = $props();

  function handleClick(e: MouseEvent) {
    e.stopPropagation();
    const params = new URLSearchParams($page.url.searchParams);
    params.set('tag', tag);
    params.delete('category');
    params.delete('q');
    goto(`?${params.toString()}`);
  }
</script>

<button class="tag-badge" onclick={handleClick}>
  #{tag}
</button>

<style>
  .tag-badge {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    background-color: transparent;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    color: var(--color-text-secondary);
    font-size: 11px;
    cursor: pointer;
    transition: all 0.15s ease;
    white-space: nowrap;
  }

  .tag-badge:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
    background-color: color-mix(in srgb, var(--color-accent) 10%, transparent);
  }
</style>
