import { useState, useEffect } from 'react'
import { api, Book, Author, PageResponse } from '@/lib/api'
import CrudList from '@/components/CrudList'
import CrudForm from '@/components/CrudForm'

export default function BookPage() {
  const [data, setData] = useState<PageResponse<Book>>()
  const [authors, setAuthors] = useState<Author[]>([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)

  const load = (p = 0) => {
    setLoading(true)
    api.books.list(p, 5).then(setData).catch(() => setData({ content: [], totalElements: 0, totalPages: 0, number: 0, size: 5 })).finally(() => setLoading(false))
  }

  useEffect(() => { load(page) }, [page])
  useEffect(() => { api.authors.all().then(res => setAuthors(Array.isArray(res) ? res : res.content ?? [])) }, [])

  const handleSubmit = async (formData: Partial<Book>) => {
    const payload = { title: formData.title ?? '', quantity: formData.quantity, authorId: formData.authorId }
    if (formData.id) {
      await api.books.update(formData.id as number, payload)
    } else {
      await api.books.create(payload)
    }
    load(page)
  }

  const fields = [
    { key: 'title', label: 'Title', required: true },
    { key: 'quantity', label: 'Quantity', type: 'number' },
    { key: 'authorId', label: 'Author', type: 'select', options: authors.map(a => ({ value: String(a.id), label: a.name })) },
  ]

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
      renderForm={({ item, onSuccess }) => (
        <CrudForm
          fields={fields}
          initial={item}
          onSubmit={handleSubmit as any}
          onCancel={onSuccess}
        />
      )}
    />
  )
}
