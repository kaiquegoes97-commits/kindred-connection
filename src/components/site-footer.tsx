import { Link } from "@tanstack/react-router";
import { Instagram, MapPin, MessageCircle, Clock } from "lucide-react";

import { fullAddress, site, whatsappLink } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/70 bg-card/40">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <h2 className="font-display text-2xl text-gradient-ember">{site.name}</h2>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">{site.shortDescription}</p>
        </div>

        <div>
          <h3 className="font-display text-xl">Onde estamos</h3>
          <address className="mt-3 space-y-2 text-sm not-italic text-muted-foreground">
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              {fullAddress}
            </p>
            <p className="flex items-center gap-2">
              <MessageCircle className="size-4 shrink-0 text-primary" aria-hidden="true" />
              <a className="transition-colors hover:text-foreground" href={whatsappLink("Olá! Gostaria de fazer um pedido.")}>
                {site.whatsappDisplay}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Instagram className="size-4 shrink-0 text-primary" aria-hidden="true" />
              <a
                className="transition-colors hover:text-foreground"
                href={site.instagramUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                {site.instagram}
              </a>
            </p>
          </address>
        </div>

        <div>
          <h3 className="flex items-center gap-2 font-display text-xl">
            <Clock className="size-4 text-primary" aria-hidden="true" /> Horários
          </h3>
          <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            {site.hours.map((h) => (
              <li key={h.days} className="flex justify-between gap-4">
                <span>{h.days}</span>
                <span className="text-foreground">{h.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border/70 py-6 text-center text-xs text-muted-foreground">
        <p>
          © {new Date().getFullYear()} {site.name}. Todos os direitos reservados. ·{" "}
          <Link to="/cardapio" className="hover:text-foreground">
            Cardápio
          </Link>
        </p>
      </div>
    </footer>
  );
}
