<script lang="ts">
  import { invalidateAll, goto } from '$app/navigation';
  import type { Memo } from '$lib/supabase/types';

  let {
    memo,
    onClose,
    onSaved,
    onDeleted
  }: {
    memo: Partial<Memo> | null;
    onClose: () => void;
    onSaved?: (memo: Memo) => void;
    onDeleted?: () => void;
  } = $props();

  const isNew = $derived(!memo?.id);

  // EditModal remounts when editMemo prop on the parent changes, so capturing
  // the initial prop values into local $state is intentional here.
  /* svelte-ignore state_referenced_locally */
  let title = $state(memo?.title ?? '');
  /* svelte-ignore state_referenced_locally */
  let category = $state(memo?.category ?? '');
  /* svelte-ignore state_referenced_locally */
  let tagsInput = $state((memo?.tags ?? []).join(', '));
  /* svelte-ignore state_referenced_locally */
  let sourceUrl = $state(memo?.source_url ?? '');
  /* svelte-ignore state_referenced_locally */
  let rawContent = $state(memo?.raw_content ?? '');
  let saving = $state(false);
  let deleting = $state(false);
  let errorMsg = $state('');
  let enter = $state(false);

  $effect(() => {
    const raf = requestAnimationFrame(() => (enter = true));
    return () => cancelAnimationFrame(raf);
  });

  function inferSourceType(url: string): string | null {
    if (!url) return null;
    if (/x\.com|twitter\.com/.test(url)) return 'X';
    try {
      const u = new URL(url);
      return u.hostname.replace(/^www\./, '');
    } catch {
      return 'Web';
    }
  }

  async function handleSave() {
    saving = true;
    errorMsg = '';
    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean);

      const payload: Record<string, unknown> = {
        title: title.trim() || '제목 없음',
        category: category.trim() || null,
        tags,
        source_url: sourceUrl.trim() || null,
        source_type: inferSourceType(sourceUrl.trim()),
        raw_content: rawContent || null
      };

      const url = isNew ? '/api/memos' : `/api/memos/${memo!.id}`;
      const method = isNew ? 'POST' : 'PATCH';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? `${isNew ? '생성' : '저장'} 실패`);
      }

      await invalidateAll();
      const saved = { ...(memo as Memo), ...payload } as Memo;
      onSaved?.(saved);
      onClose();
    } catch (e) {
      errorMsg = e instanceof Error ? e.message : String(e);
    } finally {
      saving = false;
    }
  }

  async function handleDelete() {
    if (!memo?.id) return;
    if (!confirm('이 메모를 삭제하시겠습니까?')) return;
    deleting = true;
    errorMsg = '';
    try {
      const res = await fetch(`/api/memos/${memo.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? '삭제 실패');
      }
      await invalidateAll();
      if (onDeleted) onDeleted();
      else onClose();
    } catch (e) {
      errorMsg = e instanceof Error ? e.message : String(e);
    } finally {
      deleting = false;
    }
  }

  function handleBackdrop(e: MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleKey(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose();
  }
</script>

<svelte:window onkeydown={handleKey} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="backdrop" class:enter onclick={handleBackdrop}>
  <div class="sheet" class:enter role="dialog" aria-modal="true" aria-label={isNew ? '새 메모' : '메모 편집'}>
    <div class="head">
      <span class="mono kicker">{isNew ? 'Inscribe ——' : 'Amend ——'}</span>
      <h2 class="serif title">{isNew ? 'New memo' : 'Editing'}</h2>
    </div>

    <div class="scroll body">
      <label class="field">
        <span class="mono label">Source URL</span>
        <input
          class="mono line-input"
          type="url"
          bind:value={sourceUrl}
          placeholder="https://..." />
      </label>

      <label class="field">
        <span class="mono label">Title</span>
        <input
          class="serif line-input large"
          type="text"
          bind:value={title}
          placeholder="제목을 입력하세요" />
      </label>

      <label class="field">
        <span class="mono label">Section · 자유 입력</span>
        <input
          class="mono line-input"
          type="text"
          bind:value={category}
          placeholder="배움, 소비, 정보, 아이디어, 문화..." />
      </label>

      <label class="field">
        <span class="mono label">Tags · 쉼표로 구분</span>
        <input
          class="mono line-input"
          type="text"
          bind:value={tagsInput}
          placeholder="ai, github, 개발" />
      </label>

      <label class="field">
        <span class="mono label">Body</span>
        <textarea
          class="serif body-input"
          rows="6"
          bind:value={rawContent}
          placeholder="원문 혹은 메모를 입력하세요"></textarea>
      </label>

      {#if errorMsg}
        <p class="mono error">{errorMsg}</p>
      {/if}
    </div>

    <div class="foot">
      {#if !isNew}
        <button class="mono delete" onclick={handleDelete} disabled={deleting}>
          {deleting ? 'Deleting...' : 'Delete ×'}
        </button>
      {:else}
        <span></span>
      {/if}
      <div class="right">
        <button class="mono cancel" onclick={onClose}>Cancel</button>
        <button class="mono save" onclick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save ⟶'}
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 60;
    background: rgba(17, 17, 17, 0);
    transition: background 160ms ease;
    display: grid;
    place-items: center;
    padding: 24px;
  }
  .backdrop.enter {
    background: rgba(17, 17, 17, 0.5);
  }
  .sheet {
    width: min(620px, 96vw);
    max-height: calc(100vh - 48px);
    background: var(--paper);
    border: 1px solid var(--ink);
    display: flex;
    flex-direction: column;
    transform: translateY(10px);
    opacity: 0;
    transition:
      transform 200ms cubic-bezier(0.2, 0.8, 0.3, 1),
      opacity 160ms ease;
  }
  .sheet.enter {
    transform: translateY(0);
    opacity: 1;
  }
  .head {
    padding: 18px 28px;
    border-bottom: 1px solid var(--ink);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
  }
  .kicker {
    font-size: 10.5px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--ink-3);
  }
  .title {
    margin: 0;
    font-size: 22px;
    font-weight: 500;
    letter-spacing: -0.015em;
  }
  .body {
    padding: 22px 28px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 22px;
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .label {
    font-size: 10.5px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--ink-3);
  }
  .line-input {
    width: 100%;
    padding: 8px 0;
    font-size: 15px;
    font-weight: 400;
    letter-spacing: 0;
    border: none;
    outline: none;
    border-bottom: 1px solid var(--rule);
    transition: border-color 120ms ease;
  }
  .line-input.large {
    font-size: 22px;
    font-weight: 500;
    letter-spacing: -0.015em;
  }
  .mono.line-input {
    font-size: 13px;
  }
  .line-input:focus {
    border-bottom-color: var(--ink);
  }
  .body-input {
    width: 100%;
    padding: 10px 0;
    font-size: 16px;
    line-height: 1.65;
    border: none;
    outline: none;
    border-bottom: 1px solid var(--rule);
    resize: vertical;
    transition: border-color 120ms ease;
  }
  .body-input:focus {
    border-bottom-color: var(--ink);
  }
  .error {
    margin: 0;
    padding: 8px 0;
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--ink);
    border-top: 1px solid var(--ink);
  }
  .foot {
    padding: 14px 28px;
    border-top: 1px solid var(--ink);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
  }
  .delete {
    font-size: 10.5px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--ink-3);
    border-bottom: 1px solid var(--rule);
    padding-bottom: 2px;
  }
  .delete:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .right {
    display: flex;
    gap: 16px;
    align-items: center;
  }
  .cancel {
    font-size: 10.5px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--ink-3);
  }
  .save {
    font-size: 10.5px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    padding: 10px 18px;
    background: var(--ink);
    color: var(--paper);
    border: 1px solid var(--ink);
    transition: background 120ms ease, color 120ms ease;
  }
  .save:hover:not(:disabled) {
    background: var(--paper);
    color: var(--ink);
  }
  .save:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>
