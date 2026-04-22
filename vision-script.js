let state = { boards: [], activeBoardId: null, theme: 'minimalist' };
let zCounter = 5000;
let selectedEl = null;
let activeLibTab = 'pictures';
let activeStyle = 'script';
let activeColor = 'accent';
let activeLayout = null;

// ── Assets ──
const ASSETS = {
  pictures: [
    { url:'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=500', label:'Office' },
    { url:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500', label:'Beach' },
    { url:'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=500', label:'Minimal' },
    { url:'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=500', label:'Writing' },
    { url:'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500', label:'Mountains' },
    { url:'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=500', label:'Nature' },
    { url:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500', label:'Fashion' },
    { url:'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500', label:'Portrait' },
    { url:'https://images.unsplash.com/photo-1546961342-ea5f62d6f2c0?w=500', label:'Flowers' },
    { url:'https://images.unsplash.com/photo-1468421870903-4df1664ac249?w=500', label:'Sky' },
    { url:'https://images.unsplash.com/photo-1517705600644-3f7a01da77e9?w=500', label:'Tea' },
    { url:'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500', label:'Coffee' },
  ],
  stickers: [
    { emoji:'🌸', label:'Cherry Blossom' },
    { emoji:'✨', label:'Sparkle' },
    { emoji:'🌙', label:'Moon' },
    { emoji:'⭐', label:'Star' },
    { emoji:'🌿', label:'Leaf' },
    { emoji:'🌹', label:'Rose' },
    { emoji:'🦋', label:'Butterfly' },
    { emoji:'🌺', label:'Hibiscus' },
    { emoji:'💫', label:'Dizzy' },
    { emoji:'🌸', label:'Blossom' },
    { emoji:'🍃', label:'Leaves' },
    { emoji:'🌼', label:'Daisy' },
    { emoji:'💎', label:'Diamond' },
    { emoji:'🕊️', label:'Dove' },
    { emoji:'🌙', label:'Crescent' },
    { emoji:'🌟', label:'Glow' },
    { emoji:'🌷', label:'Tulip' },
    { emoji:'🦚', label:'Peacock' },
    { emoji:'🍀', label:'Clover' },
    { emoji:'💐', label:'Bouquet' },
  ],
  icons: [
    { svg:'◈', label:'Diamond', type:'geometric' },
    { svg:'✦', label:'Star', type:'geometric' },
    { svg:'❋', label:'Bloom', type:'geometric' },
    { svg:'◉', label:'Circle', type:'geometric' },
    { svg:'⟡', label:'Star2', type:'geometric' },
    { svg:'⌘', label:'Command', type:'geometric' },
    { svg:'∞', label:'Infinity', type:'geometric' },
    { svg:'☽', label:'Moon', type:'geometric' },
    { svg:'♡', label:'Heart', type:'geometric' },
    { svg:'⚘', label:'Flower', type:'geometric' },
    { svg:'⋆', label:'Star3', type:'geometric' },
    { svg:'△', label:'Triangle', type:'geometric' },
  ],
  templates: [
    { text:"She believed she could,\nso she did", style:"script" },
    { text:"MANIFEST GREATNESS", style:"cinzel" },
    { text:"Dream, Believe, Achieve", style:"dancing" },
    { text:"In Her Element", style:"italiana" },
    { text:"UNBOTHERED", style:"cinzel" },
    { text:"Blooming into\nwho I was meant to be", style:"dm" },
    { text:"She is magic", style:"script" },
    { text:"DO IT WITH GRACE", style:"cinzel" },
    { text:"Her vibe attracts her tribe", style:"dancing" },
    { text:"Soft life, strong mind", style:"dm" },
    { text:"I am enough", style:"italiana" },
    { text:"Aligned with abundance", style:"serif" },
  ]
};

const QUICK_AFFIRMATIONS = [
  "I am magnetic.",
  "Everything I desire is coming to me.",
  "I choose peace.",
  "My potential is limitless.",
  "I am worthy of all good things.",
  "Abundance flows to me effortlessly.",
  "I radiate confidence.",
  "I am the main character.",
];

const MOOD_PALETTES = {
  golden:   { accent:'#c9832a', overlay:'rgba(255,200,100,0.08)', textColor:'#7a4500', bg:'#fff8ee' },
  ethereal: { accent:'#c084fc', overlay:'rgba(192,132,252,0.07)', textColor:'#6b21a8', bg:'#faf5ff' },
  bold:     { accent:'#e11d48', overlay:'rgba(225,29,72,0.06)', textColor:'#9f1239', bg:'#fff1f2' },
  serene:   { accent:'#4ade80', overlay:'rgba(74,222,128,0.07)', textColor:'#166534', bg:'#f0fdf4' },
  romantic: { accent:'#fb7185', overlay:'rgba(251,113,133,0.08)', textColor:'#881337', bg:'#fff1f2' },
  cosmic:   { accent:'#818cf8', overlay:'rgba(129,140,248,0.1)', textColor:'#3730a3', bg:'#eef2ff' },
};

// ── Persistence ──
function save() { localStorage.setItem('visionary_v3', JSON.stringify(state)); }
function load() {
  const data = localStorage.getItem('visionary_v3');
  if (data) state = JSON.parse(data);
}

// ── Library Tabs ──
function initLibraryTabs() {
  document.querySelectorAll('.lib-tab').forEach(tab => {
    tab.onclick = () => {
      document.querySelectorAll('.lib-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeLibTab = tab.dataset.tab;
      renderLibrary();
    };
  });
}

function renderLibrary() {
  const container = document.getElementById('libraryContent');
  container.innerHTML = '';

  if (activeLibTab === 'pictures') {
    const grid = document.createElement('div'); grid.className = 'image-grid';
    ASSETS.pictures.forEach(item => {
      const wrap = document.createElement('div'); wrap.className = 'thumb-wrap';
      const img = document.createElement('img');
      img.src = item.url; img.className = 'sample-thumb'; img.draggable = true;
      img.title = item.label;
      img.onclick = () => addElement('image', { src: item.url });
      img.ondragstart = (e) => e.dataTransfer.setData('json', JSON.stringify({ type: 'image', src: item.url }));
      wrap.appendChild(img);
      grid.appendChild(wrap);
    });
    container.appendChild(grid);

  } else if (activeLibTab === 'stickers') {
    const grid = document.createElement('div'); grid.className = 'sticker-grid';
    ASSETS.stickers.forEach(item => {
      const div = document.createElement('div');
      div.className = 'sticker-chip'; div.textContent = item.emoji; div.title = item.label;
      div.draggable = true;
      div.onclick = () => addElement('sticker', { emoji: item.emoji });
      div.ondragstart = (e) => e.dataTransfer.setData('json', JSON.stringify({ type: 'sticker', emoji: item.emoji }));
      grid.appendChild(div);
    });
    container.appendChild(grid);

  } else if (activeLibTab === 'icons') {
    const grid = document.createElement('div'); grid.className = 'icon-grid';
    ASSETS.icons.forEach(item => {
      const div = document.createElement('div');
      div.className = 'icon-chip'; div.textContent = item.svg; div.title = item.label;
      div.draggable = true;
      div.onclick = () => addElement('icon', { svg: item.svg, label: item.label });
      div.ondragstart = (e) => e.dataTransfer.setData('json', JSON.stringify({ type: 'icon', svg: item.svg }));
      grid.appendChild(div);
    });
    container.appendChild(grid);

  } else if (activeLibTab === 'templates') {
    ASSETS.templates.forEach(tpl => {
      const div = document.createElement('div');
      div.className = `template-item style-${tpl.style}`;
      div.style.fontFamily = getFontFamily(tpl.style);
      div.textContent = tpl.text.replace('\n', ' ');
      div.draggable = true;
      div.onclick = () => addElement('text', { text: tpl.text, style: tpl.style, color: 'var(--accent)' });
      div.ondragstart = (e) => e.dataTransfer.setData('json', JSON.stringify({ type: 'text', text: tpl.text, style: tpl.style, color: 'var(--accent)' }));
      container.appendChild(div);
    });
  }
}

function getFontFamily(style) {
  const map = {
    script: "'Mrs Saint Delafield', cursive",
    serif: "'Playfair Display', serif",
    cinzel: "'Cinzel', serif",
    dancing: "'Dancing Script', cursive",
    dm: "'DM Serif Display', serif",
    italiana: "'Italiana', serif",
    sans: "'Jost', sans-serif",
  };
  return map[style] || "'Jost', sans-serif";
}

// ── Canvas drop ──
const canvas = document.getElementById('canvas');
canvas.ondragover = (e) => e.preventDefault();
canvas.ondrop = (e) => {
  e.preventDefault();
  const data = JSON.parse(e.dataTransfer.getData('json'));
  const rect = canvas.getBoundingClientRect();
  const dropX = e.clientX - rect.left - 100;
  const dropY = e.clientY - rect.top - 50;
  addElement(data.type, data, dropX, dropY);
};

// ── Add Element ──
function addElement(type, data, x = randomBetween(100,500), y = randomBetween(80,400)) {
  const board = state.boards.find(b => b.id === state.activeBoardId);
  if (!board) return alert("Create a Project first!");
  const item = { id: 'i_'+Date.now(), type, ...data, x, y, w: type === 'sticker' ? 80 : type === 'icon' ? 100 : 250, z: ++zCounter, rot: 0 };
  board.items.push(item);
  save(); renderCanvas();
}

function randomBetween(a, b) { return Math.floor(Math.random() * (b - a)) + a; }

// ── Render Canvas ──
function renderCanvas() {
  canvas.innerHTML = '';
  const board = state.boards.find(b => b.id === state.activeBoardId);
  if (!board) return;
  document.getElementById('boardNameDisplay').textContent = board.name;

  board.items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'board-item-el';
    el.dataset.id = item.id;
    el.style.cssText = `left:${item.x}px; top:${item.y}px; width:${item.w}px; z-index:${item.z}; transform:rotate(${item.rot}deg);`;

    if (item.type === 'image') {
      const img = document.createElement('img');
      img.src = item.src;
      img.style.cssText = 'width:100%;border-radius:10px;display:block;pointer-events:none;';
      el.appendChild(img);

    } else if (item.type === 'sticker') {
      const span = document.createElement('div');
      span.className = 'board-sticker';
      span.textContent = item.emoji;
      el.appendChild(span);

    } else if (item.type === 'icon') {
      const span = document.createElement('div');
      span.className = 'board-icon';
      span.textContent = item.svg;
      if (item.iconColor) span.style.color = item.iconColor;
      el.appendChild(span);

    } else if (item.type === 'text') {
      const txt = document.createElement('div');
      txt.className = `board-text style-${item.style}`;
      txt.style.color = item.color === 'accent' ? 'var(--accent)' : (item.color || 'var(--accent)');
      txt.style.fontFamily = getFontFamily(item.style);
      txt.style.whiteSpace = 'pre-line';
      txt.textContent = item.text;
      el.appendChild(txt);
    }

    const res = document.createElement('div'); res.className = 'resize-handle'; el.appendChild(res);
    const rot = document.createElement('div'); rot.className = 'rotate-handle'; rot.innerHTML = '↻'; el.appendChild(rot);
    const del = document.createElement('div'); del.className = 'delete-handle'; del.innerHTML = '×'; el.appendChild(del);

    del.onmousedown = (e) => { e.stopPropagation(); deleteItem(item.id); };

    el.onmousedown = (e) => {
      if (e.target.className && typeof e.target.className === 'string' && e.target.className.includes('handle')) return;
      if(selectedEl) selectedEl.classList.remove('selected');
      selectedEl = el; el.classList.add('selected');
    };

    bindInteractions(el, res, rot, item);
    canvas.appendChild(el);
  });
}

function deleteItem(id) {
  const board = state.boards.find(b => b.id === state.activeBoardId);
  if (!board) return;
  board.items = board.items.filter(i => i.id !== id);
  save(); renderCanvas();
}

function bindInteractions(el, res, rot, item) {
  el.addEventListener('mousedown', (e) => {
    if (e.target.className && typeof e.target.className === 'string' && e.target.className.includes('handle')) return;
    let startX = e.clientX - item.x;
    let startY = e.clientY - item.y;
    const onMove = (e) => {
      item.x = e.clientX - startX;
      item.y = e.clientY - startY;
      el.style.left = item.x + 'px';
      el.style.top = item.y + 'px';
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      save();
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });

  res.onmousedown = (e) => {
    e.stopPropagation(); let sw = item.w, sx = e.clientX;
    const onMove = (e) => { item.w = Math.max(60, sw + (e.clientX - sx)); el.style.width = item.w + 'px'; };
    const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); save(); };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  rot.onmousedown = (e) => {
    e.stopPropagation();
    let rect = el.getBoundingClientRect(), cx = rect.left + rect.width/2, cy = rect.top + rect.height/2;
    const onMove = (e) => {
      let angle = Math.atan2(e.clientY - cy, e.clientX - cx);
      item.rot = angle * (180 / Math.PI) + 90;
      el.style.transform = `rotate(${item.rot}deg)`;
    };
    const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); save(); };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };
}

// ── Affirmation Studio ──
function initAffirmationStudio() {
  // Font chips
  document.querySelectorAll('.font-chip').forEach(chip => {
    chip.onclick = () => {
      document.querySelectorAll('.font-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeStyle = chip.dataset.style;
    };
  });

  // Color swatches
  document.querySelectorAll('.color-swatch').forEach(sw => {
    sw.onclick = () => {
      document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
      activeColor = sw.dataset.color;
    };
  });

  // Quick affirmations
  const list = document.getElementById('quickAffirmList');
  QUICK_AFFIRMATIONS.forEach(a => {
    const btn = document.createElement('button');
    btn.className = 'quick-affirm-btn';
    btn.textContent = a;
    btn.onclick = () => {
      document.getElementById('affirmText').value = a;
    };
    list.appendChild(btn);
  });

  // Add affirmation button
  document.getElementById('addAffirmBtn').onclick = () => {
    const text = document.getElementById('affirmText').value.trim();
    if (!text) return;
    const color = activeColor === 'accent' ? 'var(--accent)' : activeColor;
    addElement('text', { text, style: activeStyle, color });
    document.getElementById('affirmText').value = '';
  };
}

// ── Custom URL image ──
document.getElementById('addCustomBtn').onclick = () => {
  const url = document.getElementById('imgUrl').value.trim();
  if (!url) return;
  addElement('image', { src: url });
  document.getElementById('imgUrl').value = '';
};

// ── Remix Feature ──
function initRemix() {
  let activeMood = null;
  let activeLayoutMode = 'scatter';

  document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeMood = btn.dataset.mood;
    };
  });

  const layoutBtns = {
    scatter: document.getElementById('layoutScatter'),
    grid: document.getElementById('layoutGrid'),
    cascade: document.getElementById('layoutCascade'),
    diagonal: document.getElementById('layoutDiagonal'),
  };
  Object.entries(layoutBtns).forEach(([mode, btn]) => {
    btn.onclick = () => {
      Object.values(layoutBtns).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeLayoutMode = mode;
    };
  });

  document.getElementById('remixBtn').onclick = () => {
    const board = state.boards.find(b => b.id === state.activeBoardId);
    if (!board || board.items.length === 0) return;

    // Apply mood colors to text items
    if (activeMood) {
      const palette = MOOD_PALETTES[activeMood];
      board.items.forEach(item => {
        if (item.type === 'text') {
          item.color = palette.accent;
        }
        if (item.type === 'icon') {
          item.iconColor = palette.accent;
        }
      });
    }

    // Apply layout
    const canvasRect = canvas.getBoundingClientRect();
    const W = canvasRect.width || 900;
    const H = canvasRect.height || 700;
    const items = board.items;
    const count = items.length;

    if (activeLayoutMode === 'scatter') {
      items.forEach(item => {
        item.x = randomBetween(40, W - 300);
        item.y = randomBetween(40, H - 200);
        item.rot = randomBetween(-15, 15);
        item.z = ++zCounter;
      });
    } else if (activeLayoutMode === 'grid') {
      const cols = Math.ceil(Math.sqrt(count));
      const cellW = (W - 80) / cols;
      const cellH = (H - 80) / Math.ceil(count / cols);
      items.forEach((item, i) => {
        const col = i % cols, row = Math.floor(i / cols);
        item.x = 40 + col * cellW;
        item.y = 40 + row * cellH;
        item.rot = 0;
        item.z = ++zCounter;
      });
    } else if (activeLayoutMode === 'cascade') {
      items.forEach((item, i) => {
        item.x = 60 + i * 40;
        item.y = 60 + i * 55;
        item.rot = randomBetween(-5, 5);
        item.z = zCounter + i;
      });
    } else if (activeLayoutMode === 'diagonal') {
      items.forEach((item, i) => {
        const t = count > 1 ? i / (count - 1) : 0;
        item.x = 60 + t * (W - 350);
        item.y = 40 + t * (H - 200);
        item.rot = randomBetween(-8, 8);
        item.z = ++zCounter;
      });
    }

    save(); renderCanvas();
    // Toast
    const toast = document.getElementById('remixToast');
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 2000);
  };
}

// ── Theme ──
document.querySelectorAll('.theme-dot').forEach(dot => {
  dot.onclick = () => {
    state.theme = dot.dataset.theme;
    document.body.dataset.theme = state.theme;
    document.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
    dot.classList.add('active');
    save();
  };
});

// ── Clear & Export ──
document.getElementById('clearBtn').onclick = () => {
  const board = state.boards.find(b => b.id === state.activeBoardId);
  if (board && confirm("Clear entire workspace?")) {
    board.items = [];
    save(); renderCanvas();
  }
};

document.getElementById('exportBtn').onclick = async () => {
  if (!window.html2canvas) {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    document.head.appendChild(s);
    s.onload = doExport;
  } else { doExport(); }
};

async function doExport() {
  const canvasEl = document.getElementById('canvas');
  const result = await html2canvas(canvasEl, { useCORS: true, backgroundColor: getComputedStyle(document.body).getPropertyValue('--bg') });
  const link = document.createElement('a');
  link.download = 'visionary-board.png';
  link.href = result.toDataURL('image/png');
  link.click();
}

// ── Board Management ──
function renderBoardList() {
  const list = document.getElementById('boardList'); list.innerHTML = '';
  state.boards.forEach(b => {
    const btn = document.createElement('div');
    btn.className = 'template-item'; btn.textContent = b.name;
    btn.style.fontSize = '0.75rem'; btn.style.fontFamily = "'Jost', sans-serif";
    btn.onclick = () => { state.activeBoardId = b.id; save(); renderCanvas(); renderBoardList(); };
    if (b.id === state.activeBoardId) btn.style.borderColor = 'var(--accent)';
    list.appendChild(btn);
  });
}

document.getElementById('newBoardBtn').onclick = () => {
  document.getElementById('newBoardModal').classList.remove('hidden');
  document.getElementById('overlay').classList.remove('hidden');
};
document.getElementById('confirmBoard').onclick = () => {
  const name = document.getElementById('newBoardName').value; if(!name) return;
  const id = 'b_'+Date.now();
  state.boards.push({ id, name, items: [] });
  state.activeBoardId = id; save();
  document.getElementById('newBoardModal').classList.add('hidden');
  document.getElementById('overlay').classList.add('hidden');
  renderBoardList(); renderCanvas();
};
document.getElementById('cancelBoard').onclick = () => {
  document.querySelectorAll('.modal, #overlay').forEach(m => m.classList.add('hidden'));
};

// ── Init ──
(function init() {
  load();
  if (state.boards.length === 0) {
    state.boards.push({ id: 'b_01', name: 'Main Vision', items: [] });
    state.activeBoardId = 'b_01';
  }
  document.body.dataset.theme = state.theme || 'minimalist';

  // Sync active theme dot
  document.querySelectorAll('.theme-dot').forEach(d => {
    d.classList.toggle('active', d.dataset.theme === state.theme);
  });

  initLibraryTabs();
  renderLibrary();
  renderBoardList();
  renderCanvas();
  initAffirmationStudio();
  initRemix();
})();
