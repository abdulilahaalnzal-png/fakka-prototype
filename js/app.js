/* فكة — interactive design prototype */
(function () {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  function scrollToTop() {
    window.scrollTo(0, 0);
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
    const stage = document.getElementById("stage");
    if (stage) stage.scrollTop = 0;
    const bodyEl = document.querySelector(".view.on .screen-body");
    if (bodyEl) bodyEl.scrollTop = 0;
  }

  const LEVELS = [
    { n: 1, name: "برونزي", from: 0, mark: "cream" },
    { n: 2, name: "فضي", from: 250, mark: "green" },
    { n: 3, name: "ذهبي", from: 500, mark: "green" },
    { n: 4, name: "بلاتيني", from: 1000, mark: "green" },
    { n: 5, name: "ماسي", from: 2000, mark: "green" },
  ];

  const TXNS = [
    { name: "مقهى النخيل", buy: 17, save: 3, when: "اليوم · 4:12 م" },
    { name: "بقالة الحي", buy: 42, save: 3, when: "اليوم · 11:05 ص" },
    { name: "محطة وقود", buy: 88, save: 2, when: "أمس · 8:40 م" },
    { name: "تطبيق توصيل", buy: 33, save: 2, when: "9 نوفمبر · 7:15 م" },
  ];

  const MONTH_SAVED = 38;
  const GOAL_PRESETS = [30, 50, 100, 200];
  const GOAL_MIN = 10;
  const GOAL_MAX = 5000;
  window.TXNS_HELP = TXNS;

  const state = {
    mode: "signup", // signup | login
    view: "welcome",
    stack: [],
    phone: "",
    terms: true,
    name: "",
    email: "",
    step: 5,
    goal: 50,
    goalSet: false,
    goalCustom: false,
    goalPolicy: "ask",
    paused: false,
    bank: null,
    points: 0,
    awarded: { profile: false, bank: false, goal: false },
    month: MONTH_SAVED,
    continueAfterGoal: false,
    nid: "",
    nidTerms: true,
    officialName: "",
    nafathExisting: false,
    nafathCode: 47,
    nafathLeft: 120,
    source: "phone",
    _nfTick: null,
    _nfAuto: null,
    notifs: null,
    notifPrefs: {
      master: true,
      digest: true,
      each: false,
      first: true,
      transfer: true,
      goal: true,
      streak: true,
      points: true,
      bank: true,
      weekly: true,
      nudge: true,
      quiet: true,
    },
    digestTime: "8:00 م",
    _bannerTimer: null,
    _bannerLink: "inbox",
    tickets: null,
    helpQuery: "",
    helpFaqQuery: "",
    helpFaqOpen: "faq-round",
    helpCat: "roundup",
    helpArticle: "how-round",
    reportTxn: 0,
    reportReason: "wrong",
    reportNote: "",
    contactCat: "التحويل",
    contactDesc: "",
    contactShot: false,
    ticketId: "FS-1038",
    confirmId: "FS-1042",
    legalDoc: "privacy",
    helpEmptyTickets: false,
    _openTxn: 0,
    _ticketSeq: 1042,
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function levelInfo(pts) {
    let cur = LEVELS[0];
    for (const L of LEVELS) if (pts >= L.from) cur = L;
    const next = LEVELS.find((L) => L.from > cur.from) || null;
    const lo = cur.from;
    const hi = next ? next.from : cur.from;
    const span = Math.max(1, hi - lo);
    const pct = next ? Math.min(100, Math.round(((pts - lo) / span) * 100)) : 100;
    const left = next ? hi - pts : 0;
    return { cur, next, pct, left };
  }

  function badgeHTML(n) {
    const L = LEVELS.find((x) => x.n === n) || LEVELS[0];
    const fill = L.mark === "cream" ? "#F6F4EF" : "#0B6E56";
    return `<div class="badge-mark l${n}"><svg viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <rect x="6" y="74" width="52" height="20" rx="10" fill="${fill}"/>
      <path fill="none" stroke="${fill}" stroke-width="20" stroke-linecap="round" d="M 91.487 40.014 A 33 33 0 1 1 56.513 40.014"/>
      <circle cx="74" cy="20.5" r="13.2" fill="#C9A84C"/>
      <circle cx="74" cy="20.5" r="7.26" fill="none" stroke="#B8943A" stroke-width="2.4"/>
    </svg></div>`;
  }

  function nextLevelCopy(info, { short = false } = {}) {
    if (!info.next) return "وصلت إلى أعلى مستوى";
    return short
      ? `باقي ${info.left} نقطة وتوصل لل${info.next.name}`
      : `باقي ${info.left} نقطة وتوصل للمستوى ال${info.next.name}`;
  }

  function formatPhone(digits) {
    const d = (digits || "").replace(/\D/g, "").slice(0, 9);
    if (d.length <= 2) return d;
    if (d.length <= 5) return d.slice(0, 2) + " " + d.slice(2);
    return d.slice(0, 2) + " " + d.slice(2, 5) + " " + d.slice(5);
  }

  function displayPhone() {
    const d = state.phone || "5XXXXXXXX";
    return "+966 " + formatPhone(d);
  }

  function roundExample(step) {
    const buy = 17;
    const rounded = Math.ceil(buy / step) * step;
    const save = (rounded - buy).toFixed(0);
    if (step === 1) {
      return 'شراء بـ <b>16.40</b> ريال يُقرَّب إلى <b>17</b>، فتنحفظ لك <b>0.60</b> ريال.';
    }
    return `شراء بـ <b>${buy}</b> ريال يُقرَّب إلى <b>${rounded}</b>، فتنحفظ لك <b>${save}</b> ريال.`;
  }

  function show(name, { push = true } = {}) {
    if (state.view === "nafath-wait" && name !== "nafath-wait") clearNafathTimers();
    if (push && state.view && state.view !== name) state.stack.push(state.view);
    state.view = name;
    $$(".view").forEach((v) => {
      const on = v.dataset.view === name;
      v.classList.toggle("on", on);
      if (on) v.removeAttribute("hidden");
      else v.setAttribute("hidden", "");
    });
    scrollToTop();
    render();
    syncScrollLock();
    scrollToTop();
    requestAnimationFrame(() => {
      scrollToTop();
      requestAnimationFrame(scrollToTop);
    });
    setTimeout(scrollToTop, 0);
    setTimeout(scrollToTop, 50);
    if (name === "bank-connecting") {
      clearTimeout(show._conn);
      show._conn = setTimeout(() => {
        if (state.view === "bank-connecting") {
          awardBank();
          show("bank-linked", { push: false });
        }
      }, 1800);
    }
  }

  function back() {
    const prev = state.stack.pop();
    if (prev) show(prev, { push: false });
    else show("welcome", { push: false });
  }

  function awardProfile() {
    if (!state.awarded.profile) {
      state.points += 20;
      state.awarded.profile = true;
    }
  }
  function awardGoal() {
    if (!state.awarded.goal && state.goalSet) {
      state.points += 15;
      state.awarded.goal = true;
    }
  }
  function awardBank() {
    if (!state.awarded.bank) {
      state.points += 40;
      state.awarded.bank = true;
    }
  }

  function seedReturningUser() {
    state.name = state.name || "فهد العتيبي";
    state.email = state.email || "fahad@email.com";
    state.phone = state.phone || "551234567";
    state.step = 5;
    state.goal = 50;
    state.goalSet = true;
    state.bank = "مصرف الراجحي";
    state.points = 380;
    state.awarded = { profile: true, bank: true, goal: true };
    state.paused = false;
  }

  function initials(name) {
    const parts = (name || "").trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "ف";
    return parts.slice(0, 2).map((p) => p[0]).join(" ");
  }

  function syncStepUI() {
    $$("[data-action='set-step']").forEach((el) => {
      el.classList.toggle("on", Number(el.dataset.step) === state.step);
    });
    $$("#ob-step-ex, #ru-ex").forEach((el) => {
      el.innerHTML = roundExample(state.step);
    });
    const chip = `أقرب ${state.step} ريال`;
    $$("#home-chip, #set-step").forEach((el) => {
      if (el) el.textContent = chip;
    });
    $$("[data-bind='step']").forEach((el) => {
      el.textContent = String(state.step);
    });
    const buy = 17;
    const rounded = Math.ceil(buy / state.step) * state.step;
    if ($("#bank-ex-round")) $("#bank-ex-round").textContent = rounded.toFixed(2) + " ر.س";
    if ($("#bank-ex-save")) $("#bank-ex-save").textContent = (rounded - buy).toFixed(2) + " ر.س";
  }

  function toWesternDigits(str) {
    return String(str || "")
      .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
      .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06F0));
  }

  function sanitizeGoalInput(raw) {
    return toWesternDigits(raw).replace(/\D/g, "").slice(0, 4);
  }

  function parseGoalAmount(raw) {
    const digits = sanitizeGoalInput(raw);
    if (!digits) return { digits: "", value: null, error: null, valid: false };
    const value = parseInt(digits, 10);
    if (!Number.isFinite(value)) return { digits: "", value: null, error: null, valid: false };
    if (value < GOAL_MIN) return { digits, value, error: "أقل مبلغ 10 ر.س", valid: false };
    if (value > GOAL_MAX) return { digits, value, error: "أعلى مبلغ 5,000 ر.س", valid: false };
    return { digits, value, error: null, valid: true };
  }

  function isCustomGoal(n) {
    return !GOAL_PRESETS.includes(Number(n));
  }

  function customGoalSelected() {
    return state.goalCustom || isCustomGoal(state.goal);
  }

  function goalDraftValid() {
    if (!customGoalSelected()) return true;
    const input = document.querySelector(".view.on .goal-amount-input") || $(".goal-amount-input");
    const raw = input ? input.value : (isCustomGoal(state.goal) ? String(state.goal) : "");
    return parseGoalAmount(raw).valid;
  }

  function syncGoalButtons() {
    const ok = goalDraftValid();
    $$("[data-action='save-goal'], [data-action='save-savings']").forEach((btn) => {
      if (btn) btn.disabled = !ok;
    });
  }

  function syncCustomGoalPanels() {
    const custom = customGoalSelected();
    $$(".custom-field[data-action='set-goal-custom']").forEach((el) => {
      el.classList.toggle("on", custom);
      el.setAttribute("aria-pressed", custom ? "true" : "false");
    });
    $$(".goal-custom-panel").forEach((panel) => {
      panel.classList.toggle("hidden", !custom);
      const field = panel.querySelector(".goal-amount-field");
      const input = panel.querySelector(".goal-amount-input");
      const err = panel.querySelector(".field-error");
      const errText = err && err.querySelector("span");
      if (custom && input && document.activeElement !== input && !input.value && isCustomGoal(state.goal)) {
        input.value = String(state.goal);
      }
      const current = parseGoalAmount(input ? input.value : "");
      if (field) field.classList.toggle("error", custom && !!current.error);
      if (input) input.setAttribute("aria-invalid", custom && current.error ? "true" : "false");
      if (err) {
        err.classList.toggle("hidden", !custom || !current.error);
        if (errText) errText.textContent = current.error || "";
      }
    });
    syncGoalButtons();
  }

  function scrollGoalAmountIntoView(input) {
    if (!input) return;
    const body = input.closest(".screen-body");
    const bottom = body && body.querySelector(".bottom");
    const run = () => {
      const vv = window.visualViewport;
      const viewTop = vv ? vv.offsetTop : 0;
      const viewH = vv ? vv.height : window.innerHeight;
      const viewBottom = viewTop + viewH - 16;
      const inputRect = input.getBoundingClientRect();
      const btnRect = bottom ? bottom.getBoundingClientRect() : null;
      const targetBottom = btnRect ? btnRect.bottom + 12 : inputRect.bottom + 24;
      let delta = 0;
      if (inputRect.top < viewTop + 12) delta = inputRect.top - viewTop - 24;
      else if (targetBottom > viewBottom) delta = targetBottom - viewBottom;
      if (delta) window.scrollBy({ top: delta, behavior: "smooth" });
    };
    requestAnimationFrame(() => requestAnimationFrame(run));
    setTimeout(run, 350);
  }

  function onGoalAmountInput(e) {
    const input = e.target;
    const clean = sanitizeGoalInput(input.value);
    if (input.value !== clean) input.value = clean;
    state.goalCustom = true;
    const parsed = parseGoalAmount(clean);
    if (parsed.valid) state.goal = parsed.value;
    const field = input.closest(".goal-amount-field");
    if (field) field.classList.toggle("error", !!parsed.error);
    const panel = input.closest(".goal-custom-panel");
    const err = panel && panel.querySelector(".field-error");
    const errText = err && err.querySelector("span");
    if (err) {
      err.classList.toggle("hidden", !parsed.error);
      if (errText) errText.textContent = parsed.error || "";
    }
    input.setAttribute("aria-invalid", parsed.error ? "true" : "false");
    // Keep the sibling input in the other picker in sync
    $$(".goal-amount-input").forEach((el) => {
      if (el !== input && el.value !== input.value) el.value = input.value;
    });
    syncGoalButtons();
    if ($("#set-goal") && parsed.valid) {
      $("#set-goal").textContent = state.goalSet ? `${state.goal} ريال لشهر نوفمبر` : "لم يُحدَّد بعد";
    }
  }

  function onGoalAmountFocus(e) {
    const field = e.target.closest(".goal-amount-field");
    if (field) field.classList.add("focus");
    document.body.classList.add("goal-kbd-open");
    scrollGoalAmountIntoView(e.target);
  }

  function onGoalAmountBlur(e) {
    const field = e.target.closest(".goal-amount-field");
    if (field) field.classList.remove("focus");
    const parsed = parseGoalAmount(e.target.value);
    if (parsed.valid && e.target.value !== String(parsed.value)) e.target.value = String(parsed.value);
    // Delay removing padding so the tap on Save still lands correctly
    setTimeout(() => {
      if (!document.activeElement || !document.activeElement.classList.contains("goal-amount-input")) {
        document.body.classList.remove("goal-kbd-open");
      }
    }, 150);
  }

  function syncGoalUI() {
    if (isCustomGoal(state.goal)) state.goalCustom = true;
    $$("[data-action='set-goal']").forEach((el) => {
      el.classList.toggle("on", !state.goalCustom && Number(el.dataset.goal) === state.goal);
    });
    syncCustomGoalPanels();
    if ($("#set-goal")) {
      $("#set-goal").textContent = state.goalSet
        ? `${state.goal} ريال لشهر نوفمبر`
        : "لم يُحدَّد بعد";
    }
    const reached = state.goalSet && MONTH_SAVED >= state.goal && !state.continueAfterGoal;
    const card = $("#goal-card");
    const done = $("#goal-done-card");
    if (card && done) {
      if (!state.goalSet) {
        card.classList.remove("hidden");
        done.classList.add("hidden");
        if ($("#goal-meta")) $("#goal-meta").innerHTML = `<span dir="ltr">${MONTH_SAVED} / — ر.س</span>`;
        if ($("#goal-bar")) $("#goal-bar").style.width = "0%";
        if ($("#goal-foot")) $("#goal-foot").innerHTML = "حدّد هدفًا شهريًا من الإعدادات عشان تتابع تقدّمك.";
      } else if (reached) {
        card.classList.add("hidden");
        done.classList.remove("hidden");
        if ($("#goal-done-meta")) $("#goal-done-meta").textContent = `${state.goal} من ${state.goal} ر.س`;
      } else {
        card.classList.remove("hidden");
        done.classList.add("hidden");
        const pct = Math.min(100, Math.round((MONTH_SAVED / state.goal) * 100));
        const left = Math.max(0, state.goal - MONTH_SAVED);
        if ($("#goal-meta")) $("#goal-meta").innerHTML = `<span dir="ltr">${MONTH_SAVED} / ${state.goal} ر.س</span>`;
        if ($("#goal-bar")) $("#goal-bar").style.width = pct + "%";
        if ($("#goal-foot")) {
          $("#goal-foot").innerHTML =
            left === 0
              ? "وصلت هدفك هذا الشهر، والفكة ما زالت تنحفظ."
              : `باقي <b>${left} ريال</b> لتحقيق هدفك هذا الشهر.`;
        }
      }
    }
  }

  function syncPause() {
    const on = state.paused;
    $$("#home-pause, #hist-pause").forEach((el) => el && el.classList.toggle("hidden", !on));
    const tog = $("#pause-toggle");
    if (tog) tog.classList.toggle("on", on);
  }

  function syncLevel() {
    const info = levelInfo(state.points);
    const pill = `${badgeHTML(info.cur.n)}<span class="lvl-name">${info.cur.name}</span>`;
    if ($("#home-level-pill")) $("#home-level-pill").innerHTML = pill;
    if ($("#home-level-bar")) $("#home-level-bar").style.width = info.pct + "%";
    if ($("#home-level-next")) {
      $("#home-level-next").textContent = nextLevelCopy(info, { short: true });
    }
    if ($("#set-badge")) $("#set-badge").innerHTML = badgeHTML(info.cur.n);
    if ($("#set-level-sub")) $("#set-level-sub").textContent = `مستواك: ${info.cur.name} · ${state.points} نقطة`;
    if ($("#profile-badge")) $("#profile-badge").innerHTML = badgeHTML(info.cur.n);
    if ($("#profile-level-name")) $("#profile-level-name").textContent = `مستواك: ${info.cur.name}`;
    if ($("#profile-pts")) $("#profile-pts").textContent = String(state.points);
    if ($("#profile-bar")) $("#profile-bar").style.width = info.pct + "%";
    if ($("#profile-level-foot")) {
      $("#profile-level-foot").textContent = info.next
        ? nextLevelCopy(info) + "."
        : "وصلت إلى أعلى مستوى.";
    }
    if ($("#ph-total")) $("#ph-total").textContent = String(state.points);
    renderLadder(info);
  }

  function renderLadder(info) {
    const host = $("#level-ladder-list");
    if (!host) return;
    host.innerHTML = LEVELS.map((L) => {
      const done = state.points >= L.from && L.n !== info.cur.n;
      const current = L.n === info.cur.n;
      const next = info.next && L.n === info.next.n;
      const cls = current ? "current" : next ? "next" : done ? "done" : "";
      const tag = current ? "مستواك الحالي" : next ? "التالي" : done ? "مكتمل" : "";
      const check = done || current ? '<span class="ll-check" aria-hidden="true">✓</span>' : '<span class="ll-check" aria-hidden="true"></span>';
      return `<li class="${cls}">
        ${badgeHTML(L.n)}
        <div class="ll-copy">
          <div class="ll-name">${L.name}</div>
          <div class="ll-pts">من ${L.from} نقطة</div>
        </div>
        ${tag ? `<span class="ll-tag">${tag}</span>` : ""}
        ${check}
      </li>`;
    }).join("");
  }

  let _lockY = 0;
  function syncScrollLock() {
    const open = !!document.querySelector(
      ".view.on .celebrate:not(.hidden), .view.on .sheet:not(.hidden), #levelup-overlay:not(.hidden)"
    );
    const body = document.body;
    if (open && !body.classList.contains("sheet-open")) {
      _lockY = window.scrollY || window.pageYOffset || 0;
      body.classList.add("sheet-open");
      body.style.top = `-${_lockY}px`;
      body.style.position = "fixed";
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
    } else if (!open && body.classList.contains("sheet-open")) {
      body.classList.remove("sheet-open");
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      window.scrollTo(0, _lockY);
    }
  }

  function syncPointsHistory() {
    const list = $("#ph-list");
    if (!list) return;
    const rows = [];
    if (state.awarded.bank) rows.push(["ربط الحساب البنكي", "+40", "اليوم"]);
    if (state.awarded.goal) rows.push(["تعيين هدف نوفمبر", "+15", "اليوم"]);
    if (state.awarded.profile) rows.push(["إكمال الملف الشخصي", "+20", "اليوم"]);
    if (state.points >= 250) {
      // returning-user demo rows
      rows.push(["تقريب عملية · مقهى النخيل", "+5", "اليوم"]);
      rows.push(["أول ادخار اليوم", "+10", "اليوم"]);
      rows.push(["سلسلة 3 أيام ادخار", "+20", "9 نوفمبر"]);
    }
    if (!rows.length) {
      list.innerHTML = '<div class="empty" style="min-height:120px"><p>ما فيه نقاط بعد.</p></div>';
      return;
    }
    list.innerHTML = rows
      .map(
        (r, i) => `<div class="pts-row${i === rows.length - 1 ? " last" : ""}">
        <div class="pts-ico">+</div>
        <div style="flex:1;min-width:0">
          <div class="row-title">${r[0]}</div>
          <div style="font-size:12px;color:var(--fk-ink-tertiary);margin-top:2px">${r[2]}</div>
        </div>
        <div style="font-weight:700;color:var(--fk-primary)">${r[1]}</div>
      </div>`
      )
      .join("");
    if ($("#ph-month")) {
      const month = rows.reduce((s, r) => s + Number(r[1].replace("+", "") || 0), 0);
      $("#ph-month").textContent = String(Math.min(month, state.points));
    }
  }

  function render() {
    $$("[data-bind='name']").forEach((el) => {
      if (el) el.textContent = state.name || "فهد العتيبي";
    });
    $$("[data-bind='bank']").forEach((el) => {
      if (el) el.textContent = state.bank || "مصرف الراجحي";
    });
    if ($("#otp-phone-label")) $("#otp-phone-label").textContent = displayPhone();
    if ($("#profile-phone")) $("#profile-phone").textContent = displayPhone();
    if ($("#avatar-initials")) $("#avatar-initials").textContent = initials(state.name || "فهد العتيبي");
    if ($("#set-bank-name")) $("#set-bank-name").textContent = state.bank || "اربط حسابك البنكي";
    if ($("#set-bank-sub")) $("#set-bank-sub").textContent = state.bank ? "متصل" : "غير متصل";
    syncStepUI();
    syncGoalUI();
    syncPause();
    syncLevel();
    syncPointsHistory();
    syncBellBadge();
    renderInbox();
    syncNotifPrefs();
    if (window.Help) window.Help.sync(state);
    syncNafathWait();
    const alt = $("#phone-alt-line");
    if (alt) {
      alt.innerHTML =
        state.mode === "signup"
          ? 'عندك حساب؟ <a class="link" href="#" data-action="login-phone">دخول برقم الجوال</a>'
          : 'ما عندك حساب؟ <a class="link" href="#" data-action="signup-phone">أنشئ حساب برقم الجوال</a>';
    }
  }

  function validPhone(raw) {
    const d = (raw || "").replace(/\D/g, "");
    return /^5\d{8}$/.test(d);
  }

  function validNid(raw) {
    const d = (raw || "").replace(/\D/g, "");
    return /^[12]\d{9}$/.test(d);
  }

  function formatNid(digits) {
    const d = (digits || "").replace(/\D/g, "").slice(0, 10);
    if (d.length <= 1) return d;
    if (d.length <= 4) return d[0] + " " + d.slice(1);
    if (d.length <= 7) return d[0] + " " + d.slice(1, 4) + " " + d.slice(4);
    return d[0] + " " + d.slice(1, 4) + " " + d.slice(4, 7) + " " + d.slice(7);
  }

  function formatMmSs(s) {
    const n = Math.max(0, s | 0);
    const m = String(Math.floor(n / 60)).padStart(2, "0");
    const r = String(n % 60).padStart(2, "0");
    return m + ":" + r;
  }

  function clearNafathTimers() {
    if (state._nfTick) clearInterval(state._nfTick);
    if (state._nfAuto) clearTimeout(state._nfAuto);
    state._nfTick = null;
    state._nfAuto = null;
  }

  function syncNafathWait() {
    if ($("#nafath-code")) $("#nafath-code").textContent = String(state.nafathCode);
    if ($("#nafath-expired-code")) $("#nafath-expired-code").textContent = String(state.nafathCode);
    if ($("#nafath-count")) $("#nafath-count").textContent = formatMmSs(state.nafathLeft);
    if ($("#nafath-official-name")) $("#nafath-official-name").textContent = state.officialName || "فهد العتيبي";
    if ($("#nf-name-readonly")) $("#nf-name-readonly").textContent = state.officialName || "فهد العتيبي";
  }

  function startNafathWait() {
    clearNafathTimers();
    state.nafathCode = 10 + Math.floor(Math.random() * 90);
    state.nafathLeft = 120;
    syncNafathWait();
    show("nafath-wait");
    state._nfTick = setInterval(() => {
      state.nafathLeft -= 1;
      syncNafathWait();
      if (state.nafathLeft <= 0) {
        clearNafathTimers();
        if (state.view === "nafath-wait") show("nafath-expired", { push: false });
      }
    }, 1000);
    state._nfAuto = setTimeout(() => {
      if (state.view === "nafath-wait") nafathApprove();
    }, 4000);
  }

  function nafathApprove() {
    clearNafathTimers();
    state.officialName = "فهد العتيبي";
    state.name = "فهد العتيبي";
    state.nafathExisting = state.nid === "1098765432";
    syncNafathWait();
    show("nafath-ok");
  }

  function openTxn(i) {
    state._openTxn = Number(i) || 0;
    const t = TXNS[Number(i)] || TXNS[0];
    const rounded = t.buy + t.save;
    if ($("#txn-name")) $("#txn-name").textContent = t.name;
    if ($("#txn-meta")) $("#txn-meta").textContent = `${t.when} · ${state.bank || "مصرف الراجحي"}`;
    if ($("#txn-buy")) $("#txn-buy").textContent = t.buy.toFixed(2) + " ر.س";
    if ($("#txn-round")) $("#txn-round").textContent = rounded.toFixed(2) + " ر.س";
    if ($("#txn-save")) $("#txn-save").textContent = "+" + t.save.toFixed(2) + " ر.س";
    show("history", { push: state.view !== "history" });
    $("#txn-scrim").classList.remove("hidden");
    $("#txn-sheet").classList.remove("hidden");
    syncScrollLock();
  }
  function closeTxn() {
    $("#txn-scrim") && $("#txn-scrim").classList.add("hidden");
    $("#txn-sheet") && $("#txn-sheet").classList.add("hidden");
    syncScrollLock();
  }

  function setOtpBoxes(val) {
    const d = (val || "").replace(/\D/g, "").slice(0, 6);
    $$("[data-otp-box]").forEach((box, i) => {
      box.textContent = d[i] || "";
      box.classList.toggle("focus", i === d.length || (d.length === 6 && i === 5));
      box.classList.remove("error");
    });
    $("#otp-error").classList.add("hidden");
  }


  const NOTIF_ICONS = {
    save: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/></svg>',
    star: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5l2.4 5 5.5.8-4 3.9.9 5.5L12 16.8 7.2 18.7l.9-5.5-4-3.9 5.5-.8L12 3.5z"/></svg>',
    goal: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/></svg>',
    week: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></svg>',
  };

  function defaultNotifs() {
    return [
      { id: "n1", type: "daily_digest", title: "فكتك اليوم", body: "انحفظت 4 عمليات بـ 7.50 ر.س. رصيد التحويل صار 14 من 20.", time: "8:00 م", group: "today", read: false, link: "history", ico: "save", icoCls: "" },
      { id: "n2", type: "first_save_points", title: "أول ادخار اليوم", body: "انحفظت فكتك اليوم، وكسبت +10 نقاط.", time: "11:05 ص", group: "today", read: false, link: "points-history", ico: "star", icoCls: "gold" },
      { id: "n3", type: "streak_at_risk", title: "سلسلتك مستمرة", body: "عندك سلسلة 7 أيام. إذا انحفظت فكة اليوم تبقى السلسلة.", time: "أمس، 8:00 م", group: "earlier", read: false, link: "home", ico: "star", icoCls: "gold" },
      { id: "n4", type: "goal_50", title: "وصلت لنص الهدف", body: "ادّخرت 25 من 50 ريال لهدف نوفمبر. تمشي تمام.", time: "2 نوفمبر", group: "earlier", read: true, link: "goal", ico: "goal", icoCls: "" },
      { id: "n5", type: "weekly_summary", title: "ملخص أسبوعك", body: "هذا الأسبوع: 12 عملية، 18.50 ر.س انحفظت، و+70 نقطة.", time: "السبت", group: "earlier", read: true, link: "history", ico: "week", icoCls: "" },
      { id: "n6", type: "level_progress", title: "باقي 120 نقطة", body: "مستواك فضي، وباقي 120 نقطة وتوصل للذهبي.", time: "28 أكتوبر", group: "earlier", read: true, link: "profile-main", ico: "star", icoCls: "gold" },
    ];
  }
  state.notifs = defaultNotifs();
  if (window.Help && !state.tickets) state.tickets = window.Help.defaultTickets();

  function unreadCount() {
    return (state.notifs || []).filter((n) => !n.read).length;
  }

  function syncBellBadge() {
    const n = unreadCount();
    const el = $("#home-bell-badge");
    if (!el) return;
    if (n > 0) {
      el.hidden = false;
      el.textContent = String(n);
    } else {
      el.hidden = true;
    }
  }

  function renderInbox() {
    const root = $("#inbox-list");
    if (!root) return;
    const list = state.notifs || [];
    if (!list.length) {
      root.innerHTML = `<div class="empty" style="flex:1;min-height:280px">
        <div class="empty-art"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6.2 9.2a5.8 5.8 0 1 1 11.6 0c0 3.4 1.2 5 1.8 6H4.4c.6-1 1.8-2.6 1.8-6Z"/><path d="M10 18.2a2 2 0 0 0 4 0"/></svg></div>
        <h3>ما فيه إشعارات</h3>
        <p>عندما تنحفظ فكة أو يوصل تحويل، تظهر هنا. تقدر تعدّل التنبيهات من الإعدادات.</p>
      </div>`;
      return;
    }
    const groups = [
      ["today", "اليوم"],
      ["earlier", "سابقًا"],
    ];
    let html = "";
    for (const [key, label] of groups) {
      const rows = list.filter((n) => n.group === key);
      if (!rows.length) continue;
      html += `<div class="n-group-label">${label}</div><div class="n-list">`;
      html += rows
        .map((n) => {
          const unread = n.read ? "" : " unread";
          const ico = NOTIF_ICONS[n.ico] || NOTIF_ICONS.save;
          return `<button type="button" class="n-row${unread}" data-action="open-notif" data-nid="${n.id}">
            <div class="n-ico ${n.icoCls || ""}">${ico}</div>
            <div class="n-copy">
              <div class="n-title-row"><span class="n-title">${n.title}</span><span class="n-time">${n.time}</span></div>
              <div class="n-body">${n.body}</div>
            </div>
            <span class="n-dot"></span>
          </button>`;
        })
        .join("");
      html += "</div>";
    }
    root.innerHTML = html;
  }

  function syncNotifPrefs() {
    $$("[data-action='toggle-pref']").forEach((el) => {
      const key = el.dataset.pref;
      el.classList.toggle("on", !!state.notifPrefs[key]);
    });
    if ($("#digest-time-val")) $("#digest-time-val").textContent = state.digestTime;
  }

  function hideBanner() {
    const b = $("#notif-banner");
    if (b) b.hidden = true;
    if (state._bannerTimer) {
      clearTimeout(state._bannerTimer);
      state._bannerTimer = null;
    }
  }

  function showBanner(n) {
    const b = $("#notif-banner");
    if (!b) return;
    if ($("#nb-title")) $("#nb-title").textContent = n.title;
    if ($("#nb-body")) $("#nb-body").textContent = n.body;
    state._bannerLink = n.link || "inbox";
    state._bannerNid = n.id;
    b.hidden = false;
    if (state._bannerTimer) clearTimeout(state._bannerTimer);
    state._bannerTimer = setTimeout(hideBanner, 4500);
  }

  const DIGEST_TIMES = ["8:00 م", "9:00 م", "9:30 م", "7:00 م"];

  // events
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-action], [data-nav], [data-back], [data-tab], [data-filter]");
    if (!t) return;
    if (t.matches("a[href='#']")) e.preventDefault();
    if (t.dataset.back !== undefined) {
      e.preventDefault();
      back();
      return;
    }
    if (t.dataset.nav) {
      show(t.dataset.nav);
      return;
    }
    if (t.dataset.tab) {
      closeTxn();
      const map = { home: "home", history: "history", settings: "settings" };
      show(map[t.dataset.tab] || "home", { push: false });
      state.stack = state.stack.filter((v) => !["home", "history", "settings"].includes(v));
      return;
    }
    if (t.dataset.filter) {
      $$("#hist-filters .filter-chip").forEach((c) => c.classList.toggle("on", c === t));
      return;
    }
    const act = t.dataset.action;
    if (!act) return;
    switch (act) {

      case "open-inbox":
        show("inbox");
        break;
      case "open-notif": {
        const id = t.dataset.nid;
        const n = (state.notifs || []).find((x) => x.id === id);
        if (n) {
          n.read = true;
          const target = n.link || "home";
          if ($(`.view[data-view="${target}"]`)) show(target);
          else show("home");
        }
        break;
      }
      case "demo-notif": {
        const n = {
          id: "demo-" + Date.now(),
          type: "daily_digest",
          title: "فكتك اليوم",
          body: "انحفظت 4 عمليات بـ 7.50 ر.س. رصيد التحويل صار 14 من 20.",
          time: "الآن",
          group: "today",
          read: false,
          link: "history",
          ico: "save",
          icoCls: "",
        };
        state.notifs = [n].concat(state.notifs || []);
        renderInbox();
        syncBellBadge();
        showBanner(n);
        break;
      }
      case "open-banner": {
        hideBanner();
        const id = state._bannerNid;
        const n = (state.notifs || []).find((x) => x.id === id);
        if (n) n.read = true;
        const target = state._bannerLink || "inbox";
        if ($(`.view[data-view="${target}"]`)) show(target);
        else show("inbox");
        break;
      }
      case "toggle-pref": {
        const key = t.dataset.pref;
        if (key && key in state.notifPrefs) {
          state.notifPrefs[key] = !state.notifPrefs[key];
          if (key === "master" && !state.notifPrefs.master) {
            // master off does not change security (no pref key)
          }
          syncNotifPrefs();
        }
        break;
      }
      case "cycle-digest-time": {
        const i = DIGEST_TIMES.indexOf(state.digestTime);
        state.digestTime = DIGEST_TIMES[(i + 1) % DIGEST_TIMES.length];
        syncNotifPrefs();
        break;
      }
      case "noop":
        e.preventDefault();
        break;
      case "signup":
        state.mode = "signup";
        state.source = "phone";
        show("phone");
        break;
      case "login":
        state.mode = "login";
        state.source = "phone";
        show("phone");
        break;
      case "login-phone":
        state.mode = "login";
        state.source = "phone";
        show("phone");
        break;
      case "signup-phone":
        state.mode = "signup";
        state.source = "phone";
        show("phone");
        break;
      case "nafath-start":
        state.source = "nafath";
        show("nid");
        break;
      case "submit-nid": {
        const raw = ($("#nid-input").value || "").replace(/\D/g, "");
        if (!validNid(raw) || !state.nidTerms) {
          $("#nid-field") && $("#nid-field").classList.toggle("error", !validNid(raw));
          $("#nid-error") && $("#nid-error").classList.toggle("hidden", validNid(raw));
          if (!state.nidTerms && $("#nid-terms-row")) $("#nid-terms-row").style.outline = "2px solid var(--fk-danger)";
          return;
        }
        state.nid = raw;
        $("#nid-field") && $("#nid-field").classList.remove("error");
        $("#nid-error") && $("#nid-error").classList.add("hidden");
        startNafathWait();
        break;
      }
      case "open-nafath-app":
        if ($(".demo-preview .dp-k")) {
          $(".demo-preview .dp-k").textContent = "في التطبيق الحقيقي يُفتح تطبيق نفاذ هنا. للمعولية اختر حالة من المعاينة، أو انتظر القبول التجريبي.";
        }
        break;
      case "nafath-approve":
        nafathApprove();
        break;
      case "nafath-reject":
        clearNafathTimers();
        show("nafath-rejected");
        break;
      case "nafath-expire":
        clearNafathTimers();
        show("nafath-expired");
        break;
      case "nafath-down":
        clearNafathTimers();
        show("nafath-down");
        break;
      case "nafath-retry":
      case "nafath-resend":
        startNafathWait();
        break;
      case "nafath-later":
        show("welcome", { push: false });
        state.stack = [];
        break;
      case "confirm-nafath":
        if (state.nafathExisting) {
          seedReturningUser();
          state.name = state.officialName || state.name;
          show("home", { push: false });
          state.stack = [];
        } else {
          show("nafath-phone");
        }
        break;
      case "submit-nafath-phone": {
        const raw = ($("#nf-phone-input").value || "").replace(/\D/g, "");
        if (!validPhone(raw)) {
          $("#nf-phone-field") && $("#nf-phone-field").classList.add("error");
          $("#nf-phone-error") && $("#nf-phone-error").classList.remove("hidden");
          return;
        }
        state.phone = raw;
        $("#nf-phone-field") && $("#nf-phone-field").classList.remove("error");
        $("#nf-phone-error") && $("#nf-phone-error").classList.add("hidden");
        show("nafath-email");
        break;
      }
      case "submit-nafath-email": {
        const email = ($("#nf-email-input").value || "").trim();
        if (!/.+@.+\..+/.test(email)) {
          $("#nf-email-field") && $("#nf-email-field").classList.add("error");
          return;
        }
        state.email = email;
        state.name = state.officialName || state.name;
        awardProfile();
        show("profile-points");
        break;
      }
      case "submit-phone": {
        const raw = ($("#phone-input").value || "").replace(/\D/g, "");
        if (!validPhone(raw) || !state.terms) {
          $("#phone-field").classList.toggle("error", !validPhone(raw));
          $("#phone-error").classList.toggle("hidden", validPhone(raw));
          if (!state.terms) $("#terms-row").style.outline = "2px solid var(--fk-danger)";
          return;
        }
        state.phone = raw;
        $("#phone-field").classList.remove("error");
        $("#phone-error").classList.add("hidden");
        show("otp");
        break;
      }
      case "submit-otp": {
        const code = ($("#otp-input").value || "").replace(/\D/g, "");
        if (code.length !== 6) {
          $$("[data-otp-box]").forEach((b) => b.classList.add("error"));
          $("#otp-error").classList.remove("hidden");
          return;
        }
        if (state.mode === "login") {
          seedReturningUser();
          show("home", { push: false });
          state.stack = [];
        } else {
          show("profile");
        }
        break;
      }
      case "submit-profile": {
        const name = ($("#name-input").value || "").trim();
        const email = ($("#email-input").value || "").trim();
        if (name.length < 2) {
          $("#name-field").classList.add("error");
          return;
        }
        if (!/.+@.+\..+/.test(email)) {
          $("#email-field").classList.add("error");
          return;
        }
        state.name = name;
        state.email = email;
        awardProfile();
        show("profile-points");
        break;
      }
      case "goto-savings":
        show("savings");
        break;
      case "set-step":
        state.step = Number(t.dataset.step);
        syncStepUI();
        break;
      case "set-goal":
        state.goal = Number(t.dataset.goal);
        state.goalCustom = false;
        document.body.classList.remove("goal-kbd-open");
        syncGoalUI();
        break;
      case "set-goal-custom":
        state.goalCustom = true;
        if (isCustomGoal(state.goal)) {
          $$(".goal-amount-input").forEach((el) => {
            if (!el.value) el.value = String(state.goal);
          });
        }
        syncGoalUI();
        (function () {
          const input = document.querySelector(".view.on .goal-amount-input");
          if (input) {
            input.focus();
            scrollGoalAmountIntoView(input);
          }
        })();
        break;
      case "save-savings":
        if (!goalDraftValid()) break;
        if (state.goalCustom) {
          const parsed = parseGoalAmount((document.querySelector(".view.on .goal-amount-input") || {}).value || "");
          if (!parsed.valid) break;
          state.goal = parsed.value;
        }
        state.goalSet = true;
        awardGoal();
        show("levels");
        break;
      case "skip-goal":
        state.goalSet = false;
        show("levels");
        break;
      case "skip-bank":
        show("home", { push: false });
        state.stack = [];
        break;
      case "pick-bank":
        state.bank = t.dataset.bank;
        show("bank-connecting");
        break;
      case "enter-home":
        show("home", { push: false });
        state.stack = [];
        break;
      case "open-txn":
        openTxn(t.dataset.txn);
        break;
      case "close-txn":
        closeTxn();
        break;
      case "open-help-cat":
        state.helpCat = t.dataset.cat || "roundup";
        show("help-category");
        break;
      case "open-article":
        state.helpArticle = t.dataset.article || "how-round";
        if (state.view === "help-article") {
          if (window.Help) window.Help.sync(state);
        } else {
          show("help-article");
        }
        break;
      case "toggle-faq": {
        const id = t.dataset.faq;
        state.helpFaqOpen = state.helpFaqOpen === id ? "" : id;
        if (window.Help) window.Help.sync(state);
        break;
      }
      case "open-report":
        closeTxn();
        state.reportTxn = state._openTxn || 0;
        state.reportReason = "wrong";
        state.reportNote = "";
        show("help-report");
        break;
      case "pick-reason":
        state.reportReason = t.dataset.reason || "wrong";
        if (window.Help) window.Help.sync(state);
        break;
      case "submit-report": {
        const txn = (window.TXNS_HELP || [])[state.reportTxn] || { name: "مقهى النخيل", buy: 17, save: 3, when: "اليوم" };
        const reason = ((window.HELP_DATA && window.HELP_DATA.reportReasons) || []).find((r) => r.id === state.reportReason) || { title: "مبلغ غير صحيح", desc: "" };
        const id = window.Help ? window.Help.nextTicketId(state) : "FS-1043";
        const ticket = {
          id,
          status: "open",
          status_ar: "مفتوح",
          title: reason.title,
          cat: "الادخار والتقريب",
          sub: (txn.name || "") + " · اليوم",
          body: state.reportNote || reason.desc || reason.title,
          txn: (txn.name || "") + " · " + Number(txn.buy).toFixed(2) + " ر.س · فكة " + Number(txn.save).toFixed(2),
          txnName: txn.name,
          timeline: [["أُنشئ الطلب", "الآن", true]],
        };
        state.tickets = [ticket].concat(state.tickets || []);
        state.confirmId = id;
        state.ticketId = id;
        show("help-confirm");
        break;
      }
      case "submit-contact": {
        const desc = (state.contactDesc || "").trim();
        if (!desc) break;
        const id = window.Help ? window.Help.nextTicketId(state) : "FS-1043";
        const ticket = {
          id,
          status: "open",
          status_ar: "مفتوح",
          title: state.contactCat || "أخرى",
          cat: state.contactCat || "أخرى",
          sub: "اليوم",
          body: desc + (state.contactShot ? " (مرفقة لقطة شاشة)" : ""),
          txn: "",
          txnName: "",
          timeline: [["أُنشئ الطلب", "الآن", true]],
        };
        state.tickets = [ticket].concat(state.tickets || []);
        state.confirmId = id;
        state.ticketId = id;
        state.contactDesc = "";
        state.contactShot = false;
        show("help-confirm");
        break;
      }
      case "attach-shot":
        state.contactShot = !state.contactShot;
        if (window.Help) window.Help.sync(state);
        break;
      case "open-ticket":
        state.ticketId = t.dataset.ticket || state.ticketId;
        if (state.view === "help-ticket") {
          if (window.Help) window.Help.sync(state);
        } else {
          show("help-ticket");
        }
        break;
      case "open-legal-doc":
        state.legalDoc = t.dataset.doc || "privacy";
        if (window.Help) window.Help.sync(state);
        break;
      case "toggle-pause":
        state.paused = !state.paused;
        syncPause();
        break;
      case "resume":
        state.paused = false;
        syncPause();
        break;
      case "continue-goal":
        state.continueAfterGoal = true;
        syncGoalUI();
        break;
      case "pause-till-next":
        state.paused = true;
        state.continueAfterGoal = true;
        syncGoalUI();
        syncPause();
        break;
      case "set-goal-policy":
        state.goalPolicy = t.dataset.policy;
        $$("[data-action='set-goal-policy']").forEach((el) =>
          el.classList.toggle("on", el === t)
        );
        break;
      case "save-goal":
        if (!goalDraftValid()) break;
        if (state.goalCustom) {
          const parsed = parseGoalAmount((document.querySelector(".view.on .goal-amount-input") || {}).value || "");
          if (!parsed.valid) break;
          state.goal = parsed.value;
        }
        state.goalSet = true;
        awardGoal();
        show("home");
        break;
      case "open-bank":
        if (state.bank) {
          /* already linked — stay, or go to intro */
          show("bank-intro");
        } else show("bank-intro");
        break;
      case "preview-levelup":
        $("#levelup-overlay").classList.remove("hidden");
        syncScrollLock();
        break;
      case "close-levelup":
        $("#levelup-overlay").classList.add("hidden");
        syncScrollLock();
        break;
      case "logout":
        Object.assign(state, {
          mode: "signup",
          phone: "",
          name: "",
          email: "",
          step: 5,
          goal: 50,
          goalSet: false,
          goalCustom: false,
          paused: false,
          bank: null,
          points: 0,
          awarded: { profile: false, bank: false, goal: false },
          continueAfterGoal: false,
          stack: [],
        });
        if ($("#phone-input")) $("#phone-input").value = "";
        if ($("#otp-input")) $("#otp-input").value = "";
        if ($("#name-input")) $("#name-input").value = "";
        if ($("#email-input")) $("#email-input").value = "";
        $$(".goal-amount-input").forEach((el) => { el.value = ""; });
        document.body.classList.remove("goal-kbd-open");
        setOtpBoxes("");
        show("welcome", { push: false });
        break;
    }
  });

  $("#phone-input") &&
    $("#phone-input").addEventListener("input", (e) => {
      const d = e.target.value.replace(/\D/g, "").slice(0, 9);
      e.target.value = d;
      $("#phone-field").classList.toggle("focus", true);
      $("#phone-field").classList.remove("error");
      $("#phone-error").classList.add("hidden");
    });

  $("#terms-row") &&
    $("#terms-row").addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      e.preventDefault();
      state.terms = !state.terms;
      $("#terms-box").classList.toggle("on", state.terms);
      $("#terms-box").innerHTML = state.terms
        ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l5 5 9-11"/></svg>'
        : "";
      $("#terms-row").style.outline = "";
    });

  const otpInput = $("#otp-input");
  if (otpInput) {
    const focusOtp = () => otpInput.focus();
    $(".otp-wrap").addEventListener("click", focusOtp);
    otpInput.addEventListener("input", () => {
      otpInput.value = otpInput.value.replace(/\D/g, "").slice(0, 6);
      setOtpBoxes(otpInput.value);
    });
    otpInput.addEventListener("focus", () => setOtpBoxes(otpInput.value));
  }

  $("#nid-input") &&
    $("#nid-input").addEventListener("input", (e) => {
      const d = e.target.value.replace(/\D/g, "").slice(0, 10);
      e.target.value = formatNid(d);
      $("#nid-field") && $("#nid-field").classList.remove("error");
      $("#nid-error") && $("#nid-error").classList.add("hidden");
    });

  $("#nid-terms-row") &&
    $("#nid-terms-row").addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      e.preventDefault();
      state.nidTerms = !state.nidTerms;
      const box = $("#nid-terms-box");
      if (box) {
        box.classList.toggle("on", state.nidTerms);
        box.innerHTML = state.nidTerms
          ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l5 5 9-11"/></svg>'
          : "";
      }
      if ($("#nid-terms-row")) $("#nid-terms-row").style.outline = "";
    });

  $("#nf-phone-input") &&
    $("#nf-phone-input").addEventListener("input", (e) => {
      const d = e.target.value.replace(/\D/g, "").slice(0, 9);
      e.target.value = d;
      $("#nf-phone-field") && $("#nf-phone-field").classList.remove("error");
      $("#nf-phone-error") && $("#nf-phone-error").classList.add("hidden");
    });

  $("#nf-email-input") &&
    $("#nf-email-input").addEventListener("input", () => {
      $("#nf-email-field") && $("#nf-email-field").classList.remove("error");
    });

  $("#bank-search") &&
    $("#bank-search").addEventListener("input", (e) => {
      const q = e.target.value.trim();
      $$("#bank-list [data-action='pick-bank']").forEach((row) => {
        row.style.display = !q || row.dataset.bank.includes(q) ? "" : "none";
      });
    });

  window.addEventListener("pageshow", () => scrollToTop());

  $$(".goal-amount-input").forEach((input) => {
    input.addEventListener("input", onGoalAmountInput);
    input.addEventListener("focus", onGoalAmountFocus);
    input.addEventListener("blur", onGoalAmountBlur);
  });
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", () => {
      const active = document.activeElement;
      if (active && active.classList.contains("goal-amount-input")) {
        scrollGoalAmountIntoView(active);
      }
    });
  }

  // hash deep-links for debugging: #home
  const hash = (location.hash || "").replace("#", "");
  if (hash && $(`.view[data-view="${hash}"]`)) {
    if (hash === "home" || hash === "history" || hash === "settings" || hash === "profile-main" || hash === "inbox" || hash === "notif-settings" || hash === "goal" || hash.indexOf("help") === 0) {
      seedReturningUser();
    }
    show(hash, { push: false });
  } else {
    show("welcome", { push: false });
  }
})();
