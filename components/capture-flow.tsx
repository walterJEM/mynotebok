'use client'

import { useState, useRef } from 'react'
import { Camera, X, Upload, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface CaptureFlowProps {
  onNoteCaptured: (note: any) => void
}

export default function CaptureFlow({ onNoteCaptured }: CaptureFlowProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<'menu' | 'camera' | 'review'>('menu')
  const [uploading, setUploading] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supabase = createClient()

  async function startCamera() {
    setStep('camera')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 4096 },
          height: { ideal: 4096 },
          aspectRatio: { ideal: 1.7778 },
        },    
      })
      if (videoRef.current) videoRef.current.srcObject = stream
    } catch (error) {
      alert('No se pudo acceder a la cámara.')
      setStep('menu')
    }
  }

  function stopCamera() {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
    }
  }

  async function capturePhoto() {
    if (!videoRef.current || !canvasRef.current) return
    const context = canvasRef.current.getContext('2d')
    if (!context) return
    canvasRef.current.width = videoRef.current.videoWidth
    canvasRef.current.height = videoRef.current.videoHeight
    context.drawImage(videoRef.current, 0, 0)
    const imageData = canvasRef.current.toDataURL('image/jpeg', 1.0)
    setCapturedImage(imageData)
    stopCamera()
    setTitle(new Date().toLocaleDateString('es'))
    setStep('review')
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setCapturedImage(reader.result as string)
      setTitle(new Date().toLocaleDateString('es'))
      setStep('review')
    }
    reader.readAsDataURL(file)
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t)) setTags([...tags, t])
    setTagInput('')
  }

  function removeTag(tag: string) {
    setTags(tags.filter(t => t !== tag))
  }

  async function uploadNote() {
    if (!capturedImage) return
    setUploading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const response = await fetch(capturedImage)
      const blob = await response.blob()
      const formData = new FormData()
      formData.append('file', blob, `note-${Date.now()}.jpg`)

      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!uploadRes.ok) throw new Error('Upload failed')
      const { pathname } = await uploadRes.json()

      const { data: note, error: dbError } = await supabase
        .from('notes')
        .insert({
          user_id: user.id,
          title: title || new Date().toLocaleDateString('es'),
          description,
          image_url: pathname,
          image_path: pathname,
          captured_at: new Date().toISOString(),
          tags,
        })
        .select()
        .single()

      if (dbError) throw dbError
      onNoteCaptured(note)
      resetFlow()
    } catch (error) {
      console.error('[v0] Upload error:', error)
      alert('Error al guardar. Intenta de nuevo.')
    } finally {
      setUploading(false)
    }
  }

  function resetFlow() {
    setCapturedImage(null)
    setTitle('')
    setDescription('')
    setTags([])
    setTagInput('')
    setStep('menu')
    setIsOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
      >
        <Camera size={20} />
        <span className="hidden sm:inline">Capturar</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">

            {/* MENU */}
            {step === 'menu' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Nueva nota</h2>
                  <button onClick={resetFlow} className="text-gray-500 hover:text-gray-700">
                    <X size={24} />
                  </button>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={startCamera}
                    className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
                  >
                    <Camera size={22} />
                    Tomar foto
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-3 px-4 py-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    <Upload size={22} />
                    Subir foto
                  </button>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </div>
            )}

            {/* CAMERA */}
            {step === 'camera' && (
              <div className="p-4">
                <video ref={videoRef} autoPlay playsInline className="w-full rounded-xl bg-black" />
                <canvas ref={canvasRef} className="hidden" />
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => { stopCamera(); setStep('menu') }}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={capturePhoto}
                    className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 font-medium"
                  >
                    Capturar
                  </button>
                </div>
              </div>
            )}

            {/* REVIEW + FORM */}
            {step === 'review' && capturedImage && (
              <div className="flex flex-col max-h-[85vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold">Guardar nota</h2>
                  <button onClick={resetFlow} className="text-gray-500 hover:text-gray-700">
                    <X size={22} />
                  </button>
                </div>

                <div className="overflow-auto p-5 space-y-4">
                  {/* Imagen preview */}
                  <img src={capturedImage} alt="Preview" className="w-full rounded-xl object-cover max-h-48" />

                  {/* Título */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Título</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ej: Apuntes de matemáticas"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-gray-500"
                    />
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Descripción</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="¿De qué trata esta nota?"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-gray-500 resize-none"
                    />
                  </div>

                  {/* Tags */}
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
                      <button
                        onClick={addTag}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
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
                </div>

                {/* Botones */}
                <div className="flex gap-3 px-5 py-4 border-t border-gray-200">
                  <button
                    onClick={resetFlow}
                    disabled={uploading}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-medium disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={uploadNote}
                    disabled={uploading}
                    className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-xl font-medium disabled:opacity-50"
                  >
                    {uploading ? 'Guardando...' : 'Guardar nota'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}