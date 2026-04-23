import { useState, useEffect } from 'react'
import { api, Author, PageResponse } from '@/lib/api'
import CrudList from '@/components/CrudList'
import { useNavigate } from 'react-router-dom'

export default function AuthorPage() {
  const navigate = useNavigate()
  const [data, setData] = useState<PageResponse<Author>>()
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)

  const load = (p = 0) => {
    setLoading(true)
    api.authors.list(p, 5).then(setData).catch(() => setData({ content: [], totalElements: 0, totalPages: 0, number: 0, size: 5 })).finally(() => setLoading(false))
  }

  useEffect(() => { load(page) }, [page])

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
    />
  )
}
