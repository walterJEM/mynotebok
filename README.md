# 📓 MyNoteBook

App web para organizar y guardar fotos de tu cuaderno digital reutilizable (como los de Temu o Rocketbook).

![MyNoteBook](https://img.shields.io/badge/Next.js-14-black) ![Supabase](https://img.shields.io/badge/Supabase-Database-green) ![Vercel](https://img.shields.io/badge/Vercel-Deploy-black)

## ✨ Características

- 📸 **Captura de fotos** — toma foto a tu cuaderno directamente desde la app
- 📅 **Organización por fechas** — navega tus notas por día, semana o mes
- 🏷️ **Tags** — organiza tus notas con etiquetas personalizadas
- 🔍 **Búsqueda** — busca por título, tag o fecha
- 👤 **Cuentas de usuario** — cada usuario ve solo sus propias notas
- 📱 **Mobile-first** — diseñado para usar desde el celular

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript
- **Estilos:** Tailwind CSS + shadcn/ui
- **Base de datos:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage
- **Auth:** Supabase Auth
- **Deploy:** Vercel

## 🚀 Instalación local

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/mynotebok.git
cd mynotebok
```

### 2. Instala dependencias

```bash
npm install
```

### 3. Configura variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

### 4. Configura la base de datos

Ve a Supabase → SQL Editor y ejecuta el script en `database/schema.sql`

### 5. Corre el proyecto

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 🗄️ Base de datos

```sql
notes (
  id           UUID PRIMARY KEY,
  user_id      UUID REFERENCES auth.users,
  title        TEXT,
  description  TEXT,
  image_url    TEXT,
  image_path   TEXT,
  tags         TEXT[],
  captured_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ,
  updated_at   TIMESTAMPTZ
)
```

## 🌐 Deploy en Vercel

1. Sube el código a GitHub
2. Ve a [vercel.com](https://vercel.com) → Import Project
3. Selecciona el repositorio
4. Agrega las variables de entorno
5. Click en Deploy

## 📱 Cómo usar

1. Crea tu cuenta en la app
2. Escribe en tu cuaderno digital
3. Abre la app y toca el botón de cámara
4. Toma la foto de la página
5. Agrega título y tags opcionales
6. La nota se guarda automáticamente con la fecha de hoy

## 📄 Licencia

MIT
