/**
 * src/context/HistoryContext.jsx
 * Provides watch history to the entire app tree.
 */

import { createContext, useContext } from 'react'
import { useHistory } from '../hooks/useHistory'

const HistoryContext = createContext(null)

export function HistoryProvider({ children }) {
  const historyState = useHistory()
  return (
    <HistoryContext.Provider value={historyState}>
      {children}
    </HistoryContext.Provider>
  )
}

export function useHistoryContext() {
  const ctx = useContext(HistoryContext)
  if (!ctx) throw new Error('useHistoryContext must be inside HistoryProvider')
  return ctx
}
