// Sovereign Women House — site behaviour
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const nav = document.querySelector("header nav");
  const mobileQuery = window.matchMedia("(max-width: 820px)");

  /* ---------- 0. Logo image ---------- */
  // Moves the <img src="SWH...."> into the header logo link.
  // If the file name is wrong it tries .jpeg/.jpg/.png/.webp, then falls back to the text "SWH".
  const logoLink = document.querySelector(".logo a");
  const logoImg = document.querySelector('img[src*="SWH" i]');

  if (logoLink && logoImg) {
    const fallbackText = logoLink.textContent.trim() || "SWH";

    if (!logoLink.contains(logoImg)) {
      logoLink.textContent = "";
      logoLink.appendChild(logoImg);
    }

    if (!logoImg.alt) logoImg.alt = "Sovereign Women House";
    logoLink.setAttribute("aria-label", "Sovereign Women House, home");

    const base = logoImg.getAttribute("src").replace(/\.[^./\\]+$/, "");
    const candidates = ["jpeg", "jpg", "png", "webp"]
      .map((ext) => `${base}.${ext}`)
      .filter((src) => src !== logoImg.getAttribute("src"));

    const tryNext = () => {
      if (candidates.length) {
        logoImg.src = candidates.shift();
      } else {
        logoImg.remove();
        logoLink.textContent = fallbackText;
      }
    };

    logoImg.addEventListener("error", tryNext);
    // the error may already have happened before this script ran
    if (logoImg.complete && logoImg.naturalWidth === 0) tryNext();
  }

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

  /* ---------- 3. Script accent word in headings ---------- */
  // Wraps one word per heading in <em> so CSS can set it in the script font.
  // Hero: the middle word ("Women"). Section headings: the last word.
  // To choose your own word, add <em>word</em> in the HTML and this skips that heading.
  document.querySelectorAll("#hero h1, section h2").forEach((heading) => {
    if (heading.querySelector("em")) return;
    const words = heading.textContent.trim().split(/\s+/);
    if (words.length < 2) return;

    const index = heading.matches("#hero h1") ? 1 : words.length - 1;
    heading.textContent = "";
    words.forEach((word, i) => {
      if (i === index) {
        const em = document.createElement("em");
        em.textContent = word;
        heading.append(em);
      } else {
        heading.append(word);
      }
      if (i < words.length - 1) heading.append(" ");
    });
  });

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
