
/* ---------- Invitation opening flow ---------- */
const opening = document.getElementById('opening');
const heroPanel = document.getElementById('heroPanel');
let opened = false;

function openInvite(){
  if (opened || !opening) return;
  opened = true;
  opening.classList.add('opened');
  setTimeout(()=>{ if(heroPanel) heroPanel.classList.add('is-open'); }, 260);
  setTimeout(()=>{ opening.classList.add('hide'); }, 1100);
  setTimeout(()=>{ if(opening) opening.style.display = 'none'; }, 2100);
  tryPlayMusic();
}
// the card unfolds on its own shortly after the page loads
setTimeout(openInvite, 2400);
// any early tap, key press, or scroll opens it right away instead
['pointerdown','keydown','wheel','touchstart'].forEach(evt=>{
  window.addEventListener(evt, openInvite, { once: true, passive: true });
});

/* ---------- Scroll reveal for below-the-fold imagery ---------- */
const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if (e.isIntersecting) e.target.classList.add('show'); });
}, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* start the ambient music as soon as the second page (Bismillah panel) scrolls into view */
const secondPanel = document.querySelector('.bismillah');
if (secondPanel){
  const musicIO = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if (e.isIntersecting){ tryPlayMusic(); musicIO.disconnect(); }
    });
  }, { threshold: .35 });
  musicIO.observe(secondPanel);
}

/* ---------- Wedding nasheed audio ---------- */
const musicBtn = document.getElementById('musicBtn');
const bgMusic = document.getElementById('bgMusic');
let playing = false;
let fadeTimer = null;

function startMusic(){
  if (playing) return;
  bgMusic.volume = 0;
  const p = bgMusic.play();
  if (p && p.catch) p.catch(()=>{ /* blocked until a real user gesture arrives */ });
  playing = true;
  musicBtn.classList.add('playing');
  let v = 0;
  clearInterval(fadeTimer);
  fadeTimer = setInterval(()=>{
    v = Math.min(0.85, v + 0.04);
    bgMusic.volume = v;
    if (v >= 0.85) clearInterval(fadeTimer);
  }, 90);
}
function stopMusic(){
  if (!playing) return;
  playing = false;
  musicBtn.classList.remove('playing');
  bgMusic.pause();
}
musicBtn.addEventListener('click', () => { playing ? stopMusic() : startMusic(); });
bgMusic.addEventListener('play', () => { playing = true; musicBtn.classList.add('playing'); });
bgMusic.addEventListener('pause', () => { playing = false; musicBtn.classList.remove('playing'); });

// try to start music the instant the card opens; browsers that block silent
// autoplay will simply need the very first tap/click anywhere to kick it off
function tryPlayMusic(){
  startMusic();
}
// attempt right away on page load too (works in browsers/webviews that allow it)
tryPlayMusic();
window.addEventListener('load', tryPlayMusic);
document.addEventListener('DOMContentLoaded', tryPlayMusic);
['pointerdown','keydown','touchstart'].forEach(evt=>{
  window.addEventListener(evt, () => { if(!playing) startMusic(); }, { once: true, passive: true });
});

  