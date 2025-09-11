// Define CTA (Call To Action) buttons with labels and links
const ctas = [
  { label: 'osu! Profile', href: 'https://osu.ppy.sh/users/26699280' },
  { label: 'My Youtube', href: 'https://www.youtube.com/@sheepex.mp4' },
  { label: 'My Maps', href: '#' }, // opens modal instead of link
  { label: 'KPS Test', href: '/kps-tester/' }, // links to KPS tester
];

// Render CTA buttons dynamically
const wrap = document.getElementById('cta');
ctas.forEach((x, i) => {
  const a = document.createElement('a');
  a.href = x.href;
  a.target = '_blank';
  a.rel = 'noopener';
  a.className = 'btn glass rounded-full text-sm px-5 py-2';
  a.textContent = x.label;

  // Fade-up animation with staggered delay
  a.style.animation = `fadeUp .55s ease ${0.34 + i*0.06}s both`;

  // Track pointer position for hover effects (CSS variables --x and --y)
  a.addEventListener('pointermove', (e) => {
    const r = a.getBoundingClientRect();
    a.style.setProperty('--x', (e.clientX - r.left) / r.width * 100 + '%');
    a.style.setProperty('--y', (e.clientY - r.top) / r.height * 100 + '%');
  });

  // Special behavior for "My Maps" → opens modal instead of link
  if (x.label === 'My Maps') {
    a.removeAttribute('href');
    a.removeAttribute('target');
    a.removeAttribute('rel');
    a.addEventListener('click', (e) => {
      e.preventDefault();
      showModal();
    });
  }

  wrap.appendChild(a);
});

// Simple parallax scrolling effect for background elements
const aurora = document.querySelector('.aurora');
const vector = document.querySelector('.vector');
function parallax() {
  const y = window.scrollY * 0.06;
  aurora.style.transform = `translateY(${y}px)`;
  const y2 = window.scrollY * 0.03;
  vector.style.transform = `translateY(${y2}px)`;
}
window.addEventListener('scroll', parallax, { passive: true });
parallax(); // Run once on load

// Collapsible "dan" section toggle
const head = document.getElementById('dropHead');
const body = document.getElementById('dropBody');
const drop = document.getElementById('dan');
head.addEventListener('click', () => {
  const isOpen = drop.classList.toggle('open');
  if (isOpen) {
    body.style.maxHeight = body.scrollHeight + 'px';
  } else {
    body.style.maxHeight = '0px';
  }
});

// List of Dan Progress images
const danImages = [];
const danGrid = document.getElementById('danGrid');
const danImagesList = [
  { src: 'assets/images/dans/2nd.png', label: '2nd Dan REFORM' },
  { src: 'assets/images/dans/3rd.png', label: '3rd Dan REFORM' }
];

// Render Dan images into a grid if container exists
if (danGrid) {
  danGrid.innerHTML = danImagesList.map((item, idx) => `
    <figure class="shot glass" 
      style="padding:0.5em;background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.03));border-radius:1em;box-shadow:0 8px 32px rgba(0,0,0,0.18);width:100%;margin:0;cursor:pointer;" 
      data-idx="${idx}">
      <img src="${item.src}" alt="Dan Progress"
        style="width:100%;height:auto;display:block;border-radius:0.8em;box-shadow:0 2px 12px rgba(255,100,212,0.12);background:rgba(255,255,255,0.04);object-fit:cover;"
        draggable="false" oncontextmenu="return false;" />
      <figcaption style="margin-top:0.4em;color:#fff;font-size:1.15em;font-weight:600;letter-spacing:-.5px;text-align:left;">
        ${item.label}
      </figcaption>
    </figure>
  `).join('');

  // Attach click handlers for image modal viewer
  Array.from(danGrid.querySelectorAll('figure.shot')).forEach(fig => {
    fig.addEventListener('click', function() {
      const idx = this.getAttribute('data-idx');
      showImgModal(danImagesList[idx]);
    });
  });
}

// Show modal for Dan Progress images
function showImgModal(item) {
  const imgModalBg = document.getElementById('img-modal-bg');
  imgModalBg.innerHTML = `
    <div class="modal-bg img-modal-bg"
      style="z-index:101;animation:fadeInModal .5s cubic-bezier(.22,.61,.36,1);background:rgba(18,20,26,0.65);backdrop-filter:blur(18px) saturate(180%);-webkit-backdrop-filter:blur(18px) saturate(180%);display:flex;align-items:center;justify-content:center;"
      onclick="if(event.target===this)closeImgModal()">
      <img id="img-modal-img" src="${item.src}" alt="Dan Progress"
        style="display:block;margin:auto;max-width:98vw;max-height:98vh;border-radius:1.5em;box-shadow:0 8px 40px rgba(255,100,212,0.18),0 2px 24px rgba(0,0,0,0.22);background:rgba(255,255,255,0.04);object-fit:contain;user-select:none;-webkit-user-select:none;transition:transform .45s cubic-bezier(.22,.61,.36,1), opacity .45s cubic-bezier(.22,.61,.36,1);" 
        draggable="false" oncontextmenu="return false;" />
    </div>
  `;
  imgModalBg.style.display = 'flex';
  setTimeout(() => { imgModalBg.style.opacity = 1; }, 10);
}

// Close Dan image modal with animation
window.closeImgModal = function() {
  const imgModalBg = document.getElementById('img-modal-bg');
  imgModalBg.style.opacity = 0;
  setTimeout(() => {
    imgModalBg.style.display = 'none';
    imgModalBg.innerHTML = '';
  }, 300);
};

// Main "My Maps" modal
function showModal() {
  const modalBg = document.getElementById('modal-bg');
  modalBg.innerHTML = `
    <div class="modal-bg" id="modalGlass" onclick="if(event.target===this)closeModal()">
      <div class="modal-glass modal-maps-glass">
        <button class="modal-close" onclick="closeModal()">&times;</button>
        <div class="modal-title">My osu!m Maps</div>
        <div style="margin-bottom:0.5em;margin-left:0.2em;">
          <h2 style="color:#fff;font-size:1.5rem;font-weight:700;text-align:left;margin-bottom:0.1em;letter-spacing:-.5px;">
            XHRONOXAPSULE - Silentroom [NOFX] - 10th KAC
          </h2>
          <div style="color:#e5e7eb;font-size:1rem;text-align:left;opacity:.8;">By Etern1ty</div>
          <a href="#" download
            style="display:inline-block;margin-top:0.3em;margin-left:0.1em;background:linear-gradient(90deg,var(--pink),var(--blue));border-radius:0.6em;padding:0.4em;box-shadow:0 2px 12px rgba(255,100,212,0.12);vertical-align:middle;transition:background .2s;">
            <!-- Download icon -->
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 4v12m0 0l-5-5m5 5l5-5"/>
              <rect x="4" y="18" width="16" height="2" rx="1" fill="#fff" opacity=".7"/>
            </svg>
          </a>
        </div>
        <!-- Map preview player -->
        <div class="modal-player">
          <video id="previewVideo"
            style="width:100%;height:100%;object-fit:cover;position:absolute;top:0;left:0;border-radius:1rem;z-index:1;"
            poster="assets/Maps/XHRONOXAPSULE/thumbnail1.jpg">
            <source src="/assets/Maps/XHRONOXAPSULE/preview1.mp4" type="video/mp4">
            Your browser does not support the video tag.
          </video>
          <img id="modalThumb" src="/osu/assets/thumbnail1.jpg" alt="Map 1 Thumbnail"
            style="width:100%;height:100%;object-fit:cover;position:absolute;top:0;left:0;border-radius:1rem;transition:opacity .6s cubic-bezier(.22,.61,.36,1);z-index:2;"
            oncontextmenu="return false;" draggable="false" />
          <button id="modalPreviewBtn" class="modal-preview-btn"
            style="position:absolute;left:1rem;bottom:1rem;z-index:3;transition:all .3s cubic-bezier(.22,.61,.36,1);"
            onclick="previewMap()">Preview Map</button>
        </div>
        <div style="width:100%;height:120px;background:rgba(18,20,26,.45);border-radius:1rem;display:flex;align-items:center;justify-content:center;color:#cbd5e1;font-size:1rem;">
          Embed/Preview Area
        </div>
      </div>
    </div>
  `;
  modalBg.style.display = 'flex';
  setTimeout(() => { modalBg.style.opacity = 1; }, 10);
}
window.showModal = showModal;

// Map preview button toggle logic
let previewing = false;
window.previewMap = function() {
  const thumb = document.getElementById('modalThumb');
  const btn = document.getElementById('modalPreviewBtn');
  const video = document.getElementById('previewVideo');

  if (!previewing) {
    // Start video preview
    previewing = true;
    if (thumb) thumb.style.opacity = 0;
    if (btn) {
      btn.textContent = 'Close Preview';
      btn.style.background = 'linear-gradient(90deg, #7dd3fc, #ff64d4)';
    }
    if (video) {
      video.play();
      video.onended = function() {
        // Reset after video ends
        previewing = false;
        if (thumb) thumb.style.opacity = 1;
        if (btn) {
          btn.textContent = 'Preview Map';
          btn.style.background = 'linear-gradient(90deg, var(--pink), var(--blue))';
        }
      };
    }
  } else {
    // Stop video preview
    previewing = false;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    if (thumb) thumb.style.opacity = 1;
    if (btn) {
      btn.textContent = 'Preview Map';
      btn.style.background = 'linear-gradient(90deg, var(--pink), var(--blue))';
    }
  }
};

// Close the "My Maps" modal
window.closeModal = function() {
  const modalBg = document.getElementById('modal-bg');
  modalBg.style.opacity = 0;
  setTimeout(() => {
    modalBg.style.display = 'none';
    modalBg.innerHTML = '';
  }, 300);
}

/* ==============================
   Backspace Easter Egg Sequence
   ============================== */

let backspaceCount = 0;
let resetTimer;

const overlay = document.getElementById("secretOverlay");
const countdownText = document.getElementById("countdownText");
const modalBg = document.getElementById("secretModalBg");

window.addEventListener('keydown', (e) => {
  if (e.key === "Backspace") {
    backspaceCount++;

    // Reset if too slow
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      backspaceCount = 0;
      overlay.classList.remove("show");
      countdownText.textContent = "";
    }, 1500);

    // Show countdown from 2nd to 4th press
    if (backspaceCount >= 2 && backspaceCount < 5) {
      showCountdown(backspaceCount);
    }

    // At 5 presses → open modal
    if (backspaceCount === 5) {
      backspaceCount = 0; // reset for next round
      showSecretModal();
    }
  }
});

/**
 * Show overlay with countdown
 */
function showCountdown(count) {
  overlay.classList.add("show");
  const remaining = 5 - count;
  countdownText.textContent = `Keep pressing... ${remaining}`;
  // Restart animation
  countdownText.style.animation = "none";
  countdownText.offsetHeight;
  countdownText.style.animation = "fadeUp 0.5s forwards";
}

/**
 * Show modal
 */
function showSecretModal() {
  overlay.classList.remove("show");
  modalBg.style.display = "flex";
  setTimeout(() => modalBg.classList.add("show"), 10);
}

/**
 * Close modal with clean fade
 */
function closeSecretModal() {
  modalBg.classList.remove("show");
  setTimeout(() => {
    modalBg.style.display = "none";
  }, 400);
}