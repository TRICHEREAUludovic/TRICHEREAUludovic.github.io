// Navigation et logo animé
const header = document.getElementById("main-header");
const flyingLogo = document.getElementById("flying-logo");
const heroAnchor = document.getElementById("hero-logo-anchor");
const navZone = document.getElementById("nav-logo-zone");
const burgerBtn = document.getElementById("burger-btn");
const mobileOverlay = document.getElementById("mobile-overlay");

// Formulaire de contact
const morphBox = document.getElementById("morph-contact-box");
const stepBtn = document.getElementById("morph-step-btn");
const stepForm = document.getElementById("morph-step-form");
const stepSuccess = document.getElementById("morph-step-success");
const stepError = document.getElementById("morph-step-error");
const contactForm = document.getElementById("morph-contact-form");
const contactSubmitButton = contactForm?.querySelector('button[type="submit"]');

function setContactSubmitState(isSubmitting) {
  if (!contactSubmitButton) return;

  const translationKey = isSubmitting ? "contact.submitting" : "contact.submit";
  const fallbackText = isSubmitting ? "Envoi en cours…" : "Envoyer ↗";
  const translatedText =
    typeof t === "function" ? t(translationKey) : translationKey;

  contactSubmitButton.disabled = isSubmitting;
  contactSubmitButton.dataset.i18n = translationKey;
  contactSubmitButton.textContent =
    translatedText === translationKey ? fallbackText : translatedText;
}

function updateExperienceCounter() {
  const experienceCounter = document.getElementById("experience-counter");
  if (!experienceCounter) return;

  const startYear = Number(experienceCounter.dataset.startYear);
  if (!Number.isInteger(startYear) || startYear < 1) {
    console.error("Année de début d’expérience invalide dans #experience-counter.");
    return;
  }

  const years = Math.max(0, new Date().getFullYear() - startYear);
  experienceCounter.textContent = `${years}+`;
}

function initStatBoxGlow() {
  document.querySelectorAll(".stat-box.glow").forEach((statBox) => {
    const borderRadius = getComputedStyle(statBox).borderRadius;
    statBox.querySelectorAll(".glow-container rect").forEach((rect) => {
      rect.setAttribute("rx", borderRadius);
    });
  });
}

function animateStatCounters() {
  const statsContainer = document.querySelector(".stats-wireframe");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (!statsContainer || prefersReducedMotion) {
    return;
  }

  const statNumbers = Array.from(statsContainer.querySelectorAll(".stat-number"));
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();

      statNumbers.forEach((counter) => {
        const match = counter.textContent.trim().match(/^([^0-9]*)(\d+)(.*)$/);
        if (!match) return;

        const [, prefix, targetText, suffix] = match;
        const target = Number(targetText);
        const duration = 1200;
        const startTime = performance.now();
        const ariaLive = counter.getAttribute("aria-live");

        if (ariaLive) counter.setAttribute("aria-live", "off");

        function updateCounter(currentTime) {
          const progress = Math.min((currentTime - startTime) / duration, 1);
          const easedProgress = 1 - (1 - progress) ** 3;
          const value = Math.floor(target * easedProgress);
          counter.textContent = `${prefix}${value}${suffix}`;

          if (progress < 1) {
            window.requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = `${prefix}${target}${suffix}`;
            if (ariaLive) counter.setAttribute("aria-live", ariaLive);
          }
        }

        window.requestAnimationFrame(updateCounter);
      });
    },
    { threshold: 0.35 },
  );

  observer.observe(statsContainer);
}

// Éléments du hero
const heroSection = document.querySelector(".hero");
const heroContent = document.querySelector(".hero-content");
const heroSubtitle = document.querySelector(".hero-subtitle");
const codeEditor = document.querySelector(".code-editor-mock");
const heroVisual = document.querySelector(".hero-visual");
let headerIsScrolled = null;

// État du terminal animé
const terminalScreen = document.getElementById("terminal-screen");
const fallbackTerminalLines = [
  "const priorites = [",
  "Des interfaces fluides et intuitives",
  "Des architectures back-end solides (Node & Postgres)",
  "Un code maintenable pensé pour durer",
  "];",
];
let linesData = fallbackTerminalLines;
let terminalAnimationTimeout;

// Formulaire de contact
function setMorphState(state) {
  morphBox.classList.toggle("is-closing", state === "btn");
  morphBox.classList.remove("state-form", "state-success", "state-error");
  stepBtn.setAttribute("aria-expanded", String(state === "form"));

  const activeStep =
    state === "form"
      ? stepForm
      : state === "success"
        ? stepSuccess
        : state === "error"
          ? stepError
          : stepBtn;
  [stepBtn, stepForm, stepSuccess, stepError].forEach((step) => {
    const isActive = step === activeStep;
    step.classList.toggle("active", isActive);
    step.setAttribute("aria-hidden", String(!isActive));
    step.inert = !isActive;
  });

  if (state === "form") {
    morphBox.classList.add("state-form");
  } else if (state === "success") {
    morphBox.classList.add("state-success");
  } else if (state === "error") {
    morphBox.classList.add("state-error");
  } else {
    contactForm?.reset();
    setContactSubmitState(false);
  }
}

function openContactForm() {
  setMorphState("form");
  document.getElementById("morph-close-x")?.focus();
}

// Ouverture au clic ou au clavier
stepBtn?.addEventListener("click", openContactForm);

// Boutons de fermeture et d'envoi sécurisés
document.getElementById("morph-close-x")?.addEventListener("click", (e) => {
  e.stopPropagation();
  setMorphState("btn");
  stepBtn.focus();
});

document.getElementById("morph-cancel-btn")?.addEventListener("click", (e) => {
  e.stopPropagation();
  setMorphState("btn");
  stepBtn.focus();
});

contactForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!contactForm) return;

  setContactSubmitState(true);

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      body: new FormData(contactForm),
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Formspree a répondu avec le statut ${response.status}.`);
    }

    contactForm.reset();
    setMorphState("success");
    document.getElementById("morph-reset-btn")?.focus();
  } catch (error) {
    console.error("Impossible d’envoyer le formulaire via Formspree.", error);
    setContactSubmitState(false);
    setMorphState("error");
    document.getElementById("morph-error-reset-btn")?.focus();
  }
});

document.getElementById("morph-reset-btn")?.addEventListener("click", (e) => {
  e.stopPropagation();
  setMorphState("btn");
  stepBtn.focus();
});

document.getElementById("morph-error-reset-btn")?.addEventListener("click", (e) => {
  e.stopPropagation();
  setMorphState("btn");
  stepBtn.focus();
});

function handleAutoCloseOnScroll() {
  if (!morphBox) return;

  const isFormOpen = morphBox.classList.contains("state-form");
  const isFeedbackOpen =
    morphBox.classList.contains("state-success") ||
    morphBox.classList.contains("state-error");
  if (!isFormOpen && !isFeedbackOpen) return;

  const rect = morphBox.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;

  // Se déclenche dès que le formulaire sort de l'écran en haut ou en bas
  const isOutOfView = rect.bottom < 40 || rect.top > windowHeight - 40;

  if (isOutOfView) {
    if (isFeedbackOpen) {
      setMorphState("btn");
    } else if (isFormOpen) {
      const hasTypedText = Array.from(contactForm.elements).some((el) => {
        const isTextField =
          (el.tagName === "INPUT" && el.type !== "checkbox") ||
          el.tagName === "TEXTAREA";
        return isTextField && el.value.trim() !== "";
      });

      if (!hasTypedText) {
        setMorphState("btn");
      }
    }
  }
}

window.addEventListener("scroll", handleAutoCloseOnScroll, { passive: true });

// Menu mobile
const mobileMenuFocusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(", ");
let previousFocusedElement = null;

function getFocusableMobileMenuItems() {
  if (!mobileOverlay) return [];
  return Array.from(mobileOverlay.querySelectorAll(mobileMenuFocusableSelector)).filter(
    (element) => !element.hasAttribute("disabled") && !element.closest("[hidden]"),
  );
}

function toggleMenu() {
  const isOpen = burgerBtn.getAttribute("aria-expanded") !== "true";
  burgerBtn.classList.toggle("open", isOpen);
  burgerBtn.setAttribute("aria-expanded", String(isOpen));
  mobileOverlay.classList.toggle("open", isOpen);
  mobileOverlay.setAttribute("aria-hidden", String(!isOpen));
  mobileOverlay.inert = !isOpen;

  if (isOpen) {
    previousFocusedElement = document.activeElement;
    const [firstFocusableItem] = getFocusableMobileMenuItems();
    firstFocusableItem?.focus();
  } else {
    burgerBtn.focus();
    if (previousFocusedElement && typeof previousFocusedElement.focus === "function") {
      previousFocusedElement.focus();
    }
  }
}
burgerBtn.addEventListener("click", toggleMenu);
document.addEventListener("keydown", (event) => {
  if (mobileOverlay.classList.contains("open") && event.key === "Escape") {
    event.stopImmediatePropagation();
    toggleMenu();
    return;
  }

  if (!mobileOverlay.classList.contains("open") || event.key !== "Tab") {
    return;
  }

  const focusableItems = getFocusableMobileMenuItems();
  if (!focusableItems.length) {
    event.preventDefault();
    burgerBtn.focus();
    return;
  }

  const firstItem = focusableItems[0];
  const lastItem = focusableItems[focusableItems.length - 1];

  if (event.shiftKey && document.activeElement === firstItem) {
    event.preventDefault();
    lastItem.focus();
  } else if (!event.shiftKey && document.activeElement === lastItem) {
    event.preventDefault();
    firstItem.focus();
  }
});

// Positionnement du logo et du visuel du hero
function updateLogoPosition(force = false) {
  const isScrolled = window.scrollY > 80;
  if (!force && headerIsScrolled === isScrolled) return;
  headerIsScrolled = isScrolled;

  if (isScrolled) {
    header.classList.add("scrolled");
    header.setAttribute("aria-hidden", "false");
    header.inert = false;
    const navRect = navZone.getBoundingClientRect();
    const headerRect = header.getBoundingClientRect();
    const headerTop = Number.parseFloat(getComputedStyle(header).top) || 0;

    flyingLogo.style.position = "fixed";
    flyingLogo.style.left = navRect.left + "px";
    flyingLogo.style.top =
      navRect.top - headerRect.top + headerTop + "px";
    flyingLogo.style.width = navRect.width + "px";
    flyingLogo.style.height = navRect.height + "px";
  } else {
    header.classList.remove("scrolled");
    header.setAttribute("aria-hidden", "true");
    header.inert = true;
    const anchorRect = heroAnchor.getBoundingClientRect();

    flyingLogo.style.position = "absolute";
    flyingLogo.style.left = anchorRect.left + window.scrollX + "px";
    flyingLogo.style.top = anchorRect.top + window.scrollY + "px";
    flyingLogo.style.width = anchorRect.width + "px";
    flyingLogo.style.height = anchorRect.height + "px";
  }
}

function updateHeroVisualBounds() {
  if (window.matchMedia("(max-width: 960px)").matches) {
    heroVisual.style.removeProperty("top");
    heroVisual.style.removeProperty("bottom");
    heroVisual.style.removeProperty("height");
    updateLogoPosition(true);
    return;
  }

  const heroTop = heroSection.getBoundingClientRect().top;
  const subtitleTop = heroSubtitle.getBoundingClientRect().top;
  const editorBottom = codeEditor.getBoundingClientRect().bottom;

  heroVisual.style.top = `${subtitleTop - heroTop}px`;
  heroVisual.style.bottom = "auto";
  heroVisual.style.height = `${editorBottom - subtitleTop}px`;
  updateLogoPosition(true);
}

const heroVisualResizeObserver = new ResizeObserver(updateHeroVisualBounds);
heroVisualResizeObserver.observe(heroContent);
heroVisualResizeObserver.observe(codeEditor);
window.addEventListener("resize", updateHeroVisualBounds);
window.addEventListener("scroll", () => updateLogoPosition(), { passive: true });

let currentLineIdx = 0;
let currentCharIdx = 0;

function scheduleTerminalTyping(delay) {
  terminalAnimationTimeout = window.setTimeout(typeLineHandler, delay);
}

// Animation du terminal
function renderTerminalState(activeText) {
  let htmlStr = "";

  for (let i = 0; i < currentLineIdx; i++) {
    htmlStr += `
                <div class="terminal-row">
                    <span class="terminal-prefix-spacer"></span>
                    <span class="terminal-code-content">${linesData[i]}</span>
                </div>`;
  }

  if (currentLineIdx < linesData.length) {
    htmlStr += `
                <div class="terminal-row">
                    <span class="terminal-prefix">&gt;</span>
                    <span class="terminal-code-content">${activeText}</span><span class="cursor-underscore">_</span>
                </div>`;
  }

  terminalScreen.innerHTML = htmlStr;
}

function typeLineHandler() {
  if (currentLineIdx < linesData.length) {
    let currentLineStr = linesData[currentLineIdx];
    if (currentCharIdx <= currentLineStr.length) {
      let textSegment = currentLineStr.substring(0, currentCharIdx);
      renderTerminalState(textSegment);
      currentCharIdx++;
      scheduleTerminalTyping(45);
    } else {
      currentLineIdx++;
      currentCharIdx = 0;
      scheduleTerminalTyping(200);
    }
  } else {
    let htmlStr = "";
    for (let i = 0; i < linesData.length; i++) {
      if (i === linesData.length - 1) {
        htmlStr += `
                        <div class="terminal-row">
                            <span class="terminal-prefix-spacer"></span>
                            <span class="terminal-code-content">${linesData[i]}</span><span class="cursor-underscore">_</span>
                        </div>`;
      } else {
        htmlStr += `
                        <div class="terminal-row">
                            <span class="terminal-prefix-spacer"></span>
                            <span class="terminal-code-content">${linesData[i]}</span>
                        </div>`;
      }
    }
    terminalScreen.innerHTML = htmlStr;
  }
}

document.addEventListener("site-language-changed", () => {
  linesData = fallbackTerminalLines.map((fallback, index) => {
    const key = `terminal.line.${index}`;
    const translation = typeof t === "function" ? t(key) : key;
    return translation === key ? fallback : translation;
  });
  currentLineIdx = 0;
  currentCharIdx = 0;
  window.clearTimeout(terminalAnimationTimeout);

  if (terminalScreen) {
    renderTerminalState("");
    scheduleTerminalTyping(0);
  }
});

// Projets : démonstrations, détails et filtres
function initProfileCard() {
  const card = document.getElementById("profile-card");
  if (!card) return;

  const front = card.querySelector(".profile-front");
  const back = card.querySelector(".profile-back");
  const frontButton = front?.querySelector(".profile-flip-btn");
  const backButton = back?.querySelector(".profile-flip-btn");

  function setExpanded(isExpanded) {
    card.classList.toggle("is-flipped", isExpanded);
    card.querySelectorAll(".profile-flip-btn").forEach((button) => {
      button.setAttribute("aria-expanded", String(isExpanded));
    });

    if (front) {
      front.setAttribute("aria-hidden", String(isExpanded));
      front.inert = isExpanded;
    }
    if (back) {
      back.setAttribute("aria-hidden", String(!isExpanded));
      back.inert = !isExpanded;
    }
  }

  setExpanded(false);

  frontButton?.addEventListener("click", () => {
    setExpanded(true);
    backButton?.focus();
  });
  backButton?.addEventListener("click", () => {
    setExpanded(false);
    frontButton?.focus();
  });

  const visibilityObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) setExpanded(false);
      });
    },
    { threshold: 0.1 },
  );
  visibilityObserver.observe(card);

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      !mobileOverlay.classList.contains("open") &&
      card.classList.contains("is-flipped")
    ) {
      setExpanded(false);
      frontButton?.focus();
    }
  });
}

function initProjects() {
  const projectCards = Array.from(document.querySelectorAll(".project-card"));
  const projectGrid = document.querySelector(".projects-grid");
  const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
  const projectCounter = document.getElementById("project-counter");

  if (!projectGrid || projectCards.length === 0) return;

  if (projectCounter) {
    projectCounter.textContent = String(projectCards.length);
  }

  function setProjectCardExpanded(card, isExpanded) {
    const front = card.querySelector(".card-front");
    const back = card.querySelector(".card-back");

    card.classList.toggle("is-flipped", isExpanded);
    card.querySelectorAll(".flip-btn").forEach((button) => {
      button.setAttribute("aria-expanded", String(isExpanded));
    });

    if (front) {
      front.setAttribute("aria-hidden", String(isExpanded));
      front.inert = isExpanded;
    }
    if (back) {
      back.setAttribute("aria-hidden", String(!isExpanded));
      back.inert = !isExpanded;
    }
  }

  projectCards.forEach((card) => {
    setProjectCardExpanded(card, false);
    const mediaContainer = card.querySelector(".media-container");
    const canvas = card.querySelector(".project-canvas");
    const video = card.querySelector(".project-video");
    const cardFront = card.querySelector(".card-front");
    const cardBack = card.querySelector(".card-back");
    const flipButtons = card.querySelectorAll(".flip-btn");
    const demoType = card.dataset.demo || "bars";
    let animationId = null;
    let frame = 0;

    function renderDemoFrame() {
      const context = canvas.getContext("2d");
      frame += 0.06;
      const { width, height } = canvas;

      context.fillStyle = "#090d16";
      context.fillRect(0, 0, width, height);
      context.fillStyle = "#a3e635";
      context.font = "bold 14px monospace";
      const demoLabel =
        typeof t === "function"
          ? t("projects.canvasDemo")
          : "● DÉMO VIDÉO EN COURS";
      context.fillText(demoLabel, 24, 34);

      if (demoType === "bars") {
        const bars = 7;
        const barWidth = (width - 80 - (bars - 1) * 12) / bars;
        for (let index = 0; index < bars; index += 1) {
          const barHeight = 145 + Math.sin(frame + index * 0.8) * 65;
          const x = 40 + index * (barWidth + 12);
          const y = height - 50 - barHeight;
          context.fillStyle = index % 2 === 0 ? "#84cc16" : "#38bdf8";
          context.beginPath();
          context.roundRect(x, y, barWidth, barHeight, 6);
          context.fill();
        }
      } else if (demoType === "wave") {
        context.strokeStyle = "#84cc16";
        context.lineWidth = 3;
        context.beginPath();
        for (let x = 24; x < width - 24; x += 6) {
          const y = height / 2 + Math.sin(x * 0.03 + frame * 2) * 45;
          if (x === 24) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.stroke();
      } else {
        const offset = Math.sin(frame * 1.5) * 35;
        context.fillStyle = "#1e293b";
        context.strokeStyle = "#84cc16";
        context.lineWidth = 2;
        context.beginPath();
        context.roundRect(60 + offset, 85, 140, 70, 8);
        context.fill();
        context.stroke();
        context.beginPath();
        context.roundRect(width - 200 - offset, height - 140, 140, 70, 8);
        context.fill();
        context.stroke();
      }

      animationId = window.requestAnimationFrame(renderDemoFrame);
    }

    function startDemo() {
      mediaContainer.classList.add("is-playing");
      if (video) {
        video.play().catch((error) => {
          if (error.name !== "AbortError") {
            console.error("Impossible de lancer la vidéo du projet.", error);
          }
        });
      } else if (!animationId) {
        renderDemoFrame();
      }
    }

    function stopDemo() {
      mediaContainer.classList.remove("is-playing");
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
      if (animationId) {
        window.cancelAnimationFrame(animationId);
        animationId = null;
      }
    }

    const isTouchDevice = () =>
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window;

    mediaContainer.addEventListener("mouseenter", () => {
      if (!isTouchDevice()) startDemo();
    });
    mediaContainer.addEventListener("mousemove", () => {
      if (
        !isTouchDevice() &&
        !mediaContainer.classList.contains("is-playing")
      ) {
        startDemo();
      }
    });
    mediaContainer.addEventListener("mouseleave", () => {
      if (!isTouchDevice()) stopDemo();
    });
    mediaContainer.addEventListener("click", (event) => {
      if (!isTouchDevice()) return;
      event.stopPropagation();
      projectGrid
        .querySelectorAll(".media-container.is-playing")
        .forEach((otherMedia) => {
          if (otherMedia !== mediaContainer) {
            otherMedia.dispatchEvent(new Event("force-stop"));
          }
        });
      if (!mediaContainer.classList.contains("is-playing")) startDemo();
    });
    mediaContainer.addEventListener("force-stop", stopDemo);
    card.addEventListener("force-stop-demo", stopDemo);

    flipButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const shouldFlip = !card.classList.contains("is-flipped");
        projectGrid
          .querySelectorAll(".project-card.is-flipped")
          .forEach((openCard) => {
            setProjectCardExpanded(openCard, false);
          });
        if (shouldFlip) {
          setProjectCardExpanded(card, true);
          stopDemo();
          cardBack?.querySelector(".flip-btn")?.focus();
        } else {
          setProjectCardExpanded(card, false);
          cardFront?.querySelector(".flip-btn")?.focus();
        }
      });
    });

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            stopDemo();
            setProjectCardExpanded(card, false);
          }
        });
      },
      { threshold: 0.1 },
    );
    visibilityObserver.observe(card);
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((filterButton) => {
        const isActive = filterButton === button;
        filterButton.classList.toggle("active", isActive);
        filterButton.setAttribute("aria-pressed", String(isActive));
      });

      const selectedFilter = button.dataset.filter;
      projectGrid.classList.toggle("is-filtered", selectedFilter !== "all");
      projectCards.forEach((card) => {
        const shouldShow =
          selectedFilter === "all" || card.dataset.category === selectedFilter;
        card.classList.toggle("is-hidden", !shouldShow);
        if (!shouldShow) {
          setProjectCardExpanded(card, false);
          card.dispatchEvent(new Event("force-stop-demo"));
        }
      });
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || mobileOverlay.classList.contains("open")) {
      return;
    }

    projectGrid
      .querySelectorAll(".project-card.is-flipped")
      .forEach((card) => {
        setProjectCardExpanded(card, false);
        card.querySelector(".card-front .flip-btn")?.focus();
      });
  });

  document.addEventListener("click", (event) => {
    if (
      !(event.target instanceof Element) ||
      event.target.closest(".media-container")
    )
      return;
    projectGrid
      .querySelectorAll(".media-container.is-playing")
      .forEach((media) => {
        media.dispatchEvent(new Event("force-stop"));
      });
  });
}

// Initialisation de la page
document.addEventListener("DOMContentLoaded", () => {
  updateExperienceCounter();
  initStatBoxGlow();
  updateHeroVisualBounds();
  initProfileCard();
  initProjects();
  animateStatCounters();
  setTimeout(() => updateLogoPosition(true), 120);
  scheduleTerminalTyping(600);
});
