import { ShoppingBag, UtensilsCrossed } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

export function Header({ cartCount, onCartClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-neutral-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center shadow-sm shadow-primary-500/30">
            <UtensilsCrossed className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-lg font-bold font-display tracking-tight leading-none">
              Campus<span className="text-primary-600">Bites</span>
            </h1>
            <p className="text-[11px] text-neutral-500 leading-none mt-0.5">
              Pre-order & skip the line
            </p>
          </div>
        </div>

        <button
          onClick={onCartClick}
          className="relative flex items-center gap-2 px-3.5 sm:px-4 h-10 rounded-xl bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 active:scale-95 transition-all duration-200"
        >
          <ShoppingBag className="w-4.5 h-4.5" strokeWidth={2} />
          <span className="hidden sm:inline">Cart</span>
          {cartCount > 0 && (
            <span
              key={cartCount}
              className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-primary-500 text-white text-[11px] font-bold flex items-center justify-center animate-pop shadow-sm"
            >
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
