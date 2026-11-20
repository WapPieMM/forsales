# forsales

A floral-themed review and bio-link website.

## Current structure

- `index.html` — landing page, review form and bio/contact links
- `css/style.css` — responsive floral theme
- `js/config.js` — public Supabase configuration placeholders
- `js/app.js` — review rendering and submission
- `database/schema.sql` — proposed review table and Row Level Security policies

## Run locally

Open `index.html` in a browser, or serve the folder with any static web server.

## Supabase setup (not yet connected)

1. Create or choose a Supabase project.
2. Review `database/schema.sql` before running it.
3. Add the project URL and anon/publishable key to `js/config.js`.
4. Never expose a Supabase service_role key in browser code.

The public review form inserts reviews with `published = false`. Only approved reviews are displayed. Admin moderation and editable bio links are planned for a later step.

## Design direction

Floral / botanical, warm ivory, dusty rose, blush and muted sage. Responsive for mobile and desktop.
