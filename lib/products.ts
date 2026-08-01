export type CategoryKey =
  | "cuisine"
  | "machine"
  | "buanderie"
  | "sanitaire"
  | "communs"
  | "piscine";

export interface Product {
  cat: CategoryKey;
  code: string;
  name: string;
  ref: string;
  pack: string;
  desc: string;
  dosage: string;
}

export const CAT_COLORS: Record<CategoryKey, string> = {
  cuisine: "#2E9E5B",
  machine: "#1A9E96",
  buanderie: "#6B5B95",
  sanitaire: "#8B2942",
  communs: "#D98E04",
  piscine: "#0092C7",
};

export const CAT_LABELS: Record<CategoryKey, string> = {
  cuisine: "Cuisine",
  machine: "Machines",
  buanderie: "Buanderie",
  sanitaire: "Sanitaires",
  communs: "Locaux communs",
  piscine: "Piscine",
};

export const PRODUCTS: Product[] = [
  { cat: "cuisine", code: "DC", name: "Dégraissant Cuisine", ref: "H507", pack: "5/10/20L", desc: "Nettoyant dégraissant et lustrant pour vaisselle en machine automatique.", dosage: "2–5% usage courant · pur ou 10% sur taches tenaces" },
  { cat: "cuisine", code: "DG", name: "Degresol Pro", ref: "H537", pack: "5/10/20L", desc: "Dégraissant puissant pour cuisines industrielles, ateliers et laboratoires.", dosage: "Dilution 1:5 usage général · pur en dégraissage intensif" },
  { cat: "cuisine", code: "DP", name: "Dégraissant Plaque Pro", ref: "H536", pack: "5/10/20L", desc: "Haute performance sur graisse carbonisée : plaques, grilles, surfaces métalliques.", dosage: "Laisser agir 5–15 min selon l'encrassement, puis rincer" },
  { cat: "cuisine", code: "RP", name: "Rinçage Plaque Pro", ref: "H535", pack: "5/10/20L", desc: "À base d'acide acétique, rinçage et détartrage des grilles/plaques.", dosage: "Dilution 1:10 (usage standard)" },
  { cat: "cuisine", code: "DINOL", name: "Dinol", ref: "H519", pack: "5/10/20L", desc: "Nettoyant manuel pour vaisselle, ustensiles et batteries de cuisine.", dosage: "5–10 ml / litre d'eau tiède" },
  { cat: "cuisine", code: "DP", name: "Dinol Pro", ref: "H518", pack: "5/10/20L", desc: "Version pro du nettoyant manuel vaisselle et surfaces compatibles.", dosage: "5–10 ml / litre d'eau tiède" },

  { cat: "machine", code: "LV", name: "Lave-Verre Pro", ref: "H530", pack: "5/10/20L", desc: "Nettoyage automatique des verres : anticalcaire, brillance parfaite.", dosage: "Produit concentré — selon instructions machine" },
  { cat: "machine", code: "LV", name: "Lave-Vaisselle Brillance & Dégraisse Pro", ref: "H532", pack: "5/10/20L", desc: "Combine dégraissage et brillance pour machines automatiques.", dosage: "1–2 ml/L, eau chaude 55–60°C recommandée" },
  { cat: "machine", code: "LD", name: "Lave-Vaisselle Dégraisse Pro", ref: "H533", pack: "5/10/20L", desc: "Dégraissant professionnel machine automatique, sans traces.", dosage: "1–2 ml/L, eau chaude 55–60°C" },
  { cat: "machine", code: "LB", name: "Lave-Vaisselle Brillance Pro", ref: "H534", pack: "5/10/20L", desc: "Brillance éclatante pour verres, assiettes et ustensiles.", dosage: "1–2 ml/L, eau chaude 55–60°C" },

  { cat: "buanderie", code: "DL", name: "Dégraissant Linge", ref: "H508", pack: "5/10/20L", desc: "Élimine taches organiques tenaces, blanchit les textiles.", dosage: "250–500g/100kg linge (40–60°C) ou trempage 30–60 min" },
  { cat: "buanderie", code: "DL", name: "Dégraissant Linge Action Rapide", ref: "H509", pack: "5/10/20L", desc: "Haute performance pour taches organiques (graisse, huile).", dosage: "Direct sur tache ou 30–50 ml/charge machine" },
  { cat: "buanderie", code: "AT", name: "Anti-Tâche", ref: "H511", pack: "5/10/20L", desc: "Élimine taches de maquillage, rouge à lèvres, aliments.", dosage: "Application directe 5–10 min ou 30–50 ml en machine" },
  { cat: "buanderie", code: "AR", name: "Anti-Rouille Linge", ref: "H507", pack: "5/10/20L", desc: "Élimine rouille, moisissures et odeurs persistantes.", dosage: "Formule légèrement acide — gants recommandés" },
  { cat: "buanderie", code: "AR", name: "Anti-Rouille Linge Action Rapide", ref: "H510", pack: "5/10/20L", desc: "Version rapide, test préalable recommandé sur surfaces délicates.", dosage: "50–100 ml dans 5L d'eau tiède" },
  { cat: "buanderie", code: "PG", name: "Pro-Gel Linge", ref: "H505", pack: "5/10/20L", desc: "Nettoyant concentré pour linge, propriétés blanchissantes.", dosage: "50–100 ml/charge, 15–30 min d'action" },
  { cat: "buanderie", code: "GB", name: "Gel Blancheur", ref: "H503", pack: "5/10/20L", desc: "Élimine taches organiques et blanchit les textiles.", dosage: "250–500g/100kg (40–60°C) ou à la main" },
  { cat: "buanderie", code: "GC", name: "Gel Couleur", ref: "H507", pack: "5/10/20L", desc: "Détergent pour textiles colorés, préserve et ravive les couleurs.", dosage: "50–100 ml/charge" },
  { cat: "buanderie", code: "PL", name: "Parfum Linge", ref: "H501", pack: "5/10/20L", desc: "Parfum textile pour vêtements, draps et serviettes.", dosage: "Vaporiser à ~30cm sur textiles propres" },
  { cat: "buanderie", code: "ST", name: "Souple Touche", ref: "H512", pack: "5/10/20L", desc: "Adoucissant à base cationique, assouplit les fibres.", dosage: "250–500g/100kg linge sec, compartiment adoucissant" },
  { cat: "buanderie", code: "AM", name: "Anti-Mousse Lessive", ref: "H513", pack: "5/10/20L", desc: "Contrôle la formation de mousse en machines industrielles.", dosage: "0,5–2 ml/kg de linge sec" },
  { cat: "buanderie", code: "TA", name: "Tartro-Auto Machine", ref: "H532", pack: "5/10/20L", desc: "Détartrant pour machines à laver vaisselle et linge.", dosage: "Utilisation régulière tous les 2–4 mois" },

  { cat: "sanitaire", code: "3S", name: "Sol Surface Sanitaire", ref: "H104", pack: "5/10/20L", desc: "Nettoyant concentré sols, surfaces et sanitaires.", dosage: "50–100 ml dans 5L d'eau tiède" },
  { cat: "sanitaire", code: "DT", name: "Detartrino", ref: "H522", pack: "5/10/20L", desc: "Détartrant puissant pour surfaces sanitaires professionnelles.", dosage: "Non dilué, 10–15 min en usage intensif" },

  { cat: "communs", code: "PT", name: "Protiss", ref: "H503", pack: "5/10/20L", desc: "Nettoyage moquettes, cuirs, bois simili-cuir et tissus.", dosage: "Dilution 1:2 quotidien · pur sur taches" },
  { cat: "communs", code: "MS", name: "Mark Stickers", ref: "H502", pack: "5/10/20L", desc: "Élimine résidus d'adhésif, scotch et traces d'encrage.", dosage: "Application directe, laisser agir puis frotter" },
  { cat: "communs", code: "PS", name: "Pure Shine Pro", ref: "H520", pack: "5/10/20L", desc: "Nettoyant haute performance calcaire, oxydation sur inox.", dosage: "Dilution 5–20% · éviter surfaces sensibles aux acides" },
  { cat: "communs", code: "PF", name: "Parfum Pro", ref: "H521", pack: "5/10/20L", desc: "Parfum d'ambiance pour environnements professionnels.", dosage: "Vaporiser à ~30cm, espaces ventilés" },
  { cat: "communs", code: "PM", name: "Parfum Moquette", ref: "H524", pack: "5/10/20L", desc: "Parfum pour moquettes et tapis, élimine les odeurs.", dosage: "Vaporiser à 30–40cm de distance" },
  { cat: "communs", code: "LP", name: "Lave-Vitre Pro", ref: "H531", pack: "5/10/20L", desc: "Nettoyant vitres, miroirs et surfaces en verre.", dosage: "Appliquer et essuyer avec un chiffon sec" },

  { cat: "piscine", code: "CP", name: "Clear Pool-Pro", ref: "H109", pack: "5/10/20L", desc: "Nettoyant et entretien piscines : calcaire, dépôts organiques.", dosage: "200–300 ml dans 5L d'eau pour parois/équipements" },
  { cat: "piscine", code: "AG", name: "Anti-Algues", ref: "H110", pack: "5/10/20L", desc: "Prévention du développement des algues, efficacité 2 semaines.", dosage: "Choc: 100ml/m³ · entretien: 50ml/m³ / 2 sem." },
];
