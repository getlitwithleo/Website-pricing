# LM Web Design

A one-page pricing page for website design work: nine packages from $60 to $600. Each package is a different kind of website, with its own color, a preview of what that site looks like, and features built for that type of business. The $360 Growth package is marked as recommended.

Open `index.html` in a browser to view it.

## What's in this folder

| Path | What it is |
|---|---|
| `index.html` | The home page: packages, live demo links, Recent work, quote builder, process, FAQ |
| `demos/` | One full demo website per package, each for a made-up business, in its own folder (see below) |
| `work/projects.js` | Your own finished websites, shown in the Recent work section |
| `work/add.html` | An owner tool that writes a `projects.js` entry for you (not linked from the site) |
| `masterpiece.html` | A page to send a customer listing everything in the Masterpiece package |
| `img/` | The LM Web Design logo (`logo.png`, and `logo-dark.png` for dark backgrounds) and the browser tab icons |

## Demos

Each demo is a complete website for a made-up business, built out to everything its package includes: the full page count and every listed feature. Each lives in its own folder in `demos/`.

| Package | Demo | Pages | What you can try |
|---|---|---|---|
| Tune-Up | `demos/tune-up/` | 1 (an existing site, fixed) | Drag a slider between an old hardware store site and its tuned-up version |
| Landing Page | `demos/landing-page/` | 1 page, 6 sections | A night market event page with a live countdown, park map, RSVP form, FAQ, social sharing and search tags |
| Portfolio | `demos/portfolio/` | 4: Work, Tidewater, Small Hours, About & commissions | A painter's gallery with a full-screen viewer, a page with the story behind each series, and a commission inquiry form |
| Small Business | `demos/small-business/` | 5: Home, Services & prices, About & reviews, FAQ, Visit & contact | A bike shop with 22 prices, an open-now sign, reviews, searchable FAQ, map, tap-to-call and contact form |
| Restaurant & Café | `demos/restaurant/` | 5: Home, Menu, Order & reserve, Events & catering, Visit | A café with a daily special banner, 36-item menu with dietary filters, delivery links, table booking, photo gallery and catering form |
| Booking Site | `demos/booking/` | 6: Home, Services, Book online, New clients, Gallery, Policies & FAQ | A salon with a booking calendar by stylist, confirmation and reminder previews, intake form and before-and-after sliders |
| Growth | `demos/growth/` | 8: Home, Services & pricing, Case studies, Blog, 3 blog posts, Contact | A bookkeeping firm with plan comparison, full case studies, a searchable blog, newsletter, free checklist and quote form |
| Product Catalog | `demos/product-catalog/` | 25 products: Shop, product pages, Order list, Studio, Shipping & care, Owner's guide | A pottery shop with search, filters, sizes and finishes, an order list sent as one text or email, and the guide to adding products |
| Masterpiece | `demos/masterpiece/` | 12: Home, Our story, Collection, 4 tea pages, Tastings, Journal, 2 journal posts, Visit | A tea house with two full design concepts (switch anywhere, remembered across pages), custom graphics and animation, tasting bookings and search tags |

Each demo uses real photos from Unsplash, stored in `demos/img/` (sources are listed in `demos/img/CREDITS.md`). A few product photos in the pottery shop are cropped from the shop's wider photos. The package cards and hero on the home page show screenshots of the demos.

Every demo page has a bar at the top marking it as a demo, linking back to the packages and to the quote builder with that package already chosen. The bar is filled in by `demos/demo.js` from one list of packages and prices (`PACKAGES` at the top of that file). Nothing on a demo is really sent: forms, booking and message buttons show a preview of what would happen on a real site. `demos/demo.css` and `demos/demo.js` hold the parts every demo shares; each demo folder has its own `site.css` and `site.js`.

The old single-page addresses (like `demos/booking.html`) redirect to the new folders, so older links still work.

## Adding your own websites

1. Put the finished site's folder inside `work/`, for example `work/rosies-bakery/`. Skip this if the site lives at its own address.
2. Open `work/add.html` in a browser, fill in the form and press Copy entry.
3. Paste the entry into `work/projects.js` right after `window.PROJECTS = [` and save.

The Recent work section and its menu link appear on the home page as soon as the list has one entry.

A site that has its own GitHub repository can be linked in instead of copied, so there's only one version of it. `work/summit-window-cleaning` works this way: it's a git submodule of [getlitwithleo/summit-window-cleaning](https://github.com/getlitwithleo/summit-window-cleaning). After changing that repository, run `git submodule update --remote work/summit-window-cleaning` here and commit to bring the change in.

## Putting it online for free

The site is also published on Cloudflare at https://website-pricing.getlitwithleo.workers.dev/, which rebuilds automatically from this branch.

`google60d5ed61a0d0d22a.html` proves to Google Search Console that you own the site. Don't delete it, or the site stops being verified.

GitHub Pages hosts the whole folder for free when the repository is public: in the repository on GitHub, go to Settings → Pages, choose "Deploy from a branch", pick this branch and the `/ (root)` folder, and save. The address appears on that page after a minute or two.

## Packages

| Group | Package | Price | Best for | Pages | Max turnaround | Revisions | Free fixes |
|---|---|---|---|---|---|---|---|
| Quick jobs | Tune-Up | $60 | Fixes to a site you have the files for | Current site | 2 days | 1 | None |
| Quick jobs | Landing Page | $120 | Launching a product or event | 1 | 5 days | 1 | 7 days |
| Business websites | Portfolio | $190 | Photographers, artists, makers | Up to 4 | 7 days | 2 | 7 days |
| Business websites | Small Business | $240 | Local shops and services | Up to 5 | 10 days | 2 | 7 days |
| Business websites | Restaurant & Café | $270 | Restaurants, cafés, food trucks | Up to 5 | 10 days | 2 | 14 days |
| Business websites | Booking Site | $300 | Salons, trainers, coaches | Up to 6 | 12 days | 3 | 14 days |
| Premium builds | Growth (recommended) | $360 | Steady leads and a blog | Up to 8 | 14 days | 3 | 14 days |
| Premium builds | Product Catalog | $480 | Shops that sell by message or in person | Up to 25 products | 18 days | 3 | 21 days |
| Premium builds | Masterpiece | $600 | Fully custom, one of a kind | Up to 12 | 21 days | 5 | 30 days |

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

Everything listed is built into the site itself. Forms, booking, newsletter signup and analytics are built into the site and connected to an outside tool (for example Formspree, Calendly, Mailchimp, Google Analytics), all of which have free plans; the client pays for any paid plan directly. There is no on-site checkout: the Product Catalog takes orders through buttons that open a pre-filled text or email. Buying domains, setting up business email, Google Business Profile, calls and ongoing care plans are not offered.

## What's on the page

- A hero with a desktop and phone mockup, and a strip of what every website includes
- Nine package cards in three groups, each with its own color, site preview and features; each "Choose" button preselects that package in the quote builder
- A "Find your fit" table matching common needs to packages
- Add-ons, a quote builder (total, 50% deposit, balance due at launch), the process, FAQ, and terms

## Editing prices

Prices appear in the hero, the package cards, the "Find your fit" table, the add-ons list and the quote builder. If you change one, update each spot, plus the `PACKAGES` and `EXTRAS` lists in the `<script>` at the bottom of `index.html` (they also control which add-ons each package includes), the `PACKAGES` list at the top of `demos/demo.js` (the demo bars), and the prices in `masterpiece.html`.
