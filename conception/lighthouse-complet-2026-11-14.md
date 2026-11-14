# Audit Lighthouse complet

**Date :** 14 novembre 2026  
**Pages auditées :** accueil, mentions légales et politique de confidentialité  
**Outil :** Lighthouse 13.6.0 avec Chromium  
**Environnement :** copie locale servie par HTTP, thème clair, profils mobile et desktop  
**Catégories :** performance, accessibilité, bonnes pratiques et SEO

## Résultats

| Page | Profil | Performance | Accessibilité | Bonnes pratiques | SEO | FCP | LCP | TBT | CLS |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Accueil | Mobile | 97 | 96 | 100 | 100 | 1,8 s | 1,8 s | 130 ms | 0,019 |
| Accueil | Desktop | 83 | 96 | 100 | 100 | 0,4 s | 0,4 s | 0 ms | 0,353 |
| Mentions légales | Mobile | 100 | 96 | 100 | 100 | 0,9 s | 0,9 s | 0 ms | 0 |
| Mentions légales | Desktop | 100 | 96 | 100 | 100 | 0,3 s | 0,3 s | 0 ms | 0 |
| Politique de confidentialité | Mobile | 100 | 96 | 100 | 100 | 1,1 s | 1,1 s | 10 ms | 0 |
| Politique de confidentialité | Desktop | 100 | 96 | 100 | 100 | 0,3 s | 0,3 s | 0 ms | 0 |

FCP : First Contentful Paint ; LCP : Largest Contentful Paint ; TBT : Total Blocking Time ; CLS : Cumulative Layout Shift. Les scores et mesures sont propres à cette exécution locale.

## Constats principaux

### 1. Décalage de mise en page sur l’accueil desktop

Le CLS de l’accueil desktop est de **0,353**, au-dessus du seuil « bon » de 0,1. Le résultat a été reproduit lors d’une seconde mesure. Lighthouse identifie `.hero-visual` comme l’élément qui se déplace. La fonction `updateHeroVisualBounds()` calcule et applique ses dimensions après le rendu initial ; il faut réserver sa géométrie avant son affichage ou éviter que ce calcul déplace le contenu.

L’accueil mobile obtient un CLS de 0,019.

### 2. Contraste insuffisant en thème clair

Les trois pages obtiennent 96 en accessibilité. Lighthouse signale des textes secondaires `#71717a` sur `#f4f4f5` (ratio 4,39:1 au lieu de 4,5:1) et des éléments d’accent `#a3e635` sur fond clair (ratios 1,37:1 à 1,5:1).

Nombre de nœuds signalés : 19 sur l’accueil, 27 sur les mentions légales et 42 sur la politique de confidentialité. Une teinte de texte secondaire plus foncée et une teinte d’accent dédiée au thème clair permettraient d’atteindre les seuils WCAG AA sans changer la palette du thème sombre.

### 3. Autres diagnostics de performance

Lighthouse propose également la minification des CSS/JavaScript, l’amélioration de la livraison d’images et la réduction des ressources bloquant le rendu. Les économies estimées sont indicatives. Les mesures de cache et de latence HTTP ne sont pas représentatives de la production, car les pages ont été servies par le serveur local Python, sans la configuration réelle de l’hébergement.

## Limites

- L’audit porte sur les trois pages locales, dans leur rendu français initial. Les pages anglaises n’ont pas d’URL distincte, conformément à la décision de conserver la traduction JavaScript actuelle.
- Le site publié, ses en-têtes HTTP, son cache CDN et ses performances réelles n’ont pas été mesurés.
- Le Lighthouse SEO à 100 ne valide pas à lui seul l’indexation de chaque langue ni les métadonnées sur les moteurs réels.
- Aucun formulaire n’a été soumis ; ce test ne vérifie pas la réception d’un message par Formspree.
- Aucune URL de dépôt ou de site n’a été modifiée.

## Suite suggérée

1. Corriger le CLS desktop du hero.
2. Ajuster les couleurs du thème clair pour satisfaire les seuils de contraste.
3. Si nécessaire, refaire les mesures sur le site effectivement publié après confirmation de son URL.
