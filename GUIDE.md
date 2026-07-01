# 🎵 How to Add a Song — Step-by-Step Guide

This player works by **double-clicking index.html** — no server needed.
Cover images are stored as base64 text inside `covers.js` so they always load.

---

## Files you need

| File | What it does |
|------|-------------|
| `index.html` | The page — open this in your browser |
| `style.css` | All visual styles |
| `player.js` | Player logic + **SONGS list** (edit this to add songs) |
| `covers.js` | Cover images as base64 (edit this to add cover art) |
| `song1.mp3` etc | Audio files (keep these in the same folder) |

---

## Adding a song WITH cover art

### Step 1 — Put your .mp3 in the project folder

Copy your audio file into the same folder as `index.html`:

```
music-player/
├── index.html
├── player.js
├── covers.js
├── song1.mp3
├── song2.mp3
├── song3.mp3
└── my-new-song.mp3   ← add here
```

> Use a simple filename with no spaces: `my-song.mp3` not `My Song (2024) final.mp3`

---

### Step 2 — Convert your cover image to base64

Because the player opens as a local file (not a server), we must embed
cover images as base64 text so the browser can load them.

**On Mac / Linux** — open Terminal in the project folder and run:

```bash
python3 -c "
import base64
with open('my-cover.jpg', 'rb') as f:
    print('cover4: \"data:image/jpeg;base64,' + base64.b64encode(f.read()).decode() + '\",')
"
```

**On Windows** — open PowerShell in the project folder and run:

```powershell
$b64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes('my-cover.jpg'))
"cover4: `"data:image/jpeg;base64,$b64`","
```

This prints a long line of text — copy all of it.

---

### Step 3 — Paste the base64 into covers.js

Open `covers.js` in a text editor. It looks like this:

```javascript
const COVERS = {
  cover1: "data:image/jpeg;base64,/9j/4AAQSk...",
  cover2: "data:image/jpeg;base64,/9j/4AAQSk...",
  cover3: "data:image/jpeg;base64,/9j/4AAQSk...",

  // To add a new cover:
  // cover4: "data:image/jpeg;base64,<paste base64 here>",
};
```

Paste your copied line **before** the closing `};`:

```javascript
const COVERS = {
  cover1: "data:image/jpeg;base64,...",
  cover2: "data:image/jpeg;base64,...",
  cover3: "data:image/jpeg;base64,...",
  cover4: "data:image/jpeg;base64,/9j/4AAQSk...",   ← paste here
};
```

Save `covers.js`.

---

### Step 4 — Add the song to player.js

Open `player.js`. Near the top, find the `SONGS` array. Add your song:

```javascript
const SONGS = [
  {
    title:  'Ai Ngờ Em Giờ Chơi Vơi...',
    artist: 'Chu Thúy Quỳnh, HITStory',
    audio:  'song1.mp3',
    cover:  COVERS.cover1,
  },
  {
    title:  'Mong Người Ta Luôn Tốt...',
    artist: 'Lưu Chí Vỹ',
    audio:  'song2.mp3',
    cover:  COVERS.cover2,
  },
  {
    title:  'Nếu Em Không Về',
    artist: 'Beta Music, Thành Đạt & PhongG',
    audio:  'song3.mp3',
    cover:  COVERS.cover3,
  },

  // ← ADD HERE:
  {
    title:  'My New Song',
    artist: 'Artist Name',
    audio:  'my-new-song.mp3',
    cover:  COVERS.cover4,
  },

];
```

Save `player.js`.

---

### Step 5 — Refresh and play ✅

Refresh `index.html` in your browser. Your song appears at the bottom of the playlist.

---

## Adding a song WITHOUT cover art

Much simpler — skip Steps 2 and 3 entirely.

**Step 1** — Put your `.mp3` in the project folder.

**Step 2** — Add to `player.js` with `cover: ''`:

```javascript
{
  title:  'My Song',
  artist: 'My Artist',
  audio:  'my-song.mp3',
  cover:  '',            ← empty = no cover image
},
```

**Step 3** — Save and refresh.

---

## How to remove a song

Delete the entire `{ ... },` block from the `SONGS` array in `player.js`.

---

## How to replace a song

Update the `audio:` and/or other fields in the existing block, drop the new `.mp3`
in the folder, and refresh.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Cover not showing | Make sure you saved `covers.js` after pasting |
| Cover shows broken image | Re-run the base64 command — the output may have been cut off |
| No sound / silence | Check the `audio:` filename matches exactly (case-sensitive on Mac/Linux) |
| Player shows old data | Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac) |
| JS error in console | Every `{ }` block except the last needs a comma `,` after it |

---

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `↑` / `↓` | Volume up / down |
| `Ctrl + →` | Next track |
| `Ctrl + ←` | Previous track |
| `M` | Mute / Unmute |
| `S` | Toggle Shuffle |

---

## Project structure

```
music-player/
├── index.html     ← open this in browser
├── style.css      ← visual design
├── player.js      ← SONGS list + all player logic
├── covers.js      ← cover images as base64
├── GUIDE.md       ← this file
├── README.md
├── song1.mp3
├── song2.mp3
└── song3.mp3
```
