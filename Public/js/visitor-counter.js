/**
 * Compteur de visites uniques par IP
 * Utilise CountAPI pour compter automatiquement les visiteurs uniques
 */

(function () {
  "use strict";

  // Configuration - Changez ces valeurs pour votre site
  const NAMESPACE = "trichereauludovic-portfolio";
  const KEY = "page-visits";

  const counterElement = document.getElementById("visitor-count");

  if (!counterElement) {
    return;
  }

  /**
   * Met à jour le compteur de visites
   * CountAPI compte automatiquement une seule fois par IP
   */
  async function updateVisitorCount() {
    try {
      // Utilise l'endpoint 'hit' qui incrémente et retourne le compteur
      const response = await fetch(
        `https://api.countapi.xyz/hit/${NAMESPACE}/${KEY}`,
      );

      if (!response.ok) {
        throw new Error("Erreur API");
      }

      const data = await response.json();

      // Affiche le nombre avec animation
      animateCounter(data.value);
    } catch (error) {
      console.error("Erreur compteur:", error);
      counterElement.textContent = "N/A";
    }
  }

  /**
   * Anime le compteur
   */
  function animateCounter(finalValue) {
    let current = 0;
    const duration = 1000;
    const steps = 30;
    const increment = finalValue / steps;

    const interval = setInterval(() => {
      current += increment;
      if (current >= finalValue) {
        current = finalValue;
        clearInterval(interval);
      }
      counterElement.textContent = Math.floor(current).toLocaleString("fr-FR");
    }, duration / steps);
  }

  // Lance le compteur au chargement
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateVisitorCount);
  } else {
    updateVisitorCount();
  }
})();
