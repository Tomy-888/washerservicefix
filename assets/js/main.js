/* WASHERSERVICE FIX • кнопки и содержимое. Не требует сторонних библиотек */
(() => {
  "use strict";
  const config = window.SITE_CONFIG || {};
  const symptoms = [
    ["water", "Не сливает воду", "Вода остаётся после стирки"],
    ["spin", "Не отжимает бельё", "Бельё остаётся мокрым"],
    ["power", "Не включается", "Машинка не запускается"],
    ["volume", "Шумит и стучит", "Шум или вибрация"],
    ["drops", "Протекает вода", "Вода под машинкой"],
    ["warning", "Показывает ошибку", "На дисплее код ошибки"],
    ["more", "Другая проблема", "Нужна консультация"],
  ];
  const grid = document.getElementById("problemGrid");
  grid.innerHTML = symptoms
    .map(
      ([icon, title], i) =>
        `<button class="problem-card" type="button" data-problem="${i}" aria-label="${title}. Написать в WhatsApp"><svg aria-hidden="true"><use href="#i-${icon}"></use></svg><strong>${title}</strong><span class="wa-label"><svg aria-hidden="true"><use href="#i-wa"></use></svg>Написать<br>в WhatsApp</span></button>`,
    )
    .join("");
  const services = (window.SITE_DATA && window.SITE_DATA.services) || [];
  document.getElementById("serviceGrid").innerHTML = services
    .map(
      ([title, items]) =>
        `<details class="service-card"><summary>${title}</summary><ul>${items.map((x) => `<li>${x}</li>`).join("")}</ul></details>`,
    )
    .join("");
  const dialog = document.getElementById("configModal");
  function openWA(message) {
    const number = String(config.whatsapp || config.phone || "").replace(
      /\D/g,
      "",
    );
    if (!number) {
      dialog.showModal();
      return;
    }
    window.open(
      `https://wa.me/${number}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }
  document.addEventListener("click", (e) => {
    const p = e.target.closest("[data-problem]");
    if (p) {
      const v = symptoms[Number(p.dataset.problem)];
      openWA(
        `Здравствуйте! Нужен ремонт стиральной машины в Алматы, Казахстан. Проблема: ${v[1]}. ${v[2]}. Подскажите, пожалуйста, ориентировочную стоимость и ближайшее время выезда.`,
      );
      return;
    }
    const b = e.target.closest("[data-wa]");
    if (b) openWA(b.dataset.wa);
  });
  const toggle = document.getElementById("toggleServices");
  const content = document.getElementById("serviceDetails");
  toggle.addEventListener("click", () => {
    content.hidden = !content.hidden;
    toggle.setAttribute("aria-expanded", String(!content.hidden));
    toggle.innerHTML = content.hidden
      ? "Посмотреть все виды ремонта <span>↓</span>"
      : "Свернуть перечень <span>↑</span>";
    if (!content.hidden)
      content.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
  // Открываем полный перечень при переходе по пункту «Услуги».
  document.querySelectorAll('a[href="#services"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      content.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      toggle.innerHTML = "Свернуть перечень <span>↑</span>";
      document
        .getElementById("serviceDetails")
        .scrollIntoView({ behavior: "smooth", block: "start" });
    }),
  );
  const menu = document.getElementById("mobileNav"),
    menuToggle = document.getElementById("menuToggle");
  menuToggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute(
      "aria-label",
      open ? "Закрыть меню" : "Открыть меню",
    );
  });
  menu.querySelectorAll("a").forEach((el) =>
    el.addEventListener("click", () => {
      menu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }),
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      menu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
  document
    .getElementById("closeModal")
    .addEventListener("click", () => dialog.close());
  document
    .getElementById("closeModalAction")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
  document.getElementById("year").textContent = new Date().getFullYear();
})();
