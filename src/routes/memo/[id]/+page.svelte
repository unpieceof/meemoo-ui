<script lang="ts">
  import { goto } from '$app/navigation';
  import type { PageData } from './$types';
  import ReaderBody from '$lib/components/ReaderBody.svelte';
  import EditModal from '$lib/components/EditModal.svelte';
  import Footer from '$lib/components/Footer.svelte';

  let { data }: { data: PageData } = $props();

  let editOpen = $state(false);
</script>

<header class="head">
  <div class="inner">
    <a class="mono back" href="/">← Back to index</a>
    <div class="actions">
      <button class="mono edit" onclick={() => (editOpen = true)}>Edit</button>
      <a class="mono close" href="/">Close ×</a>
    </div>
  </div>
</header>

<article class="page">
  <ReaderBody memo={data.memo} />
</article>

<Footer />

{#if editOpen}
  <EditModal
    memo={data.memo}
    onClose={() => (editOpen = false)}
    onDeleted={() => goto('/')}
  />
{/if}

<style>
  .head {
    position: sticky;
    top: 0;
    z-index: 10;
    background: var(--paper);
    border-bottom: 1px solid var(--ink);
  }
  .inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 14px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .back,
  .close {
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--ink-3);
    text-decoration: none;
  }
  .actions {
    display: flex;
    gap: 18px;
    align-items: center;
  }
  .edit {
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    border-bottom: 1px solid var(--ink);
    padding-bottom: 2px;
  }
  .page {
    max-width: 1280px;
    margin: 0 auto;
    width: 100%;
    flex: 1;
    display: flex;
    justify-content: center;
  }
  @media (max-width: 640px) {
    .inner {
      padding: 12px 20px;
    }
  }
</style>
