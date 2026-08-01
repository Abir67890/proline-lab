# Proline Lab — Journal des ajouts (nouvelle vague d'effets)

Ce document résume tout ce qui a été ajouté au projet Next.js existant.
Rien de l'architecture d'origine n'a été supprimé : le loader, les boutons
`.magnetic`, le spot `#spotlight`, le tilt 3D (`.tilt-target`), les reveals
(`.reveal` / `.reveal-3d`) et les galeries pinnées restent pilotés exactement
comme avant par `lib/useSiteAnimations.ts` + `app/globals.css`. Tout le
nouveau code est **additif**.

## 1. Ce qui a été ajouté

| Fichier | Rôle |
|---|---|
| `components/effects/cursor.jsx` | Curseur custom, traînée, ripple au clic (disponibles, non actifs par défaut pour ne pas doubler le spotlight existant) |
| `components/effects/text.jsx` | Typewriter, texte dégradé animé, néon, texte circulaire, mask reveal, wave/bounce de caractères, mots glissants, stroke drawing, handwriting SVG, rotating text, split lines |
| `components/effects/backgrounds.jsx` | Aurora, mesh gradient, grain/bruit filmique, rayons de lumière, lens flare, grille animée, particules (stars/rain/snow/dust/bubbles/smoke), blobs animés |
| `components/effects/cards.jsx` | Neumorphisme, bordure tracée, glow au curseur, ripple hover |
| `components/effects/buttons.jsx` | Bouton liquide, icône glissante, morph loading→check |
| `components/effects/navigation.jsx` | Hide-on-scroll, hamburger animé, indicateur de section active, barre de progression de scroll |
| `components/effects/gallery.jsx` | Masonry, slider avant/après, stack cards (drag), coverflow |
| `components/effects/stats.jsx` | Nombre "odomètre", anneau de progression circulaire |
| `components/effects/svg.jsx` | Path drawing, morph d'icône, line tracing |
| `components/effects/transitions.jsx` | Fade/blur/scale/rotate/flip, curtain reveal, circular reveal, liquid transition |
| `components/effects/loading.jsx` | Loader à pourcentage, loader à forme morphante |
| `components/effects/micro.jsx` | Checkbox/toggle animés, input à label flottant, succès animé, toasts, accordéon |
| `components/effects/showcase3d.jsx` | **Three.js / React Three Fiber** — produit en 3D, rotation 360°, vue éclatée, icônes en orbite |
| `components/effects/lottie.jsx` | Lecteur Lottie (animations vectorielles) |
| `components/effects/matter.jsx` | **Matter.js** — bulles physiques interactives |
| `components/effects/pixi.jsx` | **PixiJS** — champ de particules GPU |
| `components/effects/spline.jsx` | Embed **Spline** (scène 3D interactive) |
| `components/effects/INTEGRATION.md` | Détail plugin par plugin, section par section |

## 2. Ce qui a été câblé dans `components/Home.tsx`

- Import de `useState` + des composants ci-dessus.
- **Header** : bouton hamburger animé (`MorphingHamburger`) + panneau de nav
  mobile (nouveau — l'ancien header cachait simplement les liens en dessous
  de 900px sans les remplacer).
- **Bruit filmique** (`NoiseGrain`) et **barre de progression de scroll**
  (`ScrollProgressBar`) montés une fois, juste après `#spotlight`.
- **Toasts** (`ToastStack`) montés globalement, utilisés par le formulaire
  newsletter.
- **Hero** : fond `AuroraBackground` + `LightRays` derrière la vidéo ;
  script "by Dr. Gamm" en texte dégradé animé (`GradientText`).
- **Stats** : ligne bonus avec anneau de progression circulaire
  (`CircularProgress`) et nombre "odomètre" (`NumberRoll`), en complément
  des compteurs GSAP déjà en place (non remplacés).
- **Nouvelle section `#product-3d`** juste après `#spotlight-product` :
  showcase produit en 3D (Three.js/R3F), rotation à la souris, bascule
  vue assemblée / vue éclatée, icônes en orbite.
- **Nouvelle section `#gallery-alt`** après le catalogue : slider
  avant/après (`BeforeAfterSlider`) + galerie masonry (`MasonryGallery`),
  utilisant les photos déjà présentes dans `IMAGES.gallery`.
- **Nouvelle section `#faq`** après la timeline process : accordéon animé
  à 3 questions (contenu à ajuster librement).
- **Footer** : formulaire newsletter remplacé par une version animée
  (`FloatingLabelInput` + `AnimatedCheckbox` + confirmation par toast).

## 3. `package.json` — dépendances ajoutées

```json
"framer-motion": "^11.11.0",
"three": "^0.169.0",
"@react-three/fiber": "^8.17.10",
"@react-three/drei": "^9.114.0",
"@splinetool/react-spline": "^4.0.0",
"@splinetool/runtime": "^1.9.48",
"lottie-react": "^2.4.0",
"matter-js": "^0.20.0",
"pixi.js": "^8.5.2"
```

Après extraction du zip :

```bash
cd proline-lab
npm install
npm run dev
```

## 4. Plugins GSAP payants → équivalents gratuits

| Plugin payant | Équivalent gratuit utilisé | Où |
|---|---|---|
| **SplitText** | Découpage manuel en lettres/mots/lignes + stagger Framer Motion | `effects/text.jsx` |
| **Flip** | `drag` Framer Motion + recalcul manuel de position (voir `StackCards`) | `effects/gallery.jsx` |
| **Draggable** | `drag`/`dragConstraints`/`onDragEnd` natifs de Framer Motion | `effects/gallery.jsx` |
| **MorphSVG** | Interpolation du `d` entre deux tracés via `motion.path animate={{ d }}` | `effects/svg.jsx` (`MorphIcon`) |

Rendu visuel équivalent, sans dépendance payante au Club GreenSock.
Le reste de GSAP (core + ScrollTrigger) est inchangé et reste la base de
`lib/useSiteAnimations.ts`.

## 5. Ce qui n'a volontairement PAS été touché

- `lib/useSiteAnimations.ts` — système GSAP existant (loader, magnetic,
  spotlight, tilt, parallax, pinned scroll, compteurs, timeline) : intact.
- `app/globals.css` (les ~387 lignes d'origine) : intactes, seulement
  complétées en fin de fichier par les styles des nouvelles sections.
- `components/Catalogue.tsx`, `components/SafeImage.tsx`, `lib/images.ts`,
  `lib/products.ts` : inchangés.

## 6. Vérifications effectuées ici (sans accès réseau/npm install)

- Analyse syntaxique de tous les fichiers modifiés/ajoutés avec le parseur
  TypeScript (`ts.createSourceFile` en mode TSX/JSX) : **aucune erreur de
  syntaxe**.
- Les erreurs "Cannot find module 'react'" etc. obtenues lors d'un premier
  essai de `tsc --noEmit` sont normales : elles viennent de l'absence de
  `node_modules` dans cet environnement (pas d'accès réseau ici), pas d'un
  problème de code. Elles disparaîtront après ton `npm install`.

## 7. Pistes pour la suite

- Le curseur personnalisé (`CustomCursor`/`CursorTrail`) est prêt mais pas
  monté par défaut, pour ne pas dupliquer le `#spotlight` déjà en place :
  active-le dans `Home.tsx` si tu veux remplacer le spot actuel.
- N'active pas Three.js + PixiJS + Matter.js sur la même section en même
  temps (3 moteurs de rendu distincts, coût GPU cumulatif) — voir
  `components/effects/INTEGRATION.md`.
- Les 3 nouvelles sections (`#product-3d`, `#gallery-alt`, `#faq`) ont un
  contenu de démonstration : à personnaliser (textes, questions FAQ,
  libellés d'orbite du produit 3D).

## 8. Base de données (nouveau)

Ajout d'un dossier `database/` avec :

- `schema.sql` — schéma PostgreSQL complet : entreprises (`companies`),
  contacts (`contacts` — email, téléphone, poste), demandes de devis
  (`quote_requests` + `quote_request_items`), inscriptions newsletter
  (`newsletter_subscribers`), messages de contact (`contact_messages`),
  et une base commandes (`orders` / `order_items`) prête si la vente en
  ligne est activée plus tard. Types énumérés, index, triggers
  `updated_at`, contraintes de validation d'email inclus.
- `seed.sql` — données de démonstration optionnelles pour tester le
  schéma rapidement.
- `README.md` — installation (`psql`, Supabase…) et comment brancher les
  formulaires existants du site (bouton "Demander un devis", newsletter
  du footer) via des routes API Next.js côté serveur.

Ce schéma est entièrement additif : aucune dépendance avec le reste du
code, à adopter progressivement en créant les routes API qui écriront
dedans.
