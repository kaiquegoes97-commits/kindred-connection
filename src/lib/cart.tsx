import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartAddon = { groupId: string; groupLabel: string; id: string; label: string; price: number };

export type CartItem = {
  /** id único da linha do carrinho (produto + combinação de adicionais) */
  lineId: string;
  slug: string;
  name: string;
  image: string;
  basePrice: number;
  quantity: number;
  addons: CartAddon[];
  notes?: string;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "lineId">) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  hydrated: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "burger-cart-v1";

export const lineTotal = (item: CartItem) =>
  (item.basePrice + item.addons.reduce((s, a) => s + a.price, 0)) * item.quantity;

const buildLineId = (item: Omit<CartItem, "lineId">) =>
  [item.slug, ...item.addons.map((a) => a.id).sort(), item.notes?.trim() ?? ""].join("|");

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignora storage indisponível */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignora storage indisponível */
    }
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    return {
      items,
      hydrated,
      addItem: (item) => {
        const lineId = buildLineId(item);
        setItems((prev) => {
          const existing = prev.find((i) => i.lineId === lineId);
          if (existing) {
            return prev.map((i) =>
              i.lineId === lineId ? { ...i, quantity: i.quantity + item.quantity } : i,
            );
          }
          return [...prev, { ...item, lineId }];
        });
      },
      removeItem: (lineId) => setItems((prev) => prev.filter((i) => i.lineId !== lineId)),
      updateQuantity: (lineId, quantity) =>
        setItems((prev) =>
          quantity <= 0
            ? prev.filter((i) => i.lineId !== lineId)
            : prev.map((i) => (i.lineId === lineId ? { ...i, quantity } : i)),
        ),
      clear: () => setItems([]),
      count: items.reduce((s, i) => s + i.quantity, 0),
      subtotal: items.reduce((s, i) => s + lineTotal(i), 0),
    };
  }, [items, hydrated]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de CartProvider");
  return ctx;
}
