import { NextResponse } from "next/server";
import { readdir } from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type MediaItem = {
  name: string;
  url: string;
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function categoryFor(name: string) {
  const value = normalize(name);

  if (
    value.includes("linge") ||
    value.includes("assouplissant") ||
    value.includes("blancheur") ||
    value.includes("couleur") ||
    value.includes("lessive") ||
    value.includes("gel linge")
  ) {
    return "Linge";
  }

  if (
    value.includes("vaisselle") ||
    value.includes("verre") ||
    value.includes("plaque") ||
    value.includes("cuisine") ||
    value.includes("degraissant")
  ) {
    return "Cuisine";
  }

  if (
    value.includes("pool") ||
    value.includes("piscine") ||
    value.includes("chlore") ||
    value.includes("mousse")
  ) {
    return "Piscine";
  }

  if (
    value.includes("vitre") ||
    value.includes("marbre") ||
    value.includes("shine") ||
    value.includes("tache") ||
    value.includes("tiss") ||
    value.includes("sol") ||
    value.includes("protiss")
  ) {
    return "Entretien";
  }

  if (
    value.includes("parfum") ||
    value.includes("parf") ||
    value.includes("moquette")
  ) {
    return "Parfums";
  }

  if (
    value.includes("lave mains") ||
    value.includes("sanitaire") ||
    value.includes("hygiene")
  ) {
    return "Hygiène";
  }

  return "Professionnel";
}

async function scanImages(
  directory: string,
  relative = ""
): Promise<MediaItem[]> {
  const results: MediaItem[] = [];

  let entries;

  try {
    entries = await readdir(directory, {
      withFileTypes: true,
    });
  } catch {
    return results;
  }

  for (const entry of entries) {
    const absolute = path.join(
      directory,
      entry.name
    );

    const nextRelative = relative
      ? path.join(relative, entry.name)
      : entry.name;

    if (entry.isDirectory()) {
      const nested = await scanImages(
        absolute,
        nextRelative
      );

      results.push(...nested);
      continue;
    }

    if (
      /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(
        entry.name
      )
    ) {
      const urlPath = nextRelative
        .split(path.sep)
        .map(encodeURIComponent)
        .join("/");

      results.push({
        name: entry.name,
        url: `/media/${urlPath}`,
      });
    }
  }

  return results;
}

function scorePhoto(
  productName: string,
  photoName: string
) {
  const productTokens = normalize(productName)
    .split(" ")
    .filter((token) => token.length >= 3);

  const photo = normalize(photoName);

  let score = 0;

  for (const token of productTokens) {
    if (photo.includes(token)) {
      score += 5;
    }
  }

  const category = normalize(
    categoryFor(productName)
  );

  if (
    category &&
    photo.includes(category)
  ) {
    score += 4;
  }

  return score;
}

function findBestPhoto(
  productName: string,
  photos: MediaItem[],
  index: number
) {
  if (!photos.length) {
    return null;
  }

  let best: MediaItem | null = null;
  let bestScore = 0;

  for (const photo of photos) {
    const score = scorePhoto(
      productName,
      photo.name
    );

    if (score > bestScore) {
      bestScore = score;
      best = photo;
    }
  }

  if (best) {
    return best.url;
  }

  return photos[index % photos.length].url;
}

export async function GET() {
  try {
    const productsDirectory = path.join(
      process.cwd(),
      "public",
      "Produits"
    );

    const mediaDirectory = path.join(
      process.cwd(),
      "public",
      "media"
    );

    const pdfEntries = await readdir(
      productsDirectory,
      { withFileTypes: true }
    );

    const pdfFiles = pdfEntries
      .filter(
        (entry) =>
          entry.isFile() &&
          /\.pdf$/i.test(entry.name)
      )
      .sort((a, b) =>
        a.name.localeCompare(
          b.name,
          "fr",
          { sensitivity: "base" }
        )
      );

    const photos = await scanImages(
      mediaDirectory
    );

    const products = pdfFiles.map(
      (file, index) => {
        const name = file.name
          .replace(/\.pdf$/i, "")
          .replace(/\s*\(\d+\)$/g, "")
          .trim();

        const category = categoryFor(name);

        return {
          id: file.name,
          name,
          file: file.name,
          url:
            "/Produits/" +
            encodeURIComponent(file.name),
          category,
          photo: findBestPhoto(
            name,
            photos,
            index
          ),
        };
      }
    );

    return NextResponse.json(
      {
        products,
        productsCount: products.length,
        photosCount: photos.length,
        categories: Array.from(
          new Set(
            products.map(
              (product) => product.category
            )
          )
        ),
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error(
      "PROLINE /api/products error:",
      error
    );

    return NextResponse.json(
      {
        products: [],
        productsCount: 0,
        photosCount: 0,
        categories: [],
        error:
          "Le dossier public/Produits est inaccessible.",
      },
      { status: 500 }
    );
  }
}