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

// === Easter Egg Matrix sur la hero-image (effet terminal avant Matrix, pluie 2x plus lente) ===
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
        // Incrément 2x plus lent : une ligne toutes les 4 frames
        if (matrixFrame % 4 === 0) {
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

// ==== Filtrage des Projets ====
(function () {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filterValue = btn.getAttribute("data-filter");

      // Mettre à jour les boutons actifs
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Filtrer les cartes
      projectCards.forEach((card) => {
        const cardType = card.getAttribute("data-type");

        if (filterValue === "all" || cardType === filterValue) {
          card.classList.remove("hidden");
          // Redéclencher l'animation
          card.style.animation = "none";
          setTimeout(() => {
            card.style.animation = "";
          }, 10);
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });
})();

// ==== Gestion des vidéos au hover des projets ====
(function () {
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    const video = card.querySelector(".project-video");

    if (video) {
      card.addEventListener("mouseenter", () => {
        video.play().catch(() => {
          // La vidéo n'existe pas ou n'a pas pu être chargée
          console.log("Vidéo non disponible pour ce projet");
        });
      });

      card.addEventListener("mouseleave", () => {
        video.pause();
        video.currentTime = 0;
      });

      // Support touch pour mobile
      card.addEventListener("touchstart", () => {
        video.play().catch(() => {
          console.log("Vidéo non disponible pour ce projet");
        });
      });

      card.addEventListener("touchend", () => {
        video.pause();
        video.currentTime = 0;
      });
    }
  });
})();
