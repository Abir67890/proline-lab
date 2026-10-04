"use client";

import { useState } from "react";

export type CategoryKey =
  | "cuisine"
  | "machine"
  | "buanderie"
  | "sanitaire"
  | "communs"
  | "piscine";

export interface Product {
  code: string;
  name: string;
  ref: string;
  pack: string;
  desc: string;
  dosage: string;
  cat: CategoryKey;
  image: string;
}

export const CAT_LABELS: Record<CategoryKey, string> = {
  cuisine: "Cuisine",
  machine: "Machines",
  buanderie: "Buanderie",
  sanitaire: "Sanitaire",
  communs: "Espaces Communs",
  piscine: "Piscine",
};

const CAT_IMAGES: Record<CategoryKey, string> = {
  cuisine: "/media/images/categories/cuisine.jpg",
  machine: "/media/images/categories/machines-automatiques.jpg",
  buanderie: "/media/images/categories/buanderie.jpg",
  sanitaire: "/media/images/categories/sanitaires.jpg",
  communs: "/media/images/categories/locaux-communs.jpg",
  piscine: "/media/images/categories/piscine.jpg",
};

const PRODUCTS: Product[] = [
  {
    code: "CUIS-01",
    name: "Dégraissant Surpuissant",
    ref: "REF1001",
    pack: "Bidon de 5L",
    desc: "Élimine les graisses cuites et tenaces sur tous les plans de travail et hottes.",
    dosage: "10 à 20 ml par litre d'eau chaude.",
    cat: "cuisine",
    image: CAT_IMAGES.cuisine,
  },
  {
    code: "MACH-01",
    name: "Détergent Machine Vaisselle",
    ref: "REF2001",
    pack: "Bidon de 10L",
    desc: "Liquide de lavage hautement performant en eaux douces et mi-dures.",
    dosage: "1 à 3 g par litre d'eau selon la dureté.",
    cat: "machine",
    image: CAT_IMAGES.machine,
  },
  {
    code: "BUAN-01",
    name: "Lessive Liquide Professionnelle",
    ref: "REF3001",
    pack: "Bidon de 20L",
    desc: "Efficace dès 30°C sur tous types de textiles, respecte les fibres et ravive les couleurs.",
    dosage: "15 à 25 ml par kg de linge sec.",
    cat: "buanderie",
    image: CAT_IMAGES.buanderie,
  },
  {
    code: "SANI-01",
    name: "Détartrant Sanitaire Gel",
    ref: "REF4001",
    pack: "Flacon de 750ml",
    desc: "Élimine efficacement le tartre et les dépôts de calcaire sur les cuvettes et éviers.",
    dosage: "Utilisation pur sous les rebords et sur les surfaces.",
    cat: "sanitaire",
    image: CAT_IMAGES.sanitaire,
  },
  {
    code: "COMM-01",
    name: "Nettoyant Sols Brillant",
    ref: "REF5001",
    pack: "Bidon de 5L",
    desc: "Multi-surfaces pour les sols carrelés, stratifiés et parquets vitrifiés. Sans rinçage.",
    dosage: "0,5% à 1% dans l'eau de lavage.",
    cat: "communs",
    image: CAT_IMAGES.communs,
  },
  {
    code: "PISC-01",
    name: "Chlore Choc Granulés",
    ref: "REF6001",
    pack: "Seau de 5kg",
    desc: "Traitement choc pour rattraper rapidement une eau verte ou trouble.",
    dosage: "15g par m³ d'eau directement dans le bassin.",
    cat: "piscine",
    image: CAT_IMAGES.piscine,
  },
];

type FilterKey = "all" | CategoryKey;

const FILTERS: FilterKey[] = [
  "all",
  "cuisine",
  "machine",
  "buanderie",
  "sanitaire",
  "communs",
  "piscine",
];

const COLORS: Record<CategoryKey, string> = {
  cuisine: "#1F7A5A",
  machine: "#2563A6",
  buanderie: "#4F8ED1",
  sanitaire: "#14919B",
  communs: "#6489AD",
  piscine: "#1677B8",
};

export default function HomeCatalogueSection() {
  const [filter, setFilter] = useState<FilterKey>("all");

  const items = PRODUCTS.filter(
    (product) => filter === "all" || product.cat === filter
  );

  return (
    <section id="catalogue" className="proline-catalogue">
      <div className="catalogue-container">

        <div className="catalogue-head">
          <span className="catalogue-eyebrow">PROLINE LAB</span>

          <h2>
            Le catalogue complet,
            <span> produit par produit</span>
          </h2>

          <p>
            Découvrez nos solutions professionnelles par secteur,
            avec référence, conditionnement et mode d'emploi.
          </p>
        </div>

        <div className="catalogue-filters">
          {FILTERS.map((f) => {
            const active = filter === f;
            const color = f === "all" ? "#315F91" : COLORS[f];

            return (
              <button
                key={f}
                type="button"
                className={`catalogue-filter ${active ? "is-active" : ""}`}
                onClick={() => setFilter(f)}
                style={
                  active
                    ? {
                        backgroundColor: color,
                        borderColor: color,
                      }
                    : undefined
                }
              >
                {f === "all" ? "Tout voir" : CAT_LABELS[f]}
              </button>
            );
          })}
        </div>

        <div className="catalogue-grid">
          {items.map((product) => (
            <article
              className="catalogue-card"
              key={product.code}
              style={
                {
                  "--card-color": COLORS[product.cat],
                } as React.CSSProperties
              }
            >
              <div className="catalogue-card-inner">

                <div className="catalogue-front">

                  <div className="catalogue-image">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                    />

                    <div className="catalogue-image-overlay" />

                    <span className="catalogue-category">
                      {CAT_LABELS[product.cat]}
                    </span>

                    <span className="catalogue-code">
                      {product.code}
                    </span>
                  </div>

                  <div className="catalogue-content">

                    <h3>{product.name}</h3>

                    <div className="catalogue-meta">
                      <span>
                        Réf. <strong>{product.ref}</strong>
                      </span>

                      <span>{product.pack}</span>
                    </div>

                    <p>{product.desc}</p>

                    <div className="catalogue-hint">
                      <span>↻</span>
                      Survolez pour voir le dosage
                    </div>

                  </div>
                </div>

                <div className="catalogue-back">

                  <div className="back-icon">✓</div>

                  <span className="back-label">
                    MODE D'EMPLOI
                  </span>

                  <h3>{product.name}</h3>

                  <div className="dosage-box">
                    {product.dosage}
                  </div>

                  <span className="back-category">
                    {CAT_LABELS[product.cat]}
                  </span>

                </div>

              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
