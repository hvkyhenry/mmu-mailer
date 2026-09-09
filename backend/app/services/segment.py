"""
Generic, column-agnostic filtering (segments) and {{variable}} rendering.
Neither function knows what "status" or "paid" mean — they just operate on
whatever keys exist in a row, so new sheet columns work automatically.
"""
import re
from ..schemas import Filter


def row_matches(row: dict, filters: list[Filter]) -> bool:
    for f in filters:
        actual = str(row.get(f.column, "")).strip().lower()
        target = (f.value or "").strip().lower()

        if f.op == "equals" and actual != target:
            return False
        if f.op == "not_equals" and actual == target:
            return False
        if f.op == "contains" and target not in actual:
            return False
        if f.op == "not_empty" and actual == "":
            return False
        if f.op == "empty" and actual != "":
            return False
    return True


def filter_rows(rows: list[dict], filters: list[Filter]) -> list[dict]:
    return [r for r in rows if row_matches(r, filters)]


VAR_PATTERN = re.compile(r"\{\{\s*([^{}]+?)\s*\}\}")


def render(template_text: str, row: dict) -> str:
    def replace(match):
        key = match.group(1)
        return str(row.get(key, f"{{{{{key}}}}}"))  # leave unknown vars visible

    return VAR_PATTERN.sub(replace, template_text)
