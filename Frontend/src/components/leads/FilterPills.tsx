import type { LeadStatus } from '../../lib/leadsApi'

export type FilterValue = 'All' | LeadStatus

type FilterOption = {
  value: FilterValue
  label: string
}

type FilterPillsProps = {
  options: FilterOption[]
  value: FilterValue
  onChange: (value: FilterValue) => void
}

const FilterPills = ({ options, value, onChange }: FilterPillsProps) => {
  return (
    <nav
      className="flex items-center rounded-full border border-slate-200 bg-white p-0.5 shadow-sm"
      aria-label="Filter leads by status"
    >
      {options.map((option, index) => {
        const isActive = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            id={`filter-${option.value}`}
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            className={[
              'relative rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-all duration-150',
              isActive
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800',
              index > 0 && !isActive ? 'before:absolute before:inset-y-1.5 before:left-0 before:w-px before:bg-slate-200' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {option.label}
          </button>
        )
      })}
    </nav>
  )
}

export default FilterPills
