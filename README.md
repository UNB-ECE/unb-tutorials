# UNB IDE tutorials

Course lessons, board guides and the home-page catalog for the UNB IDE.

Content here is delivered to the editor independently of editor releases.
Publishing a lesson, or adding, reordering or removing a card, is a merge in this
repository — not a target change, a submodule pin update or an editor rebuild.

If you are authoring or reviewing a lesson, this file and
`scripts/validate.mjs` are all you need.

## Layout

Two collections, one folder each. Adding a lesson to one never touches the other.

```text
<collection>/
  catalog.md            the cards shown in that home-page row
  projects/<name>.md    one lesson per card
  static/<asset>        card and lesson images
config.json             the collections, and the path they are served from
scripts/validate.mjs    the content contract, executable
```

`config.json` is the only place the collection list and the served path prefix
are written down. `scripts/validate.mjs` is the authoritative statement of the
contract; the sections below explain it in prose, and the script enforces it.

## Authoring a lesson

Create `<collection>/projects/<name>.md`. It starts with a `# Title`, then one
`## Heading` per step. Prose becomes instructions; a fenced `blocks` block
becomes a block snippet. The step-by-step format is MakeCode's:

<https://makecode.com/writing-docs/tutorials>

Draft and preview the lesson in the UNB IDE Tutorial Tool before publishing. The
tool previews only — it does not publish, and it does not validate hardware.

If the lesson needs the UNBdev.board extension, declare the reviewed revision in
a `package` block:

````markdown
```package
unbdev-board=github:UNB-ECE/pxt-unbdev-board#<approved-commit>
```
````

Pin a commit. A branch name such as `main` is not a reviewed revision.

## Adding, reordering or removing a card

Cards live in `<collection>/catalog.md`: a `# Title` heading followed by one
`codecard` block holding a JSON array. The order of the array is the order on
the home page.

````markdown
# UNBDev Board Guide

```codecard
[
  {
    "name": "BLiXel light patterns",
    "description": "Create a safe light pattern with the integrated board.",
    "url": "/unb-tutorials/unbdev-board/projects/blixel",
    "cardType": "tutorial",
    "imageUrl": "/unb-tutorials/unbdev-board/static/blixel.svg",
    "label": "Hardware test pending",
    "labelClass": "orange ribbon"
  }
]
```
````

- `name`, `url` and `cardType` are required; everything else is optional.
- `url` is the path the editor requests, so it begins with
  `<prefix>/<collection>/` from `config.json` and must resolve to
  `projects/<name>.md`. Write it without the `.md`.
- `imageUrl` must resolve to a file under the same collection's `static/`.
- `cardType` must be one the editor supports. `scripts/validate.mjs` lists the
  supported set; a card with any other type is rejected.
- Use `label` and `labelClass` to mark an activity that has not yet passed its
  validation. A card is an offer to students, not evidence that its hardware
  behaviour has been checked.

Do not add a card before its lesson exists — validation rejects it.

## Validation

```sh
node scripts/validate.mjs     # the collections in this repository
node scripts/selftest.mjs     # the validator itself, against its fixtures
```

Both run on every pull request. They check that each catalog parses, that every
card carries the required fields and a supported type, that every `url` and
`imageUrl` resolves to a file in the same collection, and that every lesson has
a title. No dependencies and no install step: the scripts are plain Node.

## Review and publication

1. Branch and open a pull request. The validation workflow must pass.
2. A reviewer checks the lesson against its learning objective and, where the
   activity uses hardware, against its recorded validation status. The reviewer
   is the collection's maintainer, named in that collection's `README.md`.
3. Merge to `main`. The merge is the publication: the served copy updates, and
   the editor shows the change after the refresh window.
4. A lesson that has not been physically validated stays labelled as such. Do
   not remove the label to make a card look ready.

## Rollback

Revert the merge commit and open a pull request with the revert:

```sh
git revert -m 1 <merge-commit>
```

The catalog returns to its previous state on the next fetch. The served copy is
cached, so allow for the refresh window before the revert is visible everywhere.
Prefer a revert to editing history: this repository is the record of what was
published, and when.

## Status

Bootstrapped. The layout, the content contract and the validator are in place.
Both collections contain an instructor-preview lesson. The independent route and
editor integration remain tracked in UNB-ECE/unb-platform #185/#186; until those
land, these catalogs are not the deployed home-page source.
