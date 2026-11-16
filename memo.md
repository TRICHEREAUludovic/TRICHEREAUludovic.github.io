# Classes Bento des projets

La grille de projets utilise les classes de base `bento-grid projects-grid`. Chaque projet est un `<article class="project-card">`.

## Classes de taille

- `project-card--wide` : étend le projet sur deux colonnes.
- `project-card--tall` : étend le projet sur deux rangées. Le verso conserve cette hauteur lorsque la carte est retournée.

Les classes de taille s’appliquent à partir de 768 px et uniquement lorsque le filtre **Tous** est sélectionné. Sur mobile ou lorsqu’un filtre de catégorie est actif, les projets reprennent leur disposition normale.

## Exemple

```html
<div class="bento-grid projects-grid">
  <article
    class="project-card project-card--wide project-card--tall"
    data-category="landing"
  >
    <!-- Contenu du projet -->
  </article>
</div>
```

Cet exemple donne au projet deux colonnes et deux rangées sur grand écran avec le filtre **Tous**. Pour n’appliquer qu’une dimension, utiliser uniquement `project-card--wide` ou `project-card--tall`.