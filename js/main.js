function initPickup(reduceMotion) {
  const countEl = document.querySelector("[data-pickup-count]");
  const dotsEl = document.querySelector(".pickup__dots");
  const windowEl = document.querySelector(".pickup__window");
  const track = document.querySelector(".pickup__track");
  const visual = document.querySelector(".hero__visual");
  if (!countEl || !dotsEl || !windowEl || !track || !visual) return;

  const slides = [
    {
      title: "特集：砂防の防災減災技術・最新技術特集：砂防の防災",
      text: "新技術情報提供システム（NETIS）に登録された砂防関係の新技術を紹介。土砂災害対策工の新たな可能性を探ります。",
      date: "2026/08/01",
      image: "images/hero.jpg",
      alt: "緑の山々に囲まれたダムと放水路",
      focus: "center center"
    },
    {
      title: "特集：砂防の防災減災技術・最新技術特集：砂防の防災",
      text: "新技術情報提供システム（NETIS）に登録された砂防関係の新技術を紹介。土砂災害対策工の新たな可能性を探ります。",
      date: "2026/09/01",
      image: "images/hero.jpg",
      alt: "ダム堤体と放水路を左寄りに見た写真",
      focus: "left center"
    },
    {
      title: "特集：砂防の防災減災技術・最新技術特集：砂防の防災",
      text: "新技術情報提供システム（NETIS）に登録された砂防関係の新技術を紹介。土砂災害対策工の新たな可能性を探ります。",
      date: "2026/10/01",
      image: "images/hero.jpg",
      alt: "ダム湖と周囲の森を右寄りに見た写真",
      focus: "right center"
    },
    {
      title: "特集：砂防の防災減災技術・最新技術特集：砂防の防災",
      text: "新技術情報提供システム（NETIS）に登録された砂防関係の新技術を紹介。土砂災害対策工の新たな可能性を探ります。",
      date: "2026/11/01",
      image: "images/hero.jpg",
      alt: "遠景の山並みとダム湖を上寄りに見た写真",
      focus: "center top"
    },
    {
      title: "特集：砂防の防災減災技術・最新技術特集：砂防の防災",
      text: "新技術情報提供システム（NETIS）に登録された砂防関係の新技術を紹介。土砂災害対策工の新たな可能性を探ります。",
      date: "2026/12/01",
      image: "images/hero.jpg",
      alt: "放水路と下流側の敷地を見た写真",
      focus: "30% 80%"
    },
    {
      title: "特集：砂防の防災減災技術・最新技術特集：砂防の防災",
      text: "新技術情報提供システム（NETIS）に登録された砂防関係の新技術を紹介。土砂災害対策工の新たな可能性を探ります。",
      date: "2027/01/01",
      image: "images/hero.jpg",
      alt: "ダム湖の右岸と堤体を見た写真",
      focus: "75% 35%"
    }
  ];

  const pickupDuration = 5000;
  let pickupIndex = 2;
  let meterFrame = 0;

  const slideEls = slides.map((slide) => {
    const article = document.createElement("article");
    article.className = "pickup__slide";
    const body = document.createElement("div");
    body.className = "pickup__body";
    const title = document.createElement("h2");
    title.className = "pickup__title";
    title.textContent = slide.title;
    const text = document.createElement("p");
    text.className = "pickup__text";
    text.textContent = slide.text;
    const date = document.createElement("p");
    date.className = "pickup__date";
    date.textContent = slide.date;
    body.append(title, text, date);
    article.append(body);
    track.append(article);
    return article;
  });

  const visualImgs = slides.map((slide) => {
    const img = document.createElement("img");
    img.className = "hero__image";
    img.src = slide.image;
    img.alt = slide.alt;
    img.width = 1800;
    img.height = 1350;
    img.style.objectPosition = slide.focus;
    visual.append(img);
    return img;
  });

  function startMeter() {
    window.cancelAnimationFrame(meterFrame);
    const started = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - started) / pickupDuration);
      const meter = dotsEl.querySelector('[aria-selected="true"] .pickup__meter');
      if (meter) meter.style.transform = `scaleX(${progress})`;
      if (progress >= 1) {
        movePickup((pickupIndex + 1) % slides.length, true);
        return;
      }
      meterFrame = window.requestAnimationFrame(tick);
    };
    meterFrame = window.requestAnimationFrame(tick);
  }

  function movePickup(index, animate, restartMeter = true) {
    pickupIndex = index;
    const width = windowEl.clientWidth;
    slideEls.forEach((slide, slideIndex) => {
      slide.style.width = `${width}px`;
      slide.setAttribute("aria-hidden", slideIndex === index ? "false" : "true");
    });
    const instant = !animate || reduceMotion.matches;
    track.classList.toggle("pickup__track--instant", instant);
    visual.classList.toggle("hero__visual--instant", instant);
    track.style.transform = `translate3d(${-index * width}px, 0, 0)`;
    visualImgs.forEach((img, imageIndex) => {
      const active = imageIndex === index;
      img.classList.toggle("hero__image--active", active);
      img.setAttribute("aria-hidden", active ? "false" : "true");
    });
    countEl.textContent = `${index + 1} / ${slides.length}`;
    dotsEl.querySelectorAll("button").forEach((button, buttonIndex) => {
      const selected = buttonIndex === index;
      button.setAttribute("aria-selected", selected ? "true" : "false");
      button.tabIndex = selected ? 0 : -1;
      if (!selected) {
        const meter = button.querySelector(".pickup__meter");
        if (meter) meter.style.transform = "scaleX(0)";
      }
    });
    if (restartMeter) startMeter();
  }

  slides.forEach((slide, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "pickup__dot";
    button.setAttribute("role", "tab");
    button.setAttribute("aria-label", `${index + 1}枚目`);
    const meter = document.createElement("span");
    meter.className = "pickup__meter";
    meter.setAttribute("aria-hidden", "true");
    button.append(meter);
    button.addEventListener("click", () => movePickup(index, true));
    dotsEl.append(button);
  });

  movePickup(pickupIndex, false);

  window.addEventListener("resize", () => movePickup(pickupIndex, false, false));
}

function initMenu() {
  const menuButton = document.querySelector(".menu-btn");
  const overlay = document.querySelector(".nav");
  const panel = document.querySelector(".nav__panel");
  if (!menuButton || !overlay || !panel) return;

  let menuOpen = false;
  let closeTimer = 0;
  let openFrame = 0;

  function setMenu(open) {
    if (open === menuOpen) return;
    menuOpen = open;
    window.clearTimeout(closeTimer);
    window.cancelAnimationFrame(openFrame);
    menuButton.classList.toggle("menu-btn--open", open);
    menuButton.setAttribute("aria-expanded", open ? "true" : "false");
    menuButton.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
    document.body.classList.toggle("u-scroll-lock", open);

    if (open) {
      overlay.hidden = false;
      openFrame = requestAnimationFrame(() => {
        openFrame = requestAnimationFrame(() => {
          if (menuOpen) overlay.classList.add("nav--open");
        });
      });
      return;
    }

    overlay.classList.remove("nav--open");
    closeTimer = window.setTimeout(() => {
      if (!menuOpen) overlay.hidden = true;
    }, 400);
  }

  menuButton.addEventListener("click", () => {
    setMenu(!menuOpen);
  });

  overlay.addEventListener("click", (event) => {
    if (!panel.contains(event.target)) setMenu(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.classList.contains("nav--open")) setMenu(false);
  });

  overlay.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });
}

function initReveal(reduceMotion) {
  const revealEls = document.querySelectorAll(".reveal");
  const about = document.querySelector(".about");
  const hero = document.querySelector(".hero");

  function showReveal(el) {
    if (el.classList.contains("about")) {
      el.classList.add("about--in");
      return;
    }
    el.classList.add("reveal--in");
  }

  if (reduceMotion.matches) {
    revealEls.forEach(showReveal);
    if (about) about.classList.add("about--in");
    return;
  }

  const heroReveals = hero ? hero.querySelectorAll(".reveal") : [];
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        showReveal(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0 }
  );

  revealEls.forEach((el) => {
    if (hero && hero.contains(el)) return;
    observer.observe(el);
  });

  if (about) observer.observe(about);

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      heroReveals.forEach(showReveal);
    });
  });

  if (!hero && !about) return;

  let parallaxFrame = 0;

  const updateParallax = () => {
    parallaxFrame = 0;
    if (hero) {
      const shift = Math.max(-64, Math.min(64, -hero.getBoundingClientRect().top * 0.14));
      hero.style.setProperty("--hero-shift", `${shift}px`);
    }
    if (about) {
      const rect = about.getBoundingClientRect();
      const center = rect.top + rect.height * 0.45 - window.innerHeight * 0.5;
      const shift = Math.max(-42, Math.min(42, -center * 0.045));
      about.style.setProperty("--about-shift", `${shift}px`);
    }
  };

  const onScroll = () => {
    if (parallaxFrame) return;
    parallaxFrame = window.requestAnimationFrame(updateParallax);
  };

  updateParallax();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
}

function initBanner(reduceMotion) {
  const banner = document.querySelector(".hero__banner");
  const footer = document.querySelector(".site-footer");
  if (!banner || !footer) return;

  const markBannerReady = (event) => {
    if (event.target !== banner || event.propertyName !== "opacity") return;
    banner.classList.add("hero__banner--ready");
    banner.removeEventListener("transitionend", markBannerReady);
  };
  banner.addEventListener("transitionend", markBannerReady);
  if (reduceMotion.matches) banner.classList.add("hero__banner--ready");

  const bannerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      banner.classList.toggle("hero__banner--hidden", entry.isIntersecting);
    });
  });
  bannerObserver.observe(footer);
}

function initPage() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  initPickup(reduceMotion);
  initMenu();
  initReveal(reduceMotion);
  initBanner(reduceMotion);
}

if (window.__includesReady) {
  initPage();
} else {
  document.addEventListener("includes:ready", initPage, { once: true });
}
