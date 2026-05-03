import { useState, useCallback } from 'react'

const KEY = 'animeku_bookmarks'

function read() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

export function useBookmark() {
  const [bookmarks, setBookmarks] = useState(read)

  const isBookmarked = useCallback((animeId) =>
    bookmarks.some(b => b.animeId === animeId), [bookmarks])

  const toggleBookmark = useCallback((anime) => {
    setBookmarks(prev => {
      const exists = prev.some(b => b.animeId === anime.animeId)
      const updated = exists
        ? prev.filter(b => b.animeId !== anime.animeId)
        : [{ ...anime, savedAt: Date.now() }, ...prev]
      localStorage.setItem(KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const clearBookmarks = useCallback(() => {
    localStorage.removeItem(KEY)
    setBookmarks([])
  }, [])

  return { bookmarks, isBookmarked, toggleBookmark, clearBookmarks }
}
