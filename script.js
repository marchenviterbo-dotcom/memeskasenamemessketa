/* =============================================================
   FIRST MONTHSARY — Bradley ♡ Chen — 09.23.26
   script.js  (vanilla JS, no libraries, works on GitHub Pages)

   Sections:
    0. ASSETS  ← edit image/audio paths & photo roles here
    1. CONTENT ← edit jokes, messages, quiz, rewards here
    2. App state
    3. Utilities
    4. Images (hydrate, fallback, preload)
    5. Navigation / transitions
    6. Particles (floating background) + tap bursts
    7. Fireworks / confetti (canvas)
    8. UI pieces: reaction row, peek, toast, modal
    9. Runaway buttons
   10. Screen 0 — scanner
   11. Screen 1 — love verification
   12. Screen 2 — commitment test
   13. Screen 3 — research institute
   14. Screen 4 — boyfriend exam
   15. Screen 5 — mystery rewards
   16. Transition + Screen 6 — things I unfortunately love
   17. Easter eggs (Bradley heads, secret flower)
   18. Screen 7 — fake ending + blackout
   19. Audio
   20. Screen 8 — final letter + final question
   21. Ending + certificate
   22. Init
   ============================================================= */
(function () {
  "use strict";

  /* ===========================================================
     0. ASSETS — every path is RELATIVE (works on GitHub Pages)
     If a file name / extension is different on your side,
     change it here. File names ARE case-sensitive online.
     =========================================================== */
  var IMAGE_DIR = "assets/images/";
  var IMAGE_FILES = {
    P1: "P1.jpeg",   P2: "P2.jpeg",   P3: "P3.jpeg",   P4: "P4.jpeg",   P5: "P5.jpeg",
    P6: "P6.jpeg",   P7: "P7.jpeg",   P8: "P8.jpeg",   P9: "P9.jpeg",
    P10: "P10.jpg",  P11: "P11.jpg",  P12: "P12.jpg",  P13: "P13.jpg",  P14: "P14.jpg",
    P15: "P15.jpg",  P16: "P16.jpg",
    P17: "P17.jpeg", P18: "P18.jpeg", P19: "P19.jpeg", P20: "P20.jpeg", P21: "P21.jpeg",
    P22: "P22.jpeg", P23: "P23.jpeg", P24: "P24.jpeg", P25: "P25.jpeg", P26: "P26.jpeg",
    P27: "P27.jpeg", P28: "P28.jpeg", P29: "P29.jpeg", P30: "P30.jpeg", P31: "P31.jpeg",
    P32: "P32.jpeg", P33: "P33.jpeg", P34: "P34.jpeg", P35: "P35.jpeg", P36: "P36.jpeg",
    P37: "P37.jpeg", P38: "P38.jpeg", P39: "P39.jpeg", P40: "P40.jpeg",
    // added in the revision (copied unmodified from the originals you sent)
    P41: "P41.jpg",  // egg-looking Bradley close-up
    P42: "P42.png"   // blurry dancing Bradley
  };
  var AUDIO_SRC = "assets/audio/song.mp3";
  var MUSIC_VOLUME = 0.35;

  /* Which photo plays which role. To swap a photo, change `img`.
     `pos` = CSS object-position (which part of the photo stays in frame). */
  var IMAGE_ROLES = {
    // Screen 0 — scanner
    databaseChen:        { img: "P12", alt: "Girlfriend database photo: Chen", pos: "62% 30%" },
    scannerBradley:      { img: "P9",  alt: "Bradley, caught on the scanner camera", pos: "50% 30%" },
    triedIt:             { img: "P17", alt: "smirking kid reaction" },
    pointing:            { img: "P1",  alt: "woman pointing and yelling" },
    // Screen 1 — love verification
    caught4k:            { img: "P28", alt: "suspicious side-eye chihuahua" },
    angryKid:            { img: "P20", alt: "angry frowning toddler" },
    gfNotified:          { img: "P13", alt: "", pos: "54% 28%" },
    blushCat:            { img: "P21", alt: "blushing cat surrounded by hearts" },
    kissSmall:           { img: "P2",  alt: "Bradley kissing Chen on the cheek", pos: "50% 40%" },
    // Screen 2 — commitment test
    audacity:            { img: "P31", alt: "dramatic 'the audacity' reaction" },
    heartHands:          { img: "P18", alt: "heart-hands reaction" },
    // Screen 3 — research institute
    infestation:         { img: "P6",  alt: "Chen and Bradley being goofy up close", pos: "50% 45%" },
    tigrealLaugh:        { img: "P25", alt: "woman laughing behind her hand" },
    grumpyCat:           { img: "P19", alt: "grumpy grey cat" },
    aftermath:           { img: "P8",  alt: "Chen and Bradley laughing and screaming", pos: "50% 40%" },
    softCat:             { img: "P38", alt: "blushing cat with pink hearts" },
    // Screen 4 — exam
    quizCorrect:         { img: "P10", alt: "", pos: "50% 28%" },
    quizWatching:        { img: "P11", alt: "", pos: "50% 26%" },
    quizMilo:            { img: "P14", alt: "Chen at a café table", pos: "46% 38%" },
    quizFunny:           { img: "P15", alt: "Chen posing", pos: "50% 30%" },
    quizFatal:           { img: "P16", alt: "Chen mid-chaos with face paint" },
    quizBeSerious:       { img: "P22", alt: "sassy reaction" },
    quizAfterEverything: { img: "P23", alt: "crying, confused reaction" },
    quizExplain:         { img: "P24", alt: "'explain yourself' hand-gesture reaction" },
    quizJelly:           { img: "P35", alt: "shocked, nail-biting reaction" },
    quizPassed:          { img: "P32", alt: "Bradley and Chen smiling together", pos: "50% 38%" },
    // Screen 5 — rewards
    approvedCat:         { img: "P26", alt: "fluffy white cat up close" },
    rewardKiss:          { img: "P30", alt: "Bradley kissing Chen on the cheek", pos: "50% 40%" },
    rewardHug:           { img: "P4",  alt: "Bradley and Chen hugging and smiling", pos: "50% 35%" },
    rewardBradley:       { img: "P34", alt: "an extremely close-up Bradley", pos: "50% 50%" },
    // Transition + Screen 6
    heartPose:           { img: "P37", alt: "heart-hands pose" },
    thingsTaped:         { img: "P27", alt: "Bradley and Chen smiling", pos: "50% 40%" },
    thingsEyes:          { img: "P29", alt: "Chen and Bradley, very close", pos: "62% 40%" },
    thingsFace:          { img: "P5",  alt: "Chen resting her head on Bradley's", pos: "50% 45%" },
    thingsKindness:      { img: "P33", alt: "Bradley and Chen, cheek to cheek", pos: "45% 40%" },
    thingsEgg:           { img: "P34", alt: "Bradley, extremely up close", pos: "50% 50%" },
    thingsMoments:       { img: "P42", alt: "a blurry photo of Bradley dancing", pos: "50% 45%" },
    // Easter egg heads (P41 cut into circles with CSS) — all 5 collectibles use this
    eggHead:             { img: "P41", alt: "", pos: "50% 58%" },
    // Screen 7 — fake ending
    exitCry:             { img: "P39", alt: "crying reaction" },
    nervousPeek:         { img: "P40", alt: "", pos: "50% 40%" },
    // Final letter + ending — P7 is reserved for here only
    favorite:            { img: "P7",  alt: "Chen and Bradley", pos: "50% 44%" }
  };

  /* ===========================================================
     1. CONTENT — jokes & text used by the interactive parts
     (the letter itself lives in index.html)
     =========================================================== */
  var CONTENT = {
    scanner: {
      tiredAfter: 6,
      tiredLabel: "no (tired)",
      attempts: {
        1: { text: "bro really tried it", sticker: "triedIt" },
        3: { text: "WHY ARE YOU PRESSING THAT???", sticker: "pointing" }
      },
      tired: "okay. the button is tired now.",
      verified: "Chen’s bb (verified ✓)",
      denied: {
        eyebrow: "ERROR 403",
        title: "Access denied.",
        text: "Why are you here then??? 😭",
        button: "↻ retry verification"
      }
    },

    love: {
      messages: [
        "Excuse me?",
        "Why are you chasing that button 🤨",
        "BRADLEY.",
        "Last warning.",
        "I’m telling your girlfriend."
      ],
      stickers: {
        2: { sticker: "caught4k", cap: "caught in 4K" },
        4: { sticker: "angryKid", cap: "BA’T MO BA PINIPILIT????" }
      },
      peek: { at: 5, img: "gfNotified", cap: "girlfriend notified ✓" },
      removed: "Feature removed due to misuse."
    },

    // tiny tutorial shown right after "YES, THAT'S ME" (the practice head never counts)
    tutorial: {
      title: "WAIT — ONE MORE THING.",
      line: "There are 5 tiny Bradleys hiding around this website. 👀",
      tap: "If you see one, TAP HIM.",
      goal: "Collect all 5 before you finish the website to unlock a secret achievement.",
      demoCap: "example Bradley. (this one doesn’t count)",
      demoPoked: "exactly. like that. 😌",
      button: "GOT IT. FIND THE BRADLEYS."
    },

    commit: {
      questions: [
        { q: "Sure ka sakin?", a: [{ label: "yes ♡", cls: "btn--pink" }] },
        { q: "Sure sure?", a: [{ label: "YES 😭", cls: "btn--pink" }] },
        { q: "Bisag sabaan kayko?", a: [{ label: "YES 😭", cls: "btn--blue" }] },
        { q: "Bisag sige kog panlood ug palambing?", a: [{ label: "YES, BB ♡", cls: "btn--grad" }] },
        { q: "Would you stop calling me Tigreal? 😠", a: [{ label: "YES, I TAKE IT BACK", cls: "btn--pink" }, { label: "NO, I’LL KEEP CALLING YOU TIGREAL", runaway: true }] }
      ],
      // messages when he chases the wrong (runaway) answer on question 5
      takeBack: {
        1: { text: "BRADLEY. 😠", sticker: "audacity", cap: "the AUDACITY" },
        2: { text: "NAGAGALT NA AKO." },
        3: { text: "TIGIL MO YAN BRADING 😭" },
        4: { text: "LAST WARNING." }
      },
      takeBackMax: 4, // one more try after LAST WARNING and the wrong answer disappears
      final: {
        title: "FINAL ANSWER?",
        sub: "This decision is legally binding according to absolutely nobody.",
        button: "🔒 LOCK IN CHEN"
      },
      contract: {
        stamp: "CONTRACT ACCEPTED.",
        title: "GIRLFRIEND SUCCESSFULLY LOCKED IN.",
        terms: ["No refunds.", "No exchanges.", "No warranty.", "Lots of lambing."]
      }
    },

    exam: [
      {
        q: "What’s Chen’s favorite color?",
        options: [
          { t: "Blue", say: "after everything we’ve been through???", sub: "blue is YOUR color, bb.", sticker: "quizAfterEverything" },
          { t: "Pink", ok: true, say: "correct ♡ (the website was a hint)" },
          { t: "Beige", say: "beige??? BEIGE???", sticker: "quizBeSerious", cap: "be serious." },
          { t: "RGB", say: "I am not a gaming keyboard." }
        ]
      },
      {
        q: "Who are Chen’s current babies/pets?",
        options: [
          { t: "Peanut and Jelly", say: "so close. and yet so far.", sticker: "quizJelly", cap: "who is JELLY???" },
          { t: "Chickenae and Tigreal", say: "those are MY names 😭", fatal: true },
          { t: "Peanut and Butter", ok: true, say: "correct. the babies approve ♡" },
          { t: "Salt and Pepper", say: "you’re just naming condiments now." }
        ]
      },
      {
        q: "What drink does Chen like?",
        side: "quizMilo",
        options: [
          { t: "Coffee", say: "wrong. she’s watching you.", peek: "quizWatching", peekCap: "Interesting choice." },
          { t: "Milk tea", say: "close. but no." },
          { t: "Milo", ok: true, say: "correct. Milo supremacy." },
          { t: "Just water", say: "hydrated, but wrong." }
        ]
      },
      {
        q: "Is Chen funny?",
        side: "quizFunny",
        options: [
          { t: "Yes", ok: true, say: "correct." },
          { t: "Very", ok: true, say: "correct ♡" },
          { t: "Extremely", ok: true, say: "EXTREMELY correct." },
          { t: "No", dishonest: true }
        ]
      },
      {
        q: "Who’s Chen’s main hero in Mobile Legends?",
        options: [
          { t: "Layla", say: "Layla?? respectfully, no." },
          { t: "Tigreal", say: "we are NOT doing this again.", sticker: "quizExplain", cap: "explain yourself." },
          { t: "Nana", say: "cute guess. still wrong." },
          { t: "Cecilion", ok: true, say: "correct ♡" }
        ]
      }
    ],
    examCorrectPeek: { img: "quizCorrect", cap: "girlfriend approves" },
    dishonesty: ["This test has detected dishonesty.", "Girlfriend services are temporarily suspended."],
    dishonestyRetry: "(you may choose again.)",
    fatal: {
      windowTitle: "girlfriend.exe",
      line1: "girlfriend.exe has encountered a fatal error.",
      line2: "ERROR: incorrect boyfriend behavior detected.",
      button: "OK 😔"
    },

    rewards: [
      {
        eyebrow: "your reward:",
        title: "ONE KISS ♡",
        photo: "rewardKiss",
        fine: "Redeemable immediately upon physical availability of girlfriend.",
        button: "claim ♡",
        label: "ONE KISS ♡"
      },
      {
        eyebrow: "bonus reward:",
        title: "UNLIMITED HUGS",
        photo: "rewardHug",
        cap: "proof of girlfriend proximity",
        fine: "Subject to Chen requesting approximately 300% return on investment.",
        button: "claim ♡",
        label: "UNLIMITED HUGS"
      },
      {
        pre: ["CONGRATULATIONS.", "YOU WON:"],
        title: "BRADLEY.",
        photo: "rewardBradley",
        photoCls: "reward-photo--bradley",
        fine: "Apparently the prize was yourself.",
        button: "…thanks?",
        label: "BRADLEY. (yourself)"
      }
    ],

    things: {
      lockedNudge: "not yet ♡ open the others first",
      unlocked: "now this one ♡"
    },

    finalNo: [
      "really? 🤨",
      "BRADING DON’T START THIS AGAIN.",
      "after that entire letter???? 😭",
      "scoobydoobidibb please."
    ],
    finalNoRemoved: "option revoked by girlfriend.",

    eggs: {
      toast: function (n) { return "Bradley collected: " + n + "/5"; },
      achievement: {
        eyebrow: "🏆 ACHIEVEMENT UNLOCKED",
        title: "You found yourself five times.",
        big: "Narcissist.",
        reward: "Reward: one unlimited hug from girlfriend ♡",
        button: "claim hug ♡"
      },
      flower: {
        eyebrow: "🌸 SECRET FOUND",
        title: "You always notice the little things.",
        text: "I hope we never stop noticing the little things about each other.",
        button: "♡"
      }
    }
  };

  /* ===========================================================
     2. APP STATE
     =========================================================== */
  var ORDER = ["scanner", "love", "commit", "research", "exam", "rewards", "breather", "things", "fake-end", "letter", "ending", "certified"];
  var MOOD_BY_SCREEN = {
    love: "playful", commit: "playful", research: "playful", exam: "playful", rewards: "playful",
    breather: "calm", things: "calm", "fake-end": "lite",
    letter: "letter", ending: "letter", certified: "letter"
  };

  var state = {
    screen: null,
    navBusy: false,
    reduced: false,
    lastKeyboard: false,
    heads: new Set(),
    scannerVerified: false,
    awaitingHead1: false,
    achievement: false,
    flowerFound: false,
    commitIndex: 0,
    commitShownAt: 0,
    examIndex: 0,
    examFirstTry: 0,
    examWrongThisQ: false,
    examLocked: false,
    examShownAt: 0,
    examPeekShown: false,
    rewardsOpened: 0,
    giftBusy: false,
    loveRevealed: new Set(),
    finalCardOpen: false,
    letterStarted: false,
    finalAnswered: false,
    music: { started: false, failed: false, muted: false }
  };

  /* ===========================================================
     3. UTILITIES
     =========================================================== */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function rand(a, b) { return a + Math.random() * (b - a); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function now() { return (window.performance && performance.now) ? performance.now() : Date.now(); }
  function sleep(ms) { return new Promise(function (res) { setTimeout(res, ms); }); }

  // screen-scoped timers: cleared automatically when the screen changes
  var timers = new Set();
  function later(fn, ms) {
    var id = setTimeout(function () { timers.delete(id); fn(); }, ms);
    timers.add(id);
    return id;
  }
  function clearLater() { timers.forEach(function (id) { clearTimeout(id); }); timers.clear(); }
  function wait(ms) { return new Promise(function (res) { later(res, ms); }); }
  function t(ms) { return state.reduced ? Math.min(ms, 250) : ms; }

  // tiny element builder
  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === "class") el.className = v;
        else if (k === "text") el.textContent = v;
        else el.setAttribute(k, v === true ? "" : v);
      });
    }
    for (var i = 2; i < arguments.length; i++) appendKid(el, arguments[i]);
    return el;
  }
  function appendKid(el, kid) {
    if (kid === null || kid === undefined || kid === false) return;
    if (Array.isArray(kid)) { kid.forEach(function (k) { appendKid(el, k); }); return; }
    el.appendChild(typeof kid === "string" ? document.createTextNode(kid) : kid);
  }

  function centerOf(el) {
    var r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }
  function shake(el) {
    if (!el || state.reduced) return;
    el.classList.remove("is-shake");
    void el.offsetWidth;
    el.classList.add("is-shake");
    setTimeout(function () { el.classList.remove("is-shake"); }, 600);
  }
  function focusIfKeyboard(el) {
    if (state.lastKeyboard && el && el.focus) el.focus({ preventScroll: false });
  }
  function setInert(on) {
    var app = $("#app");
    if (!app) return;
    if ("inert" in app) app.inert = on;
    else if (on) app.setAttribute("aria-hidden", "true");
    else app.removeAttribute("aria-hidden");
  }

  /* ===========================================================
     4. IMAGES
     =========================================================== */
  function roleSrc(role) {
    var r = IMAGE_ROLES[role];
    if (!r || !IMAGE_FILES[r.img]) return null;
    return IMAGE_DIR + IMAGE_FILES[r.img];
  }
  function brokenHost(img) {
    return img.closest(".img-wrap, .sticker, .snap, .peek__sticker, .void__peek, .egg-head") || img.parentElement;
  }
  function applyRole(img, role) {
    if (!img) return;
    var r = IMAGE_ROLES[role];
    var src = roleSrc(role);
    var host = brokenHost(img);
    if (!r || !src) { if (host) host.classList.add("is-broken"); return; }
    if (img.getAttribute("data-src-set") === src) return;
    img.setAttribute("data-src-set", src);
    if (typeof r.alt === "string") img.alt = r.alt;
    img.style.objectPosition = r.pos || "";
    if (host) host.classList.remove("is-broken");
    img.onerror = function () { var hh = brokenHost(img); if (hh) hh.classList.add("is-broken"); };
    img.onload = function () { var hh = brokenHost(img); if (hh) hh.classList.remove("is-broken"); };
    img.src = src;
  }
  function hydrate(root) {
    if (!root) return;
    $$("img[data-role]", root).forEach(function (img) { applyRole(img, img.getAttribute("data-role")); });
  }
  function makeImg(role, cls) {
    var img = document.createElement("img");
    img.decoding = "async";
    img.setAttribute("data-role", role);
    img.setAttribute("draggable", "false");
    if (cls) img.className = cls;
    img.alt = "";
    applyRole(img, role);
    return img;
  }
  var warmed = new Set();
  function warm(role) {
    var src = roleSrc(role);
    if (!src || warmed.has(src)) return;
    warmed.add(src);
    var im = new Image();
    im.decoding = "async";
    im.src = src;
  }
  // images only used in JS-built pieces (stickers, modals, peeks)
  var WARM_BY_SCREEN = {
    scanner: ["triedIt", "pointing", "caught4k", "angryKid", "gfNotified"],
    love: ["audacity", "heartHands"],
    commit: ["audacity", "heartHands"],
    research: ["quizCorrect", "quizWatching", "quizMilo", "quizFunny", "quizFatal", "quizBeSerious", "quizAfterEverything", "quizExplain", "quizJelly"],
    exam: ["rewardKiss", "rewardHug", "rewardBradley"],
    rewards: ["rewardKiss", "rewardHug", "rewardBradley"]
  };
  function preloadAround(id) {
    var i = ORDER.indexOf(id);
    [id, ORDER[i + 1], ORDER[i + 2]].forEach(function (s) {
      if (!s) return;
      hydrate(document.getElementById(s));
      (WARM_BY_SCREEN[s] || []).forEach(warm);
    });
    if (i >= ORDER.indexOf("rewards")) {
      hydrate($("#void"));
      hydrate($("#letter"));
      hydrate($("#ending"));
    }
  }

  /* ===========================================================
     5. NAVIGATION / TRANSITIONS
     =========================================================== */
  var SCREENS = {};

  function go(id, opts) {
    opts = opts || {};
    if (state.navBusy || state.screen === id) return Promise.resolve(false);
    var to = document.getElementById(id);
    if (!to) return Promise.resolve(false);
    state.navBusy = true;

    var fromId = state.screen;
    var from = fromId ? document.getElementById(fromId) : null;
    clearLater();
    Runaway.releaseAll();
    hidePeek();

    var leaving = from ? (function () {
      from.classList.remove("is-active");
      from.classList.add("is-leaving");
      return sleep(state.reduced ? 0 : 420).then(function () {
        from.hidden = true;
        from.classList.remove("is-leaving", "is-entering");
        $$("[data-next]", from).forEach(function (b) { b.disabled = false; });
        if (SCREENS[fromId] && SCREENS[fromId].leave) SCREENS[fromId].leave();
      });
    })() : Promise.resolve();

    return leaving.then(function () {
      state.screen = id;
      document.body.setAttribute("data-screen", id);
      preloadAround(id);
      if (MOOD_BY_SCREEN[id]) Particles.setMood(MOOD_BY_SCREEN[id]);

      to.hidden = false;
      to.classList.add("is-entering");
      window.scrollTo(0, 0);
      void to.offsetWidth;
      to.classList.add("is-active");
      if (SCREENS[id] && SCREENS[id].enter) SCREENS[id].enter(opts);

      var focusTarget = $("[tabindex='-1']", to);
      if (focusTarget) { try { focusTarget.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }

      return sleep(state.reduced ? 0 : 560);
    }).then(function () {
      to.classList.remove("is-entering");
      state.navBusy = false;
      return true;
    });
  }

  // every "Continue" button: <button data-next="screen-id">
  document.addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest("[data-next]") : null;
    if (!b || b.disabled) return;
    b.disabled = true;
    go(b.getAttribute("data-next")).then(function (ok) { if (!ok) b.disabled = false; });
  });

  /* ===========================================================
     6. PARTICLES (floating hearts / flowers / sparkles / dots)
     =========================================================== */
  var Particles = (function () {
    var layer = $("#particles");
    var current = null;
    var mood = "off";
    var pairTimer = null;
    var petalTimer = null;
    var SVG = {
      heart: '<svg viewBox="0 0 24 24"><use href="#i-heart"/></svg>',
      flower: '<svg viewBox="0 0 24 24"><use href="#i-flower"/></svg>',
      spark: '<svg viewBox="0 0 24 24"><use href="#i-spark"/></svg>',
      dot: ""
    };
    var COLORS = {
      heart: ["c-blue", "c-pink", "c-pink", "c-light", "c-blush"],
      flower: ["c-pink", "c-blue", "c-blush", "c-lav", "c-light"],
      spark: ["c-white", "c-light", "c-blush"],
      dot: ["c-light", "c-blush", "c-lav"]
    };
    var MOODS = {
      playful: { count: [16, 24], mix: { heart: 0.4, flower: 0.18, spark: 0.26, dot: 0.16 }, dur: [22, 38], size: [9, 20], op: [0.16, 0.42], pairs: true },
      calm:    { count: [12, 17], mix: { heart: 0.16, flower: 0.62, spark: 0.08, dot: 0.14 }, dur: [34, 54], size: [9, 18], op: [0.14, 0.34], pairs: true },
      lite:    { count: [10, 14], mix: { heart: 0.42, flower: 0.24, spark: 0.2, dot: 0.14 }, dur: [24, 40], size: [9, 18], op: [0.15, 0.38], pairs: false }
    };

    function kindFrom(mix) {
      var r = Math.random();
      var keys = Object.keys(mix);
      for (var i = 0; i < keys.length; i++) { r -= mix[keys[i]]; if (r <= 0) return keys[i]; }
      return "dot";
    }

    function buildFloaters(cfg) {
      var set = h("div", { class: "pset" });
      var w = window.innerWidth;
      var n = Math.round(rand(cfg.count[0], cfg.count[1]) * (w < 520 ? 0.7 : (w > 1200 ? 1.15 : 1)));
      var html = "";
      for (var i = 0; i < n; i++) {
        var kind = kindFrom(cfg.mix);
        var size = kind === "dot" ? rand(3, 6) : rand(cfg.size[0], cfg.size[1]);
        var dur = rand(cfg.dur[0], cfg.dur[1]);
        var blur = Math.random() < 0.25 ? rand(1, 2.6) : 0;
        var x = ((i + Math.random()) / n) * 100;
        var cls = "pt pt--" + kind + " " + pick(COLORS[kind]) + (Math.random() < 0.4 ? " pt--wide" : "") + (blur ? " pt--blur" : "");
        var style = "--x:" + x.toFixed(2) + "%;--size:" + size.toFixed(1) + "px;--dur:" + dur.toFixed(1) + "s;--delay:" + (-rand(0, dur)).toFixed(1) + "s;--op:" + rand(cfg.op[0], cfg.op[1]).toFixed(2) + ";--sway-dur:" + rand(5, 9).toFixed(1) + "s" + (blur ? ";--blur:" + blur.toFixed(1) + "px" : "");
        html += '<span class="' + cls + '" style="' + style + '"><span class="pt__in">' + SVG[kind] + "</span></span>";
      }
      set.innerHTML = html;
      return set;
    }

    function buildStars() {
      var set = h("div", { class: "pset pset--stars" });
      var n = window.innerWidth < 520 ? 34 : 56;
      var html = "";
      for (var i = 0; i < n; i++) {
        html += '<span class="star' + (Math.random() < 0.25 ? " star--pink" : "") + '" style="left:' + rand(0, 100).toFixed(2) + "%;top:" + rand(0, 100).toFixed(2) + "%;--size:" + rand(1, 2.4).toFixed(1) + "px;--dur:" + rand(4, 10).toFixed(1) + "s;--delay:" + (-rand(0, 10)).toFixed(1) + 's"></span>';
      }
      set.innerHTML = html;
      return set;
    }

    function schedulePair() {
      clearTimeout(pairTimer);
      pairTimer = setTimeout(function () {
        if (!current || !MOODS[mood] || !MOODS[mood].pairs) return;
        var dur = rand(20, 28);
        var pair = h("span", { class: "pair", style: "--x:" + rand(12, 80).toFixed(1) + "%;--dur:" + dur.toFixed(1) + "s" });
        pair.innerHTML = '<span class="pair__a">' + SVG.heart + '</span><span class="pair__b">' + SVG.heart + "</span>";
        current.appendChild(pair);
        setTimeout(function () { if (pair.parentNode) pair.parentNode.removeChild(pair); }, dur * 1000 + 500);
        schedulePair();
      }, rand(9000, 20000));
    }

    function schedulePetal() {
      clearTimeout(petalTimer);
      petalTimer = setTimeout(function () {
        if (!current || mood !== "letter") return;
        var dur = rand(24, 32);
        var kind = Math.random() < 0.5 ? "heart" : "flower";
        var el = h("span", { class: "petal " + (Math.random() < 0.6 ? "c-pink" : "c-light"), style: "--x:" + rand(6, 94).toFixed(1) + "%;--size:" + rand(9, 13).toFixed(1) + "px;--dur:" + dur.toFixed(1) + "s" });
        el.innerHTML = '<span class="pt__in" style="--op:.5;--sway-dur:8s">' + SVG[kind] + "</span>";
        current.appendChild(el);
        setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, dur * 1000 + 500);
        schedulePetal();
      }, rand(14000, 24000));
    }

    function setMood(next) {
      if (state.reduced) next = "off";
      if (next === mood || !layer) return;
      mood = next;
      document.body.setAttribute("data-mood", next);
      clearTimeout(pairTimer);
      clearTimeout(petalTimer);
      var old = current;
      current = null;
      if (old) {
        old.classList.add("is-out");
        setTimeout(function () { if (old.parentNode) old.parentNode.removeChild(old); }, 1800);
      }
      if (next === "off") return;
      var set = next === "letter" ? buildStars() : buildFloaters(MOODS[next] || MOODS.playful);
      set.classList.add("is-out");
      layer.appendChild(set);
      current = set;
      requestAnimationFrame(function () { requestAnimationFrame(function () { set.classList.remove("is-out"); }); });
      if (MOODS[next] && MOODS[next].pairs) schedulePair();
      if (next === "letter") schedulePetal();
    }

    return { setMood: setMood, get mood() { return mood; } };
  })();

  // very small ♡ ♡ ✦ burst on normal taps (never on keyboard clicks)
  var Taps = (function () {
    var layer = $("#taps");
    var last = 0;
    function burstAt(x, y, n, force) {
      if (state.reduced || !layer) return;
      var m = Particles.mood;
      if (!force && m !== "playful" && m !== "lite" && m !== "calm") return;
      n = n || 4;
      for (var i = 0; i < n; i++) spawn(x, y, i === n - 1 ? "spark" : "heart");
    }
    function spawn(x, y, kind) {
      var el = h("span", { class: "tap " + (kind === "spark" ? pick(["c-white", "c-light"]) : pick(["c-pink", "c-blue", "c-blush"])) });
      el.innerHTML = '<svg viewBox="0 0 24 24"><use href="#i-' + kind + '"/></svg>';
      el.style.left = x + "px";
      el.style.top = y + "px";
      layer.appendChild(el);
      var ang = (-90 + rand(-75, 75)) * Math.PI / 180;
      var dist = rand(20, 44);
      var dx = Math.cos(ang) * dist;
      var dy = Math.sin(ang) * dist;
      var s = rand(0.7, 1.15);
      var kill = function () { if (el.parentNode) el.parentNode.removeChild(el); };
      if (el.animate) {
        var anim = el.animate([
          { transform: "translate(0,0) scale(0.3)", opacity: 0 },
          { transform: "translate(" + (dx * 0.55).toFixed(1) + "px," + (dy * 0.55).toFixed(1) + "px) scale(" + s.toFixed(2) + ")", opacity: 1, offset: 0.35 },
          { transform: "translate(" + dx.toFixed(1) + "px," + (dy - 10).toFixed(1) + "px) scale(" + (s * 0.85).toFixed(2) + ")", opacity: 0 }
        ], { duration: rand(650, 900), easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards" });
        anim.onfinish = kill;
      }
      setTimeout(kill, 1200);
    }
    document.addEventListener("click", function (e) {
      if (e.detail === 0 || (!e.clientX && !e.clientY)) return;
      var tNow = now();
      if (tNow - last < 140) return;
      last = tNow;
      burstAt(e.clientX, e.clientY, Particles.mood === "calm" ? 3 : 4);
    });
    return { burstAt: burstAt };
  })();

  /* ===========================================================
     7. FIREWORKS / CONFETTI (one canvas, only runs when needed)
     =========================================================== */
  var FX = (function () {
    var canvas = $("#fx");
    var ctx = canvas && canvas.getContext ? canvas.getContext("2d") : null;
    var W = 0, H = 0, DPR = 1;
    var parts = [];
    var spawned = [];
    var raf = null;
    var last = 0;
    var protectEls = [];
    var rects = [];
    var headSprite = null;
    var HEART = (typeof Path2D !== "undefined") ? new Path2D("M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z") : null;
    var ALL = ["#78A9FF", "#B8D4FF", "#C8A7E8", "#F4A6C1", "#FFD3E1", "#FFF9FB"];
    var BLUES = ["#78A9FF", "#B8D4FF", "#FFF9FB", "#C8A7E8"];
    var PINKS = ["#F4A6C1", "#FFD3E1", "#FFF9FB", "#C8A7E8"];

    function ok() { return !!ctx && !state.reduced; }

    function resize() {
      if (!ctx) return;
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    window.addEventListener("resize", resize);
    resize();

    function add(p) {
      p.age = 0;
      p.px = p.x; p.py = p.y;
      if (raf) spawned.push(p); else parts.push(p);
      if (!raf) { last = now(); raf = requestAnimationFrame(tick); }
    }

    function protectFactor(x, y) {
      var f = 1;
      for (var i = 0; i < rects.length; i++) {
        var r = rects[i];
        var dx = Math.max(r.left - x, 0, x - r.right);
        var dy = Math.max(r.top - y, 0, y - r.bottom);
        var d = Math.sqrt(dx * dx + dy * dy);
        f = Math.min(f, clamp(d / 40, 0, 1));
        if (f === 0) break;
      }
      return f;
    }

    function tick(tt) {
      var dt = clamp((tt - last) / 16.67, 0.5, 2.5);
      last = tt;
      rects = protectEls.map(function (el) { return el.getBoundingClientRect(); });
      ctx.clearRect(0, 0, W, H);
      var alive = [];
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.age += dt;
        if (p.age >= p.life) { if (p.onDone) p.onDone(p); continue; }
        update(p, dt);
        draw(p);
        alive.push(p);
      }
      parts = alive.concat(spawned);
      spawned = [];
      if (parts.length) raf = requestAnimationFrame(tick);
      else { raf = null; ctx.clearRect(0, 0, W, H); }
    }

    function update(p, dt) {
      p.px = p.x; p.py = p.y;
      var dragK = Math.pow(p.drag, dt);
      p.vx *= dragK;
      p.vy *= dragK;
      p.vy += p.g * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
      p.wob += p.vw * dt;
    }

    function draw(p) {
      var life = p.age / p.life;
      var a = p.alpha * (1 - Math.pow(life, p.fadePow || 2));
      if (rects.length) a *= protectFactor(p.x, p.y);
      if (a <= 0.01) return;
      ctx.globalAlpha = a;
      if (p.type === "spark") {
        ctx.globalCompositeOperation = "lighter";
        ctx.strokeStyle = p.color;
        ctx.lineCap = "round";
        ctx.lineWidth = p.size;
        ctx.beginPath();
        ctx.moveTo(p.x - p.vx * p.trail, p.y - p.vy * p.trail);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        ctx.globalAlpha = a * 0.25;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
      } else if (p.shape === "heart" && HEART) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        var s = p.size / 24;
        ctx.scale(s * (0.65 + 0.35 * Math.abs(Math.cos(p.wob))), s);
        ctx.translate(-12, -12);
        ctx.fillStyle = p.color;
        ctx.fill(HEART);
        ctx.restore();
      } else if (p.shape === "head" && headSprite) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.drawImage(headSprite, -p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      } else {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        var hgt = p.size * 0.55 * Math.abs(Math.cos(p.wob)) + 1;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -hgt / 2, p.size, hgt);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    }

    function confetti(o) {
      add({
        type: "confetti", shape: o.shape, color: o.color,
        x: o.x, y: o.y, vx: o.vx, vy: o.vy, g: o.g, drag: o.drag,
        size: o.size, rot: rand(0, Math.PI * 2), vr: rand(-0.14, 0.14),
        wob: rand(0, Math.PI * 2), vw: rand(0.08, 0.2),
        alpha: 1, life: o.life, fadePow: 3
      });
    }

    /* burst({x, y, count, power, spread, angle, shapes, colors}) */
    function burst(o) {
      if (!ok()) return;
      var count = o.count || 40;
      var power = o.power || 9;
      var spread = o.spread || Math.PI * 2;
      var angle = (o.angle === undefined) ? -Math.PI / 2 : o.angle;
      var shapes = o.shapes || ["heart", "rect"];
      var colors = o.colors || ALL;
      var size = o.size || [7, 13];
      var lifeR = o.life || [70, 120];
      for (var i = 0; i < count; i++) {
        var a = angle + (Math.random() - 0.5) * spread;
        var sp = power * rand(0.4, 1);
        confetti({
          shape: pick(shapes), color: pick(colors), x: o.x, y: o.y,
          vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
          g: o.gravity === undefined ? 0.22 : o.gravity, drag: 0.963,
          size: rand(size[0], size[1]), life: rand(lifeR[0], lifeR[1])
        });
      }
    }

    /* playful rain from the top (+ tiny Bradley heads) */
    function rain(o) {
      if (!ok()) return;
      o = o || {};
      var n = o.count || 80;
      for (var i = 0; i < n; i++) {
        confetti({
          shape: pick(["heart", "rect", "rect"]), color: pick(ALL),
          x: rand(0, W), y: rand(-H * 0.35, -10),
          vx: rand(-1, 1), vy: rand(2, 4.5), g: 0.045, drag: 0.992,
          size: rand(7, 12), life: rand(170, 240)
        });
      }
      if (headSprite) {
        for (var k = 0; k < (o.heads || 12); k++) {
          add({
            type: "confetti", shape: "head", color: "#fff",
            x: rand(W * 0.05, W * 0.95), y: rand(-H * 0.6, -40),
            vx: rand(-0.6, 0.6), vy: rand(2.2, 3.8), g: 0.04, drag: 0.992,
            size: rand(30, 46), rot: rand(-0.5, 0.5), vr: rand(-0.03, 0.03),
            wob: 0, vw: 0, alpha: 1, life: 260, fadePow: 6
          });
        }
      }
    }

    function prepareHead() {
      if (headSprite || !ctx) return;
      var src = roleSrc("eggHead");
      if (!src) return;
      var img = new Image();
      img.onload = function () {
        try {
          var c = document.createElement("canvas");
          c.width = c.height = 96;
          var g = c.getContext("2d");
          var s = Math.min(img.naturalWidth, img.naturalHeight);
          var sx = (img.naturalWidth - s) / 2;
          var sy = clamp(img.naturalHeight * 0.58 - s / 2, 0, img.naturalHeight - s);
          g.save();
          g.beginPath();
          g.arc(48, 48, 45, 0, Math.PI * 2);
          g.closePath();
          g.clip();
          g.drawImage(img, sx, sy, s, s, 0, 0, 96, 96);
          g.restore();
          g.lineWidth = 5;
          g.strokeStyle = "#FFF9FB";
          g.beginPath();
          g.arc(48, 48, 45, 0, Math.PI * 2);
          g.stroke();
          headSprite = c;
        } catch (e) { headSprite = null; }
      };
      img.src = src;
    }

    /* elegant fireworks — rocket from the bottom edge, bursts near the edges */
    function explode(x, y, palette) {
      var k = clamp(Math.min(W, H) / 800, 0.6, 1.2);
      var n = 46;
      var ring = Math.random() < 0.35;
      for (var i = 0; i < n; i++) {
        var a = (i / n) * Math.PI * 2 + rand(-0.05, 0.05);
        var sp = (ring ? rand(2.9, 3.2) : rand(1.4, 3.6)) * k;
        add({
          type: "spark", color: pick(palette), x: x, y: y,
          vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: 0.03, drag: 0.972,
          size: rand(1.4, 2.3), trail: 3, rot: 0, vr: 0, wob: 0, vw: 0,
          alpha: 1, life: rand(75, 115), fadePow: 1.6
        });
      }
      for (var j = 0; j < 6; j++) {
        var b = rand(0, Math.PI * 2);
        var s2 = rand(0.8, 1.8) * k;
        confetti({ shape: "heart", color: pick(palette), x: x, y: y, vx: Math.cos(b) * s2, vy: Math.sin(b) * s2 - 0.4, g: 0.02, drag: 0.985, size: rand(8, 12), life: rand(110, 150) });
      }
    }
    function rocket(tx, ty, palette) {
      var x0 = tx + rand(-24, 24);
      var y0 = H + 12;
      var frames = rand(44, 58);
      add({
        type: "spark", color: "#FFF9FB", x: x0, y: y0,
        vx: (tx - x0) / frames, vy: (ty - y0) / frames, g: 0, drag: 1,
        size: 2, trail: 5, rot: 0, vr: 0, wob: 0, vw: 0,
        alpha: 0.85, life: frames, fadePow: 8,
        onDone: function () { explode(tx, ty, palette); }
      });
    }
    function edgePoint() {
      for (var i = 0; i < 40; i++) {
        var side = Math.random();
        var x, y;
        if (side < 0.4) { x = rand(0.04, 0.22) * W; y = rand(0.08, 0.6) * H; }
        else if (side < 0.8) { x = rand(0.78, 0.96) * W; y = rand(0.08, 0.6) * H; }
        else { x = rand(0.1, 0.9) * W; y = rand(0.04, 0.14) * H; }
        var clear = true;
        for (var k = 0; k < rects.length; k++) {
          var r = rects[k];
          if (x > r.left - 60 && x < r.right + 60 && y > r.top - 60 && y < r.bottom + 60) { clear = false; break; }
        }
        if (clear) return { x: x, y: y };
      }
      return { x: Math.random() < 0.5 ? W * 0.07 : W * 0.93, y: rand(0.1, 0.35) * H };
    }
    var showToken = 0;
    function stop() { showToken++; }
    function show(o) {
      if (!ok()) return;
      o = o || {};
      var count = o.count || 10;
      var i = 0;
      var mine = ++showToken;
      rects = protectEls.map(function (el) { return el.getBoundingClientRect(); });
      (function fire() {
        if (i >= count || !ok() || mine !== showToken) return;
        var pt = edgePoint();
        rocket(pt.x, pt.y, i % 3 === 0 ? BLUES : (i % 3 === 1 ? PINKS : ALL));
        i++;
        setTimeout(fire, rand(520, 1050));
      })();
    }
    function protect(els) {
      protectEls = (els || []).filter(Boolean);
      if (!protectEls.length) rects = [];
    }

    return { burst: burst, rain: rain, show: show, stop: stop, protect: protect, prepareHead: prepareHead };
  })();

  /* ===========================================================
     8. UI PIECES — reaction row, peek, toast, modal
     =========================================================== */
  function showReaction(row, o) {
    if (!row) return;
    o = o || {};
    row.textContent = "";
    if (o.sticker) {
      var rot = o.rot !== undefined ? o.rot : pick([-7, -5, 4, 6]);
      var fig = h("figure", { class: "sticker sticker--react pop-in", style: "--rot:" + rot + "deg" }, makeImg(o.sticker));
      if (o.cap) fig.appendChild(h("figcaption", { class: "sticker__cap" }, o.cap));
      row.appendChild(fig);
    }
    if (o.text) {
      var p = h("p", { class: "reaction__text" + (o.tone ? " reaction__text--" + o.tone : "") }, o.text);
      if (o.sub) p.appendChild(h("small", null, o.sub));
      row.appendChild(p);
    }
  }

  var peekEl = $("#peek");
  var peekImg = $("#peek-img");
  var peekCap = $("#peek-cap");
  var peekTimer = null;
  function peek(role, cap, o) {
    if (!peekEl) return;
    o = o || {};
    clearTimeout(peekTimer);
    var showIt = function () {
      peekEl.classList.toggle("is-left", o.side === "left");
      applyRole(peekImg, role);
      peekImg.alt = "";
      peekCap.textContent = cap || "";
      peekEl.classList.add("is-shown");
      peekTimer = setTimeout(function () { peekEl.classList.remove("is-shown"); }, o.ms || 2800);
    };
    if (peekEl.classList.contains("is-shown")) {
      peekEl.classList.remove("is-shown");
      peekTimer = setTimeout(showIt, 380);
    } else showIt();
  }
  function hidePeek() {
    clearTimeout(peekTimer);
    if (peekEl) peekEl.classList.remove("is-shown");
  }

  var toastEl = $("#toast");
  var toastTimer = null;
  function toast(text, withHead) {
    if (!toastEl) return;
    toastEl.textContent = "";
    if (withHead) toastEl.appendChild(makeImg("eggHead", "toast__head"));
    toastEl.appendChild(document.createTextNode(text));
    void toastEl.offsetWidth;
    toastEl.classList.add("is-shown");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("is-shown"); }, 2400);
  }

  var Modal = (function () {
    var root = $("#modal");
    var card = $("#modal-card");
    var open = false;
    var onCloseCb = null;
    var lastFocus = null;
    var dismissible = true;

    function show(o) {
      if (!root || !card) return;
      if (open) close(true);
      lastFocus = document.activeElement;
      card.className = "modal__card" + (o.variant ? " modal__card--" + o.variant : "");
      card.textContent = "";
      if (o.build) o.build(card);
      var actions = o.actions || [];
      if (actions.length) {
        var row = h("div", { class: "modal__actions" });
        actions.forEach(function (a) {
          var b = h("button", { class: "btn btn--lg " + (a.cls || "btn--grad"), type: "button" }, a.label);
          if (a.aria) b.setAttribute("aria-label", a.aria);
          b.addEventListener("click", function () {
            if (a.onClick) a.onClick();
            if (a.close !== false) close();
          });
          row.appendChild(b);
        });
        card.appendChild(row);
      }
      onCloseCb = o.onClose || null;
      dismissible = o.dismissible !== false;
      root.hidden = false;
      open = true;
      setInert(true);
      var first = $(".modal__actions .btn", card) || card;
      setTimeout(function () { try { first.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }, 60);
    }

    function close(silent) {
      if (!open) return;
      open = false;
      root.hidden = true;
      setInert(false);
      var cb = onCloseCb;
      onCloseCb = null;
      if (lastFocus && lastFocus.focus && document.body.contains(lastFocus) && state.lastKeyboard) {
        try { lastFocus.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
      }
      if (!silent && cb) cb();
    }

    if (root) {
      root.addEventListener("click", function (e) {
        if (dismissible && e.target.closest && e.target.closest("[data-modal-close]")) close();
      });
    }
    document.addEventListener("keydown", function (e) {
      if (!open) return;
      if (e.key === "Escape" && dismissible) { e.preventDefault(); close(); return; }
      if (e.key === "Tab") {
        var f = $$("button, [href], input, [tabindex]:not([tabindex='-1'])", card).filter(function (el) { return !el.disabled; });
        if (!f.length) return;
        var firstEl = f[0], lastEl = f[f.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
        else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
      }
    });

    return { show: show, close: close, isOpen: function () { return open; } };
  })();

  /* ===========================================================
     9. RUNAWAY BUTTONS
     - mouse: jumps away when the pointer gets close
     - touch: jumps away when tapped (the tap never "lands")
     - keyboard: Enter/Space counts as pressing it (onPress)
     - reduced motion: never moves; each press just counts
     - always stays inside the visible viewport, never covers YES
     =========================================================== */
  var Runaway = (function () {
    var live = new Set();

    function inflate(r, n) { return { left: r.left - n, top: r.top - n, right: r.right + n, bottom: r.bottom + n }; }
    function overlap(a, b) { return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top; }

    function create(btn, opts) {
      if (!btn) return null;
      var r = { btn: btn, opts: opts || {}, tx: 0, ty: 0, attempts: 0, lastCount: -1e9, lastDodge: -1e9, suppressUntil: 0, live: false, tired: false, gone: false };
      if (r.opts.gentle) btn.classList.add("is-gentle");
      r.count = function (force) { countAttempt(r, force); };

      btn.addEventListener("pointerdown", function (e) {
        if (!r.live || r.gone || e.pointerType === "mouse") return;
        if (r.tired || state.reduced) return;
        r.suppressUntil = now() + 800;
        dodge(r, e.clientX, e.clientY);
        countAttempt(r);
      });
      // stops the browser from turning that touch into a click
      btn.addEventListener("touchstart", function (e) {
        if (!r.live || r.gone || r.tired || state.reduced) return;
        if (e.cancelable) e.preventDefault();
      }, { passive: false });
      btn.addEventListener("click", function (e) {
        if (!r.live || r.gone) return;
        if (e.detail !== 0 && now() < r.suppressUntil) { e.preventDefault(); return; }
        if (r.opts.onPress) r.opts.onPress(e.detail === 0 ? "keyboard" : "pointer", r);
      });
      return r;
    }

    function countAttempt(r, force) {
      var tt = now();
      if (!force && tt - r.lastCount < 650) return;
      r.lastCount = tt;
      r.attempts++;
      if (r.opts.onAttempt) r.opts.onAttempt(r.attempts, r);
      if (r.opts.tiredAfter && r.attempts >= r.opts.tiredAfter && !r.tired && !r.gone) {
        r.tired = true;
        r.btn.classList.add("is-tired");
        if (r.opts.onTired) r.opts.onTired(r);
      }
    }

    function dodge(r, px, py) {
      r.lastDodge = now();
      var b = r.btn.getBoundingClientRect();
      var natL = b.left - r.tx;
      var natT = b.top - r.ty;
      var vw = document.documentElement.clientWidth || window.innerWidth;
      var vh = window.innerHeight;
      var pad = 14;
      var music = $("#music");
      var bottomReserve = (music && !music.hidden) ? 70 : 0;
      var minX = pad, maxX = Math.max(pad, vw - b.width - pad);
      var minY = pad + 6, maxY = Math.max(minY, vh - b.height - pad - bottomReserve);
      var avoid = (r.opts.avoid ? r.opts.avoid() : []).filter(Boolean).map(function (el) { return inflate(el.getBoundingClientRect(), 18); });
      var best = null, bestScore = -Infinity;

      function consider(x, y, bonus) {
        var rect = { left: x, top: y, right: x + b.width, bottom: y + b.height };
        for (var i = 0; i < avoid.length; i++) if (overlap(avoid[i], rect)) return;
        var cx = x + b.width / 2, cy = y + b.height / 2;
        var dP = (px === undefined || px === null) ? 300 : Math.sqrt((cx - px) * (cx - px) + (cy - py) * (cy - py));
        if (dP < 120) return;
        var dC = Math.sqrt((x - b.left) * (x - b.left) + (y - b.top) * (y - b.top));
        var score = Math.min(dP, 420) + Math.min(dC, 260) * 0.6 + Math.random() * 80 + (bonus || 0);
        if (score > bestScore) { bestScore = score; best = { x: x, y: y }; }
      }
      for (var i = 0; i < 30; i++) consider(rand(minX, maxX), rand(minY, maxY));
      if (!best) {
        consider(minX, minY, -200); consider(maxX, minY, -200);
        consider(minX, maxY, -200); consider(maxX, maxY, -200);
      }
      if (!best) return; // nowhere safe: stay put
      r.tx = best.x - natL;
      r.ty = best.y - natT;
      r.btn.style.transform = "translate(" + r.tx.toFixed(1) + "px," + r.ty.toFixed(1) + "px)";
    }

    document.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse" || state.reduced || Modal.isOpen()) return;
      live.forEach(function (r) {
        if (!r.live || r.gone || r.tired) return;
        var b = r.btn.getBoundingClientRect();
        var dx = Math.max(b.left - e.clientX, 0, e.clientX - b.right);
        var dy = Math.max(b.top - e.clientY, 0, e.clientY - b.bottom);
        if (Math.sqrt(dx * dx + dy * dy) < 42 && now() - r.lastDodge > 200) {
          dodge(r, e.clientX, e.clientY);
          countAttempt(r);
        }
      });
    }, { passive: true });

    window.addEventListener("resize", function () { live.forEach(reset); });

    function reset(r) { if (!r) return; r.tx = 0; r.ty = 0; r.btn.style.transform = ""; }
    function arm(r) { if (!r || r.gone) return; r.live = true; live.add(r); }
    function disarm(r) { if (!r) return; r.live = false; live.delete(r); }
    function remove(r, cb) {
      if (!r || r.gone) return;
      r.gone = true;
      disarm(r);
      r.btn.classList.add("is-poof");
      setTimeout(function () { r.btn.hidden = true; if (cb) cb(); }, state.reduced ? 0 : 450);
    }
    function releaseAll() { live.forEach(function (r) { r.live = false; }); live.clear(); }

    return { create: create, arm: arm, disarm: disarm, reset: reset, remove: remove, releaseAll: releaseAll };
  })();

  /* ===========================================================
     10. SCREEN 0 — SCANNER
     =========================================================== */
  var scanSkip = false;
  var skipWaiters = [];
  var scannerNo = null;

  function skippable(ms) {
    return new Promise(function (res) {
      if (scanSkip) { res(); return; }
      var id = later(res, ms);
      skipWaiters.push(function () { clearTimeout(id); timers.delete(id); res(); });
    });
  }
  function requestSkip() {
    if (scanSkip) return;
    scanSkip = true;
    skipWaiters.splice(0).forEach(function (f) { f(); });
  }

  function typeInto(el, text, cps) {
    el.classList.add("is-typing");
    if (state.reduced || scanSkip) {
      el.textContent = text;
      el.classList.remove("is-typing");
      return Promise.resolve();
    }
    var i = 0;
    return new Promise(function (res) {
      (function step() {
        if (scanSkip) { el.textContent = text; el.classList.remove("is-typing"); res(); return; }
        i++;
        el.textContent = text.slice(0, i);
        if (i >= text.length) { el.classList.remove("is-typing"); res(); return; }
        skippable(1000 / cps).then(step);
      })();
    });
  }

  SCREENS.scanner = {
    enter: function () { runScanner(); }
  };

  function runScanner() {
    var term = $("#terminal");
    var lines = $$(".terminal__line", term);
    var db = $("#db-match");
    var detect = $("#detect");
    scanSkip = false;

    var onSkip = function (e) {
      if (e.type === "keydown" && ["Enter", " ", "Escape"].indexOf(e.key) === -1) return;
      requestSkip();
    };
    document.addEventListener("pointerdown", onSkip);
    document.addEventListener("keydown", onSkip);

    var seq = skippable(state.reduced ? 150 : 700);
    lines.forEach(function (line, idx) {
      seq = seq.then(function () {
        var text = line.getAttribute("data-text") || "";
        return typeInto(line, text, text.length > 30 ? 34 : 20).then(function () {
          var extra = line.getAttribute("data-extra");
          if (extra === "bar") {
            var bar = h("span", { class: "term-bar", "aria-hidden": "true" }, h("span"));
            line.appendChild(bar);
            void bar.offsetWidth;
            bar.classList.add("is-full");
            return skippable(t(1250));
          }
          if (extra === "db") {
            return skippable(300).then(function () {
              if (scanSkip) return;
              db.hidden = false;
              return skippable(1600).then(function () {
                db.classList.add("is-leaving");
                return skippable(400);
              });
            }).then(function () { db.hidden = true; });
          }
          return skippable(idx === lines.length - 1 ? t(800) : t(480));
        });
      });
    });

    seq.then(function () {
      document.removeEventListener("pointerdown", onSkip);
      document.removeEventListener("keydown", onSkip);
      term.classList.add("is-done");
      return skippable(scanSkip ? 60 : 550);
    }).then(function () {
      term.hidden = true;
      document.body.classList.add("is-lit");
      Particles.setMood("playful");
      detect.hidden = false;
      armScannerQuestion();
    });
  }

  function armScannerQuestion() {
    var yes = $("#scanner-yes");
    var no = $("#scanner-no");
    var row = $("#scanner-reaction");
    if (!scannerNo) {
      scannerNo = Runaway.create(no, {
        avoid: function () { return [yes]; },
        tiredAfter: CONTENT.scanner.tiredAfter,
        onAttempt: function (n) {
          var a = CONTENT.scanner.attempts[n];
          if (a) showReaction(row, { text: a.text, sticker: a.sticker, tone: n >= 3 ? "alert" : null });
        },
        onTired: function (r) {
          r.btn.textContent = CONTENT.scanner.tiredLabel;
          Runaway.reset(r);
          showReaction(row, { text: CONTENT.scanner.tired, tone: "calm" });
        },
        onPress: function () { accessDenied(); }
      });
      yes.addEventListener("click", onScannerYes);
    }
    Runaway.arm(scannerNo);
  }

  function accessDenied() {
    Runaway.disarm(scannerNo);
    var D = CONTENT.scanner.denied;
    Modal.show({
      variant: "system",
      build: function (card) {
        card.appendChild(h("p", { class: "modal__eyebrow" }, D.eyebrow));
        card.appendChild(h("h2", { class: "modal__title", id: "modal-title" }, D.title));
        card.appendChild(h("p", { class: "modal__text" }, D.text));
      },
      actions: [{ label: D.button, cls: "btn--soft" }],
      onClose: function () {
        var r = scannerNo;
        r.attempts = 0;
        r.tired = false;
        r.btn.classList.remove("is-tired");
        r.btn.textContent = "NO";
        Runaway.reset(r);
        showReaction($("#scanner-reaction"), {});
        if (state.screen === "scanner") Runaway.arm(r);
      }
    });
  }

  function onScannerYes(e) {
    var btn = e.currentTarget;
    if (btn.disabled || state.scannerVerified) return; // one tap only, never twice
    state.scannerVerified = true;
    btn.disabled = true;
    if (!btn.classList.contains("is-chosen")) {
      btn.classList.add("is-chosen");
      btn.textContent = "✓ " + btn.textContent;
    }
    Runaway.disarm(scannerNo);
    var status = $("#id-status");
    if (status) status.textContent = CONTENT.scanner.verified;
    var card = $(".id-card");
    if (card) card.classList.add("is-verified");
    var stamp = $("#id-stamp");
    if (stamp) stamp.classList.add("is-on");
    later(showTutorial, t(1100));
  }

  // "WAIT — ONE MORE THING." — teaches that tiny Bradleys are tappable.
  // "GOT IT" only closes it; Bradley #1 (behind the ID card) is the guided first catch,
  // and collecting him moves on automatically (no Continue button).
  function showTutorial() {
    var T = CONTENT.tutorial;
    Modal.show({
      variant: "tutorial",
      dismissible: false,
      build: function (card) {
        card.appendChild(h("h2", { class: "modal__title", id: "modal-title" }, T.title));
        card.appendChild(h("p", { class: "modal__text" }, T.line));
        card.appendChild(h("p", { class: "tutorial__tap" }, T.tap));
        card.appendChild(h("p", { class: "modal__text modal__text--small" }, T.goal));
        var cap = h("span", { class: "tutorial-demo__cap" }, T.demoCap);
        // NOTE: class "egg-demo" (not "egg-head"), so it is never counted
        var demo = h("button", { class: "egg-demo", type: "button", "aria-label": "Example tiny Bradley (practice, does not count)" }, makeImg("eggHead"));
        demo.addEventListener("click", function () {
          demo.classList.remove("is-poke");
          void demo.offsetWidth;
          demo.classList.add("is-poke");
          cap.textContent = T.demoPoked;
        });
        card.appendChild(h("div", { class: "tutorial-demo" }, demo, cap));
      },
      actions: [{ label: T.button, cls: "btn--grad" }],
      onClose: afterTutorial
    });
  }

  function afterTutorial() {
    if (state.screen !== "scanner") return;
    var no = $("#scanner-no");
    // already verified — the NO has no job left (and after a dodge it could sit on top of Bradley #1)
    if (no) no.hidden = true;
    var head1 = $('.egg-head[data-head="1"]');
    // already caught (or missing)? don't ask twice — just move on
    if (!head1 || head1.hidden || state.heads.has("1")) { leaveScanner(); return; }
    // stay on this screen until the real Bradley #1 is tapped
    state.awaitingHead1 = true;
    var r = head1.getBoundingClientRect();
    if (r.top < 0 || r.bottom > window.innerHeight) {
      try { head1.scrollIntoView({ behavior: state.reduced ? "auto" : "smooth", block: "center" }); }
      catch (err) { head1.scrollIntoView(false); }
    }
    // one-time, very soft hint: 3 gentle glow pulses (no arrow, nothing pointing at him)
    head1.classList.add("is-hint");
    setTimeout(function () { head1.classList.remove("is-hint"); }, 4400);
    focusIfKeyboard(head1);
  }

  // go() refuses while another transition is running, so retry briefly until it moves on
  function leaveScanner() {
    (function tryGo(n) {
      if (state.screen !== "scanner") return;
      go("love").then(function (ok) {
        if (!ok && state.screen === "scanner" && n < 20) setTimeout(function () { tryGo(n + 1); }, 150);
      });
    })(0);
  }

  /* ===========================================================
     11. SCREEN 1 — LOVE VERIFICATION
     =========================================================== */
  var loveNo = null;

  SCREENS.love = {
    enter: function () {
      var yes = $("#love-yes");
      var no = $("#love-no");
      if (!loveNo) {
        loveNo = Runaway.create(no, {
          avoid: function () { return [yes]; },
          onAttempt: function (n, r) { loveAttempt(n, r); },
          onPress: function (via, r) { r.count(true); }
        });
        yes.addEventListener("click", onLoveYes);
      }
      Runaway.arm(loveNo);
    }
  };

  function loveAttempt(n, r) {
    var C = CONTENT.love;
    var row = $("#love-reaction");
    var msg = C.messages[Math.min(n, C.messages.length) - 1];
    var st = C.stickers[n];
    showReaction(row, { text: msg, sticker: st && st.sticker, cap: st && st.cap, tone: n >= 3 ? "alert" : null });
    if (C.peek && n === C.peek.at) peek(C.peek.img, C.peek.cap, { side: "left", ms: 3000 });
    if (n >= C.messages.length) {
      Runaway.disarm(r);
      later(function () {
        Runaway.remove(r, function () { showReaction(row, { text: C.removed, tone: "calm" }); });
      }, 1800);
    }
  }

  function onLoveYes(e) {
    var btn = e.currentTarget;
    if (btn.disabled) return;
    btn.disabled = true;
    if (loveNo) Runaway.disarm(loveNo);
    var c = centerOf(btn);
    FX.burst({ x: c.x, y: c.y, count: 44, power: 8, shapes: ["heart", "heart", "rect"], colors: ["#78A9FF", "#B8D4FF", "#F4A6C1", "#FFD3E1", "#FFF9FB"] });
    hidePeek();
    later(function () {
      $("#love-ask").hidden = true;
      $("#love-success").hidden = false;
      window.scrollTo(0, 0);
      var hd = $("#love-success-h");
      if (hd) { try { hd.focus({ preventScroll: true }); } catch (err) { /* ignore */ } }
    }, t(650));
  }

  /* ===========================================================
     12. SCREEN 2 — COMMITMENT TEST
     =========================================================== */
  var takeBackR = null;

  SCREENS.commit = {
    enter: function () {
      state.commitIndex = 0;
      renderCommit();
    }
  };

  function setSteps(i) {
    var dots = $$("#commit-steps .steps__dot");
    dots.forEach(function (d, k) {
      d.classList.toggle("is-done", k < i);
      d.classList.toggle("is-now", k === i);
    });
    var lock = $("#commit-steps .steps__lock");
    if (lock) lock.classList.toggle("is-now", i === dots.length);
    var label = $("#commit-label");
    if (label) {
      if (i < dots.length) label.textContent = "question " + (i + 1) + " of " + dots.length;
      else if (i === dots.length) label.textContent = "final answer";
      else label.textContent = "complete ✓";
    }
  }

  function renderCommit() {
    var card = $("#commit-card");
    var row = $("#commit-reaction");
    var Q = CONTENT.commit.questions;
    var i = state.commitIndex;
    if (takeBackR) { Runaway.disarm(takeBackR); takeBackR = null; }
    showReaction(row, {});
    setSteps(i);
    card.textContent = "";
    state.commitShownAt = now();

    if (i >= Q.length) { renderFinalAnswer(card); return; }

    var q = Q[i];
    var wrap = h("div", { class: "commit-q" }, h("p", { class: "commit-q__text" + (q.long ? " commit-q__text--long" : "") }, q.q));
    var choices = h("div", { class: "choice-row" });
    var yesBtn = null;
    var runBtn = null;
    q.a.forEach(function (a) {
      var b = h("button", { class: "btn " + (a.runaway ? "btn--lg btn--no" : "btn--xl " + (a.cls || "btn--pink")), type: "button" }, a.label);
      if (a.runaway) runBtn = b;
      else { yesBtn = b; b.addEventListener("click", function () { answerCommit(b); }); }
      choices.appendChild(b);
    });
    wrap.appendChild(choices);
    card.appendChild(wrap);
    if (yesBtn) focusIfKeyboard(yesBtn);

    if (runBtn) {
      takeBackR = Runaway.create(runBtn, {
        avoid: function () { return [yesBtn]; },
        onAttempt: function (n, r) {
          var tb = CONTENT.commit.takeBack[n];
          if (tb) showReaction(row, { text: tb.text, sticker: tb.sticker, cap: tb.cap, tone: n >= 2 ? "alert" : null });
          if (n > CONTENT.commit.takeBackMax) {
            Runaway.disarm(r);
            later(function () { Runaway.remove(r); }, 300);
          }
        },
        onPress: function (via, r) { r.count(true); }
      });
      Runaway.arm(takeBackR);
    }
  }

  function answerCommit(b) {
    if (b.disabled || now() - state.commitShownAt < 350) return;
    b.disabled = true;
    state.commitIndex++;
    later(renderCommit, t(280));
  }

  function renderFinalAnswer(card) {
    var F = CONTENT.commit.final;
    var btn = h("button", { class: "btn btn--lockin", type: "button" }, F.button);
    btn.addEventListener("click", function () { lockIn(btn); });
    card.appendChild(h("div", { class: "commit-q final-answer" },
      h("p", { class: "commit-q__text" }, F.title),
      h("p", { class: "final-answer__sub" }, F.sub),
      btn));
    focusIfKeyboard(btn);
  }

  function lockIn(btn) {
    if (btn.disabled || now() - state.commitShownAt < 350) return;
    btn.disabled = true;
    var c = centerOf(btn);
    FX.burst({ x: c.x, y: c.y, count: 90, power: 13, shapes: ["heart", "heart", "rect"] });
    later(function () { FX.burst({ x: c.x, y: c.y, count: 50, power: 10, spread: Math.PI * 1.3 }); }, 260);
    btn.textContent = "🔒 LOCKED";
    setSteps(99);
    later(renderContract, t(750));
  }

  function renderContract() {
    var C = CONTENT.commit.contract;
    var card = $("#commit-card");
    card.textContent = "";
    var terms = h("ul", { class: "contract__terms" }, C.terms.map(function (tx, i) {
      return h("li", { class: i === C.terms.length - 1 ? "is-yes" : null }, tx);
    }));
    var sticker = h("figure", { class: "sticker sticker--md pop-in", style: "--rot:-5deg" }, makeImg("heartHands"));
    var next = h("button", { class: "btn btn--grad btn--lg", type: "button", "data-next": "research" }, "Continue");
    card.appendChild(h("div", { class: "contract" },
      h("p", { class: "contract__stamp" }, C.stamp),
      h("h3", { class: "contract__title" }, C.title),
      h("div", { class: "contract__body" }, sticker, terms),
      next));
    focusIfKeyboard(next);
  }

  /* ===========================================================
     13. SCREEN 3 — RESEARCH INSTITUTE
     =========================================================== */
  var labDone = new Set();

  SCREENS.research = { enter: function () {} };

  document.addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest("[data-lab-run]") : null;
    if (!b || b.disabled) return;
    var n = parseInt(b.getAttribute("data-lab-run"), 10);
    var card = b.closest(".lab-card");
    if (!card || !LAB[n]) return;
    b.disabled = true;
    b.classList.add("is-done");
    var result = $(".lab-card__result", card);
    LAB[n](card, result, function () {
      labDone.add(n);
      if (labDone.size >= 5) {
        var after = $("#research-after");
        if (after && after.hidden) after.hidden = false;
      }
    });
  });

  var LAB = {
    1: function (card, result, done) {
      var word = $(".lab-morph__word", card);
      var dd = $("#lab-morph");
      word.textContent = "merchandise";
      wait(t(650)).then(function () {
        word.innerHTML = 'm<span class="lab-morph__flip">a</span>rch<span class="lab-morph__flip">e</span>ndise';
        return wait(t(750));
      }).then(function () {
        word.innerHTML = "<b>MARCHEN</b>DISE";
        return wait(t(700));
      }).then(function () {
        dd.appendChild(h("span", { class: "lab-morph__arrow", "aria-hidden": "true" }, "→"));
        dd.appendChild(h("span", { class: "lab-morph__chen" }, "CHEN"));
        return wait(t(750));
      }).then(function () {
        result.hidden = false;
        done();
      });
    },

    2: function (card, result, done) {
      var sil = $(".silence", card);
      var time = $(".silence__time", card);
      var total = 4200;
      var t0 = now();
      sil.classList.add("is-running");
      (function step() {
        var el = now() - t0;
        time.textContent = (Math.min(el, total) / 1000).toFixed(1) + "s";
        if (el >= total) {
          result.hidden = false;
          shake(card);
          done();
          return;
        }
        later(step, 100);
      })();
    },

    3: function (card, result, done) {
      var cell = $("#brain-cell");
      var txt = $(".brain-cell__txt", card);
      cell.classList.add("is-loading");
      wait(t(900)).then(function () {
        txt.textContent = "processing “Tigol”...";
        return wait(t(1300));
      }).then(function () {
        txt.textContent = "Tig... Tig—";
        return wait(t(750));
      }).then(function () {
        cell.classList.remove("is-loading");
        txt.textContent = "done. (unfortunately)";
        card.classList.add("is-dramatic");
        result.hidden = false;
        shake(card);
        done();
      });
    },

    4: function (card, result, done) {
      $(".pikon", card).classList.add("is-hot");
      wait(t(1450)).then(function () {
        result.hidden = false;
        done();
      });
    },

    5: function (card, result, done) {
      var notif = $("#notif");
      var notif2 = $("#notif-2");
      var msg = $("#notif-msg");
      msg.textContent = msg.getAttribute("data-msg") || msg.textContent;
      notif.classList.add("is-new");
      wait(t(750)).then(function () {
        if (notif2) { notif2.hidden = false; notif2.classList.add("is-new"); }
        return wait(t(850));
      }).then(function () {
        result.hidden = false;
        var counter = $("#compliment-count");
        var target = 728283;
        if (!state.reduced) {
          var t0 = now();
          var dur = 1600;
          (function tick() {
            var p = Math.min(1, (now() - t0) / dur);
            counter.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
            if (p < 1) later(tick, 40);
          })();
        }
        return wait(t(2500));
      }).then(function () {
        $(".soften", card).classList.add("is-in");
        done();
      });
    }
  };

  /* ===========================================================
     14. SCREEN 4 — BOYFRIEND EXAM
     =========================================================== */
  SCREENS.exam = {
    enter: function () {
      state.examIndex = 0;
      state.examFirstTry = 0;
      $("#exam-card").hidden = false;
      $("#exam-result").hidden = true;
      renderExam();
    }
  };

  function updateExamProgress(i) {
    var n = CONTENT.exam.length;
    var done = Math.min(i, n);
    var count = $("#exam-count");
    if (count) count.textContent = i < n ? "QUESTION " + (i + 1) + "/" + n : "COMPLETE";
    var pct = $("#exam-pct");
    if (pct) pct.textContent = Math.round((done / n) * 100) + "%";
    var bar = $("#exam-bar");
    if (bar) {
      bar.setAttribute("aria-valuenow", String(done));
      var fill = $("span", bar);
      if (fill) fill.style.transform = "scaleX(" + (done / n) + ")";
    }
  }

  function renderExam() {
    var Q = CONTENT.exam;
    var i = state.examIndex;
    updateExamProgress(i);
    if (i >= Q.length) { showExamResult(); return; }

    var q = Q[i];
    var card = $("#exam-card");
    state.examWrongThisQ = false;
    state.examLocked = false;
    card.textContent = "";

    var head = h("div", { class: "exam-q__head" + (q.side ? " has-side" : "") },
      h("h3", { class: "exam-q__text", id: "exam-q-text", tabindex: "-1" }, q.q));
    if (q.side) {
      head.appendChild(h("figure", { class: "photo exam-q__side", id: "exam-side" },
        h("div", { class: "img-wrap img-wrap--portrait" }, makeImg(q.side))));
    }
    var opts = h("div", { class: "exam-options", role: "group", "aria-labelledby": "exam-q-text" });
    q.options.forEach(function (o) {
      var b = h("button", { class: "opt", type: "button" }, o.t);
      b.addEventListener("click", function () { answerExam(o, b); });
      opts.appendChild(b);
    });
    var fb = h("div", { class: "reaction exam-feedback", id: "exam-feedback", "aria-live": "polite" });
    var next = h("div", { class: "exam-next" });
    card.appendChild(h("div", { class: "exam-q" }, head, opts, fb, next));
    state.examShownAt = now();
    if (state.lastKeyboard) { var first = $(".opt", card); if (first) first.focus(); }
  }

  function answerExam(o, b) {
    if (state.examLocked || b.disabled || now() - state.examShownAt < 300) return;
    var card = $("#exam-card");
    var fb = $("#exam-feedback");

    if (o.ok) {
      state.examLocked = true;
      if (!state.examWrongThisQ) state.examFirstTry++;
      b.classList.add("is-correct");
      $$(".opt", card).forEach(function (x) { x.disabled = true; if (x !== b) x.classList.add("is-dim"); });
      var c = centerOf(b);
      FX.burst({ x: c.x, y: c.y, count: 14, power: 5, shapes: ["heart"], size: [7, 11], life: [45, 75], gravity: 0.1, colors: ["#F4A6C1", "#FFD3E1", "#78A9FF", "#B8D4FF"] });
      showReaction(fb, { text: o.say });
      if (!state.examPeekShown) {
        state.examPeekShown = true;
        peek(CONTENT.examCorrectPeek.img, CONTENT.examCorrectPeek.cap, { side: "left", ms: 2600 });
      }
      later(showExamNext, t(550));
      return;
    }

    if (o.dishonest) { dishonesty(); return; }

    state.examWrongThisQ = true;
    b.disabled = true;
    b.classList.add("is-wrong");
    shake(card);
    if (o.fatal) {
      showReaction(fb, { text: o.say, tone: "alert" });
      fatalError();
    } else {
      showReaction(fb, { text: o.say, sub: o.sub, sticker: o.sticker, cap: o.cap });
      if (o.peek) peek(o.peek, o.peekCap, { side: "right", ms: 3000 });
    }
  }

  function dishonesty() {
    var card = $("#exam-card");
    var fb = $("#exam-feedback");
    var side = $("#exam-side");
    state.examLocked = true;
    state.examWrongThisQ = true;
    $$(".opt", card).forEach(function (x) { x.disabled = true; });
    shake(card);
    if (side) side.classList.add("is-offended");
    var L = CONTENT.dishonesty;
    showReaction(fb, { text: L[0], tone: "alert" });
    later(function () { showReaction(fb, { text: L[0], sub: L[1], tone: "alert" }); }, t(1300));
    later(function () {
      state.examLocked = false;
      $$(".opt", card).forEach(function (x) { if (!x.classList.contains("is-wrong")) x.disabled = false; });
      showReaction(fb, { text: L[1], sub: CONTENT.dishonestyRetry, tone: "alert" });
      if (side) side.classList.remove("is-offended");
    }, t(3200));
  }

  function fatalError() {
    var F = CONTENT.fatal;
    Modal.show({
      variant: "glitch",
      build: function (card) {
        card.appendChild(h("div", { class: "win-bar" }, h("span", { id: "modal-title" }, F.windowTitle), h("span", { "aria-hidden": "true" }, "✕")));
        card.appendChild(h("div", { class: "win-body" },
          h("figure", { class: "sticker", style: "--rot:-3deg" }, makeImg("quizFatal")),
          h("div", null, h("p", null, h("strong", null, F.line1)), h("p", { class: "win-err" }, F.line2))));
      },
      actions: [{ label: F.button, cls: "btn--pink" }]
    });
  }

  function showExamNext() {
    var wrapEl = $("#exam-card .exam-next");
    if (!wrapEl) return;
    var isLast = state.examIndex >= CONTENT.exam.length - 1;
    var b = h("button", { class: "btn btn--grad btn--lg", type: "button" }, isLast ? "See results →" : "Next question →");
    b.addEventListener("click", function () {
      if (b.disabled) return;
      b.disabled = true;
      state.examIndex++;
      hidePeek();
      renderExam();
    });
    wrapEl.appendChild(b);
    focusIfKeyboard(b);
  }

  function showExamResult() {
    $("#exam-card").hidden = true;
    var res = $("#exam-result");
    res.hidden = false;
    $("#exam-raw").textContent = state.examFirstTry + "/" + CONTENT.exam.length;
    updateExamProgress(CONTENT.exam.length);
    window.scrollTo(0, 0);
    focusIfKeyboard($("[data-next]", res));
  }

  /* ===========================================================
     15. SCREEN 5 — MYSTERY REWARDS
     (rewards follow the ORDER you open boxes in, so the
      "YOU WON: BRADLEY." punchline is always last)
     =========================================================== */
  SCREENS.rewards = { enter: function () {} };

  document.addEventListener("click", function (e) {
    var g = e.target.closest ? e.target.closest(".gift") : null;
    if (g) openGift(g);
  });

  function openGift(g) {
    if (g.classList.contains("is-open") || Modal.isOpen() || state.giftBusy) return;
    var idx = state.rewardsOpened;
    var R = CONTENT.rewards[idx];
    if (!R) return;
    state.giftBusy = true;
    state.rewardsOpened++;
    g.classList.add("is-open");
    g.setAttribute("aria-disabled", "true");
    g.setAttribute("aria-label", "Opened: " + R.label);
    var c = centerOf(g);
    Taps.burstAt(c.x, c.y - 10, 5, true);
    later(function () { state.giftBusy = false; showReward(R, idx, g); }, t(650));
  }

  function showReward(R, idx, g) {
    Modal.show({
      variant: "reward",
      build: function (card) {
        if (R.pre) card.appendChild(h("p", { class: "reward-pre" }, R.pre[0], h("br"), R.pre[1]));
        else card.appendChild(h("p", { class: "modal__eyebrow" }, R.eyebrow));
        card.appendChild(h("h2", { class: "modal__title", id: "modal-title" }, R.title));
        var fig = h("figure", { class: "photo modal__media " + (R.photoCls || "reward-photo") },
          h("div", { class: "img-wrap img-wrap--portrait" }, makeImg(R.photo)));
        if (R.cap) fig.appendChild(h("figcaption", null, R.cap));
        card.appendChild(fig);
        card.appendChild(h("p", { class: "modal__fine" }, R.fine));
      },
      actions: [{ label: R.button, cls: "btn--grad" }],
      onClose: function () {
        var label = g.parentElement ? $(".gift__label", g.parentElement) : null;
        if (label) label.textContent = R.label;
        if (idx === 0) {
          $("#rewards-h").classList.add("is-struck");
          $("#rewards-spoiled").hidden = false;
        }
        if (state.rewardsOpened >= CONTENT.rewards.length) {
          var after = $("#rewards-after");
          if (after) after.hidden = false;
        }
      }
    });
  }

  /* ===========================================================
     16. TRANSITION + SCREEN 6 — THINGS I UNFORTUNATELY LOVE
     =========================================================== */
  SCREENS.breather = {
    enter: function () {
      var b = $(".breather");
      b.classList.remove("is-1", "is-2", "is-3");
      later(function () { b.classList.add("is-1"); }, t(350));
      later(function () { b.classList.add("is-2"); }, t(1100));
      later(function () { b.classList.add("is-3"); focusIfKeyboard($(".breather__btn")); }, t(2700));
    }
  };

  SCREENS.things = { enter: function () {} };

  document.addEventListener("click", function (e) {
    var tgl = e.target.closest ? e.target.closest(".love-card__toggle") : null;
    if (tgl) revealLove(tgl);
  });

  function openLoveCard(card, tgl) {
    var reveal = document.getElementById(tgl.getAttribute("aria-controls"));
    card.classList.add("is-open");
    tgl.setAttribute("aria-expanded", "true");
    var icon = $(".love-card__icon", card);
    if (icon) icon.textContent = "♥︎";
    if (reveal) { hydrate(reveal); reveal.hidden = false; }
  }

  function revealLove(tgl) {
    var card = tgl.closest(".love-card");
    if (!card || card.classList.contains("is-open")) return;
    var key = card.getAttribute("data-card");

    if (key === "everything") {
      if (card.classList.contains("is-locked")) {
        var hint = $("#lc-lock");
        if (hint) hint.textContent = CONTENT.things.lockedNudge;
        card.classList.remove("is-nudge");
        void card.offsetWidth;
        if (!state.reduced) card.classList.add("is-nudge");
        return;
      }
      if (state.finalCardOpen) return;
      state.finalCardOpen = true;
      openLoveCard(card, tgl);
      card.classList.remove("is-ready");
      var lock = $("#lc-lock");
      if (lock) lock.hidden = true;
      // a quiet moment before letting him continue
      later(function () {
        var after = $("#things-after");
        if (after) { after.hidden = false; focusIfKeyboard($("button", after)); }
      }, t(4300));
      return;
    }

    openLoveCard(card, tgl);
    state.loveRevealed.add(key);
    var totalCards = $$(".love-card:not(.love-card--final)").length;
    if (state.loveRevealed.size >= totalCards) {
      var fc = $(".love-card--final");
      if (fc && fc.classList.contains("is-locked")) {
        fc.classList.remove("is-locked");
        fc.classList.add("is-ready");
        var ft = $(".love-card__toggle", fc);
        if (ft) ft.removeAttribute("aria-disabled");
        var lk = $("#lc-lock");
        if (lk) lk.textContent = CONTENT.things.unlocked;
      }
    }
  }

  /* ===========================================================
     17. EASTER EGGS — five hidden Bradleys + one secret flower
     =========================================================== */
  document.addEventListener("click", function (e) {
    var hd = e.target.closest ? e.target.closest(".egg-head") : null;
    if (hd) collectHead(hd);
    var fl = e.target.closest ? e.target.closest(".secret-flower") : null;
    if (fl) findFlower(fl);
  });

  function collectHead(el) {
    var id = el.getAttribute("data-head");
    if (!id || state.heads.has(id) || el.classList.contains("is-collected")) return;
    state.heads.add(id);
    el.classList.add("is-collected");
    el.setAttribute("aria-hidden", "true");
    el.tabIndex = -1;
    var c = centerOf(el);
    Taps.burstAt(c.x, c.y, 5, true);
    setTimeout(function () { el.hidden = true; }, state.reduced ? 0 : 650);
    var n = state.heads.size;
    toast(CONTENT.eggs.toast(n), true);
    // the guided first catch on the verification screen: let "1/5" show, then move on
    if (id === "1" && state.awaitingHead1) {
      state.awaitingHead1 = false;
      el.classList.remove("is-hint");
      setTimeout(leaveScanner, 1000);
    }
    if (n >= 5 && !state.achievement) {
      state.achievement = true;
      FX.prepareHead();
      setTimeout(celebrateHeads, 1000);
    }
  }

  function celebrateHeads() {
    FX.rain({ count: 80, heads: 12 });
    var A = CONTENT.eggs.achievement;
    Modal.show({
      variant: "achieve",
      build: function (card) {
        card.appendChild(h("p", { class: "modal__eyebrow" }, A.eyebrow));
        card.appendChild(h("h2", { class: "modal__title", id: "modal-title" }, A.title));
        card.appendChild(h("p", { class: "achieve-big" }, A.big));
        card.appendChild(h("div", { class: "achieve-heads", "aria-hidden": "true" }, [1, 2, 3, 4, 5].map(function () { return makeImg("eggHead"); })));
        card.appendChild(h("p", { class: "modal__text" }, A.reward));
      },
      actions: [{ label: A.button, cls: "btn--grad" }]
    });
  }

  function findFlower(f) {
    if (state.flowerFound) return;
    state.flowerFound = true;
    f.classList.add("is-found");
    f.setAttribute("aria-label", "The secret flower (found)");
    f.setAttribute("aria-disabled", "true");
    var F = CONTENT.eggs.flower;
    setTimeout(function () {
      Modal.show({
        variant: "soft",
        build: function (card) {
          card.appendChild(h("p", { class: "modal__eyebrow" }, F.eyebrow));
          card.appendChild(h("h2", { class: "modal__title", id: "modal-title" }, F.title));
          card.appendChild(h("p", { class: "modal__text" }, F.text));
        },
        actions: [{ label: F.button, cls: "btn--soft", aria: "Close" }]
      });
    }, state.reduced ? 100 : 750);
  }

  /* ===========================================================
     18. SCREEN 7 — FAKE ENDING + BLACKOUT
     =========================================================== */
  SCREENS["fake-end"] = {
    enter: function () {
      Music.prepare(); // start buffering the song quietly (it does NOT play yet)
      hydrate($("#void"));
    }
  };

  function onExit(e) {
    var btn = e.currentTarget;
    if (btn.disabled) return;
    btn.disabled = true;
    var cry = $("#exit-cry");
    var v = $("#void");
    cry.hidden = false;

    wait(t(1000)).then(function () {
      v.hidden = false;
      void v.offsetWidth;
      v.classList.add("is-on");
      setInert(true);
      Particles.setMood("off");
      hidePeek();
      try { v.focus({ preventScroll: true }); } catch (err) { /* ignore */ }
      return wait(t(1400));
    }).then(function () {
      cry.hidden = true;
      return wait(t(1700)); // ~1.5–2s of nothing
    }).then(function () {
      $("#void-1").classList.add("is-in");
      return wait(t(1700));
    }).then(function () {
      $("#void-2").classList.add("is-in");
      return wait(t(1700));
    }).then(function () {
      $("#void-3").classList.add("is-in");
      return wait(t(1500));
    }).then(function () {
      $("#void-peek").classList.add("is-in");
      return wait(t(1300));
    }).then(function () {
      var last = $("#last-thing");
      last.classList.add("is-in");
      focusIfKeyboard(last);
    });
  }

  // keep the tablet screen from dimming while he reads (ignored where unsupported)
  var WakeLock = (function () {
    var lock = null;
    var wanted = false;
    function request() {
      wanted = true;
      try {
        if (lock || !navigator.wakeLock || !navigator.wakeLock.request) return;
        navigator.wakeLock.request("screen").then(function (l) {
          lock = l;
          l.addEventListener("release", function () { lock = null; });
        }).catch(function () { /* not allowed right now — fine */ });
      } catch (err) { /* ignore */ }
    }
    document.addEventListener("visibilitychange", function () {
      if (wanted && document.visibilityState === "visible") request();
    });
    return { request: request };
  })();

  function onLastThing(e) {
    if (state.letterStarted) return;
    state.letterStarted = true;
    // play() must be called directly inside this click (mobile autoplay rules)
    Music.start();
    WakeLock.request();
    e.currentTarget.disabled = true;
    var pk = $("#void-peek");
    if (pk) pk.classList.add("is-gone");
    endComedy();
    setInert(false);
    go("letter", { fromVoid: true });
  }

  // "the joke website is over; this part is real."
  function endComedy() {
    hidePeek();
    $$(".egg-head").forEach(function (el) { if (el.parentNode) el.parentNode.removeChild(el); });
    $$(".reaction").forEach(function (r) { r.textContent = ""; });
    var cry = $("#exit-cry");
    if (cry && cry.parentNode) cry.parentNode.removeChild(cry);
    if (toastEl) toastEl.classList.remove("is-shown");
    document.body.classList.add("comedy-over");
  }

  /* ===========================================================
     19. AUDIO — only ever starts from "one last thing ♡"
     =========================================================== */
  var Music = (function () {
    var audio = $("#song");
    var ui = $("#music");
    var fab = $("#music-fab");
    var tray = $("#music-tray");
    var toggle = $("#music-toggle");
    var mute = $("#music-mute");
    var vol = $("#music-vol");
    var label = $("#music-label");
    var prepared = false;
    var fadeTimer = null;
    var hideTimer = null;
    var trayOpen = false;
    var collapseTimer = null;

    // the ♫ button opens a small tray; it folds itself away again after a few seconds
    function armCollapse() {
      clearTimeout(collapseTimer);
      collapseTimer = setTimeout(function () {
        if (state.lastKeyboard && ui && ui.contains(document.activeElement)) { armCollapse(); return; }
        setTray(false);
      }, 5000);
    }
    function setTray(open) {
      if (!tray || !fab || !ui) return;
      trayOpen = open;
      tray.hidden = !open;
      ui.classList.toggle("is-open", open);
      fab.setAttribute("aria-expanded", open ? "true" : "false");
      clearTimeout(collapseTimer);
      if (open) { armCollapse(); focusIfKeyboard(toggle); }
    }

    // iPhone/iPad ignore JS volume (hardware buttons only) — detect it
    var volumeWorks = (function () {
      try { var a = document.createElement("audio"); a.volume = 0.5; return Math.abs(a.volume - 0.5) < 0.01; }
      catch (e) { return false; }
    })();

    function prepare() {
      if (prepared || !audio) return;
      prepared = true;
      audio.loop = true;
      audio.preload = "auto";
      audio.src = AUDIO_SRC;
      try { audio.load(); } catch (e) { /* ignore */ }
    }

    function showUI() {
      if (!ui) return;
      ui.hidden = false;
      if (!volumeWorks) ui.classList.add("is-novol");
    }

    function setLabel(txt) { if (label) label.textContent = txt || ""; }

    function fadeTo(target, ms) {
      if (!volumeWorks || !audio) return;
      clearInterval(fadeTimer);
      var from = audio.volume;
      var t0 = now();
      fadeTimer = setInterval(function () {
        var k = Math.min(1, (now() - t0) / ms);
        try { audio.volume = clamp(from + (target - from) * k, 0, 1); } catch (e) { /* ignore */ }
        if (k >= 1) clearInterval(fadeTimer);
      }, 50);
    }

    function missing() { return !!(audio && audio.error); }

    function onPlaying() {
      state.music.failed = false;
      if (ui) ui.classList.remove("is-needs-tap");
      setLabel("");
      clearTimeout(hideTimer);
      fadeTo(parseFloat(vol ? vol.value : MUSIC_VOLUME) || MUSIC_VOLUME, 2600);
      sync();
    }

    function onFail() {
      state.music.failed = true;
      showUI();
      if (missing()) {
        setLabel("song not found");
        clearTimeout(hideTimer);
        hideTimer = setTimeout(function () { if (audio.paused && ui) ui.hidden = true; }, 4500);
      } else {
        ui.classList.add("is-needs-tap");
        setLabel("play music");
      }
      sync();
    }

    function tryPlay() {
      var p;
      try { p = audio.play(); } catch (err) { onFail(); return; }
      if (p && typeof p.then === "function") p.then(onPlaying, onFail);
      else onPlaying();
    }

    function start() {
      if (!audio || state.music.started) return;
      state.music.started = true;
      prepare();
      if (volumeWorks) { try { audio.volume = 0; } catch (e) { /* ignore */ } }
      tryPlay();
      showUI();
      sync();
    }

    // used by ?screen=letter test links: no autoplay, just offer a play button
    function offer() {
      prepare();
      state.music.started = true;
      showUI();
      if (ui) ui.classList.add("is-needs-tap");
      setLabel("play music");
      sync();
    }

    function sync() {
      if (!audio || !toggle || !mute) return;
      var playing = !audio.paused && !audio.ended;
      ui.classList.toggle("is-playing", playing);
      if (fab) fab.setAttribute("aria-label", playing ? "Music controls (playing)" : "Music controls (paused)");
      toggle.innerHTML = '<svg class="ico" aria-hidden="true"><use href="#i-' + (playing ? "pause" : "play") + '"/></svg>';
      toggle.setAttribute("aria-label", playing ? "Pause music" : "Play music");
      mute.innerHTML = '<svg class="ico" aria-hidden="true"><use href="#i-' + (audio.muted ? "mute" : "vol") + '"/></svg>';
      mute.setAttribute("aria-label", audio.muted ? "Unmute music" : "Mute music");
    }

    if (fab) {
      fab.addEventListener("click", function () {
        if (ui.classList.contains("is-needs-tap")) { prepare(); tryPlay(); return; }
        setTray(!trayOpen);
      });
    }
    if (tray) {
      ["pointerdown", "input", "keydown"].forEach(function (ev) {
        tray.addEventListener(ev, function () { if (trayOpen) armCollapse(); });
      });
      document.addEventListener("click", function (e) {
        if (trayOpen && ui && !ui.contains(e.target)) setTray(false);
      });
    }

    if (audio && toggle && mute) {
      toggle.addEventListener("click", function () {
        if (audio.paused) {
          prepare();
          if (volumeWorks && audio.volume === 0) { try { audio.volume = 0.01; } catch (e) { /* ignore */ } }
          tryPlay();
        } else {
          audio.pause();
        }
      });
      mute.addEventListener("click", function () {
        audio.muted = !audio.muted;
        state.music.muted = audio.muted;
        sync();
      });
      if (vol) {
        vol.value = String(MUSIC_VOLUME);
        vol.addEventListener("input", function () {
          if (!volumeWorks) return;
          clearInterval(fadeTimer);
          audio.volume = parseFloat(vol.value);
          if (audio.muted && audio.volume > 0) audio.muted = false;
          sync();
        });
      }
      ["play", "playing", "pause", "ended", "volumechange"].forEach(function (ev) { audio.addEventListener(ev, sync); });
      audio.addEventListener("error", function () {
        if (state.music.started) onFail();
      });
    }

    return { prepare: prepare, start: start, offer: offer };
  })();

  /* ===========================================================
     20. SCREEN 8 — FINAL LETTER + FINAL QUESTION
     =========================================================== */
  var revealObserver = null;
  var finalNo = null;
  var hintScrollHandler = null;

  SCREENS.letter = {
    enter: function (opts) {
      opts = opts || {};
      document.body.classList.add("is-letter");
      document.title = "to my bb ♡";

      var v = $("#void");
      if (v && !v.hidden) {
        v.classList.add("is-leaving");
        v.classList.remove("is-on");
        setTimeout(function () { v.hidden = true; v.classList.remove("is-leaving"); }, 2100);
      }

      var reread = !!opts.reread;
      $("#final-q").hidden = reread || state.finalAnswered;
      $("#reread-back").hidden = !reread;

      setupLetterReveal();
      if (!reread && !state.finalAnswered) armFinalQuestion();

      // tiny "scroll" hint if he hasn't scrolled after a few seconds
      var hint = $("#scroll-hint");
      later(function () { if (window.scrollY < 40 && hint) hint.classList.add("is-on"); }, t(4200));
      hintScrollHandler = function () {
        if (window.scrollY > 60 && hint) {
          hint.classList.remove("is-on");
          window.removeEventListener("scroll", hintScrollHandler);
        }
      };
      window.addEventListener("scroll", hintScrollHandler, { passive: true });
    },
    leave: function () {
      var hint = $("#scroll-hint");
      if (hint) hint.classList.remove("is-on");
      if (hintScrollHandler) window.removeEventListener("scroll", hintScrollHandler);
    }
  };

  function setupLetterReveal() {
    var wrapEl = $(".letter-wrap");
    var items = $$(".letter > p, .letter > h2, .letter > .l-group > p, .letter > .p7, .letter > .letter__break, .final-q > *", wrapEl);
    items.forEach(function (el) { el.classList.add("rv"); });

    if (state.reduced || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    if (revealObserver) revealObserver.disconnect();
    wrapEl.classList.add("js-reveal");

    revealObserver = new IntersectionObserver(function (entries) {
      var batch = [];
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var idx = items.indexOf(en.target);
        // reveal this one and anything above it (covers very fast scrolling)
        for (var k = 0; k <= idx; k++) {
          if (!items[k].classList.contains("is-in") && batch.indexOf(items[k]) === -1) batch.push(items[k]);
        }
      });
      batch.sort(function (a, b) { return items.indexOf(a) - items.indexOf(b); });
      batch.forEach(function (el, n) {
        el.style.transitionDelay = Math.min(n, 6) * 160 + "ms";
        el.classList.add("is-in");
        revealObserver.unobserve(el);
        if (el.classList.contains("p7")) el.style.transitionDelay = "250ms";
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.1 });

    items.forEach(function (el) { if (!el.classList.contains("is-in")) revealObserver.observe(el); });

    // failsafe: if the observer never reports anything, just show the text
    setTimeout(function () {
      if (items.length && !items[0].classList.contains("is-in")) {
        items.forEach(function (el) { el.classList.add("is-in"); });
      }
    }, 3500);
  }

  function armFinalQuestion() {
    var yes = $("#final-yes");
    var no = $("#final-no");
    if (!finalNo) {
      finalNo = Runaway.create(no, {
        gentle: true,
        avoid: function () { return [yes]; },
        onAttempt: function (n, r) { finalAttempt(n, r); },
        onPress: function (via, r) { r.count(true); }
      });
      yes.addEventListener("click", onFinalYes);
    }
    Runaway.arm(finalNo);
  }

  function finalAttempt(n, r) {
    var M = CONTENT.finalNo;
    var msg = $("#final-msg");
    msg.textContent = M[Math.min(n, M.length) - 1];
    if (n >= M.length) {
      Runaway.disarm(r);
      later(function () {
        Runaway.remove(r, function () { msg.textContent = CONTENT.finalNoRemoved; });
      }, 1900);
    }
  }

  function onFinalYes(e) {
    var btn = e.currentTarget;
    if (btn.disabled || state.finalAnswered) return;
    state.finalAnswered = true;
    btn.disabled = true;
    if (finalNo) Runaway.disarm(finalNo);
    $("#final-q").classList.add("is-answered");
    // don't explode anything yet — wait a moment first
    later(function () { go("ending"); }, t(1100));
  }

  /* ===========================================================
     21. ENDING + CERTIFICATE
     =========================================================== */
  // "Good." starts alone in the middle, then glides up to make room for P7
  function expandEnding(ending, els) {
    var before = els.map(function (el) { return el.getBoundingClientRect().top; });
    ending.classList.remove("is-stage1");
    if (state.reduced || !els[0] || !els[0].animate) return;
    els.forEach(function (el, i) {
      var dy = before[i] - el.getBoundingClientRect().top;
      if (Math.abs(dy) < 2) return;
      el.animate([{ transform: "translateY(" + dy.toFixed(1) + "px)" }, { transform: "translateY(0)" }],
        { duration: 1500, easing: "cubic-bezier(.2,.8,.2,1)" });
    });
  }

  SCREENS.ending = {
    enter: function () {
      var ending = $(".ending");
      var good = $(".ending__good");
      var too = $(".ending__too");
      $$("#ending .seq").forEach(function (el) { el.classList.remove("is-in"); });
      ending.classList.add("is-stage1");
      var showAt = function (sel, ms) { later(function () { var el = $(sel); if (el) el.classList.add("is-in"); }, ms); };
      var R = state.reduced;

      showAt(".ending__good", R ? 0 : 900);
      showAt(".ending__too", R ? 0 : 2900);
      later(function () { expandEnding(ending, [good, too]); }, R ? 0 : 4900);
      later(function () {
        FX.protect([good, too, $("#p7-ending"), $(".ending__happy"), $(".ending__date"), $("#requirement")]);
        FX.show({ count: 11 });
      }, R ? 0 : 5500);
      showAt("#p7-ending", R ? 0 : 5700);
      showAt(".ending__happy", R ? 0 : 7800);
      showAt(".ending__date", R ? 0 : 9000);
      later(function () {
        var req = $("#requirement");
        if (!req) return;
        req.classList.add("is-in");
        var rb = req.getBoundingClientRect();
        if (rb.bottom > window.innerHeight - 90) {
          try { req.scrollIntoView({ behavior: R ? "auto" : "smooth", block: "center" }); } catch (err) { req.scrollIntoView(false); }
        }
        focusIfKeyboard($("#mission-btn"));
      }, R ? 0 : 11900);
    },
    leave: function () { FX.stop(); FX.protect(null); }
  };

  SCREENS.certified = {
    enter: function () { document.title = "boyfriend verified ✓"; }
  };

  /* ===========================================================
     22. INIT
     =========================================================== */
  function bindOnce() {
    var exitBtn = $("#exit-btn");
    if (exitBtn) exitBtn.addEventListener("click", onExit);
    var lastBtn = $("#last-thing");
    if (lastBtn) lastBtn.addEventListener("click", onLastThing);
    var mission = $("#mission-btn");
    if (mission) mission.addEventListener("click", function () {
      if (mission.disabled) return;
      mission.disabled = true;
      go("certified").then(function (ok) { if (!ok) mission.disabled = false; });
    });
    var reread = $("#reread-btn");
    if (reread) reread.addEventListener("click", function () { go("letter", { reread: true }); });
    var back = $("#reread-done");
    if (back) back.addEventListener("click", function () { go("certified"); });

    // remember whether he is using a keyboard (for polite focus moves)
    document.addEventListener("keydown", function (e) {
      if (e.key === "Tab" || e.key === "Enter" || e.key === " " || e.key.indexOf("Arrow") === 0) state.lastKeyboard = true;
    }, true);
    document.addEventListener("pointerdown", function () { state.lastKeyboard = false; }, true);
  }

  function startScreen() {
    var id = null;
    try { id = new URLSearchParams(window.location.search).get("screen"); } catch (e) { id = null; }
    return (id && ORDER.indexOf(id) !== -1) ? id : "scanner";
  }

  function init() {
    try {
      var mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      state.reduced = mq.matches;
      var onChange = function () { state.reduced = mq.matches; if (state.reduced) Particles.setMood("off"); };
      if (mq.addEventListener) mq.addEventListener("change", onChange);
      else if (mq.addListener) mq.addListener(onChange);
    } catch (e) { state.reduced = false; }

    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    bindOnce();

    var first = startScreen();
    if (first !== "scanner") {
      // test shortcut, e.g. index.html?screen=letter
      document.body.classList.add("is-lit");
      if (["letter", "ending", "certified"].indexOf(first) !== -1) {
        endComedy();
        state.letterStarted = true;
        Music.offer();
      }
    }
    go(first);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
