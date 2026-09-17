import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import type { CartItem } from '../types';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

const TAX_RATE = 0.08;

export function CartDrawer({
  open,
  onClose,
  items,
  subtotal,
  onUpdateQuantity,
  onRemove,
  onCheckout,
}: CartDrawerProps) {
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-neutral-950/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-neutral-50 shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-neutral-200 bg-white">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-neutral-700" strokeWidth={2} />
            <h2 className="font-display font-bold text-lg">Your Order</h2>
            {items.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-3">
            <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center">
              <ShoppingBag className="w-9 h-9 text-neutral-300" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-display font-semibold text-neutral-700">
                Your cart is empty
              </p>
              <p className="text-sm text-neutral-400 mt-1">
                Browse the menu and add items to get started
              </p>
            </div>
            <button
              onClick={onClose}
              className="mt-2 px-5 h-10 rounded-xl bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 bg-white rounded-xl border border-neutral-200/80 p-3 animate-fade-in"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-neutral-900 leading-snug truncate">
                      {item.name}
                    </h4>
                    <p className="text-primary-600 font-display font-bold text-sm mt-0.5">
                      ${item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-0.5 bg-neutral-100 rounded-lg p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-7 h-7 rounded-md flex items-center justify-center bg-white shadow-sm text-neutral-700 hover:bg-neutral-50 active:scale-90 transition-all"
                        >
                          <Minus className="w-3.5 h-3.5" strokeWidth={2.5} />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-7 h-7 rounded-md flex items-center justify-center bg-white shadow-sm text-neutral-700 hover:bg-neutral-50 active:scale-90 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-neutral-700">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => onRemove(item.id)}
                          className="w-7 h-7 rounded-md flex items-center justify-center text-neutral-400 hover:text-error-500 hover:bg-error-500/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-200 bg-white px-5 py-4 space-y-3">
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm text-neutral-500">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-neutral-500">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-neutral-100">
                  <span className="font-display font-bold text-base">Total</span>
                  <span className="font-display font-bold text-xl text-primary-600">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={onCheckout}
                className="w-full h-12 rounded-xl bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-500/30"
              >
                Checkout
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
