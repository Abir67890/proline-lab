"use client";

import { useMemo, useState } from "react";

const products = [
  "3S.pdf",
  "Anti tache minerale.pdf",
  "Anti tache minérale Pro.pdf",
  "Anti tache organique linge-Pro.pdf",
  "Anti-Mousse pour Lessive Textile.pdf",
  "Anti-Tâche Rapide-Pro.pdf",
  "Assouplissant pour Linge.pdf",
  "Clear pool.pdf",
  "degraissant cuisine.pdf",
  "degraissant plaque.pdf",
  "Degrissol.pdf",
  "detqrtrino.pdf",
  "dinol.pdf",
  "dinot pro (1).pdf",
  "dinot pro.pdf",
  "Gel Blancheur Pro.pdf",
  "Gel Couleur Pro.pdf",
  "Instruction de l'utilisation.pdf",
  "Lave mains.pdf",
  "lave vaisselle b.pdf",
  "lave vaisselle BD.pdf",
  "lave vaisselle d.pdf",
  "Lave-Verre Pro.pdf",
  "Lave-Vitre Pro (1).pdf",
  "Lave-Vitre Pro.pdf",
  "Mark Stickers.pdf",
  "parf moquette.pdf",
  "Parf-Linge Pro.pdf",
  "parfum pro.pdf",
  "Pro gel linge.pdf",
  "ProTiss.pdf",
  "Pure Marbre Pro.pdf",
  "pure shine (1).pdf",
  "pure shine plus.pdf",
  "pure shine.pdf",
  "rincage plaque.pdf",
  "Tartro.pdf",
];

function cleanName(filename: string) {
  return filename
    .replace(/\.pdf$/i, "")
    .replace(/\s*\(\d+\)$/g, "")
    .replace(/[-_]+/g, " ")
    .trim();
}

function getCategory(name: string) {
  const value = name.toLowerCase();

  if (
    value.includes("linge") ||
    value.includes("assouplissant") ||
    value.includes("blancheur") ||
    value.includes("couleur") ||
    value.includes("lessive") ||
    value.includes("pro gel")
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
    value.includes("mousse")
  ) {
    return "Piscine";
  }

  if (
    value.includes("vitre") ||
    value.includes("marbre") ||
    value.includes("shine") ||
    value.includes("tache") ||
    value.includes("pro tiss") ||
    value.includes("prottiss")
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

  return "Professionnel";
}

export default function ProductInterface() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Toutes");

  const categories = [
    "Toutes",
    "Cuisine",
    "Linge",
    "Piscine",
    "Entretien",
    "Parfums",
    "Professionnel",
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((file) => {
      const name = cleanName(file);
      const productCategory = getCategory(name);

      const matchesSearch = name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "Toutes" ||
        productCategory === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  return (
    <section className="proline-products">
      <div className="proline-products__header">
        <span className="proline-products__eyebrow">
          PROLINE LAB · PRODUITS
        </span>

        <h2>
          Nos solutions
          <span> professionnelles</span>
        </h2>

        <p>
          Découvrez notre gamme de produits professionnels
          pour l'hygiène, le nettoyage et l'entretien.
        </p>
      </div>

      <div className="proline-products__controls">
        <div className="proline-products__search">
          <span>⌕</span>

          <input
            type="search"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="proline-products__filters">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={
                category === item
                  ? "active"
                  : ""
              }
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="proline-products__grid">
        {filteredProducts.map((file) => {
          const name = cleanName(file);
          const productCategory = getCategory(name);

          const pdfUrl =
            "/Produits/" +
            encodeURIComponent(file);

          return (
            <article
              className="proline-product-card"
              key={file}
            >
              <div className="proline-product-card__document">
                <div className="proline-product-card__pdf">
                  PDF
                </div>

                <div className="proline-product-card__document-lines">
                  <span />
                  <span />
                  <span />
                </div>
              </div>

              <div className="proline-product-card__body">
                <div className="proline-product-card__category">
                  {productCategory}
                </div>

                <h3>{name}</h3>

                <p>
                  Fiche technique et informations
                  produit.
                </p>

                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="proline-product-card__button"
                >
                  Consulter la fiche
                  <span>→</span>
                </a>
              </div>
            </article>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="proline-products__empty">
          Aucun produit trouvé.
        </div>
      )}

      <div className="proline-products__count">
        {filteredProducts.length} produit
        {filteredProducts.length !== 1 ? "s" : ""}
      </div>
    </section>
  );
}