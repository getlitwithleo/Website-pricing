/* Clearpath Bookkeeping: blog filters and search, the newsletter, checklist and quote forms,
   and the plan picked on the services page carried into the quote form. */
(function () {
  // Blog: category buttons and search
  var cats = document.querySelectorAll("[data-cat]");
  var search = document.getElementById("blog-q");
  function filterPosts() {
    var active = document.querySelector('[data-cat][aria-pressed="true"]');
    var cat = active ? active.dataset.cat : "all";
    var q = search ? search.value.trim().toLowerCase() : "";
    var shown = 0;
    document.querySelectorAll("[data-post-cat]").forEach(function (post) {
      var ok = (cat === "all" || post.dataset.postCat === cat) && (!q || post.textContent.toLowerCase().indexOf(q) !== -1);
      post.hidden = !ok;
      if (ok) shown++;
    });
    var empty = document.getElementById("blog-empty");
    if (empty) empty.hidden = shown > 0;
  }
  cats.forEach(function (btn) {
    btn.addEventListener("click", function () {
      cats.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      filterPosts();
    });
  });
  if (search) search.addEventListener("input", filterPosts);

  document.querySelectorAll("[data-newsletter]").forEach(function (form) {
    Demo.form(form, { title: "You're subscribed!", note: "On a real site, this adds the email to the firm's list in a free newsletter tool like Mailchimp or Kit, and sends a welcome email." });
  });
  var checklist = document.getElementById("checklist-form");
  if (checklist) Demo.form(checklist, { title: "Checklist on its way!", note: "On a real site, this emails the PDF checklist straight away and adds the contact to the firm's lead list, so Clearpath can follow up." });

  var quote = document.getElementById("quote-form");
  if (quote) {
    var plan = new URLSearchParams(location.search).get("plan");
    if (plan) {
      var box = quote.querySelector('input[value="' + plan + '"]');
      if (box) box.checked = true;
    }
    Demo.form(quote, { title: "Quote request sent!", note: "On a real site, this request lands in the firm's inbox right away through a free form service, and the visitor gets an automatic reply." });
  }
})();
