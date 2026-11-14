# Audit complet du portfolio

**Date :** 14 novembre 2026  
**Périmètre :** page d’accueil, mentions légales, politique de confidentialité, styles et scripts partagés, traductions, ressources, `robots.txt`, `sitemap.xml` et rapports Lighthouse fournis.

## Résultat global

### **Note : 17/20**

Le portfolio est visuellement soigné, cohérent et rapide. Sa structure statique convient bien à GitHub Pages et les interactions principales sont accessibles au clavier. La note est réduite par quelques défauts précis (lien de code source cassé, politique de confidentialité partiellement obsolète), ainsi que par des améliorations possibles en accessibilité et en référencement bilingue.

Cette note est une évaluation qualitative, pas une certification. Pondération indicative : accessibilité 20 %, expérience utilisateur 20 %, performance 15 %, SEO 20 %, maintenance 15 %, cohérence des informations de confidentialité et des pages légales 10 %.

| Axe | Note | Évaluation |
|---|---:|---|
| Accessibilité | 17/20 | Très bons repères et états ARIA ; étiquettes visibles, navigation mobile et mouvements à améliorer. |
| UX et interface | 18/20 | Identité marquée, interactions cohérentes et bon comportement mobile ; un lien du pied de page ne mène nulle part. |
| Performance | 19,5/20 | Lighthouse : 99 mobile et 100 desktop ; LCP mobile mesuré à 2,0 s. |
| SEO | 15/20 | Bases solides et bons scores Lighthouse ; le référencement anglais et les URL canoniques sont perfectibles. |
| Maintenance | 16/20 | Peu de dépendances et traductions cohérentes ; pas de tests automatisés et quelques restes semblent inutilisés. |
| Confidentialité et pages légales | 14/20 | Contenu détaillé et structuré, mais une mention de prestataire ne correspond plus aux ressources réellement chargées. Ce n’est pas une validation juridique. |

## Méthode et limites

- Inspection des trois pages HTML, des fichiers CSS/JavaScript, des deux catalogues de traduction, des ressources statiques, du sitemap et du fichier robots.
- Vérification automatisée des clés de traduction : **166 clés dans chaque langue**, aucune clé manquante pour les éléments traduits des trois pages.
- Vérification des identifiants et références internes : aucun identifiant dupliqué ; une référence d’ancre cassée dans le pied de page.
- Contrôle navigateur local à 375 × 812 px, en thème clair et avec la préférence de réduction des animations activée : pas de débordement horizontal observé ; pages légales affichées correctement.
- Contrôle clavier du menu mobile et de la fermeture d’une carte projet avec Échap.
- Les rapports Lighthouse fournis testent la page d’accueil en mode sombre sur un serveur local. Ils ne constituent pas une mesure de la version publiée ni une comparaison avec les anciens tests qui visaient une autre URL.
- Le formulaire n’a pas été soumis : la disponibilité de Formspree, la réception des e-mails et les réglages du compte n’ont pas été vérifiés.
- Ce document n’est ni un audit de sécurité exhaustif, ni un avis juridique ou une vérification de conformité RGPD.

## Points forts

- **Performance observée excellente :** Lighthouse affiche 99 en performance mobile et 100 sur desktop ; LCP mobile 2,0 s, desktop 0,5 s. Accessibilité, bonnes pratiques et SEO sont notés 100 dans les rapports examinés.
- **Structure claire :** un titre principal sur l’accueil, des sections identifiables, des pages légales avec sommaire, titres et navigation nommée.
- **Interactions clavier travaillées :** focus visible sur plusieurs contrôles, cartes projets pilotables au clavier, fermeture possible avec Échap, formulaire doté d’états de succès et d’erreur annoncés.
- **Réduction des dépendances externes :** les icônes sont intégrées en SVG et les images sont servies en WebP. Les liens externes utilisent `rel="noopener noreferrer"`.
- **Traductions bien synchronisées :** les catalogues français et anglais contiennent les mêmes clés ; la langue du document, les textes alternatifs et plusieurs libellés accessibles sont mis à jour.
- **Base SEO présente :** titre, description, données structurées JSON-LD, Open Graph sur l’accueil, sitemap et règles robots.
- **Format adapté à GitHub Pages :** les pages et ressources sont statiques ; aucun service serveur propre au site n’est nécessaire, hors prestataires explicitement utilisés comme Formspree.

## Constats et recommandations

### Priorité haute

1. **La politique de confidentialité cite encore Font Awesome et Cloudflare.**  
   Les paragraphes français et anglais indiquent que la page d’accueil charge Font Awesome depuis cdnjs, alors qu’aucune référence à Font Awesome, cdnjs ou Cloudflare n’a été trouvée dans les ressources actives du site. Cette information obsolète est visible sur la page de confidentialité. Mettre à jour ou retirer cette mention dans les deux traductions et vérifier que les prestataires décrits correspondent aux traitements réellement utilisés.  
   Fichiers concernés : [politique-confidentialite.html](/var/www/html/PERSO/perso_v2.io/politique-confidentialite.html), [fr.json](/var/www/html/PERSO/perso_v2.io/Public/locales/fr.json), [en.json](/var/www/html/PERSO/perso_v2.io/Public/locales/en.json).

2. **Le lien « Code source » du pied de page est cassé.**  
   Il pointe vers `#code-source`, mais aucun élément de la page ne porte cet identifiant. Le navigateur ne peut donc pas atteindre une destination. Le remplacer par l’URL exacte du dépôt public s’il doit être accessible, ou retirer le lien.  
   Fichier concerné : [index.html](/var/www/html/PERSO/perso_v2.io/index.html).

### Priorité moyenne

3. **Le référencement anglais n’a pas d’URL propre.**  
   La page HTML initiale est en français ; l’anglais est appliqué ensuite par JavaScript, selon la préférence enregistrée dans `localStorage`. Les deux langues partagent la même URL, sans versions distinctes ni liens `hreflang`. Les moteurs peuvent exécuter du JavaScript, mais il est plus difficile de faire indexer, partager et cibler séparément chaque version linguistique. Pour un référencement bilingue plus fiable, envisager deux pages statiques accessibles par URL, chacune avec ses métadonnées et ses liens `hreflang`. Ajouter également une URL canonique lorsque le domaine de production est confirmé.

4. **Le menu mobile laisse le focus sortir de son panneau.**  
   Le menu occupe tout l’écran visuellement, mais après ses trois liens, la tabulation atteint les contrôles de langue du contenu sous-jacent sans fermer le menu. Si ce panneau doit se comporter comme un menu modal, maintenir le focus à l’intérieur tant qu’il est ouvert, ou fermer le menu quand le focus le quitte. Le comportement actuel a été reproduit au clavier sur la version locale.

5. **Les champs du formulaire n’ont pas d’étiquette visible persistante.**  
   Leur nom accessible est fourni par `aria-label` et le placeholder, ce qui explique que Lighthouse puisse réussir l’audit automatisé. Des libellés visibles associés aux champs resteraient toutefois présents après saisie et aideraient les personnes ayant des difficultés de mémoire ou de perception. À envisager pour le nom, l’adresse e-mail, le sujet et le message.

6. **La préférence de mouvement réduit n’est pas appliquée à toutes les animations.**  
   Le compteur et l’effet de bordure tiennent compte de `prefers-reduced-motion`, mais les animations décoratives du hero, les transitions de navigation et le défilement fluide global restent actifs. Prévoir une règle globale de réduction pour les mouvements non essentiels et vérifier le comportement du logo et du menu avec cette préférence activée.

7. **Échap ferme simultanément le menu mobile et une carte projet ouverte.**  
   Le test navigateur confirme que le menu se ferme, la carte revient à son aperçu et le focus revient au bouton de la carte. Ce n’est pas bloquant, mais les deux composants réagissent au même événement global. Une gestion hiérarchisée des panneaux ouverts rendrait le résultat plus prévisible.

### Priorité basse

8. **Le message d’aide des projets parle de survol, même sur mobile.**  
   Les démos peuvent aussi être lancées par toucher. Adapter le texte ou afficher une instruction adaptée aux appareils tactiles.

9. **Des éléments semblent être des restes de développement.**  
   `Public/js/page-behavior.js` n’est référencé que par une balise script commentée dans l’accueil. Il bloque le clic droit et certains raccourcis du navigateur (outils de développement, affichage du code source, enregistrement) ; il n’apporte pas de protection réelle et ne devrait pas être activé. Le supprimer ou l’archiver explicitement. Plusieurs sélecteurs CSS du formulaire (`.contact-field-label`, `.contact-form-identity`, `.contact-privacy-note`) ne correspondent pas au formulaire actuel et méritent une vérification avant nettoyage.  
   Fichiers concernés : [page-behavior.js](/var/www/html/PERSO/perso_v2.io/Public/js/page-behavior.js), [index.css](/var/www/html/PERSO/perso_v2.io/Public/css/index.css), [index.html](/var/www/html/PERSO/perso_v2.io/index.html).

10. **Le SVG du bouton hamburger porte un espace de noms erroné.**  
    Dans `index.html`, l’attribut vaut `xmlns="http://w3.org"` au lieu de l’espace de noms SVG standard. Le rendu HTML observé fonctionne, mais il est préférable de corriger cette valeur pour conserver un balisage valide et cohérent avec les autres SVG.

11. **Les polices déclarées ne semblent pas être chargées.**  
    La feuille partagée nomme Inter et JetBrains Mono, mais aucun fichier de police ni chargement externe correspondant n’a été repéré. Le navigateur utilise probablement les polices de remplacement. Si ce choix est intentionnel, simplifier la pile de polices ; sinon, fournir les polices localement et mesurer leur impact.

12. **La validation globale reste manuelle.**  
    Aucun gestionnaire de paquets, test automatisé ou workflow de validation n’a été repéré dans le périmètre inspecté. Le script [sync-stat-boxes.py](/var/www/html/PERSO/perso_v2.io/scripts/sync-stat-boxes.py) synchronise désormais les compteurs de l’accueil, mais ne remplace pas une vérification générale de la syntaxe JS, des traductions, des liens, du sitemap et du HTML.

## SEO, hébergement et confidentialité : précisions

- Le sitemap répertorie l’accueil et les deux pages légales. Les règles de `robots.txt` excluent `/conception/` et `/.git/` pour les robots concernés. **`robots.txt` n’est pas un contrôle d’accès** : ne jamais publier dans ces chemins un contenu qui doit rester privé ; vérifier le contenu réellement déployé sur GitHub Pages.
- Les rapports Lighthouse ne vérifient ni les en-têtes HTTP de production ni le comportement des moteurs après déploiement.
- Les pages légales décrivent Formspree, Gmail et GitHub Pages. Vérifier régulièrement ces déclarations et les informations relatives au responsable, aux durées de conservation et aux modalités du compte Formspree. Leur adéquation juridique dépend de la situation réelle et n’a pas été évaluée ici.
- Le choix de langue est enregistré dans `localStorage` ; cette préférence est locale au navigateur et n’est pas un cookie, conformément au texte observé dans le code.

## Plan d’action conseillé

1. Corriger la mention Font Awesome/Cloudflare dans les deux langues et réparer ou retirer le lien « Code source ».
2. Améliorer le parcours clavier du menu mobile et ajouter des libellés visibles au formulaire.
3. Définir une stratégie d’URL pour le français et l’anglais, puis compléter les métadonnées des pages.
4. Harmoniser les animations avec `prefers-reduced-motion`.
5. Nettoyer les éléments réellement inutilisés et ajouter une petite vérification automatisée avant publication.

## Mes impressions

Le site donne une impression de portfolio personnel abouti plutôt que de simple page de CV. Le hero animé, les cartes de projets et la palette sombre/lime créent une identité reconnaissable, tandis que les pages légales et le formulaire donnent une base sérieuse. Les améliorations récentes de performance se voient dans les rapports Lighthouse, sans dépendance à un backend pour l’affichage du site. Les quelques défauts relevés sont circonscrits et réparables ; les deux plus urgents sont surtout des questions de fiabilité éditoriale — la mention de Cloudflare devenue fausse et le lien de code source sans destination.
