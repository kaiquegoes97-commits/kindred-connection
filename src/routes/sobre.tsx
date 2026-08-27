import { createFileRoute, Link } from "@tanstack/react-router";

import heroBurger from "@/assets/hero-burger.jpg";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";

const title = `Sobre — ${site.name}`;
const description =
  "Conheça a história, a técnica e os ingredientes por trás dos nossos smash burgers artesanais.";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: SobrePage,
});

function SobrePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-5xl sm:text-6xl">
        A nossa <span className="text-gradient-ember">obsessão</span>
      </h1>

      <div className="mt-8 grid gap-10 md:grid-cols-2 md:items-center">
        <div className="overflow-hidden rounded-3xl border border-border">
          <img
            src={heroBurger}
            alt="Hambúrguer artesanal saindo da chapa"
            width={1600}
            height={1200}
            loading="lazy"
            className="aspect-4/3 w-full object-cover"
          />
        </div>
        <div className="space-y-4 text-muted-foreground">
          <p>
            A {site.name} nasceu de uma ideia simples: fazer poucos burgers, mas fazer muito bem. Cada blend é moído no
            dia, cada pão é assado localmente e cada molho é desenvolvido na casa.
          </p>
          <p>
            Trabalhamos com a técnica smash — a carne é prensada na chapa em alta temperatura para criar aquela crosta
            caramelizada que sela o suco por dentro.
          </p>
          <p>
            Nada de cardápio infinito. Nada de atalho. Só ingredientes bons, fogo alto e tempo certo.
          </p>
          <Button asChild className="bg-gradient-ember text-primary-foreground shadow-ember">
            <Link to="/cardapio">Ver o cardápio</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
