/* Shared by every demo site. Nothing on a demo is really sent, so message buttons, forms and outside links
   show a preview of what would happen on a real site instead.

   Load it right after <div class="demo-bar" data-package="small-business"></div> at the top of <body>: it fills in
   that bar from the PACKAGES list below, so a price change here updates every demo page.

   In the page:
   - <button data-msg="text" data-to="(555) 014-2290" data-body="Hi! ...">  shows the text message a customer would send
     (data-msg="email" adds data-subject)
   - <a href="#" data-demo="your DoorDash page">                            shows a short note instead of leaving the page
   - <button class="menu-btn" data-menu aria-controls="site-nav">           opens and closes the menu on phones
   - Demo.form(formElement, { title, note })                                shows what a form would send */
(function () {
  // Package name, price, its card on the home page, its number in the quote builder, and what the demo shows
  var PACKAGES = {
    "tune-up":         { name: "Tune-Up",           price: 60,  card: "pkg-tune-up",        pick: 1,  scope: "fixes to an existing site" },
    "landing-page":    { name: "Landing Page",      price: 120, card: "pkg-landing-page",   pick: 3,  scope: "1 page, all 6 sections" },
    "portfolio":       { name: "Portfolio",         price: 190, card: "pkg-portfolio",      pick: 4,  scope: "full 4-page site" },
    "small-business":  { name: "Small Business",    price: 240, card: "pkg-small-business", pick: 5,  scope: "full 5-page site" },
    "restaurant":      { name: "Restaurant & Café", price: 270, card: "pkg-restaurant",     pick: 6,  scope: "full 5-page site" },
    "booking":         { name: "Booking Site",      price: 300, card: "pkg-booking",        pick: 7,  scope: "full 6-page site" },
    "growth":          { name: "Growth",            price: 360, card: "pkg-growth",         pick: 8,  scope: "full 8-page site" },
    "product-catalog": { name: "Product Catalog",   price: 480, card: "pkg-store",          pick: 9,  scope: "full 25-product shop" },
    "masterpiece":     { name: "Masterpiece",       price: 600, card: "pkg-masterpiece",    pick: 10, scope: "full 12-page site" }
  };
  var bar = document.querySelector(".demo-bar[data-package]");
  var pkg = bar && PACKAGES[bar.dataset.package];
  if (!pkg) return;
  var script = document.currentScript;
  var home = script && script.src ? new URL("../index.html", script.src).href : "../../index.html";
  bar.innerHTML =
    '<div class="wrap">' +
      '<span class="demo-bar-info"><span class="demo-tag">Demo</span><span>' + pkg.name.replace("&", "&amp;") + ' package · $' + pkg.price +
      '<span class="demo-bar-scope"> · ' + pkg.scope + '</span></span></span>' +
      '<span class="demo-bar-links"><a href="' + home + '#' + pkg.card + '">← All packages</a>' +
      '<a class="demo-cta" href="' + home + '#pick-' + pkg.pick + '">Choose this package</a></span>' +
    '</div>';
})();

(function () {
  var dialog = document.createElement("dialog");
  dialog.className = "demo-dialog";
  dialog.setAttribute("aria-labelledby", "dd-title");
  dialog.innerHTML =
    '<div class="dd-inner">' +
      '<p class="dd-kicker"></p>' +
      '<h2 class="dd-title" id="dd-title"></h2>' +
      '<div class="dd-content"></div>' +
      '<p class="dd-note"></p>' +
      '<div class="dd-actions"><button type="button" class="dd-copy">Copy message</button><button type="button" class="dd-close dd-primary">Close</button></div>' +
      '<p class="dd-status" role="status"></p>' +
    '</div>';
  document.body.appendChild(dialog);

  var kicker = dialog.querySelector(".dd-kicker");
  var title = dialog.querySelector(".dd-title");
  var content = dialog.querySelector(".dd-content");
  var note = dialog.querySelector(".dd-note");
  var copyBtn = dialog.querySelector(".dd-copy");
  var status = dialog.querySelector(".dd-status");
  var copyText = "";

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function open(opts) {
    dialog.classList.toggle("is-wide", !!opts.wide);
    kicker.textContent = opts.kicker || "Demo preview";
    title.textContent = opts.title;
    content.replaceChildren.apply(content, opts.content || []);
    note.textContent = opts.note || "";
    copyText = opts.copy || "";
    copyBtn.hidden = !copyText;
    status.textContent = "";
    if (typeof dialog.showModal === "function") {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
    dialog.querySelector(".dd-close").focus();
  }

  function close() {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  dialog.querySelector(".dd-close").addEventListener("click", close);
  dialog.addEventListener("click", function (e) { if (e.target === dialog) close(); });

  copyBtn.addEventListener("click", function () {
    var fallback = function () {
      var range = document.createRange();
      range.selectNodeContents(content);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      status.textContent = "Selected. Press Ctrl+C or Cmd+C to copy.";
    };
    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) { fallback(); return; }
      navigator.clipboard.writeText(copyText).then(function () { status.textContent = "Copied"; }, fallback);
    } catch (err) {
      fallback();
    }
  });

  var toastEl = null;
  var toastTimer = 0;
  function toast(text) {
    if (!toastEl) {
      toastEl = el("div", "demo-toast");
      toastEl.setAttribute("role", "status");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = text;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, 3200);
  }

  function message(o) {
    var isEmail = o.via === "email";
    var parts = [el("p", "dd-meta", (isEmail ? "To: " : "To: ") + o.to + (isEmail && o.subject ? "  ·  Subject: " + o.subject : ""))];
    parts.push(el("div", "dd-bubble" + (isEmail ? " is-email" : ""), o.body));
    open({
      kicker: "Demo preview",
      title: isEmail ? "The email your customer sends" : "The text your customer sends",
      content: parts,
      note: isEmail
        ? "On a real site, this button opens the customer's email app with this message already written. They just press send."
        : "On a real site, this button opens the customer's texting app with this message already written. They just press send.",
      copy: o.body
    });
  }

  function form(formEl, o) {
    formEl.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!formEl.checkValidity()) { formEl.reportValidity(); return; }
      var list = el("ul", "dd-list");
      Array.prototype.forEach.call(formEl.elements, function (field) {
        if (!field.name || field.type === "submit" || field.type === "button") return;
        if ((field.type === "checkbox" || field.type === "radio") && !field.checked) return;
        var value = field.type === "checkbox" ? "Yes" : field.value.trim();
        if (!value) return;
        var labelText = field.dataset.label || field.name;
        var li = el("li");
        li.append(el("b", null, labelText + ": "), document.createTextNode(value));
        list.appendChild(li);
      });
      open({
        kicker: "Demo preview",
        title: o.title || "Sent!",
        content: list.childElementCount ? [el("p", "dd-meta", "Here's what would arrive in the owner's inbox:"), list] : [],
        note: o.note || "On a real site, this form sends straight to the owner's inbox through a free form service."
      });
      formEl.reset();
      if (o.after) o.after();
    });
  }

  document.addEventListener("click", function (e) {
    var menuBtn = e.target.closest("[data-menu]");
    if (menuBtn) {
      var menu = document.getElementById(menuBtn.getAttribute("aria-controls"));
      var isOpen = menuBtn.getAttribute("aria-expanded") !== "true";
      menuBtn.setAttribute("aria-expanded", String(isOpen));
      if (menu) menu.classList.toggle("is-open", isOpen);
      return;
    }
    var msg = e.target.closest("[data-msg]");
    if (msg) {
      e.preventDefault();
      message({ via: msg.dataset.msg, to: msg.dataset.to, subject: msg.dataset.subject, body: msg.dataset.body });
      return;
    }
    var link = e.target.closest("[data-demo]");
    if (link) {
      e.preventDefault();
      toast("Demo link. On a real site, this opens " + link.dataset.demo + ".");
    }
  });

  window.Demo = { open: open, message: message, form: form, toast: toast, el: el };
})();
