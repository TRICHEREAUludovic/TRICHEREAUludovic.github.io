// ==== Menu Mobile Toggle ====
const toggleButton = document.getElementById("toggle-button");
const nav = document.querySelector("header nav");

if (toggleButton && nav) {
  const navLinks = document.querySelectorAll("header nav a");

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
      // preload dark background when dark mode is enabled
      try {
        var l = document.createElement("link");
        l.rel = "preload";
        l.as = "image";
        l.href = "Public/img/back2.webp";
        document.head.appendChild(l);
      } catch (e) {}
    } else {
      body.classList.remove("dark-mode");
      darkModeToggle.setAttribute("aria-pressed", "false");
      localStorage.setItem("theme", "light");
    }
    updateHeaderBackground();
  }

  darkModeToggle.addEventListener("click", () => {
    setDarkMode(!body.classList.contains("dark-mode"));
  });

  // Initial state attribute
  darkModeToggle.setAttribute(
    "aria-pressed",
    body.classList.contains("dark-mode") ? "true" : "false"
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
    { threshold: 0.3 }
  );

  observer.observe(skillsSection);
}

// ==== Gestion Formulaire ====
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  const statusEl = document.getElementById("form-status");
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = {
      name: contactForm.querySelector("#name").value,
      email: contactForm.querySelector("#email").value,
      subject: contactForm.querySelector("#subject").value,
      message: contactForm.querySelector("#message").value,
    };

    // Ici on simule un envoi asynchrone (à remplacer par un appel réel si nécessaire)
    if (statusEl) {
      statusEl.textContent = "Envoi en cours...";
    }

    setTimeout(() => {
      if (statusEl) {
        statusEl.textContent = "Message envoyé. Merci !";
      }
      // Remise à zéro du formulaire
      contactForm.reset();
    }, 500);
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
