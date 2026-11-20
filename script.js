document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const nav = document.querySelector("header nav");
  const mobileQuery = window.matchMedia("(max-width: 820px)");

  /* ---------- 1. Header changes once the page scrolls ---------- */
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- 2. Mobile menu (button is created here, no HTML change needed) ---------- */
  if (header && nav) {
    nav.id = nav.id || "site-nav";

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "nav-toggle";
    toggle.setAttribute("aria-label", "Open menu");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", nav.id);
    toggle.innerHTML = "<span></span><span></span><span></span>";
    header.appendChild(toggle);

    const setMenu = (open) => {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };

    toggle.addEventListener("click", () => {
      setMenu(!nav.classList.contains("open"));
    });

    // close after choosing a link
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) setMenu(false);
    });

    // close with Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        setMenu(false);
        toggle.focus();
      }
    });

    // reset when returning to desktop width
    mobileQuery.addEventListener("change", (e) => {
      if (!e.matches) setMenu(false);
    });
  }

  /* ---------- 3. Cards fade in once as they enter the screen ---------- */
  const cards = document.querySelectorAll("#articles article, #products article");

  if ("IntersectionObserver" in window && cards.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    cards.forEach((card, i) => {
      card.classList.add("reveal");
      card.style.setProperty("--delay", `${(i % 3) * 0.12}s`);
      observer.observe(card);
    });
  }

  /* ---------- 4. Newsletter form ---------- */
  document.querySelectorAll("form").forEach((form) => {
    const email = form.querySelector('input[type="email"]');
    if (!email) return;

    const status = document.createElement("p");
    status.className = "form-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    form.appendChild(status);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = email.value.trim();
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

      status.classList.toggle("error", !valid);

      if (!valid) {
        status.textContent = "Please enter a valid email address.";
        email.focus();
        return;
      }

      // TODO: send `value` to your email service (Mailchimp, ConvertKit, Formspree, etc.)
      status.textContent = "Thank you. You're on the list.";
      form.reset();
    });
  });
});