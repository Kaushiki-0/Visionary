let state = { boards: [], activeBoardId: null, theme: 'minimalist' };
let zCounter = 5000;
let selectedEl = null;

// Assets
const ASSETS = {
  pictures: [
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=500',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500',
    'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=500',
    'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=500',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500',
    'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=500'
  ],
  templates: [
    { text: "Manifest Success", style: "serif", color: "var(--accent)" },
    { text: "STAY FOCUSED", style: "sans", color: "var(--text)" },
    { text: "Dream Big", style: "script", color: "var(--accent)" }
  ]
};

// Persistence
function save() { localStorage.setItem('visionary_final_v1', JSON.stringify(state)); }
function load() { 
  const data = localStorage.getItem('visionary_final_v1');
  if (data) state = JSON.parse(data);
}

// ── Drag & Drop from Library ──
function renderLibrary() {
  const container = document.getElementById('libraryContent');
  const cat = document.getElementById('libraryCategory').value;
  container.innerHTML = '';

  if (cat === 'pictures') {
    const grid = document.createElement('div'); grid.className = 'image-grid';
    ASSETS.pictures.forEach(url => {
      const img = document.createElement('img');
      img.src = url; img.className = 'sample-thumb'; img.draggable = true;
      img.onclick = () => addElement('image', { src: url });
      img.ondragstart = (e) => e.dataTransfer.setData('json', JSON.stringify({ type: 'image', src: url }));
      grid.appendChild(img);
    });
    container.appendChild(grid);
  } else {
    ASSETS.templates.forEach(tpl => {
      const div = document.createElement('div');
      div.className = `template-item ${tpl.style}`;
      div.textContent = tpl.text; div.draggable = true;
      div.onclick = () => addElement('text', tpl);
      div.ondragstart = (e) => e.dataTransfer.setData('json', JSON.stringify({ type: 'text', ...tpl }));
      container.appendChild(div);
    });
  }
}

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

// ── Position Changing (Dragging items in Workspace) ──
function addElement(type, data, x = 200, y = 200) {
  const board = state.boards.find(b => b.id === state.activeBoardId);
  if (!board) return alert("Create a Project first!");
  const item = { id: 'i_'+Date.now(), type, ...data, x, y, w: 250, z: ++zCounter, rot: 0 };
  board.items.push(item);
  save(); renderCanvas();
}

function renderCanvas() {
  canvas.innerHTML = '';
  const board = state.boards.find(b => b.id === state.activeBoardId);
  if (!board) return;
  document.getElementById('boardNameDisplay').textContent = board.name;

  board.items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'board-item-el';
    el.style.cssText = `left:${item.x}px; top:${item.y}px; width:${item.w}px; z-index:${item.z}; transform:rotate(${item.rot}deg);`;
    
    if (item.type === 'image') {
      const img = document.createElement('img');
      img.src = item.src; img.style.width = '100%'; img.style.borderRadius = '8px';
      el.appendChild(img);
    } else {
      const txt = document.createElement('div');
      txt.className = `board-text style-${item.style}`;
      txt.style.color = item.color; txt.textContent = item.text;
      el.appendChild(txt);
    }

    const res = document.createElement('div'); res.className = 'resize-handle'; el.appendChild(res);
    const rot = document.createElement('div'); rot.className = 'rotate-handle'; rot.innerHTML = '↻'; el.appendChild(rot);

    bindInteractions(el, res, rot, item);
    el.onmousedown = (e) => {
      if(selectedEl) selectedEl.classList.remove('selected');
      selectedEl = el; el.classList.add('selected');
    };
    canvas.appendChild(el);
  });
}

function bindInteractions(el, res, rot, item) {
  // Move Item (The workspace fix)
  el.addEventListener('mousedown', (e) => {
    if(e.target.className.includes('handle')) return;
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

  // Resize
  res.onmousedown = (e) => {
    e.stopPropagation(); let sw = item.w, sx = e.clientX;
    const onMove = (e) => { item.w = Math.max(100, sw + (e.clientX - sx)); el.style.width = item.w + 'px'; };
    const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); save(); };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  // Rotate
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

// ── Theme & Library Switch ──
document.querySelectorAll('.theme-dot').forEach(dot => {
  dot.onclick = () => {
    state.theme = dot.dataset.theme;
    document.body.dataset.theme = state.theme;
    document.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
    dot.classList.add('active');
    save();
  };
});
document.getElementById('libraryCategory').onchange = renderLibrary;

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
    btn.className = 'template-item serif'; btn.textContent = b.name;
    btn.style.fontSize = '0.75rem';
    btn.onclick = () => { state.activeBoardId = b.id; renderCanvas(); renderBoardList(); };
    if (b.id === state.activeBoardId) btn.style.borderColor = 'var(--accent)';
    list.appendChild(btn);
  });
}

document.getElementById('newBoardBtn').onclick = () => { document.getElementById('newBoardModal').classList.remove('hidden'); document.getElementById('overlay').classList.remove('hidden'); };
document.getElementById('confirmBoard').onclick = () => {
  const name = document.getElementById('newBoardName').value; if(!name) return;
  const id = 'b_'+Date.now(); state.boards.push({ id, name, items: [] });
  state.activeBoardId = id; save(); location.reload();
};
document.getElementById('cancelBoard').onclick = () => { document.querySelectorAll('.modal, #overlay').forEach(m => m.classList.add('hidden')); };

(function init() {
  load();
  if (state.boards.length === 0) {
    state.boards.push({ id: 'b_01', name: 'Main Vision', items: [] });
    state.activeBoardId = 'b_01';
  }
  document.body.dataset.theme = state.theme || 'minimalist';
  renderLibrary(); renderBoardList(); renderCanvas();
})();