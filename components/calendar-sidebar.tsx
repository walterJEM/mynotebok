'use client'

import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
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
    const dateStr = date.toISOString()
    if (!acc.includes(dateStr)) acc.push(dateStr)
    return acc
  }, [] as string[])

  return (
    <div className="w-56 border-r border-gray-200 p-3 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-900 text-sm">Filter by Date</h3>
        {selectedDate && (
          <button onClick={() => onDateSelected(null)} className="text-gray-500 hover:text-gray-700">
            <X size={14} />
          </button>
        )}
      </div>

      <DayPicker
        mode="single"
        selected={selectedDate || undefined}
        onSelect={(date) => onDateSelected(date || null)}
        disabled={(date) => {
          const dateStr = new Date(date).toISOString().split('T')[0]
          return !noteDates.some(d => d.startsWith(dateStr))
        }}
        styles={{
          root: { margin: 0, fontSize: '0.75rem' },
          caption: { marginBottom: '4px' },
          head_cell: { width: '28px', fontSize: '0.65rem' },
          cell: { width: '28px', height: '28px' },
          day: { width: '26px', height: '26px', fontSize: '0.7rem' },
          nav_button: { width: '20px', height: '20px' },
        }}
        modifiersClassNames={{
          selected: 'bg-gray-900 text-white rounded-full',
          today: 'font-bold text-blue-600',
        }}
      />

      <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600 space-y-1">
        <p><span className="font-semibold text-gray-900">{noteDates.length}</span> dates with notes</p>
        <p><span className="font-semibold text-gray-900">{notes.length}</span> total notes</p>
      </div>
    </div>
  )
}