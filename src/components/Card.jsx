import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const CARD_COLORS = [
  { name: 'yellow', bg: 'bg-[#F9E547]', border: 'border-l-[#E5D020]' },
  { name: 'orange', bg: 'bg-[#F5A070]', border: 'border-l-[#E8874F]' },
  { name: 'lavender', bg: 'bg-[#A99BDB]', border: 'border-l-[#8B7BC4]' },
  { name: 'green', bg: 'bg-[#7EC8A0]', border: 'border-l-[#5DB585]' },
  { name: 'blue', bg: 'bg-[#7BB5E3]', border: 'border-l-[#5A9AD5]' },
]

export function getNextColor(current) {
  const idx = CARD_COLORS.findIndex((c) => c.name === current)
  return CARD_COLORS[(idx + 1) % CARD_COLORS.length].name
}

export function getColorClasses(colorName) {
  return CARD_COLORS.find((c) => c.name === colorName) || CARD_COLORS[0]
}

export default function Card({ card, onUpdate, onDelete }) {
  const [editingTitle, setEditingTitle] = useState(false)
  const [draft, setDraft] = useState(card.title)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const colors = getColorClasses(card.color)

  function commitTitle() {
    const trimmed = draft.trim()
    if (trimmed) onUpdate({ ...card, title: trimmed })
    else setDraft(card.title)
    setEditingTitle(false)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${colors.border} border-l-4 bg-white rounded-card p-3 cursor-grab active:cursor-grabbing group shadow-sm`}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {editingTitle ? (
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitTitle()
                if (e.key === 'Escape') {
                  setDraft(card.title)
                  setEditingTitle(false)
                }
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="w-full bg-gray-50 rounded px-1.5 py-0.5 text-sm font-semibold text-gray-800 outline-none border border-gray-200 focus:border-gray-400"
            />
          ) : (
            <p
              className="text-sm font-semibold text-gray-800 cursor-text leading-snug line-clamp-2"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => {
                setDraft(card.title)
                setEditingTitle(true)
              }}
            >
              {card.title}
            </p>
          )}
        </div>

        {/* Actions - visible on hover */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onUpdate({ ...card, color: getNextColor(card.color) })}
            className="w-5 h-5 rounded flex items-center justify-center hover:bg-gray-100 text-gray-400 hover:text-gray-600 text-xs font-bold"
            title="Change colour"
          >
            ◑
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onDelete(card.id)}
            className="w-5 h-5 rounded flex items-center justify-center hover:bg-gray-100 text-gray-400 hover:text-gray-600 text-xs font-bold"
            title="Delete card"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}
