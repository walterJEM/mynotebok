import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const pathname = request.nextUrl.searchParams.get('pathname')
    if (!pathname) {
      return NextResponse.json({ error: 'Missing pathname' }, { status: 400 })
    }

    if (!pathname.includes(user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN
    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 500 })
    }

    const { get } = await import('@vercel/blob')
    const blob = await get(pathname, { token })

    if (!blob) {
      return NextResponse.json({ error: 'Blob not found' }, { status: 404 })
    }

    const imageRes = await fetch(blob.downloadUrl)
    const buffer = await imageRes.arrayBuffer()

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': blob.contentType || 'image/jpeg',
        'Cache-Control': 'private, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Error serving file:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}