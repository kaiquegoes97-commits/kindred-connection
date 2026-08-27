import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { site, whatsappLink } from "@/config/site";
import { formatPrice } from "@/data/menu";
import { useCart } from "@/lib/cart";
import { buildOrderMessage } from "@/lib/order-message";

const title = `Checkout — ${site.name}`;
const description = "Confirme seus dados e envie o pedido diretamente para o WhatsApp da hamburgueria.";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: CheckoutPage,
});

const schema = z
  .object({
    nome: z.string().trim().min(3, "Informe seu nome completo").max(80),
    telefone: z
      .string()
      .trim()
      .min(10, "Telefone inválido")
      .max(20)
      .regex(/^[0-9()+\-\s]+$/, "Use apenas números e símbolos de telefone"),
    modo: z.enum(["entrega", "retirada"]),
    endereco: z.string().trim().max(120).optional(),
    numero: z.string().trim().max(10).optional(),
    bairro: z.string().trim().max(60).optional(),
    complemento: z.string().trim().max(80).optional(),
    pagamento: z.enum(["pix", "cartao", "dinheiro"]),
    troco: z.string().trim().max(20).optional(),
    observacoes: z.string().trim().max(300).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.modo === "entrega") {
      if (!data.endereco || data.endereco.length < 3)
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["endereco"], message: "Informe a rua" });
      if (!data.numero) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["numero"], message: "Informe o número" });
      if (!data.bairro || data.bairro.length < 2)
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["bairro"], message: "Informe o bairro" });
    }
  });

type FormValues = z.infer<typeof schema>;

function CheckoutPage() {
  const { items, subtotal, clear, hydrated } = useCart();
  const [sentLink, setSentLink] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { nome: "", telefone: "", modo: "entrega", pagamento: "pix" },
  });

  const modo = form.watch("modo");
  const pagamento = form.watch("pagamento");
  const errors = form.formState.errors;

  function onSubmit(values: FormValues) {
    if (items.length === 0) {
      toast.error("Seu carrinho está vazio.");
      return;
    }
    const message = buildOrderMessage(items, values);
    const url = whatsappLink(message);
    setSentLink(url);
    window.open(url, "_blank", "noopener,noreferrer");
    clear();
    toast.success("Pedido gerado! Confirme o envio no WhatsApp.");
  }

  if (sentLink) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-display text-4xl">Pedido gerado!</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Abrimos o WhatsApp com o resumo do seu pedido. Se a janela não abriu, use o botão abaixo.
        </p>
        <Button asChild className="mt-6 bg-gradient-ember text-primary-foreground shadow-ember">
          <a href={sentLink} target="_blank" rel="noreferrer noopener">
            <MessageCircle className="size-4" aria-hidden="true" /> Abrir WhatsApp
          </a>
        </Button>
        <Button asChild variant="ghost" className="mt-3 w-full">
          <Link to="/cardapio">Fazer novo pedido</Link>
        </Button>
      </div>
    );
  }

  if (hydrated && items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-display text-4xl">Carrinho vazio</h1>
        <p className="mt-3 text-sm text-muted-foreground">Adicione itens para finalizar o pedido.</p>
        <Button asChild className="mt-6 bg-gradient-ember text-primary-foreground">
          <Link to="/cardapio">Ver cardápio</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-5xl sm:text-6xl">
        Finalizar <span className="text-gradient-ember">pedido</span>
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">{description}</p>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="mt-10 space-y-8">
        <fieldset className="rounded-2xl border border-border bg-card p-6">
          <legend className="px-2 font-display text-xl">Seus dados</legend>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" autoComplete="name" aria-invalid={!!errors.nome} className="mt-2" {...form.register("nome")} />
              {errors.nome && <p className="mt-1 text-xs text-destructive">{errors.nome.message}</p>}
            </div>
            <div>
              <Label htmlFor="telefone">Telefone / WhatsApp</Label>
              <Input
                id="telefone"
                inputMode="tel"
                autoComplete="tel"
                placeholder="(00) 00000-0000"
                aria-invalid={!!errors.telefone}
                className="mt-2"
                {...form.register("telefone")}
              />
              {errors.telefone && <p className="mt-1 text-xs text-destructive">{errors.telefone.message}</p>}
            </div>
          </div>
        </fieldset>

        <fieldset className="rounded-2xl border border-border bg-card p-6">
          <legend className="px-2 font-display text-xl">Entrega</legend>
          <RadioGroup
            className="mt-4 flex flex-wrap gap-4"
            value={modo}
            onValueChange={(v) => form.setValue("modo", v as FormValues["modo"])}
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="entrega" id="modo-entrega" />
              <Label htmlFor="modo-entrega" className="font-normal">
                Entrega
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="retirada" id="modo-retirada" />
              <Label htmlFor="modo-retirada" className="font-normal">
                Retirada no balcão
              </Label>
            </div>
          </RadioGroup>

          {modo === "entrega" && (
            <div className="mt-5 grid gap-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <Label htmlFor="endereco">Rua</Label>
                <Input id="endereco" autoComplete="address-line1" className="mt-2" {...form.register("endereco")} />
                {errors.endereco && <p className="mt-1 text-xs text-destructive">{errors.endereco.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="numero">Número</Label>
                <Input id="numero" inputMode="numeric" className="mt-2" {...form.register("numero")} />
                {errors.numero && <p className="mt-1 text-xs text-destructive">{errors.numero.message}</p>}
              </div>
              <div className="sm:col-span-3">
                <Label htmlFor="bairro">Bairro</Label>
                <Input id="bairro" className="mt-2" {...form.register("bairro")} />
                {errors.bairro && <p className="mt-1 text-xs text-destructive">{errors.bairro.message}</p>}
              </div>
              <div className="sm:col-span-3">
                <Label htmlFor="complemento">Complemento (opcional)</Label>
                <Input id="complemento" className="mt-2" {...form.register("complemento")} />
              </div>
            </div>
          )}
        </fieldset>

        <fieldset className="rounded-2xl border border-border bg-card p-6">
          <legend className="px-2 font-display text-xl">Pagamento</legend>
          <RadioGroup
            className="mt-4 space-y-2"
            value={pagamento}
            onValueChange={(v) => form.setValue("pagamento", v as FormValues["pagamento"])}
          >
            {[
              { id: "pix", label: "PIX" },
              { id: "cartao", label: "Cartão na entrega" },
              { id: "dinheiro", label: "Dinheiro" },
            ].map((opt) => (
              <div key={opt.id} className="flex items-center gap-2">
                <RadioGroupItem value={opt.id} id={`pg-${opt.id}`} />
                <Label htmlFor={`pg-${opt.id}`} className="font-normal">
                  {opt.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {pagamento === "dinheiro" && (
            <div className="mt-4 max-w-xs">
              <Label htmlFor="troco">Troco para</Label>
              <Input id="troco" inputMode="numeric" placeholder="R$ 100,00" className="mt-2" {...form.register("troco")} />
            </div>
          )}

          <div className="mt-5">
            <Label htmlFor="observacoes">Observações do pedido (opcional)</Label>
            <Textarea id="observacoes" className="mt-2" maxLength={300} {...form.register("observacoes")} />
          </div>
        </fieldset>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-xl">Resumo</h2>
          <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
            {items.map((i) => (
              <li key={i.lineId} className="flex justify-between gap-4">
                <span>
                  {i.quantity}x {i.name}
                </span>
                <span className="text-foreground">{formatPrice((i.basePrice + i.addons.reduce((s, a) => s + a.price, 0)) * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <Separator className="my-4" />
          <div className="flex items-center justify-between">
            <span className="font-display text-2xl">Total</span>
            <span className="text-2xl font-semibold text-primary">{formatPrice(subtotal)}</span>
          </div>

          <Button
            type="submit"
            size="lg"
            className="mt-6 w-full bg-gradient-ember text-primary-foreground shadow-ember transition-transform hover:scale-[1.01]"
          >
            <MessageCircle className="size-4" aria-hidden="true" /> Enviar pedido no WhatsApp
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            O pedido é confirmado no WhatsApp {site.whatsappDisplay}. A taxa de entrega é combinada no atendimento.
          </p>
        </div>
      </form>
    </div>
  );
}
