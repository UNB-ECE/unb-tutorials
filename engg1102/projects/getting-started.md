# ENGG 1102: getting started with UNB IDE

## Welcome @showdialog

Practice building and testing a small micro:bit program in UNB IDE. This is an introductory editor exercise, not a statement of ENGG 1102 syllabus or assessment requirements. You can complete it in the simulator. For an optional download, ask your instructor for a micro:bit or an approved UNBdev.board, a data-capable USB cable and the correct power setup.

The micro:bit display is the 5 × 5 red LED grid. It is separate from the five BLiXel colour lights on UNBdev.board. This lesson does not control the BLiXels, motors or Click boards. Keep conductive objects away from powered hardware and disconnect it if it becomes hot.

## Display a greeting

In **on start**, add **show string** from **Basic** and enter **HELLO**. Select the simulator's restart button if it has stopped. Watch the greeting scroll across the red display. The greeting runs once when the program starts.

```blocks
basic.showString("HELLO")
```

## Add a button response

Add **on button A pressed** from **Input**. Inside it, add **show icon** from **Basic** and choose the heart. Leave your greeting in **on start**. Click and release A in the simulator; a heart should appear after any greeting has finished.

```blocks
basic.showString("HELLO")
input.onButtonPressed(Button.A, function () {
    basic.showIcon(IconNames.Heart)
})
```

## Add a clear button

Add **on button B pressed** and put **clear screen** from **Basic** inside it. Click and release A to show the heart, then B to clear the red display. This clear screen block affects the micro:bit display; it is not the UNBdev.board BLiXel clear command.

```blocks
basic.showString("HELLO")
input.onButtonPressed(Button.A, function () {
    basic.showIcon(IconNames.Heart)
})
input.onButtonPressed(Button.B, function () {
    basic.clearScreen()
})
```

## Check and save your work

Restart the simulator: HELLO should scroll. After the greeting finishes, briefly press and release A to show the heart, then B to clear the display. If the result differs, compare your event handlers with the previous step and check that their blocks are inside the correct event. Name and save your project using the editor's project controls before closing it.

If your instructor asks you to download, use the editor's Download flow and the approved cable/setup. On some older UNBdev.boards, the printed A/B labels are reversed relative to logical A/B; ask your instructor to identify the buttons. Simulator success verifies this exercise's program flow, not physical UNBdev.board compatibility. Record any physical test separately with the board, firmware and program revisions.

## Explain what happened

Tell a partner which code runs on start and which code waits for a button event. Change HELLO to your own short greeting, restart and repeat the A/B check. Ask your instructor for the next course activity; no additional board hardware is needed for this exercise.
