/* =============================================================
   Music Player — player.js
   =============================================================

   ┌─────────────────────────────────────────────────────────┐
   │  HOW TO ADD A SONG (quick reference)                    │
   │                                                         │
   │  Step 1 → Put your .mp3 in the same folder              │
   │  Step 2 → Add its cover to covers.js (see GUIDE.md)     │
   │  Step 3 → Add one { } block to SONGS below              │
   │                                                         │
   │  Full instructions with screenshots → see GUIDE.md      │
   └─────────────────────────────────────────────────────────┘

   ============================================================= */

'use strict';

/* =============================================================
   ★  SONGS LIST  ★
   ─────────────────
   This is the ONLY part you need to edit to add/remove songs.

   Each song is one object with 4 fields:
   ┌────────┬──────────────────────────────────────────────────┐
   │ title  │ Song name shown in the player                    │
   │ artist │ Artist name shown in the player                  │
   │ audio  │ Filename of the .mp3 (must be in same folder)    │
   │ cover  │ COVERS.cover1 / cover2 / cover3 / etc.           │
   │        │ (defined in covers.js) — or '' for no image      │
   └────────┴──────────────────────────────────────────────────┘
   ============================================================= */

const SONGS = [

  // ── Song 1 ──────────────────────────────────────────────────
  {
    title:  'Ai Ngờ Em Giờ Chơi Vơi (HITStory Live Version)',
    artist: 'Chu Thúy Quỳnh, HITStory',
    audio:  'song1.mp3',
    cover:  COVERS.cover1,      // → cover1 is defined in covers.js
  },

  // ── Song 2 ──────────────────────────────────────────────────
  {
    title:  'Mong Người Ta Luôn Tốt Luôn Yêu Em',
    artist: 'Lưu Chí Vỹ',
    audio:  'song2.mp3',
    cover:  COVERS.cover2,
  },

  // ── Song 3 ──────────────────────────────────────────────────
  {
    title:  'Nếu Em Không Về',
    artist: 'Beta Music, Thành Đạt & PhongG',
    audio:  'song3.mp3',
    cover:  COVERS.cover3,
  },

  // ── ADD YOUR SONGS BELOW THIS LINE ──────────────────────────
  // Follow the pattern above. Don't forget the comma after each }.
  //
  // Example:
  // {
  //   title:  'My New Song',
  //   artist: 'Artist Name',
  //   audio:  'my-song.mp3',
  //   cover:  COVERS.cover4,   // add cover4 to covers.js first
  // },

];

/* =============================================================
   PLAYER ENGINE — no need to edit anything below this line
   ============================================================= */

// ── State ──────────────────────────────────────────────────────
const S = {
  idx:          0,
  playing:      false,
  shuffle:      false,
  repeat:       'none',   // 'none' | 'one' | 'all'
  volume:       0.75,
  dragProgress: false,
  dragVolume:   false,
};

// ── DOM references ─────────────────────────────────────────────
const el = id => document.getElementById(id);

const audio       = el('audio');
const bg          = el('bg');
const artImg      = el('artImg');
const songTitle   = el('songTitle');
const songArtist  = el('songArtist');
const progressBar = el('progressBar');
const progressFill= el('progressFill');
const timeCurrent = el('timeCurrent');
const timeTotal   = el('timeTotal');
const btnPlay     = el('btnPlay');
const btnPrev     = el('btnPrev');
const btnNext     = el('btnNext');
const btnShuffle  = el('btnShuffle');
const btnRepeat   = el('btnRepeat');
const volBar      = el('volBar');
const volFill     = el('volFill');
const playlist    = el('playlist');
const plCount     = el('playlistCount');
const iconPlay    = btnPlay.querySelector('.icon-play');
const iconPause   = btnPlay.querySelector('.icon-pause');


// ── Load a track ───────────────────────────────────────────────
function loadTrack(index) {
  S.idx = index;
  const song = SONGS[index];

  // Set audio source
  audio.src = song.audio;
  audio.load();

  // Update text
  songTitle.textContent  = song.title;
  songArtist.textContent = song.artist;
  document.title = `${song.title} — Music Player`;

  // Crossfade cover image
  // Uses base64 data from covers.js — works on file:// with no server
  artImg.classList.add('fading');
  setTimeout(() => {
    if (song.cover) {
      artImg.src = song.cover;
      bg.style.backgroundImage = `url("${song.cover}")`;
    } else {
      artImg.src = '';
      bg.style.backgroundImage = 'none';
    }
    artImg.classList.remove('fading');
  }, 300);

  // Reset progress bar
  progressFill.style.width = '0%';
  timeCurrent.textContent  = '0:00';
  timeTotal.textContent    = '0:00';

  // Highlight active playlist row
  document.querySelectorAll('.pl-row').forEach((row, i) => {
    row.classList.toggle('active', i === index);
    row.classList.remove('playing');
  });

  // Scroll active row into view
  const activeRow = playlist.querySelector('.pl-row.active');
  if (activeRow) activeRow.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}


// ── Play ────────────────────────────────────────────────────────
function play() {
  audio.play()
    .then(() => {
      S.playing = true;
      iconPlay.hidden  = true;
      iconPause.hidden = false;
      document.body.classList.add('playing');
      const row = playlist.querySelector('.pl-row.active');
      if (row) row.classList.add('playing');
    })
    .catch(err => console.warn('Playback error:', err));
}

// ── Pause ───────────────────────────────────────────────────────
function pause() {
  audio.pause();
  S.playing = false;
  iconPlay.hidden  = false;
  iconPause.hidden = true;
  document.body.classList.remove('playing');
  document.querySelectorAll('.pl-row').forEach(r => r.classList.remove('playing'));
}

// ── Toggle play/pause ───────────────────────────────────────────
function togglePlay() {
  S.playing ? pause() : play();
}

// ── Next track ──────────────────────────────────────────────────
function playNext() {
  const next = S.shuffle
    ? randomOtherIndex()
    : (S.idx + 1) % SONGS.length;
  loadTrack(next);
  play();
}

// ── Previous track ──────────────────────────────────────────────
function playPrev() {
  // If more than 3 s in, restart current track instead of going back
  if (audio.currentTime > 3) { audio.currentTime = 0; return; }
  const prev = S.shuffle
    ? randomOtherIndex()
    : (S.idx - 1 + SONGS.length) % SONGS.length;
  loadTrack(prev);
  play();
}

// ── Random index (used by shuffle) ──────────────────────────────
function randomOtherIndex() {
  if (SONGS.length === 1) return 0;
  let r;
  do { r = Math.floor(Math.random() * SONGS.length); } while (r === S.idx);
  return r;
}

// ── Song ended ──────────────────────────────────────────────────
audio.addEventListener('ended', () => {
  if (S.repeat === 'one') {
    // Repeat the same song
    audio.currentTime = 0;
    play();
  } else if (S.repeat === 'all' || S.shuffle || S.idx < SONGS.length - 1) {
    // Advance to next song
    playNext();
  } else {
    // Last song, no repeat — stop
    pause();
  }
});


// ── Progress bar: update while playing ──────────────────────────
audio.addEventListener('timeupdate', () => {
  if (S.dragProgress || !audio.duration) return;
  const pct = audio.currentTime / audio.duration;
  progressFill.style.width = `${pct * 100}%`;
  timeCurrent.textContent  = fmtTime(audio.currentTime);
});

// ── Progress bar: show total duration once loaded ────────────────
audio.addEventListener('loadedmetadata', () => {
  timeTotal.textContent = fmtTime(audio.duration);
  // Also update the duration shown in the playlist row
  const durEl = playlist.querySelectorAll('.pl-dur')[S.idx];
  if (durEl) durEl.textContent = fmtTime(audio.duration);
});

// ── Progress bar: click/drag to seek ────────────────────────────
function seekTo(e) {
  const rect = progressBar.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  audio.currentTime        = pct * (audio.duration || 0);
  progressFill.style.width = `${pct * 100}%`;
  timeCurrent.textContent  = fmtTime(audio.currentTime);
}

progressBar.addEventListener('mousedown',  e => { S.dragProgress = true; seekTo(e); });
progressBar.addEventListener('touchstart', e => { S.dragProgress = true; seekTo(e); }, { passive: true });
document.addEventListener('mousemove',  e => { if (S.dragProgress) seekTo(e); });
document.addEventListener('touchmove',  e => { if (S.dragProgress) seekTo(e); }, { passive: true });
document.addEventListener('mouseup',   () => { S.dragProgress = false; });
document.addEventListener('touchend',  () => { S.dragProgress = false; });


// ── Volume ──────────────────────────────────────────────────────
function setVolume(v) {
  v = Math.max(0, Math.min(1, v));
  S.volume = v;
  audio.volume = v;
  volFill.style.width = `${v * 100}%`;
}

function volumeTo(e) {
  const rect = volBar.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  setVolume((clientX - rect.left) / rect.width);
}

volBar.addEventListener('mousedown',  e => { S.dragVolume = true; volumeTo(e); });
volBar.addEventListener('touchstart', e => { S.dragVolume = true; volumeTo(e); }, { passive: true });
document.addEventListener('mousemove',  e => { if (S.dragVolume) volumeTo(e); });
document.addEventListener('touchmove',  e => { if (S.dragVolume) volumeTo(e); }, { passive: true });
document.addEventListener('mouseup',   () => { S.dragVolume = false; });
document.addEventListener('touchend',  () => { S.dragVolume = false; });
setVolume(0.75);


// ── Shuffle button ───────────────────────────────────────────────
btnShuffle.addEventListener('click', () => {
  S.shuffle = !S.shuffle;
  btnShuffle.classList.toggle('active', S.shuffle);
  btnShuffle.title = S.shuffle ? 'Shuffle: ON' : 'Shuffle: OFF';
});

// ── Repeat button (cycles: none → one → all → none) ─────────────
btnRepeat.addEventListener('click', () => {
  const next = { none: 'one', one: 'all', all: 'none' };
  S.repeat = next[S.repeat];
  btnRepeat.classList.toggle('active', S.repeat !== 'none');
  btnRepeat.title = `Repeat: ${S.repeat}`;

  // Show '1' badge for repeat-one mode
  let badge = btnRepeat.querySelector('.rpt-badge');
  if (S.repeat === 'one') {
    if (!badge) {
      badge = Object.assign(document.createElement('span'), { className: 'rpt-badge', textContent: '1' });
      Object.assign(badge.style, { position:'absolute', top:'1px', right:'1px', fontSize:'8px', fontWeight:'700', color:'var(--gold)', lineHeight:'1' });
      btnRepeat.style.position = 'relative';
      btnRepeat.appendChild(badge);
    }
  } else {
    badge?.remove();
  }
});

// ── Button click handlers ────────────────────────────────────────
btnPlay.addEventListener('click', togglePlay);
btnPrev.addEventListener('click', playPrev);
btnNext.addEventListener('click', playNext);

// ── Keyboard shortcuts ───────────────────────────────────────────
document.addEventListener('keydown', e => {
  // Don't steal keypresses from input fields
  if (['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName)) return;

  switch (e.code) {
    case 'Space':
      e.preventDefault();
      togglePlay();
      break;
    case 'ArrowRight':
      if (e.ctrlKey || e.metaKey) { e.preventDefault(); playNext(); }
      break;
    case 'ArrowLeft':
      if (e.ctrlKey || e.metaKey) { e.preventDefault(); playPrev(); }
      break;
    case 'ArrowUp':
      e.preventDefault();
      setVolume(S.volume + 0.05);
      break;
    case 'ArrowDown':
      e.preventDefault();
      setVolume(S.volume - 0.05);
      break;
    case 'KeyM':
      audio.muted = !audio.muted;
      break;
    case 'KeyS':
      btnShuffle.click();
      break;
  }
});

// ── Media Session API (OS lock screen / headphone buttons) ───────
function updateMediaSession() {
  if (!('mediaSession' in navigator)) return;
  const song = SONGS[S.idx];
  navigator.mediaSession.metadata = new MediaMetadata({
    title: song.title, artist: song.artist,
  });
  navigator.mediaSession.setActionHandler('play',          play);
  navigator.mediaSession.setActionHandler('pause',         pause);
  navigator.mediaSession.setActionHandler('nexttrack',     playNext);
  navigator.mediaSession.setActionHandler('previoustrack', playPrev);
}

audio.addEventListener('play',  updateMediaSession);
audio.addEventListener('pause', updateMediaSession);


// ── Build the playlist UI ────────────────────────────────────────
function buildPlaylist() {
  playlist.innerHTML = '';
  plCount.textContent = `${SONGS.length} song${SONGS.length !== 1 ? 's' : ''}`;

  SONGS.forEach((song, i) => {
    const li = document.createElement('li');
    li.className = `pl-row${i === S.idx ? ' active' : ''}`;

    li.innerHTML = `
      <span class="pl-num">${String(i + 1).padStart(2, '0')}</span>
      <img  class="pl-thumb" src="${song.cover || ''}" alt="" loading="lazy" />
      <div  class="pl-meta">
        <div class="pl-title">${esc(song.title)}</div>
        <div class="pl-artist">${esc(song.artist)}</div>
      </div>
      <span class="pl-dur">—</span>
      <span class="pl-dot"></span>
    `;

    // Click row → load that song and play it
    // Click active row → toggle play/pause
    li.addEventListener('click', () => {
      if (i === S.idx) { togglePlay(); return; }
      loadTrack(i);
      play();
    });

    playlist.appendChild(li);
  });
}

// ── Helpers ──────────────────────────────────────────────────────
function fmtTime(secs) {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function esc(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Initialise ───────────────────────────────────────────────────
buildPlaylist();
loadTrack(0);
