'use client'

import { useState, useEffect } from 'react'
import { X, Trash2, Save, Edit2, Plus } from 'lucide-react'
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
  const [tags, setTags] = useState<string[]>(note.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [allTags, setAllTags] = useState<string[]>([])

  const supabase = createClient()

  const imageUrl = note.image_url.startsWith('/')
    ? note.image_url
    : `/api/file?pathname=${encodeURIComponent(note.image_url)}`

  useEffect(() => {
    async function fetchTags() {
      const { data } = await supabase.from('notes').select('tags')
      if (data) {
        const tagSet = new Set<string>()
        data.forEach(n => n.tags?.forEach((t: string) => tagSet.add(t)))
        setAllTags(Array.from(tagSet).sort())
      }
    }
    fetchTags()
  }, [])

  function addTag() {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t)) setTags([...tags, t])
    setTagInput('')
  }

  function removeTag(tag: string) {
    setTags(tags.filter(t => t !== tag))
  }

  async function handleSave() {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('notes')
        .update({ title, description, tags, updated_at: new Date().toISOString() })
        .eq('id', note.id)
      if (error) throw error
      setIsEditing(false)
    } catch (error) {
      alert('Error al guardar la nota')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('¿Seguro que quieres eliminar esta nota?')) return
    setDeleting(true)
    try {
      const { error } = await supabase.from('notes').delete().eq('id', note.id)
      if (error) throw error
      onClose()
    } catch (error) {
      alert('Error al eliminar la nota')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">
            {isEditing ? 'Editar nota' : 'Ver nota'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-auto p-5 space-y-4 flex-1">
          <Zoom>
            <img src={imageUrl} alt={note.title} className="w-full rounded-xl border border-gray-200" />
          </Zoom>

          {isEditing ? (
            <>
              {/* Título */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Título</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-gray-500"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Descripción</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="¿De qué trata esta nota?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-gray-500 resize-none"
                />
              </div>

              {/* Tags con autocompletado */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Tags</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTag()}
                    placeholder="Ej: matemáticas"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-gray-500"
                  />
                  <button onClick={addTag} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
                    <Plus size={18} />
                  </button>
                </div>

                {/* Sugerencias */}
                {tagInput && allTags.filter(t =>
                  t.includes(tagInput.toLowerCase()) && !tags.includes(t)
                ).length > 0 && (
                  <div className="border border-gray-200 rounded-lg mt-1 overflow-hidden shadow-sm">
                    {allTags
                      .filter(t => t.includes(tagInput.toLowerCase()) && !tags.includes(t))
                      .slice(0, 5)
                      .map(t => (
                        <button
                          key={t}
                          onClick={() => { setTags([...tags, t]); setTagInput('') }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0"
                        >
                          {t}
                        </button>
                      ))}
                  </div>
                )}

                {/* Tags recientes */}
                {!tagInput && allTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="text-xs text-gray-400">Recientes:</span>
                    {allTags.slice(0, 6).filter(t => !tags.includes(t)).map(t => (
                      <button
                        key={t}
                        onClick={() => setTags([...tags, t])}
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200"
                      >
                        + {t}
                      </button>
                    ))}
                  </div>
                )}

                {/* Tags seleccionados */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map(tag => (
                      <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-gray-900 text-white text-xs rounded-full">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="hover:text-gray-300">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              {description && <p className="text-gray-600 text-sm">{description}</p>}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">{tag}</span>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-400">
                Capturado: {new Date(note.captured_at).toLocaleString('es')}
              </p>
            </>
          )}
        </div>

        {/* Botones */}
        <div className="flex gap-3 px-5 py-4 border-t border-gray-200">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                disabled={saving}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-medium disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-xl font-medium disabled:opacity-50"
              >
                <Save size={18} />
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl font-medium"
              >
                <Edit2 size={18} />
                Editar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-red-600 border border-red-300 rounded-xl font-medium disabled:opacity-50"
              >
                <Trash2 size={18} />
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}