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
stacks.forEach(s => {
    const el = document.createElement('article');
    el.className = 'stack glass reveal';
    el.style.animation = 'fadeUp .7s ease .28s both';
    
    el.innerHTML = `
        <div class="stackHead">
            <strong>${s.title}</strong>
            <span>${s.photos.length} Bilder</span>
        </div>
        <div class="preview">
            ${s.photos.slice(0, 4).map((src, i) => 
                `<div class="pItem" style="--r:${[-8, -2, 4, 10][i]}deg">
                    <img src="${src}" alt="">
                </div>`
            ).join('')}
        </div>
    `;
    
    // Add click event to open stack
    el.addEventListener('click', () => openStack(s));
    grid.appendChild(el);
});

// Layout Algorithm for Distributing Photos
function layout(container, count, ratio = 3208/4277, pad = 24) {
    const W = container.clientWidth;
    const H = container.clientHeight;
    
    // Calculate optimal grid dimensions
    let cols = Math.ceil(Math.sqrt(count));
    let rows = Math.ceil(count / cols);
    
    // Calculate tile dimensions
    let tileH = Math.min(
        (H - pad * (rows + 1)) / rows,
        ((W - pad * (cols + 1)) / cols) / ratio
    );
    let tileW = tileH * ratio;
    
    // Generate positions with slight randomization
    const pos = [];
    for (let i = 0; i < count; i++) {
        const r = Math.floor(i / cols);
        const c = i % cols;
        const x = pad + c * (tileW + pad) + (Math.random() * 8 - 4);
        const y = pad + r * (tileH + pad) + (Math.random() * 8 - 4);
        pos.push({ x, y, w: tileW, h: tileH });
    }
    
    return pos;
}

// Animation State Management
let busy = false;

// Open Stack Overlay
function openStack(data) {
    if (busy) return;
    busy = true;
    setTimeout(() => busy = false, 900);
    
    // Set overlay title
    ovTitle.textContent = `${data.title} – ${data.photos.length} Bilder`;
    
    // Clear previous content
    stage.innerHTML = '';
    
    // Calculate center position
    const cx = stage.clientWidth / 2;
    const cy = stage.clientHeight / 2;
    
    // Create tile elements
    data.photos.forEach(src => {
        const t = document.createElement('div');
        t.className = 'tile';
        t.innerHTML = `<img src="${src}" alt="">`;
        t.style.transform = `translate(${cx}px, ${cy}px) rotate(30deg) scale(.92)`;
        stage.appendChild(t);
    });
    
    // Show overlay
    ov.classList.add('show');
    
    // Animate tiles to distributed positions
    requestAnimationFrame(() => {
        const targets = layout(stage, data.photos.length);
        [...stage.children].forEach((el, i) => {
            const { x, y, w, h } = targets[i];
            const rot = (Math.random() * 6 - 4).toFixed(2) + 'deg';
            
            // Set tile dimensions and CSS custom properties
            el.style.width = w + 'px';
            el.style.height = h + 'px';
            el.style.setProperty('--x', x + 'px');
            el.style.setProperty('--y', y + 'px');
            el.style.setProperty('--rot', rot);
            
            // Animate from center to final position
            el.animate([
                { transform: `translate(${cx}px, ${cy}px) rotate(0deg) scale(.92)` },
                { transform: `translate(${x}px, ${y}px) rotate(${rot}) scale(1)` }
            ], {
                duration: 600,
                delay: i * 35,
                easing: 'cubic-bezier(.22, .61, .36, 1)',
                fill: 'forwards'
            }).onfinish = () => el.classList.add('float');
        });
    });
}

// Close Overlay Function
function closeOverlay() {
    if (busy) return;
    busy = true;
    setTimeout(() => busy = false, 800);
    
    // Calculate center position
    const cx = stage.clientWidth / 2;
    const cy = stage.clientHeight / 2;
    const tiles = [...stage.children];
    
    // Animate tiles back to center
    tiles.forEach((el, i) => {
        el.classList.remove('float');
        el.animate([
            { transform: getComputedStyle(el).transform },
            { transform: `translate(${cx}px, ${cy}px) rotate(0deg) scale(.92)` }
        ], {
            duration: 460,
            delay: i * 18,
            easing: 'cubic-bezier(.22, .61, .36, 1)',
            fill: 'forwards'
        }).onfinish = () => {
            // Clean up after last animation
            if (i === tiles.length - 1) {
                ov.classList.remove('show');
                stage.innerHTML = '';
                pulse.classList.add('show');
                setTimeout(() => pulse.classList.remove('show'), 420);
            }
        };
    });
}

// Event Listeners for Overlay
ov.addEventListener('click', e => {
    if (e.target === ov) closeOverlay();
});

ovClose.addEventListener('click', closeOverlay);

// Parallax Scrolling Effect
function parallax() {
    const y = window.scrollY * 0.06;
    aurora.style.transform = `translateY(${y}px)`;
    
    const y2 = window.scrollY * 0.03;
    vector.style.transform = `translateY(${y2}px)`;
}

window.addEventListener('scroll', parallax, { passive: true });
parallax();

// Mode Toggle (Photos/Videos)
mode.addEventListener('change', () => {
    const on = mode.checked;
    document.body.classList.toggle('mode-video', on);
    grid.style.display = on ? 'none' : 'grid';
});