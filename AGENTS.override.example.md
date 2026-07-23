# Local Codex Override Example

Copy this file locally as `AGENTS.override.md` when machine-specific execution
context is useful.

`AGENTS.override.md`:

- must remain local and must not be committed;
- must not contain passwords, tokens, API keys, or other secrets;
- may refine local execution and review context only;
- does not change the repository's maintainer-owned, main-only Git workflow;
- does not override committed product truth or approved repository decisions.

## Private local references

- Private review material may be placed under the ignored
  `references/private/` directory.
- Record only the minimum local locator needed for personal review.
- Never copy private content, screenshots, hashes, or machine-local paths into
  public documentation, runtime code, tests, or CI.
- Public contributors and normal verification must not require private files.

## Machine-specific browser and preview context

Local guidance may record:

- the browser used for manual verification;
- a locally approved browser-launch command;
- preferred development and preview ports;
- accessibility tools available on this machine;
- viewport presets used for responsive checks.

Keep commands local, non-secret, and compatible with the repository's approved
verification flow.

## Local deployment notes

Local guidance may record:

- the name of an already configured non-production target;
- machine-specific preview prerequisites;
- local proxy or certificate behavior;
- commands that inspect an existing deployment without changing product truth.

Do not store credentials, bypass values, private URLs, or deployment secrets.
Do not describe local observations as public release evidence until they are
recorded in an approved review.

## Personal review preferences

Local guidance may state preferences such as:

- run focused tests before the full suite;
- request a compact changed-file summary before committing;
- use a particular browser viewport for manual checks;
- pause for maintainer review at specified documentation gates.

Durable product, numerical, architecture, and release decisions belong in the
committed repository documents indexed by `docs/INDEX.md`.
