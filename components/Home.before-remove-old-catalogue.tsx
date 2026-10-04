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

import Catalogue from "./Catalogue";
import SafeImage from "./SafeImage";
import { IMAGES } from "@/lib/images";
import { useSiteAnimations } from "@/lib/useSiteAnimations";
import AlgorithmicArt from "./effects/AlgorithmicArt";
import ProductInterface from "./products/ProductInterface";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ============================================================
   PROLINE LAB — ULTRAGOD HOME
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
  { id: "fr", label: "FR", flag: "🇫🇷" },
  { id: "en", label: "EN", flag: "🇬🇧" },
  { id: "de", label: "DE", flag: "🇩🇪" },
  { id: "cs", label: "CS", flag: "🇨🇿" },
  { id: "ru", label: "RU", flag: "🇷🇺" },
];

const T = {
  fr: {
    nav: {
      products: "Produits",
      catalogue: "Catalogue",
      lab: "Laboratoire",
      about: "À propos",
      contact: "Contact",
      quote: "Demander un devis",
    },
    hero: {
      eyebrow: "Hygiène professionnelle · By Dr. Gamm",
      left: "PROLINE",
      right: "HYGIENE",
      script: "by Dr. Gamm",
      sub: "Des formules conçues en laboratoire pour les hôtels, restaurants et établissements exigeants — efficacité mesurée, sécurité contrôlée, résultats constants.",
      discover: "Découvrir les produits",
      download: "Télécharger le catalogue",
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
      title: "La propreté est notre engagement",
      text: "Un savoir-faire tunisien, pensé pour les environnements où l'hygiène ne tolère aucun compromis. Des solutions adaptées aux hôtels, restaurants et établissements professionnels.",
    },
    values: [
      ["Expertise locale", "Un savoir-faire tunisien affûté au contact réel des cuisines, buanderies et sanitaires professionnels."],
      ["Adapté à l'hôtellerie", "Des formules pensées pour les cadences et les contraintes des établissements hôteliers."],
      ["Accompagnement technique", "Conseils de dosage, formation des équipes et suivi personnalisé sur chaque site."],
      ["Exigence qualité", "Un contrôle constant, du laboratoire jusqu'à la livraison, pour une performance sans surprise."],
    ],
    spotlight: {
      eyebrow: "Le produit signature",
      title: "Un seul produit, une multitude de solutions",
      text: "L'efficacité simplifiée, la propreté maîtrisée. Une formule concentrée, pensée pour des résultats professionnels sur chaque surface.",
      bullets: [
        "Nettoie les vitres sans traces",
        "Dégraisse en profondeur",
        "Détartre toutes les surfaces",
        "Assainit en profondeur",
        "Fait briller sans traces",
        "Nettoie tous les sols",
      ],
      tags: ["Formule concentrée", "Sûr pour votre intérieur", "Résultats professionnels", "Respecte l'environnement"],
      button: "Voir la fiche produit",
      layers: ["Nettoie les vitres", "Dégraisse en profondeur", "Détartre les surfaces", "Assainit en profondeur"],
    },
    categories: {
      eyebrow: "Gamme",
      title: "Six univers, une exigence",
      sub: "Chaque catégorie répond à un usage précis, du fourneau à la piscine.",
    },
    gallery: {
      eyebrow: "L'hygiène en image",
      title: "Un quotidien impeccable, poste par poste",
    },
    advantages: {
      eyebrow: "Pourquoi Proline Lab",
      title: "Cinq raisons de nous faire confiance",
    },
    process: {
      eyebrow: "Notre process",
      title: "Du laboratoire à votre établissement",
      sub: "Chaque produit suit un parcours contrôlé, étape par étape.",
    },
    cta: {
      title: "Une solution d'hygiène pensée pour votre établissement",
      text: "Recevez le catalogue complet ou parlez à un conseiller technique sous 24h.",
      quote: "Demander un devis",
      catalogue: "Télécharger le catalogue",
    },
    footer: {
      description: "Produits professionnels de nettoyage et d'hygiène, conçus en Tunisie pour les établissements les plus exigeants.",
      emailPlaceholder: "Votre email",
      products: "Produits",
      company: "Entreprise",
      contact: "Contact",
      certifications: "Certifications",
      city: "Tunisie",
      copyright: "© 2026 Proline Lab. Tous droits réservés.",
      design: "Design par Abir",
    },
    kicker: ["Hôtels", "Restaurants", "Cafés", "Hôpitaux", "Cliniques", "Écoles", "Centres commerciaux", "Entreprises de nettoyage", "Municipalités", "Spas & Fitness"],
  },

  en: {
    nav: { products: "Products", catalogue: "Catalogue", lab: "Laboratory", about: "About", contact: "Contact", quote: "Request a quote" },
    hero: {
      eyebrow: "Professional hygiene · By Dr. Gamm",
      left: "PROLINE", right: "HYGIENE", script: "by Dr. Gamm",
      sub: "Laboratory-designed formulas for hotels, restaurants and demanding facilities — measured efficiency, controlled safety, consistent results.",
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
      copyright: "© 2026 Proline Lab. All rights reserved.", design: "Design by Abir",
    },
    kicker: ["Hotels", "Restaurants", "Cafés", "Hospitals", "Clinics", "Schools", "Shopping centers", "Cleaning companies", "Municipalities", "Spas & Fitness"],
  },

  de: {
    nav: { products: "Produkte", catalogue: "Katalog", lab: "Labor", about: "Über uns", contact: "Kontakt", quote: "Angebot anfragen" },
    hero: {
      eyebrow: "Professionelle Hygiene · By Dr. Gamm", left: "PROLINE", right: "HYGIENE", script: "by Dr. Gamm",
      sub: "Im Labor entwickelte Formeln für Hotels, Restaurants und anspruchsvolle Einrichtungen — messbare Effizienz, kontrollierte Sicherheit, konstante Ergebnisse.",
      discover: "Produkte entdecken", download: "Katalog herunterladen", clean: "SAUBER",
    },
    stats: ["Professionelle Produkte", "Zufriedene Kunden", "Kundenzufriedenheit", "Schnelle Lieferung"],
    about: { eyebrow: "Unser Anspruch", title: "Sauberkeit ist unser Anspruch", text: "Tunesisches Know-how für Umgebungen, in denen Hygiene keine Kompromisse erlaubt. Lösungen für Hotels, Restaurants und professionelle Einrichtungen." },
    values: [
      ["Lokale Kompetenz", "Tunesisches Know-how aus der Praxis professioneller Küchen, Wäschereien und Sanitärbereiche."],
      ["Hotellerie-tauglich", "Formeln für die Abläufe und Anforderungen professioneller Hotelbetriebe."],
      ["Technische Begleitung", "Dosierberatung, Teamschulung und persönliche Betreuung vor Ort."],
      ["Qualitätsanspruch", "Kontinuierliche Kontrolle vom Labor bis zur Lieferung für zuverlässige Leistung."],
    ],
    spotlight: {
      eyebrow: "Signature-Produkt", title: "Ein Produkt, unzählige Lösungen",
      text: "Vereinfachte Effizienz und kontrollierte Sauberkeit. Eine konzentrierte Formel für professionelle Ergebnisse auf jeder Oberfläche.",
      bullets: ["Glas streifenfrei reinigen", "Tiefenentfettung", "Kalk entfernen", "Tiefenreinigung", "Brillanter Glanz", "Alle Böden reinigen"],
      tags: ["Konzentrierte Formel", "Sicher für Innenräume", "Professionelle Ergebnisse", "Umweltbewusst"], button: "Produktblatt ansehen",
      layers: ["Glas reinigen", "Tiefenentfettung", "Kalk entfernen", "Tiefenreinigung"],
    },
    categories: { eyebrow: "Sortiment", title: "Sechs Bereiche, ein Anspruch", sub: "Jede Kategorie erfüllt einen konkreten Bedarf — von Küche bis Pool." },
    gallery: { eyebrow: "Hygiene im Bild", title: "Perfekte Sauberkeit, Arbeitsplatz für Arbeitsplatz" },
    advantages: { eyebrow: "Warum Proline Lab", title: "Fünf Gründe für unser Vertrauen" },
    process: { eyebrow: "Unser Prozess", title: "Vom Labor zu Ihrer Einrichtung", sub: "Jedes Produkt durchläuft einen kontrollierten Prozess, Schritt für Schritt." },
    cta: { title: "Eine Hygienelösung für Ihre Einrichtung", text: "Erhalten Sie den vollständigen Katalog oder sprechen Sie innerhalb von 24 Stunden mit einem technischen Berater.", quote: "Angebot anfragen", catalogue: "Katalog herunterladen" },
    footer: { description: "Professionelle Reinigungs- und Hygieneprodukte aus Tunesien für anspruchsvollste Einrichtungen.", emailPlaceholder: "Ihre E-Mail", products: "Produkte", company: "Unternehmen", contact: "Kontakt", certifications: "Zertifizierungen", city: "Tunesien", copyright: "© 2026 Proline Lab. Alle Rechte vorbehalten.", design: "Design von Abir" },
    kicker: ["Hotels", "Restaurants", "Cafés", "Krankenhäuser", "Kliniken", "Schulen", "Einkaufszentren", "Reinigungsunternehmen", "Gemeinden", "Spas & Fitness"],
  },

  cs: {
    nav: { products: "Produkty", catalogue: "Katalog", lab: "Laboratoř", about: "O nás", contact: "Kontakt", quote: "Poptat nabídku" },
    hero: {
      eyebrow: "Profesionální hygiena · By Dr. Gamm", left: "PROLINE", right: "HYGIENE", script: "by Dr. Gamm",
      sub: "Laboratorně vyvinuté receptury pro hotely, restaurace a náročná zařízení — měřitelná účinnost, kontrolovaná bezpečnost a stabilní výsledky.",
      discover: "Objevit produkty", download: "Stáhnout katalog", clean: "ČISTOTA",
    },
    stats: ["Profesionální produkty", "Spokojení klienti", "Spokojenost zákazníků", "Rychlé dodání"],
    about: { eyebrow: "Náš závazek", title: "Čistota je náš závazek", text: "Tuniské know-how pro prostředí, kde hygiena nepřipouští kompromisy. Řešení pro hotely, restaurace a profesionální provozy." },
    values: [
      ["Lokální odbornost", "Tuniské know-how založené na skutečných zkušenostech z profesionálních kuchyní, prádelen a sanitárních prostor."],
      ["Pro hotely", "Receptury navržené pro tempo a specifické požadavky hotelového provozu."],
      ["Technická podpora", "Poradenství v dávkování, školení týmů a individuální podpora na místě."],
      ["Důraz na kvalitu", "Kontrola od laboratoře až po dodání pro spolehlivý výkon."],
    ],
    spotlight: {
      eyebrow: "Podpisový produkt", title: "Jeden produkt, mnoho řešení",
      text: "Jednodušší účinnost a kontrolovaná čistota. Koncentrovaná receptura pro profesionální výsledky na každém povrchu.",
      bullets: ["Čistí sklo beze šmouh", "Hloubkově odmašťuje", "Odstraňuje vodní kámen", "Hloubkově čistí", "Dodává lesk", "Čistí všechny podlahy"],
      tags: ["Koncentrovaná receptura", "Bezpečné pro interiéry", "Profesionální výsledky", "Ohleduplné k prostředí"], button: "Zobrazit produktový list",
      layers: ["Čistí sklo", "Hloubkové odmaštění", "Odstraňuje vodní kámen", "Hloubkové čištění"],
    },
    categories: { eyebrow: "Sortiment", title: "Šest oblastí, jeden standard", sub: "Každá kategorie řeší konkrétní potřebu — od kuchyně po bazén." },
    gallery: { eyebrow: "Hygiena v obraze", title: "Dokonalá čistota, stanice po stanici" },
    advantages: { eyebrow: "Proč Proline Lab", title: "Pět důvodů, proč nám důvěřovat" },
    process: { eyebrow: "Náš proces", title: "Od laboratoře k vašemu provozu", sub: "Každý produkt prochází kontrolovaným procesem krok za krokem." },
    cta: { title: "Hygienické řešení navržené pro váš provoz", text: "Získejte kompletní katalog nebo si do 24 hodin promluvte s technickým poradcem.", quote: "Poptat nabídku", catalogue: "Stáhnout katalog" },
    footer: { description: "Profesionální čisticí a hygienické produkty vyvíjené v Tunisku pro nejnáročnější provozy.", emailPlaceholder: "Váš e-mail", products: "Produkty", company: "Společnost", contact: "Kontakt", certifications: "Certifikace", city: "Tunisko", copyright: "© 2026 Proline Lab. Všechna práva vyhrazena.", design: "Design: Abir" },
    kicker: ["Hotely", "Restaurace", "Kavárny", "Nemocnice", "Kliniky", "Školy", "Nákupní centra", "Úklidové firmy", "Obce", "Lázně & Fitness"],
  },

  ru: {
    nav: { products: "Продукты", catalogue: "Каталог", lab: "Лаборатория", about: "О нас", contact: "Контакты", quote: "Запросить предложение" },
    hero: {
      eyebrow: "Профессиональная гигиена · By Dr. Gamm", left: "PROLINE", right: "HYGIENE", script: "by Dr. Gamm",
      sub: "Формулы, разработанные в лаборатории для отелей, ресторанов и требовательных предприятий — измеримая эффективность, контролируемая безопасность и стабильный результат.",
      discover: "Открыть продукты", download: "Скачать каталог", clean: "ЧИСТО",
    },
    stats: ["Профессиональные продукты", "Довольные клиенты", "Удовлетворённость", "Быстрая доставка"],
    about: { eyebrow: "Наш принцип", title: "Чистота — наш принцип", text: "Тунисская экспертиза для среды, где гигиена не допускает компромиссов. Решения для отелей, ресторанов и профессиональных предприятий." },
    values: [
      ["Местная экспертиза", "Тунисский опыт, сформированный в реальных профессиональных кухнях, прачечных и санитарных зонах."],
      ["Для гостиничного бизнеса", "Формулы, рассчитанные на темп и требования гостиничных предприятий."],
      ["Техническая поддержка", "Консультации по дозировке, обучение персонала и сопровождение на объекте."],
      ["Контроль качества", "Постоянный контроль от лаборатории до поставки для стабильного результата."],
    ],
    spotlight: {
      eyebrow: "Фирменный продукт", title: "Один продукт — множество решений",
      text: "Простая эффективность и контролируемая чистота. Концентрированная формула для профессионального результата на любой поверхности.",
      bullets: ["Очищает стекло без разводов", "Глубоко обезжиривает", "Удаляет известковый налёт", "Глубоко очищает", "Придаёт блеск", "Очищает все типы полов"],
      tags: ["Концентрированная формула", "Безопасно для интерьера", "Профессиональный результат", "Бережное отношение к среде"], button: "Открыть описание продукта",
      layers: ["Очищает стекло", "Глубокое обезжиривание", "Удаляет известковый налёт", "Глубокая очистка"],
    },
    categories: { eyebrow: "Ассортимент", title: "Шесть направлений, один стандарт", sub: "Каждая категория отвечает на конкретную задачу — от кухни до бассейна." },
    gallery: { eyebrow: "Гигиена в деталях", title: "Идеальная чистота, зона за зоной" },
    advantages: { eyebrow: "Почему Proline Lab", title: "Пять причин доверять нам" },
    process: { eyebrow: "Наш процесс", title: "От лаборатории до вашего предприятия", sub: "Каждый продукт проходит контролируемый путь шаг за шагом." },
    cta: { title: "Гигиеническое решение для вашего предприятия", text: "Получите полный каталог или свяжитесь с техническим консультантом в течение 24 часов.", quote: "Запросить предложение", catalogue: "Скачать каталог" },
    footer: { description: "Профессиональные средства для уборки и гигиены, разработанные в Тунисе для самых требовательных предприятий.", emailPlaceholder: "Ваш e-mail", products: "Продукты", company: "Компания", contact: "Контакты", certifications: "Сертификаты", city: "Тунис", copyright: "© 2026 Proline Lab. Все права защищены.", design: "Дизайн: Abir" },
    kicker: ["Отели", "Рестораны", "Кафе", "Больницы", "Клиники", "Школы", "Торговые центры", "Клининговые компании", "Муниципалитеты", "Спа и фитнес"],
  },
} as const;

const CATEGORY_DATA = [
  { key: "cuisine", n: "01", title: { fr: "Cuisine & Restaurant", en: "Kitchen & Restaurant", de: "Küche & Restaurant", cs: "Kuchyně & Restaurace", ru: "Кухня и ресторан" }, desc: { fr: "Dégraissants et nettoyants pour vaisselle, plaques et cuisson intensive.", en: "Degreasers and cleaners for dishes, cooking surfaces and intensive use.", de: "Entfetter und Reiniger für Geschirr, Kochflächen und intensive Nutzung.", cs: "Odmašťovače a čističe pro nádobí, varné plochy a intenzivní provoz.", ru: "Обезжириватели и средства для посуды, варочных поверхностей и интенсивной эксплуатации." } },
  { key: "machine", n: "02", title: { fr: "Machines automatiques", en: "Automatic Machines", de: "Automatische Maschinen", cs: "Automatické stroje", ru: "Автоматические машины" }, desc: { fr: "Lave-vaisselle et lave-verre professionnels, brillance garantie.", en: "Professional dishwashers and glasswashers with brilliant results.", de: "Professionelle Geschirr- und Gläserspüler für brilliante Ergebnisse.", cs: "Profesionální myčky nádobí a skla pro dokonalý lesk.", ru: "Профессиональные посудомоечные и стекломоечные машины." } },
  { key: "buanderie", n: "03", title: { fr: "Buanderie", en: "Laundry", de: "Wäscherei", cs: "Prádelna", ru: "Прачечная" }, desc: { fr: "Détachants, blanchissants et adoucissants pour le linge hôtelier.", en: "Stain removers, bleaches and softeners for hospitality laundry.", de: "Fleckentferner, Bleichmittel und Weichspüler für Hotelwäsche.", cs: "Odstraňovače skvrn, bělidla a aviváže pro hotelové prádlo.", ru: "Пятновыводители, отбеливатели и кондиционеры для гостиничного белья." } },
  { key: "sanitaire", n: "04", title: { fr: "Service étage & Sanitaires", en: "Housekeeping & Sanitary", de: "Etage & Sanitär", cs: "Housekeeping & Sanitární", ru: "Санитарные зоны" }, desc: { fr: "Détartrants et nettoyants pour sols et surfaces communes.", en: "Descalers and cleaners for floors and shared surfaces.", de: "Entkalker und Reiniger für Böden und Gemeinschaftsflächen.", cs: "Odstraňovače vodního kamene a čističe podlah a společných prostor.", ru: "Средства от известкового налёта и очистители для полов и общих зон." } },
  { key: "communs", n: "05", title: { fr: "Locaux communs", en: "Common Areas", de: "Gemeinschaftsbereiche", cs: "Společné prostory", ru: "Общие зоны" }, desc: { fr: "Vitres, moquettes, parfums d'ambiance et surfaces métalliques.", en: "Glass, carpets, air fresheners and metal surfaces.", de: "Glas, Teppiche, Raumdüfte und Metalloberflächen.", cs: "Sklo, koberce, osvěžovače a kovové povrchy.", ru: "Стекло, ковры, ароматизаторы и металлические поверхности." } },
  { key: "piscine", n: "06", title: { fr: "Piscine", en: "Swimming Pool", de: "Schwimmbad", cs: "Bazén", ru: "Бассейн" }, desc: { fr: "Traitement et entretien des bassins professionnels.", en: "Professional pool treatment and maintenance.", de: "Professionelle Poolpflege und Wasseraufbereitung.", cs: "Profesionální údržba a úprava bazénů.", ru: "Профессиональная обработка и обслуживание бассейнов." } },
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

  const glareGradient = useTransform([gx, gy], ([x, y]) =>
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
          style={{ background: glareGradient }}
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
  const video = undefined;
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
        <span aria-hidden="true">⌄</span>
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
          ↓
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
      
      {/* ALGORITHMIC ART */}
      <AlgorithmicArt />

      {/* PROLINE PRODUCTS INTERFACE */}
      <ProductInterface />
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
                  →
                </motion.div>

                <div className="label glass">
                  <div className="kicker">{c.n} — {c.titleText.split(" ")[0]}</div>
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
      <Catalogue />

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



