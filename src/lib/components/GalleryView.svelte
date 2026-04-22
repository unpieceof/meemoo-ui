<script lang="ts">
  import type { Memo } from '$lib/supabase/types';
  import GalleryCard from './GalleryCard.svelte';

  let {
    memos,
    onOpen
  }: {
    memos: Memo[];
    onOpen: (memo: Memo) => void;
  } = $props();

  const SPANS = [8, 4, 6, 6, 4, 4, 4, 8, 4, 4, 6, 6, 4, 4, 4, 8, 4];
</script>

<div class="grid">
  {#each memos as memo, i (memo.id)}
    {@const feature = i === 0}
    {@const span = feature ? 8 : SPANS[i % SPANS.length]}
    <GalleryCard {memo} index={i} {feature} {span} {onOpen} />
  {/each}
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 1px;
    background: var(--rule);
    border: 1px solid var(--ink);
  }
  @media (max-width: 900px) {
    .grid {
      grid-template-columns: repeat(6, 1fr);
    }
    .grid :global(.card) {
      grid-column: span 6 !important;
    }
  }
</style>
