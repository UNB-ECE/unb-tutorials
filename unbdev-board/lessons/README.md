# UNBdev.board tutorial authoring project

This folder is an importable UNB IDE project for the UNBdev.board activities in this
collection. Import it, edit a lesson or the starter program, preview with the UNB IDE
Tutorial Tool, and synchronize back to your own fork or branch.

## Contents

- [BLiXel light patterns](blixel.md) — the five integrated lights: colour, brightness,
  shift, rotate and bar graphs. Card label **Hardware test pending**.
- [Explore the microphone](microphone.md) — sound level, threshold and event flags.
  Card label **Hardware unverified**.
- `main.ts` — the empty starter program. It compiles and does nothing until you add
  blocks or a snippet from a lesson.
- `pxt.json` — the project manifest: the device dependency and the file list.

Both lessons are instructor previews. Their behaviour on real hardware is not
validated, and compiling or navigating a lesson proves nothing about the board. See
[the collection README](../README.md) and
[the microphone coverage notes](../microphone-validation.md). Do not remove a card's
label to make an activity look ready.

## Dependency

`pxt.json` pins the device extension at a reviewed commit. Each lesson also carries
its own `package` fence: that is the reviewed revision for that lesson, and the two
are allowed to differ. Leave both as they are unless the device revision is
deliberately updated. Pin a commit — a branch name such as `main` is not a reviewed
revision.

## Authoring and publication

Authoring here does not publish anything. Adding or changing a lesson is a pull
request in this repository, and the merge is the publication; see
[the repository README](../../README.md). The content contract is enforced by
`scripts/validate.mjs`, which reads the lesson title and the collection catalog, not
this folder's manifest.
