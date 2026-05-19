"use client"

export default function SignUpSuccess() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center p-8 rounded-lg border shadow-sm max-w-md">
        <h1 className="text-2xl font-bold mb-2">Cuenta creada!</h1>
        <p className="text-gray-500 mb-6">
          Tu cuenta ha sido creada exitosamente.
        </p>
        <a href="/auth/login" className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800">
          Iniciar sesion
        </a>
      </div>
    </div>
  )
}