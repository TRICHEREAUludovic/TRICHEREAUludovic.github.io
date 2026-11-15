#!/usr/bin/env python3
"""Validate locale catalogs and local references in the static site."""

from __future__ import annotations

import json
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
HTML_FILES = (
    ROOT / "404.html",
    ROOT / "index.html",
    ROOT / "mentions-legales.html",
    ROOT / "politique-confidentialite.html",
)
LOCALE_FILES = (ROOT / "Public/locales/fr.json", ROOT / "Public/locales/en.json")
TRANSLATION_ATTRIBUTES = {
    "data-i18n",
    "data-i18n-placeholder",
    "data-i18n-aria",
    "data-i18n-alt",
    "data-i18n-content",
}


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: set[str] = set()
        self.duplicate_ids: set[str] = set()
        self.references: list[str] = []
        self.translation_keys: set[str] = set()

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = dict(attrs)
        element_id = attributes.get("id")
        if element_id:
            if element_id in self.ids:
                self.duplicate_ids.add(element_id)
            self.ids.add(element_id)

        if tag != "base":
            for attribute in ("href", "src", "action"):
                reference = attributes.get(attribute)
                if reference:
                    self.references.append(reference)

        for attribute in TRANSLATION_ATTRIBUTES:
            key = attributes.get(attribute)
            if key:
                self.translation_keys.add(key)

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.handle_starttag(tag, attrs)


def validate() -> list[str]:
    errors: list[str] = []
    catalogs: list[dict[str, object]] = []
    for locale_path in LOCALE_FILES:
        try:
            catalog = json.loads(locale_path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as error:
            errors.append(f"{locale_path.relative_to(ROOT)}: {error}")
            continue
        if not isinstance(catalog, dict):
            errors.append(f"{locale_path.relative_to(ROOT)}: attendu un objet JSON.")
            continue
        catalogs.append(catalog)

    if len(catalogs) == len(LOCALE_FILES):
        french_keys, english_keys = (set(catalog) for catalog in catalogs)
        if french_keys != english_keys:
            missing_en = sorted(french_keys - english_keys)
            missing_fr = sorted(english_keys - french_keys)
            if missing_en:
                errors.append(f"Clés absentes de en.json : {', '.join(missing_en)}")
            if missing_fr:
                errors.append(f"Clés absentes de fr.json : {', '.join(missing_fr)}")

    catalog_keys = set.intersection(*(set(catalog) for catalog in catalogs)) if catalogs else set()
    for page_path in HTML_FILES:
        try:
            source = page_path.read_text(encoding="utf-8")
        except OSError as error:
            errors.append(f"{page_path.relative_to(ROOT)}: {error}")
            continue

        page = PageParser()
        page.feed(source)
        page.close()
        page_name = page_path.relative_to(ROOT)

        if page.duplicate_ids:
            errors.append(f"{page_name}: identifiants dupliqués : {', '.join(sorted(page.duplicate_ids))}")

        missing_translations = sorted(page.translation_keys - catalog_keys)
        if missing_translations:
            errors.append(f"{page_name}: traductions absentes : {', '.join(missing_translations)}")

        for reference in page.references:
            parsed = urlsplit(reference)
            if parsed.scheme or parsed.netloc:
                continue

            target_path = (page_path.parent / unquote(parsed.path)).resolve()
            if parsed.path and not target_path.is_file():
                errors.append(f"{page_name}: ressource locale introuvable : {reference}")
                continue
            if parsed.fragment:
                fragment_page = page
                if parsed.path:
                    fragment_page = PageParser()
                    try:
                        fragment_page.feed(target_path.read_text(encoding="utf-8"))
                        fragment_page.close()
                    except (OSError, UnicodeDecodeError):
                        continue
                if unquote(parsed.fragment) not in fragment_page.ids:
                    errors.append(f"{page_name}: ancre introuvable : {reference}")

    try:
        ET.parse(ROOT / "sitemap.xml")
    except (OSError, ET.ParseError) as error:
        errors.append(f"sitemap.xml: {error}")

    return errors


def main() -> int:
    errors = validate()
    if errors:
        for error in errors:
            print(f"Erreur : {error}", file=sys.stderr)
        return 1

    print("Validation réussie : locales, clés de traduction, identifiants, références locales et sitemap.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
