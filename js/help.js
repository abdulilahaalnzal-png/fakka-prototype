/* Help & Support — renderers for the Fakka prototype */
(function () {
  const ICO = {
    roundup: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="14" r="5"/><circle cx="16" cy="9" r="4.5"/><path d="M16 7v4M14 9h4"/></svg>',
    transfer: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17V7m0 0L4 10M7 7l3 3"/><path d="M17 7v10m0 0 3-3m-3 3-3-3"/></svg>',
    goal: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/></svg>',
    points: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.6 14.4 9l5.6.6-4.2 3.8 1.2 5.5L12 16.4 6.99 18.9l1.2-5.5L4 9.6 9.6 9z"/></svg>',
    bank: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10.5 12 5l8 5.5"/><path d="M6 10.5V18h12v-7.5"/><path d="M4 18h16"/><path d="M12 10.5V18"/></svg>',
    account: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 5 6.5v5.2c0 4.1 2.8 7.2 7 8.3 4.2-1.1 7-4.2 7-8.3V6.5L12 3z"/><path d="M9.2 12.1 11 13.8l3.8-3.8"/></svg>',
    search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>',
    mail: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4 7 8 6 8-6"/></svg>',
    wa: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 19.5 5 21.2V17a8.5 8.5 0 1 1 3.2 3.4"/><path d="M9.2 10.2c.3 1.6 1.7 3.1 3.3 3.6.4.1.8 0 1.1-.2l.8-.7c.2-.2.5-.2.8-.1l2.2 1c.3.1.5.5.4.8-.2 1.3-1.6 2.3-3 2.1-3.4-.4-6.6-3.3-7.5-6.6-.4-1.4.3-2.9 1.5-3.4.3-.1.7 0 .9.3l1.1 1.9c.1.3.1.6-.1.8l-.7.8c-.2.2-.2.6-.1.8z"/></svg>',
    attach: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15.2 7.4 8.1 14.6a3 3 0 0 0 4.3 4.2l8-8.1a4.6 4.6 0 0 0-6.5-6.5l-8.3 8.3"/></svg>',
    check: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 12.5 10.2 17 18 8.5"/></svg>',
    inbox: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 14 7.2 5.8A2 2 0 0 1 9.1 4.5h5.8a2 2 0 0 1 1.9 1.3L20 14"/><path d="M4 14h4.2l1.3 2.4h5L16 14h4v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5z"/></svg>',
    offline: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 8.5A15 15 0 0 1 12 5c.8 0 1.6.06 2.3.18"/><path d="M5.5 11.5A10 10 0 0 1 12 10c.5 0 1 .04 1.4.12"/><path d="M8.8 14.5A5.5 5.5 0 0 1 12 14c.3 0 .6 0 .9.06"/><circle cx="12" cy="18.2" r="1.2" fill="currentColor" stroke="none"/><path d="M4 4l16 16"/></svg>',
    emptySearch: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4M8.5 11h5"/></svg>',
  };

  const CHEV = '<svg class="row-chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';

  const D = () => window.HELP_DATA;
  const esc = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  function catById(id) {
    return D().cats.find((c) => c.id === id) || D().cats[0];
  }

  function head(title) {
    return `<div class="h-head">
      <button type="button" class="icon-btn" data-back aria-label="رجوع"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg></button>
      <h1 class="h-title">${esc(title)}</h1>
    </div>`;
  }

  function listRow({ title, sub, last, action, extra, chev = true }) {
    const attrs = action ? ` type="button" class="list-row${last ? " last" : ""}" ${action} style="width:100%;background:none;border:0;font:inherit;color:inherit;text-align:inherit;"` 
      : ` class="list-row${last ? " last" : ""}"`;
    const tag = action ? "button" : "div";
    const subH = sub ? `<div style="font-size:12.5px;color:var(--fk-ink-secondary);margin-top:2px">${esc(sub)}</div>` : "";
    return `<${tag}${attrs}><div><div class="row-title">${esc(title)}</div>${subH}</div>${extra || ""}${chev ? CHEV : ""}</${tag}>`;
  }

  function searchHits(query) {
    const q = (query || "").trim();
    if (!q) return [];
    const seen = new Set();
    const entries = [];
    for (const item of D().faq) {
      if (item.q.includes(q) || item.a.includes(q)) {
        if (!seen.has(item.q)) {
          seen.add(item.q);
          const art = D().articles[item.article] || {};
          entries.push({ title: item.q, sub: art.teaser || item.a, article: item.article });
        }
      }
    }
    for (const [id, art] of Object.entries(D().articles)) {
      if (art.title.includes(q) && !seen.has(art.title)) {
        seen.add(art.title);
        entries.push({ title: art.title, sub: art.teaser || art.body[0], article: id });
      }
    }
    return entries;
  }

  function renderHomeMain(root, state) {
    const q = state.helpQuery || "";
    if (q.trim()) {
      const entries = searchHits(q);
      if (!entries.length) {
        root.innerHTML = `<div class="h-empty" style="min-height:360px">
          <div class="h-empty-ico">${ICO.emptySearch}</div>
          <h2>ما لقينا نتيجة</h2>
          <p>ما في مقالة أو سؤال يطابق «${esc(q.trim())}». جرّب كلمة ثانية، أو تصفّح التصنيفات.</p>
        </div>`;
        return;
      }
      const rows = entries.map((e, i) => listRow({
        title: e.title,
        sub: e.sub,
        last: i === entries.length - 1,
        action: `data-action="open-article" data-article="${esc(e.article)}"`,
      })).join("");
      root.innerHTML = `<div class="h-results">
        <div class="h-result-count">${entries.length} نتائج لـ «${esc(q.trim())}»</div>
        <div class="list-card">${rows}</div>
      </div>`;
      return;
    }
    const cards = D().cats.map((c) => `<button type="button" class="h-cat" data-action="open-help-cat" data-cat="${c.id}">
      <div class="h-cat-ico">${ICO[c.ico] || ""}</div>
      <div><div class="h-cat-name">${esc(c.name)}</div><div class="h-cat-sub">${esc(c.sub)}</div></div>
    </button>`).join("");
    const linkAction = { faq: 'data-nav="help-faq"', tickets: 'data-nav="help-tickets"', contact: 'data-nav="help-contact"', legal: 'data-nav="help-legal"' };
    const rows = D().links.map((l, i) => listRow({
      title: l.title,
      sub: l.sub,
      last: i === D().links.length - 1,
      action: linkAction[l.id] || "",
    })).join("");
    root.innerHTML = `<div class="h-cats">${cards}</div><div class="list-card h-links">${rows}</div>`;
  }

  function renderHome(state) {
    const body = document.getElementById("help-home-body");
    if (!body) return;
    const q = state.helpQuery || "";
    if (!body.dataset.ready) {
      body.innerHTML = `${head("مساعدة ودعم")}
        <p class="h-kicker">كيف نقدر نساعدك؟ ابحث أو اختر تصنيفًا.</p>
        <div class="search h-search">
          ${ICO.search}
          <input id="help-search" type="search" enterkeyhint="search" placeholder="ابحث في الأسئلة والمقالات" value="${esc(q)}" autocomplete="off" />
        </div>
        <div id="help-home-main"></div>`;
      body.dataset.ready = "1";
      const input = body.querySelector("#help-search");
      input.addEventListener("input", () => {
        state.helpQuery = input.value;
        renderHomeMain(document.getElementById("help-home-main"), state);
      });
    } else {
      const input = body.querySelector("#help-search");
      if (input && input.value !== q && document.activeElement !== input) input.value = q;
    }
    renderHomeMain(document.getElementById("help-home-main"), state);
  }

  function renderCategory(state) {
    const el = document.getElementById("help-cat-body");
    if (!el) return;
    const cat = catById(state.helpCat);
    const arts = cat.articles.map((id) => ({ id, ...D().articles[id] })).filter((a) => a.title);
    const rows = arts.map((a, i) => listRow({
      title: a.title,
      sub: a.teaser || a.body[0],
      last: i === arts.length - 1,
      action: `data-action="open-article" data-article="${a.id}"`,
    })).join("");
    el.innerHTML = `${head(cat.name)}
      <p class="h-kicker">${esc(cat.sub)} · ${arts.length} مقالات</p>
      <div class="list-card">${rows}</div>`;
  }

  function renderArticle(state) {
    const el = document.getElementById("help-article-body");
    if (!el) return;
    const id = state.helpArticle || "how-round";
    const a = D().articles[id];
    if (!a) { el.innerHTML = head("مقالة"); return; }
    const cat = catById(a.cat);
    const paras = a.body.map((p) => `<p>${esc(p)}</p>`).join("");
    let example = "";
    if (a.example) {
      const rows = a.example.rows.map(([label, amt, save]) => `<div class="h-ex-row">
        <span>${esc(label)}</span>
        <span class="h-ex-right"><span class="h-ex-amt">${esc(amt)}</span><span class="h-ex-save">${esc(save)}</span></span>
      </div>`).join("");
      example = `<div class="h-example"><div class="h-example-title">${esc(a.example.title)}</div>${rows}</div>`;
    }
    let related = "";
    if (a.related && D().articles[a.related]) {
      const rel = D().articles[a.related];
      related = `<div class="list-card h-related">${listRow({
        title: "موضوع مرتبط",
        sub: rel.title,
        last: true,
        action: `data-action="open-article" data-article="${a.related}"`,
      })}</div>`;
    }
    el.innerHTML = `${head("مقالة")}
      <div class="h-article">
        <div class="h-article-cat">${esc(cat.name)}</div>
        <h2>${esc(a.title)}</h2>
        ${paras}
        ${example}
        ${related}
      </div>`;
  }

  function renderFaq(state) {
    const el = document.getElementById("help-faq-body");
    if (!el) return;
    const q = state.helpFaqQuery || "";
    let items = D().faq;
    if (q.trim()) {
      items = items.filter((i) => i.q.includes(q.trim()) || i.a.includes(q.trim()));
    }
    const openId = state.helpFaqOpen;
    const list = items.map((item) => {
      const open = item.id === openId;
      const plus = open ? "−" : "+";
      const ans = open ? `<div class="h-faq-a">${esc(item.a)}${item.article ? `<button type="button" class="h-faq-more" data-action="open-article" data-article="${item.article}">اقرأ المقالة</button>` : ""}</div>` : "";
      return `<div class="h-faq-item${open ? " open" : ""}">
        <button type="button" class="h-faq-q" data-action="toggle-faq" data-faq="${item.id}"><span>${esc(item.q)}</span><span class="h-faq-plus">${plus}</span></button>
        ${ans}
      </div>`;
    }).join("");
    const empty = items.length ? "" : `<div class="h-empty" style="min-height:240px"><div class="h-empty-ico">${ICO.emptySearch}</div><h2>ما لقينا نتيجة</h2><p>ما في سؤال يطابق بحثك.</p></div>`;
    el.innerHTML = `${head("الأسئلة الشائعة")}
      <p class="h-kicker">15 سؤالًا مختصرًا، متوافقة مع مواصفات فكة.</p>
      <div class="search h-search">
        ${ICO.search}
        <input id="help-faq-search" type="search" placeholder="ابحث في الأسئلة الشائعة" value="${esc(q)}" autocomplete="off" />
      </div>
      ${items.length ? `<div class="h-faq">${list}</div>` : empty}`;
    const input = el.querySelector("#help-faq-search");
    if (input) {
      input.addEventListener("input", () => {
        state.helpFaqQuery = input.value;
        const pos = input.selectionStart;
        renderFaq(state);
        const again = document.getElementById("help-faq-search");
        if (again) { again.focus(); again.setSelectionRange(pos, pos); }
      });
    }
  }

  function renderContact(state) {
    const el = document.getElementById("help-contact-body");
    if (!el) return;
    const opts = D().contactCats.map((c) => `<option${c === state.contactCat ? " selected" : ""}>${esc(c)}</option>`).join("");
    const attach = state.contactShot
      ? `<button type="button" class="h-attach attached" data-action="attach-shot">${ICO.attach} لقطة شاشة (مرفقة)<span class="h-attach-x">إزالة</span></button>`
      : `<button type="button" class="h-attach" data-action="attach-shot">${ICO.attach} إرفاق صورة (اختياري)</button>`;
    el.innerHTML = `${head("تواصل معنا")}
      <p class="h-kicker">صف المشكلة باختصار، ونفتح لك طلب دعم داخل التطبيق.</p>
      <div class="h-field">
        <div class="field-label">التصنيف</div>
        <select class="h-select-native" id="help-contact-cat">${opts}</select>
      </div>
      <div class="h-field">
        <div class="field-label">وصف المشكلة</div>
        <textarea class="h-area-input" id="help-contact-desc" placeholder="اكتب التفاصيل: وش صار، ومتى، وأي عملية تتعلق بالموضوع.">${esc(state.contactDesc)}</textarea>
      </div>
      ${attach}
      <button type="button" class="btn btn-primary" style="margin-top:16px" data-action="submit-contact">إرسال الطلب</button>
      <div class="h-channels">
        <div class="h-channels-title">قنوات أخرى</div>
        <p class="h-channel-note">العناوين أدناه مواضع مؤقتة إلى أن تُعتمد قنوات الدعم الرسمية. لا يوجد رقم هاتف حاليًا.</p>
        <div class="list-card">
          <div class="h-ch-row" style="border-bottom:1px solid var(--fk-line)">
            <div class="h-ch-ico">${ICO.mail}</div>
            <div style="flex:1"><div class="h-ch-name">البريد الإلكتروني</div><div class="h-ch-val">سيُضاف العنوان لاحقًا</div></div>
            <span class="ph-tag">موضع مؤقت</span>
          </div>
          <div class="h-ch-row">
            <div class="h-ch-ico">${ICO.wa}</div>
            <div style="flex:1"><div class="h-ch-name">واتساب</div><div class="h-ch-val">سيُضاف الرقم لاحقًا</div></div>
            <span class="ph-tag">موضع مؤقت</span>
          </div>
        </div>
      </div>`;
    const sel = el.querySelector("#help-contact-cat");
    const area = el.querySelector("#help-contact-desc");
    if (sel) sel.addEventListener("change", () => { state.contactCat = sel.value; });
    if (area) area.addEventListener("input", () => { state.contactDesc = area.value; });
  }

  function txnOf(state) {
    const list = window.TXNS_HELP || [];
    return list[state.reportTxn] || list[0] || { name: "مقهى النخيل", buy: 17, save: 3, when: "اليوم · 4:12 م" };
  }

  function renderReport(state) {
    const el = document.getElementById("help-report-body");
    if (!el) return;
    const t = txnOf(state);
    const reasons = D().reportReasons.map((r) => {
      const on = r.id === state.reportReason ? " on" : "";
      return `<button type="button" class="h-reason${on}" data-action="pick-reason" data-reason="${r.id}">
        <div class="h-radio"></div>
        <div><div class="h-reason-title">${esc(r.title)}</div><div class="h-reason-desc">${esc(r.desc)}</div></div>
      </button>`;
    }).join("");
    el.innerHTML = `${head("الإبلاغ عن مشكلة")}
      <div class="h-txn-card">
        <div class="h-txn-name">${esc(t.name)}</div>
        <div class="h-txn-meta">${esc(t.when)} · مصرف الراجحي</div>
        <div class="h-txn-amt"><span>مبلغ الشراء</span><b>${Number(t.buy).toFixed(2)} ر.س</b></div>
        <div class="h-txn-amt" style="margin-top:6px;padding-top:0;border:0"><span>الفكة المدّخرة</span><b style="color:var(--fk-primary)">+${Number(t.save).toFixed(2)} ر.س</b></div>
      </div>
      <div class="field-label">نوع المشكلة</div>
      <div class="h-reasons">${reasons}</div>
      <div class="h-field">
        <div class="field-label">تفاصيل إضافية (اختياري)</div>
        <textarea class="h-area-input short" id="help-report-note" placeholder="أضف ملاحظة تساعدنا نراجع العملية.">${esc(state.reportNote)}</textarea>
      </div>
      <button type="button" class="btn btn-primary" style="margin-top:16px" data-action="submit-report">إرسال البلاغ</button>`;
    const note = el.querySelector("#help-report-note");
    if (note) note.addEventListener("input", () => { state.reportNote = note.value; });
  }

  function renderConfirm(state) {
    const el = document.getElementById("help-confirm-body");
    if (!el) return;
    const t = (state.tickets || []).find((x) => x.id === state.confirmId) || (state.tickets || [])[0];
    if (!t) { el.innerHTML = head("تم الإرسال"); return; }
    const isReport = !!t.txn;
    const title = isReport ? "استلمنا بلاغك" : "استلمنا طلبك";
    const desc = isReport
      ? "نراجع تفاصيل العملية ونحدّث حالة الطلب داخل التطبيق."
      : "نراجع طلبك ونحدّث حالته داخل التطبيق.";
    const reasonRow = t.title ? `<div class="h-confirm-row"><span>السبب</span><span>${esc(t.title)}</span></div>` : "";
    const txnRow = t.txnName ? `<div class="h-confirm-row"><span>العملية</span><span>${esc(t.txnName)}</span></div>` : "";
    el.innerHTML = `${head("تم الإرسال")}
      <div class="h-confirm">
        <div class="h-confirm-badge">${ICO.check}</div>
        <h2>${title}</h2>
        <p>${desc}</p>
        <div class="h-confirm-card">
          <div class="h-confirm-id">${esc(t.id)}</div>
          <div class="h-confirm-row"><span>الحالة</span><span class="t-pill ${t.status}">${esc(t.status_ar)}</span></div>
          ${reasonRow}${txnRow}
        </div>
        <button type="button" class="btn btn-primary" data-action="open-ticket" data-ticket="${esc(t.id)}">عرض الطلب</button>
        <button type="button" class="btn btn-secondary" style="margin-top:8px" data-nav="${isReport ? "history" : "help"}">${isReport ? "الرجوع للعمليات" : "الرجوع للمساعدة"}</button>
      </div>`;
  }

  function renderTickets(state) {
    const el = document.getElementById("help-tickets-body");
    if (!el) return;
    const tickets = state.helpEmptyTickets ? [] : (state.tickets || []);
    if (!tickets.length) {
      el.innerHTML = `${head("طلبات الدعم")}
        <div class="h-empty">
          <div class="h-empty-ico">${ICO.inbox}</div>
          <h2>ما فيه طلبات دعم بعد</h2>
          <p>إذا واجهت مشكلة في عملية أو في الحساب، أرسلها من تواصل معنا أو من تفاصيل العملية.</p>
          <button type="button" class="btn btn-primary" data-nav="help-contact">تواصل معنا</button>
        </div>`;
      return;
    }
    const rows = tickets.map((t, i) => {
      const last = i === tickets.length - 1;
      return `<button type="button" class="list-row${last ? " last" : ""}" data-action="open-ticket" data-ticket="${esc(t.id)}" style="width:100%;background:none;border:0;font:inherit;color:inherit;text-align:inherit;">
        <div>
          <div class="row-title">${esc(t.title)}</div>
          <div style="font-size:12.5px;color:var(--fk-ink-secondary);margin-top:2px">${esc(t.sub)}</div>
          <div class="h-tix-id">${esc(t.id)}</div>
        </div>
        <span class="t-pill ${t.status}">${esc(t.status_ar)}</span>
        ${CHEV}
      </button>`;
    }).join("");
    el.innerHTML = `${head("طلبات الدعم")}
      <p class="h-kicker">ثلاث حالات: مفتوح، قيد المراجعة، وتم الحل.</p>
      <div class="list-card">${rows}</div>`;
  }

  function renderTicket(state) {
    const el = document.getElementById("help-ticket-body");
    if (!el) return;
    const t = (state.tickets || []).find((x) => x.id === state.ticketId);
    if (!t) {
      el.innerHTML = `${head("تفاصيل الطلب")}<p class="h-kicker">ما لقينا هذا الطلب.</p>`;
      return;
    }
    const tl = (t.timeline || []).map(([title, time]) => `<div class="h-tl-item">
      <div class="h-tl-dot"></div>
      <div><div class="h-tl-title">${esc(title)}</div><div class="h-tl-time">${esc(time)}</div></div>
    </div>`).join("");
    const txnCard = t.txn ? `<div class="h-txn-card" style="margin-top:0">
      <div class="h-txn-name">${esc((t.txn.split(" · ")[0]) || t.txn)}</div>
      <div class="h-txn-meta">${esc((t.txn.split(" · ").slice(1).join(" · ")) || "")}</div>
    </div>` : "";
    const reply = t.reply ? `<div class="h-msg"><div class="h-msg-label">رد الدعم</div><p>${esc(t.reply)}</p></div>` : "";
    el.innerHTML = `${head("تفاصيل الطلب")}
      <div class="h-ticket-top">
        <div>
          <div class="h-ticket-id">${esc(t.id)}</div>
          <h2 class="h-ticket-title">${esc(t.title)}</h2>
        </div>
        <span class="t-pill ${t.status}">${esc(t.status_ar)}</span>
      </div>
      ${txnCard}
      <div class="h-msg"><div class="h-msg-label">رسالتك</div><p>${esc(t.body)}</p></div>
      ${reply}
      <div class="h-timeline">${tl}</div>`;
  }

  function renderLegal(state) {
    const el = document.getElementById("help-legal-body");
    if (!el) return;
    const docs = {
      terms: {
        title: "الشروط والأحكام — موضع مؤقت",
        body: "سيُضاف هنا نص الشروط والأحكام المعتمد قبل الإطلاق: استخدام الخدمة، التقريب والتحويل، وحدود المسؤولية. هذا النص ليس النسخة النظامية.",
      },
      privacy: {
        title: "سياسة الخصوصية — موضع مؤقت",
        body: "سيُضاف هنا نص سياسة الخصوصية المعتمد قبل الإطلاق: ما البيانات التي نجمعها، وكيف نستخدمها، ودور Lean في الربط للقراءة فقط، وحقوقك في الوصول والحذف. هذا النص ليس النسخة النظامية.",
      },
    };
    const doc = state.legalDoc && docs[state.legalDoc];
    const preview = doc
      ? `<div class="h-legal-body" style="margin-top:14px"><strong>${esc(doc.title)}</strong>${esc(doc.body)}</div>`
      : `<div class="h-legal-body" style="margin-top:14px"><strong>سياسة الخصوصية — موضع مؤقت</strong>سيُضاف هنا نص سياسة الخصوصية المعتمد قبل الإطلاق: ما البيانات التي نجمعها، وكيف نستخدمها، ودور Lean في الربط للقراءة فقط، وحقوقك في الوصول والحذف. هذا النص ليس النسخة النظامية.</div>`;
    el.innerHTML = `${head("الشروط والخصوصية")}
      <p class="h-legal-note">النصوص النظامية تُنشر هنا قبل الإطلاق. الصفحتان حاليًا موضع مؤقت، بلا صياغة نهائية وبلا ادعاء ترخيص.</p>
      <div class="list-card">
        <button type="button" class="list-row" data-action="open-legal-doc" data-doc="terms" style="width:100%;background:none;border:0;font:inherit;color:inherit;text-align:inherit;">
          <div><div class="row-title">الشروط والأحكام</div><div style="font-size:12.5px;color:var(--fk-ink-secondary);margin-top:2px">سيُنشر النص قبل الإطلاق</div></div>
          <span class="ph-tag">موضع مؤقت</span>${CHEV}
        </button>
        <button type="button" class="list-row last" data-action="open-legal-doc" data-doc="privacy" style="width:100%;background:none;border:0;font:inherit;color:inherit;text-align:inherit;">
          <div><div class="row-title">سياسة الخصوصية</div><div style="font-size:12.5px;color:var(--fk-ink-secondary);margin-top:2px">سيُنشر النص قبل الإطلاق</div></div>
          <span class="ph-tag">موضع مؤقت</span>${CHEV}
        </button>
      </div>
      ${preview}`;
  }

  function renderOffline() {
    const el = document.getElementById("help-offline-body");
    if (!el) return;
    el.innerHTML = `${head("مساعدة ودعم")}
      <div class="h-empty">
        <div class="h-empty-ico">${ICO.offline}</div>
        <h2>ما في اتصال</h2>
        <p>تأكد من الشبكة وحاول مرة ثانية. مقالات المساعدة المحفوظة تظهر هنا لاحقًا عند توفرها بلا اتصال.</p>
        <button type="button" class="btn btn-primary" data-nav="help">إعادة المحاولة</button>
      </div>`;
  }

  function sync(state) {
    if (!D()) return;
    const v = state.view;
    if (v === "help") renderHome(state);
    else if (v === "help-category") renderCategory(state);
    else if (v === "help-article") renderArticle(state);
    else if (v === "help-faq") renderFaq(state);
    else if (v === "help-contact") renderContact(state);
    else if (v === "help-report") renderReport(state);
    else if (v === "help-confirm") renderConfirm(state);
    else if (v === "help-tickets") renderTickets(state);
    else if (v === "help-ticket") renderTicket(state);
    else if (v === "help-legal") renderLegal(state);
    else if (v === "help-offline") renderOffline();
  }

  function defaultTickets() {
    return JSON.parse(JSON.stringify(D().tickets));
  }

  function nextTicketId(state) {
    state._ticketSeq = (state._ticketSeq || 1043) + 1;
    return "FS-" + state._ticketSeq;
  }

  window.Help = { sync, defaultTickets, nextTicketId, searchHits, catById };
})();
