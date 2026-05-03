/**
 * src/components/ErrorMessage.jsx
 */

import { AlertCircle, RefreshCw } from 'lucide-react'

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
        <AlertCircle size={28} className="text-red-400" />
      </div>
      <h3 className="font-display font-semibold text-text text-lg mb-2">Gagal Memuat</h3>
      <p className="text-subtext text-sm mb-6 max-w-xs leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent/10 border border-accent/30 text-accent text-sm font-semibold hover:bg-accent/20 transition-all duration-200"
        >
          <RefreshCw size={14} />
          Coba Lagi
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title = 'Tidak Ada Hasil', desc = '' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="text-5xl mb-4">🔍</div>
      <h3 className="font-display font-semibold text-text text-lg mb-2">{title}</h3>
      {desc && <p className="text-subtext text-sm max-w-xs">{desc}</p>}
    </div>
  )
}
