/* ==========================================================================
   Teoria dos Grafos — notas de aula
   Comportamento compartilhado: mostrar/ocultar respostas e dicas, tema
   claro/escuro, índice ativo e botão de voltar ao topo.
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
