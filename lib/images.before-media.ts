/**
 * ============================================================
 * PROLINE LAB — Registre central des médias
 * SOURCE UNIQUE : public/media
 * ============================================================
 */

export const IMAGES = {
  hero: {
    fallback: "/media/images/hero-fallback.jpg",
  },

  actionVideo: "/media/video/proline-action.mp4",

  categories: {
    cuisine: {
      src: "/media/cuisine.jpg",
      fallback: "/media/cuisine fallback.jpg",
    },

    machine: {
      src: "/media/machine automatique.jpg",
      fallback: "/media/machine automatique fallback.jpg",
    },

    buanderie: {
      src: "/media/Petite buanderie.jpg",
      fallback: "/media/bauderie fallback.jpg",
    },

    sanitaire: {
      src: "/media/sanitaires.jpg",
      fallback: "/media/sanitaires fallback.jpg",
    },

    communs: {
      src: "/media/locaux commun.jpg",
      fallback: "/media/locaux commun fallback.jpg",
    },

    piscine: {
      src: "/media/piscine.jpg",
      fallback: "/media/piscine fallback.jpg",
    },
  },

  about: {
    src: "/media/product/hotel-suite.jpg",
    fallback: "/media/product/hotel-suite.jpg",
  },

  productSpotlight: {
    src: "/media/product/proline-bottle.png",
    fallback: "/media/product/proline-bottle.png",
  },

  gallery: [
    {
      src: "/media/gallery/gallery-01-organisation.jpg",
      alt: "Organisation du matériel de nettoyage professionnel",
      caption: "Organisation",
    },
    {
      src: "/media/gallery/gallery-02-clean-home.jpg",
      alt: "Nettoyage professionnel",
      caption: "Nettoyage",
    },
    {
      src: "/media/gallery/gallery-03-mop-floor.jpg",
      alt: "Nettoyage professionnel des sols",
      caption: "Sols",
    },
    {
      src: "/media/gallery/gallery-04-routine.jpg",
      alt: "Routine de nettoyage professionnel",
      caption: "Routine",
    },
    {
      src: "/media/gallery/gallery-05-window.jpg",
      alt: "Nettoyage professionnel des vitres",
      caption: "Vitrerie",
    },
    {
      src: "/media/gallery/gallery-06-caddy.jpg",
      alt: "Chariot de nettoyage professionnel",
      caption: "Matériel",
    },
  ],

  ctaBanner: {
    src: "/media/454455.jpeg",
    fallback: "/media/12222.jpeg",
  },

  catalogue: "",
} as const;
