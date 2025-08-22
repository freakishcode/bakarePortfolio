"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// ---------- tiny helpers ----------
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
function on(el, type, handler, options) {
    el === null || el === void 0 ? void 0 : el.addEventListener(type, handler, options);
}
// ---------- core DOM references ----------
const themeBtn = $("#theme");
const nav = $("#Nav-wrapper");
const footer = $("footer");
const navbar = $("#navbar");
const toggler = $("#toggleIcon");
const sectionHeaders = $$("main header");
// ---------- theme toggle ----------
on(themeBtn, "click", () => {
    const lightOn = document.body.classList.toggle("light");
    nav === null || nav === void 0 ? void 0 : nav.classList.toggle("dark-grey");
    footer === null || footer === void 0 ? void 0 : footer.classList.toggle("footer-bgColor");
    sectionHeaders.forEach((h) => h.classList.toggle("header-bg-light", lightOn));
    if (themeBtn)
        themeBtn.src = lightOn
            ? "./assets/Icons/moon.png"
            : "./assets/Icons/sun.png";
    document.body.style.transition = "background 0.2s linear, color 0.2s linear";
});
// ---------- sticky nav ----------
on(window, "scroll", () => {
    nav === null || nav === void 0 ? void 0 : nav.classList.toggle("sticky", window.scrollY > 20);
}, { passive: true });
// ---------- mobile menu ----------
if (toggler && navbar) {
    toggler.setAttribute("aria-controls", "navbar");
    toggler.setAttribute("aria-expanded", "false");
    toggler.setAttribute("aria-label", "Toggle navigation menu");
    on(toggler, "click", () => {
        const showing = navbar.classList.toggle("show");
        toggler.classList.toggle("show", showing);
        toggler.setAttribute("aria-expanded", showing.toString());
    });
    $$("#navbar a").forEach((a) => on(a, "click", () => {
        navbar.classList.remove("show");
        toggler.classList.remove("show");
        toggler.setAttribute("aria-expanded", "false");
    }));
}
// ---------- reveal animations ----------
const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
            obs.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });
$$(".hidden").forEach((el) => revealObserver.observe(el));
// ---------- project video preview ----------
function initProjectVideoPreview() {
    $$(".preview-video").forEach((video) => {
        on(video, "mouseenter", () => video.play());
        on(video, "mouseleave", () => video.pause());
    });
}
on(document, "DOMContentLoaded", initProjectVideoPreview);
// ---------- services animation ----------
const servicesObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle("showAnimate", entry.isIntersecting));
}, { threshold: 0.12 });
$$(".animate-service").forEach((el) => servicesObserver.observe(el));
// ---------- dynamic year update ----------
function updateYear() {
    const yearText = $("#year-text");
    if (yearText)
        yearText.textContent = `© ${new Date().getFullYear()}. All rights reserved.`;
}
updateYear();
setInterval(updateYear, 1000 * 60 * 60);
// ---------- modal (contact) ----------
const modal = $("#modal-popup");
const overlay = $(".overlay", modal || undefined);
const closeBtn = $("#closeBtn");
const okBtn = $("#okayBtn");
const modalMessage = $(".modal-message", modal || undefined);
let autoCloseTimer;
function openModal(message, color, autoClose = false) {
    if (!modal || !modalMessage)
        return;
    modalMessage.innerText = message;
    modalMessage.style.color = color;
    modal.classList.add("action");
    if (autoCloseTimer)
        clearTimeout(autoCloseTimer);
    if (autoClose) {
        autoCloseTimer = window.setTimeout(closeModal, 3000);
    }
}
function closeModal() {
    modal === null || modal === void 0 ? void 0 : modal.classList.remove("action");
    if (autoCloseTimer)
        clearTimeout(autoCloseTimer);
}
on(closeBtn, "click", closeModal);
on(okBtn, "click", closeModal);
on(overlay, "click", closeModal);
on(document, "keydown", (e) => {
    if (e.key === "Escape")
        closeModal();
});
// ---------- contact form (Formspree) ----------
const contactForm = $("#contactForm");
on(contactForm, "submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    if (!contactForm)
        return;
    openModal("Sending...", "#444");
    try {
        const response = yield fetch(contactForm.action, {
            method: contactForm.method,
            body: new FormData(contactForm),
            headers: { Accept: "application/json" },
        });
        if (response.ok) {
            openModal("✅ Message sent successfully!", "green");
            contactForm.reset();
        }
        else {
            openModal("❌ Oops! Something went wrong.", "red");
        }
    }
    catch (err) {
        console.error(err);
        openModal("❌ Network error. Please try again.", "red");
    }
}));
