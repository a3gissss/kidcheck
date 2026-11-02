import { Component } from 'react'

// If a page crashes, show a way out instead of a blank screen.
// Saved cases live in the browser, so they are not lost.
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('KidCheck page crashed:', error, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div role="alert" className="mx-auto max-w-xl rounded-lg border border-red-300 bg-white p-6 text-center">
        <h1 className="text-xl font-bold">Something went wrong on this page</h1>
        <p className="mt-2 text-slate-600">Your saved cases are safe. Reload the page or go back to the start.</p>
        <div className="mt-4 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-lg bg-teal-700 px-5 py-2.5 font-medium text-white hover:bg-teal-800"
          >
            Reload
          </button>
          <a href="/" className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium hover:bg-slate-100">
            Go home
          </a>
        </div>
      </div>
    )
  }
}
