# Reste à faire

État des points relevés dans l’audit du 14 novembre 2026, après les corrections déjà appliquées.

## Terminé

- [x] Mettre à jour la mention obsolète Font Awesome / Cloudflare dans la politique de confidentialité française et anglaise.
- [x] Réparer le lien « Code source » du pied de page avec l’URL fournie et confirmée par Ludovic.
- [x] Améliorer le parcours clavier du menu mobile et éviter que la touche Échap ferme simultanément le menu et une carte projet.
- [x] Ajouter des libellés visibles aux champs du formulaire.
- [x] Appliquer `prefers-reduced-motion` aux animations et au défilement fluide.
- [x] Adapter le texte des démos pour les appareils tactiles.
- [x] Supprimer le script de blocage du navigateur inutilisé et corriger le namespace SVG du hamburger.
- [x] Conserver une seule URL par page et le changement de langue actuel par JavaScript, selon le choix de Ludovic.
- [x] Faire ouvrir le lien LinkedIn dans l’onglet courant, comme sur l’ancien site.
- [x] Remplacer les noms de polices non fournies par des piles de polices système.
- [x] Retirer les règles CSS du formulaire qui n’étaient plus utilisées.
- [x] Ajouter une vérification automatique des locales, clés de traduction, identifiants, références locales et du sitemap.
- [x] Vérifier la syntaxe JavaScript et contrôler que les compteurs de la page sont synchronisés.
- [x] Auditer les trois pages avec Lighthouse en mobile et desktop ; voir [l’audit Lighthouse complet](./lighthouse-complet-2026-11-14.md).

## À confirmer avec Ludovic

- [x] Tester le parcours clavier et les animations réduites dans un navigateur après les changements : focus maintenu dans le menu, Échap hiérarchisé entre menu et carte projet, défilement/animations réduits confirmés.

## Hors périmètre

- Ne pas vérifier ni modifier les descriptions des services, les durées de conservation Formspree ou les informations légales.

## Non retenu

- Le référencement avec des URL distinctes par langue n’est pas prévu : le site conserve son fonctionnement actuel.
- Ne pas remplacer ni modifier une URL de dépôt ou de site (notamment dans les liens, `robots.txt` ou `sitemap.xml`) sans confirmation explicite de Ludovic.
