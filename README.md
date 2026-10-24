# Switch Lab

An on-console hardware explorer for the HBLauncher SDK. It shows live touch
contacts, input availability, accelerometer and gyroscope bars, and the right
Joy-Con 2 optical mouse cursor. It can request a read-only NFC scan through the
SDK service.

- **App ID:** `switch-lab` (version 0.5.0, GPU app, ABI 1)
- **SDK capabilities:** `nfc`

## Features

- Live touch contacts (up to 16) on the large left panel.
- Acceleration and gyroscope bars.
- Right Joy-Con 2 optical mouse cursor.
- Read-only NFC scan with tag-present status and UID display.
- W A S D keyboard tiles for testing real USB keyboard events.
- Input availability dots for Pad, Motion, Keys and Mouse.

## On the Switch

- Touch the large left panel with one or more fingers to see contact points.
- Move the console to watch acceleration and gyroscope bars.
- If a right Joy-Con 2 is detached in mouse mode, move it on a surface to move
  the yellow cursor.
- The **Rumble off** control is disabled. A physical pulse worked on this
  Switch, but the in-app service path disconnected the session on both the
  first and repeated taps; it needs a separate host-side fix.
- Tap **Scan NFC** or press **Y** to request a read-only scan.
- The bottom NFC indicator says **idle**, **busy**, **tag detected**, **no tag**,
  or **error**. It uses the service response's tag-present flag; it does not
  authenticate amiibo data or read the tag's stored pages.
- When a tag is detected, its UID appears in hexadecimal below the scan status.
  The UID is tag metadata returned by the NFC service, not stored page content.
- The **Keyboard W A S D** tiles turn yellow while a key is down and stay green
  after a key event has been received. This lets a Flipper BadUSB script test
  actual USB keyboard events through the SDK.
- The Pad/Motion/Keys/Mouse dots show successful SDK reads. A green Keys or Mouse
  dot does not prove an external keyboard or mouse is attached.
- Press **B** or **Minus** to return to HBLauncher.

The app does not store raw NFC data, audio, or sensor traces. The SDK's tested
hardware and limits are documented in `sdk/docs/capabilities.md`.

## Build

This app lives in `apps/switch-lab` of the HBLauncher repository and builds
with the SDK in `sdk/`. It also needs Python 3 with Pillow (for the text atlas
and icon) and the DejaVu Sans font.

From the project root in WSL:

```sh
node apps/switch-lab/build.cjs
```

The build generates `assets/state.bin`, `assets/text.bin`, `assets/icon.png`
and `shaders/text.glsl`, then packages the app via `sdk/build.cjs`.

## Layout

| Path | Purpose |
| --- | --- |
| `app.json` | App manifest (ID, version, assets, shaders, capabilities) |
| `shaders/` | GLSL sources for the vertex, fragment and compute stages |
| `app.*.spv` | Compiled SPIR-V shaders |
| `assets.py` | Generates the text atlas, text offsets and icon |
| `build.cjs` | Build entry point |
| `assets/` | Icon, initial state and text atlas |
