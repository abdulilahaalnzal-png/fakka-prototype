/* فكة للأعمال — interest capture (prototype, localStorage only) */
(function () {
  const KEY = "fakka.businessInterest.v1";

  const SECTORS = [
    "تجارة التجزئة",
    "المطاعم والضيافة",
    "الخدمات",
    "المقاولات",
    "التقنية",
    "الصحة",
    "التعليم",
    "الصناعة",
    "النقل والخدمات اللوجستية",
    "تجارة الجملة",
    "أخرى",
  ];

  const RANGES = [
    { id: "1-5", label: "1–5" },
    { id: "6-20", label: "6–20" },
    { id: "21-50", label: "21–50" },
    { id: "51-200", label: "51–200" },
    { id: "201+", label: "أكثر من 200" },
  ];

  const NAME_MIN = 2;
  const NAME_MAX = 80;
  const NOTE_MAX = 280;

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }
  function $$(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  function loadInterest() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || !data.establishmentName) return null;
      return data;
    } catch (e) {
      return null;
    }
  }

  function saveInterest(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function digits(raw) {
    return String(raw || "")
      .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
      .replace(/\D/g, "")
      .slice(0, 9);
  }

  function validPhone(raw) {
    return /^5\d{8}$/.test(digits(raw));
  }

  function validName(raw) {
    const t = (raw || "").trim();
    return t.length >= NAME_MIN && t.length <= NAME_MAX;
  }

  function accountPhone(state) {
    const d = digits((state && state.phone) || "");
    return validPhone(d) ? d : "551234567";
  }

  function setRegistered(on) {
    $$("[data-biz-registered]").forEach((el) => {
      el.classList.toggle("hidden", !on);
    });
    $$("[data-biz-unregistered]").forEach((el) => {
      el.classList.toggle("hidden", on);
    });
  }

  function showFormState(success) {
    const form = $("#biz-form-panel");
    const done = $("#biz-success-panel");
    if (form) form.classList.toggle("hidden", success);
    if (done) done.classList.toggle("hidden", !success);
    const nav = $("#biz-interest-nav");
    if (nav) nav.classList.toggle("hidden", success);
  }

  function clearErrors() {
    $$("#biz-form-panel .biz-field").forEach((f) => f.classList.remove("error"));
  }

  function setError(id, on) {
    const field = document.getElementById(id);
    if (field) field.classList.toggle("error", !!on);
  }

  function selectedRange() {
    const on = $(".biz-chip.on");
    return on ? on.dataset.range : "";
  }

  function syncChips(range) {
    $$(".biz-chip").forEach((el) => {
      el.classList.toggle("on", el.dataset.range === range);
    });
  }

  function fillForm(state) {
    const interest = loadInterest();
    const name = $("#biz-name");
    const sector = $("#biz-sector");
    const note = $("#biz-note");
    const phone = $("#biz-phone");
    if (interest) {
      if (name) name.value = interest.establishmentName || "";
      if (sector) sector.value = interest.sector || "";
      if (note) note.value = interest.note || "";
      if (phone) phone.value = interest.phone || accountPhone(state);
      syncChips(interest.employeeRange || "");
      showFormState(true);
    } else {
      if (name && document.activeElement !== name) name.value = "";
      if (sector) sector.value = "";
      if (note && document.activeElement !== note) note.value = "";
      if (phone && document.activeElement !== phone) phone.value = accountPhone(state);
      syncChips("");
      showFormState(false);
    }
    clearErrors();
  }

  function sync(state) {
    const interest = loadInterest();
    setRegistered(!!interest);
    const view = document.querySelector('.view.on');
    const name = view && view.dataset.view;
    if (name === "business-interest") fillForm(state);
  }

  function validate() {
    const nameOk = validName($("#biz-name") && $("#biz-name").value);
    const sectorOk = !!( $("#biz-sector") && $("#biz-sector").value);
    const rangeOk = !!selectedRange();
    const phoneOk = validPhone($("#biz-phone") && $("#biz-phone").value);
    const note = ($("#biz-note") && $("#biz-note").value) || "";
    const noteOk = note.length <= NOTE_MAX;
    setError("biz-field-name", !nameOk);
    setError("biz-field-sector", !sectorOk);
    setError("biz-field-range", !rangeOk);
    setError("biz-field-phone", !phoneOk);
    setError("biz-field-note", !noteOk);
    return nameOk && sectorOk && rangeOk && phoneOk && noteOk;
  }

  function submit() {
    if (loadInterest()) {
      showFormState(true);
      setRegistered(true);
      return;
    }
    if (!validate()) {
      const first = $("#biz-form-panel .biz-field.error");
      if (first) first.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }
    const record = {
      establishmentName: $("#biz-name").value.trim(),
      sector: $("#biz-sector").value,
      employeeRange: selectedRange(),
      phone: digits($("#biz-phone").value),
      note: ($("#biz-note").value || "").trim(),
      createdAt: new Date().toISOString(),
      source: "app",
    };
    saveInterest(record);
    setRegistered(true);
    showFormState(true);
    window.scrollTo(0, 0);
  }

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-biz]");
    if (!t) return;
    const act = t.dataset.biz;
    if (act === "submit-interest") {
      e.preventDefault();
      submit();
    } else if (act === "pick-range") {
      e.preventDefault();
      syncChips(t.dataset.range);
      setError("biz-field-range", false);
    }
  });

  document.addEventListener("input", (e) => {
    if (e.target.id === "biz-name") setError("biz-field-name", false);
    if (e.target.id === "biz-sector") setError("biz-field-sector", false);
    if (e.target.id === "biz-note") setError("biz-field-note", false);
    if (e.target.id === "biz-phone") {
      e.target.value = digits(e.target.value);
      setError("biz-field-phone", false);
    }
  });

  window.FakkaBusiness = {
    sync,
    loadInterest,
    sectors: SECTORS,
    ranges: RANGES,
  };
})();
