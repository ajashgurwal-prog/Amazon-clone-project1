/* =============================================
   LUMORA — script.js
   Interactive functionality for the homepage
=============================================== */

/* ─── UTILITY: Wait for DOM to be fully loaded ─── */
document.addEventListener('DOMContentLoaded', () => {

  /* =============================================
     1. HAMBURGER MENU TOGGLE
     Toggles the category links on mobile
  =============================================== */
  const hamburgerBtn   = document.getElementById('hamburgerBtn');
  const categoryLinks  = document.getElementById('categoryLinks');

  if (hamburgerBtn && categoryLinks) {
    hamburgerBtn.addEventListener('click', () => {
      /* Toggle expanded state */
      const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
      hamburgerBtn.setAttribute('aria-expanded', String(!isExpanded));
      categoryLinks.classList.toggle('open');
    });

    /* Close menu if user clicks outside it */
    document.addEventListener('click', (e) => {
      if (
        !hamburgerBtn.contains(e.target) &&
        !categoryLinks.contains(e.target)
      ) {
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        categoryLinks.classList.remove('open');
      }
    });
  }


  /* =============================================
     2. STICKY NAV SHADOW ON SCROLL
     Adds a deeper shadow to the nav when the
     user scrolls past the utility bar.
  =============================================== */
  const mainNav = document.querySelector('.main-nav');

  if (mainNav) {
    const onScroll = () => {
      if (window.scrollY > 40) {
        mainNav.classList.add('scrolled');
      } else {
        mainNav.classList.remove('scrolled');
      }
    };

    /* Throttle scroll handler for performance */
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        requestAnimationFrame(() => {
          onScroll();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    });
  }


  /* =============================================
     3. PRODUCT FILTER TABS
     Filters the product grid by category when
     a filter tab button is clicked.
  =============================================== */
  const filterTabs   = document.querySelectorAll('.filter-tab');
  const productCards = document.querySelectorAll('.product-card');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      /* Update active tab styling */
      filterTabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.dataset.filter;

      /* Show / hide product cards */
      productCards.forEach((card) => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
          /* Trigger a subtle fade-in animation */
          card.style.animation = 'none';
          card.offsetHeight; /* force reflow */
          card.style.animation = 'fadeInUp 0.3s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  /* =============================================
     4. ADD TO CART — PRODUCT CARDS
     Handles "Add to Cart" clicks on product
     cards and deal cards. Updates cart badge
     count and shows a toast notification.
  =============================================== */
  let cartCount = 3; /* starting count shown in HTML */
  const cartBadge = document.querySelector('.cart-badge');
  const toast     = document.getElementById('toast');
  let toastTimer  = null;

  /* Helper: show the toast message */
  function showToast(message = '✓ Added to cart!') {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');

    /* Clear any existing timer so rapid clicks reset it */
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  /* Helper: increment cart badge */
  function incrementCart() {
    cartCount++;
    if (cartBadge) {
      cartBadge.textContent = cartCount;
      /* Tiny pop animation */
      cartBadge.style.transform = 'scale(1.4)';
      setTimeout(() => {
        cartBadge.style.transform = 'scale(1)';
      }, 200);
    }
  }

  /* Attach to all "Add to Cart" buttons in product grid */
  const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
  addToCartBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      incrementCart();
      showToast('✓ Added to cart!');

      /* Brief button feedback */
      const original = btn.textContent;
      btn.textContent = '✓ Added!';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
      }, 1500);
    });
  });

  /* Attach to "Add to Cart" buttons in deal cards */
  const dealCartBtns = document.querySelectorAll('.deal-card .btn-sm');
  dealCartBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      incrementCart();
      showToast('✓ Deal added to cart!');

      const original = btn.textContent;
      btn.textContent = '✓ Added!';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
      }, 1500);
    });
  });


  /* =============================================
     5. WISHLIST TOGGLE
     Toggles the heart icon on product cards
     between outlined (♡) and filled (♥).
  =============================================== */
  const wishlistBtns = document.querySelectorAll('.wishlist-toggle');

  wishlistBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isActive = btn.classList.toggle('active');
      btn.textContent = isActive ? '♥' : '♡';
      btn.setAttribute(
        'aria-label',
        isActive ? 'Remove from wishlist' : 'Add to wishlist'
      );
      showToast(isActive ? '♥ Saved to wishlist!' : 'Removed from wishlist');
    });
  });


  /* =============================================
     6. NEWSLETTER FORM VALIDATION
     Validates email input and shows inline
     success or error feedback message.
  =============================================== */
  const newsletterForm = document.getElementById('newsletterForm');
  const nlEmailInput   = document.getElementById('nlEmail');
  const nlMsg          = document.getElementById('nlMsg');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault(); /* prevent page reload */

      const email = nlEmailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email) {
        showNlMsg('Please enter your email address.', 'error');
        nlEmailInput.focus();
        return;
      }

      if (!emailRegex.test(email)) {
        showNlMsg('Please enter a valid email address.', 'error');
        nlEmailInput.focus();
        return;
      }

      /* Simulate successful subscription */
      showNlMsg(`🎉 You're subscribed! Welcome to Lumora.`, 'success');
      nlEmailInput.value = '';
    });
  }

  /* Helper: show newsletter feedback message */
  function showNlMsg(message, type) {
    if (!nlMsg) return;
    nlMsg.textContent = message;
    nlMsg.style.color = type === 'error' ? '#FF6B6B' : '#00C9A7';
    /* Clear after 4 seconds */
    setTimeout(() => {
      nlMsg.textContent = '';
    }, 4000);
  }


  /* =============================================
     7. SEARCH BAR — KEYBOARD SHORTCUT
     Press "/" anywhere on the page to focus
     the search input (common UX pattern).
  =============================================== */
  const searchInput = document.querySelector('.search-input');

  document.addEventListener('keydown', (e) => {
    /* Only trigger if not already typing in an input/textarea */
    const tag = document.activeElement.tagName.toLowerCase();
    if (e.key === '/' && tag !== 'input' && tag !== 'textarea') {
      e.preventDefault();
      searchInput?.focus();
    }
    /* Press Escape to blur the search input */
    if (e.key === 'Escape' && document.activeElement === searchInput) {
      searchInput.blur();
    }
  });


  /* =============================================
     8. SEARCH BAR — SUBMIT ON ENTER
     Shows a toast when the user searches
     (since we have no backend here).
  =============================================== */
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
          showToast(`🔍 Searching for "${query}"…`);
        }
      }
    });
  }

  const searchBtn = document.querySelector('.search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const query = searchInput?.value.trim();
      if (query) {
        showToast(`🔍 Searching for "${query}"…`);
      } else {
        searchInput?.focus();
      }
    });
  }


  /* =============================================
     9. SMOOTH SCROLL FOR ANCHOR LINKS
     Enhances in-page anchor link scrolling
     with an offset for the sticky nav height.
  =============================================== */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      /* Offset for sticky nav height */
      const navHeight = mainNav ? mainNav.offsetHeight : 0;
      const targetY   = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });


  /* =============================================
     10. SCROLL REVEAL ANIMATION
     Cards and sections fade up into view as
     the user scrolls down the page.
  =============================================== */
  const revealElements = document.querySelectorAll(
    '.product-card, .deal-card, .cat-tile, .usp-item'
  );

  /* Only run if IntersectionObserver is supported */
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target); /* run once */
          }
        });
      },
      {
        threshold: 0.12,     /* trigger when 12% visible */
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => {
      el.classList.add('reveal-pending'); /* hide initially via CSS */
      revealObserver.observe(el);
    });
  } else {
    /* Fallback: just show everything */
    revealElements.forEach((el) => el.classList.add('revealed'));
  }


  /* =============================================
     11. DEAL PROGRESS BAR ANIMATION
     Animates progress bars to their target
     width on page load using IntersectionObserver.
  =============================================== */
  const dealFills = document.querySelectorAll('.deal-fill');

  if ('IntersectionObserver' in window) {
    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const fill = entry.target;
            const targetWidth = fill.style.width;
            fill.style.width = '0%';

            /* Small delay then animate to real width */
            setTimeout(() => {
              fill.style.width = targetWidth;
            }, 200);

            barObserver.unobserve(fill);
          }
        });
      },
      { threshold: 0.5 }
    );

    dealFills.forEach((fill) => barObserver.observe(fill));
  }


  /* =============================================
     12. CART BADGE TRANSITION STYLE
     Injects the scale transition for the cart
     badge directly (avoids flash on first click).
  =============================================== */
  if (cartBadge) {
    cartBadge.style.transition = 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)';
  }


}); /* end DOMContentLoaded */


/* =============================================
   CSS ANIMATIONS injected via JS
   (Used by filter tab reveal + scroll reveal)
=============================================== */
const styleSheet = document.createElement('style');
styleSheet.textContent = `

  /* Fade-up entrance used by product filter */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Scroll reveal — initial hidden state */
  .reveal-pending {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }

  /* Scroll reveal — visible state */
  .revealed {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }

  /* Sticky nav scrolled state — deeper shadow */
  .main-nav.scrolled {
    box-shadow: 0 4px 24px rgba(108, 75, 239, 0.45);
  }

  /* Mobile: category links open state */
  @media (max-width: 640px) {
    .category-links {
      display: none;
      flex-direction: column;
      background: rgba(0,0,0,0.25);
      border-radius: 8px;
      padding: 8px;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 50;
    }
    .category-links.open {
      display: flex;
    }
  }

`;
document.head.appendChild(styleSheet);