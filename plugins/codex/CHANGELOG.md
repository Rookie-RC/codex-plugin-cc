# Changelog

## Unreleased

- Rescue tasks (`/codex:rescue`) now default to the `danger-full-access` sandbox so they work on HPC hosts such as JULES, where Codex's Linux bubblewrap sandbox is unusable.
- Added `CODEX_COMPANION_SANDBOX` (`read-only`, `workspace-write`, or `danger-full-access`) to override the rescue sandbox mode. The mode is applied to both `thread/start` and `thread/resume` and is pinned as the app-server process default, which also skips Codex's startup `bwrap` capability probe.
- `--write` is now a behavioral contract rather than an OS-enforced one: non-write rescue runs get a `<read_only_mode>` instruction instead of a read-only sandbox. Use `CODEX_COMPANION_SANDBOX=read-only` for enforced read-only runs.
- `/codex:review` and `/codex:adversarial-review` are unchanged and still use the enforced `read-only` sandbox.

## 1.0.0

- Initial version of the Codex plugin for Claude Code
