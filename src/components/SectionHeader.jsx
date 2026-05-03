/**
 * src/components/SectionHeader.jsx
 */

import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function SectionHeader({ title, icon: Icon, linkTo, linkLabel = 'Lihat Semua' }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="flex items-center gap-2 font-display font-bold text-lg text-text">
        {Icon && (
          <span className="w-6 h-6 rounded-lg bg-accent/15 flex items-center justify-center">
            <Icon size={14} className="text-accent" />
          </span>
        )}
        {title}
      </h2>
      {linkTo && (
        <Link
          to={linkTo}
          className="flex items-center gap-1 text-xs text-accent font-medium hover:text-accent/80 transition-colors"
        >
          {linkLabel}
          <ChevronRight size={14} />
        </Link>
      )}
    </div>
  )
}
