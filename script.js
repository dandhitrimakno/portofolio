'use strict';

document.getElementById('year').textContent = new Date().getFullYear();

var cards = Array.prototype.slice.call(document.querySelectorAll('.project'));
var buttons = Array.prototype.slice.call(document.querySelectorAll('.filter'));
var filterStatus = document.getElementById('filter-status');
var emptyState = document.getElementById('filter-empty');
var themeToggle = document.getElementById('theme-toggle');
var moreWork = document.getElementById('more-work');
var showAllProjects = document.getElementById('show-all-projects');

function setTheme(theme, persist) {
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  themeToggle.setAttribute('title', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  themeToggle.querySelector('.theme-symbol').textContent = theme === 'dark' ? '☀' : '☾';
  if (persist) {
    try {
      localStorage.setItem('portfolio-theme', theme);
    } catch (error) {
      // The toggle still works when browser storage is unavailable.
    }
  }
}

setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light', false);
themeToggle.addEventListener('click', function () {
  setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark', true);
});

function matches(card, category) {
  if (category === 'featured') return card.hasAttribute('data-featured');
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
  moreWork.hidden = category !== 'featured' || visibleCount === cards.length;
  if (category === 'featured') {
    filterStatus.textContent = 'Showing ' + visibleCount + ' featured projects. Explore all ' + cards.length + ' using the filters.';
  } else if (category === 'all') {
    filterStatus.textContent = 'Showing all ' + visibleCount + ' projects.';
  } else {
    filterStatus.textContent = 'Showing ' + visibleCount + ' of ' + cards.length + ' projects: ' + button.dataset.label + '.';
  }
}

buttons.forEach(function (button) {
  button.dataset.label = button.firstChild.textContent.trim();
  var count = cards.filter(function (card) { return matches(card, button.dataset.filter); }).length;
  button.querySelector('i').textContent = count;
  button.setAttribute('aria-label', button.dataset.label + ', ' + count + ' projects');
  button.setAttribute('aria-controls', 'projects');
  button.addEventListener('click', function () { filterProjects(button); });
});

showAllProjects.addEventListener('click', function () {
  filterProjects(document.querySelector('[data-filter="all"]'));
  var nextProject = cards.find(function (card) { return !card.hasAttribute('data-featured'); });
  if (nextProject) {
    nextProject.scrollIntoView({ block: 'start' });
    nextProject.querySelector('summary').focus({ preventScroll: true });
  }
});

// All content remains readable if JavaScript is unavailable or fails to load.
filterProjects(buttons[0]);
document.querySelector('.filters').hidden = false;
