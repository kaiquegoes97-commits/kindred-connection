import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { site } from "@/config/site";
import { formatPrice } from "@/data/menu";
import { lineTotal, useCart } from "@/lib/cart";

const title = `Carrinho — ${site.name}`;
const description = "Revise os itens do seu pedido antes de finalizar no WhatsApp.";

export const Route = createFileRoute("/carrinho")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: CarrinhoPage,
});

function CarrinhoPage() {
  const { items, updateQuantity, removeItem, subtotal, clear, hydrated } = useCart();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-5xl sm:text-6xl">
        Seu <span className="text-gradient-ember">carrinho</span>
      </h1>

      {!hydrated ? (
        <div className="mt-10 space-y-3" aria-busy="true">
          {[0, 1].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl border border-border bg-card" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-border bg-card p-12 text-center">
          <ShoppingBag className="mx-auto size-10 text-muted-foreground" aria-hidden="true" />
          <p className="mt-4 font-display text-2xl">Ainda está vazio</p>
          <p className="mt-2 text-sm text-muted-foreground">Escolha um burger e monte do seu jeito.</p>
          <Button asChild className="mt-6 bg-gradient-ember text-primary-foreground">
            <Link to="/cardapio">Ir para o cardápio</Link>
          </Button>
        </div>
      ) : (
        <>
          <ul className="mt-10 space-y-4">
            {items.map((item) => (
              <li key={item.lineId} className="rounded-2xl border border-border bg-card p-4 sm:p-5">
                <div className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    width={112}
                    height={112}
                    loading="lazy"
                    className="size-20 shrink-0 rounded-xl object-cover sm:size-28"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="font-display text-2xl leading-tight">{item.name}</h2>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Remover ${item.name}`}
                        onClick={() => removeItem(item.lineId)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </Button>
                    </div>

                    {item.addons.length > 0 && (
                      <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                        {item.addons.map((a) => (
                          <li key={`${a.groupId}-${a.id}`}>
                            {a.groupLabel}: {a.label}
                            {a.price > 0 && ` (+${formatPrice(a.price)})`}
                          </li>
                        ))}
                      </ul>
                    )}
                    {item.notes && <p className="mt-1 text-xs italic text-muted-foreground">Obs: {item.notes}</p>}

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-1 rounded-full border border-border p-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 rounded-full"
                          aria-label="Diminuir quantidade"
                          onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                        >
                          <Minus className="size-3.5" aria-hidden="true" />
                        </Button>
                        <span className="w-7 text-center text-sm font-semibold">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 rounded-full"
                          aria-label="Aumentar quantidade"
                          onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                        >
                          <Plus className="size-3.5" aria-hidden="true" />
                        </Button>
                      </div>
                      <p className="text-lg font-semibold text-primary">{formatPrice(lineTotal(item))}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-2xl border border-border bg-card p-6">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span className="text-foreground">{formatPrice(subtotal)}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm text-muted-foreground">
              <span>Entrega</span>
              <span className="text-foreground">A combinar</span>
            </div>
            <Separator className="my-4" />
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl">Total</span>
              <span className="text-2xl font-semibold text-primary">{formatPrice(subtotal)}</span>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="flex-1 bg-gradient-ember text-primary-foreground shadow-ember">
                <Link to="/checkout">Finalizar pedido</Link>
              </Button>
              <Button variant="outline" size="lg" onClick={clear}>
                Esvaziar carrinho
              </Button>
            </div>
            <Button asChild variant="ghost" className="mt-2 w-full">
              <Link to="/cardapio">Adicionar mais itens</Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
