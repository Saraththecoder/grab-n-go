import { useEffect, useState } from 'react';
import { Check, Copy, MessageCircle, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { BRAND, PICKUP_SLOTS, buildWhatsAppOrderUrl } from '../data/brand';
import { useOrder } from '../context/OrderContext';

export function OrderDrawer() {
  const {
    items,
    totalCount,
    totalAmount,
    drawerOpen,
    setDrawerOpen,
    setQuantity,
    clearOrder,
    feedback,
  } = useOrder();

  const [customerName, setCustomerName] = useState('');
  const [pickupSlot, setPickupSlot] = useState<string>(PICKUP_SLOTS[1]);
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen, setDrawerOpen]);

  const buildOrderMessage = () => {
    const lines = [
      '*New Order — Grab N Go*',
      customerName.trim() ? `Name: ${customerName.trim()}` : 'Name: Campus Student',
      `Pickup Slot: ${pickupSlot}`,
      '',
      '*Items:*',
    ];

    if (items.length === 0) {
      lines.push('- Looking to place a pre-book order');
    } else {
      for (const item of items) {
        const sub = item.unitPrice * item.quantity;
        lines.push(`• ${item.quantity}x ${item.name} (${item.variantLabel}) — ₹${sub}`);
      }
      lines.push('');
      lines.push(`*Estimated Total: ₹${totalAmount}*`);
    }

    if (notes.trim()) {
      lines.push(`Note: ${notes.trim()}`);
    }

    lines.push('Payment: UPI (confirming slot)');
    return lines.join('\n');
  };

  const whatsappUrl = buildWhatsAppOrderUrl(buildOrderMessage());

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(buildOrderMessage());
      feedback('success');
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      {/* Apple-style Floating Pill Order Bar */}
      {totalCount > 0 && !drawerOpen && (
        <div className="fixed inset-x-0 bottom-5 z-40 flex justify-center px-4">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex w-full max-w-[420px] cursor-pointer items-center justify-between rounded-full bg-[#1D1D1F]/92 px-5 py-3 text-white shadow-[0_20px_44px_-12px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-transform duration-200 hover:scale-[1.01]"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#F26A05] text-[12.5px] font-semibold text-white tabular-nums">
                {totalCount}
              </span>
              <span className="text-[14.5px] font-medium tabular-nums">
                ₹{totalAmount} · Review Order
              </span>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#159B55] px-3.5 py-1.5 text-[12.5px] font-medium text-white">
              <MessageCircle className="h-3.5 w-3.5" />
              <span>WhatsApp</span>
            </span>
          </button>
        </div>
      )}

      {/* Slide-over Apple-clean Order Sheet */}
      {drawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="whatsapp-order-drawer-title"
          className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        >
          <div
            className="flex h-full w-full max-w-[440px] flex-col justify-between overflow-y-auto bg-white p-6 text-[#1D1D1F] shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between border-b border-black/[0.07] pb-4">
                <div>
                  <p className="text-[12px] font-medium text-[#159B55]">WhatsApp Pre-Book</p>
                  <h2
                    id="whatsapp-order-drawer-title"
                    className="font-display text-[22px] font-semibold tracking-[-0.025em]"
                  >
                    Your Bag
                  </h2>
                </div>
                <button
                  type="button"
                  aria-label="Close order drawer"
                  onClick={() => setDrawerOpen(false)}
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#F5F5F7] text-[#1D1D1F] hover:bg-black/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-6">
                {items.length === 0 ? (
                  <div className="rounded-[20px] bg-[#F5F5F7] p-6 text-center">
                    <ShoppingBag className="mx-auto h-6 w-6 text-[#6E6E73]" />
                    <p className="mt-2 font-display text-[16px] font-semibold">
                      Your bag is empty
                    </p>
                    <p className="mt-1 text-[13.5px] text-[#6E6E73]">
                      Add food from the menu or message us directly on WhatsApp.
                    </p>
                    <a
                      href="#menu"
                      onClick={() => setDrawerOpen(false)}
                      className="mt-4 inline-flex min-h-9 items-center rounded-full bg-[#1D1D1F] px-5 py-1.5 text-[13px] font-medium text-white"
                    >
                      Browse Menu
                    </a>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[12.5px] font-medium text-[#6E6E73]">
                        {totalCount} {totalCount === 1 ? 'item' : 'items'}
                      </span>
                      <button
                        type="button"
                        onClick={clearOrder}
                        className="cursor-pointer text-[12.5px] font-medium text-[#6E6E73] hover:text-[#F26A05]"
                      >
                        Clear all
                      </button>
                    </div>

                    <ul className="mt-3 divide-y divide-black/[0.06] border-y border-black/[0.06]">
                      {items.map((item) => (
                        <li
                          key={item.key}
                          className="flex items-center justify-between gap-3 py-3.5"
                        >
                          <div>
                            <p className="text-[15px] font-semibold text-[#1D1D1F]">
                              {item.name}
                            </p>
                            <p className="text-[12.5px] text-[#6E6E73]">
                              {item.variantLabel} · ₹{item.unitPrice}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="inline-flex items-center rounded-full bg-[#F5F5F7] p-0.5">
                              <button
                                type="button"
                                aria-label={`Decrease ${item.name}`}
                                onClick={() => setQuantity(item.key, item.quantity - 1)}
                                className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full hover:bg-white"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="min-w-6 text-center text-[13px] font-semibold tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                aria-label={`Increase ${item.name}`}
                                onClick={() => setQuantity(item.key, item.quantity + 1)}
                                className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full hover:bg-white"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <span className="min-w-11 text-right text-[14px] font-semibold tabular-nums">
                              ₹{item.unitPrice * item.quantity}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-3 flex items-baseline justify-between">
                      <span className="text-[14px] text-[#6E6E73]">Total</span>
                      <span className="font-display text-[22px] font-semibold text-[#1D1D1F] tabular-nums">
                        ₹{totalAmount}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label
                    htmlFor="order-student-name"
                    className="block text-[12.5px] font-medium text-[#6E6E73]"
                  >
                    Your Name
                  </label>
                  <input
                    id="order-student-name"
                    type="text"
                    placeholder="e.g. Aarav"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="mt-1.5 w-full rounded-xl bg-[#F5F5F7] px-3.5 py-2.5 text-[14.5px] text-[#1D1D1F] placeholder:text-[#6E6E73]/60 focus:outline-none"
                  />
                </div>

                <div>
                  <span className="block text-[12.5px] font-medium text-[#6E6E73]">
                    Pickup Break Slot
                  </span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {PICKUP_SLOTS.map((slot) => {
                      const active = pickupSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => {
                            feedback('tap');
                            setPickupSlot(slot);
                          }}
                          className={`cursor-pointer rounded-full px-3 py-1.5 text-[12px] font-medium transition-all duration-150 active:scale-[0.94] ${
                            active
                              ? 'bg-[#1D1D1F] text-white'
                              : 'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-black/10'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="order-notes"
                    className="block text-[12.5px] font-medium text-[#6E6E73]"
                  >
                    Note (Optional)
                  </label>
                  <input
                    id="order-notes"
                    type="text"
                    placeholder="Extra spicy chutney, less oil, etc."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-1.5 w-full rounded-xl bg-[#F5F5F7] px-3.5 py-2.5 text-[14.5px] text-[#1D1D1F] placeholder:text-[#6E6E73]/60 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-black/[0.07] pt-5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => feedback('success')}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#159B55] px-5 py-3 text-[15px] font-medium text-white transition-all duration-150 hover:bg-[#118246] active:scale-[0.96]"
              >
                <MessageCircle className="h-4.5 w-4.5" />
                <span>Send Order on WhatsApp</span>
              </a>

              <div className="mt-3 flex items-center justify-between text-[12px] text-[#6E6E73]">
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="inline-flex cursor-pointer items-center gap-1 hover:text-[#1D1D1F]"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-[#159B55]" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  <span>{copied ? 'Copied' : 'Copy order text'}</span>
                </button>
                <span>{BRAND.displayPhone}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
