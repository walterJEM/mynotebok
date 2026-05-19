export interface Note {
  id: string
  user_id: string
  title: string
  description?: string
  tags: string[]
  image_url: string
  captured_at: string
  created_at: string
  updated_at: string
}
