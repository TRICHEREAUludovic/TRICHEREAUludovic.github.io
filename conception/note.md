# Points techniques à reprendre dans le README

Ce fichier rassemble les comportements particuliers et les décisions techniques à documenter dans le README du site.

## Mode sombre forcé de Samsung Internet et illustration 404

- L’option Samsung Internet **« Forcer mode sombre pour contenu Web »** recolorait le site. Sur la page 404, la partie grise du SVG animé disparaissait et un flash blanc apparaissait au début de l’animation.
- La désactivation de cette option rétablit le rendu attendu, mais le site ne peut pas modifier le réglage du navigateur à la place du visiteur. Les déclarations `color-scheme` seules ne neutralisent pas ce forçage Samsung.
- Le logo WebP du site n’étant pas recoloré, l’illustration 404 est désormais servie comme WebP animée transparente dans [`404.html`](../404.html), via [`404-animated.webp`](../Public/img/404-animated.webp). Le SVG [`404.svg`](../Public/img/404.svg) reste la source à modifier avant de régénérer l’animation.
- À vérifier après publication avec le forçage Samsung activé : couleurs intactes, transparence, boucle de l’animation et absence de flash blanc. Le résultat de cette vérification n’est pas encore confirmé.

## CLS élevé signalé sur bureau

- Un rapport PageSpeed a signalé un CLS de `0,353` sur bureau, mais ce résultat n’a pas été reproduit sur la page publiée.
- Plusieurs mesures avec `PerformanceObserver` ont relevé un CLS de `0` à environ `0,001` entre 1280 et 1440 px. Aucun changement de mise en page n’a été fait sans cause reproductible.
- Relancer PageSpeed lorsque le quota sera disponible (la dernière tentative a reçu une réponse HTTP `429`) et examiner les sources de décalage si le CLS élevé réapparaît.
