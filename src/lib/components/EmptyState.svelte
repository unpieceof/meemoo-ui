<script lang="ts">
  let {
    search = '',
    category = '',
    tags = []
  }: { search?: string; category?: string; tags?: string[] } = $props();

  const filtering = $derived(!!search || !!category || (tags?.length ?? 0) > 0);
  const detail = $derived(
    search
      ? `"${search}"`
      : category
        ? category
        : tags.length
          ? tags.map((t) => `#${t}`).join(' · ')
          : ''
  );
</script>

<div class="empty">
  <div class="serif-it big">empty pages.</div>
  <div class="mono sub">
    {#if filtering}
      no memos match {detail}
    {:else}
      no memos yet — press <span class="mono accent">N</span> to inscribe your first
    {/if}
  </div>
</div>

<style>
  .empty {
    padding: 120px 40px;
    text-align: center;
    border-top: 1px solid var(--ink);
    border-bottom: 1px solid var(--ink);
  }
  .big {
    font-size: 56px;
    letter-spacing: -0.02em;
    margin-bottom: 10px;
    line-height: 1;
  }
  .sub {
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--ink-3);
  }
  .accent {
    color: var(--ink);
    border-bottom: 1px solid var(--ink);
    padding: 0 4px;
  }
</style>
