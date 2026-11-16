# Reste à faire — PageSpeed Insights

Points relevés dans les rapports PageSpeed Insights de la page d’accueil, générés le 16 novembre 2026 vers 10 h 06 :

- [Rapport mobile](<./PageSpeed Insights-mobile.pdf>)
- [Rapport bureau](<./PageSpeed Insights-bureau.pdf>)

Les rapports n’ont pas de données terrain ; les scores et métriques ci-dessous proviennent de mesures Lighthouse en laboratoire et peuvent varier.

## Résultats observés

| Mesure | Mobile | Bureau |
|---|---:|---:|
| Performances | 100 | 83 |
| Accessibilité | 96 | 96 |
| Bonnes pratiques | 100 | 100 |
| SEO | 100 | 100 |
| First Contentful Paint | 0,9 s | 0,3 s |
| Largest Contentful Paint | 0,9 s | 0,3 s |
| Total Blocking Time | 0 ms | 0 ms |
| Cumulative Layout Shift | 0,019 | 0,353 |
| Speed Index | 1,0 s | 0,5 s |

## Priorité haute

- [x] Investiguer le CLS bureau (`0,353`) du rapport : il n’a pas été reproduit sur la page publiée. Plusieurs mesures `PerformanceObserver` ont donné un CLS de `0` à environ `0,001` entre 1280 et 1440 px. Aucun changement de mise en page n’a été fait sans cause reproductible.
- [ ] Relancer PageSpeed Insights après réinitialisation du quota, puis vérifier que le CLS bureau reste inférieur ou égal à `0,1`. La tentative de relance actuelle a été refusée par l’API (HTTP 429, quota dépassé) ; si le CLS élevé réapparaît, examiner les sources de décalage du rapport et corriger leur cause.
- [ ] Corriger le contraste de couleurs signalé par PageSpeed sur bureau. Vérifier les combinaisons de texte et d’arrière-plan dans les thèmes clair et sombre, avec les seuils WCAG AA.
- [ ] Examiner les 10 vérifications d’accessibilité manuelles signalées dans le rapport bureau et traiter celles qui s’appliquent au site.

## Priorité moyenne

- [ ] Examiner les deux animations non composées signalées dans le rapport mobile ; vérifier leur impact et privilégier `transform` ou `opacity` si une correction est nécessaire.
- [ ] Examiner les images signalées par l’insight d’optimisation : économies estimées à 23 Kio sur mobile et 61 Kio sur bureau. Optimiser les fichiers ou leurs dimensions si cela ne dégrade pas leur qualité.
- [ ] Évaluer les requêtes bloquant le rendu signalées sur bureau (économie estimée : 80 ms) et différer ou alléger les ressources concernées si le gain est pertinent.

## À surveiller

- Les scores de bonnes pratiques et de SEO sont de 100 sur les deux appareils.
- Les performances mobiles sont excellentes dans ce test ; vérifier après les corrections bureau que le CLS mobile reste bas.
- La navigation agentique obtient 2/2 sur mobile et 1/2 sur bureau dans cette catégorie PageSpeed expérimentale ; à réévaluer seulement si elle devient un objectif du site.
