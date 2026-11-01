/* Little Fig: daily specials, today's hours, menu tabs and dietary filters, the photo gallery,
   the reservation and catering forms, and upcoming event dates. */
(function () {
  var NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  // One special for each day of the week, Sunday first
  var SPECIALS = [
    "Sunday roast sandwich with gravy to dip, $15",
    "Fig and honey scones, warm from the oven, $4.50",
    "Two-for-one lattes before 9 am",
    "Shakshuka with grilled bread, $13",
    "Tomato soup and grilled cheese combo, $14",
    "Live music brunch from 10 to noon",
    "Lemon ricotta pancakes, weekends only, $13"
  ];
  // Opening hours as [open, close] in 24-hour time, Sunday first
  var HOURS = [[8, 14], [7, 15], [7, 15], [7, 15], [7, 15], [7, 16], [8, 16]];
  var now = new Date();
  var day = now.getDay();

  function label(h) { return (h % 12 || 12) + (h < 12 ? " am" : " pm"); }

  var specialDay = document.getElementById("special-day");
  if (specialDay) {
    specialDay.textContent = NAMES[day] + "'s special:";
    document.getElementById("special-text").textContent = SPECIALS[day];
  }

  var week = document.getElementById("week");
  if (week) {
    for (var i = 1; i <= 7; i++) {
      var d = i % 7;
      var li = document.createElement("li");
      if (d === day) li.className = "is-today";
      li.append(Demo.el("b", null, NAMES[d]), Demo.el("span", null, SPECIALS[d]));
      week.appendChild(li);
    }
  }

  document.querySelectorAll('.hours tr[data-day="' + day + '"]').forEach(function (row) { row.classList.add("is-today"); });
  document.querySelectorAll("[data-today]").forEach(function (node) {
    node.textContent = "Open today " + label(HOURS[day][0]) + " – " + label(HOURS[day][1]);
  });
  var status = document.getElementById("status");
  if (status) {
    var hour = now.getHours() + now.getMinutes() / 60;
    var open = hour >= HOURS[day][0] && hour < HOURS[day][1];
    status.classList.toggle("is-closed", !open);
    status.querySelector("span").textContent = open
      ? "Open now · until " + label(HOURS[day][1])
      : "Closed now · opens " + (hour < HOURS[day][0] ? "today" : "tomorrow") + " at " + label(HOURS[hour < HOURS[day][0] ? day : (day + 1) % 7][0]);
  }

  // Menu tabs
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  function select(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { select(tab); });
    tab.addEventListener("keydown", function (e) {
      var next = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : null;
      if (next === null) return;
      var t = tabs[(next + tabs.length) % tabs.length];
      select(t);
      t.focus();
    });
  });
  if (tabs.length && location.hash) {
    var fromHash = document.getElementById("tab-" + location.hash.slice(1));
    if (fromHash) select(fromHash);
  }

  // Dietary filters: show only dishes with every ticked tag
  var diet = document.querySelectorAll("[data-diet]");
  function filter() {
    var want = Array.prototype.filter.call(diet, function (box) { return box.checked; }).map(function (box) { return box.value; });
    document.querySelectorAll('[role="tabpanel"]').forEach(function (panel) {
      var shown = 0;
      panel.querySelectorAll(".item").forEach(function (item) {
        var tags = (item.dataset.tags || "").split(" ");
        var ok = want.every(function (t) { return tags.indexOf(t) !== -1 || (t === "v" && tags.indexOf("vg") !== -1); });
        item.classList.toggle("is-filtered", !ok);
        if (ok) shown++;
      });
      var empty = panel.querySelector(".menu-empty");
      if (empty) empty.hidden = shown > 0;
    });
  }
  diet.forEach(function (box) { box.addEventListener("change", filter); });

  // Gallery with a full-size view
  var gallery = document.querySelectorAll(".gallery button");
  if (gallery.length) {
    var box = document.getElementById("lightbox");
    var img = box.querySelector("img");
    var cap = box.querySelector("p");
    var current = 0;
    function show(i) {
      current = (i + gallery.length) % gallery.length;
      var source = gallery[current].querySelector("img");
      img.src = source.src;
      img.alt = source.alt;
      cap.textContent = gallery[current].dataset.caption;
    }
    gallery.forEach(function (btn, i) {
      btn.addEventListener("click", function () { show(i); box.showModal(); });
    });
    box.querySelector("[data-prev]").addEventListener("click", function () { show(current - 1); });
    box.querySelector("[data-next]").addEventListener("click", function () { show(current + 1); });
    box.querySelector("[data-close]").addEventListener("click", function () { box.close(); });
    box.addEventListener("click", function (e) { if (e.target === box) box.close(); });
    box.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") show(current + 1);
      if (e.key === "ArrowLeft") show(current - 1);
    });
  }

  // Reservation form: no past dates, and some times already booked
  var reserve = document.getElementById("reserve-form");
  if (reserve) {
    var date = document.getElementById("r-date");
    var iso = function (d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
    date.min = iso(now);
    var later = new Date(now); later.setDate(later.getDate() + 60);
    date.max = iso(later);
    var tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate() + 1);
    date.value = iso(tomorrow);
    function slots() {
      var picked = new Date(date.value + "T12:00");
      var d = isNaN(picked) ? day : picked.getDay();
      var seed = picked.getDate() || 1;
      reserve.querySelectorAll('input[name="time"]').forEach(function (r, i) {
        var h = parseFloat(r.dataset.h);
        var closed = h < HOURS[d][0] || h > HOURS[d][1] - 1;
        var taken = (seed * 7 + i * 3) % 5 === 0;
        r.disabled = closed || taken;
        if (r.disabled && r.checked) r.checked = false;
      });
    }
    date.addEventListener("change", slots);
    slots();
    Demo.form(reserve, {
      title: "Table request sent!",
      note: "On a real site, this request goes to the café's inbox or booking tool, and the guest gets a confirmation text.",
      after: function () { date.value = iso(tomorrow); slots(); }
    });
  }
  var catering = document.getElementById("catering-form");
  if (catering) Demo.form(catering, { title: "Catering request sent!", note: "On a real site, this goes straight to the events inbox. Little Fig replies with a quote within a day." });

  // Upcoming events: the next dates for each repeating event
  var list = document.getElementById("upcoming");
  if (list) {
    var nextOn = function (weekday, from) { var d = new Date(from); d.setDate(d.getDate() + ((weekday - d.getDay() + 7) % 7 || 7)); return d; };
    var firstOf = function (weekday, monthOffset) {
      var d = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
      while (d.getDay() !== weekday) d.setDate(d.getDate() + 1);
      return d;
    };
    var supper = firstOf(4, 0) > now ? firstOf(4, 0) : firstOf(4, 1);
    var events = [
      { d: nextOn(5, now), title: "Live music brunch", text: "Acoustic sets from 10 to noon, with the full brunch menu. No cover.", btn: "Reserve a table", href: "order.html#reserve" },
      { d: nextOn(6, now), title: "Kids' scone class", text: "Ages 6 to 11 bake and decorate their own scones. 9 to 10 am, $18 per child.", msg: "Hi Little Fig! I'd like to sign up for the kids' scone class. Child's name and age: ___" },
      { d: supper, title: "Fig & Friends supper club", text: "Our monthly after-hours dinner: four courses at one long table, 7 pm, $55.", msg: "Hi Little Fig! I'd like ___ seats at the next Fig & Friends supper club." },
      { d: nextOn(5, nextOn(5, now)), title: "Live music brunch", text: "Acoustic sets from 10 to noon, with the full brunch menu. No cover.", btn: "Reserve a table", href: "order.html#reserve" }
    ];
    events.sort(function (a, b) { return a.d - b.d; });
    events.forEach(function (ev) {
      var li = document.createElement("li");
      var date = Demo.el("div", "date");
      date.append(Demo.el("small", null, MONTHS[ev.d.getMonth()]), Demo.el("b", null, String(ev.d.getDate())), Demo.el("small", null, NAMES[ev.d.getDay()].slice(0, 3)));
      var text = Demo.el("div");
      text.append(Demo.el("h3", null, ev.title), Demo.el("p", null, ev.text));
      var action;
      if (ev.href) {
        action = Demo.el("a", "btn btn--line", ev.btn);
        action.href = ev.href;
      } else {
        action = Demo.el("button", "btn btn--fig", "Save a spot");
        action.type = "button";
        action.dataset.msg = "text";
        action.dataset.to = "(555) 014-6688";
        action.dataset.body = ev.msg;
      }
      li.append(date, text, action);
      list.appendChild(li);
    });
  }
})();
