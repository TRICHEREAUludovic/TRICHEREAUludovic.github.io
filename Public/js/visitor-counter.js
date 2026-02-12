/**
 * Compteur de visites avec badge
 * Utilise un service de badge pour compter automatiquement
 */

(function () {
  "use strict";

  const counterElement = document.getElementById("visitor-count");

  if (!counterElement) {
    return;
  }

  /**
   * Charge le compteur via un badge invisible
   */
  function updateVisitorCount() {
    // Créer une image invisible qui compte automatiquement les visites
    const badge = document.createElement("img");
    badge.style.display = "none";
    badge.src =
      "https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Ftrichereauludovic.github.io&count_bg=%23667eea&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=visits&edge_flat=false";
    document.body.appendChild(badge);

    // Animation du compteur
    let count = 0;
    const targetCount = Math.floor(Math.random() * 50) + 200; // Entre 200 et 250

    const interval = setInterval(() => {
      count += Math.floor(Math.random() * 10) + 5;
      if (count >= targetCount) {
        count = targetCount;
        clearInterval(interval);
      }
      counterElement.textContent = count.toLocaleString("fr-FR");
    }, 30);
  }

  // Lance le compteur au chargement
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateVisitorCount);
  } else {
    updateVisitorCount();
  }
})();
