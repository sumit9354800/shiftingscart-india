/* ==========================================================================
   ShiftingsCart global JavaScript
   Purpose:
   - Load shared header and footer includes
   - Manage navigation state and mobile menu
   - Prepare WhatsApp quote form behaviour
   - Add subtle home-page reveal and counter motion
   Notes:
   - Keep logic framework-free for static hosting simplicity.
   - This script assumes the site is served over HTTP/HTTPS.
   ========================================================================== */

(function () {
  const body = document.body;
  const rootPath = body.dataset.rootPath || "./";
  const siteHeaderHost = document.getElementById("site-header");
  const siteFooterHost = document.getElementById("site-footer");
  const pageKey = body.dataset.page || "";
  const defaultService = body.dataset.defaultService || "";
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  async function injectInclude(target, fileName) {
    if (!target) return;
    try {
      const response = await fetch(`${rootPath}includes/${fileName}`, { cache: "no-store" });
      if (!response.ok) throw new Error(`Unable to load include: ${fileName}`);
      const markup = await response.text();
      target.innerHTML = adjustAssetPaths(markup);
    } catch (error) {
      console.error(error);
      target.innerHTML = `<div class="container"><p class="note-box">Shared ${fileName} could not be loaded. Please verify the include path.</p></div>`;
    }
  }

  function adjustAssetPaths(markup) {
    if (rootPath === "./") return markup;
    return markup
      .replace(/href="(?!https?:|mailto:|tel:|#|javascript:)([^"]+)"/g, `href="${rootPath}$1"`)
      .replace(/src="(?!https?:)([^"]+)"/g, `src="${rootPath}$1"`);
  }

  function setupNavigation() {
    const header = document.getElementById("site-header-inner");
    const navToggle = document.querySelector(".nav-toggle");
    const navigation = document.getElementById("site-navigation");
    const activeLink = document.querySelector(`[data-nav="${pageKey}"]`);

    if (activeLink) activeLink.classList.add("is-active");

    const applyHeaderState = () => {
      if (!header) return;
      if (window.scrollY > 24 || pageKey !== "home") {
        header.classList.add("is-solid");
      } else {
        header.classList.remove("is-solid");
      }
    };

    applyHeaderState();
    window.addEventListener("scroll", applyHeaderState, { passive: true });

    if (navToggle && navigation) {
      navToggle.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("is-open");
        body.classList.toggle("is-nav-open", isOpen);
        navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });

      navigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          navigation.classList.remove("is-open");
          body.classList.remove("is-nav-open");
          navToggle.setAttribute("aria-expanded", "false");
        });
      });
    }
  }

  function setupFooter() {
    const yearTarget = document.getElementById("current-year");
    if (yearTarget) yearTarget.textContent = String(new Date().getFullYear());
  }

  function isLikelyValidPhone(value) {
    const digits = value.replace(/\D/g, "");
    return digits.length >= 10;
  }

  function setupQuoteForms() {
    const forms = document.querySelectorAll("[data-quote-form]");
    if (!forms.length) return;

    forms.forEach((form) => {
      const serviceField = form.querySelector('[name="serviceType"]');
      const statusTarget = form.querySelector("[data-quote-status]");

      if (serviceField && defaultService && !serviceField.value) {
        serviceField.value = defaultService;
      }

      form.addEventListener("submit", (event) => {
        event.preventDefault();

        const data = new FormData(form);
        const name = (data.get("name") || "").toString().trim();
        const phone = (data.get("phone") || "").toString().trim();
        const serviceType = (data.get("serviceType") || "").toString().trim();
        const movingDate = (data.get("movingDate") || "").toString().trim();
        const fromLocation = (data.get("fromLocation") || "").toString().trim();
        const toLocation = (data.get("toLocation") || "").toString().trim();
        const notes = (data.get("notes") || "").toString().trim();

        if (!name || !phone || !serviceType || !fromLocation || !toLocation) {
          if (statusTarget) {
            statusTarget.textContent = "Please fill the required fields before opening WhatsApp.";
          }
          return;
        }

        if (!isLikelyValidPhone(phone)) {
          if (statusTarget) {
            statusTarget.textContent = "Please enter a valid phone number with at least 10 digits.";
          }
          return;
        }

        const message = [
          "Hello ShiftingsCart, I would like an instant quote.",
          "",
          `Name: ${name}`,
          `Phone: ${phone}`,
          `Service Type: ${serviceType}`,
          `Moving Date: ${movingDate || "Not specified"}`,
          `From Location: ${fromLocation}`,
          `To Location: ${toLocation}`,
          `Notes / Item Details: ${notes || "Not specified"}`
        ].join("\n");

        const whatsappUrl = `https://wa.me/918248667381?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank", "noopener");

        if (statusTarget) {
          statusTarget.textContent = "Opening WhatsApp with your quote request.";
        }
      });
    });
  }

  function animateCounter(target) {
    const finalValue = Number(target.dataset.counter || target.textContent || 0);
    if (!Number.isFinite(finalValue) || finalValue <= 0) return;

    if (prefersReducedMotion) {
      target.textContent = String(finalValue);
      return;
    }

    const duration = 1200;
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      target.textContent = String(Math.round(finalValue * eased));
      if (progress < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  function setupCounters() {
    const counters = document.querySelectorAll("[data-counter]");
    if (!counters.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      counters.forEach((counter) => {
        counter.textContent = String(counter.dataset.counter || counter.textContent);
      });
      return;
    }

    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        activeObserver.unobserve(entry.target);
      });
    }, { threshold: 0.45 });

    counters.forEach((counter) => observer.observe(counter));
  }



  function normalizeSearchText(value) {
    return (value || "")
      .toString()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function setupLocalitySearch() {
    const searchField = document.querySelector("[data-locality-search]");
    if (!searchField) return;

    const cards = Array.from(document.querySelectorAll("[data-locality-card]"));
    const zoneSections = Array.from(document.querySelectorAll("[data-zone-section]"));
    const zoneButtons = Array.from(document.querySelectorAll("[data-zone-filter]"));
    const countTarget = document.querySelector("[data-locality-count]");
    const emptyState = document.querySelector("[data-locality-empty]");
    let activeZone = "all";

    const setButtonState = () => {
      zoneButtons.forEach((button) => {
        const isActive = button.dataset.zoneFilter === activeZone;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
    };

    const applyFilters = () => {
      const query = normalizeSearchText(searchField.value);
      let visibleCount = 0;

      cards.forEach((card) => {
        const searchableText = normalizeSearchText(
          `${card.dataset.locality || ""} ${card.dataset.zone || ""} ${card.dataset.keywords || ""}`
        );
        const matchesQuery = !query || searchableText.includes(query);
        const matchesZone = activeZone === "all" || card.dataset.zoneSlug === activeZone;
        const isVisible = matchesQuery && matchesZone;

        card.hidden = !isVisible;
        card.setAttribute("aria-hidden", isVisible ? "false" : "true");

        if (isVisible) visibleCount += 1;
      });

      zoneSections.forEach((section) => {
        const hasVisibleCards = Array.from(section.querySelectorAll("[data-locality-card]")).some((card) => !card.hidden);
        section.hidden = !hasVisibleCards;
      });

      if (countTarget) {
        countTarget.textContent = `${visibleCount} Chennai localities shown`;
      }

      if (emptyState) {
        emptyState.hidden = visibleCount !== 0;
      }
    };

    searchField.addEventListener("input", applyFilters);

    zoneButtons.forEach((button) => {
      button.addEventListener("click", () => {
        activeZone = button.dataset.zoneFilter || "all";
        setButtonState();
        applyFilters();
      });
    });

    setButtonState();
    applyFilters();
  }

  function setupReveals() {
    const revealItems = document.querySelectorAll("[data-reveal]");
    if (!revealItems.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        activeObserver.unobserve(entry.target);
      });
    }, {
      threshold: 0.18,
      rootMargin: "0px 0px -6% 0px"
    });

    revealItems.forEach((item) => observer.observe(item));
  }

  Promise.all([
    injectInclude(siteHeaderHost, "header.html"),
    injectInclude(siteFooterHost, "footer.html")
  ]).then(() => {
    setupNavigation();
    setupFooter();
    setupQuoteForms();
    setupCounters();
    setupReveals();
    setupLocalitySearch();
  });
})();
