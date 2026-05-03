import { useState, useCallback } from 'react'

const KEY = 'animeku_progress'

function read() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} }
}

export function useProgress() {
  const [progress, setProgress] = useState(read)

  // Save last watched episode per anime
  const saveProgress = useCallback((animeId, episodeData) => {
    setProgress(prev => {
      const updated = { ...prev, [animeId]: { ...episodeData, updatedAt: Date.now() } }
      localStorage.setItem(KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const getProgress = useCallback((animeId) => {
    return progress[animeId] || null
  }, [progress])

  const clearProgress = useCallback((animeId) => {
    setProgress(prev => {
      const updated = { ...prev }
      delete updated[animeId]
      localStorage.setItem(KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  return { progress, saveProgress, getProgress, clearProgress }
}
