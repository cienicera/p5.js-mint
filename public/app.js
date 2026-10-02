(function () {
  // Session-scoped variables
  let currentSketchId = null;
  let sketchCode = '';
  let p5Instance = null;
  const socket = io();

  // DOM elements
  const codeEditor = document.getElementById('code-editor');
  const preview = document.getElementById('preview');
  const runBtn = document.getElementById('run-btn');
  const stopBtn = document.getElementById('stop-btn');
  const mintBtn = document.getElementById('mint-btn');
  const newSketchBtn = document.getElementById('new-sketch-btn');

  // Load sketch from URL params
  function loadSketch() {
    const urlParams = new URLSearchParams(window.location.search);
    const sketchId = urlParams.get('id');
    if (sketchId) {
      currentSketchId = sketchId;
      fetch(`/api/sketch/${sketchId}`)
        .then(res => res.json())
        .then(data => {
          codeEditor.value = data.code;
          sketchCode = data.code;
        })
        .catch(() => {
          resetSession();
        });
    } else {
      resetSession();
    }
  }

  // Reset/clear session state
  function resetSession() {
    currentSketchId = null;
    sketchCode = '';
    codeEditor.value = '';
    if (p5Instance) {
      p5Instance.remove();
      p5Instance = null;
    }
    preview.innerHTML = '';
  }

  // Run the sketch
  function runSketch() {
    sketchCode = codeEditor.value;
    if (p5Instance) {
      p5Instance.remove();
      p5Instance = null;
    }
    preview.innerHTML = '';

    const script = document.createElement('script');
    script.textContent = sketchCode;
    preview.appendChild(script);
    p5Instance = new p5();
  }

  // Stop the sketch
  function stopSketch() {
    if (p5Instance) {
      p5Instance.remove();
      p5Instance = null;
    }
    preview.innerHTML = '';
  }

  // Mint the sketch
  async function mintSketch() {
    if (!sketchCode.trim()) {
      alert('Please write a sketch before minting.');
      return;
    }
    const id = 'sketch_' + Date.now();
    const response = await fetch('/api/sketch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        code: sketchCode,
        author: 'anonymous',
        timestamp: new Date().toISOString()
      })
    });
    const data = await response.json();
    if (data.success) {
      window.location.href = `/gallery?id=${id}`;
    } else {
      alert('Failed to mint sketch.');
    }
  }

  // Event listeners
  runBtn.addEventListener('click', runSketch);
  stopBtn.addEventListener('click', stopSketch);
  mintBtn.addEventListener('click', mintSketch);
  newSketchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    resetSession();
    window.location.href = '/';
  });

  // Clear session on fresh visit (page refresh)
  window.addEventListener('load', () => {
    // If coming from a previous session, clear it
    resetSession();
  });

  // Initialize
  loadSketch();
})();
