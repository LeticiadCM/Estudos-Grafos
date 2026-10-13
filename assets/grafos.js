/* ==========================================================================
   Teoria dos Grafos — notas de aula
   Comportamento compartilhado: mostrar/ocultar respostas e dicas, tema
   claro/escuro, índice ativo, botão de voltar ao topo, e blocos de notas
   por exercício em canvas para desenho livre.
   Sem dependências externas.
   ========================================================================== */
(function () {
  'use strict';

  var LBL = {
    'Mostrar resposta': 'Ocultar resposta',
    'Dica': 'Ocultar dica',
    'Abrir todas as respostas do bloco': 'Fechar as respostas do bloco'
  };

  function label(btn, open) {
    var t = btn.childNodes[0];
    if (t && t.nodeType === 3) {
      t.nodeValue = (open ? btn.getAttribute('data-on') : btn.getAttribute('data-off')) + ' ';
    }
  }

  function initLabels(btn) {
    var first = btn.childNodes[0];
    var raw = first && first.nodeType === 3 ? first.nodeValue.trim() : '';
    btn.setAttribute('data-off', raw);
    btn.setAttribute('data-on', LBL[raw] || raw);
  }

  function setOpen(btn, open) {
    var p = document.getElementById(btn.getAttribute('data-target'));
    if (!p) return;
    p.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    label(btn, open);
  }

  function answerButtons(root) {
    return Array.prototype.slice.call(root.querySelectorAll('.toggle[data-target]')).filter(function (b) {
      var p = document.getElementById(b.getAttribute('data-target'));
      return p && p.classList.contains('answer');
    });
  }

  // botões individuais (resposta e dica)
  Array.prototype.slice.call(document.querySelectorAll('.toggle[data-target]')).forEach(function (btn) {
    initLabels(btn);
    btn.addEventListener('click', function () {
      setOpen(btn, btn.getAttribute('aria-expanded') !== 'true');
    });
  });

  // botão de um bloco de exercícios
  var groupBtns = Array.prototype.slice.call(document.querySelectorAll('.toggle[data-scope]'));
  groupBtns.forEach(function (btn) {
    initLabels(btn);
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      var scope = document.querySelector(btn.getAttribute('data-scope'));
      if (scope) answerButtons(scope).forEach(function (b) { setOpen(b, open); });
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      label(btn, open);
    });
  });

  // botão global da barra superior
  var allBtn = document.getElementById('allAnswers');
  if (allBtn) {
    var allOpen = false;
    allBtn.addEventListener('click', function () {
      allOpen = !allOpen;
      answerButtons(document).forEach(function (b) { setOpen(b, allOpen); });
      groupBtns.forEach(function (b) {
        b.setAttribute('aria-expanded', allOpen ? 'true' : 'false');
        label(b, allOpen);
      });
      allBtn.textContent = allOpen ? 'Ocultar todas as respostas' : 'Mostrar todas as respostas';
    });
  }

  // notas por exercício em canvas (desenho livre)
  function setupExerciseNotes(ex) {
    if (ex.querySelector('.exercise-notes')) return;

    var tag = ex.querySelector('.tagnum');
    var tagText = tag ? tag.textContent.replace(/\s+/g, ' ').trim() : 'exercicio';
    var id = (window.location.pathname || 'index.html') + '|' + tagText;

    var notes = document.createElement('div');
    notes.className = 'exercise-notes';
    notes.setAttribute('data-key', id);
    notes.innerHTML = [
      '<div class="notes-toolbar">',
      '  <button class="btn btn-clear" type="button">Limpar</button>',
      '  <button class="btn btn-download" type="button">Baixar PNG</button>',
      '  <label>Traço <input class="stroke-range" type="range" min="1" max="18" value="3"></label>',
      '</div>',
      '<div class="notes-canvas-wrap"><canvas class="notes-canvas"></canvas></div>'
    ].join('');

    ex.appendChild(notes);

    var canvas = notes.querySelector('.notes-canvas');
    var ctx = canvas.getContext('2d');
    var clearBtn = notes.querySelector('.btn-clear');
    var downloadBtn = notes.querySelector('.btn-download');
    var strokeRange = notes.querySelector('.stroke-range');
    var drawing = false;
    var lastX = 0;
    var lastY = 0;
    var stroke = Number(strokeRange.value) || 3;
    var storageKey = 'grafos-notes-' + encodeURIComponent(id);

    function resizeCanvas() {
      var rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(200, Math.round(rect.width));
      canvas.height = Math.max(160, Math.round(rect.height));
      try {
        var saved = localStorage.getItem(storageKey);
        if (saved) {
          var img = new Image();
          img.onload = function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          };
          img.src = saved;
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      } catch (err) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    function saveCanvas() {
      try {
        localStorage.setItem(storageKey, canvas.toDataURL('image/png'));
      } catch (err) {
        console.warn('Não foi possível salvar a nota do exercício:', err);
      }
    }

    function startDraw(e) {
      var rect = canvas.getBoundingClientRect();
      drawing = true;
      lastX = e.clientX - rect.left;
      lastY = e.clientY - rect.top;
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
    }

    function draw(e) {
      if (!drawing) return;
      var rect = canvas.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#111';
      ctx.lineWidth = stroke;
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();
      lastX = x;
      lastY = y;
    }

    function stopDraw() {
      drawing = false;
      saveCanvas();
    }

    clearBtn.addEventListener('click', function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      try { localStorage.removeItem(storageKey); } catch (err) {}
    });

    downloadBtn.addEventListener('click', function () {
      var a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = 'nota-' + encodeURIComponent(tagText) + '.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
    });

    strokeRange.addEventListener('input', function () {
      stroke = Number(this.value) || 3;
    });

    canvas.addEventListener('pointerdown', startDraw);
    canvas.addEventListener('pointermove', draw);
    canvas.addEventListener('pointerup', stopDraw);
    canvas.addEventListener('pointerleave', stopDraw);
    canvas.addEventListener('pointercancel', stopDraw);

    resizeCanvas();
  }

  Array.prototype.slice.call(document.querySelectorAll('.ex')).forEach(setupExerciseNotes);

  // tema claro/escuro, lembrado entre páginas e capítulos
  var root = document.documentElement, KEY = 'grafos-tema';
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  if (!saved && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) saved = 'dark';
  if (saved) root.setAttribute('data-theme', saved);
  var themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
    });
  }

  // voltar ao topo
  var topBtn = document.getElementById('topBtn');
  if (topBtn) {
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // destaque da seção atual no índice lateral
  var links = Array.prototype.slice.call(document.querySelectorAll('.side a[href^="#"]'));
  if (links.length && window.IntersectionObserver) {
    var targets = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var i = targets.indexOf(en.target);
        if (i < 0) return;
        links.forEach(function (a) { a.classList.remove('on'); });
        links[i].classList.add('on');
      });
    }, { rootMargin: '-80px 0px -70% 0px' });
    targets.forEach(function (t) { if (t) obs.observe(t); });
  }
})();

