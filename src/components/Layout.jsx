import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import ErrorBoundary from './ErrorBoundary.jsx'
import { storageAvailable } from '../lib/storage.js'

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium ${
    isActive ? 'bg-teal-700 text-white' : 'text-slate-700 hover:bg-slate-100'
  }`

export default function Layout() {
  const { pathname } = useLocation()
  const [canStore] = useState(storageAvailable)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <aside aria-label="Disclaimer" className="bg-amber-100 text-amber-900 text-xs sm:text-sm text-center px-4 py-2">
        Educational prototype. Not a medical device. Not clinically validated.
      </aside>

      <header className="bg-white border-b border-slate-200 print:hidden">
        <nav className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <NavLink to="/" className="text-lg font-bold text-teal-700">KidCheck</NavLink>
          <div className="flex gap-1">
            <NavLink to="/new" className={linkClass}>New case</NavLink>
            <NavLink to="/cases" className={linkClass}>Case log</NavLink>
          </div>
        </nav>
      </header>

      {!canStore && (
        <aside aria-label="Storage blocked" className="bg-red-100 text-red-900 text-sm text-center px-4 py-2 print:hidden">
          <p role="alert">This browser is blocking storage (private mode or site data turned off). Cases cannot be saved.</p>
        </aside>
      )}

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
        {/* key: a crash on one page clears when you move to another */}
        <ErrorBoundary key={pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>

      <footer className="text-center text-xs text-slate-500 py-4 print:hidden">
        Rules based on WHO/UNICEF "Caring for the sick child in the community". Demo data is synthetic.
      </footer>
    </div>
  )
}
