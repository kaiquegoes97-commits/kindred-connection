/**
 * Placeholders centralizados.
 * Substitua os valores abaixo pelos dados reais da hamburgueria.
 * Nenhum dado real foi inventado — tudo aqui é placeholder.
 */
export const site = {
  name: "[NOME DA HAMBURGUERIA]",
  tagline: "Smash burgers artesanais, brasa e obsessão por sabor",
  shortDescription:
    "Hamburgueria premium com carne fresca, pão brioche assado no dia e molhos autorais. Peça pelo cardápio digital e finalize no WhatsApp.",
  /** Somente dígitos, com DDI e DDD. Ex.: 5511999999999 */
  whatsapp: "5500000000000",
  whatsappDisplay: "[WHATSAPP]",
  instagram: "[@INSTAGRAM]",
  instagramUrl: "https://instagram.com/",
  address: {
    street: "[ENDEREÇO - RUA E NÚMERO]",
    district: "[BAIRRO]",
    city: "[CIDADE]",
    state: "[UF]",
    zip: "[CEP]",
  },
  hours: [
    { days: "Terça a Quinta", time: "18h — 23h" },
    { days: "Sexta e Sábado", time: "18h — 00h" },
    { days: "Domingo", time: "18h — 22h" },
    { days: "Segunda", time: "Fechado" },
  ],
  deliveryFee: 0,
  /** Bairros de entrega — placeholders */
  deliveryAreas: ["[BAIRRO 1]", "[BAIRRO 2]", "[BAIRRO 3]"],
} as const;

export const fullAddress = `${site.address.street}, ${site.address.district} — ${site.address.city}/${site.address.state}`;

export const whatsappLink = (message: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
