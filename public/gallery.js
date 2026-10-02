(function () {
  const sketchList = document.getElementById('sketch-list');

  async function loadSketches() {
    const res = await fetch('/api/sketches');
    const sketches = await res.json();
    sketchList.innerHTML = '';
    if (sketches.length === 0) {
      sketchList.innerHTML = '<p>No sketches yet. Create one!</p>';
      return;
    }
    sketches.forEach(sketch => {
      const card = document.createElement('div');
      card.className = 'sketch-card';
      card.innerHTML = `
        <h3>Sketch ${sketch.id.slice(-6)}</h3>
        <p>Author: ${sketch.author}</p>
        <p>Date: ${new Date(sketch.timestamp).toLocaleDateString()}</p>
        <a href="/?id=${sketch.id}">View</a>
      `;
      sketchList.appendChild(card);
    });
  }

  loadSketches();
})();
