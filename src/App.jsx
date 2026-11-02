import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Landing from './pages/Landing.jsx'
import NewCase from './pages/NewCase.jsx'
import CaseLog from './pages/CaseLog.jsx'
import CaseResult from './pages/CaseResult.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/new" element={<NewCase />} />
        <Route path="/cases" element={<CaseLog />} />
        <Route path="/cases/:id" element={<CaseResult />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
