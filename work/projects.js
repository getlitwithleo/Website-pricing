/* Your own websites. Each entry here shows up as a card in the "Recent work" section of the home page.
   The section stays hidden until there's at least one entry.

   To add a site:
   1. Put the site's folder inside this "work" folder, for example work/rosies-bakery/
      (or skip this step and link to a site that lives somewhere else).
   2. Add an entry to the list below. The easiest way: open work/add.html in a browser,
      fill in the form, copy what it writes, and paste it right after "window.PROJECTS = [".
   3. Save and publish. The first entry in the list shows first.
      Then change the date after projects.js?v= in index.html, so visitors' browsers load the new list
      instead of an old saved copy.

   Each entry has:
     name   the business or site name
     type   the package it was built as: Tune-Up, Landing Page, Portfolio, Small Business,
            Restaurant & Café, Booking Site, Growth, Product Catalog or Masterpiece
     link   "work/folder-name/" for a site in this folder, or a full address like "https://example.com"
     about  one short sentence about the project
     image  optional: a screenshot, like "work/rosies-bakery/screenshot.png"

   Example entry (copy it into the list below and change the details):

   {
     name: "Rosie's Bakery",
     type: "Small Business",
     link: "work/rosies-bakery/",
     about: "A five-page site with the menu, opening hours and a map.",
     image: "work/rosies-bakery/screenshot.png"
   },
*/
window.PROJECTS = [
  {
    name: "CB.Lawn",
    type: "Small Business",
    link: "https://cb-lawn.getlitwithleo.workers.dev/",
    about: "Carter and Brayden's lawn mowing and yard work business in Oconomowoc, with services and prices, before-and-after photos, reviews, an FAQ and a free estimate form.",
    image: "work/cb-lawn-banner.jpg"
  },
  {
    name: "Summit Window Cleaning",
    type: "Small Business",
    link: "work/summit-window-cleaning/index.html",
    about: "A window cleaning business run by two Oconomowoc students, with a before-and-after slider, booking calendar, service-area map and quote form.",
    image: "work/summit-window-cleaning-banner.jpg"
  },
];
