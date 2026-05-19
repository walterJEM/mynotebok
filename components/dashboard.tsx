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
  const [notes, setNotes] = useState<any[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('gallery')
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [user, setUser] = useState<any>(null)

  const supabase = createClient()

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
    loadNotes()
  }, [selectedDate])

  async function loadNotes() {
    setLoading(true)
    try {
      let query = supabase
        .from('notes')
        .select('*')
        .order('captured_at', { ascending: false })

      // Filter by date if selected
      if (selectedDate) {
        const startOfDay = new Date(selectedDate)
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = new Date(selectedDate)
        endOfDay.setHours(23, 59, 59, 999)

        query = query
          .gte('captured_at', startOfDay.toISOString())
          .lt('captured_at', endOfDay.toISOString())
      }

      const { data, error } = await query

      if (error) throw error
      setNotes(data || [])
    } catch (error) {
      console.error('[v0] Error loading notes:', error)
    } finally {
      setLoading(false)
    }
  }

  async function addNote(note: any) {
    setNotes([note, ...notes])
    await loadNotes()
  }

  // Get all unique tags from notes
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    notes.forEach(note => {
      note.tags?.forEach((tag: string) => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [notes])

  // Filter and sort notes
  const filteredNotes = useMemo(() => {
    let result = notes

    // Search in title and description
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        note =>
          note.title?.toLowerCase().includes(query) ||
          note.description?.toLowerCase().includes(query)
      )
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      result = result.filter(note =>
        selectedTags.some(tag => note.tags?.includes(tag))
      )
    }

    // Sort
    switch (sortBy) {
      case 'oldest':
        result = [...result].reverse()
        break
      case 'title':
        result = [...result].sort((a, b) =>
          a.title.localeCompare(b.title)
        )
        break
      case 'recent':
      default:
        // Already sorted by captured_at DESC
        break
    }

    return result
  }, [notes, searchQuery, selectedTags, sortBy])

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 md:px-6">
        <h1 className="text-2xl font-semibold text-gray-900">MyNoteBook</h1>
        <CaptureFlow onNoteCaptured={addNote} />
      </header>

      {/* Search & Filters */}
      <div className="px-4 py-3 border-b border-gray-200 md:px-6 space-y-3">
        {/* Search Bar */}
        <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Tag Filters */}
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

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-sm px-2 py-1 border border-gray-300 rounded bg-white"
          >
            <option value="recent">Recent</option>
            <option value="oldest">Oldest</option>
            <option value="title">Title A-Z</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <NoteGallery
          notes={filteredNotes}
          viewMode={viewMode}
          loading={loading}
          selectedDate={selectedDate}
          onDateSelected={setSelectedDate}
        />
      </main>

      {/* Bottom Navigation */}
      <Navigation
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        user={user}
      />
    </div>
  )
}
