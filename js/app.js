/* فكة — interactive design prototype */
(function () {
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
    goalPolicy: "ask",
    paused: false,
    bank: null,
    points: 0,
    awarded: { profile: false, bank: false, goal: false },
    month: MONTH_SAVED,
    continueAfterGoal: false,
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
    if (push && state.view && state.view !== name) state.stack.push(state.view);
    state.view = name;
    $$(".view").forEach((v) => {
      const on = v.dataset.view === name;
      v.classList.toggle("on", on);
      if (on) v.removeAttribute("hidden");
      else v.setAttribute("hidden", "");
    });
    window.scrollTo(0, 0);
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
    $("#stage") && ($("#stage").scrollTop = 0);
    const bodyEl = document.querySelector(".view.on .screen-body");
    if (bodyEl) bodyEl.scrollTop = 0;
    render();
    syncScrollLock();
    if (name === "otp") {
      setTimeout(() => $("#otp-input") && $("#otp-input").focus(), 200);
    }
    if (name === "phone") {
      setTimeout(() => $("#phone-input") && $("#phone-input").focus(), 200);
    }
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

  function syncGoalUI() {
    $$("[data-action='set-goal']").forEach((el) => {
      el.classList.toggle("on", Number(el.dataset.goal) === state.goal);
    });
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
  }

  function validPhone(raw) {
    const d = (raw || "").replace(/\D/g, "");
    return /^5\d{8}$/.test(d);
  }

  function openTxn(i) {
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
      case "noop":
        e.preventDefault();
        break;
      case "signup":
        state.mode = "signup";
        show("phone");
        break;
      case "login":
        state.mode = "login";
        show("phone");
        break;
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
        syncGoalUI();
        break;
      case "save-savings":
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

  $("#bank-search") &&
    $("#bank-search").addEventListener("input", (e) => {
      const q = e.target.value.trim();
      $$("#bank-list [data-action='pick-bank']").forEach((row) => {
        row.style.display = !q || row.dataset.bank.includes(q) ? "" : "none";
      });
    });

  // hash deep-links for debugging: #home
  const hash = (location.hash || "").replace("#", "");
  if (hash && $(`.view[data-view="${hash}"]`)) {
    if (hash === "home" || hash === "history" || hash === "settings" || hash === "profile-main") {
      seedReturningUser();
    }
    show(hash, { push: false });
  } else {
    show("welcome", { push: false });
  }
})();
