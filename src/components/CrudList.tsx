import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Column<T> {
  key: keyof T | string
  label: string
  render?: (item: T) => React.ReactNode
}

interface Props<T> {
  title: string
  columns: Column<T>[]
  data: T[]
  loading: boolean
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onDelete: (item: T) => void
  deleteLabel?: (item: T) => string
  renderForm: (props: { item?: T; onSuccess: () => void }) => React.ReactNode
}

export default function CrudList<T extends { id?: number }>({
  title, columns, data, loading,
  currentPage, totalPages, onPageChange,
  onDelete, deleteLabel,
  renderForm,
}: Props<T>) {
  const [editItem, setEditItem] = useState<T | undefined>()
  const [showDelete, setShowDelete] = useState(false)
  const [deleteItem, setDeleteItem] = useState<T | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const openCreate = () => { setEditItem(undefined); setDialogOpen(true) }
  const openEdit = (item: T) => { setEditItem(item); setDialogOpen(true) }
  const openDelete = (item: T) => { setDeleteItem(item); setShowDelete(true) }

  const isActive = (i: number) => currentPage === i

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <Button onClick={openCreate}>+ Create {title.replace(/s$/, '')}</Button>
      </div>

      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              {columns.map(c => (
                <th key={c.key as string} className="text-left px-4 py-3 font-medium text-muted-foreground">{c.label}</th>
              ))}
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td colSpan={columns.length + 1} className="text-center py-8 text-muted-foreground">Loading...</td></tr>
            ) : (
              data.length === 0 ? (
                <tr><td colSpan={columns.length + 1} className="text-center py-8 text-muted-foreground">No data found</td></tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    {columns.map(c => (
                      <td key={c.key as string} className="px-4 py-3">
                        {c.render ? c.render(item) : String((item as any)[c.key as string] ?? '-')}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="icon" className="mr-1" onClick={() => openEdit(item)}>
                        <Pencil className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDelete(item)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => onPageChange(i)}
              className={`min-w-[36px] h-9 px-3 rounded-md text-sm transition-colors ${
                isActive(i)
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{editItem ? `Update ${title.replace(/s$/, '')}` : `Create ${title.replace(/s$/, '')}`}</h3>
              <button onClick={() => setDialogOpen(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            {renderForm({ item: editItem, onSuccess: () => setDialogOpen(false) })}
          </div>
        </div>
      )}

      {showDelete && deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-2">Delete {title.replace(/s$/, '')}</h3>
            <p className="text-muted-foreground mb-4">
              Are you sure you want to delete <strong>{deleteLabel ? deleteLabel(deleteItem) : 'this item'}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDelete(false)}>Cancel</Button>
              <Button className="bg-destructive hover:bg-destructive/90" onClick={() => { onDelete(deleteItem); setShowDelete(false) }}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
