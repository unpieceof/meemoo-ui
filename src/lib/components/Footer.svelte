<script lang="ts">
  import Kbd from './Kbd.svelte';
</script>

<footer>
  <div class="inner">
    <div class="mono meta">© meemoo — Est. 2026 · Printed in ink</div>
    <div class="mono meta shortcuts">
      <Kbd>{'/'}</Kbd> <span>search</span>
      <Kbd>N</Kbd> <span>new</span>
      <Kbd>G</Kbd> <span>gallery</span>
      <Kbd>I</Kbd> <span>index</span>
    </div>
  </div>
</footer>

<style>
  footer {
    border-top: 1px solid var(--ink);
    padding: 24px 40px;
    margin-top: auto;
  }
  .inner {
    max-width: 1280px;
    margin: 0 auto;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 20px;
    flex-wrap: wrap;
  }
  .meta {
    font-size: 10.5px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--ink-3);
  }
  .shortcuts {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }
  .shortcuts span {
    margin-right: 10px;
  }
</style>
