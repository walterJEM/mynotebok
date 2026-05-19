'use client'

interface NoteCardProps {
  note: {
    id: string
    title: string
    description?: string
    image_url: string
    captured_at: string
    tags: string[]
  }
  onClick?: () => void
}

export default function NoteCard({ note, onClick }: NoteCardProps) {
  // Use the file serving API route for private blob images
  const imageUrl = note.image_url.startsWith('/')
    ? note.image_url
    : `/api/file?pathname=${encodeURIComponent(note.image_url)}`

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors cursor-pointer"
    >
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={note.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
          {note.title}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(note.captured_at).toLocaleDateString()}
        </p>
        {note.tags && note.tags.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {note.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded"
              >
                {tag}
              </span>
            ))}
            {note.tags.length > 2 && (
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                +{note.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
