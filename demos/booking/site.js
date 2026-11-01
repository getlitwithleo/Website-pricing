/* Studio Nine: services and stylists, the booking calendar with confirmation and reminder previews,
   the new-client form, before-and-after sliders, the looks filter and today's hours. */
(function () {
  var SERVICES = [
    { id: "cut-style", group: "Cuts", name: "Cut and style", mins: 60, price: 65 },
    { id: "short-cut", group: "Cuts", name: "Short cut", mins: 30, price: 38 },
    { id: "fringe", group: "Cuts", name: "Fringe trim", mins: 15, price: 12 },
    { id: "kids", group: "Cuts", name: "Kids' cut", mins: 30, price: 28 },
    { id: "root", group: "Color", name: "Root touch-up", mins: 90, price: 95 },
    { id: "all-over", group: "Color", name: "All-over color", mins: 120, price: 130 },
    { id: "balayage", group: "Color", name: "Balayage", mins: 180, price: 210 },
    { id: "highlights", group: "Color", name: "Partial highlights", mins: 120, price: 150 },
    { id: "gloss", group: "Color", name: "Gloss", mins: 45, price: 45 },
    { id: "curl-cut", group: "Curls and treatments", name: "Curl cut", mins: 75, price: 85 },
    { id: "curl-treatment", group: "Curls and treatments", name: "Curl treatment", mins: 60, price: 55 },
    { id: "deep", group: "Curls and treatments", name: "Deep conditioning", mins: 30, price: 30 },
    { id: "scalp", group: "Curls and treatments", name: "Scalp treatment", mins: 30, price: 35 },
    { id: "blowout", group: "Styling", name: "Blowout", mins: 45, price: 40 },
    { id: "updo", group: "Styling", name: "Event updo", mins: 60, price: 75 },
    { id: "consult", group: "Styling", name: "New client consult", mins: 15, price: 0 }
  ];
  // Who works which days (Sunday is 0). The salon is closed Sunday and Monday.
  var STYLISTS = [
    { id: "any", name: "First available", days: [2, 3, 4, 5, 6] },
    { id: "nina", name: "Nina", days: [2, 3, 4, 5, 6] },
    { id: "kai", name: "Kai", days: [2, 4, 5, 6] },
    { id: "leah", name: "Leah", days: [3, 4, 5, 6] }
  ];
  var OPEN = 9, CLOSE = 18;
  var HOURS = { 0: null, 1: null, 2: [9, 18], 3: [9, 18], 4: [9, 20], 5: [9, 18], 6: [9, 16] };

  function duration(m) { return m >= 60 ? (Math.floor(m / 60) + " hr" + (m % 60 ? " " + (m % 60) + " min" : "")) : m + " min"; }
  function price(p) { return p ? "$" + p : "Free"; }
  function timeLabel(mins) { var h = Math.floor(mins / 60), m = mins % 60; return (h % 12 || 12) + ":" + String(m).padStart(2, "0") + (h < 12 ? " am" : " pm"); }

  // Today's row in any hours table
  document.querySelectorAll('tr[data-day="' + new Date().getDay() + '"]').forEach(function (row) { row.classList.add("today"); });

  // Booking calendar
  var booker = document.getElementById("booker");
  if (booker) {
    var select = document.getElementById("b-service");
    var groups = {};
    SERVICES.forEach(function (s, i) {
      if (!groups[s.group]) { groups[s.group] = Demo.el("optgroup"); groups[s.group].label = s.group; select.append(groups[s.group]); }
      var opt = Demo.el("option", null, s.name + " · " + duration(s.mins) + " · " + price(s.price));
      opt.value = String(i);
      groups[s.group].append(opt);
    });
    var params = new URLSearchParams(location.search);
    var wanted = SERVICES.findIndex(function (s) { return s.id === params.get("service"); });
    if (wanted > -1) select.value = String(wanted);
    var wantedStylist = params.get("stylist");
    if (wantedStylist) { var radio = document.querySelector('input[name="stylist"][value="' + wantedStylist + '"]'); if (radio) radio.checked = true; }

    var state = { day: null, slot: null };
    var days = [];
    var start = new Date();
    start.setHours(0, 0, 0, 0);
    for (var d = 0; d < 14; d++) { var date = new Date(start); date.setDate(start.getDate() + d); days.push(date); }

    function stylist() { var r = document.querySelector('input[name="stylist"]:checked'); return STYLISTS.find(function (s) { return s.id === (r ? r.value : "any"); }); }
    // Some times look booked so the calendar feels real; the same ones every visit for a given day and stylist
    function taken(date, mins, who) {
      var n = date.getDate() * 37 + date.getMonth() * 11 + mins / 30 * 7 + who.length * 5;
      return who === "any" ? n % 7 === 0 : (n % 5 === 0 || n % 7 === 0 || n % 4 === 0);
    }

    var daysEl = document.getElementById("b-days");
    var slotsEl = document.getElementById("b-slots");

    function render() {
      var svc = SERVICES[Number(select.value)];
      var who = stylist();
      if (state.day !== null && who.days.indexOf(days[state.day].getDay()) === -1) { state.day = null; state.slot = null; }
      daysEl.replaceChildren.apply(daysEl, days.map(function (date, i) {
        var b = Demo.el("button", "day");
        b.type = "button";
        var closed = !HOURS[date.getDay()];
        var off = !closed && who.days.indexOf(date.getDay()) === -1;
        b.disabled = closed || off;
        b.setAttribute("aria-pressed", String(state.day === i));
        b.setAttribute("aria-label", date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) + (closed ? ", closed" : off ? ", " + who.name + " is off" : ""));
        b.append(Demo.el("span", null, date.toLocaleDateString("en-US", { weekday: "short" })), Demo.el("b", null, String(date.getDate())), Demo.el("span", null, closed ? "Closed" : off ? "Off" : date.toLocaleDateString("en-US", { month: "short" })));
        b.addEventListener("click", function () { state.day = i; state.slot = null; render(); });
        return b;
      }));

      var hint = document.getElementById("b-hint");
      if (state.day === null) {
        slotsEl.replaceChildren();
        hint.textContent = "Choose a day to see open times.";
        hint.hidden = false;
      } else {
        hint.hidden = true;
        var date = days[state.day];
        var close = HOURS[date.getDay()][1];
        var now = new Date();
        var slots = [];
        for (var m = OPEN * 60; m + svc.mins <= close * 60; m += 30) slots.push(m);
        slotsEl.replaceChildren.apply(slotsEl, slots.map(function (mins) {
          var b = Demo.el("button", "slot", timeLabel(mins));
          b.type = "button";
          var past = state.day === 0 && mins <= now.getHours() * 60 + now.getMinutes() + 60;
          b.disabled = past || taken(date, mins, who.id);
          b.setAttribute("aria-pressed", String(state.slot === mins));
          b.addEventListener("click", function () { state.slot = mins; render(); });
          return b;
        }));
        if (!slotsEl.querySelector(".slot:not(:disabled)")) {
          hint.textContent = "No open times left this day. Try another day.";
          hint.hidden = false;
        }
      }

      document.getElementById("s-service").textContent = svc.name;
      document.getElementById("s-stylist").textContent = who.name;
      document.getElementById("s-price").textContent = price(svc.price) + " · " + duration(svc.mins);
      document.getElementById("s-day").textContent = state.day === null ? "–" : days[state.day].toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      document.getElementById("s-time").textContent = state.slot === null ? "–" : timeLabel(state.slot);
      var ready = state.day !== null && state.slot !== null;
      document.getElementById("b-confirm").disabled = !ready;
      document.getElementById("b-status").textContent = ready ? "Add your name and phone, then book." : "Pick a service, day and time.";
    }
    select.addEventListener("change", function () { state.slot = null; render(); });
    document.querySelectorAll('input[name="stylist"]').forEach(function (r) { r.addEventListener("change", function () { state.slot = null; render(); }); });

    document.getElementById("b-confirm").addEventListener("click", function () {
      var name = document.getElementById("b-name");
      var phone = document.getElementById("b-phone");
      if (!name.value.trim() || !phone.value.trim()) {
        document.getElementById("b-status").textContent = "Add your name and phone so the salon can confirm.";
        (name.value.trim() ? phone : name).focus();
        return;
      }
      var svc = SERVICES[Number(select.value)];
      var who = stylist();
      var when = days[state.day].toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) + " at " + timeLabel(state.slot);
      var first = name.value.trim().split(" ")[0];
      var ul = Demo.el("ul", "dd-list");
      [["Service", svc.name + " (" + price(svc.price) + ", " + duration(svc.mins) + ")"], ["Stylist", who.name], ["When", when], ["Name", name.value.trim()], ["Phone", phone.value.trim()],
       ["First visit", document.getElementById("b-new").checked ? "Yes" : "No"]].forEach(function (pair) {
        var li = Demo.el("li");
        li.append(Demo.el("b", null, pair[0] + ": "), document.createTextNode(pair[1]));
        ul.append(li);
      });
      var email = Demo.el("div", "preview");
      email.append(Demo.el("small", null, "Confirmation email · sent right away"), document.createTextNode("Hi " + first + ", you're booked for " + svc.name.toLowerCase() + " with " + (who.id === "any" ? "the first available stylist" : who.name) + " on " + when + ". Studio Nine, 9 Linden Row. Need to change it? Use the link in this email."));
      var text = Demo.el("div", "preview is-text");
      text.append(Demo.el("small", null, "Reminder text · the day before"), document.createTextNode("Studio Nine: see you tomorrow at " + timeLabel(state.slot) + ", " + first + "! Reply C to confirm or R to reschedule."));
      Demo.open({
        title: "You're booked!",
        content: [ul, email, text],
        note: "On a real site, this calendar is a free booking tool synced to the salon's schedule. It blocks the time and sends both of these automatically."
      });
      if (document.getElementById("b-new").checked) {
        document.getElementById("b-status").textContent = "First visit? Fill in the new client form before you come.";
      }
    });
    render();
  }

  // New client form
  var intake = document.getElementById("intake");
  if (intake) Demo.form(intake, { title: "Form sent!", note: "On a real site, this goes to the salon's inbox and is attached to the client's booking, so the stylist reads it before you arrive." });

  // Before-and-after sliders
  document.querySelectorAll(".ba-frame input").forEach(function (range) {
    var frame = range.closest(".ba-frame");
    range.addEventListener("input", function () { frame.style.setProperty("--pos", range.value + "%"); });
  });

  // Looks filter
  var filters = document.querySelectorAll("[data-filter]");
  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filters.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      document.querySelectorAll(".look[data-kind]").forEach(function (look) {
        look.hidden = btn.dataset.filter !== "all" && look.dataset.kind !== btn.dataset.filter;
      });
    });
  });
})();
