import { createContext, useContext } from 'react'
import { useHistory } from '../hooks/useHistory'
import { useBookmark } from '../hooks/useBookmark'
import { useProgress } from '../hooks/useProgress'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const history  = useHistory()
  const bookmark = useBookmark()
  const progress = useProgress()
  return (
    <AppContext.Provider value={{ ...history, ...bookmark, ...progress }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be inside AppProvider')
  return ctx
}
