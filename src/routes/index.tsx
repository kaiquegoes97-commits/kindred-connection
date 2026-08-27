import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, Beef, Timer, MapPin, MessageCircle, Star } from "lucide-react";

import heroBurger from "@/assets/hero-burger.jpg";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { fullAddress, site, whatsappLink } from "@/config/site";
import { products } from "@/data/menu";

const title = `${site.name} — Hamburgueria Premium Artesanal`;
const description = site.shortDescription;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Index,
});

const pillars = [
  { icon: Beef, title: "Carne fresca", text: "Blend moído no dia, selado na chapa a 250°C para crosta perfeita." },
  { icon: Flame, title: "Fogo alto", text: "Técnica smash e brasa controlada em cada pedido, sem atalhos." },
  { icon: Timer, title: "Pronto rápido", text: "Pedido direto no WhatsApp e produção iniciada na hora." },
];

function Index() {
  const featured = products.filter((p) => p.featured);

  return (
    <>
      <section className="grain relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroBurger}
            alt="Hambúrguer artesanal com cheddar derretido e cebola caramelizada"
            width={1600}
            height={1200}
            className="size-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/40" />
        </div>

        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-start px-4 py-28 sm:px-6 md:py-40">
          <span className="animate-rise inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <Star className="size-3.5" aria-hidden="true" /> Smash artesanal
          </span>

          <h1 className="animate-rise mt-6 max-w-3xl font-display text-6xl leading-[0.95] sm:text-7xl md:text-8xl">
            <span className="text-gradient-ember">{site.name}</span>
            <br />
            {site.tagline}
          </h1>

          <p className="animate-rise mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">{description}</p>

          <div className="animate-rise mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button asChild size="lg" className="bg-gradient-ember text-primary-foreground shadow-ember transition-transform hover:scale-[1.03]">
              <Link to="/cardapio">Ver cardápio</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={whatsappLink(`Olá, ${site.name}! Gostaria de tirar uma dúvida.`)} target="_blank" rel="noreferrer noopener">
                <MessageCircle className="size-4" aria-hidden="true" /> Falar no WhatsApp
              </a>
            </Button>
          </div>

          <p className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4 text-primary" aria-hidden="true" /> {fullAddress}
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6" aria-labelledby="pilares">
        <h2 id="pilares" className="sr-only">
          Nossos diferenciais
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.title} className="card-hover rounded-2xl border border-border bg-card p-6">
              <p.icon className="size-7 text-primary" aria-hidden="true" />
              <h3 className="mt-4 font-display text-2xl">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6" aria-labelledby="destaques">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="destaques" className="font-display text-4xl sm:text-5xl">
              Os mais <span className="text-gradient-ember">pedidos</span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">Clássicos que saem da chapa o tempo inteiro.</p>
          </div>
          <Button asChild variant="ghost">
            <Link to="/cardapio">Cardápio completo</Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product, i) => (
            <ProductCard key={product.slug} product={product} priority={i === 0} />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-6xl px-4 sm:px-6">
        <div className="grain relative overflow-hidden rounded-3xl border border-primary/30 bg-card p-10 text-center">
          <h2 className="font-display text-4xl sm:text-5xl">
            Bateu a <span className="text-gradient-ember">fome</span>?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Monte seu pedido no cardápio digital e finalize em segundos pelo WhatsApp.
          </p>
          <Button asChild size="lg" className="mt-7 bg-gradient-ember text-primary-foreground shadow-ember transition-transform hover:scale-[1.03]">
            <Link to="/cardapio">Montar meu pedido</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
