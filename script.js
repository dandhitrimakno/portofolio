'use strict';

document.getElementById('year').textContent = new Date().getFullYear();

var cards = Array.prototype.slice.call(document.querySelectorAll('.project'));
var buttons = Array.prototype.slice.call(document.querySelectorAll('.filter'));
var filterStatus = document.getElementById('filter-status');
var emptyState = document.getElementById('filter-empty');

function matches(card, category) {
  return category === 'all' || card.dataset.cats.split(' ').indexOf(category) !== -1;
}

function filterProjects(button) {
  var category = button.dataset.filter;
  var visibleCount = 0;

  buttons.forEach(function (item) {
    item.setAttribute('aria-pressed', item === button ? 'true' : 'false');
  });
  cards.forEach(function (card) {
    card.hidden = !matches(card, category);
    if (!card.hidden) visibleCount += 1;
  });

  emptyState.hidden = visibleCount !== 0;
  filterStatus.textContent = category === 'all'
    ? 'Showing all ' + visibleCount + ' projects.'
    : 'Showing ' + visibleCount + ' of ' + cards.length + ' projects: ' + button.dataset.label + '.';
}

buttons.forEach(function (button) {
  button.dataset.label = button.firstChild.textContent.trim();
  var count = cards.filter(function (card) { return matches(card, button.dataset.filter); }).length;
  button.querySelector('i').textContent = count;
  button.setAttribute('aria-label', button.dataset.label + ', ' + count + ' projects');
  button.setAttribute('aria-controls', 'projects');
  button.addEventListener('click', function () { filterProjects(button); });
});

// All content remains readable if JavaScript is unavailable or fails to load.
filterProjects(buttons[0]);
document.querySelector('.filters').hidden = false;
