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

  /* —— Audio (reuse game assets) —— */
  const AUDIO = {
    click: "assets/audio/sfx-click.mp3",
    hover: "assets/audio/sfx-hover.mp3",
    coin: "assets/audio/sfx-coin.mp3",
    heart: "assets/audio/sfx-heart.mp3",
    success: "assets/audio/sfx-success.mp3",
    chat: "assets/audio/sfx-chat.mp3",
    open: "assets/audio/ui-open.mp3",
    chime: "assets/audio/intro-chime.mp3",
    whoosh: "assets/audio/intro-whoosh.mp3",
    wind: "assets/audio/intro-wind.mp3",
    amb: "assets/audio/amb-day.mp3",
    ocean: "assets/audio/amb-ocean.mp3",
    splash: "assets/audio/splash.mp3",
  };

  const sfxCache = {};
  let windEl = null;
  let ambEl = null;
  let audioUnlocked = false;

  const playSfx = (key, vol = 0.45) => {
    const src = AUDIO[key];
    if (!src) return;
    try {
      let a = sfxCache[key];
      if (!a) {
        a = new Audio(src);
        sfxCache[key] = a;
      }
      a.volume = vol;
      a.currentTime = 0;
      void a.play().catch(() => {});
    } catch {
      /* ignore */
    }
  };

  const ensureLoop = (el, src, vol) => {
    if (!el) {
      el = new Audio(src);
      el.loop = true;
      el.volume = vol;
    }
    void el.play().catch(() => {});
    return el;
  };

  const startWind = () => {
    windEl = ensureLoop(windEl, AUDIO.wind, 0.28);
  };

  const startAmb = () => {
    ambEl = ensureLoop(ambEl, AUDIO.amb, 0.18);
  };

  const fadeOutAudio = (el, ms = 900) => {
    if (!el) return;
    const start = el.volume;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / ms);
      el.volume = start * (1 - p);
      if (p < 1) requestAnimationFrame(tick);
      else {
        el.pause();
        el.currentTime = 0;
        el.volume = start;
      }
    };
    requestAnimationFrame(tick);
  };

  const unlockAudio = () => {
    if (audioUnlocked) return;
    audioUnlocked = true;
    playSfx("click", 0.01);
  };

  /* —— Discovery beats (site version — more détail systèmes) —— */
  const BEATS = [
    {
      id: "silence",
      text: "",
      mode: "narration",
      holdMs: 2200,
      island: "hidden",
    },
    {
      id: "asleep",
      text: "Tu t'étais endormi·e…\nau milieu d'une conversation.",
      mode: "narration",
      holdMs: 4200,
      island: "hidden",
    },
    {
      id: "messages",
      text: "Sur Discord, les messages\ncontinuaient sans toi.",
      mode: "narration",
      holdMs: 4000,
      island: "hidden",
      sfx: "chat",
    },
    {
      id: "islandFormed",
      text: "Et quelque part,\nentre deux bulles…\nune île s'est formée.",
      mode: "title",
      holdMs: 4800,
      island: "dim",
      sfx: "whoosh",
      wind: true,
    },
    {
      id: "wake",
      text: "Tu ouvres les yeux…",
      mode: "narration",
      holdMs: 3200,
      island: "soft",
      wind: true,
    },
    {
      id: "breeze",
      text: "Le vent caresse l'herbe.\nL'air est doux. Salé. Calme.",
      mode: "narration",
      holdMs: 4200,
      island: "soft",
      wind: true,
    },
    {
      id: "guideIn",
      text: "…",
      mode: "guide",
      holdMs: 1400,
      island: "bright",
      guide: true,
      sfx: "chime",
      wind: true,
      amb: true,
    },
    {
      id: "welcome",
      text: "Bienvenue. Moi c'est Lila.\nJe vais te montrer comment fonctionne Discord Tomodachi —\npas juste l'ambiance : les vrais systèmes.",
      mode: "guide",
      holdMs: 0,
      island: "bright",
      guide: true,
      wind: true,
      amb: true,
    },
    {
      id: "friends",
      text: "L'île, c'est chez toi.\nTu invites tes amis Discord : ils apparaissent avec leur avatar,\ntu les déplaces, tu visites leur chambre.",
      mode: "guide",
      holdMs: 0,
      island: "bright",
      guide: true,
      icons: ["assets/icon-friends.png", "assets/icon-room.png"],
      sfx: "open",
    },
    {
      id: "chat",
      text: "Les messages ? Ce sont vos vrais DMs Discord.\nTu lis, tu réponds, tu envoies des GIFs…\ntout passe par ton PC, en local.",
      mode: "guide",
      holdMs: 0,
      island: "bright",
      guide: true,
      icons: ["assets/icon-ai.png", "assets/bubble-think.png"],
      sfx: "chat",
    },
    {
      id: "ai",
      text: "Une IA peut t'aider à répondre comme toi.\nElle apprend ton ton sur tes conversations locales —\ntu choisis quand elle parle.",
      mode: "guide",
      holdMs: 0,
      island: "bright",
      guide: true,
      icons: ["assets/icon-ai.png"],
      sfx: "success",
    },
    {
      id: "cafe",
      text: "Au café, tu offres gâteaux, sushi, jus…\nÇa monte le bonheur de tes amis.\nUn petit moment ASMR à chaque bouchée.",
      mode: "guide",
      holdMs: 0,
      island: "bright",
      guide: true,
      icons: [
        "assets/icon-cafe.png",
        "assets/food-cake.png",
        "assets/food-sushi.png",
        "assets/icon-heart-full.png",
      ],
      sfx: "heart",
    },
    {
      id: "games",
      text: "La salle de jeux : mini-jeux, quiz, studio dessin.\nTu gagnes des pièces pour décorer l'île\nou offrir des surprises.",
      mode: "guide",
      holdMs: 0,
      island: "bright",
      guide: true,
      icons: [
        "assets/icon-games.png",
        "assets/icon-coin.png",
        "assets/icon-studio.png",
      ],
      sfx: "coin",
    },
    {
      id: "room",
      text: "Dans une chambre : humeur, accessoires, déco.\nParfois un désordre à ranger,\nou un objet perdu à retrouver.",
      mode: "guide",
      holdMs: 0,
      island: "bright",
      guide: true,
      icons: ["assets/icon-room.png", "assets/decor-lamp.png"],
      sfx: "open",
    },
    {
      id: "decor",
      text: "Déco, saisons, atelier palette…\nTu plantes, tu places une fontaine,\nl'île change avec le jour et le temps.",
      mode: "guide",
      holdMs: 0,
      island: "bright",
      guide: true,
      icons: [
        "assets/decor-fountain.png",
        "assets/decor-plant.png",
        "assets/decor-balloon.png",
      ],
      sfx: "whoosh",
    },
    {
      id: "local",
      text: "Tout reste sur ta machine.\nTon token Discord, tes messages, ton style —\npas de cloud opaque pour vos discussions.",
      mode: "guide",
      holdMs: 0,
      island: "bright",
      guide: true,
      icons: ["assets/icon-gear.png"],
      sfx: "success",
    },
    {
      id: "access",
      text: "Pour jouer : rejoins le Discord officiel,\ndemande le rôle Licencié,\net l'app se débloque toute seule.",
      mode: "guide",
      holdMs: 0,
      island: "bright",
      guide: true,
      icons: ["assets/icon-heart-full.png", "assets/icon-coin.png"],
      sfx: "chime",
    },
    {
      id: "ready",
      text: "Voilà. Ton île t'attend —\ndoucement, à ton rythme.\nPrêt·e à la découvrir pour de vrai ?",
      mode: "guide",
      holdMs: 0,
      island: "bright",
      guide: true,
      sfx: "success",
      icons: ["assets/logo.png", "assets/mood-happy.png"],
    },
    {
      id: "out",
      text: "",
      mode: "narration",
      holdMs: 1000,
      island: "bright",
    },
  ];

  const splash = document.getElementById("splash");
  const site = document.getElementById("site");
  const floaties = document.getElementById("splash-floaties");
  const cursor = document.getElementById("cursor");
  const discoverEl = document.getElementById("discover");
  const discoverLine = document.getElementById("discover-line");
  const discoverIsland = document.getElementById("discover-island-wrap");
  const discoverGuide = document.getElementById("discover-guide");
  const discoverIcons = document.getElementById("discover-icons");
  const discoverProgress = document.getElementById("discover-progress");
  const discoverSkip = document.getElementById("discover-skip");

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
    floaties?.appendChild(img);
  });

  /* —— End splash —— */
  let finished = false;
  const finishSplash = () => {
    if (finished) return;
    finished = true;
    unlockAudio();
    playSfx("open", 0.35);
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
    if (discoverEl?.classList.contains("is-open")) return;
    if (e.key === "Enter" || e.key === " " || e.key === "Escape") finishSplash();
  });
  setTimeout(finishSplash, 3400);

  /* —— Showcase gallery —— */
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
      playSfx("hover", 0.25);
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

  /* —— Discovery tour —— */
  let beatIndex = 0;
  let tourTimer = 0;
  let tourOpen = false;
  let interactive = false;

  const setIsland = (mode) => {
    if (!discoverIsland) return;
    discoverIsland.classList.remove("is-dim", "is-soft", "is-bright");
    if (mode === "dim") discoverIsland.classList.add("is-dim");
    else if (mode === "soft") discoverIsland.classList.add("is-soft");
    else if (mode === "bright") discoverIsland.classList.add("is-bright");
  };

  const renderIcons = (icons) => {
    if (!discoverIcons) return;
    discoverIcons.innerHTML = "";
    (icons || []).forEach((src) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.className = "discover-icon";
      img.draggable = false;
      discoverIcons.appendChild(img);
    });
  };

  const renderBeat = (beat) => {
    if (!discoverLine) return;
    const lines = (beat.text || "").split("\n").filter(Boolean);
    interactive = beat.mode === "guide" && beat.holdMs === 0;

    discoverLine.classList.add("is-swap");
    window.setTimeout(() => {
      discoverLine.className = "discover-line";
      if (beat.mode === "guide") discoverLine.classList.add("is-side");
      if (beat.mode === "title") discoverLine.classList.add("is-title");

      if (!lines.length || beat.id === "guideIn") {
        discoverLine.innerHTML = "";
      } else if (beat.mode === "guide") {
        discoverLine.innerHTML = `
          <div class="discover-bubble">
            <div class="discover-bubble-name">Lila</div>
            ${lines.map((l) => `<p>${l}</p>`).join("")}
            ${interactive ? `<span class="discover-hint">Clique pour continuer</span>` : ""}
          </div>`;
      } else {
        const cls =
          beat.mode === "title" ? "discover-title-card" : "discover-narration";
        discoverLine.innerHTML = `<div class="${cls}">${lines
          .map((l) => `<p>${l}</p>`)
          .join("")}</div>`;
      }
    }, 220);

    setIsland(beat.island || "hidden");

    if (discoverGuide) {
      if (beat.guide) {
        discoverGuide.hidden = false;
        requestAnimationFrame(() => discoverGuide.classList.add("is-in"));
      } else {
        discoverGuide.classList.remove("is-in");
      }
    }

    renderIcons(beat.icons);

    if (beat.wind) startWind();
    if (beat.amb) startAmb();
    if (beat.sfx) playSfx(beat.sfx, beat.sfx === "whoosh" || beat.sfx === "chime" ? 0.55 : 0.4);

    if (discoverProgress) {
      const pct = (beatIndex / Math.max(1, BEATS.length - 1)) * 100;
      discoverProgress.style.width = `${pct}%`;
    }
  };

  const closeTour = () => {
    if (!tourOpen) return;
    tourOpen = false;
    interactive = false;
    window.clearTimeout(tourTimer);
    playSfx("click", 0.35);
    fadeOutAudio(windEl, 1000);
    fadeOutAudio(ambEl, 1000);
    discoverEl?.classList.add("is-leaving");
    document.body.style.overflow = "";
    window.setTimeout(() => {
      discoverEl?.classList.remove("is-open", "is-leaving");
      discoverEl?.setAttribute("hidden", "");
      discoverEl?.setAttribute("aria-hidden", "true");
      discoverGuide?.classList.remove("is-in");
      if (discoverGuide) discoverGuide.hidden = true;
      renderIcons([]);
      setIsland("hidden");
    }, 750);
  };

  const advance = () => {
    if (!tourOpen) return;
    beatIndex = Math.min(beatIndex + 1, BEATS.length - 1);
    const beat = BEATS[beatIndex];

    if (beat.id === "out") {
      renderBeat(beat);
      window.clearTimeout(tourTimer);
      tourTimer = window.setTimeout(closeTour, beat.holdMs || 1000);
      return;
    }

    renderBeat(beat);
    window.clearTimeout(tourTimer);
    if (beat.holdMs > 0) {
      tourTimer = window.setTimeout(advance, beat.holdMs);
    }
  };

  const startTour = () => {
    unlockAudio();
    playSfx("open", 0.45);
    beatIndex = 0;
    tourOpen = true;
    document.body.style.overflow = "hidden";
    discoverEl?.removeAttribute("hidden");
    discoverEl?.setAttribute("aria-hidden", "false");
    discoverEl?.classList.remove("is-leaving");
    requestAnimationFrame(() => discoverEl?.classList.add("is-open"));
    renderBeat(BEATS[0]);
    window.clearTimeout(tourTimer);
    if (BEATS[0].holdMs > 0) {
      tourTimer = window.setTimeout(advance, BEATS[0].holdMs);
    }
  };

  discoverEl?.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".discover-skip")) return;
    unlockAudio();
    if (interactive) {
      playSfx("click", 0.4);
      advance();
    }
  });

  discoverSkip?.addEventListener("click", (e) => {
    e.stopPropagation();
    closeTour();
  });

  window.addEventListener("keydown", (e) => {
    if (!tourOpen) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closeTour();
      return;
    }
    if ((e.key === "Enter" || e.key === " ") && interactive) {
      e.preventDefault();
      playSfx("click", 0.4);
      advance();
    }
  });

  document.getElementById("btn-discover")?.addEventListener("click", startTour);
  document.getElementById("btn-discover-2")?.addEventListener("click", startTour);

  // Soft hover clicks on main CTAs
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      if (!isTouch) playSfx("hover", 0.18);
    });
  });
})();
