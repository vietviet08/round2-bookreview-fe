import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, Review, Book } from '@/lib/api'
import CrudForm from '@/components/CrudForm'

export default function ReviewCreatePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [books, setBooks] = useState<Book[]>([])
  const [booksLoading, setBooksLoading] = useState(true)

  useEffect(() => {
    api.books.all().then(res => {
      setBooks(Array.isArray(res) ? res : res.content ?? [])
      setBooksLoading(false)
    }).catch(() => setBooksLoading(false))
  }, [])

  const handleSubmit = async (data: Partial<Review>) => {
    setLoading(true)
    try {
      await api.reviews.create({ content: data.content ?? '', bookId: data.bookId })
      navigate('/reviews')
    } finally {
      setLoading(false)
    }
  }

  if (booksLoading) {
    return <p className="text-muted-foreground">Loading...</p>
  }

  return (
    <CrudForm
      fields={[
        { key: 'content', label: 'Content', required: true, type: 'textarea' as const },
        { key: 'bookId', label: 'Book', type: 'select' as const, options: books.map(b => ({ value: String(b.id), label: b.title })) },
      ]}
      onSubmit={handleSubmit}
      onCancel={() => navigate('/reviews')}
    />
  )
}
