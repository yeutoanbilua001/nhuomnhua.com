# 🎵 How to Add a Song — Step-by-Step

## Why covers.js?

Normally, loading images via JavaScript fails when you open
`index.html` directly from your computer (file:// error).

To fix this, cover images are stored **inside** `covers.js`
as base64 text — so they always load, no server needed.

---

## Adding a song WITH a cover image

### Step 1 — Convert your cover image to base64

Open your terminal in the project folder and run:

**Mac / Linux:**
```bash
python3 -c "
import base64
with open('your-cover.jpg','rb') as f:
    print('cover4: \"data:image/jpeg;base64,' + base64.b64encode(f.read()).decode() + '\",')
"
```

**Windows (PowerShell):**
```powershell
$bytes = [System.IO.File]::ReadAllBytes('your-cover.jpg')
$b64   = [Convert]::ToBase64String($bytes)
Write-Output "cover4: `"data:image/jpeg;base64,$b64`","
```

### Step 2 — Add the result to covers.js

Open `covers.js` and paste the output inside the `COVERS = { }` block:

```javascript
const COVERS = {
  cover1: "data:image/jpeg;base64,/9j/...",
  cover2: "data:image/jpeg;base64,/9j/...",
  cover3: "data:image/jpeg;base64,/9j/...",
  cover4: "data:image/jpeg;base64,/9j/...",   ← paste here
};
```

### Step 3 — Put your .mp3 in the project folder

```
song-player/
├── index.html
├── player.js
├── covers.js
├── song1.mp3
├── song2.mp3
├── song3.mp3
└── my-new-song.mp3    ← add here
```

### Step 4 — Add the song to player.js

Open `player.js`, find the `SONGS` array at the top, add:

```javascript
{
  title:  'My New Song',
  artist: 'Artist Name',
  audio:  'my-new-song.mp3',
  cover:  COVERS.cover4,       ← use the key you added in Step 2
},
```

### Step 5 — Save and refresh

Save both files, refresh `index.html` in your browser. Done ✅

---

## Adding a song WITHOUT a cover image

Even simpler — skip Steps 1 and 2, just:

**Step 1** — Put your `.mp3` in the project folder.

**Step 2** — Add to the `SONGS` array in `player.js`:

```javascript
{
  title:  'My Song',
  artist: 'My Artist',
  audio:  'my-song.mp3',
  cover:  '',             ← empty string = no cover
},
```

---

## Common mistakes

| Problem | Fix |
|---------|-----|
| Cover still not showing | Make sure you saved `covers.js` after pasting |
| Silence / no audio | Check the `audio:` filename exactly matches the `.mp3` in the folder |
| JS error in console | Make sure every `{ }` block in `SONGS` (except the last) ends with a comma `,` |

---

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `↑` / `↓` | Volume up / down |
| `Ctrl + →` | Next track |
| `Ctrl + ←` | Previous track |
| `M` | Mute toggle |
| `S` | Shuffle toggle |
