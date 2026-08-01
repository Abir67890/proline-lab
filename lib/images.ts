// Photos réelles issues de Wikimedia Commons (licence libre : CC-BY / CC-BY-SA / CC0),
// choisies pour correspondre au métier de Proline Lab (hygiène professionnelle).
// Chaque image a un repli automatique (onError côté composant) vers une photo de
// substitution si le lien venait à changer. Voir CREDITS.md à la racine du projet
// pour l'attribution complète de chaque photo.

export const IMAGES = {
  hero: {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Janitor%27s_bucket_with_mop.jpg?width=1800",
    fallback: "https://picsum.photos/seed/prolinehero2026/1800/1100",
  },
  about: {
    src: "/media/product/hotel-suite.jpg",
    fallback: "/media/product/hotel-suite.jpg",
  },
  ctaBanner: {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/Marina_Bay_Sands_Hotel_Lobby_view_201012.jpg?width=1800",
    fallback: "https://picsum.photos/seed/prolinecta2027/1800/1000",
  },
  catalogue: "/catalogue/proline-lab-catalogue.pdf",
  productSpotlight: {
    src: "/media/product/proline-bottle.png",
    fallback: "/media/product/proline-bottle.png",
  },
  hotelSuite: {
    src: "/media/product/hotel-suite.jpg",
    fallback: "/media/product/hotel-suite.jpg",
  },
  actionVideo: "/media/video/proline-action.mp4",
  gallery: [
    { src: "/media/gallery/gallery-01-organisation.jpg", alt: "Rangement et organisation d'espaces propres", caption: "Espaces organisés" },
    { src: "/media/gallery/gallery-02-clean-home.jpg", alt: "Intérieur impeccable, sanitaires et buanderie", caption: "Un intérieur qui respire" },
    { src: "/media/gallery/gallery-03-mop-floor.jpg", alt: "Serpillière microfibre sur parquet lumineux", caption: "Sols impeccables" },
    { src: "/media/gallery/gallery-04-routine.jpg", alt: "Routine de nettoyage professionnelle au quotidien", caption: "La routine hygiène" },
    { src: "/media/gallery/gallery-05-window.jpg", alt: "Nettoyage de vitres avec équipement professionnel", caption: "Surfaces et vitrages" },
    { src: "/media/gallery/gallery-06-caddy.jpg", alt: "Caddy de nettoyage professionnel équipé", caption: "Le kit du pro" },
  ],
  categories: {
    cuisine: {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/Chiang_Mai_restaurant_kitchen.JPG?width=900",
      fallback: "https://picsum.photos/seed/prolinecuisine2026/700/600",
    },
    machine: {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/HOBART_DISHWASHER_2.JPG?width=900",
      fallback: "https://picsum.photos/seed/prolinemachine2026/700/600",
    },
    buanderie: {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/Industrial_laundry_sorting.jpg?width=900",
      fallback: "https://picsum.photos/seed/prolinebuanderie2026/700/600",
    },
    sanitaire: {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/Luxury_sink.jpg?width=900",
      fallback: "https://picsum.photos/seed/prolinesanitaire2026/700/600",
    },
    communs: {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/Fairmont_Hotel_lobby_(San_Francisco).JPG?width=900",
      fallback: "https://picsum.photos/seed/prolinecommuns2027/700/600",
    },
    piscine: {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/Hotel_del_Coronado_swimming_pool.jpg?width=900",
      fallback: "https://picsum.photos/seed/prolinepiscine2026/700/600",
    },
  },
} as const;
