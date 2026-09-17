import { useState } from 'react';
import { X, CheckCircle2, IdCard, Clock, ArrowLeft, Loader2 } from 'lucide-react';
import type { CartItem, OrderConfirmation } from '../types';

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  onConfirm: () => void;
}

const TAX_RATE = 0.08;
const STUDENT_ID_REGEX = /^STU-\d{6}$/;

type Stage = 'form' | 'confirm';

export function CheckoutModal({
  open,
  onClose,
  items,
  subtotal,
  onConfirm,
}: CheckoutModalProps) {
  const [stage, setStage] = useState<Stage>('form');
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<OrderConfirmation | null>(null);

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const idValid = STUDENT_ID_REGEX.test(studentId);
  const nameValid = studentName.trim().length >= 2;
  const timeValid = pickupTime !== '';
  const formValid = idValid && nameValid && timeValid;

  const formatId = (val: string) => {
    const cleaned = val.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (cleaned.startsWith('STU')) {
      const nums = cleaned.slice(3).slice(0, 6);
      return `STU-${nums}`;
    }
    const nums = cleaned.replace(/[^0-9]/g, '').slice(0, 6);
    return nums ? `STU-${nums}` : '';
  };

  const handleSubmit = () => {
    setTouched(true);
    if (!formValid) return;

    setSubmitting(true);
    setTimeout(() => {
      const orderId = `ORD-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
      setOrder({
        orderId,
        studentId,
        studentName: studentName.trim(),
        pickupTime,
        total,
        items,
      });
      setStage('confirm');
      setSubmitting(false);
      onConfirm();
    }, 1200);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStage('form');
      setStudentId('');
      setStudentName('');
      setPickupTime('');
      setTouched(false);
      setOrder(null);
    }, 300);
  };

  if (!open) return null;

  return (
    <>
      <div
        onClick={handleClose}
        className="fixed inset-0 z-[60] bg-neutral-950/50 backdrop-blur-sm animate-fade-in"
      />
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden pointer-events-auto animate-scale-in max-h-[90vh] flex flex-col">
          {stage === 'form' && (
            <>
              <div className="px-6 pt-6 pb-4 border-b border-neutral-100">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-display font-bold text-xl text-neutral-900">
                      Checkout
                    </h2>
                    <p className="text-sm text-neutral-500 mt-0.5">
                      Enter your details to place the order
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="w-9 h-9 -mt-1 -mr-2 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                  >
                    <X className="w-5 h-5" strokeWidth={2} />
                  </button>
                </div>
              </div>

              <div className="px-6 py-5 overflow-y-auto scrollbar-thin">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-700 flex items-center gap-1.5">
                    <IdCard className="w-4 h-4 text-neutral-400" />
                    Student ID
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(formatId(e.target.value))}
                    onBlur={() => setTouched(true)}
                    placeholder="STU-123456"
                    className={`w-full h-12 px-4 rounded-xl border text-sm font-medium tracking-wide outline-none transition-all ${
                      touched && !idValid
                        ? 'border-error-500 bg-error-500/5 focus:border-error-500'
                        : idValid
                        ? 'border-success-500 bg-success-500/5'
                        : 'border-neutral-200 bg-neutral-50 focus:border-primary-500 focus:bg-white'
                    }`}
                  />
                  {touched && !idValid ? (
                    <p className="text-xs text-error-500 font-medium">
                      Format must be STU- followed by 6 digits (e.g. STU-123456)
                    </p>
                  ) : idValid ? (
                    <p className="text-xs text-success-600 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Valid Student ID
                    </p>
                  ) : (
                    <p className="text-xs text-neutral-400">
                      Format: STU-XXXXXX (6 digits)
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 mt-4">
                  <label className="text-sm font-medium text-neutral-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    onBlur={() => setTouched(true)}
                    placeholder="Jane Doe"
                    className={`w-full h-12 px-4 rounded-xl border text-sm outline-none transition-all ${
                      touched && !nameValid
                        ? 'border-error-500 bg-error-500/5'
                        : nameValid
                        ? 'border-success-500 bg-success-500/5'
                        : 'border-neutral-200 bg-neutral-50 focus:border-primary-500 focus:bg-white'
                    }`}
                  />
                  {touched && !nameValid && (
                    <p className="text-xs text-error-500 font-medium">
                      Please enter your full name
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 mt-4">
                  <label className="text-sm font-medium text-neutral-700 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-neutral-400" />
                    Pickup Time
                  </label>
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    onBlur={() => setTouched(true)}
                    className={`w-full h-12 px-4 rounded-xl border text-sm outline-none transition-all bg-white appearance-none cursor-pointer ${
                      touched && !timeValid
                        ? 'border-error-500 bg-error-500/5'
                        : timeValid
                        ? 'border-success-500 bg-success-500/5'
                        : 'border-neutral-200 bg-neutral-50 focus:border-primary-500'
                    }`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23a8a29e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center',
                      paddingRight: '2.75rem',
                    }}
                  >
                    <option value="">Select a pickup time</option>
                    <option value="ASAP (15 min)">ASAP (~15 min)</option>
                    <option value="In 30 minutes">In 30 minutes</option>
                    <option value="In 45 minutes">In 45 minutes</option>
                    <option value="In 1 hour">In 1 hour</option>
                    <option value="In 1.5 hours">In 1.5 hours</option>
                    <option value="In 2 hours">In 2 hours</option>
                  </select>
                  {touched && !timeValid && (
                    <p className="text-xs text-error-500 font-medium">
                      Please select a pickup time
                    </p>
                  )}
                </div>

                <div className="mt-6 rounded-xl bg-neutral-50 border border-neutral-100 p-4">
                  <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                    Order Summary
                  </h3>
                  <div className="space-y-2 max-h-32 overflow-y-auto scrollbar-thin">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm text-neutral-600"
                      >
                        <span className="truncate pr-2">
                          {item.quantity}× {item.name}
                        </span>
                        <span className="font-medium flex-shrink-0">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-neutral-200 space-y-1">
                    <div className="flex justify-between text-sm text-neutral-500">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-neutral-500">
                      <span>Tax (8%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-1.5">
                      <span className="font-display font-bold text-base">
                        Total
                      </span>
                      <span className="font-display font-bold text-lg text-primary-600">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-neutral-100">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full h-12 rounded-xl bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-primary-500/30"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} />
                      Placing order...
                    </>
                  ) : (
                    `Place Order · $${total.toFixed(2)}`
                  )}
                </button>
              </div>
            </>
          )}

          {stage === 'confirm' && order && (
            <div className="px-6 py-10 text-center overflow-y-auto scrollbar-thin">
              <div className="w-20 h-20 rounded-full bg-success-500/10 flex items-center justify-center mx-auto animate-bounce-up">
                <CheckCircle2
                  className="w-11 h-11 text-success-500"
                  strokeWidth={2}
                />
              </div>

              <h2 className="font-display font-bold text-2xl text-neutral-900 mt-5">
                Order Confirmed!
              </h2>
              <p className="text-neutral-500 text-sm mt-1.5">
                Your food is being prepared. We'll have it ready for pickup.
              </p>

              <div className="mt-6 rounded-2xl bg-neutral-50 border border-neutral-100 p-5 text-left space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Order ID</span>
                  <span className="font-display font-bold text-neutral-900">
                    {order.orderId}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Student</span>
                  <span className="font-medium text-neutral-900">
                    {order.studentName}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Student ID</span>
                  <span className="font-medium text-neutral-900 tabular-nums">
                    {order.studentId}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Pickup Time</span>
                  <span className="font-medium text-neutral-900">
                    {order.pickupTime}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-3 border-t border-neutral-200">
                  <span className="font-display font-bold">Total Paid</span>
                  <span className="font-display font-bold text-lg text-primary-600">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <p className="text-xs text-neutral-400">
                  Show your Order ID at the counter to pick up your food.
                </p>
                <p className="text-xs text-neutral-400">
                  A receipt has been sent to your campus email.
                </p>
              </div>

              <button
                onClick={handleClose}
                className="w-full h-12 rounded-xl bg-neutral-900 text-white font-semibold text-sm hover:bg-neutral-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6"
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
                Back to Menu
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
