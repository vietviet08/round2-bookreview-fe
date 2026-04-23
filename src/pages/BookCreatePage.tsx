import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, Book, Author } from '@/lib/api'
import CrudForm from '@/components/CrudForm'

export default function BookCreatePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [authors, setAuthors] = useState<Author[]>([])
  const [authorsLoading, setAuthorsLoading] = useState(true)

  useEffect(() => {
    api.authors.all().then(res => {
      setAuthors(Array.isArray(res) ? res : res.content ?? [])
      setAuthorsLoading(false)
    }).catch(() => setAuthorsLoading(false))
  }, [])

  const handleSubmit = async (data: Partial<Book>) => {
    setLoading(true)
    try {
      await api.books.create({
        title: data.title ?? '',
        quantity: data.quantity,
        authorId: data.authorId,
      })
      navigate('/books')
    } finally {
      setLoading(false)
    }
  }

  if (authorsLoading) {
    return <p className="text-muted-foreground">Loading...</p>
  }

  return (
    <CrudForm
      fields={[
        { key: 'title', label: 'Title', required: true },
        { key: 'quantity', label: 'Quantity', type: 'number' as const },
        { key: 'authorId', label: 'Author', type: 'select' as const, options: authors.map(a => ({ value: String(a.id), label: a.name })) },
      ]}
      onSubmit={handleSubmit}
      onCancel={() => navigate('/books')}
    />
  )
}
