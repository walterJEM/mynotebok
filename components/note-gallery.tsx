'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import NoteCard from './note-card'
import NoteDetail from './note-detail'
import CalendarSidebar from './calendar-sidebar'

type ViewMode = 'gallery' | 'list' | 'calendar'

interface NoteGalleryProps {
  notes: any[]
  viewMode: ViewMode
  loading: boolean
  selectedDate: Date | null
  onDateSelected: (date: Date | null) => void
}

export default function NoteGallery({
  notes,
  viewMode,
  loading,
  selectedDate,
  onDateSelected,
}: NoteGalleryProps) {
  const [selectedNote, setSelectedNote] = useState<any | null>(null)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 size={32} className="animate-spin text-gray-400" />
      </div>
    )
  }

  if (selectedNote) {
    return (
      <NoteDetail note={selectedNote} onClose={() => setSelectedNote(null)} />
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Calendar on top when in calendar mode */}
      {viewMode === 'calendar' && (
        <CalendarSidebar
          notes={notes}
          selectedDate={selectedDate}
          onDateSelected={onDateSelected}
        />
      )}

      {/* Gallery/List View */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-6xl mb-4">📓</div>
            <p className="text-xl font-semibold text-gray-700 mb-2">No notes yet</p>
            <p className="text-gray-500">
              {selectedDate
                ? 'No notes for this date. Try capturing one!'
                : 'Start by capturing your first handwritten note.'}
            </p>
          </div>
        ) : viewMode === 'gallery' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-max">
            {notes.map((note) => (
              <button key={note.id} onClick={() => setSelectedNote(note)} className="cursor-pointer text-left">
                <NoteCard note={note} onClick={() => setSelectedNote(note)} />
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => {
              const imageUrl = note.image_url.startsWith('/')
                ? note.image_url
                : `/api/file?pathname=${encodeURIComponent(note.image_url)}`
              return (
                <button key={note.id} onClick={() => setSelectedNote(note)} className="w-full text-left">
                  <div className="flex gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <img src={imageUrl} alt={note.title} className="w-20 h-20 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{note.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2">{note.description || 'No description'}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {note.tags?.map((tag: string) => (
                          <span key={tag} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(note.captured_at).toLocaleDateString()}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}