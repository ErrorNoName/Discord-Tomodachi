(() => {
  const FLOATY_SRC = [
    "assets/icon-heart-full.png",
    "assets/icon-coin.png",
    "assets/food-cake.png",
    "assets/food-apple.png",
    "assets/food-cookie.png",
    "assets/food-juice.png",
    "assets/food-burger.png",
    "assets/icon-heart-full.png",
    "assets/icon-coin.png",
    "assets/food-sushi.png",
    "assets/decor-balloon.png",
    "assets/mood-happy.png",
  ];

  const SCREENS = [
    {
      src: "assets/screens/island.png",
      thumb: "assets/screens/thumb-island.png",
      kicker: "L’île",
      text: "Tes amis Discord vivent ici, sous le soleil de ton monde.",
    },
    {
      src: "assets/screens/cafe.png",
      thumb: "assets/screens/thumb-cafe.png",
      kicker: "Été",
      text: "Café, pièces et mini-jeux quand l’île est en pleine lumière.",
    },
    {
      src: "assets/screens/room.png",
      thumb: "assets/screens/thumb-room.png",
      kicker: "Chambre",
      text: "Entre chez un ami — humeur, accessoires, souvenirs.",
    },
    {
      src: "assets/screens/intro.png",
      thumb: "assets/screens/thumb-intro.png",
      kicker: "Aube",
      text: "Lila te réveille et te guide dès la première visite.",
    },
    {
      src: "assets/screens/night.png",
      thumb: "assets/screens/thumb-night.png",
      kicker: "Nuit",
      text: "L’île change avec les saisons et le cycle du jour.",
    },
  ];

  const splash = document.getElementById("splash");
  const site = document.getElementById("site");
  const floaties = document.getElementById("splash-floaties");
  const cursor = document.getElementById("cursor");

  const isTouch =
    matchMedia("(pointer: coarse)").matches ||
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0;

  if (isTouch) document.body.classList.add("is-touch");

  /* —— Custom cursor —— */
  if (!isTouch && cursor) {
    let x = innerWidth / 2;
    let y = innerHeight / 2;
    let rx = x;
    let ry = y;

    const tick = () => {
      rx += (x - rx) * 0.35;
      ry += (y - ry) * 0.35;
      cursor.style.left = `${rx}px`;
      cursor.style.top = `${ry}px`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    window.addEventListener(
      "pointermove",
      (e) => {
        x = e.clientX;
        y = e.clientY;
      },
      { passive: true },
    );

    window.addEventListener("pointerdown", () => cursor.classList.add("is-click"));
    window.addEventListener("pointerup", () => cursor.classList.remove("is-click"));
  }

  /* —— Splash floaties —— */
  FLOATY_SRC.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    img.className = "splash-floaty";
    img.alt = "";
    img.draggable = false;
    const size = 34 + (i % 4) * 12;
    img.style.width = `${size}px`;
    img.style.height = `${size}px`;
    img.style.left = `${5 + i * 7.8}%`;
    img.style.animationDelay = `${(i % 6) * 0.35}s`;
    img.style.animationDuration = `${3.2 + (i % 4) * 0.55}s`;
    floaties.appendChild(img);
  });

  /* —— End splash (no loading bar) —— */
  let finished = false;
  const finishSplash = () => {
    if (finished) return;
    finished = true;
    splash.classList.add("is-done");
    site.classList.remove("is-hidden");
    requestAnimationFrame(() => site.classList.add("is-visible"));
    setTimeout(() => {
      splash.remove();
      splash.setAttribute("aria-hidden", "true");
    }, 1300);
  };

  splash.addEventListener("pointerdown", finishSplash);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " " || e.key === "Escape") finishSplash();
  });
  // Auto-enter after the logo moment — still no loading UI
  setTimeout(finishSplash, 3400);

  /* —— Showcase gallery (main + thumbs) —— */
  let idx = 0;
  const imgEl = document.getElementById("screen-img");
  const capEl = document.getElementById("screen-caption");
  const thumbs = document.getElementById("screen-thumbs");
  const mainFig = document.querySelector(".showcase-main");

  const show = (n, { user } = {}) => {
    idx = (n + SCREENS.length) % SCREENS.length;
    const s = SCREENS[idx];
    if (!imgEl || !capEl) return;

    const apply = () => {
      imgEl.src = s.src;
      imgEl.alt = `${s.kicker} — ${s.text}`;
      capEl.innerHTML = `<span class="showcase-kicker">${s.kicker}</span><span class="showcase-text">${s.text}</span>`;
      thumbs?.querySelectorAll(".showcase-thumb").forEach((b, i) => {
        b.classList.toggle("is-active", i === idx);
        b.setAttribute("aria-selected", i === idx ? "true" : "false");
      });
      mainFig?.classList.remove("is-swap");
    };

    if (user && mainFig) {
      mainFig.classList.add("is-swap");
      setTimeout(apply, 160);
    } else {
      apply();
    }
  };

  SCREENS.forEach((s, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "showcase-thumb";
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", s.kicker);
    b.innerHTML = `<img src="${s.thumb}" alt="" draggable="false" />`;
    b.addEventListener("click", () => show(i, { user: true }));
    thumbs?.appendChild(b);
  });

  show(0);
  setInterval(() => show(idx + 1), 6000);

  /* —— Scroll reveal —— */
  const revealables = document.querySelectorAll(
    ".section, .food-strip, .footer",
  );
  revealables.forEach((el) => el.classList.add("reveal"));
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  revealables.forEach((el) => io.observe(el));
})();
