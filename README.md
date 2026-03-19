# The Last Modder

A browser-based narrative exploration game in a single file.

# Live Site

https://the-last-modder.vercel.app/

## Run

1. Open `index.html` in a modern browser (Chrome, Edge, Firefox).
2. Click or press any key on the title screen to log in.
3. Controls:
   - Move: Arrow keys or WASD
   - Interact/advance dialogue: E (or click)
   - Journal: J
   - Credits screen: C
   - Photo mode: P
   - Screenshot (while in photo mode): O
   - Hotkeys overlay: H
   - Changelog panel: L
   - Performance overlay: I
   - Close panels: Esc

## Notes

- No build tools, no frameworks, no external image assets.
- Game state is saved in LocalStorage.
- Open Settings (`SET`) for volume, dialogue speed, large text mode, CRT overlay, and save-slot switching.
- Settings also include save export/import JSON.
- Settings include optional colorblind-friendly palette mode.
- Settings include accessibility presets (`High Contrast`, `Calm Motion`).
- Stand near environmental objects in each zone and press `E` to inspect them.
- Journal supports filters (`All`, `Visited`, `Secrets`) from the left page header.
- Forum Archive now uses a thread list + post viewer panel.
- Weather mood varies over time per zone, and some NPCs shift position at night.
- For best audio behavior, interact once after page load to initialize Web Audio.
