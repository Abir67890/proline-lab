-- =====================================================================
-- Proline Lab — données de démonstration (optionnel)
-- Exécution : psql "$DATABASE_URL" -f database/seed.sql
-- À lancer APRÈS schema.sql. Purement indicatif, à adapter/supprimer.
-- =====================================================================

insert into products (code, name, category, packaging, dosage) values
  ('PL-CUI-001', 'Dégraissant cuisine intensif', 'cuisine', 'Bidon 5L', '20ml / 10L d''eau'),
  ('PL-MAC-001', 'Détergent lave-vaisselle pro', 'machine', 'Bidon 10L', 'Selon programme machine'),
  ('PL-BUA-001', 'Détachant textile hôtelier', 'buanderie', 'Bidon 5L', '30ml / cycle'),
  ('PL-SAN-001', 'Détartrant sanitaires', 'sanitaire', 'Bidon 5L', 'Pur ou dilué selon surface'),
  ('PL-COM-001', 'Nettoyant vitres multi-surfaces', 'communs', 'Spray 750ml', 'Prêt à l''emploi'),
  ('PL-PIS-001', 'Traitement choc piscine', 'piscine', 'Bidon 5L', 'Selon volume du bassin')
on conflict (code) do nothing;

insert into companies (name, sector, city, country) values
  ('Hôtel Demo Sousse', 'Hôtel', 'Sousse', 'Tunisie')
on conflict do nothing;

-- Exemple de demande de devis liée à un produit de la catégorie "cuisine"
with c as (
  select id from companies where name = 'Hôtel Demo Sousse' limit 1
), qr as (
  insert into quote_requests (full_name, email, phone, company_name, message, source, company_id)
  select 'Amira Ben Salah', 'amira.bensalah@example.com', '+216 22 000 111',
         'Hôtel Demo Sousse', 'Besoin d''un devis pour la gamme cuisine.', 'spotlight_product', c.id
  from c
  returning id
)
insert into quote_request_items (quote_request_id, product_id, category, quantity)
select qr.id, p.id, 'cuisine', 10
from qr, products p
where p.code = 'PL-CUI-001';

insert into newsletter_subscribers (email, source) values
  ('contact.demo@example.com', 'footer')
on conflict (email) do nothing;
