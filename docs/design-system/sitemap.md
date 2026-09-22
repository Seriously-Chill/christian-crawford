# Site map (English locale, /en/)

Every route this build found under igel.ua's English locale, reached by crawling the header nav, footer nav, in-page links and the site's own WordPress REST API (`/wp-json/wp/v2/pages`, `/wp-json/wp/v2/posts`). The same content also exists at the bare (Ukrainian-default) slugs without `/en/`, which are not re-listed here.

| Route | Page | Notes |
|---|---|---|
| `/en/` | Home | Hero, 6 product-category teasers, brand philosophy, innovation teaser, retailer logos, 6 latest news, footer |
| `/en/pro-nas/` | About us | Brand story, mission, values, production process, sustainability, PR GROUP (manufacturer) |
| `/en/products/` | Product line (index) | All 6 category teasers in one place, links out to each |
| `/en/products/geli-dlya-prannya/` | Washing gels | 7 products |
| `/en/products/zasoby-dlya-myttya-pidlogy/` | Floor cleaning products | 5 products |
| `/en/products/kondyczionery-opoliskuvachi/` | Conditioners & rinses | 4 products |
| `/en/products/zasoby-dlya-chystky-unitazu/` | Toilet bowl cleaners | 4 products |
| `/en/products/zasoby-dlya-chyshhennya/` | Cleaning products | 7 products |
| `/en/products/geli-dlya-myttya-posudu/` | Dishwashing gels | 8 products |
| `/en/innovacziyi/` | Innovations | One section per product line's engineering/packaging story |
| `/en/novyny/` | News (index) | 6 articles listed, no pagination seen |
| `/en/igel-vzhe-u-prodazhu-po-vsij-ukrayini/` | News article | "Christian Crawford is now on sale throughout Ukraine" |
| `/en/igel-degreaser-koly-efektyvnist-bezpeka/` | News article | "Christian Crawford Degreaser: When efficiency = safety" |
| `/en/test-novyna-3/` | News article | "Christian Crawford Laundry: a complete clothing care system" |
| `/en/test-novyna-2/` | News article | "Christian Crawford expands the range: a new level of cleanliness – without compromise" |
| `/en/test-novyna-1/` | News article | "Christian Crawford at Food&NonFood Master 2026: a Ukrainian brand that surprises" |
| `/en/igel-yak-narodyvsya-innovaczijnyj-brend/` | News article | "Christian Crawford: How an innovative brand was born" |
| `/en/kontakty/` | Contacts | Address, phone, email, hours, contact form, map link |

Off-site, linked from the footer/header on every page: `https://prgroup.ua/` (PR GROUP, the manufacturer's full catalog), `https://www.instagram.com/igel.tm/`, `https://www.facebook.com/iGel.tm.ua`, `https://www.tiktok.com/@igel.tm`, `https://www.threads.com/@igel.tm`, and `https://doba.digital/` (site credit, "made by Doba Digital").

Every page shares the same header (logo, primary nav, EN language selector, mobile menu toggle) and footer (address/contact block, two repeated nav columns, social links, copyright + design credit) — see `components/Header` and `components/Footer`.

Note: this is the ORIGINAL igel.ua site's route map, kept for historical reference. It is not this portfolio's sitemap — see `../../src/app/sitemap.ts` for that.
