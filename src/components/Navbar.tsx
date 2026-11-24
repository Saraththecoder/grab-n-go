import { useEffect, useState } from 'react';
import { Menu, ShoppingBag, Volume2, VolumeX, X } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

const NAV_LINKS = [
  { label: 'Menu', href: '#menu' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Hygiene', href: '#hygiene' },
  { label: 'Contact', href: '#order-footer' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalCount, totalAmount, setDrawerOpen, soundEnabled, toggleSound, feedback } =
    useOrder();

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/[0.06] bg-white/82 backdrop-blur-xl">
      <div className="mx-auto flex h-13 max-w-[1120px] items-center justify-between px-5 sm:px-8">
        <a
          href="#hero"
          aria-label="Grab N Go home"
          onClick={() => {
            feedback('tap');
            setMobileOpen(false);
          }}
          className="flex items-center gap-2 text-[#1D1D1F] active:scale-[0.97] transition-transform"
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#1D1D1F] text-[12px] font-bold text-white">
            G
          </span>
          <span className="font-display text-[15px] font-semibold tracking-[-0.02em]">
            Grab N Go
          </span>
        </a>

        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => feedback('tap')}
              className="text-[12.5px] font-normal text-[#1D1D1F]/75 transition-colors duration-200 hover:text-[#1D1D1F]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Mute UI sound effects' : 'Enable UI sound effects'}
            aria-pressed={soundEnabled}
            title={soundEnabled ? 'Sound effects on' : 'Sound effects muted'}
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#F5F5F7] text-[#1D1D1F] transition-all duration-150 hover:bg-black/10 active:scale-[0.92]"
          >
            {soundEnabled ? (
              <Volume2 className="h-3.5 w-3.5 text-[#1D1D1F]" />
            ) : (
              <VolumeX className="h-3.5 w-3.5 text-[#6E6E73]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-full bg-[#1D1D1F] px-3.5 py-1.5 text-[12.5px] font-medium text-white transition-all duration-150 hover:bg-[#F26A05] active:scale-[0.95]"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>
              {totalCount > 0 ? `Bag (${totalCount}) · ₹${totalAmount}` : 'Order'}
            </span>
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => {
              feedback('tap');
              setMobileOpen((prev) => !prev);
            }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#1D1D1F] hover:bg-[#F5F5F7] active:scale-[0.94] md:hidden"
          >
            {mobileOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-black/[0.06] bg-white px-5 pb-5 pt-2 md:hidden">
          <nav aria-label="Mobile navigation" className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => {
                  feedback('tap');
                  setMobileOpen(false);
                }}
                className="flex min-h-11 items-center border-b border-black/[0.05] text-[15px] text-[#1D1D1F] last:border-b-0"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
