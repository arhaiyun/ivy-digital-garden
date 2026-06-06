# Ivy Digital Garden Rules

## Project Intent

This repository is a private family archive for Ivy. Optimize for durability, clear writing workflows, privacy, and low maintenance over novelty.

## Content

- Keep real entries under `content/`.
- Keep examples under `templates/examples/`, not in live content sections.
- Required frontmatter for content entries: `title`, `date`, `type`, `visibility`.
- Health records must not use `visibility: public`.
- Use `./scripts/new-entry.sh <type> <YYYY-MM-DD> <title>` for new entries when possible.

## Tooling

- Use npm for this project.
- Run `npm run check` before committing changes.
- Keep VitePress configuration small and content-driven.

## Privacy

- Treat the repository and generated site as family-private.
- Do not add secrets, identity numbers, full medical record numbers, or public deployment assumptions.
- Keep `noindex` in site metadata, but rely on platform access control for real privacy.
