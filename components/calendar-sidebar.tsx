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
  // Get unique dates that have notes
  const noteDates = notes.reduce((acc, note) => {
    const date = new Date(note.captured_at)
    date.setHours(0, 0, 0, 0)
    const dateStr = date.toISOString()
    if (!acc.includes(dateStr)) {
      acc.push(dateStr)
    }
    return acc
  }, [] as string[])

  const disabledDates = {
    disabled: (date: Date) => {
      const dateStr = new Date(date).toISOString().split('T')[0]
      return !noteDates.some(d => d.startsWith(dateStr))
    }
  }

  return (
    <div className="w-64 border-r border-gray-200 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Filter by Date</h3>
        {selectedDate && (
          <button
            onClick={() => onDateSelected(null)}
            className="text-xs text-gray-500 hover:text-gray-700"
            title="Clear filter"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-auto">
        <DayPicker
          mode="single"
          selected={selectedDate || undefined}
          onSelect={(date) => onDateSelected(date || null)}
          disabled={disabledDates.disabled}
          modifiersClassNames={{
            selected: 'bg-gray-900 text-white',
            today: 'font-bold',
          }}
          classNames={{
            months: 'w-full',
            month: 'w-full',
            caption: 'text-sm font-semibold text-gray-900 mb-2',
            head_row: 'grid grid-cols-7 gap-1 mb-2',
            head_cell: 'text-xs font-medium text-gray-600 text-center',
            body: 'grid grid-cols-7 gap-1',
            row: 'contents',
            cell: 'w-full',
            day: 'w-full h-8 text-xs rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center',
            day_selected: 'bg-gray-900 text-white hover:bg-gray-800',
          }}
        />
      </div>

      {/* Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-600">
        <div className="space-y-2">
          <p>
            <span className="font-medium text-gray-900">{noteDates.length}</span>{' '}
            dates with notes
          </p>
          <p>
            <span className="font-medium text-gray-900">{notes.length}</span>{' '}
            total notes
          </p>
        </div>
      </div>
    </div>
  )
}
