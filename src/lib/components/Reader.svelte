<script lang="ts">
  import type { Memo } from '$lib/supabase/types';
  import ReaderBody from './ReaderBody.svelte';

  let {
    memo,
    onClose,
    onEdit
  }: {
    memo: Memo;
    onClose: () => void;
    onEdit: (memo: Memo) => void;
  } = $props();

  let enter = $state(false);

  $effect(() => {
    const raf = requestAnimationFrame(() => (enter = true));
    return () => cancelAnimationFrame(raf);
  });

  function handleKey(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose();
  }

  function handleBackdrop(e: MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }
</script>

<svelte:window onkeydown={handleKey} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="backdrop" class:enter onclick={handleBackdrop}>
  <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
  <article
    class="drawer scroll"
    class:enter
    role="dialog"
    aria-modal="true"
    aria-label="메모 상세">
    <header class="head">
      <button class="mono back" onclick={onClose}>← Back to index</button>
      <div class="actions">
        <button class="mono edit" onclick={() => onEdit(memo)}>Edit</button>
        <button class="mono close" onclick={onClose}>Close ×</button>
      </div>
    </header>

    <ReaderBody {memo} />
  </article>
</div>

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 50;
    background: rgba(17, 17, 17, 0);
    transition: background 180ms ease;
    display: flex;
    justify-content: flex-end;
  }
  .backdrop.enter {
    background: rgba(17, 17, 17, 0.4);
  }
  .drawer {
    width: min(780px, 96vw);
    height: 100vh;
    background: var(--paper);
    border-left: 1px solid var(--ink);
    overflow-y: auto;
    transform: translateX(100%);
    transition: transform 280ms cubic-bezier(0.2, 0.7, 0.2, 1);
  }
  .drawer.enter {
    transform: translateX(0);
  }
  .head {
    position: sticky;
    top: 0;
    background: var(--paper);
    border-bottom: 1px solid var(--ink);
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 40px;
  }
  .back,
  .close {
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--ink-3);
  }
  .actions {
    display: flex;
    gap: 18px;
  }
  .edit {
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    border-bottom: 1px solid var(--ink);
    padding-bottom: 2px;
  }
  @media (max-width: 640px) {
    .head {
      padding: 12px 20px;
    }
  }
</style>
