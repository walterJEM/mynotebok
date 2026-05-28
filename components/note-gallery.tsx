'use client'

import { useState } from 'react'
import { Loader2, X } from 'lucide-react'
import NoteCard from './note-card'
import NoteDetail from './note-detail'
import CalendarSidebar from './calendar-sidebar'

type ViewMode = 'gallery' | 'list' | 'calendar'

interface NoteGalleryProps {
  notes: any[]
  allNotes: any[]
  viewMode: ViewMode
  loading: boolean
  selectedDate: Date | null
  onDateSelected: (date: Date | null) => void
  onNoteDeleted?: () => void
}

export default function NoteGallery({
  notes,
  allNotes,
  viewMode,
  loading,
  selectedDate,
  onDateSelected,
  onNoteDeleted,
}: NoteGalleryProps) {
  const [selectedNote, setSelectedNote] = useState<any | null>(null)
  const [popupNotes, setPopupNotes] = useState<any[] | null>(null)
  const [popupDate, setPopupDate] = useState<string>('')

  function getImageUrl(note: any) {
    return note.image_url.startsWith('/')
      ? note.image_url
      : `/api/file?pathname=${encodeURIComponent(note.image_url)}`
  }

  function handleDateSelected(date: Date | null) {
    onDateSelected(date)
    if (date) {
      const dateStr = date.toISOString().split('T')[0]
      const dayNotes = allNotes.filter(note =>
        new Date(note.captured_at).toISOString().split('T')[0] === dateStr
      )
      if (dayNotes.length > 0) {
        setPopupNotes(dayNotes)
        setPopupDate(date.toLocaleDateString('es', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
      }
    } else {
      setPopupNotes(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 size={32} className="animate-spin text-gray-400" />
      </div>
    )
  }

  if (selectedNote) {
    return <NoteDetail 
      note={selectedNote} 
      onClose={() => setSelectedNote(null)}
      onNoteDeleted={() => {
        setSelectedNote(null)
        onNoteDeleted?.()
      }}
      onNoteUpdated={() => {
        setSelectedNote(null)
        onNoteDeleted?.()
      }}
    />
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Popup de notas del día */}
      {popupNotes && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <div>
                <h2 className="font-semibold text-gray-900 capitalize">{popupDate}</h2>
                <p className="text-xs text-gray-500">{popupNotes.length} nota{popupNotes.length > 1 ? 's' : ''}</p>
              </div>
              <button
                onClick={() => { setPopupNotes(null); onDateSelected(null) }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="overflow-auto p-4 space-y-3">
              {popupNotes.map(note => (
                <button
                  key={note.id}
                  onClick={() => { setPopupNotes(null); setSelectedNote(note) }}
                  className="w-full text-left flex gap-3 p-3 border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <img
                    src={getImageUrl(note)}
                    alt={note.title}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{note.title}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{note.description || 'Sin descripción'}</p>
                    {note.tags?.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {note.tags.map((tag: string) => (
                          <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <CalendarSidebar
          notes={allNotes}
          selectedDate={selectedDate}
          onDateSelected={handleDateSelected}
        />
      )}

      {/* Gallery/List */}
      {viewMode !== 'calendar' && (
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-4">📓</div>
              <p className="text-xl font-semibold text-gray-700 mb-2">Sin notas</p>
              <p className="text-gray-500">Captura tu primera nota con el botón de cámara.</p>
            </div>
          ) : viewMode === 'gallery' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {notes.map(note => (
                <button key={note.id} onClick={() => setSelectedNote(note)} className="cursor-pointer text-left">
                  <NoteCard note={note} onClick={() => setSelectedNote(note)} />
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map(note => (
                <button key={note.id} onClick={() => setSelectedNote(note)} className="w-full text-left">
                  <div className="flex gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <img src={getImageUrl(note)} alt={note.title} className="w-20 h-20 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{note.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2">{note.description || 'Sin descripción'}</p>
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
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}