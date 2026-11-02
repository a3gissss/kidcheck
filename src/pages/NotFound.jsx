import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="text-center py-12">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <Link to="/" className="text-teal-700 underline mt-4 inline-block">Go home</Link>
    </div>
  )
}
