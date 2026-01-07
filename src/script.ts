// =======================================
// TODO: TYPESCRIPT
// =======================================

// ---------- tiny helpers ----------
/**
 * Tiny helpers for DOM selection and event handling.
 * - `$`: Selects a single element matching the selector.
 * - `$$`: Selects all elements matching the selector as an array.
 * - `on`: Strongly typed event listener for HTMLElement, Document, and Window.
 */
const $ = <T extends HTMLElement>(
  sel: string,
  root: ParentNode = document
): T | null => root.querySelector<T>(sel);

const $$ = <T extends HTMLElement>(
  sel: string,
  root: ParentNode = document
): T[] => Array.from(root.querySelectorAll<T>(sel));

// Strongly typed `on` helper
function on<K extends keyof HTMLElementEventMap>(
  el: HTMLElement | null,
  type: K,
  handler: (ev: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): void;
function on<K extends keyof DocumentEventMap>(
  el: Document | null,
  type: K,
  handler: (ev: DocumentEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): void;
function on<K extends keyof WindowEventMap>(
  el: Window | null,
  type: K,
  handler: (ev: WindowEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): void;
function on(
  el: HTMLElement | Document | Window | null,
  type: string,
  handler: EventListener,
  options?: boolean | AddEventListenerOptions
): void {
  el?.addEventListener(type, handler, options);
}

// =======================================
// TODO: JAVASCRIPT CORE
// =======================================

// ---------- core DOM references ----------
const themeBtn = $("#theme") as HTMLImageElement | null;
const nav = $("#Nav-wrapper");
const footer = $("footer");
const navbar = $("#navbar");
const toggler = $("#toggleIcon");
const hello = $("#hello");
const introDetails = $(".intro-details");
const DownloadCV = $(".Download-CV");
const sectionHeaders = $$<HTMLElement>("main header");

// =======================================
// THEME TOGGLE
// =======================================
/**
 * Theme toggle with localStorage + system preference.
 */
const THEME_KEY = "site-theme";

function applyTheme(isLight: boolean): void {
  document.body.classList.toggle("light", isLight);
  nav?.classList?.toggle("dark-grey", isLight);
  hello?.classList?.toggle("text-color-light", isLight);
  introDetails?.classList?.toggle("text-color-light", isLight);
  DownloadCV?.classList?.toggle("text-color-light", isLight);
  footer?.classList?.toggle("footer-bgColor", isLight);
  sectionHeaders.forEach((h) => h.classList.toggle("header-bg-light", isLight));

  if (themeBtn) {
    themeBtn.src = isLight
      ? "./assets/Icons/Others/moon.png"
      : "./assets/Icons/Others/sun.png";
  }

  document.body.style.transition = "background 0.2s linear, color 0.2s linear";
}

function getInitialTheme(): boolean {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === "light") return true;
  if (savedTheme === "dark") return false;

  // Fallback to system preference
  return !window.matchMedia("(prefers-color-scheme: dark)").matches;
}

// Init theme
let isLight = getInitialTheme();
applyTheme(isLight);

on(themeBtn, "click", () => {
  isLight = !isLight;
  applyTheme(isLight);
  localStorage.setItem(THEME_KEY, isLight ? "light" : "dark");
});

// =======================================
// STICKY NAV
// =======================================
on(
  window,
  "scroll",
  () => nav?.classList?.toggle("sticky", window.scrollY > 20),
  { passive: true }
);

// =======================================
// MOBILE MENU
// =======================================
if (toggler && navbar) {
  toggler.setAttribute("aria-controls", "navbar");
  toggler.setAttribute("aria-expanded", "false");
  toggler.setAttribute("aria-label", "Toggle navigation menu");

  on(toggler, "click", () => {
    const showing = navbar.classList.toggle("show");
    toggler.classList.toggle("show", showing);
    toggler.setAttribute("aria-expanded", showing.toString());
  });

  $$<HTMLAnchorElement>("#navbar a").forEach((a) =>
    on(a, "click", () => {
      navbar.classList.remove("show");
      toggler.classList.remove("show");
      toggler.setAttribute("aria-expanded", "false");
    })
  );
}

// =======================================
// REVEAL ANIMATIONS
// =======================================
const revealObserver = new IntersectionObserver(
  (entries: IntersectionObserverEntry[], obs: IntersectionObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        (entry.target as HTMLElement).classList.add("show");
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

$$<HTMLElement>(".hidden").forEach((el) => revealObserver.observe(el));

// =======================================
//  PROJECT CARD PREVIEW CONTROLS
// =======================================
function bindPreviewControls(): void {
  const cards = document.querySelectorAll<HTMLElement>(".project-card");

  cards.forEach((card) => {
    const openBtn = card.querySelector<HTMLAnchorElement>(".media-link");

    if (openBtn) {
      openBtn.addEventListener("click", () => {
        const href = openBtn.dataset.href;
        if (href) window.open(href, "_blank", "noopener");
      });
    }
  });
}
// Details removed — modal is disabled. Keep preview bindings active.
bindPreviewControls();

// =======================================
// SERVICES ANIMATION
// =======================================
const servicesObserver = new IntersectionObserver(
  (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) =>
      (entry.target as HTMLElement).classList.toggle(
        "showAnimate",
        entry.isIntersecting
      )
    );
  },
  { threshold: 0.12 }
);

$$<HTMLElement>(".animate-service").forEach((el) =>
  servicesObserver.observe(el)
);

// =======================================
// DYNAMIC YEAR UPDATE
// =======================================
function updateYear() {
  const yearText = $("#year-text");
  if (yearText)
    yearText.textContent = `© ${new Date().getFullYear()}. All rights reserved.`;
}
updateYear();
setInterval(updateYear, 1000 * 60 * 60);

// =======================================
// MODAL (CONTACT)
// =======================================
const modal = $("#modal-popup");
const overlay = modal ? $(".overlay", modal) : null;
const closeBtn = $("#closeBtn");
const okBtn = $("#okayBtn");
const modalMessage = modal ? $(".modal-message", modal) : null;

let autoCloseTimer: number | undefined;

function openModal(message: string, color: string, autoClose = false) {
  if (!modal || !modalMessage) return;

  modalMessage.innerText = message;
  modalMessage.style.color = color;
  modal.classList.add("action");

  if (autoCloseTimer) clearTimeout(autoCloseTimer);
  if (autoClose) autoCloseTimer = window.setTimeout(closeModal, 3000);
}

function closeModal() {
  modal?.classList?.remove("action");
  if (autoCloseTimer) clearTimeout(autoCloseTimer);
}

on(closeBtn, "click", closeModal);
on(okBtn, "click", closeModal);
on(overlay, "click", closeModal);
on(document, "keydown", (e: KeyboardEvent) => {
  if (e.key === "Escape") closeModal();
});

// =======================================
// CONTACT FORM (FORMSPREE)
// =======================================
const contactForm = $("#contactForm") as HTMLFormElement | null;

on(contactForm, "submit", async (e: SubmitEvent) => {
  e.preventDefault();
  if (!contactForm) return;

  openModal("Sending...", "#444");

  try {
    const response = await fetch(contactForm.action, {
      method: contactForm.method,
      body: new FormData(contactForm),
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      openModal("✅ Message sent successfully!", "green");
      contactForm.reset();
    } else {
      openModal("❌ Oops! Something went wrong.", "red");
    }
  } catch (err: unknown) {
    console.error(err);
    openModal("❌ Network error. Please try again.", "red");
  }
});

// =======================================
// SERVICE CARD 3D TILT
// =======================================
const serviceCards = document.querySelectorAll<HTMLElement>(".service-box");

serviceCards.forEach((card) => {
  on(card, "mousemove", (e: MouseEvent) => {
    const rect = card.getBoundingClientRect();
    const halfWidth = rect.width / 2;
    const halfHeight = rect.height / 2;

    const centerX = rect.left + halfWidth;
    const centerY = rect.top + halfHeight;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    const maxDistance = Math.max(halfWidth, halfHeight);

    const degree = (distance * 10) / maxDistance;
    const rx = deltaY / halfHeight;
    const ry = deltaX / halfWidth;

    card.style.transform = `perspective(400px) rotate3d(${-rx}, ${ry}, 0, ${degree}deg)`;
  });

  on(card, "mouseleave", () => {
    card.style.transform = "";
  });
});

// =======================================
// DYNAMIC TYPING TEXT
// =======================================
const typingElement = $("#typing") as HTMLElement | null;

// the typing sentences
const sentences = [
  "Bakare, .A. Olayemi",
  "a Web Developer",
  "also a Freelancer",
];

let sentenceIndex = 0;
let charIndex = 0;

// adding functionality to the dynamic text
function type(): void {
  if (!typingElement) return;

  if (sentenceIndex < sentences.length) {
    if (charIndex < sentences[sentenceIndex].length) {
      typingElement.textContent =
        (typingElement.textContent ?? "") +
        sentences[sentenceIndex].charAt(charIndex);

      charIndex++;
      setTimeout(type, 100);
    } else {
      // pause before clearing and moving to next sentence
      setTimeout(() => {
        typingElement.textContent = "";
        charIndex = 0;
        sentenceIndex = (sentenceIndex + 1) % sentences.length; // loop
        type();
      }, 1000);
    }
  }
}

type();
