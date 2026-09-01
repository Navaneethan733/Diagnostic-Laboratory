/**
 * CLINICALLAB - APPLICATION LOGIC & SCROLL ANIMATIONS
 */

const heroSlides = [
  {
    title: "Clear and Insightful<br>Testing Results!",
    subtitle: "We continually leverage our medical expertise to develop top-tier testing services while investing in cutting-edge technology to revolutionize healthcare delivery."
  },
  {
    title: "Precision Diagnostics &<br>Molecular Genetics",
    subtitle: "Empowering clinicians and patients with high-throughput laboratory automation and comprehensive cellular insights."
  },
  {
    title: "Compassionate Care,<br>Accurate Answers",
    subtitle: "From routine health screenings to advanced biomarker analysis, we ensure reliable diagnostics for your peace of mind."
  }
];

let currentSlideIdx = 0;
let cartCount = 0;
let heroAutoSlideInterval = null;

document.addEventListener("DOMContentLoaded", () => {
  setupPreloader();
  setupCartEvents();
  setupScrollAnimations();
  setupScrollProgress();
  setupStickyHeader();
  setupHeroSliderAutoPlay();
  setupMobileNav();
});

// ==========================================================================
// ULTRA-AESTHETIC CLINICAL PRELOADER CONTROLLER
// ==========================================================================
function setupPreloader() {
  const preloader = document.getElementById("stacklyPreloader");
  const progressBar = document.getElementById("preloaderProgressBar");
  const numDisplay = document.getElementById("preloaderNum");
  const statusText = document.getElementById("preloaderStatusText");

  if (!preloader) return;

  const statuses = [
    { at: 20, text: "Calibrating Optical Systems" },
    { at: 45, text: "Routing Automated Specimen Tracks" },
    { at: 75, text: "Synchronizing Biomarker Database" },
    { at: 92, text: "Decrypting Clinical Profiles" },
    { at: 100, text: "Diagnostic Portal Ready" }
  ];

  let currentVal = 0;
  const targetVal = 100;
  const duration = 1200; // ms
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const progressRatio = Math.min(elapsed / duration, 1);
    
    // Ease out cubic
    const ease = 1 - Math.pow(1 - progressRatio, 3);
    currentVal = Math.floor(ease * targetVal);

    if (progressBar) progressBar.style.width = `${currentVal}%`;
    if (numDisplay) {
      numDisplay.innerText = currentVal < 10 ? `0${currentVal}` : `${currentVal}`;
    }

    if (statusText) {
      for (let s of statuses) {
        if (currentVal <= s.at) {
          if (statusText.innerText !== s.text) {
            statusText.innerText = s.text;
          }
          break;
        }
      }
    }

    if (progressRatio < 1) {
      requestAnimationFrame(step);
    } else {
      setTimeout(() => {
        preloader.classList.add("fade-out");
        setTimeout(() => {
          preloader.style.display = "none";
        }, 800);
      }, 250);
    }
  }

  requestAnimationFrame(step);

  // Safety fallback
  window.addEventListener("load", () => {
    setTimeout(() => {
      if (preloader && !preloader.classList.contains("fade-out")) {
        preloader.classList.add("fade-out");
        setTimeout(() => {
          preloader.style.display = "none";
        }, 800);
      }
    }, 1600);
  });
}

// ==========================================================================
// SCROLL PROGRESS BAR & STICKY HEADER
// ==========================================================================
function setupScrollProgress() {
  const progressBar = document.getElementById("scrollProgressBar");
  if (!progressBar) return;

  window.addEventListener("scroll", () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = `${scrolled}%`;
  }, { passive: true });
}

function setupStickyHeader() {
  const header = document.getElementById("mainHeader");
  if (!header) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }, { passive: true });
}

// ==========================================================================
// INTERSECTION OBSERVER SCROLL REVEAL ANIMATIONS & STAT COUNTERS
// ==========================================================================
function setupScrollAnimations() {
  const revealElements = document.querySelectorAll(".reveal-on-scroll, .reveal-left, .reveal-right, .reveal-scale");

  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -60px 0px",
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        
        // If this element contains stat counters, trigger animation
        const counters = entry.target.querySelectorAll(".counter-item");
        if (counters.length > 0) {
          counters.forEach(counter => animateCounter(counter));
        } else if (entry.target.classList.contains("counter-item")) {
          animateCounter(entry.target);
        }

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));
}

// Smooth Number Counter Count-Up
function animateCounter(counterEl) {
  if (counterEl.dataset.animated === "true") return;
  counterEl.dataset.animated = "true";

  const targetValue = parseFloat(counterEl.dataset.target);
  const suffix = counterEl.dataset.suffix || "";
  const duration = 1800; // ms
  const startTime = performance.now();

  function updateCount(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-out cubic formula
    const easeOutProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = targetValue * easeOutProgress;

    if (targetValue % 1 !== 0) {
      counterEl.innerText = `${currentValue.toFixed(1)}${suffix}`;
    } else {
      counterEl.innerText = `${Math.floor(currentValue)}${suffix}`;
    }

    if (progress < 1) {
      requestAnimationFrame(updateCount);
    } else {
      counterEl.innerText = `${targetValue}${suffix}`;
    }
  }

  requestAnimationFrame(updateCount);
}

// ==========================================================================
// HERO SLIDER CONTROLLER (SLIDE IMAGE ANIMATION & AUTO-CAROUSEL)
// ==========================================================================
function updateHeroSlideUi(idx) {
  currentSlideIdx = idx;

  // 1. Update Slide Background Image Animation
  const slides = document.querySelectorAll(".hero-slide");
  slides.forEach((slide, index) => {
    if (index === currentSlideIdx) {
      slide.classList.add("active");
    } else {
      slide.classList.remove("active");
    }
  });

  // 2. Update Pagination Dots
  const dots = document.querySelectorAll(".hero-dot");
  dots.forEach((dot, index) => {
    if (index === currentSlideIdx) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });

  // 3. Update Text Content with Staggered Entrance
  const slide = heroSlides[currentSlideIdx];
  const titleEl = document.querySelector(".hero-main-title");
  const subEl = document.querySelector(".hero-subtitle");

  if (titleEl && subEl) {
    titleEl.style.opacity = '0';
    subEl.style.opacity = '0';
    titleEl.style.transform = 'translateY(15px)';
    subEl.style.transform = 'translateY(15px)';
    titleEl.style.transition = 'all 0.35s ease';
    subEl.style.transition = 'all 0.35s ease';

    setTimeout(() => {
      titleEl.innerHTML = slide.title;
      subEl.innerHTML = slide.subtitle;
      titleEl.style.opacity = '1';
      subEl.style.opacity = '1';
      titleEl.style.transform = 'translateY(0)';
      subEl.style.transform = 'translateY(0)';
    }, 350);
  }
}

function slideHero(direction) {
  resetHeroAutoSlide();
  if (direction === 'next') {
    const nextIdx = (currentSlideIdx + 1) % heroSlides.length;
    updateHeroSlideUi(nextIdx);
  } else {
    const prevIdx = (currentSlideIdx - 1 + heroSlides.length) % heroSlides.length;
    updateHeroSlideUi(prevIdx);
  }
}

function goToHeroSlide(idx) {
  resetHeroAutoSlide();
  updateHeroSlideUi(idx);
}

function setupHeroSliderAutoPlay() {
  heroAutoSlideInterval = setInterval(() => {
    const nextIdx = (currentSlideIdx + 1) % heroSlides.length;
    updateHeroSlideUi(nextIdx);
  }, 5000);

  const heroWrapper = document.getElementById("heroSection");
  if (heroWrapper) {
    heroWrapper.addEventListener("mouseenter", () => {
      clearInterval(heroAutoSlideInterval);
    });
    heroWrapper.addEventListener("mouseleave", () => {
      resetHeroAutoSlide();
    });
  }
}

function resetHeroAutoSlide() {
  clearInterval(heroAutoSlideInterval);
  heroAutoSlideInterval = setInterval(() => {
    const nextIdx = (currentSlideIdx + 1) % heroSlides.length;
    updateHeroSlideUi(nextIdx);
  }, 5000);
}

// ==========================================================================
// MODAL CONTROLLERS & CART MANAGEMENT
// ==========================================================================
function openBookingModal(serviceName = "General Diagnostic Testing") {
  const modal = document.getElementById("bookingModal");
  const selectEl = document.getElementById("bookingService");
  if (selectEl && serviceName) {
    selectEl.value = serviceName;
  }
  if (modal) modal.classList.add("active");
}

function closeBookingModal() {
  const modal = document.getElementById("bookingModal");
  if (modal) modal.classList.remove("active");
}

function openRequestTestModal(serviceName = "General Testing") {
  openBookingModal(serviceName);
}

function openProviderModal() {
  showToast("Healthcare Provider Portal registration opened.");
  openBookingModal("Healthcare Provider Registration");
}

function openTestModal(serviceName) {
  openBookingModal(serviceName);
}

function handleBookingSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("bookingPatientName").value;
  const service = document.getElementById("bookingService").value;
  
  closeBookingModal();
  showToast(`Appointment confirmed for ${name} (${service})!`);
  
  cartCount++;
  updateCartBadge();
}

// Cart Drawer
function setupCartEvents() {
  const trigger = document.getElementById("cartTriggerBtn");
  if (trigger) {
    trigger.addEventListener("click", () => {
      const drawer = document.getElementById("cartDrawer");
      const overlay = document.getElementById("cartDrawerOverlay");
      if (drawer && overlay) {
        drawer.classList.add("active");
        overlay.classList.add("active");
      }
    });
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartDrawerOverlay");
  if (drawer && overlay) {
    drawer.classList.remove("active");
    overlay.classList.remove("active");
  }
}

function updateCartBadge() {
  const badge = document.getElementById("cartBadgeCount");
  if (badge) {
    badge.innerText = cartCount;
    badge.classList.add("bump");
    setTimeout(() => badge.classList.remove("bump"), 300);
  }
}

// Toast Notifications
function showToast(message) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span>✓</span> <div>${message}</div>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==========================================================================
// RESPONSIVE MOBILE NAVIGATION CONTROLLER
// ==========================================================================
function setupMobileNav() {
  const headerContainer = document.querySelector(".header-container");
  if (!headerContainer) return;

  // Ensure Mobile Toggle Button Exists in Header
  let toggleBtn = document.getElementById("mobileNavToggle");
  if (!toggleBtn) {
    toggleBtn = document.createElement("button");
    toggleBtn.id = "mobileNavToggle";
    toggleBtn.className = "mobile-nav-toggle";
    toggleBtn.setAttribute("aria-label", "Toggle Navigation Menu");
    toggleBtn.innerHTML = `
      <span class="hamburger-bar"></span>
      <span class="hamburger-bar"></span>
      <span class="hamburger-bar"></span>
    `;
    const headerRight = headerContainer.querySelector(".header-right");
    if (headerRight) {
      headerRight.appendChild(toggleBtn);
    } else {
      headerContainer.appendChild(toggleBtn);
    }
  }

  // Ensure Overlay and Drawer Exist in DOM
  let overlay = document.getElementById("mobileNavOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "mobileNavOverlay";
    overlay.className = "mobile-nav-overlay";
    document.body.appendChild(overlay);
  }

  let drawer = document.getElementById("mobileNavDrawer");
  if (!drawer) {
    const rawPath = window.location.pathname.split("/").pop() || "index.html";
    const currentPage = rawPath.toLowerCase();

    drawer = document.createElement("div");
    drawer.id = "mobileNavDrawer";
    drawer.className = "mobile-nav-drawer";
    drawer.innerHTML = `
      <div class="mobile-nav-header">
        <a href="index.html" class="logo-brand">
          <img src="images/Logo.webp" alt="STACKLY Logo" class="brand-logo-img" style="height: 32px;">
        </a>
        <button class="mobile-nav-close" id="mobileNavClose" aria-label="Close Menu">✕</button>
      </div>
      <ul class="mobile-nav-links">
        <li><a href="index.html" class="mobile-nav-link ${currentPage === '' || currentPage === 'index.html' ? 'active' : ''}">Home</a></li>
        <li><a href="services.html" class="mobile-nav-link ${currentPage === 'services.html' ? 'active' : ''}">Services</a></li>
        <li><a href="about.html" class="mobile-nav-link ${currentPage === 'about.html' ? 'active' : ''}">About Us</a></li>
        <li><a href="blog.html" class="mobile-nav-link ${currentPage === 'blog.html' ? 'active' : ''}">Blog</a></li>
        <li><a href="contact.html" class="mobile-nav-link ${currentPage === 'contact.html' ? 'active' : ''}">Contact Us</a></li>
      </ul>
      <div class="mobile-nav-footer">
        <a href="login.html" class="btn-hero-primary mobile-nav-btn">Login to Portal</a>
        <div class="mobile-nav-contact">
          24/7 Priority Helpline:<br>
          <a href="tel:+919842871840" style="color: var(--accent-cyan-btn); font-weight: 700;">+91 98428 71840</a>
        </div>
      </div>
    `;
    document.body.appendChild(drawer);
  }

  const closeBtn = document.getElementById("mobileNavClose");

  function openMobileNav() {
    if (toggleBtn) toggleBtn.classList.add("active");
    if (drawer) drawer.classList.add("active");
    if (overlay) overlay.classList.add("active");
    document.body.classList.add("mobile-nav-open");
  }

  function closeMobileNav() {
    if (toggleBtn) toggleBtn.classList.remove("active");
    if (drawer) drawer.classList.remove("active");
    if (overlay) overlay.classList.remove("active");
    document.body.classList.remove("mobile-nav-open");
  }

  function toggleMobileNav() {
    if (drawer && drawer.classList.contains("active")) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  }

  toggleBtn.addEventListener("click", toggleMobileNav);

  if (closeBtn) {
    closeBtn.addEventListener("click", closeMobileNav);
  }

  if (overlay) {
    overlay.addEventListener("click", closeMobileNav);
  }

  drawer.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMobileNav);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer && drawer.classList.contains("active")) {
      closeMobileNav();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900 && drawer && drawer.classList.contains("active")) {
      closeMobileNav();
    }
  });
}

