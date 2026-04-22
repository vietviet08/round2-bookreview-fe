import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface Field {
  key: string
  label: string
  required?: boolean
  type?: 'text' | 'number' | 'textarea' | 'select'
  options?: { value: string; label: string }[]
}

interface Props<T> {
  fields: Field[]
  initial?: T
  onSubmit: (data: Partial<T>) => Promise<void>
  onCancel: () => void
}

export default function CrudForm<T extends Record<string, any>>({
  fields, initial, onSubmit, onCancel,
}: Props<T>) {
  const [form, setForm] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map(f => [f.key, initial?.[f.key]?.toString() ?? '']))
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (key: string, value: string) => {
    setForm(f => ({ ...f, [key]: value }))
    if (errors[key]) setErrors(e => { const n = {...e}; delete n[key]; return n })
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    fields.forEach(f => {
      if (f.required && !form[f.key].trim()) {
        errs[f.key] = `${f.label} is required`
      }
    })
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSubmitting(true)
    try {
      const data: Record<string, any> = {}
      fields.forEach(f => {
        if (f.type === 'number') {
          data[f.key] = form[f.key] ? Number.parseInt(form[f.key]) : undefined
        } else {
          data[f.key] = form[f.key].trim()
        }
      })
      await onSubmit(data as Partial<T>)
    } finally {
      setSubmitting(false)
    }
  }

  const btnLabel = initial ? 'Update' : 'Create'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map(f => {
        const hasError = Boolean(errors[f.key])
        const inputClass = 'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        const isTextarea = f.type === 'textarea'
        const isSelect = Boolean(f.options)
        return (
          <div key={f.key}>
            <Label htmlFor={f.key}>{f.label}{f.required ? ' *' : ''}</Label>
          {isTextarea ? (
              <textarea
                id={f.key}
                value={form[f.key]}
                onChange={e => handleChange(f.key, e.target.value)}
                rows={4}
                className={`${inputClass} resize-none`}
              />
            ) : isSelect ? (
              <select
                id={f.key}
                value={form[f.key]}
                onChange={e => handleChange(f.key, e.target.value)}
                className={inputClass}
              >
                <option value="">-- Select --</option>
                {f.options!.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            ) : (
              <Input
                id={f.key}
                type={f.type ?? 'text'}
                value={form[f.key]}
                onChange={e => handleChange(f.key, e.target.value)}
                className={inputClass}
              />
            )}
            {hasError && <p className="text-sm text-destructive mt-1">{errors[f.key]}</p>}
          </div>
        )
      })}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : btnLabel}</Button>
      </div>
    </form>
  )
}
