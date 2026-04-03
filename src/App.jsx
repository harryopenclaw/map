import { useState, useEffect } from 'react'
import KpiBar from './components/KpiBar'
import Board from './components/Board'

const DEFAULT_COLUMNS = [
  { id: 'col-1', title: 'Prospecting', cards: [] },
  { id: 'col-2', title: 'Outreach Sent', cards: [] },
  { id: 'col-3', title: 'In Conversation', cards: [] },
  { id: 'col-4', title: 'Proposal Out', cards: [] },
  { id: 'col-5', title: 'Closed Won', cards: [] },
  { id: 'col-6', title: 'Delegated', cards: [] },
]

const DEFAULT_KPIS = {
  networkThermometer: 50,
  contactsToday: 0,
  newContent: 0,
  dealsClosed: 0,
  funnelTemp: 50,
}

function loadState(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export default function App() {
  const [columns, setColumns] = useState(() => loadState('map-boards-v1', DEFAULT_COLUMNS))
  const [kpis, setKpis] = useState(() => loadState('map-kpis', DEFAULT_KPIS))

  useEffect(() => {
    localStorage.setItem('map-boards-v1', JSON.stringify(columns))
  }, [columns])

  useEffect(() => {
    localStorage.setItem('map-kpis', JSON.stringify(kpis))
  }, [kpis])

  return (
    <div className="min-h-screen bg-cream font-poppins">
      {/* Header */}
      <header className="px-6 pt-6 pb-2">
        <h1 className="text-4xl font-bold text-gray-800 tracking-tight">MAP</h1>
        <p className="text-sm text-gray-500 font-semibold tracking-wide">
          Massive Action Plan &middot; Delegate Everything
        </p>
      </header>

      {/* KPI Dashboard */}
      <KpiBar kpis={kpis} setKpis={setKpis} />

      {/* Kanban Board */}
      <Board columns={columns} setColumns={setColumns} />
    </div>
  )
}
