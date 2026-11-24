import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { OrderLineItem } from '../types';
import {
  getInitialSoundEnabled,
  persistSoundEnabled,
  triggerFeedback,
  type FeedbackKind,
} from '../utils/feedback';

interface OrderContextValue {
  items: OrderLineItem[];
  totalCount: number;
  totalAmount: number;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  addItem: (item: Omit<OrderLineItem, 'quantity'>) => void;
  setQuantity: (key: string, quantity: number) => void;
  getQuantity: (key: string) => number;
  clearOrder: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  feedback: (kind: FeedbackKind) => void;
}

const OrderContext = createContext<OrderContextValue | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<OrderLineItem[]>([]);
  const [drawerOpen, setDrawerOpenState] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => getInitialSoundEnabled());

  const feedback = (kind: FeedbackKind) => {
    triggerFeedback(kind, soundEnabled);
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      persistSoundEnabled(next);
      triggerFeedback('tap', next);
      return next;
    });
  };

  const setDrawerOpen = (open: boolean) => {
    if (open) {
      triggerFeedback('drawerOpen', soundEnabled);
    } else {
      triggerFeedback('tap', soundEnabled);
    }
    setDrawerOpenState(open);
  };

  const addItem = (incoming: Omit<OrderLineItem, 'quantity'>) => {
    triggerFeedback('add', soundEnabled);
    setItems((prev) => {
      const existing = prev.find((i) => i.key === incoming.key);
      if (existing) {
        return prev.map((i) =>
          i.key === incoming.key ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...incoming, quantity: 1 }];
    });
  };

  const setQuantity = (key: string, quantity: number) => {
    const current = items.find((i) => i.key === key)?.quantity ?? 0;
    triggerFeedback(quantity > current ? 'add' : 'remove', soundEnabled);
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((i) => i.key !== key);
      return prev.map((i) => (i.key === key ? { ...i, quantity } : i));
    });
  };

  const getQuantity = (key: string) => {
    return items.find((i) => i.key === key)?.quantity ?? 0;
  };

  const clearOrder = () => {
    triggerFeedback('remove', soundEnabled);
    setItems([]);
  };

  const { totalCount, totalAmount } = useMemo(() => {
    return items.reduce(
      (acc, item) => ({
        totalCount: acc.totalCount + item.quantity,
        totalAmount: acc.totalAmount + item.unitPrice * item.quantity,
      }),
      { totalCount: 0, totalAmount: 0 },
    );
  }, [items]);

  return (
    <OrderContext.Provider
      value={{
        items,
        totalCount,
        totalAmount,
        drawerOpen,
        setDrawerOpen,
        addItem,
        setQuantity,
        getQuantity,
        clearOrder,
        soundEnabled,
        toggleSound,
        feedback,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder must be used inside OrderProvider');
  return ctx;
}
