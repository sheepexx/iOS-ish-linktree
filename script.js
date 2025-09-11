// Tailwind Configuration
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Inter', 'Helvetica Neue', 'Arial', 'system-ui', 'sans-serif']
            },
            colors: {
                base: {
                    900: '#0b0c10',
                    800: '#0f1116',
                    700: '#12141a',
                    600: '#161922',
                    500: '#1b1f2a'
                },
                accent: {
                    pink: '#ff64d4',
                    blue: '#7dd3fc'
                }
            },
            boxShadow: {
                glass: '0 10px 40px rgba(0,0,0,0.35)',
                glow: '0 20px 60px rgba(125,211,252,0.10), 0 10px 40px rgba(255,100,212,0.07)'
            }
        }
    }
};

// Configuration Data
const ctas = [
    { label: 'Store', href: 'https://sheepex.store' },
    { label: 'Portfolio', href: 'Portfolio/index.html' }
];

const links = [
    {
        title: 'TikTok',
        href: 'https://tiktok.com/@sheepex.mp4',
        note: 'Cinematic Car Videos'
    },
    {
        title: 'Instagram',
        href: 'https://instagram.com/sheepex.mp4',
        note: 'High quality content'
    },
    {
        title: 'Contact',
        href: 'mailto:info.sheepex@gmail.com',
        note: 'Requests and Questions'
    }
];

// Set Current Year in Footer
document.getElementById('year').textContent = new Date().getFullYear();

// Generate CTA Buttons
const ctaWrap = document.getElementById('cta');
ctas.forEach((x, i) => {
    const a = document.createElement('a');
    a.href = x.href;
    a.target = '_blank';
    a.rel = 'noopener';
    a.className = 'btn float rounded-full glass text-sm px-5 py-2';
    
    // Add animation delays
    if (i === 1) a.classList.add('delay-1');
    if (i === 2) a.classList.add('delay-2');
    
    a.textContent = x.label;
    a.style.animation = `fadeUp .6s ease ${0.38 + i * 0.05}s both, ` + (a.style.animation || '');
    
    // Mouse tracking for light effect
    a.addEventListener('pointermove', (e) => {
        const r = e.currentTarget.getBoundingClientRect();
        a.style.setProperty('--x', (e.clientX - r.left) / r.width * 100 + '%');
        a.style.setProperty('--y', (e.clientY - r.top) / r.height * 100 + '%');
    });
    
    // Mouse parallax effect
    a.addEventListener('pointermove', (e) => {
        const r = a.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        a.style.transform = `translate(${dx * 6}px, ${dy * 6}px)`;
    });
    
    // Reset transform on mouse leave
    a.addEventListener('pointerleave', () => {
        a.style.transform = '';
    });
    
    // Ripple click effect
    a.addEventListener('click', (e) => {
        const r = a.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const s = document.createElement('span');
        s.className = 'ripple';
        s.style.left = x + 'px';
        s.style.top = y + 'px';
        a.appendChild(s);
        setTimeout(() => s.remove(), 700);
    });
    
    ctaWrap.appendChild(a);
});

// Generate Link Cards
const list = document.getElementById('links');
links.forEach((x, i) => {
    const a = document.createElement('a');
    a.href = x.href;
    a.target = '_blank';
    a.rel = 'noopener';
    a.className = 'card glass';
    a.style.cssText += 'border-radius:1rem; display:block; padding:1.25rem;';
    a.style.animation = `fadeUp .6s ease ${0.46 + i * 0.05}s both`;
    
    a.innerHTML = `
        <div class="flex items-center justify-between gap-4">
            <div>
                <h3 class="font-medium text-[15px] tracking-wide">${x.title}</h3>
                ${x.note ? `<p class="text-xs mt-1 text-slate-400">${x.note}</p>` : ''}
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="opacity-70">
                <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
    `;
    
    // Mouse tracking for light effect (same as buttons)
    a.addEventListener('pointermove', (e) => {
        const r = e.currentTarget.getBoundingClientRect();
        a.style.setProperty('--x', (e.clientX - r.left) / r.width * 100 + '%');
        a.style.setProperty('--y', (e.clientY - r.top) / r.height * 100 + '%');
    });
    
    // Mouse parallax effect for cards
    a.addEventListener('pointermove', (e) => {
        const r = a.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        a.style.transform = `translate(${dx * 5}px, ${dy * 5}px)`;
    });
    
    // Reset transform on mouse leave
    a.addEventListener('pointerleave', () => {
        a.style.transform = '';
    });
    
    list.appendChild(a);
});

// Parallax Scrolling Effect
const aurora = document.querySelector('.aurora');
const vector = document.querySelector('.vector');

const parallax = () => {
    const y = window.scrollY * 0.06;
    aurora.style.transform = `translateY(${y}px)`;
    
    const y2 = window.scrollY * 0.03;
    vector.style.transform = `translateY(${y2}px)`;
};

window.addEventListener('scroll', parallax, { passive: true });
parallax();

// Custom Cursor (Desktop Only)
const mq = window.matchMedia('(pointer: fine)');
const cursor = document.getElementById('cursor');

if (mq.matches && cursor) {
    document.body.classList.add('hasCursor');
    
    const move = (e) => {
        cursor.style.opacity = 1;
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };
    
    window.addEventListener('pointermove', move);
    
    // Add cursor interaction for interactive elements
    const targets = document.querySelectorAll('.btn, .card');
    targets.forEach(t => {
        t.addEventListener('pointerenter', () => cursor.classList.add('active'));
        t.addEventListener('pointerleave', () => cursor.classList.remove('active'));
    });
}

// Prevent Select All (Ctrl+A / Cmd+A)
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
    }
});

function showPulse() {
  var pulse = document.getElementById('pulse');
  if (pulse) {
    pulse.classList.add('show');
    setTimeout(function() {
      pulse.classList.remove('show');
    }, 1200);
  }
}
window.addEventListener('load', showPulse);