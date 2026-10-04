"use client";
import { useState } from "react";

export type CategoryKey = "cuisine" | "machine" | "buanderie" | "sanitaire" | "communs" | "piscine";

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
  }
];

type FilterKey = "all" | CategoryKey;
const FILTERS: FilterKey[] = ["all", "cuisine", "machine", "buanderie", "sanitaire", "communs", "piscine"];

export default function HomeCatalogueSection() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const items = PRODUCTS.filter((p) => filter === "all" || p.cat === filter);

  return (
    <section id="catalogue">
      <div className="section-head reveal">
        <div className="section-eyebrow">Catalogue</div>
        <h2 className="section-title">Le catalogue complet, produit par produit</h2>
        <p className="section-sub">Référence, conditionnement et dosage — la fiche se retourne au survol.</p>
      </div>

      <div className="cat-filters">
        {FILTERS.map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              className={`cat-filter-btn ${active ? "active" : ""}`}
              onClick={() => setFilter(f)}
              style={active ? { background: "var(--color-green)", color: "#fff", borderColor: "transparent" } : undefined}
            >
              {f === "all" ? "Tout voir" : CAT_LABELS[f]}
            </button>
          );
        })}
      </div>

      <div className="product-grid">
        {items.map((p, i) => {
          const catColorVar = `var(--color-cat-${p.cat}, var(--color-green))`;

          return (
            <div 
              className="product-card reveal" 
              key={`${p.code}-${p.ref}-${i}`} 
              style={{ "--cat": catColorVar } as React.CSSProperties}
            >
              <div className="card-inner">
                <div className="card-face front">
                  <div className="code">{p.code}</div>
                  <div className="name">{p.name}</div>
                  <div className="meta">
                    <span>Réf. <b>{p.ref}</b></span>
                    <span>{p.pack}</span>
                  </div>
                  <div className="desc">{p.desc}</div>
                </div>

                <div className="card-face back">
                  <div className="lbl">Mode d'emploi</div>
                  <div className="dosage">{p.dosage}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
