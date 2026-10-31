/* Shared by every demo site. Nothing on a demo is really sent, so message buttons, forms and outside links
   show a preview of what would happen on a real site instead.

   In the page:
   - <button data-msg="text" data-to="(555) 014-2290" data-body="Hi! ...">  shows the text message a customer would send
     (data-msg="email" adds data-subject)
   - <a href="#" data-demo="your DoorDash page">                            shows a short note instead of leaving the page
   - Demo.form(formElement, { title, note })                                shows what a form would send */
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
