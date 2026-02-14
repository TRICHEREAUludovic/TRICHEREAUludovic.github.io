// ==== Menu Mobile Toggle ====
const toggleButton = document.getElementById("toggle-button");
const nav = document.querySelector("header nav");

if (toggleButton && nav) {
  const navLinks = document.querySelectorAll("header nav a");
  const navButtons = document.querySelectorAll("header nav button");

  function openNav() {
    nav.classList.add("active");
    toggleButton.setAttribute("aria-expanded", "true");
    // focus first link for keyboard users
    const firstLink = nav.querySelector("a");
    if (firstLink) firstLink.focus();
  }

  function closeNav() {
    nav.classList.remove("active");
    toggleButton.setAttribute("aria-expanded", "false");
    toggleButton.focus();
  }

  toggleButton.addEventListener("click", () => {
    if (nav.classList.contains("active")) closeNav();
    else openNav();
  });

  // Fermer le menu au clic sur un lien
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeNav();
    });
  });

  // Fermer le menu au clic sur les boutons du menu (language-toggle, dark-mode-toggle)
  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      closeNav();
    });
  });

  // Fermer le menu au press ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("active")) {
      closeNav();
    }
  });
}

// ==== Dark Mode Toggle ====
const darkModeToggle = document.getElementById("dark-mode-toggle");
const body = document.body;

// Fonction pour mettre à jour le header selon le mode et le scroll
function updateHeaderBackground() {
  const header = document.querySelector("header");
  const isDarkMode = body.classList.contains("dark-mode");

  if (window.scrollY > 50) {
    if (isDarkMode) {
      header.style.background = "rgba(22, 33, 62, 0.98)";
      header.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.3)";
    } else {
      header.style.background = "rgba(255, 255, 255, 0.98)";
      header.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)";
    }
  } else {
    if (isDarkMode) {
      header.style.background = "rgba(22, 33, 62, 0.95)";
      header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.3)";
    } else {
      header.style.background = "rgba(255, 255, 255, 0.95)";
      header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
    }
  }
}

// Vérifier la préférence sauvegardée
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  body.classList.add("dark-mode");
}

// Appliquer le style du header au chargement
updateHeaderBackground();

// Toggle dark mode
if (darkModeToggle) {
  function setDarkMode(on) {
    if (on) {
      body.classList.add("dark-mode");
      darkModeToggle.setAttribute("aria-pressed", "true");
      localStorage.setItem("theme", "dark");
      // Dark mode enabled: background image referenced by CSS (no programmatic preload)
    } else {
      body.classList.remove("dark-mode");
      darkModeToggle.setAttribute("aria-pressed", "false");
      localStorage.setItem("theme", "light");
    }
    updateHeaderBackground();
  }

  darkModeToggle.addEventListener("click", () => {
    setDarkMode(!body.classList.contains("dark-mode"));

    // Si le menu mobile est ouvert, le fermer lorsque l'utilisateur active/désactive le mode sombre
    if (nav && nav.classList.contains("active")) {
      nav.classList.remove("active");
      if (toggleButton) toggleButton.setAttribute("aria-expanded", "false");
      // Remettre le focus sur le bouton burger pour l'accessibilité
      if (toggleButton) toggleButton.focus();
    }
  });

  // Initial state attribute
  darkModeToggle.setAttribute(
    "aria-pressed",
    body.classList.contains("dark-mode") ? "true" : "false",
  );
}

// ==== Smooth Scroll ====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const href = this.getAttribute("href");
    if (href !== "#") {
      const target = document.querySelector(href);
      if (target) {
        const header = document.querySelector("header");
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition =
          target.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
        // After navigation, close mobile nav if open
        if (nav && nav.classList.contains("active")) {
          nav.classList.remove("active");
          if (toggleButton) toggleButton.setAttribute("aria-expanded", "false");
        }
      }
    }
  });
});

// ==== Animation Skill Items au Scroll (Alterné) ====
const skillsSection = document.querySelector(".skills-section");
if (skillsSection) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Animer les skill items avec délai alterné
          const skillCategories =
            entry.target.querySelectorAll(".skill-category");
          skillCategories.forEach((category, categoryIndex) => {
            const skillItems = category.querySelectorAll(".skill-item");
            skillItems.forEach((item, itemIndex) => {
              setTimeout(() => {
                item.classList.add("animate");
              }, itemIndex * 100); // Délai entre chaque item
            });
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 },
  );

  observer.observe(skillsSection);
}

// ==== Gestion Formulaire ====
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  const statusEl = document.getElementById("form-status");
  // Honeypot
  const honeypot = contactForm.querySelector('input[name="website"]');

  // Délai anti-bot : stocke le timestamp d'affichage du formulaire
  let formDisplayTime = Date.now();
  // Réinitialise le timer à chaque affichage (ex: navigation SPA)
  contactForm.addEventListener("focusin", function once() {
    formDisplayTime = Date.now();
    contactForm.removeEventListener("focusin", once);
  });
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Vérification honeypot
    if (honeypot && honeypot.value) {
      if (statusEl) {
        statusEl.textContent = "Erreur de validation.";
        statusEl.classList.remove("visually-hidden");
        statusEl.style.opacity = "1";
        statusEl.style.transition = "opacity 0.7s";
        setTimeout(() => {
          statusEl.style.opacity = "0";
          setTimeout(() => {
            statusEl.textContent = "";
            statusEl.classList.add("visually-hidden");
            statusEl.style.opacity = "";
            statusEl.style.transition = "";
          }, 700);
        }, 1800);
      }
      return;
    }

    // Délai anti-bot : empêche la soumission avant 2 secondes
    const now = Date.now();
    if (now - formDisplayTime < 2000) {
      if (statusEl) {
        statusEl.textContent = "Merci d'attendre 2 secondes avant d'envoyer.";
        statusEl.classList.remove("visually-hidden");
        statusEl.style.opacity = "1";
        statusEl.style.transition = "opacity 0.7s";
        setTimeout(() => {
          statusEl.style.opacity = "0";
          setTimeout(() => {
            statusEl.textContent = "";
            statusEl.classList.add("visually-hidden");
            statusEl.style.opacity = "";
            statusEl.style.transition = "";
          }, 700);
        }, 1800);
      }
      return;
    }

    // Validation des données (sécurité côté client)
    const name = contactForm.querySelector('input[name="name"]');
    const email = contactForm.querySelector('input[name="email"]');
    const subject = contactForm.querySelector('input[name="subject"]');
    const message = contactForm.querySelector('textarea[name="message"]');

    // Regex email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.value.trim() || name.value.length < 2) {
      showStatus("Nom invalide.");
      return;
    }
    if (!email.value.trim() || !emailRegex.test(email.value)) {
      showStatus("Email invalide.");
      return;
    }
    if (!subject.value.trim() || subject.value.length < 2) {
      showStatus("Sujet invalide.");
      return;
    }
    if (!message.value.trim() || message.value.length < 5) {
      showStatus("Message trop court.");
      return;
    }

    // Fonction utilitaire pour afficher les erreurs
    function showStatus(msg) {
      if (statusEl) {
        statusEl.textContent = msg;
        statusEl.classList.remove("visually-hidden");
        statusEl.style.opacity = "1";
        statusEl.style.transition = "opacity 0.7s";
        setTimeout(() => {
          statusEl.style.opacity = "0";
          setTimeout(() => {
            statusEl.textContent = "";
            statusEl.classList.add("visually-hidden");
            statusEl.style.opacity = "";
            statusEl.style.transition = "";
          }, 700);
        }, 1800);
      }
    }
    // Ici on fait un envoi asynchrone classique (sans reCAPTCHA)
    if (statusEl) {
      statusEl.textContent = "Envoi en cours...";
      statusEl.classList.remove("visually-hidden");
    }

    const formData = new FormData(contactForm);
    try {
      const response = await fetch("https://formspree.io/f/mkonbwlv", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      if (response.ok) {
        if (statusEl) {
          statusEl.textContent = "Message envoyé. Merci !";
          statusEl.style.opacity = "1";
          statusEl.style.transition = "opacity 0.7s";
          setTimeout(() => {
            statusEl.style.opacity = "0";
            setTimeout(() => {
              statusEl.textContent = "";
              statusEl.classList.add("visually-hidden");
              statusEl.style.opacity = "";
              statusEl.style.transition = "";
            }, 700);
          }, 1800);
        }
        contactForm.reset();
      } else {
        if (statusEl) {
          statusEl.textContent = "Une erreur est survenue. Veuillez réessayer.";
          statusEl.style.opacity = "1";
          statusEl.style.transition = "opacity 0.7s";
          setTimeout(() => {
            statusEl.style.opacity = "0";
            setTimeout(() => {
              statusEl.textContent = "";
              statusEl.classList.add("visually-hidden");
              statusEl.style.opacity = "";
              statusEl.style.transition = "";
            }, 700);
          }, 1800);
        }
        contactForm.reset();
      }
    } catch (error) {
      if (statusEl) {
        statusEl.textContent = "Erreur reseau. Veuillez réessayer.";
        statusEl.style.opacity = "1";
        statusEl.style.transition = "opacity 0.7s";
        setTimeout(() => {
          statusEl.style.opacity = "0";
          setTimeout(() => {
            statusEl.textContent = "";
            statusEl.classList.add("visually-hidden");
            statusEl.style.opacity = "";
            statusEl.style.transition = "";
          }, 700);
        }, 1800);
      }
      contactForm.reset();
    }
  });
}

// ==== Scroll Header Background ====
window.addEventListener("scroll", () => {
  updateHeaderBackground();
});

// ==== Bouton Retour en Haut ====
const scrollToTopBtn = document.getElementById("scroll-to-top");
const homeSection = document.querySelector(".home");

if (scrollToTopBtn && homeSection) {
  // Afficher/masquer le bouton après la section home
  window.addEventListener("scroll", () => {
    const homeSectionHeight = homeSection.offsetHeight;

    if (window.scrollY > homeSectionHeight) {
      scrollToTopBtn.classList.add("visible");
    } else {
      scrollToTopBtn.classList.remove("visible");
    }
  });

  // Clic pour remonter en haut
  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// ==== Modal Formulaire de Contact ====
const openContactFormBtn = document.getElementById("open-contact-form");
const closeContactFormBtn = document.getElementById("close-contact-form");
const contactFormModal = document.getElementById("contact-form-modal");
const modalOverlay = document.getElementById("modal-overlay");

if (openContactFormBtn && closeContactFormBtn && contactFormModal) {
  // Ouvrir la modal
  openContactFormBtn.addEventListener("click", () => {
    contactFormModal.classList.add("active");
    contactFormModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // Empêcher le scroll du body

    // Focus sur le premier champ du formulaire pour l'accessibilité
    const firstInput = contactFormModal.querySelector("input[type='text']");
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  });

  // Fermer la modal
  function closeModal() {
    contactFormModal.classList.remove("active");
    contactFormModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = ""; // Rétablir le scroll du body
    openContactFormBtn.focus(); // Remettre le focus sur le bouton pour l'accessibilité
  }

  closeContactFormBtn.addEventListener("click", closeModal);

  // Fermer en cliquant sur l'overlay
  modalOverlay.addEventListener("click", closeModal);

  // Fermer avec la touche Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && contactFormModal.classList.contains("active")) {
      closeModal();
    }
  });
}

// ==== Slider de Projets ====
const projectsSlider = document.querySelector(".projects-slider");
const projectsGrid = document.querySelector(".projects-grid");
const sliderBtnPrev = document.querySelector(".slider-btn-prev");
const sliderBtnNext = document.querySelector(".slider-btn-next");
const sliderDotsContainer = document.querySelector(".slider-dots");

if (projectsSlider && projectsGrid && sliderBtnPrev && sliderBtnNext) {
  const projectCards = document.querySelectorAll(".project-card");
  let currentIndex = 0;
  let cardsPerView = 1;
  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID = 0;

  // Fonction pour déterminer le nombre de cartes visibles
  function updateCardsPerView() {
    const width = window.innerWidth;
    if (width >= 1200) {
      cardsPerView = 3;
    } else if (width >= 768) {
      cardsPerView = 2;
    } else {
      cardsPerView = 1;
    }
  }

  // Créer les dots de navigation
  function createDots() {
    if (!sliderDotsContainer) return;
    sliderDotsContainer.innerHTML = "";

    // Nombre de positions possibles = nombre total - nombre visible + 1
    const totalDots = projectCards.length - cardsPerView + 1;

    // Masquer les dots si tous les projets sont visibles
    if (projectCards.length <= cardsPerView) {
      sliderDotsContainer.style.display = "none";
      return;
    } else {
      sliderDotsContainer.style.display = "flex";
    }

    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement("button");
      dot.classList.add("slider-dot");
      dot.setAttribute("aria-label", `Aller à la position ${i + 1}`);
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => goToSlide(i));
      sliderDotsContainer.appendChild(dot);
    }
  }

  // Mettre à jour les dots actifs
  function updateDots() {
    const dots = document.querySelectorAll(".slider-dot");
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  }

  // Calculer la position du slide
  function getPositionX() {
    if (!projectCards || projectCards.length === 0) return 0;

    const cardWidth = projectCards[0].offsetWidth;
    const gap = 32; // 2rem en pixels

    // Calcul pour déplacer d'UN article à la fois
    // currentIndex = 0 : affiche cartes 0,1,2
    // currentIndex = 1 : affiche cartes 1,2,3
    // currentIndex = 2 : affiche cartes 2,3,4
    const moveDistance = cardWidth + gap;

    return -(currentIndex * moveDistance);
  }

  // Aller à un slide spécifique
  function goToSlide(index) {
    // Avec défilement d'un article à la fois :
    // maxIndex = nombre total de cartes - nombre de cartes visibles
    const maxIndex = projectCards.length - cardsPerView;
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    console.log(
      "goToSlide - Nouvel index:",
      currentIndex,
      "Max:",
      maxIndex,
      "Total cartes:",
      projectCards.length,
      "Cartes visibles:",
      cardsPerView,
    );
    setSliderPosition();
    updateDots();
    updateButtons();
  }

  // Définir la position du slider
  function setSliderPosition() {
    projectsGrid.style.transform = `translateX(${getPositionX()}px)`;
  }

  // Mettre à jour l'état des boutons
  function updateButtons() {
    const maxIndex = projectCards.length - cardsPerView;
    sliderBtnPrev.disabled = currentIndex === 0;
    sliderBtnNext.disabled = currentIndex >= maxIndex;

    // Masquer les boutons si tous les projets sont visibles
    if (projectCards.length <= cardsPerView) {
      sliderBtnPrev.style.display = "none";
      sliderBtnNext.style.display = "none";
    } else {
      sliderBtnPrev.style.display = "flex";
      sliderBtnNext.style.display = "flex";
    }
  }

  // Navigation précédent
  sliderBtnPrev.addEventListener("click", () => {
    console.log("Clic précédent - Index actuel:", currentIndex);
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  });

  // Navigation suivant
  sliderBtnNext.addEventListener("click", () => {
    const maxIndex = projectCards.length - cardsPerView;
    console.log("Clic suivant - Index actuel:", currentIndex, "Max:", maxIndex);
    if (currentIndex < maxIndex) {
      goToSlide(currentIndex + 1);
    }
  });

  // Support tactile pour mobile
  projectsSlider.addEventListener("touchstart", touchStart);
  projectsSlider.addEventListener("touchend", touchEnd);
  projectsSlider.addEventListener("touchmove", touchMove);

  // Support souris pour desktop
  projectsSlider.addEventListener("mousedown", touchStart);
  projectsSlider.addEventListener("mouseup", touchEnd);
  projectsSlider.addEventListener("mouseleave", touchEnd);
  projectsSlider.addEventListener("mousemove", touchMove);

  function touchStart(event) {
    isDragging = true;
    startPos = getEventPositionX(event);
    animationID = requestAnimationFrame(animation);
    projectsSlider.style.cursor = "grabbing";
  }

  function touchEnd() {
    isDragging = false;
    cancelAnimationFrame(animationID);

    const movedBy = currentTranslate - prevTranslate;
    const maxIndex = projectCards.length - cardsPerView;

    if (movedBy < -100 && currentIndex < maxIndex) {
      goToSlide(currentIndex + 1);
    } else if (movedBy > 100 && currentIndex > 0) {
      goToSlide(currentIndex - 1);
    } else {
      goToSlide(currentIndex);
    }

    projectsSlider.style.cursor = "grab";
  }

  function touchMove(event) {
    if (isDragging) {
      const currentPosition = getEventPositionX(event);
      currentTranslate = prevTranslate + currentPosition - startPos;
    }
  }

  function getEventPositionX(event) {
    return event.type.includes("mouse")
      ? event.pageX
      : event.touches[0].clientX;
  }

  function animation() {
    setSliderPosition();
    if (isDragging) requestAnimationFrame(animation);
  }

  // Navigation au clavier
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      sliderBtnPrev.click();
    } else if (e.key === "ArrowRight") {
      sliderBtnNext.click();
    }
  });

  // Initialisation et gestion du redimensionnement
  function initSlider() {
    updateCardsPerView();
    createDots();
    currentIndex = 0;
    setSliderPosition();
    updateButtons();
    updateDots();
  }

  // Auto-play optionnel (commenté par défaut)
  /*
  let autoplayInterval;
  function startAutoplay() {
    autoplayInterval = setInterval(() => {
      const maxIndex = Math.ceil(projectCards.length / cardsPerView) - 1;
      if (currentIndex < maxIndex) {
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(0);
      }
    }, 5000); // Change toutes les 5 secondes
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  // Démarrer l'autoplay
  startAutoplay();

  // Arrêter l'autoplay au survol
  projectsSlider.addEventListener("mouseenter", stopAutoplay);
  projectsSlider.addEventListener("mouseleave", startAutoplay);
  */

  // Initialiser le slider
  initSlider();

  // Réinitialiser lors du redimensionnement
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      initSlider();
    }, 250);
  });
}

// ==== Effet d'ondulation qui suit la souris sur la carte startup ====
const startupCard = document.querySelector(".startup-card");

if (startupCard) {
  startupCard.addEventListener("mousemove", (e) => {
    const rect = startupCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Positionner l'ondulation à la position de la souris
    startupCard.style.setProperty("--mouse-x", `${x}px`);
    startupCard.style.setProperty("--mouse-y", `${y}px`);
  });

  startupCard.addEventListener("mouseleave", () => {
    // Réinitialiser la position au centre quand la souris quitte
    const rect = startupCard.getBoundingClientRect();
    startupCard.style.setProperty("--mouse-x", `${rect.width / 2}px`);
    startupCard.style.setProperty("--mouse-y", `${rect.height / 2}px`);
  });
}

// === Easter Egg Matrix sur la hero-image (effet terminal avant Matrix, sans DevN'Dumber dans la pluie) ===
(function () {
  const heroImageDiv = document.querySelector(".hero-image");
  const heroPicture = heroImageDiv
    ? heroImageDiv.querySelector("picture")
    : null;
  const heroImg = heroPicture ? heroPicture.querySelector("img") : null;
  let clickCount = 0;
  let matrixActive = false;
  let matrixCanvas, matrixCtx, animationId;
  let matrixFrame = 0;
  let terminalDiv, typingInterval;

  function showTerminalAndStartMatrix() {
    // Créer le terminal
    terminalDiv = document.createElement("div");
    terminalDiv.id = "matrix-terminal-easter-egg";
    terminalDiv.style.position = "fixed";
    terminalDiv.style.top = "50%";
    terminalDiv.style.left = "50%";
    terminalDiv.style.transform = "translate(-50%, -50%)";
    terminalDiv.style.background = "rgba(0,0,0,0.95)";
    terminalDiv.style.color = "#00FF41";
    terminalDiv.style.font = "bold 1.3rem monospace";
    terminalDiv.style.padding = "2rem 2.5rem";
    terminalDiv.style.borderRadius = "10px";
    terminalDiv.style.zIndex = 10000;
    terminalDiv.style.boxShadow = "0 0 30px #00FF41AA";
    terminalDiv.style.letterSpacing = "1px";
    terminalDiv.style.textShadow = "0 0 8px #00FF41";
    terminalDiv.style.pointerEvents = "none";
    document.body.appendChild(terminalDiv);
    // Effet machine à écrire
    const text = "loading function (DevN'Dumber)";
    let i = 0;
    terminalDiv.textContent = "";
    typingInterval = setInterval(() => {
      terminalDiv.textContent = text.slice(0, i + 1);
      i++;
      if (i === text.length) {
        clearInterval(typingInterval);
        setTimeout(() => {
          terminalDiv.remove();
          startMatrix();
        }, 700);
      }
    }, 55);
  }

  function startMatrix() {
    if (matrixActive) return;
    matrixActive = true;
    matrixCanvas = document.createElement("canvas");
    matrixCanvas.id = "matrix-canvas-easter-egg";
    matrixCanvas.style.position = "fixed";
    matrixCanvas.style.top = 0;
    matrixCanvas.style.left = 0;
    matrixCanvas.style.width = "100vw";
    matrixCanvas.style.height = "100vh";
    matrixCanvas.style.zIndex = 9999;
    matrixCanvas.style.pointerEvents = "auto";
    matrixCanvas.style.background = "rgba(0,0,0,0.97)";
    document.body.appendChild(matrixCanvas);
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    matrixCtx = matrixCanvas.getContext("2d");
    const letters =
      "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const fontSize = 18;
    const columns = Math.floor(matrixCanvas.width / fontSize);
    const drops = Array(columns).fill(1);
    function drawMatrix() {
      matrixCtx.fillStyle = "rgba(0,0,0,0.15)";
      matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
      matrixCtx.font = fontSize + "px monospace";
      matrixCtx.fillStyle = "#00FF41";
      for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        matrixCtx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (
          drops[i] * fontSize > matrixCanvas.height &&
          Math.random() > 0.985
        ) {
          drops[i] = 0;
        }
        if (matrixFrame % 2 === 0) {
          drops[i]++;
        }
      }
      matrixFrame++;
      animationId = requestAnimationFrame(drawMatrix);
    }
    drawMatrix();
    matrixCanvas.addEventListener("click", stopMatrix);
    window.addEventListener("resize", resizeMatrix);
  }
  function stopMatrix() {
    if (!matrixActive) return;
    matrixActive = false;
    cancelAnimationFrame(animationId);
    if (matrixCanvas) {
      matrixCanvas.remove();
      matrixCanvas = null;
    }
    window.removeEventListener("resize", resizeMatrix);
    matrixFrame = 0;
  }
  function resizeMatrix() {
    if (!matrixCanvas) return;
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
  }
  function handleClick() {
    clickCount++;
    if (clickCount >= 3) {
      showTerminalAndStartMatrix();
      clickCount = 0;
    }
  }
  if (heroImageDiv) heroImageDiv.addEventListener("click", handleClick);
  if (heroPicture) heroPicture.addEventListener("click", handleClick);
  if (heroImg) heroImg.addEventListener("click", handleClick);
})();
