import Link from 'next/link'
import { Camera, Calendar, Tag, Search, BookOpen, Star } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
        <div className="flex items-center gap-2">
          <img src="/icon-192.png" className="w-8 h-8 rounded-lg" />
          <span className="font-semibold text-gray-900">MyNoteBook</span>
        </div>
        <div className="flex gap-3">
          <Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2">
            Iniciar sesión
          </Link>
          <Link href="/auth/sign-up" className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800">
            Empieza gratis
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-16 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <Star size={12} />
          La alternativa peruana a Rocketbook
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
          Tu cuaderno digital inteligente
        </h1>
        <p className="text-lg text-gray-500 mb-8 leading-relaxed">
          Fotografía tus apuntes escritos a mano y organízalos por fecha, tags y materias. Todo desde tu celular.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/auth/sign-up" className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors">
            Empieza gratis
          </Link>
          <Link href="/auth/login" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
            Ya tengo cuenta
          </Link>
        </div>
        <p className="text-xs text-gray-400 mt-4">Sin tarjeta de crédito • Gratis para siempre</p>
      </section>

      {/* Cómo funciona */}
      <section className="px-6 py-12 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Así de fácil</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: <BookOpen size={24} />, step: '1', title: 'Escribe', desc: 'Usa tu cuaderno borrable como siempre' },
              { icon: <Camera size={24} />, step: '2', title: 'Fotografía', desc: 'Toca el botón de cámara en la app' },
              { icon: <Calendar size={24} />, step: '3', title: 'Organiza', desc: 'Tus notas guardadas por fecha automáticamente' },
            ].map((item) => (
              <div key={item.step} className="text-center p-6 bg-white rounded-2xl border border-gray-200">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3 text-blue-800">
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-blue-600 mb-1">PASO {item.step}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="px-6 py-12 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Todo lo que necesitas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: <Calendar size={20} />, title: 'Calendario visual', desc: 'Ve tus notas organizadas por día con miniaturas' },
            { icon: <Tag size={20} />, title: 'Tags y etiquetas', desc: 'Clasifica por materia, trabajo o lo que quieras' },
            { icon: <Search size={20} />, title: 'Búsqueda rápida', desc: 'Encuentra cualquier nota en segundos' },
            { icon: <Camera size={20} />, title: 'Cámara de alta calidad', desc: 'Fotos nítidas para leer tus apuntes fácilmente' },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 p-4 border border-gray-200 rounded-xl">
              <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 text-gray-700">
                {item.icon}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Precios */}
      <section className="px-6 py-12 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Precios simples</h2>
          <p className="text-gray-500 text-center mb-10 text-sm">Empieza gratis, paga cuando quieras más</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Plan gratis */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 text-lg mb-1">Gratis</h3>
              <div className="text-3xl font-bold text-gray-900 mb-4">$0</div>
              <ul className="space-y-2 mb-6">
                {['Hasta 30 fotos', 'Galería y lista', 'Búsqueda básica', 'Acceso desde celular'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-green-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/sign-up" className="block text-center border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">
                Empezar gratis
              </Link>
            </div>

            {/* Plan Pro */}
            <div className="bg-gray-900 border border-gray-900 rounded-2xl p-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                Popular
              </div>
              <h3 className="font-bold text-white text-lg mb-1">Pro</h3>
              <div className="text-3xl font-bold text-white mb-1">$2.99<span className="text-lg font-normal text-gray-400">/mes</span></div>
              <p className="text-xs text-gray-400 mb-4">o $19.99/año — ahorra 44%</p>
              <ul className="space-y-2 mb-6">
                {['Fotos ilimitadas', 'Calendario visual', 'Tags y etiquetas', 'Búsqueda avanzada', 'Exportar a PDF'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="text-green-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/sign-up" className="block text-center bg-white text-gray-900 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-100">
                Empezar Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="px-6 py-16 text-center max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">¿Listo para organizar tus apuntes?</h2>
        <p className="text-gray-500 mb-6 text-sm">Únete a los estudiantes y profesionales que ya usan MyNoteBook</p>
        <Link href="/auth/sign-up" className="inline-block bg-gray-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors">
          Empieza gratis ahora
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img src="/icon-192.png" className="w-6 h-6 rounded-md" />
          <span className="font-medium text-gray-900 text-sm">MyNoteBook</span>
        </div>
        <p className="text-xs text-gray-400">Hecho con ❤️ en Lima, Perú</p>
      </footer>

    </div>
  )
}