import { useState, useMemo } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { Header } from './components/Header';
import { CategoryFilter } from './components/CategoryFilter';
import { MenuCard } from './components/MenuCard';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { useCart } from './useCart';
import { menuItems, categories } from './data';
import type { Category } from './types';

function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [search, setSearch] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const cart = useCart();

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch =
        search === '' ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const counts = useMemo(() => {
    const result: Record<Category, number> = {} as Record<Category, number>;
    for (const cat of categories) {
      result[cat.id] =
        cat.id === 'all'
          ? menuItems.length
          : menuItems.filter((i) => i.category === cat.id).length;
    }
    return result;
  }, []);

  const quantityMap = useMemo(() => {
    const map: Record<string, number> = {};
    cart.items.forEach((i) => {
      map[i.id] = i.quantity;
    });
    return map;
  }, [cart.items]);

  const handleCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleOrderConfirm = () => {
    cart.clearCart();
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header cartCount={cart.totalCount} onCartClick={() => setCartOpen(true)} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-primary-600 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur text-white/90 text-xs font-medium border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-primary-400" />
              Now serving · Fall Semester
            </span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight leading-[1.1] max-w-2xl">
            Skip the line.
            <br />
            <span className="text-primary-400">Pre-order your food.</span>
          </h2>
          <p className="text-neutral-300 text-sm sm:text-base mt-4 max-w-lg leading-relaxed">
            Browse the campus menu, build your order, and pick it up fresh —
            no waiting, no queues. Just good food, ready when you are.
          </p>

          {/* Search bar */}
          <div className="mt-7 max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for burgers, pizza, sushi..."
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-white text-sm text-neutral-800 placeholder:text-neutral-400 outline-none ring-2 ring-transparent focus:ring-primary-500/50 transition-all shadow-xl shadow-neutral-950/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Menu */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h3 className="font-display font-bold text-xl text-neutral-900">
              {activeCategory === 'all'
                ? 'Full Menu'
                : categories.find((c) => c.id === activeCategory)?.label}
            </h3>
            <p className="text-sm text-neutral-500 mt-0.5">
              {filteredItems.length}{' '}
              {filteredItems.length === 1 ? 'item' : 'items'} available
              {search && ` for "${search}"`}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <CategoryFilter
            active={activeCategory}
            onChange={setActiveCategory}
            counts={counts}
          />
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredItems.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                onAdd={cart.addToCart}
                quantityInCart={quantityMap[item.id] || 0}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-neutral-400 text-sm">
              No items match your search. Try a different term or category.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-neutral-400">
            Campus Bites · Pre-ordering for students
          </p>
          <p className="text-xs text-neutral-400">
            Demo interface · Mock data · No real orders placed
          </p>
        </div>
      </footer>

      {/* Cart drawer */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart.items}
        subtotal={cart.subtotal}
        onUpdateQuantity={cart.updateQuantity}
        onRemove={cart.removeFromCart}
        onCheckout={handleCheckout}
      />

      {/* Checkout modal */}
      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cart.items}
        subtotal={cart.subtotal}
        onConfirm={handleOrderConfirm}
      />

      {/* Mobile floating cart bar */}
      {cart.totalCount > 0 && !cartOpen && !checkoutOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-30 sm:hidden p-3 animate-bounce-up">
          <button
            onClick={() => setCartOpen(true)}
            className="w-full h-14 rounded-2xl bg-neutral-900 text-white font-semibold flex items-center justify-between px-5 shadow-2xl shadow-neutral-950/30 active:scale-[0.98] transition-transform"
          >
            <span className="flex items-center gap-2">
              <span className="min-w-[24px] h-6 px-1.5 rounded-full bg-primary-500 text-xs font-bold flex items-center justify-center">
                {cart.totalCount}
              </span>
              View Cart
            </span>
            <span className="font-display">${cart.subtotal.toFixed(2)}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
