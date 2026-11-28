const base = "https://www.moswen.app";
const paths = ["", "/servicios", "/portafolio", "/nosotros", "/aplicar"];

export default function sitemap() {
  return paths.map((p) => ({ url: base + p, lastModified: new Date(), priority: p === "" ? 1 : 0.8 }));
}
