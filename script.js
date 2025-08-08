// Forced Section Scrolling
class SectionScroller {
  constructor() {
    this.sections = document.querySelectorAll(".section");
    this.currentSection = 0;
    this.isScrolling = false;
    this.scrollTimeout = null;

    this.init();
  }

  init() {
    // Disable default scroll snap temporarily
    document.documentElement.style.scrollSnapType = "none";

    // Add wheel event listener for desktop
    window.addEventListener("wheel", this.handleWheel.bind(this), {
      passive: false,
    });

    // Add touch events for mobile
    this.addTouchEvents();

    // Add keyboard navigation
    window.addEventListener("keydown", this.handleKeydown.bind(this));

    // Update current section on manual scroll (for nav clicks)
    window.addEventListener("scroll", this.updateCurrentSection.bind(this));

    // Set initial section
    this.updateCurrentSection();
  }

  handleWheel(e) {
    e.preventDefault();

    if (this.isScrolling) return;

    const direction = e.deltaY > 0 ? 1 : -1;
    this.scrollToSection(this.currentSection + direction);
  }

  addTouchEvents() {
    let startY = 0;
    let startTime = 0;

    window.addEventListener(
      "touchstart",
      (e) => {
        startY = e.touches[0].clientY;
        startTime = Date.now();
      },
      { passive: true }
    );

    window.addEventListener(
      "touchend",
      (e) => {
        if (this.isScrolling) return;

        const endY = e.changedTouches[0].clientY;
        const endTime = Date.now();
        const deltaY = startY - endY;
        const deltaTime = endTime - startTime;

        // Minimum swipe distance and maximum time for swipe detection
        if (Math.abs(deltaY) > 50 && deltaTime < 500) {
          const direction = deltaY > 0 ? 1 : -1;
          this.scrollToSection(this.currentSection + direction);
        }
      },
      { passive: true }
    );
  }

  handleKeydown(e) {
    if (this.isScrolling) return;

    switch (e.key) {
      case "ArrowDown":
      case "PageDown":
        e.preventDefault();
        this.scrollToSection(this.currentSection + 1);
        break;
      case "ArrowUp":
      case "PageUp":
        e.preventDefault();
        this.scrollToSection(this.currentSection - 1);
        break;
      case "Home":
        e.preventDefault();
        this.scrollToSection(0);
        break;
      case "End":
        e.preventDefault();
        this.scrollToSection(this.sections.length - 1);
        break;
    }
  }

  scrollToSection(index) {
    // Clamp index to valid range
    index = Math.max(0, Math.min(index, this.sections.length - 1));

    if (index === this.currentSection) return;

    this.isScrolling = true;
    this.currentSection = index;

    const targetSection = this.sections[index];
    const targetPosition = targetSection.offsetTop;

    // Smooth scroll to target section
    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });

    // Update active nav link
    this.updateActiveNavLink();

    // Reset scrolling flag after animation
    setTimeout(() => {
      this.isScrolling = false;
    }, 800); // Slightly longer than CSS transition
  }

  updateCurrentSection() {
    if (this.isScrolling) return;

    const scrollPosition = window.pageYOffset + window.innerHeight / 2;

    for (let i = 0; i < this.sections.length; i++) {
      const section = this.sections[i];
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        this.currentSection = i;
        this.updateActiveNavLink();
        break;
      }
    }
  }

  updateActiveNavLink() {
    const navLinks = document.querySelectorAll(".nav-links a");
    const currentSectionId = this.sections[this.currentSection].id;

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSectionId}`) {
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
  constructor(sectionScroller) {
    this.sectionScroller = sectionScroller;
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
      const sectionIndex = Array.from(this.sectionScroller.sections).indexOf(
        targetSection
      );
      if (sectionIndex !== -1) {
        this.sectionScroller.scrollToSection(sectionIndex);
      }
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

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize loading screen first
  const loadingScreen = new LoadingScreen();

  // Initialize other components after a short delay
  setTimeout(() => {
    const sectionScroller = new SectionScroller();
    const mobileMenu = new MobileMenu();
    const smoothNavigation = new SmoothNavigation(sectionScroller);
    const contactForm = new ContactForm();

    // Image lazy loading
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach((img) => {
      img.addEventListener("load", () => {
        img.classList.add("loaded");
      });
    });
  }, 100);
});
