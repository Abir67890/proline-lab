# Proline Lab — Site web

Site vitrine premium pour **PROLINE HYGIENE by Dr. Gamm**, construit avec :

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** (tokens de design dans `app/globals.css`)
- **GSAP + ScrollTrigger** pour les animations (scrub, effets 3D au scroll,
  tracking souris, slider de colonnes épinglé, transformation de layers)
- Catalogue produits réel (29 références) avec filtre par catégorie

## Installation

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## Build de production

```bash
npm run build
npm run start
```

## Structure

```
app/
  layout.tsx        → polices Google Fonts (next/font) + métadonnées
  globals.css        → tokens Tailwind 4 + tous les styles
  page.tsx            → point d'entrée, rend <Home />
components/
  Home.tsx            → toutes les sections de la page d'accueil
  Catalogue.tsx        → grille produits filtrable (état React)
lib/
  products.ts          → données du catalogue réel (typées)
  useSiteAnimations.ts  → hook GSAP/ScrollTrigger (toutes les animations)
```

## Images

Les photos par défaut proviennent de **Wikimedia Commons** (licence libre),
choisies pour correspondre au métier de Proline Lab : cuisine
professionnelle, lave-vaisselle industriel, buanderie, sanitaires
hôteliers, lobby, piscine. Chaque image a un repli automatique
(`components/SafeImage.tsx`) vers une photo de substitution si le lien
venait à changer. Voir `CREDITS.md` pour l'attribution complète.

Pour les remplacer par vos propres photos/vidéos produits :

1. Déposez vos fichiers dans `public/images/`.
2. Éditez `lib/images.ts` et remplacez les `src` (et éventuellement
   `fallback`) par `/images/votre-fichier.jpg`.

## Animations incluses

- **Scrub** : parallax photo + blocs de marque liés en temps réel au scroll
- **3D scroll** : entrée en rotation `rotateX` des bannières catégories
- **Mouse tracking** : spotlight global + tilt 3D des cartes au survol
- **Hover light reveal** : halo lumineux qui suit le curseur dans les cartes
- **Columns slider** : section "Pourquoi Proline Lab" épinglée en scroll horizontal
- **Layer transformation** : blocs colorés à profondeurs de scroll différentes
