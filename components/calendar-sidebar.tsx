'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface CalendarSidebarProps {
  notes: any[]
  selectedDate: Date | null
  onDateSelected: (date: Date | null) => void
}

export default function CalendarSidebar({
  notes,
  selectedDate,
  onDateSelected,
}: CalendarSidebarProps) {
  const noteDates = notes.reduce((acc, note) => {
    const date = new Date(note.captured_at)
    date.setHours(0, 0, 0, 0)
    const dateStr = date.toISOString().split('T')[0]
    if (!acc.includes(dateStr)) acc.push(dateStr)
    return acc
  }, [] as string[])

  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })

  const days = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(d)

  function handleDayClick(day: number) {
    const clicked = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const dateStr = clicked.toISOString().split('T')[0]
    if (!noteDates.includes(dateStr)) return
    if (selectedDate?.toDateString() === clicked.toDateString()) {
      onDateSelected(null)
    } else {
      onDateSelected(clicked)
    }
  }

  return (
    <div className="border-b border-gray-200 bg-gray-50 px-3 py-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="p-1 hover:bg-gray-200 rounded">‹</button>
          <span className="text-xs font-semibold text-gray-800">{monthName}</span>
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="p-1 hover:bg-gray-200 rounded">›</button>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span><b className="text-gray-800">{notes.length}</b> notas</span>
          {selectedDate && (
            <button onClick={() => onDateSelected(null)} className="flex items-center gap-1 text-red-400 hover:text-red-600">
              <X size={10} /> limpiar
            </button>
          )}
        </div>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 mb-1">
        {['Do','Lu','Ma','Mi','Ju','Vi','Sa'].map(d => (
          <div key={d} className="text-center text-gray-400" style={{fontSize:'10px'}}>{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {days.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />
          const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const hasNote = noteDates.includes(dateStr)
          const isSelected = selectedDate && new Date(selectedDate).toISOString().split('T')[0] === dateStr
          const isToday = today.toISOString().split('T')[0] === dateStr
          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              disabled={!hasNote}
              className={`mx-auto flex items-center justify-center rounded-full transition-colors
                ${isSelected ? 'bg-gray-900 text-white' : ''}
                ${hasNote && !isSelected ? 'bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200' : ''}
                ${!hasNote ? 'text-gray-300 cursor-default' : ''}
                ${isToday && !isSelected ? 'ring-1 ring-blue-400' : ''}
              `}
              style={{width:'28px', height:'28px', fontSize:'11px'}}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}