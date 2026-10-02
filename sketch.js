let svgOutputs = [];
let autoCapture = false;
let baseName = 'sketch';

let captureBtn, captureAutoBtn, exportSelectedBtn, exportAllBtn, baseNameInput;
let galleryGrid, countSpan;

function setup() {
  const canvas = createCanvas(800, 600, SVG);
  canvas.parent('canvas-container');

  captureBtn = select('#captureBtn');
  captureAutoBtn = select('#captureAutoBtn');
  exportSelectedBtn = select('#exportSelectedBtn');
  exportAllBtn = select('#exportAllBtn');
  baseNameInput = select('#baseName');
  galleryGrid = select('#galleryGrid');
  countSpan = select('#count');

  captureBtn.mousePressed(captureCurrentSVG);
  captureAutoBtn.mousePressed(() => {
    autoCapture = !autoCapture;
    captureAutoBtn.html(autoCapture ? 'Stop Auto Capture' : 'Auto Capture Every 60f');
  });
  exportSelectedBtn.mousePressed(exportSelectedSVGs);
  exportAllBtn.mousePressed(exportAllSVGs);
  baseNameInput.input(() => baseName = baseNameInput.value() || 'sketch');

  background(240);
}

function draw() {
  background(240);
  fill(255, 100, 100);
  noStroke();
  ellipse(mouseX, mouseY, 60, 60);
  fill(100, 150, 255);
  rect(width - 100, 50, 80, 80);

  if (autoCapture && frameCount % 60 === 0) {
    captureCurrentSVG(true);
  }
}

function captureCurrentSVG(silent = false) {
  const svgEl = document.querySelector('svg');
  if (!svgEl) return;
  const serializer = new XMLSerializer();
  const data = serializer.serializeToString(svgEl);
  const name = `${baseName}_${String(svgOutputs.length + 1).padStart(3, '0')}_${Date.now()}.svg`;
  const id = Date.now() + Math.random();
  svgOutputs.push({ id, name, data, selected: true, timestamp: new Date() });
  renderGallery();
  if (!silent) console.log('Captured:', name);
}

function renderGallery() {
  galleryGrid.html('');
  countSpan.html(svgOutputs.length);
  svgOutputs.forEach((item, idx) => {
    const card = createDiv('');
    card.addClass('card');
    if (item.selected) card.addClass('selected');

    const thumb = createImg('data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(item.data))), item.name);
    thumb.addClass('thumb');

    const meta = createDiv(item.name + '<br>' + item.timestamp.toLocaleTimeString());
    meta.addClass('meta');

    const checkbox = createCheckbox('', item.selected);
    checkbox.parent(card);
    checkbox.changed(() => {
      item.selected = checkbox.checked();
      renderGallery();
    });

    const delBtn = createButton('Delete');
    delBtn.mousePressed(() => {
      svgOutputs.splice(idx, 1);
      renderGallery();
    });

    const renameInput = createInput(item.name.replace('.svg',''));
    renameInput.attribute('placeholder','rename');
    renameInput.input(() => {
      item.name = renameInput.value() + '.svg';
      renderGallery();
    });

    card.child(thumb);
    card.child(meta);
    card.child(delBtn);
    card.child(renameInput);
    galleryGrid.child(card);
  });
}

function downloadBlob(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportSelectedSVGs() {
  const selected = svgOutputs.filter(s => s.selected);
  if (selected.length === 0) return alert('No SVGs selected');
  if (selected.length === 1) {
    downloadBlob(selected[0].data, selected[0].name, 'image/svg+xml');
  } else {
    const zip = new JSZip();
    selected.forEach(item => zip.file(item.name, item.data));
    zip.generateAsync({ type: 'blob' }).then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseName}_selected.zip`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }
}

function exportAllSVGs() {
  if (svgOutputs.length === 0) return alert('No SVGs to export');
  const zip = new JSZip();
  svgOutputs.forEach(item => zip.file(item.name, item.data));
  zip.generateAsync({ type: 'blob' }).then(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}_all_${Date.now()}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  });
}
