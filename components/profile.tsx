'use client'

import { useState } from 'react'
import { LogOut, Settings } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface ProfileProps {
  user: any
  onClose: () => void
}

export default function Profile({ user, onClose }: ProfileProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

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
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Settings size={20} />
              Profile
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="text-gray-900 font-medium">{user?.email}</p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors font-medium disabled:opacity-50"
              >
                <LogOut size={18} />
                {isLoading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
