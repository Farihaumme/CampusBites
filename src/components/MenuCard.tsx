import { Plus, Clock, Star, Check } from 'lucide-react';
import { useState } from 'react';
import type { MenuItem } from '../types';

interface MenuCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
  quantityInCart: number;
}

export function MenuCard({ item, onAdd, quantityInCart }: MenuCardProps) {
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    onAdd(item);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1000);
  };

  return (
    <div className="group bg-white rounded-2xl border border-neutral-200/80 overflow-hidden hover:shadow-lg hover:shadow-neutral-900/8 hover:border-neutral-300 transition-all duration-300 flex flex-col">
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-1.5">
          {item.popular && (
            <span className="px-2.5 py-1 rounded-full bg-neutral-900/90 backdrop-blur text-white text-[11px] font-semibold">
              Popular
            </span>
          )}
          {item.tags
            .filter((t) => t !== 'Bestseller')
            .slice(0, 1)
            .map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-neutral-700 text-[11px] font-semibold"
              >
                {tag}
              </span>
            ))}
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 backdrop-blur">
          <Star className="w-3 h-3 fill-warning-500 text-warning-500" />
          <span className="text-[11px] font-semibold text-neutral-700">
            {item.rating}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-[15px] leading-snug text-neutral-900">
          {item.name}
        </h3>
        <p className="text-[13px] text-neutral-500 mt-1 leading-relaxed line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center gap-1 text-[12px] text-neutral-400 mt-2.5">
          <Clock className="w-3.5 h-3.5" />
          <span>{item.prepTime} min</span>
        </div>

        <div className="flex items-center justify-between mt-3.5 pt-3.5 border-t border-neutral-100">
          <div className="flex items-baseline gap-0.5">
            <span className="text-[13px] text-neutral-400">$</span>
            <span className="font-display text-xl font-bold text-neutral-900">
              {item.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAdd}
            className={`flex items-center gap-1.5 px-3.5 h-9 rounded-lg text-sm font-medium transition-all duration-200 active:scale-90 ${
              justAdded
                ? 'bg-success-500 text-white'
                : quantityInCart > 0
                ? 'bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100'
                : 'bg-primary-500 text-white hover:bg-primary-600 shadow-sm shadow-primary-500/30'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" strokeWidth={2.5} />
                Added
              </>
            ) : quantityInCart > 0 ? (
              <>
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                Add ({quantityInCart})
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
