/* Theo Marsh: the painting list, the gallery wall with series filters, the full-screen viewer
   (used on every page), and the inquiry form. */
(function () {
  var WORKS = [
    { id: "slack-water", title: "Slack Water", series: "Tidewater", year: 2025, size: "36 × 36 in", img: "pf-slack-water", w: 900, h: 900, sold: false,
      story: "Painted from a sketch made at 7:42 pm, the minute the tide stopped going out. The white lines are the last waves before the water goes still." },
    { id: "the-turn", title: "The Turn", series: "Tidewater", year: 2025, size: "30 × 30 in", img: "pf-the-turn", w: 900, h: 902, sold: true,
      story: "Red ink dropped into wet teal, the way river water clouds the sea when the tide comes back in. This one sold on the first night of the show." },
    { id: "heron", title: "Heron, Leaving", series: "Tidewater", year: 2025, size: "36 × 24 in", img: "pf-heron", w: 900, h: 603, sold: false,
      story: "The only painting in the series with a living thing in it. The orange marks are where the heron stood before it flew." },
    { id: "brackish", title: "Brackish", series: "Tidewater", year: 2025, size: "24 × 36 in", img: "pf-brackish", w: 900, h: 1350, sold: false,
      story: "Where fresh water meets salt. Two pours of paint, left to run into each other without mixing." },
    { id: "night-bus", title: "Night Bus", series: "Small Hours", year: 2026, size: "24 × 36 in", img: "pf-night-bus", w: 900, h: 1350, sold: false,
      story: "The lit windows of the last bus home, blurred into one long band of color as it pulls away." },
    { id: "four-twelve", title: "4:12 am", series: "Small Hours", year: 2026, size: "36 × 24 in", img: "pf-four-twelve", w: 900, h: 600, sold: true,
      story: "The color of the sky through a bedroom window, a few minutes before it starts to get light." },
    { id: "streetlight", title: "Streetlight in Rain", series: "Small Hours", year: 2026, size: "28 × 40 in", img: "pf-streetlight", w: 900, h: 1276, sold: false,
      story: "A single sodium streetlight reflected in a puddle. Painted fast, in one session, and never touched again." },
    { id: "corner-shop", title: "Corner Shop, Closed", series: "Small Hours", year: 2026, size: "30 × 38 in", img: "pf-corner-shop", w: 900, h: 1140, sold: false,
      story: "Every color of the shop window display, seen through a rolled-down shutter after closing time." },
    { id: "before-birds", title: "Before the Birds", series: "Small Hours", year: 2026, size: "38 × 30 in", img: "pf-before-birds", w: 900, h: 711, sold: false,
      story: "The last painting in the series. Hard edges for the rooftops, and the first warm light coming up behind them." }
  ];
  var byId = {};
  WORKS.forEach(function (w) { byId[w.id] = w; });

  var current = WORKS.slice();

  // Gallery wall on the work page
  var wall = document.getElementById("wall");
  var filter = "all";
  function render() {
    current = WORKS.filter(function (w) { return filter === "all" || w.series === filter; });
    wall.replaceChildren.apply(wall, current.map(function (work, i) {
      var btn = Demo.el("button", "piece");
      btn.type = "button";
      btn.setAttribute("aria-label", work.title + ", " + work.year + ". View larger");
      var img = Demo.el("img");
      img.src = "../img/" + work.img + ".jpg";
      img.alt = "";
      img.width = work.w;
      img.height = work.h;
      img.loading = "lazy";
      var cap = Demo.el("span", "piece-cap");
      cap.append(Demo.el("b", null, work.title), Demo.el("span", null, work.sold ? "Sold" : String(work.year)));
      btn.append(img, cap);
      btn.addEventListener("click", function () { openViewer(i); });
      return btn;
    }));
  }
  if (wall) {
    var start = new URLSearchParams(location.search).get("series");
    document.querySelectorAll("[data-series]").forEach(function (btn) {
      if (start && btn.dataset.series === start) filter = start;
      btn.addEventListener("click", function () {
        filter = btn.dataset.series;
        document.querySelectorAll("[data-series]").forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
        render();
      });
    });
    document.querySelectorAll("[data-series]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.series === filter)); });
    render();
  }

  // Paintings on the series pages open in the same viewer, in page order
  var pagePieces = document.querySelectorAll("[data-work]");
  if (pagePieces.length) {
    current = Array.prototype.map.call(pagePieces, function (btn) { return byId[btn.dataset.work]; });
    pagePieces.forEach(function (btn, i) { btn.addEventListener("click", function () { openViewer(i); }); });
  }

  // Full-screen viewer
  var viewer = document.getElementById("viewer");
  var vIndex = 0;
  function show(i) {
    vIndex = (i + current.length) % current.length;
    var work = current[vIndex];
    var img = document.getElementById("viewer-img");
    img.src = "../img/" + work.img + ".jpg";
    img.alt = work.title;
    document.getElementById("viewer-title").textContent = work.title;
    document.getElementById("viewer-meta").textContent = work.series + " · " + work.year + " · Acrylic and ink on canvas · " + work.size;
    document.getElementById("viewer-story").textContent = work.story;
    document.getElementById("viewer-status").textContent = work.sold ? "Sold. Prints and commissions available." : "Available. Ask for the price.";
    document.getElementById("viewer-ask").href = "about.html?piece=" + work.id + "#inquire";
  }
  function openViewer(i) {
    show(i);
    if (typeof viewer.showModal === "function") viewer.showModal(); else viewer.setAttribute("open", "");
  }
  function closeViewer() { if (typeof viewer.close === "function") viewer.close(); else viewer.removeAttribute("open"); }
  if (viewer) {
    document.getElementById("viewer-prev").addEventListener("click", function () { show(vIndex - 1); });
    document.getElementById("viewer-next").addEventListener("click", function () { show(vIndex + 1); });
    document.getElementById("viewer-close").addEventListener("click", closeViewer);
    viewer.addEventListener("click", function (e) { if (e.target === viewer) closeViewer(); });
    viewer.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") show(vIndex - 1);
      if (e.key === "ArrowRight") show(vIndex + 1);
    });
  }

  // Inquiry form, with the painting filled in when someone arrives from "Ask about this piece"
  var form = document.getElementById("inquiry");
  if (form) {
    var piece = byId[new URLSearchParams(location.search).get("piece")];
    if (piece) {
      document.getElementById("q-about").value = piece.sold ? "A print of a sold painting" : "Buying a painting";
      document.getElementById("q-msg").value = "Hi Theo, I'm interested in \"" + piece.title + "\" (" + piece.series + ", " + piece.size + "). " + (piece.sold ? "Are prints available?" : "Could you send me the price?");
    }
    Demo.form(form, { title: "Inquiry sent!", note: "On a real site, this goes straight to the studio inbox. Theo replies within two working days." });
  }
})();
