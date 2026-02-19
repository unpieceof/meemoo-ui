<script lang="ts">
  import '../app.css';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import type { LayoutData } from './$types';

  let { data, children }: { data: LayoutData; children: any } = $props();

  let sidebarOpen = $state(true);
</script>

<div class="app-shell">
  <Sidebar
    categories={data.categories}
    total={data.total}
    allTags={data.allTags}
    open={sidebarOpen}
    onToggle={() => (sidebarOpen = !sidebarOpen)}
  />
  <main class="main-content">
    {#if !sidebarOpen}
      <button class="sidebar-open-btn" onclick={() => (sidebarOpen = true)} aria-label="사이드바 열기">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
    {/if}
    {@render children()}
  </main>
</div>

<style>
  .app-shell {
    display: flex;
    height: 100vh;
    overflow: hidden;
    background-color: var(--color-bg-base);
  }

  .main-content {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
  }

  .sidebar-open-btn {
    position: fixed;
    top: 14px;
    left: 12px;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background-color: var(--color-bg-surface);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .sidebar-open-btn:hover {
    background-color: var(--color-bg-elevated);
    color: var(--color-text-primary);
  }
</style>
