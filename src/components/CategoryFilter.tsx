import type { Category } from '../types';
import { categories } from '../data';

interface CategoryFilterProps {
  active: Category;
  onChange: (cat: Category) => void;
  counts: Record<Category, number>;
}

export function CategoryFilter({ active, onChange, counts }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
      {categories.map((cat) => {
        const isActive = active === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={`flex items-center gap-2 px-4 h-10 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 active:scale-95 ${
              isActive
                ? 'bg-neutral-900 text-white shadow-md shadow-neutral-900/15'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300 hover:text-neutral-900'
            }`}
          >
            <span className="text-base leading-none">{cat.icon}</span>
            {cat.label}
            <span
              className={`text-xs font-semibold ${
                isActive ? 'text-neutral-400' : 'text-neutral-400'
              }`}
            >
              {counts[cat.id]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
