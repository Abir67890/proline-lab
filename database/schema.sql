-- =====================================================================
-- Proline Lab — schéma de base de données (PostgreSQL)
-- Stocke : entreprises clientes, contacts, demandes de devis,
-- inscriptions newsletter, messages de contact, et (option) commandes.
--
-- Compatible Supabase / Neon / Vercel Postgres / PostgreSQL classique.
-- Exécution : psql "$DATABASE_URL" -f database/schema.sql
-- =====================================================================

create extension if not exists "pgcrypto"; -- pour gen_random_uuid()

-- ---------------------------------------------------------------------
-- Types énumérés
-- ---------------------------------------------------------------------
do $$ begin
  create type category_key as enum ('cuisine', 'machine', 'buanderie', 'sanitaire', 'communs', 'piscine');
exception when duplicate_object then null; end $$;

do $$ begin
  create type request_status as enum ('nouveau', 'en_cours', 'traite', 'annule');
exception when duplicate_object then null; end $$;

do $$ begin
  create type request_source as enum ('hero_cta', 'spotlight_product', 'cta_banner', 'footer', 'catalogue', 'autre');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status as enum ('en_attente', 'confirmee', 'expediee', 'livree', 'annulee');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------
-- Fonction utilitaire : maj automatique de updated_at
-- ---------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------
-- 1. companies — entreprises clientes (hôtels, restaurants, hôpitaux…)
-- ---------------------------------------------------------------------
create table if not exists companies (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  sector       text,                 -- ex: "Hôtel", "Restaurant", "Clinique"
  address      text,
  city         text,
  country      text default 'Tunisie',
  vat_number   text,                 -- matricule fiscal si besoin de facturation
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create trigger trg_companies_updated_at
  before update on companies
  for each row execute function set_updated_at();

create index if not exists idx_companies_name on companies (lower(name));

-- ---------------------------------------------------------------------
-- 2. contacts — personnes physiques rattachées à une entreprise
-- ---------------------------------------------------------------------
create table if not exists contacts (
  id           uuid primary key default gen_random_uuid(),
  company_id   uuid references companies(id) on delete set null,
  full_name    text not null,
  email        text not null,
  phone        text,
  job_title    text,                 -- ex: "Gouvernante générale", "Chef de cuisine"
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint contacts_email_format check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);
create trigger trg_contacts_updated_at
  before update on contacts
  for each row execute function set_updated_at();

create unique index if not exists idx_contacts_email on contacts (lower(email));
create index if not exists idx_contacts_company on contacts (company_id);
create index if not exists idx_contacts_phone on contacts (phone);

-- ---------------------------------------------------------------------
-- 3. products — miroir optionnel de lib/products.ts, pratique pour
--    relier les lignes de devis/commande à une référence produit.
-- ---------------------------------------------------------------------
create table if not exists products (
  id           uuid primary key default gen_random_uuid(),
  code         text not null unique,   -- ex: "PL-CUI-001"
  name         text not null,
  category     category_key not null,
  packaging    text,                   -- ex: "Bidon 5L"
  dosage       text,                   -- ex: "20ml / 10L d'eau"
  active       boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create trigger trg_products_updated_at
  before update on products
  for each row execute function set_updated_at();

create index if not exists idx_products_category on products (category);

-- ---------------------------------------------------------------------
-- 4. quote_requests — demandes de devis ("Demander un devis")
-- ---------------------------------------------------------------------
create table if not exists quote_requests (
  id            uuid primary key default gen_random_uuid(),
  contact_id    uuid references contacts(id) on delete set null,
  company_id    uuid references companies(id) on delete set null,
  -- champs bruts conservés même si le contact/l'entreprise n'existent pas encore
  full_name     text not null,
  email         text not null,
  phone         text,
  company_name  text,
  message       text,
  source        request_source not null default 'autre',
  status        request_status not null default 'nouveau',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint quote_requests_email_format check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);
create trigger trg_quote_requests_updated_at
  before update on quote_requests
  for each row execute function set_updated_at();

create index if not exists idx_quote_requests_status on quote_requests (status);
create index if not exists idx_quote_requests_created on quote_requests (created_at desc);
create index if not exists idx_quote_requests_email on quote_requests (lower(email));

-- ---------------------------------------------------------------------
-- 5. quote_request_items — produits/catégories mentionnés dans un devis
-- ---------------------------------------------------------------------
create table if not exists quote_request_items (
  id                uuid primary key default gen_random_uuid(),
  quote_request_id  uuid not null references quote_requests(id) on delete cascade,
  product_id        uuid references products(id) on delete set null,
  category          category_key,     -- utile si le client cible une catégorie sans produit précis
  quantity          numeric(10,2),
  notes             text
);
create index if not exists idx_quote_items_request on quote_request_items (quote_request_id);

-- ---------------------------------------------------------------------
-- 6. newsletter_subscribers — inscriptions newsletter (footer)
-- ---------------------------------------------------------------------
create table if not exists newsletter_subscribers (
  id               uuid primary key default gen_random_uuid(),
  email            text not null unique,
  consent          boolean not null default true,
  source           text default 'footer',
  subscribed_at    timestamptz not null default now(),
  unsubscribed_at  timestamptz,
  constraint newsletter_email_format check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);
create index if not exists idx_newsletter_active on newsletter_subscribers (email) where unsubscribed_at is null;

-- ---------------------------------------------------------------------
-- 7. contact_messages — formulaire de contact générique (si ajouté)
-- ---------------------------------------------------------------------
create table if not exists contact_messages (
  id           uuid primary key default gen_random_uuid(),
  full_name    text not null,
  email        text not null,
  phone        text,
  company_name text,
  subject      text,
  message      text not null,
  status       request_status not null default 'nouveau',
  created_at   timestamptz not null default now(),
  constraint contact_messages_email_format check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);
create index if not exists idx_contact_messages_created on contact_messages (created_at desc);

-- ---------------------------------------------------------------------
-- 8. orders / order_items — commandes (si Proline Lab ouvre la vente en
--    ligne un jour ; sans impact si non utilisé pour l'instant).
-- ---------------------------------------------------------------------
create table if not exists orders (
  id            uuid primary key default gen_random_uuid(),
  order_number  text not null unique,      -- ex: "PL-2026-000123"
  contact_id    uuid references contacts(id) on delete set null,
  company_id    uuid references companies(id) on delete set null,
  status        order_status not null default 'en_attente',
  currency      text not null default 'TND',
  total_amount  numeric(12,2) not null default 0,
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create trigger trg_orders_updated_at
  before update on orders
  for each row execute function set_updated_at();

create index if not exists idx_orders_status on orders (status);
create index if not exists idx_orders_created on orders (created_at desc);

create table if not exists order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references orders(id) on delete cascade,
  product_id  uuid references products(id) on delete set null,
  quantity    numeric(10,2) not null default 1,
  unit_price  numeric(12,2) not null default 0,
  line_total  numeric(12,2) generated always as (quantity * unit_price) stored
);
create index if not exists idx_order_items_order on order_items (order_id);

-- ---------------------------------------------------------------------
-- Vue pratique : dernières demandes de devis avec infos entreprise
-- ---------------------------------------------------------------------
create or replace view v_recent_quote_requests as
select
  qr.id,
  qr.full_name,
  qr.email,
  qr.phone,
  coalesce(c.name, qr.company_name) as company_name,
  qr.status,
  qr.source,
  qr.created_at
from quote_requests qr
left join companies c on c.id = qr.company_id
order by qr.created_at desc;
