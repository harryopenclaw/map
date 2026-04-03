import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './Column'
import Card, { getColorClasses } from './Card'

let nextId = Date.now()
function uid() {
  return `id-${nextId++}`
}

const CARD_COLORS = ['yellow', 'orange', 'lavender', 'green', 'blue']
let colorIndex = 0
function nextCardColor() {
  const color = CARD_COLORS[colorIndex % CARD_COLORS.length]
  colorIndex++
  return color
}

export default function Board({ columns, setColumns }) {
  const [activeCard, setActiveCard] = useState(null)
  const [addingColumn, setAddingColumn] = useState(false)
  const [newColTitle, setNewColTitle] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  function findCardLocation(cardId) {
    for (const col of columns) {
      const idx = col.cards.findIndex((c) => c.id === cardId)
      if (idx !== -1) return { colId: col.id, cardIndex: idx }
    }
    return null
  }

  function handleDragStart(event) {
    const loc = findCardLocation(event.active.id)
    if (loc) {
      const col = columns.find((c) => c.id === loc.colId)
      setActiveCard(col.cards[loc.cardIndex])
    }
  }

  function handleDragOver(event) {
    const { active, over } = event
    if (!over) return

    const activeLocation = findCardLocation(active.id)
    if (!activeLocation) return

    // Check if over is a column (droppable) or a card (sortable)
    const overColumn = columns.find((c) => c.id === over.id)
    const overCardLocation = findCardLocation(over.id)

    const targetColId = overColumn ? overColumn.id : overCardLocation?.colId
    if (!targetColId || targetColId === activeLocation.colId) return

    // Move card to new column
    setColumns((prev) => {
      const sourceCol = prev.find((c) => c.id === activeLocation.colId)
      const destCol = prev.find((c) => c.id === targetColId)
      const card = sourceCol.cards[activeLocation.cardIndex]

      const newSourceCards = sourceCol.cards.filter((c) => c.id !== active.id)
      const overIdx = overCardLocation
        ? destCol.cards.findIndex((c) => c.id === over.id)
        : destCol.cards.length
      const newDestCards = [...destCol.cards]
      newDestCards.splice(overIdx, 0, card)

      return prev.map((col) => {
        if (col.id === activeLocation.colId) return { ...col, cards: newSourceCards }
        if (col.id === targetColId) return { ...col, cards: newDestCards }
        return col
      })
    })
  }

  function handleDragEnd(event) {
    const { active, over } = event
    setActiveCard(null)

    if (!over || active.id === over.id) return

    const activeLocation = findCardLocation(active.id)
    const overLocation = findCardLocation(over.id)

    if (!activeLocation || !overLocation) return
    if (activeLocation.colId !== overLocation.colId) return

    // Reorder within same column
    setColumns((prev) =>
      prev.map((col) => {
        if (col.id !== activeLocation.colId) return col
        const oldIdx = col.cards.findIndex((c) => c.id === active.id)
        const newIdx = col.cards.findIndex((c) => c.id === over.id)
        return { ...col, cards: arrayMove(col.cards, oldIdx, newIdx) }
      })
    )
  }

  function addCard(colId, title) {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === colId
          ? { ...col, cards: [...col.cards, { id: uid(), title, color: nextCardColor() }] }
          : col
      )
    )
  }

  function updateCard(colId, updatedCard) {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === colId
          ? { ...col, cards: col.cards.map((c) => (c.id === updatedCard.id ? updatedCard : c)) }
          : col
      )
    )
  }

  function deleteCard(colId, cardId) {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === colId ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) } : col
      )
    )
  }

  function renameColumn(colId, newTitle) {
    setColumns((prev) =>
      prev.map((col) => (col.id === colId ? { ...col, title: newTitle } : col))
    )
  }

  function deleteColumn(colId) {
    setColumns((prev) => prev.filter((col) => col.id !== colId))
  }

  function addColumn() {
    const trimmed = newColTitle.trim()
    if (trimmed) {
      setColumns((prev) => [...prev, { id: uid(), title: trimmed, cards: [] }])
      setNewColTitle('')
    }
    setAddingColumn(false)
  }

  return (
    <div className="px-6 pb-6 flex-1">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto board-scroll pb-4 items-start" style={{ height: 'calc(100vh - 200px)' }}>
          {columns.map((col, i) => (
            <Column
              key={col.id}
              column={col}
              index={i}
              onAddCard={addCard}
              onUpdateCard={updateCard}
              onDeleteCard={deleteCard}
              onRenameColumn={renameColumn}
              onDeleteColumn={columns.length > 1 ? deleteColumn : undefined}
            />
          ))}

          {/* Add Column */}
          <div className="min-w-[280px] w-[280px]">
            {addingColumn ? (
              <div className="bg-white/60 backdrop-blur-sm rounded-col p-3 space-y-2">
                <input
                  autoFocus
                  value={newColTitle}
                  onChange={(e) => setNewColTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') addColumn()
                    if (e.key === 'Escape') {
                      setNewColTitle('')
                      setAddingColumn(false)
                    }
                  }}
                  placeholder="Column name..."
                  className="w-full bg-white rounded-lg px-3 py-2 text-sm outline-none border border-gray-200 focus:border-hotpink placeholder-gray-300"
                />
                <div className="flex gap-2">
                  <button
                    onClick={addColumn}
                    className="flex-1 bg-gray-800 text-white text-xs font-semibold rounded-lg py-1.5 hover:bg-gray-700 transition-colors"
                  >
                    Add Column
                  </button>
                  <button
                    onClick={() => {
                      setNewColTitle('')
                      setAddingColumn(false)
                    }}
                    className="flex-1 bg-gray-100 text-gray-500 text-xs font-semibold rounded-lg py-1.5 hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAddingColumn(true)}
                className="w-full bg-white/40 hover:bg-white/60 text-gray-400 hover:text-gray-600 font-semibold text-sm rounded-col py-4 transition-colors border-2 border-dashed border-gray-200 hover:border-gray-300"
              >
                + Add Column
              </button>
            )}
          </div>
        </div>

        <DragOverlay>
          {activeCard ? (
            <div
              className={`${getColorClasses(activeCard.color).bg} ${getColorClasses(activeCard.color).border} border-l-4 rounded-card p-3 shadow-lg w-[260px] rotate-2`}
            >
              <p className="text-sm font-semibold text-gray-800">{activeCard.title}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
