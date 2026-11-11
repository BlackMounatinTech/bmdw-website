(function () {
  'use strict';
  var root = document.getElementById('most-recent-job');
  if (!root) return;
  var thumbs = Array.from(root.querySelectorAll('.recent-thumb'));
  var main = document.getElementById('recent-photo');
  var modal = document.querySelector('.recent-lightbox');
  var index = 0;
  function select(n) {
    index = (n + thumbs.length) % thumbs.length;
    var item = thumbs[index];
    main.src = item.dataset.photo;
    main.alt = item.dataset.alt;
    document.getElementById('recent-photo-label').textContent = item.dataset.label;
    document.getElementById('recent-photo-count').textContent = String(index + 1).padStart(2, '0') + ' / 09';
    thumbs.forEach(function (t, i) { t.setAttribute('aria-pressed', String(i === index)); });
    modal.querySelector('img').src = item.dataset.photo;
    modal.querySelector('img').alt = item.dataset.alt;
    modal.querySelector('.recent-lightbox-count').textContent = (index + 1) + ' / ' + thumbs.length;
    modal.querySelector('.recent-lightbox-label').textContent = item.dataset.label;
  }
  thumbs.forEach(function (t, i) { t.addEventListener('click', function () { select(i); }); });
  root.querySelector('.recent-main').addEventListener('click', function () { select(index); modal.showModal(); });
  modal.querySelector('.recent-close').addEventListener('click', function () { modal.close(); });
  modal.querySelector('.recent-prev').addEventListener('click', function () { select(index - 1); });
  modal.querySelector('.recent-next').addEventListener('click', function () { select(index + 1); });
  modal.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); select(index + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); select(index - 1); }
  });
})();
