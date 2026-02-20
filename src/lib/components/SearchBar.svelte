<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  let { initialValue = '' }: { initialValue?: string } = $props();

  let value = $state(initialValue);
  let debounceTimer: ReturnType<typeof setTimeout>;
  let inputEl: HTMLInputElement;

  function handleInput() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      const params = new URLSearchParams($page.url.searchParams);
      if (value.trim()) {
        params.set('q', value.trim());
      } else {
        params.delete('q');
      }
      await goto(`?${params.toString()}`, { replaceState: true });
      inputEl?.focus();
    }, 300);
  }

  function handleClear() {
    value = '';
    const params = new URLSearchParams($page.url.searchParams);
    params.delete('q');
    goto(`?${params.toString()}`, { replaceState: true }).then(() => inputEl?.focus());
  }
</script>

<div class="search-wrapper">
  <div class="search-inner">
    <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
    <input
      type="search"
      class="search-input"
      placeholder="메모 검색..."
      bind:value
      bind:this={inputEl}
      oninput={handleInput}
    />
    {#if value}
      <button class="clear-btn" onclick={handleClear} type="button" aria-label="검색어 지우기">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    {/if}
  </div>
</div>

<style>
  .search-wrapper {
    width: 100%;
    max-width: 600px;
  }

  .search-inner {
    position: relative;
    display: flex;
    align-items: center;
  }

  .search-icon {
    position: absolute;
    left: 12px;
    color: var(--color-text-secondary);
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    padding: 10px 40px 10px 40px;
    background-color: var(--color-bg-surface);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    color: var(--color-text-primary);
    font-size: 14px;
    outline: none;
    transition: border-color 0.15s ease;
    -webkit-appearance: none;
  }

  .search-input::placeholder {
    color: var(--color-text-secondary);
  }

  .search-input:focus {
    border-color: var(--color-accent);
  }

  .search-input::-webkit-search-cancel-button {
    display: none;
  }

  .clear-btn {
    position: absolute;
    right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: transparent;
    border: none;
    border-radius: 4px;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: color 0.15s ease;
  }

  .clear-btn:hover {
    color: var(--color-text-primary);
  }
</style>
