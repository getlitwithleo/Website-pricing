/* Brightside Bike Repair: open-now sign, today's hours, FAQ search and the site's forms. */
(function () {
  // Opening hours as [open, close] in 24-hour time, by day of the week (Sunday is 0)
  var HOURS = { 0: null, 1: [8, 18], 2: [8, 18], 3: [8, 18], 4: [8, 19], 5: [8, 18], 6: [9, 16] };
  var DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var now = new Date();
  var today = now.getDay();
  var hour = now.getHours() + now.getMinutes() / 60;
  var hours = HOURS[today];

  function label(h) { return (h % 12 || 12) + (h < 12 ? " am" : " pm"); }

  var status;
  if (hours && hour >= hours[0] && hour < hours[1]) {
    status = { open: true, text: "Open now · until " + label(hours[1]) };
  } else {
    var next = today, tries = 0;
    do { next = (next + 1) % 7; tries++; } while (!HOURS[next] && tries < 7);
    var opensToday = hours && hour < hours[0];
    status = { open: false, text: "Closed now · opens " + (opensToday ? "today at " + label(hours[0]) : (tries === 1 ? "tomorrow" : DAYS[next]) + " at " + label(HOURS[next][0])) };
  }

  document.querySelectorAll("[data-open-pill]").forEach(function (pill) {
    pill.classList.toggle("is-closed", !status.open);
    pill.querySelector("[data-open-text]").textContent = status.text;
  });
  document.querySelectorAll("[data-today]").forEach(function (node) {
    node.textContent = hours ? "Today " + label(hours[0]) + " – " + label(hours[1]) : "Closed today";
  });
  document.querySelectorAll('.hours tr[data-day="' + today + '"]').forEach(function (row) { row.classList.add("today"); });

  // FAQ search: hides questions that don't match, and whole groups with no matches
  var search = document.getElementById("faq-q");
  if (search) {
    var empty = document.getElementById("faq-empty");
    search.addEventListener("input", function () {
      var q = search.value.trim().toLowerCase();
      var shown = 0;
      document.querySelectorAll(".faq-group").forEach(function (group) {
        var groupShown = 0;
        group.querySelectorAll("details").forEach(function (item) {
          var match = !q || item.textContent.toLowerCase().indexOf(q) !== -1;
          item.hidden = !match;
          if (match) groupShown++;
          if (q && match) item.open = true;
        });
        group.hidden = !groupShown;
        shown += groupShown;
      });
      empty.hidden = shown > 0;
    });
  }

  var contact = document.getElementById("contact-form");
  if (contact) Demo.form(contact, { title: "Message sent!", note: "On a real site, this goes straight to the shop's inbox, and the customer gets an automatic \"we got your message\" reply." });
})();
