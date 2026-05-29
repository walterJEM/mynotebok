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
    const storeId = 'q4iszijeqgansnup'
    const blobUrl = `https://${storeId}.public.blob.vercel-storage.com/${pathname}`

    const imageRes = await fetch(blobUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!imageRes.ok) {
      return NextResponse.json({ error: `Failed: ${imageRes.status}` }, { status: imageRes.status })
    }

    const buffer = await imageRes.arrayBuffer()
    const contentType = imageRes.headers.get('content-type') || 'image/jpeg'

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'private, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Error serving file:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}