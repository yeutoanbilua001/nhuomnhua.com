/**
 * Wavelength — Music Player
 * app.js
 */

'use strict';

/* ── State ────────────────────────────────────────────────── */
const state = {
  tracks: [],
  currentIndex: -1,
  isPlaying: false,
  isShuffle: false,
  repeatMode: 'none', // 'none' | 'all' | 'one'
  volume: 0.75,
  isMuted: false,
  isDraggingProgress: false,
  isDraggingVolume: false,
  shuffleHistory: [],
  audioContext: null,
  analyser: null,
  sourceNode: null,
  rafId: null,
};

/* ── DOM refs ─────────────────────────────────────────────── */
const $ = id => document.getElementById(id);

const audio       = $('audioEl');
const playlist    = $('playlist');
const fileInput   = $('fileInput');
const playBtn     = $('playBtn');
const prevBtn     = $('prevBtn');
const nextBtn     = $('nextBtn');
const shuffleBtn  = $('shuffleBtn');
const repeatBtn   = $('repeatBtn');
const progressWrap= $('progressWrap');
const progressFill= $('progressFill');
const progressThumb=$('progressThumb');
const volumeWrap  = $('volumeWrap');
const volumeFill  = $('volumeFill');
const volumeThumb = $('volumeThumb');
const muteBtn     = $('muteBtn');
const speedSelect = $('speedSelect');
const trackTitle  = $('trackTitle');
const trackArtist = $('trackArtist');
const trackGenre  = $('trackGenre');
const trackBpm    = $('trackBpm');
const albumArt    = $('albumArt');
const artPlaceholder = $('artPlaceholder');
const artGlow     = $('artGlow');
const vinyl       = document.querySelector('.vinyl');
const timeCurrentLabel = $('timeCurrentLabel');
const timeTotalLabel   = $('timeTotalLabel');
const visualizerCanvas = $('visualizer');
const sidebar     = $('sidebar');
const menuBtn     = $('menuBtn');
const sidebarClose= $('sidebarClose');
const favoriteBtn = $('favoriteBtn');
const toast       = $('toast');
const iconPlay    = playBtn.querySelector('.icon-play');
const iconPause   = playBtn.querySelector('.icon-pause');

/* ── Audio context setup ──────────────────────────────────── */
function ensureAudioContext() {
  if (state.audioContext) return;
  state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  state.analyser = state.audioContext.createAnalyser();
  state.analyser.fftSize = 128;
  state.analyser.smoothingTimeConstant = 0.82;
  state.sourceNode = state.audioContext.createMediaElementSource(audio);
  state.sourceNode.connect(state.analyser);
  state.analyser.connect(state.audioContext.destination);
}

/* ── Track management ─────────────────────────────────────── */
function parseMeta(file) {
  const name = file.name.replace(/\.[^.]+$/, '');
  // Try "Artist - Title" pattern
  const match = name.match(/^(.+?)\s*[-–—]\s*(.+)$/);
  return {
    title:  match ? match[2].trim() : name,
    artist: match ? match[1].trim() : 'Unknown Artist',
    file,
    url:    URL.createObjectURL(file),
    duration: 0,
    favorite: false,
  };
}

function addTracks(files) {
  const incoming = Array.from(files).filter(f => f.type.startsWith('audio/'));
  if (!incoming.length) { showToast('No audio files found'); return; }

  let added = 0;
  incoming.forEach(file => {
    const track = parseMeta(file);
    // Probe duration
    const tempAudio = new Audio(track.url);
    tempAudio.addEventListener('loadedmetadata', () => {
      track.duration = tempAudio.duration;
      renderPlaylistItem(state.tracks.indexOf(track));
    });
    state.tracks.push(track);
    added++;
  });

  renderPlaylist();
  if (state.currentIndex === -1) loadTrack(0);
  showToast(`Added ${added} track${added !== 1 ? 's' : ''}`);
}

/* ── Playlist rendering ───────────────────────────────────── */
function renderPlaylist() {
  playlist.innerHTML = '';
  state.tracks.forEach((t, i) => renderPlaylistItem(i));
}

function renderPlaylistItem(i) {
  const existing = playlist.querySelector(`[data-index="${i}"]`);
  const t = state.tracks[i];
  if (!t) return;

  const li = document.createElement('li');
  li.className = 'playlist-item' + (i === state.currentIndex ? ' active' : '');
  li.setAttribute('data-index', i);
  li.setAttribute('role', 'option');
  li.setAttribute('aria-selected', i === state.currentIndex ? 'true' : 'false');
  li.innerHTML = `
    <span class="playlist-num">${String(i + 1).padStart(2, '0')}</span>
    <div class="playlist-info">
      <span class="playlist-name" title="${escHtml(t.title)}">${escHtml(t.title)}</span>
    </div>
    <span class="playlist-duration">${t.duration ? formatTime(t.duration) : '—'}</span>
    <span class="playlist-playing-dot" aria-hidden="true"></span>
  `;
  li.addEventListener('click', () => {
    if (i === state.currentIndex) {
      togglePlay();
    } else {
      loadTrack(i);
      playAudio();
    }
  });

  if (existing) {
    playlist.replaceChild(li, existing);
  } else {
    playlist.appendChild(li);
  }
}

function updatePlaylistActive() {
  playlist.querySelectorAll('.playlist-item').forEach((el, i) => {
    const isActive = i === state.currentIndex;
    el.classList.toggle('active', isActive);
    el.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
}

/* ── Load & play ──────────────────────────────────────────── */
function loadTrack(index) {
  if (index < 0 || index >= state.tracks.length) return;
  state.currentIndex = index;
  const track = state.tracks[index];

  audio.src = track.url;
  audio.load();

  trackTitle.textContent  = track.title;
  trackArtist.textContent = track.artist;
  trackGenre.textContent  = '—';
  trackBpm.textContent    = '— BPM';

  updatePlaylistActive();
  scrollPlaylistToActive();
  updateFavoriteBtn();
  resetProgress();

  // Update page title
  document.title = `${track.title} — Wavelength`;
}

function playAudio() {
  ensureAudioContext();
  if (state.audioContext.state === 'suspended') state.audioContext.resume();

  audio.play().then(() => {
    state.isPlaying = true;
    updatePlayState();
    startVisualizer();
  }).catch(err => {
    console.warn('Play failed:', err);
    showToast('Playback blocked — click play');
  });
}

function pauseAudio() {
  audio.pause();
  state.isPlaying = false;
  updatePlayState();
}

function togglePlay() {
  if (state.tracks.length === 0) { showToast('Add tracks first ↑'); return; }
  if (state.currentIndex === -1) { loadTrack(0); }
  state.isPlaying ? pauseAudio() : playAudio();
}

function playNext() {
  if (!state.tracks.length) return;
  let next;
  if (state.isShuffle) {
    next = getShuffleNext();
  } else {
    next = (state.currentIndex + 1) % state.tracks.length;
  }
  loadTrack(next);
  playAudio();
}

function playPrev() {
  if (!state.tracks.length) return;
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  const prev = state.isShuffle
    ? state.shuffleHistory.pop() || 0
    : (state.currentIndex - 1 + state.tracks.length) % state.tracks.length;
  loadTrack(prev);
  playAudio();
}

function getShuffleNext() {
  if (state.tracks.length === 1) return 0;
  let next;
  do { next = Math.floor(Math.random() * state.tracks.length); }
  while (next === state.currentIndex);
  state.shuffleHistory.push(state.currentIndex);
  return next;
}

/* ── Play state UI ────────────────────────────────────────── */
function updatePlayState() {
  iconPlay.hidden  =  state.isPlaying;
  iconPause.hidden = !state.isPlaying;
  playBtn.setAttribute('aria-label', state.isPlaying ? 'Pause' : 'Play');

  if (vinyl) vinyl.classList.toggle('spinning', state.isPlaying);
  artGlow.classList.toggle('active', state.isPlaying);

  if (!state.isPlaying && state.rafId) {
    cancelAnimationFrame(state.rafId);
    state.rafId = null;
    drawIdleVisualizer();
  }
}

/* ── Progress ─────────────────────────────────────────────── */
function resetProgress() {
  setProgress(0);
  timeCurrentLabel.textContent = '0:00';
  timeTotalLabel.textContent   = '0:00';
}

function setProgress(pct) {
  pct = Math.max(0, Math.min(100, pct));
  progressFill.style.width = `${pct}%`;
  progressThumb.style.left = `${pct}%`;
  progressWrap.setAttribute('aria-valuenow', Math.round(pct));
}

audio.addEventListener('timeupdate', () => {
  if (state.isDraggingProgress || !audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  setProgress(pct);
  timeCurrentLabel.textContent = formatTime(audio.currentTime);
});

audio.addEventListener('loadedmetadata', () => {
  timeTotalLabel.textContent = formatTime(audio.duration);
  // Update playlist duration
  const track = state.tracks[state.currentIndex];
  if (track) {
    track.duration = audio.duration;
    renderPlaylistItem(state.currentIndex);
  }
});

audio.addEventListener('ended', () => {
  if (state.repeatMode === 'one') {
    audio.currentTime = 0;
    playAudio();
  } else if (state.repeatMode === 'all' || state.currentIndex < state.tracks.length - 1 || state.isShuffle) {
    playNext();
  } else {
    state.isPlaying = false;
    updatePlayState();
  }
});

/* Progress seek */
function seekFromEvent(e, el) {
  const rect = el.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  if (audio.duration) audio.currentTime = pct * audio.duration;
  setProgress(pct * 100);
  timeCurrentLabel.textContent = formatTime(audio.currentTime);
}

progressWrap.addEventListener('mousedown', e => {
  state.isDraggingProgress = true;
  seekFromEvent(e, progressWrap.querySelector('.progress-track'));
});
progressWrap.addEventListener('touchstart', e => {
  state.isDraggingProgress = true;
  seekFromEvent(e, progressWrap.querySelector('.progress-track'));
}, { passive: true });

document.addEventListener('mousemove', e => {
  if (!state.isDraggingProgress) return;
  seekFromEvent(e, progressWrap.querySelector('.progress-track'));
});
document.addEventListener('touchmove', e => {
  if (!state.isDraggingProgress) return;
  seekFromEvent(e, progressWrap.querySelector('.progress-track'));
}, { passive: true });

document.addEventListener('mouseup', () => { state.isDraggingProgress = false; });
document.addEventListener('touchend', () => { state.isDraggingProgress = false; });

progressWrap.addEventListener('keydown', e => {
  if (!audio.duration) return;
  const step = e.shiftKey ? 10 : 5;
  if (e.key === 'ArrowRight') audio.currentTime = Math.min(audio.duration, audio.currentTime + step);
  if (e.key === 'ArrowLeft')  audio.currentTime = Math.max(0, audio.currentTime - step);
});

/* ── Volume ───────────────────────────────────────────────── */
function setVolume(pct) {
  pct = Math.max(0, Math.min(1, pct));
  state.volume = pct;
  audio.volume = state.isMuted ? 0 : pct;
  volumeFill.style.width  = `${pct * 100}%`;
  volumeThumb.style.left  = `${pct * 100}%`;
}

function seekVolumeFromEvent(e) {
  const rect = volumeWrap.querySelector('.volume-track').getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  state.isMuted = false;
  setVolume(pct);
}

volumeWrap.addEventListener('mousedown', e => { state.isDraggingVolume = true; seekVolumeFromEvent(e); });
volumeWrap.addEventListener('touchstart', e => { state.isDraggingVolume = true; seekVolumeFromEvent(e); }, { passive: true });
document.addEventListener('mousemove', e => { if (state.isDraggingVolume) seekVolumeFromEvent(e); });
document.addEventListener('touchmove', e => { if (state.isDraggingVolume) seekVolumeFromEvent(e); }, { passive: true });
document.addEventListener('mouseup',  () => { state.isDraggingVolume = false; });
document.addEventListener('touchend', () => { state.isDraggingVolume = false; });

muteBtn.addEventListener('click', () => {
  state.isMuted = !state.isMuted;
  audio.volume = state.isMuted ? 0 : state.volume;
  muteBtn.classList.toggle('active', state.isMuted);
  showToast(state.isMuted ? 'Muted' : 'Unmuted');
});

setVolume(0.75);

/* ── Shuffle & Repeat ─────────────────────────────────────── */
shuffleBtn.addEventListener('click', () => {
  state.isShuffle = !state.isShuffle;
  shuffleBtn.classList.toggle('active', state.isShuffle);
  state.shuffleHistory = [];
  showToast(state.isShuffle ? 'Shuffle on' : 'Shuffle off');
});

repeatBtn.addEventListener('click', () => {
  const modes = ['none', 'all', 'one'];
  const labels = { none: 'Repeat off', all: 'Repeat all', one: 'Repeat one' };
  const next = modes[(modes.indexOf(state.repeatMode) + 1) % modes.length];
  state.repeatMode = next;
  repeatBtn.classList.toggle('active', next !== 'none');

  // Visually indicate repeat-one with a small badge
  const badge = repeatBtn.querySelector('.repeat-badge');
  if (badge) badge.remove();
  if (next === 'one') {
    const b = document.createElement('span');
    b.className = 'repeat-badge';
    b.textContent = '1';
    Object.assign(b.style, {
      position: 'absolute', top: '2px', right: '2px',
      fontSize: '9px', fontWeight: '700',
      color: 'var(--accent)', lineHeight: '1',
    });
    repeatBtn.style.position = 'relative';
    repeatBtn.appendChild(b);
  }
  showToast(labels[next]);
});

/* ── Speed ────────────────────────────────────────────────── */
speedSelect.addEventListener('change', () => {
  audio.playbackRate = parseFloat(speedSelect.value);
});

/* ── Playback controls ────────────────────────────────────── */
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', playPrev);
nextBtn.addEventListener('click', playNext);

/* ── File input ───────────────────────────────────────────── */
fileInput.addEventListener('change', e => addTracks(e.target.files));

/* Drag-and-drop on the whole app */
document.addEventListener('dragover', e => e.preventDefault());
document.addEventListener('drop', e => {
  e.preventDefault();
  if (e.dataTransfer.files.length) addTracks(e.dataTransfer.files);
});

/* ── Sidebar toggle ───────────────────────────────────────── */
menuBtn.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  sidebar.classList.toggle('hidden');
});

sidebarClose.addEventListener('click', () => {
  sidebar.classList.remove('open');
  sidebar.classList.add('hidden');
});

/* Responsive sidebar init */
function initSidebar() {
  if (window.innerWidth <= 900) {
    sidebar.classList.add('hidden');
    sidebar.classList.remove('open');
  } else {
    sidebar.classList.remove('hidden', 'open');
  }
}
initSidebar();
window.addEventListener('resize', initSidebar);

/* ── Favorite ─────────────────────────────────────────────── */
favoriteBtn.addEventListener('click', () => {
  if (state.currentIndex < 0) return;
  const track = state.tracks[state.currentIndex];
  track.favorite = !track.favorite;
  updateFavoriteBtn();
  showToast(track.favorite ? '♥ Added to favorites' : '♡ Removed from favorites');
});

function updateFavoriteBtn() {
  const track = state.tracks[state.currentIndex];
  const isFav = track && track.favorite;
  favoriteBtn.classList.toggle('active', isFav);
  favoriteBtn.querySelector('path').setAttribute('fill', isFav ? 'currentColor' : 'none');
}

/* ── Keyboard shortcuts ───────────────────────────────────── */
document.addEventListener('keydown', e => {
  const tag = e.target.tagName;
  if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;

  switch (e.code) {
    case 'Space':
      e.preventDefault();
      togglePlay();
      break;
    case 'ArrowRight':
      if (e.ctrlKey || e.metaKey) { playNext(); e.preventDefault(); }
      break;
    case 'ArrowLeft':
      if (e.ctrlKey || e.metaKey) { playPrev(); e.preventDefault(); }
      break;
    case 'ArrowUp':
      e.preventDefault();
      setVolume(state.volume + 0.05);
      break;
    case 'ArrowDown':
      e.preventDefault();
      setVolume(state.volume - 0.05);
      break;
    case 'KeyM':
      muteBtn.click();
      break;
    case 'KeyS':
      shuffleBtn.click();
      break;
  }
});

/* ── Visualizer ───────────────────────────────────────────── */
const ctx2d = visualizerCanvas.getContext('2d');

function resizeVisualizer() {
  visualizerCanvas.width = visualizerCanvas.offsetWidth * devicePixelRatio;
  visualizerCanvas.height = visualizerCanvas.offsetHeight * devicePixelRatio;
  ctx2d.scale(devicePixelRatio, devicePixelRatio);
}

window.addEventListener('resize', resizeVisualizer);
setTimeout(resizeVisualizer, 100);

function drawVisualizer() {
  if (!state.analyser) { state.rafId = requestAnimationFrame(drawVisualizer); return; }

  const bufferLength = state.analyser.frequencyBinCount;
  const data = new Uint8Array(bufferLength);
  state.analyser.getByteFrequencyData(data);

  const W = visualizerCanvas.offsetWidth;
  const H = visualizerCanvas.offsetHeight;
  ctx2d.clearRect(0, 0, W, H);

  const bars = Math.min(bufferLength, 60);
  const gap = 3;
  const barW = (W - gap * (bars - 1)) / bars;

  for (let i = 0; i < bars; i++) {
    const pct = data[i] / 255;
    const barH = Math.max(3, pct * H * 0.92);
    const x = i * (barW + gap);
    const y = H - barH;

    // Gradient per bar
    const grad = ctx2d.createLinearGradient(0, y, 0, H);
    grad.addColorStop(0,   `rgba(168, 159, 255, ${0.9 * pct + 0.1})`);
    grad.addColorStop(0.5, `rgba(108,  99, 255, ${0.85})`);
    grad.addColorStop(1,   `rgba(108,  99, 255, 0.3)`);

    ctx2d.fillStyle = grad;
    ctx2d.beginPath();
    ctx2d.roundRect
      ? ctx2d.roundRect(x, y, barW, barH, 2)
      : ctx2d.rect(x, y, barW, barH);
    ctx2d.fill();
  }

  state.rafId = requestAnimationFrame(drawVisualizer);
}

function drawIdleVisualizer() {
  const W = visualizerCanvas.offsetWidth;
  const H = visualizerCanvas.offsetHeight;
  ctx2d.clearRect(0, 0, W, H);

  const bars = 60;
  const gap = 3;
  const barW = (W - gap * (bars - 1)) / bars;

  for (let i = 0; i < bars; i++) {
    const barH = 3 + Math.sin(i * 0.4) * 4;
    const x = i * (barW + gap);
    const y = H - barH;
    ctx2d.fillStyle = 'rgba(74, 77, 106, 0.6)';
    ctx2d.beginPath();
    ctx2d.roundRect
      ? ctx2d.roundRect(x, y, barW, barH, 2)
      : ctx2d.rect(x, y, barW, barH);
    ctx2d.fill();
  }
}

function startVisualizer() {
  if (state.rafId) cancelAnimationFrame(state.rafId);
  drawVisualizer();
}

drawIdleVisualizer();

/* ── Media Session API ────────────────────────────────────── */
function updateMediaSession() {
  if (!('mediaSession' in navigator)) return;
  const track = state.tracks[state.currentIndex];
  if (!track) return;

  navigator.mediaSession.metadata = new MediaMetadata({
    title:  track.title,
    artist: track.artist,
    album:  'Wavelength Player',
  });

  navigator.mediaSession.setActionHandler('play',          () => { playAudio(); });
  navigator.mediaSession.setActionHandler('pause',         () => { pauseAudio(); });
  navigator.mediaSession.setActionHandler('nexttrack',     () => { playNext(); });
  navigator.mediaSession.setActionHandler('previoustrack', () => { playPrev(); });
}

audio.addEventListener('play',  updateMediaSession);
audio.addEventListener('pause', updateMediaSession);

/* ── Helpers ──────────────────────────────────────────────── */
function formatTime(secs) {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

let toastTimer = null;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

function scrollPlaylistToActive() {
  const active = playlist.querySelector('.playlist-item.active');
  if (active) active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

/* ── Demo tracks (no files needed to see the UI) ─────────── */
const DEMO = [
  { title: 'Midnight Drive',   artist: 'Synthwave Co.',   duration: 214 },
  { title: 'Urban Echo',       artist: 'City Beats',       duration: 187 },
  { title: 'Neon Horizon',     artist: 'Future Pulse',     duration: 253 },
  { title: 'Deep Blue',        artist: 'Ambient Lab',      duration: 302 },
  { title: 'Ghost Signal',     artist: 'Electric Dreams',  duration: 176 },
];

function loadDemoPlaylist() {
  state.tracks = DEMO.map(d => ({ ...d, url: '', file: null, favorite: false }));
  renderPlaylist();
  // Show first track info without actually playing
  trackTitle.textContent  = DEMO[0].title;
  trackArtist.textContent = DEMO[0].artist;
  trackGenre.textContent  = 'Electronic';
  trackBpm.textContent    = '128 BPM';
  timeTotalLabel.textContent = formatTime(DEMO[0].duration);
  document.title = `${DEMO[0].title} — Wavelength`;
  state.currentIndex = 0;
  updatePlaylistActive();
}

loadDemoPlaylist();

/* Override loadTrack to gracefully handle demo entries */
const _origLoadTrack = loadTrack;
window.loadTrack = function(index) {
  const track = state.tracks[index];
  if (!track || !track.url) {
    // Demo track — just update display
    state.currentIndex = index;
    trackTitle.textContent  = track.title;
    trackArtist.textContent = track.artist;
    trackGenre.textContent  = 'Electronic';
    trackBpm.textContent    = '128 BPM';
    timeTotalLabel.textContent = formatTime(track.duration);
    updatePlaylistActive();
    updateFavoriteBtn();
    resetProgress();
    document.title = `${track.title} — Wavelength`;
    return;
  }
  _origLoadTrack(index);
};

// Patch all loadTrack calls to go through window.loadTrack
prevBtn.removeEventListener('click', playPrev);
nextBtn.removeEventListener('click', playNext);

function playNext2() {
  if (!state.tracks.length) return;
  const next = state.isShuffle ? getShuffleNext() : (state.currentIndex + 1) % state.tracks.length;
  window.loadTrack(next);
  if (state.tracks[next] && state.tracks[next].url) playAudio();
}

function playPrev2() {
  if (!state.tracks.length) return;
  if (audio.currentTime > 3) { audio.currentTime = 0; return; }
  const prev = state.isShuffle
    ? (state.shuffleHistory.pop() ?? 0)
    : (state.currentIndex - 1 + state.tracks.length) % state.tracks.length;
  window.loadTrack(prev);
  if (state.tracks[prev] && state.tracks[prev].url) playAudio();
}

prevBtn.addEventListener('click', playPrev2);
nextBtn.addEventListener('click', playNext2);

// Playlist item clicks use window.loadTrack already via closure; re-render to fix
renderPlaylist();
