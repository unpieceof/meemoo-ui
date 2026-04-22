<script lang="ts">
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import type { PageData } from './$types';
  import type { Memo } from '$lib/supabase/types';
  import Masthead from '$lib/components/Masthead.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import GalleryView from '$lib/components/GalleryView.svelte';
  import IndexView from '$lib/components/IndexView.svelte';
  import EmptyState from '$lib/components/EmptyState.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Reader from '$lib/components/Reader.svelte';
  import EditModal from '$lib/components/EditModal.svelte';

  type View = 'gallery' | 'index';

  let { data }: { data: PageData } = $props();

  /* svelte-ignore state_referenced_locally */
  let memos = $state<Memo[]>(data.memos as Memo[]);
  let view = $state<View>(
    browser ? ((localStorage.getItem('meemoo.view') as View) ?? 'gallery') : 'gallery'
  );
  let openMemo = $state<Memo | null>(null);
  let editMemo = $state<Partial<Memo> | null>(null);
  let searchEl = $state<HTMLInputElement | null>(null);

  $effect(() => {
    memos = data.memos as Memo[];
  });

  $effect(() => {
    if (browser) localStorage.setItem('meemoo.view', view);
  });

  const filtering = $derived(
    !!data.search || !!data.category || (data.tags?.length ?? 0) > 0
  );

  function buildUrl(params: {
    q?: string;
    category?: string;
    tags?: string[];
  }): string {
    const sp = new URLSearchParams();
    if (params.q) sp.set('q', params.q);
    if (params.category) sp.set('category', params.category);
    for (const t of params.tags ?? []) sp.append('tag', t);
    const qs = sp.toString();
    return qs ? `/?${qs}` : '/';
  }

  async function onSearch(q: string) {
    const url = buildUrl({
      q: q.trim(),
      category: data.category,
      tags: data.tags
    });
    await goto(url, { keepFocus: true, noScroll: true, replaceState: true });
  }

  function setActiveCategory(cat: string) {
    goto(buildUrl({ q: data.search, category: cat, tags: data.tags }), {
      keepFocus: true,
      noScroll: true
    });
  }

  function toggleTag(tag: string) {
    const next = data.tags.includes(tag)
      ? data.tags.filter((t) => t !== tag)
      : [...data.tags, tag];
    goto(buildUrl({ q: data.search, category: data.category, tags: next }), {
      keepFocus: true,
      noScroll: true
    });
  }

  function clearAll() {
    goto('/', { keepFocus: true, noScroll: true });
  }

  function setView(v: View) {
    view = v;
  }

  function handleOpen(memo: Memo) {
    openMemo = memo;
  }

  function handleNew() {
    editMemo = {};
  }

  function handleEditFromReader(memo: Memo) {
    openMemo = null;
    editMemo = memo;
  }

  function handleEditSaved(saved: Memo) {
    if (openMemo && openMemo.id === saved.id) {
      openMemo = saved;
    }
  }

  function handleKey(e: KeyboardEvent) {
    const tagName = (document.activeElement as HTMLElement | null)?.tagName;
    const inField = tagName === 'INPUT' || tagName === 'TEXTAREA';
    const overlayOpen = !!openMemo || !!editMemo;
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      searchEl?.focus();
      return;
    }
    if (e.key === '/' && !inField && !overlayOpen) {
      e.preventDefault();
      searchEl?.focus();
      return;
    }
    if (inField || overlayOpen) return;
    if (e.key === 'n' || e.key === 'N') {
      e.preventDefault();
      handleNew();
    } else if (e.key === 'g' || e.key === 'G') {
      e.preventDefault();
      setView('gallery');
    } else if (e.key === 'i' || e.key === 'I') {
      e.preventDefault();
      setView('index');
    }
  }
</script>

<svelte:window onkeydown={handleKey} />

<Masthead
  search={data.search}
  {onSearch}
  bind:searchEl
  {view}
  {setView}
  onNew={handleNew}
  total={data.total}
  filteredCount={memos.length}
/>

<Navbar
  {memos}
  activeCategory={data.category}
  {setActiveCategory}
  activeTags={data.tags}
  {toggleTag}
  onClear={clearAll}
  {filtering}
/>

<main>
  {#if memos.length === 0}
    <EmptyState search={data.search} category={data.category} tags={data.tags} />
  {:else if view === 'index'}
    <IndexView {memos} onOpen={handleOpen} />
  {:else}
    <GalleryView {memos} onOpen={handleOpen} />
  {/if}
</main>

<Footer />

{#if openMemo}
  <Reader
    memo={openMemo}
    onClose={() => (openMemo = null)}
    onEdit={handleEditFromReader}
  />
{/if}

{#if editMemo}
  <EditModal
    memo={editMemo}
    onClose={() => (editMemo = null)}
    onSaved={handleEditSaved}
    onDeleted={() => {
      editMemo = null;
      openMemo = null;
    }}
  />
{/if}

<style>
  main {
    max-width: 1280px;
    margin: 0 auto;
    padding: 36px 40px 120px;
    width: 100%;
    flex: 1;
  }
  @media (max-width: 640px) {
    main {
      padding: 24px 20px 80px;
    }
  }
</style>
