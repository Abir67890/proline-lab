import { NextResponse } from "next/server";
import { readdir } from "node:fs/promises";
import path from "node:path";

const PRODUCT_DIR = path.join(process.cwd(), "public", "Produits");
const MEDIA_DIR = path.join(process.cwd(), "public", "media");

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

const CATEGORY_RULES: Array<{ category: string; terms: string[] }> = [
  { category: "Cuisine", terms: ["cuisine", "degraiss", "vaiss", "plaque", "lave verre", "machine", "rinçage", "rin" ] },
  { category: "Linge", terms: ["linge", "lessive", "assoupl", "blanch", "tache", "deter", "lavage", "pro tiss", "parf linge" ] },
  { category: "Piscine", terms: ["pool", "piscine", "chlore", "tartro" ] },
  { category: "Parfums", terms: ["parf", "parfum", "moquette", "ambiance"] },
  { category: "Hygiène", terms: ["lave mains", "sanitaire", "gel mains", "hygiene"] },
  { category: "Entretien", terms: ["vitre", "marbre", "shine", "mousse", "sol", "tache", "pure"] },
];

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(value: string) {
  return new Set(normalize(value).split(" ").filter((part) => part.length >= 3));
}

function classify(name: string) {
  const hay = normalize(name);
  for (const rule of CATEGORY_RULES) {
    if (rule.terms.some((term) => hay.includes(normalize(term)))) return rule.category;
  }
  return "Professionnel";
}

async function walk(dir: string): Promise<string[]> {
  const result: string[] = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const absolute = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        result.push(...await walk(absolute));
      } else if (IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
        result.push(absolute);
      }
    }
  } catch {
    return result;
  }
  return result;
}

function toPublicPath(absolutePath: string) {
  const relative = path.relative(path.join(process.cwd(), "public"), absolutePath).split(path.sep).join("/");
  return `/${encodeURI(relative).replace(/%2F/gi, "/")}`;
}

function scoreImage(productName: string, category: string, imagePath: string) {
  const hay = normalize(imagePath);
  const productTokens = tokens(productName);
  let score = 0;

  for (const token of productTokens) {
    if (hay.includes(token)) score += token.length >= 6 ? 9 : 5;
  }

  const categoryTokens = tokens(category);
  for (const token of categoryTokens) {
    if (hay.includes(token)) score += 4;
  }

  const categoryHints: Record<string, string[]> = {
    Cuisine: ["cuisine", "kitchen", "restaurant", "vaiss", "degraiss", "plaque"],
    Linge: ["linge", "laundry", "buanderie", "textile", "lessive"],
    Piscine: ["piscine", "pool"],
    Parfums: ["parfum", "fragrance", "moquette", "room"],
    Hygiène: ["sanitaire", "toilet", "bath", "hand", "hygiene"],
    Entretien: ["clean", "surface", "vitre", "glass", "marbre", "floor", "sol"],
    Professionnel: ["product", "proline", "clean", "hygiene"],
  };

  for (const hint of categoryHints[category] ?? categoryHints.Professionnel) {
    if (hay.includes(normalize(hint))) score += 3;
  }

  if (hay.includes("gallery")) score += 1;
  if (hay.includes("product")) score += 2;
  return score;
}

export async function GET() {
  try {
    const [pdfEntries, imageEntries] = await Promise.all([
      readdir(PRODUCT_DIR, { withFileTypes: true }),
      walk(MEDIA_DIR),
    ]);

    const images = imageEntries.sort((a, b) => a.localeCompare(b));
    const imageUrls = images.map(toPublicPath);
    const products = pdfEntries
      .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".pdf"))
      .map((entry) => {
        const name = entry.name.replace(/\.pdf$/i, "");
        const category = classify(name);
        const ranked = images
          .map((image, index) => ({
            image,
            index,
            score: scoreImage(name, category, image),
          }))
          .sort((a, b) => b.score - a.score || a.index - b.index);

        const best = ranked[0];
        const categoryPool = ranked.filter((item) => item.score >= 3);
        const fallbackPool = categoryPool.length ? categoryPool : ranked;
        const fallback = fallbackPool.length ? fallbackPool[stableIndex(name) % fallbackPool.length] : null;
        const chosen = best && best.score >= 10 ? best : fallback;

        return {
          id: normalize(name).replace(/\s+/g, "-") || crypto.randomUUID(),
          name,
          file: entry.name,
          url: `/Produits/${encodeURIComponent(entry.name)}`,
          category,
          photo: chosen ? toPublicPath(chosen.image) : null,
          photoAlt: chosen ? `${name} — ${category}` : `${name} — solution professionnelle Proline Lab`,
          photoSource: best && best.score >= 10 ? "product-match" : chosen ? "category-fallback" : "generic",
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name, "fr"));

    return NextResponse.json({
      products,
      count: products.length,
      images: imageUrls.length,
      mediaRoot: "/media",
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("/api/products:", error);
    return NextResponse.json(
      { products: [], count: 0, images: 0, error: "Impossible de lire les produits." },
      { status: 500 },
    );
  }
}

function stableIndex(value: string) {
  return normalize(value).split("").reduce((total, char) => (total * 31 + char.charCodeAt(0)) >>> 0, 7);
}
