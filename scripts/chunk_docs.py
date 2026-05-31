from __future__ import annotations

import json
from pathlib import Path


DOCS_DIR = Path("data/docs")
OUTPUT_PATH = Path("data/chunks.json")
REQUIRED_FRONTMATTER_FIELDS = ["id", "title", "category"]


def parse_frontmatter(markdown_path: Path) -> tuple[dict[str, str], str]:
    markdown = markdown_path.read_text(encoding="utf-8")

    if not markdown.startswith("---"):
        raise ValueError("Markdown file is missing frontmatter.")

    parts = markdown.split("---", 2)

    if len(parts) < 3:
        raise ValueError("Markdown file is missing frontmatter or body.")

    raw_frontmatter = parts[1].strip()
    metadata: dict[str, str] = {}
    body = parts[2].strip()

    for line in raw_frontmatter.splitlines():
        if not line.strip():
            continue

        if ":" not in line:
            raise ValueError(f"{markdown_path} has invalid frontmatter line: {line}")

        key, value = line.split(":", 1)
        metadata[key.strip()] = value.strip().strip('"').strip("'")

    for field in REQUIRED_FRONTMATTER_FIELDS:
        if field not in metadata:
            raise ValueError(f"{markdown_path} is missing frontmatter field: {field}")

    return metadata, body


def create_chunk(markdown_path: Path) -> dict[str, str]:
    metadata, body = parse_frontmatter(markdown_path)

    return {
        "chunkId": f"{metadata['id']}__chunk_001",
        "docId": metadata["id"],
        "title": metadata["title"],
        "category": metadata["category"],
        "sourcePath": str(markdown_path),
        "text": build_chunk_text(metadata, body),
    }


def build_chunk_text(metadata: dict[str, str], body: str) -> str:
    return "\n\n".join(
        [
            f"Title: {metadata['title']}",
            f"Category: {metadata['category']}",
            f"Content:\n{body}",
        ],
    )


def main() -> None:
    chunks: list[dict[str, str]] = []
    for markdown_path in sorted(DOCS_DIR.glob("**/*.md")):
        chunks.append(create_chunk(markdown_path))

    OUTPUT_PATH.write_text(
        json.dumps(chunks, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )

    print(f"Created {len(chunks)} chunks at {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
