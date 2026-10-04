// ============================================================
// PROLINE LAB — Registre central des médias
// Reflète l'arborescence : public/images, public/videos, public/catalogue
// ============================================================

export const IMAGES = {
  hero: {
    fallback: "/images/hero-fallback.jpg",
  },
  actionVideo: "/videos/proline-action.mp4",

  categories: {
    cuisine: {
      src: "/images/categories/cuisine.jpg",
      fallback: "/images/categories/cuisine-fallback.jpg",
    },
    machine: {
      src: "/images/categories/machines-automatiques.jpg",
      fallback: "/images/categories/machines-automatiques-fallback.jpg",
    },
    buanderie: {
      src: "/images/categories/buanderie.jpg",
      fallback: "/images/categories/buanderie-fallback.jpg",
    },
    sanitaire: {
      src: "/images/categories/sanitaires.jpg",
      fallback: "/images/categories/sanitaires-fallback.jpg",
    },
    communs: {
      src: "/images/categories/locaux-communs.jpg",
      fallback: "/images/categories/locaux-communs-fallback.jpg",
    },
    piscine: {
      src: "/images/categories/piscine.jpg",
      fallback: "/images/categories/piscine-fallback.jpg",
    },
  },

  about: {
    src: "/images/about/proline-about.jpg",
    fallback: "/images/about/proline-about-fallback.jpg",
  },

  productSpotlight: {
    src: "/images/products/product-spotlight.png",
    fallback: "/images/products/product-spotlight-fallback.png",
  },

  gallery: [
    { src: "/images/gallery/cuisine.jpg", alt: "Cuisine professionnelle nettoyée", caption: "Cuisine" },
    { src: "/images/gallery/buanderie.jpg", alt: "Buanderie hôtelière impeccable", caption: "Buanderie" },
    { src: "/images/gallery/sanitaire.jpg", alt: "Sanitaires désinfectés", caption: "Sanitaires" },
    { src: "/images/gallery/communs.jpg", alt: "Locaux communs entretenus", caption: "Locaux communs" },
    { src: "/images/gallery/piscine.jpg", alt: "Piscine professionnelle traitée", caption: "Piscine" },
    { src: "/images/gallery/machine.jpg", alt: "Machine automatique de lavage", caption: "Machines" },
    { src: "/images/gallery/gamme-produits-labo.jpg", alt: "Gamme Proline Lab en laboratoire — 3S, PS, PSP, PF", caption: "Notre gamme" },
    { src: "/images/gallery/gamme-produits-studio.jpg", alt: "Gamme Proline Lab, présentation studio", caption: "Nos formules" },
  ],

  ctaBanner: {
    src: "/images/cta/proline-cta.jpg",
    fallback: "/images/cta/proline-cta-fallback.jpg",
  },

  catalogue: "/catalogue/Proline-Lab-Catalogue.pdf",
} as const;
