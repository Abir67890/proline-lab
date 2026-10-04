"use client";

import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";

type Product = {
  id: string;
  name: string;
  file: string;
  url: string;
  photo: string | null;
  category: string;
};

type ViewMode = "grid" | "list";
type SortMode = "az" | "za" | "category";

type IconName =
  | "spark"
  | "search"
  | "download"
  | "arrow"
  | "close"
  | "grid"
  | "list"
  | "chef"
  | "shirt"
  | "pool"
  | "drop"
  | "file"
  | "eye"
  | "shield"
  | "layers"
  | "check";

function Icon({
  name,
  size = 18,
}: {
  name: IconName;
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "spark":
      return (
        <svg {...common}>
          <path d="m12 2 1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5L12 2Z" />
          <path d="m19 16 .6 2.4L22 19l-2.4.6L19 22l-.6-2.4L16 19l2.4-.6L19 16Z" />
        </svg>
      );

    case "search":
      return (
        <svg {...common}>
          <circle cx="10.8" cy="10.8" r="6.8" />
          <path d="m16 16 4.5 4.5" />
        </svg>
      );

    case "download":
      return (
        <svg {...common}>
          <path d="M12 3v11" />
          <path d="m7.5 10 4.5 4.5 4.5-4.5" />
          <path d="M4 20h16" />
        </svg>
      );

    case "arrow":
      return (
        <svg {...common}>
          <path d="M4 12h15" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );

    case "close":
      return (
        <svg {...common}>
          <path d="m6 6 12 12" />
          <path d="m18 6-12 12" />
        </svg>
      );

    case "grid":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="6" height="6" rx="1" />
          <rect x="14" y="4" width="6" height="6" rx="1" />
          <rect x="4" y="14" width="6" height="6" rx="1" />
          <rect x="14" y="14" width="6" height="6" rx="1" />
        </svg>
      );

    case "list":
      return (
        <svg {...common}>
          <path d="M7 6h13" />
          <path d="M7 12h13" />
          <path d="M7 18h13" />
          <circle cx="3.5" cy="6" r="1" fill="currentColor" stroke="none" />
          <circle cx="3.5" cy="12" r="1" fill="currentColor" stroke="none" />
          <circle cx="3.5" cy="18" r="1" fill="currentColor" stroke="none" />
        </svg>
      );

    case "chef":
      return (
        <svg {...common}>
          <path d="M7 11h10v9H7z" />
          <path d="M5 11a3 3 0 0 1 3-3 4 4 0 0 1 8 0 3 3 0 0 1 3 3" />
          <path d="M10 20v2" />
          <path d="M14 20v2" />
        </svg>
      );

    case "shirt":
      return (
        <svg {...common}>
          <path d="M9 4 6 6 3 8l2 4 2-1v10h10V11l2 1 2-4-3-2-3-2" />
          <path d="M9 4c.5 2 1.5 3 3 3s2.5-1 3-3" />
        </svg>
      );

    case "pool":
      return (
        <svg {...common}>
          <path d="M4 14c2.5-2.2 4.2 2.2 6.7 0 2.4-2.2 4.1 2.2 6.6 0 1.1-1 2-.8 2.7-.1" />
          <path d="M7 9.5c.7-1.8 2.3-2.8 4.2-2.8 1.7 0 3 .7 3.8 2" />
          <path d="M10 4.5h4" />
        </svg>
      );

    case "drop":
      return (
        <svg {...common}>
          <path d="M12 3s6 6.2 6 11a6 6 0 0 1-12 0c0-4.8 6-11 6-11Z" />
          <path d="M9.5 15.2c.5 1.2 1.4 1.9 2.7 2.1" />
        </svg>
      );

    case "file":
      return (
        <svg {...common}>
          <path d="M7 3h7l4 4v14H7z" />
          <path d="M14 3v5h5" />
          <path d="M10 13h5" />
          <path d="M10 17h5" />
        </svg>
      );

    case "eye":
      return (
        <svg {...common}>
          <path d="M3 12s3.3-5 9-5 9 5 9 5-3.3 5-9 5-9-5-9-5Z" />
          <circle cx="12" cy="12" r="2.2" />
        </svg>
      );

    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3 19 6v5c0 4.6-2.8 8-7 10-4.2-2-7-5.4-7-10V6l7-3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );

    case "layers":
      return (
        <svg {...common}>
          <path d="m12 4 8 4-8 4-8-4 8-4Z" />
          <path d="m4 12 8 4 8-4" />
          <path d="m4 16 8 4 8-4" />
        </svg>
      );

    case "check":
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );

    default:
      return null;
  }
}

function categoryMeta(category: string) {
  switch (category) {
    case "Cuisine":
      return {
        icon: "chef" as IconName,
        short: "CUISINE",
        description: "Dégraissage et nettoyage professionnel.",
        accent: "#0E9F6E",
        glow: "rgba(14,159,110,.24)",
      };

    case "Linge":
      return {
        icon: "shirt" as IconName,
        short: "LINGE",
        description: "Solutions pour le traitement textile.",
        accent: "#1FB88A",
        glow: "rgba(31,184,138,.24)",
      };

    case "Piscine":
      return {
        icon: "pool" as IconName,
        short: "PISCINE",
        description: "Traitement et entretien de l'eau.",
        accent: "#14B8B0",
        glow: "rgba(20,184,176,.25)",
      };

    case "Entretien":
      return {
        icon: "spark" as IconName,
        short: "ENTRETIEN",
        description: "Entretien des surfaces et finitions.",
        accent: "#0F766E",
        glow: "rgba(15,118,110,.22)",
      };

    case "Parfums":
      return {
        icon: "spark" as IconName,
        short: "PARFUMS",
        description: "Ambiance et fraîcheur professionnelles.",
        accent: "#6C7DDB",
        glow: "rgba(108,125,219,.22)",
      };

    case "Hygiène":
      return {
        icon: "drop" as IconName,
        short: "HYGIÈNE",
        description: "Hygiène des mains et des espaces.",
        accent: "#22A78A",
        glow: "rgba(34,167,138,.24)",
      };

    default:
      return {
        icon: "shield" as IconName,
        short: "PRO",
        description: "Solution professionnelle PROLINE.",
        accent: "#0C5A52",
        glow: "rgba(12,90,82,.22)",
      };
  }
}

export default function ProductInterface() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Toutes");
  const [sort, setSort] = useState<SortMode>("az");
  const [view, setView] = useState<ViewMode>("grid");
  const [selected, setSelected] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    fetch("/api/products", {
      cache: "no-store",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("API products");
        }

        return response.json();
      })
      .then((data) => {
        if (!mounted) return;

        setProducts(Array.isArray(data.products) ? data.products : []);
      })
      .catch(() => {
        if (!mounted) return;

        setError("Impossible de charger les produits.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selected) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelected(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected]);

  const categories = useMemo(() => {
    const ordered = [
      "Toutes",
      "Cuisine",
      "Linge",
      "Piscine",
      "Entretien",
      "Parfums",
      "Hygiène",
      "Professionnel",
    ];

    return ordered.filter(
      (item) =>
        item === "Toutes" ||
        products.some((product) => product.category === item)
    );
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = products.filter((product) => {
      const text = `${product.name} ${product.category}`.toLowerCase();

      return (
        (!query || text.includes(query)) &&
        (category === "Toutes" || product.category === category)
      );
    });

    result.sort((a, b) => {
      if (sort === "za") {
        return b.name.localeCompare(a.name, "fr");
      }

      if (sort === "category") {
        return (
          a.category.localeCompare(b.category, "fr") ||
          a.name.localeCompare(b.name, "fr")
        );
      }

      return a.name.localeCompare(b.name, "fr");
    });

    return result;
  }, [products, search, category, sort]);

  return (
    <section id="products" className="pl-products-ultra">
      <div className="pl-products-ultra__ambient ambient-one" />
      <div className="pl-products-ultra__ambient ambient-two" />

      <div className="pl-products-ultra__container">

        <div className="pl-products-ultra__intro">

          <div className="pl-products-ultra__eyebrow">
            <span className="eyebrow-dot" />
            PROLINE LAB · PRODUITS
          </div>

          <h2>
            Nos solutions
            <span> professionnelles.</span>
          </h2>

          <p>
            Une gamme structurée par environnement, usage et
            performance. Chaque fiche correspond directement
            aux documents produits présents dans votre catalogue.
          </p>

          <div className="pl-products-ultra__metrics">

            <div>
              <strong>{products.length || 37}</strong>
              <span>produits</span>
            </div>

            <div>
              <strong>{Math.max(categories.length - 1, 0)}</strong>
              <span>univers</span>
            </div>

            <div>
              <strong>PDF</strong>
              <span>fiches techniques</span>
            </div>

          </div>
        </div>

        <div className="pl-products-ultra__control-panel">

          <label className="pl-products-ultra__search">
            <Icon name="search" size={20} />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Rechercher un produit, une catégorie..."
              aria-label="Rechercher un produit"
            />

            {search && (
              <button
                type="button"
                className="search-clear"
                onClick={() => setSearch("")}
                aria-label="Effacer la recherche"
              >
                <Icon name="close" size={14} />
              </button>
            )}
          </label>

          <div className="pl-products-ultra__toolbar">

            <div className="pl-products-ultra__filters">
              {categories.map((item) => {
                const meta =
                  item === "Toutes"
                    ? {
                        icon: "layers" as IconName,
                        short: "TOUS",
                      }
                    : categoryMeta(item);

                return (
                  <button
                    key={item}
                    type="button"
                    className={
                      category === item
                        ? "ultra-filter active"
                        : "ultra-filter"
                    }
                    onClick={() => setCategory(item)}
                    style={
                      {
                        "--filter-accent":
                          item === "Toutes"
                            ? "#0C5A52"
                            : categoryMeta(item).accent,
                      } as CSSProperties
                    }
                  >
                    <span className="filter-icon">
                      <Icon
                        name={meta.icon}
                        size={15}
                      />
                    </span>

                    <span>{item}</span>
                  </button>
                );
              })}
            </div>

            <div className="pl-products-ultra__sorts">

              <select
                value={sort}
                onChange={(event) =>
                  setSort(event.target.value as SortMode)
                }
                aria-label="Trier les produits"
              >
                <option value="az">A → Z</option>
                <option value="za">Z → A</option>
                <option value="category">Catégorie</option>
              </select>

              <div className="ultra-view-toggle">

                <button
                  type="button"
                  className={
                    view === "grid" ? "active" : ""
                  }
                  onClick={() => setView("grid")}
                  aria-label="Vue grille"
                >
                  <Icon name="grid" size={17} />
                </button>

                <button
                  type="button"
                  className={
                    view === "list" ? "active" : ""
                  }
                  onClick={() => setView("list")}
                  aria-label="Vue liste"
                >
                  <Icon name="list" size={17} />
                </button>

              </div>

            </div>

          </div>
        </div>

        <div className="pl-products-ultra__resultbar">
          <div>
            <span className="live-dot" />
            {loading
              ? "Synchronisation..."
              : `${filteredProducts.length} résultat${
                  filteredProducts.length !== 1 ? "s" : ""
                }`}
          </div>

          <span>
            {category === "Toutes"
              ? "Toute la gamme"
              : category}
          </span>
        </div>

        {loading && (
          <div className="ultra-product-grid">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="ultra-skeleton"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="ultra-empty">
            <Icon name="shield" size={34} />
            <h3>Chargement indisponible</h3>
            <p>{error}</p>
          </div>
        )}

        {!loading &&
          !error &&
          filteredProducts.length > 0 && (
            <div
              className={
                view === "grid"
                  ? "ultra-product-grid"
                  : "ultra-product-grid ultra-list-view"
              }
            >
              {filteredProducts.map((product, index) => {
                const meta = categoryMeta(
                  product.category
                );

                return (
                  <article
                    className="ultra-product-card"
                    key={product.id}
                    style={
                      {
                        "--product-accent": meta.accent,
                        "--product-glow": meta.glow,
                        "--product-index": index,
                      } as CSSProperties
                    }
                  >

                    <div className="ultra-product-visual">

                      <div className="visual-grid" />

                      <div className="visual-orb orb-one" />
                      <div className="visual-orb orb-two" />

                      {product.photo && (
                        <img
                          className="ultra-product-image"
                          src={product.photo}
                          alt={product.name}
                          loading="lazy"
                        />
                      )}

                      <div
                        className="ultra-product-fallback"
                        aria-hidden="true"
                      >
                        <div className="fallback-ring ring-a" />
                        <div className="fallback-ring ring-b" />

                        <div className="fallback-icon">
                          <Icon
                            name={meta.icon}
                            size={42}
                          />
                        </div>

                        <span>
                          PROLINE
                        </span>
                      </div>

                      <div className="visual-gradient" />

                      <div className="ultra-product-badges">
                        <span className="category-badge">
                          <Icon
                            name={meta.icon}
                            size={13}
                          />
                          {meta.short}
                        </span>

                        <span className="pdf-badge">
                          <Icon
                            name="file"
                            size={12}
                          />
                          PDF
                        </span>
                      </div>

                      <div className="visual-code">
                        #{String(index + 1).padStart(2, "0")}
                      </div>

                    </div>

                    <div className="ultra-product-content">

                      <div className="ultra-product-kicker">
                        <span>
                          <Icon
                            name="check"
                            size={12}
                          />
                        </span>

                        SOLUTION PROFESSIONNELLE
                      </div>

                      <h3>{product.name}</h3>

                      <p>
                        {meta.description}
                      </p>

                      <div className="ultra-product-footer">

                        <div className="ultra-product-capabilities">
                          <span>
                            <Icon
                              name="shield"
                              size={13}
                            />
                            PRO
                          </span>

                          <span>
                            <Icon
                              name="file"
                              size={13}
                            />
                            FICHE
                          </span>
                        </div>

                        <button
                          type="button"
                          className="ultra-details-button"
                          onClick={() =>
                            setSelected(product)
                          }
                        >
                          <span>Explorer</span>

                          <span className="button-arrow">
                            <Icon
                              name="arrow"
                              size={15}
                            />
                          </span>
                        </button>

                      </div>

                    </div>
                  </article>
                );
              })}
            </div>
          )}

        {!loading &&
          !error &&
          filteredProducts.length === 0 && (
            <div className="ultra-empty">
              <Icon name="search" size={34} />

              <h3>
                Aucun produit trouvé
              </h3>

              <p>
                Essayez une autre recherche ou
                réinitialisez le filtre.
              </p>

              <button
                type="button"
                className="ultra-reset-button"
                onClick={() => {
                  setSearch("");
                  setCategory("Toutes");
                }}
              >
                Réinitialiser
              </button>
            </div>
          )}
      </div>

      {selected && (
        <div className="ultra-product-modal">

          <button
            type="button"
            className="ultra-modal-backdrop"
            aria-label="Fermer"
            onClick={() => setSelected(null)}
          />

          <div
            className="ultra-modal"
            role="dialog"
            aria-modal="true"
            aria-label={selected.name}
          >

            <button
              type="button"
              className="ultra-modal-close"
              onClick={() => setSelected(null)}
              aria-label="Fermer"
            >
              <Icon name="close" size={18} />
            </button>

            <div className="ultra-modal__header">

              <div className="ultra-modal__visual">

                {selected.photo ? (
                  <img
                    src={selected.photo}
                    alt={selected.name}
                  />
                ) : (
                  <div className="ultra-modal__fallback">
                    <Icon
                      name={
                        categoryMeta(
                          selected.category
                        ).icon
                      }
                      size={64}
                    />
                  </div>
                )}

                <div className="ultra-modal__overlay" />

                <span className="ultra-modal__pdf">
                  <Icon name="file" size={14} />
                  FICHE PRODUIT
                </span>

              </div>

              <div className="ultra-modal__content">

                <div className="ultra-modal__eyebrow">
                  <Icon
                    name={
                      categoryMeta(
                        selected.category
                      ).icon
                    }
                    size={14}
                  />
                  {selected.category}
                </div>

                <h3>{selected.name}</h3>

                <p>
                  Consultez directement la fiche
                  officielle PROLINE pour retrouver
                  les informations techniques et
                  d'utilisation.
                </p>

                <div className="ultra-modal__points">
                  <span>
                    <Icon name="check" size={14} />
                    Document officiel
                  </span>

                  <span>
                    <Icon name="check" size={14} />
                    Consultation PDF
                  </span>

                  <span>
                    <Icon name="check" size={14} />
                    Téléchargement
                  </span>
                </div>

                <div className="ultra-modal__actions">

                  <a
                    className="ultra-modal-primary"
                    href={selected.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name="eye" size={17} />
                    Ouvrir la fiche
                    <Icon name="arrow" size={16} />
                  </a>

                  <a
                    className="ultra-modal-secondary"
                    href={selected.url}
                    download
                  >
                    <Icon name="download" size={17} />
                    Télécharger
                  </a>

                </div>

              </div>
            </div>

            <div className="ultra-pdf-preview">
              <div className="ultra-pdf-preview__head">
                <span>
                  <Icon name="file" size={15} />
                  Aperçu du document
                </span>

                <span>PROLINE LAB</span>
              </div>

              <iframe
                src={`${selected.url}#toolbar=0&navpanes=0`}
                title={`Aperçu de ${selected.name}`}
              />
            </div>

          </div>
        </div>
      )}
    </section>
  );
}