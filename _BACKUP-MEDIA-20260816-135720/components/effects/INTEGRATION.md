# Effects library — install & integration notes

Toutes les fonctions de la checklist ont été livrées d'un coup, regroupées par
catégorie dans `components/effects/*`. Copie ce dossier dans ton projet Next.js
(à côté de `Home.jsx`), puis importe ce dont tu as besoin section par section —
tout n'a pas vocation à être actif en même temps sur la même page (voir "Où les
utiliser" plus bas).

## 1. Installation des librairies lourdes

```bash
npm install three @react-three/fiber @react-three/drei
npm install @splinetool/react-spline @splinetool/runtime
npm install lottie-react
npm install matter-js
npm install pixi.js
```

GSAP (déjà utilisé dans le projet) reste en version gratuite :
```bash
npm install gsap
```

## 2. Plugins GSAP payants → équivalents gratuits

| Plugin payant (Club GreenSock) | Remplacé par | Fichier |
|---|---|---|
| **SplitText** | Découpage manuel en lettres/mots/lignes avec `useMemo` + `motion.span`, staggered via Framer Motion | `effects/text.jsx` (`BlurWord` déjà dans `Home.jsx`, + `CharWave`, `CharBounce`, `SplitLines`) |
| **Flip** | Transitions layout via `motion.div layout` (Framer Motion) ou re-calcul manuel de position avant/après (voir `StackCards`) | `effects/gallery.jsx` |
| **Draggable** | `drag` natif de Framer Motion (`whileTap`, `dragConstraints`, `onDragEnd`) | `effects/gallery.jsx` (`StackCards`), `effects/backgrounds` via pointer listeners |
| **MorphSVG** | Interpolation de `d` entre deux tracés SVG via `motion.path animate={{ d }}` | `effects/svg.jsx` (`MorphIcon`) |

Rendu visuel équivalent, sans dépendance payante.

## 3. Où les utiliser (suggestion de câblage dans `Home.jsx`)

- **Curseur / ripple** (`effects/cursor.jsx`) : monter `<CustomCursor />` et
  `<RippleStyles />` une fois au niveau racine de `Home.jsx`, à côté de
  `<CursorLight />` qui existe déjà. Utiliser `useRipple()` sur les boutons
  `.btn-solid` / `.cta-pill`.
- **Fonds d'ambiance** (`effects/backgrounds.jsx`) : `<AuroraBackground />` ou
  `<MeshGradient />` en fond de `#hero` ou `#cta-banner` ; `<NoiseGrain />` en
  overlay global juste sous `<CursorLight />` ; `<ParticleField mode="stars" />`
  derrière `#about` ; `<ParticleField mode="bubbles" />` derrière `#spotlight-product`.
- **Texte** (`effects/text.jsx`) : remplacer certains `<h2>` par `<GradientText>`
  ou `<SplitLines>` ; utiliser `<Typewriter>` dans le hero si tu veux un effet
  machine à écrire sur le sous-titre.
- **Cartes** (`effects/cards.jsx`) : `<MouseGlowCard>` ou `<BorderTraceCard>`
  autour des `.value-card` existantes (en plus du `TiltCard` déjà en place).
- **Boutons** (`effects/buttons.jsx`) : `<LiquidButton>` ou
  `<LoadingMorphButton>` pour le CTA "Demander un devis".
- **Navigation** (`effects/navigation.jsx`) : `useHideOnScroll()` sur
  `#site-header` ; `<MorphingHamburger>` pour le menu mobile (actuellement
  masqué en `<1024px` sans remplaçant) ; `<ScrollProgressBar>` en haut de page.
- **Stats** (`effects/stats.jsx`) : `<NumberRoll>` ou `<CircularProgress>` en
  variante/complément du compteur GSAP déjà présent dans `#stats`.
- **Galerie** (`effects/gallery.jsx`) : `<MasonryGallery>` ou `<Coverflow>` en
  alternative au slider horizontal pinné existant ; `<BeforeAfterSlider>` pour
  une démonstration avant/après nettoyage.
- **Showcase produit 3D** (`effects/showcase3d.jsx`) : remplace ou complète
  `#spotlight-product` par `<ProductShowcase3D />` (rotation 360°, vue éclatée,
  icônes en orbite).
- **Loader** (`effects/loading.jsx`) : `<PercentageLoader onDone={...} />` peut
  remplacer le `#loader` statique actuel pour un vrai loader avec pourcentage.
- **Micro-interactions** (`effects/micro.jsx`) : à utiliser dans le formulaire
  newsletter du footer (`<FloatingLabelInput>`, `<AnimatedCheckbox>`,
  `<ToastStack>` pour la confirmation d'envoi).
- **Transitions** (`effects/transitions.jsx`) : `<CircularReveal>` ou
  `<CurtainReveal>` pour les changements de route si le site devient
  multi-page.

## 4. Performance

Tous les composants respectent déjà les bonnes pratiques listées dans ta
checklist :
- `transform`/`opacity` uniquement pour les animations (GPU-friendly)
- `IntersectionObserver` pour couper les canvases hors écran
- `prefers-reduced-motion` respecté (les composants Framer Motion héritent du
  hook `usePrefersReducedMotion` déjà présent dans `Home.jsx`)
- Canvas redimensionnés avec `devicePixelRatio` plafonné à 2

⚠️ N'active pas Three.js/Pixi/Matter en même temps sur la même section : ce
sont trois moteurs de rendu distincts, chacun avec son propre coût GPU/CPU.
Choisis-en un par section selon l'effet recherché (3D produit → Three.js,
particules massives → Pixi, physique/bulles → Matter.js).
