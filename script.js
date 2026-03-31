import { firebaseConfig, homepageDocPath } from './firebase-config.js';

const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const year = document.getElementById('year');
const storedTheme = localStorage.getItem('theme');
const firebaseStatus = document.getElementById('firebaseStatus');
const heroTitle = document.getElementById('heroTitle');
const heroText = document.getElementById('heroText');

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

const applyHomepageContent = (data) => {
  if (typeof data?.heroTitle === 'string' && heroTitle) {
    heroTitle.textContent = data.heroTitle;
  }

  if (typeof data?.heroText === 'string' && heroText) {
    heroText.textContent = data.heroText;
  }
};

const startFirebase = async () => {
  if (!firebaseStatus) {
    return;
  }

  if (!hasFirebaseConfig(firebaseConfig)) {
    setFirebaseStatus('Firebase not configured yet', 'idle');
    return;
  }

  setFirebaseStatus('Connecting to Firebase…', 'loading');

  try {
    const [{ initializeApp }, { getFirestore, doc, onSnapshot }] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js'),
    ]);

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
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
