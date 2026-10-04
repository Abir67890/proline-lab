"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SafeImage from "./SafeImage";
import { IMAGES, CATEGORY_VIDEOS } from "@/lib/images";
import { useSiteAnimations } from "@/lib/useSiteAnimations";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ============================================================
   PROLINE LAB â€” ULTRAGOD HOME
   - Blue identity compatible with the supplied globals.css
   - FR / EN / DE / CS / RU translations
   - 3D pointer tilt + glare
   - Magnetic buttons
   - Cursor light
   - Particle field
   - Hero parallax
   - GSAP scroll scenes
   - Animated counters
   - Scroll progress
   - Dynamic category focus
   - Accessible reduced-motion mode
   ============================================================ */

type Lang = "fr" | "en" | "de" | "cs" | "ru";

const LANGS: { id: Lang; label: string; flag: string }[] = [
  { id: "fr", label: "FR", flag: "ðŸ‡«ðŸ‡·" },
  { id: "en", label: "EN", flag: "ðŸ‡¬ðŸ‡§" },
  { id: "de", label: "DE", flag: "ðŸ‡©ðŸ‡ª" },
  { id: "cs", label: "CS", flag: "ðŸ‡¨ðŸ‡¿" },
  { id: "ru", label: "RU", flag: "ðŸ‡·ðŸ‡º" },
];

const T = {
  fr: {
    nav: {
      products: "Produits",
      catalogue: "Catalogue",
      lab: "Laboratoire",
      about: "Ã€ propos",
      contact: "Contact",
      quote: "Demander un devis",
    },
    hero: {
      eyebrow: "HygiÃ¨ne professionnelle Â· By Dr. Gamm",
      left: "PROLINE",
      right: "HYGIENE",
      script: "by Dr. Gamm",
      sub: "Des formules conÃ§ues en laboratoire pour les hÃ´tels, restaurants et Ã©tablissements exigeants â€” efficacitÃ© mesurÃ©e, sÃ©curitÃ© contrÃ´lÃ©e, rÃ©sultats constants.",
      discover: "DÃ©couvrir les produits",
      download: "TÃ©lÃ©charger le catalogue",
      clean: "PROPRE",
    },
    stats: [
      "Produits professionnels",
      "Clients satisfaits",
      "Satisfaction client",
      "Livraison rapide",
    ],
    about: {
      eyebrow: "Notre engagement",
      title: "La propretÃ© est notre engagement",
      text: "Un savoir-faire tunisien, pensÃ© pour les environnements oÃ¹ l'hygiÃ¨ne ne tolÃ¨re aucun compromis. Des solutions adaptÃ©es aux hÃ´tels, restaurants et Ã©tablissements professionnels.",
    },
    values: [
      ["Expertise locale", "Un savoir-faire tunisien affÃ»tÃ© au contact rÃ©el des cuisines, buanderies et sanitaires professionnels."],
      ["AdaptÃ© Ã  l'hÃ´tellerie", "Des formules pensÃ©es pour les cadences et les contraintes des Ã©tablissements hÃ´teliers."],
      ["Accompagnement technique", "Conseils de dosage, formation des Ã©quipes et suivi personnalisÃ© sur chaque site."],
      ["Exigence qualitÃ©", "Un contrÃ´le constant, du laboratoire jusqu'Ã  la livraison, pour une performance sans surprise."],
    ],
    spotlight: {
      eyebrow: "Le produit signature",
      title: "Un seul produit, une multitude de solutions",
      text: "L'efficacitÃ© simplifiÃ©e, la propretÃ© maÃ®trisÃ©e. Une formule concentrÃ©e, pensÃ©e pour des rÃ©sultats professionnels sur chaque surface.",
      bullets: [
        "Nettoie les vitres sans traces",
        "DÃ©graisse en profondeur",
        "DÃ©tartre toutes les surfaces",
        "Assainit en profondeur",
        "Fait briller sans traces",
        "Nettoie tous les sols",
      ],
      tags: ["Formule concentrÃ©e", "SÃ»r pour votre intÃ©rieur", "RÃ©sultats professionnels", "Respecte l'environnement"],
      button: "Voir la fiche produit",
      layers: ["Nettoie les vitres", "DÃ©graisse en profondeur", "DÃ©tartre les surfaces", "Assainit en profondeur"],
    },
    categories: {
      eyebrow: "Gamme",
      title: "Six univers, une exigence",
      sub: "Chaque catÃ©gorie rÃ©pond Ã  un usage prÃ©cis, du fourneau Ã  la piscine.",
    },
    gallery: {
      eyebrow: "L'hygiÃ¨ne en image",
      title: "Un quotidien impeccable, poste par poste",
    },
    advantages: {
      eyebrow: "Pourquoi Proline Lab",
      title: "Cinq raisons de nous faire confiance",
    },
    process: {
      eyebrow: "Notre process",
      title: "Du laboratoire Ã  votre Ã©tablissement",
      sub: "Chaque produit suit un parcours contrÃ´lÃ©, Ã©tape par Ã©tape.",
    },
    cta: {
      title: "Une solution d'hygiÃ¨ne pensÃ©e pour votre Ã©tablissement",
      text: "Recevez le catalogue complet ou parlez Ã  un conseiller technique sous 24h.",
      quote: "Demander un devis",
      catalogue: "TÃ©lÃ©charger le catalogue",
    },
    footer: {
      description: "Produits professionnels de nettoyage et d'hygiÃ¨ne, conÃ§us en Tunisie pour les Ã©tablissements les plus exigeants.",
      emailPlaceholder: "Votre email",
      products: "Produits",
      company: "Entreprise",
      contact: "Contact",
      certifications: "Certifications",
      city: "Tunisie",
      copyright: "Â© 2026 Proline Lab. Tous droits rÃ©servÃ©s.",
      design: "Design par Abir",
    },
    kicker: ["HÃ´tels", "Restaurants", "CafÃ©s", "HÃ´pitaux", "Cliniques", "Ã‰coles", "Centres commerciaux", "Entreprises de nettoyage", "MunicipalitÃ©s", "Spas & Fitness"],
  },

  en: {
    nav: { products: "Products", catalogue: "Catalogue", lab: "Laboratory", about: "About", contact: "Contact", quote: "Request a quote" },
    hero: {
      eyebrow: "Professional hygiene Â· By Dr. Gamm",
      left: "PROLINE", right: "HYGIENE", script: "by Dr. Gamm",
      sub: "Laboratory-designed formulas for hotels, restaurants and demanding facilities â€” measured efficiency, controlled safety, consistent results.",
      discover: "Discover products", download: "Download catalogue", clean: "CLEAN",
    },
    stats: ["Professional products", "Satisfied clients", "Customer satisfaction", "Fast delivery"],
    about: {
      eyebrow: "Our commitment", title: "Cleanliness is our commitment",
      text: "Tunisian know-how designed for environments where hygiene leaves no room for compromise. Solutions adapted to hotels, restaurants and professional facilities.",
    },
    values: [
      ["Local expertise", "Tunisian know-how refined through real professional kitchens, laundries and sanitary environments."],
      ["Hospitality ready", "Formulas designed for the pace and constraints of hotel operations."],
      ["Technical support", "Dosage advice, team training and personalized on-site follow-up."],
      ["Quality demanding", "Continuous control from laboratory to delivery for reliable performance."],
    ],
    spotlight: {
      eyebrow: "Signature product", title: "One product, countless solutions",
      text: "Simplified efficiency and controlled cleanliness. A concentrated formula designed for professional results on every surface.",
      bullets: ["Cleans glass without streaks", "Deep degreasing", "Removes limescale", "Deep sanitizing", "Leaves a brilliant finish", "Cleans all floors"],
      tags: ["Concentrated formula", "Safe for interiors", "Professional results", "Environment conscious"],
      button: "View product sheet",
      layers: ["Cleans glass", "Deep degreasing", "Removes limescale", "Deep sanitizing"],
    },
    categories: { eyebrow: "Range", title: "Six worlds, one standard", sub: "Every category answers a precise need, from kitchen to pool." },
    gallery: { eyebrow: "Hygiene in focus", title: "A spotless routine, station by station" },
    advantages: { eyebrow: "Why Proline Lab", title: "Five reasons to trust us" },
    process: { eyebrow: "Our process", title: "From laboratory to your facility", sub: "Every product follows a controlled path, step by step." },
    cta: { title: "A hygiene solution designed for your facility", text: "Receive the complete catalogue or speak to a technical advisor within 24h.", quote: "Request a quote", catalogue: "Download catalogue" },
    footer: {
      description: "Professional cleaning and hygiene products designed in Tunisia for the most demanding facilities.",
      emailPlaceholder: "Your email", products: "Products", company: "Company", contact: "Contact", certifications: "Certifications", city: "Tunisia",
      copyright: "Â© 2026 Proline Lab. All rights reserved.", design: "Design by Abir",
    },
    kicker: ["Hotels", "Restaurants", "CafÃ©s", "Hospitals", "Clinics", "Schools", "Shopping centers", "Cleaning companies", "Municipalities", "Spas & Fitness"],
  },

  de: {
    nav: { products: "Produkte", catalogue: "Katalog", lab: "Labor", about: "Ãœber uns", contact: "Kontakt", quote: "Angebot anfragen" },
    hero: {
      eyebrow: "Professionelle Hygiene Â· By Dr. Gamm", left: "PROLINE", right: "HYGIENE", script: "by Dr. Gamm",
      sub: "Im Labor entwickelte Formeln fÃ¼r Hotels, Restaurants und anspruchsvolle Einrichtungen â€” messbare Effizienz, kontrollierte Sicherheit, konstante Ergebnisse.",
      discover: "Produkte entdecken", download: "Katalog herunterladen", clean: "SAUBER",
    },
    stats: ["Professionelle Produkte", "Zufriedene Kunden", "Kundenzufriedenheit", "Schnelle Lieferung"],
    about: { eyebrow: "Unser Anspruch", title: "Sauberkeit ist unser Anspruch", text: "Tunesisches Know-how fÃ¼r Umgebungen, in denen Hygiene keine Kompromisse erlaubt. LÃ¶sungen fÃ¼r Hotels, Restaurants und professionelle Einrichtungen." },
    values: [
      ["Lokale Kompetenz", "Tunesisches Know-how aus der Praxis professioneller KÃ¼chen, WÃ¤schereien und SanitÃ¤rbereiche."],
      ["Hotellerie-tauglich", "Formeln fÃ¼r die AblÃ¤ufe und Anforderungen professioneller Hotelbetriebe."],
      ["Technische Begleitung", "Dosierberatung, Teamschulung und persÃ¶nliche Betreuung vor Ort."],
      ["QualitÃ¤tsanspruch", "Kontinuierliche Kontrolle vom Labor bis zur Lieferung fÃ¼r zuverlÃ¤ssige Leistung."],
    ],
    spotlight: {
      eyebrow: "Signature-Produkt", title: "Ein Produkt, unzÃ¤hlige LÃ¶sungen",
      text: "Vereinfachte Effizienz und kontrollierte Sauberkeit. Eine konzentrierte Formel fÃ¼r professionelle Ergebnisse auf jeder OberflÃ¤che.",
      bullets: ["Glas streifenfrei reinigen", "Tiefenentfettung", "Kalk entfernen", "Tiefenreinigung", "Brillanter Glanz", "Alle BÃ¶den reinigen"],
      tags: ["Konzentrierte Formel", "Sicher fÃ¼r InnenrÃ¤ume", "Professionelle Ergebnisse", "Umweltbewusst"], button: "Produktblatt ansehen",
      layers: ["Glas reinigen", "Tiefenentfettung", "Kalk entfernen", "Tiefenreinigung"],
    },
    categories: { eyebrow: "Sortiment", title: "Sechs Bereiche, ein Anspruch", sub: "Jede Kategorie erfÃ¼llt einen konkreten Bedarf â€” von KÃ¼che bis Pool." },
    gallery: { eyebrow: "Hygiene im Bild", title: "Perfekte Sauberkeit, Arbeitsplatz fÃ¼r Arbeitsplatz" },
    advantages: { eyebrow: "Warum Proline Lab", title: "FÃ¼nf GrÃ¼nde fÃ¼r unser Vertrauen" },
    process: { eyebrow: "Unser Prozess", title: "Vom Labor zu Ihrer Einrichtung", sub: "Jedes Produkt durchlÃ¤uft einen kontrollierten Prozess, Schritt fÃ¼r Schritt." },
    cta: { title: "Eine HygienelÃ¶sung fÃ¼r Ihre Einrichtung", text: "Erhalten Sie den vollstÃ¤ndigen Katalog oder sprechen Sie innerhalb von 24 Stunden mit einem technischen Berater.", quote: "Angebot anfragen", catalogue: "Katalog herunterladen" },
    footer: { description: "Professionelle Reinigungs- und Hygieneprodukte aus Tunesien fÃ¼r anspruchsvollste Einrichtungen.", emailPlaceholder: "Ihre E-Mail", products: "Produkte", company: "Unternehmen", contact: "Kontakt", certifications: "Zertifizierungen", city: "Tunesien", copyright: "Â© 2026 Proline Lab. Alle Rechte vorbehalten.", design: "Design von Abir" },
    kicker: ["Hotels", "Restaurants", "CafÃ©s", "KrankenhÃ¤user", "Kliniken", "Schulen", "Einkaufszentren", "Reinigungsunternehmen", "Gemeinden", "Spas & Fitness"],
  },

  cs: {
    nav: { products: "Produkty", catalogue: "Katalog", lab: "LaboratoÅ™", about: "O nÃ¡s", contact: "Kontakt", quote: "Poptat nabÃ­dku" },
    hero: {
      eyebrow: "ProfesionÃ¡lnÃ­ hygiena Â· By Dr. Gamm", left: "PROLINE", right: "HYGIENE", script: "by Dr. Gamm",
      sub: "LaboratornÄ› vyvinutÃ© receptury pro hotely, restaurace a nÃ¡roÄnÃ¡ zaÅ™Ã­zenÃ­ â€” mÄ›Å™itelnÃ¡ ÃºÄinnost, kontrolovanÃ¡ bezpeÄnost a stabilnÃ­ vÃ½sledky.",
      discover: "Objevit produkty", download: "StÃ¡hnout katalog", clean: "ÄŒISTOTA",
    },
    stats: ["ProfesionÃ¡lnÃ­ produkty", "SpokojenÃ­ klienti", "Spokojenost zÃ¡kaznÃ­kÅ¯", "RychlÃ© dodÃ¡nÃ­"],
    about: { eyebrow: "NÃ¡Å¡ zÃ¡vazek", title: "ÄŒistota je nÃ¡Å¡ zÃ¡vazek", text: "TuniskÃ© know-how pro prostÅ™edÃ­, kde hygiena nepÅ™ipouÅ¡tÃ­ kompromisy. Å˜eÅ¡enÃ­ pro hotely, restaurace a profesionÃ¡lnÃ­ provozy." },
    values: [
      ["LokÃ¡lnÃ­ odbornost", "TuniskÃ© know-how zaloÅ¾enÃ© na skuteÄnÃ½ch zkuÅ¡enostech z profesionÃ¡lnÃ­ch kuchynÃ­, prÃ¡delen a sanitÃ¡rnÃ­ch prostor."],
      ["Pro hotely", "Receptury navrÅ¾enÃ© pro tempo a specifickÃ© poÅ¾adavky hotelovÃ©ho provozu."],
      ["TechnickÃ¡ podpora", "PoradenstvÃ­ v dÃ¡vkovÃ¡nÃ­, Å¡kolenÃ­ tÃ½mÅ¯ a individuÃ¡lnÃ­ podpora na mÃ­stÄ›."],
      ["DÅ¯raz na kvalitu", "Kontrola od laboratoÅ™e aÅ¾ po dodÃ¡nÃ­ pro spolehlivÃ½ vÃ½kon."],
    ],
    spotlight: {
      eyebrow: "PodpisovÃ½ produkt", title: "Jeden produkt, mnoho Å™eÅ¡enÃ­",
      text: "JednoduÅ¡Å¡Ã­ ÃºÄinnost a kontrolovanÃ¡ Äistota. KoncentrovanÃ¡ receptura pro profesionÃ¡lnÃ­ vÃ½sledky na kaÅ¾dÃ©m povrchu.",
      bullets: ["ÄŒistÃ­ sklo beze Å¡mouh", "HloubkovÄ› odmaÅ¡Å¥uje", "OdstraÅˆuje vodnÃ­ kÃ¡men", "HloubkovÄ› ÄistÃ­", "DodÃ¡vÃ¡ lesk", "ÄŒistÃ­ vÅ¡echny podlahy"],
      tags: ["KoncentrovanÃ¡ receptura", "BezpeÄnÃ© pro interiÃ©ry", "ProfesionÃ¡lnÃ­ vÃ½sledky", "OhleduplnÃ© k prostÅ™edÃ­"], button: "Zobrazit produktovÃ½ list",
      layers: ["ÄŒistÃ­ sklo", "HloubkovÃ© odmaÅ¡tÄ›nÃ­", "OdstraÅˆuje vodnÃ­ kÃ¡men", "HloubkovÃ© ÄiÅ¡tÄ›nÃ­"],
    },
    categories: { eyebrow: "Sortiment", title: "Å est oblastÃ­, jeden standard", sub: "KaÅ¾dÃ¡ kategorie Å™eÅ¡Ã­ konkrÃ©tnÃ­ potÅ™ebu â€” od kuchynÄ› po bazÃ©n." },
    gallery: { eyebrow: "Hygiena v obraze", title: "DokonalÃ¡ Äistota, stanice po stanici" },
    advantages: { eyebrow: "ProÄ Proline Lab", title: "PÄ›t dÅ¯vodÅ¯, proÄ nÃ¡m dÅ¯vÄ›Å™ovat" },
    process: { eyebrow: "NÃ¡Å¡ proces", title: "Od laboratoÅ™e k vaÅ¡emu provozu", sub: "KaÅ¾dÃ½ produkt prochÃ¡zÃ­ kontrolovanÃ½m procesem krok za krokem." },
    cta: { title: "HygienickÃ© Å™eÅ¡enÃ­ navrÅ¾enÃ© pro vÃ¡Å¡ provoz", text: "ZÃ­skejte kompletnÃ­ katalog nebo si do 24 hodin promluvte s technickÃ½m poradcem.", quote: "Poptat nabÃ­dku", catalogue: "StÃ¡hnout katalog" },
    footer: { description: "ProfesionÃ¡lnÃ­ ÄisticÃ­ a hygienickÃ© produkty vyvÃ­jenÃ© v Tunisku pro nejnÃ¡roÄnÄ›jÅ¡Ã­ provozy.", emailPlaceholder: "VÃ¡Å¡ e-mail", products: "Produkty", company: "SpoleÄnost", contact: "Kontakt", certifications: "Certifikace", city: "Tunisko", copyright: "Â© 2026 Proline Lab. VÅ¡echna prÃ¡va vyhrazena.", design: "Design: Abir" },
    kicker: ["Hotely", "Restaurace", "KavÃ¡rny", "Nemocnice", "Kliniky", "Å koly", "NÃ¡kupnÃ­ centra", "ÃšklidovÃ© firmy", "Obce", "LÃ¡znÄ› & Fitness"],
  },

  ru: {
    nav: { products: "ÐŸÑ€Ð¾Ð´ÑƒÐºÑ‚Ñ‹", catalogue: "ÐšÐ°Ñ‚Ð°Ð»Ð¾Ð³", lab: "Ð›Ð°Ð±Ð¾Ñ€Ð°Ñ‚Ð¾Ñ€Ð¸Ñ", about: "Ðž Ð½Ð°Ñ", contact: "ÐšÐ¾Ð½Ñ‚Ð°ÐºÑ‚Ñ‹", quote: "Ð—Ð°Ð¿Ñ€Ð¾ÑÐ¸Ñ‚ÑŒ Ð¿Ñ€ÐµÐ´Ð»Ð¾Ð¶ÐµÐ½Ð¸Ðµ" },
    hero: {
      eyebrow: "ÐŸÑ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð°Ñ Ð³Ð¸Ð³Ð¸ÐµÐ½Ð° Â· By Dr. Gamm", left: "PROLINE", right: "HYGIENE", script: "by Dr. Gamm",
      sub: "Ð¤Ð¾Ñ€Ð¼ÑƒÐ»Ñ‹, Ñ€Ð°Ð·Ñ€Ð°Ð±Ð¾Ñ‚Ð°Ð½Ð½Ñ‹Ðµ Ð² Ð»Ð°Ð±Ð¾Ñ€Ð°Ñ‚Ð¾Ñ€Ð¸Ð¸ Ð´Ð»Ñ Ð¾Ñ‚ÐµÐ»ÐµÐ¹, Ñ€ÐµÑÑ‚Ð¾Ñ€Ð°Ð½Ð¾Ð² Ð¸ Ñ‚Ñ€ÐµÐ±Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ñ… Ð¿Ñ€ÐµÐ´Ð¿Ñ€Ð¸ÑÑ‚Ð¸Ð¹ â€” Ð¸Ð·Ð¼ÐµÑ€Ð¸Ð¼Ð°Ñ ÑÑ„Ñ„ÐµÐºÑ‚Ð¸Ð²Ð½Ð¾ÑÑ‚ÑŒ, ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ð¸Ñ€ÑƒÐµÐ¼Ð°Ñ Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð¾ÑÑ‚ÑŒ Ð¸ ÑÑ‚Ð°Ð±Ð¸Ð»ÑŒÐ½Ñ‹Ð¹ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚.",
      discover: "ÐžÑ‚ÐºÑ€Ñ‹Ñ‚ÑŒ Ð¿Ñ€Ð¾Ð´ÑƒÐºÑ‚Ñ‹", download: "Ð¡ÐºÐ°Ñ‡Ð°Ñ‚ÑŒ ÐºÐ°Ñ‚Ð°Ð»Ð¾Ð³", clean: "Ð§Ð˜Ð¡Ð¢Ðž",
    },
    stats: ["ÐŸÑ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ðµ Ð¿Ñ€Ð¾Ð´ÑƒÐºÑ‚Ñ‹", "Ð”Ð¾Ð²Ð¾Ð»ÑŒÐ½Ñ‹Ðµ ÐºÐ»Ð¸ÐµÐ½Ñ‚Ñ‹", "Ð£Ð´Ð¾Ð²Ð»ÐµÑ‚Ð²Ð¾Ñ€Ñ‘Ð½Ð½Ð¾ÑÑ‚ÑŒ", "Ð‘Ñ‹ÑÑ‚Ñ€Ð°Ñ Ð´Ð¾ÑÑ‚Ð°Ð²ÐºÐ°"],
    about: { eyebrow: "ÐÐ°Ñˆ Ð¿Ñ€Ð¸Ð½Ñ†Ð¸Ð¿", title: "Ð§Ð¸ÑÑ‚Ð¾Ñ‚Ð° â€” Ð½Ð°Ñˆ Ð¿Ñ€Ð¸Ð½Ñ†Ð¸Ð¿", text: "Ð¢ÑƒÐ½Ð¸ÑÑÐºÐ°Ñ ÑÐºÑÐ¿ÐµÑ€Ñ‚Ð¸Ð·Ð° Ð´Ð»Ñ ÑÑ€ÐµÐ´Ñ‹, Ð³Ð´Ðµ Ð³Ð¸Ð³Ð¸ÐµÐ½Ð° Ð½Ðµ Ð´Ð¾Ð¿ÑƒÑÐºÐ°ÐµÑ‚ ÐºÐ¾Ð¼Ð¿Ñ€Ð¾Ð¼Ð¸ÑÑÐ¾Ð². Ð ÐµÑˆÐµÐ½Ð¸Ñ Ð´Ð»Ñ Ð¾Ñ‚ÐµÐ»ÐµÐ¹, Ñ€ÐµÑÑ‚Ð¾Ñ€Ð°Ð½Ð¾Ð² Ð¸ Ð¿Ñ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ñ… Ð¿Ñ€ÐµÐ´Ð¿Ñ€Ð¸ÑÑ‚Ð¸Ð¹." },
    values: [
      ["ÐœÐµÑÑ‚Ð½Ð°Ñ ÑÐºÑÐ¿ÐµÑ€Ñ‚Ð¸Ð·Ð°", "Ð¢ÑƒÐ½Ð¸ÑÑÐºÐ¸Ð¹ Ð¾Ð¿Ñ‹Ñ‚, ÑÑ„Ð¾Ñ€Ð¼Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ð¹ Ð² Ñ€ÐµÐ°Ð»ÑŒÐ½Ñ‹Ñ… Ð¿Ñ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ñ… ÐºÑƒÑ…Ð½ÑÑ…, Ð¿Ñ€Ð°Ñ‡ÐµÑ‡Ð½Ñ‹Ñ… Ð¸ ÑÐ°Ð½Ð¸Ñ‚Ð°Ñ€Ð½Ñ‹Ñ… Ð·Ð¾Ð½Ð°Ñ…."],
      ["Ð”Ð»Ñ Ð³Ð¾ÑÑ‚Ð¸Ð½Ð¸Ñ‡Ð½Ð¾Ð³Ð¾ Ð±Ð¸Ð·Ð½ÐµÑÐ°", "Ð¤Ð¾Ñ€Ð¼ÑƒÐ»Ñ‹, Ñ€Ð°ÑÑÑ‡Ð¸Ñ‚Ð°Ð½Ð½Ñ‹Ðµ Ð½Ð° Ñ‚ÐµÐ¼Ð¿ Ð¸ Ñ‚Ñ€ÐµÐ±Ð¾Ð²Ð°Ð½Ð¸Ñ Ð³Ð¾ÑÑ‚Ð¸Ð½Ð¸Ñ‡Ð½Ñ‹Ñ… Ð¿Ñ€ÐµÐ´Ð¿Ñ€Ð¸ÑÑ‚Ð¸Ð¹."],
      ["Ð¢ÐµÑ…Ð½Ð¸Ñ‡ÐµÑÐºÐ°Ñ Ð¿Ð¾Ð´Ð´ÐµÑ€Ð¶ÐºÐ°", "ÐšÐ¾Ð½ÑÑƒÐ»ÑŒÑ‚Ð°Ñ†Ð¸Ð¸ Ð¿Ð¾ Ð´Ð¾Ð·Ð¸Ñ€Ð¾Ð²ÐºÐµ, Ð¾Ð±ÑƒÑ‡ÐµÐ½Ð¸Ðµ Ð¿ÐµÑ€ÑÐ¾Ð½Ð°Ð»Ð° Ð¸ ÑÐ¾Ð¿Ñ€Ð¾Ð²Ð¾Ð¶Ð´ÐµÐ½Ð¸Ðµ Ð½Ð° Ð¾Ð±ÑŠÐµÐºÑ‚Ðµ."],
      ["ÐšÐ¾Ð½Ñ‚Ñ€Ð¾Ð»ÑŒ ÐºÐ°Ñ‡ÐµÑÑ‚Ð²Ð°", "ÐŸÐ¾ÑÑ‚Ð¾ÑÐ½Ð½Ñ‹Ð¹ ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»ÑŒ Ð¾Ñ‚ Ð»Ð°Ð±Ð¾Ñ€Ð°Ñ‚Ð¾Ñ€Ð¸Ð¸ Ð´Ð¾ Ð¿Ð¾ÑÑ‚Ð°Ð²ÐºÐ¸ Ð´Ð»Ñ ÑÑ‚Ð°Ð±Ð¸Ð»ÑŒÐ½Ð¾Ð³Ð¾ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð°."],
    ],
    spotlight: {
      eyebrow: "Ð¤Ð¸Ñ€Ð¼ÐµÐ½Ð½Ñ‹Ð¹ Ð¿Ñ€Ð¾Ð´ÑƒÐºÑ‚", title: "ÐžÐ´Ð¸Ð½ Ð¿Ñ€Ð¾Ð´ÑƒÐºÑ‚ â€” Ð¼Ð½Ð¾Ð¶ÐµÑÑ‚Ð²Ð¾ Ñ€ÐµÑˆÐµÐ½Ð¸Ð¹",
      text: "ÐŸÑ€Ð¾ÑÑ‚Ð°Ñ ÑÑ„Ñ„ÐµÐºÑ‚Ð¸Ð²Ð½Ð¾ÑÑ‚ÑŒ Ð¸ ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ð¸Ñ€ÑƒÐµÐ¼Ð°Ñ Ñ‡Ð¸ÑÑ‚Ð¾Ñ‚Ð°. ÐšÐ¾Ð½Ñ†ÐµÐ½Ñ‚Ñ€Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ð°Ñ Ñ„Ð¾Ñ€Ð¼ÑƒÐ»Ð° Ð´Ð»Ñ Ð¿Ñ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾Ð³Ð¾ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚Ð° Ð½Ð° Ð»ÑŽÐ±Ð¾Ð¹ Ð¿Ð¾Ð²ÐµÑ€Ñ…Ð½Ð¾ÑÑ‚Ð¸.",
      bullets: ["ÐžÑ‡Ð¸Ñ‰Ð°ÐµÑ‚ ÑÑ‚ÐµÐºÐ»Ð¾ Ð±ÐµÐ· Ñ€Ð°Ð·Ð²Ð¾Ð´Ð¾Ð²", "Ð“Ð»ÑƒÐ±Ð¾ÐºÐ¾ Ð¾Ð±ÐµÐ·Ð¶Ð¸Ñ€Ð¸Ð²Ð°ÐµÑ‚", "Ð£Ð´Ð°Ð»ÑÐµÑ‚ Ð¸Ð·Ð²ÐµÑÑ‚ÐºÐ¾Ð²Ñ‹Ð¹ Ð½Ð°Ð»Ñ‘Ñ‚", "Ð“Ð»ÑƒÐ±Ð¾ÐºÐ¾ Ð¾Ñ‡Ð¸Ñ‰Ð°ÐµÑ‚", "ÐŸÑ€Ð¸Ð´Ð°Ñ‘Ñ‚ Ð±Ð»ÐµÑÐº", "ÐžÑ‡Ð¸Ñ‰Ð°ÐµÑ‚ Ð²ÑÐµ Ñ‚Ð¸Ð¿Ñ‹ Ð¿Ð¾Ð»Ð¾Ð²"],
      tags: ["ÐšÐ¾Ð½Ñ†ÐµÐ½Ñ‚Ñ€Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ð°Ñ Ñ„Ð¾Ñ€Ð¼ÑƒÐ»Ð°", "Ð‘ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð¾ Ð´Ð»Ñ Ð¸Ð½Ñ‚ÐµÑ€ÑŒÐµÑ€Ð°", "ÐŸÑ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ð¹ Ñ€ÐµÐ·ÑƒÐ»ÑŒÑ‚Ð°Ñ‚", "Ð‘ÐµÑ€ÐµÐ¶Ð½Ð¾Ðµ Ð¾Ñ‚Ð½Ð¾ÑˆÐµÐ½Ð¸Ðµ Ðº ÑÑ€ÐµÐ´Ðµ"], button: "ÐžÑ‚ÐºÑ€Ñ‹Ñ‚ÑŒ Ð¾Ð¿Ð¸ÑÐ°Ð½Ð¸Ðµ Ð¿Ñ€Ð¾Ð´ÑƒÐºÑ‚Ð°",
      layers: ["ÐžÑ‡Ð¸Ñ‰Ð°ÐµÑ‚ ÑÑ‚ÐµÐºÐ»Ð¾", "Ð“Ð»ÑƒÐ±Ð¾ÐºÐ¾Ðµ Ð¾Ð±ÐµÐ·Ð¶Ð¸Ñ€Ð¸Ð²Ð°Ð½Ð¸Ðµ", "Ð£Ð´Ð°Ð»ÑÐµÑ‚ Ð¸Ð·Ð²ÐµÑÑ‚ÐºÐ¾Ð²Ñ‹Ð¹ Ð½Ð°Ð»Ñ‘Ñ‚", "Ð“Ð»ÑƒÐ±Ð¾ÐºÐ°Ñ Ð¾Ñ‡Ð¸ÑÑ‚ÐºÐ°"],
    },
    categories: { eyebrow: "ÐÑÑÐ¾Ñ€Ñ‚Ð¸Ð¼ÐµÐ½Ñ‚", title: "Ð¨ÐµÑÑ‚ÑŒ Ð½Ð°Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ð¹, Ð¾Ð´Ð¸Ð½ ÑÑ‚Ð°Ð½Ð´Ð°Ñ€Ñ‚", sub: "ÐšÐ°Ð¶Ð´Ð°Ñ ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ñ Ð¾Ñ‚Ð²ÐµÑ‡Ð°ÐµÑ‚ Ð½Ð° ÐºÐ¾Ð½ÐºÑ€ÐµÑ‚Ð½ÑƒÑŽ Ð·Ð°Ð´Ð°Ñ‡Ñƒ â€” Ð¾Ñ‚ ÐºÑƒÑ…Ð½Ð¸ Ð´Ð¾ Ð±Ð°ÑÑÐµÐ¹Ð½Ð°." },
    gallery: { eyebrow: "Ð“Ð¸Ð³Ð¸ÐµÐ½Ð° Ð² Ð´ÐµÑ‚Ð°Ð»ÑÑ…", title: "Ð˜Ð´ÐµÐ°Ð»ÑŒÐ½Ð°Ñ Ñ‡Ð¸ÑÑ‚Ð¾Ñ‚Ð°, Ð·Ð¾Ð½Ð° Ð·Ð° Ð·Ð¾Ð½Ð¾Ð¹" },
    advantages: { eyebrow: "ÐŸÐ¾Ñ‡ÐµÐ¼Ñƒ Proline Lab", title: "ÐŸÑÑ‚ÑŒ Ð¿Ñ€Ð¸Ñ‡Ð¸Ð½ Ð´Ð¾Ð²ÐµÑ€ÑÑ‚ÑŒ Ð½Ð°Ð¼" },
    process: { eyebrow: "ÐÐ°Ñˆ Ð¿Ñ€Ð¾Ñ†ÐµÑÑ", title: "ÐžÑ‚ Ð»Ð°Ð±Ð¾Ñ€Ð°Ñ‚Ð¾Ñ€Ð¸Ð¸ Ð´Ð¾ Ð²Ð°ÑˆÐµÐ³Ð¾ Ð¿Ñ€ÐµÐ´Ð¿Ñ€Ð¸ÑÑ‚Ð¸Ñ", sub: "ÐšÐ°Ð¶Ð´Ñ‹Ð¹ Ð¿Ñ€Ð¾Ð´ÑƒÐºÑ‚ Ð¿Ñ€Ð¾Ñ…Ð¾Ð´Ð¸Ñ‚ ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»Ð¸Ñ€ÑƒÐµÐ¼Ñ‹Ð¹ Ð¿ÑƒÑ‚ÑŒ ÑˆÐ°Ð³ Ð·Ð° ÑˆÐ°Ð³Ð¾Ð¼." },
    cta: { title: "Ð“Ð¸Ð³Ð¸ÐµÐ½Ð¸Ñ‡ÐµÑÐºÐ¾Ðµ Ñ€ÐµÑˆÐµÐ½Ð¸Ðµ Ð´Ð»Ñ Ð²Ð°ÑˆÐµÐ³Ð¾ Ð¿Ñ€ÐµÐ´Ð¿Ñ€Ð¸ÑÑ‚Ð¸Ñ", text: "ÐŸÐ¾Ð»ÑƒÑ‡Ð¸Ñ‚Ðµ Ð¿Ð¾Ð»Ð½Ñ‹Ð¹ ÐºÐ°Ñ‚Ð°Ð»Ð¾Ð³ Ð¸Ð»Ð¸ ÑÐ²ÑÐ¶Ð¸Ñ‚ÐµÑÑŒ Ñ Ñ‚ÐµÑ…Ð½Ð¸Ñ‡ÐµÑÐºÐ¸Ð¼ ÐºÐ¾Ð½ÑÑƒÐ»ÑŒÑ‚Ð°Ð½Ñ‚Ð¾Ð¼ Ð² Ñ‚ÐµÑ‡ÐµÐ½Ð¸Ðµ 24 Ñ‡Ð°ÑÐ¾Ð².", quote: "Ð—Ð°Ð¿Ñ€Ð¾ÑÐ¸Ñ‚ÑŒ Ð¿Ñ€ÐµÐ´Ð»Ð¾Ð¶ÐµÐ½Ð¸Ðµ", catalogue: "Ð¡ÐºÐ°Ñ‡Ð°Ñ‚ÑŒ ÐºÐ°Ñ‚Ð°Ð»Ð¾Ð³" },
    footer: { description: "ÐŸÑ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ðµ ÑÑ€ÐµÐ´ÑÑ‚Ð²Ð° Ð´Ð»Ñ ÑƒÐ±Ð¾Ñ€ÐºÐ¸ Ð¸ Ð³Ð¸Ð³Ð¸ÐµÐ½Ñ‹, Ñ€Ð°Ð·Ñ€Ð°Ð±Ð¾Ñ‚Ð°Ð½Ð½Ñ‹Ðµ Ð² Ð¢ÑƒÐ½Ð¸ÑÐµ Ð´Ð»Ñ ÑÐ°Ð¼Ñ‹Ñ… Ñ‚Ñ€ÐµÐ±Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ñ… Ð¿Ñ€ÐµÐ´Ð¿Ñ€Ð¸ÑÑ‚Ð¸Ð¹.", emailPlaceholder: "Ð’Ð°Ñˆ e-mail", products: "ÐŸÑ€Ð¾Ð´ÑƒÐºÑ‚Ñ‹", company: "ÐšÐ¾Ð¼Ð¿Ð°Ð½Ð¸Ñ", contact: "ÐšÐ¾Ð½Ñ‚Ð°ÐºÑ‚Ñ‹", certifications: "Ð¡ÐµÑ€Ñ‚Ð¸Ñ„Ð¸ÐºÐ°Ñ‚Ñ‹", city: "Ð¢ÑƒÐ½Ð¸Ñ", copyright: "Â© 2026 Proline Lab. Ð’ÑÐµ Ð¿Ñ€Ð°Ð²Ð° Ð·Ð°Ñ‰Ð¸Ñ‰ÐµÐ½Ñ‹.", design: "Ð”Ð¸Ð·Ð°Ð¹Ð½: Abir" },
    kicker: ["ÐžÑ‚ÐµÐ»Ð¸", "Ð ÐµÑÑ‚Ð¾Ñ€Ð°Ð½Ñ‹", "ÐšÐ°Ñ„Ðµ", "Ð‘Ð¾Ð»ÑŒÐ½Ð¸Ñ†Ñ‹", "ÐšÐ»Ð¸Ð½Ð¸ÐºÐ¸", "Ð¨ÐºÐ¾Ð»Ñ‹", "Ð¢Ð¾Ñ€Ð³Ð¾Ð²Ñ‹Ðµ Ñ†ÐµÐ½Ñ‚Ñ€Ñ‹", "ÐšÐ»Ð¸Ð½Ð¸Ð½Ð³Ð¾Ð²Ñ‹Ðµ ÐºÐ¾Ð¼Ð¿Ð°Ð½Ð¸Ð¸", "ÐœÑƒÐ½Ð¸Ñ†Ð¸Ð¿Ð°Ð»Ð¸Ñ‚ÐµÑ‚Ñ‹", "Ð¡Ð¿Ð° Ð¸ Ñ„Ð¸Ñ‚Ð½ÐµÑ"],
  },
} as const;

const CATEGORY_DATA = [
  { key: "cuisine", n: "01", title: { fr: "Cuisine & Restaurant", en: "Kitchen & Restaurant", de: "KÃ¼che & Restaurant", cs: "KuchynÄ› & Restaurace", ru: "ÐšÑƒÑ…Ð½Ñ Ð¸ Ñ€ÐµÑÑ‚Ð¾Ñ€Ð°Ð½" }, desc: { fr: "DÃ©graissants et nettoyants pour vaisselle, plaques et cuisson intensive.", en: "Degreasers and cleaners for dishes, cooking surfaces and intensive use.", de: "Entfetter und Reiniger fÃ¼r Geschirr, KochflÃ¤chen und intensive Nutzung.", cs: "OdmaÅ¡Å¥ovaÄe a ÄistiÄe pro nÃ¡dobÃ­, varnÃ© plochy a intenzivnÃ­ provoz.", ru: "ÐžÐ±ÐµÐ·Ð¶Ð¸Ñ€Ð¸Ð²Ð°Ñ‚ÐµÐ»Ð¸ Ð¸ ÑÑ€ÐµÐ´ÑÑ‚Ð²Ð° Ð´Ð»Ñ Ð¿Ð¾ÑÑƒÐ´Ñ‹, Ð²Ð°Ñ€Ð¾Ñ‡Ð½Ñ‹Ñ… Ð¿Ð¾Ð²ÐµÑ€Ñ…Ð½Ð¾ÑÑ‚ÐµÐ¹ Ð¸ Ð¸Ð½Ñ‚ÐµÐ½ÑÐ¸Ð²Ð½Ð¾Ð¹ ÑÐºÑÐ¿Ð»ÑƒÐ°Ñ‚Ð°Ñ†Ð¸Ð¸." } },
  { key: "machine", n: "02", title: { fr: "Machines automatiques", en: "Automatic Machines", de: "Automatische Maschinen", cs: "AutomatickÃ© stroje", ru: "ÐÐ²Ñ‚Ð¾Ð¼Ð°Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¸Ðµ Ð¼Ð°ÑˆÐ¸Ð½Ñ‹" }, desc: { fr: "Lave-vaisselle et lave-verre professionnels, brillance garantie.", en: "Professional dishwashers and glasswashers with brilliant results.", de: "Professionelle Geschirr- und GlÃ¤serspÃ¼ler fÃ¼r brilliante Ergebnisse.", cs: "ProfesionÃ¡lnÃ­ myÄky nÃ¡dobÃ­ a skla pro dokonalÃ½ lesk.", ru: "ÐŸÑ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ðµ Ð¿Ð¾ÑÑƒÐ´Ð¾Ð¼Ð¾ÐµÑ‡Ð½Ñ‹Ðµ Ð¸ ÑÑ‚ÐµÐºÐ»Ð¾Ð¼Ð¾ÐµÑ‡Ð½Ñ‹Ðµ Ð¼Ð°ÑˆÐ¸Ð½Ñ‹." } },
  { key: "buanderie", n: "03", title: { fr: "Buanderie", en: "Laundry", de: "WÃ¤scherei", cs: "PrÃ¡delna", ru: "ÐŸÑ€Ð°Ñ‡ÐµÑ‡Ð½Ð°Ñ" }, desc: { fr: "DÃ©tachants, blanchissants et adoucissants pour le linge hÃ´telier.", en: "Stain removers, bleaches and softeners for hospitality laundry.", de: "Fleckentferner, Bleichmittel und WeichspÃ¼ler fÃ¼r HotelwÃ¤sche.", cs: "OdstraÅˆovaÄe skvrn, bÄ›lidla a avivÃ¡Å¾e pro hotelovÃ© prÃ¡dlo.", ru: "ÐŸÑÑ‚Ð½Ð¾Ð²Ñ‹Ð²Ð¾Ð´Ð¸Ñ‚ÐµÐ»Ð¸, Ð¾Ñ‚Ð±ÐµÐ»Ð¸Ð²Ð°Ñ‚ÐµÐ»Ð¸ Ð¸ ÐºÐ¾Ð½Ð´Ð¸Ñ†Ð¸Ð¾Ð½ÐµÑ€Ñ‹ Ð´Ð»Ñ Ð³Ð¾ÑÑ‚Ð¸Ð½Ð¸Ñ‡Ð½Ð¾Ð³Ð¾ Ð±ÐµÐ»ÑŒÑ." } },
  { key: "sanitaire", n: "04", title: { fr: "Service Ã©tage & Sanitaires", en: "Housekeeping & Sanitary", de: "Etage & SanitÃ¤r", cs: "Housekeeping & SanitÃ¡rnÃ­", ru: "Ð¡Ð°Ð½Ð¸Ñ‚Ð°Ñ€Ð½Ñ‹Ðµ Ð·Ð¾Ð½Ñ‹" }, desc: { fr: "DÃ©tartrants et nettoyants pour sols et surfaces communes.", en: "Descalers and cleaners for floors and shared surfaces.", de: "Entkalker und Reiniger fÃ¼r BÃ¶den und GemeinschaftsflÃ¤chen.", cs: "OdstraÅˆovaÄe vodnÃ­ho kamene a ÄistiÄe podlah a spoleÄnÃ½ch prostor.", ru: "Ð¡Ñ€ÐµÐ´ÑÑ‚Ð²Ð° Ð¾Ñ‚ Ð¸Ð·Ð²ÐµÑÑ‚ÐºÐ¾Ð²Ð¾Ð³Ð¾ Ð½Ð°Ð»Ñ‘Ñ‚Ð° Ð¸ Ð¾Ñ‡Ð¸ÑÑ‚Ð¸Ñ‚ÐµÐ»Ð¸ Ð´Ð»Ñ Ð¿Ð¾Ð»Ð¾Ð² Ð¸ Ð¾Ð±Ñ‰Ð¸Ñ… Ð·Ð¾Ð½." } },
  { key: "communs", n: "05", title: { fr: "Locaux communs", en: "Common Areas", de: "Gemeinschaftsbereiche", cs: "SpoleÄnÃ© prostory", ru: "ÐžÐ±Ñ‰Ð¸Ðµ Ð·Ð¾Ð½Ñ‹" }, desc: { fr: "Vitres, moquettes, parfums d'ambiance et surfaces mÃ©talliques.", en: "Glass, carpets, air fresheners and metal surfaces.", de: "Glas, Teppiche, RaumdÃ¼fte und MetalloberflÃ¤chen.", cs: "Sklo, koberce, osvÄ›Å¾ovaÄe a kovovÃ© povrchy.", ru: "Ð¡Ñ‚ÐµÐºÐ»Ð¾, ÐºÐ¾Ð²Ñ€Ñ‹, Ð°Ñ€Ð¾Ð¼Ð°Ñ‚Ð¸Ð·Ð°Ñ‚Ð¾Ñ€Ñ‹ Ð¸ Ð¼ÐµÑ‚Ð°Ð»Ð»Ð¸Ñ‡ÐµÑÐºÐ¸Ðµ Ð¿Ð¾Ð²ÐµÑ€Ñ…Ð½Ð¾ÑÑ‚Ð¸." } },
  { key: "piscine", n: "06", title: { fr: "Piscine", en: "Swimming Pool", de: "Schwimmbad", cs: "BazÃ©n", ru: "Ð‘Ð°ÑÑÐµÐ¹Ð½" }, desc: { fr: "Traitement et entretien des bassins professionnels.", en: "Professional pool treatment and maintenance.", de: "Professionelle Poolpflege und Wasseraufbereitung.", cs: "ProfesionÃ¡lnÃ­ ÃºdrÅ¾ba a Ãºprava bazÃ©nÅ¯.", ru: "ÐŸÑ€Ð¾Ñ„ÐµÑÑÐ¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð°Ñ Ð¾Ð±Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ° Ð¸ Ð¾Ð±ÑÐ»ÑƒÐ¶Ð¸Ð²Ð°Ð½Ð¸Ðµ Ð±Ð°ÑÑÐµÐ¹Ð½Ð¾Ð²." } },
] as const;

const ADVANTAGE_COLORS = [
  "var(--proline-blue-500)",
  "var(--proline-blue-400)",
  "var(--proline-blue-300)",
  "var(--proline-blue-600)",
  "var(--proline-blue-700)",
];

const PROCESS = ["Laboratoire", "Recherche", "Fabrication", "Conditionnement", "Livraison", "Client"];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

function Reveal({
  children,
  delay = 0,
  y = 28,
  className = "",
  as: Tag = motion.div,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: any;
}) {
  const reduced = usePrefersReducedMotion();

  return (
    <Tag
      className={className}
      initial={reduced ? false : { opacity: 0, y, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Tag>
  );
}

function BlurWord({
  text,
  delay = 0,
  className = "",
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();

  return (
    <span className={className} aria-label={text}>
      {Array.from(text).map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          aria-hidden="true"
          style={{ display: "inline-block", willChange: "transform,opacity,filter" }}
          initial={reduced ? false : { opacity: 0, y: "0.6em", filter: "blur(14px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: delay + i * 0.035, ease: [0.16, 1, 0.3, 1] }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

function SplitTitle({
  text,
  as: Tag = "h2",
  className = "",
}: {
  text: string;
  as?: any;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const MotionTag = motion[Tag] || motion.h2;

  return (
    <MotionTag className={`split-title ${className}`}>
      {text.split(" ").map((word, i, words) => (
        <motion.span
          key={`${word}-${i}`}
          className="split-title-word"
          style={{ display: "inline-block", marginRight: i < words.length - 1 ? "0.22em" : 0 }}
          initial={reduced ? false : { opacity: 0, y: "0.4em", filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, delay: i * 0.055, ease: [0.16, 1, 0.3, 1] }}
        >
          {word}
        </motion.span>
      ))}
    </MotionTag>
  );
}

function TiltCard({
  children,
  className = "",
  maxTilt = 7,
  glare = true,
  style = {},
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
  style?: React.CSSProperties;
  [key: string]: any;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const srx = useSpring(rx, { stiffness: 220, damping: 22, mass: 0.45 });
  const sry = useSpring(ry, { stiffness: 220, damping: 22, mass: 0.45 });

  const glare = useTransform([gx, gy], ([x, y]) =>
    `radial-gradient(360px circle at ${x}% ${y}%, rgba(255,255,255,.34), transparent 62%)`
  );

  const move = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * maxTilt * 2);
    rx.set(-(py - 0.5) * maxTilt * 2);
    gx.set(px * 100);
    gy.set(py * 100);
  };

  const leave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`tilt-card proline-3d ${className}`}
      onMouseMove={move}
      onMouseLeave={leave}
      style={{
        rotateX: srx,
        rotateY: sry,
        transformStyle: "preserve-3d",
        transformPerspective: 1100,
        willChange: "transform",
        ...style,
      }}
      {...rest}
    >
      {glare && (
        <motion.div
          className="tilt-glare"
          aria-hidden="true"
          style={{ background: glare }}
        />
      )}
      {children}
    </motion.div>
  );
}

function Magnetic({
  children,
  className = "",
  strength = 0.22,
  radius = 100,
  as: Tag = "div",
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
  as?: any;
  [key: string]: any;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 240, damping: 18, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 240, damping: 18, mass: 0.3 });

  const onMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    if (Math.hypot(dx, dy) < Math.max(r.width, r.height) / 2 + radius) {
      x.set(dx * strength);
      y.set(dy * strength);
    }
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const MotionTag = motion[Tag] || motion.div;

  return (
    <MotionTag
      ref={ref}
      className={`magnetic ${className}`}
      onMouseMove={onMove}
      onMouseLeave={reset}
      whileHover={reduced ? undefined : { scale: 1.035 }}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      style={{ x: sx, y: sy, display: "inline-block" }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

function FloatingParticles({ count = 52 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let visible = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let particles: Array<{
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      o: number;
    }> = [];

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.7 + 0.35,
        vx: (Math.random() - 0.5) * 0.16,
        vy: -(Math.random() * 0.3 + 0.04),
        o: Math.random() * 0.5 + 0.12,
      }));
    };

    const tick = () => {
      if (visible) {
        ctx.clearRect(0, 0, width, height);
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${p.o})`;
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 }
    );

    observer.observe(canvas);
    resize();
    tick();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [count, reduced]);

  if (reduced) return null;
  return <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />;
}

function CursorLight() {
  const reduced = usePrefersReducedMotion();
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const sx = useSpring(x, { stiffness: 120, damping: 28, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 120, damping: 28, mass: 0.5 });

  useEffect(() => {
    if (reduced) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduced, x, y]);

  if (reduced) return null;

  return (
    <motion.div
      className="cursor-light"
      aria-hidden="true"
      style={{ translateX: sx, translateY: sy }}
    />
  );
}

function CategoryMedia({
  category,
}: {
  category: (typeof CATEGORY_DATA)[number];
}) {
  const [failed, setFailed] = useState(false);
  const video = CATEGORY_VIDEOS[category.key as keyof typeof CATEGORY_VIDEOS];
  const image = IMAGES.categories[category.key as keyof typeof IMAGES.categories];

  if (video && !failed) {
    return (
      <video
        className="cat-video"
        src={video}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <SafeImage
      src={image.src}
      fallback={image.fallback}
      alt={category.title.fr}
    />
  );
}

function LanguageSwitcher({
  lang,
  setLang,
}: {
  lang: Lang;
  setLang: (lang: Lang) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="proline-language" style={{ position: "relative", zIndex: 50 }}>
      <button
        type="button"
        className="language-trigger"
        aria-label="Language"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          border: "1px solid rgba(255,255,255,.18)",
          background: "rgba(255,255,255,.08)",
          color: "#fff",
          borderRadius: 999,
          padding: "9px 12px",
          cursor: "pointer",
          backdropFilter: "blur(12px)",
        }}
      >
        <span>{LANGS.find((x) => x.id === lang)?.flag}</span>
        <strong style={{ fontSize: 11 }}>{lang.toUpperCase()}</strong>
        <span aria-hidden="true">âŒ„</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            style={{
              position: "absolute",
              right: 0,
              top: "100%",
              minWidth: 110,
              padding: 7,
              borderRadius: 16,
              background: "rgba(11,39,69,.96)",
              border: "1px solid rgba(255,255,255,.14)",
              boxShadow: "0 18px 45px rgba(7,29,51,.3)",
              backdropFilter: "blur(18px)",
            }}
          >
            {LANGS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setLang(item.id);
                  setOpen(false);
                }}
                style={{
                  width: "100%",
                  border: 0,
                  background: item.id === lang ? "rgba(79,142,209,.2)" : "transparent",
                  color: "#fff",
                  padding: "9px 10px",
                  borderRadius: 10,
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span>{item.flag}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  useSiteAnimations();
  const reduced = usePrefersReducedMotion();

  const [lang, setLang] = useState<Lang>("fr");
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const heroRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const processRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const galleryTrackRef = useRef<HTMLDivElement>(null);
  const advantagesRef = useRef<HTMLDivElement>(null);
  const advantagesTrackRef = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  const t = T[lang];

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 65, damping: 18, mass: 0.6 });
  const smy = useSpring(my, { stiffness: 65, damping: 18, mass: 0.6 });

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
  }, [reduced]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("proline-lang") as Lang | null;
      if (saved && LANGS.some((x) => x.id === saved)) setLang(saved);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("proline-lang", lang);
    } catch {}
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 2);
      my.set((e.clientY / window.innerHeight - 0.5) * 2);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setScrolled(y > 45);
      setProgress(Math.min(100, Math.max(0, (y / max) * 100)));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (reduced || !heroVideoRef.current || !heroRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(heroVideoRef.current, {
        scale: 1.09,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(heroVideoRef.current, {
        yPercent: 8,
        scale: 1.16,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.7,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, [reduced]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const stats = statsRef.current;
      if (stats) {
        stats.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
          const target = Number(el.dataset.count || 0);
          const value = el.querySelector<HTMLElement>(".num-value");
          if (!value) return;

          const proxy = { value: 0 };
          gsap.to(proxy, {
            value: target,
            duration: reduced ? 0 : 1.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: stats,
              start: "top 80%",
              once: true,
            },
            onUpdate: () => {
              value.textContent = Math.round(proxy.value).toString();
            },
          });
        });
      }

      const fill = processRef.current?.querySelector<HTMLElement>("#tl-fill");
      if (fill) {
        gsap.fromTo(
          fill,
          { width: "0%" },
          {
            width: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: processRef.current,
              start: "top 72%",
              end: "bottom 58%",
              scrub: 0.5,
            },
          }
        );
      }

      const canPin = !reduced && window.innerWidth > 768;

      if (canPin && galleryRef.current && galleryTrackRef.current) {
        const track = galleryTrackRef.current;
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: galleryRef.current,
            start: "top top",
            end: () => `+=${Math.max(distance(), window.innerHeight)}`,
            scrub: 0.65,
            pin: true,
            invalidateOnRefresh: true,
          },
        });
      }

      if (canPin && advantagesRef.current && advantagesTrackRef.current) {
        const track = advantagesTrackRef.current;
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: advantagesRef.current,
            start: "top top",
            end: () => `+=${Math.max(distance(), window.innerHeight)}`,
            scrub: 0.65,
            pin: true,
            invalidateOnRefresh: true,
          },
        });
      }

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, [reduced]);

  const categoryCards = useMemo(
    () =>
      CATEGORY_DATA.map((c) => ({
        ...c,
        titleText: c.title[lang],
        descText: c.desc[lang],
      })),
    [lang]
  );

  return (
    <>
      {/* GLOBAL SCROLL HUD */}
      <motion.div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: 2,
          width: `${progress}%`,
          zIndex: 9999,
          background: "linear-gradient(90deg,var(--proline-blue-400),var(--proline-blue-500))",
          boxShadow: "0 0 16px rgba(79,142,209,.65)",
          transformOrigin: "left",
        }}
      />

      <div id="loader" aria-hidden="true">
        <div className="blocks"><i /><i /><i /><i /></div>
        <div className="mark">PROLINE LAB</div>
        <div className="bar"><span /></div>
      </div>

      <div id="spotlight" />
      <CursorLight />

      {/* HEADER */}
      <header id="site-header" className={scrolled ? "glass is-scrolled" : "glass"}>
        <div className="brand logo">
          <div className="blocks"><i /><i /><i /><i /></div>
          <div className="brand-text">proline<span>lab</span></div>
        </div>

        <nav className="links nav-mobile-hide" id="nav-links" aria-label="Main navigation">
          <a href="#categories">{t.nav.products}</a>
          <a href="#catalogue">{t.nav.catalogue}</a>
          <a href="#process">{t.nav.lab}</a>
          <a href="#about">{t.nav.about}</a>
          <a href="#cta-banner">{t.nav.contact}</a>
          <span id="nav-indicator" />
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <LanguageSwitcher lang={lang} setLang={setLang} />
          <Magnetic
            as="a"
            href="mailto:prolinehygiene@gmail.com?subject=Demande%20de%20devis-Proline"
            className="cta-pill gradient-border light-sweep"
          >
            {t.nav.quote}
          </Magnetic>
        </div>
      </header>

      {/* HERO */}
      <section id="hero" ref={heroRef}>
        <div className="photo-frame" data-parallax="0.25">
          <video
            ref={heroVideoRef}
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={IMAGES.hero.fallback}
          >
            <source src={IMAGES.actionVideo} type="video/mp4" />
          </video>
          <div className="tint" />
          <FloatingParticles />
        </div>

        <div className="layer-field" aria-hidden="true">
          <motion.div
            className="layer-block"
            style={{ background: "var(--proline-blue-500)", top: "18%", left: "9%", x: useTransform(smx, (v) => v * 20), y: useTransform(smy, (v) => v * 13) }}
          />
          <motion.div
            className="layer-block"
            style={{ background: "var(--proline-blue-700)", top: "69%", left: "16%", x: useTransform(smx, (v) => v * -14), y: useTransform(smy, (v) => v * 10) }}
          />
          <motion.div
            className="layer-block"
            style={{ background: "var(--proline-blue-300)", top: "22%", left: "80%", x: useTransform(smx, (v) => v * 23), y: useTransform(smy, (v) => v * -15) }}
          />
          <motion.div
            className="layer-block"
            style={{ background: "var(--proline-blue-600)", top: "73%", left: "84%", x: useTransform(smx, (v) => v * -21), y: useTransform(smy, (v) => v * -16) }}
          />
          <motion.div
            className="layer-block"
            style={{ background: "var(--proline-blue-200)", top: "44%", left: "6%", width: 12, height: 12, x: useTransform(smx, (v) => v * 27), y: useTransform(smy, (v) => v * 18) }}
          />
          <motion.div
            className="layer-block"
            style={{ background: "var(--proline-blue-400)", top: "40%", left: "90%", width: 14, height: 14, x: useTransform(smx, (v) => v * -24), y: useTransform(smy, (v) => v * 20) }}
          />
        </div>

        <Reveal className="eyebrow" y={10}>{t.hero.eyebrow}</Reveal>

        <h1 className="hero-headline">
          <BlurWord className="word left" text={t.hero.left} delay={0.1} />
          <BlurWord className="word right" text={t.hero.right} delay={0.4} />
        </h1>

        <Reveal delay={0.6}>
          <div className="hero-script">{t.hero.script}</div>
        </Reveal>

        <div className="hero-divider" />

        <Reveal delay={0.7}>
          <p className="hero-sub">{t.hero.sub}</p>
        </Reveal>

        <Reveal delay={0.85} className="hero-ctas" as={motion.div}>
          <Magnetic as="a" href="#categories" className="btn-solid gradient-border light-sweep">
            {t.hero.discover}
          </Magnetic>
          <Magnetic as="a" href={IMAGES.catalogue} download="Proline-Lab-Catalogue.pdf" className="btn-outline light-sweep">
            {t.hero.download}
          </Magnetic>
        </Reveal>

        <motion.div
          className="badge-clean"
          initial={reduced ? false : { opacity: 0, scale: 0.7, rotate: -12 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 1.2, duration: 1, type: "spring" }}
        >
          <div className="ring"><span className="pct">100%</span></div>
          <div className="lbl">{t.hero.clean}</div>
        </motion.div>

        <motion.button
          type="button"
          className="scroll-cue"
          onClick={() => scrollTo("stats")}
          aria-label="Scroll down"
          animate={reduced ? undefined : { y: [0, 8, 0] }}
          transition={reduced ? undefined : { duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
        >
          â†“
        </motion.button>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee">
          {[...t.kicker, ...t.kicker].map((item, i) => (
            <span key={`${item}-${i}`}>{item}</span>
          ))}
        </div>
      </div>

      {/* STATS */}
      <section id="stats" ref={statsRef}>
        <div className="stats-grid stagger-grid">
          {[
            ["100", "+", t.stats[0]],
            ["1000", "+", t.stats[1]],
            ["98", "%", t.stats[2]],
          ].map(([value, suffix, label]) => (
            <TiltCard className="stat reveal-3d glass stat-card" key={label}>
              <div className="num" data-count={value}>
                <span className="num-value">0</span>
                <span className="num-suffix">{suffix}</span>
              </div>
              <div className="label">{label}</div>
            </TiltCard>
          ))}
          <TiltCard className="stat reveal-3d glass stat-card">
            <div className="num">24/48h</div>
            <div className="label">{t.stats[3]}</div>
          </TiltCard>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="about-wrap">
          <TiltCard className="photo-frame about-photo" maxTilt={4}>
            <div style={{ position: "absolute", inset: 0 }}>
              <SafeImage src={IMAGES.about.src} fallback={IMAGES.about.fallback} alt="Professional hotel hygiene" />
              <div className="tint" />
            </div>
          </TiltCard>

          <Reveal className="about-text">
            <div className="section-eyebrow">{t.about.eyebrow}</div>
            <SplitTitle as="h2" className="section-title" text={t.about.title} />
            <p className="section-sub">{t.about.text}</p>
          </Reveal>
        </div>

        <div className="values-grid stagger-grid">
          {t.values.map(([title, desc], i) => (
            <Reveal key={title} delay={i * 0.08}>
              <TiltCard className="value-card glass" maxTilt={6}>
                <div className="idx">0{i + 1}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
                <motion.div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    right: 18,
                    bottom: 18,
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    border: `1px solid ${ADVANTAGE_COLORS[i]}`,
                    opacity: 0.35,
                  }}
                  animate={reduced ? undefined : { rotate: 360 }}
                  transition={reduced ? undefined : { duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
                />
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SPOTLIGHT */}
      <section id="spotlight-product">
        <div className="spotlight-wrap">
          <TiltCard className="spotlight-visual" maxTilt={6} glare={false}>
            <div className="spotlight-glow" />

            <motion.img
              src={IMAGES.productSpotlight.src}
              alt="Proline professional multi-purpose product"
              className="spotlight-bottle"
              animate={reduced ? undefined : { y: [0, -14, 0], rotateZ: [0, 1.2, 0, -1.2, 0] }}
              transition={reduced ? undefined : { duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              whileHover={reduced ? undefined : { scale: 1.045 }}
            />

            {t.spotlight.layers.map((label, i) => (
              <motion.div
                key={label}
                className="layer-block spotlight-layer"
                style={{
                  background: ADVANTAGE_COLORS[i],
                  top: i === 0 ? "12%" : i === 1 ? "20%" : "auto",
                  bottom: i >= 2 ? (i === 2 ? "22%" : "10%") : "auto",
                  left: i % 2 === 0 ? "5%" : "auto",
                  right: i % 2 ? "6%" : "auto",
                }}
                animate={reduced ? undefined : { y: [0, -8, 0] }}
                transition={reduced ? undefined : { duration: 4 + i, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
              >
                {label}
              </motion.div>
            ))}
          </TiltCard>

          <Reveal className="spotlight-text">
            <div className="section-eyebrow">{t.spotlight.eyebrow}</div>
            <SplitTitle as="h2" className="section-title" text={t.spotlight.title} />
            <p className="section-sub">{t.spotlight.text}</p>

            <ul className="spotlight-list">
              {t.spotlight.bullets.map((item) => <li key={item}>{item}</li>)}
            </ul>

            <div className="spotlight-tags">
              {t.spotlight.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>

            <Magnetic
              as="a"
              href="#catalogue"
              className="btn-solid gradient-border light-sweep"
            >
              {t.spotlight.button}
            </Magnetic>
          </Reveal>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories">
        <Reveal className="section-head">
          <div className="section-eyebrow">{t.categories.eyebrow}</div>
          <SplitTitle as="h2" className="section-title" text={t.categories.title} />
          <p className="section-sub">{t.categories.sub}</p>
        </Reveal>

        <div className="cat-grid-banners">
          {categoryCards.map((c, i) => (
            <Reveal key={c.key} delay={i * 0.055}>
              <TiltCard
                className={`cat-banner ${c.key} ${activeCategory === c.key ? "is-active" : ""}`}
                data-category={c.key}
                data-goto={c.key}
                maxTilt={6}
                onMouseEnter={() => setActiveCategory(c.key)}
                onMouseLeave={() => setActiveCategory(null)}
                onClick={() => {
                  setActiveCategory(c.key);
                  scrollTo("catalogue");
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === "Enter" || e.key === " ") scrollTo("catalogue");
                }}
              >
                <div
                  className="photo-frame"
                  style={{ position: "absolute", inset: 0, borderRadius: 26, overflow: "hidden" }}
                >
                  <CategoryMedia category={c} />
                  <div
                    className="tint"
                    style={{
                      background: `linear-gradient(160deg, color-mix(in srgb, var(--cat) 72%, transparent), rgba(7,29,51,.68))`,
                    }}
                  />
                  <div className="tint-top" />
                </div>

                <motion.div
                  className="arrow-badge gradient-border"
                  animate={activeCategory === c.key && !reduced ? { x: 5, y: -5, rotate: 8 } : { x: 0, y: 0, rotate: 0 }}
                >
                  â†’
                </motion.div>

                <div className="label glass">
                  <div className="kicker">{c.n} â€” {c.titleText.split(" ")[0]}</div>
                  <h3>{c.titleText}</h3>
                  <p>{c.descText}</p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" style={{ padding: 0 }}>
        <div className="gslide-pin" ref={galleryRef} style={{ position: "relative", overflow: "hidden" }}>
          <Reveal className="gslide-head">
            <div className="section-eyebrow">{t.gallery.eyebrow}</div>
            <SplitTitle as="h2" className="section-title" text={t.gallery.title} />
          </Reveal>

          <div
            className="gslide-track"
            ref={galleryTrackRef}
            style={{ display: "flex", gap: 24, willChange: "transform" }}
          >
            {IMAGES.gallery.map((g, i) => (
              <TiltCard className="gslide-col" key={g.src} maxTilt={4} style={{ flex: "0 0 auto", minWidth: 320 }}>
                <motion.img
                  src={g.src}
                  alt={g.alt}
                  loading="lazy"
                  whileHover={reduced ? undefined : { scale: 1.065 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                />
                <div className="gslide-shine" />
                <div className="gslide-caption glass">
                  <span className="idx">0{i + 1}</span>
                  <span>{g.caption}</span>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ADVANTAGES */}
      <section id="advantages" style={{ padding: 0 }}>
        <div className="hslide-pin" ref={advantagesRef} style={{ position: "relative", overflow: "hidden" }}>
          <Reveal className="hslide-head">
            <div className="section-eyebrow">{t.advantages.eyebrow}</div>
            <SplitTitle as="h2" className="section-title" text={t.advantages.title} />
          </Reveal>

          <div
            className="hslide-track"
            ref={advantagesTrackRef}
            style={{ display: "flex", gap: 24, willChange: "transform" }}
          >
            {t.values.concat([["Savoir-faire tunisien", t.about.text] as const]).map(([title, desc], i) => (
              <TiltCard
                className="hslide-col"
                key={`${title}-${i}`}
                maxTilt={6}
                style={{
                  ["--c" as any]: ADVANTAGE_COLORS[i % ADVANTAGE_COLORS.length],
                  flex: "0 0 auto",
                  minWidth: 300,
                }}
              >
                <span className="hslide-num">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    width: 110,
                    height: 110,
                    borderRadius: "50%",
                    right: -40,
                    bottom: -40,
                    background: "radial-gradient(circle, color-mix(in srgb, var(--c) 28%, transparent), transparent 68%)",
                  }}
                />
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* EXISTING CATALOGUE COMPONENT */}
      {/* PROCESS */}
      <section id="process" ref={processRef}>
        <Reveal className="section-head">
          <div className="section-eyebrow">{t.process.eyebrow}</div>
          <SplitTitle as="h2" className="section-title" text={t.process.title} />
          <p className="section-sub">{t.process.sub}</p>
        </Reveal>

        <div className="timeline">
          <div className="line-track" />
          <div className="line-fill" id="tl-fill" style={{ width: 0 }} />

          {PROCESS.map((label, i) => (
            <motion.div
              className={`tl-node ${i === 0 ? "active" : ""}`}
              key={label}
              whileHover={reduced ? undefined : { y: -7 }}
            >
              <div className="dot" />
              <div className="tl-label">{label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div id="cta-banner" className="photo-frame" data-parallax="0.1">
        <SafeImage src={IMAGES.ctaBanner.src} fallback={IMAGES.ctaBanner.fallback} alt="Professional cleaning team" />
        <div className="tint" />

        <Reveal as={motion.h2}>{t.cta.title}</Reveal>
        <Reveal delay={0.1}>
          <p>{t.cta.text}</p>
        </Reveal>

        <Reveal delay={0.2} className="row">
          <Magnetic
            as="a"
            href="mailto:prolinehygiene@gmail.com?subject=Demande%20de%20devis-Proline"
            className="btn-solid gradient-border light-sweep"
          >
            {t.cta.quote}
          </Magnetic>

          <Magnetic
            as="a"
            href={IMAGES.catalogue}
            download="Proline-Lab-Catalogue.pdf"
            className="btn-outline light-sweep"
          >
            {t.cta.catalogue}
          </Magnetic>
        </Reveal>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div>
            <div className="footer-logo brand-logo">
              <div className="blocks"><i /><i /><i /><i /></div>
              <div className="brand-text">proline<span>lab</span></div>
            </div>

            <p>{t.footer.description}</p>

            <form
              className="newsletter"
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.currentTarget.querySelector<HTMLInputElement>("input");
                const email = input?.value.trim();
                if (email) {
                  window.location.href = `mailto:prolinehygiene@gmail.com?subject=Newsletter%20Proline&body=${encodeURIComponent(email)}`;
                }
              }}
            >
              <input type="email" required placeholder={t.footer.emailPlaceholder} aria-label={t.footer.emailPlaceholder} />
              <button type="submit">OK</button>
            </form>
          </div>

          <div>
            <h4>{t.footer.products}</h4>
            <a href="#catalogue" data-goto="cuisine">{categoryCards[0].titleText}</a>
            <a href="#catalogue" data-goto="buanderie">{categoryCards[2].titleText}</a>
            <a href="#catalogue" data-goto="piscine">{categoryCards[5].titleText}</a>
          </div>

          <div>
            <h4>{t.footer.company}</h4>
            <a href="#about">{t.nav.about}</a>
            <a href="#process">{t.footer.certifications}</a>
            <a href="#cta-banner">{t.footer.contact}</a>
          </div>

          <div>
            <h4>{t.footer.contact}</h4>
            <a href="tel:+21653123976">(+216) 53 123 976</a>
            <a href="mailto:prolinehygiene@gmail.com">prolinehygiene@gmail.com</a>
            <a href="#hero">Sousse, {t.footer.city}</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>{t.footer.copyright}</span>
          <span>{t.footer.design}</span>
        </div>
      </footer>
    </>
  );
}
