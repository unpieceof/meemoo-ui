<script lang="ts">
  let { children }: { children: import('svelte').Snippet } = $props();
</script>

<kbd>{@render children()}</kbd>

<style>
  kbd {
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--ink-4);
    border-radius: 3px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    line-height: 1;
  }
</style>
