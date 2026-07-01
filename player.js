/* ============================================================
   SÓNG Music Player — player.js
   ============================================================

   HOW TO ADD A SONG — quick reference
   ─────────────────────────────────────
   Step 1. Put your audio file in:  assets/audio/
   Step 2. Put your cover image in: assets/covers/
   Step 3. Add one object to the SONGS array below.
   That's it. The rest of the player updates automatically.

   Full step-by-step guide: see GUIDE.md
   ============================================================ */

'use strict';

/* ============================================================
   ★  SONGS ARRAY — ADD YOUR SONGS HERE  ★

   Each song is one object { } with 4 fields:
     title   – the song name shown on screen
     artist  – the artist name shown on screen
     audio   – path to the .mp3 file (relative to index.html)
     cover   – path to the cover image (relative to index.html)

   To add a new song:
     1. Copy one of the existing { } blocks below
     2. Paste it at the end of the list (before the closing ] )
     3. Add a comma after the previous last entry
     4. Fill in the title, artist, audio path, and cover path
   ============================================================ */
const SONGS = [
  /* ── Song 1 ─────────────────────────────────────────────── */
  {
    title:  'Ai Ngờ Em Giờ Chơi Vơi (HITStory Live Version)',
    artist: 'Chu Thúy Quỳnh, HITStory',
    audio:  'assets/audio/song1.mp3',
    cover:  'assets/covers/cover1.jpg',
  },

  /* ── Song 2 ─────────────────────────────────────────────── */
  {
    title:  'Mong Người Ta Luôn Tốt Luôn Yêu Em',
    artist: 'Lưu Chí Vỹ',
    audio:  'assets/audio/song2.mp3',
    cover:  'assets/covers/cover2.jpg',
  },

  /* ── Song 3 ─────────────────────────────────────────────── */
  {
    title:  'Nếu Em Không Về',
    artist: 'Beta Music, Thành Đạt & PhongG',
    audio:  'assets/audio/song3.mp3',
    cover:  'assets/covers/cover3.jpg',
  },

  /* ── ADD MORE SONGS BELOW THIS LINE ─────────────────────── */
  /*
  {
    title:  'Your Song Title',
    artist: 'Artist Name',
    audio:  'assets/audio/your-file.mp3',
    cover:  'assets/covers/your-cover.jpg',
  },
  */
];

/* ============================================================
   PLAYER STATE
   You do not need to edit anything below this line.
   ============================================================ */
const state = {
  index:           0,
  isPlaying:       false,
  isShuffle:       false,
  repeatMode:      'none',   // 'none' | 'one' | 'all'
  volume:          0.75,
  draggingProgress: false,
  draggingVolume:   false,
};

/* ── DOM refs ─────────────────────────────────────────────── */
const $ = id => document.getElementById(id);

const audio        = $('audioEl');
const coverImg     = $('coverImg');
const bgArt        = $('bgArt');
const trackTitle   = $('trackTitle');
const trackArtist  = $('trackArtist');
const progressBar  = $('progressBar');
const progressFill = $('progressFill');
const timeCurrent  = $('timeCurrent');
const timeTotal    = $('timeTotal');
const playBtn      = $('playBtn');
const prevBtn      = $('prevBtn');
const nextBtn      = $('nextBtn');
const shuffleBtn   = $('shuffleBtn');
const repeatBtn    = $('repeatBtn');
const volumeBar    = $('volumeBar');
const volumeFill   = $('volumeFill');
const playlistEl   = $('playlist');
const playlistCount= $('playlistCount');
const iconPlay     = playBtn.querySelector('.icon-play');
const iconPause    = playBtn.querySelector('.icon-pause');

/* ── Load a track by index ────────────────────────────────── */
function loadTrack(index) {
  state.index = index;
  const song = SONGS[index];

  /* Update audio source */
  audio.src = song.audio;
  audio.load();

  /* Update text */
  trackTitle.textContent  = song.title;
  trackArtist.textContent = song.artist;
  document.title = `${song.title} — SÓNG`;

  /* Crossfade cover image */
  coverImg.classList.add('fade');
  setTimeout(() => {
    coverImg.src = song.cover;
    bgArt.style.backgroundImage = `url('${song.cover}')`;
    coverImg.classList.remove('fade');
  }, 250);

  /* Reset progress */
  progressFill.style.width = '0%';
  timeCurrent.textContent  = '0:00';
  timeTotal.textContent    = '0:00';

  /* Highlight active playlist row */
  document.querySelectorAll('.pl-item').forEach((el, i) => {
    el.classList.toggle('active', i === index);
    el.classList.remove('playing');
  });

  /* Scroll active item into view */
  const active = playlistEl.querySelector('.pl-item.active');
  if (active) active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

/* ── Play / Pause ─────────────────────────────────────────── */
function play() {
  audio.play().then(() => {
    state.isPlaying = true;
    iconPlay.style.display  = 'none';
    iconPause.style.display = '';
    document.body.classList.add('playing');
    /* Mark the active playlist row as "playing" for the dot */
    const active = playlistEl.querySelector('.pl-item.active');
    if (active) active.classList.add('playing');
  }).catch(err => console.warn('Playback blocked:', err));
}

function pause() {
  audio.pause();
  state.isPlaying = false;
  iconPlay.style.display  = '';
  iconPause.style.display = 'none';
  document.body.classList.remove('playing');
  document.querySelectorAll('.pl-item').forEach(el => el.classList.remove('playing'));
}

function togglePlay() {
  if (!SONGS.length) return;
  state.isPlaying ? pause() : play();
}

/* ── Next / Prev ──────────────────────────────────────────── */
function next() {
  let i;
  if (state.isShuffle) {
    i = randomIndexExcluding(state.index);
  } else {
    i = (state.index + 1) % SONGS.length;
  }
  loadTrack(i);
  play();
}

function prev() {
  /* If more than 3 s into the song, restart it instead */
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  let i;
  if (state.isShuffle) {
    i = randomIndexExcluding(state.index);
  } else {
    i = (state.index - 1 + SONGS.length) % SONGS.length;
  }
  loadTrack(i);
  play();
}

function randomIndexExcluding(exclude) {
  if (SONGS.length === 1) return 0;
  let r;
  do { r = Math.floor(Math.random() * SONGS.length); } while (r === exclude);
  return r;
}

/* ── Song ended ───────────────────────────────────────────── */
audio.addEventListener('ended', () => {
  if (state.repeatMode === 'one') {
    audio.currentTime = 0;
    play();
    return;
  }
  if (state.repeatMode === 'all' || state.isShuffle) {
    next();
    return;
  }
  /* If last song and no repeat, stop */
  if (state.index === SONGS.length - 1) {
    pause();
    return;
  }
  next();
});

/* ── Progress ─────────────────────────────────────────────── */
audio.addEventListener('timeupdate', () => {
  if (state.draggingProgress || !audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  progressFill.style.width    = `${pct}%`;
  timeCurrent.textContent     = fmt(audio.currentTime);
});

audio.addEventListener('loadedmetadata', () => {
  timeTotal.textContent = fmt(audio.duration);
  /* Update duration in playlist row */
  const rows = playlistEl.querySelectorAll('.pl-duration');
  if (rows[state.index]) rows[state.index].textContent = fmt(audio.duration);
});

function seekFromPointer(e) {
  const rect = progressBar.getBoundingClientRect();
  const x    = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const pct  = Math.max(0, Math.min(1, x / rect.width));
  audio.currentTime           = pct * (audio.duration || 0);
  progressFill.style.width    = `${pct * 100}%`;
  timeCurrent.textContent     = fmt(audio.currentTime);
}

progressBar.addEventListener('mousedown',  e => { state.draggingProgress = true; seekFromPointer(e); });
progressBar.addEventListener('touchstart', e => { state.draggingProgress = true; seekFromPointer(e); }, { passive: true });
document.addEventListener('mousemove',  e => { if (state.draggingProgress) seekFromPointer(e); });
document.addEventListener('touchmove',  e => { if (state.draggingProgress) seekFromPointer(e); }, { passive: true });
document.addEventListener('mouseup',   () => { state.draggingProgress = false; });
document.addEventListener('touchend',  () => { state.draggingProgress = false; });

/* ── Volume ───────────────────────────────────────────────── */
function setVolume(pct) {
  pct             = Math.max(0, Math.min(1, pct));
  state.volume    = pct;
  audio.volume    = pct;
  volumeFill.style.width = `${pct * 100}%`;
}

function volumeFromPointer(e) {
  const rect = volumeBar.getBoundingClientRect();
  const x    = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  setVolume(x / rect.width);
}

volumeBar.addEventListener('mousedown',  e => { state.draggingVolume = true; volumeFromPointer(e); });
volumeBar.addEventListener('touchstart', e => { state.draggingVolume = true; volumeFromPointer(e); }, { passive: true });
document.addEventListener('mousemove',  e => { if (state.draggingVolume) volumeFromPointer(e); });
document.addEventListener('touchmove',  e => { if (state.draggingVolume) volumeFromPointer(e); }, { passive: true });
document.addEventListener('mouseup',   () => { state.draggingVolume = false; });
document.addEventListener('touchend',  () => { state.draggingVolume = false; });
setVolume(0.75);

/* ── Shuffle ──────────────────────────────────────────────── */
shuffleBtn.addEventListener('click', () => {
  state.isShuffle = !state.isShuffle;
  shuffleBtn.classList.toggle('active', state.isShuffle);
});

/* ── Repeat (cycles: none → one → all → none) ────────────── */
repeatBtn.addEventListener('click', () => {
  const cycle = { none: 'one', one: 'all', all: 'none' };
  state.repeatMode = cycle[state.repeatMode];
  repeatBtn.classList.toggle('active', state.repeatMode !== 'none');

  /* Show '1' badge when repeat-one is active */
  let badge = repeatBtn.querySelector('.repeat-badge');
  if (state.repeatMode === 'one') {
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'repeat-badge';
      Object.assign(badge.style, {
        position: 'absolute', top: '0', right: '0',
        fontSize: '8px', fontWeight: '700',
        color: 'var(--gold)', lineHeight: '1', pointerEvents: 'none',
      });
      repeatBtn.style.position = 'relative';
      repeatBtn.appendChild(badge);
    }
    badge.textContent = '1';
  } else if (badge) {
    badge.remove();
  }
});

/* ── Keyboard shortcuts ───────────────────────────────────── */
document.addEventListener('keydown', e => {
  if (['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName)) return;
  if (e.code === 'Space')      { e.preventDefault(); togglePlay(); }
  if (e.code === 'ArrowUp')    { e.preventDefault(); setVolume(state.volume + 0.05); }
  if (e.code === 'ArrowDown')  { e.preventDefault(); setVolume(state.volume - 0.05); }
  if (e.code === 'ArrowRight' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); next(); }
  if (e.code === 'ArrowLeft'  && (e.ctrlKey || e.metaKey)) { e.preventDefault(); prev(); }
  if (e.code === 'KeyM')       muteToggle();
  if (e.code === 'KeyS')       shuffleBtn.click();
});

function muteToggle() {
  audio.muted = !audio.muted;
}

/* ── Media Session API (lock screen / OS controls) ───────── */
function updateMediaSession() {
  if (!('mediaSession' in navigator)) return;
  const s = SONGS[state.index];
  navigator.mediaSession.metadata = new MediaMetadata({
    title: s.title, artist: s.artist,
    artwork: [{ src: s.cover, sizes: '512x512', type: 'image/jpeg' }],
  });
  navigator.mediaSession.setActionHandler('play',          () => play());
  navigator.mediaSession.setActionHandler('pause',         () => pause());
  navigator.mediaSession.setActionHandler('nexttrack',     () => next());
  navigator.mediaSession.setActionHandler('previoustrack', () => prev());
}
audio.addEventListener('play',  updateMediaSession);
audio.addEventListener('pause', updateMediaSession);

/* ── Button listeners ─────────────────────────────────────── */
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', prev);
nextBtn.addEventListener('click', next);

/* ── Build playlist UI ────────────────────────────────────── */
function buildPlaylist() {
  playlistEl.innerHTML = '';
  playlistCount.textContent = `${SONGS.length} song${SONGS.length !== 1 ? 's' : ''}`;

  SONGS.forEach((song, i) => {
    const li = document.createElement('li');
    li.className = 'pl-item' + (i === state.index ? ' active' : '');
    li.dataset.index = i;
    li.innerHTML = `
      <span class="pl-num">${String(i + 1).padStart(2, '0')}</span>
      <img class="pl-cover" src="${song.cover}" alt="" loading="lazy" />
      <div class="pl-info">
        <div class="pl-title">${escHtml(song.title)}</div>
        <div class="pl-artist">${escHtml(song.artist)}</div>
      </div>
      <span class="pl-duration">—</span>
      <span class="pl-dot"></span>
    `;
    li.addEventListener('click', () => {
      if (i === state.index) { togglePlay(); return; }
      loadTrack(i);
      play();
    });
    playlistEl.appendChild(li);
  });
}

/* ── Helpers ──────────────────────────────────────────────── */
function fmt(secs) {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ── Init ─────────────────────────────────────────────────── */
buildPlaylist();
loadTrack(0);
