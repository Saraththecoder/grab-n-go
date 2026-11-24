import { useEffect, useMemo, useRef, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { gsap, prefersReducedMotion } from '../utils/gsap';
import { COMBO_DEALS, MENU_CATEGORIES, MENU_ITEMS } from '../data/menu';
import { useOrder } from '../context/OrderContext';
import { AnimatedWords } from './AnimatedText';
import type { MenuCategory } from '../types';

export function MenuSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('All');
  const [selectedVariantByItem, setSelectedVariantByItem] = useState<Record<string, string>>({});

  const { addItem, setQuantity, getQuantity, feedback } = useOrder();

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return MENU_ITEMS;
    return MENU_ITEMS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from('.menu-header-reveal', {
        y: 18,
        opacity: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!gridRef.current || prefersReducedMotion()) return;
    const cards = gridRef.current.querySelectorAll('.menu-item-card');
    if (cards.length === 0) return;

    gsap.fromTo(
      cards,
      { y: 14, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.04,
        ease: 'power3.out',
        clearProps: 'transform',
      },
    );
  }, [activeCategory]);

  return (
    <section
      id="menu"
      ref={sectionRef}
      className="bg-[#F5F5F7] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
        <div className="text-center">
          <h2 className="font-display text-[clamp(2.1rem,4.5vw,3.4rem)] font-semibold leading-[1.06] tracking-[-0.035em] text-[#1D1D1F]">
            <AnimatedWords text="The Menu." />
          </h2>
          <p className="menu-header-reveal mx-auto mt-3 max-w-[520px] text-[17px] leading-[1.5] text-[#6E6E73]">
            Select items to build your WhatsApp pre-order.
          </p>

          <div
            role="tablist"
            aria-label="Menu categories"
            className="menu-header-reveal mt-8 inline-flex flex-wrap items-center justify-center gap-1 rounded-full bg-black/[0.05] p-1.5"
          >
            {MENU_CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  onClick={() => {
                    feedback('tap');
                    setActiveCategory(category);
                  }}
                  className={`min-h-9 cursor-pointer rounded-full px-4 py-1.5 text-[13.5px] font-medium transition-all duration-150 active:scale-[0.95] ${
                    isActive
                      ? 'bg-white text-[#1D1D1F] shadow-[0_1px_4px_rgba(0,0,0,0.08)]'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <div
          ref={gridRef}
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredItems.map((item) => {
            const selectedVariantId =
              selectedVariantByItem[item.id] ?? item.variants[0].id;
            const activeVariant =
              item.variants.find((v) => v.id === selectedVariantId) ?? item.variants[0];
            const lineKey = `${item.id}:${activeVariant.id}`;
            const qty = getQuantity(lineKey);

            return (
              <article
                key={item.id}
                className="menu-item-card group flex flex-col justify-between overflow-hidden rounded-[24px] bg-white p-5 transition-shadow duration-300 hover:shadow-[0_18px_40px_-20px_rgba(0,0,0,0.12)]"
              >
                <div>
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-[16px] bg-[#F5F5F7]">
                    <img
                      src={item.imageUrl}
                      alt={item.imageAlt}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      onError={(e) => {
                        e.currentTarget.src = '/images/steamed-momos.jpg';
                      }}
                    />
                  </div>

                  <div className="mt-5 flex items-baseline justify-between gap-2">
                    <h3 className="font-display text-[20px] font-semibold tracking-[-0.02em] text-[#1D1D1F]">
                      {item.name}
                    </h3>
                    <span className="shrink-0 text-[15px] font-semibold text-[#1D1D1F] tabular-nums">
                      ₹{activeVariant.price}
                    </span>
                  </div>

                  <p className="mt-1.5 text-[13.5px] leading-[1.55] text-[#6E6E73]">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-black/[0.06] pt-4">
                  <div className="flex flex-wrap gap-1.5">
                    {item.variants.map((variant) => {
                      const selected = variant.id === activeVariant.id;
                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => {
                            feedback('tap');
                            setSelectedVariantByItem((prev) => ({
                              ...prev,
                              [item.id]: variant.id,
                            }));
                          }}
                          className={`cursor-pointer rounded-full px-2.5 py-1 text-[12px] font-medium transition-all duration-150 active:scale-[0.94] ${
                            selected
                              ? 'bg-[#1D1D1F] text-white'
                              : 'bg-[#F5F5F7] text-[#6E6E73] hover:text-[#1D1D1F]'
                          }`}
                        >
                          {variant.label}
                        </button>
                      );
                    })}
                  </div>

                  {qty === 0 ? (
                    <button
                      type="button"
                      onClick={() =>
                        addItem({
                          key: lineKey,
                          name: item.name,
                          variantLabel: activeVariant.label,
                          unitPrice: activeVariant.price,
                        })
                      }
                      className="inline-flex min-h-9 shrink-0 cursor-pointer items-center gap-1 rounded-full bg-[#F26A05] px-4 py-1.5 text-[13px] font-medium text-white transition-all duration-150 hover:bg-[#E85D04] active:scale-[0.92]"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add</span>
                    </button>
                  ) : (
                    <div className="inline-flex shrink-0 items-center rounded-full bg-[#F5F5F7] p-0.5">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${item.name} ${activeVariant.label}`}
                        onClick={() => setQuantity(lineKey, qty - 1)}
                        className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#1D1D1F] transition-transform hover:bg-white active:scale-[0.88]"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-6 text-center text-[13px] font-semibold text-[#1D1D1F] tabular-nums">
                        {qty}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase quantity of ${item.name} ${activeVariant.label}`}
                        onClick={() => setQuantity(lineKey, qty + 1)}
                        className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#1D1D1F] transition-transform hover:bg-white active:scale-[0.88]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-16">
          <h3 className="font-display text-[24px] font-semibold tracking-[-0.025em] text-[#1D1D1F] sm:text-[28px]">
            <AnimatedWords text="Quick-Break Combos." />
          </h3>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {COMBO_DEALS.map((combo) => {
              const comboKey = `combo:${combo.id}`;
              const qty = getQuantity(comboKey);
              return (
                <div
                  key={combo.id}
                  className="group flex flex-col justify-between overflow-hidden rounded-[24px] bg-white p-5 sm:flex-row sm:items-center sm:gap-5"
                >
                  <div className="aspect-[4/3] w-full shrink-0 overflow-hidden rounded-[16px] bg-[#F5F5F7] sm:aspect-square sm:w-36">
                    <img
                      src={combo.imageUrl}
                      alt={combo.imageAlt}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                      onError={(e) => {
                        e.currentTarget.src = '/images/steamed-momos.jpg';
                      }}
                    />
                  </div>

                  <div className="mt-4 flex flex-1 flex-col justify-between sm:mt-0">
                    <div>
                      <div className="flex items-baseline justify-between gap-2">
                        <h4 className="font-display text-[19px] font-semibold text-[#1D1D1F]">
                          {combo.title}
                        </h4>
                        <span className="text-[16px] font-semibold text-[#1D1D1F] tabular-nums">
                          {combo.formattedPrice}
                        </span>
                      </div>
                      <p className="mt-1 text-[13.5px] text-[#6E6E73]">{combo.items}</p>
                    </div>

                    <div className="mt-4 flex justify-end">
                      {qty === 0 ? (
                        <button
                          type="button"
                          onClick={() =>
                            addItem({
                              key: comboKey,
                              name: combo.title,
                              variantLabel: 'Combo',
                              unitPrice: combo.price,
                            })
                          }
                          className="inline-flex min-h-9 cursor-pointer items-center gap-1 rounded-full bg-[#1D1D1F] px-4 py-1.5 text-[13px] font-medium text-white transition-all duration-150 hover:bg-[#F26A05] active:scale-[0.93]"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add Combo</span>
                        </button>
                      ) : (
                        <div className="inline-flex items-center rounded-full bg-[#F5F5F7] p-0.5">
                          <button
                            type="button"
                            aria-label={`Decrease quantity of ${combo.title}`}
                            onClick={() => setQuantity(comboKey, qty - 1)}
                            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#1D1D1F] transition-transform hover:bg-white active:scale-[0.88]"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-6 text-center text-[13px] font-semibold text-[#1D1D1F] tabular-nums">
                            {qty}
                          </span>
                          <button
                            type="button"
                            aria-label={`Increase quantity of ${combo.title}`}
                            onClick={() => setQuantity(comboKey, qty + 1)}
                            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#1D1D1F] transition-transform hover:bg-white active:scale-[0.88]"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
