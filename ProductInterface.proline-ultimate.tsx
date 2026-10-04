"use client";

import { useEffect, useMemo, useState } from "react";

type Product = {
  id: string;
  name: string;
  file: string;
  url: string;
  category: string;
  photo: string | null;
  photoAlt?: string;
  photoSource?: "product-match" | "category-fallback" | "generic";
};

const CATEGORY_META: Record<string, { label: string; short: string; icon: string }> = {
  Cuisine: { label: "Cuisine & restaurant", short: "Cuisine", icon: "✦" },
  Linge: { label: "Buanderie & textile", short: "Buanderie", icon: "◈" },
  Piscine: { label: "Piscine & traitement", short: "Piscine", icon: "◌" },
  Entretien: { label: "Entretien des surfaces", short: "Entretien", icon: "◇" },
  Parfums: { label: "Parfums & ambiance", short: "Parfums", icon: "✺" },
  Hygiène: { label: "Hygiène & sanitaire", short: "Hygiène", icon: "＋" },
  Professionnel: { label: "Solutions professionnelles", short: "Pro", icon: "◎" },
};

function ProductIcon({ category }: { category: string }) {
  const icon = CATEGORY_META[category]?.icon ?? "•";
  return <span className="pl-product-icon" aria-hidden="true">{icon}</span>;
}

function humanFileName(value: string) {
  return value
    .replace(/\.pdf$/i, "")
    .replace(/[()_]+/g, " ")
    .replace(/-+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function ProductInterface() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tous");
  const [sort, setSort] = useState<"az" | "za" | "category">("az");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError("");
        const response = await fetch("/api/products", {
          cache: "no-store",
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const payload = await response.json();
        const items = Array.isArray(payload) ? payload : payload.products;

        if (!Array.isArray(items)) throw new Error("Réponse produits invalide");
        setProducts(items);
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return;
        console.error("PROLINE products:", err);
        setError("Impossible de charger les produits.");
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  const categories = useMemo(() => {
    return ["Tous", ...Array.from(new Set(products.map((p) => p.category))).sort((a, b) => a.localeCompare(b))];
  }, [products]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = products.filter((product) => {
      const matchesQuery = !normalized || `${product.name} ${product.category} ${product.file}`.toLowerCase().includes(normalized);
      const matchesCategory = category === "Tous" || product.category === category;
      return matchesQuery && matchesCategory;
    });

    return result.sort((a, b) => {
      if (sort === "za") return b.name.localeCompare(a.name, "fr");
      if (sort === "category") return `${a.category}-${a.name}`.localeCompare(`${b.category}-${b.name}`, "fr");
      return a.name.localeCompare(b.name, "fr");
    });
  }, [products, query, category, sort]);

  return (
    <section id="products" className="pl-products-ultra" aria-labelledby="products-title">
      <div className="pl-products-background" aria-hidden="true">
        <span className="pl-orb pl-orb-a" />
        <span className="pl-orb pl-orb-b" />
        <span className="pl-grid-lines" />
      </div>

      <div className="pl-products-shell">
        <header className="pl-products-ultra__intro pl-reveal">
          <div className="pl-products-kicker">PROLINE LAB · GAMME PROFESSIONNELLE</div>
          <div className="pl-products-title-row">
            <div>
              <h2 id="products-title">Les produits qui font<br /><em>la différence.</em></h2>
              <p>
                Une bibliothèque dynamique alimentée par les fiches produits de <strong>public/Produits</strong>,
                avec un visuel issu de <strong>public/media</strong> pour chaque référence lorsque disponible.
              </p>
            </div>

            <div className="pl-products-ultra__metrics" aria-label="Résumé de la gamme">
              <div><strong>{products.length || 37}</strong><span>références</span></div>
              <div><strong>{categories.length ? categories.length - 1 : 0}</strong><span>univers</span></div>
              <div><strong>PDF</strong><span>fiches techniques</span></div>
            </div>
          </div>
        </header>

        <div className="pl-products-ultra__toolbar pl-reveal">
          <label className="pl-product-search">
            <span aria-hidden="true">⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher un produit…"
              aria-label="Rechercher un produit"
            />
            {query && <button type="button" onClick={() => setQuery("")} aria-label="Effacer la recherche">×</button>}
          </label>

          <div className="pl-products-ultra__sorts">
            <select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)} aria-label="Trier les produits">
              <option value="az">A → Z</option>
              <option value="za">Z → A</option>
              <option value="category">Univers</option>
            </select>

            <div className="pl-product-view-toggle" role="group" aria-label="Mode d'affichage">
              <button type="button" className={view === "grid" ? "is-active" : ""} onClick={() => setView("grid")} aria-label="Vue grille">▦</button>
              <button type="button" className={view === "list" ? "is-active" : ""} onClick={() => setView("list")} aria-label="Vue liste">☷</button>
            </div>
          </div>
        </div>

        <div className="pl-products-filterbar pl-reveal" role="tablist" aria-label="Filtrer par univers">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={category === item}
              className={category === item ? "is-active" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="pl-products-state" role="status">
            <span className="pl-loader-ring" />
            <strong>Chargement de la gamme…</strong>
            <p>Recherche des fiches et des visuels disponibles.</p>
          </div>
        ) : error ? (
          <div className="pl-products-state is-error" role="alert">
            <strong>{error}</strong>
            <p>Vérifie la route <code>/api/products</code> puis recharge la page.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="pl-products-state">
            <strong>Aucun résultat.</strong>
            <p>Essaie un autre mot-clé ou une autre catégorie.</p>
          </div>
        ) : (
          <div className={`pl-product-grid ${view === "list" ? "is-list" : ""}`}>
            {filtered.map((product, index) => {
              const meta = CATEGORY_META[product.category] ?? CATEGORY_META.Professionnel;
              const label = meta.label;

              return (
                <article
                  key={product.id}
                  className="pl-product-card"
                  style={{
                    ["--product-index" as string]: index,
                    ["--product-accent" as string]: index % 3 === 0 ? "#0E9F6E" : index % 3 === 1 ? "#14B8B0" : "#315F91",
                  }}
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelected(product);
                    }
                  }}
                >
                  <div className="pl-product-visual">
                    <div className="pl-product-image-shell">
                      {product.photo ? (
                        <img
                          src={product.photo}
                          alt={product.photoAlt || `${product.name} — ${label}`}
                          className="pl-product-image"
                          loading={index < 4 ? "eager" : "lazy"}
                          draggable={false}
                        />
                      ) : (
                        <div className="pl-product-generated-visual" aria-label="Visuel généré pour le produit">
                          <div className="pl-product-generated-bubble" />
                          <ProductIcon category={product.category} />
                          <span>{meta.short}</span>
                        </div>
                      )}
                    </div>

                    <div className="pl-product-scanline" aria-hidden="true" />
                    <div className="pl-product-noise" aria-hidden="true" />
                    <span className="pl-product-index">{String(index + 1).padStart(2, "0")}</span>
                    <span className="pl-product-category">{meta.short}</span>

                    <button
                      type="button"
                      className="pl-product-expand"
                      onClick={() => setSelected(product)}
                      aria-label={`Ouvrir la fiche ${product.name}`}
                    >
                      <span>+</span>
                    </button>
                  </div>

                  <div className="pl-product-content">
                    <div className="pl-product-kicker">
                      <ProductIcon category={product.category} />
                      <span>{product.category}</span>
                    </div>
                    <h3>{humanFileName(product.name)}</h3>
                    <p>{product.photoSource === "product-match" ? "Visuel produit associé" : "Visuel d’univers associé"}</p>

                    <div className="pl-product-meta">
                      <span>FICHE PDF</span>
                      <span>PROLINE LAB</span>
                    </div>

                    <div className="pl-product-actions">
                      <a href={product.url} target="_blank" rel="noreferrer" className="pl-product-btn pl-product-btn-primary">
                        <span>Voir la fiche</span><b>↗</b>
                      </a>
                      <button type="button" className="pl-product-btn pl-product-btn-secondary" onClick={() => setSelected(product)}>
                        <span>Aperçu</span><b>＋</b>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <footer className="pl-products-foot pl-reveal">
          <span><i /> Visuels auto-associés depuis <strong>public/media</strong></span>
          <span>{filtered.length} résultat{filtered.length > 1 ? "s" : ""}</span>
        </footer>
      </div>

      {selected && (
        <div className="pl-product-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title" onMouseDown={() => setSelected(null)}>
          <div className="pl-product-modal__inner" onMouseDown={(event) => event.stopPropagation()}>
            <button className="pl-product-modal__close" type="button" onClick={() => setSelected(null)} aria-label="Fermer">×</button>
            <div className="pl-product-modal__topline">
              <span>{selected.category}</span>
              <span>PROLINE LAB</span>
            </div>
            <h3 id="product-modal-title">{humanFileName(selected.name)}</h3>
            <div className="pl-product-modal__visual">
              {selected.photo ? <img src={selected.photo} alt="" /> : <div className="pl-product-generated-visual"><ProductIcon category={selected.category} /></div>}
            </div>
            <div className="pl-product-modal__actions">
              <a href={selected.url} target="_blank" rel="noreferrer" className="pl-product-btn pl-product-btn-primary">Ouvrir le PDF ↗</a>
              <a href={selected.url} download className="pl-product-btn pl-product-btn-secondary">Télécharger ↓</a>
            </div>
            <iframe title={`Fiche technique ${selected.name}`} src={selected.url} className="pl-product-pdf" />
          </div>
        </div>
      )}
    </section>
  );
}
