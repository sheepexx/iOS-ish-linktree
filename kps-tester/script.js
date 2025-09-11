// Key binding presets for different layouts (osu!mania style)
const presets = {
  1: [' '],                    // 1K: Space only
  2: ['x', 'z'],               // 2K: X, Z
  4: ['d', 'f', 'j', 'k'],     // 4K: D, F, J, K
  5: ['d', 'f', ' ', 'j', 'k'], // 5K: D, F, Space, J, K
  6: ['d', 'f', 'g', 'h', 'j', 'k'], // 6K: D, F, G, H, J, K
  7: ['s', 'd', 'f', ' ', 'j', 'k', 'l'] // 7K: S, D, F, Space, J, K, L
};

// DOM element references
const presetSel = document.getElementById('preset');
const secondsInp = document.getElementById('seconds');
const bindingsCard = document.getElementById('bindingsCard');
const bindingView = document.getElementById('bindingView');

const timeLeftEl = document.getElementById('timeLeft');
const totalPressEl = document.getElementById('totalPress');
const liveCpsEl = document.getElementById('liveCps');
const statusEl = document.getElementById('status');

const resultsBox = document.getElementById('results');
const avgEl = document.getElementById('avgCps');
const maxEl = document.getElementById('maxCps');
const minEl = document.getElementById('minCps');
const retryBtn = document.getElementById('retryBtn');

const bindModal = document.getElementById('bindModal');
const closeBind = document.getElementById('closeBind');
const bindCountSel = document.getElementById('bindCount');
const bindStep = document.getElementById('bindStep');
const bindSlots = document.getElementById('bindSlots');

// Parallax scrolling effect for background elements
const aurora = document.querySelector('.aurora');
const vector = document.querySelector('.vector');

function parallax() {
  const y = window.scrollY * 0.06;
  aurora.style.transform = `translateY(${y}px)`;
  
  const y2 = window.scrollY * 0.03;
  vector.style.transform = `translateY(${y2}px)`;
}

// Initialize parallax effect
window.addEventListener('scroll', parallax, { passive: true });
parallax();

// Application state variables
let bindings = [...presets[5]];  // Default to 5K layout
let running = false;             // Whether test is currently running
let started = false;             // Whether test has been started
let tSeconds = parseInt(secondsInp.value, 10) || 15; // Test duration
let tick = null;                 // Interval timer reference
let timeLeft = tSeconds;         // Remaining time
let secondCount = 0;             // Keys pressed in current second
let cpsSeries = [];              // Array of CPS values per second
let totalPress = 0;              // Total key presses

// Utility function to format key labels for display
function kLabel(k) {
  return k === ' ' ? 'Space' : k.toUpperCase();
}

// Render current key bindings in the UI
function renderBindings() {
  bindingView.innerHTML = '';
  bindings.forEach(k => {
    const b = document.createElement('div');
    b.className = 'key';
    b.textContent = kLabel(k);
    bindingView.appendChild(b);
  });
}

// Save settings to localStorage
function saveSettings() {
  const settings = {
    preset: presetSel.value,
    duration: secondsInp.value,
    customBindings: bindings
  };
  localStorage.setItem('kps-settings', JSON.stringify(settings));
}

// Load settings from localStorage
function loadSettings() {
  const saved = localStorage.getItem('kps-settings');
  if (saved) {
    const settings = JSON.parse(saved);
    
    // Restore preset selection
    presetSel.value = settings.preset;
    
    // Restore duration
    secondsInp.value = settings.duration;
    tSeconds = parseInt(settings.duration, 10);
    
    // Restore custom bindings if they exist
    if (settings.customBindings && settings.customBindings.length > 0) {
      bindings = settings.customBindings;
    } else {
      bindings = [...presets[settings.preset]];
    }
    
    renderBindings();
  }
}

// Set preset key bindings and reset test
function setPreset(n) {
  bindings = [...presets[n]];
  renderBindings();
  hardReset();
  saveSettings();
}

// Event listeners for configuration changes
presetSel.addEventListener('change', e => {
  setPreset(parseInt(e.target.value, 10));
});

secondsInp.addEventListener('change', e => {
  const v = Math.max(1, Math.min(120, parseInt(e.target.value || '15', 10)));
  secondsInp.value = v;
  tSeconds = v;
  hardReset();
  saveSettings();
});

// Event listeners for UI interactions
bindingsCard.addEventListener('click', () => openBind());
retryBtn.addEventListener('click', () => {
  hardReset();
  started = false;
});

// Complete reset of test state
function hardReset() {
  if (tick) {
    clearInterval(tick);
    tick = null;
  }
  
  running = false;
  started = false;
  timeLeft = tSeconds;
  secondCount = 0;
  cpsSeries = [];
  totalPress = 0;
  
  // Update UI elements
  timeLeftEl.textContent = timeLeft;
  totalPressEl.textContent = '0';
  liveCpsEl.textContent = '0';
  statusEl.textContent = 'Ready';
  
  // Remove active key states
  document.querySelectorAll('.key').forEach(k => k.classList.remove('live'));
}

// Start the test when a key is pressed
function startIfNeeded() {
  if (running) return;
  
  running = true;
  started = true;
  timeLeft = tSeconds;
  timeLeftEl.textContent = timeLeft;
  statusEl.textContent = 'Running';
  
  // Start the per-second timer
  tick = setInterval(() => {
    // Record CPS for this second
    cpsSeries.push(secondCount);
    liveCpsEl.textContent = secondCount.toString();
    secondCount = 0;
    
    // Decrement timer
    timeLeft--;
    timeLeftEl.textContent = timeLeft;
    
    // Check if test is complete
    if (timeLeft <= 0) {
      finish();
    }
  }, 1000);
}

// Finish the test and calculate results
function finish() {
  clearInterval(tick);
  tick = null;
  running = false;
  
  // Ensure we have at least one data point
  if (cpsSeries.length === 0) cpsSeries = [0];
  
  // Calculate statistics
  const sum = cpsSeries.reduce((a, b) => a + b, 0);
  const avg = (sum / cpsSeries.length) || 0;
  const mx = Math.max(...cpsSeries);
  const mn = Math.min(...cpsSeries);
  
  // Update results display
  avgEl.textContent = avg.toFixed(2);
  maxEl.textContent = mx.toString();
  minEl.textContent = mn.toString();
  statusEl.textContent = 'Done';
  timeLeftEl.textContent = '0';
}

// Check if a key is bound for the current layout
function isBound(key) {
  return bindings.includes(key.toLowerCase());
}

// Global keydown handler for test input
window.addEventListener('keydown', e => {
  // Ignore input when modal is open
  if (bindModal.classList.contains('show')) {
    e.preventDefault();
    return;
  }
  
  // Normalize key input
  const k = e.key.length === 1 ? 
    e.key.toLowerCase() : 
    (e.key === ' ' ? ' ' : e.key.toLowerCase());
  
  // Process bound key presses
  if (isBound(k)) {
    e.preventDefault();
    
    // Auto-start test on first key press
    if (!started) startIfNeeded();
    
    // Count key press if test is running and not a repeat
    if (running && !e.repeat) {
      totalPress++;
      totalPressEl.textContent = totalPress.toString();
      secondCount++;
      
      // Visual feedback for pressed key
      const idx = bindings.indexOf(k);
      if (idx > -1) {
        const el = bindingView.children[idx];
        if (el) {
          el.classList.add('live');
          setTimeout(() => el.classList.remove('live'), 120);
        }
      }
    }
  }
});

// === KEY BINDING MODAL FUNCTIONALITY ===

// Open the key binding modal
function openBind() {
  bindCountSel.value = Math.min(Math.max(bindings.length, 1), 7).toString();
  drawSlots(parseInt(bindCountSel.value, 10));
  bindStep.textContent = 'Press key 1';
  pendingIndex = 0;
  pendingBindings = new Array(parseInt(bindCountSel.value, 10)).fill('');
  bindModal.classList.add('show');
}

// Close modal event listener
closeBind.addEventListener('click', () => bindModal.classList.remove('show'));

// Layout change handler in modal
bindCountSel.addEventListener('change', () => {
  const cnt = parseInt(bindCountSel.value, 10);
  drawSlots(cnt);
  bindStep.textContent = 'Press key 1';
  pendingBindings = new Array(cnt).fill('');
  pendingIndex = 0;
});

// Modal state for key binding process
let pendingBindings = [];
let pendingIndex = 0;

// Create visual slots for key binding
function drawSlots(cnt) {
  bindSlots.innerHTML = '';
  for (let i = 0; i < cnt; i++) {
    const s = document.createElement('div');
    s.className = 'key';
    s.textContent = '—';
    s.dataset.slot = i;
    bindSlots.appendChild(s);
  }
}

// Handle key binding in modal
window.addEventListener('keydown', e => {
  if (!bindModal.classList.contains('show')) return;
  
  e.preventDefault();
  
  // Normalize key input
  const key = e.key === ' ' ? ' ' : e.key.toLowerCase();
  
  // Ignore if key already bound or binding complete
  if (pendingBindings.includes(key)) return;
  if (pendingIndex >= pendingBindings.length) return;
  
  // Record the binding
  pendingBindings[pendingIndex] = key;
  
  // Update visual feedback
  const slot = bindSlots.querySelector(`[data-slot="${pendingIndex}"]`);
  if (slot) {
    slot.textContent = kLabel(key);
    slot.classList.add('live');
    setTimeout(() => slot.classList.remove('live'), 140);
  }
  
  pendingIndex++;
  
  // Update progress or complete binding
  if (pendingIndex < pendingBindings.length) {
    bindStep.textContent = `Press key ${pendingIndex + 1}`;
  } else {
    // Binding complete - apply and close modal
    bindings = [...pendingBindings];
    renderBindings();
    hardReset();
    bindModal.classList.remove('show');
    saveSettings(); // Save the new bindings
  }
});

// === INITIALIZATION ===

// Initialize the application
loadSettings(); // Load saved settings first
hardReset();

// === ADDITIONAL SECURITY ===

// Prevent Ctrl+A text selection for better UX
window.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
    e.preventDefault();
    return false;
  }
  
  // Handle TAB key to trigger retry
  if (e.key === 'Tab' && !bindModal.classList.contains('show')) {
    e.preventDefault();
    hardReset();
    started = false;
  }
});