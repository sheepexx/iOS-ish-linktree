// Portfolio Data Configuration
const stacks = [
{
title: '993 GT2 Evo',
photos: [
'assets/photos/rd_1.jpg',
'assets/photos/rd_2.jpg',
'assets/photos/rd_3.jpg',
'assets/photos/rd_4.jpg',
'assets/photos/rd_5.jpg',
'assets/photos/rd_6.jpg',
]
},
{
title: 'Goodwood FoS 2025',
photos: [
'assets/photos/cn_1.jpg',
'assets/photos/cn_2.jpg',
'assets/photos/cn_3.jpg',
'assets/photos/cn_4.jpg',
'assets/photos/cn_5.jpg',
'assets/photos/cn_6.jpg',
]
},
{
title: 'Porsches on the Hill',
photos: [
'assets/photos/st_1.jpg',
'assets/photos/st_2.jpg',
'assets/photos/st_3.jpg',
'assets/photos/st_4.jpg'
]
}
];

// DOM Elements
const grid = document.getElementById('grid');
const ov = document.getElementById('ov');
const stage = document.getElementById('stage');
const ovTitle = document.getElementById('ovTitle');
const ovClose = document.getElementById('ovClose');
const pulse = document.getElementById('pulse');
const aurora = document.querySelector('.aurora');
const vector = document.querySelector('.vector');
const mode = document.getElementById('mode');

// Generate Stack Cards
stacks.forEach((s, index) => {
const el = document.createElement('article');
el.className = 'stack glass reveal';
el.style.animation = `fadeUp .8s ease ${.5 + index * .1}s both`;
el.innerHTML = `
<div class="stackHead">
<strong>${s.title}</strong>
<span>${s.photos.length} Bilder</span>
</div>
<div class="preview">
${s.photos.slice(0, 4).map((src, i) =>
`<div class="pItem" style="--r:${[-12, -4, 6, 14][i]}deg">
<img src="${src}" alt="" loading="lazy">
</div>`
).join('')}
</div>
`;

// Add click event to open stack
el.addEventListener('click', () => openStack(s));
grid.appendChild(el);
});

// Enhanced Layout Algorithm for Distributing Photos with better spacing
function layout(container, count, ratio = 3208/4277, pad = 24) {
const W = container.clientWidth;
const H = container.clientHeight;

// Calculate optimal grid dimensions
let cols = Math.ceil(Math.sqrt(count * 1.3));
let rows = Math.ceil(count / cols);

// Adjust for better fit
while (cols * rows < count) {
if (cols <= rows) cols++;
else rows++;
}

// Calculate tile dimensions with better spacing
let tileH = Math.min(
(H - pad * (rows + 1)) / rows,
((W - pad * (cols + 1)) / cols) / ratio
);
let tileW = tileH * ratio;

// Ensure reasonable minimum sizes
const minSize = Math.min(W, H) * 0.15;
tileH = Math.max(tileH, minSize);
tileW = Math.max(tileW, tileH * ratio);

// Recalculate if tiles are too big
if (tileW * cols + pad * (cols + 1) > W) {
tileW = (W - pad * (cols + 1)) / cols;
tileH = tileW / ratio;
}
if (tileH * rows + pad * (rows + 1) > H) {
tileH = (H - pad * (rows + 1)) / rows;
tileW = tileH * ratio;
}

// Center the grid
const totalW = cols * tileW + (cols - 1) * pad;
const totalH = rows * tileH + (rows - 1) * pad;
const offsetX = (W - totalW) / 2;
const offsetY = (H - totalH) / 2;

// Generate positions with improved distribution
const pos = [];
for (let i = 0; i < count; i++) {
const r = Math.floor(i / cols);
const c = i % cols;

// Add subtle randomization while maintaining grid structure
const randomX = (Math.random() * 16 - 8);
const randomY = (Math.random() * 16 - 8);

const x = offsetX + c * (tileW + pad) + randomX;
const y = offsetY + r * (tileH + pad) + randomY;

// Ensure tiles stay within bounds with margin
const margin = 10;
const finalX = Math.max(margin, Math.min(x, W - tileW - margin));
const finalY = Math.max(margin, Math.min(y, H - tileH - margin));

pos.push({ 
x: finalX, 
y: finalY, 
w: Math.floor(tileW), 
h: Math.floor(tileH) 
});
}

return pos;
}

// Animation State Management
let busy = false;

// Enhanced Open Stack Overlay
function openStack(data) {
if (busy) return;
busy = true;
setTimeout(() => busy = false, 1200);

// Set overlay title
ovTitle.textContent = `${data.title} – ${data.photos.length} Bilder`;

// Clear previous content
stage.innerHTML = '';

// Calculate center position
const cx = stage.clientWidth / 2;
const cy = stage.clientHeight / 2;

// Create tile elements with enhanced styling
data.photos.forEach((src, index) => {
const t = document.createElement('div');
t.className = 'tile';
t.innerHTML = `<img src="${src}" alt="" loading="lazy">`;
t.style.transform = `translate(${cx}px, ${cy}px) rotate(${Math.random() * 60 - 30}deg) scale(.8)`;
t.style.opacity = '0';
stage.appendChild(t);
});

// Show overlay with smooth transition
ov.classList.add('show');

// Enhanced tile distribution animation
requestAnimationFrame(() => {
const targets = layout(stage, data.photos.length);
[...stage.children].forEach((el, i) => {
const { x, y, w, h } = targets[i];
const rot = (Math.random() * 8 - 4).toFixed(2) + 'deg';

// Set tile dimensions and CSS custom properties
el.style.width = w + 'px';
el.style.height = h + 'px';
el.style.setProperty('--x', x + 'px');
el.style.setProperty('--y', y + 'px');
el.style.setProperty('--rot', rot);

// Enhanced animation with spring effect
el.animate([
{ 
transform: `translate(${cx}px, ${cy}px) rotate(0deg) scale(.8)`,
opacity: '0'
},
{
transform: `translate(${x}px, ${y}px) rotate(${rot}) scale(1.05)`,
opacity: '1',
offset: 0.8
},
{
transform: `translate(${x}px, ${y}px) rotate(${rot}) scale(1)`,
opacity: '1'
}
], {
duration: 800,
delay: i * 50,
easing: 'cubic-bezier(.34, 1.56, .64, 1)',
fill: 'forwards'
}).onfinish = () => {
el.classList.add('float');
el.style.opacity = '1';
};
});
});
}

// Enhanced Close Overlay Function with beautiful animations
function closeOverlay() {
if (busy) return;
busy = true;
setTimeout(() => busy = false, 1200);

// Calculate center position
const cx = stage.clientWidth / 2;
const cy = stage.clientHeight / 2;
const tiles = [...stage.children];

// Create a staggered close animation with magnetic effect
tiles.forEach((el, i) => {
el.classList.remove('float');

// Add a magnetic pull effect
const currentTransform = getComputedStyle(el).transform;
const matrix = new DOMMatrix(currentTransform);
const currentX = matrix.m41;
const currentY = matrix.m42;

// Calculate direction vector to center
const deltaX = cx - currentX;
const deltaY = cy - currentY;
const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

// Create intermediate waypoints for more organic movement
const waypoint1X = currentX + deltaX * 0.3;
const waypoint1Y = currentY + deltaY * 0.3;
const waypoint2X = currentX + deltaX * 0.7;
const waypoint2Y = currentY + deltaY * 0.7;

// Enhanced multi-stage close animation
const closeAnimation = el.animate([
{ 
transform: currentTransform,
opacity: '1',
filter: 'blur(0px) brightness(1)',
easing: 'ease-out'
},
{
transform: `translate(${waypoint1X}px, ${waypoint1Y}px) rotate(${Math.random() * 20 - 10}deg) scale(0.95)`,
opacity: '0.9',
filter: 'blur(1px) brightness(1.1)',
offset: 0.3,
easing: 'cubic-bezier(.25, .46, .45, .94)'
},
{
transform: `translate(${waypoint2X}px, ${waypoint2Y}px) rotate(${Math.random() * 30 - 15}deg) scale(0.85)`,
opacity: '0.6',
filter: 'blur(2px) brightness(1.2)',
offset: 0.6,
easing: 'cubic-bezier(.34, 1.56, .64, 1)'
},
{
transform: `translate(${cx}px, ${cy}px) rotate(${Math.random() * 60 - 30}deg) scale(0.7)`,
opacity: '0.2',
filter: 'blur(4px) brightness(1.3)',
offset: 0.85,
easing: 'cubic-bezier(.68, -0.55, .265, 1.55)'
},
{
transform: `translate(${cx}px, ${cy}px) rotate(0deg) scale(0.3)`,
opacity: '0',
filter: 'blur(8px) brightness(1.5)'
}
], {
duration: 900 + Math.random() * 200, // Slight variation in timing
delay: i * 35 + Math.random() * 20, // Randomized stagger
easing: 'cubic-bezier(.22, .61, .36, 1)',
fill: 'forwards'
});

closeAnimation.onfinish = () => {
// Clean up after last animation with extra effects
if (i === tiles.length - 1) {
// Animate stage container
stage.style.transform = 'scale(0.95)';
stage.style.opacity = '0.8';

setTimeout(() => {
ov.classList.remove('show');
stage.innerHTML = '';
stage.style.transform = '';
stage.style.opacity = '';

// Enhanced pulse effect
pulse.classList.add('show');
pulse.style.background = 'radial-gradient(800px 500px at 50% 50%, rgba(255, 180, 120, .25), transparent 70%)';

setTimeout(() => {
pulse.classList.remove('show');
pulse.style.background = '';
}, 800);
}, 200);
}
};
});

// Animate the overlay background
const overlay = ov;
overlay.animate([
{ backdropFilter: 'blur(20px) saturate(140%)' },
{ backdropFilter: 'blur(5px) saturate(110%)' }
], {
duration: 600,
easing: 'ease-out',
fill: 'forwards'
});
}

// Event Listeners for Overlay
ov.addEventListener('click', e => {
if (e.target === ov) closeOverlay();
});

ovClose.addEventListener('click', closeOverlay);

// ESC key to close overlay
document.addEventListener('keydown', e => {
if (e.key === 'Escape' && ov.classList.contains('show')) {
closeOverlay();
}
});

// Enhanced Parallax Scrolling Effect
function parallax() {
const y = window.scrollY * 0.05;
aurora.style.transform = `translateY(${y}px)`;
const y2 = window.scrollY * 0.025;
vector.style.transform = `translateY(${y2}px)`;
}

window.addEventListener('scroll', parallax, { passive: true });
parallax();

// Mode Toggle (Photos/Videos) - Enhanced functionality
mode.addEventListener('change', () => {
const isVideoMode = mode.checked;
document.body.classList.toggle('mode-video', isVideoMode);

// Animate grid transition
grid.style.opacity = '0';
grid.style.transform = 'translateY(20px)';
grid.style.transition = 'all 0.4s cubic-bezier(.22, .61, .36, 1)';

setTimeout(() => {
if (isVideoMode) {
grid.style.display = 'none';
// Here you could add video content logic
} else {
grid.style.display = 'grid';
}

setTimeout(() => {
grid.style.opacity = '1';
grid.style.transform = 'translateY(0)';
}, 50);
}, 200);
});

// Window resize handler for responsive layout
let resizeTimeout;
window.addEventListener('resize', () => {
clearTimeout(resizeTimeout);
resizeTimeout = setTimeout(() => {
// Recalculate layout if overlay is open
if (ov.classList.contains('show') && stage.children.length > 0) {
const tiles = [...stage.children];
const targets = layout(stage, tiles.length);

tiles.forEach((el, i) => {
const { x, y, w, h } = targets[i];
const rot = el.style.getPropertyValue('--rot') || '0deg';

el.style.width = w + 'px';
el.style.height = h + 'px';
el.style.setProperty('--x', x + 'px');
el.style.setProperty('--y', y + 'px');
el.style.transform = `translate(${x}px, ${y}px) rotate(${rot}) scale(1)`;
});
}
}, 250);
});

// Smooth scroll to top function
function scrollToTop() {
window.scrollTo({
top: 0,
behavior: 'smooth'
});
}

// Logo click handler
document.querySelector('.logo').addEventListener('click', (e) => {
e.preventDefault();
scrollToTop();
});

// Add loading states and error handling for images
function handleImageLoad(img, container) {
img.addEventListener('load', () => {
container.classList.add('loaded');
});

img.addEventListener('error', () => {
container.classList.add('error');
// You could add a placeholder image here
console.warn('Image failed to load:', img.src);
});
}

// Enhanced image preloading
function preloadImages() {
stacks.forEach(stack => {
stack.photos.forEach(src => {
const img = new Image();
img.src = src;
});
});
}

// Initialize preloading
preloadImages();

// Add intersection observer for reveal animations
const observerOptions = {
threshold: 0.1,
rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add('in-view');
observer.unobserve(entry.target);
}
});
}, observerOptions);

// Observe all reveal elements
document.querySelectorAll('.reveal').forEach(el => {
observer.observe(el);
});

// Performance optimization: Pause animations when not visible
let isTabActive = true;
document.addEventListener('visibilitychange', () => {
isTabActive = !document.hidden;
document.body.classList.toggle('tab-inactive', !isTabActive);
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
if (ov.classList.contains('show')) {
switch (e.key) {
case 'Escape':
e.preventDefault();
closeOverlay();
break;
case 'ArrowLeft':
case 'ArrowRight':
e.preventDefault();
// Here you could add navigation between images
break;
}
}
});

// Touch/swipe support for mobile
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

ov.addEventListener('touchstart', (e) => {
touchStartX = e.changedTouches[0].screenX;
touchStartY = e.changedTouches[0].screenY;
});

ov.addEventListener('touchend', (e) => {
touchEndX = e.changedTouches[0].screenX;
touchEndY = e.changedTouches[0].screenY;
handleSwipe();
});

function handleSwipe() {
const deltaX = touchEndX - touchStartX;
const deltaY = touchEndY - touchStartY;
const minSwipeDistance = 100;

if (Math.abs(deltaY) > Math.abs(deltaX)) {
// Vertical swipe
if (deltaY > minSwipeDistance) {
// Swipe down - close overlay
closeOverlay();
}
}
}

// Add subtle hover effects to tiles in overlay
stage.addEventListener('mouseover', (e) => {
if (e.target.closest('.tile')) {
const tile = e.target.closest('.tile');
tile.style.zIndex = '100';
}
});

stage.addEventListener('mouseout', (e) => {
if (e.target.closest('.tile')) {
const tile = e.target.closest('.tile');
setTimeout(() => {
tile.style.zIndex = '';
}, 300);
}
});

// Add liquid ripple effect to toggle
document.querySelector('.knob').addEventListener('mousemove', (e) => {
const rect = e.target.getBoundingClientRect();
const x = ((e.clientX - rect.left) / rect.width) * 100;
const y = ((e.clientY - rect.top) / rect.height) * 100;
e.target.style.setProperty('--x', x + '%');
e.target.style.setProperty('--y', y + '%');
});

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
console.log('Portfolio initialized successfully');
});