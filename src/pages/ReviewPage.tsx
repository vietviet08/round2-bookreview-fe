import { useState, useEffect } from 'react'
import { api, Review, Book, PageResponse } from '@/lib/api'
import CrudList from '@/components/CrudList'
import CrudForm from '@/components/CrudForm'

export default function ReviewPage() {
  const [data, setData] = useState<PageResponse<Review>>()
  const [books, setBooks] = useState<Book[]>([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)

  const load = (p = 0) => {
    setLoading(true)
    api.reviews.list(p, 5).then(setData).catch(() => setData({ content: [], totalElements: 0, totalPages: 0, number: 0, size: 5 })).finally(() => setLoading(false))
  }

  useEffect(() => { load(page) }, [page])
  useEffect(() => { api.books.all().then(res => setBooks(Array.isArray(res) ? res : res.content ?? [])) }, [])

  const handleSubmit = async (formData: Partial<Review>) => {
    const payload = { content: formData.content ?? '', bookId: formData.bookId }
    if (formData.id) await api.reviews.update(formData.id as number, payload)
    else await api.reviews.create(payload)
    load(page)
  }

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
      renderForm={({ item, onSuccess }) => (
        <CrudForm
          fields={[
            { key: 'content', label: 'Content', required: true, type: 'textarea' },
            { key: 'bookId', label: 'Book', type: 'select', options: books.map(b => ({ value: String(b.id), label: b.title })) },
          ]}
          initial={item}
          onSubmit={handleSubmit as any}
          onCancel={onSuccess}
        />
      )}
    />
  )
}
