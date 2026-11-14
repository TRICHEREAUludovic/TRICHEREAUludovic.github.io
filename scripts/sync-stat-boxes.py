#!/usr/bin/env python3
"""Synchronize the static stat-box values in index.html before publishing.

Run `python3 scripts/sync-stat-boxes.py` to update the SEO-visible HTML.
Run `python3 scripts/sync-stat-boxes.py --check` to verify it is up to date.
"""

from __future__ import annotations

import argparse
import re
import sys
from datetime import date
from html import escape
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INDEX_PATH = ROOT / "index.html"


class StatSourceParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.project_count = 0
        self.start_year: str | None = None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = dict(attrs)
        if tag == "article" and "project-card" in (attributes.get("class") or "").split():
            self.project_count += 1
        if tag == "span" and attributes.get("id") == "experience-counter":
            self.start_year = attributes.get("data-start-year")


def replace_span_text(document: str, element_id: str, value: str) -> str:
    pattern = re.compile(
        r'(<span\b(?=[^>]*\bid="'
        + re.escape(element_id)
        + r'")[^>]*>)(.*?)(</span>)',
        re.DOTALL,
    )
    matches = list(pattern.finditer(document))
    if len(matches) != 1:
        raise ValueError(
            f"Attendu un seul <span id=\"{element_id}\">, trouvé : {len(matches)}."
        )

    return pattern.sub(
        lambda match: match.group(1) + escape(value, quote=False) + match.group(3),
        document,
        count=1,
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--check",
        action="store_true",
        help="signale les valeurs obsolètes sans modifier index.html",
    )
    args = parser.parse_args()

    document = INDEX_PATH.read_text(encoding="utf-8")
    source = StatSourceParser()
    source.feed(document)

    try:
        start_year = int(source.start_year or "")
    except ValueError:
        print(
            "Erreur : #experience-counter doit avoir un data-start-year valide.",
            file=sys.stderr,
        )
        return 1

    current_year = date.today().year
    if start_year < 1 or start_year > current_year:
        print(
            f"Erreur : année de début d’expérience invalide ({start_year}).",
            file=sys.stderr,
        )
        return 1
    if source.project_count == 0:
        print("Erreur : aucune carte .project-card trouvée.", file=sys.stderr)
        return 1

    values = {
        "experience-counter": f"{current_year - start_year}+",
        "project-counter": str(source.project_count),
    }
    updated = document
    try:
        for element_id, value in values.items():
            updated = replace_span_text(updated, element_id, value)
    except ValueError as error:
        print(f"Erreur : {error}", file=sys.stderr)
        return 1

    if updated == document:
        print("Les valeurs des stat-box sont déjà synchronisées.")
        return 0

    if args.check:
        print(
            "Les valeurs des stat-box sont obsolètes. "
            "Exécutez `python3 scripts/sync-stat-boxes.py`.",
            file=sys.stderr,
        )
        return 1

    INDEX_PATH.write_text(updated, encoding="utf-8")
    print(
        "index.html mis à jour : "
        f"expérience {values['experience-counter']}, "
        f"projets {values['project-counter']}."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
