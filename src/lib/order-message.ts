import { formatPrice } from "@/data/menu";
import { site } from "@/config/site";
import { lineTotal, type CartItem } from "@/lib/cart";

export type CheckoutData = {
  nome: string;
  telefone: string;
  modo: "entrega" | "retirada";
  endereco?: string;
  numero?: string;
  bairro?: string;
  complemento?: string;
  pagamento: "pix" | "cartao" | "dinheiro";
  troco?: string;
  observacoes?: string;
};

const paymentLabel: Record<CheckoutData["pagamento"], string> = {
  pix: "PIX",
  cartao: "Cartão (maquininha na entrega)",
  dinheiro: "Dinheiro",
};

export function buildOrderMessage(items: CartItem[], data: CheckoutData) {
  const subtotal = items.reduce((s, i) => s + lineTotal(i), 0);
  const delivery = data.modo === "entrega" ? site.deliveryFee : 0;
  const total = subtotal + delivery;

  const lines: string[] = [];
  lines.push(`*NOVO PEDIDO — ${site.name}*`);
  lines.push("");
  lines.push(`*Cliente:* ${data.nome}`);
  lines.push(`*Telefone:* ${data.telefone}`);
  lines.push(`*Modo:* ${data.modo === "entrega" ? "Entrega" : "Retirada no balcão"}`);
  if (data.modo === "entrega") {
    const addr = [`${data.endereco ?? ""}, ${data.numero ?? ""}`, data.bairro, data.complemento]
      .filter((p) => p && p.trim())
      .join(" — ");
    lines.push(`*Endereço:* ${addr}`);
  }
  lines.push("");
  lines.push("*ITENS*");
  items.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.quantity}x ${item.name} — ${formatPrice(lineTotal(item))}`);
    item.addons.forEach((a) => {
      lines.push(`   • ${a.groupLabel}: ${a.label}${a.price > 0 ? ` (+${formatPrice(a.price)})` : ""}`);
    });
    if (item.notes?.trim()) lines.push(`   • Obs: ${item.notes.trim()}`);
  });
  lines.push("");
  lines.push(`*Subtotal:* ${formatPrice(subtotal)}`);
  lines.push(`*Entrega:* ${delivery > 0 ? formatPrice(delivery) : data.modo === "entrega" ? "A combinar" : "—"}`);
  lines.push(`*TOTAL:* ${formatPrice(total)}`);
  lines.push("");
  lines.push(`*Pagamento:* ${paymentLabel[data.pagamento]}`);
  if (data.pagamento === "dinheiro" && data.troco?.trim()) {
    lines.push(`*Troco para:* ${data.troco.trim()}`);
  }
  if (data.observacoes?.trim()) {
    lines.push("");
    lines.push(`*Observações:* ${data.observacoes.trim()}`);
  }
  return lines.join("\n");
}
