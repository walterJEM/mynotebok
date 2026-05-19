'use client'

import { Grid2x2, List, Calendar, Settings } from 'lucide-react'
import { useState } from 'react'
import Profile from './profile'

type ViewMode = 'gallery' | 'list' | 'calendar'

interface NavigationProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  user?: any
}

export default function Navigation({ viewMode, onViewModeChange, user }: NavigationProps) {
  const [showProfile, setShowProfile] = useState(false)

  return (
    <>
      <nav className="flex items-center justify-between px-4 py-3 border-t border-gray-200 md:px-6 bg-white">
        <div className="flex gap-2">
          <button
            onClick={() => onViewModeChange('gallery')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              viewMode === 'gallery'
                ? 'bg-gray-900 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            title="Gallery view"
          >
            <Grid2x2 size={20} />
            <span className="hidden sm:inline text-sm font-medium">Gallery</span>
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-gray-900 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            title="List view"
          >
            <List size={20} />
            <span className="hidden sm:inline text-sm font-medium">List</span>
          </button>
          <button
            onClick={() => onViewModeChange('calendar')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              viewMode === 'calendar'
                ? 'bg-gray-900 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            title="Calendar view"
          >
            <Calendar size={20} />
            <span className="hidden sm:inline text-sm font-medium">Calendar</span>
          </button>
        </div>

        <button
          onClick={() => setShowProfile(true)}
          className="flex items-center gap-2 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          title="Profile"
        >
          <Settings size={20} />
          <span className="hidden sm:inline text-sm font-medium">Profile</span>
        </button>
      </nav>

      {showProfile && user && (
        <Profile user={user} onClose={() => setShowProfile(false)} />
      )}
    </>
  )
}
