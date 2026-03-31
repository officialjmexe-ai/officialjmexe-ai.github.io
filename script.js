import { doc, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
import { db, firebaseConfig, homepageDocPath } from './firebase-config.js';

const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const year = document.getElementById('year');
const storedTheme = localStorage.getItem('theme');
const firebaseStatus = document.getElementById('firebaseStatus');
const textTargets = document.querySelectorAll('[data-firestore-text]');
const hrefTargets = document.querySelectorAll('[data-firestore-href]');
const listTargets = document.querySelectorAll('[data-firestore-list]');

const setFirebaseStatus = (message, state = 'idle') => {
  if (!firebaseStatus) {
    return;
  }

  firebaseStatus.textContent = message;
  firebaseStatus.dataset.state = state;
};

const hasFirebaseConfig = (config) => {
  const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId'];
  return requiredKeys.every((key) => typeof config?.[key] === 'string' && config[key].trim() !== '');
};

if (storedTheme === 'light') {
  document.body.classList.add('light');
  if (themeIcon) {
    themeIcon.textContent = '☀️';
  }
}

if (year) {
  year.textContent = new Date().getFullYear();
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');

    if (themeIcon) {
      themeIcon.textContent = isLight ? '☀️' : '🌙';
    }

    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.reveal').forEach((section) => observer.observe(section));
} else {
  document.querySelectorAll('.reveal').forEach((section) => section.classList.add('visible'));
}

const isSafeUrl = (value) => {
  if (typeof value !== 'string') {
    return false;
  }

  return /^(https?:|mailto:|tel:|#|\/)/i.test(value.trim());
};

const renderList = (element, items) => {
  if (!element || !Array.isArray(items)) {
    return;
  }

  const normalizedItems = items.filter((item) => typeof item === 'string' && item.trim() !== '');

  if (!normalizedItems.length) {
    return;
  }

  element.innerHTML = '';
  normalizedItems.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    element.appendChild(li);
  });
};

const applyHomepageContent = (data = {}) => {
  textTargets.forEach((element) => {
    const key = element.dataset.firestoreText;
    if (typeof data[key] === 'string' && data[key].trim() !== '') {
      element.textContent = data[key];
    }
  });

  hrefTargets.forEach((element) => {
    const key = element.dataset.firestoreHref;
    if (isSafeUrl(data[key])) {
      element.setAttribute('href', data[key]);
    }
  });

  listTargets.forEach((element) => {
    const key = element.dataset.firestoreList;
    renderList(element, data[key]);
  });
};

const startFirebase = () => {
  if (!firebaseStatus) {
    return;
  }

  if (!hasFirebaseConfig(firebaseConfig) || !db) {
    setFirebaseStatus('Firebase not configured yet', 'idle');
    return;
  }

  setFirebaseStatus('Connecting to Firebase…', 'loading');

  try {
    const homepageRef = doc(db, homepageDocPath.collection, homepageDocPath.document);

    onSnapshot(
      homepageRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setFirebaseStatus('Connected — add Firestore content next', 'warning');
          return;
        }

        applyHomepageContent(snapshot.data());
        setFirebaseStatus('Live updates connected', 'success');
      },
      (error) => {
        console.error('Firebase listener error:', error);
        setFirebaseStatus('Firebase permission or network error', 'error');
      }
    );
  } catch (error) {
    console.error('Firebase setup failed:', error);
    setFirebaseStatus('Could not load Firebase SDK', 'error');
  }
};

startFirebase();
