import { useState } from 'react'

const KPI_CONFIG = [
  { key: 'networkThermometer', label: 'Network Thermometer', icon: '🌡️', isTemp: true },
  { key: 'contactsToday', label: 'Contacts Today', icon: '👥', isTemp: false },
  { key: 'newContent', label: 'New Content Created', icon: '✍️', isTemp: false },
  { key: 'dealsClosed', label: 'Total Deals Closed', icon: '🤝', isTemp: false },
  { key: 'funnelTemp', label: 'Funnel Temperature', icon: '🔥', isTemp: true },
]

function tempColor(val) {
  if (val > 70) return 'bg-emerald-500'
  if (val >= 40) return 'bg-yellow-400'
  return 'bg-red-500'
}

function KpiCard({ config, value, onChange }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(value))

  function startEdit() {
    setDraft(String(value))
    setEditing(true)
  }

  function commit() {
    const num = Math.max(0, parseInt(draft, 10) || 0)
    const clamped = config.isTemp ? Math.min(100, num) : num
    onChange(clamped)
    setEditing(false)
  }

  return (
    <div className="bg-white rounded-card px-4 py-3 flex items-center gap-3 flex-1 min-w-[160px] shadow-sm">
      <span className="text-2xl flex-shrink-0">{config.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider leading-tight whitespace-normal break-words">
          {config.label}
        </p>
        {editing ? (
          <input
            type="number"
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => e.key === 'Enter' && commit()}
            className="w-20 text-2xl font-bold text-gray-800 bg-gray-50 rounded px-1 outline-none border border-gray-200 focus:border-hotpink"
          />
        ) : (
          <button onClick={startEdit} className="flex items-center gap-2 group">
            {config.isTemp ? (
              <span
                className={`text-sm font-bold text-white px-2.5 py-0.5 rounded-full ${tempColor(value)}`}
              >
                {value}
              </span>
            ) : (
              <span className="text-2xl font-bold text-gray-800 group-hover:text-hotpink transition-colors">
                {value}
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default function KpiBar({ kpis, setKpis }) {
  function updateKpi(key, val) {
    setKpis((prev) => ({ ...prev, [key]: val }))
  }

  return (
    <div className="px-6 py-3">
      <div className="flex gap-3 overflow-x-auto pb-1 w-full">
        {KPI_CONFIG.map((cfg) => (
          <KpiCard
            key={cfg.key}
            config={cfg}
            value={kpis[cfg.key]}
            onChange={(val) => updateKpi(cfg.key, val)}
          />
        ))}
      </div>
    </div>
  )
}
