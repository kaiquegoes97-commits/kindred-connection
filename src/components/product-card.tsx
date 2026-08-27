import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { formatPrice, type Product } from "@/data/menu";
import { Badge } from "@/components/ui/badge";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  return (
    <Link
      to="/produto/$slug"
      params={{ slug: product.slug }}
      aria-label={`Ver ${product.name}`}
      className="card-hover group flex flex-col overflow-hidden rounded-2xl border border-border bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          width={1024}
          height={768}
          loading={priority ? "eager" : "lazy"}
          className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {product.tags?.[0] && (
          <Badge className="absolute left-3 top-3 bg-gradient-ember text-primary-foreground">
            {product.tags[0]}
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-2xl leading-none">{product.name}</h3>
          <ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:text-primary" aria-hidden="true" />
        </div>
        <p className="flex-1 text-sm text-muted-foreground">{product.description}</p>
        <p className="pt-2 text-lg font-semibold text-primary">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
