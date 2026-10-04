/**
 * ============================================================
 * PROLINE LAB — REGISTRE CENTRAL DES MÉDIAS
 * ============================================================
 *
 * SOURCE UNIQUE :
 * public/media/
 *
 * IMPORTANT :
 * Seuls les fichiers DIRECTEMENT présents dans public/media
 * sont utilisés ici.
 *
 * Aucun média de :
 *   public/images
 *   public/videos
 *   public/media/images
 *   public/media/gallery
 *   public/media/product
 *   public/media/video
 *   public/media/videos
 * n'est utilisé.
 */

export const IMAGES = {
  hero: {
    src: "/media/12222.jpeg",
    fallback: "/media/454455.jpeg",
  },

  actionVideo: "/media/Video Project.mp4",

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
    src: "/media/454455.jpeg",
    fallback: "/media/12222.jpeg",
  },

  productSpotlight: {
    src: "/media/Putzkorb für zuhause_ alles griffbereit für die schnelle Reinigung - Copie.jpg",
    fallback: "/media/téléchargement (5) - Copie.jpg",
  },

  gallery: [
    {
      src: "/media/12222.jpeg",
      alt: "Proline Lab",
      caption: "Proline Lab",
    },
    {
      src: "/media/454455.jpeg",
      alt: "Nettoyage professionnel",
      caption: "Nettoyage",
    },
    {
      src: "/media/cuisine.jpg",
      alt: "Cuisine professionnelle",
      caption: "Cuisine",
    },
    {
      src: "/media/Petite buanderie.jpg",
      alt: "Buanderie professionnelle",
      caption: "Buanderie",
    },
    {
      src: "/media/piscine.jpg",
      alt: "Piscine professionnelle",
      caption: "Piscine",
    },
    {
      src: "/media/sanitaires (2).jpg",
      alt: "Sanitaires professionnels",
      caption: "Sanitaires",
    },
    {
      src: "/media/locaux commun.jpg",
      alt: "Locaux communs",
      caption: "Locaux communs",
    },
    {
      src: "/media/machine automatique.jpg",
      alt: "Machine automatique",
      caption: "Machines",
    },
    {
      src: "/media/sugestão quarto Duvivier Anderson_Roman - Copie.jpg",
      alt: "Chambre professionnelle",
      caption: "Chambre",
    },
  ],

  ctaBanner: {
    src: "/media/454455.jpeg",
    fallback: "/media/12222.jpeg",
  },

  videos: {
    main: "/media/Video Project.mp4",
    secondary: "/media/2132.mp4",
  },

  catalogue: "",
} as const;
