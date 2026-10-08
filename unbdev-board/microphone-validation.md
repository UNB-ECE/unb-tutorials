# Microphone preview coverage and validation

Governing [unb-platform #141](https://github.com/UNB-ECE/unb-platform/issues/141).
Lesson: [Explore the microphone](projects/microphone.md).
Extension: `c870228e696624519cee1c312c65b229270dfa95`; microphone source blob
`9d792cdb41f8b95b4bdd456ba6e4336db9be440d`. These identify inspected APIs,
not certified board/firmware compatibility. Content revision and actual editor/build/check
results are recorded on #141 and its linked content PR. The validation workflow checks
catalog structure/paths; it does not prove snippets compile or physical behavior.

| Public API | Lesson step | Expected contract / evidence class |
| --- | --- | --- |
| setEnabled | Read a level; Finish with the microphone disabled | Enabled/Disabled command, remembered threshold and baseline; software API inspection. Actual acquisition/stop is externally unverified. |
| updateBaseline | Refresh the baseline quietly | Requests ambient baseline update; no calibration duration or numeric outcome guaranteed. |
| soundLevel | Read a level; Watch changing sound | Controller-reported 16-bit RMS value, not dB; integrated signal is not supplied by simulator. |
| setThreshold | Choose a threshold | 50 initial example, rounded/constrained to 1..65535; acoustic crossing unverified. |
| thresholdReached | Ask whether the threshold was reached | Boolean true only when controller reply equals 1; UI branch and actual acoustic flag are different evidence. |
| clearThresholdFlag | Acknowledge the flag | Explicit acknowledgement; new sound may re-trigger. Separate from auto-clearing event program. |
| onLoudSound | Use an event instead of polling | Wrapper clears at registration and after handler; no simultaneous polling, no one-clap/one-event guarantee. |

All seven functions and both State values are included; none excluded. The polling and
event examples are separate programs. Remove the entire forever loop at the transition;
validate learner navigation does not silently preserve it. Keep each saved version.

## Software publication checks

- Run `node scripts/validate.mjs` and `node scripts/selftest.mjs`.
- Parse lesson steps/packages with the actual target; compile each complete fenced
  snippet with the exact extension pin, and verify block rendering/decompilation.
- Use the deployed UNB IDE Tutorial Tool for candidate preview and verify all steps;
  actual editor navigation/rendering/completion is distinct from compilation.
- After content merge, verify served catalog/lesson/image against the merged revision,
  then open the published card in the deployed editor and finish the tutorial.
- Record checks, revisions, limitations, review and actual delivery on #141. Missing
  evidence is pending; neither a catalog validator nor HTTP200 proves editor completion.

## External board observation checklist (not executed by UNB IDE agents)

An instructor may record board/controller firmware, exact program/lesson/extension/editor
revisions, approved power, threshold and quiet/speech setup. Compare repeated level reads,
quiet baseline refresh, threshold flag, quiet reset versus re-trigger, event response and
terminal disable. Confirm logical A/B on older printed-label revisions. Record expected
and actual results, limitations and defects; no procedure here certifies those results.

Physical testing, PCB design and firmware delivery are outside UNB IDE project scope.
This preview has no physical validation, and its **Hardware unverified** warning stays.
Simulator integrated microphone readings/events are unavailable; observed native display
behavior or compile success does not establish acoustic/controller correctness.
