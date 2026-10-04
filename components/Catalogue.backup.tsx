"use client";

import {
  useMemo,
  useState,
} from "react";

import dynamic from "next/dynamic";

const Catalogue3D = dynamic(
  () => import("./catalogue/Catalogue3D"),
  { ssr: false }
);

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
  image?: string;
}

export const CAT_LABELS: Record<CategoryKey, string> = {
  cuisine: "Cuisine",
  machine: "Machine",
  buanderie: "Buanderie",
  sanitaire: "Sanitaire",
  communs: "Espaces Communs",
  piscine: "Piscine",
};

export const PRODUCTS: Product[] = [
  {
    code: "CUIS-01",
    name: "Dégraissant Surpuissant",
    ref: "REF1001",
    pack: "Bidon de 5L",
    desc: "Élimine les graisses cuites et tenaces sur tous les plans de travail et hottes.",
    dosage: "10 à 20 ml par litre d'eau chaude.",
    cat: "cuisine",
  },
  {
    code: "MACH-01",
    name: "Détergent Machine Vaisselle",
    ref: "REF2001",
    pack: "Bidon de 10L",
    desc: "Liquide de lavage hautement performant en eaux douces et mi-dures.",
    dosage: "1 à 3 g par litre d'eau selon la dureté.",
    cat: "machine",
  },
  {
    code: "BUAN-01",
    name: "Lessive Liquide Professionnelle",
    ref: "REF3001",
    pack: "Bidon de 20L",
    desc: "Efficace dès 30°C sur tous types de textiles, respecte les fibres et ravive les couleurs.",
    dosage: "15 à 25 ml par kg de linge sec.",
    cat: "buanderie",
  },
  {
    code: "SANI-01",
    name: "Détartrant Sanitaire Gel",
    ref: "REF4001",
    pack: "Flacon de 750ml",
    desc: "Élimine efficacement le tartre et les dépôts de calcaire sur les cuvettes et éviers.",
    dosage: "Utilisation pur sous les rebords et sur les surfaces.",
    cat: "sanitaire",
  },
  {
    code: "COMM-01",
    name: "Nettoyant Sols Brillant",
    ref: "REF5001",
    pack: "Bidon de 5L",
    desc: "Multi-surfaces pour les sols carrelés, stratifiés et parquets vitrifiés. Sans rinçage.",
    dosage: "0,5% à 1% dans l'eau de lavage.",
    cat: "communs",
  },
  {
    code: "PISC-01",
    name: "Chlore Choc Granulés",
    ref: "REF6001",
    pack: "Seau de 5kg",
    desc: "Traitement choc pour rattraper rapidement une eau verte ou trouble.",
    dosage: "15g par m³ d'eau directement dans le bassin.",
    cat: "piscine",
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

const CAT_META: Record<CategoryKey, string> = {
  cuisine: "01",
  machine: "02",
  buanderie: "03",
  sanitaire: "04",
  communs: "05",
  piscine: "06",
};

function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const [flipped, setFlipped] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className={`monster-product ${flipped ? "is-flipped" : ""} ${
        hovered ? "is-hovered" : ""
      }`}
      style={
        {
          "--delay": `${index * 70}ms`,
          "--cat-color": `var(--color-cat-${product.cat}, var(--color-green))`,
        } as React.CSSProperties
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setFlipped((value) => !value)}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setFlipped((value) => !value);
        }
      }}
      aria-label={`${product.name}. Cliquer pour afficher le mode d'emploi.`}
    >
      <div className="monster-product-inner">
        <div className="monster-product-face monster-product-front">
          <div className="monster-product-top">
            <span className="monster-product-code">
              {product.code}
            </span>

            <span className="monster-product-category">
              {CAT_META[product.cat]} / {CAT_LABELS[product.cat]}
            </span>
          </div>

          <div className="monster-product-orb">
            <span />
          </div>

          <div className="monster-product-content">
            <span className="monster-product-kicker">
              PROLINE PROFESSIONAL
            </span>

            <h3>{product.name}</h3>

            <p>{product.desc}</p>
          </div>

          <div className="monster-product-meta">
            <div>
              <small>RÉFÉRENCE</small>
              <strong>{product.ref}</strong>
            </div>

            <div>
              <small>CONDITIONNEMENT</small>
              <strong>{product.pack}</strong>
            </div>
          </div>

          <div className="monster-product-footer">
            <span>RETOURNER LA FICHE</span>
            <b>↗</b>
          </div>
        </div>

        <div className="monster-product-face monster-product-back">
          <div className="monster-back-grid" />

          <span className="monster-product-kicker">
            PROLINE · PROTOCOLE
          </span>

          <h3>Mode d'emploi</h3>

          <div className="monster-dosage">
            <span>DOSAGE RECOMMANDÉ</span>
            <strong>{product.dosage}</strong>
          </div>

          <div className="monster-back-info">
            <span>CATÉGORIE</span>
            <strong>{CAT_LABELS[product.cat]}</strong>
          </div>

          <div className="monster-back-info">
            <span>RÉFÉRENCE</span>
            <strong>{product.ref}</strong>
          </div>

          <button
            type="button"
            className="monster-return"
            onClick={(event) => {
              event.stopPropagation();
              setFlipped(false);
            }}
          >
            <span>Retourner</span>
            <b>↩</b>
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Catalogue() {
  const [filter, setFilter] = useState<FilterKey>("all");

  const items = useMemo(
    () =>
      PRODUCTS.filter(
        (product) => filter === "all" || product.cat === filter
      ),
    [filter]
  );

  return (
    <section
      id="catalogue"
      className="catalogue-monster"
    >
      <div className="catalogue-monster-noise" />

      <div className="catalogue-monster-header">
        <div className="catalogue-monster-copy">
          <span className="catalogue-monster-eyebrow">
            <i />
            CATALOGUE · PROLINE LAB
          </span>

          <h2>
            Le catalogue complet,
            <br />
            <em>produit par produit.</em>
          </h2>

          <p>
            Référence, conditionnement et dosage —
            la fiche se retourne au survol.
          </p>

          <div className="catalogue-monster-stats">
            <div>
              <strong>{PRODUCTS.length}</strong>
              <span>PRODUITS</span>
            </div>

            <div>
              <strong>06</strong>
              <span>ENVIRONNEMENTS</span>
            </div>

            <div>
              <strong>24/7</strong>
              <span>PERFORMANCE</span>
            </div>
          </div>
        </div>

        <Catalogue3D />
      </div>

      <div className="catalogue-monster-controls">
        <div className="catalogue-filter-label">
          <span>Explorer</span>
          <strong>
            {filter === "all"
              ? "Tous les produits"
              : CAT_LABELS[filter]}
          </strong>
        </div>

        <div className="cat-filters monster-filters">
          {FILTERS.map((item) => {
            const active = filter === item;

            return (
              <button
                key={item}
                type="button"
                className={`cat-filter-btn ${
                  active ? "active" : ""
                }`}
                onClick={() => setFilter(item)}
              >
                <span>
                  {item === "all"
                    ? "Tout voir"
                    : CAT_LABELS[item]}
                </span>

                <small>
                  {item === "all"
                    ? String(PRODUCTS.length).padStart(2, "0")
                    : String(
                        PRODUCTS.filter(
                          (product) => product.cat === item
                        ).length
                      ).padStart(2, "0")}
                </small>
              </button>
            );
          })}
        </div>
      </div>

      <div className="monster-product-grid">
        {items.map((product, index) => (
          <ProductCard
            key={`${product.code}-${product.ref}`}
            product={product}
            index={index}
          />
        ))}
      </div>

      <div className="catalogue-monster-bottom">
        <span>
          PROLINE HYGIENE · PROFESSIONAL SOLUTIONS
        </span>

        <span>
          {String(items.length).padStart(2, "0")} RÉFÉRENCES
        </span>
      </div>
    </section>
  );
}


