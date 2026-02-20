<script lang="ts">
  import '../app.css';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import { browser } from '$app/environment';
  import type { LayoutData } from './$types';

  let { data, children }: { data: LayoutData; children: any } = $props();

  let sidebarOpen = $state(browser ? window.innerWidth > 640 : true);
  let theme = $state(browser ? (localStorage.getItem('theme') ?? 'light') : 'light');

  $effect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  });
</script>

<div class="app-shell">
  <main class="main-content">
    {@render children()}
  </main>
  <Sidebar
    categories={data.categories}
    total={data.total}
    allTags={data.allTags}
    open={sidebarOpen}
    onToggle={() => (sidebarOpen = !sidebarOpen)}
  />
  <button class="theme-toggle-btn" onclick={() => (theme = theme === 'light' ? 'dark' : 'light')} aria-label="테마 전환">
    {#if theme === 'dark'}
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
    {:else}
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    {/if}
  </button>

  {#if !sidebarOpen}
    <button class="sidebar-open-btn" onclick={() => (sidebarOpen = true)} aria-label="사이드바 열기">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    </button>
  {/if}
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
    right: 12px;
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

  .theme-toggle-btn {
    position: fixed;
    bottom: 14px;
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

  .theme-toggle-btn:hover {
    background-color: var(--color-bg-elevated);
    color: var(--color-text-primary);
  }
</style>
