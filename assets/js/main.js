/**
 * Trademark Registration Agency - Interactive UI Functionality
 * Vanilla ES6 JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Core Services
  initTheme();
  initRTL();
  initStickyHeader();
  initMobileMenu();
  initTrademarkChecker();
  initPasswordToggles();
  initFormValidations();
  initScrollAnimations();
  initBackToTop();
  initPricingToggle();
  initJurisdictionTabs();
  initBrandEstimator();
});

/* ==========================================
   1. Theme Management (Light / Dark)
   ========================================== */
function initTheme() {
  const themeToggles = document.querySelectorAll('.theme-toggle-btn');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Set initial theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (systemPrefersDark.matches) {
    setTheme('dark');
  } else {
    setTheme('light');
  }

  // Add click listeners to all theme toggles on the page
  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  });

  // Watch for system preference changes
  systemPrefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  
  // Update icons on all toggle buttons
  const themeToggles = document.querySelectorAll('.theme-toggle-btn');
  themeToggles.forEach(toggle => {
    const icon = toggle.querySelector('i');
    if (icon) {
      if (theme === 'dark') {
        icon.className = 'bi bi-sun-fill';
        toggle.setAttribute('aria-label', 'Switch to Light Mode');
      } else {
        icon.className = 'bi bi-moon-fill';
        toggle.setAttribute('aria-label', 'Switch to Dark Mode');
      }
    }
  });
}

/* ==========================================
   2. RTL / LTR Direction Management
   ========================================== */
function initRTL() {
  const rtlToggles = document.querySelectorAll('.rtl-toggle-btn');
  
  // Set initial direction
  const savedDir = localStorage.getItem('direction');
  if (savedDir) {
    setDirection(savedDir);
  } else {
    setDirection('ltr');
  }

  // Add click listeners to direction toggles
  rtlToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      setDirection(newDir);
    });
  });
}

function setDirection(dir) {
  document.documentElement.setAttribute('dir', dir);
  localStorage.setItem('direction', dir);

  // Update label text or styles on toggles
  const rtlToggles = document.querySelectorAll('.rtl-toggle-btn');
  rtlToggles.forEach(toggle => {
    toggle.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    toggle.setAttribute('aria-label', dir === 'rtl' ? 'Switch to LTR direction' : 'Switch to RTL direction');
  });

  // Reload page is NOT necessary since CSS rules target [dir="rtl"] directly.
  // But adjust layout-specific items if necessary.
}

/* ==========================================
   3. Sticky Header
   ========================================== */
function initStickyHeader() {
  const header = document.querySelector('.sticky-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================
   4. Mobile Hamburger Overlay Menu
   ========================================== */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger-toggle');
  const fullscreenMenu = document.querySelector('.fullscreen-menu');
  const menuLinks = document.querySelectorAll('.fullscreen-nav a');

  if (!hamburger || !fullscreenMenu) return;

  const toggleMenu = () => {
    const isActive = hamburger.classList.toggle('active');
    fullscreenMenu.classList.toggle('active');
    document.body.style.overflow = isActive ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
  };

  hamburger.addEventListener('click', toggleMenu);

  // Close menu when a link is clicked
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (link.classList.contains('mobile-dropdown-toggle') || link.getAttribute('data-bs-toggle') === 'collapse') {
        return;
      }
      hamburger.classList.remove('active');
      fullscreenMenu.classList.remove('active');
      document.body.style.overflow = '';
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================
   5. Interactive Trademark Checker Mock
   ========================================== */
const mockDatabase = {
  registered: ['google', 'apple', 'nike', 'microsoft', 'amazon', 'cocacola', 'coca-cola', 'adidas', 'tesla', 'lexus'],
  conflicting: ['appli', 'nikex', 'microsft', 'amazn', 'teslax', 'googl', 'adidasz']
};

function initTrademarkChecker() {
  const form = document.getElementById('trademark-checker-form');
  const input = document.getElementById('trademark-search-input');
  const resultsDiv = document.getElementById('checker-results');
  
  if (!form || !input || !resultsDiv) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = input.value.trim().toLowerCase();
    
    if (!query) {
      alert('Please enter a brand name to check availability.');
      return;
    }

    // Show loading state
    const originalBtn = form.querySelector('.checker-btn');
    const originalBtnText = originalBtn.innerHTML;
    originalBtn.disabled = true;
    originalBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Checking...';

    // Simulate Network/API delay of 1.2s
    setTimeout(() => {
      originalBtn.disabled = false;
      originalBtn.innerHTML = originalBtnText;

      let status = 'available';
      let titleText = 'Brand Name Available';
      let descText = `Good news! "<strong>${input.value}</strong>" is not registered. It is highly suitable for trademark registration under the selected class.`;
      let statusClass = 'status-available';
      let iconClass = 'bi bi-check-circle-fill';
      let ctaHtml = `<a href="./pages/pricing.html" class="btn btn-premium btn-premium-primary">Secure this brand now</a>`;

      if (mockDatabase.registered.includes(query)) {
        status = 'registered';
        titleText = 'Brand Name Registered';
        descText = `Access Denied: "<strong>${input.value}</strong>" is already registered under this class by another entity. Registering this name will lead to infringement.`;
        statusClass = 'status-unavailable';
        iconClass = 'bi bi-x-circle-fill';
        ctaHtml = `<a href="./pages/contact.html" class="btn btn-premium btn-premium-secondary">Speak to an attorney</a>`;
      } else if (mockDatabase.conflicting.some(conf => query.includes(conf) || conf.includes(query))) {
        status = 'conflict';
        titleText = 'Possible Conflict Detected';
        descText = `Warning: "<strong>${input.value}</strong>" is similar to existing registered trademarks. Treading here might spark legal disputes.`;
        statusClass = 'status-warning';
        iconClass = 'bi bi-exclamation-triangle-fill';
        ctaHtml = `<a href="./pages/services.html" class="btn btn-premium btn-premium-primary">Request Deep Search Reports</a>`;
      }

      // Populate results inside window
      resultsDiv.innerHTML = `
        <div class="result-header">
          <h4 class="mb-0">Search Result for "${input.value}"</h4>
          <span class="result-status-badge ${statusClass}">
            <i class="${iconClass}"></i> ${titleText}
          </span>
        </div>
        <p class="mb-4">${descText}</p>
        <div class="d-flex flex-wrap gap-3">
          ${ctaHtml}
          <button type="button" class="btn btn-premium btn-premium-secondary" onclick="document.getElementById('checker-results').classList.remove('active')">Close</button>
        </div>
      `;

      resultsDiv.classList.add('active');
      resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 1200);
  });
}

/* ==========================================
   6. Password Visibility Toggle
   ========================================== */
function initPasswordToggles() {
  const toggleIcons = document.querySelectorAll('.password-toggle-icon');
  
  toggleIcons.forEach(icon => {
    icon.addEventListener('click', () => {
      const targetId = icon.getAttribute('data-target');
      const passwordInput = document.getElementById(targetId);
      
      if (passwordInput) {
        if (passwordInput.type === 'password') {
          passwordInput.type = 'text';
          icon.className = 'bi bi-eye-slash-fill password-toggle-icon';
        } else {
          passwordInput.type = 'password';
          icon.className = 'bi bi-eye-fill password-toggle-icon';
        }
      }
    });
  });
}

/* ==========================================
   7. Form Validations (Client-side)
   ========================================== */
function initFormValidations() {
  // Select all validateable forms
  const forms = document.querySelectorAll('.needs-validation-premium');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      let isValid = true;
      const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

      inputs.forEach(input => {
        // Reset errors
        input.classList.remove('is-invalid');
        
        let feedback = input.nextElementSibling;
        if (input.type === 'checkbox' && input.closest('.form-check')) {
          const container = input.closest('.form-check');
          if (container.nextElementSibling && container.nextElementSibling.classList.contains('invalid-feedback')) {
            feedback = container.nextElementSibling;
          }
        }
        
        if (feedback && feedback.classList.contains('invalid-feedback')) {
          feedback.remove();
        }

        // Check validation state
        if (input.type === 'checkbox' && !input.checked) {
          isValid = false;
          input.classList.add('is-invalid');
          createFeedback(input, 'You must agree to the Terms & Conditions.');
        } else if (!input.value.trim()) {
          isValid = false;
          input.classList.add('is-invalid');
          createFeedback(input, 'This field is required.');
        } else if (input.type === 'email' && !validateEmail(input.value)) {
          isValid = false;
          input.classList.add('is-invalid');
          createFeedback(input, 'Please enter a valid email address.');
        } else if (input.id === 'confirm-password') {
          const pass = document.getElementById('password');
          if (pass && input.value !== pass.value) {
            isValid = false;
            input.classList.add('is-invalid');
            createFeedback(input, 'Passwords do not match.');
          }
        } else if (input.type === 'password' && input.value.length < 6) {
          isValid = false;
          input.classList.add('is-invalid');
          createFeedback(input, 'Password must be at least 6 characters.');
        }
      });

      if (!isValid) {
        e.preventDefault();
        e.stopPropagation();
      } else {
        // Mock successful submit
        e.preventDefault();
        const successMsg = document.createElement('div');
        successMsg.className = 'alert alert-success mt-3';
        successMsg.innerHTML = 'Form submitted successfully! (Template Simulation)';
        form.appendChild(successMsg);
        form.reset();
        setTimeout(() => successMsg.remove(), 4000);
      }
    });
  });
}

function createFeedback(input, msg) {
  // Prevent duplicate feedback
  if (input.nextElementSibling && input.nextElementSibling.classList.contains('invalid-feedback')) return;

  const div = document.createElement('div');
  div.className = 'invalid-feedback';
  div.innerText = msg;
  
  if (input.type === 'checkbox' && input.closest('.form-check')) {
    const container = input.closest('.form-check');
    if (container.nextElementSibling && container.nextElementSibling.classList.contains('invalid-feedback')) return;
    container.parentNode.insertBefore(div, container.nextSibling);
  } else if (input.classList.contains('form-control-premium') && input.parentElement.classList.contains('auth-input-wrapper')) {
    input.parentElement.appendChild(div);
  } else {
    input.parentNode.insertBefore(div, input.nextSibling);
  }
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/* ==========================================
   8. Scroll Reveal Animations (Intersection Observer)
   ========================================== */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.reveal-fade');
  if (animatedElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => {
    // Add base class
    el.style.opacity = '0';
    observer.observe(el);
  });
}

/* ==========================================
   9. Back to Top Button
   ========================================== */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================
   10. Pricing Page Monthly/Annual Plan Switch
   ========================================== */
function initPricingToggle() {
  const toggle = document.getElementById('pricing-plan-toggle');
  if (!toggle) return;

  const monthlyPrices = { starter: 299, pro: 599, enterprise: 999 };
  const annualPrices = { starter: 249, pro: 499, enterprise: 849 };

  toggle.addEventListener('change', (e) => {
    const isAnnual = e.target.checked;
    
    document.querySelectorAll('.pricing-card').forEach(card => {
      const tier = card.getAttribute('data-pricing-tier');
      const amountSpan = card.querySelector('.price-amount');
      const periodSpan = card.querySelector('.price-period');
      
      if (!tier || !amountSpan) return;

      const price = isAnnual ? annualPrices[tier] : monthlyPrices[tier];
      
      // Animate amount replacement
      amountSpan.style.opacity = '0';
      setTimeout(() => {
        amountSpan.textContent = price;
        periodSpan.textContent = isAnnual ? '/month, billed annually' : '/month';
        amountSpan.style.opacity = '1';
      }, 150);
    });
  });
}

/* ==========================================
   11. Global Coverage Registry Tabs
   ========================================== */
const jurisdictionData = {
  us: {
    registry: "USPTO (United States Patent and Trademark Office)",
    speed: "8-10 Months",
    success: "94.2%",
    cost: "$250 per Nice class (USPTO government filing fee)",
    status: "Direct API Integration Active"
  },
  eu: {
    registry: "EUIPO (European Union Intellectual Property Office)",
    speed: "4-5 Months",
    success: "96.8%",
    cost: "€850 base fee (covers 1st class; additional fees apply)",
    status: "Direct API Integration Active"
  },
  uk: {
    registry: "UKIPO (United Kingdom Intellectual Property Office)",
    speed: "3-4 Months",
    success: "98.1%",
    cost: "£170 base fee (covers 1st class; +£50 per extra class)",
    status: "Direct API Integration Active"
  },
  ap: {
    registry: "WIPO / Madrid Protocol (Asia-Pacific Registries)",
    speed: "12-18 Months",
    success: "89.5%",
    cost: "Varies by jurisdiction and WIPO basic fees",
    status: "Madrid System Gateway Active"
  }
};

function initJurisdictionTabs() {
  const tabButtons = document.querySelectorAll('.jurisdiction-tab-btn');
  if (tabButtons.length === 0) return;

  const registryText = document.getElementById('region-registry-name');
  const speedText = document.getElementById('region-speed');
  const successText = document.getElementById('region-success');
  const costText = document.getElementById('region-cost');
  const statusText = document.getElementById('region-status');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      tabButtons.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      const regionKey = btn.getAttribute('data-region');
      const data = jurisdictionData[regionKey];
      
      if (!data) return;

      // Animate update
      const detailContainer = document.querySelector('.jurisdiction-detail-card');
      if (detailContainer) {
        detailContainer.style.opacity = '0.4';
        detailContainer.style.transform = 'translateY(5px)';
        detailContainer.style.transition = 'all 0.2s ease';
        
        setTimeout(() => {
          if (registryText) registryText.textContent = data.registry;
          if (speedText) speedText.textContent = data.speed;
          if (successText) successText.textContent = data.success;
          if (costText) costText.textContent = data.cost;
          if (statusText) statusText.textContent = data.status;
          
          detailContainer.style.opacity = '1';
          detailContainer.style.transform = 'translateY(0)';
        }, 150);
      }
    });
  });
}

/* ==========================================
   12. Brand Security & Risk Estimator
   ========================================== */
function initBrandEstimator() {
  const scaleSelect = document.getElementById('estimator-scale');
  const classSlider = document.getElementById('estimator-classes');
  const sliderVal = document.getElementById('slider-val');
  const riskSelect = document.getElementById('estimator-risk');
  
  if (!scaleSelect || !classSlider || !riskSelect) return;

  const valueDisplay = document.getElementById('estimator-value-val');
  const riskBadge = document.getElementById('estimator-risk-badge');
  const riskDesc = document.getElementById('estimator-risk-desc');
  const recomTier = document.getElementById('estimator-recom-tier');

  const updateEstimates = () => {
    const scale = scaleSelect.value;
    const classes = parseInt(classSlider.value);
    const riskLevel = riskSelect.value;

    // Update slider label bubble
    if (sliderVal) {
      sliderVal.textContent = classes + (classes === 1 ? ' Class' : ' Classes');
    }

    // Protection Valuation Index Math
    let baseVal = 25000; // Startup default
    if (scale === 'mid') baseVal = 95000;
    if (scale === 'enterprise') baseVal = 350000;

    // Multipliers
    const classMultiplier = 1 + (classes - 1) * 0.15;
    let riskMultiplier = 1.0;
    if (riskLevel === 'medium') riskMultiplier = 1.25;
    if (riskLevel === 'high') riskMultiplier = 1.6;

    const totalProtectedValue = Math.round(baseVal * classMultiplier * riskMultiplier);

    // Format currency
    const formattedValue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(totalProtectedValue);

    // Infringement Risk Level & Recommendations
    let riskScore = classes * (riskLevel === 'high' ? 3 : riskLevel === 'medium' ? 2 : 1);
    let computedRisk = 'low';
    let riskBadgeText = 'Low Risk';
    let riskText = 'Excellent availability potential. Minimal crowded database sectors found.';
    let recommendation = 'Standard Search & Single Class Protection';

    if (riskScore >= 9) {
      computedRisk = 'critical';
      riskBadgeText = 'Critical Risk';
      riskText = 'Extreme risk of registration failure or litigation. Immediate examiner counsel required.';
      recommendation = 'Elite Legal Search & Multi-Class Shield Portal';
    } else if (riskScore >= 5) {
      computedRisk = 'high';
      riskBadgeText = 'High Risk';
      riskText = 'Significant overlap risk. Similarity search audits highly recommended before submission.';
      recommendation = 'Pro Legal Search & Full Class Shield Guard';
    } else if (riskScore >= 3) {
      computedRisk = 'moderate';
      riskBadgeText = 'Moderate Risk';
      riskText = 'Standard registry density. Minor similarity risk in software and commerce sectors.';
      recommendation = 'Standard Search & 2-Class Protection Package';
    }

    // Render results
    if (valueDisplay) {
      valueDisplay.style.opacity = '0.3';
      setTimeout(() => {
        valueDisplay.textContent = formattedValue;
        valueDisplay.style.opacity = '1';
      }, 100);
    }

    if (riskBadge) {
      riskBadge.className = `risk-level-indicator risk-${computedRisk}`;
      riskBadge.innerHTML = `<i class="bi bi-shield-fill-exclamation"></i> ${riskBadgeText}`;
    }

    if (riskDesc) riskDesc.textContent = riskText;
    if (recomTier) recomTier.textContent = recommendation;
  };

  // Attach event listeners
  scaleSelect.addEventListener('change', updateEstimates);
  classSlider.addEventListener('input', updateEstimates);
  riskSelect.addEventListener('change', updateEstimates);

  // Initialize display
  updateEstimates();
}
