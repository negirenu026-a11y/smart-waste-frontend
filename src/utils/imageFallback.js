export const fallbackImage = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80'

export function handleImageError(event) {
  event.currentTarget.src = fallbackImage
}
