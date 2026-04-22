export interface DateParts {
  y: number;
  m: number;
  d: number;
  dd: string;
  mm: string;
  yy: string;
}

export function fmtDateParts(iso: string): DateParts {
  const isoDate = iso.length > 10 ? new Date(iso).toISOString().slice(0, 10) : iso;
  const [y, m, d] = isoDate.split('-').map(Number);
  return {
    y,
    m,
    d,
    dd: String(d).padStart(2, '0'),
    mm: String(m).padStart(2, '0'),
    yy: String(y).slice(2)
  };
}

export function fmtShort(iso: string): string {
  const { m, d } = fmtDateParts(iso);
  return `${m}월 ${d}일`;
}

export function fmtLong(iso: string): string {
  const p = fmtDateParts(iso);
  return `${p.y} · ${p.mm} · ${p.dd}`;
}

export function fmtMasthead(d: Date): string {
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
}
