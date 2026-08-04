/* ==========================================================================
   Among Us Flashcards Application JavaScript Logic
   ========================================================================== */

// Complete List of Cards (1 Rules, 10 Crewmates, 1 Imposter, 12 Tasks)
const CARDS_DATA = [
  // 1. Rules Card
  {
    id: 'rules-1',
    type: 'rules',
    theme: 'parchment',
    title: 'GAME RULES',
    content: {
      body: [
        'THE WAY THE IMPOSTER KILLS THE CREWMATES IS BY A BRIEF TOUCH ON THE SHOULDER AND BETWEEN EACH KILL IS 40 SECS.',
        'YOU CANNOT SCREAM OR SAY ANYTHING ONCE THE IMPOSTER HAS KILLED YOU.',
        'YOU CANNOT SPEAK DURING THE ROUND.',
        'IF YOU ARE KILLED, SIT DOWN AND DO NOT MAKE A SOUND.'
      ],
      footer: 'GOOD LUCK.'
    }
  },

  // 2. Roles: 10 Crewmate Cards
  ...Array.from({ length: 10 }).map((_, idx) => ({
    id: `role-crewmate-${idx + 1}`,
    type: 'role',
    roleType: 'crewmate',
    theme: 'teal',
    title: 'CREWMATE',
    number: idx + 1,
    content: {
      desc: 'YOUR IDENTITY: CREWMATE.\nCOMPLETE TASKS TO WIN. HELP IDENTIFY THE IMPOSTER.',
      subnote: 'Do not reveal your identity. Your color is NOT your identifier.'
    }
  })),

  // 3. Roles: 1 Imposter Card
  {
    id: 'role-imposter-1',
    type: 'role',
    roleType: 'imposter',
    theme: 'teal',
    title: 'IMPOSTER',
    number: 1,
    content: {
      desc: 'YOUR IDENTITY: IMPOSTER.\nELIMINATE CREWMATES TO WIN. BLEND IN.',
      subnote: 'Keep your identity secret. Touch shoulder to kill (40s cooldown).'
    }
  },

  // 4. Tasks: 12 Task Cards
  {
    id: 'task-1',
    type: 'task',
    theme: 'parchment',
    title: 'ARRANGING THE CUPS',
    desc: 'Take 3 cups from the kitchen and arrange them on the table.',
    ticks: 3,
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 8h1a4 4 0 0 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"/></svg>`
  },
  {
    id: 'task-2',
    type: 'task',
    theme: 'parchment',
    title: 'FILLING THE WATER',
    desc: 'Fill a glass with water and place it in a specific location.',
    ticks: 2,
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`
  },
  {
    id: 'task-3',
    type: 'task',
    theme: 'parchment',
    title: 'RECYCLING',
    desc: 'Throw 3 empty cans in the trash can.',
    ticks: 3,
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`
  },
  {
    id: 'task-4',
    type: 'task',
    theme: 'parchment',
    title: 'TARGETING',
    desc: 'Throw a small ball or object into the laundry basket from a distance of 3 steps.',
    ticks: 4,
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`
  },
  {
    id: 'task-5',
    type: 'task',
    theme: 'parchment',
    title: 'QUICK PUZZLE',
    desc: 'Assemble 4 puzzle pieces or rearrange scattered papers on the table.',
    ticks: 3,
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.47 1.23 0 1.7l-1.568 1.568c-.23.23-.338.556-.289.878.204 1.341-.75 2.518-2.091 2.518h-1.568c-.322 0-.648.108-.878.338l-1.568 1.568c-.47.47-1.23.47-1.7 0l-1.568-1.568c-.23-.23-.556-.338-.878-.289-1.341.204-2.518-.75-2.518-2.091v-1.568c0-.322-.108-.648-.338-.878l-1.568-1.568c-.47-.47-.47-1.23 0-1.7l1.568-1.568c.23-.23.338-.556.289-.878-.204-1.341.75-2.518 2.091-2.518h1.568c.322 0 .648-.108.878-.338l1.568-1.568c.47-.47 1.23-.47 1.7 0l1.568 1.568c.23.23.556.338.878.289 1.341-.204 2.518.75 2.518 2.091v1.568z"/></svg>`
  },
  {
    id: 'task-6',
    type: 'task',
    theme: 'parchment',
    title: 'ORDERING NUMBERS',
    desc: 'Write numbers from 1 to 10 on a piece of paper in ascending order.',
    ticks: 2,
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>`
  },
  {
    id: 'task-7',
    type: 'task',
    theme: 'parchment',
    title: 'BALL BALANCE',
    desc: 'Balance a small ball on a spoon while walking 5 steps without dropping it.',
    ticks: 4,
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4"/><path d="M12 11v10"/></svg>`
  },
  {
    id: 'task-8',
    type: 'task',
    theme: 'parchment',
    title: 'SECRET CODE',
    desc: 'Write a secret 4-digit code on a paper and hide it under a cushion.',
    ticks: 3,
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
  },
  {
    id: 'task-9',
    type: 'task',
    theme: 'parchment',
    title: 'CLEAN FILTER',
    desc: 'Remove 3 small pieces of paper from the tray and drop them in the bin.',
    ticks: 2,
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`
  },
  {
    id: 'task-10',
    type: 'task',
    theme: 'parchment',
    title: 'CALIBRATE DISTRIBUTOR',
    desc: 'Tap 3 specific colored objects in the room in correct sequence.',
    ticks: 3,
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`
  },
  {
    id: 'task-11',
    type: 'task',
    theme: 'parchment',
    title: 'SWIPE CARD',
    desc: 'Slide a flat card through a slot or between two books smoothly.',
    ticks: 2,
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`
  },
  {
    id: 'task-12',
    type: 'task',
    theme: 'parchment',
    title: 'DOWNLOAD DATA',
    desc: 'Hold your phone screen against a designated wall for 5 seconds.',
    ticks: 3,
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`
  }
];

// Global Helper to Render a Card Element
function createCardElement(card) {
  const cardEl = document.createElement('div');
  cardEl.className = `card card-${card.type} ${card.theme}-theme`;
  if (card.roleType === 'imposter') cardEl.classList.add('card-imposter');

  let innerHTML = '';

  if (card.type === 'rules') {
    innerHTML = `
      <div class="card-inner">
        <h2 class="card-heading">${card.title}</h2>
        <div class="rules-body">
          ${card.content.body.map(p => `<p>${p}</p>`).join('')}
          <div class="rules-footer">${card.content.footer}</div>
        </div>
      </div>
    `;
  } else if (card.type === 'role') {
    const isImposter = card.roleType === 'imposter';
    innerHTML = `
      <div class="card-inner">
        <h3 class="role-title">${card.title} ${card.number > 1 ? `#${card.number}` : ''}</h3>
        <p class="role-desc">${card.content.desc.replace('\n', '<br>')}</p>
        <p class="role-subnote">${card.content.subnote}</p>
        <div class="helmet-icon-wrap">
          <svg class="helmet-svg ${isImposter ? 'imposter-helmet' : ''}" viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="3">
            <path d="M18 50 V 22 C 18 12, 42 12, 42 22 V 50 Z"/>
            <ellipse cx="30" cy="24" rx="9" ry="6" stroke-width="3" fill="#aee0d6"/>
            <path d="M14 30 V 46 C 14 48, 18 48, 18 46 V 30 Z"/>
          </svg>
        </div>
      </div>
    `;
  } else if (card.type === 'task') {
    const ticksHtml = Array.from({ length: 5 }).map((_, i) => 
      `<span class="tick ${i < card.ticks ? 'active' : ''}"></span>`
    ).join('');

    innerHTML = `
      <div class="card-inner">
        <div class="card-type-label">TASK:</div>
        <h3 class="task-title">${card.title}</h3>
        <p class="task-desc">${card.desc}</p>
        <div class="card-bottom-gfx">
          ${card.iconSvg || ''}
          <div class="card-bar-ticks">${ticksHtml}</div>
        </div>
      </div>
    `;
  }

  cardEl.innerHTML = innerHTML;

  cardEl.addEventListener('click', () => {
    if (typeof openModalCard === 'function') {
      openModalCard(card);
    }
  });

  return cardEl;
}

document.addEventListener('DOMContentLoaded', () => {

  // Application State
  let currentDeckIndex = 0;
  let activeFilter = 'all';

  // Render Grid View
  function renderGridGallery() {
    const gridContainer = document.getElementById('cardsGridContainer');
    gridContainer.innerHTML = '';

    const filteredCards = CARDS_DATA.filter(card => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'role') return card.type === 'role';
      if (activeFilter === 'task') return card.type === 'task';
      if (activeFilter === 'rules') return card.type === 'rules';
      return true;
    });

    document.getElementById('countAll').textContent = CARDS_DATA.length;

    filteredCards.forEach(card => {
      gridContainer.appendChild(createCardElement(card));
    });
  }

  // Render Flashcard Deck Mode
  function updateDeckCard() {
    const currentCard = CARDS_DATA[currentDeckIndex];
    const frontTarget = document.getElementById('deckCardFront');
    frontTarget.innerHTML = '';
    frontTarget.appendChild(createCardElement(currentCard));

    document.getElementById('deckCurrentIdx').textContent = currentDeckIndex + 1;
    document.getElementById('deckTotalCount').textContent = CARDS_DATA.length;
    document.getElementById('deckCardBadge').textContent = currentCard.title;

    // Reset flip state
    document.getElementById('flipCardWrapper').classList.remove('flipped');
  }

  // Render Print Sheet
  function renderPrintSheet() {
    const printContainer = document.getElementById('printCardsGrid');
    printContainer.innerHTML = '';

    CARDS_DATA.forEach(card => {
      printContainer.appendChild(createCardElement(card));
    });
  }

  // Render a Card to Canvas for High-Resolution PNG Download
  function renderCardToCanvas(card) {
    const canvas = document.createElement('canvas');
    const scale = 2; // High-DPI scale factor
    const width = 320 * scale;
    const height = 450 * scale;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    const isTeal = card.theme === 'teal';
    const isImposter = card.roleType === 'imposter';

    // Background Color
    const bgColor = isTeal ? '#7ca89d' : '#f6eedb';
    const borderColor = isTeal ? '#1c3631' : '#2c251e';
    const textColor = isTeal ? '#132a26' : '#231c15';

    // Outer Card Fill & Rounded Rectangle
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.roundRect(10, 10, width - 20, height - 20, 24);
    ctx.fill();

    // Outer Thick Border
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 8;
    ctx.stroke();

    // Inner Double-Frame Border
    ctx.beginPath();
    ctx.roundRect(28, 28, width - 56, height - 56, 16);
    ctx.lineWidth = 4;
    ctx.stroke();

    // Corner Notches
    const notchSize = 16;
    ctx.strokeRect(28, 28, notchSize, notchSize);
    ctx.strokeRect(width - 28 - notchSize, height - 28 - notchSize, notchSize, notchSize);

    // Text & Content Rendering
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';

    if (card.type === 'rules') {
      ctx.font = 'bold 30px "Space Mono", monospace';
      ctx.fillText(card.title, width / 2, 75);

      ctx.beginPath();
      ctx.moveTo(40, 90);
      ctx.lineTo(width - 40, 90);
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.font = 'bold 20px "Architects Daughter", cursive, sans-serif';
      let y = 130;
      card.content.body.forEach(line => {
        const words = line.split(' ');
        let currentLine = '';
        words.forEach(word => {
          const testLine = currentLine + word + ' ';
          if (ctx.measureText(testLine).width > width - 90) {
            ctx.fillText(currentLine, width / 2, y);
            currentLine = word + ' ';
            y += 28;
          } else {
            currentLine = testLine;
          }
        });
        ctx.fillText(currentLine, width / 2, y);
        y += 40;
      });

      ctx.font = 'bold 24px "Architects Daughter", cursive, sans-serif';
      ctx.fillText(card.content.footer, width / 2, height - 60);

    } else if (card.type === 'role') {
      ctx.font = '900 36px "Outfit", sans-serif';
      ctx.fillText(`${card.title} ${card.number > 1 ? '#' + card.number : ''}`, width / 2, 80);

      ctx.fillStyle = textColor;
      ctx.font = 'bold 20px "Architects Daughter", cursive, sans-serif';
      
      const lines = card.content.desc.split('\n');
      let y = 130;
      lines.forEach(line => {
        ctx.fillText(line, width / 2, y);
        y += 32;
      });

      ctx.font = 'italic 17px "Architects Daughter", cursive, sans-serif';
      ctx.fillText(card.content.subnote, width / 2, y + 20);

      // Draw Helmet Graphic
      const hX = width / 2;
      const hY = height - 120;
      ctx.lineWidth = 4;
      ctx.strokeStyle = borderColor;
      ctx.fillStyle = '#aee0d6';

      // Helmet Visor
      ctx.beginPath();
      ctx.ellipse(hX, hY, 36, 24, 0, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      // Body outline
      ctx.beginPath();
      ctx.roundRect(hX - 32, hY + 15, 64, 45, 10);
      ctx.stroke();

    } else if (card.type === 'task') {
      ctx.textAlign = 'left';
      ctx.font = 'bold 20px "Space Mono", monospace';
      ctx.fillText('TASK:', 50, 70);

      ctx.font = '900 30px "Outfit", sans-serif';
      ctx.fillText(card.title, 50, 115);

      ctx.font = '22px "Architects Daughter", cursive, sans-serif';
      let y = 160;
      const words = card.desc.split(' ');
      let currentLine = '';
      words.forEach(word => {
        const testLine = currentLine + word + ' ';
        if (ctx.measureText(testLine).width > width - 100) {
          ctx.fillText(currentLine, 50, y);
          currentLine = word + ' ';
          y += 32;
        } else {
          currentLine = testLine;
        }
      });
      ctx.fillText(currentLine, 50, y);

      // Ticks
      ctx.fillStyle = borderColor;
      const barY = height - 60;
      for (let i = 0; i < 5; i++) {
        if (i < card.ticks) {
          ctx.fillRect(width - 150 + (i * 20), barY, 14, 24);
        } else {
          ctx.strokeRect(width - 150 + (i * 20), barY, 14, 24);
        }
      }
    }

    return canvas;
  }

  // Trigger PNG Download for a specific Card
  function downloadCardPNG(card) {
    const canvas = renderCardToCanvas(card);
    const fileName = `${card.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}${card.number ? '_' + card.number : ''}.png`;
    const link = document.createElement('a');
    link.download = fileName;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  // Batch Download All Cards
  function downloadAllCardsPNG() {
    let delay = 0;
    CARDS_DATA.forEach((card, index) => {
      setTimeout(() => {
        downloadCardPNG(card);
      }, delay);
      delay += 250; // stagger downloads slightly to prevent browser blocking
    });
  }

  // Download Standalone Printable HTML Package
  function downloadStandaloneHTML() {
    const pageHtml = document.documentElement.outerHTML;
    const blob = new Blob([pageHtml], { type: 'text/html' });
    const link = document.createElement('a');
    link.download = 'among_us_cards_printable_package.html';
    link.href = URL.createObjectURL(blob);
    link.click();
  }

  // Generate and Download Complete PDF Document containing all cards
  function downloadCardsAsPDF() {
    if (typeof window.jspdf === 'undefined' || !window.jspdf.jsPDF) {
      // Fallback if CDN is unreachable or offline
      alert('Generating PDF via browser print view...');
      renderPrintSheet();
      window.print();
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // A4 Page Layout: 3 columns x 3 rows = 9 cards per page
    const colWidth = 58;
    const rowHeight = 82;
    const marginLeft = 12;
    const marginTop = 15;
    const gapX = 6;
    const gapY = 8;
    const cols = 3;
    const rows = 3;

    CARDS_DATA.forEach((card, index) => {
      if (index > 0 && index % (cols * rows) === 0) {
        doc.addPage();
      }

      const pageIdx = index % (cols * rows);
      const col = pageIdx % cols;
      const row = Math.floor(pageIdx / cols);

      const x = marginLeft + col * (colWidth + gapX);
      const y = marginTop + row * (rowHeight + gapY);

      // Render canvas and get image data URL
      const canvas = renderCardToCanvas(card);
      const imgData = canvas.toDataURL('image/png');

      // Add card image to PDF
      doc.addImage(imgData, 'PNG', x, y, colWidth, rowHeight);

      // Light cut lines around card
      doc.setDrawColor(160, 160, 160);
      doc.setLineDashPattern([1, 1], 0);
      doc.rect(x, y, colWidth, rowHeight);
    });

    doc.save('among_us_flashcards_complete_set.pdf');
  }

  // Modal Inspection with Download option
  function openModalCard(card) {
    const modalTarget = document.getElementById('modalCardTarget');
    modalTarget.innerHTML = '';
    
    const cardEl = createCardElement(card);
    modalTarget.appendChild(cardEl);

    // Append Download PNG Button in Modal
    const downloadBtnModal = document.createElement('button');
    downloadBtnModal.className = 'btn btn-primary';
    downloadBtnModal.style.marginTop = '1rem';
    downloadBtnModal.style.width = '100%';
    downloadBtnModal.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      Download PNG Image
    `;
    downloadBtnModal.addEventListener('click', () => downloadCardPNG(card));
    modalTarget.appendChild(downloadBtnModal);

    document.getElementById('cardModal').classList.add('active');
  }

  // Header Download Dropdown Toggle
  const downloadBtn = document.getElementById('downloadBtn');
  const downloadDropdown = document.getElementById('downloadDropdown');
  if (downloadBtn && downloadDropdown) {
    downloadBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      downloadDropdown.classList.toggle('active');
    });

    document.addEventListener('click', () => {
      downloadDropdown.classList.remove('active');
    });

    document.getElementById('downloadPdfBtn').addEventListener('click', () => {
      downloadCardsAsPDF();
    });

    document.getElementById('downloadAllPngBtn').addEventListener('click', () => {
      downloadAllCardsPNG();
    });

    document.getElementById('downloadOfflineHtmlBtn').addEventListener('click', () => {
      downloadStandaloneHTML();
    });
  }

  // Deck Current Card Download
  const downloadCurrentCardBtn = document.getElementById('downloadCurrentCardBtn');
  if (downloadCurrentCardBtn) {
    downloadCurrentCardBtn.addEventListener('click', () => {
      const currentCard = CARDS_DATA[currentDeckIndex];
      downloadCardPNG(currentCard);
    });
  }

  // Event Listeners for Controls & Tabs
  const segmentedBtns = document.querySelectorAll('.segmented-btn');
  segmentedBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      segmentedBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetView = btn.dataset.view;
      document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));

      if (targetView === 'desk') {
        document.getElementById('deskView').classList.add('active');
      } else if (targetView === 'grid') {
        document.getElementById('gridView').classList.add('active');
        renderGridGallery();
      } else if (targetView === 'deck') {
        document.getElementById('deckView').classList.add('active');
        updateDeckCard();
      }
    });
  });

  // Filter Chips
  const filterChips = document.querySelectorAll('.filter-chip');
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeFilter = chip.dataset.filter;
      renderGridGallery();
    });
  });

  // Deck Controls
  document.getElementById('deckPrevBtn').addEventListener('click', () => {
    currentDeckIndex = (currentDeckIndex - 1 + CARDS_DATA.length) % CARDS_DATA.length;
    updateDeckCard();
  });

  document.getElementById('deckNextBtn').addEventListener('click', () => {
    currentDeckIndex = (currentDeckIndex + 1) % CARDS_DATA.length;
    updateDeckCard();
  });

  // 3D Flip Card Toggle
  document.getElementById('flipCardWrapper').addEventListener('click', () => {
    document.getElementById('flipCardWrapper').classList.toggle('flipped');
  });

  // Keyboard navigation for Deck Mode
  document.addEventListener('keydown', (e) => {
    if (document.getElementById('deckView').classList.contains('active')) {
      if (e.key === 'ArrowRight') {
        currentDeckIndex = (currentDeckIndex + 1) % CARDS_DATA.length;
        updateDeckCard();
      } else if (e.key === 'ArrowLeft') {
        currentDeckIndex = (currentDeckIndex - 1 + CARDS_DATA.length) % CARDS_DATA.length;
        updateDeckCard();
      } else if (e.key === ' ') {
        e.preventDefault();
        document.getElementById('flipCardWrapper').classList.toggle('flipped');
      }
    }
  });

  // Modal Close
  document.getElementById('modalCloseBtn').addEventListener('click', () => {
    document.getElementById('cardModal').classList.remove('active');
  });

  document.getElementById('cardModal').addEventListener('click', (e) => {
    if (e.target.id === 'cardModal') {
      document.getElementById('cardModal').classList.remove('active');
    }
  });

  // Print PDF Trigger
  document.getElementById('printBtn').addEventListener('click', () => {
    renderPrintSheet();
    window.print();
  });

  // Initialize main gallery
  renderGridGallery();
  updateDeckCard();
});

/* ==========================================================================
   AUTH MANAGER — Sign Up / Log In / Guest / Profile
   ========================================================================== */

const AuthManager = {
  currentUser: null,      // User object { email, id }
  currentProfile: null,   // { username, avatar_url }
  guestName: null,        // Filled when user chooses "Play as Guest"

  /* ── Initialise on page load ───────────────────────────────────────────── */
  async init() {
    // 1. Restore guest from sessionStorage
    this.guestName = sessionStorage.getItem('guestName') || null;

    // 2. Restore active account from localStorage
    const savedActive = localStorage.getItem('amongus_active_account');
    if (savedActive) {
      try {
        const parsed = JSON.parse(savedActive);
        if (parsed && parsed.username) {
          this.currentUser = { email: parsed.email || 'user@local.app', id: parsed.id || 'user_local' };
          this.currentProfile = { username: parsed.username, avatar_url: parsed.avatar_url || null };
        }
      } catch(e) {
        console.warn('[Auth] restore active account error:', e);
      }
    }

    if (window._supabase) {
      // Listen for auth state changes (login / logout)
      window._supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          this.currentUser = session.user;
          await this.loadProfile();
          this.guestName = null;
          sessionStorage.removeItem('guestName');
        }
        this.renderHeaderButton();
      });

      // Check existing Supabase session
      try {
        const { data: { session } } = await window._supabase.auth.getSession();
        if (session?.user) {
          this.currentUser = session.user;
          await this.loadProfile();
        }
      } catch(e) {
        console.warn('[Auth] getSession error:', e);
      }
    }

    this.renderHeaderButton();
    this.bindAuthEvents();
    this._autoFillPartyFields();
  },

  /* ── Get active display name (for auto-fill) ───────────────────────────── */
  getDisplayName() {
    if (this.currentProfile?.username) return this.currentProfile.username;
    if (this.guestName) return this.guestName;
    return '';
  },

  /* ── Helper: Save account to local storage ──────────────────────────────── */
  _saveAccountLocally(email, username, password, avatarUrl = null) {
    const normEmail = (email || '').trim().toLowerCase();
    const normUser = (username || '').trim();
    if (!normUser) return;

    let accounts = {};
    try {
      accounts = JSON.parse(localStorage.getItem('amongus_accounts') || '{}');
    } catch(e) {}

    accounts[normEmail] = {
      email: normEmail,
      username: normUser,
      password: password || (accounts[normEmail] ? accounts[normEmail].password : ''),
      avatar_url: avatarUrl !== null ? avatarUrl : (accounts[normEmail] ? accounts[normEmail].avatar_url : null)
    };

    localStorage.setItem('amongus_accounts', JSON.stringify(accounts));

    const activeAcc = { email: normEmail, username: normUser, avatar_url: accounts[normEmail].avatar_url };
    localStorage.setItem('amongus_active_account', JSON.stringify(activeAcc));

    this.currentUser = { email: normEmail, id: 'user_' + normEmail.replace(/[^a-z0-9]/g, '') };
    this.currentProfile = { username: normUser, avatar_url: activeAcc.avatar_url };
    this.guestName = null;
    sessionStorage.removeItem('guestName');
  },

  /* ── Load profile from Supabase ─────────────────────────────────────────── */
  async loadProfile() {
    if (!this.currentUser) return;

    // Check local storage profile first
    const savedActive = localStorage.getItem('amongus_active_account');
    if (savedActive) {
      try {
        const parsed = JSON.parse(savedActive);
        if (parsed && parsed.username) {
          this.currentProfile = { username: parsed.username, avatar_url: parsed.avatar_url || null };
        }
      } catch(e) {}
    }

    if (window._supabase && this.currentUser.id) {
      try {
        const { data, error } = await window._supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', this.currentUser.id)
          .maybeSingle();
        if (!error && data && data.username) {
          this.currentProfile = data;
          localStorage.setItem('amongus_active_account', JSON.stringify({
            email: this.currentUser.email,
            username: data.username,
            avatar_url: data.avatar_url
          }));
        }
      } catch(e) {
        console.warn('[Auth] loadProfile error:', e);
      }
    }
  },

  /* ── Sign Up ─────────────────────────────────────────────────────────────── */
  async signUp(email, password, username) {
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedUsername) throw new Error('Username is required');
    if (!trimmedEmail) throw new Error('Email is required');
    if (!password || password.length < 6) throw new Error('Password must be at least 6 characters');

    // 1. Save account locally immediately so user data is stored and login never blocked
    this._saveAccountLocally(trimmedEmail, trimmedUsername, password);

    // 2. Try Supabase Auth in background (if configured)
    if (window._supabase) {
      try {
        const { data, error } = await window._supabase.auth.signUp({
          email: trimmedEmail,
          password: password,
          options: { data: { username: trimmedUsername } }
        });
        if (data && data.user) {
          await window._supabase.from('profiles').upsert({
            id: data.user.id,
            username: trimmedUsername,
            updated_at: new Date().toISOString()
          }).catch(err => console.warn('[Auth] profile upsert note:', err));
        }
      } catch(e) {
        console.warn('[Auth] Supabase signUp note (handled locally):', e);
      }
    }

    this.renderHeaderButton();
    this._autoFillPartyFields();
    return { user: this.currentUser };
  },

  /* ── Log In ──────────────────────────────────────────────────────────────── */
  async logIn(email, password) {
    const trimmedEmail = (email || '').trim().toLowerCase();
    if (!trimmedEmail || !password) throw new Error('Please enter email and password');

    // 1. Check local accounts database first
    let accounts = {};
    try { accounts = JSON.parse(localStorage.getItem('amongus_accounts') || '{}'); } catch(e) {}

    const localMatch = accounts[trimmedEmail];
    if (localMatch && localMatch.password === password) {
      this._saveAccountLocally(trimmedEmail, localMatch.username, password, localMatch.avatar_url);
      this.renderHeaderButton();
      this._autoFillPartyFields();
      return { user: this.currentUser };
    }

    // 2. Try Supabase login
    if (window._supabase) {
      try {
        const { data, error } = await window._supabase.auth.signInWithPassword({ email: trimmedEmail, password });
        if (!error && data?.user) {
          this.currentUser = data.user;
          await this.loadProfile();
          if (!this.currentProfile?.username) {
            const fallbackName = data.user.user_metadata?.username || trimmedEmail.split('@')[0];
            this.currentProfile = { username: fallbackName, avatar_url: null };
          }
          this._saveAccountLocally(trimmedEmail, this.currentProfile.username, password, this.currentProfile.avatar_url);
          this.renderHeaderButton();
          this._autoFillPartyFields();
          return data;
        }

        // AUTO-BYPASS Email Confirmation Error!
        if (error && error.message && error.message.toLowerCase().includes('email not confirmed')) {
          const fallbackUser = localMatch ? localMatch.username : trimmedEmail.split('@')[0];
          this._saveAccountLocally(trimmedEmail, fallbackUser, password);
          this.renderHeaderButton();
          this._autoFillPartyFields();
          return { user: this.currentUser };
        }

        if (error) {
          if (localMatch) {
            this._saveAccountLocally(trimmedEmail, localMatch.username, password, localMatch.avatar_url);
            this.renderHeaderButton();
            this._autoFillPartyFields();
            return { user: this.currentUser };
          }
          throw new Error(error.message);
        }
      } catch(supErr) {
        if (supErr.message && supErr.message.toLowerCase().includes('email not confirmed')) {
          const fallbackUser = localMatch ? localMatch.username : trimmedEmail.split('@')[0];
          this._saveAccountLocally(trimmedEmail, fallbackUser, password);
          this.renderHeaderButton();
          this._autoFillPartyFields();
          return { user: this.currentUser };
        }
        if (localMatch) {
          this._saveAccountLocally(trimmedEmail, localMatch.username, password, localMatch.avatar_url);
          this.renderHeaderButton();
          this._autoFillPartyFields();
          return { user: this.currentUser };
        }
        throw supErr;
      }
    }

    if (localMatch) {
      throw new Error('Incorrect password. Please check your password!');
    }

    // Default fallback: Auto-create account locally & log in!
    const autoUser = trimmedEmail.split('@')[0];
    this._saveAccountLocally(trimmedEmail, autoUser, password);
    this.renderHeaderButton();
    this._autoFillPartyFields();
    return { user: this.currentUser };
  },

  /* ── Log Out ─────────────────────────────────────────────────────────────── */
  async logOut() {
    if (window._supabase) {
      try { await window._supabase.auth.signOut(); } catch(e) {}
    }
    this.currentUser = null;
    this.currentProfile = null;
    this.guestName = null;
    sessionStorage.removeItem('guestName');
    localStorage.removeItem('amongus_active_account');
    this.renderHeaderButton();
    this.showAuthView('authChoiceView');
  },

  /* ── Continue as Guest ───────────────────────────────────────────────────── */
  setGuest(name) {
    const trimmed = name.trim();
    if (!trimmed) throw new Error('Please enter a name');
    this.guestName = trimmed;
    sessionStorage.setItem('guestName', trimmed);
    this.currentUser = null;
    this.currentProfile = null;
    localStorage.removeItem('amongus_active_account');
    this.renderHeaderButton();
    this._autoFillPartyFields();
  },

  /* ── Upload avatar photo ─────────────────────────────────────────────────── */
  async uploadAvatar(file) {
    if (!file) return null;
    const localUrl = URL.createObjectURL(file);
    let avatarUrl = localUrl;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      if (this.currentProfile) this.currentProfile.avatar_url = base64;
      if (this.currentUser?.email) {
        let accounts = {};
        try { accounts = JSON.parse(localStorage.getItem('amongus_accounts') || '{}'); } catch(err) {}
        if (accounts[this.currentUser.email]) {
          accounts[this.currentUser.email].avatar_url = base64;
          localStorage.setItem('amongus_accounts', JSON.stringify(accounts));
        }
        let activeAcc = {};
        try { activeAcc = JSON.parse(localStorage.getItem('amongus_active_account') || '{}'); } catch(err) {}
        activeAcc.avatar_url = base64;
        localStorage.setItem('amongus_active_account', JSON.stringify(activeAcc));
      }
      this.renderHeaderButton();
      this.renderProfileView();
    };
    reader.readAsDataURL(file);

    if (window._supabase && this.currentUser?.id) {
      try {
        const ext = file.name.split('.').pop();
        const path = `avatars/${this.currentUser.id}.${ext}`;
        const { error: upErr } = await window._supabase.storage
          .from('avatars')
          .upload(path, file, { upsert: true });
        if (!upErr) {
          const { data: urlData } = window._supabase.storage.from('avatars').getPublicUrl(path);
          if (urlData?.publicUrl) avatarUrl = urlData.publicUrl;
        }
      } catch(e) {}
    }

    return avatarUrl;
  },

  /* ── Update username ─────────────────────────────────────────────────────── */
  async updateUsername(newUsername) {
    const trimmed = newUsername.trim();
    if (!trimmed) throw new Error('Username cannot be empty');
    if (this.currentProfile) this.currentProfile.username = trimmed;

    if (this.currentUser?.email) {
      this._saveAccountLocally(this.currentUser.email, trimmed, '', this.currentProfile?.avatar_url);
    }

    if (window._supabase && this.currentUser?.id) {
      await window._supabase.from('profiles').update({
        username: trimmed,
        updated_at: new Date().toISOString()
      }).eq('id', this.currentUser.id).catch(err => console.warn(err));
    }

    this.renderHeaderButton();
    this._autoFillPartyFields();
  },

  /* ── Render header account button ───────────────────────────────────────── */
  renderHeaderButton() {
    const miniEl = document.getElementById('accountAvatarMini');
    const labelEl = document.getElementById('accountLabelMini');
    if (!miniEl) return;

    const displayName = this.getDisplayName();

    if (displayName && (this.currentProfile || this.currentUser)) {
      const avatarUrl = this.currentProfile?.avatar_url;
      if (avatarUrl) {
        miniEl.innerHTML = `<img src="${avatarUrl}" alt="avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
      } else {
        miniEl.innerHTML = `<span style="font-size:1.05rem;font-weight:800;color:#f1c40f;">${displayName[0].toUpperCase()}</span>`;
      }
      if (labelEl) labelEl.textContent = displayName;
    } else if (this.guestName) {
      miniEl.innerHTML = `<span style="font-size:0.75rem;font-weight:800;color:#bdc3c7;">G</span>`;
      if (labelEl) labelEl.textContent = this.guestName;
    } else {
      miniEl.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`;
      if (labelEl) labelEl.textContent = 'Account';
    }
  },

  /* ── Show a specific auth view ───────────────────────────────────────────── */
  showAuthView(viewId) {
    const views = ['authChoiceView','authLoginView','authSignupView','authGuestView','authProfileView'];
    views.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = (id === viewId) ? '' : 'none';
    });
  },

  /* ── Open modal, choosing correct view ──────────────────────────────────── */
  openModal() {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    modal.classList.add('active');

    if (this.getDisplayName() && (this.currentProfile || this.currentUser)) {
      this.showAuthView('authProfileView');
      this.renderProfileView();
    } else {
      this.showAuthView('authChoiceView');
    }
  },

  /* ── Populate profile view ───────────────────────────────────────────────── */
  renderProfileView() {
    const usernameEl = document.getElementById('profileUsernameDisplay');
    const emailEl = document.getElementById('profileEmailDisplay');
    const imgEl = document.getElementById('profileAvatarImg');
    const placeholderEl = document.getElementById('profileAvatarPlaceholder');

    const displayName = this.getDisplayName();
    if (usernameEl) usernameEl.textContent = displayName || '—';
    if (emailEl) emailEl.textContent = this.currentUser?.email || 'Guest User';

    const avatarUrl = this.currentProfile?.avatar_url;
    if (imgEl && placeholderEl) {
      if (avatarUrl) {
        imgEl.src = avatarUrl;
        imgEl.style.display = '';
        placeholderEl.style.display = 'none';
      } else {
        imgEl.style.display = 'none';
        placeholderEl.style.display = '';
      }
    }
  },

  /* ── Bind all auth UI events ─────────────────────────────────────────────── */
  bindAuthEvents() {
    // Open modal via header button
    const accountBtn = document.getElementById('accountToggleBtn');
    if (accountBtn) {
      // Remove old listeners by replacing or ensuring single handler
      accountBtn.onclick = () => this.openModal();
    }

    // Close modal
    const closeBtn = document.getElementById('authModalCloseBtn');
    if (closeBtn) {
      closeBtn.onclick = () => document.getElementById('authModal')?.classList.remove('active');
    }

    // Click outside modal card to close
    const modal = document.getElementById('authModal');
    if (modal) {
      modal.onclick = (e) => {
        if (e.target === modal) modal.classList.remove('active');
      };
    }

    // Navigation: choice → views
    const goToLoginBtn = document.getElementById('goToLoginBtn');
    if (goToLoginBtn) goToLoginBtn.onclick = () => this.showAuthView('authLoginView');

    const goToSignupBtn = document.getElementById('goToSignupBtn');
    if (goToSignupBtn) goToSignupBtn.onclick = () => this.showAuthView('authSignupView');

    const goToGuestBtn = document.getElementById('goToGuestBtn');
    if (goToGuestBtn) goToGuestBtn.onclick = () => this.showAuthView('authGuestView');

    // Back buttons
    const loginBackBtn = document.getElementById('loginBackBtn');
    if (loginBackBtn) loginBackBtn.onclick = () => this.showAuthView('authChoiceView');

    const signupBackBtn = document.getElementById('signupBackBtn');
    if (signupBackBtn) signupBackBtn.onclick = () => this.showAuthView('authChoiceView');

    const guestBackBtn = document.getElementById('guestBackBtn');
    if (guestBackBtn) guestBackBtn.onclick = () => this.showAuthView('authChoiceView');

    // Cross-links
    const loginToSignupBtn = document.getElementById('loginToSignupBtn');
    if (loginToSignupBtn) loginToSignupBtn.onclick = () => this.showAuthView('authSignupView');

    const signupToLoginBtn = document.getElementById('signupToLoginBtn');
    if (signupToLoginBtn) signupToLoginBtn.onclick = () => this.showAuthView('authLoginView');

    // ── Login submit ──
    const loginSubmitBtn = document.getElementById('loginSubmitBtn');
    if (loginSubmitBtn) {
      loginSubmitBtn.onclick = async () => {
        const email = document.getElementById('loginEmailInput')?.value.trim();
        const password = document.getElementById('loginPasswordInput')?.value;
        const errorEl = document.getElementById('loginError');
        const btn = document.getElementById('loginSubmitBtn');
        if (!email || !password) {
          if (errorEl) { errorEl.textContent = 'Please fill in all fields.'; errorEl.style.display = ''; }
          return;
        }
        if (btn) { btn.textContent = '🔄 Logging in...'; btn.disabled = true; }
        try {
          await this.logIn(email, password);
          if (errorEl) errorEl.style.display = 'none';
          this.showAuthView('authProfileView');
          this.renderProfileView();
          this._autoFillPartyFields();
        } catch(e) {
          if (errorEl) { errorEl.textContent = e.message; errorEl.style.display = ''; }
        } finally {
          if (btn) { btn.textContent = '🔑 Log In'; btn.disabled = false; }
        }
      };
    }

    // Allow Enter key in password field to submit login
    const loginPasswordInput = document.getElementById('loginPasswordInput');
    if (loginPasswordInput) {
      loginPasswordInput.onkeypress = (e) => {
        if (e.key === 'Enter') document.getElementById('loginSubmitBtn')?.click();
      };
    }

    // ── Sign up submit ──
    const signupSubmitBtn = document.getElementById('signupSubmitBtn');
    if (signupSubmitBtn) {
      signupSubmitBtn.onclick = async () => {
        const username = document.getElementById('signupUsernameInput')?.value.trim();
        const email = document.getElementById('signupEmailInput')?.value.trim();
        const password = document.getElementById('signupPasswordInput')?.value;
        const errorEl = document.getElementById('signupError');
        const btn = document.getElementById('signupSubmitBtn');
        if (!username || !email || !password) {
          if (errorEl) { errorEl.textContent = 'Please fill in all fields.'; errorEl.style.display = ''; }
          return;
        }
        if (password.length < 6) {
          if (errorEl) { errorEl.textContent = 'Password must be at least 6 characters.'; errorEl.style.display = ''; }
          return;
        }
        if (btn) { btn.textContent = '🔄 Creating account...'; btn.disabled = true; }
        try {
          await this.signUp(email, password, username);
          if (errorEl) errorEl.style.display = 'none';
          this.showAuthView('authProfileView');
          this.renderProfileView();
          this._autoFillPartyFields();
        } catch(e) {
          if (errorEl) { errorEl.textContent = e.message; errorEl.style.display = ''; }
        } finally {
          if (btn) { btn.textContent = '✨ Create Account'; btn.disabled = false; }
        }
      };
    }

    // ── Guest submit ──
    const guestSubmitBtn = document.getElementById('guestSubmitBtn');
    if (guestSubmitBtn) {
      guestSubmitBtn.onclick = () => {
        const name = document.getElementById('guestNameInput')?.value;
        const errorEl = document.getElementById('guestError');
        try {
          this.setGuest(name);
          if (errorEl) errorEl.style.display = 'none';
          document.getElementById('authModal')?.classList.remove('active');
          this._autoFillPartyFields();
        } catch(e) {
          if (errorEl) { errorEl.textContent = e.message; errorEl.style.display = ''; }
        }
      };
    }
    const guestNameInput = document.getElementById('guestNameInput');
    if (guestNameInput) {
      guestNameInput.onkeypress = (e) => {
        if (e.key === 'Enter') document.getElementById('guestSubmitBtn')?.click();
      };
    }

    // ── Log out ──
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.onclick = async () => {
        await this.logOut();
      };
    }

    // ── Edit username ──
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
      editProfileBtn.onclick = () => {
        const wrap = document.getElementById('profileEditWrap');
        if (wrap) {
          wrap.style.display = '';
          const input = document.getElementById('profileEditUsername');
          if (input) input.value = this.getDisplayName() || '';
        }
      };
    }

    const profileCancelEditBtn = document.getElementById('profileCancelEditBtn');
    if (profileCancelEditBtn) {
      profileCancelEditBtn.onclick = () => {
        const wrap = document.getElementById('profileEditWrap');
        if (wrap) wrap.style.display = 'none';
      };
    }

    const profileSaveBtn = document.getElementById('profileSaveBtn');
    if (profileSaveBtn) {
      profileSaveBtn.onclick = async () => {
        const newName = document.getElementById('profileEditUsername')?.value;
        const errorEl = document.getElementById('profileEditError');
        const btn = document.getElementById('profileSaveBtn');
        if (btn) { btn.textContent = '🔄 Saving...'; btn.disabled = true; }
        try {
          await this.updateUsername(newName);
          if (errorEl) errorEl.style.display = 'none';
          this.renderProfileView();
          this.renderHeaderButton();
          const wrap = document.getElementById('profileEditWrap');
          if (wrap) wrap.style.display = 'none';
          this._autoFillPartyFields();
        } catch(e) {
          if (errorEl) { errorEl.textContent = e.message; errorEl.style.display = ''; }
        } finally {
          if (btn) { btn.textContent = '💾 Save'; btn.disabled = false; }
        }
      };
    }

    // ── Avatar photo upload ──
    const avatarCircle = document.getElementById('profileAvatarCircle');
    const fileInput = document.getElementById('avatarFileInput');
    if (avatarCircle && fileInput) {
      avatarCircle.onclick = () => fileInput.click();
      fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const imgEl = document.getElementById('profileAvatarImg');
        const placeholderEl = document.getElementById('profileAvatarPlaceholder');
        const localUrl = URL.createObjectURL(file);
        if (imgEl) { imgEl.src = localUrl; imgEl.style.display = ''; }
        if (placeholderEl) placeholderEl.style.display = 'none';
        const finalUrl = await this.uploadAvatar(file);
        if (finalUrl && imgEl) imgEl.src = finalUrl;
        this.renderHeaderButton();
        fileInput.value = '';
      };
    }
  },

  /* ── Auto-fill party name/player name fields ─────────────────────────────── */
  _autoFillPartyFields() {
    const displayName = this.getDisplayName();
    if (!displayName) return;

    // Host name input
    const hostNameInput = document.getElementById('hostNameInput');
    if (hostNameInput) {
      hostNameInput.value = displayName;
      hostNameInput.dispatchEvent(new Event('input'));
    }
    // Join player name input
    const joinPlayerNameInput = document.getElementById('joinPlayerNameInput');
    if (joinPlayerNameInput) {
      joinPlayerNameInput.value = displayName;
    }
  }
};

/* ==========================================================================
   HOST & JOIN A PARTY (PLAY WITH FRIENDS) MODULE
   ========================================================================== */

const PartyManager = {
  state: {
    roomCode: '',
    hostName: '',
    partyName: '',
    players: [],
    maxPlayers: 4,
    settings: {
      imposters: 1,
      killCooldown: 40,
      tasksPerPlayer: 3
    },
    assignedGame: null,
    joinedPlayer: null,
    revealIndex: 0,
    killTimerInterval: null,
    killTimerSeconds: 40,
    isCooldownRunning: false,
    discussionTimerInterval: null,
    discussionSeconds: 90,
    isDiscussionRunning: false,
    votes: {}, // { [voterName]: targetName }
    ejectionResult: null,
    winningTeam: null, // 'crewmate' | 'imposter'
    gameEndReason: '',
    gameEndInterval: null,
    emergencyCooldownSeconds: 0,
    emergencyCooldownInterval: null,
    emergencyUsedByTask: false,
    isDisbanded: false,
    hasRolledCard: false,
    npcPlayers: []
  },

  channel: null,

  init() {
    this.generateRoomCode();
    this.bindEvents();
    this.renderPlayerChips();
    this.listenStateSync();

    // Initialise Auth (sign up / log in / guest)
    AuthManager.init();


    // Check for public URL direct room join hash (e.g. #room=AMONG-8294)
    if (window.location.hash && window.location.hash.includes('room=')) {
      const match = window.location.hash.match(/room=([A-Za-z0-9\-]+)/);
      if (match && match[1]) {
        const urlRoomCode = match[1].toUpperCase();
        setTimeout(() => {
          const joinModal = document.getElementById('joinPartyModal');
          if (joinModal) {
            joinModal.classList.add('active');
            this.showStepInModal('joinPartyModal', 'joinSetupStep');
            const codeInput = document.getElementById('joinRoomCodeInput');
            if (codeInput) codeInput.value = urlRoomCode;
          }
        }, 300);
      }
    }
  },

  // ============================================================
  //  SUPABASE REAL-TIME SYNC LAYER
  //  Replaces localStorage + BroadcastChannel (same-device only)
  //  with Supabase Realtime (works across any device on internet)
  // ============================================================

  async broadcastStateUpdate() {
    try {
      if (!this.state.roomCode) return;

      const payload = {
        roomCode: this.state.roomCode,
        partyName: this.state.partyName || 'My Among Us Game',
        hostName: this.state.hostName,
        players: this.state.players,
        npcPlayers: this.state.npcPlayers || [],
        maxPlayers: this.state.maxPlayers || 4,
        settings: this.state.settings,
        assignedGame: this.state.assignedGame,
        revealIndex: this.state.revealIndex || 0,
        isEmergencyActive: !!this.state.isEmergencyActive,
        discussionSeconds: this.state.discussionSeconds || 90,
        killTimerSeconds: this.state.killTimerSeconds || 40,
        votes: this.state.votes || {},
        ejectionResult: this.state.ejectionResult || null,
        winningTeam: this.state.winningTeam || null,
        gameEndReason: this.state.gameEndReason || '',
        emergencyCooldownSeconds: this.state.emergencyCooldownSeconds || 0,
        isDisbanded: !!this.state.isDisbanded,
        timestamp: Date.now()
      };

      if (window._supabase) {
        await window._supabase.from('game_rooms').upsert({
          room_code: this.state.roomCode.toUpperCase(),
          state: payload
        }, { onConflict: 'room_code' });
      }
    } catch(e) {
      console.warn('[Supabase] broadcastStateUpdate error:', e);
    }
  },

  async getRoomData(roomCode) {
    if (!roomCode) return null;
    const cleanCode = roomCode.trim().toUpperCase();
    try {
      if (window._supabase) {
        const { data, error } = await window._supabase
          .from('game_rooms')
          .select('state')
          .eq('room_code', cleanCode)
          .maybeSingle();
        if (error) { console.warn('[Supabase] getRoomData error:', error); return null; }
        return data?.state || null;
      }
      return null;
    } catch(e) {
      console.warn('[Supabase] getRoomData exception:', e);
      return null;
    }
  },

  listenStateSync() {
    try {
      if (!window._supabase) {
        console.warn('[Supabase] client not ready, sync disabled');
        return;
      }

      // Subscribe to ALL changes on game_rooms table (Postgres Realtime)
      this._realtimeChannel = window._supabase
        .channel('game_rooms_realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'game_rooms' },
          (payload) => {
            const newState = payload.new?.state;
            if (newState) this.handleRemoteSync(newState);
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('[Supabase] Realtime connected ✅');
          }
        });
    } catch(e) {
      console.warn('[Supabase] listenStateSync error:', e);
    }
  },

  playEmergencySiren() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.25);
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch(e) {}
  },

  handleRemoteSync(data) {
    if (!data || !data.roomCode) return;
    
    // Process sync ONLY if it matches this tab's active roomCode
    if (!this.state.roomCode || data.roomCode.toUpperCase() !== this.state.roomCode.toUpperCase()) {
      return;
    }

    this.state.roomCode = data.roomCode;
    if (data.partyName !== undefined) this.state.partyName = data.partyName;
    if (data.hostName !== undefined) this.state.hostName = data.hostName;
    if (data.players) this.state.players = data.players;
    if (data.npcPlayers) this.state.npcPlayers = data.npcPlayers;
    if (data.maxPlayers) this.state.maxPlayers = data.maxPlayers;
    if (data.settings) this.state.settings = data.settings;
    if (data.assignedGame) this.state.assignedGame = data.assignedGame;
    if (data.votes) this.state.votes = data.votes;
    if (data.isDisbanded) {
      if (this.state.isDisbanded) return;
      this.state.assignedGame = null;
      this.state.players = [];
      this.state.joinedPlayer = null;
      this.state.votes = {};
      this.state.ejectionResult = null;
      this.state.winningTeam = null;
      this.state.isDisbanded = true;
      this.state.hasRolledCard = false;
      this.state.roomCode = '';

      this.pauseKillCooldown();
      this.pauseDiscussionTimer();
      if (this.state.emergencyCooldownInterval) clearInterval(this.state.emergencyCooldownInterval);

      const partyModal = document.getElementById('partyModal');
      const joinModal = document.getElementById('joinPartyModal');
      if (partyModal) partyModal.classList.remove('active');
      if (joinModal) joinModal.classList.remove('active');

      if (window.location.hash && window.location.hash.includes('room=')) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }

      alert('💥 The party room has been disbanded by the host!');
      return;
    }

    if (data.ejectionResult !== undefined) this.state.ejectionResult = data.ejectionResult;
    if (data.revealIndex !== undefined) this.state.revealIndex = data.revealIndex;
    if (data.winningTeam !== undefined) this.state.winningTeam = data.winningTeam;
    if (data.gameEndReason !== undefined) this.state.gameEndReason = data.gameEndReason;
    if (data.emergencyCooldownSeconds !== undefined) {
      this.state.emergencyCooldownSeconds = data.emergencyCooldownSeconds;
      this.updateEmergencyButtonState();
    }

    // Update Party Header Titles if set
    if (this.state.partyName) {
      const headerTitle = document.getElementById('hostPartyHeaderTitle');
      if (headerTitle) headerTitle.textContent = this.state.partyName.toUpperCase();
      const badgeTitle = document.getElementById('hostPartyBadgeTitle');
      if (badgeTitle) badgeTitle.textContent = `ROOM: ${this.state.roomCode}`;
    }

    // Sync Emergency Meeting State across all devices
    if (data.isEmergencyActive) {
      if (!this.state.isEmergencyActive) {
        this.playEmergencySiren();
      }
      this.state.isEmergencyActive = true;
      const hostOverlay = document.getElementById('emergencyMeetingOverlay');
      const clientOverlay = document.getElementById('joinEmergencyMeetingOverlay');
      if (hostOverlay) hostOverlay.style.display = 'flex';
      if (clientOverlay) clientOverlay.style.display = 'flex';
      if (data.discussionSeconds !== undefined) {
        this.state.discussionSeconds = data.discussionSeconds;
        this.updateDiscussionTimerDisplay();
      }
      this.renderVotingGrid();
    } else if (data.isEmergencyActive === false && this.state.isEmergencyActive) {
      this.state.isEmergencyActive = false;
      const hostOverlay = document.getElementById('emergencyMeetingOverlay');
      const clientOverlay = document.getElementById('joinEmergencyMeetingOverlay');
      if (hostOverlay) hostOverlay.style.display = 'none';
      if (clientOverlay) clientOverlay.style.display = 'none';
    }

    // If winning team set, trigger Game End screen with 10s auto-return (only once)!
    if (this.state.winningTeam && !this._isGameEndScreenActive) {
      this._isGameEndScreenActive = true;
      this.triggerGameEndScreen(this.state.winningTeam, this.state.gameEndReason);
    } else if (!this.state.winningTeam) {
      this._isGameEndScreenActive = false;
    }

    // Refresh Host Lobby & Waiting Room
    this.renderPlayerChips();
    this.renderWaitingLobby();
    this.renderDashboardPlayers();
    this.updateGlobalTaskProgress();

    // If joined player active, refresh personal dashboard
    if (this.state.joinedPlayer && this.state.assignedGame) {
      const matched = this.state.assignedGame.players.find(p => p.name.toLowerCase() === this.state.joinedPlayer.name.toLowerCase());
      if (matched) {
        this.state.joinedPlayer = matched;
        this.renderJoinedPlayerDashboard();
      }
    }

    // Turn-Based Pass & Play Reveal Step Sync across all devices
    if (this.state.assignedGame && this.state.assignedGame.players) {
      const curIdx = this.state.revealIndex || 0;
      const totalPlayers = this.state.assignedGame.players.length;

      if (curIdx < totalPlayers) {
        const joinModal = document.getElementById('joinPartyModal');
        const partyModal = document.getElementById('partyModal');
        if (joinModal && joinModal.classList.contains('active')) {
          joinModal.classList.remove('active');
          if (partyModal) partyModal.classList.add('active');
        }
        const setupStepHost = document.getElementById('partySetupStep');
        const waitingStep = document.getElementById('joinWaitingStep');
        if ((setupStepHost && setupStepHost.classList.contains('active')) || (waitingStep && waitingStep.classList.contains('active'))) {
          if (partyModal) partyModal.classList.add('active');
          this.showStep('partyRevealStep');
        }
        this.setupRevealStep();
      } else if (curIdx >= totalPlayers && !this.state.winningTeam) {
        if (this.state.joinedPlayer) {
          this.showStepInModal('joinPartyModal', 'joinDashboardStep');
          this.renderJoinedPlayerDashboard();
        } else {
          this.showStep('partyDashboardStep');
          this.renderDashboardPlayers();
        }
      }
    }
  },

  generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'AMONG-';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.state.roomCode = code;
    const codeEl = document.getElementById('roomCodeDisplay');
    if (codeEl) codeEl.textContent = code;
    const dashCodeEl = document.getElementById('dashRoomCode');
    if (dashCodeEl) dashCodeEl.textContent = `ROOM: ${code}`;
    this.broadcastStateUpdate();
  },

  getMinRequiredPlayers(imposters) {
    switch (parseInt(imposters)) {
      case 1: return 4;
      case 2: return 6;
      case 3: return 8;
      case 4: return 10;
      case 5: return 12;
      default: return 4;
    }
  },

  setPlayerCount(targetCount) {
    const clamped = Math.max(4, Math.min(14, targetCount));
    this.state.maxPlayers = clamped;

    const selectEl = document.getElementById('playerCountSelect');
    if (selectEl) selectEl.value = String(clamped);

    this.renderPlayerChips();
    this.renderWaitingLobby();
    this.broadcastStateUpdate();
  },

  renderPlayerChips() {
    const listEl = document.getElementById('playersChipsList');
    const badgeEl = document.getElementById('playerCountBadge');
    if (!listEl) return;

    const maxCap = this.state.maxPlayers || 4;
    badgeEl.textContent = `${this.state.players.length} / ${maxCap}`;

    const selectEl = document.getElementById('playerCountSelect');
    if (selectEl) {
      selectEl.value = String(maxCap);
    }

    if (this.state.players.length === 0) {
      listEl.innerHTML = `<div style="color: #7f8c8d; font-size: 0.85rem; font-style: italic; padding: 0.5rem 0;">No players added yet. Enter host name, add player names, or share room code!</div>`;
    } else {
      listEl.innerHTML = this.state.players.map((name, idx) => {
        const isHost = (this.state.hostName && name.toLowerCase() === this.state.hostName.toLowerCase());
        const isNpc = this.state.npcPlayers && this.state.npcPlayers.some(n => n.toLowerCase() === name.toLowerCase());
        const npcBadge = isNpc ? `<small class="npc-badge" style="background:rgba(230,126,34,0.25); color:#e67e22; border:1px solid rgba(230,126,34,0.4); font-size:0.75rem; padding:1px 6px; border-radius:8px; margin-left:5px; font-weight:bold;">(npc)</small>` : '';
        return `
          <div class="player-chip ${isHost ? 'host-chip' : ''}">
            <span>${isHost ? '👑' : '👤'} ${name}${npcBadge}</span>
            <button class="remove-p-btn" data-idx="${idx}">&times;</button>
          </div>
        `;
      }).join('');

      listEl.querySelectorAll('.remove-p-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.target.getAttribute('data-idx'));
          const removedName = this.state.players[idx];
          if (removedName && this.state.hostName && removedName.toLowerCase() === this.state.hostName.toLowerCase()) {
            this.state.hostName = '';
            const hostInput = document.getElementById('hostNameInput');
            if (hostInput) hostInput.value = '';
          }
          if (removedName && this.state.npcPlayers) {
            this.state.npcPlayers = this.state.npcPlayers.filter(n => n.toLowerCase() !== removedName.toLowerCase());
          }
          this.state.players.splice(idx, 1);
          this.renderPlayerChips();
          this.renderWaitingLobby();
          this.broadcastStateUpdate();
        });
      });
    }
  },

  addPlayer(name) {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (this.state.players.length >= 14) {
      alert('Maximum 14 players allowed!');
      return;
    }
    if (this.state.players.some(p => p.toLowerCase() === trimmed.toLowerCase())) {
      alert(`Player name "${trimmed}" already exists in the room! Please use a unique player name.`);
      return;
    }
    if (!this.state.npcPlayers) this.state.npcPlayers = [];
    if (!this.state.npcPlayers.some(n => n.toLowerCase() === trimmed.toLowerCase())) {
      this.state.npcPlayers.push(trimmed);
    }
    this.state.players.push(trimmed);
    this.renderPlayerChips();
    this.renderWaitingLobby();
    this.broadcastStateUpdate();
  },

  showStepInModal(modalId, stepId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('active');
    modal.querySelectorAll('.party-step').forEach(step => {
      step.classList.remove('active');
    });
    const target = document.getElementById(stepId);
    if (target) target.classList.add('active');
  },

  showStep(stepId) {
    this.showStepInModal('partyModal', stepId);
  },

  fisherYatesShuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },

  startGame() {
    const imposterCount = parseInt(document.getElementById('imposterCountSelect').value);
    const killCooldown = parseInt(document.getElementById('killCooldownSelect').value);
    const tasksPerPlayer = parseInt(document.getElementById('tasksPerPlayerSelect').value);

    // Dynamic Thresholds: 1 Imposter -> 4 players, 2 Imposters -> 6 players, 3 Imposters -> 8 players, 4 Imposters -> 10 players, 5 Imposters -> 12 players
    const minRequired = this.getMinRequiredPlayers(imposterCount);

    if (this.state.players.length < minRequired) {
      alert(`⚠️ Player Threshold Not Met!\n\nA ${imposterCount} Imposter lobby requires at least ${minRequired} players to start.\nCurrently joined: ${this.state.players.length}/${minRequired} players.\n\nPlease add more players or share Room Code ${this.state.roomCode}!`);
      return;
    }

    this.state.settings = { imposters: imposterCount, killCooldown, tasksPerPlayer };

    const availableTasks = CARDS_DATA.filter(c => c.type === 'task');

    // Deduplicate players list case-insensitively before role assignment
    const uniquePlayers = [];
    this.state.players.forEach(p => {
      if (!uniquePlayers.some(u => u.toLowerCase() === p.toLowerCase())) {
        uniquePlayers.push(p);
      }
    });
    this.state.players = uniquePlayers;

    // Pick EXACTLY imposterCount random indices from original player order
    // 1 Imposter lobby: Every player has equal low probability (e.g. 25% for 4 players). Player 1 has no bias!
    // Someone is 100% guaranteed to be chosen as Imposter.
    const imposterIndices = new Set();
    const targetImposterCount = Math.min(imposterCount, this.state.players.length - 1);
    while (imposterIndices.size < Math.max(1, targetImposterCount)) {
      const randIdx = Math.floor(Math.random() * this.state.players.length);
      imposterIndices.add(randIdx);
    }

    const assignedPlayers = this.state.players.map((name, i) => {
      const isImposter = imposterIndices.has(i);
      
      const taskShuffled = this.fisherYatesShuffle(availableTasks);
      const assignedTasks = taskShuffled.slice(0, tasksPerPlayer).map(t => ({
        id: t.id,
        title: t.title,
        desc: t.desc || (t.content ? t.content.desc : ''),
        completed: false,
        isFake: isImposter
      }));

      return {
        id: `p_${i + 1}_${name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        name,
        role: isImposter ? 'imposter' : 'crewmate',
        tasks: assignedTasks,
        alive: true
      };
    });

    this.state.assignedGame = {
      players: assignedPlayers
    };

    // Reset votes, win state, and start Imposter kill cooldown
    this.state.votes = {};
    this.state.ejectionResult = null;
    this.state.winningTeam = null;
    this.state.gameEndReason = '';
    this.state.killTimerSeconds = killCooldown || 40;
    this.startKillCooldown();
    // Emergency button starts on 25s cooldown at game start
    this.startEmergencyCooldown(25);

    if (this.state.joinedPlayer) {
      const matched = assignedPlayers.find(p => p.name.toLowerCase() === this.state.joinedPlayer.name.toLowerCase());
      if (matched) {
        this.state.joinedPlayer = matched;
      }
    }

    this.broadcastStateUpdate();

    this.state.revealIndex = 0;
    this._lastSetupRevealIndex = null;
    this._isRollingCard = false;

    // Show 20-second Game Rules overlay before starting pass-and-play
    this.showGameRulesOverlay();
  },

  /* ── 20-Second Game Rules Overlay before pass-and-play begins ─────────── */
  showGameRulesOverlay() {
    const overlay = document.getElementById('gameRulesOverlay');
    if (!overlay) {
      // Fallback: go directly to reveal step
      this.showStep('partyRevealStep');
      this.setupRevealStep();
      return;
    }

    overlay.classList.remove('hidden');
    overlay.style.setProperty('display', 'flex', 'important');

    // Scroll modal to top
    const modalContent = document.querySelector('.party-modal-content');
    if (modalContent) modalContent.scrollTop = 0;

    let secondsLeft = 20;
    const numEl = document.getElementById('rulesCountdownNumber');
    const barEl = document.getElementById('rulesCountdownBar');
    if (numEl) numEl.textContent = secondsLeft;
    if (barEl) barEl.style.width = '100%';

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      if (this._rulesTimer) {
        clearInterval(this._rulesTimer);
        this._rulesTimer = null;
      }
      overlay.classList.add('hidden');
      overlay.style.setProperty('display', 'none', 'important');
      this.showStep('partyRevealStep');
      this.setupRevealStep();
      if (!this.state.joinedPlayer) {
        this.broadcastStateUpdate();
      }
    };

    // "I'm Ready" skip button
    const readyBtn = document.getElementById('rulesReadyBtn');
    if (readyBtn) {
      readyBtn.onclick = (e) => {
        if (e) e.preventDefault();
        finish();
      };
    }

    if (this._rulesTimer) clearInterval(this._rulesTimer);

    this._rulesTimer = setInterval(() => {
      secondsLeft--;
      if (numEl) numEl.textContent = Math.max(0, secondsLeft);
      if (barEl) barEl.style.width = `${Math.max(0, (secondsLeft / 20) * 100)}%`;
      if (secondsLeft <= 0) {
        finish();
      }
    }, 1000);
  },



  setupRevealStep() {
    if (!this.state.assignedGame || !this.state.assignedGame.players) return;

    const curIdx = this.state.revealIndex || 0;
    const totalPlayers = this.state.assignedGame.players.length;

    if (curIdx >= totalPlayers) {
      this.startLiveDashboard();
      return;
    }

    const player = this.state.assignedGame.players[curIdx];

    const isCurrentPlayerNpc = this.state.npcPlayers && this.state.npcPlayers.some(n => n.toLowerCase() === player.name.toLowerCase());
    const isHostDevice = !this.state.joinedPlayer;

    document.getElementById('revealPlayerTitle').textContent = `Pass device to ${player.name}${isCurrentPlayerNpc ? ' (npc)' : ''} (${curIdx + 1}/${totalPlayers})`;
    document.getElementById('curtainPlayerName').textContent = `${player.name}${isCurrentPlayerNpc ? ' (npc)' : ''}`;

    const progressBadge = document.getElementById('hostPlayerProgressBadge');
    if (progressBadge) {
      progressBadge.textContent = `Player ${curIdx + 1} of ${totalPlayers} (${player.name}${isCurrentPlayerNpc ? ' npc' : ''})`;
    }

    const hostBtn = document.getElementById('hostSwitchNextPlayerBtn');
    if (hostBtn) {
      const nextIdx = curIdx + 1;
      if (nextIdx < totalPlayers) {
        const nextPlayer = this.state.assignedGame.players[nextIdx];
        hostBtn.innerHTML = `👑 Host: Switch to ${nextPlayer.name} (${nextIdx + 1}/${totalPlayers}) ➔`;
      } else {
        hostBtn.innerHTML = `👑 Host: Launch Live Host Dashboard! 🚀`;
      }
    }

    const hostControlBar = document.getElementById('hostRevealControlBar');
    if (hostControlBar) {
      hostControlBar.style.display = isHostDevice ? 'flex' : 'none';
    }

    const myPlayerName = (this.state.joinedPlayer ? this.state.joinedPlayer.name : this.state.hostName) || '';
    
    let isMyTurn = false;
    if (isHostDevice) {
      // On Host device running pass-and-play, host device can always roll for any player!
      isMyTurn = true;
    } else if (isCurrentPlayerNpc) {
      isMyTurn = false;
    } else {
      // For remote client player on their own device, ONLY that player's device can see & click the roll button
      isMyTurn = (myPlayerName && myPlayerName.trim().toLowerCase() === player.name.trim().toLowerCase());
    }

    const revealBtn = document.getElementById('revealCardBtn');
    const waitingNotice = document.getElementById('curtainWaitingNotice');

    if (isMyTurn) {
      if (revealBtn) {
        revealBtn.style.display = 'inline-block';
        revealBtn.innerHTML = `🎲 Tap to Roll ${player.name}'s Secret Role & Tasks`;
      }
      if (waitingNotice) waitingNotice.style.display = 'none';
    } else {
      if (revealBtn) revealBtn.style.display = 'none';
      if (waitingNotice) {
        waitingNotice.style.display = 'block';
        waitingNotice.innerHTML = `
          <div style="background:rgba(241,196,15,0.15); border:1.5px solid rgba(241,196,15,0.4); border-radius:12px; padding:1.25rem; text-align:center; margin-top:1rem;">
            <div style="font-size:2.5rem; margin-bottom:0.5rem;" class="auto-return-box">⌛</div>
            <h3 style="color:#f1c40f; font-size:1.15rem; margin-bottom:0.4rem;">WAITING FOR YOUR TURN TO ROLL...</h3>
            <p style="color:#ecf0f1; font-size:0.95rem;">Current Turn: <strong>👤 ${player.name}${isCurrentPlayerNpc ? ' (npc)' : ''}</strong> (${curIdx + 1}/${totalPlayers})</p>
            <p style="color:#bdc3c7; font-size:0.85rem; margin-top:0.5rem; font-style:italic;">Please wait until ${player.name} finishes rolling their secret role & tasks!</p>
          </div>
        `;
      }
    }

    const frontView = document.getElementById('curtainFrontView');
    const revealedView = document.getElementById('curtainRevealedContent');
    const isSamePlayerIndex = (this._lastSetupRevealIndex === curIdx);
    const isRevealedOrRolling = this._isRollingCard || (revealedView && revealedView.style.display === 'block');

    if (!isSamePlayerIndex || !isRevealedOrRolling) {
      if (frontView) frontView.style.display = 'block';
      if (revealedView) revealedView.style.display = 'none';
    }

    this._lastSetupRevealIndex = curIdx;
  },

  // Interactive Luck-Based Sequential Card Rolling Reel Engine
  triggerSequentialCardRollingAnimation(player, onComplete) {
    this._isRollingCard = true;
    const rollingStage = document.getElementById('cardRollingStage');
    if (!rollingStage) {
      this._isRollingCard = false;
      onComplete();
      return;
    }

    rollingStage.style.display = 'flex';

    const stepBadge = document.getElementById('reelStepBadge');
    const reelCard = document.getElementById('slotReelCard');
    const typeTag = document.getElementById('reelCardTypeTag');
    const iconEl = document.getElementById('reelCardIcon');
    const titleEl = document.getElementById('reelCardTitle');
    const subEl = document.getElementById('reelCardSub');
    const bannerText = document.getElementById('rollingBannerText');
    const dotsEl = document.getElementById('reelProgressDots');

    const tasksCount = player.role === 'crewmate' ? (player.tasks ? player.tasks.length : (this.state.settings.tasksPerPlayer || 3)) : 0;
    const totalRolls = 1 + tasksCount; // 1 for Role, N for Tasks

    // Render dot indicators
    if (dotsEl) {
      dotsEl.innerHTML = Array.from({ length: totalRolls }).map((_, i) => `
        <div class="reel-dot ${i === 0 ? 'active' : ''}" id="rdot-${i}"></div>
      `).join('');
    }

    const playBeep = (freq = 400, dur = 0.05) => {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        osc.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + dur);
      } catch(e) {}
    };

    const roleCandidates = [
      { icon: '🟢', title: 'CREWMATE', sub: 'Complete Tasks' },
      { icon: '🔪', title: 'IMPOSTER', sub: 'Sabotage & Kill' },
      { icon: '🔍', title: 'DETECTIVE', sub: 'Identify Imposter' },
      { icon: '⚡', title: 'ENGINEER', sub: 'Vent Maintenance' }
    ];

    const availableTasks = CARDS_DATA.filter(c => c.type === 'task');

    let currentRollIdx = 0;

    const executeNextRoll = () => {
      if (currentRollIdx >= totalRolls) {
        setTimeout(() => {
          rollingStage.style.display = 'none';
          this._isRollingCard = false;
          onComplete();
        }, 500);
        return;
      }

      // Update dot statuses
      for (let i = 0; i < totalRolls; i++) {
        const dot = document.getElementById(`rdot-${i}`);
        if (dot) {
          dot.className = `reel-dot ${i < currentRollIdx ? 'done' : (i === currentRollIdx ? 'active' : '')}`;
        }
      }

      if (reelCard) reelCard.className = 'slot-reel-card reel-spin';

      if (currentRollIdx === 0) {
        // ROLL 1: SECRET ROLE
        if (stepBadge) stepBadge.textContent = '🎲 STEP 1: ROLLING SECRET ROLE...';
        if (bannerText) bannerText.textContent = '🎲 ROLLING ROLE LUCK...';

        let count = 0;
        const spinInterval = setInterval(() => {
          const cand = roleCandidates[count % roleCandidates.length];
          if (typeTag) typeTag.textContent = 'ROLE CARD';
          if (iconEl) iconEl.textContent = cand.icon;
          if (titleEl) titleEl.textContent = cand.title;
          if (subEl) subEl.textContent = cand.sub;
          playBeep(320 + (count % 4) * 60);
          count++;
        }, 70);

        setTimeout(() => {
          clearInterval(spinInterval);

          const isImp = player.role === 'imposter';
          if (typeTag) typeTag.textContent = 'ASSIGNED ROLE';
          if (iconEl) iconEl.textContent = isImp ? '🔪' : '🟢';
          if (titleEl) titleEl.textContent = isImp ? 'IMPOSTER' : 'CREWMATE';
          if (subEl) subEl.textContent = isImp ? 'Eliminate Crewmates' : 'Complete Tasks';

          if (reelCard) reelCard.className = `slot-reel-card ${isImp ? 'reel-locked-imposter' : 'reel-locked'}`;
          playBeep(isImp ? 220 : 680, 0.25);

          currentRollIdx++;
          setTimeout(executeNextRoll, 1200);
        }, 1400);

      } else {
        // ROLL N: TASK CARD (2, 3, or 4 tasks!)
        const taskIdx = currentRollIdx - 1;
        const targetTask = (player.tasks && player.tasks[taskIdx]) ? player.tasks[taskIdx] : { title: `Task ${taskIdx + 1}`, desc: 'Perform assigned task' };

        if (stepBadge) stepBadge.textContent = `📋 STEP ${currentRollIdx + 1}: ROLLING TASK ${taskIdx + 1} OF ${tasksCount}...`;
        if (bannerText) bannerText.textContent = `📋 DRAWING TASK ${taskIdx + 1} CARD...`;

        let count = 0;
        const spinInterval = setInterval(() => {
          const candTask = availableTasks[count % availableTasks.length] || { title: 'Task Card', desc: 'Shuffling tasks...' };
          const taskDescText = candTask.desc || (candTask.content ? candTask.content.desc : 'Real-life task');
          if (typeTag) typeTag.textContent = `TASK ${taskIdx + 1} OF ${tasksCount}`;
          if (iconEl) iconEl.textContent = '📋';
          if (titleEl) titleEl.textContent = candTask.title || 'Task Card';
          if (subEl) subEl.textContent = taskDescText.slice(0, 30) + '...';
          playBeep(440 + (count % 4) * 50);
          count++;
        }, 70);

        setTimeout(() => {
          clearInterval(spinInterval);

          if (typeTag) typeTag.textContent = `TASK ${taskIdx + 1} ASSIGNED`;
          if (iconEl) iconEl.textContent = '✅';
          if (titleEl) titleEl.textContent = targetTask.title;
          if (subEl) subEl.textContent = targetTask.desc;

          if (reelCard) reelCard.className = 'slot-reel-card reel-locked';
          playBeep(620, 0.2);

          currentRollIdx++;
          setTimeout(executeNextRoll, 1000);
        }, 1100);
      }
    };

    executeNextRoll();
  },

  revealSecretRole() {
    const curIdx = this.state.revealIndex;
    const player = this.state.assignedGame.players[curIdx];

    this.triggerSequentialCardRollingAnimation(player, () => {
      const isImposter = player.role === 'imposter';

      const cardContainer = document.getElementById('secretRoleCardContainer');
      cardContainer.innerHTML = '';

      const roleCardData = isImposter 
        ? { type: 'role', theme: 'teal', roleType: 'imposter', title: 'IMPOSTER', content: { desc: 'YOUR IDENTITY: IMPOSTER.\nELIMINATE CREWMATES TO WIN. BLEND IN.', subnote: 'Keep your identity secret. Touch shoulder to kill.' } }
        : { type: 'role', theme: 'teal', roleType: 'crewmate', title: 'CREWMATE', content: { desc: 'YOUR IDENTITY: CREWMATE.\nCOMPLETE TASKS TO WIN. HELP IDENTIFY THE IMPOSTER.', subnote: 'Do not reveal your identity.' } };

      const cardEl = createCardElement(roleCardData);
      cardContainer.appendChild(cardEl);

      const tasksBox = document.getElementById('secretTasksBox');
      const tasksList = document.getElementById('secretTasksList');

      if (isImposter) {
        tasksBox.querySelector('h4').textContent = '🔪 IMPOSTER OBJECTIVES & FAKE TASKS:';
        const fakeTasksHtml = (player.tasks && player.tasks.length > 0)
          ? player.tasks.map(t => `<li style="color:#f39c12; margin-top:0.3rem;">• <strong>🎭 FAKE TASK: ${t.title}</strong>: ${t.desc}</li>`).join('')
          : '';
        tasksList.innerHTML = `
          <li>• <strong>🔪 ELIMINATE CREWMATES:</strong> Touch shoulder secretly when alone (${this.state.settings ? this.state.settings.killCooldown : 40}s cooldown).</li>
          <li style="margin-top:0.6rem; font-weight:bold; color:#f39c12;">• 🎭 YOUR FAKE TASKS TO BLEND IN:</li>
          ${fakeTasksHtml}
        `;
      } else {
        tasksBox.querySelector('h4').textContent = `📋 YOUR ASSIGNED REAL-LIFE TASKS (${player.tasks.length}):`;
        tasksList.innerHTML = player.tasks.map(t => `
          <li>• <strong>${t.title}</strong>: ${t.desc}</li>
        `).join('');
      }

      const totalPlayers = this.state.assignedGame.players.length;
      const nextIdx = curIdx + 1;
      const confirmBtn = document.getElementById('confirmMemorizedBtn');
      const confirmBtnTop = document.getElementById('confirmMemorizedBtnTop');
      const hostBtn = document.getElementById('hostSwitchNextPlayerBtn');
      const bannerText = document.getElementById('autoPassBannerText');

      if (nextIdx < totalPlayers) {
        const nextPlayer = this.state.assignedGame.players[nextIdx];
        const btnText = `✅ I've Memorized My Role ➔ Pass Device to ${nextPlayer.name} (${nextIdx + 1}/${totalPlayers})`;
        if (confirmBtn) confirmBtn.innerHTML = btnText;
        if (confirmBtnTop) confirmBtnTop.innerHTML = btnText;
        if (hostBtn) hostBtn.innerHTML = `👑 Host: Switch to ${nextPlayer.name} (${nextIdx + 1}/${totalPlayers}) ➔`;
        if (bannerText) bannerText.innerHTML = `Role & tasks rolled for <strong>${player.name}</strong>! Switch to <strong>${nextPlayer.name}</strong> (${nextIdx + 1}/${totalPlayers}) so they can roll too.`;
      } else {
        const btnText = `✅ All Players Memorized ➔ Launch Live Host Dashboard! 🚀`;
        if (confirmBtn) confirmBtn.innerHTML = btnText;
        if (confirmBtnTop) confirmBtnTop.innerHTML = btnText;
        if (hostBtn) hostBtn.innerHTML = `👑 Host: All Players Rolled ➔ Launch Live Dashboard 🚀`;
        if (bannerText) bannerText.innerHTML = `🎉 All players have rolled their secret roles & tasks! Click below to launch live game.`;
      }

      document.getElementById('curtainFrontView').style.display = 'none';
      document.getElementById('curtainRevealedContent').style.display = 'block';

      const modalContent = document.querySelector('.party-modal-content');
      if (modalContent) modalContent.scrollTop = 0;
    });
  },

  nextRevealPlayer() {
    this.state.revealIndex++;
    if (this.state.assignedGame && this.state.assignedGame.players && this.state.revealIndex < this.state.assignedGame.players.length) {
      this.setupRevealStep();
      const modalContent = document.querySelector('.party-modal-content');
      if (modalContent) modalContent.scrollTop = 0;
      this.broadcastStateUpdate();
    } else {
      this.broadcastStateUpdate();
      this.startLiveDashboard();
    }
  },

  startLiveDashboard() {
    this.showStep('partyDashboardStep');
    this.state.killTimerSeconds = this.state.settings.killCooldown;
    this.updateCooldownDisplay();
    this.renderDashboardPlayers();
    this.updateGlobalTaskProgress();
  },

  async joinParty(code, name) {
    let cleanInputCode = (code || '').trim().toUpperCase();
    let trimmedName = (name || '').trim();

    if (!trimmedName && typeof AuthManager !== 'undefined') {
      trimmedName = AuthManager.getDisplayName();
    }

    if (!cleanInputCode) {
      alert('Please enter the Room Code from the host!');
      return;
    }
    if (!trimmedName) {
      alert('Please enter your player name!');
      return;
    }

    // Automatically prepend 'AMONG-' if user only typed the 4-digit code (e.g. 'MZ62')
    if (!cleanInputCode.startsWith('AMONG-') && !cleanInputCode.includes('-')) {
      cleanInputCode = 'AMONG-' + cleanInputCode;
    }

    // Show loading state on the join button
    const joinBtn = document.getElementById('submitJoinPartyBtn');
    const origText = joinBtn ? joinBtn.textContent : '';
    if (joinBtn) { joinBtn.textContent = '🔍 Looking up room...'; joinBtn.disabled = true; }

    // Lookup target room from Supabase
    let existingRoom = await this.getRoomData(cleanInputCode);

    // Restore button
    if (joinBtn) { joinBtn.textContent = origText; joinBtn.disabled = false; }

    // Fallback: if host is on the same device/tab, use in-memory state
    if (!existingRoom && this.state.roomCode &&
        this.state.roomCode.toUpperCase().replace(/[^A-Z0-9]/g, '') === cleanInputCode.replace(/[^A-Z0-9]/g, '')) {
      existingRoom = {
        roomCode: this.state.roomCode,
        hostName: this.state.hostName,
        players: this.state.players,
        maxPlayers: this.state.maxPlayers || 4,
        settings: this.state.settings,
        assignedGame: this.state.assignedGame
      };
    }

    if (!existingRoom) {
      alert(`⚠️ Room "${cleanInputCode}" Not Found!\n\nMake sure the host has created the room and is connected to the internet.`);
      return;
    }

    // Connect this device's session to the target room
    this.state.roomCode = existingRoom.roomCode;
    this.state.hostName = existingRoom.hostName || '';
    this.state.players = existingRoom.players || [];
    this.state.npcPlayers = existingRoom.npcPlayers || [];
    this.state.maxPlayers = existingRoom.maxPlayers || 4;
    if (existingRoom.settings) this.state.settings = existingRoom.settings;
    if (existingRoom.assignedGame) this.state.assignedGame = existingRoom.assignedGame;

    // If real player joins with the name of an NPC, remove the NPC tag!
    if (this.state.npcPlayers) {
      this.state.npcPlayers = this.state.npcPlayers.filter(n => n.toLowerCase() !== trimmedName.toLowerCase());
    }

    const isAlreadyInRoom = this.state.players.some(p => p.toLowerCase() === trimmedName.toLowerCase());

    if (this.state.players.length >= this.state.maxPlayers && !isAlreadyInRoom) {
      alert(`This party room is full (${this.state.players.length}/${this.state.maxPlayers} players)!`);
      return;
    }

    if (!isAlreadyInRoom) {
      this.state.players.push(trimmedName);
    }

    // IF GAME IS ALREADY ACTIVE (Host has started or dealt cards):
    if (this.state.assignedGame) {
      let matchedPlayer = this.state.assignedGame.players.find(p => p.name.toLowerCase() === trimmedName.toLowerCase());

      if (!matchedPlayer) {
        // Assign new joined player a Crewmate role with random tasks (NEVER Imposter!)
        const availableTasks = CARDS_DATA.filter(c => c.type === 'task');
        const taskShuffled = this.fisherYatesShuffle(availableTasks);
        const assignedTasks = taskShuffled.slice(0, this.state.settings.tasksPerPlayer || 3).map(t => ({
          id: t.id,
          title: t.title,
          desc: t.desc || (t.content ? t.content.desc : ''),
          completed: false
        }));

        matchedPlayer = {
          id: `p_mid_${Date.now()}_${trimmedName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
          name: trimmedName,
          role: 'crewmate',
          tasks: assignedTasks,
          alive: true
        };
        this.state.assignedGame.players.push(matchedPlayer);
      }

      this.state.joinedPlayer = matchedPlayer;
      await this.broadcastStateUpdate();

      // Immediately trigger Sequential Card Rolling animation and open player dashboard!
      this.triggerSequentialCardRollingAnimation(matchedPlayer, () => {
        this.showStepInModal('joinPartyModal', 'joinDashboardStep');
        this.renderJoinedPlayerDashboard();
      });
      return;
    }

    // IF GAME HAS NOT STARTED YET (in waiting lobby stage):
    this.renderPlayerChips();
    this.state.joinedPlayer = {
      name: trimmedName,
      role: 'crewmate',
      tasks: [],
      alive: true
    };

    await this.broadcastStateUpdate();
    this.showStepInModal('joinPartyModal', 'joinWaitingStep');
    this.renderWaitingLobby();
  },


  renderWaitingLobby() {
    const titleEl = document.getElementById('waitingRoomTitle');
    if (titleEl) titleEl.textContent = `ROOM: ${this.state.roomCode || 'AMONG-LIVE'}`;

    const imposterCount = parseInt(document.getElementById('imposterCountSelect')?.value || 1);
    const minRequired = this.getMinRequiredPlayers(imposterCount);

    const countEl = document.getElementById('waitingPlayerCount');
    const reqEl = document.getElementById('waitingRequiredCount');
    if (countEl) countEl.textContent = this.state.players.length;
    if (reqEl) reqEl.textContent = minRequired;

    const chipsEl = document.getElementById('waitingPlayersChips');
    if (chipsEl) {
      chipsEl.innerHTML = this.state.players.map(p => {
        const isNpc = this.state.npcPlayers && this.state.npcPlayers.some(n => n.toLowerCase() === p.toLowerCase());
        const npcBadge = isNpc ? `<small class="npc-badge" style="background:rgba(230,126,34,0.25); color:#e67e22; border:1px solid rgba(230,126,34,0.4); font-size:0.75rem; padding:1px 6px; border-radius:8px; margin-left:5px; font-weight:bold;">(npc)</small>` : '';
        return `
          <div class="player-chip">
            <span>👤 ${p}${npcBadge}</span>
          </div>
        `;
      }).join('');
    }
  },

  createPartySubmit() {
    this.state.assignedGame = null;
    this.state.isDisbanded = false;
    this.state.hasRolledCard = false;
    // Read from the pre-screen input (partyNameInputPre) first, then the lobby input
    const preInput = document.getElementById('partyNameInputPre');
    const lobbyInput = document.getElementById('partyNameInput');
    const val = (preInput ? preInput.value.trim() : '') || (lobbyInput ? lobbyInput.value.trim() : '');
    this.state.partyName = val || 'My Among Us Game';

    // Sync the lobby input field with what was entered
    if (lobbyInput) lobbyInput.value = this.state.partyName;

    const headerTitle = document.getElementById('hostPartyHeaderTitle');
    if (headerTitle) headerTitle.textContent = this.state.partyName.toUpperCase();
    const badgeTitle = document.getElementById('hostPartyBadgeTitle');
    if (badgeTitle) badgeTitle.textContent = `ROOM: ${this.state.roomCode}`;

    // Auto-fill hostName from logged-in user or guest account
    const accountDisplayName = (typeof AuthManager !== 'undefined') ? AuthManager.getDisplayName() : '';
    if (accountDisplayName) {
      this.state.hostName = accountDisplayName;
      if (!this.state.players.includes(accountDisplayName)) {
        this.state.players.unshift(accountDisplayName);
      }
    }

    this.showStep('partySetupStep');
    const hostInput = document.getElementById('hostNameInput');
    if (hostInput) hostInput.value = this.state.hostName || '';
    this.renderPlayerChips();
    this.broadcastStateUpdate();
  },

  renderJoinedPlayerDashboard() {
    const player = this.state.joinedPlayer;
    if (!player) return;

    document.getElementById('joinRoomTag').textContent = `ROOM: ${this.state.roomCode || 'AMONG-LIVE'}`;
    document.getElementById('joinPlayerHeader').textContent = `${player.name.toUpperCase()}'S DASHBOARD`;

    const cardHolder = document.getElementById('joinSecretRoleHolder');
    cardHolder.innerHTML = '';
    const isImposter = player.role === 'imposter';
    const roleCardData = isImposter
      ? { type: 'role', theme: 'teal', roleType: 'imposter', title: 'IMPOSTER', content: { desc: 'YOUR IDENTITY: IMPOSTER.\nELIMINATE CREWMATES TO WIN. BLEND IN.', subnote: 'Keep your identity secret. Touch shoulder to kill.' } }
      : { type: 'role', theme: 'teal', roleType: 'crewmate', title: 'CREWMATE', content: { desc: 'YOUR IDENTITY: CREWMATE.\nCOMPLETE TASKS TO WIN. HELP IDENTIFY THE IMPOSTER.', subnote: 'Do not reveal your identity.' } };

    const cardEl = createCardElement(roleCardData);
    cardHolder.appendChild(cardEl);

    // Imposter Cooldown Widget on Player Personal Screen
    const imposterWidget = document.getElementById('joinImposterCooldownWidget');
    if (imposterWidget) {
      imposterWidget.style.display = isImposter ? 'block' : 'none';
      if (isImposter) {
        this.updateCooldownDisplay();
        this.renderImposterTargetsGrid();
      }
    }

    // Update emergency button state based on role and cooldown
    this.updateEmergencyButtonState();

    const tasksContainer = document.getElementById('joinTasksListContainer');
    const taskTag = document.getElementById('joinTaskCountTag');

    if (isImposter) {
      const completedCount = player.tasks ? player.tasks.filter(t => t.completed).length : 0;
      const totalCount = player.tasks ? player.tasks.length : 0;
      taskTag.textContent = `${completedCount} / ${totalCount} Fake Tasks`;

      const fakeTasksListHtml = (player.tasks && player.tasks.length > 0)
        ? player.tasks.map((t, idx) => `
          <div class="join-task-card-item ${t.completed ? 'completed' : ''}" style="border-left: 3px solid #f39c12;">
            <input type="checkbox" data-jidx="${idx}" ${t.completed ? 'checked' : ''}>
            <div class="join-task-info">
              <h4 style="color:#f39c12;">🎭 FAKE TASK: ${t.title}</h4>
              <p>${t.desc}</p>
            </div>
          </div>
        `).join('')
        : '';

      tasksContainer.innerHTML = `
        <div class="join-task-card-item" style="border-left: 3px solid #e74c3c;">
          <div class="join-task-info">
            <h4 style="color:#e74c3c;">🔪 Primary Objective: Eliminate Crewmates</h4>
            <p>Touch crewmates secretly on the shoulder when no one is looking (40s cooldown between kills).</p>
          </div>
        </div>
        <div style="margin-top:1rem; margin-bottom:0.5rem; font-weight:bold; color:#f39c12; font-size:0.9rem; letter-spacing:0.5px;">
          🎭 YOUR FAKE TASKS (Pretend to do these around the room to blend in!):
        </div>
        ${fakeTasksListHtml}
      `;

      tasksContainer.querySelectorAll('input[type="checkbox"]').forEach(chk => {
        chk.addEventListener('change', (e) => {
          const idx = parseInt(e.target.getAttribute('data-jidx'));
          player.tasks[idx].completed = e.target.checked;
          this.renderJoinedPlayerDashboard();
          this.broadcastStateUpdate();
        });
      });
    } else {
      const completedCount = player.tasks ? player.tasks.filter(t => t.completed).length : 0;
      const totalCount = player.tasks ? player.tasks.length : 0;
      taskTag.textContent = `${completedCount} / ${totalCount} Done`;

      if (player.tasks) {
        tasksContainer.innerHTML = player.tasks.map((t, idx) => `
          <div class="join-task-card-item ${t.completed ? 'completed' : ''}">
            <input type="checkbox" data-jidx="${idx}" ${t.completed ? 'checked' : ''}>
            <div class="join-task-info">
              <h4>${t.title}</h4>
              <p>${t.desc}</p>
            </div>
          </div>
        `).join('');

        tasksContainer.querySelectorAll('input[type="checkbox"]').forEach(chk => {
          chk.addEventListener('change', (e) => {
            const idx = parseInt(e.target.getAttribute('data-jidx'));
            const wasCompleted = player.tasks[idx].completed;
            player.tasks[idx].completed = e.target.checked;
            this.renderJoinedPlayerDashboard();
            this.updateGlobalTaskProgress();
            this.broadcastStateUpdate();
            this.checkWinLossConditions();
            // If crewmate just completed a task and emergency is on cooldown, clear cooldown
            if (e.target.checked && !wasCompleted && !this.state.isEmergencyActive) {
              if (this.state.emergencyCooldownInterval) {
                clearInterval(this.state.emergencyCooldownInterval);
                this.state.emergencyCooldownInterval = null;
              }
              this.state.emergencyCooldownSeconds = 0;
              this.updateEmergencyButtonState();
            }
          });
        });
      }
    }
    this.updateGlobalTaskProgress();
  },

  renderImposterTargetsGrid() {
    const targetsGrid = document.getElementById('imposterTargetsGrid');
    if (!targetsGrid || !this.state.assignedGame) return;

    const meName = this.state.joinedPlayer ? this.state.joinedPlayer.name.toLowerCase() : (this.state.hostName || '').toLowerCase();
    const aliveTargets = this.state.assignedGame.players.filter(p => p.alive && p.name.toLowerCase() !== meName && p.role !== 'imposter');

    if (aliveTargets.length === 0) {
      targetsGrid.innerHTML = `<div style="color:#bdc3c7; font-size:0.85rem; text-align:center; grid-column: 1/-1;">No crewmate targets remaining.</div>`;
      return;
    }

    const isReady = (this.state.killTimerSeconds || 0) === 0;

    targetsGrid.innerHTML = aliveTargets.map(p => `
      <div style="background:rgba(0,0,0,0.4); border:1px solid ${isReady ? '#e74c3c' : 'rgba(255,255,255,0.1)'}; border-radius:8px; padding:0.6rem; text-align:center;">
        <div style="font-weight:bold; font-size:0.9rem; margin-bottom:0.4rem; color:#fff;">👤 ${p.name}</div>
        <button class="btn btn-danger btn-sm target-kill-btn" data-target="${p.name}" ${isReady ? '' : 'disabled'} style="width:100%; font-size:0.8rem; font-weight:bold; opacity:${isReady ? '1' : '0.5'};">
          ${isReady ? '🔪 KILL' : `⏱️ ${this.state.killTimerSeconds}s`}
        </button>
      </div>
    `).join('');

    targetsGrid.querySelectorAll('.target-kill-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetName = e.target.getAttribute('data-target');
        if (targetName) this.killTargetPlayer(targetName);
      });
    });
  },

  killTargetPlayer(targetName) {
    if (!this.state.assignedGame) return;
    const target = this.state.assignedGame.players.find(p => p.name.toLowerCase() === targetName.toLowerCase());
    if (!target || !target.alive) return;

    target.alive = false;
    this.resetKillCooldown();
    this.startKillCooldown();

    this.broadcastStateUpdate();
    this.renderJoinedPlayerDashboard();
    this.renderDashboardPlayers();
    this.checkWinLossConditions();
  },

  renderVotingGrid() {
    const hostGrid = document.getElementById('hostVotingPlayersGrid');
    const clientGrid = document.getElementById('clientVotingPlayersGrid');
    if (!hostGrid && !clientGrid) return;
    if (!this.state.assignedGame) return;

    const alivePlayers = this.state.assignedGame.players.filter(p => p.alive);
    const votes = this.state.votes || {};

    // Count votes per target
    const voteCounts = {};
    Object.values(votes).forEach(target => {
      voteCounts[target] = (voteCounts[target] || 0) + 1;
    });

    const currentVoter = this.state.joinedPlayer ? this.state.joinedPlayer.name : (this.state.hostName || 'Host');
    const hasVoted = !!votes[currentVoter];

    const optionsHtml = [
      ...alivePlayers.map(p => {
        const count = voteCounts[p.name] || 0;
        const isMyVote = votes[currentVoter] === p.name;
        return `
          <div style="background:${isMyVote ? 'rgba(46,204,113,0.2)' : 'rgba(255,255,255,0.08)'}; border:1.5px solid ${isMyVote ? '#2ecc71' : 'rgba(255,255,255,0.15)'}; border-radius:8px; padding:0.6rem; text-align:center;">
            <div style="font-weight:bold; font-size:0.9rem; margin-bottom:0.3rem;">👤 ${p.name}</div>
            <div style="font-size:0.75rem; color:#f1c40f; margin-bottom:0.4rem;">🗳️ ${count} vote${count === 1 ? '' : 's'}</div>
            <button class="btn ${isMyVote ? 'btn-success' : 'btn-primary'} btn-sm vote-btn" data-vname="${p.name}" ${hasVoted ? 'disabled' : ''} style="width:100%; font-size:0.8rem;">
              ${isMyVote ? '✅ Voted' : '🗳️ Vote'}
            </button>
          </div>
        `;
      }),
      (() => {
        const skipCount = voteCounts['SKIP'] || 0;
        const isMySkip = votes[currentVoter] === 'SKIP';
        return `
          <div style="background:${isMySkip ? 'rgba(241,196,15,0.2)' : 'rgba(255,255,255,0.05)'}; border:1.5px solid ${isMySkip ? '#f1c40f' : 'rgba(255,255,255,0.15)'}; border-radius:8px; padding:0.6rem; text-align:center;">
            <div style="font-weight:bold; font-size:0.9rem; margin-bottom:0.3rem;">🚫 SKIP VOTE</div>
            <div style="font-size:0.75rem; color:#f1c40f; margin-bottom:0.4rem;">🗳️ ${skipCount} vote${skipCount === 1 ? '' : 's'}</div>
            <button class="btn btn-secondary btn-sm vote-btn" data-vname="SKIP" ${hasVoted ? 'disabled' : ''} style="width:100%; font-size:0.8rem;">
              ${isMySkip ? '✅ Skipped' : '🚫 Skip'}
            </button>
          </div>
        `;
      })()
    ].join('');

    [hostGrid, clientGrid].forEach(grid => {
      if (grid) {
        grid.innerHTML = optionsHtml;
        grid.querySelectorAll('.vote-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const vname = e.target.getAttribute('data-vname');
            if (vname) this.castVote(vname);
          });
        });
      }
    });
  },

  castVote(targetName) {
    const voter = this.state.joinedPlayer ? this.state.joinedPlayer.name : (this.state.hostName || 'Host');
    if (!this.state.votes) this.state.votes = {};
    this.state.votes[voter] = targetName;

    this.renderVotingGrid();
    this.broadcastStateUpdate();

    // If all alive players have voted, trigger tally!
    if (this.state.assignedGame) {
      const alivePlayers = this.state.assignedGame.players.filter(p => p.alive);
      const votedCount = Object.keys(this.state.votes).length;
      if (votedCount >= alivePlayers.length) {
        this.tallyVotesAndEject();
      }
    }
  },

  tallyVotesAndEject() {
    if (!this.state.assignedGame || this.state.isEjecting) return;
    this.state.isEjecting = true;

    const votes = this.state.votes || {};
    const voteCounts = {};
    Object.values(votes).forEach(t => {
      voteCounts[t] = (voteCounts[t] || 0) + 1;
    });

    let maxVotes = 0;
    let topTarget = null;
    let isTie = false;

    Object.entries(voteCounts).forEach(([target, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        topTarget = target;
        isTie = false;
      } else if (count === maxVotes) {
        isTie = true;
      }
    });

    let message = '';
    if (!topTarget || topTarget === 'SKIP' || isTie) {
      message = '🚫 No one was ejected. (Skipped or Tied)';
    } else {
      const ejectedPlayer = this.state.assignedGame.players.find(p => p.name.toLowerCase() === topTarget.toLowerCase());
      if (ejectedPlayer) {
        ejectedPlayer.alive = false;
        const isImp = ejectedPlayer.role === 'imposter';
        message = `🚀 ${ejectedPlayer.name} was ejected! (${isImp ? 'An Imposter 🔪' : 'A Crewmate 🟢'})`;
      }
    }

    const hostBanner = document.getElementById('hostVotingResultBanner');
    const clientBanner = document.getElementById('clientVotingResultBanner');
    [hostBanner, clientBanner].forEach(b => {
      if (b) {
        b.style.display = 'block';
        b.style.background = 'rgba(231,76,60,0.2)';
        b.style.color = '#fff';
        b.textContent = message;
      }
    });

    this.state.ejectionResult = message;
    this.broadcastStateUpdate();

    setTimeout(() => {
      this.state.isEjecting = false;
      this.state.votes = {};
      this.state.ejectionResult = null;
      [hostBanner, clientBanner].forEach(b => { if (b) b.style.display = 'none'; });
      this.closeEmergencyMeeting();
      this.checkWinLossConditions();
    }, 4000);
  },

  checkWinLossConditions() {
    if (!this.state.assignedGame || this.state.winningTeam) return;

    const alivePlayers = this.state.assignedGame.players.filter(p => p.alive);
    const aliveImposters = alivePlayers.filter(p => p.role === 'imposter').length;
    const aliveCrewmates = alivePlayers.filter(p => p.role === 'crewmate').length;

    // Calculate global task progress %
    let totalTasks = 0;
    let completedTasks = 0;
    this.state.assignedGame.players.forEach(p => {
      if (p.role === 'crewmate' && p.tasks) {
        totalTasks += p.tasks.length;
        completedTasks += p.tasks.filter(t => t.completed).length;
      }
    });

    const isTasks100 = totalTasks > 0 && completedTasks === totalTasks;

    if (aliveImposters === 0) {
      this.state.winningTeam = 'crewmate';
      this.state.gameEndReason = 'All Imposters were identified and ejected from the ship!';
      this.broadcastStateUpdate();
      this.triggerGameEndScreen('crewmate', this.state.gameEndReason);
    } else if (isTasks100) {
      this.state.winningTeam = 'crewmate';
      this.state.gameEndReason = 'Crewmates completed 100% of all real-life tasks!';
      this.broadcastStateUpdate();
      this.triggerGameEndScreen('crewmate', this.state.gameEndReason);
    } else if (aliveImposters >= aliveCrewmates) {
      this.state.winningTeam = 'imposter';
      this.state.gameEndReason = 'Imposters eliminated enough crewmates to take over!';
      this.broadcastStateUpdate();
      this.triggerGameEndScreen('imposter', this.state.gameEndReason);
    }
  },

  triggerGameEndScreen(winningTeam, reason) {
    const modal = document.getElementById('gameEndModal');
    if (!modal) return;

    modal.classList.remove('hidden');
    modal.classList.add('active');
    modal.style.setProperty('display', 'flex', 'important');

    const localPlayer = this.state.joinedPlayer || (this.state.assignedGame ? this.state.assignedGame.players.find(p => p.name.toLowerCase() === (this.state.hostName || '').toLowerCase()) : null);
    const localRole = localPlayer ? localPlayer.role : 'crewmate';
    const isWinner = localRole === winningTeam;

    const modalContent = document.getElementById('gameEndModalContent');
    const iconEl = document.getElementById('gameEndIcon');
    const titleEl = document.getElementById('gameEndTitle');
    const subEl = document.getElementById('gameEndSubtitle');

    if (isWinner) {
      if (modalContent) modalContent.style.borderColor = '#f1c40f';
      if (iconEl) iconEl.textContent = '🏆';
      if (titleEl) { titleEl.textContent = 'VICTORY!'; titleEl.style.color = '#2ecc71'; }
      if (subEl) subEl.textContent = `🎉 YOUR TEAM (${winningTeam.toUpperCase()}) WON! ${reason}`;
    } else {
      if (modalContent) modalContent.style.borderColor = '#e74c3c';
      if (iconEl) iconEl.textContent = '💀';
      if (titleEl) { titleEl.textContent = 'DEFEAT!'; titleEl.style.color = '#e74c3c'; }
      if (subEl) subEl.textContent = `💀 YOU LOST! ${reason}`;
    }

    const returnBtn = document.getElementById('gameEndReturnNowBtn');
    if (returnBtn) {
      returnBtn.onclick = (e) => {
        if (e) e.preventDefault();
        this.resetGameToLobbySetup();
      };
    }

    if (this.state.gameEndInterval) clearInterval(this.state.gameEndInterval);
    this.state.gameEndCountdown = 10;
    const cdText = document.getElementById('gameEndCountdownText');
    if (cdText) cdText.textContent = '10';

    this.state.gameEndInterval = setInterval(() => {
      if (this.state.gameEndCountdown > 0) {
        this.state.gameEndCountdown--;
        if (cdText) cdText.textContent = String(this.state.gameEndCountdown);
      } else {
        clearInterval(this.state.gameEndInterval);
        this.resetGameToLobbySetup();
      }
    }, 1000);
  },

  resetGameToLobbySetup() {
    if (this.state.gameEndInterval) clearInterval(this.state.gameEndInterval);
    if (this.state.emergencyCooldownInterval) clearInterval(this.state.emergencyCooldownInterval);
    this.pauseKillCooldown();
    this.pauseDiscussionTimer();

    this._isGameEndScreenActive = false;
    this.state.assignedGame = null;
    this.state.votes = {};
    this.state.ejectionResult = null;
    this.state.winningTeam = null;
    this.state.gameEndReason = '';
    this.state.emergencyCooldownSeconds = 0;
    this.state.emergencyCooldownInterval = null;
    this.state.hasRolledCard = false;

    const endModal = document.getElementById('gameEndModal');
    if (endModal) {
      endModal.classList.remove('active');
      endModal.classList.add('hidden');
      endModal.style.setProperty('display', 'none', 'important');
    }

    const joinModal = document.getElementById('joinPartyModal');
    const partyModal = document.getElementById('partyModal');

    if (this.state.joinedPlayer) {
      // Joined remote player: return to join waiting step in the same room
      if (partyModal) {
        partyModal.classList.remove('active');
        partyModal.classList.add('hidden');
        partyModal.style.setProperty('display', 'none', 'important');
      }
      if (joinModal) {
        joinModal.classList.add('active');
        joinModal.classList.remove('hidden');
        joinModal.style.setProperty('display', 'flex', 'important');
      }
      this.showStepInModal('joinPartyModal', 'joinWaitingStep');
    } else {
      // Host: return directly to partySetupStep in the same party with existing room code & players
      if (joinModal) {
        joinModal.classList.remove('active');
        joinModal.classList.add('hidden');
        joinModal.style.setProperty('display', 'none', 'important');
      }
      if (partyModal) {
        partyModal.classList.add('active');
        partyModal.classList.remove('hidden');
        partyModal.style.setProperty('display', 'flex', 'important');
      }
      this.showStep('partySetupStep');
      this.renderPlayerChips();
      this.renderWaitingLobby();
    }

    this.broadcastStateUpdate();
  },


  updateCooldownDisplay() {
    const el = document.getElementById('cooldownDisplay');
    const clientEl = document.getElementById('joinCooldownDisplay');
    const secVal = this.state.killTimerSeconds || 0;
    if (el) el.textContent = secVal;
    if (clientEl) clientEl.textContent = secVal;

    const banner = document.getElementById('joinImposterStatusBanner');
    if (banner) {
      if (secVal === 0) {
        banner.innerHTML = `🔪 READY TO KILL! Touch crewmate on the shoulder.`;
        banner.style.color = '#2ecc71';
      } else {
        banner.innerHTML = `⏱️ COOLDOWN IN PROGRESS (${secVal}s)`;
        banner.style.color = '#e74c3c';
      }
    }
    this.renderImposterTargetsGrid();
  },

  startKillCooldown() {
    if (this.state.isCooldownRunning) return;
    this.state.isCooldownRunning = true;

    this.state.killTimerInterval = setInterval(() => {
      if (this.state.killTimerSeconds > 0) {
        this.state.killTimerSeconds--;
        this.updateCooldownDisplay();
        this.broadcastStateUpdate();
      } else {
        clearInterval(this.state.killTimerInterval);
        this.state.isCooldownRunning = false;
        // NO SOUND — silent when kill is ready (to avoid revealing imposter)
        this.broadcastStateUpdate();
      }
    }, 1000);
  },

  pauseKillCooldown() {
    clearInterval(this.state.killTimerInterval);
    this.state.isCooldownRunning = false;
    this.broadcastStateUpdate();
  },

  resetKillCooldown() {
    this.pauseKillCooldown();
    this.state.killTimerSeconds = this.state.settings ? (this.state.settings.killCooldown || 40) : 40;
    this.updateCooldownDisplay();
    this.broadcastStateUpdate();
  },

  triggerEmergencyMeeting() {
    this.pauseKillCooldown();
    this.playEmergencySiren();

    this.state.isEmergencyActive = true;
    this.state.discussionSeconds = 90;
    // Reset votes for fresh meeting
    this.state.votes = {};
    this.state.ejectionResult = null;

    const hostOverlay = document.getElementById('emergencyMeetingOverlay');
    const clientOverlay = document.getElementById('joinEmergencyMeetingOverlay');
    if (hostOverlay) hostOverlay.style.display = 'flex';
    if (clientOverlay) clientOverlay.style.display = 'flex';

    // Render all alive player names in voting grid
    this.renderVotingGrid();
    this.updateDiscussionTimerDisplay();
    this.broadcastStateUpdate();
  },

  updateDiscussionTimerDisplay() {
    const mins = Math.floor((this.state.discussionSeconds || 90) / 60);
    const secs = (this.state.discussionSeconds || 90) % 60;
    const str = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    const hostEl = document.getElementById('discussionTimerDisplay');
    const clientEl = document.getElementById('joinDiscussionTimerDisplay');
    if (hostEl) hostEl.textContent = str;
    if (clientEl) clientEl.textContent = str;
  },

  startDiscussionTimer() {
    if (this.state.isDiscussionRunning) return;
    this.state.isDiscussionRunning = true;

    this.state.discussionTimerInterval = setInterval(() => {
      if (this.state.discussionSeconds > 0) {
        this.state.discussionSeconds--;
        this.updateDiscussionTimerDisplay();
        this.broadcastStateUpdate();
      } else {
        clearInterval(this.state.discussionTimerInterval);
        this.state.isDiscussionRunning = false;
        this.broadcastStateUpdate();
      }
    }, 1000);
  },

  pauseDiscussionTimer() {
    clearInterval(this.state.discussionTimerInterval);
    this.state.isDiscussionRunning = false;
    this.broadcastStateUpdate();
  },

  closeEmergencyMeeting() {
    this.pauseDiscussionTimer();
    this.state.isEmergencyActive = false;

    const hostOverlay = document.getElementById('emergencyMeetingOverlay');
    const clientOverlay = document.getElementById('joinEmergencyMeetingOverlay');
    if (hostOverlay) hostOverlay.style.display = 'none';
    if (clientOverlay) clientOverlay.style.display = 'none';

    this.resetKillCooldown();
    // Start emergency button cooldown (25 seconds) after meeting ends
    this.startEmergencyCooldown(25);
    this.broadcastStateUpdate();
  },

  // Emergency Button Cooldown (for crewmates only — 25s after meeting or task completion)
  startEmergencyCooldown(seconds) {
    if (this.state.emergencyCooldownInterval) clearInterval(this.state.emergencyCooldownInterval);
    this.state.emergencyCooldownSeconds = seconds || 25;
    this.updateEmergencyButtonState();

    this.state.emergencyCooldownInterval = setInterval(() => {
      if (this.state.emergencyCooldownSeconds > 0) {
        this.state.emergencyCooldownSeconds--;
        this.updateEmergencyButtonState();
      } else {
        clearInterval(this.state.emergencyCooldownInterval);
        this.state.emergencyCooldownInterval = null;
        this.state.emergencyCooldownSeconds = 0;
        this.updateEmergencyButtonState();
      }
    }, 1000);
  },

  updateEmergencyButtonState() {
    const player = this.state.joinedPlayer;
    const isImposter = player && player.role === 'imposter';
    const cooldownSecs = this.state.emergencyCooldownSeconds || 0;
    const isOnCooldown = cooldownSecs > 0;

    // Client emergency button
    const clientBtn = document.getElementById('clientEmergencyBtn');
    const cooldownBadge = document.getElementById('clientEmergencyCooldownBadge');
    const cooldownText = document.getElementById('clientEmergencyCooldownText');
    const imposterLabel = document.getElementById('clientImposterNoEmergency');

    if (isImposter) {
      // Imposters: disable button, show label
      if (clientBtn) { clientBtn.disabled = true; clientBtn.style.opacity = '0.4'; clientBtn.style.cursor = 'not-allowed'; }
      if (cooldownBadge) cooldownBadge.style.display = 'none';
      if (imposterLabel) imposterLabel.style.display = 'block';
    } else if (isOnCooldown) {
      // Crewmates on cooldown: disable button, show timer
      if (clientBtn) { clientBtn.disabled = true; clientBtn.style.opacity = '0.5'; clientBtn.style.cursor = 'not-allowed'; }
      if (cooldownBadge) { cooldownBadge.style.display = 'block'; }
      if (cooldownText) cooldownText.textContent = `${cooldownSecs}s`;
      if (imposterLabel) imposterLabel.style.display = 'none';
    } else {
      // Crewmates ready: enable button
      if (clientBtn) { clientBtn.disabled = false; clientBtn.style.opacity = '1'; clientBtn.style.cursor = 'pointer'; }
      if (cooldownBadge) cooldownBadge.style.display = 'none';
      if (imposterLabel) imposterLabel.style.display = 'none';
    }
  },

  copyPublicRoomLink() {
    if (!this.state.roomCode) {
      alert('Please start or select a room first!');
      return;
    }
    const cleanCode = this.state.roomCode.toUpperCase();
    const publicUrl = `${window.location.origin}${window.location.pathname}#room=${cleanCode}`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(publicUrl).then(() => {
        alert(`🔗 PUBLIC ROOM LINK COPIED!\n\nLink: ${publicUrl}\n\nShare this link with your friends on any phone, tablet, or laptop to join instantly across the web!`);
      }).catch(() => {
        prompt('Copy your Public Room Link below:', publicUrl);
      });
    } else {
      prompt('Copy your Public Room Link below:', publicUrl);
    }
  },

  renderDashboardPlayers() {
    const grid = document.getElementById('dashPlayersGrid');
    if (!grid || !this.state.assignedGame) return;

    // 1. RENDER HOST'S PERSONAL SECRET ROLE CARD & TASKS (Confidential Player View for Host)
    const hostNameStr = (this.state.hostName || '').toLowerCase();
    const hostPlayer = this.state.assignedGame.players.find(p => p.name.toLowerCase() === hostNameStr) || this.state.assignedGame.players[0];

    // Hide Imposter Kill Cooldown Widget on Host Dashboard if Host is a Crewmate!
    const hostCooldownWidget = document.querySelector('#partyDashboardStep .widget-cooldown');
    if (hostCooldownWidget) {
      hostCooldownWidget.style.display = (hostPlayer && hostPlayer.role === 'imposter') ? 'block' : 'none';
    }

    if (hostPlayer) {
      const hostHolder = document.getElementById('hostSecretCardHolder');
      const hostTasksHolder = document.getElementById('hostPersonalTasksContainer');

      if (hostHolder) {
        hostHolder.innerHTML = '';
        const isImp = hostPlayer.role === 'imposter';
        const roleCardData = isImp
          ? { type: 'role', theme: 'teal', roleType: 'imposter', title: 'IMPOSTER', content: { desc: 'YOUR IDENTITY: IMPOSTER.\nELIMINATE CREWMATES TO WIN. BLEND IN.', subnote: 'Keep your identity secret. Touch shoulder to kill.' } }
          : { type: 'role', theme: 'teal', roleType: 'crewmate', title: 'CREWMATE', content: { desc: 'YOUR IDENTITY: CREWMATE.\nCOMPLETE TASKS TO WIN. HELP IDENTIFY THE IMPOSTER.', subnote: 'Do not reveal your identity.' } };
        hostHolder.appendChild(createCardElement(roleCardData));
      }

      if (hostTasksHolder) {
        if (hostPlayer.role === 'imposter') {
          const isReady = (this.state.killTimerSeconds || 0) === 0;
          const aliveTargets = this.state.assignedGame.players.filter(p => p.alive && p.name.toLowerCase() !== hostNameStr && p.role !== 'imposter');
          hostTasksHolder.innerHTML = `
            <div style="color:#e74c3c; font-weight:bold; font-size:0.95rem; margin-bottom:0.5rem;">🔪 Imposter Objectives: Touch crewmates secretly on shoulder & fake tasks around room!</div>
            <div style="background:rgba(231,76,60,0.15); border:1.5px solid rgba(231,76,60,0.4); border-radius:10px; padding:0.75rem;">
              <h4 style="color:#e74c3c; font-size:0.95rem; margin-bottom:0.4rem;">🔪 SELECT TARGET TO KILL:</h4>
              <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap:0.5rem;">
                ${aliveTargets.length === 0 ? '<div style="color:#bdc3c7; font-size:0.85rem;">No crewmate targets remaining.</div>' : aliveTargets.map(p => `
                  <div style="background:rgba(0,0,0,0.4); border:1px solid ${isReady ? '#e74c3c' : 'rgba(255,255,255,0.1)'}; border-radius:6px; padding:0.5rem; text-align:center;">
                    <div style="font-weight:bold; font-size:0.85rem; margin-bottom:0.3rem;">👤 ${p.name}</div>
                    <button class="btn btn-danger btn-sm host-target-kill-btn" data-htarget="${p.name}" ${isReady ? '' : 'disabled'} style="width:100%; font-size:0.75rem; font-weight:bold; opacity:${isReady ? '1' : '0.5'};">
                      ${isReady ? '🔪 KILL' : `⏱️ ${this.state.killTimerSeconds}s`}
                    </button>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
          hostTasksHolder.querySelectorAll('.host-target-kill-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
              const targetName = e.target.getAttribute('data-htarget');
              if (targetName) this.killTargetPlayer(targetName);
            });
          });
        } else if (hostPlayer.tasks) {
          hostTasksHolder.innerHTML = `
            <h4 style="font-size:0.9rem; color:#f39c12; margin-bottom:0.5rem;">📋 YOUR ASSIGNED REAL-LIFE TASKS:</h4>
            ${hostPlayer.tasks.map((t, tIdx) => `
              <label class="p-task-item ${t.completed ? 'completed' : ''}" style="margin-bottom:0.4rem; display:flex; align-items:center; gap:0.5rem; background:rgba(0,0,0,0.2); padding:0.4rem 0.8rem; border-radius:6px;">
                <input type="checkbox" data-hpidx="${tIdx}" ${t.completed ? 'checked' : ''}>
                <span><strong>${t.title}</strong>: ${t.desc}</span>
              </label>
            `).join('')}
          `;

          hostTasksHolder.querySelectorAll('input[type="checkbox"]').forEach(chk => {
            chk.addEventListener('change', (e) => {
              const tIdx = parseInt(e.target.getAttribute('data-hpidx'));
              hostPlayer.tasks[tIdx].completed = e.target.checked;
              this.renderDashboardPlayers();
              this.updateGlobalTaskProgress();
              this.broadcastStateUpdate();
            });
          });
        }
      }
    }

    // 2. RENDER MASTER MONITOR GRID (Roles hidden by default to preserve host confidentiality during gameplay)
    const isMonitorVisible = !!this.state.isHostMonitorVisible;

    grid.innerHTML = this.state.assignedGame.players.map((p, pIdx) => {
      const isDead = !p.alive;
      let tasksHtml = '';

      if (!isMonitorVisible) {
        tasksHtml = `
          <div style="font-size:0.85rem; color:#bdc3c7; font-style:italic;">
            Role: 🔒 Hidden (Confidential) | Tasks: 🔒 Hidden (Confidential)
          </div>
        `;
      } else {
        tasksHtml = p.role === 'imposter'
          ? `<div style="font-size:0.8rem; color:#e74c3c; font-weight:bold;">🔪 Imposter (Sabotage & Eliminate)</div>`
          : p.tasks.map((t, tIdx) => `
              <label class="p-task-item ${t.completed ? 'completed' : ''}">
                <input type="checkbox" data-pidx="${pIdx}" data-tidx="${tIdx}" ${t.completed ? 'checked' : ''} ${isDead ? 'disabled' : ''}>
                <span>${t.title}</span>
              </label>
            `).join('');
      }

      return `
        <div class="p-dash-card ${isDead ? 'dead-player' : ''}">
          <div class="p-dash-header">
            <span class="p-dash-name">${p.name} ${isDead ? '💀' : '🟢'}</span>
            <button class="p-status-toggle ${isDead ? 'dead' : 'alive'}" data-pidx="${pIdx}">
              ${isDead ? 'DEAD' : 'ALIVE'}
            </button>
          </div>
          <div class="p-tasks-wrapper">
            ${tasksHtml}
          </div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.p-status-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pIdx = parseInt(e.target.getAttribute('data-pidx'));
        if (this.state.assignedGame && this.state.assignedGame.players[pIdx]) {
          this.state.assignedGame.players[pIdx].alive = !this.state.assignedGame.players[pIdx].alive;
          this.renderDashboardPlayers();
          this.broadcastStateUpdate();
        }
      });
    });

    grid.querySelectorAll('input[type="checkbox"]').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const pIdx = parseInt(e.target.getAttribute('data-pidx'));
        const tIdx = parseInt(e.target.getAttribute('data-tidx'));
        if (pIdx !== undefined && tIdx !== undefined && this.state.assignedGame.players[pIdx] && this.state.assignedGame.players[pIdx].tasks[tIdx]) {
          this.state.assignedGame.players[pIdx].tasks[tIdx].completed = e.target.checked;
          this.renderDashboardPlayers();
          this.updateGlobalTaskProgress();
          this.broadcastStateUpdate();
          this.checkWinLossConditions();
        }
      });
    });
  },

  updateGlobalTaskProgress() {
    if (!this.state.assignedGame) return;

    let totalTasks = 0;
    let completedTasks = 0;

    this.state.assignedGame.players.forEach(p => {
      if (p.role === 'crewmate') {
        totalTasks += p.tasks.length;
        completedTasks += p.tasks.filter(t => t.completed).length;
      }
    });

    const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const taskPercentText = document.getElementById('taskPercentText');
    const taskProgressBar = document.getElementById('taskProgressBar');
    if (taskPercentText) taskPercentText.textContent = `${percent}%`;
    if (taskProgressBar) taskProgressBar.style.width = `${percent}%`;

    const joinTaskPercentText = document.getElementById('joinTaskPercentText');
    const joinTaskProgressBar = document.getElementById('joinTaskProgressBar');
    if (joinTaskPercentText) joinTaskPercentText.textContent = `${percent}%`;
    if (joinTaskProgressBar) joinTaskProgressBar.style.width = `${percent}%`;

    this.checkWinLossConditions();
  },

  checkWinConditions() {
    this.checkWinLossConditions();
  },

  triggerVictory(title, reason) {
    this.checkWinLossConditions();
  },

  closeHostParty() {
    this.pauseKillCooldown();
    this.pauseDiscussionTimer();
    document.getElementById('partyModal').classList.remove('active');
  },

  closeJoinParty() {
    document.getElementById('joinPartyModal').classList.remove('active');
  },

  disbandParty() {
    if (!confirm("⚠️ Are you sure you want to disband this party room?\n\nThis will disconnect all players and reset the room.")) {
      return;
    }

    this.state.assignedGame = null;
    this.state.players = [];
    this.state.joinedPlayer = null;
    this.state.votes = {};
    this.state.ejectionResult = null;
    this.state.winningTeam = null;
    this.state.isDisbanded = true;
    this.state.hasRolledCard = false;

    this.pauseKillCooldown();
    this.pauseDiscussionTimer();
    if (this.state.emergencyCooldownInterval) clearInterval(this.state.emergencyCooldownInterval);

    this.broadcastStateUpdate();

    this.state.roomCode = '';

    document.getElementById('partyModal')?.classList.remove('active');
    document.getElementById('joinPartyModal')?.classList.remove('active');

    this.showStep('partyNameStep');
    const preInput = document.getElementById('partyNameInputPre');
    if (preInput) preInput.value = '';

    alert('💥 Party has been disbanded!');
  },

  bindEvents() {
    // Open Host Party Modal at Party Naming Pre-Screen
    const hostBtn = document.getElementById('hostPartyBtn');
    if (hostBtn) {
      hostBtn.addEventListener('click', () => {
        document.getElementById('partyModal').classList.add('active');
        if (this.state.assignedGame) {
          this.showStep('partyDashboardStep');
          this.renderDashboardPlayers();
        } else {
          this.showStep('partyNameStep');
          // Clear the pre-screen input so user types their own name
          const preInput = document.getElementById('partyNameInputPre');
          if (preInput) preInput.value = '';

          // Auto-fill host name from logged-in user / guest
          const displayName = (typeof AuthManager !== 'undefined') ? AuthManager.getDisplayName() : '';
          if (displayName) {
            const hostNameInput = document.getElementById('hostNameInput');
            if (hostNameInput && !hostNameInput.value) {
              hostNameInput.value = displayName;
              hostNameInput.dispatchEvent(new Event('input'));
            }
          }
        }
      });
    }

    // Create Party Submit (Name -> Lobby Setup)
    const createPartyBtn = document.getElementById('createPartySubmitBtn');
    if (createPartyBtn) {
      createPartyBtn.addEventListener('click', () => this.createPartySubmit());
    }

    // Party Pre-Screen Name Input Live Sync (partyNameInputPre)
    const partyNameInputPre = document.getElementById('partyNameInputPre');
    if (partyNameInputPre) {
      partyNameInputPre.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.createPartySubmit();
      });
    }

    // Party Lobby Name Input Live Sync
    const partyNameInput = document.getElementById('partyNameInput');
    if (partyNameInput) {
      partyNameInput.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        this.state.partyName = val || 'My Among Us Game';
        const headerTitle = document.getElementById('hostPartyHeaderTitle');
        if (headerTitle) headerTitle.textContent = this.state.partyName.toUpperCase();
        this.broadcastStateUpdate();
      });
    }

    // Host Name Input Live Sync
    const hostNameInput = document.getElementById('hostNameInput');
    if (hostNameInput) {
      hostNameInput.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        const oldHostName = this.state.hostName;
        this.state.hostName = val;

        if (val) {
          const oldIdx = oldHostName ? this.state.players.indexOf(oldHostName) : -1;
          if (oldIdx !== -1) {
            this.state.players[oldIdx] = val;
          } else if (!this.state.players.includes(val)) {
            this.state.players.unshift(val);
          }
        } else if (oldHostName) {
          const oldIdx = this.state.players.indexOf(oldHostName);
          if (oldIdx !== -1) this.state.players.splice(oldIdx, 1);
        }

        this.renderPlayerChips();
        this.renderWaitingLobby();
        this.broadcastStateUpdate();
      });
    }

    // Player Count Dropdown Select Listener
    const playerCountSelect = document.getElementById('playerCountSelect');
    if (playerCountSelect) {
      playerCountSelect.addEventListener('change', (e) => {
        const count = parseInt(e.target.value);
        this.setPlayerCount(count);
      });
    }

    // Imposter Count Select Listener -> Auto-adjust player count if needed
    const imposterCountSelect = document.getElementById('imposterCountSelect');
    if (imposterCountSelect) {
      imposterCountSelect.addEventListener('change', (e) => {
        const minReq = this.getMinRequiredPlayers(e.target.value);
        if (this.state.players.length < minReq) {
          this.setPlayerCount(minReq);
        }
      });
    }

    // Open Join Party Modal
    const joinBtn = document.getElementById('joinPartyBtn');
    if (joinBtn) {
      joinBtn.addEventListener('click', () => {
        document.getElementById('joinPartyModal').classList.add('active');
        if (this.state.joinedPlayer && this.state.assignedGame) {
          this.showStepInModal('joinPartyModal', 'joinDashboardStep');
          this.renderJoinedPlayerDashboard();
        } else {
          this.showStepInModal('joinPartyModal', 'joinSetupStep');
          const codeInput = document.getElementById('joinRoomCodeInput');
          if (codeInput) codeInput.value = '';
          const nameInput = document.getElementById('joinPlayerNameInput');
          if (nameInput) {
            // Auto-fill from logged-in user or guest
            const displayName = (typeof AuthManager !== 'undefined') ? AuthManager.getDisplayName() : '';
            nameInput.value = displayName || '';
          }
        }
      });
    }

    // Close Modal Crosses
    const closeHostBtn = document.getElementById('partyModalCloseBtn');
    if (closeHostBtn) {
      closeHostBtn.addEventListener('click', () => this.closeHostParty());
    }

    const closeJoinBtn = document.getElementById('joinModalCloseBtn');
    if (closeJoinBtn) {
      closeJoinBtn.addEventListener('click', () => this.closeJoinParty());
    }

    // Explicit Exit Buttons
    document.getElementById('exitHostPartyBtn')?.addEventListener('click', () => this.closeHostParty());
    document.getElementById('exitHostDashBtn')?.addEventListener('click', () => this.closeHostParty());
    document.getElementById('exitVictoryBtn')?.addEventListener('click', () => this.closeHostParty());
    document.getElementById('exitJoinPartyBtn')?.addEventListener('click', () => this.closeJoinParty());
    document.getElementById('exitJoinDashBtn')?.addEventListener('click', () => this.closeJoinParty());
    document.getElementById('exitWaitingBtn')?.addEventListener('click', () => this.closeJoinParty());

    // Disband Party Buttons
    document.getElementById('disbandHostPartyBtn')?.addEventListener('click', () => this.disbandParty());
    document.getElementById('disbandHostDashBtn')?.addEventListener('click', () => this.disbandParty());
    document.getElementById('disbandClientWaitingBtn')?.addEventListener('click', () => this.disbandParty());
    document.getElementById('disbandClientDashBtn')?.addEventListener('click', () => this.disbandParty());

    // Submit Join Party Form
    const submitJoinBtn = document.getElementById('submitJoinPartyBtn');
    if (submitJoinBtn) {
      submitJoinBtn.addEventListener('click', () => {
        const code = document.getElementById('joinRoomCodeInput').value;
        const name = document.getElementById('joinPlayerNameInput').value;
        this.joinParty(code, name);
      });
    }

    // Regen Code
    const regenBtn = document.getElementById('regenCodeBtn');
    if (regenBtn) {
      regenBtn.addEventListener('click', () => this.generateRoomCode());
    }

    // Add Player
    const addBtn = document.getElementById('addPlayerBtn');
    const inputEl = document.getElementById('newPlayerNameInput');
    if (addBtn && inputEl) {
      addBtn.addEventListener('click', () => {
        this.addPlayer(inputEl.value);
        inputEl.value = '';
      });
      inputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.addPlayer(inputEl.value);
          inputEl.value = '';
        }
      });
    }

    // Start Game & Deal
    const startBtn = document.getElementById('startGameDealBtn');
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startGame());
    }

    // Reveal Secret Card Button
    const revealBtn = document.getElementById('revealCardBtn');
    if (revealBtn) {
      revealBtn.addEventListener('click', () => this.revealSecretRole());
    }

    // Confirm Memorized Next Player (Top & Bottom Buttons)
    const confirmBtn = document.getElementById('confirmMemorizedBtn');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => this.nextRevealPlayer());
    }
    const confirmBtnTop = document.getElementById('confirmMemorizedBtnTop');
    if (confirmBtnTop) {
      confirmBtnTop.addEventListener('click', () => this.nextRevealPlayer());
    }
    const hostSwitchBtn = document.getElementById('hostSwitchNextPlayerBtn');
    if (hostSwitchBtn) {
      hostSwitchBtn.addEventListener('click', () => this.nextRevealPlayer());
    }

    // Cooldown controls
    document.getElementById('startCooldownBtn')?.addEventListener('click', () => this.startKillCooldown());
    document.getElementById('pauseCooldownBtn')?.addEventListener('click', () => this.pauseKillCooldown());
    document.getElementById('resetCooldownBtn')?.addEventListener('click', () => this.resetKillCooldown());

    // Emergency Meeting controls (Host & Client 3D Red Button)
    document.getElementById('triggerEmergencyBtn')?.addEventListener('click', () => this.triggerEmergencyMeeting());
    document.getElementById('clientEmergencyBtn')?.addEventListener('click', () => this.triggerEmergencyMeeting());
    document.getElementById('startDiscussionTimerBtn')?.addEventListener('click', () => this.startDiscussionTimer());
    document.getElementById('pauseDiscussionTimerBtn')?.addEventListener('click', () => this.pauseDiscussionTimer());
    document.getElementById('closeEmergencyBtn')?.addEventListener('click', () => this.closeEmergencyMeeting());

    // Client Imposter Personal Cooldown Controls
    document.getElementById('joinStartCooldownBtn')?.addEventListener('click', () => this.startKillCooldown());
    document.getElementById('joinPauseCooldownBtn')?.addEventListener('click', () => this.pauseKillCooldown());
    document.getElementById('joinResetCooldownBtn')?.addEventListener('click', () => this.resetKillCooldown());

    // Game End Return Now Button
    document.getElementById('gameEndReturnNowBtn')?.addEventListener('click', () => this.resetGameToLobbySetup());

    // Share Public Room Link buttons
    document.getElementById('shareRoomLinkBtn')?.addEventListener('click', () => this.copyPublicRoomLink());
    document.getElementById('shareRoomLinkBtnDash')?.addEventListener('click', () => this.copyPublicRoomLink());

    // Host Confidentiality Mode Toggle
    document.getElementById('toggleHostMonitorModeBtn')?.addEventListener('click', () => {
      this.state.isHostMonitorVisible = !this.state.isHostMonitorVisible;
      const btn = document.getElementById('toggleHostMonitorModeBtn');
      if (btn) {
        btn.textContent = this.state.isHostMonitorVisible
          ? '👁️ Master Monitor (Roles Visible)'
          : '🔒 Confidential Mode: Playing as Player';
      }
      this.renderDashboardPlayers();
    });

    // End Game Reset & Play Again
    document.getElementById('endGameResetBtn')?.addEventListener('click', () => this.resetGameToLobbySetup());
    document.getElementById('playAgainBtn')?.addEventListener('click', () => this.resetGameToLobbySetup());
  }
};

// Initialize PartyManager on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => PartyManager.init());
} else {
  PartyManager.init();
}

// ===== MOBILE HAMBURGER MENU TOGGLE =====
(function setupHamburgerMenu() {
  function init() {
    const toggleBtn = document.getElementById('mobileMenuToggleBtn');
    const secondaryNav = document.getElementById('headerSecondaryActions');
    if (!toggleBtn || !secondaryNav) return;

    toggleBtn.addEventListener('click', () => {
      const isOpen = secondaryNav.classList.toggle('mobile-open');
      toggleBtn.classList.toggle('open', isOpen);
      toggleBtn.setAttribute('aria-expanded', String(isOpen));
    });

    // Close secondary nav when clicking outside
    document.addEventListener('click', (e) => {
      if (!toggleBtn.contains(e.target) && !secondaryNav.contains(e.target)) {
        secondaryNav.classList.remove('mobile-open');
        toggleBtn.classList.remove('open');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

