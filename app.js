/* ==========================================================================
   Amr — personal site interactions
   Nav, scroll reveal, cursor glow, card spotlight, focus timer
   ========================================================================== */

(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ── Stethoscope intro ───────────────────────────────────────────────── */

  const intro = document.getElementById("intro");
  const introKey = "amr-intro-seen";
  let introSeen = false;

  try {
    introSeen = window.sessionStorage.getItem(introKey) === "1";
  } catch {
    introSeen = false;
  }

  if (intro) {
    const introSkip = document.getElementById("introSkip");
    const pageRegions = [
      document.querySelector(".nav-wrap"),
      document.getElementById("main"),
      document.querySelector(".footer"),
    ].filter(Boolean);

    const setPageInert = (inert) => {
      pageRegions.forEach((region) => {
        if (inert) region.setAttribute("inert", "");
        else region.removeAttribute("inert");
      });
    };

    let introDone = false;
    let introTimer = 0;

    const finishIntro = () => {
      if (introDone) return;
      introDone = true;
      window.clearTimeout(introTimer);

      intro.classList.add("is-done");
      document.body.classList.remove("intro-active");
      setPageInert(false);

      document.querySelectorAll(".hero .reveal").forEach((el) => el.classList.add("is-visible"));

      window.setTimeout(() => intro.remove(), 700);
    };

    if (reduceMotion || introSeen) {
      intro.remove();
      document.body.classList.remove("intro-active");
    } else {
      try {
        window.sessionStorage.setItem(introKey, "1");
      } catch {
        /* private mode / blocked storage — the intro will show again next load */
      }

      setPageInert(true);
      document.body.classList.add("intro-active");

      introTimer = window.setTimeout(finishIntro, 4400);

      if (introSkip) introSkip.addEventListener("click", finishIntro);

      intro.addEventListener("click", (event) => {
        if (event.target === intro) finishIntro();
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") finishIntro();
      });
    }
  }

  /* ── Footer year ─────────────────────────────────────────────────────── */

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ── Mobile navigation ───────────────────────────────────────────────── */

  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  function setNav(open) {
    if (!nav || !navToggle) return;
    nav.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      setNav(!nav.classList.contains("open"));
    });
  }

  if (navLinks) {
    navLinks.addEventListener("click", (event) => {
      if (event.target.closest("a")) setNav(false);
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setNav(false);
  });

  document.addEventListener("click", (event) => {
    if (nav && !nav.contains(event.target)) setNav(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 780) setNav(false);
  });

  /* ── Scroll reveal ───────────────────────────────────────────────────── */

  const revealItems = document.querySelectorAll(".reveal");

  if (!reduceMotion && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  /* ── Active nav link ─────────────────────────────────────────────────── */

  const navAnchors = Array.from(document.querySelectorAll("[data-nav]"));
  const sections = Array.from(document.querySelectorAll("main section[id]"));

  if ("IntersectionObserver" in window && sections.length) {
    const setActive = (id) => {
      navAnchors.forEach((anchor) => {
        anchor.classList.toggle("is-active", anchor.getAttribute("href") === `#${id}`);
      });
    };

    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => spy.observe(section));
  }

  /* ── Cursor glow ─────────────────────────────────────────────────────── */

  const glow = document.getElementById("cursorGlow");

  if (glow && canHover && !reduceMotion) {
    document.body.classList.add("has-cursor");
    let queued = false;
    let px = window.innerWidth / 2;
    let py = window.innerHeight / 2;

    window.addEventListener(
      "pointermove",
      (event) => {
        px = event.clientX;
        py = event.clientY;

        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
          glow.style.transform = `translate3d(${px - 260}px, ${py - 260}px, 0)`;
          queued = false;
        });
      },
      { passive: true }
    );
  }

  /* ── Card spotlight ──────────────────────────────────────────────────── */

  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    });
  });

  /* ── Focus timer ─────────────────────────────────────────────────────── */

  const timerCard = document.getElementById("timerCard");

  if (timerCard) {
    const timeEl = document.getElementById("timerTime");
    const stateEl = document.getElementById("timerState");
    const toggleBtn = document.getElementById("timerToggle");
    const resetBtn = document.getElementById("timerReset");
    const sessionsEl = document.getElementById("sessionCount");
    const ring = document.getElementById("ringProgress");
    const modeButtons = Array.from(timerCard.querySelectorAll(".mode"));

    const MODES = {
      focus: {
        minutes: 25,
        start: "Start focus",
        running: "Focus block · do one thing",
        paused: "Paused — breathe",
        ready: "Ready when you are",
        done: "Block complete — take a break",
      },
      short: {
        minutes: 5,
        start: "Start break",
        running: "Short break · step away",
        paused: "Paused — breathe",
        ready: "Short break, whenever you are",
        done: "Break done — back in",
      },
      long: {
        minutes: 15,
        start: "Start break",
        running: "Long break · actually rest",
        paused: "Paused — breathe",
        ready: "Long break, whenever you are",
        done: "Rested — ready again",
      },
    };

    const circumference = 2 * Math.PI * Number(ring.getAttribute("r"));
    ring.style.strokeDasharray = `${circumference} ${circumference}`;

    const todayKey = () => `amr-focus-${new Date().toISOString().slice(0, 10)}`;

    let sessions = 0;
    try {
      sessions = Number(window.localStorage.getItem(todayKey())) || 0;
    } catch {
      sessions = 0;
    }

    let mode = "focus";
    let total = MODES[mode].minutes * 60;
    let remaining = total;
    let running = false;
    let endAt = 0;
    let intervalId = null;

    const format = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    const render = () => {
      timeEl.textContent = format(remaining);
      ring.style.strokeDashoffset = String(circumference * (1 - remaining / total));
      sessionsEl.textContent = String(sessions);
    };

    const setState = (text) => {
      stateEl.textContent = text;
    };

    const saveSessions = () => {
      try {
        window.localStorage.setItem(todayKey(), String(sessions));
      } catch {
        /* private mode / blocked storage — sessions still count for this visit */
      }
    };

    /* Audio context is created on the first user gesture. */
    let audioCtx = null;

    const initAudio = () => {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;
      if (!audioCtx) audioCtx = new AudioContext();
      if (audioCtx.state === "suspended") audioCtx.resume();
      return audioCtx;
    };

    const chime = () => {
      const ctx = initAudio();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [880, 1174.66, 1567.98];

      notes.forEach((frequency, index) => {
        const start = now + index * 0.18;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.value = frequency;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.14, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.9);

        osc.connect(gain).connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 1);
      });
    };

    const stopInterval = () => {
      if (intervalId !== null) {
        window.clearInterval(intervalId);
        intervalId = null;
      }
    };

    const complete = () => {
      running = false;
      stopInterval();
      remaining = 0;
      render();

      toggleBtn.textContent = "Start again";
      setState(MODES[mode].done);

      if (mode === "focus") {
        sessions += 1;
        saveSessions();
        render();
      }

      chime();
    };

    const tick = () => {
      const next = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));

      if (next !== remaining) {
        remaining = next;
        render();
      }

      if (next <= 0) complete();
    };

    const start = () => {
      initAudio();

      if (remaining <= 0) remaining = total;
      running = true;
      endAt = Date.now() + remaining * 1000;

      toggleBtn.textContent = "Pause";
      setState(MODES[mode].running);

      stopInterval();
      intervalId = window.setInterval(tick, 250);
      tick();
    };

    const pause = () => {
      running = false;
      stopInterval();
      remaining = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));

      toggleBtn.textContent = "Resume";
      setState(MODES[mode].paused);
      render();
    };

    const reset = () => {
      running = false;
      stopInterval();
      remaining = total;
      toggleBtn.textContent = MODES[mode].start;
      setState(MODES[mode].ready);
      render();
    };

    const setMode = (next) => {
      mode = next;
      total = MODES[mode].minutes * 60;
      remaining = total;
      running = false;
      stopInterval();

      modeButtons.forEach((button) => {
        const active = button.dataset.mode === mode;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });

      toggleBtn.textContent = MODES[mode].start;
      setState(MODES[mode].ready);
      render();
    };

    toggleBtn.addEventListener("click", () => {
      if (running) {
        pause();
      } else {
        start();
      }
    });

    resetBtn.addEventListener("click", reset);

    modeButtons.forEach((button) => {
      button.addEventListener("click", () => setMode(button.dataset.mode));
    });

    document.addEventListener("keydown", (event) => {
      const tag = document.activeElement?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA" || document.activeElement?.isContentEditable;
      const interactive = tag === "BUTTON" || tag === "A";

      if (event.code !== "Space" || typing || interactive) return;

      const rect = timerCard.getBoundingClientRect();
      const visible = rect.top < window.innerHeight * 0.8 && rect.bottom > window.innerHeight * 0.2;

      if (!visible) return;
      event.preventDefault();
      running ? pause() : start();
    });

    render();
  }
})();
