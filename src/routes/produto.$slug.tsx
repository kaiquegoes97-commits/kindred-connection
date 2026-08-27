import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { site } from "@/config/site";
import { formatPrice, getProduct, products } from "@/data/menu";
import { useCart, type CartAddon } from "@/lib/cart";

export const Route = createFileRoute("/produto/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: `Produto indisponível — ${site.name}` }, { name: "robots", content: "noindex" }] };
    }
    const t = `${loaderData.product.name} — ${site.name}`;
    return {
      meta: [
        { title: t },
        { name: "description", content: loaderData.product.description },
        { property: "og:title", content: t },
        { property: "og:description", content: loaderData.product.description },
      ],
    };
  },
  notFoundComponent: ProductNotFound,
  component: ProductPage,
});

function ProductNotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-display text-4xl">Item não encontrado</h1>
      <p className="mt-3 text-sm text-muted-foreground">Este produto saiu do cardápio ou o link está errado.</p>
      <Button asChild className="mt-6 bg-gradient-ember text-primary-foreground">
        <Link to="/cardapio">Voltar ao cardápio</Link>
      </Button>
    </div>
  );
}

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const [selection, setSelection] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(product.addonGroups.map((g) => [g.id, []])),
  );
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const addons: CartAddon[] = useMemo(() => {
    return product.addonGroups.flatMap((group) =>
      (selection[group.id] ?? []).flatMap((optId) => {
        const opt = group.options.find((o) => o.id === optId);
        return opt ? [{ groupId: group.id, groupLabel: group.label, id: opt.id, label: opt.label, price: opt.price }] : [];
      }),
    );
  }, [product.addonGroups, selection]);

  const unitPrice = product.price + addons.reduce((s, a) => s + a.price, 0);
  const total = unitPrice * quantity;

  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 3);

  function toggleMulti(groupId: string, optionId: string, max?: number) {
    setSelection((prev) => {
      const current = prev[groupId] ?? [];
      if (current.includes(optionId)) return { ...prev, [groupId]: current.filter((i) => i !== optionId) };
      if (max && current.length >= max) {
        toast.error(`Máximo de ${max} opções neste grupo.`);
        return prev;
      }
      return { ...prev, [groupId]: [...current, optionId] };
    });
  }

  function handleAdd() {
    const missing = product.addonGroups
      .filter((g) => g.required && (selection[g.id] ?? []).length === 0)
      .map((g) => g.id);
    setErrors(missing);
    if (missing.length > 0) {
      toast.error("Escolha as opções obrigatórias antes de continuar.");
      document.getElementById(`group-${missing[0]}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    addItem({
      slug: product.slug,
      name: product.name,
      image: product.image,
      basePrice: product.price,
      quantity,
      addons,
      notes: notes.trim() || undefined,
    });
    toast.success(`${quantity}x ${product.name} adicionado ao carrinho`, {
      action: { label: "Ver carrinho", onClick: () => navigate({ to: "/carrinho" }) },
    });
    setQuantity(1);
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
        <Link to="/cardapio">
          <ArrowLeft className="size-4" aria-hidden="true" /> Voltar ao cardápio
        </Link>
      </Button>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-3xl border border-border">
            <img
              src={product.image}
              alt={product.name}
              width={1024}
              height={1024}
              className="aspect-square w-full object-cover"
            />
          </div>
        </div>

        <div>
          <div className="flex flex-wrap gap-2">
            {product.tags?.map((tag) => (
              <Badge key={tag} className="bg-gradient-ember text-primary-foreground">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="mt-3 font-display text-5xl sm:text-6xl">{product.name}</h1>
          <p className="mt-3 text-muted-foreground">{product.longDescription}</p>
          <p className="mt-4 text-2xl font-semibold text-primary">{formatPrice(product.price)}</p>

          <div className="mt-9 space-y-8">
            {product.addonGroups.map((group) => (
              <fieldset
                key={group.id}
                id={`group-${group.id}`}
                className={`rounded-2xl border p-5 transition-colors ${
                  errors.includes(group.id) ? "border-destructive" : "border-border"
                }`}
              >
                <legend className="flex items-center gap-2 px-2 font-display text-xl">
                  {group.label}
                  {group.required && (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                      Obrigatório
                    </span>
                  )}
                </legend>

                {group.type === "single" ? (
                  <RadioGroup
                    className="mt-4 space-y-1"
                    value={selection[group.id]?.[0] ?? ""}
                    onValueChange={(v) => {
                      setSelection((prev) => ({ ...prev, [group.id]: [v] }));
                      setErrors((prev) => prev.filter((e) => e !== group.id));
                    }}
                  >
                    {group.options.map((opt) => (
                      <div
                        key={opt.id}
                        className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-secondary/60"
                      >
                        <RadioGroupItem value={opt.id} id={`${group.id}-${opt.id}`} />
                        <Label htmlFor={`${group.id}-${opt.id}`} className="flex-1 cursor-pointer text-sm font-normal">
                          {opt.label}
                        </Label>
                        {opt.price > 0 && <span className="text-sm text-primary">+{formatPrice(opt.price)}</span>}
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="mt-4 space-y-1">
                    {group.options.map((opt) => (
                      <div
                        key={opt.id}
                        className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-secondary/60"
                      >
                        <Checkbox
                          id={`${group.id}-${opt.id}`}
                          checked={(selection[group.id] ?? []).includes(opt.id)}
                          onCheckedChange={() => toggleMulti(group.id, opt.id, group.max)}
                        />
                        <Label htmlFor={`${group.id}-${opt.id}`} className="flex-1 cursor-pointer text-sm font-normal">
                          {opt.label}
                        </Label>
                        {opt.price > 0 && <span className="text-sm text-primary">+{formatPrice(opt.price)}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </fieldset>
            ))}

            <div>
              <Label htmlFor="obs" className="font-display text-xl">
                Observações
              </Label>
              <Textarea
                id="obs"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={200}
                placeholder="Ex.: capriche no molho, cortar ao meio…"
                className="mt-3"
              />
            </div>
          </div>

          <div className="sticky bottom-0 z-30 mt-8 -mx-4 border-t border-border bg-background/95 p-4 backdrop-blur-xl sm:-mx-6 lg:mx-0 lg:rounded-2xl lg:border">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-full border border-border p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-full"
                  aria-label="Diminuir quantidade"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Minus className="size-4" aria-hidden="true" />
                </Button>
                <span className="w-8 text-center font-semibold" aria-live="polite">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-full"
                  aria-label="Aumentar quantidade"
                  onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                >
                  <Plus className="size-4" aria-hidden="true" />
                </Button>
              </div>

              <Button
                onClick={handleAdd}
                size="lg"
                className="flex-1 bg-gradient-ember text-primary-foreground shadow-ember transition-transform hover:scale-[1.02]"
              >
                <ShoppingBag className="size-4" aria-hidden="true" />
                Adicionar · {formatPrice(total)}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20" aria-labelledby="relacionados">
          <h2 id="relacionados" className="font-display text-3xl">
            Combina bem com
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.slug}
                to="/produto/$slug"
                params={{ slug: p.slug }}
                className="card-hover flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  width={96}
                  height={96}
                  loading="lazy"
                  className="size-20 rounded-xl object-cover"
                />
                <span>
                  <span className="block font-display text-xl">{p.name}</span>
                  <span className="block text-sm text-primary">{formatPrice(p.price)}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
