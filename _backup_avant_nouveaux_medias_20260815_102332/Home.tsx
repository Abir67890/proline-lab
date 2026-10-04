"use client";

import { useState } from "react";
import Catalogue from "./Catalogue";
import SafeImage from "./SafeImage";
import { IMAGES } from "@/lib/images";
import { useSiteAnimations } from "@/lib/useSiteAnimations";

// ---- Additive effects library (components/effects/*, see INTEGRATION.md) ----
// These are new, self-contained additions layered on top of the existing
// GSAP/CSS system (loader, magnetic buttons, spotlight, tilt, pinned scroll)
// which is left completely untouched below.
import { NoiseGrain, AuroraBackground, LightRays } from "./effects/backgrounds";
import { GradientText } from "./effects/text";
import { NumberRoll, CircularProgress } from "./effects/stats";
import { MasonryGallery, BeforeAfterSlider } from "./effects/gallery";
import { ProductShowcase3D } from "./effects/showcase3d";
import { MorphingHamburger, ScrollProgressBar } from "./effects/navigation";
import { AnimatedCheckbox, FloatingLabelInput, ToastStack, AccordionItem } from "./effects/micro";

// ============================================================
// PROLINE — Catégories, teintes alignées sur la palette bleue
// du catalogue (voir --color-cat-* dans globals.css)
// ============================================================
const CATEGORIES = [
  {
    key: "cuisine",
    n: "01",
    title: "Cuisine & Restaurant",
    desc:
      "Dégraissants et nettoyants pour vaisselle, plaques et cuisson intensive.",
    img: IMAGES.categories.cuisine,
    tint: `rgba(120, 150, 174, .72)`,
  },
  {
    key: "machine",
    n: "02",
    title: "Machines automatiques",
    desc:
      "Lave-vaisselle et lave-verre professionnels, brillance garantie.",
    img: IMAGES.categories.machine,
    tint: `rgba(95, 175, 200, .72)`,
  },
  {
    key: "buanderie",
    n: "03",
    title: "Buanderie",
    desc:
      "Détachants, blanchissants et adoucissants pour le linge hôtelier.",
    img: IMAGES.categories.buanderie,
    tint: `rgba(105, 199, 227, .72)`,
  },
  {
    key: "sanitaire",
    n: "04",
    title: "Service étage & Sanitaires",
    desc:
      "Détartrants et nettoyants pour sols et surfaces communes.",
    img: IMAGES.categories.sanitaire,
    tint: `rgba(137, 155, 200, .72)`,
  },
  {
    key: "communs",
    n: "05",
    title: "Locaux communs",
    desc:
      "Vitres, moquettes, parfums d'ambiance et surfaces métalliques.",
    img: IMAGES.categories.communs,
    tint: `rgba(82, 111, 145, .72)`,
  },
  {
    key: "piscine",
    n: "06",
    title: "Piscine",
    desc:
      "Traitement et entretien des bassins professionnels.",
    img: IMAGES.categories.piscine,
    tint: `rgba(79, 142, 209, .72)`,
  },
] as const;

const ADVANTAGES = [
  { n: "01", c: "#7896AE", title: "Formulation laboratoire", desc: "Chaque produit est testé et dosé avec précision avant industrialisation." },
  { n: "02", c: "#5FAFC8", title: "Réactivité logistique", desc: "Livraison 24/48h sur l'ensemble du réseau hôtelier." },
  { n: "03", c: "#69C7E3", title: "Accompagnement terrain", desc: "Formation des équipes et conseils de dosage sur site." },
  { n: "04", c: "#899BC8", title: "Conformité & sécurité", desc: "Fiches techniques et de sécurité disponibles pour chaque référence." },
  { n: "05", c: "#4F8ED1", title: "Savoir-faire tunisien", desc: "Une fabrication locale, au plus près des besoins du terrain." },
];

type Toast = { id: number; text: string };

export default function Home() {
  useSiteAnimations();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterConsent, setNewsletterConsent] = useState(false);

  function pushToast(text: string) {
    const id = Date.now();
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }

  function submitNewsletter(e: React.FormEvent) {
    e.preventDefault();
    if (!newsletterEmail.includes("@")) {
      pushToast("Merci d'indiquer un email valide.");
      return;
    }
    pushToast("Inscription confirmée — merci !");
    setNewsletterEmail("");
  }

  return (
    <>
      <div id="loader">
        <div className="blocks"><i></i><i></i><i></i><i></i></div>
        <div className="mark">PROLINE LAB</div>
        <div className="bar"><span></span></div>
      </div>
      <div id="spotlight"></div>
      <NoiseGrain opacity={0.035} />
      <ScrollProgressBar color="var(--color-green-light)" />
      <ToastStack toasts={toasts} />

      <header id="site-header">
        <div className="brand">
          <div className="blocks"><i></i><i></i><i></i><i></i></div>
          <div className="brand-text">proline<span>lab</span></div>
        </div>
        <nav className="links nav-mobile-hide" id="nav-links">
          <a href="#categories">Produits</a>
          <a href="#catalogue">Catalogue</a>
          <a href="#process">Laboratoire</a>
          <a href="#about">À propos</a>
          <a href="#cta-banner">Contact</a>
          <span id="nav-indicator"></span>
        </nav>
        
        <a
          href="mailto:prolinehygiene@gmail.com?subject=Demande%20de%20devis%20professionnel%20-%20Proline&body=Madame,%20Monsieur,%0D%0A%0D%0AJe%20souhaite%20solliciter%20un%20devis%20personnalisé%20pour%20les%20solutions%20d'hygiène%20Proline.%20Veuillez%20trouver%20ci-dessous%20les%20coordonnées%20de%20notre%20établissement%20ainsi%20que%20les%20détails%20de%20notre%20projet%20:%0D%0A%0D%0A---%20INFORMATIONS%20ENTREPRISE%20---%0D%0A•%20Raison%20Sociale%20/%20Établissement%20:%20%0D%0A•%20Nom%20du%20contact%20:%20%0D%0A•%20Téléphone%20professionnel%20:%20%0D%0A•%20Adresse%20:%20%0D%0A%0D%0A---%20DÉTAILS%20DE%20LA%20DEMANDE%20---%0D%0A•%20Produits%20ou%20services%20souhaités%20:%20%0D%0A•%20Spécificités%20de%20l'établissement%20:%20%0D%0A%0D%0AJe%20vous%20remercie%20par%20avance%20pour%20votre%20retour%20rapide.%0D%0A%0D%0ACordialement,"
          className="cta-pill magnetic"
        >
          Demander un devis
        </a>

        <MorphingHamburger
          open={mobileNavOpen}
          onClick={() => setMobileNavOpen((o) => !o)}
          className="nav-mobile-only"
        />

        {mobileNavOpen && (
          <nav className="mobile-nav">
            <a href="#categories" onClick={() => setMobileNavOpen(false)}>Produits</a>
            <a href="#catalogue" onClick={() => setMobileNavOpen(false)}>Catalogue</a>
            <a href="#process" onClick={() => setMobileNavOpen(false)}>Laboratoire</a>
            <a href="#about" onClick={() => setMobileNavOpen(false)}>À propos</a>
            <a href="#cta-banner" onClick={() => setMobileNavOpen(false)}>Contact</a>
          </nav>
        )}
      </header>

      <section id="hero">
        <AuroraBackground />
        <LightRays />
        <div className="photo-frame" data-parallax="0.25">
          <video className="hero-video" autoPlay muted loop playsInline preload="auto" poster={IMAGES.hero.fallback}>
            <source src={IMAGES.actionVideo} type="video/mp4" />
          </video>
          <div className="tint"></div>
        </div>
        <div className="layer-field" id="layer-field">
          <div className="layer-block" style={{ background: "var(--color-yellow)", top: "20%", left: "10%" }} data-depth="0.6" />
          <div className="layer-block" style={{ background: "var(--color-red)", top: "68%", left: "16%" }} data-depth="0.3" />
          <div className="layer-block" style={{ background: "var(--color-blue)", top: "22%", left: "80%" }} data-depth="0.45" />
          <div className="layer-block" style={{ background: "var(--color-pink)", top: "72%", left: "84%" }} data-depth="0.7" />
          <div className="layer-block" style={{ background: "var(--color-green-light)", top: "45%", left: "6%", width: 12, height: 12 }} data-depth="0.85" />
          <div className="layer-block" style={{ background: "var(--color-yellow)", top: "40%", left: "90%", width: 14, height: 14 }} data-depth="0.5" />
        </div>
        <div className="eyebrow">Hygiène professionnelle · By Dr. Gamm</div>
        <h1 className="hero-headline">
          <span className="word left">PROLINE</span><span className="word right">HYGIENE</span>
        </h1>
        <div className="hero-script"><GradientText colors={["#4F8ED1", "#315F91", "#8AA8C4"]}>by Dr. Gamm</GradientText></div>
        <div className="hero-divider"></div>
        <p className="hero-sub">Des formules conçues en laboratoire pour les hôtels, restaurants et établissements exigeants efficacité mesurée, sécurité contrôlée, résultats constants.</p>
        <div className="hero-ctas">
          <a href="#categories" className="btn-solid magnetic">Découvrir les produits</a>
          <a href={IMAGES.catalogue} download="Proline-Lab-Catalogue.pdf" className="btn-outline magnetic">Télécharger le catalogue</a>
        </div>
        <div className="badge-clean">
          <div className="ring"><span className="pct">100%</span></div>
          <div className="lbl">PROPRE</div>
        </div>
        <div className="scroll-cue">↓</div>
      </section>

      <div className="marquee-wrap">
        <div className="marquee">
          {[...KICKERS_MARQUEE(), ...KICKERS_MARQUEE()].map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>

      <section id="stats">
        <div className="stats-grid">
          <div className="stat reveal-3d"><div className="num" data-count="100">0<span>+</span></div><div className="label">Produits professionnels</div></div>
          <div className="stat reveal-3d"><div className="num" data-count="1000">0<span>+</span></div><div className="label">Clients satisfaits</div></div>
          <div className="stat reveal-3d"><div className="num" data-count="98" data-suffix="%">0<span>%</span></div><div className="label">Satisfaction client</div></div>
          <div className="stat reveal-3d"><div className="num" data-static="24/48h">24/48h</div><div className="label">Livraison rapide</div></div>
        </div>
        <div className="stats-extra">
          <CircularProgress percent={98} color="#4F8ED1" />
          <div className="stats-extra-number"><NumberRoll value={1000} />+</div>
        </div>
      </section>

      <section id="about">
        <div className="about-wrap">
          <div className="photo-frame about-photo tilt-target" data-parallax="0.12">
            <SafeImage src={IMAGES.about.src} fallback={IMAGES.about.fallback} alt="Suite d'hôtel impeccable, résultat d'un entretien professionnel" />
            <div className="tint"></div>
          </div>
          <div className="about-text reveal">
            <div className="section-eyebrow">Notre engagement</div>
            <h2 className="section-title">La propreté est notre engagement</h2>
            <p className="section-sub">Un savoir-faire tunisien pensé pour les environnements où l'hygiène ne tolère aucun compromis. Depuis notre création, nous concevons et fournissons des solutions sur mesure adaptées aux hôtels, aux restaurants et à tous les établissements professionnels.</p>
          </div>
        </div>
        <div className="values-grid">
          <div className="value-card reveal tilt-target"><div className="idx">01</div><h3>Expertise locale</h3><p>Un savoir-faire tunisien affûté au contact réel des cuisines, buanderies et sanitaires professionnels.</p></div>
          <div className="value-card reveal tilt-target"><div className="idx">02</div><h3>Adapté à l&apos;hôtellerie</h3><p>Des formules pensées pour les cadences et les contraintes des établissements hôteliers.</p></div>
          <div className="value-card reveal tilt-target"><div className="idx">03</div><h3>Accompagnement technique</h3><p>Conseils de dosage, formation des équipes et suivi personnalisé sur chaque site.</p></div>
          <div className="value-card reveal tilt-target"><div className="idx">04</div><h3>Exigence qualité</h3><p>Un contrôle constant, du laboratoire jusqu&apos;à la livraison, pour une performance sans surprise.</p></div>
        </div>
      </section>

      <section id="spotlight-product">
        <div className="spotlight-wrap">
          <div className="spotlight-visual tilt-target reveal" id="spotlight-layer-field">
            <div className="spotlight-glow"></div>
            <img src={IMAGES.productSpotlight.src} alt="Bouteille Proline, produit multi-usages professionnel" className="spotlight-bottle" />
            <div className="layer-block spotlight-layer" style={{ background: "var(--color-green)", top: "12%", left: "8%" }} data-depth="0.5">Nettoie les vitres</div>
            <div className="layer-block spotlight-layer" style={{ background: "var(--color-blue)", top: "20%", right: "6%", left: "auto" }} data-depth="0.35">Dégraisse en profondeur</div>
            <div className="layer-block spotlight-layer" style={{ background: "var(--color-yellow)", bottom: "22%", left: "4%", top: "auto" }} data-depth="0.6">Détartre les surfaces</div>
            <div className="layer-block spotlight-layer" style={{ background: "var(--color-red)", bottom: "10%", right: "10%", top: "auto", left: "auto" }} data-depth="0.4">Assainit en profondeur</div>
          </div>
          <div className="spotlight-text reveal-3d">
            <div className="section-eyebrow">Le produit signature</div>
            <h2 className="section-title">Un seul produit, une multitude de solutions</h2>
            <p className="section-sub">L&apos;efficacité simplifiée, la propreté maîtrisée. Une formule concentrée, sûre pour vos intérieurs, pensée pour des résultats professionnels sur chaque surface.</p>
            <ul className="spotlight-list">
              <li>Nettoie les vitres sans traces</li>
              <li>Dégraisse en profondeur</li>
              <li>Détartre toutes les surfaces</li>
              <li>Assainit en profondeur</li>
              <li>Fait briller sans traces</li>
              <li>Nettoie tous les sols</li>
            </ul>
            <div className="spotlight-tags">
              <span>Formule concentrée</span>
              <span>Sûr pour votre intérieur</span>
              <span>Résultats professionnels</span>
              <span>Respecte l&apos;environnement</span>
            </div>
            <button className="btn-solid magnetic">Voir la fiche produit</button>
          </div>
        </div>
      </section>

      <section id="product-3d">
        <div className="section-head reveal">
          <div className="section-eyebrow">Vue interactive</div>
          <h2 className="section-title">Explorez le produit en 3D</h2>
          <p className="section-sub">Bougez votre curseur sur le flacon pour incliner la vue et révéler la lumière.</p>
        </div>
        <div className="explorer3d-stage">
          <div className="explorer3d-ring"></div>
          <div className="explorer3d-frame" id="explorer3d-frame">
            <div className="explorer3d-badge"><span className="dot"></span><span>Aperçu produit</span></div>
            <video autoPlay muted loop playsInline preload="metadata">
              <source src="/videos/product-explorer.mp4" type="video/mp4" />
            </video>
            <div className="explorer3d-glare"></div>
            <div className="explorer3d-edge"></div>
          </div>
        </div>
        <div className="explorer3d-hint reveal">↔ déplacez la souris pour incliner</div>
      </section>

      <section id="categories">
        <div className="section-head reveal">
          <div className="section-eyebrow">Gamme</div>
          <h2 className="section-title">Six univers, une exigence</h2>
          <p className="section-sub">Chaque catégorie répond à un usage précis, du fourneau à la piscine.</p>
        </div>
        <div className="cat-grid-banners">
          {CATEGORIES.map((c) => (
            <div className={`cat-banner reveal tilt-target ${c.key}`} data-category={c.key} data-goto={c.key} key={c.key}>
              <div className="photo-frame" data-parallax="0.08" style={{ position: "absolute", inset: 0, borderRadius: 26 }}>
                <SafeImage src={c.img.src} fallback={c.img.fallback} alt={c.title} />
                <div className="tint" style={{ background: `linear-gradient(160deg, ${c.tint}, rgba(11,39,69,.55))` }}></div>
                <div className="tint-top"></div>
              </div>
              <div className="arrow-badge">→</div>
              <div className="label">
                <div className="kicker">{c.n} — {c.title.split(" ")[0]}</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="gallery" style={{ padding: 0 }}>
        <div className="gslide-pin">
          <div className="gslide-head reveal">
            <div className="section-eyebrow">L&apos;hygiène en image</div>
            <h2 className="section-title">Un quotidien impeccable, poste par poste</h2>
          </div>
          <div className="gslide-track" id="gslide-track">
            {IMAGES.gallery.map((g, i) => (
              <div className="gslide-col tilt-target" key={g.src}>
                <img src={g.src} alt={g.alt} loading="lazy" />
                <div className="gslide-shine"></div>
                <div className="gslide-caption">
                  <span className="idx">0{i + 1}</span>
                  <span>{g.caption}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="advantages" style={{ padding: 0 }}>
        <div className="hslide-pin">
          <div className="hslide-head reveal">
            <div className="section-eyebrow">Pourquoi Proline Lab</div>
            <h2 className="section-title">Cinq raisons de nous faire confiance</h2>
          </div>
          <div className="hslide-track" id="hslide-track">
            {ADVANTAGES.map((a) => (
              <div className="hslide-col tilt-target" style={{ ["--c" as string]: a.c }} key={a.n}>
                <span className="hslide-num">{a.n}</span>
                <h3>{a.title}</h3>
                <p>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Catalogue />

      <section id="gallery-alt">
        <div className="section-head reveal">
          <div className="section-eyebrow">Résultats</div>
          <h2 className="section-title">Avant / Après, en un coup d&apos;œil</h2>
        </div>
        <BeforeAfterSlider
          before={IMAGES.gallery[2].src}
          after={IMAGES.gallery[1].src}
          className="ba-demo"
        />
        <MasonryGallery images={IMAGES.gallery} columns={3} className="masonry-demo" />
      </section>

      <section id="process">
        <div className="section-head reveal">
          <div className="section-eyebrow">Notre process</div>
          <h2 className="section-title">Du laboratoire à votre établissement</h2>
          <p className="section-sub">Chaque produit suit un parcours contrôlé, étape par étape.</p>
        </div>
        <div className="timeline">
          <div className="line-track"></div>
          <div className="line-fill" id="tl-fill"></div>
          {["Laboratoire", "Recherche", "Fabrication", "Conditionnement", "Livraison", "Client"].map((label) => (
            <div className="tl-node" key={label}>
              <div className="dot"></div>
              <div className="tl-label">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="faq">
        <div className="section-head reveal">
          <div className="section-eyebrow">Questions fréquentes</div>
          <h2 className="section-title">Tout savoir sur nos produits</h2>
        </div>
        <div className="faq-list">
          <AccordionItem title="Livrez-vous partout en Tunisie ?" defaultOpen>
            Oui, sous 24 à 48h sur l&apos;ensemble du réseau hôtelier et de la restauration.
          </AccordionItem>
          <AccordionItem title="Proposez-vous une formation à l'usage des produits ?">
            Oui, un accompagnement terrain avec conseils de dosage est inclus pour chaque établissement partenaire.
          </AccordionItem>
          <AccordionItem title="Les fiches de sécurité sont-elles disponibles ?">
            Chaque référence dispose de sa fiche technique et de sécurité, disponible sur demande.
          </AccordionItem>
        </div>
      </section>

      <div id="cta-banner" className="photo-frame" data-parallax="0.1">
        <SafeImage src={IMAGES.ctaBanner.src} fallback={IMAGES.ctaBanner.fallback} alt="Équipe d'entretien professionnel" />
        <div className="tint"></div>
        <h2 className="reveal-3d">Une solution d&apos;hygiène pensée pour votre établissement</h2>
        <p className="reveal">Recevez le catalogue complet ou parlez à un conseiller technique sous 24h.</p>
        <div className="row reveal">
          <a href="#cta-banner" className="btn-solid magnetic">Demander un devis</a>
          <a href={IMAGES.catalogue} download="Proline-Lab-Catalogue.pdf" className="btn-outline magnetic">Télécharger le catalogue</a>
        </div>
      </div>

      <footer>
        <div className="footer-grid">
          <div>
            <div className="footer-logo"><div className="blocks"><i></i><i></i><i></i><i></i></div><div className="brand-text">proline<span>lab</span></div></div>
            <p>Produits professionnels de nettoyage et d&apos;hygiène, conçus à Sousse pour les établissements les plus exigeants.</p>
            <form className="newsletter" onSubmit={submitNewsletter}>
              <FloatingLabelInput label="Votre email" value={newsletterEmail} onChange={setNewsletterEmail} type="email" />
              <div className="newsletter-consent">
                <AnimatedCheckbox checked={newsletterConsent} onChange={setNewsletterConsent} />
                <span>J&apos;accepte de recevoir les actualités Proline Lab</span>
              </div>
              <button type="submit">OK</button>
            </form>
          </div>
          <div>
            <h4>Produits</h4>
            <a href="#catalogue" data-goto="cuisine">Cuisine & Restaurant</a>
            <a href="#catalogue" data-goto="buanderie">Buanderie</a>
            <a href="#catalogue" data-goto="piscine">Piscine</a>
          </div>
          <div>
            <h4>Entreprise</h4>
            <a href="#about">À propos</a>
            <a href="#">Certifications</a>
            <a href="#cta-banner">Contact</a>
          </div>
          <div>
            <h4>Contact</h4>
            <a href="tel:+21653123976">(+216) 53 123 976</a>
            <a href="mailto:contact@prolinelab.com">prolinehygiene@gmail.com</a>
            <a href="#">Sousse, Tunisie</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Proline Lab. Tous droits réservés.</span>
          <span>Design par Abir</span>
        </div>
      </footer>
    </>
  );
}

function KICKERS_MARQUEE() {
  return ["Hôtels", "Restaurants", "Cafés", "Hôpitaux", "Cliniques", "Écoles", "Centres commerciaux", "Entreprises de nettoyage", "Municipalités", "Spas & Fitness"];
}