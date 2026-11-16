# Maintenance du portfolio

Ce guide explique comment garder à jour les compteurs des statistiques de l’accueil et valider les fichiers du site avant leur publication.

## Mettre à jour les compteurs

Le synchroniseur met à jour les valeurs statiques de [index.html](./index.html), afin qu’elles soient présentes dans le HTML initial pour les visiteurs et les moteurs de recherche. Le JavaScript anime ensuite ces valeurs.

Il met à jour :

- **Expérience** : calcule le nombre d’années à partir de l’année indiquée dans `data-start-year`.
- **Projets** : compte les éléments `<article>` ayant la classe `project-card`.

Le compteur **100 %** n’est pas calculé par le script. Modifie directement cette valeur dans `index.html` si elle doit changer.

### Étapes dans VS Code

1. Ouvre le dossier du site dans VS Code.
2. Modifie les données nécessaires dans `index.html` :
   - ajuste `data-start-year` selon ton année réelle de début d’expérience ;
   - ajoute ou retire les cartes de projet avec la classe `project-card` ;
   - modifie manuellement `100%` si nécessaire.
3. Ouvre le terminal intégré avec **Terminal → Nouveau terminal**.
4. Vérifie que le terminal se trouve à la racine du site, au même niveau que `index.html`. Sinon, exécute :

   ```bash
   cd /var/www/html/PERSO/TRICHEREAUludovic.github.io
   ```

5. Lance la synchronisation :

   ```bash
   python3 scripts/sync-stat-boxes.py
   ```

6. Vérifie que les valeurs sont à jour :

   ```bash
   python3 scripts/sync-stat-boxes.py --check
   ```

7. Vérifie les changements dans `index.html`, puis publie le site selon ta procédure habituelle GitHub Pages.

## À quoi servent les commandes ?

| Commande | Effet |
|---|---|
| `python3 scripts/sync-stat-boxes.py` | Calcule les années d’expérience et compte les cartes projet, puis met à jour les chiffres correspondants dans `index.html`. |
| `python3 scripts/sync-stat-boxes.py --check` | Vérifie les chiffres sans modifier les fichiers. Si les valeurs sont obsolètes, relance la première commande. |

Le script utilise Python et sa bibliothèque standard : aucune dépendance supplémentaire n’est à installer. Il s’exécute sur ton ordinateur ; GitHub Pages ne le lance pas automatiquement.

## Valider le site avant publication

Depuis la racine du site, lance :

```bash
python3 scripts/validate-site.py
```

Le script vérifie que les deux catalogues JSON sont valides et ont les mêmes clés, que les traductions utilisées par les pages existent, que les identifiants HTML ne sont pas dupliqués, que les références locales et leurs ancres existent, et que `sitemap.xml` est un XML valide. Il ne modifie aucun fichier.

Une validation réussie affiche :

```text
Validation réussie : locales, clés de traduction, identifiants, références locales et sitemap.
```

En cas d’erreur, le script affiche les fichiers et références concernés et renvoie un code de sortie non nul. Il ne vérifie pas la syntaxe HTML complète, les liens externes ni le site après publication.

### Vérification conseillée après une modification

```bash
python3 scripts/sync-stat-boxes.py
python3 scripts/sync-stat-boxes.py --check
python3 scripts/validate-site.py
```

La première commande ne sert qu’à synchroniser les compteurs; le vérificateur de site, lui, reste en lecture seule.

## Valeur d’expérience actuelle

L’année `2020` dans `data-start-year` a été mise en place pour tester la synchronisation. Avant publication, vérifie qu’elle correspond bien à ton année réelle de début d’expérience. Par exemple, avec une année de début à 2020 et une année actuelle à 2026, le compteur affiche `6+`.
