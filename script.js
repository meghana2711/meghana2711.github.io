/**
 * OCEAN GLASSMORPHISM PORTFOLIO INTERACTION ENGINE
 * Vanilla JavaScript - Zero external dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScrollSpy();
  initMobileMenu();
  initOceanCanvas();
  initHeroTilt();
  initSkillsFilterAndSearch();
  initAddSkillFeature();
  initContactFormAndCopy();
  initYear();
});

/* ==========================================================================
   1. NAVBAR SCROLL SPY & STICKY STYLING
   ========================================================================== */
function initNavbarScrollSpy() {
  const header = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    let currentId = '';
    const scrollPosition = window.scrollY + 160;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
  }, { passive: true });
}

/* ==========================================================================
   2. MOBILE MENU TOGGLE
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (!toggleBtn || !navMenu) return;

  const links = navMenu.querySelectorAll('.nav-link');

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('open');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   3. OCEAN CANVAS: BIOLUMINESCENT BUBBLES & WATER RIPPLES
   ========================================================================== */
function initOceanCanvas() {
  const canvas = document.getElementById('ocean-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const toggleBtn = document.getElementById('ripple-toggle');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let animationRunning = true;
  let particles = [];
  let ripples = [];
  const PARTICLE_COUNT = Math.min(36, Math.floor((width * height) / 32000));

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  class Bubble {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 80;
      this.radius = Math.random() * 3.5 + 1.2;
      this.speedY = Math.random() * 0.45 + 0.25;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.35 + 0.15;
      this.glow = Math.random() * 10 + 6;
      this.color = Math.random() > 0.4 ? '0, 229, 255' : '59, 232, 176';
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      if (this.y < -20) this.reset();
    }

    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
      ctx.shadowBlur = this.glow;
      ctx.shadowColor = `rgba(${this.color}, 0.8)`;
      ctx.fill();
      ctx.restore();
    }
  }

  class Ripple {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 2;
      this.maxRadius = Math.random() * 50 + 40;
      this.alpha = 0.45;
      this.growth = 1.6;
    }

    update() {
      this.radius += this.growth;
      this.alpha -= 0.014;
    }

    draw() {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 229, 255, ${this.alpha})`;
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(0, 229, 255, 0.5)';
      ctx.stroke();
      ctx.restore();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const bubble = new Bubble();
    bubble.y = Math.random() * height;
    particles.push(bubble);
  }

  window.addEventListener('pointerdown', (e) => {
    if (ripples.length < 8) {
      ripples.push(new Ripple(e.clientX, e.clientY));
    }
  });

  function animate() {
    if (!animationRunning) return;

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    for (let i = ripples.length - 1; i >= 0; i--) {
      ripples[i].update();
      ripples[i].draw();
      if (ripples[i].alpha <= 0) {
        ripples.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }

  animate();

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      animationRunning = !animationRunning;
      if (animationRunning) {
        animate();
        showToast('Ocean animation enabled');
        toggleBtn.style.color = 'var(--ocean-cyan)';
      } else {
        ctx.clearRect(0, 0, width, height);
        showToast('Ocean animation paused');
        toggleBtn.style.color = 'var(--text-muted)';
      }
    });
  }
}

/* ==========================================================================
   4. HERO 3D GLASS ORB INTERACTIVE TILT
   ========================================================================== */
function initHeroTilt() {
  const orb = document.getElementById('glass-orb');
  const heroSection = document.getElementById('hero');
  if (!orb || !heroSection) return;

  heroSection.addEventListener('mousemove', (e) => {
    const rect = orb.getBoundingClientRect();
    const orbCenterX = rect.left + rect.width / 2;
    const orbCenterY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - orbCenterX) / 28;
    const deltaY = (e.clientY - orbCenterY) / 28;

    orb.style.transform = `perspective(800px) rotateY(${deltaX}deg) rotateX(${-deltaY}deg)`;
  });

  heroSection.addEventListener('mouseleave', () => {
    orb.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
    orb.style.transition = 'transform 0.8s ease';
  });

  heroSection.addEventListener('mouseenter', () => {
    orb.style.transition = 'none';
  });
}

/* ==========================================================================
   5. SKILLS FILTER TABS & INSTANT SEARCH
   ========================================================================== */
function initSkillsFilterAndSearch() {
  const tabs = document.querySelectorAll('.cat-tab');
  const groupCards = document.querySelectorAll('.skill-group-card');
  const searchInput = document.getElementById('skill-search');

  let currentCategory = 'all';

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      currentCategory = tab.dataset.category;
      filterSkills();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      filterSkills();
    });
  }

  function filterSkills() {
    const query = (searchInput?.value || '').trim().toLowerCase();

    groupCards.forEach(card => {
      const groupType = card.dataset.group;
      const pillsInGroup = card.querySelectorAll('.skill-pill');
      let groupHasMatch = false;

      const categoryMatches = (currentCategory === 'all' || currentCategory === groupType);

      pillsInGroup.forEach(pill => {
        const text = (pill.textContent || '').toLowerCase();
        const dataName = (pill.dataset.name || '').toLowerCase();
        const matchesQuery = !query || text.includes(query) || dataName.includes(query);

        if (matchesQuery) {
          pill.classList.remove('hidden');
          if (query) {
            pill.classList.add('highlight');
          } else {
            pill.classList.remove('highlight');
          }
          groupHasMatch = true;
        } else {
          pill.classList.add('hidden');
          pill.classList.remove('highlight');
        }
      });

      if (categoryMatches && (groupHasMatch || !query)) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }
}

/* ==========================================================================
   6. CUSTOM SKILL PILL ADDER (WITH LOCALSTORAGE)
   ========================================================================== */
function initAddSkillFeature() {
  const triggerBtn = document.getElementById('add-skill-trigger');
  const modal = document.getElementById('add-skill-modal');
  const form = document.getElementById('add-skill-form');

  if (!triggerBtn || !modal || !form) return;

  triggerBtn.addEventListener('click', () => {
    openModal(modal);
  });

  // Close button inside add-skill modal
  modal.querySelector('.modal-close-btn')?.addEventListener('click', () => {
    closeModal(modal);
  });

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal);
  });

  // Close on ESC
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal(modal);
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const category = document.getElementById('new-skill-category').value;
    const name = document.getElementById('new-skill-name').value.trim();

    if (!name) return;

    const targetGroup = document.querySelector(`.skill-group-card[data-group="${category}"] .pills-wrapper`);
    if (targetGroup) {
      const newPill = document.createElement('span');
      newPill.className = 'glass-pill skill-pill highlight';
      newPill.dataset.name = name.toLowerCase();
      newPill.innerHTML = `<span class="pill-dot"></span>${escapeHTML(name)}`;
      targetGroup.appendChild(newPill);

      saveCustomSkill(category, name);
      closeModal(modal);
      form.reset();
      showToast(`Added "${name}" to skills!`);
    }
  });

  loadCustomSkills();
}

function openModal(modal) {
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function saveCustomSkill(category, name) {
  try {
    const existing = JSON.parse(localStorage.getItem('ocean_portfolio_skills') || '[]');
    existing.push({ category, name });
    localStorage.setItem('ocean_portfolio_skills', JSON.stringify(existing));
  } catch (err) {
    console.warn('Could not save skill to localStorage', err);
  }
}

function loadCustomSkills() {
  try {
    const skills = JSON.parse(localStorage.getItem('ocean_portfolio_skills') || '[]');
    skills.forEach(({ category, name }) => {
      const targetGroup = document.querySelector(`.skill-group-card[data-group="${category}"] .pills-wrapper`);
      if (targetGroup) {
        const newPill = document.createElement('span');
        newPill.className = 'glass-pill skill-pill';
        newPill.dataset.name = name.toLowerCase();
        newPill.innerHTML = `<span class="pill-dot"></span>${escapeHTML(name)}`;
        targetGroup.appendChild(newPill);
      }
    });
  } catch (err) {
    console.warn('Could not load custom skills', err);
  }
}

/* ==========================================================================
   7. CONTACT FORM SUBMISSION & COPY EMAIL CLIPBOARD
   ========================================================================== */
function initContactFormAndCopy() {
  const form = document.getElementById('contact-form');
  const copyBtn = document.getElementById('copy-email-trigger');
  const emailLink = document.getElementById('email-link');

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const email = emailLink ? emailLink.textContent.trim() : 'nalla.me@northeastern.edu';
      try {
        await navigator.clipboard.writeText(email);
        showToast('Email address copied to clipboard!');
      } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Email address copied to clipboard!');
      }
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const subject = document.getElementById('contact-subject').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      const mailtoUrl = `mailto:nalla.me@northeastern.edu?subject=${encodeURIComponent(
        `[Portfolio Inquiry] ${subject}`
      )}&body=${encodeURIComponent(
        `Hi Meghana,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      )}`;

      window.location.href = mailtoUrl;
      showToast('Opening your email client...');
      form.reset();
    });
  }
}

/* ==========================================================================
   8. TOAST NOTIFICATION UTILITY
   ========================================================================== */
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast-notification');
  if (!toast) return;

  const msgSpan = toast.querySelector('.toast-message');
  if (msgSpan) msgSpan.textContent = message;

  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==========================================================================
   9. ESCAPE HELPER & DYNAMIC YEAR
   ========================================================================== */
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

function initYear() {
  const yearElem = document.getElementById('current-year');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }
}

