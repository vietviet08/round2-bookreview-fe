import { useState, useEffect } from 'react'
import { api, Author, PageResponse } from '@/lib/api'
import CrudList from '@/components/CrudList'
import CrudForm from '@/components/CrudForm'

export default function AuthorPage() {
  const [data, setData] = useState<PageResponse<Author>>()
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)

  const load = (p = 0) => {
    setLoading(true)
    api.authors.list(p, 5).then(setData).catch(() => setData({ content: [], totalElements: 0, totalPages: 0, number: 0, size: 5 })).finally(() => setLoading(false))
  }

  useEffect(() => { load(page) }, [page])

  const handleSubmit = async (formData: Partial<Author>) => {
    if (formData.id) {
      await api.authors.update(formData.id as number, { name: formData.name ?? '' })
    } else {
      await api.authors.create({ name: formData.name ?? '' })
    }
    load(page)
  }

  return (
    <CrudList
      title="Authors"
      columns={[{ key: 'id', label: 'ID' }, { key: 'name', label: 'Name' }]}
      data={data?.content ?? []}
      loading={loading}
      currentPage={data?.number ?? 0}
      totalPages={data?.totalPages ?? 0}
      onPageChange={setPage}
      onDelete={async (item) => { if (item.id) await api.authors.delete(item.id); load(page) }}
      deleteLabel={(item) => item.name}
      renderForm={({ item, onSuccess }) => (
        <CrudForm
          fields={[{ key: 'name', label: 'Name', required: true }]}
          initial={item}
          onSubmit={handleSubmit as any}
          onCancel={onSuccess}
        />
      )}
    />
  )
}
