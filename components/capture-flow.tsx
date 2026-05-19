'use client'

import { useState, useRef } from 'react'
import { Camera, X, Upload } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface CaptureFlowProps {
  onNoteCaptured: (note: any) => void
}

export default function CaptureFlow({ onNoteCaptured }: CaptureFlowProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<'menu' | 'camera' | 'upload'>('menu')
  const [uploading, setUploading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

  const supabase = createClient()

  async function startCamera() {
    setStep('camera')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error('[v0] Camera error:', error)
      alert('Could not access camera. Please check permissions.')
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

    const imageData = canvasRef.current.toDataURL('image/jpeg', 0.8)
    setCapturedImage(imageData)
    stopCamera()
    setStep('upload')
  }

  async function uploadNote() {
    if (!capturedImage) return

    setUploading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      // Convert base64 to blob
      const response = await fetch(capturedImage)
      const blob = await response.blob()

      // Upload to Vercel Blob via API route
      const formData = new FormData()
      formData.append('file', blob, `note-${Date.now()}.jpg`)

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) throw new Error('Upload to blob failed')

      const { pathname } = await uploadRes.json()

      // Create note record in Supabase
      const { data: note, error: dbError } = await supabase
        .from('notes')
        .insert({
          user_id: user.id,
          title: new Date().toLocaleDateString(),
          description: '',
          image_url: pathname,
          image_path: pathname,
          captured_at: new Date().toISOString(),
          tags: [],
        })
        .select()
        .single()

      if (dbError) throw dbError

      onNoteCaptured(note)
      resetFlow()
    } catch (error) {
      console.error('[v0] Upload error:', error)
      alert('Failed to upload note. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async () => {
      const result = reader.result as string
      setCapturedImage(result)
      setStep('upload')
    }
    reader.readAsDataURL(file)
  }

  function resetFlow() {
    setCapturedImage(null)
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
        <span className="hidden sm:inline">Capture</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4 overflow-hidden">
            {/* Menu */}
            {step === 'menu' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Capture Note</h2>
                  <button
                    onClick={resetFlow}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={startCamera}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                  >
                    <Camera size={20} />
                    Take Photo
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    <Upload size={20} />
                    Upload Photo
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}

            {/* Camera */}
            {step === 'camera' && (
              <div className="p-6">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg bg-black"
                />
                <canvas ref={canvasRef} className="hidden" />
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => {
                      stopCamera()
                      setStep('menu')
                    }}
                    className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={capturePhoto}
                    className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                  >
                    Capture
                  </button>
                </div>
              </div>
            )}

            {/* Review & Upload */}
            {step === 'upload' && capturedImage && (
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Review & Upload</h3>
                <img
                  src={capturedImage}
                  alt="Captured note"
                  className="w-full rounded-lg mb-4"
                />
                <div className="flex gap-3">
                  <button
                    onClick={resetFlow}
                    disabled={uploading}
                    className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={uploadNote}
                    disabled={uploading}
                    className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
                  >
                    {uploading ? 'Uploading...' : 'Save Note'}
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
