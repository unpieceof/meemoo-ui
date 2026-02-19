<script lang="ts">
  let {
    search = '',
    category = '',
    tag = ''
  }: { search?: string; category?: string; tag?: string } = $props();

  let message = $derived(() => {
    if (search) return `"${search}"에 대한 검색 결과가 없습니다`;
    if (category) return `"${category}" 카테고리에 메모가 없습니다`;
    if (tag) return `"#${tag}" 태그의 메모가 없습니다`;
    return '저장된 메모가 없습니다';
  });
</script>

<div class="empty-state">
  <div class="empty-icon">
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  </div>
  <p class="empty-message">{message()}</p>
  {#if search || category || tag}
    <a href="/" class="reset-link">전체 보기</a>
  {/if}
</div>

<style>
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 24px;
    gap: 12px;
    text-align: center;
  }

  .empty-icon {
    color: var(--color-border);
  }

  .empty-message {
    margin: 0;
    font-size: 14px;
    color: var(--color-text-secondary);
  }

  .reset-link {
    margin-top: 4px;
    color: var(--color-accent);
    font-size: 13px;
    text-decoration: none;
  }

  .reset-link:hover {
    text-decoration: underline;
  }
</style>
