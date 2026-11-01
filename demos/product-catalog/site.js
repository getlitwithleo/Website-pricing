/* Kiln & Kettle: the shop grid (search, categories, sort), product pages, and the order list.
   The products themselves live in products.js. Nothing is paid online: the order list becomes one pre-filled
   text or email to the studio. */
(function () {
  var PRODUCTS = window.PRODUCTS || [];
  var byId = {};
  PRODUCTS.forEach(function (p) { byId[p.id] = p; });
  var SWATCH = {
    "Glossy white": "#F8F6F1", "Gloss white": "#FFFFFF", "Matte white": "#F1EFEA", "White": "#FFFFFF", "All white": "#FAFAF7",
    "Speckled oat": "#E2D3BA", "Oat": "#E6D9C2", "Oat and white": "linear-gradient(90deg, #E6D9C2 50%, #FAFAF7 50%)",
    "Speckled white": "#F0ECE4", "Speckled with raw base": "linear-gradient(180deg, #F0ECE4 60%, #D9A867 60%)",
    "Charcoal": "#3A3B3D", "Butter cream": "#F1EDC8", "Sky blue": "#A9C3DD", "Mixed": "linear-gradient(90deg, #A9C3DD 50%, #3A3B3D 50%)",
    "Stone grey": "#B9BCBE", "Ink speckle": "#7B8088", "Raw clay": "#E2D2BC", "Mint": "#BFE6D8", "Natural terracotta": "#C8744A"
  };
  var KEY = "kiln-kettle-order";
  var memory = [];

  function money(n) { return "$" + n; }
  function startPrice(p) { return p.sizes ? Math.min.apply(null, p.sizes.map(function (s) { return s[1]; })) : p.price; }
  function priceHTML(p, amount) {
    if (amount == null) return (p.sizes ? "from " : "") + (p.was ? "<s>$" + p.was + "</s>" : "") + money(startPrice(p));
    return (p.was ? "<s>$" + p.was + "</s>" : "") + money(amount);
  }
  function img(name, alt, size) {
    var el = Demo.el("img");
    el.src = "../img/" + name + ".jpg";
    el.alt = alt || "";
    el.width = size || 800;
    el.height = size || 800;
    return el;
  }

  // The order list is kept in this browser, so it follows the visitor from page to page
  function load() {
    try { var saved = JSON.parse(localStorage.getItem(KEY) || "[]"); return Array.isArray(saved) ? saved.filter(function (l) { return byId[l.id]; }) : []; }
    catch (e) { return memory; }
  }
  function save(list) {
    memory = list;
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { /* private window: keep it for this page only */ }
    updateCount();
  }
  function updateCount() {
    var n = load().reduce(function (sum, l) { return sum + l.qty; }, 0);
    document.querySelectorAll("[data-bag-count]").forEach(function (el) { el.textContent = String(n); });
  }
  function linePrice(l) {
    var p = byId[l.id];
    var size = p.sizes && p.sizes.find(function (s) { return s[0] === l.size; });
    return size ? size[1] : p.price;
  }
  updateCount();

  function card(p) {
    var a = Demo.el("a", "card");
    a.href = "product.html?p=" + p.id;
    var art = Demo.el("span", "card-art");
    var image = img(p.img[0]);
    image.loading = "lazy";
    art.append(image);
    if (p.badge) art.append(Demo.el("span", "badge" + (p.badge === "sale" ? " badge--sale" : ""), p.badge === "sale" ? "Sale" : "New"));
    var info = Demo.el("span", "card-info");
    var price = Demo.el("span", "price" + (p.was ? " is-sale" : ""));
    price.innerHTML = priceHTML(p);
    info.append(Demo.el("b", null, p.name), price);
    var opts = [];
    if (p.sizes) opts.push(p.sizes.length + (p.sizeName ? " options" : " sizes"));
    opts.push(p.finishes.length > 1 ? p.finishes.length + " " + (p.finishName ? "times" : "finishes") : p.finishes[0]);
    a.append(art, info, Demo.el("small", null, opts.join(" · ")));
    return a;
  }

  // Shop page
  var grid = document.getElementById("grid");
  if (grid) {
    var CATS = ["All"].concat(PRODUCTS.map(function (p) { return p.cat; }).filter(function (c, i, a) { return a.indexOf(c) === i; }));
    var state = { cat: "All", q: "", sort: "featured" };
    var fromUrl = new URLSearchParams(location.search).get("cat");
    if (fromUrl && CATS.indexOf(fromUrl) !== -1) state.cat = fromUrl;
    var chips = document.getElementById("chips");
    CATS.forEach(function (cat) {
      var b = Demo.el("button", null, cat === "All" ? "All " + PRODUCTS.length : cat);
      b.type = "button";
      b.setAttribute("aria-pressed", String(cat === state.cat));
      b.addEventListener("click", function () {
        state.cat = cat;
        chips.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        render();
      });
      chips.append(b);
    });
    var count = document.getElementById("count");
    var render = function () {
      var q = state.q.toLowerCase();
      var list = PRODUCTS.filter(function (p) {
        return (state.cat === "All" || p.cat === state.cat) &&
          (!q || (p.name + " " + p.cat + " " + p.desc + " " + p.finishes.join(" ")).toLowerCase().indexOf(q) !== -1);
      });
      if (state.sort === "low") list.sort(function (a, b) { return startPrice(a) - startPrice(b); });
      if (state.sort === "high") list.sort(function (a, b) { return startPrice(b) - startPrice(a); });
      if (state.sort === "new") list.sort(function (a, b) { return b.added - a.added; });
      if (state.sort === "sale") list = list.filter(function (p) { return p.was; });
      count.textContent = list.length + (list.length === 1 ? " piece" : " pieces");
      if (!list.length) {
        var empty = Demo.el("div", "empty");
        empty.append(Demo.el("p", null, "No pieces match \"" + state.q + "\"" + (state.cat !== "All" ? " in " + state.cat : "") + "."));
        var clear = Demo.el("button", "btn btn--light", "Clear search");
        clear.type = "button";
        clear.addEventListener("click", function () { document.getElementById("q").value = ""; state.q = ""; render(); });
        empty.append(clear);
        grid.replaceChildren(empty);
        return;
      }
      grid.replaceChildren.apply(grid, list.map(card));
    };
    document.getElementById("q").addEventListener("input", function (e) { state.q = e.target.value.trim(); render(); });
    document.getElementById("sort").addEventListener("change", function (e) { state.sort = e.target.value; render(); });
    render();
  }

  // Product page
  var pdp = document.getElementById("pdp");
  if (pdp) {
    var p = byId[new URLSearchParams(location.search).get("p")] || PRODUCTS[0];
    document.title = p.name + " | Kiln & Kettle";
    document.getElementById("crumb-cat").textContent = p.cat;
    document.getElementById("crumb-cat").href = "index.html?cat=" + encodeURIComponent(p.cat);
    document.getElementById("crumb-name").textContent = p.name;

    var main = document.getElementById("main-img");
    var thumbs = document.getElementById("thumbs");
    main.replaceChildren(img(p.img[0], p.name));
    if (p.badge) main.append(Demo.el("span", "badge" + (p.badge === "sale" ? " badge--sale" : ""), p.badge === "sale" ? "Sale" : "New"));
    thumbs.hidden = p.img.length < 2;
    p.img.forEach(function (name, i) {
      var b = Demo.el("button");
      b.type = "button";
      b.setAttribute("aria-label", "Photo " + (i + 1) + " of " + p.img.length);
      b.setAttribute("aria-pressed", String(i === 0));
      b.append(img(name, "", 160));
      b.addEventListener("click", function () {
        main.querySelector("img").src = "../img/" + name + ".jpg";
        thumbs.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      });
      thumbs.append(b);
    });

    document.getElementById("p-cat").textContent = p.cat;
    document.getElementById("p-name").textContent = p.name;
    document.getElementById("p-desc").textContent = p.desc;
    var facts = document.getElementById("p-facts");
    p.details.forEach(function (d) { facts.append(Demo.el("li", null, d)); });

    function pills(container, name, items, swatches) {
      items.forEach(function (label, i) {
        var l = Demo.el("label");
        var input = Demo.el("input");
        input.type = "radio";
        input.name = name;
        input.value = label;
        input.checked = i === 0;
        var span = Demo.el("span");
        if (swatches && SWATCH[label]) { var dot = Demo.el("i"); dot.style.background = SWATCH[label]; span.append(dot); }
        span.append(document.createTextNode(label));
        l.append(input, span);
        container.append(l);
      });
    }
    var sizeBox = document.getElementById("p-sizes");
    if (p.sizes) {
      document.getElementById("p-size-name").textContent = p.sizeName || "Size";
      pills(sizeBox.querySelector(".pills"), "size", p.sizes.map(function (s) { return s[0] + " · $" + s[1]; }));
    } else {
      sizeBox.hidden = true;
    }
    document.getElementById("p-finish-name").textContent = p.finishName || "Finish";
    pills(document.querySelector("#p-finishes .pills"), "finish", p.finishes, true);

    var qty = 1;
    var qtyOut = document.getElementById("p-qty");
    var priceEl = document.getElementById("p-price");
    function chosen() {
      var sizeInput = document.querySelector('input[name="size"]:checked');
      var size = sizeInput ? p.sizes[Array.prototype.indexOf.call(document.querySelectorAll('input[name="size"]'), sizeInput)][0] : null;
      var finish = document.querySelector('input[name="finish"]:checked').value;
      var each = size ? p.sizes.find(function (s) { return s[0] === size; })[1] : p.price;
      return { size: size, finish: finish, each: each };
    }
    function update() {
      var c = chosen();
      priceEl.className = "price" + (p.was ? " is-sale" : "");
      priceEl.innerHTML = priceHTML(p, c.each) + (qty > 1 ? ' <small style="color:var(--muted)">× ' + qty + " = $" + c.each * qty + "</small>" : "");
      document.getElementById("p-finish-chosen").textContent = ": " + c.finish;
      qtyOut.textContent = String(qty);
    }
    pdp.addEventListener("change", update);
    document.getElementById("p-minus").addEventListener("click", function () { qty = Math.max(1, qty - 1); update(); });
    document.getElementById("p-plus").addEventListener("click", function () { qty = Math.min(12, qty + 1); update(); });
    update();

    function describe(c, n) { return n + " × " + p.name + (c.size ? ", " + c.size : "") + ", " + c.finish + " ($" + c.each * n + ")"; }
    document.getElementById("p-add").addEventListener("click", function () {
      var c = chosen();
      var list = load();
      var same = list.find(function (l) { return l.id === p.id && l.size === c.size && l.finish === c.finish; });
      if (same) same.qty += qty; else list.push({ id: p.id, size: c.size, finish: c.finish, qty: qty });
      save(list);
      var note = document.getElementById("p-added");
      note.hidden = false;
      note.querySelector("span").textContent = "Added " + describe(c, qty) + ".";
    });
    function quick(via) {
      var c = chosen();
      var body = "Hi Kiln & Kettle! I'd like to order " + describe(c, qty) + ". Can I pick it up, or how much is shipping?";
      Demo.message({ via: via, to: via === "email" ? "orders@kilnandkettle.example.com" : "(555) 014-5150", subject: "Order: " + p.name, body: body });
    }
    document.getElementById("p-text").addEventListener("click", function () { quick("text"); });
    document.getElementById("p-email").addEventListener("click", function () { quick("email"); });

    var related = document.getElementById("related-grid");
    var more = PRODUCTS.filter(function (x) { return x.cat === p.cat && x.id !== p.id; });
    if (more.length < 4) more = more.concat(PRODUCTS.filter(function (x) { return x.cat !== p.cat && x.badge === "new"; }));
    related.replaceChildren.apply(related, more.slice(0, 4).map(card));
  }

  // Order list page
  var orderEl = document.getElementById("order");
  if (orderEl) {
    var lines = document.getElementById("lines");
    var renderOrder = function () {
      var list = load();
      document.getElementById("order-empty").hidden = list.length > 0;
      document.getElementById("order-full").hidden = list.length === 0;
      lines.replaceChildren.apply(lines, list.map(function (l, i) {
        var prod = byId[l.id];
        var li = Demo.el("li", "line");
        var link = Demo.el("a", null, prod.name);
        link.href = "product.html?p=" + prod.id;
        var mid = Demo.el("div");
        mid.append(link, Demo.el("small", null, [l.size, l.finish].filter(Boolean).join(" · ")), Demo.el("small", null, money(linePrice(l)) + " each"));
        var right = Demo.el("div", "right");
        var q = Demo.el("div", "qty");
        var minus = Demo.el("button", null, "−"); minus.type = "button"; minus.setAttribute("aria-label", "One fewer " + prod.name);
        var out = Demo.el("output", null, String(l.qty));
        var plus = Demo.el("button", null, "+"); plus.type = "button"; plus.setAttribute("aria-label", "One more " + prod.name);
        minus.addEventListener("click", function () { var all = load(); all[i].qty = Math.max(1, all[i].qty - 1); save(all); renderOrder(); });
        plus.addEventListener("click", function () { var all = load(); all[i].qty = Math.min(12, all[i].qty + 1); save(all); renderOrder(); });
        q.append(minus, out, plus);
        var remove = Demo.el("button", "remove", "Remove"); remove.type = "button";
        remove.addEventListener("click", function () { var all = load(); all.splice(i, 1); save(all); renderOrder(); });
        right.append(Demo.el("b", "price", money(linePrice(l) * l.qty)), q, remove);
        li.append(img(prod.img[0], "", 176), mid, right);
        return li;
      }));
      var subtotal = list.reduce(function (s, l) { return s + linePrice(l) * l.qty; }, 0);
      var shipping = document.querySelector('input[name="delivery"]:checked').value === "ship";
      var onlyClasses = list.every(function (l) { return byId[l.id].cat === "Classes"; });
      var ship = !shipping || onlyClasses ? 0 : subtotal >= 75 ? 0 : 8;
      document.getElementById("sum-sub").textContent = money(subtotal);
      document.getElementById("sum-ship").textContent = !shipping ? "Free pickup" : ship ? money(ship) : "Free";
      document.getElementById("sum-total").textContent = money(subtotal + ship);
      return { list: list, subtotal: subtotal, ship: ship, shipping: shipping };
    };
    document.querySelectorAll('input[name="delivery"]').forEach(function (r) { r.addEventListener("change", renderOrder); });
    function send(via) {
      var o = renderOrder();
      var name = document.getElementById("o-name").value.trim();
      if (!name) { document.getElementById("o-name").focus(); document.getElementById("o-status").textContent = "Add your name so the studio knows who the order is from."; return; }
      document.getElementById("o-status").textContent = "";
      var body = "Hi Kiln & Kettle! I'd like to order:\n" + o.list.map(function (l) {
        var prod = byId[l.id];
        return "• " + l.qty + " × " + prod.name + (l.size ? ", " + l.size : "") + ", " + l.finish + " ($" + linePrice(l) * l.qty + ")";
      }).join("\n") + "\n\nTotal: $" + (o.subtotal + o.ship) + (o.shipping ? " including shipping" : "") + "\n" + (o.shipping ? "Please ship it to me." : "I'll pick it up on Saturday.") + "\n\nThanks, " + name;
      Demo.message({ via: via, to: via === "email" ? "orders@kilnandkettle.example.com" : "(555) 014-5150", subject: "Order from " + name, body: body });
    }
    document.getElementById("o-text").addEventListener("click", function () { send("text"); });
    document.getElementById("o-email").addEventListener("click", function () { send("email"); });
    document.getElementById("o-clear").addEventListener("click", function () { save([]); renderOrder(); });
    renderOrder();
  }

  // New pieces strip (studio page)
  var newest = document.getElementById("newest");
  if (newest) newest.replaceChildren.apply(newest, PRODUCTS.slice().sort(function (a, b) { return b.added - a.added; }).slice(0, 4).map(card));
})();
