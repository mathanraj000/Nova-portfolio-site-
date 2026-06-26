"use strict";

// Replace these with your EmailJS details from https://www.emailjs.com/.
const EMAILJS_PUBLIC_KEY = "YOUR_EMAILJS_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "YOUR_EMAILJS_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_EMAILJS_TEMPLATE_ID";

function initReveal() {
  const revealEls = document.querySelectorAll(
    ".about__grid, .about__cta, .team-card, .service-card, .process__cta, .process-step, .portfolio-card, .feedback__form, .feedback__info, .why-card, .why-nova__cta, .contact__card"
  );

  revealEls.forEach(el => el.classList.add("reveal"));

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const siblings = [...entry.target.parentElement.children].filter(
            child => child.classList.contains(entry.target.classList[0])
          );
          const idx = siblings.indexOf(entry.target);
          setTimeout(() => entry.target.classList.add("visible"), idx * 100);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach(el => observer.observe(el));
}

function initActiveNav() {
  const sections = document.querySelectorAll("section[id], .hero[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.remove("active"));
          const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
          if (active) active.classList.add("active");
        }
      });
    },
    { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
  );

  sections.forEach(section => observer.observe(section));
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function initFeedbackForm() {
  const form = document.getElementById("feedbackForm");
  const submitBtn = document.getElementById("feedbackSubmit");
  const formMsg = document.getElementById("feedbackMsg");

  if (!form || !submitBtn || !formMsg) return;

  if (window.emailjs && EMAILJS_PUBLIC_KEY !== "YOUR_EMAILJS_PUBLIC_KEY") {
    window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();

    const name = document.getElementById("feedbackName").value.trim();
    const email = document.getElementById("feedbackEmail").value.trim();
    const subject = document.getElementById("feedbackSubject").value.trim();
    const message = document.getElementById("feedbackMessage").value.trim();

    if (!name || !email || !subject || !message) {
      showFeedbackMessage(
        "Please fill in all required fields before submitting.",
        false
      );
      shake(submitBtn);
      return;
    }

    if (!isValidEmail(email)) {
      showFeedbackMessage("Please enter a valid email address.", false);
      shake(submitBtn);
      return;
    }

    if (
      !window.emailjs ||
      EMAILJS_PUBLIC_KEY === "YOUR_EMAILJS_PUBLIC_KEY" ||
      EMAILJS_SERVICE_ID === "YOUR_EMAILJS_SERVICE_ID" ||
      EMAILJS_TEMPLATE_ID === "YOUR_EMAILJS_TEMPLATE_ID"
    ) {
      showFeedbackMessage("Something went wrong. Please try again later.", false);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

    try {
      await window.emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);
      showFeedbackMessage(
        "Thank you! Your feedback has been sent successfully. We appreciate your time.",
        true
      );
      form.reset();
    } catch (error) {
      showFeedbackMessage("Something went wrong. Please try again later.", false);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Feedback';
    }
  });
}

function initContactForm() {
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const formMsg = document.getElementById("formMsg");

  if (!form || !submitBtn || !formMsg) return;

  form.addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("nameInput").value.trim();
    const email = document.getElementById("emailInput").value.trim();
    const type = document.getElementById("projectType").value;
    const message = document.getElementById("descInput").value.trim();

    if (!name || !email || !type || !message) {
      showFormMessage("Please fill in all fields before submitting.", false);
      shake(submitBtn);
      return;
    }

    if (!isValidEmail(email)) {
      showFormMessage("Please enter a valid email address.", false);
      shake(submitBtn);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

    setTimeout(() => {
      showFormMessage(
        `Thanks, ${name}! Team Nova Solutions has received your inquiry. Our team will contact you soon.`,
        true
      );
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Inquiry';
      form.reset();
    }, 1200);
  });
}

function showFeedbackMessage(message, isSuccess) {
  const formMsg = document.getElementById("feedbackMsg");
  if (!formMsg) return;

  formMsg.classList.toggle("is-success", isSuccess);
  formMsg.style.color = isSuccess ? "#22c55e" : "#ef4444";
  formMsg.textContent = message;
}

function showFormMessage(message, isSuccess) {
  const formMsg = document.getElementById("formMsg");
  if (!formMsg) return;

  formMsg.style.color = isSuccess ? "#22c55e" : "#ef4444";
  formMsg.textContent = message;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shake(el) {
  el.style.animation = "none";
  el.offsetHeight;
  el.style.animation = "shake .4s ease";
}

function initHeroPhoto() {
  const img = document.getElementById("heroPhoto");
  if (!img) return;

  img.onerror = () => {
    img.src = "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80";
  };
}

function injectKeyframes() {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-8px); }
      40% { transform: translateX(8px); }
      60% { transform: translateX(-5px); }
      80% { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);
}

document.addEventListener("DOMContentLoaded", () => {
  injectKeyframes();
  initSmoothScroll();
  initReveal();
  initActiveNav();
  initFeedbackForm();
  initContactForm();
  initHeroPhoto();
});
