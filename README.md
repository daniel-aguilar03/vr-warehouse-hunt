# VR Warehouse Hunt

A **WebXR inventory-search experience** built around locomotion and comfort. Find five exact stock codes among look-alike boxes while exploring a four-zone warehouse.

[Open the live demo](https://daniel-aguilar03.github.io/vr-warehouse-hunt/) · [Watch the walkthrough](https://youtu.be/1yvPVkiLl5o)

[![Warehouse hunt walkthrough](https://img.youtube.com/vi/1yvPVkiLl5o/hqdefault.jpg)](https://youtu.be/1yvPVkiLl5o)

## Highlights

- Four signed regions: Receiving, Tools, Parts and Shipping.
- Five target codes among twenty distractors, with time, mistakes and scoring.
- Switch between smooth travel and controller-aimed teleportation during a hunt.
- Snap/smooth turning, adjustable speed, a movement vignette and teleport fade.
- Seated/standing height calibration and heading reset that preserve progress.
- Comfort preferences saved locally between visits.

## Try it

Open the live HTTPS link in a compatible **Quest browser** and select **Enter VR**. Desktop controls are also available.

| Action | Quest | Desktop |
| --- | --- | --- |
| Smooth travel | Left stick | WASD |
| Teleport | Aim and left trigger | Click floor |
| Turn | Right stick | Q / E or drag background |
| Select nearby stock / settings | Right trigger | Click |
| Open settings | Left X | M |
| Switch travel | In-world menu | L |
| New hunt | In-world menu | R |

Find **AX-104, BX-208, CX-306, DX-412 and EX-510**. Stock selection requires being within 2 metres, so travel is part of the task. Duplicate targets do not count twice.

The score starts at 1000, subtracts 2 per second and 25 per wrong selection, is rounded, and never drops below zero. Time and scoring freeze on completion.

## Comfort controls

- **Teleport:** jump to a valid floor destination during a fade.
- **Smooth travel:** continuous, ground-plane movement relative to headset heading.
- **Snap turning:** 30-degree steps instead of continuous rotation.
- **Vignette / speed:** reduce peripheral motion or choose a gentler pace.
- **Seated / Calibrate Height:** measure the current headset pose once and establish a 1.6 m starting eye height. Natural leaning and crouching continue afterward.
- **Reset View:** face the starting-aisle direction at your current location without changing height or hunt progress.

Sit before enabling Seated; stand before disabling it. Height offsets are recalculated for the current session rather than restoring an old physical measurement.

## Run locally

Requires Node.js 20 or newer.

```sh
npm ci
npm start
npm test
npm run check
npm run build
```

Open [localhost:8080](http://localhost:8080/). Headset access from another device requires HTTPS; use the published Pages link. GitHub Actions tests and publishes the static `dist/` build.

## Implementation

- `src/hunt.js`: targets, distinct selections, timer, scoring and validated preferences.
- `src/main.js`: warehouse, input, locomotion, menu and task feedback.
- `src/view.js`: turning and heading reset around the tracked head.
- `src/height.js`: one-time height calibration from a fresh tracking pose.
- `src/shared/`: self-contained Three.js/WebXR runtime.

Artificial movement rejects walls and shelf bounds. Teleport accounts for the headset's room-scale offset, so the selected point is where the user's head ends up. Preferences use browser local storage; no account or backend is required.

## Validation and limitations

Tests cover distinct collection, frozen completion scores, preference validation, head-pivot turning, view reset and one-shot height calibration. The original experience was recorded on Quest, but the corrected reset/calibration paths and sustained headset performance are not independently certified by these automated tests.

Comfort options do not guarantee freedom from motion sickness. Artificial collision bounds do not stop a user's real body from walking through virtual geometry; the headset's physical boundary still applies. The environment uses a flat floor.

References: [WebXR reference spaces](https://developer.mozilla.org/en-US/docs/Web/API/XRReferenceSpace), [Three.js WebXRManager](https://threejs.org/docs/#api/en/renderers/webxr/WebXRManager).

Created by **Daniel Aguilar**. See [credits and development provenance](CREDITS.md).
