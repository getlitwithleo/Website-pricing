/* Halcyon Tea House: the design concept switch (remembered from page to page), scroll reveal,
   the tea collection, ordering on the tea pages, tasting bookings, today's hours and the forms. */
(function () {
  var root = document.documentElement;
  var KEY = "halcyon-concept";

  // Concept switch: same content, two finished designs. The choice follows the visitor to every page.
  var switcher = document.querySelectorAll(".concepts button");
  function setConcept(c, announce) {
    root.setAttribute("data-concept", c);
    switcher.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.concept === c)); });
    try { localStorage.setItem(KEY, c); } catch (e) { /* private window */ }
    if (announce) Demo.toast(c === "a" ? "Concept A: Night. Dark, moody and gold." : "Concept B: Day. Light, airy and calm.");
  }
  setConcept(root.getAttribute("data-concept") || "a", false);
  switcher.forEach(function (btn) { btn.addEventListener("click", function () { setConcept(btn.dataset.concept, true); }); });

  var TEAS = [
    { id: "matcha", name: "Ceremonial Matcha", type: "Green", notes: "Grassy · sweet · creamy", price: 28, img: "mp-matcha", page: "tea-matcha.html", alt: "Matcha powder, a bowl of whisked matcha and a bamboo whisk" },
    { id: "silver-needle", name: "Jasmine Silver Needle", type: "White", notes: "Floral · honeyed · light", price: 26, img: "mp-jars", page: "tea-silver-needle.html", alt: "Glass jars of loose-leaf tea" },
    { id: "oolong", name: "Phoenix Oolong", type: "Oolong", notes: "Orchid · stone fruit · toasty", price: 24, img: "mp-candle", page: "tea-oolong.html", alt: "A glass mug of amber oolong by candlelight" },
    { id: "darjeeling", name: "First-flush Darjeeling", type: "Black", notes: "Muscat · bright · brisk", price: 19, img: "mp-glass", page: "tea-darjeeling.html", alt: "A glass cup of amber tea" },
    { id: "hojicha", name: "Roasted Hojicha", type: "Green", notes: "Toasty · nutty · low caffeine", price: 16, img: "mp-cup", alt: "A white cup of roasted tea on a wooden coaster" },
    { id: "latte-blend", name: "Matcha Latte Blend", type: "Green", notes: "Smooth · mellow · made for milk", price: 22, img: "mp-matcha-latte", alt: "A matcha latte with leaf art beside a laptop" },
    { id: "cold-brew", name: "Cold-brew Oolong Pouches", type: "Oolong", notes: "Crisp · peachy · overnight", price: 18, img: "mp-iced", alt: "A glass of iced tea with lime" },
    { id: "flight", name: "Seasonal Tasting Flight", type: "Gifts", notes: "Four teas from this harvest", price: 34, img: "mp-spoons", alt: "Spoons of different loose-leaf teas" }
  ];

  function order(name, detail) {
    Demo.message({ via: "email", to: "hello@halcyon.example.com", subject: "Order: " + name,
      body: "Hello Halcyon, I'd like to order " + detail + ". I'd like to pick it up at the tea house." });
  }

  // Tea cards (collection page and home)
  document.querySelectorAll("[data-teas]").forEach(function (box) {
    var limit = Number(box.dataset.teas) || TEAS.length;
    var list = TEAS.filter(function (t) { return t.id !== box.dataset.exclude; });
    box.replaceChildren.apply(box, list.slice(0, limit).map(function (t) {
      var card = Demo.el("article", "tea");
      card.dataset.type = t.type;
      card.setAttribute("data-reveal", "");
      var img = Demo.el("img");
      img.src = "../img/" + t.img + ".jpg";
      img.alt = t.alt;
      img.width = 700;
      img.height = 875;
      img.loading = "lazy";
      var h = Demo.el("h3");
      if (t.page) { var a = Demo.el("a", null, t.name); a.href = t.page; h.append(a); } else { h.textContent = t.name; }
      var foot = Demo.el("div", "tea-foot");
      var btn = Demo.el("button", null, "Order");
      btn.type = "button";
      btn.setAttribute("aria-label", "Order " + t.name);
      btn.addEventListener("click", function () { order(t.name, t.name + " ($" + t.price + ", 50 g tin)"); });
      foot.append(Demo.el("b", null, "$" + t.price), btn);
      card.append(img, Demo.el("p", "type", t.type), h, Demo.el("p", "notes", t.notes), foot);
      return card;
    }));
  });
  var filters = document.querySelectorAll("[data-type]");
  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filters.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      document.querySelectorAll(".tea[data-type]").forEach(function (card) {
        card.hidden = btn.dataset.type !== "all" && card.dataset.type !== btn.dataset.type;
        card.classList.add("is-in");
      });
    });
  });

  // Tea page: size and quantity
  var buy = document.getElementById("buy");
  if (buy) {
    var size = document.getElementById("b-size");
    var qty = document.getElementById("b-qty");
    var total = document.getElementById("b-total");
    var update = function () { total.textContent = "$" + Number(size.value) * Number(qty.value); };
    size.addEventListener("change", update);
    qty.addEventListener("change", update);
    update();
    var detail = function () { return qty.value + " × " + buy.dataset.tea + ", " + size.options[size.selectedIndex].dataset.label + " ($" + Number(size.value) * Number(qty.value) + ")"; };
    document.getElementById("b-pickup").addEventListener("click", function () { order(buy.dataset.tea, detail()); });
    document.getElementById("b-ship").addEventListener("click", function () {
      Demo.message({ via: "email", to: "hello@halcyon.example.com", subject: "Order: " + buy.dataset.tea,
        body: "Hello Halcyon, I'd like to order " + detail() + ", shipped to me. My address is: " });
    });
  }

  // Tasting booking: upcoming dates for the chosen format
  var tasting = document.getElementById("tasting-card");
  if (tasting) {
    var FORMATS = {
      saturday: { name: "Saturday tasting", day: 6, times: ["9:30 am", "11:00 am", "12:30 pm"], each: 38, max: 6 },
      ceremony: { name: "Matcha ceremony", day: 0, times: ["10:00 am", "2:00 pm"], each: 45, max: 4 },
      private: { name: "Private tasting", day: 5, times: ["6:00 pm", "7:30 pm"], flat: 280, max: 8 }
    };
    var fmt = document.getElementById("t-format");
    var dateSel = document.getElementById("t-date");
    var timeSel = document.getElementById("t-time");
    var guests = document.getElementById("t-guests");
    var params = new URLSearchParams(location.search).get("format");
    if (params && FORMATS[params]) fmt.value = params;
    var fill = function () {
      var f = FORMATS[fmt.value];
      var d = new Date();
      d.setDate(d.getDate() + ((f.day - d.getDay() + 7) % 7 || 7));
      dateSel.replaceChildren();
      for (var i = 0; i < 6; i++) {
        dateSel.append(Demo.el("option", null, d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })));
        d.setDate(d.getDate() + 7);
      }
      timeSel.replaceChildren.apply(timeSel, f.times.map(function (t) { return Demo.el("option", null, t); }));
      var keep = Math.min(Number(guests.value) || 2, f.max);
      guests.replaceChildren();
      for (var g = 1; g <= f.max; g++) { var o = Demo.el("option", null, g + (g === 1 ? " guest" : " guests")); o.value = String(g); guests.append(o); }
      guests.value = String(keep);
      price();
    };
    var price = function () {
      var f = FORMATS[fmt.value];
      var n = Number(guests.value);
      document.getElementById("t-total").textContent = "$" + (f.flat || f.each * n);
      document.getElementById("t-each").textContent = f.flat ? "Flat price, up to " + f.max + " guests" : "$" + f.each + " per guest";
    };
    fmt.addEventListener("change", fill);
    guests.addEventListener("change", price);
    fill();
    document.getElementById("t-book").addEventListener("click", function () {
      var name = document.getElementById("t-name");
      if (!name.checkValidity()) { name.reportValidity(); return; }
      var ul = Demo.el("ul", "dd-list");
      [["Tasting", FORMATS[fmt.value].name], ["Date", dateSel.value], ["Time", timeSel.value], ["Guests", guests.options[guests.selectedIndex].text], ["Total", document.getElementById("t-total").textContent], ["Name", name.value.trim()]].forEach(function (pair) {
        var li = Demo.el("li");
        li.append(Demo.el("b", null, pair[0] + ": "), document.createTextNode(pair[1]));
        ul.append(li);
      });
      Demo.open({ title: "Tasting requested", content: [ul], note: "On a real site, this is a free booking tool built into the page. It holds the seats, emails a confirmation and sends a reminder the day before." });
    });
  }

  // Scroll reveal
  if ("IntersectionObserver" in window) {
    root.classList.add("js-reveal");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll("[data-reveal]").forEach(function (el) { io.observe(el); });
  }

  // Today's hours
  document.querySelectorAll('.panel tr[data-day="' + new Date().getDay() + '"]').forEach(function (row) { row.classList.add("today"); });

  document.querySelectorAll("[data-letter]").forEach(function (form) {
    Demo.form(form, { title: "Welcome to the letter", note: "On a real site, this adds the email to a free newsletter tool and sends a welcome letter." });
  });
  var contact = document.getElementById("contact-form");
  if (contact) Demo.form(contact, { title: "Message sent", note: "On a real site, this goes straight to the tea house inbox." });
})();
