interface Props {
  current: number
  total: number
  onChange: (page: number) => void
}

export default function Pagination({ current, total, onChange }: Props) {
  if (total <= 1) return null

  const pages: (number | '...')[] = []
  if (total <= 7) {
    for (let i = 0; i < total; i++) pages.push(i)
  } else {
    pages.push(0)
    if (current > 2) pages.push('...')
    for (let i = Math.max(1, current - 1); i <= Math.min(total - 2, current + 1); i++) pages.push(i)
    if (current < total - 3) pages.push('...')
    pages.push(total - 1)
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-4">
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`e-${i}`} className="px-2 py-1 text-sm text-muted-foreground">...</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            className={`min-w-[36px] h-9 px-3 rounded-md text-sm transition-colors ${
              current === p
                ? 'bg-primary text-primary-foreground font-medium'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            {(p as number) + 1}
          </button>
        )
      )}
    </div>
  )
}
