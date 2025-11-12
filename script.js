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

    // Image lazy loading
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach((img) => {
      img.addEventListener("load", () => {
        img.classList.add("loaded");
      });
    });
  }, 100);
});
