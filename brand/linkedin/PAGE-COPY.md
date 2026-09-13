# Forcelis Group — LinkedIn Company Page

Everything LinkedIn asks for, in the order its forms ask for it. Copy each
field as-is. Items in `[brackets]` are facts only the company can supply — do
not guess them; LinkedIn shows them publicly.

Images are in this folder, at the sizes LinkedIn specifies as of September 2026 (logo 400×400, page cover 1512×256, PNG under 3 MB). Regenerate with `npm run build:linkedin`.

---

## 1. Create page (first screen)

| Field | Value |
|---|---|
| Page type | Company |
| Name | `Forcelis Group` |
| LinkedIn public URL | `linkedin.com/company/forcelis-group` — if taken, `forcelisgroup` |
| Website | `https://forcelis-group.com` |
| Industry | `Business Consulting and Services` |
| Company size | `2-10 employees` — pick the bracket that is true today; it can be changed later |
| Company type | `Privately Held` |
| Logo | `logo-dark-400.png` (see note below) |
| Tagline (max 120 chars) | `Financial & Operational Intelligence. We turn business data into better decisions.` |

**Industry:** LinkedIn's list is fixed. *Business Consulting and Services*
matches how the site describes the company ("a business performance
company"). *IT Services and IT Consulting* would over-weight the platform;
*Accounting* would be wrong — the site states explicitly that Forcelis is not
an accounting firm.

**Logo:** upload the dark tile (ink with the taupe F). It has a defined edge on
LinkedIn's white feed and still reads in dark mode; it is also what people see
in the browser tab and on the link-preview card, so the three match. The light
tile (`logo-light-400.png`) is the manual's "app icon (light)" and is there if
you ever want it — on LinkedIn's white background it looks washed out.

---

## 2. Edit page → Header

| Field | Value |
|---|---|
| Cover image | `cover-1512x256.png` — LinkedIn's exact size (minimum and recommended are the same). `cover-3024x512.png` is the same at 2× if the uploader accepts larger files. |
| Custom button | `Contact us` → `https://forcelis-group.com/en/contact/` |

Alternative button: `Learn more` → `https://forcelis-group.com/en/`. *Contact
us* is better: the page's whole purpose is to start a conversation, and the
site's contact form is the only intake channel.

---

## 3. Edit page → About

### Description (max 2,000 characters — this is 1,944)

```
Forcelis Group is a business performance company. We combine financial expertise, operational analysis, proprietary technology and managed services to help mid-sized companies understand how they are performing, find where margin and cash are being lost, and act on it.

Most companies already hold the data needed to explain their own performance: invoices, accounting entries, sales, purchasing, inventory movements, supplier terms, bank activity. What they usually lack is one place where that information is connected, comparable over time and read by someone who knows what to look for. That is the gap Forcelis closes.

How we work
• Data — we connect and structure the information the company already produces into one consistent, comparable base.
• Intelligence — deterministic analysis over that base: margins, cash conversion, customer concentration, price dispersion, input-cost inflation.
• Action — every finding is stated with the decision it implies, who owns it and how it will be measured. Where it makes sense, we stay on to run the process.

What we do
Financial Intelligence · Operational Intelligence · Supply Chain Intelligence · Accounting Intelligence · Business Advisory · Managed Services

Three lines, one group
Forcelis Advisory (consulting), Forcelis Intelligence (the proprietary data platform) and Forcelis Managed Services (recurring reporting, analysis and operations).

Who it is for
Manufacturing, distribution, B2B commerce, import and export, professional services, and growing businesses that need CFO-level visibility without building a full finance team in-house.

Our rules
We never invent a number. We verify rather than assume. Every finding carries an action. And we say plainly what stage each capability is at.

Forcelis is an early-stage firm. We would rather be judged on our method and our product than on a client list we do not yet have. Start with a Business Diagnostic at forcelis-group.com.
```

### Other fields

| Field | Value |
|---|---|
| Website | `https://forcelis-group.com` |
| Phone | leave empty — the site publishes no phone or email; the form is the channel |
| Industry | `Business Consulting and Services` |
| Company size | as above |
| Company type | `Privately Held` |
| Year founded | `[year the company was incorporated]` |
| Specialties (max 20) | see list below |

### Specialties — paste one per line, LinkedIn turns them into tags

```
Financial Intelligence
Operational Intelligence
Supply Chain Intelligence
Accounting Intelligence
Business Advisory
Managed Services
Business Performance
Business Diagnostics
Financial Analysis
Margin Analysis
Cash Flow Analysis
Working Capital
Inventory Analysis
Customer Concentration
Management Reporting
Business Intelligence
Data Analytics
```

Seventeen. Each one is something the site actually describes. Do not pad to
twenty with terms the site does not use (e.g. "Fractional CFO", "Tax
Advisory") — LinkedIn search will surface the page for them and the first
visit will contradict it.

---

## 4. Edit page → Locations

| Field | Value |
|---|---|
| Primary location | `[registered address in Estonia]` — street, city, postal code, country |
| Location name | `Headquarters` |

If the company also operates from Mexico, add it as a second location named
`Mexico` only if there is a real address to put there. LinkedIn requires a
street address per location; "Mexico" alone will not save.

Note: the website's About page still says "Based in Mexico" and the legal
pages still cite Mexican law. Both are queued to be corrected once the Estonian
entity's details are confirmed — the LinkedIn page and the site should say the
same thing.

---

## 5. Edit page → Community hashtags (max 3)

```
#BusinessPerformance
#FinancialIntelligence
#OperationalIntelligence
```

---

## 6. Optional but worth doing

- **Verify the page.** LinkedIn → Settings → Verification: use a mailbox on
  `@forcelis-group.com` (Google Workspace is already set up). A verified badge
  costs nothing and is the single cheapest credibility signal a new page can
  get.
- **Link preview.** When you share `forcelis-group.com` in a post, LinkedIn
  pulls the site's social card (ink background, taupe lockup, the same
  headline as the cover). If it shows an old card, paste the URL into
  linkedin.com/post-inspector/ once to refresh the cache.
- **Personal profile banner.** `banner-personal-1584x396.png` matches the page
  cover, for your own profile (Profile → edit background photo).
- **Site ↔ LinkedIn.** Once the page URL exists, it belongs in the site footer
  next to the legal links. Send me the final URL and I will add it.
