<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import type { Memo } from '$lib/supabase/types';

  let { memo, onClose, onDeleted }: { memo: Memo; onClose: () => void; onDeleted?: () => void } = $props();

  let title = $state(memo.title ?? '');
  let category = $state(memo.category ?? '');
  let tagsInput = $state((memo.tags ?? []).join(', '));
  let rawContent = $state(memo.raw_content ?? '');
  let saving = $state(false);
  let deleting = $state(false);
  let error = $state('');

  async function handleSave() {
    saving = true;
    error = '';
    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch(`/api/memos/${memo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category: category || null, tags, raw_content: rawContent || null })
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? '저장 실패');
      }

      await invalidateAll();
      onClose();
    } catch (e: any) {
      error = e.message;
    } finally {
      saving = false;
    }
  }

  async function handleDelete() {
    if (!confirm('이 메모를 삭제하시겠습니까?')) return;
    deleting = true;
    error = '';
    try {
      const res = await fetch(`/api/memos/${memo.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? '삭제 실패');
      }
      await invalidateAll();
      if (onDeleted) {
        onDeleted();
      } else {
        onClose();
      }
    } catch (e: any) {
      error = e.message;
    } finally {
      deleting = false;
    }
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="backdrop" onclick={handleBackdropClick}>
  <div class="modal" role="dialog" aria-modal="true" aria-label="메모 편집">
    <header class="modal-header">
      <h2>메모 편집</h2>
      <button class="close-btn" onclick={onClose} aria-label="닫기">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </header>

    <div class="modal-body">
      {#if memo.source_url}
        <div class="field">
          <span class="field-label">소스 URL</span>
          <a href={memo.source_url} target="_blank" rel="noopener noreferrer" class="source-link">
            {memo.source_url}
          </a>
        </div>
      {/if}

      <div class="field">
        <label class="field-label" for="edit-title">제목</label>
        <input
          id="edit-title"
          type="text"
          class="field-input"
          bind:value={title}
        />
      </div>

      <div class="field">
        <label class="field-label" for="edit-category">카테고리</label>
        <input
          id="edit-category"
          type="text"
          class="field-input"
          bind:value={category}
          placeholder="예: Article, Video..."
        />
      </div>

      <div class="field">
        <label class="field-label" for="edit-tags">태그 (쉼표로 구분)</label>
        <input
          id="edit-tags"
          type="text"
          class="field-input"
          bind:value={tagsInput}
          placeholder="예: ai, llm, ux"
        />
      </div>

      <div class="field">
        <label class="field-label" for="edit-raw">원문</label>
        <textarea
          id="edit-raw"
          class="field-input field-textarea"
          bind:value={rawContent}
          placeholder="원문 내용을 입력하세요"
        ></textarea>
      </div>

      {#if error}
        <p class="error-msg">{error}</p>
      {/if}
    </div>

    <footer class="modal-footer">
      <button class="btn btn-danger" onclick={handleDelete} disabled={deleting}>
        {deleting ? '삭제 중...' : '삭제'}
      </button>
      <div class="footer-right">
        <button class="btn btn-ghost" onclick={onClose}>취소</button>
        <button class="btn btn-primary" onclick={handleSave} disabled={saving}>
          {saving ? '저장 중...' : '저장'}
        </button>
      </div>
    </footer>
  </div>
</div>

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    backdrop-filter: blur(2px);
  }

  .modal {
    background-color: var(--color-bg-elevated);
    border: 1px solid var(--color-border);
    border-radius: 10px;
    width: 100%;
    max-width: 480px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid var(--color-border);
  }

  .modal-header h2 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: transparent;
    border: none;
    border-radius: 4px;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.12s ease;
  }

  .close-btn:hover {
    background-color: var(--color-bg-surface);
    color: var(--color-text-primary);
  }

  .modal-body {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .field-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .field-input {
    padding: 8px 12px;
    background-color: var(--color-bg-surface);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    color: var(--color-text-primary);
    font-size: 14px;
    outline: none;
    transition: border-color 0.15s ease;
  }

  .field-input:focus {
    border-color: var(--color-accent);
  }

  .field-textarea {
    min-height: 160px;
    resize: vertical;
    font-family: inherit;
    line-height: 1.6;
  }

  .source-link {
    font-size: 12px;
    color: var(--color-accent);
    text-decoration: none;
    word-break: break-all;
    line-height: 1.4;
  }

  .source-link:hover {
    text-decoration: underline;
  }

  .error-msg {
    margin: 0;
    padding: 8px 12px;
    background-color: color-mix(in srgb, #e53e3e 15%, transparent);
    border: 1px solid color-mix(in srgb, #e53e3e 30%, transparent);
    border-radius: 6px;
    font-size: 13px;
    color: #fc8181;
  }

  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-top: 1px solid var(--color-border);
  }

  .footer-right {
    display: flex;
    gap: 8px;
  }

  .btn {
    padding: 7px 16px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: all 0.12s ease;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-primary {
    background-color: var(--color-accent);
    color: #fff;
  }

  .btn-primary:hover:not(:disabled) {
    background-color: var(--color-accent-hover);
  }

  .btn-ghost {
    background-color: transparent;
    color: var(--color-text-secondary);
    border: 1px solid var(--color-border);
  }

  .btn-ghost:hover:not(:disabled) {
    background-color: var(--color-bg-surface);
    color: var(--color-text-primary);
  }

  .btn-danger {
    background-color: transparent;
    color: #fc8181;
    border: 1px solid color-mix(in srgb, #e53e3e 40%, transparent);
  }

  .btn-danger:hover:not(:disabled) {
    background-color: color-mix(in srgb, #e53e3e 15%, transparent);
  }
</style>
