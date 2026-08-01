# Base de données Proline Lab

Schéma PostgreSQL pour stocker les demandes de devis, les entreprises
clientes, les contacts, la newsletter, et (en option) les commandes.

## Fichiers

- `schema.sql` — création des tables, types, index, triggers.
- `seed.sql` — quelques lignes d'exemple pour tester (optionnel).

## Mise en place

N'importe quel Postgres fonctionne (Supabase, Neon, Vercel Postgres,
Postgres local). Exemple :

```bash
# Variable d'environnement pointant vers ta base
export DATABASE_URL="postgresql://user:password@host:5432/proline_lab"

# Crée les tables
psql "$DATABASE_URL" -f database/schema.sql

# (optionnel) Ajoute des données de démonstration
psql "$DATABASE_URL" -f database/seed.sql
```

Avec **Supabase** : ouvre l'éditeur SQL du projet et colle le contenu de
`schema.sql`, puis celui de `seed.sql` si besoin.

## Tables principales

| Table | Rôle |
|---|---|
| `companies` | Entreprises clientes (hôtels, restaurants, hôpitaux…) |
| `contacts` | Personnes physiques rattachées à une entreprise (email, téléphone, poste) |
| `products` | Miroir optionnel du catalogue (catégorie, conditionnement, dosage) |
| `quote_requests` | Demandes de devis envoyées depuis le site ("Demander un devis") |
| `quote_request_items` | Produits/catégories liés à une demande de devis |
| `newsletter_subscribers` | Inscriptions à la newsletter (footer) |
| `contact_messages` | Messages du formulaire de contact générique |
| `orders` / `order_items` | Commandes, si la vente en ligne est activée plus tard |

Une vue `v_recent_quote_requests` liste les demandes de devis les plus
récentes avec le nom de l'entreprise déjà résolu.

## Brancher les formulaires du site

Les formulaires de `Home.tsx` (bouton "Demander un devis", newsletter du
footer) sont aujourd'hui côté client uniquement. Pour les connecter à
cette base :

1. Crée une route API Next.js, par ex. `app/api/quote-request/route.ts`,
   qui reçoit le POST du formulaire et insère dans `quote_requests`
   (+ `quote_request_items` si des produits sont sélectionnés).
2. Fais de même pour la newsletter → `app/api/newsletter/route.ts` qui
   insère dans `newsletter_subscribers` (avec `on conflict (email) do
   nothing` pour éviter les doublons).
3. Utilise un client Postgres léger côté serveur (`pg`, ou le client
   Supabase/Neon selon l'hébergeur choisi) — jamais depuis le composant
   client directement, pour ne pas exposer les identifiants de la base.

## Notes

- Les emails sont validés par contrainte SQL (`check` avec une regex
  simple) — une validation plus stricte doit rester côté application.
- `pgcrypto` est activé pour générer les UUID (`gen_random_uuid()`) ; sur
  certains hébergeurs managés cette extension est déjà présente par
  défaut.
- Le schéma est additif : il ne touche à rien du reste du projet
  (aucune dépendance avec `lib/products.ts` ou `lib/images.ts`), tu peux
  l'adopter progressivement.
