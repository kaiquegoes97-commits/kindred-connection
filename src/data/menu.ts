import heroBurger from "@/assets/hero-burger.jpg";
import burgerDouble from "@/assets/burger-double.jpg";
import burgerBacon from "@/assets/burger-bacon.jpg";
import burgerVeggie from "@/assets/burger-veggie.jpg";
import sideFries from "@/assets/side-fries.jpg";
import drinks from "@/assets/drinks.jpg";

export type AddonGroup = {
  id: string;
  label: string;
  /** "single" = escolha única obrigatória, "multi" = múltipla escolha */
  type: "single" | "multi";
  required?: boolean;
  max?: number;
  options: { id: string; label: string; price: number }[];
};

export type Product = {
  slug: string;
  name: string;
  category: CategoryId;
  description: string;
  longDescription: string;
  price: number;
  image: string;
  tags?: string[];
  featured?: boolean;
  addonGroups: AddonGroup[];
};

export type CategoryId = "burgers" | "acompanhamentos" | "bebidas";

export const categories: { id: CategoryId; label: string; description: string }[] = [
  { id: "burgers", label: "Burgers", description: "Carne fresca moída no dia, selada na chapa a 250°C." },
  { id: "acompanhamentos", label: "Acompanhamentos", description: "Fritura seca, crocante e bem temperada." },
  { id: "bebidas", label: "Bebidas", description: "Para equilibrar a gordura na medida certa." },
];

const pontoGroup: AddonGroup = {
  id: "ponto",
  label: "Ponto da carne",
  type: "single",
  required: true,
  options: [
    { id: "mal", label: "Mal passado", price: 0 },
    { id: "ao-ponto", label: "Ao ponto", price: 0 },
    { id: "bem", label: "Bem passado", price: 0 },
  ],
};

const extrasGroup: AddonGroup = {
  id: "extras",
  label: "Adicionais",
  type: "multi",
  max: 6,
  options: [
    { id: "burger-extra", label: "Carne extra 120g", price: 14 },
    { id: "cheddar", label: "Cheddar maturado", price: 6 },
    { id: "bacon", label: "Bacon crocante", price: 7 },
    { id: "onion", label: "Cebola caramelizada", price: 5 },
    { id: "picles", label: "Picles artesanal", price: 4 },
    { id: "molho", label: "Molho da casa extra", price: 4 },
  ],
};

const removerGroup: AddonGroup = {
  id: "remover",
  label: "Remover ingredientes",
  type: "multi",
  options: [
    { id: "sem-cebola", label: "Sem cebola", price: 0 },
    { id: "sem-picles", label: "Sem picles", price: 0 },
    { id: "sem-molho", label: "Sem molho", price: 0 },
  ],
};

export const products: Product[] = [
  {
    slug: "smash-classico",
    name: "Smash Clássico",
    category: "burgers",
    description: "Blend 160g, cheddar derretido, cebola na chapa e molho da casa.",
    longDescription:
      "Nosso burger assinatura: blend de acém e peito 160g esmagado na chapa quente para formar crosta, cheddar maturado derretido, cebola caramelizada lentamente e molho autoral no pão brioche assado no dia.",
    price: 36,
    image: heroBurger,
    tags: ["Mais pedido"],
    featured: true,
    addonGroups: [pontoGroup, extrasGroup, removerGroup],
  },
  {
    slug: "duplo-cheddar",
    name: "Duplo Cheddar",
    category: "burgers",
    description: "Duas carnes 120g, dobro de cheddar e alface crocante.",
    longDescription:
      "Para quem não brinca em serviço: duas carnes de 120g, camadas generosas de cheddar maturado, alface crocante e maionese defumada no pão brioche.",
    price: 46,
    image: burgerDouble,
    tags: ["Duplo"],
    featured: true,
    addonGroups: [pontoGroup, extrasGroup, removerGroup],
  },
  {
    slug: "bacon-lover",
    name: "Bacon Lover",
    category: "burgers",
    description: "Carne 160g, bacon crocante e barbecue defumado da casa.",
    longDescription:
      "Bacon em fatias grossas assado até ficar vidrado, carne 160g, queijo prato e barbecue defumado feito na casa com melaço e páprica.",
    price: 44,
    image: burgerBacon,
    tags: ["Defumado"],
    featured: true,
    addonGroups: [pontoGroup, extrasGroup, removerGroup],
  },
  {
    slug: "portobello-veggie",
    name: "Portobello Veggie",
    category: "burgers",
    description: "Portobello grelhado, rúcula, queijo vegetal e aioli de ervas.",
    longDescription:
      "Cogumelos portobello marinados e grelhados na brasa, rúcula fresca, queijo vegetal e aioli de ervas. Vegetariano sem abrir mão do umami.",
    price: 39,
    image: burgerVeggie,
    tags: ["Vegetariano"],
    addonGroups: [extrasGroup, removerGroup],
  },
  {
    slug: "fritas-trufadas",
    name: "Fritas Trufadas",
    category: "acompanhamentos",
    description: "Batata rústica, sal de trufas e parmesão.",
    longDescription:
      "Batatas cortadas grossas, fritura dupla para máxima crocância, finalizadas com sal de trufas e parmesão ralado na hora.",
    price: 28,
    image: sideFries,
    tags: ["Para dividir"],
    addonGroups: [
      {
        id: "porcao",
        label: "Tamanho da porção",
        type: "single",
        required: true,
        options: [
          { id: "individual", label: "Individual", price: 0 },
          { id: "grande", label: "Grande (2 pessoas)", price: 12 },
        ],
      },
      {
        id: "molhos",
        label: "Molhos para acompanhar",
        type: "multi",
        max: 3,
        options: [
          { id: "cheddar-molho", label: "Cheddar cremoso", price: 6 },
          { id: "barbecue", label: "Barbecue defumado", price: 5 },
          { id: "aioli", label: "Aioli de ervas", price: 5 },
        ],
      },
    ],
  },
  {
    slug: "onion-rings",
    name: "Onion Rings",
    category: "acompanhamentos",
    description: "Anéis de cebola empanados na cerveja com maionese defumada.",
    longDescription:
      "Anéis de cebola doce empanados em massa de cerveja, fritos até dourar, servidos com maionese defumada.",
    price: 26,
    image: sideFries,
    addonGroups: [
      {
        id: "molhos-or",
        label: "Molhos para acompanhar",
        type: "multi",
        max: 3,
        options: [
          { id: "cheddar-molho", label: "Cheddar cremoso", price: 6 },
          { id: "barbecue", label: "Barbecue defumado", price: 5 },
        ],
      },
    ],
  },
  {
    slug: "milkshake-artesanal",
    name: "Milkshake Artesanal",
    category: "bebidas",
    description: "Sorvete artesanal batido na hora, 400ml.",
    longDescription: "Milkshake cremoso feito com sorvete artesanal e leite integral, batido na hora. 400ml.",
    price: 24,
    image: drinks,
    addonGroups: [
      {
        id: "sabor",
        label: "Sabor",
        type: "single",
        required: true,
        options: [
          { id: "chocolate", label: "Chocolate belga", price: 0 },
          { id: "baunilha", label: "Baunilha de Madagascar", price: 0 },
          { id: "morango", label: "Morango", price: 0 },
          { id: "doce-leite", label: "Doce de leite", price: 3 },
        ],
      },
    ],
  },
  {
    slug: "refrigerante-artesanal",
    name: "Refrigerante Artesanal",
    category: "bebidas",
    description: "Garrafa 355ml, produção local.",
    longDescription: "Refrigerante artesanal em garrafa de vidro 355ml, com menos açúcar e mais sabor.",
    price: 14,
    image: drinks,
    addonGroups: [
      {
        id: "sabor-refri",
        label: "Sabor",
        type: "single",
        required: true,
        options: [
          { id: "cola", label: "Cola", price: 0 },
          { id: "guarana", label: "Guaraná", price: 0 },
          { id: "limao", label: "Limão siciliano", price: 0 },
        ],
      },
    ],
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const formatPrice = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
