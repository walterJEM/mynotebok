'use client'

import { useState, useEffect } from 'react'
import { X, Camera, Tag, Calendar, BookOpen } from 'lucide-react'

export default function Tutorial() {
  const [show, setShow] = useState(false)
  const [step, setStep] = useState(1)
  const total = 4

  useEffect(() => {
    const seen = localStorage.getItem('tutorial_seen')
    if (!seen) setShow(true)
  }, [])

  function next() {
    if (step < total) {
      setStep(step + 1)
    } else {
      finish()
    }
  }

  function finish() {
    localStorage.setItem('tutorial_seen', 'true')
    setShow(false)
  }

  if (!show) return null

  const steps = [
    {
      icon: <BookOpen size={32} className="text-blue-800" />,
      bg: 'bg-blue-50',
      title: 'Bienvenido a MyNoteBook',
      description: 'Tu cuaderno digital para organizar y guardar todos tus apuntes escritos a mano.',
      extra: null,
    },
    {
      icon: <Camera size={32} className="text-blue-800" />,
      bg: 'bg-blue-50',
      title: 'Toma una foto',
      description: 'Toca el botón de cámara para fotografiar tu cuaderno. Se guarda automáticamente con la fecha de hoy.',
      extra: null,
    },
    {
      icon: <Tag size={32} className="text-green-800" />,
      bg: 'bg-green-50',
      title: '¿Qué es un tag?',
      description: 'Un tag es una etiqueta que le pones a tu nota. Así puedes filtrar y encontrar tus notas fácilmente.',
      extra: (
        <div className="flex gap-2 justify-center mt-3 flex-wrap">
          <span className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded-full">matematicas</span>
          <span className="text-xs px-3 py-1 bg-green-100 text-green-800 rounded-full">trabajo</span>
          <span className="text-xs px-3 py-1 bg-amber-100 text-amber-800 rounded-full">ideas</span>
        </div>
      ),
    },
    {
      icon: <Calendar size={32} className="text-purple-800" />,
      bg: 'bg-purple-50',
      title: 'Calendario',
      description: 'Usa el calendario para ver tus notas organizadas por día. Toca cualquier día resaltado para ver qué anotaste.',
      extra: null,
    },
  ]

  const current = steps[step - 1]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
        
        {/* Skip button */}
        <div className="flex justify-end px-4 pt-4">
          <button onClick={finish} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-2 text-center">
          <div className={`w-16 h-16 ${current.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
            {current.icon}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{current.title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{current.description}</p>
          {current.extra}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 py-4">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${i + 1 === step ? 'bg-blue-900' : 'bg-gray-200'}`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 px-6 pb-6">
          {step < total && (
            <button
              onClick={finish}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-600 font-medium"
            >
              Saltar
            </button>
          )}
          <button
            onClick={next}
            className="flex-2 flex-1 px-4 py-3 bg-blue-900 text-white rounded-xl text-sm font-medium"
          >
            {step === total ? 'Empezar' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  )
}