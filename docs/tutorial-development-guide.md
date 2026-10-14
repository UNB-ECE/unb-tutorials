# Authoring Course Tutorials for the UNB IDE

This guide provides end-to-end instructions for course instructors, instructional designers, and junior developers creating and publishing interactive tutorials in the UNB IDE.

Every course collection in the UNB IDE repository is structured as a **MakeCode extension**, with tutorials authored as Markdown files within a dedicated `lessons/` folder.

---

## 1. Design the Course Folder Structure (Course as an Extension)

Each course in `unb-tutorials` is structured as a self-contained extension package so that students and instructors can import the entire course into the editor.

### Folder Layout

For a course named `eng1102`, the directory tree must be structured as follows:

```text
eng1102/
├── pxt.json                  # Course extension manifest
├── main.ts                   # Empty authoring program entry point
├── test.ts                   # Course extension test file
├── catalog.md                # Home-page gallery cards registration
├── README.md                 # Course overview and instructor documentation
├── lessons/                  # Directory containing all lesson tutorial Markdown files
│   ├── getting-started.md    # Interactive lesson 1
│   ├── micro-led.md          # Interactive lesson 2
│   └── main.blocks           # Optional default starter workspace
└── static/                   # Card icons and media assets
    └── getting-started.svg   # Lesson card image referenced in catalog.md
```

### Manifest Contract (`pxt.json`)

The `pxt.json` manifest must reside at the root of the course folder. It defines the extension name, target dependencies, and lists all files that comprise the course package:

```json
{
    "name": "eng1102",
    "description": "UNB IDE ENG 1102 course extension and interactive lessons",
    "dependencies": {
        "core": "*",
        "radio": "*",
        "microphone": "*",
        "unbdev-board": "github:UNB-ECE/pxt-unbdev-board#9c599beeb48972ae5d9f8108f9af66b320add00b"
    },
    "files": [
        "README.md",
        "catalog.md",
        "main.ts",
        "lessons/getting-started.md",
        "lessons/micro-led.md"
    ],
    "testFiles": [
        "test.ts"
    ],
    "targetVersions": {
        "target": "9.1.1",
        "targetId": "microbit"
    },
    "supportedTargets": [
        "microbit"
    ],
    "preferredEditor": "tsprj"
}
```

> [!IMPORTANT]
> The starter files (`pxt.json`, `main.ts`, and `test.ts`) must reside at the **root of the course folder**, while all tutorial Markdown files reside under `lessons/`. This ensures the course can be imported both as an authoring project and as a package dependency.

---

## 2. Fork and Branch on GitHub

Authors develop tutorials in a personal fork of `UNB-ECE/unb-tutorials` and submit changes via pull request.

### Worked Example: `Joseph-Xu-Unb/unb-tutorials-fork`

1. Navigate to the canonical repository: [UNB-ECE/unb-tutorials](https://github.com/UNB-ECE/unb-tutorials).
2. Click **Fork** in the top right.
   - Owner: Select your GitHub account (e.g. `Joseph-Xu-Unb`).
   - Repository name: `unb-tutorials-fork` (or keep `unb-tutorials`).
   - Click **Create fork**.
3. Create a topic branch for your course development (e.g., `author-eng1102-lessons`).

### Command Equivalent

```bash
# Fork the repository via GitHub CLI
gh repo fork UNB-ECE/unb-tutorials --fork-name unb-tutorials-fork --clone

# Navigate into your fork
cd unb-tutorials-fork

# Create and checkout your topic branch
git checkout -b author-eng1102-lessons
git push -u origin author-eng1102-lessons
```

---

## 3. Generate a GitHub Developer Token with Required Scopes

To connect the UNB IDE to your GitHub repository and commit changes from within the browser, generate a GitHub Personal Access Token (PAT).

### Required Token Scopes
The token must carry two explicit scopes:
1. **`repo`** (Full control of private repositories and public repositories): Required to read repo trees, create commits, and push branches.
2. **`read:org`** (Read org and team membership): Essential for organizational repositories and fork contribution workflows (as established under Bug #514 / Bug #562).

### Token Creation Steps
1. Navigate directly to the GitHub token creation page:
   [https://github.com/settings/tokens/new?description=UNB-MakeCode&scopes=repo,read:org](https://github.com/settings/tokens/new?description=UNB-MakeCode&scopes=repo,read:org)
2. Ensure both **`repo`** and **`read:org`** checkboxes are checked.
3. Set an expiration period (e.g., 30 or 90 days).
4. Click **Generate token** and copy the resulting string (starts with `ghp_`).

> [!WARNING]
> Never commit your personal access token to Git or include it in screenshots. The UNB IDE stores your token locally in browser storage (`localStorage`).

---

## 4. Connect & Import the Course into UNB IDE

1. Open the UNB IDE in your browser: [https://d200xhrnashxy5.cloudfront.net](https://d200xhrnashxy5.cloudfront.net).
2. On the Home page, click **Import**, then select **Your GitHub Repo...**.
3. When prompted by the **Sign in with GitHub** modal:
   - Paste your developer token into the token field.
   - Click **Sign in**.
4. In the repository picker:
   - Select your fork: `Joseph-Xu-Unb/unb-tutorials-fork`.
   - Select your branch: `author-eng1102-lessons`.
   - Select your course folder: `eng1102` (or `engg1102`).
5. Click **Import**.
6. Switch to the **JavaScript** / Monaco editor and expand the **Explorer** sidebar. Confirm that `pxt.json`, `main.ts`, `test.ts`, `catalog.md`, `README.md`, and the `lessons/` folder are displayed.

---

## 5. Author the Lesson Markdown

Tutorial lessons are written in standard MakeCode tutorial Markdown.

### Markdown Structure
Create your lesson file in `lessons/<lesson-name>.md` (e.g. `lessons/getting-started.md`):

````markdown
# Getting started with UNB IDE

## Introduction @unplugged

Welcome to ENG 1102! In this tutorial, you will write a program that displays a greeting, shows an icon when button A is pressed, and clears the screen when button B is pressed.

## Step 1: Display a greeting

Place a ``||basic:show string||`` block inside the ``||basic:on start||`` block to say hello.

```blocks
basic.showString("Hello UNB!")
```

## Step 2: Button A handler

Add an ``||input:on button A pressed||`` block and place a ``||basic:show icon||`` block inside it to draw a heart.

```blocks
input.onButtonPressed(Button.A, function () {
    basic.showIcon(IconNames.Heart)
})
```

## Step 3: Button B handler

Add an ``||input:on button B pressed||`` block and place a ``||basic:clear screen||`` block inside it.

```blocks
input.onButtonPressed(Button.B, function () {
    basic.clearScreen()
})
```

## Completion

Congratulations! You have completed the first UNB IDE activity. Download your code to the micro:bit or run it in the simulator.
````

### Manifest Registration
Add your new lesson file path to the `files` array in `pxt.json`:

```json
"files": [
    "README.md",
    "catalog.md",
    "main.ts",
    "lessons/getting-started.md"
]
```

---

## 6. Preview and Test the Tutorial

1. In the **Explorer** sidebar, locate `lessons/getting-started.md`.
2. Click the **flask (Preview)** icon beside the file name. The tutorial will launch in a preview modal directly in the IDE.
3. Test each step:
   - Verify that instructions render clearly.
   - Click the lightbulb hint icon on each step to verify hint blocks display properly.
   - Check that block code compiles and runs in the simulator without errors.
4. If you need isolated syntax debugging, return to the Home page and open **Tutorial Tool**, paste your Markdown, and verify the step-by-step preview.

---

## 7. Commit and Save Changes via UNB IDE GitHub View

1. Click the **GitHub** button in the bottom editor toolbar (`#githubArea`).
2. If prompted to sign in (Bug #569 gate), confirm using your developer token.
3. The GitHub dashboard displays changed files under the diff list.
4. Enter a descriptive commit message in the **Commit message** box (e.g., `feat(eng1102): add getting started lesson`).
5. Click **Commit changes**.
   - Notice: Per Bug #563 resolution, the editor keeps you in your active workspace rather than redirecting away.
6. Click **Push changes** (or use the push icon in the header) to push the commit to your fork (`Joseph-Xu-Unb/unb-tutorials-fork`).

### Command Equivalent

```bash
git add eng1102/lessons/getting-started.md eng1102/pxt.json
git commit -m "feat(eng1102): add getting started lesson"
git push origin author-eng1102-lessons
```

---

## 8. Register the Home-Page Card in `catalog.md`

To make your lesson accessible from the UNB IDE home page gallery, register a codecard in `eng1102/catalog.md`.

### Card Specification
Open `eng1102/catalog.md` and add your card object inside the ````codecard JSON array:

```markdown
# ENG 1102

Introductory course lessons and lab activities.

## Activities

```codecard
[
  {
    "name": "Getting started with UNB IDE",
    "description": "Display a greeting, show a heart with button A, and clear the screen with button B.",
    "url": "/unb-tutorials/eng1102/lessons/getting-started",
    "cardType": "tutorial",
    "imageUrl": "/unb-tutorials/eng1102/static/getting-started.svg",
    "label": "Lab 1",
    "labelClass": "blue ribbon"
  }
]
```
```

> [!IMPORTANT]
> The `url` field must begin with `/unb-tutorials/<course>/lessons/<lesson-name>` (without the `.md` extension). Never use `/projects/`.

### Run Local Validator
Before opening a pull request, run the repository validator to ensure all card URLs, categories, and paths resolve cleanly:

```bash
# Run validator against the repository
node scripts/validate.mjs

# Expected output:
# Content OK: 2 collection(s) in /path/to/unb-tutorials
```

---

## 9. Propose Publication via Pull Request

1. In the UNB IDE GitHub dashboard, click the **Contribute** button (Feature #558 fork contribution flow).
2. Alternatively, open GitHub in your browser:
   - Navigate to `https://github.com/Joseph-Xu-Unb/unb-tutorials-fork`.
   - Click **Contribute** -> **Open pull request**.
3. Verify PR targets:
   - **Base repository:** `UNB-ECE/unb-tutorials`, branch: `main`
   - **Head repository:** `Joseph-Xu-Unb/unb-tutorials-fork`, branch: `author-eng1102-lessons`
4. Enter PR Title: `feat(eng1102): add getting-started interactive lesson`.
5. Submit the pull request. All automated checks (`scripts/validate.mjs`) will run in CI.

### Command Equivalent

```bash
gh pr create \
  --repo UNB-ECE/unb-tutorials \
  --base main \
  --head Joseph-Xu-Unb:author-eng1102-lessons \
  --title "feat(eng1102): add getting-started interactive lesson" \
  --body "Adds getting-started tutorial for ENG 1102 under the lessons/ layout."
```

---

## 10. Verify Deployed Home-Page Publication

Once the pull request is reviewed and merged into `UNB-ECE/unb-tutorials:main`:

1. Open the deployed UNB IDE: [https://d200xhrnashxy5.cloudfront.net](https://d200xhrnashxy5.cloudfront.net).
2. Scroll to the **ENG 1102** gallery section.
3. Locate the **Getting started with UNB IDE** card.
4. Click the card:
   - The editor must launch the interactive tutorial directly.
   - It must **not** return a 404 or fall back to the default editor shell (`index.html`).
