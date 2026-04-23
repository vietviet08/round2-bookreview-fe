import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, Author } from '@/lib/api'
import CrudForm from '@/components/CrudForm'

export default function AuthorCreatePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: Partial<Author>) => {
    setLoading(true)
    try {
      await api.authors.create({ name: data.name ?? '' })
      navigate('/authors')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CrudForm
      fields={[{ key: 'name', label: 'Name', required: true }]}
      onSubmit={handleSubmit}
      onCancel={() => navigate('/authors')}
    />
  )
}
