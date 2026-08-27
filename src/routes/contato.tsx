import { createFileRoute } from "@tanstack/react-router";
import { Instagram, MapPin, MessageCircle, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { fullAddress, site, whatsappLink } from "@/config/site";

const title = `Contato e endereço — ${site.name}`;
const description = "Endereço, horários de funcionamento, WhatsApp e Instagram da hamburgueria.";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ContatoPage,
});

function ContatoPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-5xl sm:text-6xl">
        Fale <span className="text-gradient-ember">com a gente</span>
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">{description}</p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <div className="card-hover rounded-2xl border border-border bg-card p-6">
          <MapPin className="size-6 text-primary" aria-hidden="true" />
          <h2 className="mt-3 font-display text-2xl">Endereço</h2>
          <address className="mt-2 text-sm not-italic text-muted-foreground">
            {fullAddress}
            <br />
            CEP {site.address.zip}
          </address>
        </div>

        <div className="card-hover rounded-2xl border border-border bg-card p-6">
          <Clock className="size-6 text-primary" aria-hidden="true" />
          <h2 className="mt-3 font-display text-2xl">Horários</h2>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {site.hours.map((h) => (
              <li key={h.days} className="flex justify-between gap-4">
                <span>{h.days}</span>
                <span className="text-foreground">{h.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-hover rounded-2xl border border-border bg-card p-6">
          <MessageCircle className="size-6 text-primary" aria-hidden="true" />
          <h2 className="mt-3 font-display text-2xl">WhatsApp</h2>
          <p className="mt-2 text-sm text-muted-foreground">{site.whatsappDisplay}</p>
          <Button asChild className="mt-4 bg-gradient-ember text-primary-foreground">
            <a href={whatsappLink("Olá! Gostaria de fazer um pedido.")} target="_blank" rel="noreferrer noopener">
              Chamar agora
            </a>
          </Button>
        </div>

        <div className="card-hover rounded-2xl border border-border bg-card p-6">
          <Instagram className="size-6 text-primary" aria-hidden="true" />
          <h2 className="mt-3 font-display text-2xl">Instagram</h2>
          <p className="mt-2 text-sm text-muted-foreground">{site.instagram}</p>
          <Button asChild variant="outline" className="mt-4">
            <a href={site.instagramUrl} target="_blank" rel="noreferrer noopener">
              Seguir
            </a>
          </Button>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-2xl">Áreas de entrega</h2>
        <ul className="mt-3 flex flex-wrap gap-2 text-sm">
          {site.deliveryAreas.map((area) => (
            <li key={area} className="rounded-full border border-border px-3 py-1 text-muted-foreground">
              {area}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
