# LM Web Design

A one-page pricing page for website design work: nine packages from $20 to $400. Each package is a different kind of website, with its own color, a preview of what that site looks like, and features built for that type of business. The $250 Growth package is marked as recommended.

Open `index.html` in a browser to view it.

## What's in this folder

| Path | What it is |
|---|---|
| `index.html` | The home page: packages, live demo links, Recent work, quote builder, process, FAQ |
| `demos/` | One live demo site per package, each for a made-up business (see below) |
| `work/projects.js` | Your own finished websites, shown in the Recent work section |
| `work/add.html` | An owner tool that writes a `projects.js` entry for you (not linked from the site) |
| `masterpiece.html` | A page to send a customer listing everything in the Masterpiece package |
| `img/` | The LM Web Design logo (`logo.png`, and `logo-dark.png` for dark backgrounds) and the browser tab icons |

## Demos

| Package | Demo | What you can try |
|---|---|---|
| Tune-Up | `demos/tune-up.html` | Drag a slider between an old hardware store site and its tuned-up version |
| Landing Page | `demos/landing-page.html` | A night market event page with a live countdown and RSVP form |
| Portfolio | `demos/portfolio.html` | A painter's gallery with series filters and a full-screen view with the story behind each piece |
| Small Business | `demos/small-business.html` | A bike shop with prices, an open-now sign, hours, map, FAQ and contact form |
| Restaurant & Café | `demos/restaurant.html` | A café with a daily special, tabbed menu with dietary tags, ordering and reservations |
| Booking Site | `demos/booking.html` | A salon with a working booking calendar, new-client form and before-and-after looks |
| Growth | `demos/growth.html` | A bookkeeping firm with case studies, a readable blog, newsletter signup and quote form |
| Product Catalog | `demos/product-catalog.html` | A pottery shop with search, filters, glaze options and order-by-message |
| Masterpiece | `demos/masterpiece.html` | A tea house with animated steam, custom icons and a switch between two full design concepts |

Each demo uses real photos from Unsplash, stored in `demos/img/` (sources are listed in `demos/img/CREDITS.md`). The package cards and hero on the home page show screenshots of the demos.

Each demo has a bar at the top marking it as a demo, linking back to the packages and to the quote builder with that package already chosen. Nothing on a demo is really sent: forms, booking and message buttons show a preview of what would happen on a real site. `demos/demo.css` and `demos/demo.js` hold the parts every demo shares.

## Adding your own websites

1. Put the finished site's folder inside `work/`, for example `work/rosies-bakery/`. Skip this if the site lives at its own address.
2. Open `work/add.html` in a browser, fill in the form and press Copy entry.
3. Paste the entry into `work/projects.js` right after `window.PROJECTS = [` and save.

The Recent work section and its menu link appear on the home page as soon as the list has one entry.

## Putting it online for free

GitHub Pages hosts the whole folder for free when the repository is public: in the repository on GitHub, go to Settings → Pages, choose "Deploy from a branch", pick this branch and the `/ (root)` folder, and save. The address appears on that page after a minute or two.

## Packages

| Group | Package | Price | Best for | Pages | Max turnaround | Revisions | Free fixes |
|---|---|---|---|---|---|---|---|
| Quick jobs | Tune-Up | $20 | Fixes to a site you have the files for | Current site | 2 days | 1 | None |
| Quick jobs | Landing Page | $75 | Launching a product or event | 1 | 5 days | 1 | 7 days |
| Business websites | Portfolio | $125 | Photographers, artists, makers | Up to 4 | 7 days | 2 | 7 days |
| Business websites | Small Business | $150 | Local shops and services | Up to 5 | 10 days | 2 | 7 days |
| Business websites | Restaurant & Café | $175 | Restaurants, cafés, food trucks | Up to 5 | 10 days | 2 | 14 days |
| Business websites | Booking Site | $200 | Salons, trainers, coaches | Up to 6 | 12 days | 3 | 14 days |
| Premium builds | Growth (recommended) | $250 | Steady leads and a blog | Up to 8 | 14 days | 3 | 14 days |
| Premium builds | Product Catalog | $325 | Shops that sell by message or in person | Up to 25 products | 18 days | 3 | 21 days |
| Premium builds | Masterpiece | $400 | Fully custom, one of a kind | Up to 12 | 21 days | 5 | 30 days |

## Add-ons

| Add-on | Price | Included with |
|---|---|---|
| Extra page | $15 each | |
| Extra revision round | $15 each | |
| Copywriting | $10 per page | |
| Logo design | $40 | |
| Business cards (design only, printing not included) | $15 | |
| Social media launch kit (profile picture for every platform, cover banners for 3 platforms, 5 post templates, 3 story highlight covers) | $30 | |
| Booking calendar | $35 | Booking Site, Masterpiece |
| Newsletter signup | $15 | Growth |
| Rush delivery | +$30 | |

## Scope

Everything listed is work that can be built with Claude. Forms, booking, newsletter signup and analytics are built into the site and connected to an outside tool (for example Formspree, Calendly, Mailchimp, Google Analytics), all of which have free plans; the client pays for any paid plan directly. There is no on-site checkout: the Product Catalog takes orders through buttons that open a pre-filled text or email. Buying domains, setting up business email, Google Business Profile, calls and ongoing care plans are not offered.

## What's on the page

- A hero with a desktop and phone mockup, and a strip of what every website includes
- Nine package cards in three groups, each with its own color, site preview and features; each "Choose" button preselects that package in the quote builder
- A "Find your fit" table matching common needs to packages
- Add-ons, a quote builder (total, 50% deposit, balance due at launch), the process, FAQ, and terms

## Editing prices

Prices appear in the hero, the package cards, the "Find your fit" table, the add-ons list and the quote builder. If you change one, update each spot, plus the `PACKAGES` and `EXTRAS` lists in the `<script>` at the bottom of `index.html` (they also control which add-ons each package includes).
