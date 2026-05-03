/**
 * src/hooks/useHistory.js
 * Manages "Last Watched" history in localStorage.
 * Stores up to MAX_HISTORY items, most recent first.
 */

import { useState, useCallback } from 'react'

const STORAGE_KEY = 'animeku_history'
const MAX_HISTORY = 30

function readStorage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export function useHistory() {
  const [history, setHistory] = useState(readStorage)

  /**
   * Add or update a history entry.
   * @param {object} entry - { animeId, title, poster, episodeId, episodeTitle, timestamp }
   */
  const addHistory = useCallback((entry) => {
    setHistory((prev) => {
      // Remove existing entry for same animeId
      const filtered = prev.filter((h) => h.animeId !== entry.animeId)
      const updated = [
        { ...entry, timestamp: Date.now() },
        ...filtered,
      ].slice(0, MAX_HISTORY)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const removeHistory = useCallback((animeId) => {
    setHistory((prev) => {
      const updated = prev.filter((h) => h.animeId !== animeId)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setHistory([])
  }, [])

  return { history, addHistory, removeHistory, clearHistory }
}
