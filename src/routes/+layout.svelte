<script lang="ts">
  import '../app.css';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import type { LayoutData } from './$types';

  let { data, children }: { data: LayoutData; children: any } = $props();
</script>

<div class="app-shell">
  <Sidebar categories={data.categories} total={data.total} allTags={data.allTags} />
  <main class="main-content">
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
</style>
