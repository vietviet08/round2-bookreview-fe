import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import AuthorPage from '@/pages/AuthorPage'
import AuthorCreatePage from '@/pages/AuthorCreatePage'
import BookPage from '@/pages/BookPage'
import BookCreatePage from '@/pages/BookCreatePage'
import ReviewPage from '@/pages/ReviewPage'
import ReviewCreatePage from '@/pages/ReviewCreatePage'

const menuItems = [
  { label: 'Author', path: '/authors', icon: '👤' },
  { label: 'Book', path: '/books', icon: '📖' },
  { label: 'Review', path: '/reviews', icon: '⭐' },
]

function Sidebar() {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-border flex flex-col">
      <div className="px-4 py-2 border-b border-border">
        <div className="font-bold text-lg text-primary">HAIBAZO BOOK REVIEW</div>
      </div>
      <nav className="flex-1 p-2">
        {menuItems.map(item => {
          const active = location.pathname.startsWith(item.path)
          return (
            <div key={item.label} className="mb-1">
              <div className="flex items-center justify-between">
                <NavLink
                  to={item.path}
                  end
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium flex-1',
                    active ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                  )}
                >
                  <span>{item.icon}</span> {item.label}
                </NavLink>
                <button
                  onClick={() => setCollapsed(c => ({ ...c, [item.label]: !c[item.label] }))}
                  className="p-1 hover:bg-accent text-muted-foreground mr-1"
                >
                  {collapsed[item.label] ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
              {!collapsed[item.label] && (
                <div className="ml-4 mt-1 space-y-0.5">
                  <NavLink to={item.path} end className={({ isActive }) => cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm',
                    isActive ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-accent'
                  )}>
                    <ChevronRight className="h-3 w-3" /> List
                  </NavLink>
                  <NavLink to={`${item.path}/create`} className={({ isActive }) => cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm',
                    isActive ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-accent'
                  )}>
                    <ChevronRight className="h-3 w-3" /> Create
                  </NavLink>
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

function Breadcrumb() {
  const location = useLocation()
  const labels: Record<string, string> = { authors: 'Author', books: 'Book', reviews: 'Review', create: 'Create' }
  const crumbs = location.pathname.split('/').filter(Boolean).map((s, i, arr) => ({
    label: labels[s] ?? s.charAt(0).toUpperCase() + s.slice(1),
    last: i === arr.length - 1,
  }))

  return (
    <div className="bg-white border-b border-border px-6 py-3 flex items-center gap-2 text-sm text-muted-foreground">
      <NavLink to="/" className="hover:text-foreground">Home</NavLink>
      {crumbs.map(c => (
        <span key={c.label} className="flex items-center gap-2">
          <span>/</span>
          <span className={cn(!c.last && 'text-muted-foreground')}>{c.label}</span>
        </span>
      ))}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Breadcrumb />
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<div className="flex flex-col items-center justify-center h-full text-muted-foreground"><p className="text-lg">Welcome to Haibazo Book Review</p><p className="text-sm mt-1">Select a menu from the sidebar</p></div>} />
              <Route path="/authors" element={<AuthorPage />} />
              <Route path="/authors/create" element={<AuthorCreatePage />} />
              <Route path="/books" element={<BookPage />} />
              <Route path="/books/create" element={<BookCreatePage />} />
              <Route path="/reviews" element={<ReviewPage />} />
              <Route path="/reviews/create" element={<ReviewCreatePage />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}
