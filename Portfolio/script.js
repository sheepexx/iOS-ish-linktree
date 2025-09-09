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
      'assets/photos/rd_6.jpg'
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
      'assets/photos/cn_6.jpg'
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

// Optional video stacks (add your video file paths here)
const videoStacks = [
  {
    title: 'Automotive',
    videos: [
      // 'assets/photos/rd_1.jpg',
      // 'assets/videos/video2.mp4'
    ]
  }
];

// Generate Stack Cards (photos or videos)
function generateStacks(isVideoMode = false) {
  grid.innerHTML = '';
  const source = isVideoMode ? videoStacks : stacks;

  source.forEach((s, index) => {
    // skip empty stacks
    const items = isVideoMode ? s.videos : s.photos;
    if (!items || items.length === 0) return;

    const el = document.createElement('article');
    el.className = 'stack glass reveal';
    el.style.animation = `fadeUp .8s ease ${.5 + index * .1}s both`;
    
    el.innerHTML = `
      <div class="stackHead">
        <strong>${s.title}</strong>
        <span>${items.length} ${isVideoMode ? 'Videos' : 'Bilder'}</span>
      </div>
      <div class="preview">
        ${isVideoMode ? (
          items.slice(0, 1).map(src => `
            <div class="pItem video-preview" style="--r:0deg">
              <video src="${src}" preload="metadata"></video>
            </div>
          `).join('')
        ) : (
          items.slice(0, 4).map((src, i) => `
            <div class="pItem" style="--r:${[-12, -4, 6, 14][i]}deg">
              <img 
                src="${src}" 
                alt=""
                loading="lazy"
                onerror="this.onerror=null; this.style.opacity=0.3; this.parentElement.style.backgroundColor='rgba(255,60,60,0.1)';"
              >
            </div>
          `).join('')
        )}
      </div>
    `;

    el.addEventListener('click', () => openStack(s, isVideoMode));
    grid.appendChild(el);
  });
}

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

// (old direct rendering removed) initial rendering is handled by generateStacks()

// Enhanced Layout Algorithm
function layout(container, count, ratio = 3208/4277, pad = 24) {
  const W = container.clientWidth;
  const H = container.clientHeight;
  let cols = Math.ceil(Math.sqrt(count * 1.3));
  let rows = Math.ceil(count / cols);
  
  while (cols * rows < count) {
    if (cols <= rows) cols++;
    else rows++;
  }

  let tileH = Math.min(
    (H - pad * (rows + 1)) / rows,
    ((W - pad * (cols + 1)) / cols) / ratio
  );
  let tileW = tileH * ratio;

  const minSize = Math.min(W, H) * 0.15;
  tileH = Math.max(tileH, minSize);
  tileW = Math.max(tileW, tileH * ratio);

  if (tileW * cols + pad * (cols + 1) > W) {
    tileW = (W - pad * (cols + 1)) / cols;
    tileH = tileW / ratio;
  }
  if (tileH * rows + pad * (rows + 1) > H) {
    tileH = (H - pad * (rows + 1)) / rows;
    tileW = tileH * ratio;
  }

  const totalW = cols * tileW + (cols - 1) * pad;
  const totalH = rows * tileH + (rows - 1) * pad;
  const offsetX = (W - totalW) / 2;
  const offsetY = (H - totalH) / 2;

  const pos = [];
  for (let i = 0; i < count; i++) {
    const r = Math.floor(i / cols);
    const c = i % cols;
    const x = offsetX + c * (tileW + pad);
    const y = offsetY + r * (tileH + pad);
    const margin = 10;
    
    pos.push({
      x: Math.max(margin, Math.min(x, W - tileW - margin)),
      y: Math.max(margin, Math.min(y, H - tileH - margin)),
      w: Math.floor(tileW),
      h: Math.floor(tileH)
    });
  }

  return pos;
}

// Animation State Management
let busy = false;

// Enhanced Open Stack Overlay
function openStack(data, isVideoMode = false) {
  if (busy) return;
  busy = true;
  setTimeout(() => busy = false, 800); // Match our CSS transition time

  const items = isVideoMode ? data.videos : data.photos;
  if (!items || items.length === 0) return;

  ovTitle.textContent = `${data.title} – ${items.length} ${isVideoMode ? 'Videos' : 'Bilder'}`;
  stage.innerHTML = '';

  const cx = stage.clientWidth / 2;
  const cy = stage.clientHeight / 2;

  // Create tile elements with enhanced styling
  items.forEach((src, index) => {
    const t = document.createElement('div');
    t.className = 'tile';
    if (isVideoMode) {
      t.innerHTML = `\n      <video src="${src}" controls>\n        Your browser does not support the video tag.\n      </video>\n    `;
    } else {
      t.innerHTML = `\n      <img \n        src="${src}" \n        alt="" \n        loading="lazy"\n        onerror="this.onerror=null; this.style.opacity=0.3; this.parentElement.style.backgroundColor='rgba(255,60,60,0.1)';"\n      >\n    `;
    }
    t.style.transform = `translate(${cx}px, ${cy}px) rotate(${Math.random() * 60 - 30}deg) scale(.8)`;
    t.style.opacity = '0';
    
    // Add click handler for fullscreen view (images only)
    if (!isVideoMode) {
      t.addEventListener('click', (e) => {
        const img = e.currentTarget.querySelector('img');
        showFullscreenImage(img.src);
      });
    }
    
    stage.appendChild(t);
  });

  // Show overlay with smooth transition
  ov.classList.add('show');

  // Enhanced tile distribution animation
  requestAnimationFrame(() => {
    const targets = layout(stage, items.length);
    [...stage.children].forEach((el, i) => {
      const { x, y, w, h } = targets[i];
      const rot = (Math.random() * 8 - 4).toFixed(2) + 'deg';
      
      el.style.transition = 'all .8s cubic-bezier(.2, 1.2, .3, 1)';
      el.style.width = w + 'px';
      el.style.height = h + 'px';
      
      setTimeout(() => {
        el.style.transform = `translate(${x}px, ${y}px) rotate(${rot})`;
        el.style.opacity = '1';
      }, 60 * i);
    });
  });
}

// Enhanced Close Overlay Function
function closeOverlay() {
  if (busy) return;
  busy = true;

  const tiles = [...stage.children];
  if (!tiles.length) {
    ov.classList.remove('show');
    busy = false;
    return;
  }

  // Immediately start hiding overlay
  ov.classList.remove('show');
  
  // Create a staggered close animation
  tiles.forEach((el, i) => {
    setTimeout(() => {
      const randomRot = (Math.random() * 60 - 30).toFixed(2);
      el.style.transform += ` rotate(${randomRot}deg) scale(.8)`;
      el.style.opacity = '0';
    }, 50 * i);
  });

  // Release busy state quickly
  setTimeout(() => {
    busy = false;
  }, 50); // Quick release to allow new interactions
}

// Fullscreen Image Viewer
let fullscreenViewer = null;

function createFullscreenViewer() {
  if (fullscreenViewer) return fullscreenViewer;
  
  const viewer = document.createElement('div');
  viewer.className = 'fullscreen-image';
  viewer.innerHTML = '<img>';
  
  viewer.addEventListener('click', (e) => {
    if (e.target === viewer) {
      viewer.classList.remove('show');
      setTimeout(() => viewer.querySelector('img').src = '', 400);
    }
  });
  
  document.body.appendChild(viewer);
  return viewer;
}

function showFullscreenImage(src, originRect) {
  if (busy) return;
  busy = true;
  
  const viewer = createFullscreenViewer();
  const img = viewer.querySelector('img');
  img.src = src;
  
  // Start the blur transition immediately
  requestAnimationFrame(() => {
    viewer.classList.add('show');
  });
  
  setTimeout(() => {
    busy = false;
  }, 500);
}

// Event Listeners
ovClose.addEventListener('click', closeOverlay);

// Render initial photo stacks
generateStacks(false);

// Toggle handler: regenerate stacks for video/photo mode
mode.addEventListener('change', (e) => {
  const videoMode = !!e.target.checked;
  document.body.classList.toggle('mode-video', videoMode);
  generateStacks(videoMode);
});
