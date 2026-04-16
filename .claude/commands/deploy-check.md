Run a pre-deploy checklist before pushing changes to the AspenOak site.

Check the following and report pass/fail for each:

1. **Image paths** — all `<img src="">` values point to `assets/` (not `Pictures/` or any absolute path)
2. **Broken links** — all `href` values between pages use relative paths (e.g. `menu.html`, not `/menu.html`)
3. **CSS references** — all pages link to `css/style.css`; only `index.html` also links to `css/home.css`
4. **JS reference** — all pages include `<script src="js/main.js"></script>` before `</body>`
5. **Git status** — show uncommitted changes so nothing is accidentally left out
6. **Seasonal content** — flag any time-sensitive content (e.g. Easter menu) that may need to be updated

If all checks pass, prompt me to commit and push.
