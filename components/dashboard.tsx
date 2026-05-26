'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import CaptureFlow from './capture-flow'
import NoteGallery from './note-gallery'
import Navigation from './navigation'

type ViewMode = 'gallery' | 'list' | 'calendar'
type SortOption = 'recent' | 'oldest' | 'title'

export default function Dashboard() {
  const [allNotes, setAllNotes] = useState<any[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('gallery')
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [user, setUser] = useState<any>(null)

  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  const supabase = createClient()

  useEffect(() => {
    loadAllNotes()
    
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallBanner(true)
    })
  }, [])

  async function handleInstall() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setShowInstallBanner(false)
    setDeferredPrompt(null)
  }

  async function loadAllNotes() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('captured_at', { ascending: false })
      if (error) throw error
      setAllNotes(data || [])
    } catch (error) {
      console.error('[v0] Error loading notes:', error)
    } finally {
      setLoading(false)
    }
  }

  async function addNote(note: any) {
    await loadAllNotes()
  }

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    allNotes.forEach(note => {
      note.tags?.forEach((tag: string) => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [allNotes])

  const filteredNotes = useMemo(() => {
    let result = allNotes

    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0]
      result = result.filter(note => {
        const noteDate = new Date(note.captured_at).toISOString().split('T')[0]
        return noteDate === dateStr
      })
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(note =>
        note.title?.toLowerCase().includes(query) ||
        note.description?.toLowerCase().includes(query)
      )
    }

    if (selectedTags.length > 0) {
      result = result.filter(note =>
        selectedTags.some(tag => note.tags?.includes(tag))
      )
    }

    switch (sortBy) {
      case 'oldest':
        result = [...result].sort((a, b) =>
          new Date(a.captured_at).getTime() - new Date(b.captured_at).getTime()
        )
        break
      case 'title':
        result = [...result].sort((a, b) => a.title?.localeCompare(b.title))
        break
      default:
        break
    }

    return result
  }, [allNotes, selectedDate, searchQuery, selectedTags, sortBy])

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 md:px-6">
        <h1 className="text-2xl font-semibold text-gray-900">MyNoteBook</h1>
        <CaptureFlow onNoteCaptured={addNote} />
      </header>

      {/* Banner de instalación */}
      {showInstallBanner && (
        <div className="flex items-center justify-between px-4 py-3 bg-blue-900 text-white">
          <div className="flex items-center gap-3">
            <img src="/icon-192.png" className="w-8 h-8 rounded-lg" />
            <div>
              <p className="text-sm font-medium">Instala MyNoteBook</p>
              <p className="text-xs text-blue-200">Accede mas rapido desde tu celular</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowInstallBanner(false)} className="text-xs text-blue-300 hover:text-white px-2 py-1">
              Ahora no
            </button>
            <button onClick={handleInstall} className="text-xs bg-white text-blue-900 font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-50">
              Instalar
            </button>
          </div>
        </div>
      )}

      {viewMode !== 'calendar' && (
        <div className="px-4 py-3 border-b border-gray-200 md:px-6 space-y-3">
          <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Buscar notas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            )}
          </div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    if (selectedTags.includes(tag)) {
                      setSelectedTags(selectedTags.filter(t => t !== tag))
                    } else {
                      setSelectedTags([...selectedTags, tag])
                    }
                  }}
                  className={`text-sm px-3 py-1 rounded-full transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="text-sm px-2 py-1 border border-gray-300 rounded bg-white"
            >
              <option value="recent">Reciente</option>
              <option value="oldest">Antiguo</option>
              <option value="title">Titulo A-Z</option>
            </select>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-auto">
        <NoteGallery
          notes={filteredNotes}
          allNotes={allNotes}
          viewMode={viewMode}
          loading={loading}
          selectedDate={selectedDate}
          onDateSelected={setSelectedDate}
        />
      </main>

      <Navigation
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        user={user}
      />
    </div>
  )
}