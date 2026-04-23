import { useState, useEffect } from 'react'
import { api, Book, Author, PageResponse } from '@/lib/api'
import CrudList from '@/components/CrudList'

export default function BookPage() {
  const [data, setData] = useState<PageResponse<Book>>()
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)

  const load = (p = 0) => {
    setLoading(true)
    api.books.list(p, 5).then(setData).catch(() => setData({ content: [], totalElements: 0, totalPages: 0, number: 0, size: 5 })).finally(() => setLoading(false))
  }

  useEffect(() => { load(page) }, [page])

  return (
    <CrudList
      title="Books"
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'title', label: 'Title' },
        { key: 'quantity', label: 'Quantity' },
        { key: 'authorName', label: 'Author' },
      ]}
      data={data?.content ?? []}
      loading={loading}
      currentPage={data?.number ?? 0}
      totalPages={data?.totalPages ?? 0}
      onPageChange={setPage}
      onDelete={async (item) => { if (item.id) await api.books.delete(item.id); load(page) }}
      deleteLabel={(item) => item.title}
    />
  )
}
