// Datos del sitio en un solo lugar. Edita aquí textos, precios y proyectos.
export const site = {
  name: "Moswen Designs",
  email: "info@moswen.app",
  whatsapp: "50493157191",
  whatsappLabel: "+504 9315-7191",
  instagram: "https://www.instagram.com/moswen_designs/",
  facebook: "https://www.facebook.com/profile.php?id=61559017957866",
  bookingUrl: "https://api.leadconnectorhq.com/widget/booking/hNmna18ZNhRt6TzfTQTL",
  url: "https://www.moswen.app",
};

export const menuList = [
  { id: 1, path: "/", label: "Inicio" },
  { id: 2, path: "/servicios", label: "Servicios" },
  { id: 3, path: "/portafolio", label: "Portafolio" },
  { id: 4, path: "/nosotros", label: "Nosotros" },
  { id: 5, path: "/aplicar", label: "Aplicar" },
];

export const services = [
  {
    id: 1,
    icon: "brand",
    title: "Marca e identidad",
    description:
      "Logo, paleta, tipografía y aplicaciones para que tu negocio se vea profesional desde el primer día.",
  },
  {
    id: 2,
    icon: "web",
    title: "Sitios web y landing pages",
    description:
      "Páginas rápidas y claras que convierten visitas en clientes, conectadas a tu CRM y a WhatsApp.",
  },
  {
    id: 3,
    icon: "ads",
    title: "Anuncios en Meta",
    description:
      "Campañas en Facebook e Instagram para recibir prospectos calificados. La inversión en anuncios la paga el cliente.",
  },
  {
    id: 4,
    icon: "ai",
    title: "Agentes virtuales con IA",
    description:
      "Un agente que responde por WhatsApp, Instagram y tu sitio las 24 horas, califica prospectos y agenda citas.",
  },
];

export const plans = [
  {
    id: 1,
    title: "Express",
    price: "$450",
    sortInfo: "2 pagos de $225",
    interes: "Landing page",
    features: [
      { id: 1, feature: "Landing page de alta conversión" },
      { id: 2, feature: "Logo básico" },
    ],
  },
  {
    id: 2,
    title: "Starter",
    price: "$850",
    sortInfo: "50% al iniciar, 50% antes de entregar",
    interes: "Marca e identidad visual",
    features: [
      { id: 1, feature: "Landing page de alta conversión" },
      { id: 2, feature: "Starter Identity: logo, variaciones, paleta y tipografías" },
      { id: 3, feature: "Archivos finales en alta resolución" },
    ],
  },
  {
    id: 3,
    title: "Pro",
    price: "$1,500",
    sortInfo: "+ $50/mes de mantenimiento",
    interes: "Sitio web premium",
    features: [
      { id: 1, feature: "Sitio web corporativo (hasta 5 secciones)" },
      { id: 2, feature: "Corporate Branding con manual básico" },
      { id: 3, feature: "Mantenimiento web mensual" },
    ],
  },
];

// Las imágenes de proyectos las elige el cliente. Mientras src sea null se muestra un marcador.
export const projects = [
  { id: 1, src: null, category: "Marca", title: "Tequila Rebel", line: "Identidad y empaque · Línea de bebidas" },
  { id: 2, src: null, category: "Marca", title: "Paco", line: "Identidad y empaque · Hamburguesas, papas y hotdogs" },
  { id: 3, src: null, category: "Marca", title: "Muscle UP_HN", line: "Identidad de marca · Gimnasio" },
  { id: 4, src: null, category: "Marca", title: "Cocoliso Coffee Roasters", line: "Identidad y empaque · Café de especialidad" },
  { id: 5, src: null, category: "Marca", title: "Colegio de Líderes", line: "Identidad corporativa · Papelería" },
  { id: 6, src: null, category: "Marca", title: "Ramfer Inc.", line: "Identidad de marca · Logo y aplicaciones" },
];

export const formOptions = {
  paises: ["Estados Unidos", "Honduras", "Otro"],
  servicios: ["Marca e identidad visual", "Landing page", "Sitio web premium", "Anuncios en Meta", "Agente virtual con IA", "Aún no lo sé"],
  presupuestos: ["Menos de $500", "$500 – $1,000", "$1,000 – $2,500", "Más de $2,500", "Aún no lo sé"],
};
