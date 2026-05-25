'use client'
import { useState, useEffect } from 'react'
import { LogOut, Settings, Download } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface ProfileProps {
  user: any
  onClose: () => void
}

export default function Profile({ user, onClose }: ProfileProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    })
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }
  }, [])

  async function handleInstall() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setIsInstalled(true)
    setDeferredPrompt(null)
  }

  async function handleLogout() {
    setIsLoading(true)
    try {
      await supabase.auth.signOut()
      router.push('/auth/login')
    } catch (error) {
      console.error('[v0] Logout error:', error)
      alert('Failed to logout')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Settings size={20} />
              Perfil
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Email</p>
              <p className="text-gray-900 font-medium">{user?.email}</p>
            </div>

            {/* Botón instalar app */}
            {!isInstalled && (
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <img src="/icon-192.png" className="w-10 h-10 rounded-xl" />
                  <div>
                    <p className="font-medium text-blue-900 text-sm">Instalar MyNoteBook</p>
                    <p className="text-xs text-blue-600">Accede más rápido desde tu celular</p>
                  </div>
                </div>
                {deferredPrompt ? (
                  <button
                    onClick={handleInstall}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800"
                  >
                    <Download size={16} />
                    Instalar app
                  </button>
                ) : (
                  <div className="text-xs text-blue-600 text-center py-2">
                    En Chrome: menú ⋮ → "Añadir a pantalla de inicio"
                  </div>
                )}
              </div>
            )}

            {isInstalled && (
              <div className="p-3 bg-green-50 rounded-xl border border-green-100 text-center">
                <p className="text-sm text-green-700 font-medium">✅ App instalada</p>
              </div>
            )}

            <div className="pt-2 border-t border-gray-200">
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 border border-red-300 rounded-xl hover:bg-red-50 transition-colors font-medium disabled:opacity-50"
              >
                <LogOut size={18} />
                {isLoading ? 'Cerrando sesión...' : 'Cerrar sesión'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}