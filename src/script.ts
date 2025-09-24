// TODO: TYPESCRIPT

// ---------- tiny helpers ----------
/* *
 * Tiny helpers for DOM selection and event handling.
 * - `$`: Selects a single element matching the selector.
 * - `$$`: Selects all elements matching the selector as an array.
 * - `on`: Strongly typed event listener for HTMLElement, Document, and Window.
 */
const $ = <T extends HTMLElement>(
  sel: string,
  root: Document | HTMLElement = document
): T | null => root.querySelector<T>(sel);

const $$ = <T extends HTMLElement>(
  sel: string,
  root: Document | HTMLElement = document
): T[] => Array.from(root.querySelectorAll<T>(sel));

// Strongly typed `on` helper for HTMLElement, Document, and Window
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

// TODO: JAVASCRIPT

// ---------- core DOM references ----------
const themeBtn = $("#theme") as HTMLImageElement | null;
const nav = $("#Nav-wrapper");
const footer = $("footer");
const navbar = $("#navbar");
const toggler = $("#toggleIcon");
const sectionHeaders = $$<HTMLElement>("main header");

// ---------- theme toggle ----------
/* *
 * Theme toggle:
 * - Toggles between light and dark themes.
 * - Updates navigation, footer, and section header styles.
 * - Changes theme button icon.
 */

// ---------- theme toggle with localStorage ----------

const THEME_KEY = "site-theme";

function applyTheme(isLight: boolean): void {
  document.body.classList.toggle("light", isLight);
  nav?.classList.toggle("dark-grey", isLight);
  footer?.classList.toggle("footer-bgColor", isLight);
  sectionHeaders.forEach((h) => h.classList.toggle("header-bg-light", isLight));

  if (themeBtn) {
    themeBtn.src = isLight
      ? "./assets/Icons/moon.png"
      : "./assets/Icons/sun.png";
  }

  document.body.style.transition = "background 0.2s linear, color 0.2s linear";
}

// Initialize theme from localStorage (default = dark)
const savedTheme = localStorage.getItem(THEME_KEY);
const isLight = savedTheme === "light";
applyTheme(isLight);

on(themeBtn, "click", () => {
  const lightOn = !document.body.classList.contains("light");
  applyTheme(lightOn);

  // Save theme to localStorage
  localStorage.setItem(THEME_KEY, lightOn ? "light" : "dark");
});

// ---------- sticky nav ----------
/* *
 * Sticky navigation:
 * - Adds/removes sticky class to navigation on scroll.
 */
on(
  window,
  "scroll",
  () => {
    nav?.classList.toggle("sticky", window.scrollY > 20);
  },
  { passive: true }
);

// ---------- mobile menu ----------
/*
 * Mobile menu:
 * - Handles toggling of mobile navigation menu.
 * - Updates ARIA attributes for accessibility.
 * - Closes menu on navigation link click.
 */

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

// ---------- reveal animations ----------
/* *
 * Reveal animations:
 * - Uses IntersectionObserver to reveal hidden elements when in view.
 */

const revealObserver = new IntersectionObserver(
  (entries, obs) => {
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

// ---------- project video preview ----------
/* *
 * Project video preview:
 * - Plays video on mouse enter, pauses on mouse leave for preview videos.
 */

function initProjectVideoPreview() {
  $$<HTMLVideoElement>(".preview-video").forEach((video) => {
    on(video, "mouseenter", () => video.play());
    on(video, "mouseleave", () => video.pause());
  });
}
on(document, "DOMContentLoaded", initProjectVideoPreview);

// ---------- services animation ----------

/* *
 * Services animation:
 * - Animates service elements when they enter the viewport.
 */

const servicesObserver = new IntersectionObserver(
  (entries) => {
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

// ---------- dynamic year update ----------
/* *
 * Dynamic year update:
 * - Updates copyright year text automatically.
 */

function updateYear() {
  const yearText = $("#year-text");
  if (yearText)
    yearText.textContent = `© ${new Date().getFullYear()}. All rights reserved.`;
}
updateYear();
setInterval(updateYear, 1000 * 60 * 60);

// ---------- modal (contact) ----------

/* *
 * Modal (contact):
 * - Handles opening and closing of modal popup.
 * - Displays messages with color and optional auto-close.
 * - Closes modal on button, overlay click, or Escape key.
 */

const modal = $("#modal-popup");
const overlay = $(".overlay", modal || undefined);
const closeBtn = $("#closeBtn");
const okBtn = $("#okayBtn");
const modalMessage = $(".modal-message", modal || undefined);

let autoCloseTimer: number | undefined;

function openModal(message: string, color: string, autoClose = false) {
  if (!modal || !modalMessage) return;

  modalMessage.innerText = message;
  modalMessage.style.color = color;
  modal.classList.add("action");

  if (autoCloseTimer) clearTimeout(autoCloseTimer);
  if (autoClose) {
    autoCloseTimer = window.setTimeout(closeModal, 3000);
  }
}

function closeModal() {
  modal?.classList.remove("action");
  if (autoCloseTimer) clearTimeout(autoCloseTimer);
}

on(closeBtn, "click", closeModal);
on(okBtn, "click", closeModal);
on(overlay, "click", closeModal);
on(document, "keydown", (e: KeyboardEvent) => {
  if (e.key === "Escape") closeModal();
});

// ---------- contact form (Third party:FormSpree) ----------
/* *
 * Contact form (FormSpree):
 * - Submits contact form via AJAX.
 * - Shows modal feedback for success or error.
 */

const contactForm = $("#contactForm") as HTMLFormElement | null;

on(contactForm, "submit", async (e: Event) => {
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
  } catch (err) {
    console.error(err);
    openModal("❌ Network error. Please try again.", "red");
  }
});
