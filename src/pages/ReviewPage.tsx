import { useState, useEffect } from 'react'
import { api, Review, Book, PageResponse } from '@/lib/api'
import CrudList from '@/components/CrudList'

export default function ReviewPage() {
  const [data, setData] = useState<PageResponse<Review>>()
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)

  const load = (p = 0) => {
    setLoading(true)
    api.reviews.list(p, 5).then(setData).catch(() => setData({ content: [], totalElements: 0, totalPages: 0, number: 0, size: 5 })).finally(() => setLoading(false))
  }

  useEffect(() => { load(page) }, [page])

  return (
    <CrudList
      title="Reviews"
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'content', label: 'Content', render: (item) => <span className="max-w-xs truncate block">{item.content}</span> },
        { key: 'bookTitle', label: 'Book' },
      ]}
      data={data?.content ?? []}
      loading={loading}
      currentPage={data?.number ?? 0}
      totalPages={data?.totalPages ?? 0}
      onPageChange={setPage}
      onDelete={async (item) => { if (item.id) await api.reviews.delete(item.id); load(page) }}
    />
  )
}
