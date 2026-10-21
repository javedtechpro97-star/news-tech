const $ = s => document.querySelector(s);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Articles ---------- */
const posts = [
  {id:1,cat:'AI',title:'Reasoning Models Are Rewriting How Software Gets Built',ex:'Agents that plan, test, and revise are moving from demos into daily engineering work.',author:'Nova Reyes',time:6,body:[
    'Reasoning models spend extra compute thinking before they answer. For developers, that means fewer one-shot guesses and more verified results.',
    ['code','<span class="k">async function</span> <span class="f">solve</span>(task) {\n  <span class="k">let</span> plan = <span class="k">await</span> model.<span class="f">plan</span>(task);\n  <span class="k">for</span> (<span class="k">const</span> step <span class="k">of</span> plan) <span class="k">await</span> <span class="f">run</span>(step);\n  <span class="k">return</span> <span class="f">verify</span>(task); <span class="c">// tests decide, not vibes</span>\n}'],
    'The teams getting the most from this pattern keep a human review step and let automated tests act as the final judge.']},
  {id:2,cat:'Hardware',title:'Quantum Chips Cross the Error-Correction Threshold',ex:'Logical qubits now outlast the physical ones that make them up. Here is why that matters.',author:'Idris Kade',time:8,body:[
    'Error correction groups many noisy physical qubits into one stable logical qubit. Once adding more qubits reduces errors instead of adding them, scaling becomes an engineering problem.',
    'Expect practical gains first in chemistry and materials simulation, not in breaking encryption.']},
  {id:3,cat:'Security',title:'Passkeys Are Winning. Here Is How to Migrate Your Users',ex:'Phishing-resistant sign-in is finally mainstream. A practical rollout plan for your app.',author:'Mara Voss',time:5,body:[
    'Passkeys replace passwords with a key pair stored on the device. The private key never leaves it, so there is nothing to phish.',
    ['code','<span class="k">const</span> cred = <span class="k">await</span> navigator.credentials.<span class="f">create</span>({\n  publicKey: { challenge, rp: { name: <span class="s">"TechVoid"</span> }, user, pubKeyCredParams }\n});'],
    'Keep password login as a fallback for a few months, then prompt users to add a passkey after each successful sign-in.']},
  {id:4,cat:'Hardware',title:'Hands-On: The Thinnest Laptops of the Year, Tested',ex:'Battery life, thermals, and keyboards compared across this year\'s ultralight flagships.',author:'Jules Park',time:7,body:[
    'Thin no longer means slow. Efficient ARM and low-power x86 chips now hold full performance without loud fans.',
    'Our pick balances an all-day battery with a keyboard that still has real travel.']},
  {id:5,cat:'Software',title:'Rust in the Kernel: Two Years Later',ex:'What memory-safe drivers have actually delivered, and where the friction remains.',author:'Idris Kade',time:9,body:[
    'Rust drivers are shipping in production kernels. Memory-safety bugs in those modules have dropped sharply.',
    ['code','<span class="k">fn</span> <span class="f">read_byte</span>(buf: &amp;[<span class="k">u8</span>], i: <span class="k">usize</span>) -> <span class="k">Option</span>&lt;<span class="k">u8</span>&gt; {\n    buf.<span class="f">get</span>(i).<span class="f">copied</span>() <span class="c">// no out-of-bounds read, ever</span>\n}'],
    'The main friction is tooling and reviewer familiarity, not the language itself.']},
  {id:6,cat:'Security',title:'Supply-Chain Attacks: Auditing Your Dependencies in 30 Minutes',ex:'A fast checklist to find risky packages before they find you.',author:'Mara Voss',time:6,body:[
    'Most compromises arrive through a package you never read. Start with a lockfile audit and pin exact versions.',
    ['code','<span class="c"># list known vulnerabilities</span>\nnpm <span class="f">audit</span> --omit=dev\n<span class="c"># fail CI on high severity</span>\nnpm <span class="f">audit</span> --audit-level=high'],
    'Then remove unused dependencies. The safest package is the one you do not install.']},
  {id:7,cat:'AI',title:'Running Capable Language Models on Your Own Laptop',ex:'Quantization and smarter runtimes put useful local AI within reach of everyday hardware.',author:'Nova Reyes',time:5,body:[
    'Local models keep your data on your machine and work offline. A 4-bit quantized model fits in a few gigabytes of memory.',
    'Pick a model sized for your RAM, then test it on your real tasks before committing.']},
  {id:8,cat:'Software',title:'Why Edge Functions Are Replacing Your Backend',ex:'Run logic a few milliseconds from users. What it fits well and where it breaks.',author:'Jules Park',time:6,body:[
    'Edge runtimes start in milliseconds and scale to zero. They suit auth checks, personalization, and API gateways.',
    ['code','<span class="k">export default</span> {\n  <span class="k">async</span> <span class="f">fetch</span>(req) {\n    <span class="k">return new</span> <span class="f">Response</span>(<span class="s">"Hello from the edge"</span>);\n  }\n};'],
    'Avoid them for long-running jobs or heavy database joins. Keep those in a regional service.']}
];

const grid = $('#grid'), empty = $('#empty');
let cat = 'All', q = '';

function render() {
  const list = posts.filter(p => (cat === 'All' || p.cat === cat) && (p.title + p.ex + p.cat).toLowerCase().includes(q));
  grid.innerHTML = list.map((p, i) => `
    <article class="card" tabindex="0" data-id="${p.id}" style="animation-delay:${i * 60}ms">
      <span class="tag">${p.cat}</span>
      <h3>${p.title}</h3><p>${p.ex}</p>
      <div class="meta"><span>${p.author}</span><span>${p.time} min read</span></div>
    </article>`).join('');
  empty.hidden = list.length > 0;
}
render();

$('#search').addEventListener('input', e => { q = e.target.value.trim().toLowerCase(); render(); });
$('#tabs').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  document.querySelectorAll('#tabs button').forEach(x => x.classList.toggle('active', x === b));
  cat = b.dataset.cat; render();
});

/* ---------- 3D tilt (delegated) ---------- */
grid.addEventListener('mousemove', e => {
  const c = e.target.closest('.card'); if (!c || reduce) return;
  const r = c.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
  c.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateZ(8px)`;
});
grid.addEventListener('mouseout', e => { const c = e.target.closest('.card'); if (c) c.style.transform = ''; });

/* ---------- Reading modal ---------- */
const modal = $('#modal');
function openPost(id) {
  const p = posts.find(x => x.id == id);
  $('#article').innerHTML = `<span class="tag">${p.cat}</span><h2>${p.title}</h2>
    <div class="meta"><span>${p.author}</span><span>${p.time} min read</span></div>` +
    p.body.map(b => Array.isArray(b) ? `<pre><code>${b[1]}</code></pre>` : `<p>${b}</p>`).join('');
  modal.hidden = false; document.body.style.overflow = 'hidden'; $('#close').focus();
}
function closePost() { modal.hidden = true; document.body.style.overflow = ''; }
grid.addEventListener('click', e => { const c = e.target.closest('.card'); if (c) openPost(c.dataset.id); });
grid.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.dataset.id) openPost(e.target.dataset.id); });
$('#close').onclick = closePost;
modal.addEventListener('click', e => { if (e.target === modal) closePost(); });
addEventListener('keydown', e => { if (e.key === 'Escape') closePost(); });

/* ---------- Typing tagline ---------- */
const line = 'Where Technology Meets the Void', typed = $('#typed');
let n = 0;
(function type() {
  typed.textContent = line.slice(0, n++);
  if (n <= line.length) setTimeout(type, reduce ? 0 : 70);
})();

/* ---------- Scroll reveal ---------- */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ---------- Cursor ---------- */
const cur = $('#cursor');
addEventListener('mousemove', e => { cur.style.left = e.clientX + 'px'; cur.style.top = e.clientY + 'px'; });
document.addEventListener('mouseover', e => cur.classList.toggle('big', !!e.target.closest('a,button,.card,input')));

/* ---------- Newsletter ---------- */
$('#news').addEventListener('submit', e => {
  e.preventDefault();
  $('#news .row').hidden = true; $('#ok').hidden = false;
});

/* ---------- Hero canvas: particle grid reacting to mouse ---------- */
const cv = $('#bg'), ctx = cv.getContext('2d');
let W, H, pts = [], mouse = { x: -999, y: -999 };
function size() {
  W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight;
  const count = Math.min(120, Math.floor(W * H / 14000));
  pts = Array.from({ length: count }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4 }));
}
size(); addEventListener('resize', size);
cv.parentElement.addEventListener('mousemove', e => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
cv.parentElement.addEventListener('mouseleave', () => mouse.x = mouse.y = -999);
(function loop() {
  ctx.clearRect(0, 0, W, H);
  for (const p of pts) {
    const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
    if (d < 140) { p.x += dx / d * 1.6; p.y += dy / d * 1.6; }
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;
    ctx.fillStyle = '#5ff3ff'; ctx.shadowColor = '#5ff3ff'; ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.arc(p.x, p.y, 1.8, 0, 6.283); ctx.fill();
  }
  ctx.shadowBlur = 0;
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
    const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
    if (d < 120) { ctx.strokeStyle = `rgba(95,243,255,${.25 * (1 - d / 120)})`; ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke(); }
  }
  if (!reduce) requestAnimationFrame(loop);
})();
