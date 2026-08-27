import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";
import { categories, products, type CategoryId } from "@/data/menu";

const title = `Cardápio — ${site.name}`;
const description =
  "Burgers artesanais, acompanhamentos crocantes e bebidas. Monte seu pedido com adicionais e finalize no WhatsApp.";

export const Route = createFileRoute("/cardapio")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Cardapio,
});

function Cardapio() {
  const [active, setActive] = useState<CategoryId | "todos">("todos");
  const visible = active === "todos" ? products : products.filter((p) => p.category === active);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
      <header className="animate-rise">
        <h1 className="font-display text-5xl sm:text-6xl">
          Nosso <span className="text-gradient-ember">cardápio</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">{description}</p>
      </header>

      <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Filtrar por categoria">
        {[{ id: "todos" as const, label: "Todos" }, ...categories].map((cat) => (
          <Button
            key={cat.id}
            role="tab"
            aria-selected={active === cat.id}
            variant={active === cat.id ? "default" : "outline"}
            className={active === cat.id ? "bg-gradient-ember text-primary-foreground" : ""}
            onClick={() => setActive(cat.id)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((product, i) => (
          <ProductCard key={product.slug} product={product} priority={i < 3} />
        ))}
      </div>
    </div>
  );
}
