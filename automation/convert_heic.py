"""Convert iPhone HEIC photos in site/assets to web-optimized JPEGs.

- Registers HEIC support via pillow_heif
- Auto-orients using EXIF (iPhone photos are often sideways)
- Resizes so the long edge is <= MAX_EDGE px
- Saves progressive JPEG at QUALITY, stripping EXIF
- Renames CamelCase source files to kebab-case .jpg

Run:  python automation/convert_heic.py
"""
import re
from pathlib import Path

from PIL import Image, ImageOps
import pillow_heif

pillow_heif.register_heif_opener()

ASSETS = Path(__file__).resolve().parent.parent / "site" / "assets"
MAX_EDGE = 1400
QUALITY = 84

# Clean output names keyed by source stem (lowercased).
RENAME = {
    "plainjanebagel": "plain-jane-bagel",
    "crosssectionofbagel": "bagel-cross-section",
    "dotcakestuffedbagel": "dot-cake-stuffed-bagel",
    "olivestuffedbagel": "olive-stuffed-bagel",
    "savorystuffedbagels": "savory-stuffed-bagels",
    "sweetstuffedbagels": "sweet-stuffed-bagels",
    "turkeycheesestuffedbagel": "turkey-cheese-stuffed-bagel",
    "veggiestuffedbagel": "veggie-stuffed-bagel",
    "berrymuffin": "berry-muffin",
    "muffinvariety": "muffin-variety",
    "chocolatecupcakes": "chocolate-cupcakes",
    "poptarts": "pop-tarts",
    "cookiesandwiches": "cookie-sandwiches",
    "animalcrackerpuddingcup": "animal-cracker-pudding-cup",
    "chocolatepuddingcup": "chocolate-pudding-cup",
    "vanillapuddingcup": "vanilla-pudding-cup",
    "smorespuddingcup": "smores-pudding-cup",
    "lattepictures": "latte",
}


def kebab(stem: str) -> str:
    s = re.sub(r"(?<=[a-z0-9])(?=[A-Z])", "-", stem)
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def convert(src: Path) -> None:
    out_name = RENAME.get(src.stem.lower(), kebab(src.stem))
    dst = ASSETS / f"{out_name}.jpg"
    img = Image.open(src)
    img = ImageOps.exif_transpose(img)          # honor iPhone rotation
    img = img.convert("RGB")
    img.thumbnail((MAX_EDGE, MAX_EDGE), Image.LANCZOS)
    img.save(dst, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    kb_in = src.stat().st_size / 1024
    kb_out = dst.stat().st_size / 1024
    print(f"{src.name:32s} -> {dst.name:30s} {kb_in:7.0f}KB -> {kb_out:6.0f}KB")


def main() -> None:
    sources = sorted(
        p for p in ASSETS.iterdir()
        if p.suffix.lower() in {".heic", ".jpg", ".jpeg"} and p.stem.lower() in RENAME
    )
    for src in sources:
        convert(src)
    print(f"\nDone. {len(sources)} images converted.")


if __name__ == "__main__":
    main()
