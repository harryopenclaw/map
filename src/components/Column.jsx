import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import Card from './Card'

const HEADER_COLORS = [
  'bg-[#8B3A62]',
  'bg-[#E91E8C]',
  'bg-gradient-to-r from-[#F28B6D] to-[#F5A962]',
  'bg-[#2A9D8F]',
  'bg-[#6C4AB6]',
  'bg-[#F59E0B]',
]

export function getHeaderColor(index) {
  return HEADER_COLORS[index % HEADER_COLORS.length]
}

export default function Column({ column, index, onAddCard, onUpdateCard, onDeleteCard, onRenameColumn, onDeleteColumn }) {
  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [editingName, setEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState(column.title)

  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  const headerColor = getHeaderColor(index)

  function submitCard() {
    const trimmed = newTitle.trim()
    if (trimmed) {
      onAddCard(column.id, trimmed)
      setNewTitle('')
    }
    setAdding(false)
  }

  function commitName() {
    const trimmed = nameDraft.trim()
    if (trimmed && trimmed !== column.title) {
      onRenameColumn(column.id, trimmed)
    } else {
      setNameDraft(column.title)
    }
    setEditingName(false)
  }

  const cardIds = column.cards.map((c) => c.id)

  return (
    <div className="flex flex-col bg-white/60 backdrop-blur-sm rounded-col w-[300px] min-w-[300px] max-h-full">
      {/* Header */}
      <div className={`${headerColor} rounded-t-col px-4 py-3 flex items-center justify-between`}>
        {editingName ? (
          <input
            autoFocus
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            onBlur={commitName}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitName()
              if (e.key === 'Escape') {
                setNameDraft(column.title)
                setEditingName(false)
              }
            }}
            className="bg-white/20 text-white font-bold text-sm rounded px-2 py-0.5 outline-none placeholder-white/60 w-full mr-2"
          />
        ) : (
          <h3
            className="text-white font-bold text-sm tracking-wide cursor-pointer truncate"
            onClick={() => {
              setNameDraft(column.title)
              setEditingName(true)
            }}
          >
            {column.title}
          </h3>
        )}
        <div className="flex items-center gap-2 shrink-0">
          <span className="bg-white/25 text-white text-xs font-bold px-2.5 py-0.5 rounded-full backdrop-blur-sm">
            {column.cards.length}
          </span>
          {onDeleteColumn && (
            <button
              onClick={() => onDeleteColumn(column.id)}
              className="text-white/60 hover:text-white text-sm transition-colors"
              title="Delete column"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Cards */}
      <div
        ref={setNodeRef}
        className={`flex-1 overflow-y-auto column-scroll p-2 space-y-2 transition-colors ${
          isOver ? 'bg-gray-100/80' : ''
        }`}
      >
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {column.cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              onUpdate={(updated) => onUpdateCard(column.id, updated)}
              onDelete={(cardId) => onDeleteCard(column.id, cardId)}
            />
          ))}
        </SortableContext>

        {column.cards.length === 0 && !adding && (
          <p className="text-center text-gray-300 text-xs py-4 select-none">Drop cards here</p>
        )}
      </div>

      {/* Add Card */}
      <div className="p-2 pt-0">
        {adding ? (
          <div className="space-y-2">
            <input
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submitCard()
                if (e.key === 'Escape') {
                  setNewTitle('')
                  setAdding(false)
                }
              }}
              placeholder="Card title..."
              className="w-full bg-white rounded-lg px-3 py-2 text-sm outline-none border border-gray-200 focus:border-hotpink placeholder-gray-300"
            />
            <div className="flex gap-2">
              <button
                onClick={submitCard}
                className="flex-1 bg-gray-800 text-white text-xs font-semibold rounded-lg py-1.5 hover:bg-gray-700 transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setNewTitle('')
                  setAdding(false)
                }}
                className="flex-1 bg-gray-100 text-gray-500 text-xs font-semibold rounded-lg py-1.5 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="w-full text-gray-400 hover:text-gray-600 hover:bg-white/80 text-sm font-semibold rounded-lg py-2 transition-colors"
          >
            + Add card
          </button>
        )}
      </div>
    </div>
  )
}
