Add a new photo to the AspenOak website.

Ask me:
1. What is the filename? (e.g. `newbagel.jpg`)
2. Which page should it appear on? (home collage, menu, about, etc.)
3. What alt text should describe the image? (important for accessibility and SEO)

Then:
- Confirm the file has been placed in `site/assets/`
- Add the appropriate `<img>` tag in the correct HTML file
- Keep the same CSS class pattern as surrounding images so it inherits the right styles

After editing, remind me to:
- `git add site/assets/[filename] site/[page].html`
- `git commit -m "Add photo: [brief description]"`
- `git push origin main`
