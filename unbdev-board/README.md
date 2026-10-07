# UNBDev Board Guide

Reusable instructor-preview activities for the integrated UNBdev.board.

- Publication reviewer: the UNB-ECE repository maintainer. Physical/student-readiness review remains required under [#140](https://github.com/UNB-ECE/unb-platform/issues/140).
- [BLiXel lesson](projects/blixel.md) and [card image](static/blixel.svg) were copied without content changes from UNB-ECE/pxt-microbit revision `94b7bfe64ae6348f477f42d0a52ab97e8ea77a3b`, paths `docs/projects/unbdev-board/blixel.md` and `docs/static/tutorials/unbdev-blixel.svg`.
- The lesson retains extension revision `9c599beeb48972ae5d9f8108f9af66b320add00b`. Relocated catalog URLs use the reserved `/unb-tutorials` namespace defined by `config.json`; hosting/editor integration is tracked in [#185](https://github.com/UNB-ECE/unb-platform/issues/185) and [#186](https://github.com/UNB-ECE/unb-platform/issues/186).

## Hardware warning

The BLiXel card remains **Hardware test pending** with an orange ribbon. This migration does not certify hardware or resolve [#171](https://github.com/UNB-ECE/unb-platform/issues/171): older boards have reported reversed printed A/B labels, the tested clear operation left the lights lit, and A+B needs a quick press and release. The maintainer reported showing colour black as a successful workaround. The declared TypeScript clear wrapper already sends Clear then Show; the underlying controller Clear command alone does not send Show. The exact tested extension/firmware and root cause still need confirmation.

The copied lesson is an instructor test procedure, not a corrected or physically validated student lesson. Consult the linked issues before testing. No lesson instructions or dependency pins were silently changed during migration.

Use the UNB IDE Tutorial Tool for Markdown preview; simulator/compiler evidence is separate from physical validation. Course-specific explanations and assessment belong in the course collection.
