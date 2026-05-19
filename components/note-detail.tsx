'use client'

import { useState } from 'react'
import { X, Trash2, Save, Edit2 } from 'lucide-react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { createClient } from '@/lib/supabase/client'

interface NoteDetailProps {
  note: {
    id: string
    title: string
    description?: string
    image_url: string
    captured_at: string
    tags: string[]
  }
  onClose: () => void
}

export default function NoteDetail({ note, onClose }: NoteDetailProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(note.title)
  const [description, setDescription] = useState(note.description || '')
  const [tags, setTags] = useState(note.tags.join(', '))
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Use the file serving API route for private blob images
  const imageUrl = note.image_url.startsWith('/')
    ? note.image_url
    : `/api/file?pathname=${encodeURIComponent(note.image_url)}`

  const supabase = createClient()

  async function handleSave() {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('notes')
        .update({
          title,
          description,
          tags: tags.split(',').map(t => t.trim()).filter(t => t),
          updated_at: new Date().toISOString(),
        })
        .eq('id', note.id)

      if (error) throw error
      setIsEditing(false)
    } catch (error) {
      console.error('[v0] Save error:', error)
      alert('Failed to save note')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this note?')) return

    setDeleting(true)
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', note.id)

      if (error) throw error
      onClose()
    } catch (error) {
      console.error('[v0] Delete error:', error)
      alert('Failed to delete note')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-lg font-semibold">View Note</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Image with Zoom */}
          <div className="mb-6">
            <Zoom>
              <img
                src={imageUrl}
                alt={note.title}
                className="w-full rounded-lg border border-gray-200"
              />
            </Zoom>
          </div>

          {/* Metadata */}
          <div className="space-y-4">
            {isEditing ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="e.g., math, important, homework"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {title}
                  </h3>
                </div>

                {description && (
                  <div>
                    <p className="text-gray-600">{description}</p>
                  </div>
                )}

                {tags && tags.length > 0 && (
                  <div>
                    <div className="flex flex-wrap gap-2">
                      {tags.split(',').map((tag) => {
                        const trimmedTag = tag.trim()
                        return trimmedTag ? (
                          <span
                            key={trimmedTag}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                          >
                            {trimmedTag}
                          </span>
                        ) : null
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="pt-2 text-sm text-gray-500">
              Captured: {new Date(note.captured_at).toLocaleString()}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={saving}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
                >
                  <Save size={18} />
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  <Edit2 size={18} />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors font-medium disabled:opacity-50"
                >
                  <Trash2 size={18} />
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
