// Simple Navigation Handler
class NavigationHandler {
  constructor() {
    this.sections = document.querySelectorAll(".section");
    this.init();
  }

  init() {
    // Update active nav link on scroll
    window.addEventListener("scroll", this.updateActiveNavLink.bind(this));

    // Set initial active link
    this.updateActiveNavLink();
  }

  updateActiveNavLink() {
    const scrollPosition = window.pageYOffset + window.innerHeight / 2;
    const navLinks = document.querySelectorAll(".nav-links a");

    // Find current section
    let currentSection = null;
    for (let i = 0; i < this.sections.length; i++) {
      const section = this.sections[i];
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        currentSection = section.id;
        break;
      }
    }

    // Update nav links
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (
        currentSection &&
        link.getAttribute("href") === `#${currentSection}`
      ) {
        link.classList.add("active");
      }
    });
  }
}

// Mobile Menu Toggle
class MobileMenu {
  constructor() {
    this.toggle = document.querySelector(".mobile-menu-toggle");
    this.menu = document.querySelector(".nav-menu");
    this.links = document.querySelectorAll(".nav-links a");

    this.init();
  }

  init() {
    if (!this.toggle || !this.menu) return;

    this.toggle.addEventListener("click", this.toggleMenu.bind(this));

    // Close menu when clicking on links
    this.links.forEach((link) => {
      link.addEventListener("click", this.closeMenu.bind(this));
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!this.toggle.contains(e.target) && !this.menu.contains(e.target)) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    this.toggle.classList.toggle("active");
    this.menu.classList.toggle("active");
  }

  closeMenu() {
    this.toggle.classList.remove("active");
    this.menu.classList.remove("active");
  }
}

// Smooth Navigation for Nav Links
class SmoothNavigation {
  constructor() {
    this.navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    this.init();
  }

  init() {
    this.navLinks.forEach((link) => {
      link.addEventListener("click", this.handleNavClick.bind(this));
    });
  }

  handleNavClick(e) {
    e.preventDefault();

    const targetId = e.target.getAttribute("href").substring(1);
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }
}

// Contact Form Validation
class ContactForm {
  constructor() {
    this.form = document.getElementById("contactForm");
    this.init();
  }

  init() {
    if (!this.form) return;

    this.form.addEventListener("submit", this.handleSubmit.bind(this));

    // Real-time validation
    const inputs = this.form.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      input.addEventListener("blur", () => this.validateField(input));
      input.addEventListener("input", () => this.clearError(input));
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    const isValid = this.validateForm();

    if (isValid) {
      // Simulate form submission
      const submitBtn = this.form.querySelector(".submit-btn");
      const originalText = submitBtn.textContent;

      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;

      setTimeout(() => {
        alert("Thank you for your message! We'll get back to you soon.");
        this.form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1500);
    }
  }

  validateForm() {
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const message = document.getElementById("message");

    let isValid = true;

    isValid = this.validateField(name) && isValid;
    isValid = this.validateField(email) && isValid;
    isValid = this.validateField(message) && isValid;

    return isValid;
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const errorElement = document.getElementById(`${fieldName}Error`);

    let isValid = true;
    let errorMessage = "";

    if (!value) {
      isValid = false;
      errorMessage = `${
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      } is required`;
    } else if (fieldName === "email" && !this.isValidEmail(value)) {
      isValid = false;
      errorMessage = "Please enter a valid email address";
    } else if (fieldName === "message" && value.length < 10) {
      isValid = false;
      errorMessage = "Message must be at least 10 characters long";
    }

    if (errorElement) {
      errorElement.textContent = errorMessage;
    }

    field.classList.toggle("error", !isValid);

    return isValid;
  }

  clearError(field) {
    const errorElement = document.getElementById(`${field.name}Error`);
    if (errorElement) {
      errorElement.textContent = "";
    }
    field.classList.remove("error");
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Loading Screen Controller
class LoadingScreen {
  constructor() {
    this.loadingScreen = document.getElementById("loadingScreen");
    this.init();
  }

  init() {
    // Add loading class to body
    document.body.classList.add("loading");

    // Hide loading screen after 3 seconds for elegant timing
    setTimeout(() => {
      this.hideLoadingScreen();
    }, 3000);
  }

  hideLoadingScreen() {
    // Add fade out class
    this.loadingScreen.classList.add("fade-out");

    // Remove loading class and add loaded class
    setTimeout(() => {
      document.body.classList.remove("loading");
      document.body.classList.add("loaded");

      // Remove loading screen from DOM
      setTimeout(() => {
        if (this.loadingScreen.parentNode) {
          this.loadingScreen.parentNode.removeChild(this.loadingScreen);
        }
      }, 1000);
    }, 500);
  }
}

// Letter Popup Handler
class LetterPopup {
  constructor() {
    this.letterBtn = document.getElementById("letterBtn");
    this.letterPopup = document.getElementById("letterPopup");
    this.closeBtn = document.getElementById("closeLetter");

    this.init();
  }

  init() {
    if (!this.letterBtn || !this.letterPopup) return;

    // Open letter
    this.letterBtn.addEventListener("click", this.openLetter.bind(this));

    // Close letter
    this.closeBtn.addEventListener("click", this.closeLetter.bind(this));

    // Close on outside click
    this.letterPopup.addEventListener("click", (e) => {
      if (e.target === this.letterPopup) {
        this.closeLetter();
      }
    });

    // Close on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.letterPopup.classList.contains("active")) {
        this.closeLetter();
      }
    });
  }

  openLetter() {
    this.letterPopup.classList.add("active");
    document.body.classList.add("modal-open");
    document.body.style.overflow = "hidden";
  }

  closeLetter() {
    this.letterPopup.classList.remove("active");
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "";
  }
}

// Simple Rotational Carousel Handler
class ServicesCarousel {
  constructor() {
    this.container = document.querySelector(".services-container");
    this.track = document.getElementById("servicesTrack");
    this.prevBtn = document.getElementById("prevService");
    this.nextBtn = document.getElementById("nextService");

    this.serviceCards = document.querySelectorAll(".service-card");

    this.currentSlide = 0;
    this.totalSlides = this.serviceCards.length;
    this.autoRotateInterval = null;

    this.init();
  }

  init() {
    if (!this.track || this.totalSlides === 0) return;

    this.setupEventListeners();
    this.updateCarousel();
    this.startAutoRotate();
  }

  setupEventListeners() {
    this.prevBtn.addEventListener("click", () => {
      this.prevSlide();
      this.resetAutoRotate();
    });

    this.nextBtn.addEventListener("click", () => {
      this.nextSlide();
      this.resetAutoRotate();
    });

    // Pause auto-rotate on hover
    this.container.addEventListener("mouseenter", () => {
      this.pauseAutoRotate();
    });

    this.container.addEventListener("mouseleave", () => {
      this.startAutoRotate();
    });
  }

  prevSlide() {
    this.currentSlide =
      this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
    this.updateCarousel();
  }

  nextSlide() {
    this.currentSlide =
      this.currentSlide === this.totalSlides - 1 ? 0 : this.currentSlide + 1;
    this.updateCarousel();
  }

  goToSlide(index) {
    this.currentSlide = index;
    this.updateCarousel();
  }

  updateCarousel() {
    // Calculate previous and next indices
    const prevIndex =
      this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
    const nextIndex =
      this.currentSlide === this.totalSlides - 1 ? 0 : this.currentSlide + 1;

    // Update card positions and states
    this.serviceCards.forEach((card, index) => {
      // Remove all classes first
      card.classList.remove("active", "prev", "next");

      if (index === this.currentSlide) {
        card.classList.add("active");
      } else if (index === prevIndex) {
        card.classList.add("prev");
      } else if (index === nextIndex) {
        card.classList.add("next");
      }
    });
  }

  startAutoRotate() {
    this.autoRotateInterval = setInterval(() => {
      this.nextSlide();
    }, 4000); // Auto-rotate every 4 seconds
  }

  pauseAutoRotate() {
    if (this.autoRotateInterval) {
      clearInterval(this.autoRotateInterval);
    }
  }

  resetAutoRotate() {
    this.pauseAutoRotate();
    this.startAutoRotate();
  }
}

// Scroll Animation Handler
class ScrollAnimations {
  constructor() {
    this.animatedElements = document.querySelectorAll(
      ".scroll-animate, .scroll-animate-stagger"
    );
    this.init();
  }

  init() {
    // Create intersection observer
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    // Observe all elements
    this.animatedElements.forEach((element) => {
      this.observer.observe(element);
    });
  }
}

// Festival Theme System
class FestivalTheme {
  constructor() {
    this.container = document.getElementById("festivalParticles");
    this.theme = document.body.getAttribute("data-festival") || "none";
    this.particles = [];
    this.maxParticles = 25;
    this.init();
  }

  init() {
    if (this.theme === "none" || !this.container) return;

    // Start generating particles based on theme
    switch (this.theme) {
      case "christmas":
        this.startChristmasTheme();
        break;
      case "diwali":
        this.startDiwaliTheme();
        break;
      case "newyear":
        this.startNewYearTheme();
        break;
    }
  }

  startChristmasTheme() {
    // Create snowflakes only
    const christmasSymbols = ["❄", "❅", "❆"];

    // Initial batch - reduced for slower effect
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        this.createChristmasParticle(christmasSymbols);
      }, i * 400);
    }

    // Continuous generation - slower interval
    setInterval(() => {
      if (this.particles.length < this.maxParticles) {
        this.createChristmasParticle(christmasSymbols);
      }
    }, 2000);
  }

  createChristmasParticle(christmasSymbols) {
    const particle = document.createElement("div");
    particle.className = "festival-particle";
    particle.textContent =
      christmasSymbols[Math.floor(Math.random() * christmasSymbols.length)];

    // Random position
    particle.style.left = Math.random() * 100 + "%";

    // Random size
    const size = 18 + Math.random() * 14;
    particle.style.fontSize = size + "px";

    // Random animation duration (slower = more elegant)
    const duration = 10 + Math.random() * 15;
    particle.style.animationDuration = duration + "s";

    // Random delay
    particle.style.animationDelay = Math.random() * 2 + "s";

    this.container.appendChild(particle);
    this.particles.push(particle);

    // Remove after animation
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
        this.particles = this.particles.filter((p) => p !== particle);
      }
    }, (duration + 2) * 1000);
  }

  startDiwaliTheme() {
    // Create diyas and sparkles
    const diwaliSymbols = ["🪔", "✨", "🎆", "💫", "⭐"];

    // Initial batch
    for (let i = 0; i < 25; i++) {
      setTimeout(() => {
        this.createDiwaliParticle(diwaliSymbols);
      }, i * 250);
    }

    // Continuous generation
    setInterval(() => {
      if (this.particles.length < this.maxParticles) {
        this.createDiwaliParticle(diwaliSymbols);
      }
    }, 1000);
  }

  createDiwaliParticle(symbols) {
    const particle = document.createElement("div");
    particle.className = "festival-particle";
    particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    // Random position
    particle.style.left = Math.random() * 100 + "%";

    // Random size
    const size = 18 + Math.random() * 12;
    particle.style.fontSize = size + "px";

    // Random animation duration
    const duration = 8 + Math.random() * 10;
    particle.style.animationDuration = duration + "s";

    // Random delay
    particle.style.animationDelay = Math.random() * 2 + "s";

    this.container.appendChild(particle);
    this.particles.push(particle);

    // Remove after animation
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
        this.particles = this.particles.filter((p) => p !== particle);
      }
    }, (duration + 2) * 1000);
  }

  startNewYearTheme() {
    // Create firework bursts and celebration symbols
    const fireworkSymbols = [
      "🎆",
      "🎇",
      "✨",
      "�",
      "⭐,",
      "🌟",
      "🎉",
      "🎊",
      "🥳",
      "🍾",
    ];

    // Create bursts every 2 seconds
    setInterval(() => {
      this.createFireworkBurst(fireworkSymbols);
    }, 2000);

    // Initial burst
    this.createFireworkBurst(fireworkSymbols);
  }

  createFireworkBurst(symbols) {
    // Random position for burst origin
    const originX = 20 + Math.random() * 60; // 20-80% of screen width
    const originY = 20 + Math.random() * 40; // 20-60% of screen height

    // Create multiple particles in a burst
    const particleCount = 8 + Math.floor(Math.random() * 8);

    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => {
        this.createFireworkParticle(symbols, originX, originY);
      }, i * 50);
    }
  }

  createFireworkParticle(symbols, originX, originY) {
    const particle = document.createElement("div");
    particle.className = "festival-particle";
    particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    // Set origin position
    particle.style.left = originX + "%";
    particle.style.top = originY + "%";

    // Random size
    const size = 16 + Math.random() * 12;
    particle.style.fontSize = size + "px";

    // Random burst direction
    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 150;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    particle.style.setProperty("--tx", tx + "px");
    particle.style.setProperty("--ty", ty + "px");

    // Random animation duration
    const duration = 1 + Math.random() * 1.5;
    particle.style.animationDuration = duration + "s";

    this.container.appendChild(particle);
    this.particles.push(particle);

    // Remove after animation
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
        this.particles = this.particles.filter((p) => p !== particle);
      }
    }, duration * 1000 + 100);
  }

  // Method to change theme dynamically
  changeTheme(newTheme) {
    // Clear existing particles
    this.particles.forEach((particle) => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    });
    this.particles = [];

    // Update theme
    this.theme = newTheme;
    document.body.setAttribute("data-festival", newTheme);

    // Reinitialize
    this.init();
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize loading screen first
  const loadingScreen = new LoadingScreen();

  // Initialize other components after a short delay
  setTimeout(() => {
    const navigationHandler = new NavigationHandler();
    const mobileMenu = new MobileMenu();
    const smoothNavigation = new SmoothNavigation();
    const contactForm = new ContactForm();
    const letterPopup = new LetterPopup();
    const servicesCarousel = new ServicesCarousel();
    const scrollAnimations = new ScrollAnimations();
    const festivalTheme = new FestivalTheme();

    // Image lazy loading
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach((img) => {
      img.addEventListener("load", () => {
        img.classList.add("loaded");
      });
    });

    // Make festivalTheme globally accessible for easy theme switching
    window.festivalTheme = festivalTheme;
  }, 100);
});
