const legalBurgerButton = document.getElementById("legal-burger-btn");
const legalMobileOverlay = document.getElementById("legal-mobile-overlay");

if (legalBurgerButton && legalMobileOverlay) {
  const focusableSelector = 'a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';
  let previouslyFocusedElement = null;

  function getFocusableItems() {
    return Array.from(
      legalMobileOverlay.querySelectorAll(focusableSelector),
    ).filter(
      (element) =>
        !element.closest("details:not([open])") ||
        element.tagName === "SUMMARY",
    );
  }

  function setLegalMenuOpen(isOpen) {
    legalBurgerButton.classList.toggle("open", isOpen);
    legalBurgerButton.setAttribute("aria-expanded", String(isOpen));
    legalMobileOverlay.classList.toggle("open", isOpen);
    legalMobileOverlay.setAttribute("aria-hidden", String(!isOpen));
    legalMobileOverlay.inert = !isOpen;

    if (isOpen) {
      previouslyFocusedElement = document.activeElement;
      getFocusableItems()[0]?.focus();
    } else {
      legalBurgerButton.focus();
      previouslyFocusedElement?.focus();
      previouslyFocusedElement = null;
    }
  }

  legalBurgerButton.addEventListener("click", () => {
    const isOpen = legalBurgerButton.getAttribute("aria-expanded") !== "true";
    setLegalMenuOpen(isOpen);
  });

  legalMobileOverlay.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("click", () => setLegalMenuOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (!legalMobileOverlay.classList.contains("open")) return;

    if (event.key === "Escape") {
      setLegalMenuOpen(false);
      return;
    }

    if (event.key !== "Tab") return;

    const focusableItems = getFocusableItems();
    const firstItem = focusableItems[0];
    const lastItem = focusableItems[focusableItems.length - 1];

    if (!firstItem || !lastItem) {
      event.preventDefault();
    } else if (event.shiftKey && document.activeElement === firstItem) {
      event.preventDefault();
      lastItem.focus();
    } else if (!event.shiftKey && document.activeElement === lastItem) {
      event.preventDefault();
      firstItem.focus();
    }
  });
}
