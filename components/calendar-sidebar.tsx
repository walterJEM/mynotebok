'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  )

  // Agrupar notas por fecha
  const notesByDate = notes.reduce((acc, note) => {
    const dateStr = new Date(note.captured_at).toISOString().split('T')[0]
    if (!acc[dateStr]) acc[dateStr] = []
    acc[dateStr].push(note)
    return acc
  }, {} as Record<string, any[]>)

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()
  const monthName = currentMonth.toLocaleString('es', { month: 'long', year: 'numeric' })

  const days = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(d)

  function getDateStr(day: number) {
    return `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  function handleDayClick(day: number) {
    const dateStr = getDateStr(day)
    if (!notesByDate[dateStr]) return
    const clicked = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    if (selectedDate?.toDateString() === clicked.toDateString()) {
      onDateSelected(null)
    } else {
      onDateSelected(clicked)
    }
  }

  function getImageUrl(note: any) {
    return note.image_url.startsWith('/')
      ? note.image_url
      : `/api/file?pathname=${encodeURIComponent(note.image_url)}`
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header del mes */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-base font-semibold capitalize text-gray-900">{monthName}</h2>
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map(d => (
          <div key={d} className="text-center text-xs font-medium text-gray-500 py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Grid de días */}
      <div className="grid grid-cols-7 flex-1 border-l border-t border-gray-200">
        {days.map((day, i) => {
          if (!day) return (
            <div key={`empty-${i}`} className="border-r border-b border-gray-200 bg-gray-50" />
          )

          const dateStr = getDateStr(day)
          const dayNotes = notesByDate[dateStr] || []
          const hasNotes = dayNotes.length > 0
          const isToday = today.toISOString().split('T')[0] === dateStr
          const isSelected = selectedDate && new Date(selectedDate).toISOString().split('T')[0] === dateStr

          return (
            <div
              key={day}
              onClick={() => handleDayClick(day)}
              className={`border-r border-b border-gray-200 min-h-[80px] p-1 relative transition-colors
                ${hasNotes ? 'cursor-pointer hover:bg-blue-50' : 'bg-white'}
                ${isSelected ? 'bg-blue-50 ring-2 ring-inset ring-blue-400' : ''}
              `}
            >
              {/* Número del día */}
              <div className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1
                ${isToday ? 'bg-gray-900 text-white' : 'text-gray-700'}
              `}>
                {day}
              </div>

              {/* Miniaturas de notas */}
              {hasNotes && (
                <div className="flex flex-wrap gap-0.5">
                  {dayNotes.slice(0, 2).map((note: any) => (
                    <img
                      key={note.id}
                      src={getImageUrl(note)}
                      alt=""
                      className="w-full object-cover rounded"
                      style={{ height: '48px' }}
                    />
                  ))}
                  {dayNotes.length > 2 && (
                    <div className="text-xs text-blue-600 font-medium mt-0.5">
                      +{dayNotes.length - 2} más
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer con stats */}
      <div className="px-4 py-2 border-t border-gray-200 flex gap-4 text-xs text-gray-500">
        <span><b className="text-gray-900">{Object.keys(notesByDate).length}</b> días con notas</span>
        <span><b className="text-gray-900">{notes.length}</b> notas totales</span>
        {selectedDate && (
          <button onClick={() => onDateSelected(null)} className="ml-auto text-blue-500 hover:text-blue-700">
            Limpiar filtro
          </button>
        )}
      </div>
    </div>
  )
}