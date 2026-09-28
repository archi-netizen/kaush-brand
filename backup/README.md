# Pre-redesign backup (2026-09-28)

Snapshot of the homepage and shared design-system files as they were **before** the
"Indian arches / pill-shaped" redesign, in case we want to roll back.

- `index-pre-redesign-2026-09-28.html` → was `/index.html`
- `home-pre-redesign-2026-09-28.css` → was `/assets/home.css`
- `home-pre-redesign-2026-09-28.js` → was `/assets/home.js`
- `style-pre-redesign-2026-09-28.css` → was `/assets/style.css` (shared across the whole site)

## To restore the old look

```sh
cp backup/index-pre-redesign-2026-09-28.html index.html
cp backup/home-pre-redesign-2026-09-28.css assets/home.css
cp backup/home-pre-redesign-2026-09-28.js assets/home.js
cp backup/style-pre-redesign-2026-09-28.css assets/style.css
```

Note: `style.css` is shared by every page on the site (not just the homepage), so
restoring it will also revert the pill-button/rounded-corner styling everywhere else.

This is also just a regular git history — `git log -- index.html` and
`git show <commit>:index.html` work too, since nothing was force-pushed.
