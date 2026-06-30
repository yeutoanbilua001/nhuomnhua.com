/**
 * GRIDPLAY — minimal music player logic
 */
'use strict';

const $ = id => document.getElementById(id);

const audio        = $('audioEl');
const fileInput     = $('fileInput');
const playBtn       = $('playBtn');
const playGlyph     = $('playGlyph');
const prevBtn       = $('prevBtn');
const nextBtn       = $('nextBtn');
const progressWrap  = $('progressWrap');
const progressFill  = $('progressFill');
const timeCurrent   = $('timeCurrent');
const timeTotal     = $('timeTotal');
const volumeWrap    = $('volumeWrap');
const volumeFill    = $('volumeFill');
const trackTitle    = $('trackTitle');
const trackArtist   = $('trackArtist');
const playlistEl    = $('playlist');
const statusTag     = $('statusTag');
const scanline      = document.querySelector('.scanline');
const toast         = $('toast');
const visualizer    = $('visualizer');
const ctx2d         = visualizer.getContext('2d');

/* ── Demo playlist ───────────────────────────────────────────
   Royalty-free algorithmic tracks from SoundHelix, commonly used
   for player demos. Free to use with credit to SoundHelix.
   https://www.soundhelix.com
─────────────────────────────────────────────────────────────── */
const DEMO_TRACKS = [
  { title: 'Song One',   artist: 'SoundHelix', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { title: 'Song Two',   artist: 'SoundHelix', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { title: 'Song Three', artist: 'SoundHelix', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { title: 'Song Four',  artist: 'SoundHelix', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  { title: 'Song Five',  artist: 'SoundHelix', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
];

const state = {
  tracks: [],
  currentIndex: -1,
  isPlaying: false,
  volume: 0.75,
  draggingProgress: false,
  draggingVolume: false,
  audioContext: null,
  analyser: null,
  source: null,
  rafId: null,
};

/* ── Audio context ───────────────────────────────────────── */
function ensureCtx() {
  if (state.audioContext) return;
  state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  state.analyser = state.audioContext.createAnalyser();
  state.analyser.fftSize = 64;
  state.analyser.smoothingTimeConstant = 0.8;
  state.source = state.audioContext.createMediaElementSource(audio);
  state.source.connect(state.analyser);
  state.analyser.connect(state.audioContext.destination);
}

/* ── Tracks ──────────────────────────────────────────────── */
function parseMeta(file) {
  const name = file.name.replace(/\.[^.]+$/, '');
  const match = name.match(/^(.+?)\s*[-–—]\s*(.+)$/);
  return {
    title: match ? match[2].trim() : name,
    artist: match ? match[1].trim() : 'unknown',
    file, url: URL.createObjectURL(file), duration: 0,
  };
}

function addTracks(files) {
  const incoming = Array.from(files).filter(f => f.type.startsWith('audio/'));
  if (!incoming.length) { showToast('NO AUDIO FILES FOUND'); return; }
  incoming.forEach(file => {
    const track = parseMeta(file);
    const probe = new Audio(track.url);
    probe.addEventListener('loadedmetadata', () => {
      track.duration = probe.duration;
      renderPlaylist();
    });
    state.tracks.push(track);
  });
  renderPlaylist();
  if (state.currentIndex === -1) loadTrack(0);
  showToast(`+${incoming.length} TRACK${incoming.length !== 1 ? 'S' : ''} LOADED`);
}

function renderPlaylist() {
  playlistEl.innerHTML = '';
  state.tracks.forEach((t, i) => {
    const li = document.createElement('li');
    li.className = 'playlist-item' + (i === state.currentIndex ? ' active' : '');
    li.innerHTML = `
      <span class="pl-num">${String(i + 1).padStart(2, '0')}</span>
      <span class="pl-name">${escHtml(t.title)}</span>
      <span class="pl-dur">${t.duration ? formatTime(t.duration) : '--:--'}</span>
    `;
    li.addEventListener('click', () => {
      if (i === state.currentIndex) { togglePlay(); }
      else { loadTrack(i); playAudio(); }
    });
    playlistEl.appendChild(li);
  });
}

function loadTrack(index) {
  if (index < 0 || index >= state.tracks.length) return;
  state.currentIndex = index;
  const t = state.tracks[index];
  audio.src = t.url;
  audio.load();
  trackTitle.textContent = t.title.toUpperCase();
  trackArtist.textContent = t.artist;
  document.title = `${t.title} — GRIDPLAY`;
  resetProgress();
  renderPlaylist();
}

/* ── Playback ────────────────────────────────────────────── */
function playAudio() {
  ensureCtx();
  if (state.audioContext.state === 'suspended') state.audioContext.resume();
  audio.play().then(() => {
    state.isPlaying = true;
    updatePlayState();
    runVisualizer();
  }).catch(() => showToast('PLAYBACK BLOCKED'));
}

function pauseAudio() {
  audio.pause();
  state.isPlaying = false;
  updatePlayState();
}

function togglePlay() {
  if (!state.tracks.length) { showToast('ADD A TRACK FIRST'); return; }
  if (state.currentIndex === -1) loadTrack(0);
  state.isPlaying ? pauseAudio() : playAudio();
}

function playNext() {
  if (!state.tracks.length) return;
  loadTrack((state.currentIndex + 1) % state.tracks.length);
  playAudio();
}

function playPrev() {
  if (!state.tracks.length) return;
  if (audio.currentTime > 3) { audio.currentTime = 0; return; }
  loadTrack((state.currentIndex - 1 + state.tracks.length) % state.tracks.length);
  playAudio();
}

function updatePlayState() {
  playGlyph.textContent = state.isPlaying ? '❚❚' : '▶';
  playBtn.setAttribute('aria-label', state.isPlaying ? 'Pause' : 'Play');
  statusTag.textContent = state.isPlaying ? 'PLAYING' : 'IDLE';
  statusTag.classList.toggle('playing', state.isPlaying);
  scanline.classList.toggle('active', state.isPlaying);
  if (!state.isPlaying && state.rafId) {
    cancelAnimationFrame(state.rafId);
    state.rafId = null;
    drawIdle();
  }
}

audio.addEventListener('ended', playNext);

/* ── Progress ────────────────────────────────────────────── */
function resetProgress() {
  progressFill.style.width = '0%';
  timeCurrent.textContent = '00:00';
  timeTotal.textContent = '00:00';
}

audio.addEventListener('timeupdate', () => {
  if (state.draggingProgress || !audio.duration) return;
  progressFill.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
  timeCurrent.textContent = formatTime(audio.currentTime);
});

audio.addEventListener('loadedmetadata', () => {
  timeTotal.textContent = formatTime(audio.duration);
});

function seekFromEvent(e) {
  const rect = progressWrap.querySelector('.progress-track').getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  if (audio.duration) audio.currentTime = pct * audio.duration;
  progressFill.style.width = `${pct * 100}%`;
  timeCurrent.textContent = formatTime(audio.currentTime);
}

progressWrap.addEventListener('mousedown', e => { state.draggingProgress = true; seekFromEvent(e); });
progressWrap.addEventListener('touchstart', e => { state.draggingProgress = true; seekFromEvent(e); }, { passive: true });
document.addEventListener('mousemove', e => { if (state.draggingProgress) seekFromEvent(e); });
document.addEventListener('touchmove', e => { if (state.draggingProgress) seekFromEvent(e); }, { passive: true });
document.addEventListener('mouseup', () => state.draggingProgress = false);
document.addEventListener('touchend', () => state.draggingProgress = false);

progressWrap.addEventListener('keydown', e => {
  if (!audio.duration) return;
  if (e.key === 'ArrowRight') audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
  if (e.key === 'ArrowLeft')  audio.currentTime = Math.max(0, audio.currentTime - 5);
});

/* ── Volume ──────────────────────────────────────────────── */
function setVolume(pct) {
  pct = Math.max(0, Math.min(1, pct));
  state.volume = pct;
  audio.volume = pct;
  volumeFill.style.width = `${pct * 100}%`;
}

function seekVolume(e) {
  const rect = volumeWrap.querySelector('.volume-track').getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  setVolume((clientX - rect.left) / rect.width);
}

volumeWrap.addEventListener('mousedown', e => { state.draggingVolume = true; seekVolume(e); });
volumeWrap.addEventListener('touchstart', e => { state.draggingVolume = true; seekVolume(e); }, { passive: true });
document.addEventListener('mousemove', e => { if (state.draggingVolume) seekVolume(e); });
document.addEventListener('touchmove', e => { if (state.draggingVolume) seekVolume(e); }, { passive: true });
document.addEventListener('mouseup', () => state.draggingVolume = false);
document.addEventListener('touchend', () => state.draggingVolume = false);

setVolume(0.75);

/* ── Buttons ─────────────────────────────────────────────── */
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', playPrev);
nextBtn.addEventListener('click', playNext);
fileInput.addEventListener('change', e => addTracks(e.target.files));

document.addEventListener('dragover', e => e.preventDefault());
document.addEventListener('drop', e => {
  e.preventDefault();
  if (e.dataTransfer.files.length) addTracks(e.dataTransfer.files);
});

document.addEventListener('keydown', e => {
  if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
  if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
  if (e.code === 'ArrowUp')   { e.preventDefault(); setVolume(state.volume + 0.05); }
  if (e.code === 'ArrowDown') { e.preventDefault(); setVolume(state.volume - 0.05); }
});

/* ── Visualizer ──────────────────────────────────────────── */
function resizeViz() {
  visualizer.width = visualizer.offsetWidth * devicePixelRatio;
  visualizer.height = visualizer.offsetHeight * devicePixelRatio;
  ctx2d.scale(devicePixelRatio, devicePixelRatio);
}
setTimeout(resizeViz, 50);
window.addEventListener('resize', resizeViz);

function runVisualizer() {
  if (state.rafId) cancelAnimationFrame(state.rafId);
  draw();
}

function draw() {
  if (!state.analyser) { state.rafId = requestAnimationFrame(draw); return; }
  const data = new Uint8Array(state.analyser.frequencyBinCount);
  state.analyser.getByteFrequencyData(data);

  const W = visualizer.offsetWidth, H = visualizer.offsetHeight;
  ctx2d.clearRect(0, 0, W, H);

  const bars = 32, gap = 3;
  const barW = (W - gap * (bars - 1)) / bars;
  const colors = ['#FF2E63', '#9D4EDD', '#08D9D6'];

  for (let i = 0; i < bars; i++) {
    const pct = data[i] / 255;
    const barH = Math.max(2, pct * H);
    const x = i * (barW + gap);
    ctx2d.fillStyle = colors[i % colors.length];
    ctx2d.fillRect(x, H - barH, barW, barH);
  }
  state.rafId = requestAnimationFrame(draw);
}

function drawIdle() {
  const W = visualizer.offsetWidth, H = visualizer.offsetHeight;
  ctx2d.clearRect(0, 0, W, H);
  const bars = 32, gap = 3;
  const barW = (W - gap * (bars - 1)) / bars;
  for (let i = 0; i < bars; i++) {
    const barH = 2 + Math.sin(i * 0.5) * 2;
    ctx2d.fillStyle = 'rgba(26,26,46,0.15)';
    ctx2d.fillRect(i * (barW + gap), H - barH, barW, barH);
  }
}
drawIdle();

/* ── Helpers ─────────────────────────────────────────────── */
function formatTime(s) {
  if (!s || isNaN(s)) return '00:00';
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

/* ── Load demo playlist on start ─────────────────────────── */
function loadDemoPlaylist() {
  state.tracks = DEMO_TRACKS.map(t => ({ ...t, file: null, duration: 0 }));
  renderPlaylist();
  loadTrack(0);

  // Probe durations in background
  state.tracks.forEach(t => {
    const probe = new Audio();
    probe.preload = 'metadata';
    probe.src = t.url;
    probe.addEventListener('loadedmetadata', () => {
      t.duration = probe.duration;
      renderPlaylist();
    });
  });
}

loadDemoPlaylist();
